-- Fix para erros de Security Advisor da Infinity 

-- 1. Tabelas de comunicação/chatbot e configurações (TotalPrivacidade)
ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_settings ENABLE ROW LEVEL SECURITY;

-- 2. Tabela do Social Media
ALTER TABLE public.creative_posts ENABLE ROW LEVEL SECURITY;

-- 3. Tabelas de gerenciamento de Blog
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_subscribers ENABLE ROW LEVEL SECURITY;

-- Nota: Como corrigimos o Backend API para usar uma chave Service Role (que fura essa proteção do RLS por ser Administrador autêntico),
-- NÃO precisamos criar nenhuma POLICY de leitura/escrita aberta. 
-- Dessa maneira, as chamadas públicas diretas a essas tabelas ficam 100% BLINDADAS.
