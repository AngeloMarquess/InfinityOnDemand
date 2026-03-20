'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, BarChart3, Rocket, Target, ShoppingCart, Smartphone, Globe, Mail, ChevronRight, Zap, Monitor, PieChart, Users, ShieldCheck, Shield, Cloud } from 'lucide-react';
import Link from 'next/link';
import './ecommerce.css';

export default function EcommercePage() {
  const [scrolled, setScrolled] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, whatsapp }),
      });
      if (!res.ok) throw new Error('Failed');
      window.location.href = 'https://calendly.com/angelobritoo/consultoria-trafego-pago';
    } catch {
      alert('Houve um erro ao enviar suas informações. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ecom-page">
      <div className="bg-glow-1"></div>

      {/* Navbar */}
      <nav className={`nav-container ${scrolled ? 'nav-scrolled glass' : ''}`}>
        <div className="container nav-content">
          <div className="logo">
            <span className="logo-text">Infinity<span className="text-gradient">OnDemand</span></span>
          </div>
          <div className="nav-links">
            <a href="#services">Serviços</a>
            <a href="#portfolio">Portfólio</a>
            <a href="#results">Resultados</a>
          </div>
          <a href="https://wa.me/5581971027939" target="_blank" rel="noreferrer" className="btn btn-primary sm-btn">
            Fale com Especialista
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content animate-fade-in">
            <div className="badge">
              <Zap size={14} className="text-gradient" />
              <span>Especialistas em E-commerce</span>
            </div>
            <h1 className="hero-title">
              Escale o seu e-commerce com marketing de <span className="text-gradient-accent">alta performance</span>
            </h1>
            <p className="hero-subtitle delay-1">
              Transformamos ideias em resultados reais. Capte novos clientes, reduza o custo de aquisição e aumente as vendas da sua loja virtual com estratégias comprovadas.
            </p>
            <div className="hero-actions delay-2">
              <a href="#contact" className="btn btn-primary btn-lg">
                Quero crescer meu negócio <ArrowRight size={20} />
              </a>
              <a href="#portfolio" className="btn btn-outline btn-lg">
                Ver casos de sucesso
              </a>
            </div>
          </div>

          <div className="hero-visual animate-fade-in delay-2">
            <div className="card glass float-anim">
              <div className="card-header">
                <BarChart3 size={24} color="#00ff87" />
                <span>Crescimento de Vendas Mensal</span>
              </div>
              <div className="chart-mockup">
                <div className="bar" style={{ height: '30%' }}></div>
                <div className="bar" style={{ height: '50%' }}></div>
                <div className="bar" style={{ height: '75%' }}></div>
                <div className="bar" style={{ height: '100%' }}></div>
              </div>
              <div className="card-footer">
                <span className="text-success">+248% vs mês anterior</span>
              </div>
            </div>
            <div className="card glass float-anim-delayed abstract-shape">
              <Rocket size={40} color="#f2295f" />
              <h4>Campanha Ativa</h4>
              <p>ROAS: 8.5x</p>
            </div>
          </div>

          <div className="hero-stats delay-3" style={{ gridColumn: '1 / -1', width: '100%', justifyContent: 'center' }}>
            <div className="stat"><h3>+150%</h3><p>Aumento<br />em conversões</p></div>
            <div className="stat"><h3>R$ 50M+</h3><p>Gerenciados<br />em Ads</p></div>
            <div className="stat"><h3>99</h3><p>Negócios<br />Lançados</p></div>
            <div className="stat"><h3>210</h3><p>Projetos<br />Completos</p></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section">
        <div className="bg-glow-2"></div>
        <div className="container">
          <div className="section-header center mb-60">
            <h2 className="section-title">Soluções estratégicas para o seu crescimento</h2>
            <p className="section-desc">Metodologias exclusivas focadas inteiramente em lojas virtuais e produtos on demand.</p>
          </div>
          <div className="services-grid">
            {[
              { icon: <Target size={32} />, title: 'Tráfego Pago p/ E-commerce', desc: 'Campanhas de Google Ads e Meta Ads desenhadas especificamente para converter produtos e escalar seu ROAS.', color: 'var(--primary)', bgStyle: 'rgba(0, 255, 135, 0.1)' },
              { icon: <ShoppingCart size={32} />, title: 'Otimização de Conversão (CRO)', desc: 'Análise UX e melhorias contínuas no seu site para transformar mais visitantes em clientes pagantes.', color: 'var(--primary)', bgStyle: 'rgba(0, 255, 135, 0.1)' },
              { icon: <Smartphone size={32} />, title: 'Desenvolvimento de Apps & Lojas', desc: 'Criação de ecossistemas completos e rápidos focados na melhor experiência de compra para o usuário.', color: 'var(--primary)', bgStyle: 'rgba(0, 255, 135, 0.1)' },
              { icon: <Monitor size={32} />, title: 'Pacotes De Artes', desc: 'Designs criativos e personalizados para fortalecer sua marca e engajar seu público.', color: '#eab308', bgStyle: 'rgba(234, 179, 8, 0.1)' },
              { icon: <PieChart size={32} />, title: 'Automação Inteligente', desc: 'Otimizamos processos e interações com automações que aumentam a eficiência e melhoram a experiência do cliente.', color: '#00ff87', bgStyle: 'rgba(0, 255, 135, 0.1)' },
              { icon: <Users size={32} />, title: 'Assistente Virtual', desc: 'Atendimento rápido e eficiente 24/7 para impulsionar seu negócio e melhorar a experiência do cliente.', color: '#ef4444', bgStyle: 'rgba(239, 68, 68, 0.1)' },
            ].map((service, idx) => (
              <div key={idx} className="service-card glass">
                <div className="service-icon" style={{ backgroundColor: service.bgStyle, color: service.color }}>
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="section bg-card">
        <div className="container">
          <div className="section-header mb-60">
            <h2 className="section-title">Transformamos ideias em <span className="text-gradient">resultados reais</span></h2>
            <p className="section-desc">Confira alguns de nossos projetos e UI Kits recentes.</p>
          </div>
          <div className="portfolio-grid">
            {[
              { title: 'Ecale', desc: 'E-commerce de Moda', link: 'https://ecale.com.br/', isHighlight: true, image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800' },
              { title: 'Joyce Fenolio', desc: 'Joias & Semijoias', link: 'https://www.joycefenolio.com.br/', isHighlight: false, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80' },
              { title: 'SportSystem', desc: 'Automotiva & Tuning', link: 'https://sportsystem.com.br/', isHighlight: false, image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80' },
              { title: 'Tutti Sabores', desc: 'Doceria & Confeitaria', link: 'https://tuttisabores.com.br/', isHighlight: false, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80' },
            ].map((item, idx) => (
              <div key={idx} className={`portfolio-item glass ${item.isHighlight ? 'item-highlight' : ''}`}>
                <div className="portfolio-img-placeholder">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="portfolio-cover-img" />
                  ) : (
                    <Globe size={48} className="text-muted opacity-50" />
                  )}
                  {item.isHighlight && <div className="case-badge">Verificado</div>}
                </div>
                <div className="portfolio-info">
                  <div className={`portfolio-category ${item.isHighlight ? 'text-gradient-accent' : 'text-muted'}`}>
                    {item.desc}
                  </div>
                  <h4 className={item.isHighlight ? 'portfolio-title-highlight' : ''}>{item.title}</h4>
                  <a href={item.link} target="_blank" rel="noreferrer" className="portfolio-link">
                    Acessar site <ChevronRight size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="section cta-section">
        <div className="container">
          <div className="cta-box glass">
            <h2>Pronto para transformar seu negócio?</h2>
            <p>Deixe-nos ajudar você a escalar suas vendas com estratégias que realmente funcionam.</p>
            <form className="cta-form" onSubmit={handleLeadCapture}>
              <div className="form-group">
                <input type="text" placeholder="Seu nome completo" required value={nome} onChange={e => setNome(e.target.value)} />
              </div>
              <div className="input-row">
                <input type="email" placeholder="Seu melhor e-mail corporativo" required value={email} onChange={e => setEmail(e.target.value)} />
                <input type="text" placeholder="Seu WhatsApp (Ex: 11 99999-9999)" required maxLength={15} value={whatsapp} onChange={handleWhatsappChange} />
              </div>
              <button type="submit" className="btn btn-primary btn-lg cta-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Agendando...' : 'Agendar Consultoria Gratuita'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="trust-badges-section">
        <div className="container">
          <p className="trust-title">Parceiro Oficial & Segurança Garantida</p>
          <div className="trust-badges-flex">
            <div className="trust-badge nuvemshop-badge">
              <div className="n-logo-text"><Cloud size={20} /> nuvemshop</div>
              <div className="n-partner-text">Silver<br />Partner</div>
            </div>
            <div className="trust-badge security-badge">
              <ShieldCheck size={28} />
              <div className="security-text"><strong>SITE SEGURO</strong><span>SSL 256 BITS</span></div>
            </div>
            <div className="trust-badge security-badge">
              <Shield size={28} />
              <div className="security-text"><strong>Google</strong><span>Safe Browsing</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container ecom-footer-grid">
          <div className="footer-col">
            <div className="logo">
              <span className="logo-text">Infinity<span className="text-gradient">OnDemand</span></span>
            </div>
            <p className="footer-desc">Marketing digital de alta performance focado em e-commerce.</p>
            <div className="contact-info">
              <a href="mailto:contato@infinityondemand.com.br" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit', textDecoration: 'none' }}>
                <Mail size={16} /> contato@infinityondemand.com.br
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Navegação</h4>
            <a href="#services">Serviços</a>
            <a href="#portfolio">Portfólio</a>
            <a href="#contact">Contato</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Termos de Serviço</a>
            <Link href="/privacy">Política de Privacidade</Link>
          </div>
        </div>
        <div className="container">
          <div className="ecom-footer-bottom">
            <p>&copy; {new Date().getFullYear()} Infinity on Demand. Todos os direitos reservados. | CNPJ: 53.316.174/0001-24</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
