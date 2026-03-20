'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Client {
  id: string;
  email: string;
  full_name: string;
  plan_id: string;
  plan_name: string;
  plan_price: number;
  subscription_status: string;
  subscription_expires_at: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  usage: { leads: number; proposals: number; tasks: number };
}

interface Summary {
  total_clients: number;
  active_subscriptions: number;
  mrr: number;
  mrr_formatted: string;
}

export default function AdminCRMPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [adminKey, setAdminKey] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/crm/admin?key=${adminKey}`);
      if (!res.ok) throw new Error('Unauthorized');
      const data = await res.json();
      setClients(data.clients);
      setSummary(data.summary);
      setIsAuthed(true);
    } catch {
      alert('Chave inválida ou erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId: string, action: string, planId?: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/crm/admin?key=${adminKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, action, plan_id: planId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData(); // Refresh
      } else {
        alert(data.error || 'Erro');
      }
    } finally {
      setActionLoading(null);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'cancelled': return '#ef4444';
      case 'blocked': return '#dc2626';
      case 'past_due': return '#f59e0b';
      default: return 'var(--text-tertiary)';
    }
  };

  const planColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'linear-gradient(135deg, #7C3AED, #EC4899)';
      case 'starter': return 'linear-gradient(135deg, #00AAFF, #00DF81)';
      default: return 'var(--bg-tertiary)';
    }
  };

  if (!isAuthed) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
          <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>🔐 Admin CRM</h1>
            <p className="text-secondary" style={{ marginBottom: '32px' }}>Insira a chave de admin para acessar</p>
            <input
              type="password"
              placeholder="Chave de admin"
              value={adminKey}
              onChange={e => setAdminKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchData()}
              style={{
                width: '100%', padding: '14px 20px', borderRadius: '12px',
                border: '1px solid var(--bg-tertiary)', background: 'var(--bg-secondary)',
                color: 'var(--text-primary)', outline: 'none', fontSize: '15px', marginBottom: '16px'
              }}
            />
            <button onClick={fetchData} disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px' }}>
              {loading ? 'Verificando...' : 'Acessar Painel'}
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ flex: 1, padding: '100px 24px 60px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>
              ⚙️ Admin <span className="text-gradient">CRM SaaS</span>
            </h1>
            <p className="text-secondary">Gerencie clientes, planos e assinaturas</p>
          </div>
          <button onClick={fetchData} className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
            🔄 Atualizar
          </button>
        </div>

        {/* KPI Cards */}
        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)' }}>
              <div className="text-secondary" style={{ fontSize: '13px', marginBottom: '8px' }}>Total de Clientes</div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--accent-primary)' }}>{summary.total_clients}</div>
            </div>
            <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)' }}>
              <div className="text-secondary" style={{ fontSize: '13px', marginBottom: '8px' }}>Assinaturas Ativas</div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#22c55e' }}>{summary.active_subscriptions}</div>
            </div>
            <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)' }}>
              <div className="text-secondary" style={{ fontSize: '13px', marginBottom: '8px' }}>MRR</div>
              <div style={{ fontSize: '36px', fontWeight: 800 }}>
                <span className="text-gradient">{summary.mrr_formatted}</span>
              </div>
            </div>
          </div>
        )}

        {/* Clients Table */}
        <div style={{ borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--bg-tertiary)', fontWeight: 700 }}>
            Clientes ({clients.length})
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bg-tertiary)' }}>
                  {['Nome', 'Email', 'Plano', 'Status', 'Leads', 'Propostas', 'Tarefas', 'Desde', 'Ações'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-tertiary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client.id} style={{ borderBottom: '1px solid var(--bg-tertiary)', background: client.subscription_status === 'blocked' ? 'rgba(220,38,38,0.08)' : undefined }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{client.full_name || '—'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{client.email}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700,
                        background: planColor(client.plan_id), color: client.plan_id === 'free' ? 'var(--text-secondary)' : '#fff'
                      }}>
                        {client.plan_name}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: statusColor(client.subscription_status), fontWeight: 600, fontSize: '13px' }}>
                        {client.subscription_status === 'blocked' ? '🚫' : '●'} {client.subscription_status || 'free'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>{client.usage.leads}</td>
                    <td style={{ padding: '14px 16px' }}>{client.usage.proposals}</td>
                    <td style={{ padding: '14px 16px' }}>{client.usage.tasks}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {new Date(client.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <select
                          disabled={actionLoading === client.id || client.subscription_status === 'blocked'}
                          defaultValue={client.plan_id}
                          onChange={e => handleAction(client.id, 'change_plan', e.target.value)}
                          style={{
                            padding: '6px 10px', borderRadius: '8px', fontSize: '12px',
                            background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                            border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer'
                          }}
                        >
                          <option value="free">Free</option>
                          <option value="starter">Starter</option>
                          <option value="pro">Pro</option>
                        </select>
                        {client.subscription_status === 'active' && (
                          <button
                            onClick={() => handleAction(client.id, 'cancel')}
                            disabled={actionLoading === client.id}
                            style={{
                              padding: '6px 10px', borderRadius: '8px', fontSize: '12px',
                              background: 'rgba(239,68,68,0.15)', color: '#ef4444',
                              border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer'
                            }}
                          >
                            Cancelar
                          </button>
                        )}
                        {client.subscription_status !== 'blocked' ? (
                          <button
                            onClick={() => { if (confirm(`Bloquear ${client.full_name || client.email}?`)) handleAction(client.id, 'block'); }}
                            disabled={actionLoading === client.id}
                            style={{
                              padding: '6px 10px', borderRadius: '8px', fontSize: '12px',
                              background: 'rgba(220,38,38,0.15)', color: '#dc2626',
                              border: '1px solid rgba(220,38,38,0.3)', cursor: 'pointer'
                            }}
                          >
                            🔒 Bloquear
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(client.id, 'unblock', client.plan_id)}
                            disabled={actionLoading === client.id}
                            style={{
                              padding: '6px 10px', borderRadius: '8px', fontSize: '12px',
                              background: 'rgba(34,197,94,0.15)', color: '#22c55e',
                              border: '1px solid rgba(34,197,94,0.3)', cursor: 'pointer'
                            }}
                          >
                            🔓 Desbloquear
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {clients.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                      Nenhum cliente encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
