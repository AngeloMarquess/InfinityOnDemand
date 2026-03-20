-- Add stripe_product_id column to crm_plans and set existing Stripe product IDs
-- Run this in the Supabase SQL Editor

ALTER TABLE public.crm_plans ADD COLUMN IF NOT EXISTS stripe_product_id TEXT;

UPDATE public.crm_plans SET stripe_product_id = 'prod_U6ZLB9WUhI20TA' WHERE id = 'starter';
UPDATE public.crm_plans SET stripe_product_id = 'prod_U6ZL7AK3E1qOo8' WHERE id = 'pro';
UPDATE public.crm_plans SET stripe_product_id = 'prod_UBVTWIMHxNWyuY' WHERE id = 'enterprise';
