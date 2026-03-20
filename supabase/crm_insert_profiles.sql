-- Insert existing user profile into crm_profiles
-- Run this in the Supabase SQL Editor

INSERT INTO public.crm_profiles (id, email, full_name, subscription_status, plan_id)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  'free',
  'free'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.crm_profiles)
ON CONFLICT (id) DO NOTHING;
