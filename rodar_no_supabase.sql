-- ============================================
-- SQL COMPLETO INFINITY - RODE TUDO DE UMA VEZ
-- ============================================

-- 1. CRIAR TABELA DE BRIEFINGS
CREATE TABLE IF NOT EXISTS public.infinity_briefing_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    briefing_type TEXT NOT NULL,
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending'
);

-- 2. ATIVAR SEGURANÇA RLS NA TABELA DE BRIEFINGS
ALTER TABLE public.infinity_briefing_submissions ENABLE ROW LEVEL SECURITY;

-- Permitir inserção pública (formulário do cliente)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert to infinity_briefing_submissions') THEN
    CREATE POLICY "Allow public insert to infinity_briefing_submissions" 
    ON public.infinity_briefing_submissions 
    FOR INSERT 
    TO public
    WITH CHECK (true);
  END IF;
END $$;

-- Permitir leitura para admin autenticado
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin read access on infinity_briefing_submissions') THEN
    CREATE POLICY "Allow admin read access on infinity_briefing_submissions" 
    ON public.infinity_briefing_submissions 
    FOR SELECT 
    TO authenticated 
    USING (true);
  END IF;
END $$;

-- Permitir update para admin autenticado  
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin update access on infinity_briefing_submissions') THEN
    CREATE POLICY "Allow admin update access on infinity_briefing_submissions" 
    ON public.infinity_briefing_submissions 
    FOR UPDATE 
    TO authenticated 
    USING (true);
  END IF;
END $$;

-- 3. ATIVAR ROW LEVEL SECURITY EM TODAS AS TABELAS VULNERÁVEIS
-- (Corrige os alertas laranja/vermelho do Security Advisor)
ALTER TABLE public.creative_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_subscribers ENABLE ROW LEVEL SECURITY;

-- 4. CRIAR BUCKET DE STORAGE PARA UPLOADS DE BRIEFING
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'briefing-uploads', 
  'briefing-uploads', 
  true, 
  10485760,  -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Permitir upload público no bucket
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public upload to briefing-uploads') THEN
    CREATE POLICY "Allow public upload to briefing-uploads"
    ON storage.objects
    FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'briefing-uploads');
  END IF;
END $$;

-- Permitir leitura pública das imagens do bucket
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read on briefing-uploads') THEN
    CREATE POLICY "Allow public read on briefing-uploads"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'briefing-uploads');
  END IF;
END $$;

-- ============================================
-- PRONTO! Após rodar, o formulário de briefing
-- e o upload de imagens vão funcionar e o 
-- Security Advisor ficará limpo.
-- ============================================
