'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Lesson } from '@/lib/academy/types';
import { savePosition } from '@/lib/academy/client';

/**
 * Player que retoma de onde parou.
 * - Ao carregar, posiciona o vídeo em `initialPosition`.
 * - Salva a posição a cada 10s, ao pausar, ao sair da aba e ao desmontar.
 * - Ao assistir >= 92%, dispara onComplete uma única vez.
 */
export default function VideoPlayer({
  lesson, initialPosition, completed, onComplete, onEnded,
}: {
  lesson: Lesson;
  initialPosition: number;
  completed: boolean;
  onComplete: () => void;
  onEnded: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const lastSaved = useRef(0);
  const firedComplete = useRef(completed);
  const [resumed, setResumed] = useState(false);
  const [showResume, setShowResume] = useState(false);

  // Reset quando troca de aula
  useEffect(() => {
    firedComplete.current = completed;
    lastSaved.current = 0;
    setResumed(false);
    setShowResume(initialPosition > 5);
    const t = setTimeout(() => setShowResume(false), 3500);
    return () => clearTimeout(t);
  }, [lesson.id, initialPosition, completed]);

  const persist = useCallback((final = false) => {
    const v = ref.current;
    if (!v || !v.duration || isNaN(v.duration)) return;
    const pos = Math.floor(v.currentTime);
    if (!final && Math.abs(pos - lastSaved.current) < 5) return;
    lastSaved.current = pos;
    void savePosition(lesson.id, pos, Math.floor(v.duration));
  }, [lesson.id]);

  // Salvar ao sair da aba / fechar
  useEffect(() => {
    const onHide = () => persist(true);
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('beforeunload', onHide);
    return () => {
      persist(true);
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('beforeunload', onHide);
    };
  }, [persist]);

  const onLoaded = () => {
    const v = ref.current;
    if (v && initialPosition > 0 && initialPosition < (v.duration || Infinity) - 2 && !resumed) {
      v.currentTime = initialPosition;
      setResumed(true);
    }
  };

  const onTimeUpdate = () => {
    const v = ref.current;
    if (!v || !v.duration) return;
    persist();
    if (!firedComplete.current && v.currentTime / v.duration >= 0.92) {
      firedComplete.current = true;
      persist(true);
      onComplete();
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <video
        ref={ref}
        className="alu-video"
        src={lesson.video_url ?? undefined}
        controls
        controlsList="nodownload"
        playsInline
        onLoadedMetadata={onLoaded}
        onTimeUpdate={onTimeUpdate}
        onPause={() => persist(true)}
        onEnded={() => { persist(true); if (!firedComplete.current) { firedComplete.current = true; onComplete(); } onEnded(); }}
        poster={lesson.thumbnail_url ?? undefined}
      />
      {showResume && initialPosition > 5 && (
        <div style={{
          position: 'absolute', bottom: 70, left: 20, background: 'rgba(0,0,0,0.8)',
          border: '1px solid rgba(0,219,121,0.4)', borderRadius: 10, padding: '8px 14px',
          fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          ⏱️ Retomando de {Math.floor(initialPosition / 60)}:{String(Math.floor(initialPosition % 60)).padStart(2, '0')}
        </div>
      )}
    </div>
  );
}
