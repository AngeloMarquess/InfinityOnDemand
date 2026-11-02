'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface FormQuestion {
  id: string;
  title: string;
  helper?: string;
  type:
    | 'select'
    | 'checkbox'
    | 'text'
    | 'textarea'
    | 'number'
    | 'currency'
    | 'phone'
    | 'email'
    | 'date'
    | 'rating';
  options?: string[];
  required: boolean;
}

interface ClientTenant {
  id: string;
  name: string;
  company: string;
  phone: string;
  email?: string;
  niche: string;
  logoUrl?: string;
  primaryColor?: string;
  created_at: string;
}

interface FormItem {
  id: string;
  title: string;
  slug: string;
  tenantType: 'infinity' | 'client';
  clientId?: string;
  clientName?: string;
  niche: string;
  whatsappDestination: string;
  sendToWhatsapp: boolean;
  thankYouTitle: string;
  thankYouMessage: string;
  autoRedirectSeconds: number;
  status: 'Ativo' | 'Pausado';
  questions: FormQuestion[];
  brandName?: string;
  brandLogoUrl?: string;
  primaryColor?: string;
  backgroundImageUrl?: string;
  created_at?: string;
}

interface FormLead {
  id: string;
  form_slug: string;
  form_title: string;
  client_id?: string;
  client_name?: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  nicho: string;
  faturamento: string;
  lead_score: number;
  status: string;
  answers: Record<string, any>;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at: string;
}

export default function FormulariosTab() {
  const [forms, setForms] = useState<FormItem[]>([]);
  const [clients, setClients] = useState<ClientTenant[]>([]);
  const [leads, setLeads] = useState<FormLead[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros de visualização
  const [activeArea, setActiveArea] = useState<'all' | 'infinity' | 'client'>('all');
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [selectedFormSlug, setSelectedFormSlug] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formSearchQuery, setFormSearchQuery] = useState('');

  // Modais
  const [showCreateFormModal, setShowCreateFormModal] = useState(false);
  const [isEditingForm, setIsEditingForm] = useState(false);
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [selectedLeadModal, setSelectedLeadModal] = useState<FormLead | null>(null);
  const [modalTab, setModalTab] = useState<'geral' | 'perguntas' | 'obrigado' | 'visual'>('geral');
  const [createSuccess, setCreateSuccess] = useState('');
  const [isCustomNiche, setIsCustomNiche] = useState(false);
  const [customNicheInput, setCustomNicheInput] = useState('');

  // Formulário em rascunho (criação ou edição)
  const defaultDraft: FormItem = {
    id: '',
    title: '',
    slug: '',
    tenantType: 'infinity',
    clientId: '',
    clientName: '',
    niche: 'Moda & Vestuário',
    whatsappDestination: '5581981280719',
    sendToWhatsapp: true,
    thankYouTitle: 'Diagnóstico Registrado com Sucesso!',
    thankYouMessage: 'Nossa equipe de especialistas foi notificada e vai continuar com você no WhatsApp.',
    autoRedirectSeconds: 4,
    status: 'Ativo',
    primaryColor: '#00DF81',
    brandName: '',
    brandLogoUrl: '',
    backgroundImageUrl: '',
    questions: [
      { id: 'q_1', title: 'Qual é o seu nome completo?', helper: 'Usado para personalizar a proposta', type: 'text', required: true },
      { id: 'q_2', title: 'Qual seu WhatsApp comercial com DDD?', helper: 'Enviaremos o diagnóstico detalhado por mensagem', type: 'phone', required: true },
      { id: 'q_3', title: 'Qual o nome da sua marca ou empresa?', helper: 'Operação que você lidera', type: 'text', required: true },
      { id: 'q_4', title: 'Qual é o seu melhor e-mail corporativo ou pessoal?', helper: 'Enviaremos o resumo formal e diagnóstico', type: 'email', required: true },
      { id: 'q_5', title: 'Quais áreas do seu negócio você quer acelerar? (Marque todas)', type: 'checkbox', options: ['Vendas no WhatsApp', 'Loja Virtual / E-commerce', 'Tráfego Pago (Meta/Google Ads)', 'Automação de Atendimento & CRM', 'Sistema Web / App sob Demanda'], required: true },
      { id: 'q_6', title: 'Qual a faixa de faturamento mensal atual?', type: 'currency', options: ['Até R$ 5.000', 'R$ 5.000 a R$ 15.000', 'R$ 15.000 a R$ 50.000', 'R$ 50.000 a R$ 100.000', 'Acima de R$ 100.000'], required: true },
    ],
  };

  const [formDraft, setFormDraft] = useState<FormItem>(defaultDraft);

  // Novo cliente em criação
  const [newClientDraft, setNewClientDraft] = useState({
    company: '',
    name: '',
    phone: '',
    email: '',
    niche: 'Moda & Vestuário',
  });

  // Carregar dados da API
  const loadData = async () => {
    try {
      setLoading(true);

      const resForms = await fetch('/api/forms');
      const dataForms = await resForms.json();
      if (dataForms.forms) setForms(dataForms.forms);

      const resClients = await fetch('/api/forms/clients');
      const dataClients = await resClients.json();
      if (dataClients.clients) setClients(dataClients.clients);

      const resLeads = await fetch('/api/forms/leads');
      const dataLeads = await resLeads.json();
      if (dataLeads.leads) setLeads(dataLeads.leads);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtragem dos formulários por Tenant e por Busca
  const filteredForms = useMemo(() => {
    return forms.filter((f) => {
      if (activeArea === 'infinity' && f.tenantType !== 'infinity') return false;
      if (activeArea === 'client') {
        if (f.tenantType !== 'client') return false;
        if (selectedClientId !== 'all' && f.clientId !== selectedClientId) return false;
      }
      if (formSearchQuery.trim()) {
        const q = formSearchQuery.toLowerCase();
        const matchTitle = f.title.toLowerCase().includes(q);
        const matchSlug = f.slug.toLowerCase().includes(q);
        const matchClient = (f.clientName || '').toLowerCase().includes(q);
        const matchNiche = f.niche.toLowerCase().includes(q);
        if (!matchTitle && !matchSlug && !matchClient && !matchNiche) return false;
      }
      return true;
    });
  }, [forms, activeArea, selectedClientId, formSearchQuery]);

  // Formulário selecionado atualmente
  const activeSelectedForm = useMemo(() => {
    if (selectedFormSlug === 'all') return null;
    return forms.find((f) => f.slug === selectedFormSlug) || null;
  }, [forms, selectedFormSlug]);

  // Filtragem dos leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (activeArea === 'infinity') {
        const matchForm = forms.find((f) => f.slug === l.form_slug);
        if (matchForm && matchForm.tenantType !== 'infinity') return false;
      }
      if (activeArea === 'client') {
        if (selectedClientId !== 'all' && l.client_id !== selectedClientId) return false;
      }
      if (selectedFormSlug !== 'all' && l.form_slug !== selectedFormSlug) return false;
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      return true;
    });
  }, [leads, forms, activeArea, selectedClientId, selectedFormSlug, statusFilter]);

  const totalLeads = filteredLeads.length;
  const highQualifiedLeads = filteredLeads.filter((l) => l.lead_score >= 75).length;
  const qualificationRate = totalLeads > 0 ? Math.round((highQualifiedLeads / totalLeads) * 100) : 0;

  // ── CÁLCULO DINÂMICO DE DISTRIBUIÇÃO DE RESPOSTAS PARA O GRÁFICO ──
  // Agrupa as respostas das perguntas com opções (Faturamento, Nichos, Sim/Não, Canais, etc.)
  const questionDistributionCharts = useMemo(() => {
    const targetQuestions = activeSelectedForm
      ? activeSelectedForm.questions.filter((q) => q.options && q.options.length > 0)
      : [
          {
            id: 'fat_global',
            title: 'Faixa de Faturamento Declarada (Comparação Global de Leads)',
            options: ['Até R$ 5.000', 'R$ 5.000 a R$ 15.000', 'R$ 15.000 a R$ 50.000', 'R$ 50.000 a R$ 100.000', 'Acima de R$ 100.000'],
          },
        ];

    return targetQuestions.map((q) => {
      const counts: Record<string, number> = {};
      (q.options || []).forEach((opt) => {
        counts[opt] = 0;
      });

      let totalAnswers = 0;

      filteredLeads.forEach((lead) => {
        if (!lead.answers) return;
        // Busca resposta pelo id da pergunta ou pelo título
        let userAns = lead.answers[q.id] || lead.answers[q.title];

        // Se for faturamento e não encontrou na pergunta, tenta no campo explícito do lead
        if (!userAns && q.title.toLowerCase().includes('fatur')) {
          userAns = lead.faturamento;
        }

        if (userAns !== undefined && userAns !== null) {
          totalAnswers++;
          if (Array.isArray(userAns)) {
            userAns.forEach((item) => {
              counts[item] = (counts[item] || 0) + 1;
            });
          } else {
            const strVal = String(userAns).trim();
            // Verifica se casa com alguma opção
            const matchedKey = Object.keys(counts).find(
              (opt) => opt.toLowerCase() === strVal.toLowerCase() || strVal.toLowerCase().includes(opt.toLowerCase())
            );
            if (matchedKey) {
              counts[matchedKey]++;
            } else {
              counts[strVal] = (counts[strVal] || 0) + 1;
            }
          }
        }
      });

      return {
        questionId: q.id,
        title: q.title,
        totalAnswers,
        counts,
      };
    });
  }, [activeSelectedForm, filteredLeads]);

  // Abertura do modal para novo formulário
  const openNewFormModal = () => {
    setIsEditingForm(false);
    setCreateSuccess('');
    setModalTab('geral');
    setFormDraft({
      ...defaultDraft,
      tenantType: activeArea === 'client' ? 'client' : 'infinity',
      clientId: selectedClientId !== 'all' ? selectedClientId : (clients[0]?.id || ''),
    });
    setShowCreateFormModal(true);
  };

  // Abertura do modal para editar formulário existente
  const openEditFormModal = (f: FormItem) => {
    setIsEditingForm(true);
    setCreateSuccess('');
    setModalTab('geral');
    setFormDraft({
      ...defaultDraft,
      ...f,
      primaryColor: f.primaryColor || '#00DF81',
      brandName: f.brandName || '',
      brandLogoUrl: f.brandLogoUrl || '',
      backgroundImageUrl: f.backgroundImageUrl || '',
    });
    setShowCreateFormModal(true);
  };

  // Salvar formulário (POST /api/forms)
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalNiche = isCustomNiche ? customNicheInput : formDraft.niche;
      const finalSlug = formDraft.slug.toLowerCase().replace(/[^a-z0-9-]/g, '') || `form-${Date.now()}`;

      let clientName = '';
      if (formDraft.tenantType === 'client' && formDraft.clientId) {
        const found = clients.find((c) => c.id === formDraft.clientId);
        clientName = found?.company || found?.name || 'Cliente';
      }

      const payload: FormItem = {
        ...formDraft,
        id: formDraft.id || `form-${Date.now()}`,
        slug: finalSlug,
        niche: finalNiche,
        clientName: clientName || formDraft.clientName,
        status: formDraft.status || 'Ativo',
        primaryColor: formDraft.primaryColor || '#00DF81',
      };

      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.form) {
        setForms((prev) => [data.form, ...prev.filter((f) => f.id !== data.form.id && f.slug !== data.form.slug)]);
        setCreateSuccess(`Formulário "${payload.title}" gravado com sucesso!`);
        setSelectedFormSlug(payload.slug);
      }
    } catch (err) {
      console.error('Erro ao salvar formulário:', err);
    }
  };

  // Excluir formulário (DELETE /api/forms)
  const handleDeleteForm = async (id: string, title: string) => {
    if (!confirm(`Deseja realmente remover o formulário "${title}"?`)) return;
    try {
      const res = await fetch(`/api/forms?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setForms((prev) => prev.filter((f) => f.id !== id && f.slug !== id));
        if (selectedFormSlug === id) setSelectedFormSlug('all');
      }
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  };

  // Salvar novo cliente
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/forms/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClientDraft),
      });
      const data = await res.json();
      if (data.client) {
        setClients((prev) => [data.client, ...prev]);
        setSelectedClientId(data.client.id);
        setActiveArea('client');
        setShowCreateClientModal(false);
        setNewClientDraft({ company: '', name: '', phone: '', email: '', niche: 'Moda & Vestuário' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Atualizar status do lead
  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      await fetch('/api/forms/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
      if (selectedLeadModal && selectedLeadModal.id === leadId) {
        setSelectedLeadModal((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  // Gerenciamento de perguntas no construtor
  const addQuestion = () => {
    const newQ: FormQuestion = {
      id: `q_${Date.now()}`,
      title: 'Nova Pergunta',
      type: 'select',
      options: ['Opção 1', 'Opção 2'],
      required: true,
    };
    setFormDraft((prev) => ({ ...prev, questions: [...prev.questions, newQ] }));
  };

  const removeQuestion = (qId: string) => {
    setFormDraft((prev) => ({ ...prev, questions: prev.questions.filter((q) => q.id !== qId) }));
  };

  const updateQuestion = (qId: string, updates: Partial<FormQuestion>) => {
    setFormDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === qId ? { ...q, ...updates } : q)),
    }));
  };

  const addOptionToQuestion = (qId: string) => {
    setFormDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === qId) {
          const opts = q.options || [];
          return { ...q, options: [...opts, `Opção ${opts.length + 1}`] };
        }
        return q;
      }),
    }));
  };

  const updateOptionText = (qId: string, optIndex: number, text: string) => {
    setFormDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === qId && q.options) {
          const newOpts = [...q.options];
          newOpts[optIndex] = text;
          return { ...q, options: newOpts };
        }
        return q;
      }),
    }));
  };

  const removeOptionFromQuestion = (qId: string, optIndex: number) => {
    setFormDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === qId && q.options) {
          return { ...q, options: q.options.filter((_, idx) => idx !== optIndex) };
        }
        return q;
      }),
    }));
  };

  const currentClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div style={{ padding: '24px 0', color: '#fff', maxWidth: '1440px', margin: '0 auto' }}>

      {/* ── HEADER PRINCIPAL DO HUB ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
              Formulários & Qualificador de Tráfego Pago
            </h2>
            <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', backgroundColor: 'rgba(0, 223, 129, 0.15)', color: '#00DF81', fontWeight: 800, border: '1px solid rgba(0, 223, 129, 0.3)' }}>
              forms.infinityondemand.com.br
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
            Hub central multi-tenant: gerencie formulários interativos estilo Typeform com personalização white-label para a Infinity e seus clientes.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowCreateClientModal(true)}
            style={{
              padding: '10px 16px', borderRadius: '12px',
              backgroundColor: 'rgba(0,170,255,0.15)', border: '1px solid rgba(0,170,255,0.35)',
              color: '#00AAFF', fontSize: '12px', fontWeight: 800, cursor: 'pointer',
            }}
          >
            👥 + Novo Cliente
          </button>

          <button
            onClick={openNewFormModal}
            style={{
              padding: '10px 18px', borderRadius: '12px',
              backgroundColor: '#00DF81', border: 'none',
              color: '#070B18', fontSize: '12px', fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,223,129,0.25)',
            }}
          >
            ✨ + Criar Novo Formulário
          </button>

          <button
            onClick={loadData}
            style={{
              padding: '10px 14px', borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            🔄 Atualizar
          </button>
        </div>
      </div>

      {/* ── BARRA MULTI-TENANT: ÁREA DE CLIENTES ── */}
      <div style={{ marginBottom: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🏢</span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Área de Clientes & Tenants
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setActiveArea('all'); setSelectedClientId('all'); }}
              style={{
                padding: '6px 14px', borderRadius: '8px',
                border: activeArea === 'all' ? '1px solid #00DF81' : '1px solid rgba(255,255,255,0.1)',
                backgroundColor: activeArea === 'all' ? 'rgba(0,223,129,0.15)' : 'transparent',
                color: activeArea === 'all' ? '#00DF81' : 'rgba(255,255,255,0.6)',
                fontWeight: 700, fontSize: '11px', cursor: 'pointer',
              }}
            >
              🌐 Visão Geral Completa
            </button>

            <button
              onClick={() => { setActiveArea('infinity'); setSelectedClientId('all'); }}
              style={{
                padding: '6px 14px', borderRadius: '8px',
                border: activeArea === 'infinity' ? '1px solid #00AAFF' : '1px solid rgba(255,255,255,0.1)',
                backgroundColor: activeArea === 'infinity' ? 'rgba(0,170,255,0.15)' : 'transparent',
                color: activeArea === 'infinity' ? '#00AAFF' : 'rgba(255,255,255,0.6)',
                fontWeight: 700, fontSize: '11px', cursor: 'pointer',
              }}
            >
              🏢 Infinity On Demand (Próprio)
            </button>

            <button
              onClick={() => { setActiveArea('client'); }}
              style={{
                padding: '6px 14px', borderRadius: '8px',
                border: activeArea === 'client' ? '1px solid #FFB800' : '1px solid rgba(255,255,255,0.1)',
                backgroundColor: activeArea === 'client' ? 'rgba(255,184,0,0.15)' : 'transparent',
                color: activeArea === 'client' ? '#FFB800' : 'rgba(255,255,255,0.6)',
                fontWeight: 700, fontSize: '11px', cursor: 'pointer',
              }}
            >
              👥 Clientes da Agência ({clients.length})
            </button>
          </div>
        </div>

        {activeArea === 'client' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#FFB800', fontWeight: 700 }}>
              Filtrar por Cliente Específico:
            </span>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedClientId('all')}
                style={{
                  padding: '6px 12px', borderRadius: '8px',
                  backgroundColor: selectedClientId === 'all' ? 'rgba(255,184,0,0.2)' : 'rgba(255,255,255,0.04)',
                  border: selectedClientId === 'all' ? '1px solid #FFB800' : '1px solid rgba(255,255,255,0.1)',
                  color: selectedClientId === 'all' ? '#FFB800' : '#fff',
                  fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                }}
              >
                Todos os Clientes
              </button>
              {clients.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClientId(c.id)}
                  style={{
                    padding: '6px 12px', borderRadius: '8px',
                    backgroundColor: selectedClientId === c.id ? 'rgba(255,184,0,0.2)' : 'rgba(255,255,255,0.04)',
                    border: selectedClientId === c.id ? '1px solid #FFB800' : '1px solid rgba(255,255,255,0.1)',
                    color: selectedClientId === c.id ? '#FFB800' : '#fff',
                    fontSize: '11px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  {c.company} ({forms.filter((f) => f.clientId === c.id).length} funis)
                </button>
              ))}
            </div>
          </div>
        )}

        {currentClient && selectedClientId !== 'all' && (
          <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ fontSize: '12px', color: '#fff' }}>
              <strong>Cliente Ativo:</strong> {currentClient.company} • <strong>Responsável:</strong> {currentClient.name} • <strong>Nicho:</strong> {currentClient.niche} • <strong>WhatsApp:</strong> {currentClient.phone}
            </div>
            <span style={{ fontSize: '11px', color: '#FFB800', fontWeight: 700 }}>
              Isolamento e personalização de marca ativados
            </span>
          </div>
        )}
      </div>

      {/* ── DIRETÓRIO DE FORMULÁRIOS & FUNIS (GRID ESPAÇOSO E ORGANIZADO) ── */}
      <div style={{ marginBottom: '28px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '22px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📁</span> Diretório de Formulários Ativos ({filteredForms.length})
            </h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
              Clique em um formulário para visualizar suas métricas e gráficos comparativos de respostas.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Input de Busca de Formulário */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="🔍 Buscar formulário por título ou slug..."
                value={formSearchQuery}
                onChange={(e) => setFormSearchQuery(e.target.value)}
                style={{
                  padding: '8px 14px', borderRadius: '10px',
                  backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff', fontSize: '12px', width: '260px', outline: 'none',
                }}
              />
              {formSearchQuery && (
                <button
                  onClick={() => setFormSearchQuery('')}
                  style={{ position: 'absolute', right: '8px', top: '8px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '12px' }}
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setSelectedFormSlug('all')}
              style={{
                padding: '8px 14px', borderRadius: '10px',
                border: selectedFormSlug === 'all' ? '1px solid #00DF81' : '1px solid rgba(255,255,255,0.1)',
                backgroundColor: selectedFormSlug === 'all' ? 'rgba(0,223,129,0.15)' : 'rgba(255,255,255,0.04)',
                color: selectedFormSlug === 'all' ? '#00DF81' : '#fff',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Ver Todos ({leads.length} leads)
            </button>
          </div>
        </div>

        {/* Grade de Cards dos Formulários */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredForms.map((f) => {
            const isSelected = selectedFormSlug === f.slug;
            const fLeads = leads.filter((l) => l.form_slug.toLowerCase() === f.slug.toLowerCase()).length;
            const cardAccent = f.primaryColor || (f.tenantType === 'infinity' ? '#00DF81' : '#FFB800');

            return (
              <div
                key={f.id}
                style={{
                  backgroundColor: isSelected ? 'rgba(0, 223, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? `2px solid ${cardAccent}` : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  boxShadow: isSelected ? `0 8px 24px ${cardAccent}22` : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontSize: '10px', padding: '3px 8px', borderRadius: '6px',
                        backgroundColor: f.tenantType === 'infinity' ? 'rgba(0,170,255,0.15)' : 'rgba(255,184,0,0.15)',
                        color: f.tenantType === 'infinity' ? '#00AAFF' : '#FFB800',
                        fontWeight: 800, textTransform: 'uppercase',
                      }}
                    >
                      {f.tenantType === 'infinity' ? '🏢 Infinity' : `🤝 ${f.clientName || 'Cliente'}`}
                    </span>

                    <span style={{ fontSize: '10px', color: f.status === 'Ativo' ? '#00DF81' : '#FFB800', fontWeight: 800 }}>
                      ● {f.status}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '4px', lineHeight: '1.3' }}>
                    {f.title}
                  </h4>

                  <div style={{ fontSize: '11px', color: cardAccent, fontWeight: 700, marginBottom: '6px' }}>
                    forms.infinityondemand.com.br/{f.slug}
                  </div>

                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span>🏷️ {f.niche}</span>
                    <span>❓ {f.questions.length} etapas</span>
                    <span>📈 <strong>{fLeads} leads</strong></span>
                  </div>
                </div>

                {/* Ações do Card */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setSelectedFormSlug(f.slug)}
                    style={{
                      flex: 1, padding: '7px 10px', borderRadius: '8px',
                      backgroundColor: isSelected ? cardAccent : 'rgba(255,255,255,0.06)',
                      border: 'none', color: isSelected ? '#070B18' : '#fff',
                      fontSize: '11px', fontWeight: 800, cursor: 'pointer',
                    }}
                  >
                    {isSelected ? '✓ Selecionado' : '📊 Analisar Métricas'}
                  </button>

                  <a
                    href={`https://forms.infinityondemand.com.br/${f.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '7px 10px', borderRadius: '8px',
                      backgroundColor: 'rgba(0,223,129,0.12)', color: '#00DF81',
                      fontSize: '11px', fontWeight: 700, textDecoration: 'none',
                    }}
                    title="Abrir no ar"
                  >
                    🔗 Abrir
                  </a>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://forms.infinityondemand.com.br/${f.slug}`);
                      alert(`Link do formulário copiado!
https://forms.infinityondemand.com.br/${f.slug}`);
                    }}
                    style={{
                      padding: '7px 10px', borderRadius: '8px',
                      backgroundColor: 'rgba(0,170,255,0.12)', border: 'none',
                      color: '#00AAFF', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                    }}
                    title="Copiar Link"
                  >
                    📋 Copiar
                  </button>

                  <button
                    onClick={() => openEditFormModal(f)}
                    style={{
                      padding: '7px 10px', borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.08)', border: 'none',
                      color: '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                    }}
                    title="Editar Perguntas e Cores"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleDeleteForm(f.id, f.title)}
                    style={{
                      padding: '7px 10px', borderRadius: '8px',
                      backgroundColor: 'rgba(239,68,68,0.12)', border: 'none',
                      color: '#ef4444', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                    }}
                    title="Remover Formulário"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BANNER DO FORMULÁRIO SELECIONADO ── */}
      {activeSelectedForm && (
        <div style={{ marginBottom: '24px', padding: '14px 20px', borderRadius: '16px', backgroundColor: 'rgba(0,223,129,0.08)', border: '1px solid rgba(0,223,129,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#00DF81', fontWeight: 800, textTransform: 'uppercase' }}>
              🎯 Exibindo Métricas Específicas do Formulário:
            </span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              {activeSelectedForm.title} • <span style={{ color: '#00DF81' }}>forms.infinityondemand.com.br/{activeSelectedForm.slug}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href={`https://forms.infinityondemand.com.br/${activeSelectedForm.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: '6px 14px', borderRadius: '8px', backgroundColor: '#00DF81', color: '#070B18', fontWeight: 800, fontSize: '11px', textDecoration: 'none' }}
            >
              Testar Funil no Ar
            </a>
            <button
              onClick={() => setSelectedFormSlug('all')}
              style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
            >
              ✕ Limpar Filtro
            </button>
          </div>
        </div>
      )}

      {/* ── KPIS FILTRADOS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase' }}>
            Total de Respostas / Leads
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginTop: '6px' }}>
            {totalLeads}
          </div>
          <div style={{ fontSize: '11px', color: '#00DF81', marginTop: '4px' }}>
            ⚡ 100% integrados e salvos
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase' }}>
            Alta Qualificação (Score 75+)
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#00DF81', marginTop: '6px' }}>
            {highQualifiedLeads}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
            Taxa de corte: {qualificationRate}% qualificados
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase' }}>
            Área / Tenant Ativo
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#00AAFF', marginTop: '10px' }}>
            {activeArea === 'infinity' ? 'Infinity On Demand' : (currentClient?.company || 'Geral')}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
            Isolamento de banco e regras
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase' }}>
            Taxa de Redirecionamento
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#FFB800', marginTop: '6px' }}>
            94%
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
            Para WhatsApp do vendedor
          </div>
        </div>
      </div>

      {/* ── GRÁFICOS DINÂMICOS DE COMPARAÇÃO DE RESPOSTAS DO FORMULÁRIO ── */}
      <div style={{ marginBottom: '28px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📊 Comparação de Respostas & Distribuição dos Leads
            </h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
              Gráficos de barras em tempo real com as respostas enviadas (ex: Faturamento, Renda, Nichos e Prioridades).
            </p>
          </div>
          <span style={{ fontSize: '11px', color: '#00DF81', fontWeight: 700 }}>
            {totalLeads} {totalLeads === 1 ? 'resposta analisada' : 'respostas analisadas'}
          </span>
        </div>

        {questionDistributionCharts.length === 0 || totalLeads === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
            Aguardando os primeiros leads preencherem as etapas deste formulário para renderizar o gráfico comparativo.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            {questionDistributionCharts.map((qChart, cIdx) => (
              <div
                key={cIdx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '16px',
                  padding: '18px',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '14px', lineHeight: '1.4' }}>
                  {qChart.title}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(qChart.counts).map(([optName, count], optIdx) => {
                    const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                    return (
                      <div key={optIdx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginBottom: '4px' }}>
                          <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{optName}</span>
                          <span style={{ color: count > 0 ? '#00DF81' : 'rgba(255,255,255,0.4)', fontWeight: 800 }}>
                            {count} {count === 1 ? 'lead' : 'leads'} ({pct}%)
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${Math.max(pct, count > 0 ? 5 : 0)}%`,
                              background: count > 0 ? 'linear-gradient(90deg, #00DF81 0%, #00F0FF 100%)' : 'transparent',
                              borderRadius: '999px',
                              transition: 'width 0.4s ease',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── TABELA DE RESPOSTAS E LEADS (COM ABERTURA DE DETALHES) ── */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
              📑 Respostas e Leads Capturados ({filteredLeads.length})
            </h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
              Clique no lead para abrir o relatório completo com todas as respostas pergunta-por-pergunta.
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: '8px',
              backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', fontSize: '12px', outline: 'none',
            }}
          >
            <option value="all">Todos os Status</option>
            <option value="novo">Novo</option>
            <option value="em_contato">Em Contato</option>
            <option value="reuniao_agendada">Reunião Agendada</option>
            <option value="fechado">Fechado</option>
            <option value="descartado">Descartado</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#00DF81', fontSize: '13px' }}>
            Carregando respostas do banco...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
            Nenhum lead encontrado com os filtros selecionados.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '12px 14px' }}>Lead / Empresa</th>
                  <th style={{ padding: '12px 14px' }}>Funil / Tenant</th>
                  <th style={{ padding: '12px 14px' }}>WhatsApp / Contato</th>
                  <th style={{ padding: '12px 14px' }}>Respostas Principais</th>
                  <th style={{ padding: '12px 14px' }}>Score</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => setSelectedLeadModal(l)}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      color: '#fff',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{l.name}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{l.company || 'Pessoa Física'}</div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontSize: '11px', color: '#00AAFF', fontWeight: 600 }}>{l.form_slug}</div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{l.client_name || 'Infinity'}</div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ color: '#00DF81', fontWeight: 700 }}>{l.phone || 'Sem telefone'}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{l.email}</div>
                    </td>
                    <td style={{ padding: '14px', maxWidth: '300px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {l.answers ? Object.entries(l.answers).slice(0, 2).map(([k, v]: any) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ') : l.nicho}
                      </div>
                      <div style={{ fontSize: '10px', color: '#FFB800' }}>
                        {l.faturamento || ''}
                      </div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span
                        style={{
                          fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '8px',
                          backgroundColor: l.lead_score >= 75 ? 'rgba(0,223,129,0.2)' : 'rgba(255,184,0,0.2)',
                          color: l.lead_score >= 75 ? '#00DF81' : '#FFB800',
                        }}
                      >
                        {l.lead_score} pts
                      </span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => setSelectedLeadModal(l)}
                          style={{
                            padding: '6px 10px', borderRadius: '8px', backgroundColor: 'rgba(0,170,255,0.15)',
                            color: '#00AAFF', fontSize: '11px', fontWeight: 700, border: 'none', cursor: 'pointer',
                          }}
                        >
                          👁️ Respostas
                        </button>

                        {l.phone && (
                          <a
                            href={`https://wa.me/${l.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${l.name}! Sou especialista da Infinity On Demand e recebi seu diagnóstico do formulário. Vamos conversar?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '6px 10px', borderRadius: '8px', backgroundColor: '#25D366', color: '#070B18',
                              fontSize: '11px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px',
                            }}
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ════════ MODAL DETALHES DO LEAD (RESPOSTAS COMPLETAS PERGUNTA-POR-PERGUNTA) ════════ */}
      {selectedLeadModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#0B0F1C', border: '1px solid rgba(0,223,129,0.4)', borderRadius: '24px', padding: '28px', maxWidth: '720px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.95)', position: 'relative' }}>
            <button
              onClick={() => setSelectedLeadModal(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '24px' }}>📋</span>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                  Respostas Completas do Lead
                </h3>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  Capturado em {new Date(selectedLeadModal.created_at).toLocaleString('pt-BR')} • Funil: {selectedLeadModal.form_slug}
                </div>
              </div>
            </div>

            {/* Informações de Contato e Score */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px', margin: '20px 0' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Nome do Lead</span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{selectedLeadModal.name}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Empresa / Marca</span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#00AAFF' }}>{selectedLeadModal.company || 'Não informado'}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>WhatsApp</span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#00DF81' }}>{selectedLeadModal.phone || 'Sem telefone'}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>E-mail</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{selectedLeadModal.email || 'Não informado'}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Lead Score</span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: selectedLeadModal.lead_score >= 75 ? '#00DF81' : '#FFB800' }}>
                  {selectedLeadModal.lead_score} pts ({selectedLeadModal.lead_score >= 75 ? 'Alta Qualificação' : 'Média/Padrão'})
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Status do CRM</span>
                <select
                  value={selectedLeadModal.status}
                  onChange={(e) => handleUpdateLeadStatus(selectedLeadModal.id, e.target.value)}
                  style={{ width: '100%', marginTop: '4px', padding: '6px 10px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '12px' }}
                >
                  <option value="novo">Novo</option>
                  <option value="em_contato">Em Contato</option>
                  <option value="reuniao_agendada">Reunião Agendada</option>
                  <option value="fechado">Fechado</option>
                  <option value="descartado">Descartado</option>
                </select>
              </div>
            </div>

            {/* Lista Pergunta por Pergunta */}
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#00DF81', textTransform: 'uppercase', marginBottom: '12px' }}>
              Perguntas & Respostas do Formulário:
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedLeadModal.answers && Object.keys(selectedLeadModal.answers).length > 0 ? (
                Object.entries(selectedLeadModal.answers).map(([questionTitle, answerVal], aIdx) => (
                  <div
                    key={aIdx}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                    }}
                  >
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                      Pergunta #{aIdx + 1}: <strong style={{ color: '#fff' }}>{questionTitle}</strong>
                    </div>

                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#00DF81' }}>
                      {Array.isArray(answerVal) ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                          {answerVal.map((item, i) => (
                            <span key={i} style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '8px', backgroundColor: 'rgba(0,223,129,0.15)', color: '#00DF81' }}>
                              ✓ {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        String(answerVal)
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                  Nenhuma resposta detalhada registrada para este lead.
                </div>
              )}
            </div>

            {/* Ações Rápidas de Contato */}
            <div style={{ marginTop: '24px', display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {selectedLeadModal.phone && (
                <a
                  href={`https://wa.me/${selectedLeadModal.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${selectedLeadModal.name}! Sou especialista da Infinity On Demand e estou entrando em contato sobre suas respostas no nosso formulário.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '10px 18px', borderRadius: '10px', backgroundColor: '#25D366', color: '#070B18',
                    fontSize: '12px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  💬 Iniciar Conversa no WhatsApp
                </a>
              )}
              <button
                onClick={() => setSelectedLeadModal(null)}
                style={{ padding: '10px 18px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ MODAL: CONSTRUTOR VERSÁTIL DE FORMULÁRIOS & WHITE-LABEL ════════ */}
      {showCreateFormModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#0B0F1C', border: '1px solid rgba(0,223,129,0.3)', borderRadius: '24px', padding: '30px', maxWidth: '860px', width: '100%', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.9)', position: 'relative' }}>
            <button
              onClick={() => setShowCreateFormModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '24px' }}>✨</span>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                {isEditingForm ? 'Editar Formulário & Configurações de Marca' : 'Construtor Versátil de Formulários Inteligentes'}
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
              Crie perguntas versáteis com seleção múltipla, textos, números, regras obrigatórias e personalização de cores/logo do cliente.
            </p>

            {/* Abas do Construtor */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setModalTab('geral')}
                style={{
                  padding: '8px 14px', borderRadius: '10px',
                  backgroundColor: modalTab === 'geral' ? 'rgba(0,223,129,0.2)' : 'transparent',
                  border: modalTab === 'geral' ? '1px solid #00DF81' : '1px solid transparent',
                  color: modalTab === 'geral' ? '#00DF81' : 'rgba(255,255,255,0.6)',
                  fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                }}
              >
                1. 🏢 Tenant & Informações
              </button>

              <button
                type="button"
                onClick={() => setModalTab('perguntas')}
                style={{
                  padding: '8px 14px', borderRadius: '10px',
                  backgroundColor: modalTab === 'perguntas' ? 'rgba(0,223,129,0.2)' : 'transparent',
                  border: modalTab === 'perguntas' ? '1px solid #00DF81' : '1px solid transparent',
                  color: modalTab === 'perguntas' ? '#00DF81' : 'rgba(255,255,255,0.6)',
                  fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                }}
              >
                2. ❓ Perguntas & Tipos ({formDraft.questions.length})
              </button>

              <button
                type="button"
                onClick={() => setModalTab('visual')}
                style={{
                  padding: '8px 14px', borderRadius: '10px',
                  backgroundColor: modalTab === 'visual' ? 'rgba(0,223,129,0.2)' : 'transparent',
                  border: modalTab === 'visual' ? '1px solid #00DF81' : '1px solid transparent',
                  color: modalTab === 'visual' ? '#00DF81' : 'rgba(255,255,255,0.6)',
                  fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                }}
              >
                3. 🎨 Cores, Logo & Fundo (White-Label)
              </button>

              <button
                type="button"
                onClick={() => setModalTab('obrigado')}
                style={{
                  padding: '8px 14px', borderRadius: '10px',
                  backgroundColor: modalTab === 'obrigado' ? 'rgba(0,223,129,0.2)' : 'transparent',
                  border: modalTab === 'obrigado' ? '1px solid #00DF81' : '1px solid transparent',
                  color: modalTab === 'obrigado' ? '#00DF81' : 'rgba(255,255,255,0.6)',
                  fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                }}
              >
                4. 🎉 Página de Obrigado & WhatsApp
              </button>
            </div>

            {createSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#00DF81', marginBottom: '6px' }}>{createSuccess}</h4>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
                  Disponível em: <strong>forms.infinityondemand.com.br/{formDraft.slug}</strong>
                </p>
                <button
                  onClick={() => { setShowCreateFormModal(false); setCreateSuccess(''); }}
                  style={{ padding: '10px 24px', borderRadius: '10px', backgroundColor: '#00DF81', color: '#070B18', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                >
                  Concluir e Voltar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveForm}>

                {/* ══ ABA 1: TENANT & GERAL ══ */}
                {modalTab === 'geral' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Proprietário / Tenant do Formulário:
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => setFormDraft((prev) => ({ ...prev, tenantType: 'infinity' }))}
                          style={{
                            padding: '12px', borderRadius: '10px', textAlign: 'left',
                            backgroundColor: formDraft.tenantType === 'infinity' ? 'rgba(0,223,129,0.15)' : 'rgba(255,255,255,0.02)',
                            border: formDraft.tenantType === 'infinity' ? '1px solid #00DF81' : '1px solid rgba(255,255,255,0.1)',
                            color: '#fff', cursor: 'pointer',
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: '13px', color: formDraft.tenantType === 'infinity' ? '#00DF81' : '#fff' }}>
                            🏢 Infinity On Demand (Uso Próprio)
                          </div>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Prospecção direta da agência</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormDraft((prev) => ({ ...prev, tenantType: 'client' }))}
                          style={{
                            padding: '12px', borderRadius: '10px', textAlign: 'left',
                            backgroundColor: formDraft.tenantType === 'client' ? 'rgba(255,184,0,0.15)' : 'rgba(255,255,255,0.02)',
                            border: formDraft.tenantType === 'client' ? '1px solid #FFB800' : '1px solid rgba(255,255,255,0.1)',
                            color: '#fff', cursor: 'pointer',
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: '13px', color: formDraft.tenantType === 'client' ? '#FFB800' : '#fff' }}>
                            🤝 Cliente da Agência (Tenant Externo)
                          </div>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Para clientes com dados isolados</div>
                        </button>
                      </div>

                      {formDraft.tenantType === 'client' && (
                        <div style={{ marginTop: '12px' }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#FFB800', marginBottom: '4px' }}>
                            Selecione o Cliente Cadastrado:
                          </label>
                          <select
                            value={formDraft.clientId || ''}
                            onChange={(e) => setFormDraft((prev) => ({ ...prev, clientId: e.target.value }))}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,184,0,0.4)', color: '#fff', fontSize: '13px', outline: 'none' }}
                          >
                            <option value="">Selecione um cliente...</option>
                            {clients.map((c) => (
                              <option key={c.id} value={c.id}>{c.company} ({c.name})</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Título do Funil / Formulário
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Qualificação para Tráfego Pago & Performance"
                        value={formDraft.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          const autoSlug = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                          setFormDraft((prev) => ({ ...prev, title, slug: prev.slug || autoSlug }));
                        }}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase' }}>
                          Slug da URL (forms.infinityondemand.com.br/...)
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0 10px' }}>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>forms.../</span>
                          <input
                            type="text"
                            required
                            value={formDraft.slug}
                            onChange={(e) => setFormDraft((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                            placeholder="angelo"
                            style={{ width: '100%', padding: '12px 4px', backgroundColor: 'transparent', border: 'none', color: '#00DF81', fontSize: '13px', fontWeight: 700, outline: 'none' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase' }}>
                          Nicho Principal
                        </label>
                        <select
                          value={isCustomNiche ? '__custom__' : formDraft.niche}
                          onChange={(e) => {
                            if (e.target.value === '__custom__') {
                              setIsCustomNiche(true);
                            } else {
                              setIsCustomNiche(false);
                              setFormDraft((prev) => ({ ...prev, niche: e.target.value }));
                            }
                          }}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none' }}
                        >
                          <option value="Tráfego Pago & Performance">🚀 Tráfego Pago & Performance</option>
                          <option value="Moda & Vestuário">👗 Moda & Vestuário</option>
                          <option value="Supermercados & Varejo">🛒 Supermercados & Varejo Alimentar</option>
                          <option value="Joias & Semijoias">💍 Joias & Semijoias</option>
                          <option value="Restaurantes & Delivery">🍕 Restaurantes & Delivery</option>
                          <option value="Serviços & B2B">🏢 Serviços B2B & Consultoria</option>
                          <option value="Imobiliário & Construtoras">🏢 Imobiliário & Construtoras</option>
                          <option value="Saúde & Odonto">🩺 Saúde & Odonto</option>
                          <option value="__custom__">➕ Outro Nicho (Digitar Personalizado)</option>
                        </select>
                      </div>
                    </div>

                    {isCustomNiche && (
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#00DF81', marginBottom: '6px' }}>
                          Digite o Nicho Personalizado:
                        </label>
                        <input
                          type="text"
                          required
                          value={customNicheInput}
                          onChange={(e) => setCustomNicheInput(e.target.value)}
                          placeholder="Ex: Clínicas Veterinárias / Pet Shop"
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid #00DF81', color: '#fff', fontSize: '13px', outline: 'none' }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* ══ ABA 2: PERGUNTAS & TIPOS ══ */}
                {modalTab === 'perguntas' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                        Configure as etapas que o lead responderá uma por vez (estilo Typeform).
                      </p>
                      <button
                        type="button"
                        onClick={addQuestion}
                        style={{ padding: '8px 14px', borderRadius: '8px', backgroundColor: 'rgba(0,223,129,0.15)', border: '1px solid #00DF81', color: '#00DF81', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                      >
                        + Adicionar Nova Pergunta
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '50vh', overflowY: 'auto' }}>
                      {formDraft.questions.map((q, idx) => (
                        <div key={q.id} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#00DF81', textTransform: 'uppercase' }}>
                              Etapa #{idx + 1}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={q.required}
                                  onChange={(e) => updateQuestion(q.id, { required: e.target.checked })}
                                />
                                Obrigatória
                              </label>

                              {formDraft.questions.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeQuestion(q.id)}
                                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}
                                >
                                  Excluir
                                </button>
                              )}
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                            <input
                              type="text"
                              value={q.title}
                              onChange={(e) => updateQuestion(q.id, { title: e.target.value })}
                              placeholder="Título da pergunta..."
                              style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none' }}
                            />

                            <select
                              value={q.type}
                              onChange={(e) => updateQuestion(q.id, { type: e.target.value as any })}
                              style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px', outline: 'none' }}
                            >
                              <option value="select">🔘 Seleção Única (Radio / 1-clique)</option>
                              <option value="checkbox">☑️ Múltipla Escolha (Várias opções)</option>
                              <option value="text">📝 Texto Curto (Varchar)</option>
                              <option value="textarea">📄 Texto Longo (Parágrafo)</option>
                              <option value="currency">💰 Faturamento / Moeda (R$)</option>
                              <option value="number">🔢 Número / Quantidade</option>
                              <option value="phone">📱 WhatsApp (Telefone c/ DDD)</option>
                              <option value="email">✉️ E-mail</option>
                              <option value="date">📅 Data</option>
                              <option value="rating">⭐ Avaliação (1 a 5 estrelas)</option>
                            </select>
                          </div>

                          <input
                            type="text"
                            value={q.helper || ''}
                            onChange={(e) => updateQuestion(q.id, { helper: e.target.value })}
                            placeholder="Texto de apoio ou subtítulo (opcional)..."
                            style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', fontSize: '11px', outline: 'none' }}
                          />

                          {/* Se for select ou checkbox, gerenciar opções */}
                          {(q.type === 'select' || q.type === 'checkbox' || q.type === 'currency') && (
                            <div style={{ marginTop: '6px', paddingLeft: '12px', borderLeft: '2px solid rgba(0,223,129,0.3)' }}>
                              <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                                Opções de Resposta:
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {(q.options || []).map((opt, oIdx) => (
                                  <div key={oIdx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={(e) => updateOptionText(q.id, oIdx, e.target.value)}
                                      style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', outline: 'none' }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeOptionFromQuestion(q.id, oIdx)}
                                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addOptionToQuestion(q.id)}
                                  style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#00DF81', fontSize: '11px', fontWeight: 700, cursor: 'pointer', marginTop: '2px' }}
                                >
                                  + Adicionar Opção
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ══ ABA 3: WHITE-LABEL (MARCA, LOGO, CORES & FUNDO) ══ */}
                {modalTab === 'visual' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                        Personalização White-Label da Marca do Cliente
                      </h4>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '14px' }}>
                        Quando o formulário for publicado, ele exibirá a logo, as cores e a identidade da empresa parceira.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase' }}>
                            Nome da Marca exibido no topo:
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: CACTUS CALOROSOS ou ELYS JOIAS"
                            value={formDraft.brandName || ''}
                            onChange={(e) => setFormDraft((prev) => ({ ...prev, brandName: e.target.value }))}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase' }}>
                            URL da Logo do Cliente (PNG Transparente):
                          </label>
                          <input
                            type="text"
                            placeholder="https://exemplo.com/logo.png ou /logo.png"
                            value={formDraft.brandLogoUrl || ''}
                            onChange={(e) => setFormDraft((prev) => ({ ...prev, brandLogoUrl: e.target.value }))}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none' }}
                          />
                        </div>
                      </div>

                      {/* Paleta de Cores Primárias */}
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '8px', textTransform: 'uppercase' }}>
                          Cor Primária da Marca (Botões, Barras de Progresso e Glow):
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          {[
                            { name: 'Verde Esmeralda', hex: '#00DF81' },
                            { name: 'Azul Royal', hex: '#3B82F6' },
                            { name: 'Roxo Tech', hex: '#8B5CF6' },
                            { name: 'Dourado Luxo', hex: '#EAB308' },
                            { name: 'Rosa Magenta', hex: '#EC4899' },
                            { name: 'Laranja Neon', hex: '#F97316' },
                            { name: 'Ciano Elétrico', hex: '#06B6D4' },
                          ].map((c) => (
                            <button
                              key={c.hex}
                              type="button"
                              onClick={() => setFormDraft((prev) => ({ ...prev, primaryColor: c.hex }))}
                              style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                backgroundColor: c.hex,
                                border: formDraft.primaryColor === c.hex ? '3px solid #fff' : '2px solid transparent',
                                cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                              }}
                              title={c.name}
                            />
                          ))}

                          <input
                            type="color"
                            value={formDraft.primaryColor || '#00DF81'}
                            onChange={(e) => setFormDraft((prev) => ({ ...prev, primaryColor: e.target.value }))}
                            style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'none' }}
                          />
                          <span style={{ fontSize: '12px', fontWeight: 700, color: formDraft.primaryColor || '#00DF81' }}>
                            {formDraft.primaryColor || '#00DF81'}
                          </span>
                        </div>
                      </div>

                      {/* Imagem de Fundo Customizada */}
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase' }}>
                          Imagem de Fundo Customizada (opcional - deixe vazio para usar Ondas Neon Infinity):
                        </label>
                        <input
                          type="text"
                          placeholder="https://exemplo.com/fundo-loja.jpg ou URL de imagem do cliente"
                          value={formDraft.backgroundImageUrl || ''}
                          onChange={(e) => setFormDraft((prev) => ({ ...prev, backgroundImageUrl: e.target.value }))}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none' }}
                        />
                      </div>
                    </div>

                    {/* Preview em Tempo Real */}
                    <div style={{ backgroundColor: '#050814', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '18px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '10px' }}>
                        👁️ Pré-Visualização Visual do Topo:
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <img
                          src={formDraft.brandLogoUrl || '/logo-infinity.png'}
                          alt="Logo Preview"
                          style={{ height: '38px', width: 'auto', maxHeight: '38px', objectFit: 'contain' }}
                          onError={(e) => ((e.target as any).src = '/logo-infinity.png')}
                        />
                        <div style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '0.04em' }}>
                          <span>{(formDraft.brandName || 'INFINITY ON DEMAND').split(' ')[0]} </span>
                          <span style={{ color: formDraft.primaryColor || '#00DF81' }}>{(formDraft.brandName || 'INFINITY ON DEMAND').split(' ').slice(1).join(' ')}</span>
                        </div>
                      </div>

                      <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '999px', overflow: 'hidden', marginBottom: '14px' }}>
                        <div style={{ height: '100%', width: '45%', background: formDraft.primaryColor || '#00DF81', borderRadius: '999px' }} />
                      </div>

                      <button
                        type="button"
                        style={{ padding: '8px 20px', borderRadius: '10px', backgroundColor: formDraft.primaryColor || '#00DF81', color: '#070B18', fontWeight: 800, fontSize: '12px', border: 'none' }}
                      >
                        Botão de Resposta / Continuar →
                      </button>
                    </div>
                  </div>
                )}

                {/* ══ ABA 4: PÁGINA DE OBRIGADO & CONVERSÃO ══ */}
                {modalTab === 'obrigado' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            checked={formDraft.sendToWhatsapp}
                            onChange={(e) => setFormDraft((prev) => ({ ...prev, sendToWhatsapp: e.target.checked }))}
                          />
                          Redirecionar para WhatsApp ao Concluir
                        </label>
                        <span style={{ fontSize: '11px', color: '#00DF81', fontWeight: 700 }}>
                          Alta Conversão: 94% dos leads
                        </span>
                      </div>

                      {formDraft.sendToWhatsapp && (
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase' }}>
                            WhatsApp do Especialista / Vendedor que Recebe o Lead (c/ DDI + DDD):
                          </label>
                          <input
                            type="text"
                            required={formDraft.sendToWhatsapp}
                            value={formDraft.whatsappDestination}
                            onChange={(e) => setFormDraft((prev) => ({ ...prev, whatsappDestination: e.target.value.replace(/\D/g, '') }))}
                            placeholder="5581981280719"
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#00DF81', fontSize: '13px', fontWeight: 700, outline: 'none' }}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Título da Página de Obrigado
                      </label>
                      <input
                        type="text"
                        required
                        value={formDraft.thankYouTitle}
                        onChange={(e) => setFormDraft((prev) => ({ ...prev, thankYouTitle: e.target.value }))}
                        placeholder="Ex: Diagnóstico Registrado com Sucesso!"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Mensagem de Agradecimento e Próximos Passos
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formDraft.thankYouMessage}
                        onChange={(e) => setFormDraft((prev) => ({ ...prev, thankYouMessage: e.target.value }))}
                        placeholder="Instruções para o lead..."
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateFormModal(false)}
                    style={{ padding: '10px 18px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    style={{ padding: '10px 24px', borderRadius: '10px', backgroundColor: '#00DF81', color: '#070B18', fontSize: '12px', fontWeight: 900, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,223,129,0.25)' }}
                  >
                    🚀 {isEditingForm ? 'Salvar Alterações' : 'Publicar Formulário no Ar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ════════ MODAL: NOVO CLIENTE / TENANT ════════ */}
      {showCreateClientModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#0B0F1C', border: '1px solid rgba(0,170,255,0.3)', borderRadius: '24px', padding: '30px', maxWidth: '520px', width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.9)', position: 'relative' }}>
            <button
              onClick={() => setShowCreateClientModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '24px' }}>👥</span>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                Cadastrar Novo Cliente
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
              Permite criar formulários dedicados com isolamento de dados e personalização de marca para o cliente.
            </p>

            <form onSubmit={handleSaveClient} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Nome da Empresa / Marca
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Joias do Brasil Ltda"
                  value={newClientDraft.company}
                  onChange={(e) => setNewClientDraft((prev) => ({ ...prev, company: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Nome do Responsável
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Maria Clara Santos"
                  value={newClientDraft.name}
                  onChange={(e) => setNewClientDraft((prev) => ({ ...prev, name: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  WhatsApp Comercial com DDD
                </label>
                <input
                  type="text"
                  required
                  placeholder="5581981280719"
                  value={newClientDraft.phone}
                  onChange={(e) => setNewClientDraft((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  E-mail de Contato
                </label>
                <input
                  type="email"
                  placeholder="contato@empresa.com.br"
                  value={newClientDraft.email}
                  onChange={(e) => setNewClientDraft((prev) => ({ ...prev, email: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateClientModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', borderRadius: '10px', backgroundColor: '#00AAFF', color: '#070B18', fontSize: '12px', fontWeight: 900, border: 'none', cursor: 'pointer' }}
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
