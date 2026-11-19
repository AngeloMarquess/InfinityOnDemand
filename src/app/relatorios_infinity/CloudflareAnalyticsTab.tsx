'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- Types ---
type TimeRangePreset = '24h' | '7d' | '30d' | 'custom';

interface SparklineProps {
  data: number[];
  color?: string;
  fillColor?: string;
  height?: number;
  width?: number | string;
}

// Crisp Cloudflare-style SVG Sparkline
function Sparkline({
  data,
  color = '#2563eb',
  height = 42,
}: SparklineProps) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;
  const h = height - padding * 2;
  const w = 100; // viewBox width percentage

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * w;
    const y = height - padding - ((val - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M ${points[0]} L ${points.join(' L ')} L ${w},${height} L 0,${height} Z`;

  return (
    <div style={{ width: '100%', height: `${height}px`, overflow: 'hidden' }}>
      <svg
        viewBox={`0 0 ${w} ${height}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <linearGradient id={`sparkGrad-${color.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#sparkGrad-${color.replace(/[^a-zA-Z0-9]/g, '')})`} />
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function CloudflareAnalyticsTab() {
  // Theme state: default to Cloudflare clean light (as in screenshots), toggleable to dark
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Time range filter states
  const [selectedPreset, setSelectedPreset] = useState<TimeRangePreset>('7d');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [customRangeText, setCustomRangeText] = useState<string>('Custom range: 3h, 3 hours, 3 m...');
  const [startDate, setStartDate] = useState<string>('2026-10-27 08:52');
  const [endDate, setEndDate] = useState<string>('2026-11-03 08:52');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [hoveredCountry, setHoveredCountry] = useState<{ name: string; count: string; pct: number } | null>(null);

  // Settings Modal state
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);

  // API Data State
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<'cloudflare_api' | 'demo_mode'>('demo_mode');
  const [metrics, setMetrics] = useState<any>(null);

  // Calendar month state
  const [calendarMonth, setCalendarMonth] = useState<'November 2026' | 'October 2026'>('November 2026');

  // Fetch metrics from backend API
  const fetchMetrics = useCallback(async (preset: TimeRangePreset) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/cloudflare?range=${preset}`);
      const json = await res.json();
      if (json.success && json.data) {
        setMetrics(json.data);
        setDataSource(json.source);
      }
    } catch (err) {
      console.error('Falha ao buscar métricas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics(selectedPreset);
  }, [fetchMetrics, selectedPreset]);

  // Trigger refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMetrics(selectedPreset);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleApplyPreset = (preset: TimeRangePreset) => {
    setSelectedPreset(preset);
    if (preset === '24h') {
      setStartDate('2026-11-02 08:52');
      setEndDate('2026-11-03 08:52');
    } else if (preset === '7d') {
      setStartDate('2026-10-27 08:52');
      setEndDate('2026-11-03 08:52');
    } else if (preset === '30d') {
      setStartDate('2026-10-04 08:52');
      setEndDate('2026-11-03 08:52');
    }
    setIsFilterOpen(false);
  };

  const getPresetLabel = () => {
    if (selectedPreset === '24h') return 'Last 24 hours';
    if (selectedPreset === '7d') return 'Last 7 days';
    if (selectedPreset === '30d') return 'Last 30 days';
    return 'Custom range';
  };

  // Palette styles based on theme
  const theme = useMemo(() => {
    if (isDarkMode) {
      return {
        bg: '#0d1117',
        cardBg: '#161b22',
        cardBorder: '1px solid rgba(255,255,255,0.08)',
        subBorder: '1px solid rgba(255,255,255,0.06)',
        textPrimary: '#f0f6fc',
        textSecondary: '#8b949e',
        textMuted: '#6e7681',
        mapOcean: '#161b22',
        mapDefaultLand: '#21262d',
        mapBorder: '#30363d',
        barTrack: '#21262d',
        inputBg: '#0d1117',
        dropdownBg: '#161b22',
      };
    }
    return {
      bg: '#f8fafc',
      cardBg: '#ffffff',
      cardBorder: '1px solid #e5e7eb',
      subBorder: '1px solid #f1f5f9',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#64748b',
      mapOcean: '#ffffff',
      mapDefaultLand: '#e2e8f0',
      mapBorder: '#cbd5e1',
      barTrack: '#e2e8f0',
      inputBg: '#ffffff',
      dropdownBg: '#ffffff',
    };
  }, [isDarkMode]);

  const countriesList = metrics?.countries || [];

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.textPrimary,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: '24px 20px 48px',
        transition: 'background-color 0.3s, color 0.3s',
        minHeight: '100%',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* ── TOP HEADER (Account analytics + Filter dropdown) ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: theme.textPrimary, letterSpacing: '-0.3px' }}>
                Account analytics
              </h2>
              <a
                href="https://developers.cloudflare.com/analytics/"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                  color: isDarkMode ? '#93c5fd' : '#475569',
                  textDecoration: 'none',
                  border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                }}
              >
                View docs
              </a>

              {/* Status Badge: Conectado vs Modo Demonstração */}
              <button
                onClick={() => setIsConfigOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 9px',
                  borderRadius: '12px',
                  border: dataSource === 'cloudflare_api' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)',
                  backgroundColor: dataSource === 'cloudflare_api' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                  color: dataSource === 'cloudflare_api' ? '#10B981' : '#F59E0B',
                  cursor: 'pointer',
                }}
                title="Clique para configurar suas credenciais do Cloudflare"
              >
                <span>{dataSource === 'cloudflare_api' ? '🟢 API Cloudflare Conectada' : '⚙️ Conectar API Cloudflare'}</span>
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: theme.textSecondary, maxWidth: '680px', lineHeight: 1.4 }}>
              Traffic, security, cache, and error metrics across all domains in Angelo.marques@infinityondemand.com.br&apos;s Account.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
            
            {/* Theme Toggle (Light Cloudflare / Dark Infinity) */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Alternar Tema Claro / Escuro"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '6px',
                border: theme.cardBorder,
                backgroundColor: theme.cardBg,
                color: theme.textSecondary,
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <span>{isDarkMode ? '🌙 Dark' : '☀️ Claro'}</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              title="Atualizar dados da API"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '34px',
                height: '34px',
                borderRadius: '6px',
                border: theme.cardBorder,
                backgroundColor: theme.cardBg,
                color: theme.textSecondary,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                transition: 'transform 0.4s',
                transform: isRefreshing || loading ? 'rotate(360deg)' : 'none',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
              </svg>
            </button>

            {/* Date Range Picker Dropdown Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 14px',
                borderRadius: '6px',
                border: theme.cardBorder,
                backgroundColor: theme.cardBg,
                color: theme.textPrimary,
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              {/* Calendar Icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>{getPresetLabel()}</span>
            </button>

            {/* ── DROPDOWN POPUP MODAL (Matching Image 4) ── */}
            {isFilterOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '42px',
                  right: 0,
                  width: '390px',
                  backgroundColor: theme.dropdownBg,
                  borderRadius: '10px',
                  border: isDarkMode ? '1px solid #30363d' : '1px solid #e2e8f0',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                  zIndex: 200,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {/* Custom range input */}
                <input
                  type="text"
                  value={customRangeText}
                  onChange={(e) => setCustomRangeText(e.target.value)}
                  placeholder="Custom range: 3h, 3 hours, 3 m..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: isDarkMode ? '1px solid #30363d' : '1px solid #e2e8f0',
                    backgroundColor: theme.inputBg,
                    color: theme.textPrimary,
                    fontSize: '12px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                {/* Calendar + Presets Split Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '14px', borderTop: isDarkMode ? '1px solid #21262d' : '1px solid #f1f5f9', paddingTop: '12px' }}>
                  
                  {/* Left: Mini Calendar */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: theme.textPrimary }}>
                        {calendarMonth}
                      </span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => setCalendarMonth(calendarMonth === 'November 2026' ? 'October 2026' : 'November 2026')}
                          style={{
                            background: 'none',
                            border: isDarkMode ? '1px solid #30363d' : '1px solid #e2e8f0',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: theme.textSecondary,
                            padding: '2px 6px',
                            fontSize: '11px',
                          }}
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => setCalendarMonth(calendarMonth === 'October 2026' ? 'November 2026' : 'October 2026')}
                          style={{
                            background: 'none',
                            border: isDarkMode ? '1px solid #30363d' : '1px solid #e2e8f0',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: theme.textSecondary,
                            padding: '2px 6px',
                            fontSize: '11px',
                          }}
                        >
                          ›
                        </button>
                      </div>
                    </div>

                    {/* Weekday headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '10px', color: theme.textMuted, marginBottom: '4px' }}>
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>

                    {/* Calendar Days Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center', fontSize: '11px' }}>
                      {[1, 2].map((d) => (
                        <div key={d} style={{ padding: '6px 0', borderRadius: '4px', backgroundColor: isDarkMode ? 'rgba(37,99,235,0.2)' : '#e2e8f0', color: theme.textPrimary }}>
                          {d}
                        </div>
                      ))}
                      {/* Day 3 (Selected active) */}
                      <div style={{ padding: '6px 0', borderRadius: '4px', backgroundColor: isDarkMode ? '#2563eb' : '#0f172a', color: '#ffffff', fontWeight: 700 }}>
                        3
                      </div>
                      {[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((d) => (
                        <div key={d} style={{ padding: '6px 0', borderRadius: '4px', color: theme.textSecondary, cursor: 'pointer' }}>
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Presets */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderLeft: isDarkMode ? '1px solid #21262d' : '1px solid #f1f5f9', paddingLeft: '10px' }}>
                    <button
                      onClick={() => handleApplyPreset('24h')}
                      style={{
                        padding: '8px 10px',
                        textAlign: 'left',
                        borderRadius: '6px',
                        border: 'none',
                        background: selectedPreset === '24h' ? (isDarkMode ? 'rgba(37,99,235,0.2)' : '#f1f5f9') : 'transparent',
                        color: selectedPreset === '24h' ? '#2563eb' : theme.textPrimary,
                        fontWeight: selectedPreset === '24h' ? 600 : 400,
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Last 24 hours
                    </button>
                    <button
                      onClick={() => handleApplyPreset('7d')}
                      style={{
                        padding: '8px 10px',
                        textAlign: 'left',
                        borderRadius: '6px',
                        border: 'none',
                        background: selectedPreset === '7d' ? (isDarkMode ? 'rgba(37,99,235,0.2)' : '#f1f5f9') : 'transparent',
                        color: selectedPreset === '7d' ? '#2563eb' : theme.textPrimary,
                        fontWeight: selectedPreset === '7d' ? 600 : 400,
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Last 7 days
                    </button>
                    <button
                      onClick={() => handleApplyPreset('30d')}
                      style={{
                        padding: '8px 10px',
                        textAlign: 'left',
                        borderRadius: '6px',
                        border: 'none',
                        background: selectedPreset === '30d' ? (isDarkMode ? 'rgba(37,99,235,0.2)' : '#f1f5f9') : 'transparent',
                        color: selectedPreset === '30d' ? '#2563eb' : theme.textPrimary,
                        fontWeight: selectedPreset === '30d' ? 600 : 400,
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Last 30 days
                    </button>
                  </div>
                </div>

                {/* Bottom Inputs (Start & End) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: theme.textMuted, marginBottom: '3px' }}>Start</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px', borderRadius: '6px', border: isDarkMode ? '1px solid #30363d' : '1px solid #e2e8f0', fontSize: '11px', color: theme.textPrimary }}>
                      <span>📅</span>
                      <input
                        type="text"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'inherit', fontSize: '11px' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: theme.textMuted, marginBottom: '3px' }}>End</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px', borderRadius: '6px', border: isDarkMode ? '1px solid #30363d' : '1px solid #e2e8f0', fontSize: '11px', color: theme.textPrimary }}>
                      <span>📅</span>
                      <input
                        type="text"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'inherit', fontSize: '11px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button
                    onClick={() => {
                      fetchMetrics(selectedPreset);
                      setIsFilterOpen(false);
                    }}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── MODAL: COMO CONECTAR AO CLOUDFLARE ── */}
        {isConfigOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: theme.cardBg,
                borderRadius: '14px',
                border: theme.cardBorder,
                maxWidth: '620px',
                width: '100%',
                padding: '24px 28px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>☁️</span>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: theme.textPrimary }}>
                    Conectar Métricas Reais do Cloudflare
                  </h3>
                </div>
                <button
                  onClick={() => setIsConfigOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: theme.textSecondary }}
                >
                  ✕
                </button>
              </div>

              <p style={{ fontSize: '13px', color: theme.textSecondary, lineHeight: 1.6, marginBottom: '16px' }}>
                Para puxar em tempo real as métricas do domínio <strong>infinityondemand.com.br</strong> direto da sua conta Cloudflare, basta adicionar estas duas chaves no seu arquivo <code>.env.local</code>:
              </p>

              <div style={{ backgroundColor: isDarkMode ? '#0d1117' : '#f1f5f9', padding: '14px 16px', borderRadius: '8px', border: theme.subBorder, fontFamily: 'monospace', fontSize: '12px', color: '#2563eb', marginBottom: '16px' }}>
                <div>CLOUDFLARE_API_TOKEN=&quot;seu_token_api_aqui&quot;</div>
                <div style={{ marginTop: '6px' }}>CLOUDFLARE_ZONE_ID=&quot;seu_zone_id_aqui&quot;</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: theme.textSecondary, marginBottom: '20px' }}>
                <div><strong>1. Onde pegar o Zone ID:</strong> Acesse seu painel Cloudflare &gt; Domínio <em>infinityondemand.com.br</em> &gt; Na aba lateral direita, role até <em>API</em> &gt; copie o <strong>Zone ID</strong>.</div>
                <div><strong>2. Onde pegar o API Token:</strong> No Cloudflare, clique no seu perfil (canto superior direito) &gt; <em>My Profile</em> &gt; <em>API Tokens</em> &gt; <em>Create Token</em> &gt; escolha o modelo <strong>Analytics: Read</strong> e gere o token.</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => setIsConfigOpen(false)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Entendi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 1: TOP 3 CARDS (Requests, Bandwidth, Visits) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          
          {/* Card: Requests */}
          <div
            style={{
              backgroundColor: theme.cardBg,
              borderRadius: '8px',
              border: theme.cardBorder,
              padding: '18px 20px 14px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 500, color: theme.textSecondary, marginBottom: '6px' }}>
              Requests
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '26px', fontWeight: 600, color: theme.textPrimary, letterSpacing: '-0.5px' }}>
                {metrics?.requestsFormatted || '35.2k'}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span>↘</span> {Math.abs(metrics?.requestsChange || 28.0)}%
              </span>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
              <Sparkline data={metrics?.sparklineRequests || [10, 15, 20, 25, 30]} color="#2563eb" />
            </div>
          </div>

          {/* Card: Bandwidth */}
          <div
            style={{
              backgroundColor: theme.cardBg,
              borderRadius: '8px',
              border: theme.cardBorder,
              padding: '18px 20px 14px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 500, color: theme.textSecondary, marginBottom: '6px' }}>
              Bandwidth
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '26px', fontWeight: 600, color: theme.textPrimary, letterSpacing: '-0.5px' }}>
                {metrics?.bandwidthFormatted || '427.45 MB'}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span>↘</span> {Math.abs(metrics?.bandwidthChange || 5.4)}%
              </span>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
              <Sparkline data={metrics?.sparklineBandwidth || [8, 12, 16, 20, 24]} color="#2563eb" />
            </div>
          </div>

          {/* Card: Visits */}
          <div
            style={{
              backgroundColor: theme.cardBg,
              borderRadius: '8px',
              border: theme.cardBorder,
              padding: '18px 20px 14px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 500, color: theme.textSecondary, marginBottom: '6px' }}>
              Visits
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '26px', fontWeight: 600, color: theme.textPrimary, letterSpacing: '-0.5px' }}>
                {metrics?.visitsFormatted || '6k'}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span>↘</span> {Math.abs(metrics?.visitsChange || 22.5)}%
              </span>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
              <Sparkline data={metrics?.sparklineVisits || [4, 8, 12, 16, 20]} color="#2563eb" />
            </div>
          </div>

        </div>

        {/* ── SECTION 2: REQUESTS BY COUNTRY (Map + List) ── */}
        <div
          style={{
            backgroundColor: theme.cardBg,
            borderRadius: '8px',
            border: theme.cardBorder,
            padding: '20px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: theme.textSecondary, margin: 0 }}>
              Requests by country
            </h3>
            {hoveredCountry && (
              <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>
                📍 {hoveredCountry.name}: {hoveredCountry.count} ({hoveredCountry.pct}%)
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.35fr) minmax(280px, 1fr)', gap: '24px', alignItems: 'center' }}>
            
            {/* World Map SVG Visualization */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                minHeight: '290px',
                backgroundColor: theme.mapOcean,
                borderRadius: '6px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                viewBox="0 0 1000 500"
                style={{ width: '100%', height: 'auto', maxHeight: '320px' }}
              >
                <g stroke={theme.mapBorder} strokeWidth="0.8">
                  {/* Alaska */}
                  <path
                    d="M 95,90 L 155,75 L 180,105 L 140,140 L 95,120 Z"
                    fill="#1d4ed8"
                    onMouseEnter={() => setHoveredCountry({ name: 'United States (Alaska)', count: '8.01k', pct: 22.7 })}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                  />
                  {/* Canada & Greenland */}
                  <path
                    d="M 155,75 L 290,65 L 340,90 L 290,140 L 180,140 L 180,105 Z"
                    fill="#93c5fd"
                    onMouseEnter={() => setHoveredCountry({ name: 'Canada', count: '513', pct: 1.5 })}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                  />
                  <path
                    d="M 330,45 L 390,40 L 410,95 L 360,110 Z"
                    fill="#cbd5e1"
                  >
                    <title>Greenland</title>
                  </path>
                  {/* United States (Mainland) */}
                  <path
                    d="M 175,145 L 310,145 L 315,215 L 245,235 L 175,190 Z"
                    fill="#1e40af"
                    onMouseEnter={() => setHoveredCountry({ name: 'United States', count: '8.01k', pct: 22.7 })}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                  />
                  {/* Mexico */}
                  <path
                    d="M 185,200 L 245,235 L 260,285 L 225,280 L 185,225 Z"
                    fill="#cbd5e1"
                  />

                  {/* South America */}
                  {/* Brazil */}
                  <path
                    d="M 315,260 L 390,280 L 405,335 L 380,390 L 330,370 L 305,300 Z"
                    fill="#1e3a8a"
                    onMouseEnter={() => setHoveredCountry({ name: 'Brazil', count: '8.21k', pct: 23.3 })}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                  />
                  <path
                    d="M 285,270 L 315,260 L 330,370 L 320,445 L 295,430 L 285,340 Z"
                    fill="#cbd5e1"
                  />

                  {/* Europe */}
                  <path
                    d="M 465,120 L 485,115 L 485,145 L 465,145 Z"
                    fill="#93c5fd"
                    onMouseEnter={() => setHoveredCountry({ name: 'United Kingdom', count: '466', pct: 1.3 })}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                  />
                  <path
                    d="M 488,135 L 535,130 L 530,175 L 480,180 Z"
                    fill="#2563eb"
                    onMouseEnter={() => setHoveredCountry({ name: 'Netherlands / Belgium / Germany', count: '9.59k', pct: 27.2 })}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                  />
                  <path
                    d="M 505,70 L 555,65 L 540,120 L 510,125 Z"
                    fill="#bfdbfe"
                  />
                  <path
                    d="M 535,130 L 595,125 L 590,175 L 530,175 Z"
                    fill="#3b82f6"
                    onMouseEnter={() => setHoveredCountry({ name: 'Poland / Eastern Europe', count: '1.41k', pct: 4.0 })}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                  />

                  {/* Africa */}
                  <path
                    d="M 475,200 L 585,195 L 610,270 L 555,395 L 510,380 L 465,260 Z"
                    fill="#e2e8f0"
                  />

                  {/* Russia & Northern Asia */}
                  <path
                    d="M 595,70 L 890,65 L 850,150 L 610,150 Z"
                    fill="#bfdbfe"
                  />

                  {/* China */}
                  <path
                    d="M 650,160 L 815,160 L 810,240 L 710,265 L 635,210 Z"
                    fill="#93c5fd"
                    onMouseEnter={() => setHoveredCountry({ name: 'China', count: '682', pct: 1.9 })}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                  />

                  {/* Japan */}
                  <path
                    d="M 835,165 L 860,170 L 850,215 L 830,205 Z"
                    fill="#60a5fa"
                    onMouseEnter={() => setHoveredCountry({ name: 'Japan', count: '1.33k', pct: 3.8 })}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                  />

                  {/* Taiwan */}
                  <path
                    d="M 788,245 L 802,245 L 798,265 L 784,260 Z"
                    fill="#3b82f6"
                    onMouseEnter={() => setHoveredCountry({ name: 'Taiwan', count: '1.74k', pct: 4.9 })}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                  />

                  {/* India */}
                  <path
                    d="M 645,215 L 710,215 L 695,295 L 655,270 Z"
                    fill="#bfdbfe"
                    onMouseEnter={() => setHoveredCountry({ name: 'India', count: '314', pct: 0.9 })}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                  />

                  {/* Southeast Asia */}
                  <path
                    d="M 725,275 L 775,275 L 810,335 L 730,340 Z"
                    fill="#93c5fd"
                    onMouseEnter={() => setHoveredCountry({ name: 'Singapore & SE Asia', count: '510', pct: 1.4 })}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                  />

                  {/* Australia & Oceania */}
                  <path
                    d="M 770,355 L 890,345 L 885,435 L 785,445 Z"
                    fill="#bfdbfe"
                    onMouseEnter={() => setHoveredCountry({ name: 'Australia', count: '245', pct: 0.7 })}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                  />
                  <path
                    d="M 900,430 L 925,430 L 915,465 L 895,455 Z"
                    fill="#bfdbfe"
                  >
                    <title>New Zealand</title>
                  </path>
                </g>
              </svg>
            </div>

            {/* Right: Countries List with Progress Bars */}
            <div style={{ maxHeight: '320px', overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {countriesList.map((item: any) => (
                <div
                  key={item.code}
                  onMouseEnter={() => setHoveredCountry({ name: item.name, count: item.requests, pct: item.percent })}
                  onMouseLeave={() => setHoveredCountry(null)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr 60px',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <span style={{ fontSize: '13px', color: theme.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </span>
                  
                  {/* Progress Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor: theme.barTrack,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${item.percent}%`,
                        height: '100%',
                        borderRadius: '3px',
                        backgroundColor: '#2563eb',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>

                  {/* Value */}
                  <span style={{ fontSize: '12px', color: theme.textSecondary, textAlign: 'right', fontWeight: 500 }}>
                    {item.requests}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── SECTION 3: SECURITY (From Image 5) ── */}
        <div
          style={{
            backgroundColor: theme.cardBg,
            borderRadius: '8px',
            border: theme.cardBorder,
            padding: '20px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: theme.textSecondary, margin: '0 0 16px 0' }}>
            Security
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '12px', color: theme.textSecondary, display: 'block', marginBottom: '6px' }}>
                Encrypted requests
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: 600, color: theme.textPrimary }}>
                  {metrics?.security?.encryptedRequests || '30k'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#dc2626' }}>↘ 31.5%</span>
              </div>
              <Sparkline data={metrics?.security?.sparkline || [10, 15, 20, 25]} color="#2563eb" height={36} />
            </div>

            <div>
              <span style={{ fontSize: '12px', color: theme.textSecondary, display: 'block', marginBottom: '6px' }}>
                Encrypted requests rate
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: 600, color: theme.textPrimary }}>
                  {metrics?.security?.encryptedRequestsRate || '85.22%'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#dc2626' }}>↘ 4.8%</span>
              </div>
              <Sparkline data={[20, 18, 22, 19, 21, 23, 20]} color="#2563eb" height={36} />
            </div>

            <div>
              <span style={{ fontSize: '12px', color: theme.textSecondary, display: 'block', marginBottom: '6px' }}>
                Encrypted bandwidth
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: 600, color: theme.textPrimary }}>
                  {metrics?.security?.encryptedBandwidth || '407.48 MB'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#dc2626' }}>↘ 6.4%</span>
              </div>
              <Sparkline data={metrics?.sparklineBandwidth || [10, 15, 22, 28]} color="#2563eb" height={36} />
            </div>

            <div>
              <span style={{ fontSize: '12px', color: theme.textSecondary, display: 'block', marginBottom: '6px' }}>
                Encrypted bandwidth rate
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: 600, color: theme.textPrimary }}>
                  {metrics?.security?.encryptedBandwidthRate || '95.33%'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#dc2626' }}>↘ 1.1%</span>
              </div>
              <Sparkline data={[25, 24, 26, 25, 27, 26]} color="#2563eb" height={36} />
            </div>
          </div>
        </div>

        {/* ── SECTION 4: CACHE (From Image 5) ── */}
        <div
          style={{
            backgroundColor: theme.cardBg,
            borderRadius: '8px',
            border: theme.cardBorder,
            padding: '20px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: theme.textSecondary, margin: '0 0 16px 0' }}>
            Cache
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '12px', color: theme.textSecondary, display: 'block', marginBottom: '6px' }}>
                Cached requests
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: 600, color: theme.textPrimary }}>
                  {metrics?.cache?.cachedRequests || '1.23k'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#16a34a' }}>↗ 23.7%</span>
              </div>
              <Sparkline data={metrics?.cache?.sparkline || [3, 5, 8, 11]} color="#2563eb" height={36} />
            </div>

            <div>
              <span style={{ fontSize: '12px', color: theme.textSecondary, display: 'block', marginBottom: '6px' }}>
                Cached requests rate
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: 600, color: theme.textPrimary }}>
                  {metrics?.cache?.cachedRequestsRate || '3.49%'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#16a34a' }}>↗ 71.8%</span>
              </div>
              <Sparkline data={[5, 7, 9, 11, 14, 12]} color="#2563eb" height={36} />
            </div>

            <div>
              <span style={{ fontSize: '12px', color: theme.textSecondary, display: 'block', marginBottom: '6px' }}>
                Cached bandwidth
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: 600, color: theme.textPrimary }}>
                  {metrics?.cache?.cachedBandwidth || '67.63 MB'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#dc2626' }}>↘ 2.5%</span>
              </div>
              <Sparkline data={[12, 14, 11, 15, 17, 13]} color="#2563eb" height={36} />
            </div>

            <div>
              <span style={{ fontSize: '12px', color: theme.textSecondary, display: 'block', marginBottom: '6px' }}>
                Cached bandwidth rate
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: 600, color: theme.textPrimary }}>
                  {metrics?.cache?.cachedBandwidthRate || '15.82%'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#16a34a' }}>↗ 3.1%</span>
              </div>
              <Sparkline data={[14, 15, 16, 15, 18, 17]} color="#2563eb" height={36} />
            </div>
          </div>
        </div>

        {/* ── SECTION 5: ERRORS (From Image 5) ── */}
        <div
          style={{
            backgroundColor: theme.cardBg,
            borderRadius: '8px',
            border: theme.cardBorder,
            padding: '20px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: theme.textSecondary, margin: '0 0 16px 0' }}>
            Errors
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '12px', color: theme.textSecondary, display: 'block', marginBottom: '6px' }}>
                4xx errors
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: 600, color: theme.textPrimary }}>
                  {metrics?.errors?.error4xx || '15.84k'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0d9488' }}>↘ 38.5%</span>
              </div>
              <Sparkline data={metrics?.errors?.sparkline || [10, 14, 18, 22]} color="#2563eb" height={36} />
            </div>

            <div>
              <span style={{ fontSize: '12px', color: theme.textSecondary, display: 'block', marginBottom: '6px' }}>
                4xx error rate
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: 600, color: theme.textPrimary }}>
                  {metrics?.errors?.error4xxRate || '44.99%'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0d9488' }}>↘ 14.6%</span>
              </div>
              <Sparkline data={[22, 20, 19, 18, 16, 15]} color="#2563eb" height={36} />
            </div>

            <div>
              <span style={{ fontSize: '12px', color: theme.textSecondary, display: 'block', marginBottom: '6px' }}>
                5xx errors
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: 600, color: theme.textPrimary }}>
                  {metrics?.errors?.error5xx || '2.38k'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0d9488' }}>↘ 76.7%</span>
              </div>
              <Sparkline data={[12, 10, 8, 7, 5, 4]} color="#2563eb" height={36} />
            </div>

            <div>
              <span style={{ fontSize: '12px', color: theme.textSecondary, display: 'block', marginBottom: '6px' }}>
                5xx error rate
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: 600, color: theme.textPrimary }}>
                  {metrics?.errors?.error5xxRate || '6.76%'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0d9488' }}>↘ 67.6%</span>
              </div>
              <Sparkline data={[10, 9, 8, 7, 6, 5]} color="#2563eb" height={36} />
            </div>
          </div>
        </div>

        {/* ── SECTION 6: NETWORK (From Image 5) ── */}
        <div
          style={{
            backgroundColor: theme.cardBg,
            borderRadius: '8px',
            border: theme.cardBorder,
            padding: '20px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: theme.textSecondary, margin: '0 0 20px 0' }}>
            Network
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            
            {/* Column 1: Top HTTP versions */}
            <div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: theme.textSecondary, display: 'block', marginBottom: '14px' }}>
                Top HTTP versions
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(metrics?.network?.httpVersions || [
                  { name: 'HTTP/1.1', val: '17.73k', pct: 90 },
                  { name: 'HTTP/2', val: '11.82k', pct: 60 },
                  { name: 'HTTP/3', val: '5.65k', pct: 28 },
                  { name: 'HTTP/1.0', val: '6', pct: 2 },
                ]).map((item: any) => (
                  <div key={item.name} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 55px', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: theme.textPrimary }}>{item.name}</span>
                    <div style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: theme.barTrack, overflow: 'hidden' }}>
                      <div style={{ width: `${item.pct}%`, height: '100%', borderRadius: '3px', backgroundColor: '#2563eb' }} />
                    </div>
                    <span style={{ fontSize: '12px', color: theme.textSecondary, textAlign: 'right' }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: TLS versions */}
            <div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: theme.textSecondary, display: 'block', marginBottom: '14px' }}>
                TLS versions
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(metrics?.network?.tlsVersions || [
                  { name: 'TLSv1.3', val: '28.88k', pct: 95 },
                  { name: 'none', val: '5.2k', pct: 18 },
                  { name: 'TLSv1.2', val: '1.12k', pct: 6 },
                ]).map((item: any) => (
                  <div key={item.name} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 55px', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: theme.textPrimary }}>{item.name}</span>
                    <div style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: theme.barTrack, overflow: 'hidden' }}>
                      <div style={{ width: `${item.pct}%`, height: '100%', borderRadius: '3px', backgroundColor: '#2563eb' }} />
                    </div>
                    <span style={{ fontSize: '12px', color: theme.textSecondary, textAlign: 'right' }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Top content types */}
            <div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: theme.textSecondary, display: 'block', marginBottom: '14px' }}>
                Top content types
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(metrics?.network?.contentTypes || [
                  { name: 'html', val: '21.74k', pct: 92 },
                  { name: 'htc', val: '3.61k', pct: 16 },
                  { name: 'txt', val: '3.29k', pct: 14 },
                  { name: 'Empty', val: '2.02k', pct: 9 },
                ]).map((item: any) => (
                  <div key={item.name} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 55px', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: theme.textPrimary }}>{item.name}</span>
                    <div style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: theme.barTrack, overflow: 'hidden' }}>
                      <div style={{ width: `${item.pct}%`, height: '100%', borderRadius: '3px', backgroundColor: '#2563eb' }} />
                    </div>
                    <span style={{ fontSize: '12px', color: theme.textSecondary, textAlign: 'right' }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
