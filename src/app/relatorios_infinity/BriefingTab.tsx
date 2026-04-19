'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { briefingCategories } from '@/config/briefingQuestions';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface BriefingSubmission {
  id: string;
  created_at: string;
  briefing_type: string;
  company_name: string;
  contact_name: string;
  contact_phone: string;
  answers: Record<string, any>;
  status: string;
}

export default function BriefingTab() {
  const [data, setData] = useState<BriefingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchBriefings();
  }, []);

  const fetchBriefings = async () => {
    try {
      const res = await fetch('/api/Briefing/list');
      if (res.ok) {
        const result = await res.json();
        setData(result.data || []);
      }
    } catch (e) {
      console.error('Failed to load briefings:', e);
    } finally {
      setLoading(false);
    }
  };

  // Charts data
  const chartByType = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(b => { counts[b.briefing_type] = (counts[b.briefing_type] || 0) + 1; });
    return Object.keys(briefingCategories).map(key => ({
      name: briefingCategories[key].title,
      value: counts[key] || 0,
    }));
  }, [data]);

  const chartByStatus = useMemo(() => {
    const pending = data.filter(b => b.status === 'pending').length;
    const done = data.filter(b => b.status !== 'pending').length;
    return [
      { name: 'Pendente', value: pending, color: '#F59E0B' },
      { name: 'Concluído', value: done, color: '#00DB79' },
    ];
  }, [data]);

  // Unique clients
  const clients = useMemo(() => {
    const map = new Map<string, { name: string; count: number; types: string[] }>();
    data.forEach(b => {
      const key = b.company_name;
      if (!map.has(key)) {
        map.set(key, { name: key, count: 0, types: [] });
      }
      const entry = map.get(key)!;
      entry.count++;
      if (!entry.types.includes(b.briefing_type)) entry.types.push(b.briefing_type);
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [data]);

  const filteredData = selectedClient
    ? data.filter(b => b.company_name === selectedClient)
    : data;

  const COLORS = ['#00DB79', '#00AAFF', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4'];

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>Carregando briefings...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <span style={{ fontSize: '28px' }}>📋</span>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>Briefings</h2>
      </div>
      <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', marginBottom: '32px', marginLeft: '40px' }}>
        Respostas dos formulários de briefing separadas por cliente
      </p>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Recebidos', value: data.length, icon: '📊', color: '#00DB79' },
          { label: 'Clientes Únicos', value: clients.length, icon: '👥', color: '#00AAFF' },
          { label: 'Pendentes', value: data.filter(b => b.status === 'pending').length, icon: '⏳', color: '#F59E0B' },
          { label: 'Concluídos', value: data.filter(b => b.status !== 'pending').length, icon: '✅', color: '#10B981' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: stat.color, opacity: 0.06, filter: 'blur(25px)' }} />
            <span style={{ fontSize: '24px' }}>{stat.icon}</span>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff', margin: '8px 0 4px' }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        {/* Bar Chart by Type */}
        <div style={{
          background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px', padding: '24px',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '20px' }}>📊 Volume por Categoria</h3>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartByType} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis stroke="#4B5563" tick={{ fill: '#9CA3AF' }} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#374151', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartByType.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart by Status */}
        <div style={{
          background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px', padding: '24px',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '20px' }}>📈 Status dos Briefings</h3>
          <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {data.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>Nenhum dado ainda</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartByStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {chartByStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#374151', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Client Filter */}
      <div style={{
        background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px', padding: '24px', marginBottom: '24px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>👥 Filtrar por Cliente</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedClient(null)}
            style={{
              padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '13px', fontWeight: 600,
              background: !selectedClient ? 'linear-gradient(135deg, #00DB79, #00AAFF)' : 'rgba(255,255,255,0.06)',
              color: !selectedClient ? '#fff' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.2s',
            }}
          >
            Todos ({data.length})
          </button>
          {clients.map(client => (
            <button
              key={client.name}
              onClick={() => setSelectedClient(client.name)}
              style={{
                padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: '13px', fontWeight: 600,
                background: selectedClient === client.name ? 'linear-gradient(135deg, #00DB79, #00AAFF)' : 'rgba(255,255,255,0.06)',
                color: selectedClient === client.name ? '#fff' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.2s',
              }}
            >
              {client.name} ({client.count})
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div style={{
        background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px', overflow: 'hidden',
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
            📄 Respostas {selectedClient && `— ${selectedClient}`}
          </h3>
        </div>

        {filteredData.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>Nenhum briefing encontrado</p>
          </div>
        ) : (
          <div>
            {filteredData.map((item, idx) => {
              const isExpanded = expandedId === item.id;
              const category = briefingCategories[item.briefing_type];

              return (
                <div key={item.id} style={{
                  borderBottom: idx < filteredData.length - 1 ? '1px solid rgba(255,255,255,0.04)' : undefined,
                }}>
                  {/* Row header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    style={{
                      padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      cursor: 'pointer', transition: 'background 0.2s',
                      background: isExpanded ? 'rgba(0,219,121,0.04)' : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: isExpanded ? 'linear-gradient(135deg, #00DB79, #00AAFF)' : 'rgba(255,255,255,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', flexShrink: 0,
                      }}>
                        {isExpanded ? '📂' : '📁'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
                          {item.company_name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                          {item.contact_name} • {item.contact_phone} • {new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                        background: 'rgba(0,170,255,0.1)', color: '#00AAFF',
                      }}>
                        {category?.title || item.briefing_type}
                      </span>
                      <span style={{
                        padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                        background: item.status === 'pending' ? 'rgba(245,158,11,0.1)' : 'rgba(0,219,121,0.1)',
                        color: item.status === 'pending' ? '#F59E0B' : '#00DB79',
                      }}>
                        {item.status === 'pending' ? '⏳ Pendente' : '✅ Concluído'}
                      </span>
                      <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.3)', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                    </div>
                  </div>

                  {/* Expanded answers */}
                  {isExpanded && (
                    <div style={{
                      padding: '0 24px 24px', background: 'rgba(0,0,0,0.2)',
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '16px' }}>
                        {Object.entries(item.answers).map(([key, value]) => {
                          const questionDef = category?.questions.find(q => q.id === key);
                          const label = questionDef?.label || key;
                          
                          // Check if value is an array of URLs (file uploads)
                          const isFileUpload = Array.isArray(value) && value.length > 0 && typeof value[0] === 'string' && (value[0].startsWith('http') || value[0].startsWith('blob:'));
                          const displayValue = Array.isArray(value) 
                            ? (isFileUpload ? null : value.join(', ')) 
                            : (typeof value === 'string' ? value : JSON.stringify(value));

                          return (
                            <div key={key} style={{
                              gridColumn: (questionDef?.type === 'textarea' || questionDef?.type === 'file') ? '1 / -1' : undefined,
                            }}>
                              <div style={{ fontSize: '12px', fontWeight: 600, color: '#00AAFF', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {label}
                              </div>
                              {isFileUpload ? (
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                  {(value as string[]).map((url, i) => (
                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{
                                      display: 'block', width: '100px', height: '100px', borderRadius: '10px',
                                      overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
                                    }}>
                                      <img src={url} alt={`Ref ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </a>
                                  ))}
                                </div>
                              ) : (
                                <div style={{
                                  padding: '12px 14px', borderRadius: '10px',
                                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                                  color: displayValue ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
                                  fontSize: '14px', lineHeight: 1.5, whiteSpace: 'pre-wrap',
                                  fontStyle: displayValue ? 'normal' : 'italic',
                                }}>
                                  {displayValue || 'Não respondido'}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
