'use client';

import { getSupabase } from '@/lib/supabase';
import type {
  Course, Module, Lesson, Enrollment, LessonProgress, Gamification, Achievement,
} from './types';

// ------------------------------------------------------------------ AUTH
export async function getUser() {
  const { data } = await getSupabase().auth.getUser();
  return data.user ?? null;
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

// --------------------------------------------------------------- CATALOG
export async function fetchCourses(): Promise<Course[]> {
  const { data } = await getSupabase()
    .from('academy_courses')
    .select('*')
    .eq('is_published', true)
    .order('order_index', { ascending: true });
  return (data as Course[]) ?? [];
}

export async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  const { data } = await getSupabase()
    .from('academy_courses').select('*').eq('slug', slug).maybeSingle();
  return (data as Course) ?? null;
}

export async function fetchCourseContent(courseId: string): Promise<Module[]> {
  const { data: modules } = await getSupabase()
    .from('academy_modules').select('*').eq('course_id', courseId)
    .order('order_index', { ascending: true });
  const { data: lessons } = await getSupabase()
    .from('academy_lessons').select('*').eq('course_id', courseId)
    .order('order_index', { ascending: true });

  const mods = (modules as Omit<Module, 'lessons'>[]) ?? [];
  const les = (lessons as Lesson[]) ?? [];
  // Se não houver módulos, cria um módulo virtual com todas as aulas
  if (mods.length === 0 && les.length > 0) {
    return [{ id: 'default', course_id: courseId, title: 'Conteúdo', order_index: 0, lessons: les }];
  }
  return mods.map((m) => ({ ...m, lessons: les.filter((l) => l.module_id === m.id) }));
}

// ------------------------------------------------------------- ENROLLMENT
export async function fetchEnrollments(): Promise<Enrollment[]> {
  const { data } = await getSupabase().from('academy_enrollments').select('*');
  return (data as Enrollment[]) ?? [];
}

export async function enroll(courseId: string) {
  return getSupabase().rpc('academy_enroll', { p_course: courseId });
}

// --------------------------------------------------------------- PROGRESS
export async function fetchCourseProgress(courseId: string): Promise<LessonProgress[]> {
  const { data } = await getSupabase()
    .from('academy_lesson_progress').select('lesson_id, course_id, position_seconds, duration_seconds, completed')
    .eq('course_id', courseId);
  return (data as LessonProgress[]) ?? [];
}

export async function fetchAllProgress(): Promise<LessonProgress[]> {
  const { data } = await getSupabase()
    .from('academy_lesson_progress')
    .select('lesson_id, course_id, position_seconds, duration_seconds, completed');
  return (data as LessonProgress[]) ?? [];
}

export async function savePosition(lessonId: string, position: number, duration: number) {
  return getSupabase().rpc('academy_save_position', {
    p_lesson: lessonId, p_position: Math.floor(position), p_duration: Math.floor(duration),
  });
}

export async function completeLesson(lessonId: string) {
  return getSupabase().rpc('academy_complete_lesson', { p_lesson: lessonId });
}

// ----------------------------------------------------------- GAMIFICATION
export async function fetchGamification(): Promise<Gamification | null> {
  const { data } = await getSupabase().from('academy_gamification').select('*').maybeSingle();
  return (data as Gamification) ?? null;
}

export async function fetchAchievements(): Promise<Achievement[]> {
  const [all, unlocked] = await Promise.all([
    getSupabase().from('academy_achievements').select('*'),
    getSupabase().from('academy_user_achievements').select('achievement_id'),
  ]);
  const unlockedIds = new Set(((unlocked.data as { achievement_id: string }[]) ?? []).map((u) => u.achievement_id));
  return ((all.data as Achievement[]) ?? []).map((a) => ({ ...a, unlocked: unlockedIds.has(a.id) }));
}

export interface RankRow { user_id: string; full_name: string | null; xp_total: number; level: number; }
export async function fetchLeaderboard(): Promise<RankRow[]> {
  // Requer uma view pública opcional; retorna vazio se não existir.
  const { data } = await getSupabase()
    .from('academy_leaderboard').select('*').order('xp_total', { ascending: false }).limit(10);
  return (data as RankRow[]) ?? [];
}
