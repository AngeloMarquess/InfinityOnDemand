'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Palette, 
  TrendingUp, 
  Globe, 
  ShoppingBag, 
  Sparkles, 
  Store, 
  Truck, 
  CheckCircle2, 
  LayoutDashboard, 
  BarChart3, 
  ChevronDown, 
  User, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Header({ dict, locale }: { dict?: any; locale?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'services' | 'platforms' | null>(null);
  
  // Mobile accordions
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobilePlatformsOpen, setMobilePlatformsOpen] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentLocale = locale || 'pt';
  const prefix = currentLocale === 'pt' ? '' : `/${currentLocale}`;
  const t = dict?.header || {
    servicos: 'Serviços',
    plataformas: 'Plataformas & SaaS',
    branding: 'Branding & Design',
    sobre: 'Sobre', 
    labs: 'Labs', 
    consultoria: 'Consultoria', 
    academy: 'Academy', 
    ecommerce: 'E-commerce',
    crm: 'CRM', 
    delivery: 'Delivery SaaS', 
    analytics: 'Analytics', 
    contato: 'Contato',
    inicio: 'Início', 
    sobreNos: 'Sobre nós', 
    testeAgora: 'Teste agora', 
    login: 'Login',
    market: 'Market'
  };
  const academyLabel = t.academy || 'Academy';

  const closeMenu = () => {
    setMenuOpen(false);
    setMobileServicesOpen(false);
    setMobilePlatformsOpen(false);
  };

  const handleMouseEnter = (menu: 'services' | 'platforms') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  // Language switcher
  const otherLocale = currentLocale === 'pt' ? 'es' : 'pt';
  const otherFlag = currentLocale === 'pt' ? '🇪🇸' : '🇧🇷';
  const switchPath = otherLocale === 'pt' ? '/' : `/${otherLocale}`;

  return (
    <>
      <header style={{
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        position: "sticky",
        top: 0,
        backgroundColor: "rgba(11, 15, 25, 0.92)",
        backdropFilter: "blur(14px)",
        zIndex: 100
      }}>
        {/* Brand Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
          <Link href={prefix || '/'} style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
            <img src="/logo-infinity.png" alt="Infinity OnDemand" style={{ height: "40px", width: "auto" }} />
          </Link>
        </div>

        {/* Compact Desktop Nav with Categorized Submenus */}
        <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          
          {/* ========== SUBMENU 1: SERVIÇOS DIGITAIS ========== */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => handleMouseEnter('services')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'services' ? null : 'services')}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                color: activeDropdown === 'services' ? "#00DF81" : "var(--text-primary)",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: activeDropdown === 'services' ? "rgba(0, 223, 129, 0.1)" : "transparent",
                transition: "all 0.2s",
                cursor: "pointer",
                border: "none",
                fontSize: "14px"
              }}
            >
              <span>{t.servicos || 'Serviços'}</span>
              <ChevronDown 
                size={14} 
                style={{ 
                  transform: activeDropdown === 'services' ? 'rotate(180deg)' : 'none', 
                  transition: 'transform 0.2s',
                  color: activeDropdown === 'services' ? '#00DF81' : '#94A3B8'
                }} 
              />
            </button>

            {/* Dropdown Menu: Serviços */}
            {activeDropdown === 'services' && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "0",
                  paddingTop: "10px",
                  zIndex: 1000,
                  width: "480px"
                }}
              >
                <div style={{
                  backgroundColor: "#0F172A",
                  border: "1px solid rgba(0, 223, 129, 0.28)",
                  borderRadius: "16px",
                  padding: "18px",
                  boxShadow: "0 20px 45px rgba(0, 0, 0, 0.8)",
                  backdropFilter: "blur(18px)"
                }}>
                  {/* Top Bar inside Dropdown */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00DF81", boxShadow: "0 0 10px #00DF81" }} />
                      <strong style={{ fontSize: "12px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>Agência & Aceleração Digital</strong>
                    </div>
                    <span style={{ fontSize: "11px", color: "#00DF81", fontWeight: 700 }}>Projetos Sob Medida</span>
                  </div>

                  {/* Solutions Grid */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                    
                    {/* Item 1: BRANDING & DESIGN (NOVO) */}
                    <Link
                      href={`${prefix}/branding`}
                      onClick={() => setActiveDropdown(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        background: "linear-gradient(90deg, rgba(0, 223, 129, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%)",
                        border: "1px solid rgba(0, 223, 129, 0.35)",
                        textDecoration: "none",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#00DF81"; e.currentTarget.style.transform = "translateX(3px)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(0, 223, 129, 0.35)"; e.currentTarget.style.transform = "translateX(0)"; }}
                    >
                      <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(0, 223, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00DF81", flexShrink: 0 }}>
                        <Palette size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Branding & Design</span>
                          <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "999px", background: "#00DF81", color: "#0B0F19", fontWeight: 800 }}>NOVO</span>
                        </div>
                        <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>Identidade visual, logos, brand book & design system</div>
                      </div>
                    </Link>

                    {/* Item 2: TRÁFEGO PAGO */}
                    <Link
                      href={`${prefix}/trafego`}
                      onClick={() => setActiveDropdown(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        textDecoration: "none",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#00AAFF"; e.currentTarget.style.background = "rgba(0, 170, 255, 0.08)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"; }}
                    >
                      <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(0, 170, 255, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00AAFF", flexShrink: 0 }}>
                        <TrendingUp size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Tráfego Pago & Performance</div>
                        <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>Escala de vendas no Meta Ads e Google Ads com foco em ROI</div>
                      </div>
                    </Link>

                    {/* Item 3: SITES INSTITUCIONAIS */}
                    <Link
                      href={`${prefix}/site-institucional`}
                      onClick={() => setActiveDropdown(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        textDecoration: "none",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#8B5CF6"; e.currentTarget.style.background = "rgba(139, 92, 246, 0.08)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"; }}
                    >
                      <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(139, 92, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8B5CF6", flexShrink: 0 }}>
                        <Globe size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Sites & Landing Pages</div>
                        <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>Páginas corporativas velozes e de alta conversão</div>
                      </div>
                    </Link>

                    {/* Item 4: E-COMMERCE */}
                    <Link
                      href={`${prefix}/ecommerce`}
                      onClick={() => setActiveDropdown(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        textDecoration: "none",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#F59E0B"; e.currentTarget.style.background = "rgba(245, 158, 11, 0.08)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"; }}
                    >
                      <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(245, 158, 11, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#F59E0B", flexShrink: 0 }}>
                        <ShoppingBag size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>E-commerce Customizado</div>
                        <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>Lojas virtuais robustas com alta taxa de conversão</div>
                      </div>
                    </Link>

                    {/* Item 5: CONSULTORIA ESTRATÉGICA */}
                    <Link
                      href={`${prefix}/consultoria`}
                      onClick={() => setActiveDropdown(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        textDecoration: "none",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#EC4899"; e.currentTarget.style.background = "rgba(236, 72, 153, 0.08)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"; }}
                    >
                      <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(236, 72, 153, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#EC4899", flexShrink: 0 }}>
                        <Sparkles size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Consultoria Estratégica</div>
                        <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>Diagnóstico, processos e alavancagem de receita</div>
                      </div>
                    </Link>

                  </div>

                  {/* Bottom Footer inside Dropdown */}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", color: "#94A3B8" }}>Precisa de uma proposta sob medida?</span>
                    <a
                      href="https://wa.me/5581981280719?text=Ol%C3%A1!%20Gostaria%20de%20um%20diagn%C3%B3stico%20para%20minha%20empresa."
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "12px", color: "#00DF81", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      <span>Falar no WhatsApp</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* ========== SUBMENU 2: PLATAFORMAS & SAAS ========== */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => handleMouseEnter('platforms')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'platforms' ? null : 'platforms')}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                color: activeDropdown === 'platforms' ? "#00DF81" : "var(--text-primary)",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: activeDropdown === 'platforms' ? "rgba(0, 223, 129, 0.1)" : "transparent",
                transition: "all 0.2s",
                cursor: "pointer",
                border: "none",
                fontSize: "14px"
              }}
            >
              <span>{t.plataformas || 'Plataformas & SaaS'}</span>
              <ChevronDown 
                size={14} 
                style={{ 
                  transform: activeDropdown === 'platforms' ? 'rotate(180deg)' : 'none', 
                  transition: 'transform 0.2s',
                  color: activeDropdown === 'platforms' ? '#00DF81' : '#94A3B8'
                }} 
              />
            </button>

            {/* Dropdown Menu: Plataformas & SaaS */}
            {activeDropdown === 'platforms' && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "0",
                  paddingTop: "10px",
                  zIndex: 1000,
                  width: "500px"
                }}
              >
                <div style={{
                  backgroundColor: "#0F172A",
                  border: "1px solid rgba(0, 223, 129, 0.28)",
                  borderRadius: "16px",
                  padding: "18px",
                  boxShadow: "0 20px 45px rgba(0, 0, 0, 0.8)",
                  backdropFilter: "blur(18px)"
                }}>
                  {/* Top Bar inside Dropdown */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00DF81", boxShadow: "0 0 10px #00DF81" }} />
                      <strong style={{ fontSize: "12px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>Tecnologia & Softwares Próprios</strong>
                    </div>
                    <Link
                      href={`${prefix}/market`}
                      onClick={() => setActiveDropdown(null)}
                      style={{ fontSize: "12px", color: "#00DF81", fontWeight: 700, textDecoration: "none" }}
                    >
                      Ver Ecossistema →
                    </Link>
                  </div>

                  {/* Solutions List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                    
                    {/* Item 1: INFINITY MARKET */}
                    <Link
                      href={`${prefix}/market`}
                      onClick={() => setActiveDropdown(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        background: "rgba(0, 223, 129, 0.08)",
                        border: "1px solid rgba(0, 223, 129, 0.25)",
                        textDecoration: "none",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#00DF81"; e.currentTarget.style.background = "rgba(0, 223, 129, 0.12)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(0, 223, 129, 0.25)"; e.currentTarget.style.background = "rgba(0, 223, 129, 0.08)"; }}
                    >
                      <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(0, 223, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00DF81", flexShrink: 0 }}>
                        <Store size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Infinity Market</span>
                          <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "999px", background: "#00DF81", color: "#0B0F19", fontWeight: 800 }}>NOVO</span>
                        </div>
                        <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>App do separador, rotas de entrega e loja online de supermercado</div>
                      </div>
                    </Link>

                    {/* Item 2: DELIVERY SAAS */}
                    <Link
                      href={`${prefix}/delivery`}
                      onClick={() => setActiveDropdown(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        textDecoration: "none",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#00AAFF"; e.currentTarget.style.background = "rgba(0, 170, 255, 0.08)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"; }}
                    >
                      <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(0, 170, 255, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00AAFF", flexShrink: 0 }}>
                        <Truck size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Delivery SaaS</div>
                        <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>Plataforma própria de pedidos sem pagar taxas por venda</div>
                      </div>
                    </Link>

                    {/* Item 3: FORMS NOVO */}
                    <Link
                      href={`${prefix}/forms`}
                      onClick={() => setActiveDropdown(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        textDecoration: "none",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#10B981"; e.currentTarget.style.background = "rgba(16, 185, 129, 0.08)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"; }}
                    >
                      <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", flexShrink: 0 }}>
                        <CheckCircle2 size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Infinity Forms</span>
                          <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "999px", background: "rgba(0,223,129,0.2)", color: "#00DF81", fontWeight: 800 }}>IA</span>
                        </div>
                        <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>Formulários interativos inteligentes para alta conversão</div>
                      </div>
                    </Link>

                    {/* Item 4: CRM */}
                    <a
                      href="https://crm.infinityondemand.com.br/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setActiveDropdown(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        textDecoration: "none",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#8B5CF6"; e.currentTarget.style.background = "rgba(139, 92, 246, 0.08)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"; }}
                    >
                      <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(139, 92, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8B5CF6", flexShrink: 0 }}>
                        <LayoutDashboard size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Infinity CRM</span>
                          <ExternalLink size={12} color="#94A3B8" />
                        </div>
                        <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>Gestão de clientes, automações e funil integrado de vendas</div>
                      </div>
                    </a>

                    {/* Item 5: ANALYTICS & BI */}
                    <Link
                      href="/relatorios_infinity"
                      onClick={() => setActiveDropdown(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        textDecoration: "none",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#F59E0B"; e.currentTarget.style.background = "rgba(245, 158, 11, 0.08)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"; }}
                    >
                      <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(245, 158, 11, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#F59E0B", flexShrink: 0 }}>
                        <BarChart3 size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Analytics & BI</div>
                        <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>Dashboards unificados de performance e faturamento</div>
                      </div>
                    </Link>

                  </div>

                  {/* Case OxeeGo Banner in Dropdown */}
                  <Link
                    href={`${prefix}/market#case-oxeego`}
                    onClick={() => setActiveDropdown(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, rgba(0, 223, 129, 0.12) 0%, rgba(0, 170, 255, 0.08) 100%)",
                      border: "1px solid rgba(0, 223, 129, 0.3)",
                      textDecoration: "none"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img src="/market/oxeego_instagram_avatar.jpg" alt="OxeeGo" style={{ width: "26px", height: "26px", borderRadius: "50%" }} />
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>Case OxeeGo Supermercado</div>
                        <div style={{ fontSize: "11px", color: "#00DF81" }}>+4.800 pedidos atendidos na plataforma</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "12px", color: "#00DF81", fontWeight: 700 }}>Conhecer →</span>
                  </Link>

                </div>
              </div>
            )}
          </div>

          {/* ========== DIRECT LINKS: ACADEMY & SOBRE ========== */}
          <Link 
            href={`${prefix}/academy`} 
            style={{ 
              padding: "8px 14px", 
              borderRadius: "8px", 
              color: "#00DF81", 
              fontWeight: 700,
              fontSize: "14px"
            }}
          >
            {academyLabel}
          </Link>

          <Link 
            href={`${prefix}/sobre`} 
            style={{ 
              padding: "8px 14px", 
              borderRadius: "8px", 
              color: "var(--text-primary)", 
              fontWeight: 600,
              fontSize: "14px"
            }}
          >
            {t.sobre || 'Sobre'}
          </Link>

          {/* Language Switcher */}
          <Link 
            href={switchPath} 
            style={{ 
              padding: "6px 10px", 
              borderRadius: "8px", 
              fontSize: "17px", 
              display: "flex", 
              alignItems: "center", 
              gap: "4px", 
              border: "1px solid rgba(255,255,255,0.1)", 
              transition: "all 0.2s", 
              textDecoration: "none",
              marginLeft: "4px"
            }}
            title={otherLocale === 'es' ? 'Español' : 'Português'}
          >
            {otherFlag}
          </Link>

          {/* Client Portal Button */}
          <a
            href="https://helpdesk.infinityondemand.com.br/cliente/login"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              padding: "8px 18px",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "14px",
              marginLeft: "6px"
            }}
          >
            <User size={15} />
            <span>Área do Cliente</span>
          </a>
        </nav>

        {/* Hamburger button for Mobile */}
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      {/* ========== MOBILE MENU PANEL ========== */}
      <div className={`nav-mobile-overlay ${menuOpen ? 'open' : ''}`}>

        {/* Top bar: Logo + Close button */}
        <div className="mobile-menu-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/logo-infinity.png" alt="Infinity OnDemand" style={{ height: "40px", width: "auto" }} />
          </div>

          {/* Close X button */}
          <button
            onClick={closeMenu}
            aria-label="Fechar menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="mobile-menu-cta">
          <a
            href="https://wa.me/5581981280719?text=Ol%C3%A1!%20Quero%20testar%20as%20solu%C3%A7%C3%B5es%20da%20Infinity%20OnDemand."
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="mobile-cta-outline"
          >
            {t.testeAgora}
          </a>
          <a
            href="https://helpdesk.infinityondemand.com.br/cliente/login"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="mobile-cta-filled"
          >
            {t.login}
          </a>
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: "1px", background: "var(--bg-tertiary)" }} />

        {/* Navigation links */}
        <nav className="mobile-menu-links">
          <Link href={prefix || '/'} onClick={closeMenu}>{t.inicio}</Link>

          {/* Accordion: Serviços */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "10px 0" }}>
            <div
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 0",
                color: "#00DF81",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>Serviços Digitais</span>
                <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "999px", background: "rgba(0,223,129,0.2)", border: "1px solid rgba(0,223,129,0.5)", color: "#00DF81", fontWeight: 800 }}>5</span>
              </div>
              <ChevronDown size={18} style={{ transform: mobileServicesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {mobileServicesOpen && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "8px 0 8px 12px" }}>
                <Link href={`${prefix}/branding`} onClick={closeMenu} style={{ color: "#00DF81", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🎨 Branding & Design</span>
                  <span style={{ fontSize: "9px", background: "#00DF81", color: "#0B0F19", padding: "1px 5px", borderRadius: "4px", fontWeight: 800 }}>NOVO</span>
                </Link>
                <Link href={`${prefix}/trafego`} onClick={closeMenu} style={{ color: "#CBD5E1", fontSize: "13px" }}>
                  📈 Tráfego Pago & Performance
                </Link>
                <Link href={`${prefix}/site-institucional`} onClick={closeMenu} style={{ color: "#CBD5E1", fontSize: "13px" }}>
                  🌐 Sites & Landing Pages
                </Link>
                <Link href={`${prefix}/ecommerce`} onClick={closeMenu} style={{ color: "#CBD5E1", fontSize: "13px" }}>
                  🛍️ E-commerce Customizado
                </Link>
                <Link href={`${prefix}/consultoria`} onClick={closeMenu} style={{ color: "#CBD5E1", fontSize: "13px" }}>
                  💡 Consultoria Estratégica
                </Link>
              </div>
            )}
          </div>

          {/* Accordion: Plataformas & SaaS */}
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "10px 0" }}>
            <div
              onClick={() => setMobilePlatformsOpen(!mobilePlatformsOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 0",
                color: "#00AAFF",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>Plataformas & SaaS</span>
                <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "999px", background: "rgba(0,170,255,0.2)", border: "1px solid rgba(0,170,255,0.5)", color: "#00AAFF", fontWeight: 800 }}>Softwares</span>
              </div>
              <ChevronDown size={18} style={{ transform: mobilePlatformsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {mobilePlatformsOpen && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "8px 0 8px 12px" }}>
                <Link href={`${prefix}/market`} onClick={closeMenu} style={{ color: "#00DF81", fontWeight: 700, fontSize: "14px" }}>
                  🛒 Infinity Market (Supermercados)
                </Link>
                <Link href={`${prefix}/delivery`} onClick={closeMenu} style={{ color: "#CBD5E1", fontSize: "13px" }}>
                  🛵 Delivery SaaS
                </Link>
                <Link href={`${prefix}/forms`} onClick={closeMenu} style={{ color: "#CBD5E1", fontSize: "13px" }}>
                  📝 Infinity Forms (Formulários IA)
                </Link>
                <a href="https://crm.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" onClick={closeMenu} style={{ color: "#CBD5E1", fontSize: "13px" }}>
                  📊 Infinity CRM ↗
                </a>
                <Link href="/relatorios_infinity" onClick={closeMenu} style={{ color: "#CBD5E1", fontSize: "13px" }}>
                  📉 Analytics & BI
                </Link>
              </div>
            )}
          </div>

          <Link href={`${prefix}/academy`} onClick={closeMenu} style={{ color: "#00DF81", fontWeight: 700 }}>{academyLabel}</Link>
          <Link href={`${prefix}/sobre`} onClick={closeMenu}>{t.sobre || 'Sobre'}</Link>

          <a
            href="https://helpdesk.infinityondemand.com.br/cliente/login"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#00DF81",
              fontWeight: 700,
              marginTop: "8px"
            }}
          >
            <User size={18} />
            <span>Área do Cliente</span>
          </a>
        </nav>

        {/* Mobile Language Switcher */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--bg-tertiary)" }}>
          <Link href={switchPath} onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "12px", backgroundColor: "var(--bg-tertiary)", textDecoration: "none", color: "var(--text-primary)", fontWeight: 600, fontSize: "15px", transition: "all 0.2s" }}>
            <span style={{ fontSize: "22px" }}>{otherFlag}</span>
            {otherLocale === 'es' ? 'Cambiar a Español' : 'Mudar para Português'}
          </Link>
        </div>
      </div>
    </>
  );
}
