-- Add payment_method, status, and notes columns to crm_financial_records
ALTER TABLE public.crm_financial_records ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.crm_financial_records ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'paid';
ALTER TABLE public.crm_financial_records ADD COLUMN IF NOT EXISTS notes TEXT;
