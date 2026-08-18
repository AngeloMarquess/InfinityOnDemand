'use client';

import Link from 'next/link';
import type { Course, Gamification } from '@/lib/academy/types';
import { CATEGORY_LABELS, levelProgress } from '@/lib/academy/types';

export function fmtMin(min: number) {
  if (min >= 60) { const h = Math.floor(min / 60); const m = min % 60; return m ? `${h}h${m}` : `${h}h`; }
  return `${min}min`;
}
export function fmtSec(sec: number) {
  const m = Math.floor(sec / 60); const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const catGradient: Record<string, string> = {
  marketing: 'linear-gradient(135deg, #00DB79, #00AAFF)',
  vendas: 'linear-gradient(135deg, #00AAFF, #7C3AED)',
  administracao: 'linear-gradient(135deg, #7C3AED, #EC4899)',
  ia: 'linear-gradient(135deg, #F59E0B, #EF4444)',
};

export function InfinityMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size / 2} viewBox="0 0 100 50" fill="none" style={{ filter: 'drop-shadow(0 0 6px rgba(0,219,121,0.4))' }}>
      <defs>
        <linearGradient id="alu-inf" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00DB79" /><stop offset="100%" stopColor="#00AAFF" />
        </linearGradient>
      </defs>
      <path d="M30 10 C15 10 10 25 10 25 C10 25 15 40 30 40 C45 40 55 10 70 10 C85 10 90 25 90 25 C90 25 85 40 70 40 C55 40 45 10 30 10 Z" stroke="url(#alu-inf)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GamificationBar({ gam }: { gam: Gamification | null }) {
  const xp = gam?.xp_total ?? 0;
  const level = gam?.level ?? 1;
  const streak = gam?.current_streak ?? 0;
  const lp = levelProgress(xp, level);
  return (
    <div className="alu-gamerow">
      <div className="alu-pill hide-sm" title="Sequência de dias estudando">
        <span className="ic">🔥</span>{streak}<span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>dias</span>
      </div>
      <div className="alu-pill" title="Experiência acumulada">
        <span className="ic">⚡</span>{xp.toLocaleString('pt-BR')} XP
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="alu-level-badge" title={`Nível ${level}`}>{level}</div>
        <div className="alu-xpbar" title={`${Math.round(lp.current)}/${lp.needed} XP para o próximo nível`}>
          <span style={{ width: `${lp.pct}%` }} />
        </div>
      </div>
    </div>
  );
}

export function CourseCard({
  course, progress, wide, onOpen,
}: { course: Course; progress?: number; wide?: boolean; onOpen: (c: Course) => void }) {
  const grad = catGradient[course.category] ?? catGradient.marketing;
  return (
    <div className={`alu-card ${wide ? 'alu-continue' : ''}`} onClick={() => onOpen(course)}>
      <div className="alu-card-thumb" style={{ background: course.cover_url ? `url(${course.cover_url}) center/cover` : grad }}>
        <div className="play">▶</div>
        <span className="alu-card-cat">{CATEGORY_LABELS[course.category]}</span>
      </div>
      <div className="alu-card-body">
        <div className="alu-card-title">{course.title}</div>
        <div className="alu-card-meta">
          <span>👤 {course.instructor ?? 'Infinity'}</span>
          <span>· {course.total_lessons} aulas</span>
          <span>· {fmtMin(course.duration_minutes)}</span>
        </div>
        {typeof progress === 'number' && progress > 0 && (
          <div className="alu-progress" title={`${Math.round(progress)}% concluído`}>
            <span style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

export function catGrad(cat: string) { return catGradient[cat] ?? catGradient.marketing; }

export function Brand() {
  return (
    <Link href="/aluno" className="alu-brand">
      <InfinityMark size={30} />
      <span className="text-gradient" style={{ fontSize: 17 }}>INFINITY</span>
      <small>Academy</small>
    </Link>
  );
}
