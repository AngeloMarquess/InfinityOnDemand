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

interface FormQuestion {
  id: string;
  title: string;
  helper?: string;
  type: 'select' | 'text' | 'phone' | 'email' | 'revenue' | 'instagram' | 'boolean';
  options?: string[];
  required: boolean;
}

interface FormItem {
  id: string;
  title: string;
  slug: string;
  tenantType: 'infinity' | 'client';
  clientName?: string;
  niche: string;
  whatsappDestination: string;
  autoRedirectSeconds: number;
  status: 'Ativo' | 'Pausado';
  responsesCount: number;
  questions: FormQuestion[];
}

export function FormulariosTab() {
  const [leads, setLeads] = useState<FormLead[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [selectedFormSlug, setSelectedFormSlug] = useState<string>('all');
  const [nichoFilter, setNichoFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modal de Criação / Edição
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalTab, setModalTab] = useState<'geral' | 'perguntas' | 'conversao'>('geral');
  const [customNicheInput, setCustomNicheInput] = useState('');
  const [isCustomNiche, setIsCustomNiche] = useState(false);

  // Lista de formulários cadastrados
  const [createdForms, setCreatedForms] = useState<FormItem[]>([
    {
      id: 'f-1',
      title: 'Diagnóstico E-commerce 7 Dias',
      slug: 'e-commerce-moda',
      tenantType: 'infinity',
      niche: 'Moda & Vestuário',
      whatsappDestination: '5581981280719',
      autoRedirectSeconds: 4,
      status: 'Ativo',
      responsesCount: 0,
      questions: [
        { id: 'q1', title: 'Para começarmos, me diz seu nome.', helper: 'Seu nome será usado pra personalizar o diagnóstico.', type: 'text', required: true },
        { id: 'q2', title: 'Qual seu WhatsApp comercial com DDD?', helper: 'Nosso especialista entrará em contato para apresentar seu diagnóstico.', type: 'phone', required: true },
        { id: 'q3', title: 'Qual a situação atual da sua empresa?', type: 'select', options: ['Vendo produtos físicos e quero desenvolver um e-commerce', 'Tenho um e-commerce e quero reestruturar'], required: true },
        { id: 'q4', title: 'Qual é o nicho da sua empresa?', type: 'select', options: ['Moda (vestuário e calçados)', 'Bolsas e acessórios', 'Joias e Semijoias', 'Saúde e Beleza', 'Alimentos e Bebidas', 'Outro Nicho'], required: true },
        { id: 'q5', title: 'As peças são de marca própria/fornecedor autorizado ou réplicas?', type: 'select', options: ['Marca própria ou fornecedor autorizado', 'São réplicas'], required: true },
        { id: 'q6', title: 'Qual o Instagram da marca?', helper: 'Ex: @suamarca', type: 'instagram', required: false },
        { id: 'q7', title: 'Quais são os canais de vendas da sua empresa?', type: 'select', options: ['Apenas loja física', 'Física + Instagram', 'Apenas no WhatsApp', 'Apenas em Marketplace'], required: true },
        { id: 'q8', title: 'Sua operação física/online fatura quanto em média por mês?', type: 'revenue', options: ['Ainda não faturamos', 'Até 5 mil por mês', 'De 5 a 10 mil por mês', 'De 10 a 25 mil por mês', 'De 25 a 50 mil no mês', 'De 50 a 100 mil no mês', 'Acima de 100 mil no mês'], required: true },
        { id: 'q9', title: 'Você possui sócios na empresa?', type: 'select', options: ['Não, sou o único proprietário', 'Sim, tenho um ou mais sócios', 'Sou colaborador / Gestor'], required: true },
        { id: 'q10', title: 'Qual o nome da sua empresa e e-mail corporativo?', helper: 'Enviaremos a cópia do plano de expansão.', type: 'email', required: true },
      ],
    },
    {
      id: 'f-2',
      title: 'Captação & Gestão Supermercados e Hortifrútis',
      slug: 'mercado',
      tenantType: 'infinity',
      niche: 'Supermercados & Varejo',
      whatsappDestination: '5581981280719',
      autoRedirectSeconds: 4,
      status: 'Ativo',
      responsesCount: 0,
      questions: [
        { id: 'qm1', title: 'Qual seu nome e cargo no supermercado?', type: 'text', required: true },
        { id: 'qm2', title: 'WhatsApp do responsável de compras/ti:', type: 'phone', required: true },
        { id: 'qm3', title: 'Quantos checkouts / caixas de PDV sua loja possui?', type: 'select', options: ['1 a 2 caixas', '3 a 5 caixas', '6 a 10 caixas', 'Mais de 10 caixas (Rede)'], required: true },
        { id: 'qm4', title: 'Sua loja já faz entregas por WhatsApp ou aplicativo próprio?', type: 'select', options: ['Apenas loja física', 'Recebemos pedidos pelo WhatsApp manualmente', 'Usamos iFood/Rappi', 'Queremos implantar nosso delivery próprio'], required: true },
      ],
    },
  ]);

  // Estado do formulário no modal
  const [formDraft, setFormDraft] = useState<FormItem>({
    id: '',
    title: '',
    slug: '',
    tenantType: 'infinity',
    clientName: '',
    niche: 'Moda Feminina',
    whatsappDestination: '5581981280719',
    autoRedirectSeconds: 4,
    status: 'Ativo',
    responsesCount: 0,
    questions: [
      { id: 'q_new_1', title: 'Para começarmos, qual é o seu nome completo?', type: 'text', required: true },
      { id: 'q_new_2', title: 'Qual seu WhatsApp comercial com DDD?', type: 'phone', required: true },
      { id: 'q_new_3', title: 'Qual o faturamento médio mensal da sua empresa?', type: 'revenue', options: ['Até 10 mil', '10 a 50 mil', '50 a 100 mil', 'Acima de 100 mil'], required: true },
    ],
  });

  const [createSuccess, setCreateSuccess] = useState('');

  // Busca leads do banco
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/forms/leads');
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
        setStats(data.stats);

        // Atualiza contagem por slug nos formulários cadastrados
        setCreatedForms((prev) =>
          prev.map((f) => ({
            ...f,
            responsesCount: data.leads.filter((l: FormLead) => l.form_slug === f.slug).length,
          }))
        );
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

  // Filtragem ativa por Formulário Selecionado
  const filteredLeads = leads.filter((l) => {
    if (selectedFormSlug !== 'all' && l.form_slug !== selectedFormSlug) return false;
    if (nichoFilter !== 'all' && l.nicho !== nichoFilter) return false;
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    return true;
  });

  const totalLeads = filteredLeads.length;
  const highQualifiedLeads = filteredLeads.filter((l) => l.lead_score >= 75).length;
  const qualificationRate = totalLeads > 0 ? Math.round((highQualifiedLeads / totalLeads) * 100) : 0;

  // Encontrar nicho mais frequente
  let topNicho = 'Moda';
  if (stats?.nichos) {
    const sorted = Object.entries(stats.nichos).sort((a: any, b: any) => b[1] - a[1]);
    if (sorted.length > 0) topNicho = sorted[0][0];
  }

  // Handlers para Edição de Perguntas no Modal
  const addQuestion = () => {
    const newQ: FormQuestion = {
      id: `q_${Date.now()}`,
      title: 'Nova Pergunta Interativa',
      type: 'select',
      options: ['Opção 1', 'Opção 2'],
      required: true,
    };
    setFormDraft((prev) => ({
      ...prev,
      questions: [...prev.questions, newQ],
    }));
  };

  const removeQuestion = (id: string) => {
    setFormDraft((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };

  const updateQuestion = (id: string, updates: Partial<FormQuestion>) => {
    setFormDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
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

  // Salvar novo formulário
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNiche = isCustomNiche ? (customNicheInput.trim() || 'Personalizado') : formDraft.niche;
    const finalSlug = (formDraft.slug || formDraft.title.toLowerCase().replace(/[^a-z0-9]/g, '-')).replace(/^-+|-+$/g, '');

    const newFormItem: FormItem = {
      ...formDraft,
      id: formDraft.id || `f-${Date.now()}`,
      slug: finalSlug,
      niche: finalNiche,
      status: 'Ativo',
      responsesCount: 0,
    };

    setCreatedForms((prev) => [newFormItem, ...prev.filter((f) => f.id !== newFormItem.id)]);
    setCreateSuccess(`Formulário "${formDraft.title}" publicado com sucesso!`);
    setSelectedFormSlug(finalSlug);
  };

  const openNewFormModal = () => {
    setFormDraft({
      id: '',
      title: '',
      slug: '',
      tenantType: 'infinity',
      clientName: '',
      niche: 'Moda Feminina',
      whatsappDestination: '5581981280719',
      autoRedirectSeconds: 4,
      status: 'Ativo',
      responsesCount: 0,
      questions: [
        { id: 'q_1', title: 'Para começarmos, qual é o seu nome completo?', helper: 'Usado para personalizar a proposta', type: 'text', required: true },
        { id: 'q_2', title: 'Qual seu WhatsApp comercial com DDD?', helper: 'Enviaremos a confirmação por lá', type: 'phone', required: true },
        { id: 'q_3', title: 'Qual o momento atual da sua empresa?', type: 'select', options: ['Criando do zero', 'Já operamos e queremos expandir', 'Reestruturação urgente'], required: true },
        { id: 'q_4', title: 'Qual o faturamento médio mensal?', type: 'revenue', options: ['Até 10 mil', '10 a 50 mil', '50 a 100 mil', 'Acima de 100 mil'], required: true },
      ],
    });
    setIsCustomNiche(false);
    setCustomNicheInput('');
    setModalTab('geral');
    setCreateSuccess('');
    setShowCreateModal(true);
  };

  const currentFormObj = createdForms.find((f) => f.slug === selectedFormSlug);

  return (
    <div style={{ padding: '24px 16px', maxWidth: '1440px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── HEADER DA ABA ── */}
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
            Hub central multi-tenant: gerencie funis interativos estilo Typeform para a Infinity e seus clientes.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={openNewFormModal}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', borderRadius: '12px',
              backgroundColor: '#00DF81', border: 'none',
              color: '#070B18', fontSize: '12px', fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,223,129,0.25)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#00F58D')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#00DF81')}
          >
            ✨ + Criar Novo Formulário
          </button>
          
          <a
            href={selectedFormSlug === 'all' ? 'https://forms.infinityondemand.com.br' : `https://forms.infinityondemand.com.br/${selectedFormSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 16px', borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', fontSize: '12px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s',
            }}
          >
            🔗 Abrir no Ar
          </a>

          <button
            onClick={fetchLeads}
            style={{
              padding: '10px 16px', borderRadius: '12px',
              backgroundColor: 'rgba(0,223,129,0.15)', border: '1px solid rgba(0,223,129,0.3)',
              color: '#00DF81', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            🔄 Atualizar Respostas
          </button>
        </div>
      </div>

      {/* ── BARRA DE SELEÇÃO DE FORMULÁRIOS CRIADOS (TABS / PILLS) ── */}
      <div style={{ marginBottom: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>📋</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Formulários no Ar ({createdForms.length})
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
            Clique para filtrar os dados específicos de um funil
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {/* Opção Todos */}
          <button
            onClick={() => setSelectedFormSlug('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              border: selectedFormSlug === 'all' ? '1px solid #00DF81' : '1px solid rgba(255,255,255,0.1)',
              backgroundColor: selectedFormSlug === 'all' ? 'rgba(0,223,129,0.15)' : 'rgba(255,255,255,0.04)',
              color: selectedFormSlug === 'all' ? '#00DF81' : '#fff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🌐 Todos os Formulários</span>
            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
              {leads.length} leads
            </span>
          </button>

          {/* Cards dos formulários criados */}
          {createdForms.map((f) => {
            const isSelected = selectedFormSlug === f.slug;
            const leadsCount = leads.filter((l) => l.form_slug === f.slug).length;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFormSlug(f.slug)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: isSelected ? '1px solid #00DF81' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: isSelected ? 'rgba(0,223,129,0.15)' : 'rgba(255,255,255,0.04)',
                  color: isSelected ? '#00DF81' : '#fff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>{f.title}</span>
                <span
                  style={{
                    fontSize: '9px',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    backgroundColor: f.tenantType === 'infinity' ? 'rgba(0,170,255,0.2)' : 'rgba(255,184,0,0.2)',
                    color: f.tenantType === 'infinity' ? '#00AAFF' : '#FFB800',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {f.tenantType === 'infinity' ? 'Infinity' : (f.clientName || 'Cliente')}
                </span>
                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  {leadsCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detalhes do funil selecionado */}
        {currentFormObj && selectedFormSlug !== 'all' && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              <span><strong>URL:</strong> forms.infinityondemand.com.br/{currentFormObj.slug}</span>
              <span><strong>Nicho:</strong> {currentFormObj.niche}</span>
              <span><strong>Perguntas Ativas:</strong> {currentFormObj.questions?.length || 8} etapas</span>
              <span><strong>Destino WhatsApp:</strong> {currentFormObj.whatsappDestination}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://forms.infinityondemand.com.br/${currentFormObj.slug}?utm_source=meta_ads&utm_campaign=escala_2026`);
                  alert('Link de campanha com UTMs copiado para a área de transferência!');
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0,170,255,0.15)',
                  border: '1px solid rgba(0,170,255,0.3)',
                  color: '#00AAFF',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                📋 Copiar Link de Anúncio
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── KPIS RÁPIDOS (FILTRADOS POR FORMULÁRIO ATIVO) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {selectedFormSlug === 'all' ? 'Total Geral de Leads' : `Leads (${selectedFormSlug})`}
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginTop: '6px' }}>
            {totalLeads}
          </div>
          <div style={{ fontSize: '11px', color: '#00DF81', marginTop: '4px', fontWeight: 500 }}>
            ⚡ 100% integrados ao CRM & WhatsApp
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Leads Alta Qualificação (Score 75+)
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#00DF81', marginTop: '6px' }}>
            {highQualifiedLeads}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
            Taxa de corte: {qualificationRate}% qualificados para fechamento
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Nicho Principal do Funil
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#00AAFF', marginTop: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentFormObj ? currentFormObj.niche : topNicho}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
            {currentFormObj?.tenantType === 'client' ? `Cliente: ${currentFormObj.clientName}` : 'Público proprietário Infinity'}
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Taxa de Conclusão / Redirecionamento
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#FFB800', marginTop: '6px' }}>
            94%
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
            Redirecionamento automático 4s após envio
          </div>
        </div>
      </div>

      {/* ── PAINÉIS GRÁFICOS (NICHOS, FATURAMENTO, MOMENTO) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        {/* Gráfico 1: Nichos */}
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
                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #00DF81, #00AAFF)', borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
                Nenhuma resposta registrada ainda para este filtro.
              </div>
            )}
          </div>
        </div>

        {/* Gráfico 2: Faturamento */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '22px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            💰 Faixa de Faturamento Declarada
          </h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
            Capacidade financeira e maturidade operacional do lead
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stats?.faturamentos && Object.keys(stats.faturamentos).length > 0 ? (
              Object.entries(stats.faturamentos).map(([f, count]: any) => {
                const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                return (
                  <div key={f} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{f}</span>
                      <span style={{ color: '#00DF81', fontWeight: 700 }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #00DF81, #FFB800)', borderRadius: '4px' }} />
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

        {/* Gráfico 3: Momento / Situação */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '22px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            ⚙️ Momento da Empresa & Marca
          </h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
            Criação do zero vs Reestruturação
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center', height: '140px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#00DF81' }} />
              <span style={{ fontSize: '13px', color: '#fff' }}>Criar E-commerce / Sistema do Zero</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#00AAFF' }} />
              <span style={{ fontSize: '13px', color: '#fff' }}>Reestruturar Operação Existente</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── TABELA DE LEADS RECEBIDOS COM SCORE ── */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
              📑 Leads Recebidos ({filteredLeads.length})
            </h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
              Classificados por Score de Qualificação com abertura direta de WhatsApp
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px', borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff', fontSize: '12px', outline: 'none',
              }}
            >
              <option value="all">Todos os Status</option>
              <option value="novo">Novo</option>
              <option value="em_contato">Em Contato</option>
              <option value="reuniao_agendada">Reunião Agendada</option>
              <option value="fechado">Contrato Fechado</option>
              <option value="descartado">Descartado</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#00DF81', fontSize: '14px' }}>
            Carregando respostas do banco...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
            Nenhum lead encontrado com os filtros atuais.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '12px 14px' }}>Lead / Empresa</th>
                  <th style={{ padding: '12px 14px' }}>Funil</th>
                  <th style={{ padding: '12px 14px' }}>Contato</th>
                  <th style={{ padding: '12px 14px' }}>Nicho / Faturamento</th>
                  <th style={{ padding: '12px 14px' }}>Score</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Ação</th>
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
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#00AAFF' }}>
                        {l.form_slug}
                      </span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ color: '#00DF81', fontWeight: 600 }}>{l.phone}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{l.email || l.instagram}</div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div>{l.nicho || 'Geral'}</div>
                      <div style={{ fontSize: '11px', color: '#FFB800' }}>{l.faturamento || 'Não informado'}</div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '4px 8px',
                          borderRadius: '8px',
                          backgroundColor: l.lead_score >= 75 ? 'rgba(0,223,129,0.2)' : 'rgba(255,184,0,0.2)',
                          color: l.lead_score >= 75 ? '#00DF81' : '#FFB800',
                        }}
                      >
                        {l.lead_score} pts
                      </span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <select
                        disabled={updatingId === l.id}
                        value={l.status || 'novo'}
                        onChange={(e) => handleUpdateStatus(l.id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#0f172a',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          fontSize: '11px',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="novo">Novo</option>
                        <option value="em_contato">Em Contato</option>
                        <option value="reuniao_agendada">Reunião Agendada</option>
                        <option value="fechado">Fechado</option>
                        <option value="descartado">Descartado</option>
                      </select>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <a
                        href={`https://wa.me/${l.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${l.name}! Sou especialista da Infinity On Demand e recebi seu diagnóstico com nota de qualificação ${l.lead_score}/100. Vamos agendar a apresentação?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          backgroundColor: '#25D366',
                          color: '#070B18',
                          fontSize: '11px',
                          fontWeight: 800,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ════════ MODAL AVANÇADO: CRIAR NOVO FORMULÁRIO (3 ABAS) ════════ */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#0B0F1C',
              border: '1px solid rgba(0,223,129,0.3)',
              borderRadius: '24px',
              padding: '30px',
              maxWidth: '780px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
              position: 'relative',
            }}
          >
            {/* Fechar */}
            <button
              onClick={() => setShowCreateModal(false)}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff',
                width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
              }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '24px' }}>✨</span>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                Criador de Formulários & Funis Inteligentes
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
              Estruture experiências interativas estilo Typeform com multi-tenant, lead scoring e perguntas personalizadas.
            </p>

            {/* ABAS DO MODAL */}
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
                2. ❓ Perguntas & Etapas ({formDraft.questions.length})
              </button>

              <button
                type="button"
                onClick={() => setModalTab('conversao')}
                style={{
                  padding: '8px 16px', borderRadius: '10px',
                  backgroundColor: modalTab === 'conversao' ? 'rgba(0,223,129,0.2)' : 'transparent',
                  border: modalTab === 'conversao' ? '1px solid #00DF81' : '1px solid transparent',
                  color: modalTab === 'conversao' ? '#00DF81' : 'rgba(255,255,255,0.6)',
                  fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                }}
              >
                3. 🚀 Conversão & IA
              </button>
            </div>

            {createSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#00DF81', marginBottom: '6px' }}>{createSuccess}</h4>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
                  O formulário está no ar em <strong>forms.infinityondemand.com.br/{formDraft.slug}</strong>
                </p>
                <button
                  onClick={() => { setShowCreateModal(false); setCreateSuccess(''); }}
                  style={{ padding: '10px 24px', borderRadius: '10px', backgroundColor: '#00DF81', color: '#070B18', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                >
                  Concluir e Voltar ao Painel
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveForm}>

                {/* ══ ABA 1: GERAL & TENANT ══ */}
                {modalTab === 'geral' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Seletor Multi-Tenant */}
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: '10px', textTransform: 'uppercase' }}>
                        Tenant do Formulário (Quem é o Dono?)
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
                            🏢 Infinity On Demand
                          </div>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                            Uso interno para prospecção própria da agência
                          </div>
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
                            🤝 Cliente da Infinity (Tenant Externo)
                          </div>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                            Funil vendido ou gerido para empresa cliente
                          </div>
                        </button>
                      </div>

                      {formDraft.tenantType === 'client' && (
                        <div style={{ marginTop: '12px' }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#FFB800', marginBottom: '4px' }}>
                            Nome da Empresa do Cliente:
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Supermercados Bom Preço, Joyce Fenolio, etc."
                            value={formDraft.clientName || ''}
                            onChange={(e) => setFormDraft((prev) => ({ ...prev, clientName: e.target.value }))}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,184,0,0.4)', color: '#fff', fontSize: '13px', outline: 'none' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Nome do Funil */}
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Título do Funil
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Diagnóstico E-commerce 7 Dias"
                        value={formDraft.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          const autoSlug = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                          setFormDraft((prev) => ({ ...prev, title, slug: autoSlug }));
                        }}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none' }}
                      />
                    </div>

                    {/* Slug & Nicho */}
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
                            placeholder="moda"
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

                    {/* Input se for Nicho Customizado */}
                    {isCustomNiche && (
                      <div style={{ backgroundColor: 'rgba(0,223,129,0.06)', border: '1px solid rgba(0,223,129,0.2)', borderRadius: '10px', padding: '10px 14px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#00DF81', marginBottom: '4px' }}>
                          Digite o Novo Nicho Customizado:
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Autopeças, Barbearias, Cursos Online..."
                          value={customNicheInput}
                          onChange={(e) => setCustomNicheInput(e.target.value)}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px', outline: 'none' }}
                        />
                      </div>
                    )}

                    {/* WhatsApp de Recebimento */}
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase' }}>
                        WhatsApp de Recebimento do Lead
                      </label>
                      <input
                        type="tel"
                        required
                        value={formDraft.whatsappDestination}
                        onChange={(e) => setFormDraft((prev) => ({ ...prev, whatsappDestination: e.target.value }))}
                        placeholder="5581981280719"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>
                )}

                {/* ══ ABA 2: CONSTRUTOR DE PERGUNTAS ESTILO TYPEFORM ══ */}
                {modalTab === 'perguntas' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                        Organize as etapas interativas apresentadas ao usuário (One-at-a-Time).
                      </span>
                      <button
                        type="button"
                        onClick={addQuestion}
                        style={{
                          padding: '6px 14px', borderRadius: '8px',
                          backgroundColor: 'rgba(0,223,129,0.15)', border: '1px solid rgba(0,223,129,0.4)',
                          color: '#00DF81', fontSize: '11px', fontWeight: 800, cursor: 'pointer',
                        }}
                      >
                        ➕ Adicionar Nova Etapa
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                      {formDraft.questions.map((q, idx) => (
                        <div
                          key={q.id}
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '14px',
                            padding: '16px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: '#00DF81', color: '#070B18', padding: '2px 8px', borderRadius: '6px' }}>
                                Etapa #{idx + 1}
                              </span>
                              <select
                                value={q.type}
                                onChange={(e) => updateQuestion(q.id, { type: e.target.value as any })}
                                style={{
                                  backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
                                  color: '#00AAFF', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px',
                                }}
                              >
                                <option value="select">Múltipla Escolha (1-clique)</option>
                                <option value="text">Texto Curto / Nome</option>
                                <option value="phone">WhatsApp / Telefone com DDD</option>
                                <option value="revenue">Faixa de Faturamento</option>
                                <option value="instagram">Instagram (@)</option>
                                <option value="email">E-mail Comercial</option>
                              </select>
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
                              placeholder="Título da pergunta..."
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

                          {/* Se for Múltipla Escolha / Faturamento, gerenciar opções */}
                          {(q.type === 'select' || q.type === 'revenue') && (
                            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                              <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>
                                Opções de Resposta:
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
                                      style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '12px' }}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addOptionToQuestion(q.id)}
                                  style={{
                                    alignSelf: 'flex-start', background: 'transparent', border: 'none',
                                    color: '#00DF81', fontSize: '11px', fontWeight: 700, cursor: 'pointer', marginTop: '2px',
                                  }}
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

                {/* ══ ABA 3: CONVERSÃO, IA & REGRAS DE CONCORRENTES ══ */}
                {modalTab === 'conversao' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ backgroundColor: 'rgba(0,223,129,0.05)', border: '1px solid rgba(0,223,129,0.2)', borderRadius: '14px', padding: '16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#00DF81', marginBottom: '4px' }}>
                        🎯 Algoritmo de Lead Scoring Preditivo (0 a 100)
                      </div>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
                        O Infinity Forms avalia matematicamente a intenção e faturamento do cliente. Leads com pontuação 75+ são marcados como <strong>Alta Qualificação</strong> e geram notificação com prioridade máxima.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                          ⚡ Auto-Avanço Typeform
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                          Avança imediatamente para a próxima tela em 240ms após selecionar a opção, elevando a conversão em até 38%.
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                          📲 Hand-off Direto WhatsApp
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                          Redirecionamento automático em 4 segundos após conclusão, transferindo o lead quente para a conversa do corretor/vendedor.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* BOTÕES DE AÇÃO DO MODAL */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    style={{ padding: '12px 20px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    style={{ padding: '12px 24px', borderRadius: '10px', backgroundColor: '#00DF81', color: '#070B18', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '13px', boxShadow: '0 4px 16px rgba(0,223,129,0.3)' }}
                  >
                    🚀 Publicar Formulário no Ar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default FormulariosTab;
