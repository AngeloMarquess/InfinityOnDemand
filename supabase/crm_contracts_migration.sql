-- =============================================
-- CRM Contracts Migration
-- Novas colunas em crm_proposals + tabela crm_contracts
-- =============================================

-- 1. Novas colunas em crm_proposals para aprovação
ALTER TABLE public.crm_proposals 
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by_name TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 2. Tabela de contratos
CREATE TABLE IF NOT EXISTS public.crm_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES public.crm_proposals(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id),
  template_name TEXT NOT NULL,
  content TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_cpf_cnpj TEXT,
  client_address TEXT,
  contract_value NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'rascunho',
  autentique_doc_id TEXT,
  autentique_url TEXT,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS
ALTER TABLE public.crm_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own contracts" ON public.crm_contracts
  FOR ALL USING (auth.uid() = user_id);

-- 4. Índices
CREATE INDEX IF NOT EXISTS idx_contracts_user ON public.crm_contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_proposal ON public.crm_contracts(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposals_share_token ON public.crm_proposals(share_token);
