'use client';

import React, { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Briefcase, MapPin, Send, CheckCircle2, Sparkles, Code2, TrendingUp, Headphones, Palette, ShieldCheck } from 'lucide-react';

const OPEN_POSITIONS = [
  {
    id: 'fullstack',
    title: 'Desenvolvedor(a) Full Stack Next.js & IA',
    type: '100% Remoto',
    area: 'Tecnologia',
    icon: <Code2 size={24} color="#00DF81" />,
    description: 'Buscamos profissional experiente em React, Next.js (App Router), TypeScript, TailwindCSS e integração de APIs e modelos de IA para atuar na evolução dos nossos sistemas SaaS.',
    requirements: ['Next.js 15+ / React 19', 'TypeScript avançado', 'Supabase / PostgreSQL', 'Integrações de APIs e Webhooks', 'Experiência com IA generativa é um diferencial']
  },
  {
    id: 'trafego',
    title: 'Gestor(a) de Tráfego Pago & Performance',
    type: '100% Remoto',
    area: 'Marketing',
    icon: <TrendingUp size={24} color="#00AAFF" />,
    description: 'Responsável pela criação, escala e otimização de campanhas de alta conversão no Meta Ads (Facebook/Instagram), Google Ads e TikTok Ads para clientes de e-commerce e infoprodutos.',
    requirements: ['Domínio de Meta Ads e Google Ads', 'Copywriting orientado à conversão', 'Análise de métricas (CAC, ROAS, LTV)', 'Rastreamento avançado (UTMs, API de Conversões)']
  },
  {
    id: 'sdr',
    title: 'Closer / SDR Comercial B2B',
    type: '100% Remoto',
    area: 'Vendas',
    icon: <Briefcase size={24} color="#F59E0B" />,
    description: 'Atuação na qualificação de leads de tráfego pago, agendamento de reuniões estratégicas e fechamento de contratos de software e presença digital.',
    requirements: ['Experiência comprovada em vendas consultivas B2B', 'Excelente comunicação escrita e verbal', 'Organização e disciplina no acompanhamento de funil', 'Familiaridade com CRM e WhatsApp Business']
  },
  {
    id: 'designer',
    title: 'Designer UI/UX & Web',
    type: '100% Remoto',
    area: 'Design',
    icon: <Palette size={24} color="#EC4899" />,
    description: 'Criação de interfaces visuais de alto impacto, protótipos de alta fidelidade no Figma, identidade visual e criativos estratégicos para campanhas digitais.',
    requirements: ['Figma avançado', 'Design centrado no usuário e conversão', 'Design System e componentes reutilizáveis', 'Portfólio consistente com projetos web/mobile']
  },
  {
    id: 'suporte',
    title: 'Analista de Suporte & Customer Success',
    type: '100% Remoto',
    area: 'Atendimento',
    icon: <Headphones size={24} color="#10B981" />,
    description: 'Suporte humanizado aos clientes dos nossos sistemas (CRM, Delivery OS, Forms), garantindo rápida resolução de dúvidas, onboarding e satisfação contínua.',
    requirements: ['Comunicação empática e proativa', 'Habilidade para resolução ágil de problemas', 'Familiaridade com sistemas web e Help Desk', 'Atenção aos detalhes']
  }
];

export default function CarreirasPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    vaga: 'Desenvolvedor(a) Full Stack Next.js & IA',
    portfolio: '',
    apresentacao: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const formatPhone = (val: string) => {
    let digits = val.replace(/\D/g, '');
    if (digits.length > 11) digits = digits.slice(0, 11);
    if (digits.length <= 2) return digits.length ? `(${digits}` : '';
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleApplyClick = (jobTitle: string) => {
    setFormData(prev => ({ ...prev, vaga: jobTitle }));
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mensagem formatada para o WhatsApp de RH da Infinity
    const textMsg = `👋 *Nova Candidatura - Infinity On Demand*\n\n` +
      `👤 *Nome:* ${formData.nome}\n` +
      `💼 *Vaga:* ${formData.vaga}\n` +
      `📱 *WhatsApp:* ${formData.telefone}\n` +
      `✉️ *E-mail:* ${formData.email}\n` +
      (formData.portfolio ? `🔗 *Portfólio / LinkedIn:* ${formData.portfolio}\n` : '') +
      (formData.apresentacao ? `💬 *Apresentação:* ${formData.apresentacao}\n` : '');

    const waUrl = `https://wa.me/5581981280719?text=${encodeURIComponent(textMsg)}`;

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      window.open(waUrl, '_blank');
    }, 600);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary, #070B18)', color: '#fff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <Header />

      {/* Hero Section */}
      <section style={{ padding: '80px 20px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(circle, rgba(0,223,129,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', backgroundColor: 'rgba(0,223,129,0.1)', border: '1px solid rgba(0,223,129,0.3)', color: '#00DF81', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '20px' }}>
            <Sparkles size={14} /> Carreiras & Oportunidades
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.15, marginBottom: '20px' }}>
            Construa o Futuro com a <span style={{ background: 'linear-gradient(135deg, #00DF81 0%, #00AAFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Infinity On Demand</span>
          </h1>

          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto 36px' }}>
            Somos apaixonados por tecnologia, inteligência artificial e alta performance. Faça parte de um time ágil, 100% remoto e focado em gerar impacto real.
          </p>

          {/* Vantagens */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#00DF81" /> Trabalho 100% Remoto
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#00DF81" /> Horários Flexíveis
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#00DF81" /> Bonificação por Performance
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#00DF81" /> Tecnologias de Ponta & IA
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Vagas */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>Vagas Disponíveis</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Selecione uma vaga para se candidatar</p>
          </div>
          <span style={{ fontSize: '13px', padding: '6px 14px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#00DF81', fontWeight: 700 }}>
            {OPEN_POSITIONS.length} posições abertas
          </span>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {OPEN_POSITIONS.map((job) => (
            <div
              key={job.id}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(0,223,129,0.35)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {job.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{job.title}</h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                      <span>{job.area}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#00DF81' }}>
                        <MapPin size={13} /> {job.type}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleApplyClick(job.title)}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    backgroundColor: '#00DF81',
                    color: '#070B18',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#00F58D'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#00DF81'}
                >
                  Candidatar-se
                </button>
              </div>

              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                {job.description}
              </p>

              {/* Requirements Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {job.requirements.map((req, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    ✓ {req}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formulário de Candidatura */}
      <section ref={formRef} style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px 100px' }}>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(0,223,129,0.3)', borderRadius: '24px', padding: '40px 32px', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Envie sua Candidatura</h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)' }}>
              Preencha os dados abaixo para falar diretamente com nosso time de seleção.
            </p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <CheckCircle2 size={56} color="#00DF81" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Candidatura Enviada!</h3>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', maxWidth: '480px', margin: '0 auto 24px' }}>
                Abrimos uma janela no WhatsApp com seus dados formatados. Nossa equipe responderá em breve!
              </p>
              <button
                onClick={() => setSubmitted(false)}
                style={{ padding: '10px 24px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                Enviar outra candidatura
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={e => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Seu nome completo"
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>E-mail *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seuemail@exemplo.com"
                    style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>WhatsApp com DDD *</label>
                  <input
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={e => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
                    placeholder="(81) 99999-9999"
                    style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>Vaga de Interesse *</label>
                <select
                  value={formData.vaga}
                  onChange={e => setFormData({ ...formData, vaga: e.target.value })}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none' }}
                >
                  {OPEN_POSITIONS.map(p => (
                    <option key={p.id} value={p.title}>{p.title}</option>
                  ))}
                  <option value="Banco de Talentos (Outras Áreas)">Banco de Talentos (Outras Áreas)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>LinkedIn / Portfólio / GitHub</label>
                <input
                  type="url"
                  value={formData.portfolio}
                  onChange={e => setFormData({ ...formData, portfolio: e.target.value })}
                  placeholder="https://linkedin.com/in/seuperfil ou github"
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>Conte um pouco sobre sua experiência</label>
                <textarea
                  rows={3}
                  value={formData.apresentacao}
                  onChange={e => setFormData({ ...formData, apresentacao: e.target.value })}
                  placeholder="Quais seus principais pontos fortes e projetos dos quais se orgulha?"
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '12px',
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: '#00DF81',
                  color: '#070B18',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(0,223,129,0.3)',
                  transition: 'all 0.2s',
                }}
              >
                <Send size={18} /> {loading ? 'Enviando...' : 'Enviar Candidatura via WhatsApp'}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
