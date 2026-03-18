export default function Footer() {
  return (
    <footer style={{
      padding: "60px 48px 24px",
      backgroundColor: "var(--bg-secondary)",
      borderTop: "1px solid var(--bg-tertiary)"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "40px" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "20px", letterSpacing: "-0.5px", marginBottom: "16px" }}>
            INFINITY <span className="text-accent" style={{ fontWeight: 400 }}>ONDEMAND</span>
          </div>
          <p className="text-secondary" style={{ maxWidth: "300px", fontSize: "14px" }}>
            Inovação, tecnologia e performance. Ajudamos empresas a escalarem através de soluções de software de ponta e consultoria estratégica.
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "60px" }}>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: "16px", fontSize: "14px" }}>Soluções</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }} className="text-secondary">
              <li><a href="https://crmm.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-primary)", fontWeight: 500 }}>Infinity CRM</a></li>
              <li><a href="https://delivery.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-primary)", fontWeight: 500 }}>Infinity Delivery SaaS</a></li>
              <li><a href="#consulting">E-commerce B2B/B2C</a></li>
              <li><a href="#consulting">Cloud & DevOps</a></li>
              <li><a href="#consulting">Growth Marketing</a></li>
              <li><a href="#labs">Pesquisa & AI (Labs)</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: "16px", fontSize: "14px" }}>Empresa</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }} className="text-secondary">
              <li><a href="#about">Sobre nós</a></li>
              <li><a href="#contact">Carreiras</a></li>
              <li><a href="#contact">Contato</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: "1200px", margin: "40px auto 0", paddingTop: "24px", borderTop: "1px solid var(--bg-tertiary)", textAlign: "center", fontSize: "14px" }} className="text-secondary">
        &copy; {new Date().getFullYear()} Infinity OnDemand. Todos os direitos reservados.
      </div>
    </footer>
  );
}
