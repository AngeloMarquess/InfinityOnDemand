'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Check, Sparkles, MessageCircle, ArrowRight, HelpCircle, Shield, Zap } from 'lucide-react';

export default function FormsPricingPage() {
  const [isYearly, setIsYearly] = useState(false);

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
    const period = isYearly ? 'Anual (com desconto)' : 'Mensal';
    const msg = `Olá! Gostaria de contratar o plano *${planName}* (${period}) do Infinity Forms. Como posso iniciar?`;
    window.open(`https://wa.me/5581981280719?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary, #070B18)', color: '#fff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <Header />

      {/* Hero Section */}
      <section style={{ padding: '80px 20px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '350px', background: 'radial-gradient(circle, rgba(0,223,129,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '840px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', backgroundColor: 'rgba(0,223,129,0.1)', border: '1px solid rgba(0,223,129,0.3)', color: '#00DF81', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '20px' }}>
            <Sparkles size={14} /> Infinity Forms • Plataforma SaaS
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.15, marginBottom: '20px' }}>
            Planos & Preços para <span style={{ background: 'linear-gradient(135deg, #00DF81 0%, #00AAFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Multiplicar suas Conversões</span>
          </h1>

          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto 36px' }}>
            Substitua formulários monótonos por experiências interativas estilo Typeform que encantam o usuário, calculam o Lead Score e entregam o cliente pronto no WhatsApp.
          </p>

          {/* Toggle Mensal / Anual */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '6px 8px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
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
              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '999px', backgroundColor: isYearly ? '#070B18' : 'rgba(0,223,129,0.2)', color: isYearly ? '#00DF81' : '#00DF81', fontWeight: 800 }}>
                Economize 25%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Grid de Preços */}
      <section style={{ maxWidth: '1300px', margin: '0 auto', padding: '20px 20px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
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
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  if (!p.highlight) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={e => {
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
                  onMouseEnter={e => {
                    if (!p.highlight) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                    else e.currentTarget.style.backgroundColor = '#00F58D';
                  }}
                  onMouseLeave={e => {
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

      {/* Dúvidas Frequentes FAQ */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>Perguntas Frequentes</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>Tire suas dúvidas sobre o Infinity Forms</p>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {[
            {
              q: 'Posso usar meu próprio domínio no formulário?',
              a: 'Sim! A partir do plano Plus, você pode apontar subdomínios próprios como forms.suamarca.com.br diretamente para seu funil de qualificação.'
            },
            {
              q: 'Como funciona a integração com o WhatsApp?',
              a: 'O formulário coleta as respostas do lead, calcula o Lead Score e gera uma mensagem de abertura formatada no WhatsApp da sua equipe ou do próprio cliente para iniciar o fechamento.'
            },
            {
              q: 'Posso integrar com meu CRM ou ferramentas de automação?',
              a: 'Sim. Enviamos webhooks em tempo real para o Infinity CRM, HubSpot, n8n, Zapier ou qualquer webhook HTTP personalizado.'
            },
            {
              q: 'Existe contrato de fidelidade?',
              a: 'Não. No plano mensal você pode cancelar a qualquer momento sem nenhuma taxa ou multa.'
            }
          ].map((faq, i) => (
            <div key={i} style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '22px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>{faq.q}</h4>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
