import { createClient } from '@supabase/supabase-js';

// Plan limits: -1 means unlimited
interface PlanLimits {
  max_leads: number;
  max_proposals: number;
  max_services: number;
  max_tasks: number;
}

interface SubscriptionInfo {
  plan_id: string;
  plan_name: string;
  plan_price: number;
  limits: PlanLimits;
  usage: {
    leads: number;
    proposals: number;
    services: number;
    tasks: number;
  };
  subscription_status: string;
  subscription_expires_at: string | null;
  stripe_customer_id: string | null;
}

function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

export async function getSubscriptionInfo(userId: string): Promise<SubscriptionInfo | null> {
  const supabase = getServiceSupabase();

  // Get profile with plan
  const { data: profile, error: profileError } = await supabase
    .from('crm_profiles')
    .select('plan_id, subscription_status, subscription_expires_at, stripe_customer_id')
    .eq('id', userId)
    .single();

  if (profileError || !profile) return null;

  const planId = profile.plan_id || 'free';

  // Get plan limits
  const { data: plan } = await supabase
    .from('crm_plans')
    .select('*')
    .eq('id', planId)
    .single();

  if (!plan) return null;

  // Count usage
  const [leads, proposals, services, tasks] = await Promise.all([
    supabase.from('crm_contacts').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('crm_proposals').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('crm_services').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('crm_tasks').select('id', { count: 'exact', head: true }).eq('user_id', userId),
  ]);

  return {
    plan_id: planId,
    plan_name: plan.name,
    plan_price: plan.price_monthly,
    limits: {
      max_leads: plan.max_leads,
      max_proposals: plan.max_proposals,
      max_services: plan.max_services,
      max_tasks: plan.max_tasks,
    },
    usage: {
      leads: leads.count || 0,
      proposals: proposals.count || 0,
      services: services.count || 0,
      tasks: tasks.count || 0,
    },
    subscription_status: profile.subscription_status || 'free',
    subscription_expires_at: profile.subscription_expires_at,
    stripe_customer_id: profile.stripe_customer_id,
  };
}

export async function checkPlanLimit(
  userId: string,
  resource: 'leads' | 'proposals' | 'services' | 'tasks'
): Promise<{ allowed: boolean; current: number; limit: number; plan: string }> {
  const info = await getSubscriptionInfo(userId);

  if (!info) {
    return { allowed: false, current: 0, limit: 0, plan: 'unknown' };
  }

  const limitMap: Record<string, keyof PlanLimits> = {
    leads: 'max_leads',
    proposals: 'max_proposals',
    services: 'max_services',
    tasks: 'max_tasks',
  };

  const limit = info.limits[limitMap[resource]];
  const current = info.usage[resource];

  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, current, limit: -1, plan: info.plan_name };
  }

  return {
    allowed: current < limit,
    current,
    limit,
    plan: info.plan_name,
  };
}
