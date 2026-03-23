'use client';

import { useState } from 'react';
import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Header({ dict, locale }: { dict?: any; locale?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentLocale = locale || 'pt';
  const prefix = currentLocale === 'pt' ? '' : `/${currentLocale}`;
  const t = dict?.header || {
    sobre: 'Sobre', labs: 'Labs', consultoria: 'Consultoria', ecommerce: 'E-commerce',
    crm: 'CRM', delivery: 'Delivery SaaS', analytics: 'Analytics', contato: 'Contato',
    inicio: 'Início', sobreNos: 'Sobre nós', testeAgora: 'Teste agora', login: 'Login',
  };

  const closeMenu = () => setMenuOpen(false);

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
        backgroundColor: "rgba(11, 15, 25, 0.85)",
        backdropFilter: "blur(12px)",
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
          <Link href={prefix || '/'} style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            <svg width="36" height="18" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 6px rgba(0, 219, 121, 0.4))', flexShrink: 0 }}>
              <defs>
                <linearGradient id="inf-grad-head" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00DB79" />
                  <stop offset="100%" stopColor="#00AAFF" />
                </linearGradient>
              </defs>
              <path d="M30 10 C15 10 10 25 10 25 C10 25 15 40 30 40 C45 40 55 10 70 10 C85 10 90 25 90 25 C90 25 85 40 70 40 C55 40 45 10 30 10 Z" stroke="url(#inf-grad-head)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{ fontWeight: 800, fontSize: "20px", letterSpacing: "1px", display: "flex", gap: "6px", alignItems: "baseline", whiteSpace: "nowrap" }}>
              <span className="text-gradient">INFINITY</span>
              <span style={{ fontWeight: 400, fontSize: "14px", color: "var(--text-primary)", letterSpacing: "0px" }}>ONDEMAND</span>
            </div>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="nav-desktop">
          <Link href={`${prefix}/sobre`} style={{ padding: "8px 12px", borderRadius: "4px" }}>{t.sobre}</Link>
          <Link href={`${prefix}/#labs`} style={{ padding: "8px 12px", borderRadius: "4px" }}>{t.labs}</Link>
          <Link href={`${prefix}/consultoria`} style={{ padding: "8px 12px", borderRadius: "4px" }}>{t.consultoria}</Link>
          <Link href={`${prefix}/ecommerce`} style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--text-primary)", fontWeight: 600 }}>{t.ecommerce}</Link>
          <a href="https://crm.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--text-primary)", fontWeight: 600 }}>{t.crm}</a>
          <Link href={`${prefix}/delivery`} style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--text-primary)", fontWeight: 600 }}>{t.delivery}</Link>
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
            <svg width="36" height="18" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 6px rgba(0, 219, 121, 0.4))' }}>
              <defs>
                <linearGradient id="inf-grad-mob" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00DB79" />
                  <stop offset="100%" stopColor="#00AAFF" />
                </linearGradient>
              </defs>
              <path d="M30 10 C15 10 10 25 10 25 C10 25 15 40 30 40 C45 40 55 10 70 10 C85 10 90 25 90 25 C90 25 85 40 70 40 C55 40 45 10 30 10 Z" stroke="url(#inf-grad-mob)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{ fontWeight: 800, fontSize: "18px", letterSpacing: "1px", display: "flex", gap: "5px", alignItems: "baseline" }}>
              <span className="text-gradient">INFINITY</span>
              <span style={{ fontWeight: 400, fontSize: "12px", color: "var(--text-primary)" }}>ONDEMAND</span>
            </div>
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
            href="https://wa.me/558193997207?text=Ol%C3%A1!%20Quero%20testar%20as%20solu%C3%A7%C3%B5es%20da%20Infinity%20OnDemand."
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
          <Link href={`${prefix}/sobre`} onClick={closeMenu}>{t.sobreNos}</Link>
          <Link href={`${prefix}/#labs`} onClick={closeMenu}>{t.labs}</Link>
          <Link href={`${prefix}/consultoria`} onClick={closeMenu}>{t.consultoria}</Link>
          <Link href={`${prefix}/ecommerce`} onClick={closeMenu}>{t.ecommerce}</Link>
          <a href="https://crm.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
            {t.crm}
          </a>
          <Link href={`${prefix}/delivery`} onClick={closeMenu}>{t.delivery}</Link>
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
