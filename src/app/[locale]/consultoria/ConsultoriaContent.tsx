'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../../consultoria/consultoria.css';

const services = [
  { icon: '🧠', title: 'Consultoria Estratégica Digital', titleEs: 'Consultoría Estratégica Digital', desc: 'Análise profunda do seu negócio, mercado e concorrência para criar um roadmap de crescimento digital com metas mensuráveis e estratégias comprovadas.', descEs: 'Análisis profundo de tu negocio, mercado y competencia para crear una hoja de ruta de crecimiento digital con metas medibles y estrategias comprobadas.', gradient: 'linear-gradient(135deg, #00DF81, #00AAFF)' },
  { icon: '⚙️', title: 'Sistemas Modulares Sob Medida', titleEs: 'Sistemas Modulares a Medida', desc: 'Desenvolvemos sistemas personalizados com arquitetura modular — você escolhe apenas os módulos que precisa e escala conforme cresce.', descEs: 'Desarrollamos sistemas personalizados con arquitectura modular — tú eliges solo los módulos que necesitas y escalas a medida que creces.', gradient: 'linear-gradient(135deg, #00AAFF, #7C3AED)' },
  { icon: '🚀', title: 'Automação de Processos', titleEs: 'Automatización de Procesos', desc: 'Eliminamos tarefas repetitivas com automações inteligentes que conectam CRM, vendas, financeiro e operações em um único fluxo.', descEs: 'Eliminamos tareas repetitivas con automatizaciones inteligentes que conectan CRM, ventas, finanzas y operaciones en un único flujo.', gradient: 'linear-gradient(135deg, #7C3AED, #F59E0B)' },
  { icon: '📊', title: 'Business Intelligence & Dados', titleEs: 'Business Intelligence y Datos', desc: 'Dashboards executivos com métricas em tempo real, relatórios automatizados e insights acionáveis para tomada de decisão.', descEs: 'Dashboards ejecutivos con métricas en tiempo real, reportes automatizados e insights accionables para la toma de decisiones.', gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)' },
  { icon: '🔗', title: 'Integrações & APIs', titleEs: 'Integraciones y APIs', desc: 'Conectamos seu ecossistema digital: ERP, marketplaces, gateways de pagamento, CRMs, redes sociais e ferramentas de terceiros.', descEs: 'Conectamos tu ecosistema digital: ERP, marketplaces, pasarelas de pago, CRMs, redes sociales y herramientas de terceros.', gradient: 'linear-gradient(135deg, #EF4444, #EC4899)' },
  { icon: '🛡️', title: 'Segurança & Compliance', titleEs: 'Seguridad y Compliance', desc: 'Auditoria de segurança, adequação à LGPD, SSL, autenticação multi-fator e proteção completa dos dados do seu negócio.', descEs: 'Auditoría de seguridad, adecuación a LGPD, SSL, autenticación multifactor y protección completa de los datos de tu negocio.', gradient: 'linear-gradient(135deg, #EC4899, #00DF81)' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ConsultoriaContent({ dict, locale }: { dict: any; locale: string }) {
  const es = locale === 'es';
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
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome, email, whatsapp, origin: 'consultoria', message: interesse ? `Interesse: ${interesse}. ${message}` : message }) });
      if (!res.ok) throw new Error('Failed');
      setFormSuccess(true); setNome(''); setEmail(''); setWhatsapp(''); setInteresse(''); setMessage('');
    } catch { alert(es ? 'Hubo un error al enviar. Intenta de nuevo.' : 'Houve um erro ao enviar. Tente novamente.'); }
    setIsSubmitting(false);
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header dict={dict} locale={locale} />

      <section className="cons-hero">
        <div className="cons-glow-1" /><div className="cons-glow-2" /><div className="cons-hero-noise" />
        <div className="cons-cube-wrapper"><div className="cons-cube-scene"><div className="cons-cube-face cons-cube-face--front" /><div className="cons-cube-face cons-cube-face--back" /><div className="cons-cube-face cons-cube-face--right" /><div className="cons-cube-face cons-cube-face--left" /><div className="cons-cube-face cons-cube-face--top" /><div className="cons-cube-face cons-cube-face--bottom" /></div></div>
        <div className="cons-container">
          <div style={{ maxWidth: '620px' }}>
            <div className="cons-badge cons-fade-in">⚡ {es ? 'Consultoría y Sistemas Personalizados' : 'Consultoria & Sistemas Personalizados'}</div>
            <h1 className="cons-fade-in" style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, letterSpacing: '-2.5px', lineHeight: 1.05, marginBottom: '28px' }}>
              {es ? 'Tecnología' : 'Tecnologia'}{' '}<span className="text-gradient">{es ? 'a medida' : 'sob medida'}</span>{' '}{es ? 'para tu negocio.' : 'para o seu negócio.'}
            </h1>
            <p className="cons-fade-in text-secondary" style={{ fontSize: '19px', lineHeight: 1.75, marginBottom: '44px', maxWidth: '520px' }}>
              {es ? 'De la estrategia al código. Consultoría + desarrollo de sistemas modulares para empresas que quieren escalar con tecnología de punta.' : 'Da estratégia ao código. Consultoria + desenvolvimento de sistemas modulares para empresas que querem escalar com tecnologia de ponta.'}
            </p>
            <div className="cons-fade-in" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href="#contact" className="btn-primary" style={{ padding: '18px 40px', fontSize: '17px', gap: '8px' }}>{es ? 'Agendar Diagnóstico Gratuito' : 'Agendar Diagnóstico Gratuito'}</a>
              <a href="#servicos" className="btn-secondary">{es ? 'Conocer Soluciones' : 'Conhecer Soluções'}</a>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 48px', backgroundColor: '#050510', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="cons-stats">
          {[
            { value: '99+', label: es ? 'Proyectos Entregados' : 'Projetos Entregues' },
            { value: '210+', label: es ? 'Sistemas en Producción' : 'Sistemas em Produção' },
            { value: '98%', label: es ? 'Clientes Satisfechos' : 'Clientes Satisfeitos' },
            { value: '24/7', label: es ? 'Soporte y Monitoreo' : 'Suporte & Monitoramento' },
          ].map((s, i) => (<div key={i} className="cons-stat"><div className="cons-stat-value">{s.value}</div><div className="cons-stat-label">{s.label}</div></div>))}
        </div>
      </section>

      <section id="servicos" style={{ padding: '120px 48px', backgroundColor: 'var(--bg-primary)' }}>
        <div className="cons-container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>
              {es ? 'Soluciones que' : 'Soluções que'} <span className="text-gradient">{es ? 'impulsan' : 'impulsionam'}</span> {es ? 'tu negocio' : 'seu negócio'}
            </h2>
            <p className="text-secondary" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              {es ? 'Combinamos consultoría estratégica con ingeniería de software avanzada para entregar resultados reales.' : 'Combinamos consultoria estratégica com engenharia de software avançada para entregar resultados reais.'}
            </p>
          </div>
          <div className="cons-services-grid">
            {services.map((s, i) => (
              <div key={i} className="cons-service-card">
                <div className="cons-service-icon" style={{ background: s.gradient }}>{s.icon}</div>
                <h3>{es ? s.titleEs : s.title}</h3>
                <p>{es ? s.descEs : s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" style={{ padding: '120px 48px', backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--bg-tertiary)', display: 'flex', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '900px', height: '100%', background: 'radial-gradient(circle, rgba(0,219,121,0.12) 0%, rgba(0,170,255,0.06) 40%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
        <div className="cons-cta-box">
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '12px', textAlign: 'center' }}>
            {es ? '¿' : ''}{es ? 'Hablamos' : 'Vamos'} <span className="text-gradient">{es ? '?' : 'conversar'}</span>{!es && '?'}
          </h2>
          <p style={{ textAlign: 'center', marginBottom: '40px', color: 'rgba(255,255,255,0.6)', fontSize: '17px' }}>
            {es ? 'Cuéntanos sobre tu proyecto y recibe un diagnóstico gratuito en hasta 24h.' : 'Conte sobre seu projeto e receba um diagnóstico gratuito em até 24h.'}
          </p>
          {formSuccess ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{es ? '¡Recibimos tu mensaje!' : 'Recebemos sua mensagem!'}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>{es ? 'Uno de nuestros especialistas se pondrá en contacto en hasta 24h.' : 'Um de nossos especialistas entrará em contato em até 24h.'}</p>
              <button type="button" onClick={() => setFormSuccess(false)} className="btn-primary" style={{ marginTop: '20px', padding: '12px 28px', borderRadius: '12px' }}>{es ? 'Enviar otro proyecto' : 'Enviar outro projeto'}</button>
            </div>
          ) : (
            <form className="cons-form" onSubmit={handleSubmit}>
              <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{es ? 'Nombre / Empresa' : 'Nome / Empresa'}</label><input type="text" placeholder={es ? 'Ej: Juan García — TechCorp' : 'Ex: João Silva — TechCorp'} required value={nome} onChange={e => setNome(e.target.value)} /></div>
              <div className="cons-input-row">
                <div style={{ flex: '1 1 200px' }}><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>E-mail</label><input type="email" placeholder={es ? 'tu@email.com' : 'seu@email.com'} required value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div style={{ flex: '1 1 200px' }}><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>WhatsApp</label><input type="text" placeholder="(11) 99999-9999" maxLength={15} value={whatsapp} onChange={handleWhatsappChange} /></div>
              </div>
              <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{es ? 'Interés Principal' : 'Interesse Principal'}</label>
                <select value={interesse} onChange={e => setInteresse(e.target.value)}>
                  <option value="">{es ? 'Selecciona una opción' : 'Selecione uma opção'}</option>
                  <option value="consultoria">{es ? 'Consultoría Estratégica' : 'Consultoria Estratégica'}</option>
                  <option value="sistema-modular">{es ? 'Sistema Modular Personalizado' : 'Sistema Modular Personalizado'}</option>
                  <option value="automacao">{es ? 'Automatización de Procesos' : 'Automação de Processos'}</option>
                  <option value="integracao">{es ? 'Integraciones y APIs' : 'Integrações & APIs'}</option>
                  <option value="bi">Business Intelligence & {es ? 'Datos' : 'Dados'}</option>
                  <option value="outro">{es ? 'Otro' : 'Outro'}</option>
                </select>
              </div>
              <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{es ? 'Sobre el Proyecto' : 'Sobre o Projeto'}</label><textarea placeholder={es ? 'Describe brevemente tu desafío o lo que necesitas...' : 'Descreva brevemente seu desafio ou o que precisa...'} rows={4} value={message} onChange={e => setMessage(e.target.value)} /></div>
              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '18px', fontSize: '16px', marginTop: '8px', borderRadius: '12px', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? (es ? 'Enviando...' : 'Enviando...') : (es ? 'Solicitar Diagnóstico Gratuito' : 'Solicitar Diagnóstico Gratuito')}
              </button>
              <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{es ? '🔒 Tus datos están seguros. No compartimos con terceros.' : '🔒 Seus dados estão seguros. Não compartilhamos com terceiros.'}</p>
            </form>
          )}
        </div>
      </section>

      <Footer dict={dict} locale={locale} />
    </main>
  );
}
