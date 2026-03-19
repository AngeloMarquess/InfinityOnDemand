'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Settings {
  client_id: string;
  business_name: string;
  business_segment: string;
  business_description: string;
  target_audience: string;
  competitors: string[];
  brand_tone: string;
  openai_api_key: string;
  instagram_token: string;
  meta_ads_token: string;
  meta_ad_account_id: string;
}

const glassCard: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '20px',
  padding: '32px',
  backdropFilter: 'blur(20px)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.1)',
  backgroundColor: 'rgba(0,0,0,0.3)',
  color: '#fff',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.5)',
  marginBottom: '6px',
  display: 'block',
};

export default function ConfiguracoesTab() {
  const [settings, setSettings] = useState<Settings>({
    client_id: 'default',
    business_name: '',
    business_segment: '',
    business_description: '',
    target_audience: '',
    competitors: [],
    brand_tone: 'profissional e acessível',
    openai_api_key: '',
    instagram_token: '',
    meta_ads_token: '',
    meta_ad_account_id: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [competitorInput, setCompetitorInput] = useState('');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/agent/settings?clientId=default');
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    } catch {
      console.warn('Could not load agent settings');
    }
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const saveSettings = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/agent/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      console.error('Failed to save settings');
    }
    setSaving(false);
  };

  const addCompetitor = () => {
    if (competitorInput.trim() && !settings.competitors.includes(competitorInput.trim())) {
      setSettings(prev => ({ ...prev, competitors: [...prev.competitors, competitorInput.trim()] }));
      setCompetitorInput('');
    }
  };

  const removeCompetitor = (c: string) => {
    setSettings(prev => ({ ...prev, competitors: prev.competitors.filter(x => x !== c) }));
  };

  const maskKey = (key: string) => key ? key.substring(0, 8) + '••••••••' + key.substring(key.length - 4) : '';

  const update = (field: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            ⚙️ Configurações
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>
            Configure o agente IA, integrações e contexto do cliente
          </p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          style={{
            padding: '12px 28px', borderRadius: '12px', border: 'none',
            background: saved ? 'rgba(0,219,121,0.2)' : 'linear-gradient(135deg, #00DB79, #00bf68)',
            color: saved ? '#00DB79' : '#000', fontWeight: 700, fontSize: '14px',
            cursor: saving ? 'wait' : 'pointer', fontFamily: 'inherit',
            transition: 'all 0.3s',
          }}
        >
          {saving ? '⏳ Salvando...' : saved ? '✅ Salvo!' : '💾 Salvar Configurações'}
        </button>
      </div>

      {/* ── API Keys ── */}
      <div style={glassCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <span style={{ fontSize: '24px' }}>🔑</span>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>API Keys</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Chaves de acesso para integrações</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {[
            { key: 'openai_api_key' as keyof Settings, label: 'OpenAI API Key', hint: 'Acesse platform.openai.com → API Keys → Create new key', placeholder: 'sk-...' },
            { key: 'instagram_token' as keyof Settings, label: 'Instagram Access Token', hint: 'Token da API do Instagram Graph', placeholder: 'EAA...' },
            { key: 'meta_ads_token' as keyof Settings, label: 'Meta Ads Token', hint: 'Token da Marketing API da Meta', placeholder: 'EAA...' },
            { key: 'meta_ad_account_id' as keyof Settings, label: 'Meta Ad Account ID', hint: 'ID da conta de anúncios (act_XXXXX)', placeholder: 'act_...' },
          ].map(field => (
            <div key={field.key}>
              <label style={labelStyle}>{field.label}</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type={showKeys[field.key] ? 'text' : 'password'}
                  value={settings[field.key] as string}
                  onChange={e => update(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(0,219,121,0.3)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
                <button
                  onClick={() => setShowKeys(p => ({ ...p, [field.key]: !p[field.key] }))}
                  style={{
                    padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit',
                  }}
                >
                  {showKeys[field.key] ? '🙈' : '👁️'}
                </button>
              </div>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '4px' }}>{field.hint}</p>
            </div>
          ))}
        </div>

        {/* Status indicators */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
          {[
            { label: 'OpenAI', connected: !!settings.openai_api_key },
            { label: 'Instagram', connected: !!settings.instagram_token },
            { label: 'Meta Ads', connected: !!settings.meta_ads_token },
          ].map(s => (
            <div key={s.label} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '8px',
              backgroundColor: s.connected ? 'rgba(0,219,121,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${s.connected ? 'rgba(0,219,121,0.15)' : 'rgba(239,68,68,0.15)'}`,
            }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                backgroundColor: s.connected ? '#00DB79' : '#EF4444',
              }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: s.connected ? '#00DB79' : '#EF4444' }}>
                {s.label} {s.connected ? 'Conectado' : 'Não configurado'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Business Context ── */}
      <div style={glassCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <span style={{ fontSize: '24px' }}>🏢</span>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Sobre o Negócio</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>O agente usa essas informações para criar campanhas personalizadas</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Nome do Negócio</label>
            <input value={settings.business_name} onChange={e => update('business_name', e.target.value)} placeholder="Ex: Infinity On Demand" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'rgba(0,219,121,0.3)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
          </div>
          <div>
            <label style={labelStyle}>Segmento</label>
            <input value={settings.business_segment} onChange={e => update('business_segment', e.target.value)} placeholder="Ex: SaaS / Delivery / Restaurantes" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'rgba(0,219,121,0.3)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Descrição do Negócio</label>
            <textarea value={settings.business_description} onChange={e => update('business_description', e.target.value)}
              placeholder="Descreva o que seu negócio faz, quais problemas resolve, diferenciais..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(0,219,121,0.3)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
          </div>
          <div>
            <label style={labelStyle}>Público-Alvo</label>
            <input value={settings.target_audience} onChange={e => update('target_audience', e.target.value)} placeholder="Ex: Donos de pizzarias e restaurantes" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'rgba(0,219,121,0.3)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
          </div>
          <div>
            <label style={labelStyle}>Tom da Marca</label>
            <input value={settings.brand_tone} onChange={e => update('brand_tone', e.target.value)} placeholder="Ex: profissional, divertido, técnico..." style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'rgba(0,219,121,0.3)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
          </div>
        </div>
      </div>

      {/* ── Competitors ── */}
      <div style={glassCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <span style={{ fontSize: '24px' }}>🔍</span>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Concorrentes</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Adicione perfis de concorrentes para o agente analisar</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            value={competitorInput}
            onChange={e => setCompetitorInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCompetitor()}
            placeholder="@handle do concorrente"
            style={{ ...inputStyle, flex: 1 }}
            onFocus={e => { e.target.style.borderColor = 'rgba(0,219,121,0.3)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          />
          <button onClick={addCompetitor} style={{
            padding: '12px 20px', borderRadius: '12px', border: 'none',
            backgroundColor: 'rgba(0,219,121,0.15)', color: '#00DB79',
            fontWeight: 600, cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit',
          }}>
            + Adicionar
          </button>
        </div>

        {settings.competitors.length > 0 ? (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {settings.competitors.map(c => (
              <span key={c} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '8px',
                backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                fontSize: '13px', color: '#C084FC',
              }}>
                {c}
                <button onClick={() => removeCompetitor(c)} style={{
                  background: 'none', border: 'none', color: '#EF4444',
                  cursor: 'pointer', fontSize: '14px', padding: '0 2px',
                }}>×</button>
              </span>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>
            Nenhum concorrente adicionado. Adicione para o agente comparar estratégias.
          </p>
        )}
      </div>

      {/* OpenAI Key Guide */}
      <div style={{
        ...glassCard,
        background: 'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(236,72,153,0.04) 100%)',
        border: '1px solid rgba(139,92,246,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={{ fontSize: '24px' }}>📖</span>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Como obter a OpenAI API Key</h3>
        </div>
        <ol style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 2, paddingLeft: '20px' }}>
          <li>Acesse <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" style={{ color: '#C084FC', textDecoration: 'underline' }}>platform.openai.com</a></li>
          <li>Faça login ou crie uma conta</li>
          <li>Vá em <strong style={{ color: '#fff' }}>API Keys</strong> no menu lateral</li>
          <li>Clique em <strong style={{ color: '#fff' }}>Create new secret key</strong></li>
          <li>Copie a chave (começa com <code style={{ color: '#00DB79', backgroundColor: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>sk-</code>) e cole acima</li>
          <li>Adicione créditos em <strong style={{ color: '#fff' }}>Billing → Add payment method</strong></li>
        </ol>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '12px' }}>
          💡 O modelo GPT-4o-mini custa ~$0.15 por 1M tokens de input. Uma conversa típica custa menos de R$0.01.
        </p>
      </div>
    </div>
  );
}
