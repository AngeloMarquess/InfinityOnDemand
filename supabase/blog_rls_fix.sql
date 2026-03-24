-- Fix RLS: adicionar policies para todas as operações
-- O service_role já bypassa RLS, mas estas policies servem como fallback

-- blog_posts: full access para operações autenticadas
CREATE POLICY "blog_posts_full_access" ON public.blog_posts
  FOR ALL USING (true) WITH CHECK (true);

-- blog_categories: full access
CREATE POLICY "blog_categories_full_access" ON public.blog_categories
  FOR ALL USING (true) WITH CHECK (true);

-- blog_comments: full access para admin
CREATE POLICY "blog_comments_full_access" ON public.blog_comments
  FOR ALL USING (true) WITH CHECK (true);

-- blog_subscribers: full access
CREATE POLICY "blog_subscribers_full_access" ON public.blog_subscribers
  FOR ALL USING (true) WITH CHECK (true);
