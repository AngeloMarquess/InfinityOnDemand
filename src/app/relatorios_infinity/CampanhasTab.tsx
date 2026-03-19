'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: string;
  dailyBudget: number | null;
  lifetimeBudget: number | null;
  startTime: string;
  stopTime: string;
  createdTime: string;
}

interface AdAccount {
  id: string;
  accountId: string;
  name: string;
  status: number;
  currency: string;
  businessName: string;
}

interface InsightTotals {
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  ctr: string;
  cpc: string;
}

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

const OBJECTIVES = [
  { value: 'OUTCOME_AWARENESS', label: '🧠 Reconhecimento', desc: 'Alcance e lembrança de marca' },
  { value: 'OUTCOME_TRAFFIC', label: '🔗 Tráfego', desc: 'Visitas ao site ou app' },
  { value: 'OUTCOME_ENGAGEMENT', label: '💬 Engajamento', desc: 'Curtidas, comentários, compartilhamentos' },
  { value: 'OUTCOME_LEADS', label: '📋 Leads', desc: 'Capturar informações de contato' },
  { value: 'OUTCOME_SALES', label: '🛒 Vendas', desc: 'Conversões e compras' },
  { value: 'OUTCOME_APP_PROMOTION', label: '📱 App', desc: 'Instalações de aplicativo' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  ACTIVE: { bg: 'rgba(0,219,121,0.15)', text: '#00DB79', label: 'Ativa' },
  PAUSED: { bg: 'rgba(255,193,7,0.15)', text: '#FFC107', label: 'Pausada' },
  DELETED: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444', label: 'Excluída' },
  ARCHIVED: { bg: 'rgba(156,163,175,0.15)', text: '#9CA3AF', label: 'Arquivada' },
};

const cardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '16px',
  padding: '24px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.1)',
  backgroundColor: 'rgba(255,255,255,0.05)',
  color: '#fff',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
};

const btnPrimary: React.CSSProperties = {
  padding: '12px 28px',
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 700,
  fontFamily: 'inherit',
  background: 'linear-gradient(135deg, #00DB79, #4a90e2)',
  color: '#000',
  transition: 'all 0.2s',
};

export default function CampanhasTab() {
  const [accounts, setAccounts] = useState<AdAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [insights, setInsights] = useState<InsightRow[]>([]);
  const [totals, setTotals] = useState<InsightTotals | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [datePreset, setDatePreset] = useState('last_30d');

  // Form state
  const [newName, setNewName] = useState('');
  const [newObjective, setNewObjective] = useState('OUTCOME_TRAFFIC');
  const [newBudget, setNewBudget] = useState('50');
  const [createStatus, setCreateStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [createMessage, setCreateMessage] = useState('');

  const loadAccounts = useCallback(async () => {
    try {
      const res = await fetch('/api/ads/accounts');
      const data = await res.json();
      if (data.accounts) {
        // Filter only active accounts
        const active = data.accounts.filter((a: AdAccount) => a.status === 1);
        setAccounts(active);
        if (active.length > 0) {
          // Try to find InfinityOnDemand account
          const infinity = active.find((a: AdAccount) => a.name?.toLowerCase().includes('infinity'));
          setSelectedAccount(infinity?.id || active[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load accounts:', e);
    }
  }, []);

  const loadCampaigns = useCallback(async () => {
    if (!selectedAccount) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/ads/campaigns?accountId=${selectedAccount}`);
      const data = await res.json();
      if (data.campaigns) setCampaigns(data.campaigns);
    } catch (e) {
      console.error('Failed to load campaigns:', e);
    }
    setLoading(false);
  }, [selectedAccount]);

  const loadInsights = useCallback(async () => {
    if (!selectedAccount) return;
    try {
      const res = await fetch(`/api/ads/insights?accountId=${selectedAccount}&datePreset=${datePreset}`);
      const data = await res.json();
      if (data.insights) setInsights(data.insights);
      if (data.totals) setTotals(data.totals);
    } catch (e) {
      console.error('Failed to load insights:', e);
    }
  }, [selectedAccount, datePreset]);

  useEffect(() => { loadAccounts(); }, [loadAccounts]);
  useEffect(() => {
    if (selectedAccount) {
      loadCampaigns();
      loadInsights();
    }
  }, [selectedAccount, loadCampaigns, loadInsights]);

  const handleCreateCampaign = async () => {
    if (!newName.trim()) return;
    setCreateStatus('loading');
    try {
      const res = await fetch('/api/ads/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          objective: newObjective,
          dailyBudget: parseFloat(newBudget),
          status: 'PAUSED',
          accountId: selectedAccount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCreateStatus('success');
        setCreateMessage(`Campanha criada! ID: ${data.campaignId}`);
        setNewName('');
        await loadCampaigns();
        setTimeout(() => { setShowCreate(false); setCreateStatus('idle'); }, 2000);
      } else {
        setCreateStatus('error');
        setCreateMessage(data.error || 'Erro ao criar campanha');
      }
    } catch {
      setCreateStatus('error');
      setCreateMessage('Erro de rede');
    }
  };

  const getObjectiveLabel = (obj: string) => {
    const found = OBJECTIVES.find(o => o.value === obj);
    return found ? found.label : obj;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Account Selector + Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>📊 Gerenciador de Campanhas</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Marketing API da Meta • Anúncios pagos</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            style={{
              ...inputStyle,
              width: 'auto',
              minWidth: '220px',
              cursor: 'pointer',
            }}
          >
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id} style={{ backgroundColor: '#1a1b1e' }}>
                {acc.name} ({acc.businessName || acc.accountId})
              </option>
            ))}
          </select>
          <button onClick={() => setShowCreate(!showCreate)} style={btnPrimary}>
            {showCreate ? '✕ Fechar' : '+ Nova Campanha'}
          </button>
        </div>
      </div>

      {/* ── Metrics Overview ── */}
      {totals && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Impressões', value: totals.impressions.toLocaleString('pt-BR'), icon: '👁️', color: '#8B5CF6' },
            { label: 'Cliques', value: totals.clicks.toLocaleString('pt-BR'), icon: '👆', color: '#06B6D4' },
            { label: 'CTR', value: `${totals.ctr}%`, icon: '📈', color: '#00DB79' },
            { label: 'CPC Médio', value: `R$ ${totals.cpc}`, icon: '💰', color: '#F59E0B' },
            { label: 'Gasto Total', value: `R$ ${totals.spend.toFixed(2)}`, icon: '💳', color: '#EC4899' },
            { label: 'Alcance', value: totals.reach.toLocaleString('pt-BR'), icon: '🌐', color: '#4a90e2' },
          ].map((metric, i) => (
            <div key={i} style={{
              ...cardStyle,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: `linear-gradient(90deg, ${metric.color}, transparent)`,
              }} />
              <span style={{ fontSize: '24px' }}>{metric.icon}</span>
              <p style={{ fontSize: '24px', fontWeight: 700, margin: '8px 0 4px' }}>{metric.value}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{metric.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Date Preset ── */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { value: 'today', label: 'Hoje' },
          { value: 'yesterday', label: 'Ontem' },
          { value: 'last_7d', label: '7 dias' },
          { value: 'last_30d', label: '30 dias' },
          { value: 'last_90d', label: '90 dias' },
          { value: 'this_month', label: 'Este mês' },
          { value: 'last_month', label: 'Último mês' },
        ].map(preset => (
          <button
            key={preset.value}
            onClick={() => setDatePreset(preset.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: datePreset === preset.value ? 'rgba(0,219,121,0.3)' : 'rgba(255,255,255,0.08)',
              backgroundColor: datePreset === preset.value ? 'rgba(0,219,121,0.1)' : 'transparent',
              color: datePreset === preset.value ? '#00DB79' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* ── Create Campaign Form ── */}
      {showCreate && (
        <div style={{
          ...cardStyle,
          border: '1px solid rgba(0,219,121,0.2)',
          background: 'linear-gradient(135deg, rgba(0,219,121,0.05), rgba(74,144,226,0.05))',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>🚀 Nova Campanha</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', display: 'block' }}>Nome da Campanha</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Campanha Março 2026"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', display: 'block' }}>Orçamento Diário (R$)</label>
              <input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                min="1"
                style={inputStyle}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '10px', display: 'block' }}>Objetivo</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {OBJECTIVES.map(obj => (
                  <button
                    key={obj.value}
                    onClick={() => setNewObjective(obj.value)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: newObjective === obj.value ? 'rgba(0,219,121,0.4)' : 'rgba(255,255,255,0.08)',
                      backgroundColor: newObjective === obj.value ? 'rgba(0,219,121,0.1)' : 'rgba(255,255,255,0.03)',
                      color: newObjective === obj.value ? '#00DB79' : 'rgba(255,255,255,0.7)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{obj.label}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{obj.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '20px' }}>
            <button
              onClick={handleCreateCampaign}
              disabled={createStatus === 'loading' || !newName.trim()}
              style={{
                ...btnPrimary,
                opacity: createStatus === 'loading' || !newName.trim() ? 0.5 : 1,
              }}
            >
              {createStatus === 'loading' ? '⏳ Criando...' : '✅ Criar Campanha (Pausada)'}
            </button>
            {createMessage && (
              <span style={{
                fontSize: '13px',
                color: createStatus === 'success' ? '#00DB79' : '#EF4444',
              }}>
                {createMessage}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Campaign List ── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
            📋 Campanhas ({campaigns.length})
          </h3>
          <button
            onClick={() => { loadCampaigns(); loadInsights(); }}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
              fontSize: '12px', fontFamily: 'inherit',
            }}
          >
            🔄 Atualizar
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
            ⏳ Carregando campanhas...
          </div>
        ) : campaigns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
            <span style={{ fontSize: '48px' }}>📭</span>
            <p style={{ marginTop: '12px' }}>Nenhuma campanha encontrada nesta conta</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>Crie sua primeira campanha acima</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
              gap: '12px',
              padding: '12px 16px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              <span>Campanha</span>
              <span>Objetivo</span>
              <span>Status</span>
              <span>Orçamento/dia</span>
              <span>Gasto</span>
              <span>Impressões</span>
            </div>

            {campaigns.map(c => {
              const statusInfo = STATUS_COLORS[c.status] || STATUS_COLORS.PAUSED;
              const insight = insights.find(i => i.campaignId === c.id);

              return (
                <div key={c.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>{c.name}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                      ID: {c.id}
                    </p>
                  </div>
                  <span style={{ fontSize: '13px' }}>{getObjectiveLabel(c.objective)}</span>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: statusInfo.bg,
                    color: statusInfo.text,
                    width: 'fit-content',
                  }}>
                    {statusInfo.label}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>
                    {c.dailyBudget ? `R$ ${c.dailyBudget.toFixed(2)}` : '—'}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#EC4899' }}>
                    {insight ? `R$ ${insight.spend.toFixed(2)}` : '—'}
                  </span>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                    {insight ? insight.impressions.toLocaleString('pt-BR') : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Performance Table ── */}
      {insights.length > 0 && (
        <div style={cardStyle}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>📈 Performance Detalhada</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Campanha</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Impressões</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Alcance</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Cliques</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>CTR</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>CPC</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>CPM</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Gasto</th>
                </tr>
              </thead>
              <tbody>
                {insights.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{row.campaignName}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>{row.impressions.toLocaleString('pt-BR')}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>{row.reach.toLocaleString('pt-BR')}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>{row.clicks.toLocaleString('pt-BR')}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: '#00DB79' }}>{row.ctr.toFixed(2)}%</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>R$ {row.cpc.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>R$ {row.cpm.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#EC4899' }}>R$ {row.spend.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
