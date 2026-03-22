'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, BarChart3, Rocket, Target, ShoppingCart, Smartphone, ChevronRight, Zap, Monitor, PieChart, Users } from 'lucide-react';
import '../../ecommerce/ecommerce.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EcommerceContent({ dict, locale }: { dict: any; locale: string }) {
  const es = locale === 'es';
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 9) value = `${value.slice(0, 10)}-${value.slice(10)}`;
    setWhatsapp(value);
  };

  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome, email, whatsapp }) });
      if (!res.ok) throw new Error('Failed');
      window.location.href = 'https://calendly.com/angelobritoo/consultoria-trafego-pago';
    } catch { alert(es ? 'Hubo un error al enviar. Intenta de nuevo.' : 'Houve um erro ao enviar suas informações. Tente novamente.'); setIsSubmitting(false); }
  };

  const servicesData = [
    { icon: <Target size={32} />, title: es ? 'Tráfico Pago p/ E-commerce' : 'Tráfego Pago p/ E-commerce', desc: es ? 'Campañas de Google Ads y Meta Ads diseñadas específicamente para convertir productos y escalar tu ROAS.' : 'Campanhas de Google Ads e Meta Ads desenhadas especificamente para converter produtos e escalar seu ROAS.', gradient: 'linear-gradient(135deg, #00DF81, #00AAFF)' },
    { icon: <ShoppingCart size={32} />, title: es ? 'Optimización de Conversión (CRO)' : 'Otimização de Conversão (CRO)', desc: es ? 'Análisis UX y mejoras continuas en tu sitio para transformar más visitantes en clientes que pagan.' : 'Análise UX e melhorias contínuas no seu site para transformar mais visitantes em clientes pagantes.', gradient: 'linear-gradient(135deg, #00AAFF, #7C3AED)' },
    { icon: <Smartphone size={32} />, title: es ? 'Desarrollo de Apps y Tiendas' : 'Desenvolvimento de Apps & Lojas', desc: es ? 'Creación de ecosistemas completos y rápidos enfocados en la mejor experiencia de compra para el usuario.' : 'Criação de ecossistemas completos e rápidos focados na melhor experiência de compra para o usuário.', gradient: 'linear-gradient(135deg, #7C3AED, #F59E0B)' },
    { icon: <Monitor size={32} />, title: es ? 'Paquetes de Diseño' : 'Pacotes De Artes', desc: es ? 'Diseños creativos y personalizados para fortalecer tu marca y enganchar a tu público.' : 'Designs criativos e personalizados para fortalecer sua marca e engajar seu público.', gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)' },
    { icon: <PieChart size={32} />, title: es ? 'Automatización Inteligente' : 'Automação Inteligente', desc: es ? 'Optimizamos procesos e interacciones con automatizaciones que aumentan la eficiencia y mejoran la experiencia del cliente.' : 'Otimizamos processos e interações com automações que aumentam a eficiência e melhoram a experiência do cliente.', gradient: 'linear-gradient(135deg, #00DF81, #00AAFF)' },
    { icon: <Users size={32} />, title: es ? 'Asistente Virtual' : 'Assistente Virtual', desc: es ? 'Atención rápida y eficiente 24/7 para impulsar tu negocio y mejorar la experiencia del cliente.' : 'Atendimento rápido e eficiente 24/7 para impulsionar seu negócio e melhorar a experiência do cliente.', gradient: 'linear-gradient(135deg, #EF4444, #F59E0B)' },
  ];

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header dict={dict} locale={locale} />
      <div className="ecom-page">
        <section className="ecom-hero">
          <div className="ecom-glow-1"></div>
          <div className="ecom-container">
            <div className="ecom-hero-grid">
              <div className="ecom-hero-content ecom-fade-in">
                <div className="ecom-badge"><Zap size={14} /><span>{es ? 'Especialistas en E-commerce' : 'Especialistas em E-commerce'}</span></div>
                <h1 className="ecom-hero-title">{es ? 'Escala tu e-commerce con marketing de' : 'Escale o seu e-commerce com marketing de'} <span className="text-gradient">{es ? 'alto rendimiento' : 'alta performance'}</span></h1>
                <p className="ecom-hero-subtitle">{es ? 'Transformamos ideas en resultados reales. Capta nuevos clientes, reduce el costo de adquisición y aumenta las ventas de tu tienda virtual con estrategias comprobadas.' : 'Transformamos ideias em resultados reais. Capte novos clientes, reduza o custo de aquisição e aumente as vendas da sua loja virtual com estratégias comprovadas.'}</p>
                <div className="ecom-hero-actions">
                  <a href="#ecom-contact" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem', gap: '8px' }}>{es ? 'Quiero crecer mi negocio' : 'Quero crescer meu negócio'} <ArrowRight size={20} /></a>
                  <a href="#ecom-portfolio" className="ecom-btn-outline">{es ? 'Ver casos de éxito' : 'Ver casos de sucesso'}</a>
                </div>
              </div>
              <div className="ecom-hero-visual ecom-fade-in">
                <div className="ecom-float-card ecom-float-anim">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', fontWeight: 600 }}><BarChart3 size={24} color="var(--accent-primary)" /><span>{es ? 'Crecimiento de Ventas Mensual' : 'Crescimento de Vendas Mensal'}</span></div>
                  <div className="ecom-chart-mockup"><div className="ecom-bar" style={{ height: '30%' }}></div><div className="ecom-bar" style={{ height: '50%' }}></div><div className="ecom-bar" style={{ height: '75%' }}></div><div className="ecom-bar" style={{ height: '100%' }}></div></div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#10b981' }}>+248% vs {es ? 'mes anterior' : 'mês anterior'}</div>
                </div>
                <div className="ecom-float-card ecom-float-card-small ecom-float-anim-delayed"><Rocket size={40} color="#f2295f" /><h4>{es ? 'Campaña Activa' : 'Campanha Ativa'}</h4><p>ROAS: 8.5x</p></div>
              </div>
            </div>
            <div className="ecom-stats-row">
              <div className="ecom-stat"><h3>+150%</h3><p>{es ? 'Aumento' : 'Aumento'}<br />{es ? 'en conversiones' : 'em conversões'}</p></div>
              <div className="ecom-stat"><h3>R$ 50M+</h3><p>{es ? 'Gestionados' : 'Gerenciados'}<br />{es ? 'en Ads' : 'em Ads'}</p></div>
              <div className="ecom-stat"><h3>99</h3><p>{es ? 'Negocios' : 'Negócios'}<br />{es ? 'Lanzados' : 'Lançados'}</p></div>
              <div className="ecom-stat"><h3>210</h3><p>{es ? 'Proyectos' : 'Projetos'}<br />{es ? 'Completos' : 'Completos'}</p></div>
            </div>
          </div>
        </section>

        <section id="ecom-services" className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="ecom-container">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: '16px' }}>{es ? 'Soluciones estratégicas para tu' : 'Soluções estratégicas para o seu'} <span className="text-gradient">{es ? 'crecimiento' : 'crescimento'}</span></h2>
              <p className="text-secondary" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>{es ? 'Metodologías exclusivas enfocadas enteramente en tiendas virtuales y productos on demand.' : 'Metodologias exclusivas focadas inteiramente em lojas virtuais e produtos on demand.'}</p>
            </div>
            <div className="ecom-services-grid">
              {servicesData.map((service, idx) => (<div key={idx} className="ecom-service-card"><div className="ecom-service-icon" style={{ background: service.gradient }}>{service.icon}</div><h3>{service.title}</h3><p className="text-secondary">{service.desc}</p></div>))}
            </div>
          </div>
        </section>

        <section id="ecom-portfolio" className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--bg-tertiary)' }}>
          <div className="ecom-container">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: '16px' }}>{es ? 'Transformamos ideas en' : 'Transformamos ideias em'} <span className="text-gradient">{es ? 'resultados reales' : 'resultados reais'}</span></h2>
              <p className="text-secondary" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>{es ? 'Mira algunos de nuestros proyectos y UI Kits recientes.' : 'Confira alguns de nossos projetos e UI Kits recentes.'}</p>
            </div>
            <div className="ecom-portfolio-grid">
              {[
                { title: 'Ecale', desc: es ? 'E-commerce de Moda' : 'E-commerce de Moda', link: 'https://ecale.com.br/', isHighlight: true, image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800' },
                { title: 'Joyce Fenolio', desc: es ? 'Joyas y Semijoyas' : 'Joias & Semijoias', link: 'https://www.joycefenolio.com.br/', isHighlight: false, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80' },
                { title: 'SportSystem', desc: es ? 'Automotriz y Tuning' : 'Automotiva & Tuning', link: 'https://sportsystem.com.br/', isHighlight: false, image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80' },
                { title: 'Tutti Sabores', desc: es ? 'Dulcería y Confitería' : 'Doceria & Confeitaria', link: 'https://tuttisabores.com.br/', isHighlight: false, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80' },
              ].map((item, idx) => (
                <div key={idx} className={`ecom-portfolio-item ${item.isHighlight ? 'ecom-item-highlight' : ''}`}>
                  <div className="ecom-portfolio-img"><img src={item.image} alt={item.title} />{item.isHighlight && <div className="ecom-case-badge">{es ? 'Verificado' : 'Verificado'}</div>}</div>
                  <div style={{ padding: '24px' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '8px', color: item.isHighlight ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}>{item.desc}</div>
                    <h4 style={{ fontSize: item.isHighlight ? '1.5rem' : '1.25rem', marginBottom: '12px' }}>{item.title}</h4>
                    <a href={item.link} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.875rem' }}>{es ? 'Acceder al sitio' : 'Acessar site'} <ChevronRight size={16} /></a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ecom-contact" className="section-padding" style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--bg-tertiary)' }}>
          <div className="ecom-container">
            <div className="ecom-cta-box">
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginBottom: '16px' }}>{es ? '¿Listo para' : 'Pronto para'} <span className="text-gradient">{es ? 'transformar' : 'transformar'}</span> {es ? 'tu negocio?' : 'seu negócio?'}</h2>
              <p className="text-secondary" style={{ fontSize: '1.125rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>{es ? 'Déjanos ayudarte a escalar tus ventas con estrategias que realmente funcionan.' : 'Deixe-nos ajudar você a escalar suas vendas com estratégias que realmente funcionam.'}</p>
              <form className="ecom-cta-form" onSubmit={handleLeadCapture}>
                <input type="text" placeholder={es ? 'Tu nombre completo' : 'Seu nome completo'} required value={nome} onChange={e => setNome(e.target.value)} />
                <div className="ecom-input-row">
                  <input type="email" placeholder={es ? 'Tu mejor e-mail corporativo' : 'Seu melhor e-mail corporativo'} required value={email} onChange={e => setEmail(e.target.value)} />
                  <input type="text" placeholder={es ? 'Tu WhatsApp (Ej: 11 99999-9999)' : 'Seu WhatsApp (Ex: 11 99999-9999)'} required maxLength={15} value={whatsapp} onChange={handleWhatsappChange} />
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem', width: '100%', marginTop: '8px' }} disabled={isSubmitting}>{isSubmitting ? (es ? 'Agendando...' : 'Agendando...') : (es ? 'Agendar Consultoría Gratuita' : 'Agendar Consultoria Gratuita')}</button>
              </form>
            </div>
          </div>
        </section>
      </div>
      <Footer dict={dict} locale={locale} />
    </main>
  );
}
