'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      padding: "80px 48px 32px",
      backgroundColor: "var(--bg-secondary)",
      borderTop: "1px solid var(--bg-tertiary)"
    }} className="section-padding-sm">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Top Section: Logo + Columns */}
        <div className="footer-grid">

          {/* Brand Column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              {/* Infinity Logo SVG */}
              <svg width="44" height="22" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 219, 121, 0.5))', flexShrink: 0 }}>
                <defs>
                  <linearGradient id="inf-grad-footer" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00DB79" />
                    <stop offset="100%" stopColor="#00AAFF" />
                  </linearGradient>
                </defs>
                <path d="M30 10 C15 10 10 25 10 25 C10 25 15 40 30 40 C45 40 55 10 70 10 C85 10 90 25 90 25 C90 25 85 40 70 40 C55 40 45 10 30 10 Z" stroke="url(#inf-grad-footer)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ fontWeight: 800, fontSize: "20px", letterSpacing: "1px", display: "flex", gap: "6px", alignItems: "baseline" }}>
                <span className="text-gradient">INFINITY</span>
                <span style={{ fontWeight: 400, fontSize: "14px", color: "var(--text-primary)", letterSpacing: "0px" }}>ONDEMAND</span>
              </div>
            </div>
            <p className="text-secondary" style={{ maxWidth: "280px", fontSize: "14px", lineHeight: 1.7, marginBottom: "24px" }}>
              Inovação, tecnologia e performance. Ajudamos empresas a escalarem através de soluções de software de ponta e consultoria estratégica.
            </p>
            {/* Social Icons */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {/* Instagram */}
              <a href="https://instagram.com/infinityondemand" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: "10px", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s ease, transform 0.2s ease" }}
                onMouseOver={(e) => { e.currentTarget.style.background = "var(--accent-gradient)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "var(--bg-tertiary)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com/company/infinityondemand" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: "10px", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s ease, transform 0.2s ease" }}
                onMouseOver={(e) => { e.currentTarget.style.background = "var(--accent-gradient)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "var(--bg-tertiary)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/558193997207" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: "10px", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s ease, transform 0.2s ease" }}
                onMouseOver={(e) => { e.currentTarget.style.background = "var(--accent-gradient)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "var(--bg-tertiary)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com/@infinityondemand" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: "10px", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s ease, transform 0.2s ease" }}
                onMouseOver={(e) => { e.currentTarget.style.background = "var(--accent-gradient)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "var(--bg-tertiary)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              {/* TikTok */}
              <a href="https://tiktok.com/@infinityondemand" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: "10px", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s ease, transform 0.2s ease" }}
                onMouseOver={(e) => { e.currentTarget.style.background = "var(--accent-gradient)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "var(--bg-tertiary)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <svg width="16" height="18" viewBox="0 0 448 512" fill="#fff"><path d="M448 209.91a210.06 210.06 0 01-122.77-39.25v178.72A162.55 162.55 0 11185 188.31v89.89a74.62 74.62 0 1052.23 71.18V0h88a121.18 121.18 0 001.86 22.17A122.18 122.18 0 00381 102.39a121.43 121.43 0 0067 20.14z"/></svg>
              </a>
            </div>
          </div>

          {/* Soluções Column */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "20px", fontSize: "15px", color: "var(--text-primary)" }}>Soluções</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px", fontSize: "14px" }}>
              <li><a href="https://ecommerce.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" className="text-secondary" style={{ transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "#00DF81"} onMouseOut={(e) => e.currentTarget.style.color = ""}>E-commerce Customizado</a></li>
              <li><a href="https://crmm.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" className="text-secondary" style={{ transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "#00DF81"} onMouseOut={(e) => e.currentTarget.style.color = ""}>Infinity CRM</a></li>
              <li><Link href="/delivery" className="text-secondary" style={{ transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "#00DF81"} onMouseOut={(e) => e.currentTarget.style.color = ""}>Infinity Delivery SaaS</Link></li>
              <li><a href="#consulting" className="text-secondary" style={{ transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "#00DF81"} onMouseOut={(e) => e.currentTarget.style.color = ""}>Cloud & DevOps</a></li>
              <li><a href="#consulting" className="text-secondary" style={{ transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "#00DF81"} onMouseOut={(e) => e.currentTarget.style.color = ""}>Growth Marketing</a></li>
            </ul>
          </div>

          {/* Empresa Column */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "20px", fontSize: "15px", color: "var(--text-primary)" }}>Empresa</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px", fontSize: "14px" }}>
              <li><a href="/sobre" className="text-secondary" style={{ transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "#00DF81"} onMouseOut={(e) => e.currentTarget.style.color = ""}>Sobre nós</a></li>
              <li><a href="#labs" className="text-secondary" style={{ transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "#00DF81"} onMouseOut={(e) => e.currentTarget.style.color = ""}>Pesquisa & AI (Labs)</a></li>
              <li><a href="#contact" className="text-secondary" style={{ transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "#00DF81"} onMouseOut={(e) => e.currentTarget.style.color = ""}>Carreiras</a></li>
              <li><a href="#contact" className="text-secondary" style={{ transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "#00DF81"} onMouseOut={(e) => e.currentTarget.style.color = ""}>Contato</a></li>
              <li><a href="/privacy" className="text-secondary" style={{ transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "#00DF81"} onMouseOut={(e) => e.currentTarget.style.color = ""}>Privacidade</a></li>
            </ul>
          </div>

          {/* Contato Column */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "20px", fontSize: "15px", color: "var(--text-primary)" }}>Contato</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px", fontSize: "14px" }}>
              <li className="text-secondary" style={{ display: "flex", alignItems: "center", gap: "8px", wordBreak: "break-all" }}>
                <span style={{ color: "var(--accent-primary)", flexShrink: 0 }}>📧</span> contato@infinityondemand.com.br
              </li>
              <li className="text-secondary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "var(--accent-primary)", flexShrink: 0 }}>📱</span> (81) 9399-7207
              </li>
              <li className="text-secondary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "var(--accent-primary)", flexShrink: 0 }}>🌐</span> infinityondemand.com.br
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent 0%, var(--bg-tertiary) 20%, var(--bg-tertiary) 80%, transparent 100%)", marginBottom: "24px" }} />

        {/* Security Badges */}
        <div style={{ display: "flex", gap: "24px", justifyContent: "center", alignItems: "center", marginBottom: "24px", flexWrap: "wrap" }}>
          
          {/* SSL Badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 20px", borderRadius: "10px",
            border: "1px solid rgba(0, 219, 121, 0.25)",
            background: "rgba(0, 219, 121, 0.05)",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="url(#ssl-grad)" strokeWidth="1.5"/>
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="url(#ssl-grad)" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1.5" fill="url(#ssl-grad)"/>
              <defs>
                <linearGradient id="ssl-grad" x1="3" y1="5" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00DB79"/>
                  <stop offset="1" stopColor="#00AAFF"/>
                </linearGradient>
              </defs>
            </svg>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-primary)", letterSpacing: "0.5px", textTransform: "uppercase", lineHeight: 1 }}>Site Seguro</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>SSL 256 Bits</div>
            </div>
          </div>

          {/* Google Safe Browsing Badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 20px", borderRadius: "10px",
            border: "1px solid rgba(0, 170, 255, 0.25)",
            background: "rgba(0, 170, 255, 0.05)",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" stroke="url(#gsb-grad)" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9 12l2 2 4-4" stroke="url(#gsb-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="gsb-grad" x1="4" y1="2" x2="20" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00AAFF"/>
                  <stop offset="1" stopColor="#00DB79"/>
                </linearGradient>
              </defs>
            </svg>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-secondary)", letterSpacing: "0.5px", lineHeight: 1 }}>Google</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>Safe Browsing</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="text-secondary" style={{ fontSize: "13px" }}>
            &copy; {new Date().getFullYear()} Infinity OnDemand. Todos os direitos reservados.
          </div>
          <div style={{ display: "flex", gap: "24px", fontSize: "13px" }}>
            <a href="/privacy" className="text-secondary" style={{ transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "#00DF81"} onMouseOut={(e) => e.currentTarget.style.color = ""}>Política de Privacidade</a>
            <a href="#" className="text-secondary" style={{ transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "#00DF81"} onMouseOut={(e) => e.currentTarget.style.color = ""}>Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
