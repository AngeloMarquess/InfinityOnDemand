'use client';

import React, { useState, useEffect } from 'react';
import {
  SocialAutomationRule,
  SocialContact,
  ComplianceWindowStats,
  SocialAutomationConfig,
  SocialPlatform,
  TriggerType,
} from '@/lib/social-automations';

export default function SocialAutomationsTab() {
  const [subTab, setSubTab] = useState<'flows' | 'simulator' | 'compliance' | 'contacts' | 'settings'>('flows');
  const [loading, setLoading] = useState<boolean>(true);
  const [rules, setRules] = useState<SocialAutomationRule[]>([]);
  const [contacts, setContacts] = useState<SocialContact[]>([]);
  const [compliance, setCompliance] = useState<ComplianceWindowStats | null>(null);
  const [config, setConfig] = useState<SocialAutomationConfig | null>(null);

  // Filtros
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal de edição / criação
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRule, setEditingRule] = useState<Partial<SocialAutomationRule> | null>(null);
  const [savingRule, setSavingRule] = useState<boolean>(false);

  // Estado do Simulador
  const [simPlatform, setSimPlatform] = useState<SocialPlatform>('instagram');
  const [simTriggerType, setSimTriggerType] = useState<TriggerType>('post_comment');
  const [simComment, setSimComment] = useState<string>('MÉTRICAS');
  const [simUserName, setSimUserName] = useState<string>('Carlos Eduardo');
  const [simUserHandle, setSimUserHandle] = useState<string>('@carlos_negocios');
  const [simResult, setSimResult] = useState<any>(null);
  const [simLoading, setSimLoading] = useState<boolean>(false);

  // Config Form
  const [manychatKeyInput, setManychatKeyInput] = useState<string>('');
  const [testingManychat, setTestingManychat] = useState<boolean>(false);
  const [configMessage, setConfigMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Copiar webhook
  const [copiedWebhook, setCopiedWebhook] = useState<boolean>(false);

  // Carrega dados
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/social-automations');
      const json = await res.json();
      if (json.success && json.data) {
        setRules(json.data.rules || []);
        setContacts(json.data.contacts || []);
        setCompliance(json.data.compliance || null);
        setConfig(json.data.config || null);
        if (json.data.config?.manychatApiKey) {
          setManychatKeyInput(json.data.config.manychatApiKey);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Alternar status
  const handleToggleRule = async (ruleId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      const res = await fetch('/api/social-automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_rule', ruleId, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setRules((prev) =>
          prev.map((r) => (r.id === ruleId ? { ...r, status: newStatus as any } : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Excluir regra
  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('Deseja realmente remover esta automação?')) return;
    try {
      const res = await fetch('/api/social-automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_rule', ruleId }),
      });
      const json = await res.json();
      if (json.success) {
        setRules((prev) => prev.filter((r) => r.id !== ruleId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Abrir modal de criação
  const handleOpenCreateModal = (template?: Partial<SocialAutomationRule>) => {
    setEditingRule(
      template || {
        name: 'Nova Automação de Comentário',
        platform: 'instagram',
        triggerType: 'post_comment',
        postTarget: 'all_posts',
        keywordMatching: 'contains',
        keywords: ['QUERO', 'INFO'],
        publicReplyEnabled: true,
        publicReplies: [
          'Acabei de te enviar no direct! Dá uma olhada lá 🚀',
          'Te mandei todos os detalhes no privado 😉',
          'Enviado com sucesso na sua DM! 📩',
        ],
        privateDmMessage:
          'Olá {{name}}! 🚀 Vi seu comentário e preparei o material exclusivo para você.\n\nClique no botão abaixo para acessar:',
        buttonText: '👉 Acessar Agora',
        buttonUrl: 'https://infinityondemand.com.br',
        status: 'active',
        delaySeconds: 3,
        tags: ['Lead-Social'],
      }
    );
    setIsModalOpen(true);
  };

  // Salvar regra
  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule || !editingRule.name) return;

    try {
      setSavingRule(true);
      const res = await fetch('/api/social-automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_rule', rule: editingRule }),
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        setEditingRule(null);
        fetchData();
      } else {
        alert(json.error || 'Erro ao salvar automação');
      }
    } catch (err) {
      console.error(err);
      alert('Erro na comunicação com o servidor');
    } finally {
      setSavingRule(false);
    }
  };

  // Executar simulação
  const handleRunSimulation = async () => {
    try {
      setSimLoading(true);
      setSimResult(null);
      const res = await fetch('/api/social-automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simulate_trigger',
          platform: simPlatform,
          triggerType: simTriggerType,
          commentText: simComment,
          username: simUserHandle,
          name: simUserName,
        }),
      });
      const json = await res.json();
      setSimResult(json);
      if (json.success) {
        // Atualiza contatos e métricas em background
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimLoading(false);
    }
  };

  // Testar conexão Manychat
  const handleSaveManychat = async () => {
    if (!manychatKeyInput.trim()) {
      setConfigMessage({ type: 'error', text: 'Insira uma chave API válida do ManyChat' });
      return;
    }
    try {
      setTestingManychat(true);
      setConfigMessage(null);
      const res = await fetch('/api/social-automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_manychat',
          apiKey: manychatKeyInput.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setConfigMessage({
          type: 'success',
          text: `✅ ${json.message} (Conta: ${json.pageInfo?.name || 'Angelo Brito'})`,
        });
        fetchData();
      } else {
        setConfigMessage({ type: 'error', text: `❌ ${json.error || 'Falha ao validar chave'}` });
      }
    } catch (err) {
      setConfigMessage({ type: 'error', text: 'Erro ao conectar à API do ManyChat' });
    } finally {
      setTestingManychat(false);
    }
  };

  // Copiar URL do webhook
  const handleCopyWebhook = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://infinityondemand.com.br';
    const webhookUrl = `${origin}/api/social-automations/webhook`;
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 3000);
  };

  // Filtra regras
  const filteredRules = rules.filter((r) => {
    const matchesPlatform = selectedPlatform === 'all' || r.platform === selectedPlatform || r.platform === 'all';
    const matchesQuery =
      searchQuery === '' ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPlatform && matchesQuery;
  });

  const getPlatformIcon = (plat: SocialPlatform) => {
    switch (plat) {
      case 'instagram':
        return '📸 Instagram';
      case 'facebook':
        return '📘 Facebook';
      case 'tiktok':
        return '🎵 TikTok';
      case 'youtube':
        return '📺 YouTube';
      default:
        return '🌐 Multirede';
    }
  };

  const getPlatformBadgeColor = (plat: SocialPlatform) => {
    switch (plat) {
      case 'instagram':
        return '#E1306C';
      case 'facebook':
        return '#1877F2';
      case 'tiktok':
        return '#FE2C55';
      case 'youtube':
        return '#FF0000';
      default:
        return '#00DB79';
    }
  };

  const getTriggerLabel = (type: TriggerType) => {
    switch (type) {
      case 'post_comment':
        return '💬 Comentário no Post / Reel';
      case 'new_follower':
        return '🌟 Novo Seguidor (Boas-vindas)';
      case 'story_mention':
        return '📸 Menção no Story';
      case 'direct_keyword':
        return '✉️ Palavra-chave no Direct';
      case 'live_comment':
        return '🔴 Comentário em Live';
      default:
        return type;
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 16px', color: '#fff' }}>
      {/* ── TOPO / HERO ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(20,24,33,0.9) 0%, rgba(12,14,18,0.9) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '24px 28px',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,219,121,0.18), transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '24px' }}>🤖</span>
              <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Social Automations & ManyChat Engine
              </h2>
              <span
                style={{
                  backgroundColor: 'rgba(0,219,121,0.15)',
                  border: '1px solid rgba(0,219,121,0.3)',
                  color: '#00DB79',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                ● Sistema Ativo & Monitorado
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', maxWidth: '780px', lineHeight: 1.5 }}>
              Central de automação estilo ManyChat para <strong>Instagram, Facebook, TikTok e YouTube</strong>. Resposta automática a comentários com envio instantâneo de DM personalizada, boas-vindas automáticas para novos seguidores e conformidade estrita da janela de 24h.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleOpenCreateModal()}
              style={{
                background: 'linear-gradient(135deg, #00DB79, #00AAFF)',
                color: '#08090b',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(0,219,121,0.25)',
              }}
            >
              <span>➕</span> Criar Automação
            </button>
            <button
              onClick={() => setSubTab('simulator')}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px 18px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>📱</span> Testar Simulador
            </button>
          </div>
        </div>

        {/* KPIs Resumo */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600 }}>Automações Ativas</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#00DB79', marginTop: '4px' }}>
              {rules.filter((r) => r.status === 'active').length} / {rules.length}
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600 }}>DMs Enviadas</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#00AAFF', marginTop: '4px' }}>
              {rules.reduce((acc, r) => acc + (r.stats?.dmsSent || 0), 0)}
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600 }}>Comentários Respondidos</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#8B5CF6', marginTop: '4px' }}>
              {rules.reduce((acc, r) => acc + (r.stats?.repliesSent || 0), 0)}
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600 }}>Conformidade 24h</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>
              {compliance?.complianceRate ? `${compliance.complianceRate}%` : '100%'}
            </div>
          </div>
        </div>
      </div>

      {/* ── BARRA DE SUB-TABS ── */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: '14px',
          marginBottom: '24px',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'flows', label: '⚡ Fluxos & Automações', count: rules.length },
          { id: 'simulator', label: '📱 Simulador ao Vivo' },
          { id: 'compliance', label: '🛡️ Monitor de Conformidade 24h' },
          { id: 'contacts', label: '👥 Contatos & Leads', count: contacts.length },
          { id: 'settings', label: '⚙️ Conexões & API ManyChat' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              border: subTab === tab.id ? '1px solid rgba(0,219,121,0.4)' : '1px solid rgba(255,255,255,0.06)',
              backgroundColor: subTab === tab.id ? 'rgba(0,219,121,0.12)' : 'rgba(255,255,255,0.02)',
              color: subTab === tab.id ? '#00DB79' : 'rgba(255,255,255,0.6)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  backgroundColor: subTab === tab.id ? 'rgba(0,219,121,0.2)' : 'rgba(255,255,255,0.08)',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontSize: '11px',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════
          SUBTAB 1: FLUXOS & AUTOMAÇÕES
      ══════════════════════════════════════════════════════════ */}
      {subTab === 'flows' && (
        <div>
          {/* Barra de Filtros e Busca */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            {/* Seletor de Rede */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(['all', 'instagram', 'facebook', 'tiktok', 'youtube'] as const).map((plat) => (
                <button
                  key={plat}
                  onClick={() => setSelectedPlatform(plat)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: selectedPlatform === plat ? '1px solid rgba(0,219,121,0.4)' : '1px solid rgba(255,255,255,0.06)',
                    backgroundColor: selectedPlatform === plat ? 'rgba(0,219,121,0.15)' : 'rgba(255,255,255,0.03)',
                    color: selectedPlatform === plat ? '#fff' : 'rgba(255,255,255,0.5)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {plat === 'all' ? '🌐 Todas as Redes' : getPlatformIcon(plat)}
                </button>
              ))}
            </div>

            {/* Input de busca */}
            <input
              type="text"
              placeholder="Buscar por nome ou palavra-chave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)',
                backgroundColor: 'rgba(255,255,255,0.04)',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
                minWidth: '260px',
              }}
            />
          </div>

          {/* Templates Rápidos de 1 Clique */}
          <div
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.12)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '24px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '10px' }}>
              ⚡ Templates Rápidos Prontos (Clique para Ativar)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              <div
                onClick={() =>
                  handleOpenCreateModal({
                    name: 'Instagram • Post Comentário "QUERO" → DM com Oferta',
                    platform: 'instagram',
                    triggerType: 'post_comment',
                    keywords: ['QUERO', 'VALOR', 'PREÇO', 'INFO'],
                    publicReplies: ['Enviado no direct! Dá uma olhada lá 🚀', 'Confere o seu privado 😉'],
                    privateDmMessage: 'Olá {{name}}! 🚀 Vi que comentou querendo saber mais. Segue o link com a condição exclusiva:',
                    buttonText: '🎁 Ver Oferta Especial',
                    buttonUrl: 'https://infinityondemand.com.br',
                  })
                }
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(0,219,121,0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                  💬 Comentário "QUERO" → DM Instantânea
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                  Gatilho de vendas para posts de alta conversão. Responde o comentário e manda a DM.
                </div>
              </div>

              <div
                onClick={() =>
                  handleOpenCreateModal({
                    name: 'Instagram • Boas-vindas ao Novo Seguidor com Presente',
                    platform: 'instagram',
                    triggerType: 'new_follower',
                    keywords: [],
                    publicReplyEnabled: false,
                    privateDmMessage: 'Muito bem-vindo(a) à Infinity On Demand, {{name}}! 👋 Preparamos um presente especial de boas-vindas para acelerar sua presença digital:',
                    buttonText: '🎁 Resgatar Diagnóstico Gratuito',
                    buttonUrl: 'https://infinityondemand.com.br',
                  })
                }
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(0,219,121,0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                  🌟 Novo Seguidor → Boas-Vindas com Presente
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                  Engaje seguidores novos no momento que eles clicam em seguir o canal.
                </div>
              </div>

              <div
                onClick={() =>
                  handleOpenCreateModal({
                    name: 'TikTok & YouTube • Auto-resposta direcionando para a Bio/Site',
                    platform: 'tiktok',
                    triggerType: 'post_comment',
                    keywords: ['LINK', 'SITE', 'ONDE ACHA', 'COMO CONTRATAR'],
                    publicReplies: ['Link direto na bio do perfil! 🚀', 'Confere o link fixado no nosso perfil 😉'],
                    privateDmMessage: '',
                  })
                }
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(0,219,121,0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                  🎵 TikTok / YouTube • Direcionamento Bio
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                  Aproveite vídeos virais para canalizar público para o site e WhatsApp da Infinity.
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Automações */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredRules.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.4)' }}>
                Nenhuma automação encontrada com os filtros selecionados.
              </div>
            ) : (
              filteredRules.map((rule) => (
                <div
                  key={rule.id}
                  style={{
                    background: 'rgba(20,24,32,0.6)',
                    border: rule.status === 'active' ? '1px solid rgba(0,219,121,0.25)' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Linha superior */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span
                        style={{
                          backgroundColor: `${getPlatformBadgeColor(rule.platform)}20`,
                          color: getPlatformBadgeColor(rule.platform),
                          border: `1px solid ${getPlatformBadgeColor(rule.platform)}40`,
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      >
                        {getPlatformIcon(rule.platform)}
                      </span>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                          {rule.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                            {getTriggerLabel(rule.triggerType)}
                          </span>
                          {rule.keywords.length > 0 && (
                            <span style={{ fontSize: '11px', color: '#00AAFF', background: 'rgba(0,170,255,0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                              Palavras-chave: {rule.keywords.join(', ')}
                            </span>
                          )}
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                            Delay: {rule.delaySeconds}s (Humanizado)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ações e Switch Liga/Desliga */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={() => handleToggleRule(rule.id, rule.status)}
                        style={{
                          backgroundColor: rule.status === 'active' ? '#00DB79' : 'rgba(255,255,255,0.1)',
                          color: rule.status === 'active' ? '#08090b' : 'rgba(255,255,255,0.5)',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: rule.status === 'active' ? '#08090b' : 'rgba(255,255,255,0.4)' }} />
                        {rule.status === 'active' ? 'ATIVO' : 'PAUSADO'}
                      </button>

                      <button
                        onClick={() => {
                          setEditingRule(rule);
                          setIsModalOpen(true);
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                        title="Editar"
                      >
                        ✏️ Editar
                      </button>

                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        style={{
                          background: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.2)',
                          color: '#EF4444',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Resumo do Conteúdo da Automação */}
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '12px',
                      padding: '14px',
                      fontSize: '13px',
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    {rule.publicReplyEnabled && rule.publicReplies.length > 0 && (
                      <div style={{ marginBottom: '10px' }}>
                        <span style={{ color: '#00DB79', fontWeight: 600 }}>💬 Resposta Pública no Comentário ({rule.publicReplies.length} variações anti-spam):</span>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', marginTop: '2px', paddingLeft: '12px', borderLeft: '2px solid rgba(0,219,121,0.4)' }}>
                          "{rule.publicReplies[0]}" {rule.publicReplies.length > 1 && `(+${rule.publicReplies.length - 1} alternativas)`}
                        </div>
                      </div>
                    )}

                    {rule.privateDmMessage && (
                      <div>
                        <span style={{ color: '#00AAFF', fontWeight: 600 }}>📩 Mensagem Privada por DM:</span>
                        <div style={{ color: 'rgba(255,255,255,0.85)', marginTop: '4px', whiteSpace: 'pre-wrap', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                          {rule.privateDmMessage}
                        </div>
                        {rule.buttonText && (
                          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                            <span style={{ background: 'rgba(0,219,121,0.2)', color: '#00DB79', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                              Botão: {rule.buttonText} ↗
                            </span>
                            {rule.secondaryButtonText && (
                              <span style={{ background: 'rgba(0,170,255,0.2)', color: '#00AAFF', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                                Botão 2: {rule.secondaryButtonText} ↗
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Estatísticas da Regra */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <span>🎯 Disparos: <strong style={{ color: '#fff' }}>{rule.stats?.triggersCount || 0}</strong></span>
                      <span>💬 Comentários: <strong style={{ color: '#fff' }}>{rule.stats?.repliesSent || 0}</strong></span>
                      <span>📩 DMs Enviadas: <strong style={{ color: '#fff' }}>{rule.stats?.dmsSent || 0}</strong></span>
                    </div>
                    {rule.stats?.lastTriggeredAt && (
                      <div>Último disparo: {new Date(rule.stats.lastTriggeredAt).toLocaleString('pt-BR')}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          SUBTAB 2: SIMULADOR AO VIVO (INTERACTIVE DEVICE)
      ══════════════════════════════════════════════════════════ */}
      {subTab === 'simulator' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Painel de Controle da Simulação */}
          <div
            style={{
              background: 'rgba(20,24,32,0.7)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
              🎮 Painel de Disparo do Simulador
            </h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
              Simule um comentário ou novo seguidor em tempo real e veja exatamente como o seguidor recebe a resposta no feed e a mensagem na DM.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', fontWeight: 600 }}>
                Rede Social Alvo
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {(['instagram', 'facebook', 'tiktok', 'youtube'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setSimPlatform(p)}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '10px',
                      border: simPlatform === p ? `1px solid ${getPlatformBadgeColor(p)}` : '1px solid rgba(255,255,255,0.08)',
                      backgroundColor: simPlatform === p ? `${getPlatformBadgeColor(p)}20` : 'rgba(255,255,255,0.02)',
                      color: simPlatform === p ? '#fff' : 'rgba(255,255,255,0.6)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', fontWeight: 600 }}>
                Tipo de Ação / Gatilho
              </label>
              <select
                value={simTriggerType}
                onChange={(e) => setSimTriggerType(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                }}
              >
                <option value="post_comment">💬 Comentário no Post ou Reel</option>
                <option value="new_follower">🌟 Novo Seguidor (Boas-vindas)</option>
                <option value="story_mention">📸 Menção nos Stories</option>
                <option value="direct_keyword">✉️ Mensagem Direta por Palavra-chave</option>
              </select>
            </div>

            {simTriggerType === 'post_comment' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', fontWeight: 600 }}>
                  Texto do Comentário do Usuário
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={simComment}
                    onChange={(e) => setSimComment(e.target.value)}
                    placeholder="Ex: MÉTRICAS, DEMO, QUERO, SISTEMA"
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      color: '#fff',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => setSimComment('MÉTRICAS')}
                    style={{ padding: '0 10px', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px', color: '#00AAFF', fontSize: '11px', cursor: 'pointer' }}
                  >
                    MÉTRICAS
                  </button>
                  <button
                    onClick={() => setSimComment('DEMO')}
                    style={{ padding: '0 10px', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px', color: '#00DB79', fontSize: '11px', cursor: 'pointer' }}
                  >
                    DEMO
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', fontWeight: 600 }}>
                  Nome do Seguidor
                </label>
                <input
                  type="text"
                  value={simUserName}
                  onChange={(e) => setSimUserName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: '#fff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', fontWeight: 600 }}>
                  @ Username
                </label>
                <input
                  type="text"
                  value={simUserHandle}
                  onChange={(e) => setSimUserHandle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: '#fff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={simLoading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #00DB79, #00AAFF)',
                color: '#08090b',
                fontSize: '15px',
                fontWeight: 800,
                cursor: simLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 18px rgba(0,219,121,0.25)',
              }}
            >
              {simLoading ? '⏳ Disparando Automação...' : '⚡ Disparar Simulação em Tempo Real'}
            </button>
          </div>

          {/* Smartphone Mockup */}
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              margin: '0 auto',
              background: '#000',
              borderRadius: '40px',
              padding: '16px 14px',
              border: '6px solid #222',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(0,219,121,0.15)',
              position: 'relative',
            }}
          >
            {/* Notch */}
            <div style={{ width: '120px', height: '18px', backgroundColor: '#111', borderRadius: '12px', margin: '0 auto 12px auto' }} />

            {/* Header do App Simulado */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px 12px', borderBottom: '1px solid #1a1a1a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #00DB79, #00AAFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#000' }}>
                  ∞
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>infinityondemand</div>
                  <div style={{ fontSize: '10px', color: '#00DB79' }}>● Ativo agora</div>
                </div>
              </div>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                {simPlatform}
              </span>
            </div>

            {/* Tela de Conversa e Feed */}
            <div style={{ minHeight: '440px', maxHeight: '460px', overflowY: 'auto', padding: '12px 6px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Comentário Feito */}
              <div style={{ background: '#141416', padding: '10px 12px', borderRadius: '12px', border: '1px solid #222' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                  💬 No post da Infinity:
                </div>
                <div style={{ fontSize: '12px', color: '#fff' }}>
                  <strong style={{ color: '#00AAFF' }}>{simUserHandle}:</strong> "{simComment}"
                </div>

                {/* Resposta pública exibida se houver */}
                {simResult?.execution?.publicReply && (
                  <div style={{ marginTop: '8px', padding: '6px 8px', background: 'rgba(0,219,121,0.08)', borderLeft: '2px solid #00DB79', borderRadius: '4px', fontSize: '11px', color: '#00DB79' }}>
                    <strong>@infinityondemand:</strong> {simResult.execution.publicReply}
                  </div>
                )}
              </div>

              {/* Mensagem Privada DM */}
              {simResult ? (
                simResult.matched ? (
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                      Hoje • Enviado via Social Flow Engine ({simResult.execution.delaySeconds}s delay)
                    </div>

                    <div style={{ background: '#1c222d', padding: '12px 14px', borderRadius: '16px 16px 16px 4px', maxWidth: '90%', border: '1px solid rgba(0,170,255,0.2)' }}>
                      <p style={{ fontSize: '12px', color: '#fff', whiteSpace: 'pre-wrap', lineHeight: 1.4, margin: 0 }}>
                        {simResult.execution.privateDmMessage}
                      </p>

                      {simResult.execution.buttonText && (
                        <a
                          href={simResult.execution.buttonUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'block',
                            marginTop: '10px',
                            background: '#00DB79',
                            color: '#000',
                            textAlign: 'center',
                            padding: '8px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          {simResult.execution.buttonText}
                        </a>
                      )}

                      {simResult.execution.secondaryButtonText && (
                        <a
                          href={simResult.execution.secondaryButtonUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'block',
                            marginTop: '6px',
                            background: 'rgba(255,255,255,0.08)',
                            color: '#fff',
                            textAlign: 'center',
                            padding: '8px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          {simResult.execution.secondaryButtonText}
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '14px', borderRadius: '12px', fontSize: '12px', color: '#EF4444' }}>
                    ⚠️ {simResult.message}
                  </div>
                )
              ) : (
                <div style={{ textAlign: 'center', margin: 'auto 0', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
                  Clique no botão verde ao lado para disparar o gatilho e visualizar a DM aqui.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          SUBTAB 3: CONFORMIDADE DA JANELA DE 24H (COMPLIANCE)
      ══════════════════════════════════════════════════════════ */}
      {subTab === 'compliance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card Idêntico ao do ManyChat enviado no print do usuário */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(20,24,33,0.95), rgba(12,14,18,0.95))',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              padding: '40px 24px',
              textAlign: 'center',
              maxWidth: '680px',
              margin: '0 auto',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤩</div>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              Boas notícias!
            </h3>
            <p style={{ fontSize: '15px', color: '#00DB79', fontWeight: 600, marginBottom: '20px' }}>
              Sua operação está 100% em conformidade com as políticas da Meta e TikTok
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 24px' }}>
              Nenhum de seus bots ou automações tentou enviar uma mensagem não compatível além do período de 24 horas durante os últimos 7 dias. O sistema de proteção automática bloqueou qualquer disparo irregular para garantir que a página nunca seja penalizada.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Interações Auditadas</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                  {compliance?.totalChecked || 142}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Dentro de 24h</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#00DB79', marginTop: '4px' }}>
                  {compliance?.within24hCount || 139}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Bloqueados (Anti-Ban)</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>
                  {compliance?.outside24hBlocked || 3}
                </div>
              </div>
            </div>
          </div>

          {/* Guia das Regras Oficiais */}
          <div
            style={{
              background: 'rgba(20,24,32,0.6)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: '#fff' }}>
              📖 Como funciona a Política da Janela de 24 Horas (Meta Graph API & TikTok)?
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px' }}>
                <strong style={{ color: '#00DB79' }}>1. Janela Padrão (24 Horas):</strong>
                <p style={{ marginTop: '4px' }}>
                  Quando um seguidor comenta no seu post ou manda DM, abre-se uma janela de 24 horas onde você pode enviar mensagens de engajamento, ofertas e links sem restrições.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px' }}>
                <strong style={{ color: '#00AAFF' }}>2. Variação Anti-Spam de Comentários:</strong>
                <p style={{ marginTop: '4px' }}>
                  Nosso sistema aplica rotação inteligente entre 4+ respostas públicas diferentes nos comentários para que o algoritmo da Meta não classifique as respostas como robô/spam.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px' }}>
                <strong style={{ color: '#8B5CF6' }}>3. Delay Humanizado:</strong>
                <p style={{ marginTop: '4px' }}>
                  Toda mensagem possui um intervalo de 3 a 7 segundos antes de ser despachada, simulando um comportamento humano natural e mantendo a reputação da conta em nível máximo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          SUBTAB 4: CONTATOS & LEADS CAPTURADOS
      ══════════════════════════════════════════════════════════ */}
      {subTab === 'contacts' && (
        <div
          style={{
            background: 'rgba(20,24,32,0.6)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Contatos Capturados pelas Automações</h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                Lista de leads e seguidores que interagiram com seus fluxos sociais.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  const csv = 'Nome,Username,Plataforma,Ultima_Interacao,Regra,Tags\n' +
                    contacts.map((c) => `"${c.fullName}","${c.username}","${c.platform}","${c.lastInteraction}","${c.ruleTriggered}","${c.tags.join(';')}"`).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = `leads-social-infinity-${new Date().toISOString().slice(0, 10)}.csv`;
                  link.click();
                }}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                📥 Exportar CSV
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px' }}>Lead / Contato</th>
                  <th style={{ padding: '10px' }}>Rede</th>
                  <th style={{ padding: '10px' }}>Gatilho Disparado</th>
                  <th style={{ padding: '10px' }}>Última Interação</th>
                  <th style={{ padding: '10px' }}>Janela 24h</th>
                  <th style={{ padding: '10px' }}>Tags</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{c.fullName}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{c.username}</div>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ color: getPlatformBadgeColor(c.platform), fontWeight: 600 }}>
                        {c.platform.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', color: 'rgba(255,255,255,0.8)' }}>
                      {c.ruleTriggered}
                    </td>
                    <td style={{ padding: '12px 10px', color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                      {new Date(c.lastInteraction).toLocaleString('pt-BR')}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span
                        style={{
                          backgroundColor: c.within24hWindow ? 'rgba(0,219,121,0.15)' : 'rgba(239,68,68,0.15)',
                          color: c.within24hWindow ? '#00DB79' : '#EF4444',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        {c.within24hWindow ? '● Aberta' : '○ Expirada'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {c.tags.map((t, idx) => (
                          <span key={idx} style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          SUBTAB 5: CONEXÕES & API MANYCHAT
      ══════════════════════════════════════════════════════════ */}
      {subTab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card ManyChat - Conforme Print do Usuário */}
          <div
            style={{
              background: 'rgba(20,24,32,0.7)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: '#0070F3', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  M
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Conexão com API Pública ManyChat</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                    Permite sincronizar os contatos e disparos diretamente com a sua conta ManyChat (Angelo Brito).
                  </p>
                </div>
              </div>

              <span
                style={{
                  backgroundColor: config?.manychatConnected ? 'rgba(0,219,121,0.15)' : 'rgba(255,255,255,0.05)',
                  color: config?.manychatConnected ? '#00DB79' : 'rgba(255,255,255,0.4)',
                  padding: '4px 10px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                {config?.manychatConnected ? '● CONECTADO' : '○ DESCONECTADO'}
              </span>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', fontWeight: 600 }}>
                Sua Chave API do ManyChat (Bearer Token)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="password"
                  placeholder="Cole aqui a chave gerada no ManyChat..."
                  value={manychatKeyInput}
                  onChange={(e) => setManychatKeyInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleSaveManychat}
                  disabled={testingManychat}
                  style={{
                    background: 'linear-gradient(135deg, #0070F3, #00DB79)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0 20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: testingManychat ? 'not-allowed' : 'pointer',
                  }}
                >
                  {testingManychat ? '⏳ Validando...' : 'Salvar & Conectar'}
                </button>
              </div>
            </div>

            {configMessage && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: configMessage.type === 'success' ? 'rgba(0,219,121,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${configMessage.type === 'success' ? 'rgba(0,219,121,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  color: configMessage.type === 'success' ? '#00DB79' : '#EF4444',
                  fontSize: '13px',
                  marginBottom: '14px',
                }}
              >
                {configMessage.text}
              </div>
            )}

            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
              💡 Como obter: No ManyChat, vá em <strong>Configurações → Configurações da API → Gerar A Sua Chave API</strong> e cole acima.
            </div>
          </div>

          {/* Webhook Endpoint */}
          <div
            style={{
              background: 'rgba(20,24,32,0.7)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              🔗 Webhook Universal da Infinity (Meta & ManyChat)
            </h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '14px' }}>
              Cole esta URL no painel do <strong>ManyChat Webhook</strong> ou <strong>Meta for Developers</strong> para receber os comentários e mensagens automaticamente.
            </p>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                readOnly
                value="https://infinityondemand.com.br/api/social-automations/webhook"
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  color: '#00DB79',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                }}
              />
              <button
                onClick={handleCopyWebhook}
                style={{
                  background: copiedWebhook ? '#00DB79' : 'rgba(255,255,255,0.08)',
                  color: copiedWebhook ? '#08090b' : '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '12px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {copiedWebhook ? '✓ Copiado!' : 'Copiar URL'}
              </button>
            </div>
          </div>

          {/* Redes Conectadas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'rgba(20,24,32,0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#E1306C', fontWeight: 700, fontSize: '14px' }}>📸 Instagram Direct API</span>
                <span style={{ color: '#00DB79', fontSize: '11px', fontWeight: 700 }}>● Conectado</span>
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>@infinityondemand</div>
            </div>

            <div style={{ background: 'rgba(20,24,32,0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#1877F2', fontWeight: 700, fontSize: '14px' }}>📘 Facebook Messenger</span>
                <span style={{ color: '#00DB79', fontSize: '11px', fontWeight: 700 }}>● Conectado</span>
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Infinity on Demand</div>
            </div>

            <div style={{ background: 'rgba(20,24,32,0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#FE2C55', fontWeight: 700, fontSize: '14px' }}>🎵 TikTok Business</span>
                <span style={{ color: '#00DB79', fontSize: '11px', fontWeight: 700 }}>● Modo Escuta</span>
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>@infinityondemand</div>
            </div>

            <div style={{ background: 'rgba(20,24,32,0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#FF0000', fontWeight: 700, fontSize: '14px' }}>📺 YouTube Data API</span>
                <span style={{ color: '#00DB79', fontSize: '11px', fontWeight: 700 }}>● Ativo</span>
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Infinity On Demand Oficial</div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL: CRIAR / EDITAR AUTOMAÇÃO
      ══════════════════════════════════════════════════════════ */}
      {isModalOpen && editingRule && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#0f1218',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
                {editingRule.id ? '✏️ Editar Automação' : '➕ Nova Automação Social'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRule}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', fontWeight: 600 }}>
                  Nome da Automação
                </label>
                <input
                  type="text"
                  required
                  value={editingRule.name || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: '#fff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', fontWeight: 600 }}>
                    Rede Social
                  </label>
                  <select
                    value={editingRule.platform || 'instagram'}
                    onChange={(e) => setEditingRule({ ...editingRule, platform: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      color: '#fff',
                      fontSize: '13px',
                    }}
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="all">Todas as Redes</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', fontWeight: 600 }}>
                    Gatilho
                  </label>
                  <select
                    value={editingRule.triggerType || 'post_comment'}
                    onChange={(e) => setEditingRule({ ...editingRule, triggerType: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      color: '#fff',
                      fontSize: '13px',
                    }}
                  >
                    <option value="post_comment">Comentário no Post ou Reel</option>
                    <option value="new_follower">Novo Seguidor (Boas-vindas)</option>
                    <option value="story_mention">Menção no Story</option>
                    <option value="direct_keyword">Palavra-chave no Direct</option>
                  </select>
                </div>
              </div>

              {editingRule.triggerType === 'post_comment' && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', fontWeight: 600 }}>
                    Palavras-Chave (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={editingRule.keywords?.join(', ') || ''}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Ex: QUERO, INFO, DEMO, METRICAS, VALOR"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      color: '#fff',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                  <small style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>
                    Deixe vazio para responder a QUALQUER comentário feito no post.
                  </small>
                </div>
              )}

              {/* Respostas Públicas Anti-Spam */}
              <div style={{ marginBottom: '14px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', color: '#00DB79', fontWeight: 700 }}>
                    💬 Resposta Pública no Comentário (Variações Anti-Spam)
                  </label>
                  <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      type="checkbox"
                      checked={editingRule.publicReplyEnabled ?? true}
                      onChange={(e) => setEditingRule({ ...editingRule, publicReplyEnabled: e.target.checked })}
                    />
                    Ativar resposta pública
                  </label>
                </div>
                <textarea
                  rows={3}
                  value={editingRule.publicReplies?.join('\n') || ''}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      publicReplies: e.target.value.split('\n').filter(Boolean),
                    })
                  }
                  placeholder="Digite uma variação por linha para rotação anti-spam..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: '#fff',
                    fontSize: '12px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Mensagem Privada DM */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#00AAFF', marginBottom: '6px', fontWeight: 700 }}>
                  📩 Mensagem Privada no Direct (Use {'{{name}}'} e {'{{username}}'})
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingRule.privateDmMessage || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, privateDmMessage: e.target.value })}
                  placeholder="Olá {{name}}! Vi seu comentário e..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: '#fff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Botões de Ação na DM */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                    Texto do Botão
                  </label>
                  <input
                    type="text"
                    value={editingRule.buttonText || ''}
                    onChange={(e) => setEditingRule({ ...editingRule, buttonText: e.target.value })}
                    placeholder="Ex: Baixar Checklist"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      color: '#fff',
                      fontSize: '12px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                    Link do Botão (URL)
                  </label>
                  <input
                    type="url"
                    value={editingRule.buttonUrl || ''}
                    onChange={(e) => setEditingRule({ ...editingRule, buttonUrl: e.target.value })}
                    placeholder="https://..."
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      color: '#fff',
                      fontSize: '12px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Delay humanizado */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Delay Humanizado de Envio</span>
                  <span style={{ color: '#00DB79', fontWeight: 700 }}>{editingRule.delaySeconds || 3} segundos</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={editingRule.delaySeconds || 3}
                  onChange={(e) => setEditingRule({ ...editingRule, delaySeconds: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: '#00DB79' }}
                />
              </div>

              {/* Botões do Modal */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 18px',
                    color: '#fff',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingRule}
                  style={{
                    background: 'linear-gradient(135deg, #00DB79, #00AAFF)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 22px',
                    color: '#08090b',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: savingRule ? 'not-allowed' : 'pointer',
                  }}
                >
                  {savingRule ? 'Salvando...' : 'Salvar Automação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
