-- ============================================================================
-- INFINITY ACADEMY — Seed de demonstração (cursos, módulos e aulas)
-- Rode DEPOIS do academy_schema.sql. Vídeos usam um sample público (troque depois).
-- ============================================================================

-- Curso 1 — Marketing (destaque/hero)
with c as (
  insert into public.academy_courses
    (slug, title, subtitle, description, category, level, accent, instructor, instructor_role,
     duration_minutes, total_lessons, xp_reward, tags, is_featured, is_published, order_index,
     thumbnail_url, cover_url)
  values
    ('trafego-pago-do-zero', 'Tráfego Pago do Zero ao Escala',
     'Meta Ads e Google Ads na prática, com IA no centro da operação',
     'Aprenda a estruturar, lançar e escalar campanhas de tráfego pago que geram ROI real. Do pixel à automação de criativos com IA.',
     'marketing', 'iniciante', '#00DB79', 'Rafael Lima', 'Head de Growth',
     420, 4, 600, array['meta ads','google ads','ia','criativos'], true, true, 1,
     null, null)
  returning id
), m1 as (
  insert into public.academy_modules (course_id, title, order_index)
  select id, 'Fundamentos e Estrutura', 0 from c returning id, course_id
)
insert into public.academy_lessons (module_id, course_id, title, description, video_url, duration_seconds, order_index, xp_reward, is_free)
select m1.id, m1.course_id, v.title, v.descr,
       'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
       v.dur, v.ord, 50, v.free
from m1, (values
  ('Como funciona o leilão de anúncios', 'A lógica por trás do CPM, CPC e do algoritmo', 540, 0, true),
  ('Instalando o Pixel e conversões', 'Rastreamento correto do início ao fim', 720, 1, false),
  ('Estrutura de campanha que escala', 'CBO, ABO e a estrutura Infinity', 900, 2, false),
  ('Criativos com IA que convertem', 'Gerando e testando criativos em escala', 660, 3, false)
) as v(title, descr, dur, ord, free);

-- Curso 2 — Vendas (destaque/hero)
with c as (
  insert into public.academy_courses
    (slug, title, subtitle, description, category, level, accent, instructor, instructor_role,
     duration_minutes, total_lessons, xp_reward, tags, is_featured, is_published, order_index)
  values
    ('maquina-de-vendas', 'A Máquina de Vendas Previsível',
     'Prospecção, SPIN e closing para times de alta performance',
     'Construa um processo comercial previsível: da prospecção ativa ao fechamento, com scripts, cadências e automação de SDR.',
     'vendas', 'intermediario', '#00AAFF', 'Marina Costa', 'Diretora Comercial',
     380, 4, 600, array['sdr','spin','closing','crm'], true, true, 2)
  returning id
), m1 as (
  insert into public.academy_modules (course_id, title, order_index)
  select id, 'Prospecção que gera reunião', 0 from c returning id, course_id
)
insert into public.academy_lessons (module_id, course_id, title, description, video_url, duration_seconds, order_index, xp_reward, is_free)
select m1.id, m1.course_id, v.title, v.descr,
       'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
       v.dur, v.ord, 50, v.free
from m1, (values
  ('O funil de vendas moderno', 'Do lead ao cliente sem fricção', 600, 0, true),
  ('Cadências de prospecção', 'E-mail, WhatsApp e ligação combinados', 780, 1, false),
  ('SPIN Selling na prática', 'As perguntas que fecham negócio', 840, 2, false),
  ('Fechamento e follow-up', 'Contornando objeções e ancorando valor', 720, 3, false)
) as v(title, descr, dur, ord, free);

-- Curso 3 — Administração
with c as (
  insert into public.academy_courses
    (slug, title, subtitle, description, category, level, accent, instructor, instructor_role,
     duration_minutes, total_lessons, xp_reward, tags, is_published, order_index)
  values
    ('gestao-que-escala', 'Gestão que Escala',
     'Processos, indicadores e finanças para donos de negócio',
     'Organize a operação do seu negócio com processos claros, KPIs que importam e controle financeiro descomplicado.',
     'administracao', 'iniciante', '#7C3AED', 'Bruno Alves', 'Consultor de Gestão',
     300, 3, 500, array['processos','kpi','financeiro'], true, 3)
  returning id
), m1 as (
  insert into public.academy_modules (course_id, title, order_index)
  select id, 'Operação sob controle', 0 from c returning id, course_id
)
insert into public.academy_lessons (module_id, course_id, title, description, video_url, duration_seconds, order_index, xp_reward, is_free)
select m1.id, m1.course_id, v.title, v.descr,
       'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
       v.dur, v.ord, 50, v.free
from m1, (values
  ('Mapeando processos', 'Desenhando o fluxo do seu negócio', 540, 0, true),
  ('KPIs que importam', 'Escolhendo os indicadores certos', 600, 1, false),
  ('Fluxo de caixa sem sustos', 'Controle financeiro na prática', 660, 2, false)
) as v(title, descr, dur, ord, free);

-- Curso 4 — IA aplicada
with c as (
  insert into public.academy_courses
    (slug, title, subtitle, description, category, level, accent, instructor, instructor_role,
     duration_minutes, total_lessons, xp_reward, tags, is_published, order_index)
  values
    ('ia-para-negocios', 'IA Aplicada a Negócios',
     'Automatize marketing, vendas e operação com inteligência artificial',
     'Do prompt à automação: use IA para produzir conteúdo, qualificar leads e escalar processos sem aumentar o time.',
     'ia', 'intermediario', '#F59E0B', 'Angelo Marques', 'Fundador Infinity',
     260, 3, 500, array['ia','automação','prompts'], true, 4)
  returning id
), m1 as (
  insert into public.academy_modules (course_id, title, order_index)
  select id, 'IA na operação', 0 from c returning id, course_id
)
insert into public.academy_lessons (module_id, course_id, title, description, video_url, duration_seconds, order_index, xp_reward, is_free)
select m1.id, m1.course_id, v.title, v.descr,
       'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
       v.dur, v.ord, 50, v.free
from m1, (values
  ('Prompts que geram resultado', 'A anatomia de um bom prompt', 480, 0, true),
  ('Automação de conteúdo', 'Esteira de conteúdo com IA', 600, 1, false),
  ('Agentes de atendimento', 'IA qualificando e respondendo leads', 540, 2, false)
) as v(title, descr, dur, ord, free);

-- ============================================================================
-- FIM DO SEED — Infinity Academy
-- ============================================================================
