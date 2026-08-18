-- ============================================================================
-- INFINITY ACADEMY — Seed Idempotente (Cursos, Módulos, Aulas e Gamificação)
-- Pode ser executado quantas vezes você quiser no SQL Editor do Supabase.
-- ============================================================================

DO $$
DECLARE
  v_c1_id uuid;
  v_c2_id uuid;
  v_c3_id uuid;
  v_c4_id uuid;
  v_m_id  uuid;
BEGIN

  -- ---------------------------------------------------------------------------
  -- 1. CURSO: Tráfego Pago do Zero ao Escala
  -- ---------------------------------------------------------------------------
  INSERT INTO public.academy_courses
    (slug, title, subtitle, description, category, level, accent, instructor, instructor_role,
     duration_minutes, total_lessons, xp_reward, tags, is_featured, is_published, order_index,
     thumbnail_url, cover_url)
  VALUES
    ('trafego-pago-do-zero', 'Tráfego Pago do Zero ao Escala',
     'Meta Ads e Google Ads na prática, com IA no centro da operação',
     'Aprenda a estruturar, lançar e escalar campanhas de tráfego pago que geram ROI real. Do pixel à automação de criativos com IA.',
     'marketing', 'iniciante', '#00DB79', 'Angelo Marques', 'Head de Performance',
     420, 4, 600, ARRAY['meta ads','google ads','ia','criativos'], true, true, 1,
     'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&auto=format&fit=crop&q=80',
     'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=1600&auto=format&fit=crop&q=80')
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    thumbnail_url = EXCLUDED.thumbnail_url,
    cover_url = EXCLUDED.cover_url,
    is_published = true,
    is_featured = true
  RETURNING id INTO v_c1_id;

  -- Módulo 1 do Curso 1
  SELECT id INTO v_m_id FROM public.academy_modules WHERE course_id = v_c1_id LIMIT 1;
  IF v_m_id IS NULL THEN
    INSERT INTO public.academy_modules (course_id, title, order_index)
    VALUES (v_c1_id, 'Fundamentos e Estrutura de Campanhas', 0)
    RETURNING id INTO v_m_id;
  END IF;

  DELETE FROM public.academy_lessons WHERE module_id = v_m_id;
  INSERT INTO public.academy_lessons (module_id, course_id, title, description, video_url, duration_seconds, order_index, xp_reward, is_free)
  VALUES
    (v_m_id, v_c1_id, '1. Como funciona o leilão de anúncios', 'A lógica por trás do CPM, CPC e do algoritmo do Meta e Google', 'https://www.youtube.com/embed/aircAruvnKk', 540, 0, 50, true),
    (v_m_id, v_c1_id, '2. Instalando o Pixel, CAPI e conversões', 'Rastreamento correto do início ao fim com tags modernas', 'https://www.youtube.com/embed/aircAruvnKk', 720, 1, 50, false),
    (v_m_id, v_c1_id, '3. Estrutura de campanha que escala', 'CBO, ABO e a metodologia Infinity de validação', 'https://www.youtube.com/embed/aircAruvnKk', 900, 2, 75, false),
    (v_m_id, v_c1_id, '4. Criativos com IA que convertem', 'Gerando e testando criativos em alta escala', 'https://www.youtube.com/embed/aircAruvnKk', 660, 3, 100, false);


  -- ---------------------------------------------------------------------------
  -- 2. CURSO: A Máquina de Vendas Previsível (SPIN Selling)
  -- ---------------------------------------------------------------------------
  INSERT INTO public.academy_courses
    (slug, title, subtitle, description, category, level, accent, instructor, instructor_role,
     duration_minutes, total_lessons, xp_reward, tags, is_featured, is_published, order_index,
     thumbnail_url, cover_url)
  VALUES
    ('maquina-de-vendas', 'A Máquina de Vendas Previsível',
     'Prospecção, SPIN Selling e closing para times comerciais',
     'Construa um processo comercial previsível: da prospecção ativa ao fechamento, com scripts, cadências e automação de SDR.',
     'vendas', 'intermediario', '#00AAFF', 'Lucas Andrade', 'Diretor Comercial',
     380, 4, 600, ARRAY['sdr','spin','closing','crm'], false, true, 2,
     'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80',
     'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&auto=format&fit=crop&q=80')
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    cover_url = EXCLUDED.cover_url,
    is_published = true
  RETURNING id INTO v_c2_id;

  SELECT id INTO v_m_id FROM public.academy_modules WHERE course_id = v_c2_id LIMIT 1;
  IF v_m_id IS NULL THEN
    INSERT INTO public.academy_modules (course_id, title, order_index)
    VALUES (v_c2_id, 'Prospecção e Qualificação', 0)
    RETURNING id INTO v_m_id;
  END IF;

  DELETE FROM public.academy_lessons WHERE module_id = v_m_id;
  INSERT INTO public.academy_lessons (module_id, course_id, title, description, video_url, duration_seconds, order_index, xp_reward, is_free)
  VALUES
    (v_m_id, v_c2_id, '1. O funil de vendas moderno', 'Do lead qualificado ao fechamento sem fricção', 'https://www.youtube.com/embed/aircAruvnKk', 600, 0, 50, true),
    (v_m_id, v_c2_id, '2. Cadências multicanal de prospecção', 'E-mail, WhatsApp e ligação combinados para alta taxa de resposta', 'https://www.youtube.com/embed/aircAruvnKk', 780, 1, 50, false),
    (v_m_id, v_c2_id, '3. SPIN Selling na prática', 'Perguntas estratégicas que aceleram a decisão de compra', 'https://www.youtube.com/embed/aircAruvnKk', 840, 2, 75, false),
    (v_m_id, v_c2_id, '4. Fechamento e superação de objeções', 'Contornando preço, timing e decisores', 'https://www.youtube.com/embed/aircAruvnKk', 720, 3, 100, false);


  -- ---------------------------------------------------------------------------
  -- 3. CURSO: Gestão que Escala & Finanças
  -- ---------------------------------------------------------------------------
  INSERT INTO public.academy_courses
    (slug, title, subtitle, description, category, level, accent, instructor, instructor_role,
     duration_minutes, total_lessons, xp_reward, tags, is_published, order_index,
     thumbnail_url, cover_url)
  VALUES
    ('gestao-que-escala', 'Gestão que Escala',
     'Processos, indicadores e finanças para donos de negócio',
     'Organize a operação do seu negócio com processos claros, KPIs que importam e controle financeiro descomplicado.',
     'administracao', 'iniciante', '#7C3AED', 'Carla Silveira', 'Consultora de Gestão & Finanças',
     300, 3, 500, ARRAY['processos','kpi','financeiro'], true, 3,
     'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
     'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&auto=format&fit=crop&q=80')
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    cover_url = EXCLUDED.cover_url,
    is_published = true
  RETURNING id INTO v_c3_id;

  SELECT id INTO v_m_id FROM public.academy_modules WHERE course_id = v_c3_id LIMIT 1;
  IF v_m_id IS NULL THEN
    INSERT INTO public.academy_modules (course_id, title, order_index)
    VALUES (v_c3_id, 'Operação e Controle Financeiro', 0)
    RETURNING id INTO v_m_id;
  END IF;

  DELETE FROM public.academy_lessons WHERE module_id = v_m_id;
  INSERT INTO public.academy_lessons (module_id, course_id, title, description, video_url, duration_seconds, order_index, xp_reward, is_free)
  VALUES
    (v_m_id, v_c3_id, '1. Mapeando processos operacionais', 'Desenhando o fluxo de entrega do seu negócio', 'https://www.youtube.com/embed/aircAruvnKk', 540, 0, 50, true),
    (v_m_id, v_c3_id, '2. KPIs e Métricas que importam', 'LTV, CAC, Payback e Margem de Contribuição', 'https://www.youtube.com/embed/aircAruvnKk', 600, 1, 50, false),
    (v_m_id, v_c3_id, '3. Fluxo de caixa e DRE sem sustos', 'Controle financeiro na prática para lucrar mais', 'https://www.youtube.com/embed/aircAruvnKk', 660, 2, 75, false);


  -- ---------------------------------------------------------------------------
  -- 4. CURSO: IA Aplicada a Negócios
  -- ---------------------------------------------------------------------------
  INSERT INTO public.academy_courses
    (slug, title, subtitle, description, category, level, accent, instructor, instructor_role,
     duration_minutes, total_lessons, xp_reward, tags, is_published, order_index,
     thumbnail_url, cover_url)
  VALUES
    ('ia-para-negocios', 'IA Aplicada a Negócios',
     'Automatize marketing, vendas e operação com inteligência artificial',
     'Do prompt à automação: use IA para produzir conteúdo, qualificar leads e escalar processos sem aumentar o time.',
     'ia', 'intermediario', '#F59E0B', 'Angelo Marques', 'Head de IA & Fundador',
     260, 3, 500, ARRAY['ia','automação','prompts'], true, 4,
     'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
     'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80')
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    cover_url = EXCLUDED.cover_url,
    is_published = true
  RETURNING id INTO v_c4_id;

  SELECT id INTO v_m_id FROM public.academy_modules WHERE course_id = v_c4_id LIMIT 1;
  IF v_m_id IS NULL THEN
    INSERT INTO public.academy_modules (course_id, title, order_index)
    VALUES (v_c4_id, 'IA na Prática', 0)
    RETURNING id INTO v_m_id;
  END IF;

  DELETE FROM public.academy_lessons WHERE module_id = v_m_id;
  INSERT INTO public.academy_lessons (module_id, course_id, title, description, video_url, duration_seconds, order_index, xp_reward, is_free)
  VALUES
    (v_m_id, v_c4_id, '1. Prompts que geram resultado', 'A anatomia de um bom prompt para negócios', 'https://www.youtube.com/embed/aircAruvnKk', 480, 0, 50, true),
    (v_m_id, v_c4_id, '2. Automação de conteúdo e criativos', 'Esteira completa de produção de conteúdo com IA', 'https://www.youtube.com/embed/aircAruvnKk', 600, 1, 50, false),
    (v_m_id, v_c4_id, '3. Agentes e SDRs inteligentes', 'IA qualificando leads e agendando reuniões no WhatsApp', 'https://www.youtube.com/embed/aircAruvnKk', 540, 2, 75, false);

END $$;
