import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* Hero Section */}
      <section className="bg-secondary" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px" }}>
          <div style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "var(--accent-light)", color: "var(--accent-primary)", borderRadius: "20px", fontSize: "14px", fontWeight: 600, marginBottom: "24px" }}>
            Novas tecnologias escaláveis
          </div>
          <h1 style={{ fontSize: "64px", fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "24px" }}>
            A engenharia por trás do <br /> <span className="text-accent">crescimento</span> digital.
          </h1>
          <p className="text-secondary" style={{ fontSize: "20px", marginBottom: "40px", maxWidth: "600px", marginInline: "auto" }}>
            A Infinity OnDemand une o poder das tecnologias web mais avançadas com consultoria de negócios para transformar operações e-commerce e processos B2B.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <a href="#consulting" className="btn-primary" style={{ padding: "16px 32px", fontSize: "18px", display: "inline-flex" }}>
              Ver Nossos Serviços
            </a>
            <a href="#contact" className="btn-secondary" style={{ display: "inline-flex" }}>
              Falar com Especialista
            </a>
          </div>
        </div>
      </section>

      {/* Labs Showcase Section */}
      <section id="labs" style={{ padding: "120px 48px", backgroundColor: "var(--bg-primary)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: 700, letterSpacing: "-1px", marginBottom: "16px" }}>Infinity Labs</h2>
            <p className="text-secondary" style={{ fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
              Nosso núcleo de pesquisa e desenvolvimento. Testamos tecnologias emergentes para criar soluções práticas para o seu e-commerce.
            </p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "32px" }}>
            {/* Project 1 */}
            <div className="card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ height: "180px", backgroundColor: "var(--bg-tertiary)", borderRadius: "8px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                 <span style={{ fontSize: "40px" }}>🤖</span>
              </div>
              <h3 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "12px" }}>Agentes de I.A. Autônomos</h3>
              <p className="text-secondary" style={{ flex: 1 }}>Pesquisa focada em criar agentes preditivos que antecipam rupturas de estoque no e-commerce antes que aconteçam.</p>
              <div style={{ marginTop: "24px", fontWeight: 500, color: "var(--accent-primary)", fontSize: "14px" }}>Status: Em testes Alfa</div>
            </div>

            {/* Project 2 */}
            <div className="card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ height: "180px", backgroundColor: "var(--bg-tertiary)", borderRadius: "8px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                 <span style={{ fontSize: "40px" }}>⚡</span>
              </div>
              <h3 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "12px" }}>Headless Commerce Engine</h3>
              <p className="text-secondary" style={{ flex: 1 }}>Framework baseado em Next.js para entregar lojas virtuais B2B que carregam em menos de 100ms.</p>
              <div style={{ marginTop: "24px", fontWeight: 500, color: "var(--text-primary)", fontSize: "14px" }}>Status: Implementado</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product: CRM */}
      <section style={{ padding: "80px 48px", backgroundColor: "var(--bg-primary)", borderTop: "1px solid var(--bg-tertiary)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", backgroundColor: "var(--accent-light)", borderRadius: "24px", padding: "64px", display: "flex", flexWrap: "wrap", gap: "48px", alignItems: "center", border: "1px solid #cbf7e3" }}>
          <div style={{ flex: "1 1 400px" }}>
            <div style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "#fff", color: "var(--accent-primary)", borderRadius: "20px", fontSize: "14px", fontWeight: 600, marginBottom: "16px", boxShadow: "var(--shadow-sm)" }}>
              Plataforma Proprietária
            </div>
            <h2 style={{ fontSize: "40px", fontWeight: 700, letterSpacing: "-1px", lineHeight: 1.2, marginBottom: "24px", color: "var(--text-primary)" }}>
              Infinity CRM
            </h2>
            <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", lineHeight: 1.6 }}>
              Acelere suas vendas e gerencie seu relacionamento com o cliente através do nosso CRM inteligente, criado dentro do <b>Infinity Labs</b> com foco em alta conversão e análise de dados.
            </p>
            <a href="https://crmm.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: "16px 32px", fontSize: "18px", display: "inline-flex" }}>
              Acessar Plataforma CRM
            </a>
          </div>
          <div style={{ flex: "1 1 400px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "500px", aspectRatio: "4/3", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--bg-tertiary)", overflow: "hidden", position: "relative" }}>
               {/* Decorative Dashboard mock */}
               <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40px", backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--bg-tertiary)", display: "flex", alignItems: "center", padding: "0 16px", gap: "8px" }}>
                  <div style={{width: 12, height: 12, borderRadius: 6, backgroundColor: "#ff5f56"}}></div>
                  <div style={{width: 12, height: 12, borderRadius: 6, backgroundColor: "#ffbd2e"}}></div>
                  <div style={{width: 12, height: 12, borderRadius: 6, backgroundColor: "#27c93f"}}></div>
               </div>
               <span style={{ fontSize: "64px", marginTop: "40px" }}>📈</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product: Delivery SaaS */}
      <section style={{ padding: "100px 48px", backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--bg-tertiary)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "64px", alignItems: "center" }}>
          
          <div style={{ flex: "1 1 500px", order: 2 }}>
            <div style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "var(--accent-light)", color: "var(--accent-primary)", borderRadius: "20px", fontSize: "14px", fontWeight: 600, marginBottom: "16px", border: "1px solid #cbf7e3" }}>
              Plataforma SaaS Multi-Tenant
            </div>
            <h2 style={{ fontSize: "40px", fontWeight: 700, letterSpacing: "-1px", lineHeight: 1.2, marginBottom: "24px", color: "var(--text-primary)" }}>
              Infinity Delivery OS
            </h2>
            <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", lineHeight: 1.6 }}>
              O sistema definitivo para operações de delivery e pizzarias. Uma infraestrutura robusta, comercializada no modelo SaaS, com front-end reativo de ponta e painel administrativo 100% integrado ao Ponto de Venda.
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
               <div>
                  <h4 style={{ fontWeight: 600, fontSize: "16px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}><span>📦</span> Gestão Kanban</h4>
                  <p className="text-secondary" style={{ fontSize: "14px", lineHeight: 1.5 }}>Painel admin com recursos modernos de <i style={{color: "var(--text-primary)"}}>drag-and-drop</i> para acompanhamento visual do fluxo de pedidos e arquivamento inteligente.</p>
               </div>
               <div>
                  <h4 style={{ fontWeight: 600, fontSize: "16px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}><span>💳</span> Módulo PDV & Finanças</h4>
                  <p className="text-secondary" style={{ fontSize: "14px", lineHeight: 1.5 }}>Sincronização imediata entre sistema de balcão físico, gestão de clientes VIP e fluxo de caixa corporativo.</p>
               </div>
               <div>
                  <h4 style={{ fontWeight: 600, fontSize: "16px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}><span>☁️</span> Arquitetura Multi-Tenant</h4>
                  <p className="text-secondary" style={{ fontSize: "14px", lineHeight: 1.5 }}>Automatização de deploy via scripts em Nginx para clientes (ex: sub-domínios configurados com SSL instantâneo).</p>
               </div>
               <div>
                  <h4 style={{ fontWeight: 600, fontSize: "16px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}><span>⚡</span> Alta Performance</h4>
                  <p className="text-secondary" style={{ fontSize: "14px", lineHeight: 1.5 }}>Painel SPA focado em otimização, ideal para operações com alto volume de cupons, taxas e clientes concorrentes.</p>
               </div>
            </div>

            <a href="https://delivery.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: "16px 32px", fontSize: "18px", display: "inline-flex" }}>
              Explorar Infinity Delivery
            </a>
          </div>

          <div style={{ flex: "1 1 400px", display: "flex", justifyContent: "center", order: 1 }}>
            <div style={{ width: "100%", height: "100%", minHeight: "450px", backgroundColor: "var(--bg-primary)", borderRadius: "16px", boxShadow: "var(--shadow-lg)", border: "1px solid var(--bg-tertiary)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
               <div style={{ padding: "20px", borderBottom: "1px solid var(--bg-tertiary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                 <div style={{ fontWeight: 700, fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}><span>🍕</span> Infinity Admin</div>
                 <div style={{ padding: "4px 8px", backgroundColor: "var(--accent-light)", color: "var(--accent-primary)", borderRadius: "4px", fontSize: "12px", fontWeight: 600 }}>SSL Seguro</div>
               </div>
               <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "var(--bg-secondary)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>Quadro Kanban</div>
                  <div style={{ display: "flex", gap: "12px", overflowX: "hidden" }}>
                    <div style={{ flex: 1, minWidth: "120px", height: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                       <div style={{ padding: "8px", backgroundColor: "var(--bg-primary)", borderRadius: "8px", boxShadow: "var(--shadow-sm)", fontSize: "12px", fontWeight: 500, borderLeft: "3px solid #ffbc00" }}>#1024 - Pendente</div>
                    </div>
                    <div style={{ flex: 1, minWidth: "120px", height: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                       <div style={{ padding: "8px", backgroundColor: "var(--bg-primary)", borderRadius: "8px", boxShadow: "var(--shadow-sm)", fontSize: "12px", fontWeight: 500, borderLeft: "3px solid #fffc0" }}>#1021 - Cozinha</div>
                       <div style={{ padding: "8px", backgroundColor: "var(--bg-primary)", borderRadius: "8px", boxShadow: "var(--shadow-sm)", fontSize: "12px", fontWeight: 500, borderLeft: "3px solid #fffc0" }}>#1023 - Cozinha</div>
                    </div>
                    <div style={{ flex: 1, minWidth: "120px", height: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                       <div style={{ padding: "8px", backgroundColor: "var(--bg-primary)", borderRadius: "8px", boxShadow: "var(--shadow-sm)", fontSize: "12px", fontWeight: 500, borderLeft: "3px solid var(--accent-primary)" }}>#988 - Entregue</div>
                    </div>
                  </div>
               </div>
               <div style={{ padding: "16px 20px", borderTop: "1px solid var(--bg-tertiary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500 }}>Terminal PDV Sincronizado</div>
                  <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "var(--accent-primary)", boxShadow: "0 0 10px var(--accent-primary)" }}></div>
               </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Consulting Services Section */}
      <section id="consulting" className="bg-primary" style={{ padding: "120px 48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "36px", fontWeight: 700, letterSpacing: "-1px", marginBottom: "60px", textAlign: "center" }}>Consultoria Especializada</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            
            <div className="card" style={{ backgroundColor: "var(--bg-primary)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                <span style={{ fontSize: "24px" }}>📊</span>
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px" }}>Marketing de Performance</h3>
              <p className="text-secondary" style={{ fontSize: "15px" }}>Otimização rigorosa de CAC (Custo de Aquisição) e ROAS em campanhas multicanal, usando automação e dados.</p>
            </div>

            <div className="card" style={{ backgroundColor: "var(--bg-primary)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                <span style={{ fontSize: "24px" }}>☁️</span>
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px" }}>Arquitetura Cloud</h3>
              <p className="text-secondary" style={{ fontSize: "15px" }}>Migração estruturada e gestão de infraestrutura escalável AWS/Google Cloud para operações que não podem parar.</p>
            </div>

            <div className="card" style={{ backgroundColor: "var(--bg-primary)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                <span style={{ fontSize: "24px" }}>🛒</span>
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px" }}>E-commerce B2B e B2C</h3>
              <p className="text-secondary" style={{ fontSize: "15px" }}>Setup completo da plataforma de e-commerce, UX orientada a conversão e integrações complexas de ERPs e sistemas legados.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" style={{ padding: "120px 48px", backgroundColor: "var(--bg-primary)", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "600px", width: "100%", backgroundColor: "var(--bg-secondary)", borderRadius: "16px", padding: "48px", border: "1px solid var(--bg-tertiary)" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "16px", textAlign: "center" }}>Pronto para escalar?</h2>
          <p className="text-secondary" style={{ textAlign: "center", marginBottom: "40px" }}>Fale com nossos engenheiros e consultores.</p>
          
          <form style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px" }}>Nome Completo</label>
              <input type="text" placeholder="Seu nome" style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--bg-tertiary)", fontSize: "16px", fontFamily: "inherit" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px" }}>E-mail Corporativo</label>
              <input type="email" placeholder="nome@empresa.com" style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--bg-tertiary)", fontSize: "16px", fontFamily: "inherit" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px" }}>Como podemos ajudar?</label>
              <textarea placeholder="Conte-nos sobre seu desafio atual..." rows={4} style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--bg-tertiary)", fontSize: "16px", fontFamily: "inherit", resize: "vertical" }}></textarea>
            </div>
            <button type="button" className="btn-primary" style={{ width: "100%", padding: "16px", fontSize: "16px", marginTop: "12px" }}>
              Enviar Mensagem
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
