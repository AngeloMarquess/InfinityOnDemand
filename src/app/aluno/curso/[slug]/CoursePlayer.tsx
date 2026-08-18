'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Course, Module, Lesson, LessonProgress, Gamification } from '@/lib/academy/types';
import { CATEGORY_LABELS } from '@/lib/academy/types';
import {
  getUser, fetchCourseBySlug, fetchCourseContent, fetchCourseProgress,
  fetchGamification, enroll, completeLesson,
} from '@/lib/academy/client';
import { Brand, GamificationBar, fmtSec } from '../../ui';
import VideoPlayer from '../../VideoPlayer';

export default function CoursePlayer({ slug }: { slug: string }) {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});
  const [gam, setGam] = useState<Gamification | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flatLessons = useMemo(() => modules.flatMap((m) => m.lessons), [modules]);

  useEffect(() => {
    (async () => {
      const u = await getUser();
      if (!u) { setAuthed(false); return; }
      setAuthed(true);
      const c = await fetchCourseBySlug(slug);
      if (!c) { setCourse(null); return; }
      setCourse(c);
      await enroll(c.id);
      const [mods, prog, g] = await Promise.all([
        fetchCourseContent(c.id), fetchCourseProgress(c.id), fetchGamification(),
      ]);
      setModules(mods);
      const pmap: Record<string, LessonProgress> = {};
      for (const p of prog) pmap[p.lesson_id] = p;
      setProgress(pmap);
      setGam(g);

      // Escolhe a aula: última com posição salva não concluída, ou primeira não concluída, ou primeira
      const all = mods.flatMap((m) => m.lessons);
      const inProgress = all.find((l) => pmap[l.id] && !pmap[l.id].completed && pmap[l.id].position_seconds > 3);
      const firstUndone = all.find((l) => !pmap[l.id]?.completed);
      setCurrentId((inProgress ?? firstUndone ?? all[0])?.id ?? null);
    })();
  }, [slug]);

  const current = flatLessons.find((l) => l.id === currentId) ?? null;

  const refresh = useCallback(async () => {
    if (!course) return;
    const [prog, g] = await Promise.all([fetchCourseProgress(course.id), fetchGamification()]);
    const pmap: Record<string, LessonProgress> = {};
    for (const p of prog) pmap[p.lesson_id] = p;
    setProgress(pmap);
    setGam(g);
  }, [course]);

  const handleComplete = useCallback(async (lesson: Lesson) => {
    await completeLesson(lesson.id);
    setToast(`+${lesson.xp_reward} XP · Aula concluída!`);
    setTimeout(() => setToast(null), 2600);
    await refresh();
  }, [refresh]);

  const goNext = useCallback(() => {
    if (!current) return;
    const idx = flatLessons.findIndex((l) => l.id === current.id);
    const next = flatLessons[idx + 1];
    if (next) setCurrentId(next.id);
  }, [current, flatLessons]);

  if (authed === false) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', textAlign: 'center', padding: 24 }}>
        <div>
          <p style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>Você precisa entrar para acessar este curso.</p>
          <Link href="/aluno" className="btn-primary" style={{ padding: '12px 28px', color: '#fff' }}>Ir para o login</Link>
        </div>
      </div>
    );
  }
  if (authed === null || (authed && !course && course !== null)) {
    return <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', color: 'var(--text-secondary)' }}>Carregando…</div>;
  }
  if (course === null) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', textAlign: 'center' }}>
        <div>
          <p style={{ marginBottom: 16 }}>Curso não encontrado.</p>
          <Link href="/aluno" className="alu-back">← Voltar para a área do aluno</Link>
        </div>
      </div>
    );
  }

  const doneCount = flatLessons.filter((l) => progress[l.id]?.completed).length;

  return (
    <>
      <div className="alu-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Brand />
          <Link href="/aluno" className="alu-back" style={{ padding: 0 }}>← Voltar</Link>
        </div>
        <GamificationBar gam={gam} />
      </div>

      <div className="alu-player-wrap">
        {/* Player + info */}
        <div className="alu-player-main">
          {current && (
            <VideoPlayer
              key={current.id}
              lesson={current}
              initialPosition={progress[current.id]?.position_seconds ?? 0}
              completed={!!progress[current.id]?.completed}
              onComplete={() => handleComplete(current)}
              onEnded={goNext}
            />
          )}
          <div className="alu-lesson-info">
            <div style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
              {CATEGORY_LABELS[course.category]} · {course.title}
            </div>
            <h1 className="alu-lesson-title">{current?.title ?? course.title}</h1>
            <p className="alu-lesson-desc">{current?.description ?? course.description}</p>
            {current && !progress[current.id]?.completed && (
              <button className="btn-secondary" style={{ marginTop: 20 }} onClick={() => handleComplete(current)}>
                ✓ Marcar como concluída
              </button>
            )}
          </div>
        </div>

        {/* Sidebar: lista de aulas */}
        <aside className="alu-sidebar">
          <div className="alu-sidebar-head">
            <div style={{ fontWeight: 700 }}>Conteúdo do curso</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
              {doneCount}/{flatLessons.length} aulas · {Math.round(flatLessons.length ? (doneCount / flatLessons.length) * 100 : 0)}% concluído
            </div>
            <div className="alu-progress" style={{ marginTop: 10 }}>
              <span style={{ width: `${flatLessons.length ? (doneCount / flatLessons.length) * 100 : 0}%` }} />
            </div>
          </div>
          <div className="alu-sidebar-list">
            {modules.map((m) => (
              <div key={m.id} style={{ marginBottom: 8 }}>
                {modules.length > 1 && (
                  <div style={{ padding: '8px 12px', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>{m.title}</div>
                )}
                {m.lessons.map((l, i) => {
                  const done = progress[l.id]?.completed;
                  const active = l.id === currentId;
                  return (
                    <div key={l.id} className={`alu-lesson-item ${active ? 'active' : ''}`} onClick={() => setCurrentId(l.id)}>
                      <div className={`alu-lesson-num ${done ? 'done' : ''}`}>{done ? '✓' : i + 1}</div>
                      <div style={{ minWidth: 0 }}>
                        <div className="t">{l.title}</div>
                        <div className="d">{fmtSec(l.duration_seconds)} · +{l.xp_reward} XP{l.is_free ? ' · amostra' : ''}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>
      </div>

      {toast && <div className="alu-toast">⚡ {toast}</div>}
    </>
  );
}
