'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './consultoria.css';

const services = [
  {
    icon: '🧠',
    title: 'Consultoria Estratégica Digital',
    desc: 'Análise profunda do seu negócio, mercado e concorrência para criar um roadmap de crescimento digital com metas mensuráveis e estratégias comprovadas.',
    gradient: 'linear-gradient(135deg, #00DF81, #00AAFF)',
  },
  {
    icon: '⚙️',
    title: 'Sistemas Modulares Sob Medida',
    desc: 'Desenvolvemos sistemas personalizados com arquitetura modular — você escolhe apenas os módulos que precisa e escala conforme cresce.',
    gradient: 'linear-gradient(135deg, #00AAFF, #7C3AED)',
  },
  {
    icon: '🚀',
    title: 'Automação de Processos',
    desc: 'Eliminamos tarefas repetitivas com automações inteligentes que conectam CRM, vendas, financeiro e operações em um único fluxo.',
    gradient: 'linear-gradient(135deg, #7C3AED, #F59E0B)',
  },
  {
    icon: '📊',
    title: 'Business Intelligence & Dados',
    desc: 'Dashboards executivos com métricas em tempo real, relatórios automatizados e insights acionáveis para tomada de decisão.',
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
  },
  {
    icon: '🔗',
    title: 'Integrações & APIs',
    desc: 'Conectamos seu ecossistema digital: ERP, marketplaces, gateways de pagamento, CRMs, redes sociais e ferramentas de terceiros.',
    gradient: 'linear-gradient(135deg, #EF4444, #EC4899)',
  },
  {
    icon: '🛡️',
    title: 'Segurança & Compliance',
    desc: 'Auditoria de segurança, adequação à LGPD, SSL, autenticação multi-fator e proteção completa dos dados do seu negócio.',
    gradient: 'linear-gradient(135deg, #EC4899, #00DF81)',
  },
];

const modules = [
  { icon: '👥', title: 'CRM', desc: 'Pipeline de vendas, leads e clientes' },
  { icon: '💰', title: 'Financeiro', desc: 'Fluxo de caixa e contas a pagar/receber' },
  { icon: '📋', title: 'Projetos', desc: 'Kanban, tarefas e acompanhamento' },
  { icon: '🛒', title: 'E-commerce', desc: 'Loja virtual com checkout integrado' },
  { icon: '🛵', title: 'Delivery', desc: 'Cardápio digital + gestão de pedidos' },
  { icon: '📄', title: 'Contratos', desc: 'Geração e assinatura digital' },
  { icon: '📊', title: 'Relatórios', desc: 'Dashboards e BI personalizados' },
  { icon: '🤖', title: 'IA & Automação', desc: 'Chatbots, SDR e fluxos inteligentes' },
];

const steps = [
  { num: '01', title: 'Diagnóstico', desc: 'Analisamos sua operação atual, identificamos gargalos e oportunidades. Entendemos seu negócio a fundo.' },
  { num: '02', title: 'Estratégia', desc: 'Desenhamos a solução ideal com arquitetura modular, escolha de tecnologias e roadmap de implementação.' },
  { num: '03', title: 'Desenvolvimento', desc: 'Sprints ágeis com entregas semanais. Cada módulo é validado com você antes de avançar.' },
  { num: '04', title: 'Go-Live & Suporte', desc: 'Deploy gradual, treinamento da equipe e suporte prioritário. Acompanhamos seus resultados continuamente.' },
];

export default function ConsultoriaPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [interesse, setInteresse] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 9) value = `${value.slice(0, 10)}-${value.slice(10)}`;
    setWhatsapp(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          whatsapp,
          origin: 'consultoria',
          message: interesse ? `Interesse: ${interesse}. ${message}` : message,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setFormSuccess(true);
      setNome('');
      setEmail('');
      setWhatsapp('');
      setInteresse('');
      setMessage('');
    } catch {
      alert('Houve um erro ao enviar. Tente novamente.');
    }
    setIsSubmitting(false);
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {/* Hero Section — Resend-style */}
      <section className="cons-hero">
        <div className="cons-glow-1" />
        <div className="cons-glow-2" />
        <div className="cons-hero-noise" />

        {/* 3D Floating Cube */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/infinity-3d-cube.png" alt="" className="cons-hero-cube" />

        <div className="cons-container">
          <div style={{ maxWidth: '620px' }}>
            <div className="cons-badge cons-fade-in">
              ⚡ Consultoria & Sistemas Personalizados
            </div>
            <h1
              className="cons-fade-in"
              style={{
                fontSize: 'clamp(40px, 6vw, 72px)',
                fontWeight: 800,
                letterSpacing: '-2.5px',
                lineHeight: 1.05,
                marginBottom: '28px',
              }}
            >
              Tecnologia{' '}
              <span className="text-gradient">sob medida</span>{' '}
              para o seu negócio.
            </h1>
            <p
              className="cons-fade-in text-secondary"
              style={{ fontSize: '19px', lineHeight: 1.75, marginBottom: '44px', maxWidth: '520px' }}
            >
              Da estratégia ao código. Consultoria + desenvolvimento de sistemas modulares para empresas que querem escalar com tecnologia de ponta.
            </p>
            <div className="cons-fade-in" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href="#contact" className="btn-primary" style={{ padding: '18px 40px', fontSize: '17px', gap: '8px' }}>
                Agendar Diagnóstico Gratuito
              </a>
              <a href="#servicos" className="btn-secondary">
                Conhecer Soluções
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section style={{ padding: '48px 48px', backgroundColor: '#050510', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="cons-stats">
          {[
            { value: '99+', label: 'Projetos Entregues' },
            { value: '210+', label: 'Sistemas em Produção' },
            { value: '98%', label: 'Clientes Satisfeitos' },
            { value: '24/7', label: 'Suporte & Monitoramento' },
          ].map((s, i) => (
            <div key={i} className="cons-stat">
              <div className="cons-stat-value">{s.value}</div>
              <div className="cons-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" style={{ padding: '120px 48px', backgroundColor: 'var(--bg-primary)' }}>
        <div className="cons-container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>
              Soluções que <span className="text-gradient">impulsionam</span> seu negócio
            </h2>
            <p className="text-secondary" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              Combinamos consultoria estratégica com engenharia de software avançada para entregar resultados reais.
            </p>
          </div>
          <div className="cons-services-grid">
            {services.map((s, i) => (
              <div key={i} className="cons-service-card">
                <div className="cons-service-icon" style={{ background: s.gradient }}>
                  {s.icon}
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modular Systems Section */}
      <section style={{ padding: '120px 48px', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--bg-tertiary)' }}>
        <div className="cons-container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="cons-badge" style={{ margin: '0 auto 20px' }}>🧩 Arquitetura Modular</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>
              Monte o sistema <span className="text-gradient">perfeito</span> para você
            </h2>
            <p className="text-secondary" style={{ fontSize: '18px', maxWidth: '650px', margin: '0 auto' }}>
              Escolha apenas os módulos que precisa. Cada um funciona de forma independente, mas todos se conectam perfeitamente.
            </p>
          </div>
          <div className="cons-modules-grid">
            {modules.map((m, i) => (
              <div key={i} className="cons-module-card">
                <div className="cons-module-icon">{m.icon}</div>
                <h4>{m.title}</h4>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <p className="text-secondary" style={{ fontSize: '16px', marginBottom: '24px' }}>
              Não encontrou o que precisa? Criamos módulos 100% personalizados.
            </p>
            <a href="#contact" className="btn-primary" style={{ padding: '16px 36px', fontSize: '16px' }}>
              Solicitar Módulo Personalizado
            </a>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section style={{ padding: '120px 48px', backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--bg-tertiary)' }}>
        <div className="cons-container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>
              Como <span className="text-gradient">trabalhamos</span>
            </h2>
            <p className="text-secondary" style={{ fontSize: '18px' }}>
              Processo estruturado, entregas ágeis e resultados mensuráveis.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
            {steps.map((s, i) => (
              <div key={i} className="cons-step">
                <div className="cons-step-num">{s.num}</div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '10px' }}>{s.title}</h3>
                  <p className="text-secondary" style={{ fontSize: '16px', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: '80px 48px', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--bg-tertiary)' }}>
        <div className="cons-container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Tecnologias que utilizamos</h3>
            <p className="text-secondary" style={{ fontSize: '15px' }}>Stack moderna, escalável e de alta performance</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            {[
              'React', 'Next.js', 'TypeScript', 'Node.js', 'Supabase', 'PostgreSQL',
              'Tailwind CSS', 'Deno', 'Docker', 'Stripe', 'OpenAI', 'Vercel',
            ].map((tech, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 24px',
                  borderRadius: '12px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--bg-tertiary)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  transition: 'all 0.3s ease',
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flash AI CTA */}
      <section style={{ padding: '80px 48px', background: 'linear-gradient(135deg, rgba(0,223,129,0.08) 0%, rgba(0,170,255,0.08) 100%)', borderTop: '1px solid var(--bg-tertiary)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '32px' }}>
          <div style={{ flex: '1 1 400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', boxShadow: '0 0 30px rgba(0,223,129,0.3)' }}>⚡</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '22px' }}>Fale com o <span className="text-gradient">Flash</span></div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Nosso Consultor de Vendas com I.A.</div>
              </div>
            </div>
            <p className="text-secondary" style={{ fontSize: '16px', lineHeight: 1.7 }}>
              Tire todas as suas dúvidas em tempo real pelo WhatsApp. O Flash entende suas necessidades e monta a proposta ideal — <strong style={{ color: 'var(--text-primary)' }}>24h por dia, 7 dias por semana</strong>.
            </p>
          </div>
          <a
            href="https://wa.me/5581971027939?text=Ol%C3%A1%20Flash!%20Quero%20saber%20mais%20sobre%20consultoria%20e%20sistemas%20personalizados%20da%20Infinity."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: '20px 40px', fontSize: '18px', gap: '10px', whiteSpace: 'nowrap' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Conversar com o Flash
          </a>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" style={{ padding: '120px 48px', backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--bg-tertiary)', display: 'flex', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '900px', height: '100%', background: 'radial-gradient(circle, rgba(0,219,121,0.12) 0%, rgba(0,170,255,0.06) 40%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />

        <div className="cons-cta-box">
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '12px', textAlign: 'center' }}>
            Vamos <span className="text-gradient">conversar</span>?
          </h2>
          <p style={{ textAlign: 'center', marginBottom: '40px', color: 'rgba(255,255,255,0.6)', fontSize: '17px' }}>
            Conte sobre seu projeto e receba um diagnóstico gratuito em até 24h.
          </p>

          {formSuccess ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Recebemos sua mensagem!</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Um de nossos especialistas entrará em contato em até 24h.</p>
              <button type="button" onClick={() => setFormSuccess(false)} className="btn-primary" style={{ marginTop: '20px', padding: '12px 28px', borderRadius: '12px' }}>
                Enviar outro projeto
              </button>
            </div>
          ) : (
            <form className="cons-form" onSubmit={handleSubmit}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nome / Empresa</label>
                <input type="text" placeholder="Ex: João Silva — TechCorp" required value={nome} onChange={e => setNome(e.target.value)} />
              </div>
              <div className="cons-input-row">
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>E-mail</label>
                  <input type="email" placeholder="seu@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>WhatsApp</label>
                  <input type="text" placeholder="(11) 99999-9999" maxLength={15} value={whatsapp} onChange={handleWhatsappChange} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Interesse Principal</label>
                <select value={interesse} onChange={e => setInteresse(e.target.value)}>
                  <option value="">Selecione uma opção</option>
                  <option value="consultoria">Consultoria Estratégica</option>
                  <option value="sistema-modular">Sistema Modular Personalizado</option>
                  <option value="automacao">Automação de Processos</option>
                  <option value="integracao">Integrações & APIs</option>
                  <option value="bi">Business Intelligence & Dados</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sobre o Projeto</label>
                <textarea placeholder="Descreva brevemente seu desafio ou o que precisa..." rows={4} value={message} onChange={e => setMessage(e.target.value)} />
              </div>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', padding: '18px', fontSize: '16px', marginTop: '8px', borderRadius: '12px', opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'Enviando...' : 'Solicitar Diagnóstico Gratuito'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                🔒 Seus dados estão seguros. Não compartilhamos com terceiros.
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
