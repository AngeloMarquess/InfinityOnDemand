-- ============================================
-- FIX: Grant permissions on CRM tables
-- The service_role bypasses RLS but needs table grants
-- Run this in the Supabase SQL Editor
-- ============================================

-- Grant full access to authenticated and service_role
GRANT ALL ON public.crm_profiles TO authenticated, service_role;
GRANT ALL ON public.crm_stages TO authenticated, service_role;
GRANT ALL ON public.crm_contacts TO authenticated, service_role;
GRANT ALL ON public.crm_proposals TO authenticated, service_role;
GRANT ALL ON public.crm_services TO authenticated, service_role;
GRANT ALL ON public.crm_service_categories TO authenticated, service_role;
GRANT ALL ON public.crm_tasks TO authenticated, service_role;
GRANT ALL ON public.crm_financial_records TO authenticated, service_role;
GRANT ALL ON public.crm_calendar_events TO authenticated, service_role;
GRANT ALL ON public.crm_briefings TO authenticated, service_role;
GRANT ALL ON public.crm_plans TO authenticated, service_role;
GRANT ALL ON public.crm_subscription_history TO authenticated, service_role;

-- Also grant read on plans to anonymous users (public pricing page)
GRANT SELECT ON public.crm_plans TO anon;
