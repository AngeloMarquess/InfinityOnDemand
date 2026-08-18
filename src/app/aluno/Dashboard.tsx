'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import {
  fetchCourses, fetchEnrollments, fetchAllProgress, fetchGamification, fetchAchievements, signOut,
} from '@/lib/academy/client';
import type { Course, Enrollment, LessonProgress, Gamification, Achievement } from '@/lib/academy/types';
import { CATEGORY_LABELS, type Category } from '@/lib/academy/types';
import { Brand, GamificationBar, CourseCard, catGrad, fmtMin } from './ui';

export default function Dashboard({ user }: { user: User }) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [gam, setGam] = useState<Gamification | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const [c, e, p, g, a] = await Promise.all([
        fetchCourses(), fetchEnrollments(), fetchAllProgress(), fetchGamification(), fetchAchievements(),
      ]);
      setCourses(c); setEnrollments(e); setProgress(p); setGam(g); setAchievements(a);
      setLoading(false);
    })();
  }, []);

  const progByCourse = useMemo(() => {
    const m: Record<string, number> = {};
    for (const en of enrollments) m[en.course_id] = en.progress_pct;
    return m;
  }, [enrollments]);

  const open = (c: Course) => router.push(`/aluno/curso/${c.slug}`);

  const featured = courses.find((c) => c.is_featured) ?? courses[0];
  const continueList = courses.filter((c) => (progByCourse[c.id] ?? 0) > 0 && (progByCourse[c.id] ?? 0) < 100);
  const categories: Category[] = ['marketing', 'vendas', 'administracao', 'ia'];

  const firstName = (user.user_metadata?.full_name || user.email || 'Aluno').split(' ')[0];

  async function handleSignOut() { await signOut(); router.refresh(); window.location.reload(); }

  if (loading) {
    return <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', color: 'var(--text-secondary)' }}>Carregando sua área…</div>;
  }

  return (
    <>
      {/* Topbar */}
      <div className="alu-topbar">
        <Brand />
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <GamificationBar gam={gam} />
          <div style={{ position: 'relative' }}>
            <div className="alu-avatar" onClick={() => setMenuOpen((o) => !o)} title={firstName}>
              {firstName.charAt(0).toUpperCase()}
            </div>
            {menuOpen && (
              <div style={{ position: 'absolute', right: 0, top: 44, background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 8, minWidth: 180, zIndex: 60 }}>
                <div style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text-secondary)' }}>{user.email}</div>
                <div onClick={handleSignOut} style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }} className="alu-lesson-item">Sair</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero featured */}
      {featured && (
        <section className="alu-hero" style={{ overflow: 'hidden' }}>
          <div className="alu-hero-bg" style={{ background: featured.cover_url ? `url(${featured.cover_url}) center/cover` : catGrad(featured.category) }} />
          <div className="alu-hero-inner">
            <div className="alu-hero-cat">👋 Olá, {firstName} · {CATEGORY_LABELS[featured.category]}</div>
            <h1 className="alu-hero-title">{featured.title}</h1>
            <p className="alu-hero-sub">{featured.subtitle}</p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button className="btn-primary" style={{ padding: '14px 32px', color: '#fff' }} onClick={() => open(featured)}>
                ▶ {(progByCourse[featured.id] ?? 0) > 0 ? 'Continuar' : 'Começar agora'}
              </button>
              <span style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-secondary)', fontSize: 14, gap: 8 }}>
                {featured.total_lessons} aulas · {fmtMin(featured.duration_minutes)} · +{featured.xp_reward} XP
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Continue assistindo */}
      {continueList.length > 0 && (
        <div className="alu-row">
          <div className="alu-row-head"><div className="alu-row-title">Continue de onde parou</div></div>
          <div className="alu-track">
            {continueList.map((c) => (
              <CourseCard key={c.id} course={c} progress={progByCourse[c.id]} wide onOpen={open} />
            ))}
          </div>
        </div>
      )}

      {/* Rows por categoria */}
      {categories.map((cat) => {
        const list = courses.filter((c) => c.category === cat);
        if (!list.length) return null;
        return (
          <div className="alu-row" key={cat}>
            <div className="alu-row-head"><div className="alu-row-title">{CATEGORY_LABELS[cat]}</div></div>
            <div className="alu-track">
              {list.map((c) => (<CourseCard key={c.id} course={c} progress={progByCourse[c.id]} onOpen={open} />))}
            </div>
          </div>
        );
      })}

      {/* Conquistas */}
      <div className="alu-section-pad" style={{ paddingTop: 10, paddingBottom: 60 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="alu-row-title">Conquistas</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {achievements.filter((a) => a.unlocked).length}/{achievements.length} desbloqueadas
          </div>
        </div>
        <div className="alu-ach-grid">
          {achievements.map((a) => (
            <div key={a.id} className={`alu-ach ${a.unlocked ? '' : 'locked'}`} title={a.description ?? ''}>
              <div className="em">{a.icon}</div>
              <div className="ti">{a.title}</div>
              <div className="de">{a.unlocked ? `+${a.xp_reward} XP` : 'Bloqueada'}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
