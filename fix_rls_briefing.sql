-- SOLUÇÃO SIMPLES: Desabilitar RLS nesta tabela
-- A segurança é controlada pela API route do Next.js
ALTER TABLE public.infinity_briefing_submissions DISABLE ROW LEVEL SECURITY;
