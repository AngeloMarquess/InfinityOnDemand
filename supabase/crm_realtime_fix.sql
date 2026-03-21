-- Add crm_contracts to Supabase Realtime publication
-- Run this in Supabase SQL Editor

-- Check if already added, if not add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND tablename = 'crm_contracts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_contracts;
  END IF;
END $$;

-- Also ensure crm_proposals is in the publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND tablename = 'crm_proposals'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_proposals;
  END IF;
END $$;
