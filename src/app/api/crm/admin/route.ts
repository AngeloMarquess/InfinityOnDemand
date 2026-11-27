import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getPasswordResetEmailHtml } from '@/lib/emails/templates';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-key, X-Admin-Key',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qarfhdbtaonjuuczwmwf.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcmZoZGJ0YW9uanV1Y3p3bXdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkxOTg0NiwiZXhwIjoyMDg5NDk1ODQ2fQ.YPwy-nhcAcvErpQBeGLUuAGG1IGjsxUbIMi3kiipDvk';
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

const ADMIN_EMAILS = [
  'angelo.marques@infinityondemand.com.br',
  'contato@infinityondemand.com.br',
];

async function verifyAdminAuth(request: Request): Promise<{ authorized: boolean; error?: string }> {
  // 1. Verificar Authorization Bearer Token ou x-admin-key
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const adminKeyHeader = request.headers.get('x-admin-key') || '';

  // 2. Chave de serviço interna via env para background jobs/crons
  const { searchParams } = new URL(request.url);
  const queryKey = searchParams.get('key');
  const serverSecret = process.env.ADMIN_API_SECRET || process.env.FLASH_API_SECRET || '8Gcg3Wk1n07jemaf95IvqADuhOHLoty4UlFCdPVQYzixsNT2';

  if (serverSecret && (queryKey === serverSecret || token === serverSecret || adminKeyHeader === serverSecret)) {
    return { authorized: true };
  }

  if (!token) {
    return { authorized: false, error: 'Autenticação necessária. Forneça o token de acesso.' };
  }

  // 3. Validar token com o Supabase Auth
  try {
    const supabase = getServiceSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user || !user.email) {
      return { authorized: false, error: 'Sessão inválida ou expirada.' };
    }

    const email = user.email.toLowerCase().trim();
    const envAdmins = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) : [];
    const isMaster = ADMIN_EMAILS.includes(email) || envAdmins.includes(email) || user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin';

    if (!isMaster) {
      return { authorized: false, error: 'Acesso restrito a administradores.' };
    }

    return { authorized: true };
  } catch (err: any) {
    return { authorized: false, error: 'Erro ao validar autorização: ' + (err?.message || err) };
  }
}

// GET /api/crm/admin — list all CRM clients with full stats, payments and usage, or sync single client with Pagar.me
export async function GET(request: Request) {
  const auth = await verifyAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  // Ação especial: Sincronizar assinatura diretamente na API Pagar.me V5
  if (action === 'sync_pagarme') {
    const email = searchParams.get('email')?.toLowerCase().trim();
    const userId = searchParams.get('user_id');

    if (!email && !userId) {
      return NextResponse.json({ error: 'email ou user_id é obrigatório para sincronização.' }, { status: 400, headers: corsHeaders });
    }

    try {
      const pagarmeKey = process.env.PAGARME_SECRET_KEY || 'sk_3c941fe239c24a04b70eeed3b9bfdc20';
      const pagarmeAuth = 'Basic ' + Buffer.from(`${pagarmeKey}:`).toString('base64');

      const pagarmeRes = await fetch('https://api.pagar.me/core/v5/orders?page=1&size=50', {
        headers: {
          Authorization: pagarmeAuth,
          'Content-Type': 'application/json',
        },
      });

      if (!pagarmeRes.ok) {
        throw new Error(`Erro API Pagar.me: ${pagarmeRes.statusText}`);
      }

      const pagarmeData = await pagarmeRes.json();
      const orders = pagarmeData?.data || [];

      // Procura pedido pago correspondente ao email ou userId
      const paidOrder = orders.find((o: any) => {
        const isPaid = o.status === 'paid';
        const matchesEmail = email && o.customer?.email?.toLowerCase().trim() === email;
        const matchesUserId = userId && o.metadata?.user_id === userId;
        return isPaid && (matchesEmail || matchesUserId);
      });

      if (paidOrder) {
        const supabase = getServiceSupabase();
        const metadata = paidOrder.metadata || {};
        const targetUserId = userId || metadata.user_id;

        if (targetUserId) {
          const rawPlan = metadata.plan_id || 'pro';
          const planId = rawPlan === 'intermediario' ? 'pro' : rawPlan === 'enterprise' ? 'advanced' : rawPlan;
          const isAnnual = metadata.billing_cycle === 'annual' || Number(paidOrder.amount) > 20000;
          const durationDays = isAnnual ? 365 : 30;
          const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

          // Atualiza perfil no Supabase
          await supabase.from('crm_profiles').update({
            plan_id: planId,
            subscription_status: 'active',
            subscription_expires_at: expiresAt,
            updated_at: new Date().toISOString(),
          }).eq('id', targetUserId);

          // Registra no histórico
          await supabase.from('crm_subscription_history').insert({
            user_id: targetUserId,
            plan_id: planId,
            event_type: 'payment_received',
            amount: paidOrder.amount,
          });

          return NextResponse.json({
            success: true,
            paid: true,
            status: 'active',
            order_id: paidOrder.id,
            amount: paidOrder.amount,
            plan_id: planId,
            message: `Pagamento de R$ ${(paidOrder.amount / 100).toFixed(2)} confirmado no Pagar.me! Assinatura ativada com sucesso.`,
          }, { headers: corsHeaders });
        }
      }

      return NextResponse.json({
        success: false,
        paid: false,
        message: `Nenhuma cobrança aprovada recente encontrada para ${email || userId} no Pagar.me.`,
      }, { headers: corsHeaders });
    } catch (err: any) {
      console.error('[Sync Pagar.me Error]:', err);
      return NextResponse.json({ error: 'Erro ao consultar Pagar.me', details: err?.message }, { status: 500, headers: corsHeaders });
    }
  }

  try {
    const supabase = getServiceSupabase();

    // Get all CRM profiles with plan info
    const { data: profiles, error } = await supabase
      .from('crm_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching crm_profiles:', error);
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }

    // Get plans
    const { data: plans } = await supabase.from('crm_plans').select('*');

    // Get auth metadata for company & phone
    const { data: authData } = await supabase.auth.admin.listUsers();
    const authMap = new Map((authData?.users || []).map(u => [u.id, u]));

    // Get subscription history for all users
    const { data: subHistory } = await supabase
      .from('crm_subscription_history')
      .select('*')
      .order('created_at', { ascending: false });

    const now = new Date();

    // Get usage counts for each user
    const clientsWithStats = await Promise.all(
      (profiles || []).map(async (profile) => {
        const [leads, proposals, tasks] = await Promise.all([
          supabase.from('crm_contacts').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
          supabase.from('crm_proposals').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
          supabase.from('crm_tasks').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
        ]);

        const plan = plans?.find(p => p.id === profile.plan_id);
        const authUser = authMap.get(profile.id);

        const company = authUser?.user_metadata?.company || authUser?.user_metadata?.company_name || 'Empresa / Workspace';
        const phone = authUser?.user_metadata?.phone || authUser?.phone || '';

        // Check overdue status
        const isParceria = profile.plan_id === 'parceria' || profile.plan_id === 'partner';
        const isFundador = profile.plan_id === 'fundador' || profile.plan_id === 'founder' || profile.plan_id === 'membro_fundador';
        const expiresAt = profile.subscription_expires_at ? new Date(profile.subscription_expires_at) : null;
        let computedStatus = (isParceria || isFundador) ? 'active' : (profile.subscription_status || 'free');
        let isOverdue = false;
        let daysOverdue = 0;

        if (!isParceria && !isFundador && computedStatus === 'active' && expiresAt && expiresAt < now) {
          computedStatus = 'past_due';
          isOverdue = true;
          daysOverdue = Math.floor((now.getTime() - expiresAt.getTime()) / (1000 * 60 * 60 * 24));
        } else if (!isParceria && !isFundador && computedStatus === 'past_due') {
          isOverdue = true;
          if (expiresAt) {
            daysOverdue = Math.max(1, Math.floor((now.getTime() - expiresAt.getTime()) / (1000 * 60 * 60 * 24)));
          }
        }

        // Calculate total revenue generated by this client
        const clientHistory = (subHistory || []).filter(h => h.user_id === profile.id);
        const totalPaid = clientHistory
          .filter(h => h.event_type === 'activated' || h.event_type === 'renewed' || h.event_type === 'payment_received')
          .reduce((sum, h) => {
            const rawAmount = Number(h.amount) || 0;
            // Se o valor estiver em centavos (> 500, ex: 5990 centavos = R$ 59,90), converte para reais
            const valInReais = rawAmount > 500 ? rawAmount / 100 : rawAmount;
            return sum + (valInReais > 0 ? valInReais : (plan?.price_monthly ? plan.price_monthly / 100 : 0));
          }, 0);

        const currentPlanPrice = (isParceria || isFundador)
          ? 0
          : plan?.price_monthly
          ? plan.price_monthly / 100
          : (profile.plan_id === 'starter' ? 39.90 : profile.plan_id === 'pro' ? 59.90 : profile.plan_id === 'advanced' ? 99.90 : 0);

        return {
          ...profile,
          company,
          phone,
          plan_name: isFundador
            ? '🏛️ Membro Fundador'
            : isParceria
            ? '⭐ Parceria (VIP)'
            : plan?.name || (profile.plan_id === 'starter' ? 'Básico' : profile.plan_id === 'pro' ? 'Intermediário' : profile.plan_id === 'advanced' ? 'Avançado' : 'Free'),
          plan_price: currentPlanPrice,
          subscription_status: computedStatus,
          is_overdue: isOverdue,
          days_overdue: daysOverdue,
          total_revenue: totalPaid > 0 ? totalPaid : (computedStatus === 'active' ? currentPlanPrice : 0),
          usage: {
            leads: leads.count || 0,
            proposals: proposals.count || 0,
            tasks: tasks.count || 0,
          },
          last_activity: profile.updated_at || profile.created_at,
          last_sign_in_at: authUser?.last_sign_in_at || null,
        };
      })
    );

    // Calculate summary KPIs
    const totalClients = clientsWithStats.length;
    const activeClients = clientsWithStats.filter(c => c.subscription_status === 'active');
    const activeCount = activeClients.length;
    const overdueClients = clientsWithStats.filter(c => c.is_overdue || c.subscription_status === 'past_due');
    const blockedClients = clientsWithStats.filter(c => c.subscription_status === 'blocked');

    // MRR (Monthly Recurring Revenue)
    const mrr = activeClients.reduce((sum, c) => sum + (c.plan_price || 0), 0);
    const overdueAmount = overdueClients.reduce((sum, c) => sum + (c.plan_price || 0), 0);
    const avgTicket = activeCount > 0 ? mrr / activeCount : 0;

    // Monthly revenue simulation for last 6 months
    const monthNames = ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonthIdx = now.getMonth();
    const monthlyHistory = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), currentMonthIdx - i, 1);
      const mName = d.toLocaleDateString('pt-BR', { month: 'short' });
      // Factor based on active subscribers
      const factor = i === 0 ? 1 : Math.max(0.4, 1 - (i * 0.12));
      const val = Math.round(mrr * factor);
      monthlyHistory.push({
        month: mName.charAt(0).toUpperCase() + mName.slice(1),
        revenue: val > 0 ? val : (i === 0 ? mrr : 1500),
        active: Math.max(1, Math.round(activeCount * factor)),
      });
    }

    return NextResponse.json({
      summary: {
        total_clients: totalClients,
        active_subscriptions: activeCount,
        overdue_count: overdueClients.length,
        overdue_amount: overdueAmount,
        blocked_count: blockedClients.length,
        mrr: mrr,
        mrr_formatted: `R$ ${mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        arr: mrr * 12,
        arr_formatted: `R$ ${(mrr * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        average_ticket: avgTicket,
        average_ticket_formatted: `R$ ${avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      },
      monthly_history: monthlyHistory,
      plans: plans || [],
      clients: clientsWithStats,
    }, { headers: corsHeaders });
  } catch (err: any) {
    console.error('Admin API error:', err);
    return NextResponse.json({ error: 'Erro interno do servidor', details: err?.message }, { status: 500, headers: corsHeaders });
  }
}

// POST /api/crm/admin — actions: create_client, update_password, update_profile, change_plan, block, unblock, record_payment, delete_user
export async function POST(request: Request) {
  const auth = await verifyAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { action, user_id } = body;
    const supabase = getServiceSupabase();

    // 1. Cadastrar Novo Assinante do SaaS
    if (action === 'create_client') {
      const { email, password, full_name, company, phone, plan_id } = body;

      if (!email || !password || !full_name) {
        return NextResponse.json({ error: 'E-mail, senha e nome completo são obrigatórios.' }, { status: 400, headers: corsHeaders });
      }

      // Criação no Supabase Auth com confirmação direta de e-mail
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name,
          company: company || full_name,
          phone: phone || '',
        },
      });

      if (authError) {
        return NextResponse.json({ error: `Erro no Auth: ${authError.message}` }, { status: 400, headers: corsHeaders });
      }

      const newUserId = authUser.user.id;
      const initialPlan = plan_id || 'starter';

      // Cria perfil em crm_profiles
      await supabase.from('crm_profiles').upsert({
        id: newUserId,
        email,
        full_name,
        plan_id: initialPlan,
        subscription_status: initialPlan === 'free' ? 'free' : 'active',
        subscription_expires_at: initialPlan === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

      // Histórico de ativação
      await supabase.from('crm_subscription_history').insert({
        user_id: newUserId,
        plan_id: initialPlan,
        event_type: 'activated',
        amount: initialPlan === 'starter' ? 5990 : initialPlan === 'pro' ? 9990 : 0,
      });

      return NextResponse.json({
        success: true,
        message: 'Cliente assinante cadastrado com sucesso!',
        user_id: newUserId,
      }, { headers: corsHeaders });
    }

    // Para todas as outras ações, user_id é obrigatório
    if (!user_id) {
      return NextResponse.json({ error: 'user_id é obrigatório.' }, { status: 400, headers: corsHeaders });
    }

    // 2. Resetar / Atualizar Senha do Assinante e Enviar por E-mail
    if (action === 'update_password' || action === 'send_password_email') {
      const { new_password, send_email } = body;
      
      if (action === 'update_password') {
        if (!new_password || new_password.length < 6) {
          return NextResponse.json({ error: 'A nova senha deve ter no mínimo 6 caracteres.' }, { status: 400, headers: corsHeaders });
        }

        const { error: pwdErr } = await supabase.auth.admin.updateUserById(user_id, {
          password: new_password,
        });

        if (pwdErr) {
          return NextResponse.json({ error: `Erro ao resetar senha: ${pwdErr.message}` }, { status: 400, headers: corsHeaders });
        }
      }

      // Envio de email com as credenciais via Resend
      let emailSent = false;
      let emailError: string | null = null;
      if (send_email || action === 'send_password_email') {
        try {
          const { data: targetUser } = await supabase.auth.admin.getUserById(user_id);
          const targetEmail = body.email || targetUser?.user?.email;
          const targetName = body.full_name || targetUser?.user?.user_metadata?.full_name || 'Assinante';
          const pwdToSend = new_password || body.password || '';

          if (targetEmail && pwdToSend) {
            const resendApiKey = process.env.RESEND_API_KEY;
            const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'angelo.marques@infinityondemand.com.br';

            if (resendApiKey) {
              const resendRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${resendApiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  from: `Infinity On Demand <${resendFromEmail}>`,
                  to: [targetEmail],
                  subject: 'Seus Novos Dados de Acesso ao CRM Infinity On Demand 🔑',
                  html: getPasswordResetEmailHtml(targetName, targetEmail, pwdToSend),
                }),
              });

              if (resendRes.ok) {
                emailSent = true;
              } else {
                const errData = await resendRes.json();
                console.error('Erro Resend:', errData);
                emailError = errData?.message || 'Falha no envio do e-mail';
              }
            } else {
              emailError = 'Chave Resend não configurada';
            }
          }
        } catch (err: any) {
          console.error('Erro ao enviar email de nova senha:', err);
          emailError = err?.message || 'Erro inesperado no envio de e-mail';
        }
      }

      return NextResponse.json({
        success: true,
        message: emailSent
          ? 'Senha atualizada e enviada para o e-mail do cliente com sucesso!'
          : 'Senha atualizada com sucesso!',
        email_sent: emailSent,
        email_error: emailError
      }, { headers: corsHeaders });
    }

    // 3. Atualizar Dados Cadastrais do Assinante (Nome, Empresa, Telefone, Vencimento)
    if (action === 'update_profile') {
      const { full_name, company, phone, email, subscription_expires_at, plan_id, subscription_status } = body;

      const profileUpdate: any = {};
      if (full_name !== undefined) profileUpdate.full_name = full_name;
      if (plan_id !== undefined) profileUpdate.plan_id = plan_id;
      if (subscription_status !== undefined) profileUpdate.subscription_status = subscription_status;
      if (subscription_expires_at !== undefined) profileUpdate.subscription_expires_at = subscription_expires_at;

      await supabase.from('crm_profiles').update(profileUpdate).eq('id', user_id);

      // Atualiza metadados no Supabase Auth
      const authUpdate: any = {
        user_metadata: {
          full_name,
          company,
          phone,
        },
      };
      if (email) authUpdate.email = email;

      await supabase.auth.admin.updateUserById(user_id, authUpdate);

      return NextResponse.json({ success: true, message: 'Dados cadastrais atualizados com sucesso!' }, { headers: corsHeaders });
    }

    // 4. Registrar Pagamento / Quitar Inadimplência
    if (action === 'record_payment') {
      const { amount, payment_method, notes } = body;
      const amountCents = amount ? Math.round(Number(amount) * 100) : 5990;

      await supabase.from('crm_subscription_history').insert({
        user_id,
        plan_id: body.plan_id || 'starter',
        event_type: 'payment_received',
        amount: amountCents,
      });

      // Reativa e renova por 30 dias a partir de hoje
      const nextExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await supabase.from('crm_profiles').update({
        subscription_status: 'active',
        subscription_expires_at: nextExpiresAt,
      }).eq('id', user_id);

      return NextResponse.json({
        success: true,
        message: 'Pagamento registrado com sucesso! Conta renovada por 30 dias.',
        expires_at: nextExpiresAt,
      }, { headers: corsHeaders });
    }

    // 5. Mudar Plano
    if (action === 'change_plan' && body.plan_id) {
      const targetPlan = body.plan_id;
      const isParceria = targetPlan === 'parceria' || targetPlan === 'partner';
      const isFundador = targetPlan === 'fundador' || targetPlan === 'founder' || targetPlan === 'membro_fundador';
      const isWhiteLabel = targetPlan === 'whitelabel' || targetPlan === 'revenda';
      await supabase
        .from('crm_profiles')
        .update({
          plan_id: targetPlan,
          is_reseller: isWhiteLabel ? true : undefined,
          subscription_status: targetPlan === 'free' ? 'free' : 'active',
          subscription_expires_at: (targetPlan === 'free' || isParceria || isFundador || isWhiteLabel) ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', user_id);

      await supabase.from('crm_subscription_history').insert({
        user_id,
        plan_id: targetPlan,
        event_type: isFundador ? 'founder_assigned' : isParceria ? 'partner_assigned' : targetPlan === 'free' ? 'downgraded' : 'upgraded',
        amount: 0,
      });

      return NextResponse.json({
        success: true,
        message: isFundador
          ? 'Cliente definido como Membro Fundador com acesso total liberado!'
          : isParceria
          ? 'Cliente definido como Parceiro da Agência com acesso total liberado!'
          : `Plano atualizado para ${targetPlan}`
      }, { headers: corsHeaders });
    }

    // 6. Cancelar Assinatura
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

      return NextResponse.json({ success: true, message: 'Assinatura cancelada' }, { headers: corsHeaders });
    }

    // 7. Bloquear Acesso por Inadimplência (Corte de Sinal)
    if (action === 'block') {
      await supabase
        .from('crm_profiles')
        .update({
          subscription_status: 'blocked',
        })
        .eq('id', user_id);

      await supabase.from('crm_subscription_history').insert({
        user_id,
        plan_id: 'free',
        event_type: 'blocked',
      });

      return NextResponse.json({ success: true, message: 'Conta bloqueada por falta de pagamento' }, { headers: corsHeaders });
    }

    // 8. Desbloquear Acesso
    if (action === 'unblock') {
      const currentPlanId = body.plan_id || 'starter';
      await supabase
        .from('crm_profiles')
        .update({
          plan_id: currentPlanId,
          subscription_status: currentPlanId === 'free' ? 'free' : 'active',
          subscription_expires_at: currentPlanId === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', user_id);

      await supabase.from('crm_subscription_history').insert({
        user_id,
        plan_id: currentPlanId,
        event_type: 'unblocked',
      });

      return NextResponse.json({ success: true, message: 'Acesso desbloqueado com sucesso!' }, { headers: corsHeaders });
    }

    // 9. Arquivar Cliente Inativo
    if (action === 'archive') {
      await supabase
        .from('crm_profiles')
        .update({
          subscription_status: 'archived',
        })
        .eq('id', user_id);

      return NextResponse.json({ success: true, message: 'Cliente arquivado com sucesso!' }, { headers: corsHeaders });
    }

    // 10. Desarquivar Cliente
    if (action === 'unarchive') {
      const targetPlan = body.plan_id || 'free';
      await supabase
        .from('crm_profiles')
        .update({
          subscription_status: targetPlan === 'free' ? 'free' : 'active',
        })
        .eq('id', user_id);

      return NextResponse.json({ success: true, message: 'Cliente desarquivado e restaurado com sucesso!' }, { headers: corsHeaders });
    }

    // 11. Excluir Usuário Completo
    if (action === 'delete_user') {
      // Deleta de tabelas do CRM
      await supabase.from('crm_subscription_history').delete().eq('user_id', user_id);
      await supabase.from('crm_tasks').delete().eq('user_id', user_id);
      await supabase.from('crm_financial_records').delete().eq('user_id', user_id);
      await supabase.from('crm_calendar_events').delete().eq('user_id', user_id);
      await supabase.from('crm_briefings').delete().eq('user_id', user_id);
      await supabase.from('crm_proposals').delete().eq('user_id', user_id);
      await supabase.from('crm_contacts').delete().eq('user_id', user_id);
      await supabase.from('crm_services').delete().eq('user_id', user_id);
      await supabase.from('crm_service_categories').delete().eq('user_id', user_id);
      await supabase.from('crm_stages').delete().eq('user_id', user_id);
      await supabase.from('crm_profiles').delete().eq('id', user_id);

      // Deleta do Supabase Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(user_id);
      if (authError) {
        return NextResponse.json({ error: `Erro ao excluir do auth: ${authError.message}` }, { status: 500, headers: corsHeaders });
      }

      return NextResponse.json({ success: true, message: 'Assinante excluído completamente' }, { headers: corsHeaders });
    }

    return NextResponse.json({ error: 'Ação inválida.' }, { status: 400, headers: corsHeaders });
  } catch (err: any) {
    console.error('Admin POST API error:', err);
    return NextResponse.json({ error: 'Erro ao processar requisição', details: err?.message }, { status: 500, headers: corsHeaders });
  }
}
