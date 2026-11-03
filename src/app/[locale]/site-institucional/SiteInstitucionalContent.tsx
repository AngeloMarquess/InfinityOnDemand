'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Search, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Laptop, 
  Globe, 
  Gauge, 
  MousePointerClick, 
  FileCheck, 
  Rocket, 
  MessageSquare,
  HelpCircle,
  Code2,
  Check
} from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SiteInstitucionalContent({ dict, locale }: { dict?: any; locale?: string }) {
  const currentLocale = locale || 'pt';
  const es = currentLocale === 'es';
  const prefix = currentLocale === 'pt' ? '' : `/${currentLocale}`;

  // State para o Formulário Rápido de Orçamento
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [tipoSite, setTipoSite] = useState('institucional-completo');
  const [detalhes, setDetalhes] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // State para Calculadora / Simulador Interativo
  const [calcTipo, setCalcTipo] = useState('institucional');
  const [calcPages, setCalcPages] = useState('5-10');
  const [calcFeatures, setCalcFeatures] = useState<string[]>(['whatsapp', 'seo']);

  const toggleFeature = (feat: string) => {
    if (calcFeatures.includes(feat)) {
      setCalcFeatures(calcFeatures.filter(f => f !== feat));
    } else {
      setCalcFeatures([...calcFeatures, feat]);
    }
  };

  const handleWhatsappMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length > 9) v = `${v.slice(0, 10)}-${v.slice(10)}`;
    setWhatsapp(v);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !whatsapp) return;
    setLoading(true);

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          whatsapp,
          origin: 'site-institucional',
          message: `Empresa: ${empresa || 'Não informado'} | Tipo de Site: ${tipoSite} | Detalhes: ${detalhes}`,
        }),
      });
    } catch {
      // Ignora erro para não travar o redirecionamento ao WhatsApp
    }

    const msg = `🚀 *Novo Pedido de Site Institucional*\n\n` +
      `👤 *Nome:* ${nome}\n` +
      `🏢 *Empresa:* ${empresa || 'Não informada'}\n` +
      `📱 *WhatsApp:* ${whatsapp}\n` +
      `💻 *Tipo de Projeto:* ${tipoSite}\n` +
      (detalhes ? `📝 *Observações:* ${detalhes}\n` : '');

    const waLink = `https://wa.me/5581981280719?text=${encodeURIComponent(msg)}`;
    setLoading(false);
    setEnviado(true);
    window.open(waLink, '_blank');
  };

  const generateSimulatorLink = () => {
    const msg = `Olá! Simulei meu site no site da Infinity:\n- Tipo: ${calcTipo}\n- Páginas: ${calcPages}\n- Recursos: ${calcFeatures.join(', ')}\nGostaria de receber uma proposta comercial detalhada!`;
    return `https://wa.me/5581981280719?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div style={{ backgroundColor: '#070B18', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <Header dict={dict} locale={locale} />

      {/* ========================================================
          HERO SECTION — HIGH PERFORMANCE & EXCLUSIVE DESIGN
          ======================================================== */}
      <section style={{
        position: 'relative',
        padding: '120px 24px 90px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 15% 20%, rgba(0, 223, 129, 0.14) 0%, transparent 60%), radial-gradient(circle at 85% 50%, rgba(0, 170, 255, 0.14) 0%, transparent 60%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        {/* Subtle grid background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.5,
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '56px', alignItems: 'center' }}>
            
            {/* Left Content */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '999px',
                backgroundColor: 'rgba(0, 223, 129, 0.12)',
                border: '1px solid rgba(0, 223, 129, 0.3)',
                color: '#00DF81',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                marginBottom: '24px'
              }}>
                <Sparkles size={16} /> {es ? 'DESARROLLO DE SITIOS INSTITUCIONALES' : 'DESENVOLVIMENTO DE SITES INSTITUCIONAIS'}
              </div>

              <h1 style={{
                fontSize: 'clamp(36px, 5.5vw, 62px)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-2px',
                marginBottom: '24px',
                color: '#ffffff'
              }}>
                {es ? 'Sitios web que' : 'Sites que posicionam sua'}{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #00DF81 0%, #00AAFF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {es ? 'posicionan tu marca' : 'marca no topo'}
                </span>{' '}
                {es ? 'y convierten visitantes en clientes.' : 'e convertem visitantes em clientes.'}
              </h1>

              <p style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.75)',
                lineHeight: 1.7,
                maxWidth: '580px',
                marginBottom: '36px'
              }}>
                {es 
                  ? 'Desarrollamos sitios web institucionales ultrarrápidos, visualmente impactantes y optimizados para Google e Inteligencia Artificial (AEO). Sin plantillas genéricas: arquitectura moderna en Next.js, diseño exclusivo en Figma y foco total en generar autoridad.'
                  : 'Criamos sites institucionais ultra-rápidos, visualmente impactantes e preparados para o Google e para Inteligências Artificiais (AEO). Sem templates genéricos no WordPress: tecnologia Next.js, design exclusivo no Figma e foco total em gerar autoridade e negócios para sua empresa.'}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
                <a
                  href="#orcamento"
                  style={{
                    backgroundColor: '#00DF81',
                    color: '#070B18',
                    fontWeight: 800,
                    fontSize: '16px',
                    padding: '16px 36px',
                    borderRadius: '14px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 8px 24px rgba(0, 223, 129, 0.35)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#00F58D';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#00DF81';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {es ? 'Solicitar Presupuesto' : 'Solicitar Orçamento Gratuito'} <ArrowRight size={18} />
                </a>

                <a
                  href="#diferenciais"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '16px',
                    padding: '16px 28px',
                    borderRadius: '14px',
                    textDecoration: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                >
                  {es ? 'Ver Diferenciales' : 'Conhecer Diferenciais'}
                </a>
              </div>

              {/* Metrics Pill Strip */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <span style={{ color: '#00DF81', fontWeight: 800 }}>⚡ 95+</span> Core Web Vitals
                </div>
                <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <span style={{ color: '#00AAFF', fontWeight: 800 }}>🚀 &lt; 0.8s</span> Carregamento
                </div>
                <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <span style={{ color: '#F59E0B', fontWeight: 800 }}>📱 100%</span> Responsivo & Fluido
                </div>
              </div>

            </div>

            {/* Right Preview Card */}
            <div style={{ position: 'relative' }}>
              <div style={{
                backgroundColor: '#0F172A',
                borderRadius: '24px',
                border: '1px solid rgba(0, 223, 129, 0.3)',
                padding: '16px',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 50px rgba(0, 223, 129, 0.15)'
              }}>
                {/* Browser Mockup Top Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#27c93f' }} />
                  <div style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '4px 12px',
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginLeft: '12px'
                  }}>
                    <Lock size={10} color="#00DF81" />
                    https://suaempresa.com.br
                  </div>
                </div>

                {/* Visual Mockup inside Window */}
                <div style={{
                  marginTop: '14px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '360px',
                  background: 'linear-gradient(180deg, #131E35 0%, #0B1120 100%)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #00DF81, #00AAFF)' }} />
                        <span style={{ fontWeight: 800, fontSize: '14px', color: '#fff' }}>Sua Marca Premium</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ width: '40px', height: '6px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                        <div style={{ width: '40px', height: '6px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                        <div style={{ width: '40px', height: '6px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                      </div>
                    </div>

                    <div style={{ width: '140px', height: '14px', borderRadius: '4px', background: 'rgba(0, 223, 129, 0.25)', marginBottom: '14px' }} />
                    <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: '12px' }}>
                      Autoridade Visual que Transforma seu Posicionamento
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, maxWidth: '380px' }}>
                      Design de ponta, animações fluidas a 60 FPS e formulários integrados que direcionam o visitante direto para o WhatsApp da sua equipe.
                    </p>
                  </div>

                  {/* Mockup Floating Metrics */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#00DF81', fontWeight: 700 }}>TAXA DE CONVERSÃO</div>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>+180% Méd.</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#00AAFF', fontWeight: 700 }}>GOOGLE PAGE SPEED</div>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>99 / 100 🟢</div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          COMPARAÇÃO: SITE AMADOR VS PADRÃO INFINITY
          ======================================================== */}
      <section style={{ padding: '90px 24px', backgroundColor: '#0B0F19', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#F59E0B', marginBottom: '12px' }}>
              POR QUE MODERNIZAR SEU SITE?
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '16px' }}>
              A diferença entre um site comum e o <span style={{ color: '#00DF81' }}>Padrão Infinity</span>
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255, 255, 255, 0.65)', maxWidth: '650px', margin: '0 auto' }}>
              Ter um site lento ou com cara de antigo custa caro: clientes chegam, desistem no carregamento e fecham com seu concorrente.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* Site Tradicional / WordPress Amador */}
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.04)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '24px',
              padding: '36px 32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '24px' }}>❌</span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#EF4444' }}>Site Comum / WordPress Lento</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'Carregamento demorado (3 a 7 segundos), fazendo 60%+ dos visitantes desistirem',
                  'Templates prontos genéricos que parecem iguais a centenas de outros concorrentes',
                  'Vulnerabilidade a invasões por plugins desatualizados e bugs constantes',
                  'Dificuldade de visualização no celular com botões quebrados e textos desalinhados',
                  'Zero integração com CRM ou funis de vendas: os visitantes não viram leads reais',
                  'Ignorado pelo Google e por novas IAs por falta de dados estruturados e SEO técnico'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.5 }}>
                    <span style={{ color: '#EF4444', fontWeight: 800 }}>✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Padrão Infinity OnDemand */}
            <div style={{
              backgroundColor: 'rgba(0, 223, 129, 0.05)',
              border: '1px solid rgba(0, 223, 129, 0.4)',
              borderRadius: '24px',
              padding: '36px 32px',
              boxShadow: '0 16px 40px rgba(0, 223, 129, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '24px' }}>💎</span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#00DF81' }}>Padrão Infinity OnDemand</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'Carregamento instantâneo (< 0.8s) em Edge Network global da Vercel',
                  'Design UI/UX 100% exclusivo no Figma, criado sob medida para o seu público',
                  'Código limpo em Next.js e TypeScript com segurança bancária nativa',
                  'Experiência perfeita em smartphones (Mobile First) com navegação agradável',
                  'Integração nativa com WhatsApp, formulários dinâmicos e Infinity CRM',
                  'Otimização avançada para Google (SEO) e motores de Inteligência Artificial (AEO)'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#fff', lineHeight: 1.5 }}>
                    <span style={{ color: '#00DF81', fontWeight: 800 }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          6 PILARES DE EXCELÊNCIA TÉCNICA
          ======================================================== */}
      <section id="diferenciais" style={{ padding: '100px 24px', maxWidth: '1240px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#00DF81', marginBottom: '12px' }}>
            NOSSA METODOLOGIA
          </div>
          <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 44px)', fontWeight: 900, letterSpacing: '-1px' }}>
            Os 6 pilares de um site de <span style={{ color: '#00AAFF' }}>alta performance</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {[
            {
              icon: <Layers size={28} color="#00DF81" />,
              color: '#00DF81',
              title: 'Design UI/UX Exclusivo & High-End',
              desc: 'Criamos do zero no Figma uma identidade visual sofisticada que reflete a autoridade real do seu negócio. Tipografia elegante, espaçamentos milimétricos e foco na jornada do cliente.'
            },
            {
              icon: <Zap size={28} color="#00AAFF" />,
              color: '#00AAFF',
              title: 'Velocidade Extrema (Core Web Vitals)',
              desc: 'Construído em Next.js 15 com renderização híbrida (SSG + SSR) e Edge Caching. Seu site abre sem travamentos, reduzindo o custo por clique dos seus anúncios no Google e Meta.'
            },
            {
              icon: <Search size={28} color="#F59E0B" />,
              color: '#F59E0B',
              title: 'SEO Técnico & Otimização para IAs (AEO)',
              desc: 'Estruturação completa com dados ricos Schema.org/JsonLd, sitemap dinâmico, canonical tags e semântica pura para rankear no topo do Google e ser recomendado pelo ChatGPT e Gemini.'
            },
            {
              icon: <Smartphone size={28} color="#A855F7" />,
              color: '#A855F7',
              title: 'Mobile-First & Microinterações',
              desc: 'Mais de 80% dos clientes acessam pelo celular. Garantimos menus intuitivos, botões confortáveis ao polegar e transições suaves que geram encantamento.'
            },
            {
              icon: <MousePointerClick size={28} color="#EC4899" />,
              color: '#EC4899',
              title: 'Funis de Conversão & WhatsApp Inteligente',
              desc: 'Transforme tráfego em faturamento. Botões de WhatsApp com mensagens pré-formatadas por serviço, formulários de qualificação e rastreamento de conversões com Meta Pixel e CAPI.'
            },
            {
              icon: <ShieldCheck size={28} color="#00DF81" />,
              color: '#00DF81',
              title: 'Segurança Máxima & LGPD Integrada',
              desc: 'Certificado SSL TLS 1.3 de ponta a ponta, proteção contra ataques de negação de serviço (DDoS), conformidade total com a Lei Geral de Proteção de Dados e política de privacidade.'
            }
          ].map((item, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '32px 28px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = `${item.color}55`;
                e.currentTarget.style.boxShadow = `0 16px 40px ${item.color}15`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: `${item.color}15`,
                border: `1px solid ${item.color}35`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================
          TIPOS DE SITES QUE CONSTRUÍMOS
          ======================================================== */}
      <section style={{ padding: '90px 24px', backgroundColor: '#0B0F19', borderTop: '1px solid rgba(255, 255, 255, 0.06)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '34px', fontWeight: 900 }}>Formatos para cada momento da sua empresa</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '16px', marginTop: '8px' }}>
              Do site corporativo completo a páginas de alta conversão para tráfego pago.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              {
                title: 'Site Institucional Corporativo',
                target: 'Empresas B2B, Indústrias, Consultorias, Clínicas & Holdings',
                items: ['Apresentação da empresa e história', 'Páginas detalhadas de serviços', 'Cases de sucesso e clientes', 'Blog / Notícias integrado', 'Formulários dinâmicos de contato']
              },
              {
                title: 'Landing Pages de Alta Conversão',
                target: 'Lançamentos, Infoprodutos e Campanhas de Meta/Google Ads',
                items: ['Copywriting 100% persuasivo', 'Carregamento instantâneo', 'Gatilhos mentais e provas sociais', 'Testes A/B nativos', 'Integração de CAPI e Pixel']
              },
              {
                title: 'Portal com Painel CMS / Blog',
                target: 'Empresas que produzem conteúdo e buscam autoridade orgânica',
                items: ['Painel administrativo simplificado', 'Publicação rápida de artigos e notícias', 'Estruturação SEO avançada', 'Categorias, tags e autores', 'Busca interna em tempo real']
              },
              {
                title: 'Catálogo Digital Interativo',
                target: 'Distribuidoras, Fabricantes e Lojas com Pedido no WhatsApp',
                items: ['Exibição moderna de produtos/linhas', 'Filtros rápidos por categoria', 'Botão "Pedir Orçamento no WhatsApp"', 'Sem comissões por venda', 'Galeria de fotos em alta definição']
              }
            ].map((card, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '30px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>{card.title}</h3>
                  <div style={{ fontSize: '12px', color: '#00DF81', fontWeight: 600, marginBottom: '20px' }}>{card.target}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {card.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
                        <span style={{ color: '#00AAFF', fontWeight: 800 }}>✓</span> {item}
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="#orcamento"
                  style={{
                    marginTop: '28px',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#00DF81';
                    e.currentTarget.style.color = '#070B18';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#fff';
                  }}
                >
                  Quero este formato →
                </a>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          SIMULADOR INTERATIVO DE PROJETO
          ======================================================== */}
      <section style={{ padding: '90px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: '#0F172A',
          border: '1px solid rgba(0, 223, 129, 0.3)',
          borderRadius: '28px',
          padding: '40px 36px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#00DF81', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
              SIMULADOR INTERATIVO
            </div>
            <h3 style={{ fontSize: '28px', fontWeight: 900 }}>Monte a configuração do seu site</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '15px' }}>
              Selecione o formato desejado e receba uma estimativa personalizada pelo WhatsApp.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Formato */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                1. Tipo de Página / Site:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {[
                  { id: 'institucional', label: 'Site Institucional Completo' },
                  { id: 'landing-page', label: 'Landing Page de Alta Conversão' },
                  { id: 'portal-blog', label: 'Portal com Blog & CMS' },
                  { id: 'catalogo', label: 'Catálogo de Produtos / Serviços' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCalcTipo(item.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 700,
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: calcTipo === item.id ? '1px solid #00DF81' : '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: calcTipo === item.id ? 'rgba(0, 223, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                      color: calcTipo === item.id ? '#00DF81' : 'rgba(255,255,255,0.7)'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Número de Páginas */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                2. Quantidade Estimada de Páginas:
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['One Page (Página Única)', '3 a 5 páginas', '5 a 10 páginas', '10+ páginas'].map((qtd) => (
                  <button
                    key={qtd}
                    type="button"
                    onClick={() => setCalcPages(qtd)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: calcPages === qtd ? '1px solid #00AAFF' : '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: calcPages === qtd ? 'rgba(0, 170, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                      color: calcPages === qtd ? '#00AAFF' : 'rgba(255,255,255,0.7)'
                    }}
                  >
                    {qtd}
                  </button>
                ))}
              </div>
            </div>

            {/* Recursos Opcionais */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                3. Recursos Especiais Desejados:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {[
                  { id: 'whatsapp', label: '💬 WhatsApp Inteligente & Rastreamento' },
                  { id: 'seo', label: '🔍 Otimização SEO Google & IA' },
                  { id: 'multilingue', label: '🌐 Multilíngue (Português & Espanhol/Inglês)' },
                  { id: 'crm', label: '📊 Integração com CRM & Formulário' },
                  { id: 'cms', label: '📝 Painel de Administração de Conteúdo' },
                  { id: 'copywriting', label: '✍️ Redação Persuasiva dos Textos' },
                ].map((feat) => {
                  const isChecked = calcFeatures.includes(feat.id);
                  return (
                    <button
                      key={feat.id}
                      type="button"
                      onClick={() => toggleFeature(feat.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textAlign: 'left',
                        cursor: 'pointer',
                        border: isChecked ? '1px solid #F59E0B' : '1px solid rgba(255,255,255,0.08)',
                        backgroundColor: isChecked ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255,255,255,0.02)',
                        color: isChecked ? '#F59E0B' : 'rgba(255,255,255,0.65)'
                      }}
                    >
                      {isChecked ? '✓ ' : '+ '} {feat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA do Simulador */}
            <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <a
                href={generateSimulatorLink()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#00DF81',
                  color: '#070B18',
                  fontWeight: 800,
                  fontSize: '15px',
                  padding: '16px 36px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(0, 223, 129, 0.35)'
                }}
              >
                Enviar Simulação para o Consultor no WhatsApp 🚀
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          FORMULÁRIO DE ORÇAMENTO / CONTATO DIRETO
          ======================================================== */}
      <section id="orcamento" style={{ padding: '90px 24px', backgroundColor: '#0B0F19', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#00DF81', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
              FALE COM UM ESPECIALISTA
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 900 }}>Solicite um Diagnóstico do seu Site</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '15px', marginTop: '6px' }}>
              Preencha os campos abaixo e entraremos em contato com um plano de ação completo.
            </p>
          </div>

          {enviado ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#0F172A', borderRadius: '24px', border: '1px solid rgba(0,223,129,0.3)' }}>
              <div style={{ fontSize: '52px', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Solicitação Recebida!</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', marginBottom: '24px' }}>
                Abrimos seu atendimento no WhatsApp para apresentar a proposta sem compromisso.
              </p>
              <button
                type="button"
                onClick={() => setEnviado(false)}
                style={{ backgroundColor: '#00DF81', color: '#070B18', padding: '12px 28px', borderRadius: '12px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitLead} style={{ backgroundColor: '#0F172A', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '36px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Nome da Empresa
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Construtora Silva"
                      value={empresa}
                      onChange={e => setEmpresa(e.target.value)}
                      style={{ width: '100%', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="(81) 99999-9999"
                      value={whatsapp}
                      onChange={handleWhatsappMask}
                      style={{ width: '100%', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Tipo de Site
                  </label>
                  <select
                    value={tipoSite}
                    onChange={e => setTipoSite(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none' }}
                  >
                    <option value="institucional-completo">Site Institucional Corporativo Completo</option>
                    <option value="landing-page">Landing Page de Alta Conversão</option>
                    <option value="redesign-modernizacao">Redesign / Modernização de Site Antigo</option>
                    <option value="portal-blog">Portal com Blog e Painel Administrativo</option>
                    <option value="catalogo">Catálogo Digital de Produtos</option>
                    <option value="outro">Outro Modelo Personalizado</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Conte um pouco sobre o que sua empresa precisa:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Já tem domínio? Possui site atual? Deseja quais seções principais?..."
                    value={detalhes}
                    onChange={e => setDetalhes(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: '#00DF81',
                    color: '#070B18',
                    fontWeight: 800,
                    fontSize: '16px',
                    padding: '16px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    boxShadow: '0 4px 20px rgba(0, 223, 129, 0.35)',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Processando...' : 'Solicitar Orçamento no WhatsApp ⚡'}
                </button>

                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                  🔒 Resposta rápida em até 24h úteis. Seus dados estão 100% seguros.
                </p>
              </div>
            </form>
          )}

        </div>
      </section>

      {/* ========================================================
          FAQ — DÚVIDAS FREQUENTES
          ======================================================== */}
      <section style={{ padding: '90px 24px', maxWidth: '880px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 900 }}>Perguntas Frequentes sobre Sites Institucionais</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '15px', marginTop: '6px' }}>
            Tudo o que você precisa saber antes de iniciar o desenvolvimento do seu site.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            {
              q: 'Qual o prazo médio de entrega de um site institucional?',
              a: 'Geralmente entre 10 e 20 dias úteis para sites institucionais completos, e de 5 a 8 dias úteis para Landing Pages de alta conversão. Trabalhamos com metodologia ágil e entregas de prévias semanais para sua validação.'
            },
            {
              q: 'Por que Next.js e React são muito superiores ao WordPress?',
              a: 'O WordPress tradicional depende de dezenas de plugins pesados que deixam o site lento, vulnerável a vírus e difícil de manter. Com Next.js e React, seu site roda com código puro, carregamento instantâneo (< 0.8s), segurança máxima e infraestrutura Edge sem travamentos.'
            },
            {
              q: 'O site será de propriedade exclusiva da minha empresa?',
              a: 'Sim, 100%! O código-fonte, os arquivos visuais, os acessos e o domínio pertencem integralmente a você. Você não fica preso a plataformas proprietárias ou mensalidades abusivas.'
            },
            {
              q: 'Eu consigo alterar textos, imagens e dados facilmente?',
              a: 'Sim! Entregamos a plataforma pronta para que sua equipe possa atualizar conteúdos, adicionar artigos no blog ou alterar informações de contato com facilidade e autonomia.'
            },
            {
              q: 'O site já vem otimizado para o Google (SEO)?',
              a: 'Sim! Todos os nossos sites são entregues com SEO técnico completo: dados estruturados Schema.org, metadados OpenGraph para redes sociais, sitemap XML dinâmico e pontuação verde no Google PageSpeed.'
            },
            {
              q: 'Vocês oferecem suporte e manutenção após o lançamento?',
              a: 'Sim! Todos os projetos contam com garantia de suporte técnico pós-lançamento, monitoramento de estabilidade e auxílio com qualquer dúvida da sua equipe.'
            }
          ].map((faq, i) => (
            <details
              key={i}
              style={{
                backgroundColor: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '18px 24px',
                cursor: 'pointer'
              }}
            >
              <summary style={{ fontSize: '16px', fontWeight: 700, color: '#fff', outline: 'none', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{faq.q}</span>
                <span style={{ color: '#00DF81', fontSize: '20px', marginLeft: '12px' }}>+</span>
              </summary>
              <p style={{ marginTop: '14px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.7, borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '12px' }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <Footer dict={dict} locale={locale} />
    </div>
  );
}
