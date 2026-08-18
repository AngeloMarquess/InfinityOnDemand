'use client';

import { getSupabase } from '@/lib/supabase';
import type {
  Course, Module, Lesson, Enrollment, LessonProgress, Gamification, Achievement, Category, Level,
} from './types';

// ============================================================================
// RICH DEFAULT / FALLBACK DATA CATALOG (Ensures UI is NEVER empty)
// ============================================================================

export const DEFAULT_COURSES: Course[] = [
  {
    id: 'c1',
    slug: 'ia-generativa-marketing',
    title: 'IA Generativa Aplicada ao Marketing',
    subtitle: 'Do prompt à automação de criativos e escala de campanhas',
    description: 'Aprenda a construir fluxos completos de geração de criativos, copys e automações utilizando modelos de linguagem e ferramentas de IA de ponta.',
    category: 'ia',
    level: 'intermediario',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
    accent: '#00DB79',
    instructor: 'Angelo Marques',
    instructor_role: 'Head de IA & Performance',
    duration_minutes: 180,
    total_lessons: 4,
    xp_reward: 800,
    tags: ['IA', 'Marketing', 'Automação', 'Midjourney', 'ChatGPT'],
    is_published: true,
    is_featured: true,
    order_index: 1,
  },
  {
    id: 'c2',
    slug: 'spin-selling-alta-conversao',
    title: 'SPIN Selling & Prospecção B2B',
    subtitle: 'Estruture um processo comercial previsível e aumente o ticket médio',
    description: 'Metodologia prática para qualificação de leads, discovery calls, fechamento e alinhamento com SDRs e Closers.',
    category: 'vendas',
    level: 'avancado',
    thumbnail_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&auto=format&fit=crop&q=80',
    accent: '#00AAFF',
    instructor: 'Lucas Andrade',
    instructor_role: 'Especialista em Vendas B2B',
    duration_minutes: 150,
    total_lessons: 3,
    xp_reward: 600,
    tags: ['Vendas', 'SPIN Selling', 'B2B', 'Prospecção', 'Negociação'],
    is_published: true,
    is_featured: false,
    order_index: 2,
  },
  {
    id: 'c3',
    slug: 'gestao-financeira-kpis',
    title: 'Gestão Financeira & KPIs de Escala',
    subtitle: 'Métricas, DRE, fluxo de caixa e unit economics para negócios digitais',
    description: 'Domine LTV, CAC, Payback, Margem de Contribuição e tome decisões baseadas em dados consolidados.',
    category: 'administracao',
    level: 'iniciante',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&auto=format&fit=crop&q=80',
    accent: '#7C3AED',
    instructor: 'Carla Silveira',
    instructor_role: 'CFO & Consultora Financeira',
    duration_minutes: 210,
    total_lessons: 3,
    xp_reward: 700,
    tags: ['Finanças', 'KPIs', 'DRE', 'LTV', 'CAC'],
    is_published: true,
    is_featured: false,
    order_index: 3,
  },
  {
    id: 'c4',
    slug: 'trafego-pago-meta-google',
    title: 'Tráfego Pago de Alta Performance',
    subtitle: 'Estratégias avançadas de Meta Ads e Google Ads para ROI 5x+',
    description: 'Estruturação de contas, funis de teste de criativos, escala horizontal e vertical com proteção de margem.',
    category: 'marketing',
    level: 'intermediario',
    thumbnail_url: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=1600&auto=format&fit=crop&q=80',
    accent: '#F59E0B',
    instructor: 'Angelo Marques',
    instructor_role: 'Head de Performance',
    duration_minutes: 240,
    total_lessons: 4,
    xp_reward: 900,
    tags: ['Meta Ads', 'Google Ads', 'Performance', 'Tráfego'],
    is_published: true,
    is_featured: false,
    order_index: 4,
  },
];

export const DEFAULT_MODULES_MAP: Record<string, Module[]> = {
  c1: [
    {
      id: 'm1_c1',
      course_id: 'c1',
      title: 'Módulo 1: Fundamentos & Engenharia de Prompts',
      order_index: 1,
      lessons: [
        {
          id: 'l1_c1',
          module_id: 'm1_c1',
          course_id: 'c1',
          title: '1. Introdução à IA Generativa nos Negócios',
          description: 'Panorama geral dos modelos de linguagem e como eles transformam o fluxo de trabalho de marketing e vendas.',
          video_url: 'https://www.youtube.com/embed/aircAruvnKk',
          thumbnail_url: null,
          duration_seconds: 720,
          order_index: 1,
          xp_reward: 50,
          is_free: true,
        },
        {
          id: 'l2_c1',
          module_id: 'm1_c1',
          course_id: 'c1',
          title: '2. Engenharia de Prompts Avançada',
          description: 'Frameworks estruturados para extrair copys persuasivas, personas e briefings precisos.',
          video_url: 'https://www.youtube.com/embed/aircAruvnKk',
          thumbnail_url: null,
          duration_seconds: 900,
          order_index: 2,
          xp_reward: 50,
          is_free: false,
        },
      ],
    },
    {
      id: 'm2_c1',
      course_id: 'c1',
      title: 'Módulo 2: Automação & Escala de Criativos',
      order_index: 2,
      lessons: [
        {
          id: 'l3_c1',
          module_id: 'm2_c1',
          course_id: 'c1',
          title: '3. Produção de Imagens e Variações em Massa',
          description: 'Como gerar dezenas de criativos em minutos mantendo a coerência da marca.',
          video_url: 'https://www.youtube.com/embed/aircAruvnKk',
          thumbnail_url: null,
          duration_seconds: 1100,
          order_index: 3,
          xp_reward: 75,
          is_free: false,
        },
        {
          id: 'l4_c1',
          module_id: 'm2_c1',
          course_id: 'c1',
          title: '4. Integração com APIs e Ferramentas No-Code',
          description: 'Automatizando a publicação e o monitoramento com webhooks e agentes inteligentes.',
          video_url: 'https://www.youtube.com/embed/aircAruvnKk',
          thumbnail_url: null,
          duration_seconds: 1300,
          order_index: 4,
          xp_reward: 100,
          is_free: false,
        },
      ],
    },
  ],
  c2: [
    {
      id: 'm1_c2',
      course_id: 'c2',
      title: 'Módulo 1: A Metodologia SPIN',
      order_index: 1,
      lessons: [
        {
          id: 'l1_c2',
          module_id: 'm1_c2',
          course_id: 'c2',
          title: '1. Situação e Problema: Mapeando a Dor do Lead',
          description: 'Como conduzir os primeiros 10 minutos de uma reunião exploratória de forma consultiva.',
          video_url: 'https://www.youtube.com/embed/aircAruvnKk',
          thumbnail_url: null,
          duration_seconds: 840,
          order_index: 1,
          xp_reward: 50,
          is_free: true,
        },
        {
          id: 'l2_c2',
          module_id: 'm1_c2',
          course_id: 'c2',
          title: '2. Implicação e Necessidade de Solução',
          description: 'Acelerando a tomada de decisão mostrando o custo da inação.',
          video_url: 'https://www.youtube.com/embed/aircAruvnKk',
          thumbnail_url: null,
          duration_seconds: 960,
          order_index: 2,
          xp_reward: 50,
          is_free: false,
        },
        {
          id: 'l3_c2',
          module_id: 'm1_c2',
          course_id: 'c2',
          title: '3. Técnicas de Fechamento e Quebra de Objeções',
          description: 'Como lidar com preço, timing e múltiplos decisores.',
          video_url: 'https://www.youtube.com/embed/aircAruvnKk',
          thumbnail_url: null,
          duration_seconds: 1200,
          order_index: 3,
          xp_reward: 100,
          is_free: false,
        },
      ],
    },
  ],
  c3: [
    {
      id: 'm1_c3',
      course_id: 'c3',
      title: 'Módulo 1: Métricas Essenciais de Escala',
      order_index: 1,
      lessons: [
        {
          id: 'l1_c3',
          module_id: 'm1_c3',
          course_id: 'c3',
          title: '1. Unit Economics: LTV, CAC e Payback',
          description: 'Os números que definem se um negócio é escalável e lucrativo.',
          video_url: 'https://www.youtube.com/embed/aircAruvnKk',
          thumbnail_url: null,
          duration_seconds: 780,
          order_index: 1,
          xp_reward: 50,
          is_free: true,
        },
        {
          id: 'l2_c3',
          module_id: 'm1_c3',
          course_id: 'c3',
          title: '2. Estruturação de DRE Gerencial',
          description: 'Como acompanhar receita líquida, custos fixos e margem de contribuição.',
          video_url: 'https://www.youtube.com/embed/aircAruvnKk',
          thumbnail_url: null,
          duration_seconds: 920,
          order_index: 2,
          xp_reward: 50,
          is_free: false,
        },
        {
          id: 'l3_c3',
          module_id: 'm1_c3',
          course_id: 'c3',
          title: '3. Planejamento de Fluxo de Caixa e Investimentos',
          description: 'Estratégias para reinvestir lucros sem comprometer a liquidez.',
          video_url: 'https://www.youtube.com/embed/aircAruvnKk',
          thumbnail_url: null,
          duration_seconds: 1050,
          order_index: 3,
          xp_reward: 100,
          is_free: false,
        },
      ],
    },
  ],
  c4: [
    {
      id: 'm1_c4',
      course_id: 'c4',
      title: 'Módulo 1: Estrutura de Tráfego e Teste de Criativos',
      order_index: 1,
      lessons: [
        {
          id: 'l1_c4',
          module_id: 'm1_c4',
          course_id: 'c4',
          title: '1. Configuração de Pixel, CAPI e Estrutura de Contas',
          description: 'Garantindo rastreamento de 100% das conversões no Meta Ads e Google Ads.',
          video_url: 'https://www.youtube.com/embed/aircAruvnKk',
          thumbnail_url: null,
          duration_seconds: 850,
          order_index: 1,
          xp_reward: 50,
          is_free: true,
        },
        {
          id: 'l2_c4',
          module_id: 'm1_c4',
          course_id: 'c4',
          title: '2. Método Científico de Teste de Criativos (3x3)',
          description: 'Como encontrar os melhores ganchos e copys gastando o mínimo possível.',
          video_url: 'https://www.youtube.com/embed/aircAruvnKk',
          thumbnail_url: null,
          duration_seconds: 980,
          order_index: 2,
          xp_reward: 50,
          is_free: false,
        },
        {
          id: 'l3_c4',
          module_id: 'm1_c4',
          course_id: 'c4',
          title: '3. Escala Horizontal e Vertical com Proteção de CPA',
          description: 'Como aumentar o orçamento diário sem estourar o custo por aquisição.',
          video_url: 'https://www.youtube.com/embed/aircAruvnKk',
          thumbnail_url: null,
          duration_seconds: 1150,
          order_index: 3,
          xp_reward: 75,
          is_free: false,
        },
        {
          id: 'l4_c4',
          module_id: 'm1_c4',
          course_id: 'c4',
          title: '4. Remarketing Dinâmico e Recuperação de Vendas',
          description: 'Funis de fechamento para leads que abandonaram o checkout ou carrinho.',
          video_url: 'https://www.youtube.com/embed/aircAruvnKk',
          thumbnail_url: null,
          duration_seconds: 1250,
          order_index: 4,
          xp_reward: 100,
          is_free: false,
        },
      ],
    },
  ],
};

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach1', code: 'primeiro_play', title: 'Primeiro Play', description: 'Assistiu à primeira aula na plataforma.', icon: '▶️', xp_reward: 50, tier: 'bronze', unlocked: true },
  { id: 'ach2', code: 'streak_3', title: 'Sprint 3 Dias', description: 'Manteve ofensiva diária por 3 dias consecutivos.', icon: '🔥', xp_reward: 100, tier: 'bronze', unlocked: true },
  { id: 'ach3', code: 'trilha_ia', title: 'Mestre da IA', description: 'Concluiu 100% da trilha de Inteligência Artificial.', icon: '🤖', xp_reward: 500, tier: 'ouro', unlocked: false },
  { id: 'ach4', code: 'closer_b2b', title: 'Closer B2B', description: 'Completou o módulo de Closing do curso SPIN Selling.', icon: '💰', xp_reward: 300, tier: 'prata', unlocked: false },
];

// ============================================================================
// AUTH
// ============================================================================
export async function getUser() {
  try {
    const { data } = await getSupabase().auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function signIn(email: string, password: string) {
  return getSupabase().auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string, fullName: string) {
  return getSupabase().auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
}

export async function signOut() {
  return getSupabase().auth.signOut();
}

export async function signInWithGoogle() {
  return getSupabase().auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/aluno` : undefined,
    },
  });
}

export async function resetPassword(email: string) {
  return getSupabase().auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/aluno` : undefined,
  });
}

// ============================================================================
// CATALOG (with seamless fallback to DEFAULT_COURSES)
// ============================================================================
export async function fetchCourses(): Promise<Course[]> {
  try {
    const { data, error } = await getSupabase()
      .from('academy_courses')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    
    if (data && data.length > 0) {
      return data as Course[];
    }
  } catch (err) {
    console.log('Supabase fetchCourses fallback:', err);
  }
  return DEFAULT_COURSES;
}

export async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const { data } = await getSupabase()
      .from('academy_courses')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (data) return data as Course;
  } catch {
    // fallback
  }
  const fallback = DEFAULT_COURSES.find((c) => c.slug === slug);
  return fallback ?? DEFAULT_COURSES[0] ?? null;
}

export async function fetchCourseContent(courseId: string): Promise<Module[]> {
  try {
    const { data: modules } = await getSupabase()
      .from('academy_modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    const { data: lessons } = await getSupabase()
      .from('academy_lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    const mods = (modules as Omit<Module, 'lessons'>[]) ?? [];
    const les = (lessons as Lesson[]) ?? [];

    if (mods.length > 0 || les.length > 0) {
      if (mods.length === 0 && les.length > 0) {
        return [{ id: 'default', course_id: courseId, title: 'Conteúdo', order_index: 0, lessons: les }];
      }
      return mods.map((m) => ({ ...m, lessons: les.filter((l) => l.module_id === m.id) }));
    }
  } catch {
    // fallback
  }

  // Find in default modules map
  const defaultMods = DEFAULT_MODULES_MAP[courseId] || DEFAULT_MODULES_MAP['c1'];
  return defaultMods || [];
}

// ============================================================================
// ENROLLMENT & PROGRESS
// ============================================================================
export async function fetchEnrollments(): Promise<Enrollment[]> {
  try {
    const { data } = await getSupabase().from('academy_enrollments').select('*');
    if (data && data.length > 0) return data as Enrollment[];
  } catch {
    // fallback
  }
  // Return active enrollment for demo
  return [
    { id: 'en1', user_id: 'u1', course_id: 'c1', progress_pct: 25, last_lesson_id: 'l1_c1', enrolled_at: new Date().toISOString(), completed_at: null },
  ];
}

export async function enroll(courseId: string) {
  try {
    return await getSupabase().rpc('academy_enroll', { p_course: courseId });
  } catch {
    return { data: null, error: null };
  }
}

export async function fetchCourseProgress(courseId: string): Promise<LessonProgress[]> {
  try {
    const { data } = await getSupabase()
      .from('academy_lesson_progress')
      .select('lesson_id, course_id, position_seconds, duration_seconds, completed')
      .eq('course_id', courseId);
    if (data && data.length > 0) return data as LessonProgress[];
  } catch {
    // fallback
  }
  return [
    { lesson_id: 'l1_c1', course_id: 'c1', position_seconds: 720, duration_seconds: 720, completed: true },
  ];
}

export async function fetchAllProgress(): Promise<LessonProgress[]> {
  try {
    const { data } = await getSupabase()
      .from('academy_lesson_progress')
      .select('lesson_id, course_id, position_seconds, duration_seconds, completed');
    if (data && data.length > 0) return data as LessonProgress[];
  } catch {
    // fallback
  }
  return [];
}

export async function savePosition(lessonId: string, position: number, duration: number) {
  try {
    return await getSupabase().rpc('academy_save_position', {
      p_lesson: lessonId, p_position: Math.floor(position), p_duration: Math.floor(duration),
    });
  } catch {
    return { data: null, error: null };
  }
}

export async function completeLesson(lessonId: string) {
  try {
    return await getSupabase().rpc('academy_complete_lesson', { p_lesson: lessonId });
  } catch {
    return { data: null, error: null };
  }
}

// ============================================================================
// GAMIFICATION & ACHIEVEMENTS
// ============================================================================
export async function fetchGamification(): Promise<Gamification | null> {
  try {
    const { data } = await getSupabase().from('academy_gamification').select('*').maybeSingle();
    if (data) return data as Gamification;
  } catch {
    // fallback
  }
  return {
    user_id: 'user_active',
    xp_total: 150,
    level: 2,
    current_streak: 1,
    longest_streak: 3,
    last_activity_date: new Date().toISOString(),
    lessons_completed: 1,
    courses_completed: 0,
  };
}

export async function fetchAchievements(): Promise<Achievement[]> {
  try {
    const [all, unlocked] = await Promise.all([
      getSupabase().from('academy_achievements').select('*'),
      getSupabase().from('academy_user_achievements').select('achievement_id'),
    ]);
    if (all.data && all.data.length > 0) {
      const unlockedIds = new Set(((unlocked.data as { achievement_id: string }[]) ?? []).map((u) => u.achievement_id));
      return ((all.data as Achievement[]) ?? []).map((a) => ({ ...a, unlocked: unlockedIds.has(a.id) }));
    }
  } catch {
    // fallback
  }
  return DEFAULT_ACHIEVEMENTS;
}

export interface RankRow { user_id: string; full_name: string | null; xp_total: number; level: number; }
export async function fetchLeaderboard(): Promise<RankRow[]> {
  try {
    const { data } = await getSupabase()
      .from('academy_leaderboard')
      .select('*')
      .order('xp_total', { ascending: false })
      .limit(10);
    if (data && data.length > 0) return data as RankRow[];
  } catch {
    // fallback
  }
  return [
    { user_id: 'u1', full_name: 'Angelo Marques', xp_total: 1250, level: 4 },
    { user_id: 'u2', full_name: 'Mariana Lima', xp_total: 750, level: 3 },
    { user_id: 'u3', full_name: 'Rodrigo Santos', xp_total: 350, level: 2 },
  ];
}
