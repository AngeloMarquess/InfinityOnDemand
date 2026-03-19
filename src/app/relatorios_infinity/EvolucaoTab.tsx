'use client';

import React, { useState, useEffect, useCallback } from 'react';

/* ─── Types ─── */
interface InsightRow {
  campaignName: string;
  campaignId: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  spend: number;
  reach: number;
  frequency: number;
}

interface Totals {
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  ctr: string;
  cpc: string;
}

/* ─── Data ─── */
const goals = [
  { metric: 'Seguidores', current: 556, target: 1000, unit: '', icon: '👥', color: '#8B5CF6' },
  { metric: 'Engajamento', current: 0.54, target: 2.5, unit: '%', icon: '📈', color: '#00DB79' },
  { metric: 'Comentários/post', current: 0.05, target: 3, unit: '', icon: '💬', color: '#F59E0B' },
  { metric: 'Stories/dia', current: 3, target: 3, unit: '', icon: '📱', color: '#EC4899' },
  { metric: 'Posts/semana', current: 2.3, target: 5, unit: '', icon: '📅', color: '#06B6D4' },
];

const postHistory = [
  { period: 'Set/24', posts: 2 }, { period: 'Out/24', posts: 3 }, { period: 'Nov/24', posts: 6 },
  { period: 'Dez/24', posts: 4 }, { period: 'Jan/25', posts: 4 }, { period: 'Fev/25', posts: 3 },
  { period: 'Mar/25', posts: 9 }, { period: 'Abr/25', posts: 2 }, { period: 'Mai/25', posts: 10 },
  { period: 'Jun/25', posts: 0 }, { period: 'Jul/25', posts: 0 }, { period: 'Ago/25', posts: 0 },
  { period: 'Set/25', posts: 1 }, { period: 'Out/25', posts: 0 }, { period: 'Nov/25', posts: 0 },
  { period: 'Dez/25', posts: 0 }, { period: 'Jan/26', posts: 0 }, { period: 'Fev/26', posts: 0 },
  { period: 'Mar/26', posts: 9 },
];

const weeklyPlan = [
  { day: 'Seg', planned: 1, stories: 5, pillar: 'Provocação', color: '#EF4444' },
  { day: 'Ter', planned: 1, stories: 5, pillar: 'Educação', color: '#4a90e2' },
  { day: 'Qua', planned: 1, stories: 5, pillar: 'Autoridade', color: '#F59E0B' },
  { day: 'Qui', planned: 1, stories: 5, pillar: 'Educação', color: '#4a90e2' },
  { day: 'Sex', planned: 1, stories: 5, pillar: 'Oferta', color: '#00DB79' },
];

/* ─── Styles ─── */
const glassCard: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '20px',
  padding: '28px',
  backdropFilter: 'blur(20px)',
  position: 'relative',
  overflow: 'hidden',
};

/* ─── CSS Bar chart implemented with divs ─── */
const BarChart = ({ data, height = 200, barColor = '#00DB79' }: { data: { label: string; value: number }[]; height?: number; barColor?: string }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height, padding: '0 4px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
            {d.value > 0 ? d.value : ''}
          </span>
          <div style={{
            width: '100%',
            height: `${(d.value / max) * (height - 40)}px`,
            minHeight: d.value > 0 ? '4px' : '1px',
            borderRadius: '6px 6px 2px 2px',
            background: d.value > 0 ? `linear-gradient(180deg, ${barColor}, ${barColor}66)` : 'rgba(255,255,255,0.05)',
            transition: 'height 0.5s ease',
          }} />
          <span style={{
            fontSize: '9px', color: 'rgba(255,255,255,0.35)', fontWeight: 500,
            writingMode: data.length > 12 ? 'vertical-rl' : undefined,
            transform: data.length > 12 ? 'rotate(180deg)' : undefined,
            height: data.length > 12 ? '40px' : undefined,
          }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Progress Ring ─── */
const ProgressRing = ({ progress, size = 120, color = '#00DB79', label, value }: { progress: number; size?: number; color?: string; label: string; value: string }) => {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (Math.min(progress, 100) / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fill="#fff"
          fontSize="20" fontWeight="700" style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>
          {Math.round(progress)}%
        </text>
      </svg>
      <span style={{ fontSize: '13px', fontWeight: 600, color }}>{value}</span>
      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{label}</span>
    </div>
  );
};

/* ─── Donut chart ─── */
const DonutChart = ({ segments, size = 160 }: { segments: { value: number; color: string; label: string }[]; size?: number }) => {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const stroke = 24;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {segments.map((seg, i) => {
          const pct = total > 0 ? seg.value / total : 0;
          const dashLen = pct * circ;
          const dashOff = cumulative * circ;
          cumulative += pct;
          return (
            <circle key={i} cx={size / 2} cy={size / 2} r={radius} fill="none"
              stroke={seg.color} strokeWidth={stroke} strokeDasharray={`${dashLen} ${circ - dashLen}`}
              strokeDashoffset={-dashOff} strokeLinecap="butt" />
          );
        })}
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fill="#fff"
          fontSize="22" fontWeight="700" style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>
          {total > 0 ? `R$${total.toFixed(0)}` : '—'}
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: seg.color }} />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{seg.label}</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginLeft: 'auto' }}>R${seg.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ─── */
export default function EvolucaoTab() {
  const [period, setPeriod] = useState<'last_7d' | 'last_30d' | 'last_90d' | 'this_month' | 'last_month'>('last_30d');
  const [insights, setInsights] = useState<InsightRow[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);

  const loadInsights = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ads/insights?datePreset=${period}`);
      const data = await res.json();
      if (data.insights) setInsights(data.insights);
      if (data.totals) setTotals(data.totals);
    } catch (e) {
      console.error('Failed to load insights:', e);
    }
    setLoading(false);
  }, [period]);

  useEffect(() => { loadInsights(); }, [loadInsights]);

  const periodLabels: Record<string, string> = {
    'last_7d': 'Últimos 7 dias',
    'last_30d': 'Últimos 30 dias',
    'last_90d': 'Últimos 90 dias',
    'this_month': 'Este mês',
    'last_month': 'Último mês',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '6px' }}>
            <span style={{ background: 'linear-gradient(135deg, #00DB79, #4a90e2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Evolução
            </span>
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
            Acompanhe o progresso vs. Plano de Ação • Métricas de campanhas
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {Object.entries(periodLabels).map(([key, label]) => (
            <button key={key} onClick={() => setPeriod(key as typeof period)} style={{
              padding: '10px 18px', borderRadius: '10px',
              border: '1px solid', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit',
              borderColor: period === key ? 'rgba(0,219,121,0.4)' : 'rgba(255,255,255,0.08)',
              backgroundColor: period === key ? 'rgba(0,219,121,0.12)' : 'rgba(255,255,255,0.03)',
              color: period === key ? '#00DB79' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.2s',
            }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPIs Panorama ── */}
      {totals && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Impressões', value: totals.impressions.toLocaleString('pt-BR'), icon: '👁️', color: '#8B5CF6', sub: 'Total de exibições' },
            { label: 'Alcance', value: totals.reach.toLocaleString('pt-BR'), icon: '🌐', color: '#06B6D4', sub: 'Pessoas únicas' },
            { label: 'Cliques', value: totals.clicks.toLocaleString('pt-BR'), icon: '👆', color: '#4a90e2', sub: 'Interações com link' },
            { label: 'CTR', value: `${totals.ctr}%`, icon: '📈', color: '#00DB79', sub: 'Taxa de clique' },
            { label: 'CPC Médio', value: `R$ ${totals.cpc}`, icon: '💰', color: '#F59E0B', sub: 'Custo por clique' },
            { label: 'Investimento', value: `R$ ${totals.spend.toFixed(2)}`, icon: '💳', color: '#EC4899', sub: periodLabels[period] },
          ].map((kpi, i) => (
            <div key={i} style={{ ...glassCard, padding: '24px' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: `linear-gradient(90deg, ${kpi.color}, transparent)`,
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '24px' }}>{kpi.icon}</span>
                <span style={{ fontSize: '11px', color: kpi.color, fontWeight: 600, backgroundColor: `${kpi.color}15`, padding: '3px 8px', borderRadius: '6px' }}>
                  {kpi.sub}
                </span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>{kpi.value}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{kpi.label}</p>
            </div>
          ))}
        </div>
      )}

      {loading && !totals && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
          Carregando dados de campanhas...
        </div>
      )}

      {/* ── Progresso vs Metas ── */}
      <div style={glassCard}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🎯 Progresso vs. Plano de Ação
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '24px' }}>
          {goals.map((g, i) => (
            <ProgressRing
              key={i}
              progress={(g.current / g.target) * 100}
              color={g.color}
              label={g.metric}
              value={`${g.current}${g.unit} / ${g.target}${g.unit}`}
            />
          ))}
        </div>
      </div>

      {/* ── Row: Posting History + Weekly Plan ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

        {/* Posting History */}
        <div style={glassCard}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📊 Histórico de Publicações
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 400, marginLeft: 'auto' }}>Set/24 — Mar/26</span>
          </h3>
          <BarChart
            data={postHistory.map(p => ({ label: p.period, value: p.posts }))}
            height={180}
            barColor="#4a90e2"
          />
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              Total: <strong style={{ color: '#4a90e2' }}>{postHistory.reduce((s, p) => s + p.posts, 0)} posts</strong>
            </span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              Média: <strong style={{ color: '#4a90e2' }}>{(postHistory.reduce((s, p) => s + p.posts, 0) / postHistory.length).toFixed(1)}/mês</strong>
            </span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              Meses sem post: <strong style={{ color: '#EF4444' }}>{postHistory.filter(p => p.posts === 0).length}</strong>
            </span>
          </div>
        </div>

        {/* Weekly Plan */}
        <div style={glassCard}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>📅 Plano Semanal</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {weeklyPlan.map((day, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: `1px solid ${day.color}22`,
              }}>
                <span style={{
                  fontSize: '12px', fontWeight: 700, color: day.color,
                  backgroundColor: `${day.color}18`, padding: '4px 10px', borderRadius: '6px',
                  minWidth: '40px', textAlign: 'center',
                }}>{day.day}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>{day.pillar}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
                    {day.planned} post + {day.stories} stories
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[...Array(day.planned)].map((_, j) => (
                    <div key={j} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: day.color }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: '16px', padding: '12px 16px', borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(0,219,121,0.1), rgba(74,144,226,0.1))',
            border: '1px solid rgba(0,219,121,0.15)',
          }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#00DB79' }}>Meta: 5 posts + 25 stories/semana</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Frequência atual: 1.4 posts/semana</p>
          </div>
        </div>
      </div>

      {/* ── Campaign Performance (if insights available) ── */}
      {insights.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* Spend Distribution */}
          <div style={glassCard}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>💰 Distribuição de Investimento</h3>
            <DonutChart
              segments={insights.slice(0, 6).map((ins, i) => ({
                value: ins.spend,
                color: ['#8B5CF6', '#EC4899', '#4a90e2', '#00DB79', '#F59E0B', '#06B6D4'][i % 6],
                label: ins.campaignName?.substring(0, 20) || `Campanha ${i + 1}`,
              }))}
            />
          </div>

          {/* Top Campaigns by CTR */}
          <div style={glassCard}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>🏆 Performance por Campanha</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {insights.sort((a, b) => b.ctr - a.ctr).slice(0, 5).map((ins, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px', borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                }}>
                  <span style={{
                    fontSize: '14px', fontWeight: 800, color: i === 0 ? '#F59E0B' : 'rgba(255,255,255,0.3)',
                    minWidth: '24px',
                  }}>{i + 1}º</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                      {ins.campaignName}
                    </p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
                      {ins.impressions.toLocaleString('pt-BR')} impressões • R$ {ins.spend.toFixed(2)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#00DB79' }}>{ins.ctr.toFixed(2)}%</p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>CTR</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Impressions by Campaign bar chart ── */}
      {insights.length > 0 && (
        <div style={glassCard}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>📊 Impressões por Campanha</h3>
          <BarChart
            data={insights.slice(0, 10).map(ins => ({
              label: ins.campaignName?.substring(0, 8) || '...',
              value: ins.impressions,
            }))}
            height={200}
            barColor="#8B5CF6"
          />
        </div>
      )}

      {/* ── Conversion Funnel ── */}
      {totals && totals.impressions > 0 && (
        <div style={glassCard}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px' }}>🔄 Funil de Conversão</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '600px', margin: '0 auto' }}>
            {[
              { label: 'Impressões', value: totals.impressions, color: '#8B5CF6', width: 100 },
              { label: 'Alcance (Únicos)', value: totals.reach, color: '#06B6D4', width: totals.impressions > 0 ? (totals.reach / totals.impressions) * 100 : 0 },
              { label: 'Cliques', value: totals.clicks, color: '#4a90e2', width: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0 },
            ].map((step, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{step.label}</span>
                  <span style={{ fontSize: '13px', color: step.color, fontWeight: 700 }}>{step.value.toLocaleString('pt-BR')}</span>
                </div>
                <div style={{ height: '28px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.max(step.width, 2)}%`,
                    borderRadius: '8px',
                    background: `linear-gradient(90deg, ${step.color}, ${step.color}66)`,
                    transition: 'width 0.8s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px',
                  }}>
                    {step.width > 15 && (
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff' }}>
                        {step.width.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Summary Card ── */}
      <div style={{
        ...glassCard,
        background: 'linear-gradient(135deg, rgba(0,219,121,0.06) 0%, rgba(74,144,226,0.06) 100%)',
        border: '1px solid rgba(0,219,121,0.15)',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>💡 Resumo Executivo</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Status Geral</p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#F59E0B' }}>⚠️ Em recuperação</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>
              Conta com 7 meses de inatividade. Plano de ação em execução.
            </p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Próximos Passos</p>
            <ul style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '4px' }}>✅ Campanha semanal planejada</li>
              <li style={{ marginBottom: '4px' }}>✅ Criativos prontos</li>
              <li style={{ marginBottom: '4px' }}>🔄 Executar 5 posts/semana</li>
              <li>🎯 Alcançar 2.5% de engajamento</li>
            </ul>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Meta 30 Dias</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>👥 556 → <strong style={{ color: '#00DB79' }}>1.000</strong> seguidores</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>📈 0.54% → <strong style={{ color: '#00DB79' }}>2.5%</strong> engajamento</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>📅 2.3 → <strong style={{ color: '#00DB79' }}>5</strong> posts/sem</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
