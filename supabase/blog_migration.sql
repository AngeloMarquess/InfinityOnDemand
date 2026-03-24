-- ============================================
-- Blog Infinity OnDemand — Migration
-- ============================================

-- 1. Categorias
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#00DF81',
  text_color TEXT DEFAULT '#000',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inserir categorias padrão
INSERT INTO public.blog_categories (name, slug, color, text_color) VALUES
  ('I.A. & Machine Learning', 'ia-machine-learning', 'rgba(0,223,129,0.9)', '#000'),
  ('E-commerce', 'ecommerce', 'rgba(0,170,255,0.9)', '#fff'),
  ('Delivery & SaaS', 'delivery-saas', 'rgba(255,200,50,0.9)', '#000'),
  ('Marketing Digital', 'marketing-digital', 'rgba(124,58,237,0.9)', '#fff'),
  ('Tecnologia', 'tecnologia', 'rgba(239,68,68,0.9)', '#fff'),
  ('Negócios', 'negocios', 'rgba(14,165,233,0.9)', '#fff')
ON CONFLICT (slug) DO NOTHING;

-- 2. Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  cover_url TEXT,
  thumbnail_url TEXT,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  author_name TEXT DEFAULT 'Infinity OnDemand',
  author_avatar TEXT DEFAULT '/infinity_logo.png',
  reading_time INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published_at DESC);

-- 3. Comentários
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON public.blog_comments(post_id);

-- 4. Assinantes (Newsletter)
CREATE TABLE IF NOT EXISTS public.blog_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_subscribers_email ON public.blog_subscribers(email);

-- 5. Trigger updated_at
CREATE OR REPLACE FUNCTION public.blog_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.blog_update_updated_at();

-- 6. RLS (sem restrição para leitura pública, admin via service_role)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_subscribers ENABLE ROW LEVEL SECURITY;

-- Leitura pública para posts publicados
CREATE POLICY "blog_posts_public_read" ON public.blog_posts 
  FOR SELECT USING (status = 'published');

-- Leitura pública de categorias
CREATE POLICY "blog_categories_public_read" ON public.blog_categories
  FOR SELECT USING (true);

-- Leitura pública de comentários aprovados
CREATE POLICY "blog_comments_public_read" ON public.blog_comments
  FOR SELECT USING (approved = true);

-- Inserção pública de comentários (qualquer visitante)
CREATE POLICY "blog_comments_public_insert" ON public.blog_comments
  FOR INSERT WITH CHECK (true);

-- Inserção pública de assinantes
CREATE POLICY "blog_subscribers_public_insert" ON public.blog_subscribers
  FOR INSERT WITH CHECK (true);

-- Storage bucket para imagens do blog
-- Execute via Supabase Dashboard > Storage > New Bucket:
-- Nome: blog-images
-- Public: true
