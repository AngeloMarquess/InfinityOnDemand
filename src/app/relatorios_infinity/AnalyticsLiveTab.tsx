'use client';

import React, { useState, useEffect, useCallback } from 'react';

/* ─── Types ─── */
interface Post {
  id: string;
  caption: string;
  timestamp: string;
  mediaType: string;
  likes: number;
  comments: number;
  permalink: string;
  thumbnailUrl: string;
  rank: number;
  engRate: string;
}

interface Story {
  id: string;
  caption: string;
  timestamp: string;
  mediaType: string;
  thumbnailUrl: string;
}

interface FormatStat {
  type: string;
  count: number;
  totalLikes: number;
  avgLikes: string;
  engRate: string;
}

interface Profile {
  followers_count: number;
  follows_count: number;
  media_count: number;
  name: string;
  username: string;
  profile_picture_url: string;
  engagementRate: string;
  totalLikes: number;
  totalComments: number;
  totalPosts: number;
}

interface DayAnalysis {
  day: string;
  posts: number;
  avgLikes: number;
}

/* ─── Styles ─── */
const glassCard: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '20px',
  padding: '28px',
  backdropFilter: 'blur(20px)',
};

const typeColors: Record<string, string> = {
  IMAGE: '#8B5CF6',
  VIDEO: '#EC4899',
  CAROUSEL_ALBUM: '#06B6D4',
  CAROUSEL: '#06B6D4',
};

const typeLabels: Record<string, string> = {
  IMAGE: 'Imagem',
  VIDEO: 'Reel/Vídeo',
  CAROUSEL_ALBUM: 'Carrossel',
  CAROUSEL: 'Carrossel',
};

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}min atrás`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
}

export default function AnalyticsLiveTab() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [topPosts, setTopPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [formatStats, setFormatStats] = useState<FormatStat[]>([]);
  const [dayAnalysis, setDayAnalysis] = useState<DayAnalysis[]>([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/instagram/analytics');
      const data = await res.json();
      if (data.profile) setProfile(data.profile);
      if (data.topPosts) setTopPosts(data.topPosts);
      if (data.stories) setStories(data.stories);
      if (data.formatStats) setFormatStats(data.formatStats);
      if (data.dayAnalysis) setDayAnalysis(data.dayAnalysis);
      if (data.lastUpdated) setLastUpdated(data.lastUpdated);
    } catch (e) {
      console.error('Failed to load analytics:', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.3)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }}>📊</div>
        <p style={{ fontSize: '16px' }}>Carregando dados em tempo real do Instagram...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ── Header with live indicator ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '4px' }}>
            📊 Análise de Conteúdo <span style={{ fontSize: '14px', fontWeight: 500, color: '#00DB79' }}>LIVE</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
            Dados em tempo real da API do Instagram
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={loadData} style={{
            padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(0,219,121,0.3)',
            background: 'rgba(0,219,121,0.08)', color: '#00DB79', fontWeight: 600,
            fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            🔄 Atualizar
          </button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '8px',
            backgroundColor: 'rgba(0,219,121,0.08)', border: '1px solid rgba(0,219,121,0.15)',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00DB79', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '11px', color: '#00DB79', fontWeight: 600 }}>
              {lastUpdated ? new Date(lastUpdated).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Profile Summary ── */}
      {profile && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
          {[
            { icon: '👥', value: profile.followers_count, label: 'Seguidores', color: '#8B5CF6' },
            { icon: '📸', value: profile.totalPosts, label: 'Posts analisados', color: '#4a90e2' },
            { icon: '❤️', value: profile.totalLikes, label: 'Likes total', color: '#EC4899' },
            { icon: '💬', value: profile.totalComments, label: 'Comentários', color: '#F59E0B' },
            { icon: '📈', value: profile.engagementRate + '%', label: 'Engajamento', color: '#00DB79' },
          ].map((kpi, i) => (
            <div key={i} style={{ ...glassCard, padding: '20px', textAlign: 'center' }}>
              <span style={{ fontSize: '24px' }}>{kpi.icon}</span>
              <p style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px', color: '#fff' }}>{kpi.value}</p>
              <p style={{ fontSize: '11px', color: kpi.color, fontWeight: 600, marginTop: '4px' }}>{kpi.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Active Stories (LIVE) ── */}
      {stories.length > 0 && (
        <div style={glassCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>📱 Stories Ativos</h3>
            <span style={{
              padding: '3px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
              background: 'rgba(236,72,153,0.15)', color: '#EC4899', letterSpacing: '0.5px',
            }}>
              {stories.length} ATIVO{stories.length > 1 ? 'S' : ''}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(stories.length, 4)}, 1fr)`, gap: '16px' }}>
            {stories.map((story, i) => (
              <div key={i} style={{
                borderRadius: '16px', overflow: 'hidden',
                border: '2px solid rgba(236,72,153,0.3)',
                background: 'rgba(0,0,0,0.3)',
              }}>
                {story.thumbnailUrl && (
                  <img src={story.thumbnailUrl} alt="" style={{
                    width: '100%', height: '280px', objectFit: 'cover',
                  }} />
                )}
                <div style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#EC4899' }}>
                      {story.mediaType === 'VIDEO' ? '🎬 Vídeo' : '🖼️ Imagem'}
                    </span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                      {timeAgo(story.timestamp)}
                    </span>
                  </div>
                  {story.caption && (
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '6px', lineHeight: 1.4 }}>
                      {story.caption.substring(0, 60)}...
                    </p>
                  )}
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '6px' }}>
                    Postado {new Date(story.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}h
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: '14px', padding: '10px 16px', borderRadius: '8px',
            background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.1)',
            fontSize: '12px', color: 'rgba(255,255,255,0.4)',
          }}>
            💡 Insights de Stories (views, replies) requerem App Review da Meta. As visualizações mostradas no Instagram não estão disponíveis via API em modo de desenvolvimento.
          </div>
        </div>
      )}

      {stories.length === 0 && (
        <div style={{
          ...glassCard, textAlign: 'center', padding: '40px',
          background: 'linear-gradient(135deg, rgba(236,72,153,0.04), rgba(139,92,246,0.04))',
        }}>
          <span style={{ fontSize: '40px' }}>📱</span>
          <p style={{ fontSize: '16px', fontWeight: 600, marginTop: '12px' }}>Nenhum Story ativo</p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Stories expiram em 24h</p>
        </div>
      )}

      {/* ── Top Posts Table ── */}
      <div style={glassCard}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>🏆 Top Posts por Engajamento</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['#', 'Likes', 'Com.', 'Eng.', 'Tipo', 'Data', 'Conteúdo'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontSize: '11px',
                    color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
                    letterSpacing: '1px', fontWeight: 600,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topPosts.map((post, i) => (
                <tr key={i}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer' }}
                  onClick={() => window.open(post.permalink, '_blank')}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '12px 16px', fontSize: '16px', fontWeight: 700, color: i < 3 ? '#F59E0B' : 'rgba(255,255,255,0.3)' }}>
                    {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${post.rank}`}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{post.likes}</td>
                  <td style={{ padding: '12px 16px', color: post.comments > 0 ? '#10B981' : 'rgba(255,255,255,0.25)' }}>{post.comments}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      backgroundColor: 'rgba(0,219,121,0.1)', color: '#00DB79',
                      padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                    }}>{post.engRate}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      backgroundColor: `${typeColors[post.mediaType] || '#666'}20`,
                      color: typeColors[post.mediaType] || '#666',
                      padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                      textTransform: 'uppercase',
                    }}>{typeLabels[post.mediaType] || post.mediaType}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                    {new Date(post.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </td>
                  <td style={{
                    padding: '12px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.5)',
                    maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {post.caption || '(sem legenda)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Format Comparison ── */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${formatStats.length}, 1fr)`, gap: '16px' }}>
        {formatStats.map((fs, i) => {
          const color = typeColors[fs.type] || '#666';
          return (
            <div key={i} style={{ ...glassCard, borderTop: `3px solid ${color}` }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                {typeLabels[fs.type] || fs.type}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '24px', fontWeight: 800 }}>{fs.count}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Posts</p>
                </div>
                <div>
                  <p style={{ fontSize: '24px', fontWeight: 800 }}>{fs.totalLikes}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Likes</p>
                </div>
                <div>
                  <p style={{ fontSize: '24px', fontWeight: 800 }}>{fs.avgLikes}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Média</p>
                </div>
                <div>
                  <p style={{ fontSize: '24px', fontWeight: 800, color: '#00DB79' }}>{fs.engRate}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Engajamento</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Day of Week Analysis ── */}
      {dayAnalysis.length > 0 && (
        <div style={glassCard}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>📅 Performance por Dia da Semana</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '180px' }}>
            {dayAnalysis.map(d => {
              const maxAvg = Math.max(...dayAnalysis.map(x => x.avgLikes));
              const heightPct = maxAvg > 0 ? (d.avgLikes / maxAvg) * 100 : 0;
              const isBest = d.avgLikes === maxAvg && maxAvg > 0;
              return (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isBest ? '#00DB79' : 'rgba(255,255,255,0.5)' }}>
                    {d.avgLikes}
                  </span>
                  <div style={{
                    width: '100%', height: `${heightPct}%`,
                    borderRadius: '8px 8px 4px 4px',
                    background: isBest
                      ? 'linear-gradient(180deg, #00DB79, rgba(0,219,121,0.3))'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                    minHeight: '8px',
                    boxShadow: isBest ? '0 0 20px rgba(0,219,121,0.3)' : 'none',
                    transition: 'height 0.5s ease',
                  }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: isBest ? '#00DB79' : 'rgba(255,255,255,0.4)' }}>
                    {d.day}
                  </span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>{d.posts} posts</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
