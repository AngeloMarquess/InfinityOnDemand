'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Lesson } from '@/lib/academy/types';
import { savePosition } from '@/lib/academy/client';

// Real fallback masterclasses for marketing, sales, finance, and AI
const REAL_TOPIC_VIDEOS: Record<string, string> = {
  vendas: 'https://www.youtube.com/embed/1vR3FY_x7Y4',
  marketing: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
  administracao: 'https://www.youtube.com/embed/8v_4kJQzP8g',
  ia: 'https://www.youtube.com/embed/aircAruvnKk',
};

function getEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const clean = url.trim();

  // YouTube watch format: https://www.youtube.com/watch?v=VIDEO_ID
  const ytWatchMatch = clean.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytWatchMatch && ytWatchMatch[1]) {
    return `https://www.youtube.com/embed/${ytWatchMatch[1]}?autoplay=1&enablejsapi=1&rel=0`;
  }

  // Vimeo
  const vimeoMatch = clean.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  if (clean.includes('youtube.com/embed')) {
    return clean.includes('?') ? `${clean}&enablejsapi=1` : `${clean}?enablejsapi=1`;
  }

  return null;
}

export default function VideoPlayer({
  lesson, initialPosition, completed, onComplete, onEnded,
}: {
  lesson: Lesson;
  initialPosition: number;
  completed: boolean;
  onComplete: () => void;
  onEnded: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSaved = useRef(0);
  const firedComplete = useRef(completed);
  const [resumed, setResumed] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const embedUrl = getEmbedUrl(lesson.video_url);

  // Reset state on lesson change
  useEffect(() => {
    firedComplete.current = completed;
    lastSaved.current = 0;
    setResumed(false);
    setVideoError(false);
    setShowResume(initialPosition > 5);
    const t = setTimeout(() => setShowResume(false), 3500);
    return () => clearTimeout(t);
  }, [lesson.id, initialPosition, completed]);

  const persist = useCallback((final = false) => {
    const v = videoRef.current;
    if (!v || !v.duration || isNaN(v.duration)) return;
    const pos = Math.floor(v.currentTime);
    if (!final && Math.abs(pos - lastSaved.current) < 5) return;
    lastSaved.current = pos;
    void savePosition(lesson.id, pos, Math.floor(v.duration));
  }, [lesson.id]);

  // Save on tab hide / leave
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
    const v = videoRef.current;
    if (v && initialPosition > 0 && initialPosition < (v.duration || Infinity) - 2 && !resumed) {
      v.currentTime = initialPosition;
      setResumed(true);
    }
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    persist();
    if (!firedComplete.current && v.currentTime / v.duration >= 0.92) {
      firedComplete.current = true;
      persist(true);
      onComplete();
    }
  };

  // If it's a YouTube / Vimeo embed or fallback needed
  if (embedUrl || videoError || !lesson.video_url || !lesson.video_url.endsWith('.mp4')) {
    const activeUrl = embedUrl || 'https://www.youtube.com/embed/aircAruvnKk?autoplay=1&rel=0';

    return (
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000' }}>
        <iframe
          key={lesson.id}
          src={activeUrl}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
        />
      </div>
    );
  }

  // Native HTML5 Video for direct MP4 files
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000' }}>
      <video
        ref={videoRef}
        className="alu-video"
        src={lesson.video_url}
        controls
        controlsList="nodownload"
        playsInline
        onLoadedMetadata={onLoaded}
        onTimeUpdate={onTimeUpdate}
        onError={() => setVideoError(true)}
        onPause={() => persist(true)}
        onEnded={() => {
          persist(true);
          if (!firedComplete.current) {
            firedComplete.current = true;
            onComplete();
          }
          onEnded();
        }}
        poster={lesson.thumbnail_url ?? undefined}
        style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
      />
      {showResume && initialPosition > 5 && (
        <div style={{
          position: 'absolute', bottom: 70, left: 20, background: 'rgba(0,0,0,0.85)',
          border: '1px solid rgba(0,219,121,0.5)', borderRadius: 10, padding: '8px 14px',
          fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
        }}>
          ⏱️ Retomando de {Math.floor(initialPosition / 60)}:{String(Math.floor(initialPosition % 60)).padStart(2, '0')}
        </div>
      )}
    </div>
  );
}
