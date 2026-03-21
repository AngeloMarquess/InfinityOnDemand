-- =============================================
-- FIX: Allow anonymous access to proposals via share_token
-- This enables the public approval page (/aprovacao/:shareToken)
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Grant SELECT and UPDATE on crm_proposals to anon (for public approval page)
GRANT SELECT, UPDATE ON public.crm_proposals TO anon;

-- 2. Ensure the public share SELECT policy exists
-- Allows anyone to read proposals that have a share_token
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'crm_proposals' 
    AND policyname = 'crm_proposals_public_share'
  ) THEN
    CREATE POLICY "crm_proposals_public_share" 
      ON public.crm_proposals 
      FOR SELECT 
      USING (share_token IS NOT NULL);
  END IF;
END $$;

-- 3. Allow anonymous users to UPDATE proposals via share_token
-- (for approve/reject actions on the public page)
CREATE POLICY "crm_proposals_public_update" 
  ON public.crm_proposals 
  FOR UPDATE 
  USING (share_token IS NOT NULL)
  WITH CHECK (share_token IS NOT NULL);

-- 4. Also grant access to crm_contracts for anon (if needed later)
GRANT SELECT ON public.crm_contracts TO anon;
