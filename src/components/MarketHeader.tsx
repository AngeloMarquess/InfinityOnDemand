'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronDown, 
  Store, 
  Smartphone, 
  MessageSquare, 
  ScanBarcode, 
  Truck, 
  LayoutDashboard, 
  Award, 
  Cpu, 
  Headphones, 
  ArrowRight, 
  Menu, 
  X,
  ExternalLink,
  ShieldCheck,
  Zap,
  TrendingUp
} from 'lucide-react';

interface MarketHeaderProps {
  locale?: string;
}

export default function MarketHeader({ locale = 'pt' }: MarketHeaderProps) {
  const [platformOpen, setPlatformOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilePlatformAccordion, setMobilePlatformAccordion] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const prefix = locale === 'pt' ? '' : `/${locale}`;

  const solutions = {
    vender: [
      {
        title: 'Loja online',
        desc: 'Site white-label no seu domínio, feito para supermercado.',
        href: `${prefix}/market/solucoes/loja-online`,
        icon: Store,
        color: '#00DF81',
      },
      {
        title: 'Aplicativo',
        desc: 'iOS e Android com a sua marca, publicados nas lojas oficiais.',
        href: `${prefix}/market/solucoes/aplicativo`,
        icon: Smartphone,
        color: '#00AAFF',
      },
      {
        title: 'Vendas pelo WhatsApp',
        desc: 'Atendimento com IA que fecha o pedido direto na conversa.',
        href: `${prefix}/market/solucoes/whatsapp`,
        icon: MessageSquare,
        color: '#25D366',
      },
    ],
    operar: [
      {
        title: 'Separação',
        desc: 'App do separador com conferência, bipagem e pesáveis.',
        href: `${prefix}/market/solucoes/separacao`,
        icon: ScanBarcode,
        color: '#F59E0B',
      },
      {
        title: 'Entregas',
        desc: 'App do motorista, rotas otimizadas e rastreio em tempo real.',
        href: `${prefix}/market/solucoes/entregas`,
        icon: Truck,
        color: '#EC4899',
      },
      {
        title: 'Gestão',
        desc: 'Pedidos em tempo real, catálogo inteligente, multilojas e relatórios.',
        href: `${prefix}/market/solucoes/gestao`,
        icon: LayoutDashboard,
        color: '#8B5CF6',
      },
    ],
    crescer: [
      {
        title: 'Fidelidade e marketing',
        desc: 'Clube de assinatura, cashback, cupons e notificações push.',
        href: `${prefix}/market/solucoes/fidelidade`,
        icon: Award,
        color: '#EAB308',
      },
      {
        title: 'Integrações ERP',
        desc: 'Sincronização em tempo real com seu PDV, ERP e pagamentos.',
        href: `${prefix}/market/solucoes/integracoes`,
        icon: Cpu,
        color: '#06B6D4',
      },
      {
        title: 'Atendimento',
        desc: 'Implantação guiada, treinamento da equipe e suporte humano.',
        href: `${prefix}/market/solucoes/atendimento`,
        icon: Headphones,
        color: '#10B981',
      },
    ],
  };

  const closeDropdown = () => {
    setPlatformOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%',
          backgroundColor: scrolled ? 'rgba(11, 15, 25, 0.95)' : 'rgba(11, 15, 25, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          {/* Logo Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link href={`${prefix}/market`} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <img src="/logo-infinity.png" alt="Infinity OnDemand" style={{ height: '36px', width: 'auto' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.5px', color: '#F8FAFC' }}>
                  Infinity
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, #00DF81 0%, #00AAFF 100%)',
                    color: '#070B14',
                  }}
                >
                  Market
                </span>
              </div>
            </Link>

            <span
              style={{
                display: 'inline-block',
                width: '1px',
                height: '22px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                margin: '0 4px',
              }}
              className="hidden lg:block"
            />

            <Link
              href={`${prefix}/`}
              style={{
                fontSize: '12px',
                color: '#94A3B8',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'color 0.2s',
              }}
              className="hidden lg:flex"
            >
              ← Voltar ao site principal
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            className="hidden md:flex"
          >
            {/* Mega Menu Dropdown Button "Plataforma" */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setPlatformOpen(true)}
              onMouseLeave={() => setPlatformOpen(false)}
            >
              <button
                type="button"
                onClick={() => setPlatformOpen(!platformOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: platformOpen ? 'rgba(0, 223, 129, 0.1)' : 'transparent',
                  color: platformOpen ? '#00DF81' : '#F8FAFC',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <span>Plataforma</span>
                <ChevronDown
                  size={15}
                  style={{
                    transform: platformOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>

              {/* Mega-Menu Container (Estilo Instabuy) */}
              {platformOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '-180px',
                    width: '980px',
                    paddingTop: '12px',
                    zIndex: 1100,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#0F172A',
                      border: '1px solid rgba(0, 223, 129, 0.25)',
                      borderRadius: '18px',
                      padding: '28px',
                      boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 223, 129, 0.1)',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr 280px',
                      gap: '24px',
                    }}
                  >
                    {/* Coluna 1: Vender */}
                    <div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          color: '#00DF81',
                          marginBottom: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Zap size={14} /> Vender
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {solutions.vender.map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={idx}
                              href={item.href}
                              onClick={closeDropdown}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                textDecoration: 'none',
                                padding: '8px',
                                borderRadius: '10px',
                                transition: 'background-color 0.2s',
                              }}
                              className="hover:bg-slate-800/60"
                            >
                              <div
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '10px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  border: `1px solid ${item.color}33`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: item.color,
                                  flexShrink: 0,
                                }}
                              >
                                <Icon size={18} />
                              </div>
                              <div>
                                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#F8FAFC', marginBottom: '2px' }}>
                                  {item.title}
                                </div>
                                <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.4 }}>
                                  {item.desc}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Coluna 2: Operar */}
                    <div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          color: '#00AAFF',
                          marginBottom: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <ShieldCheck size={14} /> Operar
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {solutions.operar.map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={idx}
                              href={item.href}
                              onClick={closeDropdown}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                textDecoration: 'none',
                                padding: '8px',
                                borderRadius: '10px',
                                transition: 'background-color 0.2s',
                              }}
                              className="hover:bg-slate-800/60"
                            >
                              <div
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '10px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  border: `1px solid ${item.color}33`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: item.color,
                                  flexShrink: 0,
                                }}
                              >
                                <Icon size={18} />
                              </div>
                              <div>
                                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#F8FAFC', marginBottom: '2px' }}>
                                  {item.title}
                                </div>
                                <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.4 }}>
                                  {item.desc}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Coluna 3: Crescer */}
                    <div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          color: '#C084FC',
                          marginBottom: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <TrendingUp size={14} /> Crescer
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {solutions.crescer.map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={idx}
                              href={item.href}
                              onClick={closeDropdown}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                textDecoration: 'none',
                                padding: '8px',
                                borderRadius: '10px',
                                transition: 'background-color 0.2s',
                              }}
                              className="hover:bg-slate-800/60"
                            >
                              <div
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '10px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  border: `1px solid ${item.color}33`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: item.color,
                                  flexShrink: 0,
                                }}
                              >
                                <Icon size={18} />
                              </div>
                              <div>
                                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#F8FAFC', marginBottom: '2px' }}>
                                  {item.title}
                                </div>
                                <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.4 }}>
                                  {item.desc}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Coluna 4: Card Destaque Case OxeeGo */}
                    <div
                      style={{
                        backgroundColor: '#1E293B',
                        borderRadius: '14px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: '1px solid rgba(0, 223, 129, 0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '10px',
                            fontWeight: 800,
                            letterSpacing: '0.8px',
                            textTransform: 'uppercase',
                            padding: '3px 8px',
                            borderRadius: '999px',
                            backgroundColor: 'rgba(0, 223, 129, 0.15)',
                            color: '#00DF81',
                            marginBottom: '10px',
                          }}
                        >
                          ★ Case de Sucesso
                        </div>

                        <div style={{ position: 'relative', width: '100%', height: '105px', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
                          <img
                            src="/market/oxeego_hero_products.png"
                            alt="Produtos Frescos OxeeGo"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '6px',
                              left: '8px',
                              backgroundColor: 'rgba(11, 15, 25, 0.85)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '10px',
                              fontWeight: 800,
                              color: '#F8FAFC',
                            }}
                          >
                            OxeeGo • Recife/PE
                          </div>
                        </div>

                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#F8FAFC', marginBottom: '4px' }}>
                          Feira no Piloto Automático
                        </div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.4, marginBottom: '12px' }}>
                          Como a OxeeGo usa o app do separador, entregas e clube de assinatura para entregar hortifrúti em minutos.
                        </div>
                      </div>

                      <Link
                        href={`${prefix}/market#case-oxeego`}
                        onClick={closeDropdown}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#00DF81',
                          textDecoration: 'none',
                        }}
                      >
                        Conhecer o case <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`${prefix}/market#case-oxeego`}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#F8FAFC',
                textDecoration: 'none',
              }}
            >
              Case OxeeGo
            </Link>

            <Link
              href={`${prefix}/market#solucoes`}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#F8FAFC',
                textDecoration: 'none',
              }}
            >
              Soluções
            </Link>

            <Link
              href={`${prefix}/market#diferenciais`}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#F8FAFC',
                textDecoration: 'none',
              }}
            >
              Diferenciais
            </Link>

            <Link
              href={`${prefix}/market#faq`}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#F8FAFC',
                textDecoration: 'none',
              }}
            >
              Dúvidas
            </Link>
          </nav>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href="https://wa.me/5581981280719?text=Ol%C3%A1%2C+gostaria+de+conhecer+o+Infinity+Market+para+meu+supermercado."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '10px',
                background: 'linear-gradient(90deg, #00DF81 0%, #00AAFF 100%)',
                color: '#070B14',
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '0.2px',
                textDecoration: 'none',
                boxShadow: '0 0 20px rgba(0, 223, 129, 0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              className="hover:scale-105"
            >
              <span>Falar com especialista</span>
              <ArrowRight size={15} />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              style={{
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#F8FAFC',
                cursor: 'pointer',
              }}
              className="md:hidden flex items-center justify-center"
              aria-label="Abrir menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ========== MOBILE MENU DRAWER ========== */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            backgroundColor: 'rgba(5, 8, 17, 0.98)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '20px',
          }}
        >
          {/* Header Drawer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/logo-infinity.png" alt="Infinity OnDemand" style={{ height: '32px', width: 'auto' }} />
              <span style={{ fontSize: '16px', fontWeight: 900, color: '#F8FAFC' }}>Infinity Market</span>
            </div>
            <button
              type="button"
              onClick={closeMobileMenu}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                color: '#F8FAFC',
                cursor: 'pointer',
              }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Links Rápidos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => setMobilePlatformAccordion(!mobilePlatformAccordion)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                background: 'rgba(0, 223, 129, 0.08)',
                border: '1px solid rgba(0, 223, 129, 0.2)',
                padding: '12px 16px',
                borderRadius: '10px',
                color: '#00DF81',
                fontSize: '15px',
                fontWeight: 800,
                textAlign: 'left',
              }}
            >
              <span>🛒 Plataforma & Soluções</span>
              <ChevronDown
                size={18}
                style={{
                  transform: mobilePlatformAccordion ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>

            {/* Accordion Soluções */}
            {mobilePlatformAccordion && (
              <div
                style={{
                  backgroundColor: '#111827',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#00DF81', textTransform: 'uppercase' }}>Vender</div>
                {solutions.vender.map((s, i) => (
                  <Link
                    key={i}
                    href={s.href}
                    onClick={closeMobileMenu}
                    style={{ fontSize: '13px', color: '#F8FAFC', textDecoration: 'none', padding: '6px 8px' }}
                  >
                    • {s.title}
                  </Link>
                ))}

                <div style={{ fontSize: '11px', fontWeight: 800, color: '#00AAFF', textTransform: 'uppercase', marginTop: '6px' }}>Operar</div>
                {solutions.operar.map((s, i) => (
                  <Link
                    key={i}
                    href={s.href}
                    onClick={closeMobileMenu}
                    style={{ fontSize: '13px', color: '#F8FAFC', textDecoration: 'none', padding: '6px 8px' }}
                  >
                    • {s.title}
                  </Link>
                ))}

                <div style={{ fontSize: '11px', fontWeight: 800, color: '#C084FC', textTransform: 'uppercase', marginTop: '6px' }}>Crescer</div>
                {solutions.crescer.map((s, i) => (
                  <Link
                    key={i}
                    href={s.href}
                    onClick={closeMobileMenu}
                    style={{ fontSize: '13px', color: '#F8FAFC', textDecoration: 'none', padding: '6px 8px' }}
                  >
                    • {s.title}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href={`${prefix}/market#case-oxeego`}
              onClick={closeMobileMenu}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                color: '#F8FAFC',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              ★ Case Oficial OxeeGo
            </Link>

            <Link
              href={`${prefix}/market#diferenciais`}
              onClick={closeMobileMenu}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                color: '#F8FAFC',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Diferenciais para Supermercados
            </Link>

            <Link
              href={`${prefix}/`}
              onClick={closeMobileMenu}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                color: '#94A3B8',
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              ← Voltar ao site Infinity On Demand
            </Link>
          </div>

          {/* CTA Mobile */}
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <a
              href="https://wa.me/5581981280719?text=Ol%C3%A1%2C+gostaria+de+conhecer+o+Infinity+Market+para+meu+supermercado."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(90deg, #00DF81 0%, #00AAFF 100%)',
                color: '#070B14',
                fontSize: '15px',
                fontWeight: 900,
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              <span>Falar com especialista no WhatsApp</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
