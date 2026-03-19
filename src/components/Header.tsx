import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ 
      padding: "24px 48px", 
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
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="40" height="20" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 6px rgba(0, 219, 121, 0.4))' }}>
            <defs>
              <linearGradient id="inf-grad-head" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00DB79" />
                <stop offset="100%" stopColor="#00AAFF" />
              </linearGradient>
            </defs>
            <path d="M30 10 C15 10 10 25 10 25 C10 25 15 40 30 40 C45 40 55 10 70 10 C85 10 90 25 90 25 C90 25 85 40 70 40 C55 40 45 10 30 10 Z" stroke="url(#inf-grad-head)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ fontWeight: 800, fontSize: "22px", letterSpacing: "1px", display: "flex", gap: "6px", alignItems: "baseline" }}>
            <span className="text-gradient">INFINITY</span>
            <span style={{ fontWeight: 400, fontSize: "16px", color: "var(--text-primary)", letterSpacing: "0px" }}>ONDEMAND</span>
          </div>
        </Link>
      </div>
      <nav style={{ display: "flex", gap: "24px", color: "var(--text-secondary)", fontWeight: 500, alignItems: "center" }}>
        <Link href="#labs" style={{ padding: "8px 12px", borderRadius: "4px" }}>Labs</Link>
        <Link href="#consulting" style={{ padding: "8px 12px", borderRadius: "4px" }}>Consultoria</Link>
        <a href="https://ecommerce.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--text-primary)", fontWeight: 600 }}>E-commerce</a>
        <a href="https://crmm.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--text-primary)", fontWeight: 600 }}>CRM</a>
        <Link href="/delivery" style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--text-primary)", fontWeight: 600 }}>Delivery SaaS</Link>
        <Link href="#contact" className="btn-primary" style={{ padding: "8px 16px", color: "#fff" }}>Contato</Link>
      </nav>
    </header>
  );
}
