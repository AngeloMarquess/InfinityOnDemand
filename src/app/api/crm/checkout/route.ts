import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion });

function getServiceSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': 'https://crmm.infinityondemand.com.br',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    const { plan_id, user_id, user_email, success_url, cancel_url } = await request.json();

    if (!plan_id || !user_id) {
      return NextResponse.json({ error: 'plan_id e user_id são obrigatórios.' }, { status: 400, headers: corsHeaders() });
    }

    const supabase = getServiceSupabase();

    // Get the plan
    const { data: plan, error: planError } = await supabase
      .from('crm_plans')
      .select('*')
      .eq('id', plan_id)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: 'Plano não encontrado.' }, { status: 404, headers: corsHeaders() });
    }

    if (plan.price_monthly === 0) {
      return NextResponse.json({ error: 'Plano gratuito não precisa de checkout.' }, { status: 400, headers: corsHeaders() });
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('crm_profiles')
      .select('stripe_customer_id, email')
      .eq('id', user_id)
      .single();

    let customerId = profile?.stripe_customer_id;
    const emailToUse = profile?.email || user_email;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: emailToUse || undefined,
        metadata: { supabase_user_id: user_id },
      });
      customerId = customer.id;

      // Save Stripe customer ID
      await supabase
        .from('crm_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user_id);
    }

    // Create Stripe Price (or use existing)
    let priceId = plan.stripe_price_id;

    if (!priceId) {
      // Use existing Stripe product or create new one
      const productId = plan.stripe_product_id;

      if (productId) {
        // Product exists, just create a price for it
        const price = await stripe.prices.create({
          product: productId,
          unit_amount: plan.price_monthly,
          currency: 'brl',
          recurring: { interval: 'month' },
        });
        priceId = price.id;
      } else {
        // Create product + price in Stripe
        const product = await stripe.products.create({
          name: `CRM Infinity — Plano ${plan.name}`,
          description: plan.description || undefined,
        });

        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: plan.price_monthly,
          currency: 'brl',
          recurring: { interval: 'month' },
        });

        priceId = price.id;

        // Save product ID
        await supabase
          .from('crm_plans')
          .update({ stripe_product_id: product.id })
          .eq('id', plan_id);
      }

      // Save Stripe price ID back to plan
      await supabase
        .from('crm_plans')
        .update({ stripe_price_id: priceId })
        .eq('id', plan_id);
    }

    // Create Checkout Session
    const crmDomain = 'https://crmm.infinityondemand.com.br';
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: success_url || `${crmDomain}/dashboard?checkout=success`,
      cancel_url: cancel_url || `${crmDomain}/?checkout=cancelled`,
      metadata: {
        supabase_user_id: user_id,
        plan_id: plan_id,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user_id,
          plan_id: plan_id,
        },
      },
    });

    return NextResponse.json({ url: session.url, session_id: session.id }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Erro ao criar sessão de checkout.' }, { status: 500, headers: corsHeaders() });
  }
}
