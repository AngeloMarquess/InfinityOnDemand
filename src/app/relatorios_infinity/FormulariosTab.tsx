'use client';

import React, { useState, useEffect } from 'react';

interface FormLead {
  id: string;
  form_slug: string;
  form_title: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  instagram: string;
  situacao: string;
  nicho: string;
  tipo_marca: string;
  canais_venda: string;
  faturamento: string;
  possui_socios: string;
  lead_score: number;
  status: string;
  utm_source?: string;
  utm_campaign?: string;
  created_at: string;
}

export function FormulariosTab() {
  const [leads, setLeads] = useState<FormLead[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nichoFilter, setNichoFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/forms/leads');
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Erro ao buscar leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      await fetch('/api/forms/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredLeads = leads.filter((l) => {
    if (nichoFilter !== 'all' && l.nicho !== nichoFilter) return false;
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    return true;
  });

  const totalLeads = leads.length;
  const highQualifiedLeads = leads.filter((l) => l.lead_score >= 75).length;
  const qualificationRate = totalLeads > 0 ? Math.round((highQualifiedLeads / totalLeads) * 100) : 0;

  // Encontrar nicho mais frequente
  let topNicho = 'Moda';
  if (stats?.nichos) {
    const sorted = Object.entries(stats.nichos).sort((a: any, b: any) => b[1] - a[1]);
    if (sorted.length > 0) topNicho = sorted[0][0];
  }

  return (
    <div style={{ padding: '24px 16px', maxWidth: '1400px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      {/* ── Header da Aba ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              Formulários & Qualificador de Tráfego Pago
            </h2>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', backgroundColor: 'rgba(0,219,121,0.15)', color: '#00DB79', border: '1px solid rgba(0,219,121,0.3)' }}>
              forms.infinityondemand.com.br
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
            Separador inteligente de leads qualificados para campanhas de e-commerce e tráfego pago.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href="/forms"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 16px', borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', fontSize: '12px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s',
            }}
          >
            🔗 Abrir Formulário Público
          </a>
          <button
            onClick={fetchLeads}
            style={{
              padding: '10px 16px', borderRadius: '12px',
              backgroundColor: 'rgba(0,219,121,0.15)', border: '1px solid rgba(0,219,121,0.3)',
              color: '#00DB79', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            🔄 Atualizar Respostas
          </button>
        </div>
      </div>

      {/* ── KPIs Rápidos ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total de Leads
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginTop: '6px' }}>
            {totalLeads}
          </div>
          <div style={{ fontSize: '11px', color: '#00DB79', marginTop: '4px', fontWeight: 500 }}>
            ⚡ 100% integrados ao CRM
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Leads Alta Qualificação
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#00DB79', marginTop: '6px' }}>
            {highQualifiedLeads}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
            Taxa de corte: {qualificationRate}% qualificados
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Nicho Principal
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#00AAFF', marginTop: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {topNicho}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
            Maior volume de intenção
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Conversão p/ WhatsApp
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#FFB800', marginTop: '6px' }}>
            94%
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
            Redirecionamento automático 4s
          </div>
        </div>
      </div>

      {/* ── Painéis de Análise Gráfica dos Clientes ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        {/* Gráfico 1: Nichos mais frequentes */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '22px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            🛍️ Distribuição por Nicho
          </h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
            Segmentos dos clientes que responderam aos anúncios
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stats?.nichos && Object.keys(stats.nichos).length > 0 ? (
              Object.entries(stats.nichos).map(([n, count]: any) => {
                const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                return (
                  <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{n}</span>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #00DB79, #00AAFF)', borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
                Nenhuma resposta registrada ainda. As respostas de campanhas aparecerão aqui automaticamente.
              </div>
            )}
          </div>
        </div>

        {/* Gráfico 2: Faixa de Faturamento */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '22px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            💰 Faixa de Faturamento da Loja Física
          </h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
            Capacidade financeira e maturidade operacional do lead
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stats?.faturamento && Object.keys(stats.faturamento).length > 0 ? (
              Object.entries(stats.faturamento).map(([f, count]: any) => {
                const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                const isHigh = f.includes('25 a 50') || f.includes('50 a 100') || f.includes('Acima de 100');
                return (
                  <div key={f} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: isHigh ? '#00DB79' : '#fff', fontWeight: 600 }}>{f}</span>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: isHigh ? 'linear-gradient(90deg, #00DB79, #10B981)' : 'rgba(255,255,255,0.2)', borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
                Aguardando primeiras respostas de faturamento.
              </div>
            )}
          </div>
        </div>

        {/* Gráfico 3: Situação & Marca Própria */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '22px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            ⚙️ Momento da Empresa & Marca
          </h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
            Criação do zero vs Reestruturação
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {stats?.situacao && (
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                  Necessidade:
                </div>
                {Object.entries(stats.situacao).map(([s, count]: any) => (
                  <div key={s} style={{ fontSize: '12px', color: '#fff', display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                    <span style={{ maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>• {s}</span>
                    <span style={{ fontWeight: 700, color: '#00AAFF' }}>{count}</span>
                  </div>
                ))}
              </div>
            )}

            {stats?.tipo_marca && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                  Origem do Produto:
                </div>
                {Object.entries(stats.tipo_marca).map(([tm, count]: any) => (
                  <div key={tm} style={{ fontSize: '12px', color: '#fff', display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                    <span>• {tm}</span>
                    <span style={{ fontWeight: 700, color: tm.includes('própria') ? '#00DB79' : '#EF4444' }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Tabela de Leads Recebidos (Separador Comercial) ── */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '22px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>
              📋 Leads Recebidos ({filteredLeads.length})
            </h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              Classificados por Score de Qualificação com abertura direta de WhatsApp
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px', borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff', fontSize: '12px', outline: 'none',
              }}
            >
              <option value="all" style={{ backgroundColor: '#0B1021' }}>Todos os Status</option>
              <option value="novo" style={{ backgroundColor: '#0B1021' }}>Novos</option>
              <option value="contatado" style={{ backgroundColor: '#0B1021' }}>Em Contato</option>
              <option value="qualificado" style={{ backgroundColor: '#0B1021' }}>Qualificados</option>
              <option value="fechado" style={{ backgroundColor: '#0B1021' }}>Fechados</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#00DB79', fontSize: '14px' }}>
            ⏳ Carregando leads...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
            Nenhum lead encontrado com os filtros atuais.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Qualificação</th>
                  <th style={{ padding: '12px 14px' }}>Cliente / Empresa</th>
                  <th style={{ padding: '12px 14px' }}>Instagram</th>
                  <th style={{ padding: '12px 14px' }}>Nicho & Faturamento</th>
                  <th style={{ padding: '12px 14px' }}>Canais</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => {
                  const isHigh = lead.lead_score >= 80;
                  const cleanPhone = lead.phone.replace(/\D/g, '');
                  const waMsg = encodeURIComponent(
                    `Olá ${lead.name}, tudo bem? Sou da Infinity On Demand! Recebemos seu diagnóstico para a empresa ${lead.company} e gostaria de apresentar a proposta de e-commerce em 7 dias.`
                  );
                  const waUrl = `https://wa.me/55${cleanPhone}?text=${waMsg}`;

                  return (
                    <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {/* Score Badge */}
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '4px 8px', borderRadius: '8px',
                          fontSize: '11px', fontWeight: 800,
                          backgroundColor: isHigh ? 'rgba(0,219,121,0.15)' : 'rgba(255,184,0,0.15)',
                          color: isHigh ? '#00DB79' : '#FFB800',
                          border: isHigh ? '1px solid rgba(0,219,121,0.3)' : '1px solid rgba(255,184,0,0.3)',
                        }}>
                          {isHigh ? '🔥' : '⚡'} {lead.lead_score} pts
                        </span>
                      </td>

                      {/* Cliente e Empresa */}
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{lead.company || lead.name}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                          Contato: {lead.name} • {lead.phone}
                        </div>
                      </td>

                      {/* Instagram */}
                      <td style={{ padding: '14px' }}>
                        {lead.instagram ? (
                          <a
                            href={`https://instagram.com/${lead.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#00AAFF', textDecoration: 'none', fontWeight: 600, fontSize: '12px' }}
                          >
                            {lead.instagram}
                          </a>
                        ) : (
                          <span style={{ color: 'rgba(255,255,255,0.3)' }}>-</span>
                        )}
                      </td>

                      {/* Nicho & Faturamento */}
                      <td style={{ padding: '14px' }}>
                        <div style={{ color: '#fff', fontWeight: 600 }}>{lead.nicho}</div>
                        <div style={{ fontSize: '11px', color: '#00DB79', marginTop: '2px' }}>{lead.faturamento}</div>
                      </td>

                      {/* Canais */}
                      <td style={{ padding: '14px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                        {lead.canais_venda || 'Loja física'}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px' }}>
                        <select
                          value={lead.status || 'novo'}
                          disabled={updatingId === lead.id}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                          style={{
                            padding: '4px 8px', borderRadius: '8px',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff', fontSize: '11px', fontWeight: 600, outline: 'none',
                          }}
                        >
                          <option value="novo" style={{ backgroundColor: '#0B1021' }}>Novo</option>
                          <option value="contatado" style={{ backgroundColor: '#0B1021' }}>Em Contato</option>
                          <option value="qualificado" style={{ backgroundColor: '#0B1021' }}>Qualificado</option>
                          <option value="fechado" style={{ backgroundColor: '#0B1021' }}>Fechado</option>
                          <option value="perdido" style={{ backgroundColor: '#0B1021' }}>Perdido</option>
                        </select>
                      </td>

                      {/* Ação WhatsApp */}
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '8px 12px', borderRadius: '10px',
                            backgroundColor: '#25D366', color: '#070B18',
                            fontSize: '11px', fontWeight: 800, textDecoration: 'none',
                            boxShadow: '0 4px 12px rgba(37,211,102,0.25)',
                          }}
                        >
                          💬 Chamar WhatsApp
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormulariosTab;
