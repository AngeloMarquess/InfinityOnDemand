import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

// GET /api/crm/admin/clients — list all CRM clients with stats
export async function GET(request: Request) {
  // Simple admin auth check via query param (in production, use proper auth)
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get('key');

  if (adminKey !== process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-10)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServiceSupabase();

  // Get all CRM profiles with plan info
  const { data: profiles, error } = await supabase
    .from('crm_profiles')
    .select('id, email, full_name, plan_id, subscription_status, subscription_expires_at, stripe_customer_id, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get plans
  const { data: plans } = await supabase.from('crm_plans').select('*');

  // Get usage counts for each user
  const clientsWithStats = await Promise.all(
    (profiles || []).map(async (profile) => {
      const [leads, proposals, tasks] = await Promise.all([
        supabase.from('crm_contacts').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
        supabase.from('crm_proposals').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
        supabase.from('crm_tasks').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
      ]);

      const plan = plans?.find(p => p.id === profile.plan_id);

      return {
        ...profile,
        plan_name: plan?.name || 'Free',
        plan_price: plan?.price_monthly || 0,
        usage: {
          leads: leads.count || 0,
          proposals: proposals.count || 0,
          tasks: tasks.count || 0,
        },
      };
    })
  );

  // Calculate summary stats
  const totalClients = clientsWithStats.length;
  const activeSubscriptions = clientsWithStats.filter(c => c.subscription_status === 'active').length;
  const mrr = clientsWithStats
    .filter(c => c.subscription_status === 'active')
    .reduce((sum, c) => sum + (c.plan_price || 0), 0);

  return NextResponse.json({
    summary: {
      total_clients: totalClients,
      active_subscriptions: activeSubscriptions,
      mrr: mrr, // in cents
      mrr_formatted: `R$ ${(mrr / 100).toFixed(2)}`,
    },
    plans: plans || [],
    clients: clientsWithStats,
  });
}

// POST /api/crm/admin/clients — update a client's plan manually
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get('key');

  if (adminKey !== process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-10)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { user_id, plan_id, action } = await request.json();

  if (!user_id) {
    return NextResponse.json({ error: 'user_id é obrigatório.' }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  if (action === 'change_plan' && plan_id) {
    await supabase
      .from('crm_profiles')
      .update({
        plan_id,
        subscription_status: plan_id === 'free' ? 'free' : 'active',
        subscription_expires_at: plan_id === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('id', user_id);

    await supabase.from('crm_subscription_history').insert({
      user_id,
      plan_id,
      event_type: plan_id === 'free' ? 'downgraded' : 'upgraded',
      amount: 0,
    });

    return NextResponse.json({ success: true, message: `Plano atualizado para ${plan_id}` });
  }

  if (action === 'cancel') {
    await supabase
      .from('crm_profiles')
      .update({
        plan_id: 'free',
        subscription_status: 'cancelled',
        stripe_subscription_id: null,
      })
      .eq('id', user_id);

    await supabase.from('crm_subscription_history').insert({
      user_id,
      plan_id: 'free',
      event_type: 'cancelled',
    });

    return NextResponse.json({ success: true, message: 'Assinatura cancelada' });
  }

  return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 });
}
