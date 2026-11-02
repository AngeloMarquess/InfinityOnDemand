'use client';

import React, { useState, useEffect } from 'react';

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
  created_at: string;
}

export function FormulariosTab() {
  const [forms, setForms] = useState<FormItem[]>([]);
  const [clients, setClients] = useState<ClientTenant[]>([]);
  const [leads, setLeads] = useState<FormLead[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ── SELETOR MULTI-TENANT DE ÁREA DE CLIENTES ──
  const [activeArea, setActiveArea] = useState<'all' | 'infinity' | 'client'>('all');
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [selectedFormSlug, setSelectedFormSlug] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modais
  const [showCreateFormModal, setShowCreateFormModal] = useState(false);
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [modalTab, setModalTab] = useState<'geral' | 'perguntas' | 'obrigado'>('geral');
  const [createSuccess, setCreateSuccess] = useState('');
  const [isCustomNiche, setIsCustomNiche] = useState(false);
  const [customNicheInput, setCustomNicheInput] = useState('');

  // Formulário em edição / criação
  const [formDraft, setFormDraft] = useState<FormItem>({
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
    questions: [
      { id: 'q_1', title: 'Qual é o seu nome completo?', helper: 'Usado para personalizar a proposta', type: 'text', required: true },
      { id: 'q_2', title: 'Qual seu WhatsApp comercial com DDD?', helper: 'Enviaremos o diagnóstico detalhado', type: 'phone', required: true },
      { id: 'q_3', title: 'Quais áreas do seu negócio precisam de expansão? (Marque todas)', type: 'checkbox', options: ['Vendas no WhatsApp', 'Loja Virtual / E-commerce', 'Tráfego Pago (Meta/Google)', 'Controle de Estoque e PDV'], required: true },
      { id: 'q_4', title: 'Qual o faturamento médio mensal?', type: 'currency', options: ['Até R$ 10 mil', 'R$ 10 a R$ 30 mil', 'R$ 30 a R$ 100 mil', 'Acima de R$ 100 mil'], required: true },
    ],
  });

  // Novo cliente em criação
  const [newClientDraft, setNewClientDraft] = useState({
    company: '',
    name: '',
    phone: '',
    email: '',
    niche: 'Moda & Vestuário',
  });

  // Carregar dados persistentes
  const loadData = async () => {
    try {
      setLoading(true);

      // 1. Carregar formulários
      const resForms = await fetch('/api/forms');
      const dataForms = await resForms.json();
      if (dataForms.forms) setForms(dataForms.forms);

      // 2. Carregar clientes
      const resClients = await fetch('/api/forms/clients');
      const dataClients = await resClients.json();
      if (dataClients.clients) setClients(dataClients.clients);

      // 3. Carregar leads
      const resLeads = await fetch('/api/forms/leads');
      const dataLeads = await resLeads.json();
      if (dataLeads.leads) {
        setLeads(dataLeads.leads);
        setStats(dataLeads.stats);
      }
    } catch (err) {
      console.error('Erro ao carregar dados de formulários:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtragem multi-tenant
  const filteredForms = forms.filter((f) => {
    if (activeArea === 'infinity' && f.tenantType !== 'infinity') return false;
    if (activeArea === 'client') {
      if (f.tenantType !== 'client') return false;
      if (selectedClientId !== 'all' && f.clientId !== selectedClientId) return false;
    }
    return true;
  });

  const filteredLeads = leads.filter((l) => {
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

  const totalLeads = filteredLeads.length;
  const highQualifiedLeads = filteredLeads.filter((l) => l.lead_score >= 75).length;
  const qualificationRate = totalLeads > 0 ? Math.round((highQualifiedLeads / totalLeads) * 100) : 0;

  // Salvar formulário (POST /api/forms)
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalNiche = isCustomNiche ? (customNicheInput.trim() || 'Personalizado') : formDraft.niche;
      const finalSlug = (formDraft.slug || formDraft.title.toLowerCase().replace(/[^a-z0-9]/g, '-')).replace(/^-+|-+$/g, '');

      let clientName = formDraft.clientName;
      if (formDraft.tenantType === 'client' && formDraft.clientId) {
        const c = clients.find((item) => item.id === formDraft.clientId);
        if (c) clientName = c.company;
      }

      const payload: FormItem = {
        ...formDraft,
        id: formDraft.id || `form-${Date.now()}`,
        slug: finalSlug,
        niche: finalNiche,
        clientName: clientName || formDraft.clientName,
        status: 'Ativo',
      };

      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.form) {
        setForms((prev) => [data.form, ...prev.filter((f) => f.id !== data.form.id)]);
        setCreateSuccess(`Formulário "${payload.title}" salvo com sucesso!`);
        setSelectedFormSlug(payload.slug);
      }
    } catch (err) {
      console.error('Erro ao salvar formulário:', err);
    }
  };

  // Salvar novo cliente (POST /api/forms/clients)
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

  // Funções de Gerenciamento de Perguntas
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
          const currentOpts = q.options || [];
          return { ...q, options: [...currentOpts, `Nova Opção ${currentOpts.length + 1}`] };
        }
        return q;
      }),
    }));
  };

  const updateOptionText = (qId: string, optIndex: number, newText: string) => {
    setFormDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === qId && q.options) {
          const updated = [...q.options];
          updated[optIndex] = newText;
          return { ...q, options: updated };
        }
        return q;
      }),
    }));
  };

  const removeOption = (qId: string, optIndex: number) => {
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

  // Abrir modal de criação limpo
  const openNewFormModal = () => {
    setFormDraft({
      id: '',
      title: '',
      slug: '',
      tenantType: activeArea === 'client' ? 'client' : 'infinity',
      clientId: selectedClientId !== 'all' ? selectedClientId : (clients[0]?.id || ''),
      clientName: '',
      niche: 'Moda & Vestuário',
      whatsappDestination: '5581981280719',
      sendToWhatsapp: true,
      thankYouTitle: 'Obrigado por responder!',
      thankYouMessage: 'Nossa equipe recebeu suas respostas com sucesso.',
      autoRedirectSeconds: 4,
      status: 'Ativo',
      questions: [
        { id: `q_${Date.now()}_1`, title: 'Para começarmos, qual é o seu nome completo?', helper: 'Nome do responsável', type: 'text', required: true },
        { id: `q_${Date.now()}_2`, title: 'Qual seu WhatsApp comercial com DDD?', helper: 'Receba o retorno por lá', type: 'phone', required: true },
        { id: `q_${Date.now()}_3`, title: 'Quais soluções você procura? (Marque todas)', type: 'checkbox', options: ['Aumentar Vendas', 'Novo Site / Loja', 'Gestão de Tráfego', 'Automação Comercial'], required: true },
        { id: `q_${Date.now()}_4`, title: 'Qual a sua média de faturamento mensal?', type: 'currency', options: ['Até 10 mil', '10 a 50 mil', '50 a 100 mil', 'Acima de 100 mil'], required: true },
      ],
    });
    setIsCustomNiche(false);
    setCustomNicheInput('');
    setModalTab('geral');
    setCreateSuccess('');
    setShowCreateFormModal(true);
  };

  const currentClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div style={{ padding: '24px 16px', maxWidth: '1440px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>

      {/* ── SEÇÃO SUPERIOR: TÍTULO & BOTÕES DE AÇÃO ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              Formulários & Qualificador de Tráfego Pago
            </h2>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', backgroundColor: 'rgba(0,223,129,0.15)', color: '#00DF81', border: '1px solid rgba(0,223,129,0.3)' }}>
              forms.infinityondemand.com.br
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
            Hub central multi-tenant: gerencie formulários interativos com separação de dados por cliente.
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
            ✨ + Criar Formulário
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

      {/* ── BARRA PRINCIPAL: SELETOR DE ÁREA DE CLIENTES (MULTI-TENANT) ── */}
      <div style={{ marginBottom: '20px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🏢</span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Área de Clientes & Tenants
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
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

        {/* Seletor específico de Cliente quando na Área de Clientes */}
        {activeArea === 'client' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#FFB800', fontWeight: 700 }}>
              Filtrar por Cliente Específico:
            </span>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
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

        {/* Banner do Cliente Selecionado */}
        {currentClient && selectedClientId !== 'all' && (
          <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ fontSize: '12px', color: '#fff' }}>
              <strong>Cliente Ativo:</strong> {currentClient.company} • <strong>Responsável:</strong> {currentClient.name} • <strong>Nicho:</strong> {currentClient.niche} • <strong>WhatsApp:</strong> {currentClient.phone}
            </div>
            <span style={{ fontSize: '11px', color: '#FFB800', fontWeight: 700 }}>
              Dados e leads isolados para este cliente
            </span>
          </div>
        )}
      </div>

      {/* ── BARRA DE SELEÇÃO DE FORMULÁRIOS NO AR (PILLS) ── */}
      <div style={{ marginBottom: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Formulários Ativos ({filteredForms.length})
          </div>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
            Selecione para ver métricas e respostas específicas
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            onClick={() => setSelectedFormSlug('all')}
            style={{
              padding: '8px 16px', borderRadius: '12px',
              border: selectedFormSlug === 'all' ? '1px solid #00DF81' : '1px solid rgba(255,255,255,0.1)',
              backgroundColor: selectedFormSlug === 'all' ? 'rgba(0,223,129,0.15)' : 'rgba(255,255,255,0.04)',
              color: selectedFormSlug === 'all' ? '#00DF81' : '#fff',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            Todos ({filteredLeads.length} leads)
          </button>

          {filteredForms.map((f) => {
            const isSelected = selectedFormSlug === f.slug;
            const fLeads = leads.filter((l) => l.form_slug === f.slug).length;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFormSlug(f.slug)}
                style={{
                  padding: '8px 16px', borderRadius: '12px',
                  border: isSelected ? '1px solid #00DF81' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: isSelected ? 'rgba(0,223,129,0.15)' : 'rgba(255,255,255,0.04)',
                  color: isSelected ? '#00DF81' : '#fff',
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                <span>{f.title}</span>
                <span
                  style={{
                    fontSize: '9px', padding: '2px 6px', borderRadius: '6px',
                    backgroundColor: f.tenantType === 'infinity' ? 'rgba(0,170,255,0.2)' : 'rgba(255,184,0,0.2)',
                    color: f.tenantType === 'infinity' ? '#00AAFF' : '#FFB800',
                    fontWeight: 700,
                  }}
                >
                  {f.tenantType === 'infinity' ? 'Infinity' : (f.clientName || 'Cliente')}
                </span>
                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  {fLeads}
                </span>
              </button>
            );
          })}
        </div>

        {selectedFormSlug !== 'all' && (
          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '12px' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>
              <strong>Link Público no Ar:</strong> forms.infinityondemand.com.br/{selectedFormSlug}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href={`https://forms.infinityondemand.com.br/${selectedFormSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: 'rgba(0,223,129,0.15)', color: '#00DF81', fontWeight: 700, fontSize: '11px', textDecoration: 'none' }}
              >
                🔗 Abrir Formulário
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://forms.infinityondemand.com.br/${selectedFormSlug}?utm_source=meta_ads&utm_campaign=escala`);
                  alert('Link de campanha copiado com sucesso!');
                }}
                style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: 'rgba(0,170,255,0.15)', color: '#00AAFF', fontWeight: 700, fontSize: '11px', border: 'none', cursor: 'pointer' }}
              >
                📋 Copiar Link de Anúncio
              </button>
            </div>
          </div>
        )}
      </div>

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

      {/* ── TABELA DE LEADS RECEBIDOS (COM RESPOSTAS COMPLETAS) ── */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
              📑 Respostas e Leads ({filteredLeads.length})
            </h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
              Respostas completas capturadas em tempo real com abertura de WhatsApp em 1 clique
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
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Ação WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((l) => (
                  <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#fff' }}>
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
                    <td style={{ padding: '14px', maxWidth: '320px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      {l.phone ? (
                        <a
                          href={`https://wa.me/${l.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${l.name}! Sou especialista da Infinity On Demand e recebi seu diagnóstico do formulário. Vamos conversar?`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '6px 12px', borderRadius: '8px', backgroundColor: '#25D366', color: '#070B18',
                            fontSize: '11px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px',
                          }}
                        >
                          Chamar no WhatsApp
                        </a>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Sem número</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ════════ MODAL: CONSTRUTOR VERSÁTIL DE FORMULÁRIOS (ESTILO GOOGLE/MICROSOFT FORMS) ════════ */}
      {showCreateFormModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#0B0F1C', border: '1px solid rgba(0,223,129,0.3)', borderRadius: '24px', padding: '30px', maxWidth: '820px', width: '100%', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.9)', position: 'relative' }}>
            <button
              onClick={() => setShowCreateFormModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '24px' }}>✨</span>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                Construtor Versátil de Formulários Inteligentes
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
              Crie perguntas versáteis com seleção múltipla, textos, números, regras obrigatórias e página de obrigado.
            </p>

            {/* Abas do Construtor */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setModalTab('geral')}
                style={{
                  padding: '8px 16px', borderRadius: '10px',
                  backgroundColor: modalTab === 'geral' ? 'rgba(0,223,129,0.2)' : 'transparent',
                  border: modalTab === 'geral' ? '1px solid #00DF81' : '1px solid transparent',
                  color: modalTab === 'geral' ? '#00DF81' : 'rgba(255,255,255,0.6)',
                  fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                }}
              >
                1. 🏢 Tenant & Informações Gerais
              </button>

              <button
                type="button"
                onClick={() => setModalTab('perguntas')}
                style={{
                  padding: '8px 16px', borderRadius: '10px',
                  backgroundColor: modalTab === 'perguntas' ? 'rgba(0,223,129,0.2)' : 'transparent',
                  border: modalTab === 'perguntas' ? '1px solid #00DF81' : '1px solid transparent',
                  color: modalTab === 'perguntas' ? '#00DF81' : 'rgba(255,255,255,0.6)',
                  fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                }}
              >
                2. ❓ Perguntas & Tipos de Campo ({formDraft.questions.length})
              </button>

              <button
                type="button"
                onClick={() => setModalTab('obrigado')}
                style={{
                  padding: '8px 16px', borderRadius: '10px',
                  backgroundColor: modalTab === 'obrigado' ? 'rgba(0,223,129,0.2)' : 'transparent',
                  border: modalTab === 'obrigado' ? '1px solid #00DF81' : '1px solid transparent',
                  color: modalTab === 'obrigado' ? '#00DF81' : 'rgba(255,255,255,0.6)',
                  fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                }}
              >
                3. 🎉 Página de Obrigado & WhatsApp
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
                          setFormDraft((prev) => ({ ...prev, title, slug: autoSlug }));
                        }}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase' }}>
                          Slug da URL
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0 10px' }}>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>forms.../</span>
                          <input
                            type="text"
                            required
                            value={formDraft.slug}
                            onChange={(e) => setFormDraft((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                            placeholder="trafego"
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
                      <div style={{ backgroundColor: 'rgba(0,223,129,0.06)', border: '1px solid rgba(0,223,129,0.2)', borderRadius: '10px', padding: '10px 14px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#00DF81', marginBottom: '4px' }}>
                          Nome do Novo Nicho Personalizado:
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Cursos, Pet Shops, Barbearias..."
                          value={customNicheInput}
                          onChange={(e) => setCustomNicheInput(e.target.value)}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px', outline: 'none' }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* ══ ABA 2: CONSTRUTOR DE PERGUNTAS VERSÁTIL ══ */}
                {modalTab === 'perguntas' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                        Suporte a seleções únicas, checkboxes múltiplas, textos, números, valores e obrigatoriedade.
                      </span>
                      <button
                        type="button"
                        onClick={addQuestion}
                        style={{ padding: '6px 14px', borderRadius: '8px', backgroundColor: 'rgba(0,223,129,0.15)', border: '1px solid rgba(0,223,129,0.4)', color: '#00DF81', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                      >
                        ➕ Adicionar Pergunta
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                      {formDraft.questions.map((q, idx) => (
                        <div key={q.id} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: '#00DF81', color: '#070B18', padding: '2px 8px', borderRadius: '6px' }}>
                                #{idx + 1}
                              </span>

                              {/* Tipo de Campo Versátil */}
                              <select
                                value={q.type}
                                onChange={(e) => updateQuestion(q.id, { type: e.target.value as any })}
                                style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', color: '#00AAFF', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px' }}
                              >
                                <option value="select">🔘 Múltipla Escolha (1 Opção)</option>
                                <option value="checkbox">☑️ Caixas de Seleção (Marcar 2, 3 ou mais)</option>
                                <option value="text">📝 Texto Curto (Varchar)</option>
                                <option value="textarea">📄 Texto Longo (Parágrafo)</option>
                                <option value="number">🔢 Número / Quantidade</option>
                                <option value="currency">💰 Valor Monetário (R$)</option>
                                <option value="phone">📱 WhatsApp / Telefone</option>
                                <option value="email">✉️ E-mail</option>
                                <option value="date">📅 Data</option>
                                <option value="rating">⭐ Avaliação (1 a 5 Estrelas)</option>
                              </select>

                              {/* Toggle de Obrigatório */}
                              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: q.required ? '#00DF81' : 'rgba(255,255,255,0.4)', fontWeight: 700, cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={q.required}
                                  onChange={(e) => updateQuestion(q.id, { required: e.target.checked })}
                                />
                                Obrigatória *
                              </label>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeQuestion(q.id)}
                              style={{ background: 'transparent', border: 'none', color: '#ff4d4d', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}
                            >
                              🗑️ Excluir
                            </button>
                          </div>

                          <div style={{ marginBottom: '8px' }}>
                            <input
                              type="text"
                              value={q.title}
                              onChange={(e) => updateQuestion(q.id, { title: e.target.value })}
                              placeholder="Digite o título da pergunta..."
                              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', fontWeight: 600, outline: 'none' }}
                            />
                          </div>

                          <div>
                            <input
                              type="text"
                              value={q.helper || ''}
                              onChange={(e) => updateQuestion(q.id, { helper: e.target.value })}
                              placeholder="Subtítulo ou orientação de apoio (opcional)..."
                              style={{ width: '100%', padding: '6px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', fontSize: '11px', outline: 'none' }}
                            />
                          </div>

                          {/* Se for Select, Checkbox ou Currency com opções */}
                          {(q.type === 'select' || q.type === 'checkbox' || q.type === 'currency') && (
                            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                              <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>
                                Opções Disponíveis:
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {(q.options || []).map((opt, optIdx) => (
                                  <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={(e) => updateOptionText(q.id, optIdx, e.target.value)}
                                      style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px', outline: 'none' }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeOption(q.id, optIdx)}
                                      style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '12px' }}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addOptionToQuestion(q.id)}
                                  style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: '#00DF81', fontSize: '11px', fontWeight: 700, cursor: 'pointer', marginTop: '2px' }}
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

                {/* ══ ABA 3: PÁGINA DE OBRIGADO & WHATSAPP ══ */}
                {modalTab === 'obrigado' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Título da Página de Obrigado
                      </label>
                      <input
                        type="text"
                        value={formDraft.thankYouTitle}
                        onChange={(e) => setFormDraft((prev) => ({ ...prev, thankYouTitle: e.target.value }))}
                        placeholder="Ex: Diagnóstico Registrado com Sucesso!"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none' }}
                      />
                    </div>

                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Mensagem de Agradecimento
                      </label>
                      <textarea
                        rows={3}
                        value={formDraft.thankYouMessage}
                        onChange={(e) => setFormDraft((prev) => ({ ...prev, thankYouMessage: e.target.value }))}
                        placeholder="Mensagem explicativa que o usuário lê após responder..."
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none' }}
                      />
                    </div>

                    {/* Toggle WhatsApp pós-envio */}
                    <div style={{ backgroundColor: 'rgba(0,223,129,0.06)', border: '1px solid rgba(0,223,129,0.2)', borderRadius: '14px', padding: '16px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800, color: '#00DF81', cursor: 'pointer', marginBottom: '8px' }}>
                        <input
                          type="checkbox"
                          checked={formDraft.sendToWhatsapp}
                          onChange={(e) => setFormDraft((prev) => ({ ...prev, sendToWhatsapp: e.target.checked }))}
                        />
                        Direcionar para o WhatsApp com resumo das respostas
                      </label>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                        Se ativado, abre a conversa com o número abaixo e mensagem formatada com as respostas do cliente.
                      </p>

                      {formDraft.sendToWhatsapp && (
                        <div style={{ marginTop: '12px' }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                            Número do WhatsApp de Destino (com DDD):
                          </label>
                          <input
                            type="tel"
                            required
                            value={formDraft.whatsappDestination}
                            onChange={(e) => setFormDraft((prev) => ({ ...prev, whatsappDestination: e.target.value }))}
                            placeholder="5581981280719"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px', outline: 'none' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* BOTÕES DE AÇÃO DO MODAL */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateFormModal(false)}
                    style={{ padding: '12px 20px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    style={{ padding: '12px 24px', borderRadius: '10px', backgroundColor: '#00DF81', color: '#070B18', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '13px', boxShadow: '0 4px 16px rgba(0,223,129,0.3)' }}
                  >
                    🚀 Salvar e Publicar Formulário
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ════════ MODAL: ADICIONAR NOVO CLIENTE (ÁREA DE CLIENTES) ════════ */}
      {showCreateClientModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#0B0F1C', border: '1px solid rgba(0,170,255,0.3)', borderRadius: '24px', padding: '30px', maxWidth: '500px', width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.9)', position: 'relative' }}>
            <button
              onClick={() => setShowCreateClientModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#00AAFF', marginBottom: '6px' }}>
              👥 Cadastrar Novo Cliente
            </h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
              Crie uma conta de cliente para isolar seus formulários, leads e conversões.
            </p>

            <form onSubmit={handleSaveClient} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Nome da Empresa / Marca
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Boutique Bella, Supermercado Central"
                  value={newClientDraft.company}
                  onChange={(e) => setNewClientDraft((prev) => ({ ...prev, company: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Nome do Responsável
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mariana Silva"
                  value={newClientDraft.name}
                  onChange={(e) => setNewClientDraft((prev) => ({ ...prev, name: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '4px', textTransform: 'uppercase' }}>
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="5581988887777"
                    value={newClientDraft.phone}
                    onChange={(e) => setNewClientDraft((prev) => ({ ...prev, phone: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Nicho
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Moda, Varejo, etc."
                    value={newClientDraft.niche}
                    onChange={(e) => setNewClientDraft((prev) => ({ ...prev, niche: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateClientModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#00AAFF', color: '#070B18', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '12px' }}
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

export default FormulariosTab;
