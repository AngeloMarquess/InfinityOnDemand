import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion });

function getServiceSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret && webhookSecret !== 'whsec_CONFIGURE_DEPOIS') {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Dev mode: parse without verification
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const planId = session.metadata?.plan_id;

        if (userId && planId) {
          // Update profile with new plan
          await supabase
            .from('crm_profiles')
            .update({
              plan_id: planId,
              subscription_status: 'active',
              stripe_subscription_id: String((session as unknown as { subscription?: string }).subscription || ''),
              subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .eq('id', userId);

          // Log in history
          await supabase.from('crm_subscription_history').insert({
            user_id: userId,
            plan_id: planId,
            event_type: 'activated',
            stripe_session_id: session.id,
            amount: session.amount_total || 0,
          });
        }
        break;
      }

      case 'invoice.paid': {
        const invoiceObj = event.data.object as unknown as { subscription?: string; id: string; amount_paid?: number };
        const subscriptionId = invoiceObj.subscription;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = subscription.metadata?.supabase_user_id;
          const planId = subscription.metadata?.plan_id;

          if (userId) {
            await supabase
              .from('crm_profiles')
              .update({
                subscription_status: 'active',
                subscription_expires_at: new Date(((subscription as unknown as { current_period_end: number }).current_period_end) * 1000).toISOString(),
              })
              .eq('id', userId);

            if (planId) {
              await supabase.from('crm_subscription_history').insert({
                user_id: userId,
                plan_id: planId,
                event_type: 'renewed',
                stripe_invoice_id: invoiceObj.id,
                amount: invoiceObj.amount_paid || 0,
              });
            }
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (userId) {
          await supabase
            .from('crm_profiles')
            .update({
              plan_id: 'free',
              subscription_status: 'cancelled',
              stripe_subscription_id: null,
            })
            .eq('id', userId);

          await supabase.from('crm_subscription_history').insert({
            user_id: userId,
            plan_id: 'free',
            event_type: 'cancelled',
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (userId) {
          const status = subscription.status === 'active' ? 'active' : 'past_due';
          await supabase
            .from('crm_profiles')
            .update({
              subscription_status: status,
              subscription_expires_at: new Date(((subscription as unknown as { current_period_end: number }).current_period_end) * 1000).toISOString(),
            })
            .eq('id', userId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
