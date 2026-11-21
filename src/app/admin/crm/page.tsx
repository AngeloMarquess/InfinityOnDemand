'use client';

import { useEffect, useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ClientTenant {
  id: string;
  email: string;
  full_name: string;
  company?: string;
  phone?: string;
  plan_id: string;
  plan_name: string;
  plan_price: number;
  subscription_status: string;
  subscription_expires_at: string | null;
  created_at: string;
  is_overdue?: boolean;
  days_overdue?: number;
  total_revenue?: number;
  usage: { leads: number; proposals: number; tasks: number };
}

interface Summary {
  total_clients: number;
  active_subscriptions: number;
  overdue_count: number;
  overdue_amount: number;
  blocked_count: number;
  mrr: number;
  mrr_formatted: string;
  arr: number;
  arr_formatted: string;
  average_ticket: number;
  average_ticket_formatted: string;
}

interface MonthlyHistory {
  month: string;
  revenue: number;
  active: number;
}

export default function AdminCRMPage() {
  const [clients, setClients] = useState<ClientTenant[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [monthlyHistory, setMonthlyHistory] = useState<MonthlyHistory[]>([]);
  const [adminKey, setAdminKey] = useState('infinity2026');
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'past_due' | 'blocked' | 'free'>('all');

  const fetchData = async (keyToUse = adminKey) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/crm/admin?key=${keyToUse}`);
      if (!res.ok) throw new Error('Unauthorized');
      const data = await res.json();
      setClients(data.clients || []);
      setSummary(data.summary || null);
      setMonthlyHistory(data.monthly_history || []);
      setIsAuthed(true);
    } catch {
      alert('Chave inválida ou erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Tenta autenticar automaticamente com a chave padrão infinity2026
    fetchData('infinity2026');
  }, []);

  const handleAction = async (payload: any, successMsg = 'Operação realizada com sucesso!') => {
    setActionLoading(payload.user_id || 'global');
    try {
      const res = await fetch(`/api/crm/admin?key=${adminKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert(successMsg);
        fetchData();
      } else {
        alert(data.error || 'Erro na operação');
      }
    } catch (err: any) {
      alert(err.message || 'Falha na comunicação');
    } finally {
      setActionLoading(null);
    }
  };

  // Cadastrar Novo Assinante
  const promptCreateClient = async () => {
    const full_name = prompt('Nome Completo do Cliente Assinante:');
    if (!full_name) return;
    const company = prompt('Nome da Empresa / Workspace:', full_name);
    const email = prompt('E-mail de Login do Cliente:');
    if (!email) return;
    const phone = prompt('WhatsApp / Telefone (com DDD):', '819');
    const password = prompt('Senha Inicial de Acesso:', 'Infinity@2026');
    if (!password) return;
    const plan_id = prompt('Plano (starter, intermediario, pro, free):', 'starter') || 'starter';

    await handleAction({
      action: 'create_client',
      full_name,
      company,
      email,
      phone,
      password,
      plan_id,
    }, `Assinante ${full_name} criado com sucesso!`);
  };

  // Resetar Senha
  const promptResetPassword = async (client: ClientTenant) => {
    const new_password = prompt(`Digite a NOVA SENHA para ${client.full_name} (${client.email}):`, 'NovaSenha@2026');
    if (!new_password) return;

    await handleAction({
      action: 'update_password',
      user_id: client.id,
      new_password,
    }, `Senha de ${client.full_name} atualizada!`);
  };

  // Registrar Pagamento
  const promptRecordPayment = async (client: ClientTenant) => {
    const amount = prompt(`Confirmar valor recebido de ${client.full_name}:`, `${client.plan_price || 59.90}`);
    if (!amount) return;

    await handleAction({
      action: 'record_payment',
      user_id: client.id,
      plan_id: client.plan_id,
      amount,
    }, `Pagamento registrado! Acesso de ${client.full_name} renovado por +30 dias.`);
  };

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchSearch =
        c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm);

      const matchStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'past_due'
          ? c.is_overdue || c.subscription_status === 'past_due'
          : c.subscription_status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [clients, searchTerm, statusFilter]);

  const statusColor = (status: string, isOverdue?: boolean) => {
    if (status === 'blocked') return '#ef4444';
    if (isOverdue || status === 'past_due') return '#f59e0b';
    if (status === 'active') return '#22c55e';
    return 'var(--text-tertiary)';
  };

  const planColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'linear-gradient(135deg, #7C3AED, #EC4899)';
      case 'intermediario': return 'linear-gradient(135deg, #00b0ff, #7c3aed)';
      case 'starter': return 'linear-gradient(135deg, #00AAFF, #00DF81)';
      default: return 'var(--bg-tertiary)';
    }
  };

  if (!isAuthed) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
          <div style={{ maxWidth: 420, width: '100%', textAlign: 'center', background: 'var(--bg-secondary)', padding: '36px', borderRadius: '24px', border: '1px solid var(--bg-tertiary)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>👑</div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Admin CRM SaaS</h1>
            <p className="text-secondary" style={{ marginBottom: '28px', fontSize: '14px' }}>
              Gestão Central de Assinantes Infinity OnDemand
            </p>
            <input
              type="password"
              placeholder="Chave Master (ex: infinity2026)"
              value={adminKey}
              onChange={e => setAdminKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchData()}
              style={{
                width: '100%', padding: '14px 20px', borderRadius: '12px',
                border: '1px solid var(--bg-tertiary)', background: 'var(--bg-primary)',
                color: 'var(--text-primary)', outline: 'none', fontSize: '15px', marginBottom: '16px'
              }}
            />
            <button onClick={() => fetchData()} disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', fontWeight: 700 }}>
              {loading ? 'Autenticando...' : 'Acessar Central Master'}
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Header />
      <div style={{ flex: 1, padding: '100px 24px 60px', maxWidth: 1300, margin: '0 auto', width: '100%' }}>

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', background: 'rgba(124,58,237,0.15)', color: '#a855f7', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(124,58,237,0.3)' }}>
                👑 SaaS Master Control
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                Multi-tenant Ativo
              </span>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1px' }}>
              Administração CRM <span className="text-gradient">Infinity OnDemand</span>
            </h1>
            <p className="text-secondary" style={{ fontSize: '14px' }}>
              Gestão central de assinantes SaaS, planos, faturamento recorrente e bloqueio por inadimplência
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => fetchData()}
              disabled={loading}
              style={{
                padding: '10px 18px', borderRadius: '12px', background: 'var(--bg-secondary)',
                border: '1px solid var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '13px',
                fontWeight: 600, cursor: 'pointer'
              }}
            >
              🔄 Sincronizar
            </button>
            <button
              onClick={promptCreateClient}
              className="btn-primary"
              style={{
                padding: '10px 20px', fontSize: '13px', fontWeight: 800,
                background: 'linear-gradient(135deg, #00df81, #00b0ff)', border: 'none', color: '#fff', borderRadius: '12px'
              }}
            >
              + Cadastrar Novo Assinante
            </button>
          </div>
        </div>

        {/* KPI Bento Grid */}
        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {/* MRR */}
            <div style={{ padding: '24px', borderRadius: '18px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)' }}>
              <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                MRR (Mensal)
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#00df81' }}>{summary.mrr_formatted}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                ARR Projeção: <strong>{summary.arr_formatted}</strong>
              </div>
            </div>

            {/* Assinantes Ativos */}
            <div style={{ padding: '24px', borderRadius: '18px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)' }}>
              <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                Assinantes Ativos
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#00b0ff' }}>
                {summary.active_subscriptions} <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>de {summary.total_clients}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#00b0ff', marginTop: '6px' }}>
                100% Workspaces Isolados
              </div>
            </div>

            {/* Inadimplência */}
            <div style={{
              padding: '24px', borderRadius: '18px',
              background: summary.overdue_count > 0 ? 'rgba(239,68,68,0.08)' : 'var(--bg-secondary)',
              border: summary.overdue_count > 0 ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--bg-tertiary)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: summary.overdue_count > 0 ? '#ef4444' : 'var(--text-secondary)', marginBottom: '8px' }}>
                Inadimplência
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: summary.overdue_count > 0 ? '#ef4444' : '#22c55e' }}>
                {summary.overdue_count} clientes
              </div>
              <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px', fontWeight: 600 }}>
                R$ {summary.overdue_amount.toFixed(2)} pendentes
              </div>
            </div>

            {/* Ticket Médio */}
            <div style={{ padding: '24px', borderRadius: '18px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)' }}>
              <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                Ticket Médio (ARPU)
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#a855f7' }}>
                {summary.average_ticket_formatted}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Renda Média por Assinante
              </div>
            </div>
          </div>
        )}

        {/* Barra de Filtros e Busca */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar por nome, e-mail, empresa ou telefone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--bg-tertiary)',
              background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none',
              fontSize: '14px', minWidth: '320px', flex: 1, maxWidth: '450px'
            }}
          />

          <div style={{ display: 'flex', gap: '8px' }}>
            {(['all', 'active', 'past_due', 'blocked'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700,
                  cursor: 'pointer', border: '1px solid var(--bg-tertiary)',
                  background: statusFilter === st ? 'var(--accent-primary, #00b0ff)' : 'var(--bg-secondary)',
                  color: statusFilter === st ? '#fff' : 'var(--text-secondary)'
                }}
              >
                {st === 'all' ? `Todos (${clients.length})` : st === 'active' ? 'Ativos' : st === 'past_due' ? 'Inadimplentes' : 'Bloqueados'}
              </button>
            ))}
          </div>
        </div>

        {/* Clients Table */}
        <div style={{ borderRadius: '18px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bg-tertiary)', background: 'rgba(255,255,255,0.02)' }}>
                  {['Assinante / Empresa', 'Plano', 'Status & Vencimento', 'Consumo CRM', 'Renda (LTV)', 'Ações'].map(h => (
                    <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredClients.map(client => {
                  const isBlocked = client.subscription_status === 'blocked';
                  const isOverdue = client.is_overdue || client.subscription_status === 'past_due';

                  return (
                    <tr key={client.id} style={{ borderBottom: '1px solid var(--bg-tertiary)', background: isBlocked ? 'rgba(220,38,38,0.06)' : isOverdue ? 'rgba(245,158,11,0.06)' : undefined }}>
                      {/* Nome e Empresa */}
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)' }}>
                          {client.full_name || 'Assinante Sem Nome'}
                        </div>
                        <div style={{ marginTop: '4px' }}>
                          <span style={{
                            display: 'inline-block', padding: '2px 8px', borderRadius: '6px',
                            background: '#e0e7ff', border: '1px solid #c7d2fe', color: '#1e1b4b',
                            fontWeight: 800, fontSize: '11px'
                          }}>
                            🏢 {client.company || 'Workspace do Cliente'}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {client.email} {client.phone ? `• ${client.phone}` : ''}
                        </div>
                      </td>

                      {/* Plano */}
                      <td style={{ padding: '16px 18px' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800,
                          background: planColor(client.plan_id), color: client.plan_id === 'free' ? 'var(--text-secondary)' : '#fff',
                          textTransform: 'uppercase'
                        }}>
                          {client.plan_name}
                        </span>
                        <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '4px' }}>
                          {client.plan_price > 0 ? `R$ ${client.plan_price.toFixed(2)}/mês` : 'Gratuito'}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 18px' }}>
                        <span style={{
                          color: statusColor(client.subscription_status, isOverdue),
                          fontWeight: 800, fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}>
                          {isBlocked ? '🚫 Bloqueado' : isOverdue ? `⚠️ Inadimplente (${client.days_overdue || 1}d)` : '● Ativo'}
                        </span>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {client.subscription_expires_at ? `Vence: ${new Date(client.subscription_expires_at).toLocaleDateString('pt-BR')}` : 'Sem vencimento'}
                        </div>
                      </td>

                      {/* Consumo */}
                      <td style={{ padding: '16px 18px', fontSize: '12px' }}>
                        <div style={{ fontWeight: 600 }}>{client.usage.leads} leads</div>
                        <div style={{ color: 'var(--text-secondary)' }}>{client.usage.proposals} propostas • {client.usage.tasks} tarefas</div>
                      </td>

                      {/* Renda LTV */}
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '14px' }}>
                          R$ {(client.total_revenue || client.plan_price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </td>

                      {/* Ações */}
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                          {/* Mudar Plano */}
                          <select
                            disabled={actionLoading === client.id || isBlocked}
                            defaultValue={client.plan_id}
                            onChange={e => handleAction({ action: 'change_plan', user_id: client.id, plan_id: e.target.value }, `Plano alterado para ${e.target.value}`)}
                            style={{
                              padding: '6px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                              background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                              border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer'
                            }}
                          >
                            <option value="starter">Starter</option>
                            <option value="intermediario">Intermediário</option>
                            <option value="pro">Pro</option>
                            <option value="free">Free</option>
                          </select>

                          {/* Resetar Senha */}
                          <button
                            onClick={() => promptResetPassword(client)}
                            disabled={actionLoading === client.id}
                            style={{
                              padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                              background: 'rgba(0,176,255,0.15)', color: '#00b0ff',
                              border: '1px solid rgba(0,176,255,0.3)', cursor: 'pointer'
                            }}
                          >
                            🔑 Senha
                          </button>

                          {/* Registrar Pagamento */}
                          <button
                            onClick={() => promptRecordPayment(client)}
                            disabled={actionLoading === client.id}
                            style={{
                              padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                              background: 'rgba(34,197,94,0.15)', color: '#22c55e',
                              border: '1px solid rgba(34,197,94,0.3)', cursor: 'pointer'
                            }}
                          >
                            💰 Pagar
                          </button>

                          {/* Bloquear / Desbloquear */}
                          {!isBlocked ? (
                            <button
                              onClick={() => {
                                if (confirm(`BLOQUEAR ACESSO de ${client.full_name} por inadimplência?`)) {
                                  handleAction({ action: 'block', user_id: client.id }, `Acesso de ${client.full_name} bloqueado.`);
                                }
                              }}
                              disabled={actionLoading === client.id}
                              style={{
                                padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                                background: 'rgba(239,68,68,0.15)', color: '#ef4444',
                                border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer'
                              }}
                            >
                              🔒 Bloquear
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction({ action: 'unblock', user_id: client.id, plan_id: client.plan_id }, `Acesso de ${client.full_name} desbloqueado!`)}
                              disabled={actionLoading === client.id}
                              style={{
                                padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                                background: 'rgba(34,197,94,0.15)', color: '#22c55e',
                                border: '1px solid rgba(34,197,94,0.3)', cursor: 'pointer'
                              }}
                            >
                              🔓 Desbloquear
                            </button>
                          )}

                          {/* Excluir */}
                          <button
                            onClick={() => {
                              if (confirm(`⚠️ EXCLUIR PERMANENTEMENTE ${client.full_name}?\nIsso apaga conta e banco de dados do tenant.`)) {
                                handleAction({ action: 'delete_user', user_id: client.id }, `Assinante excluído.`);
                              }
                            }}
                            disabled={actionLoading === client.id}
                            style={{
                              padding: '6px 8px', borderRadius: '8px', fontSize: '11px',
                              background: 'rgba(127,29,29,0.2)', color: '#f87171',
                              border: '1px solid rgba(248,113,113,0.3)', cursor: 'pointer'
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                      Nenhum assinante encontrado com os filtros selecionados.
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
