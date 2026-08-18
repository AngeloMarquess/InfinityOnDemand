'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { Course, Module, Lesson, Enrollment, LessonProgress, Category, Level } from '@/lib/academy/types';

interface StudentProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  headline?: string;
  created_at: string;
}

interface GamificationRow {
  user_id: string;
  xp_total: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  lessons_completed: number;
  courses_completed: number;
}

interface CompanyRow {
  id: string;
  name: string;
  cnpj?: string;
  plan: string;
  seats_total: number;
  seats_used: number;
  active: boolean;
  created_at: string;
}

interface AchievementRow {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: string;
  unlocked_count?: number;
}

// Fallback initial demonstration catalog
const INITIAL_DEMO_COURSES: Course[] = [
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
    total_lessons: 12,
    xp_reward: 800,
    tags: ['IA', 'Marketing', 'Automação', 'Midjourney', 'ChatGPT'],
    is_published: true,
    is_featured: true,
    order_index: 1,
    created_at: new Date().toISOString(),
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
    total_lessons: 10,
    xp_reward: 600,
    tags: ['Vendas', 'SPIN Selling', 'B2B', 'Prospecção', 'Negociação'],
    is_published: true,
    is_featured: false,
    order_index: 2,
    created_at: new Date().toISOString(),
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
    total_lessons: 14,
    xp_reward: 700,
    tags: ['Finanças', 'KPIs', 'DRE', 'LTV', 'CAC'],
    is_published: true,
    is_featured: false,
    order_index: 3,
    created_at: new Date().toISOString(),
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
    total_lessons: 16,
    xp_reward: 900,
    tags: ['Meta Ads', 'Google Ads', 'Performance', 'Tráfego'],
    is_published: true,
    is_featured: false,
    order_index: 4,
    created_at: new Date().toISOString(),
  },
];

export default function AcademyAdminTab() {
  const [subTab, setSubTab] = useState<'overview' | 'courses' | 'lessons' | 'students' | 'instructors' | 'achievements' | 'b2b'>('overview');
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>(INITIAL_DEMO_COURSES);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [profiles, setProfiles] = useState<StudentProfile[]>([
    { id: 'u1', full_name: 'Angelo Marques', avatar_url: null, role: 'admin', headline: 'Diretor / Aluno VIP', created_at: '2026-08-01T10:00:00Z' },
    { id: 'u2', full_name: 'Mariana Lima', avatar_url: null, role: 'student', headline: 'Gestora de Tráfego', created_at: '2026-08-10T14:30:00Z' },
    { id: 'u3', full_name: 'Rodrigo Santos', avatar_url: null, role: 'student', headline: 'Analista de Vendas B2B', created_at: '2026-08-12T09:15:00Z' },
    { id: 'u4', full_name: 'Beatriz Costa', avatar_url: null, role: 'student', headline: 'Coordenadora de Marketing', created_at: '2026-08-15T18:40:00Z' },
  ]);
  const [gamification, setGamification] = useState<GamificationRow[]>([
    { user_id: 'u1', xp_total: 1250, level: 4, current_streak: 5, longest_streak: 12, lessons_completed: 18, courses_completed: 2 },
    { user_id: 'u2', xp_total: 750, level: 3, current_streak: 3, longest_streak: 7, lessons_completed: 11, courses_completed: 1 },
    { user_id: 'u3', xp_total: 350, level: 2, current_streak: 1, longest_streak: 4, lessons_completed: 6, courses_completed: 0 },
    { user_id: 'u4', xp_total: 150, level: 1, current_streak: 2, longest_streak: 2, lessons_completed: 3, courses_completed: 0 },
  ]);
  const [companies, setCompanies] = useState<CompanyRow[]>([
    { id: 'comp1', name: 'Nexus Tech Brasil', cnpj: '12.345.678/0001-90', plan: 'Business', seats_total: 10, seats_used: 8, active: true, created_at: '2026-07-15T10:00:00Z' },
    { id: 'comp2', name: 'Vanguard E-commerce', cnpj: '98.765.432/0001-10', plan: 'Team', seats_total: 5, seats_used: 3, active: true, created_at: '2026-08-02T11:20:00Z' },
  ]);
  const [achievements, setAchievements] = useState<AchievementRow[]>([
    { id: 'ach1', title: 'Primeiro Play', description: 'Assistiu à primeira aula na plataforma.', icon: '▶️', tier: 'bronze', unlocked_count: 24 },
    { id: 'ach2', title: 'Sprint 3 Dias', description: 'Manteve streak ativo por 3 dias consecutivos.', icon: '🔥', tier: 'bronze', unlocked_count: 18 },
    { id: 'ach3', title: 'Trilha de IA Dominada', description: 'Concluiu 100% da trilha de Inteligência Artificial.', icon: '🤖', tier: 'ouro', unlocked_count: 5 },
    { id: 'ach4', title: 'Primeira Venda Fechada', description: 'Completou o módulo de Closing do curso SPIN Selling.', icon: '💰', tier: 'prata', unlocked_count: 12 },
  ]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<Course | null>(null);

  // Modals
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Partial<Lesson> | null>(null);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  // Fetch admin data on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch('/api/academy/admin');
        const data = await res.json();
        if (data.success) {
          if (data.courses && data.courses.length > 0) setCourses(data.courses);
          if (data.modules && data.modules.length > 0) setModules(data.modules);
          if (data.lessons && data.lessons.length > 0) setLessons(data.lessons);
          if (data.profiles && data.profiles.length > 0) setProfiles(data.profiles);
          if (data.gamification && data.gamification.length > 0) setGamification(data.gamification);
          if (data.companies && data.companies.length > 0) setCompanies(data.companies);
          if (data.achievements && data.achievements.length > 0) setAchievements(data.achievements);
        }
      } catch (err) {
        console.log('Using local state for academy admin:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [courses, searchQuery, selectedCategory]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalCourses = courses.length;
    const publishedCourses = courses.filter((c) => c.is_published).length;
    const totalLessons = courses.reduce((acc, c) => acc + (c.total_lessons || 0), 0);
    const totalDurationMinutes = courses.reduce((acc, c) => acc + (c.duration_minutes || 0), 0);
    const totalStudents = profiles.length;
    const totalXpGiven = gamification.reduce((acc, g) => acc + (g.xp_total || 0), 0);
    const totalB2bSeats = companies.reduce((acc, comp) => acc + comp.seats_total, 0);
    const usedB2bSeats = companies.reduce((acc, comp) => acc + comp.seats_used, 0);

    return {
      totalCourses,
      publishedCourses,
      totalLessons,
      totalDurationHours: Math.round(totalDurationMinutes / 60),
      totalStudents,
      totalXpGiven,
      totalB2bSeats,
      usedB2bSeats,
    };
  }, [courses, profiles, gamification, companies]);

  // Course Save Handler
  async function handleSaveCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCourse?.title) return;

    const coursePayload: Partial<Course> = {
      ...editingCourse,
      slug: editingCourse.slug || editingCourse.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: editingCourse.category || 'marketing',
      level: editingCourse.level || 'iniciante',
      duration_minutes: Number(editingCourse.duration_minutes) || 60,
      total_lessons: Number(editingCourse.total_lessons) || 1,
      xp_reward: Number(editingCourse.xp_reward) || 500,
      is_published: editingCourse.is_published ?? true,
      is_featured: editingCourse.is_featured ?? false,
      accent: editingCourse.accent || '#00DB79',
    };

    try {
      const res = await fetch('/api/academy/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_course', payload: coursePayload }),
      });
      const data = await res.json();
      if (data.success && data.course) {
        if (editingCourse.id) {
          setCourses((prev) => prev.map((c) => (c.id === data.course.id ? data.course : c)));
        } else {
          setCourses((prev) => [data.course, ...prev]);
        }
      } else {
        // Local state update fallback
        if (editingCourse.id) {
          setCourses((prev) => prev.map((c) => (c.id === editingCourse.id ? { ...c, ...coursePayload } as Course : c)));
        } else {
          const newCourse = { ...coursePayload, id: `course_${Date.now()}`, created_at: new Date().toISOString() } as Course;
          setCourses((prev) => [newCourse, ...prev]);
        }
      }
    } catch {
      // Local fallback
      if (editingCourse.id) {
        setCourses((prev) => prev.map((c) => (c.id === editingCourse.id ? { ...c, ...coursePayload } as Course : c)));
      } else {
        const newCourse = { ...coursePayload, id: `course_${Date.now()}`, created_at: new Date().toISOString() } as Course;
        setCourses((prev) => [newCourse, ...prev]);
      }
    }

    setCourseModalOpen(false);
    setEditingCourse(null);
  }

  // Course Delete Handler
  async function handleDeleteCourse(id: string) {
    if (!confirm('Tem certeza que deseja excluir este curso e todas as suas aulas?')) return;
    try {
      await fetch('/api/academy/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_course', payload: { id } }),
      });
    } catch {
      // ignore
    }
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  // Course Toggle Featured/Published
  async function handleTogglePublish(course: Course) {
    const updated = { ...course, is_published: !course.is_published };
    setCourses((prev) => prev.map((c) => (c.id === course.id ? updated : c)));
    try {
      await fetch('/api/academy/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_course', payload: { id: course.id, is_published: !course.is_published } }),
      });
    } catch {
      // ignore
    }
  }

  return (
    <div style={{ color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      {/* ── Sub Navigation Header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        paddingBottom: 24,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: 32,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(0, 219, 121, 0.2), rgba(0, 170, 255, 0.2))',
            border: '1px solid rgba(0, 219, 121, 0.4)',
            display: 'grid', placeItems: 'center', fontSize: 22,
          }}>
            🎓
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              Infinity Academy <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(0, 219, 121, 0.15)', color: '#00DF81', border: '1px solid rgba(0, 219, 121, 0.3)' }}>LMS ADMIN</span>
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'rgba(255, 255, 255, 0.5)' }}>
              Gestão completa de cursos, módulos, aulas, alunos, instrutores e métricas B2B/B2C.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: 10 }}>
          <a
            href="/aluno"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 18px',
              borderRadius: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#fff',
              fontSize: 13.5,
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
          >
            <span>👁️</span> Ver como Aluno
          </a>

          <button
            onClick={() => {
              setEditingCourse({
                category: 'marketing',
                level: 'iniciante',
                duration_minutes: 120,
                total_lessons: 8,
                xp_reward: 500,
                is_published: true,
                is_featured: false,
                accent: '#00DB79',
              });
              setCourseModalOpen(true);
            }}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(90deg, #00DF81 0%, #00AAFF 100%)',
              color: '#06090f',
              fontSize: 13.5,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 18px rgba(0, 219, 121, 0.35)',
              transition: 'all 0.2s',
            }}
          >
            <span>+</span> Criar Novo Curso
          </button>
        </div>
      </div>

      {/* ── Sub Navigation Pills ── */}
      <div style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 4,
        marginBottom: 28,
        scrollbarWidth: 'none',
      }}>
        {[
          { id: 'overview' as const, label: 'Visão Geral & Métricas', icon: '📊' },
          { id: 'courses' as const, label: 'Cursos & Conteúdo', icon: '📚' },
          { id: 'students' as const, label: 'Alunos & Matrículas', icon: '👥' },
          { id: 'instructors' as const, label: 'Professores', icon: '👨‍🏫' },
          { id: 'achievements' as const, label: 'Gamificação & Badges', icon: '🏆' },
          { id: 'b2b' as const, label: 'Empresas (B2B)', icon: '🏢' },
        ].map((item) => {
          const isActive = subTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSubTab(item.id)}
              style={{
                padding: '10px 18px',
                borderRadius: 12,
                border: isActive ? '1px solid rgba(0, 219, 121, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                backgroundColor: isActive ? 'rgba(0, 219, 121, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                color: isActive ? '#00DF81' : 'rgba(255, 255, 255, 0.6)',
                fontSize: 13.5,
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 1. VISÃO GERAL & MÉTRICAS                                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'overview' && (
        <div>
          {/* Top Metric Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
            <div style={{ background: '#0d111a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>CURSOS ATIVOS</span>
                <span style={{ fontSize: 20 }}>📚</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{metrics.totalCourses}</div>
              <div style={{ fontSize: 12.5, color: '#00DF81', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>✓</span> {metrics.publishedCourses} publicados · {metrics.totalLessons} aulas gravadas
              </div>
            </div>

            <div style={{ background: '#0d111a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>ALUNOS MATRICULADOS</span>
                <span style={{ fontSize: 20 }}>👥</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{metrics.totalStudents}</div>
              <div style={{ fontSize: 12.5, color: '#00AAFF', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>🔥</span> {gamification.filter(g => g.current_streak > 0).length} ativos esta semana
              </div>
            </div>

            <div style={{ background: '#0d111a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>XP CONCEDIDO</span>
                <span style={{ fontSize: 20 }}>⚡</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#00DF81' }}>{metrics.totalXpGiven.toLocaleString('pt-BR')} XP</div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>
                Gamificação ativa em tempo real
              </div>
            </div>

            <div style={{ background: '#0d111a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>ASSENTOS B2B (EMPRESAS)</span>
                <span style={{ fontSize: 20 }}>🏢</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{metrics.usedB2bSeats} / {metrics.totalB2bSeats}</div>
              <div style={{ fontSize: 12.5, color: '#F59E0B', marginTop: 6 }}>
                {Math.round((metrics.usedB2bSeats / (metrics.totalB2bSeats || 1)) * 100)}% de ocupação corporativa
              </div>
            </div>
          </div>

          {/* Quick Track & Leaderboard Split */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }} className="acd-admin-grid">
            {/* Left: Tracks Overview */}
            <div style={{ background: '#0d111a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🎯</span> Distribuição das Trilhas de Treinamento
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                {[
                  { title: 'Marketing & Growth', cat: 'marketing', color: '#00DB79', icon: '📈', count: courses.filter(c => c.category === 'marketing').length },
                  { title: 'Vendas & SPIN B2B', cat: 'vendas', color: '#00AAFF', icon: '💰', count: courses.filter(c => c.category === 'vendas').length },
                  { title: 'Gestão & Finanças', cat: 'administracao', color: '#7C3AED', icon: '📊', count: courses.filter(c => c.category === 'administracao').length },
                  { title: 'IA & Automação', cat: 'ia', color: '#F59E0B', icon: '🤖', count: courses.filter(c => c.category === 'ia').length },
                ].map((track, i) => (
                  <div key={i} style={{
                    padding: 16,
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{track.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: 14.5, color: '#fff' }}>{track.title}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                      <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)' }}>{track.count} cursos cadastrados</span>
                      <button
                        onClick={() => { setSelectedCategory(track.cat); setSubTab('courses'); }}
                        style={{
                          background: 'none', border: 'none', color: track.color, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        Gerenciar →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Top Students Ranking */}
            <div style={{ background: '#0d111a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🏆</span> Ranking de Alunos (Top Engajamento)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {profiles.map((p, idx) => {
                  const g = gamification.find((item) => item.user_id === p.id) || { xp_total: 0, level: 1, current_streak: 0 };
                  return (
                    <div key={p.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 12,
                      background: idx === 0 ? 'rgba(0, 219, 121, 0.08)' : 'rgba(255,255,255,0.02)',
                      border: idx === 0 ? '1px solid rgba(0, 219, 121, 0.25)' : '1px solid rgba(255,255,255,0.05)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 8,
                          background: idx === 0 ? '#00DF81' : idx === 1 ? '#00AAFF' : 'rgba(255,255,255,0.1)',
                          color: idx === 0 ? '#000' : '#fff',
                          fontWeight: 800, fontSize: 12, display: 'grid', placeItems: 'center',
                        }}>
                          {idx + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13.5, color: '#fff' }}>{p.full_name}</div>
                          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>{p.headline || 'Aluno Academy'}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: 13, color: '#00DF81' }}>{g.xp_total} XP</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Nível {g.level} · 🔥 {g.current_streak}d</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 2. GESTÃO DE CURSOS & CONTEÚDO                                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'courses' && (
        <div>
          {/* Controls bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 14,
            marginBottom: 24,
          }}>
            {/* Search and Category Filter */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
              <input
                type="text"
                placeholder="🔍 Buscar curso por título, tag ou professor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  minWidth: 280,
                  padding: '11px 16px',
                  borderRadius: 10,
                  backgroundColor: '#0d111a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: 13.5,
                  outline: 'none',
                }}
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: '11px 16px',
                  borderRadius: 10,
                  backgroundColor: '#0d111a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: 13.5,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="all">Todas as Trilhas</option>
                <option value="marketing">Marketing</option>
                <option value="vendas">Vendas</option>
                <option value="administracao">Administração</option>
                <option value="ia">IA & Automação</option>
              </select>
            </div>

            <button
              onClick={() => {
                setEditingCourse({
                  category: 'marketing',
                  level: 'iniciante',
                  duration_minutes: 120,
                  total_lessons: 8,
                  xp_reward: 500,
                  is_published: true,
                  is_featured: false,
                  accent: '#00DB79',
                });
                setCourseModalOpen(true);
              }}
              style={{
                padding: '11px 22px',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(90deg, #00DF81 0%, #00AAFF 100%)',
                color: '#06090f',
                fontWeight: 800,
                fontSize: 13.5,
                cursor: 'pointer',
              }}
            >
              + Adicionar Novo Curso
            </button>
          </div>

          {/* Courses Table / Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                style={{
                  background: '#0d111a',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 18,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease',
                }}
              >
                {/* Course Header Thumbnail */}
                <div style={{
                  height: 140,
                  position: 'relative',
                  backgroundImage: `url(${course.thumbnail_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  padding: 14,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(13,17,26,0.95) 100%)' }} />
                  
                  <span style={{
                    position: 'relative',
                    zIndex: 2,
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    padding: '4px 9px',
                    borderRadius: 6,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: course.accent || '#00DF81',
                    border: `1px solid ${course.accent || '#00DF81'}44`,
                  }}>
                    {course.category}
                  </span>

                  <button
                    onClick={() => handleTogglePublish(course)}
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      padding: '4px 10px',
                      borderRadius: 6,
                      border: 'none',
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      backgroundColor: course.is_published ? 'rgba(0, 219, 121, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                      color: course.is_published ? '#00DF81' : '#fca5a5',
                    }}
                  >
                    {course.is_published ? '● Publicado' : '○ Rascunho'}
                  </button>
                </div>

                {/* Course Body */}
                <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 6px', lineHeight: 1.3 }}>
                    {course.title}
                  </h4>
                  <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', margin: '0 0 14px', lineHeight: 1.5, flex: 1 }}>
                    {course.subtitle || course.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.5)',
                    paddingTop: 12,
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    marginBottom: 16,
                  }}>
                    <span>⏱️ {course.duration_minutes} min</span>
                    <span>📖 {course.total_lessons} aulas</span>
                    <span style={{ color: '#00DF81', fontWeight: 700 }}>+{course.xp_reward} XP</span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <button
                      onClick={() => {
                        setEditingCourse(course);
                        setCourseModalOpen(true);
                      }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ✏️ Editar
                    </button>

                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#f87171',
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 3. ALUNOS & MATRÍCULAS                                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'students' && (
        <div>
          <div style={{
            background: '#0d111a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 18,
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Base de Alunos ({profiles.length})</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>
                  Gerencie permissões, XP, dias de ofensiva e matrículas ativas.
                </p>
              </div>

              <button
                onClick={() => alert('Para cadastrar um novo aluno, envie as credenciais ou utilize o SQL Editor do Supabase.')}
                style={{
                  padding: '9px 16px',
                  borderRadius: 8,
                  backgroundColor: 'rgba(0, 219, 121, 0.15)',
                  border: '1px solid rgba(0, 219, 121, 0.3)',
                  color: '#00DF81',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                + Convidar Aluno
              </button>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', fontSize: 11.5, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                    <th style={{ padding: '14px 24px' }}>ALUNO</th>
                    <th style={{ padding: '14px 16px' }}>PAPEL</th>
                    <th style={{ padding: '14px 16px' }}>NÍVEL</th>
                    <th style={{ padding: '14px 16px' }}>XP TOTAL</th>
                    <th style={{ padding: '14px 16px' }}>STREAK (OFENSIVA)</th>
                    <th style={{ padding: '14px 16px' }}>DATA CADASTRO</th>
                    <th style={{ padding: '14px 24px', textAlign: 'right' }}>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p) => {
                    const g = gamification.find((item) => item.user_id === p.id) || { xp_total: 0, level: 1, current_streak: 0 };
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: '50%',
                              backgroundColor: 'rgba(0, 219, 121, 0.2)',
                              color: '#00DF81', fontWeight: 800, fontSize: 14,
                              display: 'grid', placeItems: 'center',
                            }}>
                              {p.full_name ? p.full_name[0].toUpperCase() : 'A'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#fff' }}>{p.full_name || 'Sem nome'}</div>
                              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{p.headline || 'Aluno'}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px 16px' }}>
                          <span style={{
                            padding: '3px 8px', borderRadius: 6, fontSize: 11.5, fontWeight: 700,
                            backgroundColor: p.role === 'admin' ? 'rgba(0, 170, 255, 0.15)' : 'rgba(255,255,255,0.06)',
                            color: p.role === 'admin' ? '#00AAFF' : 'rgba(255,255,255,0.7)',
                          }}>
                            {p.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '16px 16px', fontWeight: 700, color: '#fff' }}>
                          Nível {g.level}
                        </td>
                        <td style={{ padding: '16px 16px', fontWeight: 800, color: '#00DF81' }}>
                          {g.xp_total} XP
                        </td>
                        <td style={{ padding: '16px 16px' }}>
                          🔥 {g.current_streak} dias
                        </td>
                        <td style={{ padding: '16px 16px', color: 'rgba(255,255,255,0.5)' }}>
                          {new Date(p.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <button
                            onClick={() => {
                              setSelectedStudent(p);
                              setStudentModalOpen(true);
                            }}
                            style={{
                              padding: '6px 14px', borderRadius: 8,
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                            }}
                          >
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 4. PROFESSORES & INSTRUTORES                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'instructors' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { name: 'Angelo Marques', role: 'Head de IA & Performance', bio: 'Especialista em inteligência artificial aplicada a marketing, sistemas de vendas e automações complexas.', courses: 3, students: 48, avatar: '👨‍💻' },
              { name: 'Lucas Andrade', role: 'Especialista em Vendas B2B', bio: 'Mais de 10 anos de experiência estruturando máquinas de vendas, cadências de outbound e fechamentos de alto ticket.', courses: 2, students: 35, avatar: '💼' },
              { name: 'Carla Silveira', role: 'CFO & Consultora Financeira', bio: 'Mestre em finanças corporativas, focada em métricas de unit economics, DRE e valuation para startups.', courses: 2, students: 28, avatar: '📊' },
            ].map((inst, i) => (
              <div key={i} style={{
                background: '#0d111a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 24,
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(0,219,121,0.15)', fontSize: 24, display: 'grid', placeItems: 'center' }}>
                    {inst.avatar}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#fff' }}>{inst.name}</h4>
                    <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#00DF81', fontWeight: 600 }}>{inst.role}</p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: 18, flex: 1 }}>
                  {inst.bio}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                  <span>📚 {inst.courses} cursos ativos</span>
                  <span>👥 {inst.students} alunos</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 5. GAMIFICAÇÃO & CONQUISTAS                                         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'achievements' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
            {achievements.map((ach) => (
              <div key={ach.id} style={{
                background: '#0d111a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20,
                textAlign: 'center', position: 'relative',
              }}>
                <span style={{
                  position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
                  padding: '3px 8px', borderRadius: 6,
                  backgroundColor: ach.tier === 'ouro' ? 'rgba(245, 158, 11, 0.2)' : ach.tier === 'prata' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(180, 83, 9, 0.2)',
                  color: ach.tier === 'ouro' ? '#F59E0B' : ach.tier === 'prata' ? '#94A3B8' : '#D97706',
                }}>
                  {ach.tier}
                </span>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{ach.icon}</div>
                <h4 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: '#fff' }}>{ach.title}</h4>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', margin: '0 0 14px', lineHeight: 1.4 }}>
                  {ach.description}
                </p>
                <div style={{ fontSize: 11.5, color: '#00DF81', fontWeight: 600 }}>
                  🏆 Desbloqueado por {ach.unlocked_count || 0} alunos
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 6. EMPRESAS (B2B)                                                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'b2b' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {companies.map((comp) => (
              <div key={comp.id} style={{
                background: '#0d111a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 22,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#fff' }}>{comp.name}</h4>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>CNPJ: {comp.cnpj || 'Não informado'}</p>
                  </div>
                  <span style={{
                    padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                    backgroundColor: 'rgba(0, 219, 121, 0.15)', color: '#00DF81',
                  }}>
                    PLANO {comp.plan.toUpperCase()}
                  </span>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Assentos Utilizados</span>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{comp.seats_used} / {comp.seats_total} ({Math.round((comp.seats_used / comp.seats_total) * 100)}%)</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(comp.seats_used / comp.seats_total) * 100}%`, background: 'linear-gradient(90deg, #00DF81, #00AAFF)' }} />
                  </div>
                </div>

                <button
                  onClick={() => alert(`Gerenciando assentos da empresa ${comp.name}`)}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 8,
                    backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  ⚙️ Gerenciar Assentos do Time
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MODAL: CRIAR / EDITAR CURSO                                         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {courseModalOpen && editingCourse && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)', zIndex: 1000,
          display: 'grid', placeItems: 'center', padding: 20,
        }}>
          <div style={{
            background: '#0d111a', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 20, width: '100%', maxWidth: 640, maxHeight: '90vh',
            overflowY: 'auto', padding: 32,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
                {editingCourse.id ? '✏️ Editar Curso' : '✨ Criar Novo Curso'}
              </h3>
              <button
                onClick={() => setCourseModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>TÍTULO DO CURSO</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: IA Generativa para Vendas e Marketing"
                  value={editingCourse.title || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 8, background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>SUBTÍTULO / SLOGAN</label>
                <input
                  type="text"
                  placeholder="Ex: Do zero à automação de fluxos comerciais"
                  value={editingCourse.subtitle || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, subtitle: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 8, background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>TRILHA / CATEGORIA</label>
                  <select
                    value={editingCourse.category || 'marketing'}
                    onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value as Category })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 8, background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                  >
                    <option value="marketing">Marketing & Growth</option>
                    <option value="vendas">Vendas & Comercial</option>
                    <option value="administracao">Administração & Finanças</option>
                    <option value="ia">IA & Automação</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>NÍVEL</label>
                  <select
                    value={editingCourse.level || 'iniciante'}
                    onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value as Level })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 8, background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                  >
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>DURAÇÃO (MIN)</label>
                  <input
                    type="number"
                    value={editingCourse.duration_minutes || 60}
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration_minutes: Number(e.target.value) })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 8, background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>AULAS</label>
                  <input
                    type="number"
                    value={editingCourse.total_lessons || 1}
                    onChange={(e) => setEditingCourse({ ...editingCourse, total_lessons: Number(e.target.value) })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 8, background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>XP RECOMPENSA</label>
                  <input
                    type="number"
                    value={editingCourse.xp_reward || 500}
                    onChange={(e) => setEditingCourse({ ...editingCourse, xp_reward: Number(e.target.value) })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 8, background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>PROFESSOR / INSTRUTOR</label>
                <input
                  type="text"
                  placeholder="Ex: Angelo Marques"
                  value={editingCourse.instructor || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 8, background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>URL DA THUMBNAIL (IMAGEM)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={editingCourse.thumbnail_url || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, thumbnail_url: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 8, background: '#080c14', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 24, marginTop: 6 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13.5 }}>
                  <input
                    type="checkbox"
                    checked={editingCourse.is_published ?? true}
                    onChange={(e) => setEditingCourse({ ...editingCourse, is_published: e.target.checked })}
                    style={{ accentColor: '#00DF81', width: 18, height: 18 }}
                  />
                  <span>Publicado na plataforma</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13.5 }}>
                  <input
                    type="checkbox"
                    checked={editingCourse.is_featured ?? false}
                    onChange={(e) => setEditingCourse({ ...editingCourse, is_featured: e.target.checked })}
                    style={{ accentColor: '#00DF81', width: 18, height: 18 }}
                  />
                  <span>Destaque no Hero (Netflix)</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 14 }}>
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(false)}
                  style={{ padding: '12px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ padding: '12px 24px', borderRadius: 10, background: 'linear-gradient(90deg, #00DF81, #00AAFF)', border: 'none', color: '#06090f', fontWeight: 800, cursor: 'pointer' }}
                >
                  Salvar Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MODAL: DETALHES DO ALUNO                                            */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {studentModalOpen && selectedStudent && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)', zIndex: 1000,
          display: 'grid', placeItems: 'center', padding: 20,
        }}>
          <div style={{
            background: '#0d111a', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 20, width: '100%', maxWidth: 500, padding: 32,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Perfil do Aluno</h3>
              <button
                onClick={() => setStudentModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,219,121,0.2)',
                color: '#00DF81', fontWeight: 800, fontSize: 20, display: 'grid', placeItems: 'center',
              }}>
                {selectedStudent.full_name ? selectedStudent.full_name[0].toUpperCase() : 'A'}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{selectedStudent.full_name}</h4>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>ID: {selectedStudent.id}</p>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#00DF81' }}>{selectedStudent.role.toUpperCase()}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>XP ACUMULADO</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#00DF81' }}>
                  {gamification.find(g => g.user_id === selectedStudent.id)?.xp_total || 0} XP
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>OFENSIVA ATUAL</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#00AAFF' }}>
                  🔥 {gamification.find(g => g.user_id === selectedStudent.id)?.current_streak || 0} dias
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setStudentModalOpen(false)}
                style={{ padding: '10px 20px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
