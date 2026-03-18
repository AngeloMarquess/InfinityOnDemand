'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* Hero Section */}
      <section className="bg-secondary" style={{ flex: 1, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", padding: "120px 48px", overflow: "hidden", minHeight: "80vh" }}>
        
        {/* Left Content */}
        <div style={{ maxWidth: "600px", flex: "1 1 500px", zIndex: 1, marginBottom: "40px" }}>
          <div style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "var(--accent-light)", color: "var(--accent-primary)", borderRadius: "20px", fontSize: "14px", fontWeight: 600, marginBottom: "24px" }}>
            Novas tecnologias escaláveis
          </div>
          <h1 style={{ fontSize: "64px", fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "24px", color: "var(--text-primary)" }}>
            A engenharia por trás do <br /> <span className="text-accent">crescimento</span> digital.
          </h1>
          <p className="text-secondary" style={{ fontSize: "20px", marginBottom: "40px", maxWidth: "480px", lineHeight: 1.6 }}>
            A Infinity OnDemand une o poder das tecnologias web mais avançadas com consultoria de negócios para transformar operações e-commerce e processos B2B.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="#consulting" className="btn-primary" style={{ padding: "16px 32px", fontSize: "18px", display: "inline-flex" }}>
              Ver Nossos Serviços
            </a>
            <a href="#contact" className="btn-secondary" style={{ display: "inline-flex" }}>
              Falar com Especialista
            </a>
          </div>
        </div>

        {/* Floating Animation Elements (Right Side - Light Theme) */}
        <div style={{ position: "relative", zIndex: 1, flex: "1 1 400px", height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          
          {/* Main Chart Card */}
          <div className="animate-float" style={{ 
            width: "360px", 
            backgroundColor: "#ffffff", 
            borderRadius: "20px", 
            padding: "32px", 
            border: "1px solid var(--bg-tertiary)",
            boxShadow: "var(--shadow-lg)",
            position: "relative",
            zIndex: 2
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
              <span style={{ fontSize: "20px", color: "var(--accent-primary)" }}>📊</span>
              <span style={{ fontWeight: 600, fontSize: "16px", color: "var(--text-primary)" }}>Crescimento de Vendas<br/>Mensal</span>
            </div>
            
            {/* Animated Bar Chart */}
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-end", height: "120px", borderBottom: "1px solid var(--bg-tertiary)", paddingBottom: "16px", marginBottom: "16px" }}>
              <div className="bar-1" style={{ flex: 1, backgroundColor: "var(--accent-primary)", borderRadius: "4px 4px 0 0" }}></div>
              <div className="bar-2" style={{ flex: 1, backgroundColor: "var(--accent-primary)", borderRadius: "4px 4px 0 0" }}></div>
              <div className="bar-3" style={{ flex: 1, backgroundColor: "var(--accent-primary)", borderRadius: "4px 4px 0 0" }}></div>
              <div className="bar-4" style={{ flex: 1, backgroundColor: "var(--accent-primary)", borderRadius: "4px 4px 0 0" }}></div>
            </div>
            
            <div style={{ color: "var(--accent-primary)", fontWeight: 600, fontSize: "14px" }}>+248% vs mês anterior</div>
          </div>

          {/* Floating 'Campanha Ativa' Card */}
          <div className="animate-float-delayed" style={{
            position: "absolute",
            left: "-60px",
            bottom: "20px",
            backgroundColor: "#ffffff",
            padding: "24px 32px",
            borderRadius: "16px",
            border: "1px solid var(--bg-tertiary)",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            zIndex: 3
          }}>
             <span style={{ fontSize: "28px", color: "#E94057" }}>🚀</span>
             <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>Campanha Ativa</span>
             <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>ROAS: 8.5x</span>
          </div>
          
          {/* Decorative Background Element */}
          <div className="animate-glow" style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, background: "radial-gradient(circle, rgba(0,219,121,0.05) 0%, transparent 70%)", zIndex: 0, borderRadius: "50%" }}></div>

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

      {/* Featured Service: E-commerce */}
      <section style={{ padding: "100px 48px", backgroundColor: "var(--bg-primary)", borderTop: "1px solid var(--bg-tertiary)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "64px", alignItems: "center" }}>
          
          <div style={{ flex: "1 1 500px", order: 1 }}>
            <div style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "var(--accent-light)", color: "var(--accent-primary)", borderRadius: "20px", fontSize: "14px", fontWeight: 600, marginBottom: "16px", border: "1px solid #cbf7e3" }}>
              Fábrica de Lojas Virtuais
            </div>
            <h2 style={{ fontSize: "40px", fontWeight: 700, letterSpacing: "-1px", lineHeight: 1.2, marginBottom: "24px", color: "var(--text-primary)" }}>
              Desenvolvimento de E-commerce
            </h2>
            <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", lineHeight: 1.6 }}>
              Criamos ecossistemas de vendas online escaláveis, seguros e otimizados para máxima conversão. Da arquitetura ao design, nossa fábrica entrega lojas B2B e B2C preparadas para dominar o mercado.
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "40px" }}>
               <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ color: "var(--accent-primary)", fontSize: "20px" }}>✓</span>
                  <p style={{ fontWeight: 500, fontSize: "16px" }}>Performance e Tempo de Carregamento Ultra-rápidos</p>
               </div>
               <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ color: "var(--accent-primary)", fontSize: "20px" }}>✓</span>
                  <p style={{ fontWeight: 500, fontSize: "16px" }}>UX/UI Design Focado em Maximização de Vendas</p>
               </div>
               <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ color: "var(--accent-primary)", fontSize: "20px" }}>✓</span>
                  <p style={{ fontWeight: 500, fontSize: "16px" }}>Integrações Complexas com ERPs e Gateways de Pagamento</p>
               </div>
            </div>

            <a href="https://ecommerce.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" style={{ padding: "16px 32px", fontSize: "18px", display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff", color: "#041C10", border: "1px solid #e0e0e0", borderRadius: "8px", fontWeight: 500, transition: "all 0.2s" }} onMouseOver={(e) => { e.currentTarget.style.borderColor = "#041C10"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.boxShadow = "none"; }}>
              Ver Soluções de E-commerce
            </a>
          </div>

          <div style={{ flex: "1 1 400px", display: "flex", justifyContent: "center", order: 2 }}>
            <div style={{ width: "100%", maxWidth: "500px", aspectRatio: "1/1", backgroundColor: "var(--bg-secondary)", borderRadius: "24px", boxShadow: "var(--shadow-md)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--bg-tertiary)", position: "relative", overflow: "hidden" }}>
               {/* E-commerce Video Presentation (Online Placeholder) */}
               {/* E-commerce Video Presentation (Online Placeholder) */}
               <video 
                  autoPlay={true}
                  loop={true}
                  muted={true}
                  playsInline={true}
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  style={{ width: "100%", height: "100%", objectFit: "cover", zIndex: 1, backgroundColor: "#f0f0f0" }}
               />
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
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#e8fcf2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                {/* Custom Marketing Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 20V14" stroke="#e94057" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 20V10" stroke="#00db79" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 20V4" stroke="#4a90e2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px", color: "var(--text-primary)" }}>Tráfego Pago / Performance</h3>
              <p className="text-secondary" style={{ fontSize: "15px", lineHeight: 1.6 }}>Otimização rigorosa de CAC (Custo de Aquisição) e ROAS em campanhas multicanal, alavancando suas vendas usando automação e dados.</p>
            </div>

            <div className="card" style={{ backgroundColor: "var(--bg-primary)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#e8fcf2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                 {/* Custom Cloud / Delivery Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="7" width="20" height="14" rx="2" stroke="#4a90e2" strokeWidth="2"/>
                  <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="#00db79" strokeWidth="2"/>
                  <circle cx="12" cy="11" r="2" fill="#e94057"/>
                </svg>
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px", color: "var(--text-primary)" }}>Plataformas Delivery OS</h3>
              <p className="text-secondary" style={{ fontSize: "15px", lineHeight: 1.6 }}>Engenharia completa de sistemas de Delivery / SaaS de alto nível, com provisionamento cloud inteligente e escalável.</p>
            </div>

            <div className="card" style={{ backgroundColor: "var(--bg-primary)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#e8fcf2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                {/* Custom CRM / E-commerce Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="4" stroke="#4a90e2" strokeWidth="2"/>
                  <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="#00db79" strokeWidth="2"/>
                  <circle cx="18" cy="8" r="2" fill="#e94057"/>
                  <circle cx="6" cy="8" r="2" fill="#e94057"/>
                </svg>
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px", color: "var(--text-primary)" }}>Implantação de CRM B2B</h3>
              <p className="text-secondary" style={{ fontSize: "15px", lineHeight: 1.6 }}>Setup avançado de CRMs como HubSpot e plataformas próprias integradas, organizando o funil de vendas da sua operação comercial.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" style={{ padding: "120px 48px", backgroundColor: "#041C10", display: "flex", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {/* Subtle green glow behind the form */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", maxWidth: "800px", height: "100%", background: "radial-gradient(circle, rgba(0,219,121,0.15) 0%, transparent 60%)", zIndex: 0, pointerEvents: "none" }}></div>
        
        <div style={{ maxWidth: "600px", width: "100%", backgroundColor: "rgba(255, 255, 255, 0.03)", borderRadius: "24px", padding: "48px", border: "1px solid rgba(0, 219, 121, 0.2)", backdropFilter: "blur(20px)", boxShadow: "0 30px 60px rgba(0,0,0,0.3)", zIndex: 1, position: "relative" }}>
          <h2 style={{ fontSize: "36px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "16px", textAlign: "center", color: "#ffffff" }}>Pronto para escalar?</h2>
          <p style={{ textAlign: "center", marginBottom: "40px", color: "rgba(255, 255, 255, 0.7)", fontSize: "18px" }}>Fale com nossos engenheiros e consultores.</p>
          
          <form style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>Nome Completo</label>
              <input type="text" placeholder="Seu nome" style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(0,0,0,0.2)", color: "#fff", fontSize: "16px", fontFamily: "inherit", outline: "none", transition: "all 0.2s" }} onFocus={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.4)"; e.target.style.borderColor="var(--accent-primary)"; }} onBlur={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.2)"; e.target.style.borderColor="rgba(255,255,255,0.1)"; }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>E-mail Corporativo</label>
              <input type="email" placeholder="nome@empresa.com" style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(0,0,0,0.2)", color: "#fff", fontSize: "16px", fontFamily: "inherit", outline: "none", transition: "all 0.2s" }} onFocus={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.4)"; e.target.style.borderColor="var(--accent-primary)"; }} onBlur={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.2)"; e.target.style.borderColor="rgba(255,255,255,0.1)"; }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>Como podemos ajudar?</label>
              <textarea placeholder="Conte-nos sobre seu desafio atual..." rows={4} style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(0,0,0,0.2)", color: "#fff", fontSize: "16px", fontFamily: "inherit", resize: "vertical", outline: "none", transition: "all 0.2s" }} onFocus={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.4)"; e.target.style.borderColor="var(--accent-primary)"; }} onBlur={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.2)"; e.target.style.borderColor="rgba(255,255,255,0.1)"; }}></textarea>
            </div>
            <button type="button" style={{ width: "100%", padding: "18px", fontSize: "16px", marginTop: "12px", backgroundColor: "var(--accent-primary)", color: "#000000", border: "none", borderRadius: "12px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 10px 20px rgba(0, 219, 121, 0.2)" }} onMouseOver={(e) => {e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 15px 25px rgba(0, 219, 121, 0.3)";}} onMouseOut={(e) => {e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 219, 121, 0.2)";}}>
              Enviar Mensagem
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
