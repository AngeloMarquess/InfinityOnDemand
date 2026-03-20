-- ============================================
-- CRM SUBSCRIPTION SYSTEM — Migration
-- Run this AFTER crm_migration.sql
-- ============================================

-- =====================
-- PLANS TABLE
-- =====================

CREATE TABLE IF NOT EXISTS public.crm_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly INTEGER NOT NULL DEFAULT 0, -- in cents (BRL)
  max_leads INTEGER NOT NULL DEFAULT 20,
  max_proposals INTEGER NOT NULL DEFAULT 5,
  max_services INTEGER NOT NULL DEFAULT 10,
  max_tasks INTEGER NOT NULL DEFAULT 20,
  stripe_price_id TEXT, -- Stripe Price ID for checkout
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default plans
INSERT INTO public.crm_plans (id, name, description, price_monthly, max_leads, max_proposals, max_services, max_tasks, features) VALUES
  ('free', 'Free', 'Ideal para começar a organizar seus leads', 0, 20, 5, 10, 20,
    '["Pipeline de vendas", "Até 20 leads", "5 propostas", "Calendário básico"]'::jsonb),
  ('starter', 'Starter', 'Para negócios em crescimento que precisam de mais capacidade', 9700, 200, 50, 50, 100,
    '["Tudo do Free", "Até 200 leads", "50 propostas", "Automações básicas", "Suporte prioritário"]'::jsonb),
  ('pro', 'Pro', 'Para empresas que precisam de recursos ilimitados', 19700, -1, -1, -1, -1,
    '["Tudo do Starter", "Leads ilimitados", "Propostas ilimitadas", "Relatórios avançados", "API access", "Suporte VIP"]'::jsonb)
ON CONFLICT (id) DO NOTHING;


-- =====================
-- EXTEND CRM_PROFILES
-- =====================

ALTER TABLE public.crm_profiles
  ADD COLUMN IF NOT EXISTS plan_id TEXT REFERENCES public.crm_plans(id) DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;


-- =====================
-- SUBSCRIPTION HISTORY
-- =====================

CREATE TABLE IF NOT EXISTS public.crm_subscription_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES public.crm_plans(id),
  event_type TEXT NOT NULL, -- 'activated', 'upgraded', 'downgraded', 'cancelled', 'renewed', 'expired'
  stripe_session_id TEXT,
  stripe_invoice_id TEXT,
  amount INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_subscription_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crm_subscription_history_select"
  ON public.crm_subscription_history FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "crm_subscription_history_service"
  ON public.crm_subscription_history FOR ALL
  USING (true) WITH CHECK (true);

-- Index
CREATE INDEX idx_crm_subscription_history_user ON public.crm_subscription_history(user_id);
CREATE INDEX idx_crm_profiles_plan ON public.crm_profiles(plan_id);
CREATE INDEX idx_crm_profiles_stripe ON public.crm_profiles(stripe_customer_id);

-- Allow public read on plans (for pricing page)
CREATE POLICY "crm_plans_public_read" ON public.crm_plans FOR SELECT USING (true);
ALTER TABLE public.crm_plans ENABLE ROW LEVEL SECURITY;
