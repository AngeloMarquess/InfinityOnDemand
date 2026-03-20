'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = (
    <>
      <Link href="#labs" onClick={closeMenu} style={{ padding: "8px 12px", borderRadius: "4px" }}>Labs</Link>
      <Link href="#consulting" onClick={closeMenu} style={{ padding: "8px 12px", borderRadius: "4px" }}>Consultoria</Link>
      <a href="https://ecommerce.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" onClick={closeMenu} style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--text-primary)", fontWeight: 600 }}>E-commerce</a>
      <a href="https://crmm.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" onClick={closeMenu} style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--text-primary)", fontWeight: 600 }}>CRM</a>
      <Link href="/delivery" onClick={closeMenu} style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--text-primary)", fontWeight: 600 }}>Delivery SaaS</Link>
      <Link href="#contact" onClick={closeMenu} className="btn-primary" style={{ padding: "8px 16px", color: "#fff" }}>Contato</Link>
    </>
  );

  return (
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
        {navLinks}
      </nav>

      {/* Hamburger button (visible only on mobile via CSS) */}
      <button
        className="hamburger-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
        style={{ position: 'relative', zIndex: 110 }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round">
          {menuOpen ? (
            <>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile nav overlay */}
      <div className={`nav-mobile-overlay ${menuOpen ? 'open' : ''}`}>
        {navLinks}
      </div>
    </header>
  );
}
