-- FIX: Corrigir política de INSERT para permitir anon key
-- (A política anterior pode ter usado TO public, que não funciona com RLS no Supabase)

-- Remover políticas duplicadas com segurança
DROP POLICY IF EXISTS "Allow public insert to infinity_briefing_submissions" ON public.infinity_briefing_submissions;

-- Recriar com role correto (anon = chave anon do Supabase)
CREATE POLICY "Allow public insert to infinity_briefing_submissions" 
ON public.infinity_briefing_submissions 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Garantir que SELECT e UPDATE continuem funcionando para admin
DROP POLICY IF EXISTS "Allow admin read access on infinity_briefing_submissions" ON public.infinity_briefing_submissions;
CREATE POLICY "Allow admin read access on infinity_briefing_submissions" 
ON public.infinity_briefing_submissions 
FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow admin update access on infinity_briefing_submissions" ON public.infinity_briefing_submissions;
CREATE POLICY "Allow admin update access on infinity_briefing_submissions" 
ON public.infinity_briefing_submissions 
FOR UPDATE 
TO authenticated 
USING (true);

-- Também permitir leitura para service_role (dashboard admin)
DROP POLICY IF EXISTS "Allow service_role full access on infinity_briefing_submissions" ON public.infinity_briefing_submissions;
CREATE POLICY "Allow service_role full access on infinity_briefing_submissions"
ON public.infinity_briefing_submissions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
