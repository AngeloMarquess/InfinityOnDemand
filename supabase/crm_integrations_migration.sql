-- =====================
-- CRM INTEGRATIONS — Per-client integration settings
-- =====================

CREATE TABLE IF NOT EXISTS public.crm_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Leads Site
  site_webhook_token TEXT DEFAULT encode(gen_random_bytes(16), 'hex'),
  site_enabled BOOLEAN DEFAULT true,
  -- WhatsApp
  whatsapp_enabled BOOLEAN DEFAULT false,
  whatsapp_phone_number_id TEXT,
  whatsapp_access_token TEXT,
  whatsapp_verify_token TEXT DEFAULT encode(gen_random_bytes(8), 'hex'),
  -- Apify
  apify_enabled BOOLEAN DEFAULT false,
  apify_api_key TEXT,
  apify_actor_id TEXT,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.crm_integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "crm_integrations_all" ON public.crm_integrations FOR ALL USING (user_id = auth.uid());

-- Updated_at trigger
CREATE TRIGGER crm_integrations_updated_at BEFORE UPDATE ON public.crm_integrations 
FOR EACH ROW EXECUTE FUNCTION public.crm_update_updated_at();

-- Auto-create integrations record when profile is created
CREATE OR REPLACE FUNCTION public.crm_create_default_integrations()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.crm_integrations (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

CREATE TRIGGER crm_on_profile_created_integrations AFTER INSERT ON public.crm_profiles 
FOR EACH ROW EXECUTE FUNCTION public.crm_create_default_integrations();
