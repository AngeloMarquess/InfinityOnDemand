import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
};

function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qarfhdbtaonjuuczwmwf.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET /api/crm/whitelabel/subaccounts — Lista todas as subcontas do revendedor autenticado
export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    return NextResponse.json({ error: 'Token de autenticação obrigatório' }, { status: 401, headers: corsHeaders });
  }

  const supabase = getServiceSupabase();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: 'Sessão inválida ou expirada' }, { status: 401, headers: corsHeaders });
  }

  const resellerId = user.id;

  try {
    // 1. Busca perfis de usuários com parent_reseller_id do revendedor
    const { data: profiles, error: profErr } = await supabase
      .from('crm_profiles')
      .select('id, full_name, email, created_at, subscription_status, plan_id')
      .eq('parent_reseller_id', resellerId);

    // 2. Busca organizações cadastradas
    const { data: orgs } = await supabase
      .from('organizations')
      .select('*')
      .eq('owner_id', resellerId);

    const subaccounts: any[] = [];

    if (orgs && orgs.length > 0) {
      orgs.forEach((o: any) => {
        subaccounts.push({
          id: o.id,
          name: o.name,
          slug: o.slug,
          created_at: o.created_at,
          is_organization: true,
        });
      });
    }

    if (profiles && profiles.length > 0) {
      profiles.forEach((p: any) => {
        subaccounts.push({
          id: p.id,
          name: p.full_name || p.email,
          email: p.email,
          created_at: p.created_at,
          plan_id: p.plan_id,
          status: p.subscription_status || 'active',
          is_user: true,
        });
      });
    }

    return NextResponse.json({
      success: true,
      subaccounts,
      count: subaccounts.length,
    }, { headers: corsHeaders });
  } catch (err: any) {
    console.error('Erro ao listar subcontas do revendedor:', err);
    return NextResponse.json({ error: 'Erro ao listar subcontas', details: err?.message }, { status: 500, headers: corsHeaders });
  }
}

// POST /api/crm/whitelabel/subaccounts — Criação de subconta direta pelo revendedor
export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    return NextResponse.json({ error: 'Token de autenticação obrigatório' }, { status: 401, headers: corsHeaders });
  }

  const supabase = getServiceSupabase();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: 'Sessão inválida ou expirada' }, { status: 401, headers: corsHeaders });
  }

  const resellerId = user.id;

  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name) {
      return NextResponse.json({ error: 'Nome da subconta é obrigatório' }, { status: 400, headers: corsHeaders });
    }

    // Se forneceu email e senha, cria o usuário Auth vinculado à revenda
    if (email && password) {
      const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: name,
          parent_reseller_id: resellerId,
        },
      });

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 400, headers: corsHeaders });
      }

      if (authUser?.user?.id) {
        await supabase
          .from('crm_profiles')
          .upsert({
            id: authUser.user.id,
            email,
            full_name: name,
            parent_reseller_id: resellerId,
            plan_id: 'starter',
            subscription_status: 'active',
          }, { onConflict: 'id' });
      }

      return NextResponse.json({
        success: true,
        message: `Subconta ${name} criada com sucesso para ${email}!`,
        subaccount: { id: authUser.user.id, name, email },
      }, { headers: corsHeaders });
    }

    // Caso seja apenas registro corporativo/empresa
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name,
        slug: `${slug}-${Math.random().toString(36).substring(2, 6)}`,
        owner_id: resellerId,
        parent_reseller_id: resellerId,
      })
      .select()
      .single();

    if (orgError) {
      return NextResponse.json({ error: orgError.message }, { status: 400, headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      message: `Empresa/Subconta ${name} criada com sucesso!`,
      subaccount: org,
    }, { headers: corsHeaders });
  } catch (err: any) {
    console.error('Erro ao criar subconta:', err);
    return NextResponse.json({ error: 'Erro ao criar subconta', details: err?.message }, { status: 500, headers: corsHeaders });
  }
}
