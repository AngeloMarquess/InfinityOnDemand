import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const event = await request.json();
    const eventType = event?.type;
    const data = event?.data;

    console.log(`[Pagar.me Webhook] Evento recebido: ${eventType}`);

    const supabase = getServiceSupabase();

    // 1. Pedido ou Fatura Paga (PIX, Boleto ou Renovação de Cartão)
    if (eventType === 'order.paid' || eventType === 'invoice.paid' || eventType === 'charge.paid') {
      const metadata = data?.metadata || data?.order?.metadata || data?.subscription?.metadata || {};
      const userId = metadata?.user_id;
      const planId = metadata?.plan_id || 'starter';
      const amount = data?.amount || data?.order?.amount || 5990;

      if (userId) {
        const nextMonthIso = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        // Ativa ou renova por 30 dias
        await supabase
          .from('crm_profiles')
          .update({
            plan_id: planId === 'intermediario' ? 'pro' : planId === 'enterprise' ? 'advanced' : planId,
            subscription_status: 'active',
            subscription_expires_at: nextMonthIso,
          })
          .eq('id', userId);

        // Registra histórico financeiro
        await supabase.from('crm_subscription_history').insert({
          user_id: userId,
          plan_id: planId,
          event_type: eventType === 'invoice.paid' ? 'renewed' : 'payment_received',
          amount: amount,
        });

        console.log(`[Pagar.me Webhook] Assinatura renovada para user_id: ${userId}`);
      }
    }

    // 2. Assinatura Cancelada
    if (eventType === 'subscription.canceled') {
      const userId = data?.metadata?.user_id;
      if (userId) {
        await supabase
          .from('crm_profiles')
          .update({
            subscription_status: 'canceled',
          })
          .eq('id', userId);

        await supabase.from('crm_subscription_history').insert({
          user_id: userId,
          plan_id: data?.metadata?.plan_id || 'starter',
          event_type: 'canceled',
          amount: 0,
        });
      }
    }

    // 3. Pagamento Falhou / Inadimplência
    if (eventType === 'invoice.payment_failed') {
      const userId = data?.metadata?.user_id;
      if (userId) {
        await supabase
          .from('crm_profiles')
          .update({
            subscription_status: 'past_due',
          })
          .eq('id', userId);
      }
    }

    return NextResponse.json({ received: true }, { headers: corsHeaders });
  } catch (err: any) {
    console.error('[Pagar.me Webhook Error]:', err);
    return NextResponse.json({ error: 'Webhook processing error', details: err?.message }, { status: 500, headers: corsHeaders });
  }
}
