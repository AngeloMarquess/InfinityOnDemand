'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  Palette, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Check, 
  HelpCircle, 
  Download, 
  Layout, 
  Box, 
  PenTool, 
  Feather, 
  Eye, 
  Zap, 
  Globe, 
  FileText, 
  ChevronDown,
  MessageSquare,
  Package,
  Layers3,
  Sliders,
  Compass
} from 'lucide-react';

interface BrandingContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict?: any;
  locale?: string;
}

export default function BrandingContent({ dict, locale = 'pt' }: BrandingContentProps) {
  const prefix = locale === 'pt' ? '' : `/${locale}`;

  // Interactive Showcase Tab State
  const [activeTab, setActiveTab] = useState<'board' | 'stationery' | 'digital'>('board');

  // Interactive Simulator State
  const [projectStage, setProjectStage] = useState<'new' | 'rebranding' | 'digital'>('rebranding');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['social', 'manual']);
  const [deliverySpeed, setDeliverySpeed] = useState<'normal' | 'express'>('normal');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(a => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const getRecommendedPlan = () => {
    if (projectStage === 'digital' || selectedAddons.length >= 3) {
      return {
        name: 'Brand Experience & Design System 360°',
        tag: 'Escala & Consolidação',
        price: 'R$ 4.900',
        prazo: deliverySpeed === 'express' ? '12 dias úteis' : '20 dias úteis',
        desc: 'Para empresas consolidadas, SaaS e e-commerces que exigem manual profundo e componentes UI/UX no Figma.'
      };
    }
    if (projectStage === 'rebranding' || selectedAddons.length >= 1) {
      return {
        name: 'Business Rebranding',
        tag: 'Mais Escolhido',
        price: 'R$ 2.950',
        prazo: deliverySpeed === 'express' ? '8 dias úteis' : '15 dias úteis',
        desc: 'Redesenho completo de marca, símbolos, paleta estratégica, papelaria e kit profissional para redes sociais.'
      };
    }
    return {
      name: 'Starter Brand Essencial',
      tag: 'Lançamento Rápido',
      price: 'R$ 1.800',
      prazo: deliverySpeed === 'express' ? '5 dias úteis' : '10 dias úteis',
      desc: 'Perfeito para novas empresas e profissionais que precisam de identidade moderna, logo em vetor e guia básico.'
    };
  };

  const currentPlan = getRecommendedPlan();

  const getWhatsappSimulatorUrl = () => {
    const addonsMap: Record<string, string> = {
      social: 'Kit Redes Sociais',
      manual: 'Manual da Marca Detalhado',
      stationery: 'Papelaria & Cartões de Visita',
      presentation: 'Apresentação Comercial (Pitch Deck)'
    };
    const addonsText = selectedAddons.map(id => addonsMap[id] || id).join(', ') || 'Nenhum adicional';
    const stageMap = {
      new: 'Nova Marca do Zero',
      rebranding: 'Rebranding de Marca Existente',
      digital: 'Marca Digital / SaaS / E-commerce'
    };
    const text = `Olá time Infinity! Simulei meu projeto de Branding no site:
- Tipo: ${stageMap[projectStage]}
- Adicionais: ${addonsText}
- Ritmo: ${deliverySpeed === 'express' ? 'Entrega Expressa' : 'Prazo Padrão'}
- Plano Recomendado: ${currentPlan.name} (${currentPlan.price})
Gostaria de agendar um diagnóstico para alinharmos os detalhes!`;
    return `https://wa.me/5581981280719?text=${encodeURIComponent(text)}`;
  };

  const faqs = [
    {
      q: 'Qual a diferença entre criar só um logotipo e contratar um projeto de Branding?',
      a: 'Um logotipo é apenas um desenho gráfico isolado. O Branding é a construção estratégica de toda a percepção da sua empresa: compreende seu posicionamento no mercado, psicologia das cores, tipografia que transmite autoridade, tom de voz, regras de aplicação e o ecossistema visual completo que faz o cliente perceber alto valor e aceitar pagar mais caro pelo seu serviço.'
    },
    {
      q: 'Quantas propostas de logotipo e rodadas de ajuste estão inclusas?',
      a: 'Apresentamos conceitos criativos fundamentados na pesquisa de mercado do seu nicho. Cada conceito é acompanhado de aplicações reais em mockups 3D para você visualizar a marca viva. Você tem direito a rodadas de refinamento até a aprovação final com total transparência.'
    },
    {
      q: 'Em quais formatos recebo os arquivos finais?',
      a: 'Você recebe todos os arquivos mestres editáveis em vetor (.AI, .EPS, .SVG, .PDF Vetorial) que nunca perdem qualidade mesmo em outdoors gigantes, versões em alta resolução (.PNG transparente e .JPG), além do arquivo completo no Figma com o Design System e o Manual da Marca em PDF oficial.'
    },
    {
      q: 'Posso registrar a marca no INPI com o trabalho entregue pela Infinity?',
      a: 'Sim! Toda a criação é 100% original e exclusiva, sem utilização de templates genéricos ou bancos de logos. Entregamos a cessão total dos direitos autorais para você registrar sua marca com tranquilidade no INPI ou em órgãos internacionais.'
    },
    {
      q: 'Como o Branding se integra aos outros serviços da Infinity (Sites, Tráfego e SaaS)?',
      a: 'Essa é a maior vantagem da Infinity On Demand. Como desenvolvemos seu site institucional, páginas de venda, e-commerce e criativos de tráfego pago, sua nova identidade já nasce perfeitamente conectada ao código e à estratégia de marketing, sem ruído de comunicação entre agência de design e desenvolvedores.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#0B0F19', color: '#F8FAFC', minHeight: '100vh', overflowX: 'hidden' }}>
      <Header dict={dict} locale={locale} />

      {/* ======================================================== */}
      {/* 1. HERO SECTION                                         */}
      {/* ======================================================== */}
      <section style={{
        position: 'relative',
        padding: '90px 24px 80px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 223, 129, 0.15), rgba(11, 15, 25, 0))'
      }}>
        {/* Glow ambient background effects */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'rgba(0, 223, 129, 0.08)',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: '30%',
          right: '8%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'rgba(0, 170, 255, 0.08)',
          filter: 'blur(100px)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          
          {/* Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              backgroundColor: 'rgba(0, 223, 129, 0.1)',
              border: '1px solid rgba(0, 223, 129, 0.35)',
              boxShadow: '0 0 20px rgba(0, 223, 129, 0.15)'
            }}>
              <Sparkles size={16} color="#00DF81" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#00DF81', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                Novo Serviço • Branding & Identidade Visual de Alto Padrão
              </span>
            </div>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(36px, 5.5vw, 64px)',
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            maxWidth: '960px',
            margin: '0 auto 24px',
            color: '#FFFFFF'
          }}>
            Transforme seu negócio em uma <br />
            <span style={{
              background: 'linear-gradient(135deg, #00DF81 0%, #00AAFF 50%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              Marca Magnética de Alto Valor
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#94A3B8',
            textAlign: 'center',
            maxWidth: '780px',
            margin: '0 auto 36px',
            lineHeight: 1.65
          }}>
            Mais do que um logotipo: criamos a estratégia, psicologia visual, manual da marca e design system que fazem seu cliente enxergar autoridade inquestionável e pagar mais caro sem pedir desconto.
          </p>

          {/* Action CTAs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '50px'
          }}>
            <a
              href="https://wa.me/5581981280719?text=Ol%C3%A1!%20Gostaria%20de%20um%20diagn%C3%B3stico%20de%20Branding%20e%20Identidade%20Visual%20para%20minha%20empresa."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 32px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #00DF81 0%, #00B368 100%)',
                color: '#0B0F19',
                fontSize: '16px',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 8px 30px rgba(0, 223, 129, 0.4)',
                transition: 'all 0.25s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 223, 129, 0.5)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 223, 129, 0.4)'; }}
            >
              <span>Quero Construir Minha Marca</span>
              <ArrowRight size={18} />
            </a>

            <a
              href="#simulador"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 28px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.25s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#00DF81'; e.currentTarget.style.background = 'rgba(0, 223, 129, 0.08)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
            >
              <Sliders size={18} color="#00DF81" />
              <span>Simular Meu Projeto</span>
            </a>
          </div>

          {/* Social Proof & Metrics Badges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            maxWidth: '1000px',
            margin: '0 auto 60px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '14px',
              padding: '18px 20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#00DF81', marginBottom: '4px' }}>+85</div>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>Identidades & Marcas Criadas</div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '14px',
              padding: '18px 20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#00AAFF', marginBottom: '4px' }}>100% Vetorial</div>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>Figma, AI, EPS, SVG e PDF</div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '14px',
              padding: '18px 20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#8B5CF6', marginBottom: '4px' }}>Até 3x Mais Valor</div>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>Percepção imediata de ticket alto</div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '14px',
              padding: '18px 20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#F59E0B', marginBottom: '4px' }}>Pronto p/ INPI</div>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>Criação exclusiva e desimpedida</div>
            </div>
          </div>

          {/* Hero Visual Mockup Board */}
          <div style={{
            position: 'relative',
            borderRadius: '20px',
            padding: '8px',
            background: 'linear-gradient(135deg, rgba(0, 223, 129, 0.4) 0%, rgba(0, 170, 255, 0.3) 50%, rgba(139, 92, 246, 0.3) 100%)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
            maxWidth: '1080px',
            margin: '0 auto'
          }}>
            <div style={{
              background: '#0B0F19',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <img 
                src="/branding/brand_board.png" 
                alt="Brand Board Infinity On Demand Mockup"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  filter: 'brightness(0.95) contrast(1.05)'
                }}
              />
              
              {/* Overlay Glass Tags */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                background: 'rgba(11, 15, 25, 0.85)',
                backdropFilter: 'blur(12px)',
                padding: '14px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00DF81', boxShadow: '0 0 10px #00DF81' }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>Infinity Brand Architecture & Design System</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', background: 'rgba(0, 223, 129, 0.15)', color: '#00DF81', padding: '3px 10px', borderRadius: '6px', fontWeight: 700 }}>Brand Guidelines</span>
                  <span style={{ fontSize: '11px', background: 'rgba(0, 170, 255, 0.15)', color: '#00AAFF', padding: '3px 10px', borderRadius: '6px', fontWeight: 700 }}>Design Tokens</span>
                  <span style={{ fontSize: '11px', background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', padding: '3px 10px', borderRadius: '6px', fontWeight: 700 }}>Mockups 3D Físicos & Digitais</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. O PROBLEMA: EMPRESA COMUM VS. MARCA DE ALTO VALOR     */}
      {/* ======================================================== */}
      <section style={{ padding: '80px 24px', backgroundColor: '#090D16', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#00DF81', textTransform: 'uppercase', letterSpacing: '1px' }}>O Impacto no Caixa</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginTop: '10px', color: '#fff' }}>
              Por que investir em Branding multiplica seu faturamento?
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: '680px', margin: '14px auto 0', fontSize: '16px' }}>
              No mercado atual, o cliente decide se confia na sua empresa em menos de 3 segundos. Veja a diferença prática entre ser uma commoditie e ser uma referência.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {/* Box 1: Negócio Sem Branding */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.03)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '18px',
              padding: '32px',
              position: 'relative'
            }}>
              <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', fontSize: '12px', fontWeight: 700, marginBottom: '20px' }}>
                SEM BRANDING ESTRATÉGICO
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>O Negócio Genérico (Briga por Preço)</h3>
              
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#94A3B8' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800 }}>✕</span>
                  <span><strong>Guerra de Preços:</strong> O cliente sempre pede desconto porque não vê distinção entre você e o concorrente.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#94A3B8' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800 }}>✕</span>
                  <span><strong>Comunicação Desconexa:</strong> Cada post no Instagram usa uma cor, fonte e tom diferente, transmitindo amadorismo.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#94A3B8' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800 }}>✕</span>
                  <span><strong>Anúncios Caros e Pouco Eficientes:</strong> O tráfego pago atrai pessoas, mas o lead foge ao ver uma página sem credibilidade.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#94A3B8' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800 }}>✕</span>
                  <span><strong>Falta de Memória de Marca:</strong> O cliente compra uma vez e esquece o nome da empresa na semana seguinte.</span>
                </li>
              </ul>
            </div>

            {/* Box 2: Marca com Infinity Brand System */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(0, 223, 129, 0.08) 0%, rgba(0, 170, 255, 0.04) 100%)',
              border: '1px solid rgba(0, 223, 129, 0.35)',
              borderRadius: '18px',
              padding: '32px',
              position: 'relative',
              boxShadow: '0 15px 40px rgba(0, 223, 129, 0.1)'
            }}>
              <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '6px', background: 'rgba(0, 223, 129, 0.2)', color: '#00DF81', fontSize: '12px', fontWeight: 800, marginBottom: '20px' }}>
                COM BRANDING INFINITY
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>A Marca Referência (Comanda Autoridade)</h3>
              
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#CBD5E1' }}>
                  <CheckCircle2 size={18} color="#00DF81" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Poder de Precificação:</strong> Cobra 2x a 4x mais pelo mesmo serviço porque a embalagem visual justifica o valor.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#CBD5E1' }}>
                  <CheckCircle2 size={18} color="#00DF81" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Identidade Consistente:</strong> Site, redes sociais, apresentações e cartões falam exatamente a mesma língua de luxo e eficiência.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#CBD5E1' }}>
                  <CheckCircle2 size={18} color="#00DF81" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Conversão Superior no Tráfego:</strong> Cada real investido em mídia rende mais porque a taxa de fechamento dispara.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#CBD5E1' }}>
                  <CheckCircle2 size={18} color="#00DF81" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Patrimônio Intangível (Brand Equity):</strong> Sua empresa ganha valor real de mercado para eventuais investidores e parcerias.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. OS 4 PILARES DA METODOLOGIA INFINITY BRAND SYSTEM     */}
      {/* ======================================================== */}
      <section style={{ padding: '90px 24px', position: 'relative' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#00AAFF', textTransform: 'uppercase', letterSpacing: '1px' }}>Processo Estruturado</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginTop: '10px', color: '#fff' }}>
              Os 4 Pilares da Metodologia Infinity
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: '640px', margin: '14px auto 0', fontSize: '16px' }}>
              Uma esteira de engenharia e design que une estratégia corporativa e sofisticação estética.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {/* Pilar 1 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '28px 24px',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#00DF81'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 223, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00DF81', marginBottom: '20px' }}>
                <Compass size={24} />
              </div>
              <div style={{ fontSize: '12px', color: '#00DF81', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Pilar 01</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Imersão & DNA de Marca</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Investigação profunda do seu nicho, mapeamento da concorrência, público-alvo prioritário, proposta de valor única (UVP) e arquétipo de posicionamento.
              </p>
            </div>

            {/* Pilar 2 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '28px 24px',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#00AAFF'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 170, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00AAFF', marginBottom: '20px' }}>
                <PenTool size={24} />
              </div>
              <div style={{ fontSize: '12px', color: '#00AAFF', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Pilar 02</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Identidade Visual & Símbolo</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Criação do logotipo primário, secundário, ícone de assinatura, tipografia curada para títulos e leitura, e paleta cromática com contrastes acessíveis.
              </p>
            </div>

            {/* Pilar 3 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '28px 24px',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6', marginBottom: '20px' }}>
                <Layers3 size={24} />
              </div>
              <div style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Pilar 03</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Manual da Marca & Regras</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Brand Book detalhado em PDF vetorial: grid de construção geométrica, áreas de respiro, aplicações corretas, proibições e códigos HEX, RGB, CMYK e Pantone.
              </p>
            </div>

            {/* Pilar 4 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '28px 24px',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#F59E0B'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', marginBottom: '20px' }}>
                <Box size={24} />
              </div>
              <div style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Pilar 04</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Universo de Aplicações 3D</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Mockups de papelaria institucional, cartões de visita de alto padrão, templates para redes sociais, assinatura de e-mail e design tokens para desenvolvimento web.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SHOWCASE VISUAL INTERATIVO (MOCKUPS REAIS)            */}
      {/* ======================================================== */}
      <section style={{ padding: '80px 24px', backgroundColor: '#090D16', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#00DF81', textTransform: 'uppercase', letterSpacing: '1px' }}>Showcase de Aplicação</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginTop: '10px', color: '#fff' }}>
              Sua Marca Viva em Todos os Pontos de Contato
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: '640px', margin: '12px auto 0', fontSize: '16px' }}>
              Veja como nossos entregáveis se comportam no mundo real, do impresso ao ambiente digital de alta performance.
            </p>
          </div>

          {/* Tab Selector */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '36px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setActiveTab('board')}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'board' ? '#00DF81' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === 'board' ? '#0B0F19' : '#CBD5E1',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <Layout size={16} />
              <span>Brand Board Completo</span>
            </button>

            <button
              onClick={() => setActiveTab('stationery')}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'stationery' ? '#00DF81' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === 'stationery' ? '#0B0F19' : '#CBD5E1',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <FileText size={16} />
              <span>Papelaria & Cartão de Visita</span>
            </button>

            <button
              onClick={() => setActiveTab('digital')}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'digital' ? '#00DF81' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === 'digital' ? '#0B0F19' : '#CBD5E1',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <Globe size={16} />
              <span>Presença Digital & App</span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
          }}>
            {activeTab === 'board' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'center' }}>
                <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(0, 223, 129, 0.25)' }}>
                  <img src="/branding/brand_board.png" alt="Brand Board" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
                <div>
                  <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '6px', background: 'rgba(0, 223, 129, 0.15)', color: '#00DF81', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
                    SISTEMA VISUAL COESO
                  </div>
                  <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Brand Board & Painel Semântico</h3>
                  <p style={{ color: '#94A3B8', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
                    O Brand Board sintetiza todas as tomadas de decisão da sua marca em um painel único de consulta rápida: versões verticais e horizontais do logo, paleta primária e de apoio, tipografia de destaque, iconografia e texturas.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1', fontSize: '14px' }}>
                      <CheckCircle2 size={16} color="#00DF81" />
                      <span>Versão principal e variações para fundos escuros e claros</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1', fontSize: '14px' }}>
                      <CheckCircle2 size={16} color="#00DF81" />
                      <span>Definição de tipografia corporativa de alta legibilidade</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1', fontSize: '14px' }}>
                      <CheckCircle2 size={16} color="#00DF81" />
                      <span>Paleta cromática balanceada com acessibilidade WCAG</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'stationery' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src="/branding/business_card.png" alt="Cartão de Visita" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src="/branding/letterhead.png" alt="Papel Timbrado" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '6px', background: 'rgba(0, 170, 255, 0.15)', color: '#00AAFF', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
                    TANGIBILIDADE & LUXO
                  </div>
                  <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Papelaria Corporativa de Alto Padrão</h3>
                  <p style={{ color: '#94A3B8', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
                    Quando você entrega um cartão de visita com acabamento especial ou envia uma proposta timbrada impecável, seu cliente percebe instantaneamente que está lidando com uma organização de alto calibre.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1', fontSize: '14px' }}>
                      <CheckCircle2 size={16} color="#00AAFF" />
                      <span>Cartões de visita com especificações gráficas prontas (verniz e corte)</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1', fontSize: '14px' }}>
                      <CheckCircle2 size={16} color="#00AAFF" />
                      <span>Papel timbrado em formato Word/Docs e PDF para propostas comerciais</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1', fontSize: '14px' }}>
                      <CheckCircle2 size={16} color="#00AAFF" />
                      <span>Assinatura de e-mail em código HTML clicável</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'digital' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src="/branding/macbook_mockup.png" alt="MacBook Mockup" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src="/branding/iphone_mockup.png" alt="iPhone Mockup" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
                    CONEXÃO COM SOFTWARE & WEB
                  </div>
                  <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Design System Pronto para o Digital</h3>
                  <p style={{ color: '#94A3B8', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
                    Ao contrário de designers tradicionais que só pensam no impresso, nós pensamos na tela: criamos ícones de aplicativo (iOS e Android), favicons, Open Graph tags para compartilhamento em WhatsApp e tokens CSS prontos para Next.js e Tailwind.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1', fontSize: '14px' }}>
                      <CheckCircle2 size={16} color="#8B5CF6" />
                      <span>Ícones em 1024x1024 para App Store e Google Play</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1', fontSize: '14px' }}>
                      <CheckCircle2 size={16} color="#8B5CF6" />
                      <span>Banners e mockups de tela para campanhas de Meta Ads</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1', fontSize: '14px' }}>
                      <CheckCircle2 size={16} color="#8B5CF6" />
                      <span>Biblioteca completa de componentes no Figma</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. TABELA DE PACOTES & PLANOS DE BRANDING                */}
      {/* ======================================================== */}
      <section style={{ padding: '90px 24px', position: 'relative' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#00DF81', textTransform: 'uppercase', letterSpacing: '1px' }}>Planos & Investimento</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginTop: '10px', color: '#fff' }}>
              Escolha o Nível Ideal para o Momento da Sua Marca
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: '640px', margin: '14px auto 0', fontSize: '16px' }}>
              Transparência, entrega de arquivos mestres originais e garantia de satisfação da Infinity On Demand.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            alignItems: 'stretch'
          }}>
            {/* Plano 1: Starter Brand */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>STARTUP & PROFISSIONAL</span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>Starter Brand Essencial</h3>
                <p style={{ fontSize: '14px', color: '#94A3B8', margin: '12px 0 20px', lineHeight: 1.6 }}>
                  Ideal para novos negócios e especialistas que precisam de uma imagem profissional imediata para começar a vender.
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '34px', fontWeight: 800, color: '#fff' }}>R$ 1.800</span>
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>/ projeto</span>
                </div>

                <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '24px' }} />

                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
                    <Check size={16} color="#00DF81" />
                    <span>Conceito Estratégico do Logotipo</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
                    <Check size={16} color="#00DF81" />
                    <span>Versões Horizontal, Vertical e Ícone</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
                    <Check size={16} color="#00DF81" />
                    <span>Paleta Cromática (HEX/RGB)</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
                    <Check size={16} color="#00DF81" />
                    <span>Tipografia Institucional Recomendada</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
                    <Check size={16} color="#00DF81" />
                    <span>Brand Guide Essencial (PDF)</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
                    <Check size={16} color="#00DF81" />
                    <span>Arquivos em AI, EPS, SVG e PNG</span>
                  </li>
                </ul>
              </div>

              <div style={{ marginTop: '36px' }}>
                <a
                  href="https://wa.me/5581981280719?text=Ol%C3%A1!%20Gostaria%20de%20contratar%20o%20plano%20Starter%20Brand%20Essencial."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '14px 20px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#00DF81'; e.currentTarget.style.background = 'rgba(0, 223, 129, 0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
                >
                  Selecionar Starter
                </a>
              </div>
            </div>

            {/* Plano 2: Business Rebranding (DESTAQUE) */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(0, 223, 129, 0.1) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '2px solid #00DF81',
              borderRadius: '20px',
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0, 223, 129, 0.2)'
            }}>
              {/* Highlight Tag */}
              <div style={{
                position: 'absolute',
                top: '-13px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#00DF81',
                color: '#0B0F19',
                padding: '3px 14px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.8px'
              }}>
                MAIS ESCOLHIDO PELAS EMPRESAS
              </div>

              <div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#00DF81', textTransform: 'uppercase', letterSpacing: '0.8px' }}>EMPRESAS CONSOLIDADAS</span>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>Business Rebranding</h3>
                <p style={{ fontSize: '14px', color: '#CBD5E1', margin: '12px 0 20px', lineHeight: 1.6 }}>
                  Transformação completa para empresas que já faturam e querem subir de patamar, dobrar preços e dominar a atenção.
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '38px', fontWeight: 800, color: '#00DF81' }}>R$ 2.950</span>
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>/ projeto</span>
                </div>

                <div style={{ width: '100%', height: '1px', background: 'rgba(0, 223, 129, 0.3)', marginBottom: '24px' }} />

                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FFFFFF', fontWeight: 600 }}>
                    <Check size={16} color="#00DF81" />
                    <span>Tudo do plano Starter +</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
                    <Check size={16} color="#00DF81" />
                    <span>Diagnóstico de Concorrentes & UVP</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
                    <Check size={16} color="#00DF81" />
                    <span>Manual da Marca Completo (Brand Book PDF)</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
                    <Check size={16} color="#00DF81" />
                    <span>Papelaria: Cartão de Visita & Papel Timbrado</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
                    <Check size={16} color="#00DF81" />
                    <span>Kit Redes Sociais: 6 Templates Feed + 6 Stories</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
                    <Check size={16} color="#00DF81" />
                    <span>Assinatura de E-mail HTML para a equipe</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
                    <Check size={16} color="#00DF81" />
                    <span>Pronto para registro oficial no INPI</span>
                  </li>
                </ul>
              </div>

              <div style={{ marginTop: '36px' }}>
                <a
                  href="https://wa.me/5581981280719?text=Ol%C3%A1!%20Quero%20contratar%20o%20plano%20Business%20Rebranding%20da%20Infinity."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '16px 20px',
                    borderRadius: '10px',
                    background: '#00DF81',
                    color: '#0B0F19',
                    fontWeight: 800,
                    fontSize: '15px',
                    textDecoration: 'none',
                    boxShadow: '0 8px 25px rgba(0, 223, 129, 0.4)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Contratar Business Rebranding
                </a>
              </div>
            </div>

            {/* Plano 3: Enterprise & Design System */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.8px' }}>FRANQUIAS, SAAS & E-COMMERCE</span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>Design System 360°</h3>
                <p style={{ fontSize: '14px', color: '#94A3B8', margin: '12px 0 20px', lineHeight: 1.6 }}>
                  Ecossistema total para empresas com plataformas web, múltiplos pontos de venda, times de desenvolvimento e franquias.
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '34px', fontWeight: 800, color: '#fff' }}>R$ 4.900</span>
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>/ projeto</span>
                </div>

                <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '24px' }} />

                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FFFFFF', fontWeight: 600 }}>
                    <Check size={16} color="#8B5CF6" />
                    <span>Tudo do plano Business +</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
                    <Check size={16} color="#8B5CF6" />
                    <span>Design System no Figma (UI Kit & Tokens)</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
                    <Check size={16} color="#8B5CF6" />
                    <span>Apresentação Comercial em Slides (Keynote/PPT)</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
                    <Check size={16} color="#8B5CF6" />
                    <span>Embalagens, Rótulos ou Uniformes (até 3 itens)</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
                    <Check size={16} color="#8B5CF6" />
                    <span>Design de Ícones de App (iOS & Android)</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
                    <Check size={16} color="#8B5CF6" />
                    <span>Alinhamento direto com nosso Diretor de Arte</span>
                  </li>
                </ul>
              </div>

              <div style={{ marginTop: '36px' }}>
                <a
                  href="https://wa.me/5581981280719?text=Ol%C3%A1!%20Gostaria%20de%20uma%20proposta%20para%20o%20Design%20System%20360%C2%B0."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '14px 20px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
                >
                  Falar sobre Enterprise 360°
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. SIMULADOR INTERATIVO DE PROJETO (ID=SIMULADOR)        */}
      {/* ======================================================== */}
      <section id="simulador" style={{ padding: '80px 24px', backgroundColor: '#090D16', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#00DF81', textTransform: 'uppercase', letterSpacing: '1px' }}>Personalização Rápida</span>
            <h2 style={{ fontSize: 'clamp(26px, 3.8vw, 38px)', fontWeight: 800, marginTop: '8px', color: '#fff' }}>
              Simulador Inteligente de Branding
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '15px', maxWidth: '600px', margin: '10px auto 0' }}>
              Selecione o momento da sua empresa e receba o escopo recomendado em tempo real.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '36px',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)'
          }}>
            {/* Step 1: Momento */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                1. Qual é o momento da sua empresa?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setProjectStage('new')}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: projectStage === 'new' ? '2px solid #00DF81' : '1px solid rgba(255,255,255,0.1)',
                    background: projectStage === 'new' ? 'rgba(0, 223, 129, 0.12)' : 'rgba(255,255,255,0.02)',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>🌱 Criando uma Marca do Zero</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Novo negócio ou produto novo</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProjectStage('rebranding')}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: projectStage === 'rebranding' ? '2px solid #00DF81' : '1px solid rgba(255,255,255,0.1)',
                    background: projectStage === 'rebranding' ? 'rgba(0, 223, 129, 0.12)' : 'rgba(255,255,255,0.02)',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>⚡ Rebranding de Marca Ativa</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Modernizar e cobrar mais caro</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProjectStage('digital')}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: projectStage === 'digital' ? '2px solid #00DF81' : '1px solid rgba(255,255,255,0.1)',
                    background: projectStage === 'digital' ? 'rgba(0, 223, 129, 0.12)' : 'rgba(255,255,255,0.02)',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>🚀 Plataforma Digital / SaaS</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Exige Design System no Figma</div>
                </button>
              </div>
            </div>

            {/* Step 2: Materiais Adicionais */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                2. Quais materiais complementares você precisa?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {[
                  { id: 'social', label: 'Kit Redes Sociais (Feed & Stories)' },
                  { id: 'manual', label: 'Brand Guidelines Detalhado' },
                  { id: 'stationery', label: 'Papelaria & Cartões de Visita' },
                  { id: 'presentation', label: 'Apresentação Comercial em Slides' }
                ].map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: isChecked ? '1px solid #00DF81' : '1px solid rgba(255,255,255,0.08)',
                        background: isChecked ? 'rgba(0, 223, 129, 0.08)' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        border: isChecked ? '1px solid #00DF81' : '1px solid rgba(255,255,255,0.3)',
                        background: isChecked ? '#00DF81' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0B0F19'
                      }}>
                        {isChecked && <Check size={14} strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '13px', color: isChecked ? '#fff' : '#94A3B8', fontWeight: isChecked ? 600 : 400 }}>{addon.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Ritmo de Entrega */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                3. Ritmo de entrega desejado:
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setDeliverySpeed('normal')}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: deliverySpeed === 'normal' ? '1px solid #00DF81' : '1px solid rgba(255,255,255,0.1)',
                    background: deliverySpeed === 'normal' ? 'rgba(0, 223, 129, 0.12)' : 'transparent',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  📅 Padrão (15 a 20 dias úteis)
                </button>
                <button
                  type="button"
                  onClick={() => setDeliverySpeed('express')}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: deliverySpeed === 'express' ? '1px solid #00AAFF' : '1px solid rgba(255,255,255,0.1)',
                    background: deliverySpeed === 'express' ? 'rgba(0, 170, 255, 0.12)' : 'transparent',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Express Prioritário (8 a 12 dias úteis)
                </button>
              </div>
            </div>

            {/* Live Result Box */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 223, 129, 0.12) 0%, rgba(0, 170, 255, 0.08) 100%)',
              border: '1px solid rgba(0, 223, 129, 0.35)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', background: '#00DF81', color: '#0B0F19', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>PLANO RECOMENDADO</span>
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>{currentPlan.tag}</span>
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>{currentPlan.name}</div>
                <div style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '4px', maxWidth: '480px' }}>{currentPlan.desc}</div>
                <div style={{ fontSize: '13px', color: '#00DF81', fontWeight: 700, marginTop: '8px' }}>Prazo estimado: {currentPlan.prazo}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#00DF81' }}>{currentPlan.price}</div>
                <a
                  href={getWhatsappSimulatorUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '10px',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    background: '#00DF81',
                    color: '#0B0F19',
                    fontWeight: 800,
                    fontSize: '14px',
                    textDecoration: 'none'
                  }}
                >
                  <MessageSquare size={16} />
                  <span>Enviar Briefing no WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. FAQ ACCORDIONS                                        */}
      {/* ======================================================== */}
      <section style={{ padding: '80px 24px', position: 'relative' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '1px' }}>Dúvidas Comuns</span>
            <h2 style={{ fontSize: 'clamp(26px, 3.8vw, 38px)', fontWeight: 800, marginTop: '8px', color: '#fff' }}>
              Perguntas Frequentes sobre Branding
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: isOpen ? '1px solid #00DF81' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    transition: 'all 0.2s'
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: 700,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: isOpen ? '#00DF81' : '#94A3B8' }} />
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 24px 20px', color: '#94A3B8', fontSize: '15px', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ paddingTop: '14px' }}>{faq.a}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. CTA FINAL DE ALTA CONVERSÃO                           */}
      {/* ======================================================== */}
      <section style={{ padding: '90px 24px 100px', backgroundColor: '#090D16', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 223, 129, 0.15) 0%, rgba(0, 170, 255, 0.1) 100%)',
            border: '1px solid rgba(0, 223, 129, 0.35)',
            borderRadius: '24px',
            padding: '60px 32px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
          }}>
            <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '18px' }}>
              Sua Empresa Merece Uma Marca <br />
              <span style={{ color: '#00DF81' }}>Que Impõe Respeito e Autoridade</span>
            </h2>

            <p style={{ color: '#CBD5E1', fontSize: '17px', maxWidth: '640px', margin: '0 auto 36px', lineHeight: 1.65 }}>
              Agende agora uma conversa sem compromisso com nossos especialistas em Branding e descubra o potencial inexplorado da sua empresa.
            </p>

            <a
              href="https://wa.me/5581981280719?text=Ol%C3%A1!%20Quero%20agendar%20um%20diagn%C3%B3stico%20de%20Branding%20para%20minha%20empresa."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '18px 40px',
                borderRadius: '12px',
                background: '#00DF81',
                color: '#0B0F19',
                fontSize: '17px',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 10px 35px rgba(0, 223, 129, 0.45)',
                transition: 'all 0.25s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <span>Falar com o Diretor de Arte no WhatsApp</span>
              <ArrowRight size={20} />
            </a>
          </div>

        </div>
      </section>

      <Footer dict={dict} locale={locale} />
    </div>
  );
}
