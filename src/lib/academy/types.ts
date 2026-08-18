export type Category = 'marketing' | 'vendas' | 'administracao' | 'ia';
export type Level = 'iniciante' | 'intermediario' | 'avancado';

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  category: Category;
  level: Level;
  thumbnail_url: string | null;
  cover_url: string | null;
  accent: string;
  instructor: string | null;
  instructor_role: string | null;
  duration_minutes: number;
  total_lessons: number;
  xp_reward: number;
  tags: string[];
  is_published: boolean;
  is_featured: boolean;
  order_index: number;
}

export interface Lesson {
  id: string;
  module_id: string | null;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number;
  order_index: number;
  xp_reward: number;
  is_free: boolean;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  lessons: Lesson[];
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  progress_pct: number;
  last_lesson_id: string | null;
  enrolled_at: string;
  completed_at: string | null;
}

export interface LessonProgress {
  lesson_id: string;
  course_id: string;
  position_seconds: number;
  duration_seconds: number;
  completed: boolean;
}

export interface Gamification {
  user_id: string;
  xp_total: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  lessons_completed: number;
  courses_completed: number;
  last_activity_date: string | null;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string | null;
  icon: string;
  xp_reward: number;
  tier: 'bronze' | 'prata' | 'ouro';
  unlocked?: boolean;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  marketing: 'Marketing',
  vendas: 'Vendas',
  administracao: 'Administração',
  ia: 'IA & Automação',
};

export const LEVEL_LABELS: Record<Level, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

// XP necessário para atingir determinado nível (inverso de academy_level_from_xp)
export function xpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

export function levelProgress(xp: number, level: number): { current: number; needed: number; pct: number } {
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const current = xp - base;
  const needed = next - base;
  return { current, needed, pct: needed > 0 ? Math.min(100, (current / needed) * 100) : 100 };
}
