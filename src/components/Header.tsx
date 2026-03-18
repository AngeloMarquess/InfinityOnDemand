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
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(8px)",
      zIndex: 100
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Mock Logo */}
        <Link href="/" style={{ fontWeight: 700, fontSize: "24px", letterSpacing: "-0.5px" }}>
          INFINITY <span className="text-accent" style={{ fontWeight: 400 }}>ONDEMAND</span>
        </Link>
      </div>
      <nav style={{ display: "flex", gap: "24px", color: "var(--text-secondary)", fontWeight: 500, alignItems: "center" }}>
        <Link href="#labs" style={{ padding: "8px 12px", borderRadius: "4px" }}>Labs</Link>
        <Link href="#consulting" style={{ padding: "8px 12px", borderRadius: "4px" }}>Consultoria</Link>
        <a href="https://crmm.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--text-primary)", fontWeight: 600 }}>CRM</a>
        <a href="https://delivery.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", borderRadius: "4px", color: "var(--accent-primary)", fontWeight: 600 }}>Delivery SaaS</a>
        <Link href="#contact" className="btn-primary" style={{ padding: "8px 16px", color: "#fff" }}>Contato</Link>
      </nav>
    </header>
  );
}
