import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const PAGARME_SECRET_KEY = process.env.PAGARME_SECRET_KEY || 'sk_3c941fe239c24a04b70eeed3b9bfdc20';
const PAGARME_AUTH = 'Basic ' + Buffer.from(`${PAGARME_SECRET_KEY}:`).toString('base64');

// Mapeamento dos 3 Planos no Pagar.me
const PAGARME_PLANS: Record<string, { id: string; name: string; priceCents: number }> = {
  starter: {
    id: process.env.PAGARME_PLAN_STARTER || 'plan_ROg5pEwCncXkW6E7',
    name: 'Básico',
    priceCents: 3990,
  },
  pro: {
    id: process.env.PAGARME_PLAN_PRO || 'plan_J6ZPW9ji3T0d7D9y',
    name: 'Intermediário',
    priceCents: 5990,
  },
  intermediario: {
    id: process.env.PAGARME_PLAN_PRO || 'plan_J6ZPW9ji3T0d7D9y',
    name: 'Intermediário',
    priceCents: 5990,
  },
  advanced: {
    id: process.env.PAGARME_PLAN_ADVANCED || 'plan_kwGVDL34uRc9dby9',
    name: 'Avançado',
    priceCents: 9990,
  },
  enterprise: {
    id: process.env.PAGARME_PLAN_ADVANCED || 'plan_kwGVDL34uRc9dby9',
    name: 'Avançado',
    priceCents: 9990,
  },
};

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

// GET /api/crm/checkout — Retorna dados dos planos disponíveis
export async function GET() {
  return NextResponse.json({
    success: true,
    gateway: 'Pagar.me (Stone)',
    plans: PAGARME_PLANS,
  }, { headers: corsHeaders });
}

// POST /api/crm/checkout — Cria Assinatura Recorrente ou Pedido PIX/Boleto no Pagar.me
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      plan_id,
      user_id,
      user_email,
      customer_name,
      customer_document,
      customer_phone,
      payment_method = 'credit_card', // credit_card | pix | boleto
      card, // { number, holder_name, exp_month, exp_year, cvv }
    } = body;

    if (!plan_id || !user_id) {
      return NextResponse.json({ error: 'plan_id e user_id são obrigatórios.' }, { status: 400, headers: corsHeaders });
    }

    const targetPlan = PAGARME_PLANS[plan_id.toLowerCase()] || PAGARME_PLANS['starter'];
    const supabase = getServiceSupabase();

    // Sanitização de dados do cliente
    const docClean = (customer_document || '11122233344').replace(/\D/g, '');
    const phoneClean = (customer_phone || '81997739263').replace(/\D/g, '');
    const areaCode = phoneClean.length >= 10 ? phoneClean.slice(0, 2) : '81';
    const phoneNumber = phoneClean.length >= 10 ? phoneClean.slice(2) : phoneClean;

    const customerPayload = {
      name: customer_name || user_email?.split('@')[0] || 'Cliente Infinity CRM',
      email: user_email,
      document: docClean,
      type: docClean.length > 11 ? 'company' : 'individual',
      phones: {
        mobile_phone: {
          country_code: '55',
          area_code: areaCode,
          number: phoneNumber,
        },
      },
    };

    // =========================================================================
    // 1. FORMA DE PAGAMENTO: CARTÃO DE CRÉDITO RECORRENTE (ASSINATURA PAGAR.ME)
    // =========================================================================
    if (payment_method === 'credit_card') {
      if (!card || !card.number || !card.cvv || !card.holder_name) {
        return NextResponse.json({ error: 'Dados do cartão de crédito são obrigatórios.' }, { status: 400, headers: corsHeaders });
      }

      const cardCleanNumber = card.number.replace(/\D/g, '');
      const expMonth = parseInt(String(card.exp_month).trim(), 10);
      let expYear = parseInt(String(card.exp_year).trim(), 10);
      if (expYear < 100) expYear += 2000;

      const subPayload = {
        plan_id: targetPlan.id,
        payment_method: 'credit_card',
        currency: 'BRL',
        interval: 'month',
        interval_count: 1,
        billing_type: 'prepaid',
        customer: customerPayload,
        card: {
          number: cardCleanNumber,
          holder_name: card.holder_name,
          exp_month: expMonth,
          exp_year: expYear,
          cvv: card.cvv.trim(),
        },
        metadata: {
          user_id,
          plan_id: plan_id.toLowerCase(),
          platform: 'CRM Infinity OnDemand',
        },
      };

      const pagarmeRes = await fetch('https://api.pagar.me/core/v5/subscriptions', {
        method: 'POST',
        headers: {
          Authorization: PAGARME_AUTH,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subPayload),
      });

      const pagarmeData = await pagarmeRes.json();

      if (!pagarmeRes.ok) {
        console.error('Erro Pagar.me Subscriptions:', pagarmeData);
        const errMsg = pagarmeData?.message || pagarmeData?.errors?.[Object.keys(pagarmeData.errors || {})[0]]?.[0] || 'Erro ao processar assinatura no cartão.';
        return NextResponse.json({ error: errMsg, details: pagarmeData }, { status: 400, headers: corsHeaders });
      }

      // Sucesso na criação da assinatura!
      const nextMonthIso = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      // Ativação imediata no perfil do CRM Supabase
      await supabase
        .from('crm_profiles')
        .update({
          plan_id: plan_id === 'intermediario' ? 'pro' : plan_id === 'enterprise' ? 'advanced' : plan_id,
          subscription_status: 'active',
          subscription_expires_at: nextMonthIso,
        })
        .eq('id', user_id);

      // Registro no histórico financeiro
      await supabase.from('crm_subscription_history').insert({
        user_id,
        plan_id: plan_id,
        event_type: 'activated',
        amount: targetPlan.priceCents,
      });

      return NextResponse.json({
        success: true,
        status: 'active',
        message: 'Assinatura Pagar.me confirmada e ativada com sucesso!',
        subscription_id: pagarmeData.id,
        plan: targetPlan.name,
        expires_at: nextMonthIso,
      }, { headers: corsHeaders });
    }

    // =========================================================================
    // 2. FORMA DE PAGAMENTO: PIX INSTANTÂNEO (PAGAR.ME ORDERS)
    // =========================================================================
    if (payment_method === 'pix') {
      const orderPayload = {
        customer: customerPayload,
        items: [
          {
            amount: targetPlan.priceCents,
            description: `Mensalidade CRM Infinity OnDemand - Plano ${targetPlan.name}`,
            quantity: 1,
            code: targetPlan.id,
          },
        ],
        payments: [
          {
            payment_method: 'pix',
            pix: {
              expires_in: 3600, // 1 hora para pagar
            },
          },
        ],
        metadata: {
          user_id,
          plan_id: plan_id.toLowerCase(),
          platform: 'CRM Infinity OnDemand',
        },
      };

      const pagarmeRes = await fetch('https://api.pagar.me/core/v5/orders', {
        method: 'POST',
        headers: {
          Authorization: PAGARME_AUTH,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const pagarmeData = await pagarmeRes.json();

      if (!pagarmeRes.ok) {
        console.error('Erro Pagar.me PIX:', pagarmeData);
        return NextResponse.json({ error: pagarmeData.message || 'Erro ao gerar PIX Pagar.me.' }, { status: 400, headers: corsHeaders });
      }

      const charge = pagarmeData?.charges?.[0];
      const pixTransaction = charge?.last_transaction;

      return NextResponse.json({
        success: true,
        status: 'pending',
        payment_method: 'pix',
        order_id: pagarmeData.id,
        qr_code: pixTransaction?.qr_code || '',
        qr_code_url: pixTransaction?.qr_code_url || '',
        expires_at: pixTransaction?.expires_at,
        amount: (targetPlan.priceCents / 100).toFixed(2),
        plan: targetPlan.name,
      }, { headers: corsHeaders });
    }

    // =========================================================================
    // 3. FORMA DE PAGAMENTO: BOLETO BANCÁRIO (PAGAR.ME ORDERS)
    // =========================================================================
    if (payment_method === 'boleto') {
      const orderPayload = {
        customer: customerPayload,
        items: [
          {
            amount: targetPlan.priceCents,
            description: `Mensalidade CRM Infinity OnDemand - Plano ${targetPlan.name}`,
            quantity: 1,
            code: targetPlan.id,
          },
        ],
        payments: [
          {
            payment_method: 'boleto',
            boleto: {
              instructions: 'Pagar até o vencimento para liberar o acesso ao CRM Infinity OnDemand.',
              due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
        ],
        metadata: {
          user_id,
          plan_id: plan_id.toLowerCase(),
          platform: 'CRM Infinity OnDemand',
        },
      };

      const pagarmeRes = await fetch('https://api.pagar.me/core/v5/orders', {
        method: 'POST',
        headers: {
          Authorization: PAGARME_AUTH,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const pagarmeData = await pagarmeRes.json();

      if (!pagarmeRes.ok) {
        return NextResponse.json({ error: pagarmeData.message || 'Erro ao gerar Boleto Pagar.me.' }, { status: 400, headers: corsHeaders });
      }

      const charge = pagarmeData?.charges?.[0];
      const boletoTransaction = charge?.last_transaction;

      return NextResponse.json({
        success: true,
        status: 'pending',
        payment_method: 'boleto',
        order_id: pagarmeData.id,
        boleto_url: boletoTransaction?.url || boletoTransaction?.pdf || '',
        barcode: boletoTransaction?.barcode || '',
        amount: (targetPlan.priceCents / 100).toFixed(2),
        plan: targetPlan.name,
      }, { headers: corsHeaders });
    }

    return NextResponse.json({ error: 'Método de pagamento inválido.' }, { status: 400, headers: corsHeaders });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Erro interno ao processar checkout.', details: err?.message }, { status: 500, headers: corsHeaders });
  }
}
