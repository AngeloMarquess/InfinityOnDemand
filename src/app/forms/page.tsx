'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Check,
  Zap,
  MessageCircle,
  BarChart3,
  GitBranch,
  ShieldCheck,
  Bot,
  ExternalLink,
  ChevronRight,
  Target,
  Smartphone,
  Globe2,
  Clock,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';

export default function FormsPage() {
  // Estado de Faturamento da Tabela de Preços (Mensal / Anual)
  const [isYearly, setIsYearly] = useState(false);

  // Estado do Simulador Interativo ao Vivo
  const [demoStep, setDemoStep] = useState(1);
  const [demoNiche, setDemoNiche] = useState('');
  const [demoRevenue, setDemoRevenue] = useState('');
  const [demoGoal, setDemoGoal] = useState('');

  // Tabela de Preços Exata (Mantendo a fidelidade total solicitada)
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      tagline: 'Para profissionais e negócios que querem começar a qualificar leads.',
      priceMonthly: 97,
      priceYearly: 77,
      highlight: false,
      badge: null,
      cta: 'Começar com Basic',
      ctaColor: '#fff',
      features: [
        'Até 500 respostas/mês',
        '1 Usuário de acesso',
        'Formulários ilimitados',
        'Criação assistida por IA',
        'Lógica condicional básica',
        'Integração com WhatsApp & Webhooks',
        'Dashboard de respostas',
        'Exportação em Excel / CSV',
      ],
    },
    {
      id: 'plus',
      name: 'Plus',
      tagline: 'O plano mais escolhido por marcas e e-commerces em crescimento.',
      priceMonthly: 197,
      priceYearly: 157,
      highlight: true,
      badge: 'Mais Popular',
      cta: 'Escolher Plano Plus',
      ctaColor: '#00DF81',
      features: [
        'Até 2.500 respostas/mês',
        '3 Usuários de acesso',
        'Tudo do plano Basic',
        'Remover branding "Powered by Infinity"',
        'Subdomínio personalizado (forms.suamarca.com.br)',
        'Redirecionamento automático para WhatsApp',
        'Diagnóstico formatado pré-preenchido',
        'Rastreamento completo de UTMs (Facebook/Google Ads)',
      ],
    },
    {
      id: 'business',
      name: 'Business',
      tagline: 'Análise profunda e automação para operações com alto volume de tráfego.',
      priceMonthly: 397,
      priceYearly: 317,
      highlight: false,
      badge: null,
      cta: 'Escolher Business',
      ctaColor: '#fff',
      features: [
        'Até 10.000 respostas/mês',
        '5 Usuários de acesso',
        'Tudo do plano Plus',
        'Lead Score automático (0 a 100)',
        'Análise de Drop-off (onde os clientes abandonam)',
        'Sincronização em tempo real com CRM',
        'Webhooks avançados para automações (n8n/Zapier)',
        'Suporte prioritário via WhatsApp',
      ],
    },
    {
      id: 'growth',
      name: 'Growth Flow',
      tagline: 'Para operações e agências que precisam de automação completa com IA.',
      priceMonthly: 797,
      priceYearly: 597,
      highlight: false,
      badge: 'Teste 7 Dias Grátis',
      cta: 'Testar Grátis 7 Dias',
      ctaColor: '#00AAFF',
      features: [
        'Respostas ILIMITADAS',
        'Usuários ilimitados',
        'Tudo do plano Business',
        'Automação com Agente SDR IA no WhatsApp',
        'Multi-marcas (gestão de múltiplos clientes)',
        'Setup assistido por engenheiro da Infinity',
        'Treinamento de equipe para conversão',
        'SLA garantido e canal VIP dedicado',
      ],
    },
  ];

  const handleSelectPlan = (planName: string) => {
    const period = isYearly ? 'Anual (com desconto de 25%)' : 'Mensal';
    const msg = `Olá! Gostaria de contratar o plano *${planName}* (${period}) do Infinity Forms. Como podemos iniciar o setup?`;
    window.open(`https://wa.me/5581981280719?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const calculateLeadScore = () => {
    let score = 50;
    if (demoRevenue === 'Acima de R$ 100k/mês') score += 35;
    else if (demoRevenue === 'R$ 20k a R$ 100k/mês') score += 25;
    else score += 10;

    if (demoGoal) score += 15;
    return Math.min(score, 100);
  };

  return (
    <div style={{ backgroundColor: '#070B18', color: '#fff', minHeight: '100vh', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <Header />

      {/* ========================================================================= */}
      {/* HERO SECTION                                                             */}
      {/* ========================================================================= */}
      <section style={{
        padding: '110px 24px 70px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {/* Glow de fundo */}
        <div style={{
          position: 'absolute',
          top: '-160px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '480px',
          background: 'radial-gradient(circle, rgba(0, 223, 129, 0.16) 0%, rgba(0, 170, 255, 0.08) 50%, transparent 75%)',
          pointerEvents: 'none',
          filter: 'blur(60px)'
        }} />

        <div style={{ maxWidth: '980px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Badge superior */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '999px',
            backgroundColor: 'rgba(0, 223, 129, 0.1)',
            border: '1px solid rgba(0, 223, 129, 0.35)',
            color: '#00DF81',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '28px',
            boxShadow: '0 0 20px rgba(0, 223, 129, 0.2)'
          }}>
            <Sparkles size={14} /> Infinity Forms • Conversational Experience Engine
          </div>

          {/* Headline Principal */}
          <h1 style={{
            fontSize: 'clamp(34px, 5.5vw, 62px)',
            fontWeight: 800,
            letterSpacing: '-1.8px',
            lineHeight: 1.1,
            marginBottom: '24px'
          }}>
            Não parece formulário.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00DF81 0%, #00AAFF 60%, #38BDF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              Parece uma conversa que converte até 3.5x mais.
            </span>
          </h1>

          {/* Subtítulo */}
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: 1.6,
            maxWidth: '780px',
            margin: '0 auto 40px'
          }}>
            Substitua formulários estáticos e monótonos por funis interativos fluidos no estilo Typeform.
            Qualifique leads em tempo real, atribua <strong>Lead Score automático</strong> e entregue o cliente
            pronto para fechar direto no <strong>WhatsApp do seu time comercial</strong>.
          </p>

          {/* Botões de Ação Hero */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '60px'
          }}>
            <a
              href="#precos"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 36px',
                borderRadius: '14px',
                backgroundColor: '#00DF81',
                color: '#070B18',
                fontWeight: 800,
                fontSize: '15px',
                textDecoration: 'none',
                boxShadow: '0 10px 30px rgba(0, 223, 129, 0.35)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.backgroundColor = '#00F58D';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.backgroundColor = '#00DF81';
              }}
            >
              <span>Ver Planos & Contratar</span>
              <ArrowRight size={18} />
            </a>

            <a
              href="#demo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 30px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '15px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <Zap size={18} color="#00DF81" />
              <span>Experimentar Demonstração</span>
            </a>
          </div>

          {/* Destaques de Prova Social & Métricas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            padding: '24px',
            borderRadius: '18px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#00DF81', letterSpacing: '-1px' }}>+350%</div>
              <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px' }}>Mais respostas concluídas</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#00AAFF', letterSpacing: '-1px' }}>82%</div>
              <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px' }}>Taxa média de retenção</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#38BDF8', letterSpacing: '-1px' }}>&lt; 2 seg</div>
              <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px' }}>Transbordo direto no WhatsApp</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#F59E0B', letterSpacing: '-1px' }}>100%</div>
              <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px' }}>White-label & Domínio próprio</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SIMULADOR INTERATIVO AO VIVO (#demo)                                     */}
      {/* ========================================================================= */}
      <section id="demo" style={{
        padding: '90px 24px',
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: '999px',
            backgroundColor: 'rgba(0, 170, 255, 0.1)',
            border: '1px solid rgba(0, 170, 255, 0.3)',
            color: '#00AAFF',
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            <Zap size={14} /> Simulador Interativo
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '14px' }}>
            Sinta na prática a fluidez de 1 pergunta por tela
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '16px', maxWidth: '640px', margin: '0 auto' }}>
            Clique em uma das opções abaixo e veja como a navegação sem atrito encanta o lead e já calcula o Lead Score:
          </p>
        </div>

        {/* Mockup Frame do Formulário Interativo */}
        <div style={{
          backgroundColor: '#0B1120',
          border: '1px solid rgba(0, 223, 129, 0.3)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 223, 129, 0.1)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Barra de Topo do Navegador Mockup */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            padding: '14px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10B981' }} />
            </div>

            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              padding: '4px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'monospace'
            }}>
              <Globe2 size={12} color="#00DF81" />
              <span>forms.suaempresa.com.br/diagnostico-vip</span>
            </div>

            <div style={{ fontSize: '12px', color: '#00DF81', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Lead Score:</span>
              <strong style={{ fontSize: '14px', backgroundColor: 'rgba(0, 223, 129, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                {calculateLeadScore()} pts
              </strong>
            </div>
          </div>

          {/* Barra de Progresso Superior */}
          <div style={{ height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.05)', width: '100%' }}>
            <div style={{
              height: '100%',
              backgroundColor: '#00DF81',
              width: `${(demoStep / 3) * 100}%`,
              transition: 'width 0.35s ease',
              boxShadow: '0 0 10px #00DF81'
            }} />
          </div>

          {/* Conteúdo Dinâmico do Simulador */}
          <div style={{ padding: '48px 32px', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {demoStep === 1 && (
              <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
                <div style={{ fontSize: '13px', color: '#00DF81', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>
                  Etapa 01 de 03 • Perfil
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '20px', lineHeight: 1.3 }}>
                  Qual é o modelo de negócio da sua empresa hoje?
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {[
                    { label: 'E-commerce ou Loja Virtual (D2C / B2C)', icon: '🛍️', key: 'A' },
                    { label: 'Prestação de Serviços ou Agência B2B', icon: '💼', key: 'B' },
                    { label: 'Clínica, Saúde ou Estética', icon: '🩺', key: 'C' },
                    { label: 'Indústria, Distribuidora ou Atacado', icon: '🏭', key: 'D' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDemoNiche(item.label);
                        setDemoStep(2);
                      }}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '12px',
                        backgroundColor: demoNiche === item.label ? 'rgba(0, 223, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        border: demoNiche === item.label ? '1px solid #00DF81' : '1px solid rgba(255, 255, 255, 0.09)',
                        color: '#fff',
                        textAlign: 'left',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.18s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#00DF81';
                        e.currentTarget.style.backgroundColor = 'rgba(0, 223, 129, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        if (demoNiche !== item.label) {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '20px' }}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.6)'
                      }}>
                        Tecla {item.key}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {demoStep === 2 && (
              <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
                <div style={{ fontSize: '13px', color: '#00AAFF', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>
                  Etapa 02 de 03 • Qualificação de Faturamento
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '20px', lineHeight: 1.3 }}>
                  Qual é a faixa média de faturamento mensal atual?
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {[
                    { label: 'Iniciando (Até R$ 20.000 /mês)', key: 'A', high: false },
                    { label: 'R$ 20k a R$ 100k /mês (Operação Validada)', key: 'B', high: false },
                    { label: 'Acima de R$ 100k /mês (Escala Acelerada 🔥)', key: 'C', high: true },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDemoRevenue(item.label);
                        setDemoStep(3);
                      }}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '12px',
                        backgroundColor: demoRevenue === item.label ? 'rgba(0, 170, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        border: demoRevenue === item.label ? '1px solid #00AAFF' : '1px solid rgba(255, 255, 255, 0.09)',
                        color: '#fff',
                        textAlign: 'left',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.18s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#00AAFF';
                        e.currentTarget.style.backgroundColor = 'rgba(0, 170, 255, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        if (demoRevenue !== item.label) {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                        }
                      }}
                    >
                      <span>{item.label}</span>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.6)'
                      }}>
                        Tecla {item.key}
                      </span>
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: '20px' }}>
                  <button
                    onClick={() => setDemoStep(1)}
                    style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer', fontSize: '13px' }}
                  >
                    ← Voltar pergunta anterior
                  </button>
                </div>
              </div>
            )}

            {demoStep === 3 && (
              <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 223, 129, 0.15)',
                  border: '2px solid #00DF81',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: '#00DF81'
                }}>
                  <Check size={32} />
                </div>
                <h3 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
                  Lead Super Qualificado! 🔥
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '15px', marginBottom: '24px' }}>
                  Em <strong>menos de 2 segundos</strong>, o Infinity Forms processa as respostas, calcula a pontuação e entrega a mensagem formatada:
                </p>

                {/* Card WhatsApp Preview */}
                <div style={{
                  backgroundColor: '#075E54',
                  borderRadius: '16px',
                  padding: '18px 22px',
                  textAlign: 'left',
                  color: '#fff',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  marginBottom: '24px',
                  boxShadow: '0 10px 25px rgba(7, 94, 84, 0.3)'
                }}>
                  <div style={{ fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.2)', paddingBottom: '6px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>📥 Novo Lead Qualificado (Lead Score: {calculateLeadScore()}/100)</span>
                    <span style={{ fontSize: '11px', opacity: 0.8 }}>Agora mesmo</span>
                  </div>
                  <div>• <strong>Nicho:</strong> {demoNiche || 'E-commerce de Moda'}</div>
                  <div>• <strong>Faturamento:</strong> {demoRevenue || 'Acima de R$ 100k/mês'}</div>
                  <div>• <strong>Origem:</strong> Facebook Ads (Campanha Escala 2026)</div>
                  <div style={{ marginTop: '8px', color: '#A7F3D0', fontStyle: 'italic' }}>
                    &ldquo;O cliente já chega no WhatsApp sabendo exatamente o que precisa, poupando 90% do tempo de triagem do seu vendedor.&rdquo;
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      setDemoStep(1);
                      setDemoNiche('');
                      setDemoRevenue('');
                    }}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Reiniciar Teste
                  </button>
                  <a
                    href="#precos"
                    style={{
                      padding: '10px 24px',
                      borderRadius: '10px',
                      backgroundColor: '#00DF81',
                      border: 'none',
                      color: '#070B18',
                      fontSize: '13px',
                      fontWeight: 800,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>Quero esse formulário no meu site</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* COMPARATIVO: FORMULÁRIO ANTIGO VS. INFINITY FORMS                       */}
      {/* ========================================================================= */}
      <section style={{
        padding: '90px 24px',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '14px' }}>
              Por que formulários estáticos tradicionais estão matando suas vendas?
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '16px', maxWidth: '700px', margin: '0 auto' }}>
              Veja a diferença brutal entre a experiência que cansa o visitante e o funil conversacional que encanta e fecha negócios.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {/* Formulário Antigo / Google Forms */}
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.03)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '20px',
              padding: '36px 30px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#EF4444' }}>
                <X size={24} />
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Formulários Tradicionais & Estáticos</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800 }}>✕</span>
                  <span><strong>75% de abandono:</strong> O usuário abre a página, vê 15 campos de uma vez e desiste imediatamente.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800 }}>✕</span>
                  <span><strong>Zero inteligência:</strong> Faz as mesmas perguntas para quem fatura R$ 1.000 ou R$ 1 milhão.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800 }}>✕</span>
                  <span><strong>Dados frios em planilhas:</strong> Os leads chegam no e-mail ou Excel e ninguém atende a tempo.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800 }}>✕</span>
                  <span><strong>Perda de UTMs:</strong> Você gasta milhares em anúncios e não sabe qual anúncio gerou o cliente.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800 }}>✕</span>
                  <span><strong>Visual amador:</strong> Parece trabalho escolar do Google Forms ou plugin genérico do WordPress.</span>
                </li>
              </ul>
            </div>

            {/* Infinity Forms */}
            <div style={{
              backgroundColor: 'rgba(0, 223, 129, 0.04)',
              border: '2px solid rgba(0, 223, 129, 0.5)',
              borderRadius: '20px',
              padding: '36px 30px',
              boxShadow: '0 10px 40px rgba(0, 223, 129, 0.12)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#00DF81' }}>
                <Check size={24} />
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Infinity Forms Conversacional</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#00DF81', fontWeight: 800 }}>✓</span>
                  <span><strong>1 Pergunta por tela:</strong> Foco total, sem sobrecarga cognitiva. O lead responde por prazer e desliza.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#00DF81', fontWeight: 800 }}>✓</span>
                  <span><strong>Lógica Condicional (Branching):</strong> Perguntas dinâmicas que se adaptam exatamente às respostas dadas.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#00DF81', fontWeight: 800 }}>✓</span>
                  <span><strong>Transbordo imediato no WhatsApp:</strong> O lead clica em enviar e a conversa abre com diagnóstico completo.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#00DF81', fontWeight: 800 }}>✓</span>
                  <span><strong>Lead Score Inteligente (0 a 100):</strong> Seu time comercial só liga primeiro para quem tem o maior potencial.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#00DF81', fontWeight: 800 }}>✓</span>
                  <span><strong>100% Sua Marca:</strong> Subdomínio próprio (forms.suaempresa.com.br), paleta, logos e sem selos de terceiros.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6 PILARES E RECURSOS TÉCNICOS                                            */}
      {/* ========================================================================= */}
      <section style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: '999px',
            backgroundColor: 'rgba(0, 223, 129, 0.1)',
            border: '1px solid rgba(0, 223, 129, 0.3)',
            color: '#00DF81',
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            <Layers size={14} /> Recursos Exclusivos
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '14px' }}>
            A engenharia completa para capturar e converter
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '16px', maxWidth: '640px', margin: '0 auto' }}>
            Construído para quem roda tráfego pago, operações comerciais de alto valor e precisa de leads prontos para comprar.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {[
            {
              icon: <Smartphone size={24} color="#00DF81" />,
              title: 'Experiência Typeform Fluida',
              desc: 'Uma pergunta por tela, navegação instantânea por toque ou teclado (A, B, C, Enter). Otimizado até o último pixel para mobile.'
            },
            {
              icon: <MessageCircle size={24} color="#22C55E" />,
              title: 'Handoff Direto para o WhatsApp',
              desc: 'Ao finalizar, o formulário gera a mensagem personalizada e abre a conversa do vendedor com todas as dores e dados já organizados.'
            },
            {
              icon: <Target size={24} color="#00AAFF" />,
              title: 'Cálculo de Lead Score Automático',
              desc: 'Pontuação de 0 a 100 baseada em faturamento, momento de compra e urgência. Separe leads qualificados de curiosos.'
            },
            {
              icon: <GitBranch size={24} color="#A855F7" />,
              title: 'Lógica e Ramificação Inteligente',
              desc: 'Crie caminhos dinâmicos: se o cliente escolher um nicho específico, as perguntas seguintes mudam automaticamente em tempo real.'
            },
            {
              icon: <BarChart3 size={24} color="#F59E0B" />,
              title: 'Análise de Drop-off & Conversão',
              desc: 'Descubra exatamente em qual etapa seus visitantes estão abandonando para ajustar a pergunta e aumentar seu lucro.'
            },
            {
              icon: <Bot size={24} color="#EC4899" />,
              title: 'Rastreamento Total de UTMs',
              desc: 'Capture utm_source, medium, campaign e content invisivelmente no navegador. Integração perfeita com n8n, Zapier e CRMs.'
            },
          ].map((feat, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                padding: '30px',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 223, 129, 0.4)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                {feat.icon}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '10px', color: '#fff' }}>
                {feat.title}
              </h3>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6, margin: 0 }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CASOS DE USO (QUEM USA INFINITY FORMS)                                    */}
      {/* ========================================================================= */}
      <section style={{
        padding: '90px 24px',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>
              Projetado para os nichos que mais vendem no Brasil
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '16px' }}>
              Veja como negócios de alta performance usam nossos formulários interativos:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {[
              {
                title: 'E-commerce & Moda',
                badge: 'Quiz de Estilo',
                desc: 'Recomende produtos e looks ideais com base nas medidas e preferências do cliente, gerando vendas no ato.',
                stat: '+42% no Ticket Médio'
              },
              {
                title: 'Agências & Consultores',
                badge: 'Diagnóstico Comercial',
                desc: 'Filtre clientes pelo orçamento mensal e maturidade antes de perder tempo agendando reuniões com curiosos.',
                stat: '90% menos reuniões desqualificadas'
              },
              {
                title: 'Clínicas & Estética',
                badge: 'Triagem & Orçamento',
                desc: 'Avalie queixas e histórico do paciente para gerar um orçamento personalizado direto no WhatsApp do consultório.',
                stat: '3x mais agendamentos de consulta'
              },
              {
                title: 'Imobiliárias & B2B',
                badge: 'Filtro de Investimento',
                desc: 'Identifique faixa de preço, bairro desejado e forma de pagamento para entregar o corretor certo na hora certa.',
                stat: 'Ciclo de fechamento 50% mais rápido'
              },
            ].map((useCase, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#00DF81',
                    textTransform: 'uppercase',
                    backgroundColor: 'rgba(0, 223, 129, 0.1)',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    display: 'inline-block',
                    marginBottom: '12px'
                  }}>
                    {useCase.badge}
                  </span>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '10px', color: '#fff' }}>
                    {useCase.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6, marginBottom: '20px' }}>
                    {useCase.desc}
                  </p>
                </div>
                <div style={{
                  paddingTop: '14px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#00AAFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>⚡ {useCase.stat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TABELA DE PREÇOS EXATA (MANTIDA 100% FIEL CONFORME SOLICITADO PELO USUÁRIO)*/}
      {/* ========================================================================= */}
      <section id="precos" style={{ maxWidth: '1350px', margin: '0 auto', padding: '100px 20px 80px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            backgroundColor: 'rgba(0, 223, 129, 0.1)',
            border: '1px solid rgba(0, 223, 129, 0.3)',
            color: '#00DF81',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '20px'
          }}>
            <Sparkles size={14} /> Infinity Forms • Plataforma SaaS
          </div>

          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            lineHeight: 1.15,
            marginBottom: '18px'
          }}>
            Planos & Preços para <span style={{ background: 'linear-gradient(135deg, #00DF81 0%, #00AAFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Multiplicar suas Conversões</span>
          </h2>

          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto 36px' }}>
            Substitua formulários monótonos por experiências interativas estilo Typeform que encantam o usuário, calculam o Lead Score e entregam o cliente pronto no WhatsApp.
          </p>

          {/* Toggle Mensal / Anual */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '6px 8px',
            borderRadius: '999px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <button
              onClick={() => setIsYearly(false)}
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: !isYearly ? '#00DF81' : 'transparent',
                color: !isYearly ? '#070B18' : 'rgba(255,255,255,0.7)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Faturamento Mensal
            </button>
            <button
              onClick={() => setIsYearly(true)}
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: isYearly ? '#00DF81' : 'transparent',
                color: isYearly ? '#070B18' : 'rgba(255,255,255,0.7)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Faturamento Anual</span>
              <span style={{
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: isYearly ? '#070B18' : 'rgba(0,223,129,0.2)',
                color: '#00DF81',
                fontWeight: 800
              }}>
                Economize 25%
              </span>
            </button>
          </div>
        </div>

        {/* Grid de Preços (4 Cards Fiéis) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          {plans.map((p) => {
            const price = isYearly ? p.priceYearly : p.priceMonthly;
            return (
              <div
                key={p.id}
                style={{
                  backgroundColor: p.highlight ? 'rgba(0, 223, 129, 0.04)' : 'rgba(15, 23, 42, 0.65)',
                  border: p.highlight ? '2px solid rgba(0, 223, 129, 0.6)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '24px',
                  padding: '36px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: p.highlight ? '0 12px 40px rgba(0, 223, 129, 0.15)' : 'none',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  if (!p.highlight) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  if (!p.highlight) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                {/* Badge Superior */}
                {p.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '4px 14px',
                      borderRadius: '999px',
                      backgroundColor: p.highlight ? '#00DF81' : '#00AAFF',
                      color: '#070B18',
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {p.badge}
                  </div>
                )}

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>{p.name}</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, minHeight: '40px' }}>
                    {p.tagline}
                  </p>
                </div>

                {/* Preço */}
                <div style={{ marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>R$</span>
                    <span style={{ fontSize: '44px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>{price}</span>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>/mês</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#00DF81', marginTop: '4px', fontWeight: 600 }}>
                    {isYearly ? `Faturado anualmente (R$ ${price * 12}/ano)` : 'Cobrança mensal flexível'}
                  </div>
                </div>

                {/* Botão de Ação */}
                <button
                  onClick={() => handleSelectPlan(p.name)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: p.highlight ? '#00DF81' : 'rgba(255,255,255,0.08)',
                    color: p.highlight ? '#070B18' : '#fff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '32px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!p.highlight) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                    else e.currentTarget.style.backgroundColor = '#00F58D';
                  }}
                  onMouseLeave={(e) => {
                    if (!p.highlight) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                    else e.currentTarget.style.backgroundColor = '#00DF81';
                  }}
                >
                  <span>{p.cta}</span>
                  <ArrowRight size={16} />
                </button>

                {/* Features List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, color: 'rgba(255,255,255,0.4)' }}>
                    Recursos Inclusos:
                  </span>
                  {p.features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
                      <Check size={16} color="#00DF81" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FAQ (PERGUNTAS FREQUENTES)                                               */}
      {/* ========================================================================= */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: '999px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            <HelpCircle size={14} /> Dúvidas Comuns
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>
            Perguntas Frequentes
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
            Tudo o que você precisa saber sobre o funcionamento e contratação do Infinity Forms
          </p>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {[
            {
              q: 'Posso usar meu próprio domínio e subdomínio no formulário?',
              a: 'Sim! A partir do plano Plus, você pode apontar qualquer subdomínio próprio (como forms.suamarca.com.br) diretamente para seu funil, com certificado SSL gratuito automático e sem menções à Infinity.'
            },
            {
              q: 'Como funciona exatamente o transbordo para o WhatsApp?',
              a: 'Quando o lead clica na última etapa, o Infinity Forms gera uma mensagem executiva formatada (com resumo das respostas e o Lead Score calculado). A tela abre diretamente o aplicativo do WhatsApp do lead ou notifica seu SDR com 1 clique para iniciar a abordagem.'
            },
            {
              q: 'Posso integrar com o meu CRM ou ferramentas de automação?',
              a: 'Sim. Enviamos Webhooks instantâneos em JSON para n8n, Zapier, Make, Infinity CRM, HubSpot, RD Station ou qualquer endpoint de API próprio que sua equipe utilize.'
            },
            {
              q: 'Qual a diferença entre o Infinity Forms e o Typeform comum?',
              a: 'O Typeform é uma ferramenta internacional com cobrança em dólar e sem foco na realidade do mercado brasileiro (onde o fechamento real acontece no WhatsApp). O Infinity Forms foi concebido para o Brasil: cobra em reais, entrega o lead formatado no WhatsApp, calcula Lead Score para seu SDR e permite suporte técnico direto por WhatsApp.'
            },
            {
              q: 'Existe fidelidade ou carência contratual?',
              a: 'Não. No faturamento mensal você tem total flexibilidade para cancelar a qualquer momento sem nenhuma multa ou taxa surpresa. No faturamento anual você garante 25% de desconto fixo.'
            },
            {
              q: 'Como inicio a contratação?',
              a: 'Basta clicar no botão do plano desejado acima. Você será conectado instantaneamente ao WhatsApp oficial da nossa equipe técnica para liberar seus acessos em menos de 10 minutos.'
            }
          ].map((faq, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '16px',
                padding: '24px 28px'
              }}
            >
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#00DF81' }}>Q.</span> {faq.q}
              </h4>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.65, margin: 0 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BANNER FINAL DE FECHAMENTO                                               */}
      {/* ========================================================================= */}
      <section style={{
        padding: '80px 24px 100px',
        maxWidth: '1100px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: 'linear-gradient(135deg, rgba(0, 223, 129, 0.1) 0%, rgba(0, 170, 255, 0.05) 100%)',
          border: '1px solid rgba(0, 223, 129, 0.35)',
          borderRadius: '24px',
          padding: '60px 32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>
            Pronto para multiplicar a conversão do seu tráfego?
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '17px', maxWidth: '600px', margin: '0 auto 36px', lineHeight: 1.6 }}>
            Pare de jogar dinheiro de anúncios fora com páginas e formulários antigos. Coloque a experiência conversacional da Infinity no ar ainda hoje.
          </p>
          <a
            href="https://wa.me/5581981280719?text=Ol%C3%A1!%20Gostaria%20de%20ativar%20o%20Infinity%20Forms%20para%20minha%20empresa."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 36px',
              borderRadius: '14px',
              backgroundColor: '#00DF81',
              color: '#070B18',
              fontWeight: 800,
              fontSize: '15px',
              textDecoration: 'none',
              boxShadow: '0 10px 30px rgba(0, 223, 129, 0.35)'
            }}
          >
            <MessageCircle size={18} />
            <span>Falar com Especialista & Iniciar Setup</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
