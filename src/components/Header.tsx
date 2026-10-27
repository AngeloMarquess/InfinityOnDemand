'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Header({ dict, locale }: { dict?: any; locale?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [marketDropdown, setMarketDropdown] = useState(false);
  const [mobileMarketOpen, setMobileMarketOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentLocale = locale || 'pt';
  const prefix = currentLocale === 'pt' ? '' : `/${currentLocale}`;
  const t = dict?.header || {
    sobre: 'Sobre', labs: 'Labs', consultoria: 'Consultoria', academy: 'Academy', ecommerce: 'E-commerce',
    crm: 'CRM', delivery: 'Delivery SaaS', analytics: 'Analytics', contato: 'Contato',
    inicio: 'Início', sobreNos: 'Sobre nós', testeAgora: 'Teste agora', login: 'Login',
    market: 'Market'
  };
  const academyLabel = t.academy || 'Academy';

  const closeMenu = () => {
    setMenuOpen(false);
    setMobileMarketOpen(false);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMarketDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMarketDropdown(false);
    }, 180);
  };

  // Language switcher
  const otherLocale = currentLocale === 'pt' ? 'es' : 'pt';
  const otherFlag = currentLocale === 'pt' ? '🇪🇸' : '🇧🇷';
  const switchPath = otherLocale === 'pt' ? '/' : `/${otherLocale}`;

  return (
    <>
      <header style={{
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--bg-tertiary)",
        position: "sticky",
        top: 0,
        backgroundColor: "rgba(11, 15, 25, 0.9)",
        backdropFilter: "blur(12px)",
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
          <Link href={prefix || '/'} style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
            <img src="/logo-infinity.png" alt="Infinity OnDemand" style={{ height: "40px", width: "auto" }} />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Link href={`${prefix}/trafego`} style={{ padding: "8px 12px", borderRadius: "4px", color: "#00DF81", fontWeight: 700 }}>{t.trafego || 'Tráfego Pago'}</Link>
          <Link href={`${prefix}/#labs`} style={{ padding: "8px 12px", borderRadius: "4px" }}>{t.labs}</Link>
          <Link href={`${prefix}/consultoria`} style={{ padding: "8px 12px", borderRadius: "4px" }}>{t.consultoria}</Link>
          <Link href={`${prefix}/ecommerce`} style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--text-primary)", fontWeight: 600 }}>{t.ecommerce}</Link>
          <a href="https://crm.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--text-primary)", fontWeight: 600 }}>{t.crm}</a>
          <Link href={`${prefix}/academy`} style={{ padding: "8px 12px", borderRadius: "4px", color: "#00DF81", fontWeight: 700 }}>{academyLabel}</Link>
          <Link href={`${prefix}/delivery`} style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--text-primary)", fontWeight: 600 }}>{t.delivery}</Link>
          
          {/* ========== MARKET DROPDOWN MENU ========== */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setMarketDropdown(!marketDropdown)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                color: "#00DF81",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: marketDropdown ? "rgba(0, 223, 129, 0.12)" : "transparent",
                transition: "all 0.2s",
                cursor: "pointer",
                border: "none",
                fontSize: "14px"
              }}
            >
              <span>{t.market || 'Market'}</span>
              <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "999px", background: "rgba(0,223,129,0.2)", border: "1px solid rgba(0,223,129,0.5)", color: "#00DF81", fontWeight: 800, textTransform: "uppercase" }}>Novo</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: marketDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown Box */}
            {marketDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  paddingTop: "8px",
                  zIndex: 1000,
                  width: "480px"
                }}
              >
                <div style={{
                  backgroundColor: "#0F172A",
                  border: "1px solid rgba(0, 223, 129, 0.3)",
                  borderRadius: "16px",
                  padding: "18px",
                  boxShadow: "0 20px 45px rgba(0, 0, 0, 0.7)",
                  backdropFilter: "blur(16px)"
                }}>
                  {/* Top Bar inside Dropdown */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00DF81" }} />
                      <strong style={{ fontSize: "13px", color: "#fff", textTransform: "uppercase", letterSpacing: "0.5px" }}>Infinity Market</strong>
                    </div>
                    <Link
                      href={`${prefix}/market`}
                      onClick={() => setMarketDropdown(false)}
                      style={{ fontSize: "12px", color: "#00DF81", fontWeight: 700, textDecoration: "none" }}
                    >
                      Ver Home Market →
                    </Link>
                  </div>

                  {/* Solutions Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                    
                    <Link
                      href={`${prefix}/market/solucoes/separacao`}
                      onClick={() => setMarketDropdown(false)}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        textDecoration: "none",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#00DF81"; e.currentTarget.style.background = "rgba(0, 223, 129, 0.08)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"; }}
                    >
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span>Separação & Balança</span>
                        <span style={{ fontSize: "9px", background: "#00DF81", color: "#0B0F19", padding: "1px 5px", borderRadius: "4px", fontWeight: 800 }}>Top</span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>App do separador no estoque</div>
                    </Link>

                    <Link
                      href={`${prefix}/market/solucoes/entregas`}
                      onClick={() => setMarketDropdown(false)}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        textDecoration: "none"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#00AAFF"; e.currentTarget.style.background = "rgba(0, 170, 255, 0.08)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"; }}
                    >
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>Entregas & Rotas</div>
                      <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>Roteirizador e app motorista</div>
                    </Link>

                    <Link
                      href={`${prefix}/market/solucoes/aplicativo`}
                      onClick={() => setMarketDropdown(false)}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        textDecoration: "none"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#00DF81"; e.currentTarget.style.background = "rgba(0, 223, 129, 0.08)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"; }}
                    >
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>Aplicativo Próprio</div>
                      <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>iOS e Android com sua marca</div>
                    </Link>

                    <Link
                      href={`${prefix}/market/solucoes/gestao`}
                      onClick={() => setMarketDropdown(false)}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        textDecoration: "none"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#00AAFF"; e.currentTarget.style.background = "rgba(0, 170, 255, 0.08)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"; }}
                    >
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>Painel de Gestão</div>
                      <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>Kanban de pedidos e multiloja</div>
                    </Link>

                    <Link
                      href={`${prefix}/market/solucoes/loja-online`}
                      onClick={() => setMarketDropdown(false)}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        textDecoration: "none"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#00DF81"; e.currentTarget.style.background = "rgba(0, 223, 129, 0.08)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"; }}
                    >
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>Loja Virtual Web</div>
                      <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>Corredores e encarte digital</div>
                    </Link>

                    <Link
                      href={`${prefix}/market/solucoes/whatsapp`}
                      onClick={() => setMarketDropdown(false)}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        textDecoration: "none"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#00DF81"; e.currentTarget.style.background = "rgba(0, 223, 129, 0.08)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"; }}
                    >
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>Vendas no WhatsApp</div>
                      <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>Robô de listas inteligente</div>
                    </Link>

                  </div>

                  {/* Case OxeeGo Banner in Dropdown */}
                  <Link
                    href={`${prefix}/market#case-oxeego`}
                    onClick={() => setMarketDropdown(false)}
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
                      <img src="/market/oxeego_instagram_avatar.jpg" alt="OxeeGo" style={{ width: "28px", height: "28px", borderRadius: "50%" }} />
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>Case OxeeGo Supermercado</div>
                        <div style={{ fontSize: "11px", color: "#00DF81" }}>+4.800 entregas em Recife e RMR</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "12px", color: "#00DF81", fontWeight: 700 }}>Conhecer →</span>
                  </Link>

                </div>
              </div>
            )}
          </div>

          <Link href="/relatorios_infinity" style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--text-primary)", fontWeight: 600 }}>{t.analytics}</Link>
          
          {/* Language Switcher */}
          <Link href={switchPath} style={{ padding: "6px 10px", borderRadius: "8px", fontSize: "18px", display: "flex", alignItems: "center", gap: "4px", border: "1px solid var(--bg-tertiary)", transition: "all 0.2s", textDecoration: "none" }}
            title={otherLocale === 'es' ? 'Español' : 'Português'}
          >
            {otherFlag}
          </Link>

          <Link href="#contact" className="btn-primary" style={{ padding: "8px 16px", color: "#fff" }}>{t.contato}</Link>
        </nav>

        {/* Hamburger button */}
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
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
            aria-label="Close menu"
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
            href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Quero%20testar%20as%20solu%C3%A7%C3%B5es%20da%20Infinity%20OnDemand."
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="mobile-cta-outline"
          >
            {t.testeAgora}
          </a>
          <a
            href="https://delivery.infinityondemand.com.br/"
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
          <Link href={`${prefix}/trafego`} onClick={closeMenu} style={{ color: "#00DF81", fontWeight: 700 }}>{t.trafego || 'Tráfego Pago'}</Link>
          <Link href={`${prefix}/#labs`} onClick={closeMenu}>{t.labs}</Link>
          <Link href={`${prefix}/consultoria`} onClick={closeMenu}>{t.consultoria}</Link>
          <Link href={`${prefix}/ecommerce`} onClick={closeMenu}>{t.ecommerce}</Link>
          <a href="https://crm.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
            {t.crm}
          </a>
          <Link href={`${prefix}/academy`} onClick={closeMenu} style={{ color: "#00DF81", fontWeight: 700 }}>{academyLabel}</Link>
          <Link href={`${prefix}/delivery`} onClick={closeMenu}>{t.delivery}</Link>
          
          {/* Mobile Market Accordion */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "10px 0" }}>
            <div
              onClick={() => setMobileMarketOpen(!mobileMarketOpen)}
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
                <span>Infinity Market</span>
                <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "999px", background: "rgba(0,223,129,0.2)", border: "1px solid rgba(0,223,129,0.5)", color: "#00DF81", fontWeight: 800 }}>NOVO</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: mobileMarketOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            {mobileMarketOpen && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "8px 0 8px 12px" }}>
                <Link href={`${prefix}/market`} onClick={closeMenu} style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>
                  → Ver Home Market
                </Link>
                <Link href={`${prefix}/market/solucoes/separacao`} onClick={closeMenu} style={{ color: "#CBD5E1", fontSize: "13px" }}>
                  • App de Separação (Picker com Balança)
                </Link>
                <Link href={`${prefix}/market/solucoes/entregas`} onClick={closeMenu} style={{ color: "#CBD5E1", fontSize: "13px" }}>
                  • Roteirizador e App de Entregas
                </Link>
                <Link href={`${prefix}/market/solucoes/aplicativo`} onClick={closeMenu} style={{ color: "#CBD5E1", fontSize: "13px" }}>
                  • Aplicativo Próprio iOS & Android
                </Link>
                <Link href={`${prefix}/market/solucoes/gestao`} onClick={closeMenu} style={{ color: "#CBD5E1", fontSize: "13px" }}>
                  • Painel de Gestão e Multiloja
                </Link>
                <Link href={`${prefix}/market/solucoes/loja-online`} onClick={closeMenu} style={{ color: "#CBD5E1", fontSize: "13px" }}>
                  • Loja Virtual Web
                </Link>
                <Link href={`${prefix}/market/solucoes/whatsapp`} onClick={closeMenu} style={{ color: "#CBD5E1", fontSize: "13px" }}>
                  • Vendas no WhatsApp Oficial
                </Link>
                <Link href={`${prefix}/market#case-oxeego`} onClick={closeMenu} style={{ color: "#00DF81", fontSize: "13px", fontWeight: 700 }}>
                  ★ Case de Sucesso OxeeGo
                </Link>
              </div>
            )}
          </div>

          <Link href="/relatorios_infinity" onClick={closeMenu}>{t.analytics}</Link>
          <Link href="#contact" onClick={closeMenu}>{t.contato}</Link>
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
