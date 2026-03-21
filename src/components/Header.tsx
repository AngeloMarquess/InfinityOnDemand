'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

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
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
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
          <Link href="/sobre" style={{ padding: "8px 12px", borderRadius: "4px" }}>Sobre</Link>
          <Link href="#labs" style={{ padding: "8px 12px", borderRadius: "4px" }}>Labs</Link>
          <Link href="/consultoria" style={{ padding: "8px 12px", borderRadius: "4px" }}>Consultoria</Link>
          <Link href="/ecommerce" style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--text-primary)", fontWeight: 600 }}>E-commerce</Link>
          <a href="https://crmm.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--text-primary)", fontWeight: 600 }}>CRM</a>
          <Link href="/delivery" style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--text-primary)", fontWeight: 600 }}>Delivery SaaS</Link>
          <Link href="#contact" className="btn-primary" style={{ padding: "8px 16px", color: "#fff" }}>Contato</Link>
        </nav>

        {/* Hamburger button */}
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
            href="https://wa.me/558193997207?text=Ol%C3%A1!%20Quero%20testar%20as%20solu%C3%A7%C3%B5es%20da%20Infinity%20OnDemand."
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="mobile-cta-outline"
          >
            Teste agora
          </a>
          <a
            href="https://delivery.infinityondemand.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="mobile-cta-filled"
          >
            Login
          </a>
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: "1px", background: "var(--bg-tertiary)" }} />

        {/* Navigation links */}
        <nav className="mobile-menu-links">
          <Link href="/" onClick={closeMenu}>Início</Link>
          <Link href="/sobre" onClick={closeMenu}>Sobre nós</Link>
          <Link href="#labs" onClick={closeMenu}>Labs</Link>
          <Link href="/consultoria" onClick={closeMenu}>Consultoria</Link>
          <Link href="/ecommerce" onClick={closeMenu}>E-commerce</Link>
          <a href="https://crmm.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
            CRM
          </a>
          <Link href="/delivery" onClick={closeMenu}>Delivery SaaS</Link>
          <Link href="#contact" onClick={closeMenu}>Contato</Link>
        </nav>
      </div>
    </>
  );
}
