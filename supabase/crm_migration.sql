-- ============================================
-- CRM TABLES — Consolidation into Infinity Supabase
-- All tables prefixed with crm_ to avoid conflicts
-- Run this SQL in the Infinity Supabase SQL Editor
-- Project: qarfhdbtaonjuuczwmwf
-- ============================================

-- =====================
-- FUNCTIONS
-- =====================

-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION public.crm_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-create default pipeline stages when a profile is created
CREATE OR REPLACE FUNCTION public.crm_create_default_stages()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.crm_stages (user_id, name, color, order_index) VALUES
    (NEW.id, 'Novo Lead', '#a855f7', 0),
    (NEW.id, 'Primeiro Contato', '#eab308', 1),
    (NEW.id, 'Proposta Enviada', '#7e22ce', 2),
    (NEW.id, 'Negociação', '#db2777', 3),
    (NEW.id, 'Fechado', '#22c55e', 4);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.crm_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.crm_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';


-- =====================
-- TABLES
-- =====================

-- CRM Profiles
CREATE TABLE IF NOT EXISTS public.crm_profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_status TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CRM Pipeline Stages
CREATE TABLE IF NOT EXISTS public.crm_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#a855f7',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CRM Contacts (Leads & Clients)
CREATE TABLE IF NOT EXISTS public.crm_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  estimated_value NUMERIC(12,2) DEFAULT 0,
  origin TEXT DEFAULT 'site',
  contact_type TEXT NOT NULL DEFAULT 'lead',
  stage_id UUID REFERENCES public.crm_stages(id) ON DELETE SET NULL,
  avatar_url TEXT,
  -- Extended fields
  company TEXT,
  cpf_cnpj TEXT,
  cep TEXT,
  address TEXT,
  address_number TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  project_interest TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CRM Proposals
CREATE TABLE IF NOT EXISTS public.crm_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'rascunho',
  share_token UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CRM Service Categories
CREATE TABLE IF NOT EXISTS public.crm_service_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#f43f5e',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CRM Services
CREATE TABLE IF NOT EXISTS public.crm_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  category_id UUID REFERENCES public.crm_service_categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CRM Tasks
CREATE TABLE IF NOT EXISTS public.crm_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'backlog',
  priority TEXT NOT NULL DEFAULT 'media',
  due_date TIMESTAMPTZ,
  assignee TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CRM Financial Records
CREATE TABLE IF NOT EXISTS public.crm_financial_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(12,2) NOT NULL,
  description TEXT,
  category TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CRM Calendar Events
CREATE TABLE IF NOT EXISTS public.crm_calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  color TEXT DEFAULT '#f43f5e',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CRM Briefings
CREATE TABLE IF NOT EXISTS public.crm_briefings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'rascunho',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- =====================
-- ROW LEVEL SECURITY
-- =====================

ALTER TABLE public.crm_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_briefings ENABLE ROW LEVEL SECURITY;


-- =====================
-- RLS POLICIES
-- =====================

-- Profiles
CREATE POLICY "crm_profiles_insert" ON public.crm_profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "crm_profiles_select" ON public.crm_profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "crm_profiles_update" ON public.crm_profiles FOR UPDATE USING (id = auth.uid());

-- Stages
CREATE POLICY "crm_stages_all" ON public.crm_stages FOR ALL USING (user_id = auth.uid());

-- Contacts
CREATE POLICY "crm_contacts_all" ON public.crm_contacts FOR ALL USING (user_id = auth.uid());

-- Proposals (+ public share)
CREATE POLICY "crm_proposals_all" ON public.crm_proposals FOR ALL USING (user_id = auth.uid());
CREATE POLICY "crm_proposals_public_share" ON public.crm_proposals FOR SELECT USING (share_token IS NOT NULL);

-- Service Categories
CREATE POLICY "crm_service_categories_all" ON public.crm_service_categories FOR ALL USING (user_id = auth.uid());

-- Services
CREATE POLICY "crm_services_all" ON public.crm_services FOR ALL USING (user_id = auth.uid());

-- Tasks
CREATE POLICY "crm_tasks_all" ON public.crm_tasks FOR ALL USING (user_id = auth.uid());

-- Financial Records
CREATE POLICY "crm_financial_records_all" ON public.crm_financial_records FOR ALL USING (user_id = auth.uid());

-- Calendar Events
CREATE POLICY "crm_calendar_events_all" ON public.crm_calendar_events FOR ALL USING (user_id = auth.uid());

-- Briefings
CREATE POLICY "crm_briefings_all" ON public.crm_briefings FOR ALL USING (user_id = auth.uid());


-- =====================
-- TRIGGERS
-- =====================

-- Auto-update updated_at
CREATE TRIGGER crm_contacts_updated_at BEFORE UPDATE ON public.crm_contacts FOR EACH ROW EXECUTE FUNCTION public.crm_update_updated_at();
CREATE TRIGGER crm_proposals_updated_at BEFORE UPDATE ON public.crm_proposals FOR EACH ROW EXECUTE FUNCTION public.crm_update_updated_at();
CREATE TRIGGER crm_services_updated_at BEFORE UPDATE ON public.crm_services FOR EACH ROW EXECUTE FUNCTION public.crm_update_updated_at();
CREATE TRIGGER crm_tasks_updated_at BEFORE UPDATE ON public.crm_tasks FOR EACH ROW EXECUTE FUNCTION public.crm_update_updated_at();
CREATE TRIGGER crm_briefings_updated_at BEFORE UPDATE ON public.crm_briefings FOR EACH ROW EXECUTE FUNCTION public.crm_update_updated_at();
CREATE TRIGGER crm_profiles_updated_at BEFORE UPDATE ON public.crm_profiles FOR EACH ROW EXECUTE FUNCTION public.crm_update_updated_at();

-- Auto-create stages when profile is created
CREATE TRIGGER crm_on_profile_created AFTER INSERT ON public.crm_profiles FOR EACH ROW EXECUTE FUNCTION public.crm_create_default_stages();

-- Auto-create CRM profile on auth signup
CREATE TRIGGER crm_on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.crm_handle_new_user();


-- =====================
-- REALTIME
-- =====================

ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_stages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_proposals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_financial_records;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_briefings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_service_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_calendar_events;


-- =====================
-- INDEXES
-- =====================

CREATE INDEX idx_crm_contacts_user_id ON public.crm_contacts(user_id);
CREATE INDEX idx_crm_contacts_stage_id ON public.crm_contacts(stage_id);
CREATE INDEX idx_crm_stages_user_id ON public.crm_stages(user_id);
CREATE INDEX idx_crm_tasks_user_id ON public.crm_tasks(user_id);
CREATE INDEX idx_crm_proposals_user_id ON public.crm_proposals(user_id);
CREATE INDEX idx_crm_financial_records_user_id ON public.crm_financial_records(user_id);


-- =====================
-- INSERT EXISTING USER PROFILE (if needed)
-- =====================
-- After running this migration, insert your profile manually:
-- INSERT INTO public.crm_profiles (id, email, full_name, subscription_status)
-- SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)), 'free'
-- FROM auth.users
-- WHERE id NOT IN (SELECT id FROM public.crm_profiles)
-- ON CONFLICT (id) DO NOTHING;
