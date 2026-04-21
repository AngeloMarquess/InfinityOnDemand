'use client';

import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const [formNome, setFormNome] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 9) value = `${value.slice(0, 10)}-${value.slice(10)}`;
    setFormWhatsapp(value);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNome || !formEmail) return;
    setFormSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: formNome, email: formEmail, whatsapp: formWhatsapp, message: formMessage, origin: 'site' }),
      });
      if (!res.ok) throw new Error('Failed');
      // Google Ads conversion tracking
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'conversion', {
          'send_to': 'AW-18032348244/csqqCMKlY4cENSYv5ZD'
        });
      }
      setFormSuccess(true);
      setFormNome('');
      setFormEmail('');
      setFormWhatsapp('');
      setFormMessage('');
    } catch {
      alert('Houve um erro ao enviar. Tente novamente.');
    }
    setFormSubmitting(false);
  };
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* Hero 1 — Editorial "NEW AI ERA" */}
      <section className="hero-editorial">
        
        <div className="hero-editorial-content" style={{ position: "relative" }}>
          
          {/* Mega Typography */}
          <h1 className="hero-mega-text">
            <span>NEW</span>
            <span>AI</span>
            <span className="hero-text-outline">ERA</span>
          </h1>

          {/* Spline 3D Container — Ready for import */}
          <div className="hero-spline-container" id="spline-hero">
            {/* 
              Para importar um modelo do Spline Design, substitua o placeholder abaixo por:
              
              Opção 1 — Viewer direto:
              <script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.0/build/spline-viewer.js"></script>
              <spline-viewer url="SUA_URL_DO_SPLINE_AQUI"></spline-viewer>
              
              Opção 2 — React component:
              npm install @splinetool/react-spline
              import Spline from '@splinetool/react-spline';
              <Spline scene="SUA_URL_DO_SPLINE_AQUI" />
            */}
            <div className="hero-spline-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(0,219,121,0.5)" strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              <span style={{ color: "rgba(0,219,121,0.5)", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px" }}>Spline 3D</span>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>Importe seu modelo aqui</span>
            </div>
          </div>

          {/* Side Text — Right */}
          <div className="hero-side-text" style={{ right: "48px", bottom: "80px", textAlign: "right", color: "rgba(255,255,255,0.6)" }}>
            <span style={{ color: "rgba(0,219,121,0.8)", fontWeight: 700 }}>// </span>AUTOMATION THAT<br />
            <span style={{ color: "rgba(0,219,121,0.8)", fontWeight: 700 }}>&nbsp;&nbsp;&nbsp;</span>SCALES YOUR BUSINESS
          </div>

          {/* Side Text — Left */}
          <div className="hero-side-text" style={{ left: "48px", bottom: "80px", maxWidth: "320px", color: "rgba(255,255,255,0.5)" }}>
            <span style={{ color: "rgba(0,219,121,0.8)", fontWeight: 700 }}>// </span>
            SOMOS A INFINITY — UMA CONSULTORIA DE TECNOLOGIA AJUDANDO STARTUPS E EMPRESAS A CONSTRUIR PRODUTOS DIGITAIS LIMPOS E INTUITIVOS.
          </div>

        </div>

        {/* Client Logos Bar */}
        <div className="hero-clients-bar">
          <span>SUPABASE</span>
          <span>NEXT.JS</span>
          <span>VERCEL</span>
          <span>META ADS</span>
          <span>REACT</span>
        </div>

      </section>

      {/* Hero 2 — Seção Original */}
      <section className="bg-secondary section-padding" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", overflow: "hidden", minHeight: "80vh" }}>
        
        {/* Left Content */}
        <div style={{ maxWidth: "600px", flex: "1 1 300px", zIndex: 1, marginBottom: "40px", width: "100%" }}>
          <div style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "var(--accent-light)", color: "var(--accent-primary)", borderRadius: "20px", fontSize: "14px", fontWeight: 600, marginBottom: "24px" }}>
            Novas tecnologias escaláveis
          </div>
          <h2 style={{ fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "24px", color: "var(--text-primary)" }}>
            A engenharia por trás do <br /> <span className="text-accent">crescimento</span> digital.
          </h2>
          <p className="text-secondary" style={{ fontSize: "clamp(16px, 2.5vw, 20px)", marginBottom: "40px", maxWidth: "480px", lineHeight: 1.6 }}>
            A Infinity OnDemand une o poder das tecnologias web mais avançadas com consultoria de negócios para transformar operações e-commerce e processos B2B.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a href="#consulting" className="btn-primary" style={{ padding: "16px 32px", fontSize: "18px", display: "inline-flex" }}>
              Ver Nossos Serviços
            </a>
            <a href="#contact" className="btn-secondary" style={{ display: "inline-flex" }}>
              Falar com Especialista
            </a>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div style={{ position: "relative", zIndex: 1, flex: "1 1 300px", height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="animate-float" style={{ 
            width: "100%", maxWidth: "360px", 
            backgroundColor: "var(--bg-secondary)", 
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
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-end", height: "120px", borderBottom: "1px solid var(--bg-tertiary)", paddingBottom: "16px", marginBottom: "16px" }}>
              <div className="bar-1" style={{ flex: 1, backgroundColor: "var(--accent-primary)", borderRadius: "4px 4px 0 0" }}></div>
              <div className="bar-2" style={{ flex: 1, backgroundColor: "var(--accent-primary)", borderRadius: "4px 4px 0 0" }}></div>
              <div className="bar-3" style={{ flex: 1, backgroundColor: "var(--accent-primary)", borderRadius: "4px 4px 0 0" }}></div>
              <div className="bar-4" style={{ flex: 1, backgroundColor: "var(--accent-primary)", borderRadius: "4px 4px 0 0" }}></div>
            </div>
            <div style={{ color: "var(--accent-primary)", fontWeight: 600, fontSize: "14px" }}>+248% vs mês anterior</div>
          </div>

          <div className="animate-float-delayed" style={{
            position: "absolute",
            left: "-60px",
            bottom: "20px",
            backgroundColor: "var(--bg-secondary)",
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
          
          <div className="animate-glow" style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, background: "radial-gradient(circle, rgba(0,219,121,0.05) 0%, transparent 70%)", zIndex: 0, borderRadius: "50%" }}></div>
        </div>

      </section>

      {/* Tech Logos Carousel */}
      <section style={{ backgroundColor: "var(--bg-secondary)", padding: "32px 0", borderBottom: "1px solid var(--bg-tertiary)", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "15vw", height: "100%", background: "linear-gradient(to right, var(--bg-secondary) 10%, transparent)", zIndex: 2, pointerEvents: "none" }}></div>
        <div style={{ position: "absolute", top: 0, right: 0, width: "15vw", height: "100%", background: "linear-gradient(to left, var(--bg-secondary) 10%, transparent)", zIndex: 2, pointerEvents: "none" }}></div>
        
        <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
          <div className="clients-carousel-track" style={{ display: "flex", gap: "60px", width: "max-content", alignItems: "center" }}>
            {[
              "✦ INFINITY ONDEMAND", "✦ SUPABASE", "✦ REACT NATIVE", "✦ NEXT.JS", "✦ META ADS", 
              "✦ VERCEL", "✦ GOOGLE ADS", "✦ TIKTOK ADS", "✦ NODE.JS", "✦ INFINITY DELIVERY OS",
              "✦ INFINITY ONDEMAND", "✦ SUPABASE", "✦ REACT NATIVE", "✦ NEXT.JS", "✦ META ADS", 
              "✦ VERCEL", "✦ GOOGLE ADS", "✦ TIKTOK ADS", "✦ NODE.JS", "✦ INFINITY DELIVERY OS",
              "✦ INFINITY ONDEMAND", "✦ SUPABASE", "✦ REACT NATIVE", "✦ NEXT.JS", "✦ META ADS", 
              "✦ VERCEL", "✦ GOOGLE ADS", "✦ TIKTOK ADS", "✦ NODE.JS", "✦ INFINITY DELIVERY OS",
            ].map((text, i) => (
              <div key={i} style={{ 
                fontFamily: "var(--font-display, 'Inter', sans-serif)", 
                fontSize: "18px", 
                fontWeight: 700, 
                letterSpacing: "2px", 
                color: "var(--text-secondary)", 
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center"
              }}>
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Labs Showcase Section */}
      <section id="labs" className="section-padding" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-1px", marginBottom: "16px" }}>Infinity Labs</h2>
            <p className="text-secondary" style={{ fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
              Nosso núcleo de pesquisa e desenvolvimento. Testamos tecnologias emergentes para criar soluções práticas para o seu e-commerce.
            </p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "32px" }}>
            {/* Project 1 */}
            <div className="card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ height: "200px", borderRadius: "12px", marginBottom: "24px", overflow: "hidden" }}>
                <img src="/ai_agents.png" alt="Agentes de I.A." style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "12px" }}>Agentes de I.A. Autônomos</h3>
              <p className="text-secondary" style={{ flex: 1, lineHeight: 1.6 }}>Pesquisa focada em criar agentes preditivos que antecipam rupturas de estoque no e-commerce antes que aconteçam.</p>
              <div style={{ marginTop: "24px", fontWeight: 600, color: "var(--accent-primary)", fontSize: "14px" }}>Status: Em testes Alfa</div>
            </div>

            {/* Project 2 */}
            <div className="card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ height: "200px", borderRadius: "12px", marginBottom: "24px", overflow: "hidden" }}>
                <img src="/framework_engine.png" alt="Headless Commerce Engine" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "12px" }}>Headless Commerce Engine</h3>
              <p className="text-secondary" style={{ flex: 1, lineHeight: 1.6 }}>Framework baseado em Next.js para entregar lojas virtuais B2B que carregam em menos de 100ms.</p>
              <div style={{ marginTop: "24px", fontWeight: 600, color: "var(--text-primary)", fontSize: "14px" }}>Status: Implementado</div>
            </div>

            {/* Project 3 */}
            <div className="card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ height: "200px", borderRadius: "12px", marginBottom: "24px", overflow: "hidden" }}>
                <img src="/landing_pages.png" alt="Landing Pages Autônomas" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "12px" }}>Landing Pages Autônomas</h3>
              <p className="text-secondary" style={{ flex: 1, lineHeight: 1.6 }}>I.A. que analisa o seu negócio, entende o nicho e gera landing pages de alta conversão automaticamente — do copy ao design, sem intervenção humana.</p>
              <div style={{ marginTop: "24px", fontWeight: 600, color: "var(--accent-secondary)", fontSize: "14px" }}>Status: Em desenvolvimento</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product: CRM */}
      <section className="section-padding-sm" style={{ backgroundColor: "var(--bg-primary)", borderTop: "1px solid var(--bg-tertiary)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", backgroundColor: "var(--bg-secondary)", borderRadius: "24px", padding: "clamp(24px, 4vw, 64px)", display: "flex", flexWrap: "wrap", gap: "32px", alignItems: "center", border: "1px solid var(--bg-tertiary)" }}>
          <div style={{ flex: "1 1 400px" }}>
            <div style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "var(--bg-primary)", color: "var(--accent-secondary)", borderRadius: "20px", fontSize: "14px", fontWeight: 600, marginBottom: "16px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--bg-tertiary)" }}>
              Plataforma Proprietária
            </div>
            <h2 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, letterSpacing: "-1px", lineHeight: 1.2, marginBottom: "24px", color: "var(--text-primary)" }}>
              Infinity CRM
            </h2>
            <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", lineHeight: 1.6 }}>
              Acelere suas vendas e gerencie seu relacionamento com o cliente através do nosso CRM inteligente, criado dentro do <b>Infinity Labs</b> com foco em alta conversão e análise de dados.
            </p>
            <a href="https://crm.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: "16px 32px", fontSize: "18px", display: "inline-flex" }}>
              Acessar Plataforma CRM
            </a>
          </div>
          <div style={{ flex: "1 1 400px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "500px", aspectRatio: "4/3", borderRadius: "16px", boxShadow: "var(--shadow-lg)", overflow: "hidden", border: "1px solid var(--bg-tertiary)" }}>
               <img src="/crm_dashboard.png" alt="Infinity CRM Dashboard" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product: Delivery SaaS */}
      <section className="section-padding-md" style={{ backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--bg-tertiary)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "32px", alignItems: "center" }}>
          
          <div style={{ flex: "1 1 500px", order: 2 }}>
            <div style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "var(--bg-primary)", color: "var(--accent-secondary)", borderRadius: "20px", fontSize: "14px", fontWeight: 600, marginBottom: "16px", border: "1px solid var(--bg-tertiary)" }}>
              Plataforma SaaS Multi-Tenant
            </div>
            <h2 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, letterSpacing: "-1px", lineHeight: 1.2, marginBottom: "24px", color: "var(--text-primary)" }}>
              Infinity Delivery OS
            </h2>
            <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px", lineHeight: 1.6 }}>
              O sistema definitivo para operações de delivery e pizzarias. Uma infraestrutura robusta, comercializada no modelo SaaS, com front-end reativo de ponta e painel administrativo 100% integrado ao Ponto de Venda.
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: "24px", marginBottom: "40px" }}>
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

            <a href="/delivery" className="btn-primary" style={{ padding: "16px 32px", fontSize: "18px", display: "inline-flex" }}>
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
      <section className="section-padding-md" style={{ backgroundColor: "var(--bg-primary)", borderTop: "1px solid var(--bg-tertiary)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "32px", alignItems: "center" }}>
          
          <div style={{ flex: "1 1 500px", order: 1 }}>
            <div style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "var(--bg-secondary)", color: "var(--accent-secondary)", borderRadius: "20px", fontSize: "14px", fontWeight: 600, marginBottom: "16px", border: "1px solid var(--bg-tertiary)" }}>
              Fábrica de Lojas Virtuais
            </div>
            <h2 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, letterSpacing: "-1px", lineHeight: 1.2, marginBottom: "24px", color: "var(--text-primary)" }}>
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

            <a href="https://ecommerce.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: "16px 32px", fontSize: "18px" }}>
              Ver Soluções de E-commerce
            </a>
          </div>

          <div style={{ flex: "1 1 400px", display: "flex", justifyContent: "center", order: 2 }}>
            <div style={{ width: "100%", maxWidth: "500px", aspectRatio: "1/1", backgroundColor: "var(--bg-secondary)", borderRadius: "24px", boxShadow: "var(--shadow-md)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--bg-tertiary)", position: "relative", overflow: "hidden" }}>
               {/* E-commerce Visual Showcase */}
               <img 
                  src="/ecommerce_showcase.png"
                  alt="E-commerce Dashboard - Infinity On Demand"
                  style={{ width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}
               />
            </div>
          </div>
          
        </div>
      </section>

      {/* Consulting Services Section */}
      <section id="consulting" className="section-padding" style={{ backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-1px", marginBottom: "60px", textAlign: "center", color: "#0B0F19" }}>Consultoria <span style={{ background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Especializada</span></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "24px" }}>
            
            <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", transition: "box-shadow 0.3s ease, transform 0.3s ease" }} onMouseOver={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseOut={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #00DF81 0%, #00AAFF 100%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", boxShadow: "0 4px 15px rgba(0,223,129,0.25)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 20V14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M12 20V8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M18 20V4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="6" cy="11" r="2" fill="#fff" opacity="0.6"/>
                  <circle cx="12" cy="5" r="2" fill="#fff" opacity="0.6"/>
                </svg>
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px", color: "#0B0F19" }}>Tráfego Pago / Performance</h3>
              <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#6B7280" }}>Otimização rigorosa de CAC (Custo de Aquisição) e ROAS em campanhas multicanal, alavancando suas vendas usando automação e dados.</p>
            </div>

            <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", transition: "box-shadow 0.3s ease, transform 0.3s ease" }} onMouseOver={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseOut={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #00AAFF 0%, #7C3AED 100%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", boxShadow: "0 4px 15px rgba(0,170,255,0.25)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M12 22V12" stroke="#fff" strokeWidth="2"/>
                  <path d="M20 7L12 12L4 7" stroke="#fff" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="2" fill="#fff" opacity="0.6"/>
                </svg>
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px", color: "#0B0F19" }}>Plataformas Delivery OS</h3>
              <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#6B7280" }}>Engenharia completa de sistemas de Delivery / SaaS de alto nível, com provisionamento cloud inteligente e escalável.</p>
            </div>

            <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", transition: "box-shadow 0.3s ease, transform 0.3s ease" }} onMouseOver={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseOut={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", boxShadow: "0 4px 15px rgba(245,158,11,0.25)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="9" cy="7" r="4" stroke="#fff" strokeWidth="2"/>
                  <path d="M3 21V19C3 16.79 4.79 15 7 15H11C13.21 15 15 16.79 15 19V21" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 3.13C17.8 3.57 19.14 5.18 19.14 7.1C19.14 9.02 17.8 10.63 16 11.07" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M21 21V19C20.99 17.1 19.68 15.47 17.88 15" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px", color: "#0B0F19" }}>Implantação de CRM B2B</h3>
              <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#6B7280" }}>Setup avançado de CRMs como HubSpot e plataformas próprias integradas, organizando o funil de vendas da sua operação comercial.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Flash AI SDR CTA */}
      <section className="section-padding" style={{ background: "linear-gradient(135deg, #0B0F19 0%, #0d1a2d 50%, #0B0F19 100%)", borderTop: "1px solid var(--bg-tertiary)", borderBottom: "1px solid var(--bg-tertiary)", position: "relative", overflow: "hidden" }}>
        {/* Glow effects */}
        <div style={{ position: "absolute", top: "50%", left: "30%", transform: "translate(-50%, -50%)", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(0,219,121,0.12) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }}></div>
        <div style={{ position: "absolute", top: "50%", right: "10%", transform: "translateY(-50%)", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(0,170,255,0.08) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }}></div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "48px", position: "relative", zIndex: 1 }}>
          
          {/* Left: Text Content */}
          <div style={{ flex: "1 1 420px", maxWidth: "560px" }}>
            <div style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "rgba(0,219,121,0.1)", color: "var(--accent-primary)", borderRadius: "20px", fontSize: "13px", fontWeight: 600, marginBottom: "24px", border: "1px solid rgba(0,219,121,0.2)", letterSpacing: "0.5px" }}>
              ⚡ SDR com Inteligência Artificial
            </div>
            <h2 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: "20px", color: "#fff" }}>
              Conheça o <span className="text-gradient">Flash</span>
            </h2>
            <p style={{ fontSize: "17px", lineHeight: 1.8, color: "rgba(255,255,255,0.7)", marginBottom: "32px" }}>
              Nosso consultor de vendas com I.A. atende via WhatsApp em tempo real. Ele entende suas necessidades, tira dúvidas e monta a melhor proposta para o seu negócio — <strong style={{ color: "#fff" }}>24h por dia, 7 dias por semana</strong>.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
              <a 
                href="https://wa.me/558193997207?text=Ol%C3%A1%20Flash!%20Quero%20saber%20mais%20sobre%20as%20solu%C3%A7%C3%B5es%20da%20Infinity%20OnDemand." 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary" 
                style={{ padding: "18px 36px", fontSize: "17px", gap: "10px", whiteSpace: "nowrap" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Conversar com o Flash
              </a>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>Resposta instantânea</span>
            </div>
          </div>

          {/* Right: Flash Robot Image */}
          <div style={{ flex: "0 1 380px", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
            <div className="animate-float" style={{ position: "relative", width: "100%", maxWidth: "350px" }}>
              <img 
                src="/flash-robot.png" 
                alt="Flash - Consultor de Vendas I.A. da Infinity On Demand" 
                style={{ 
                  width: "100%", 
                  height: "auto", 
                  borderRadius: "24px",
                  filter: "drop-shadow(0 0 40px rgba(0,219,121,0.2)) drop-shadow(0 0 80px rgba(0,170,255,0.1))"
                }} 
              />
              {/* Glowing ring behind */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "110%", height: "110%", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,219,121,0.06) 0%, transparent 60%)", zIndex: -1, pointerEvents: "none" }}></div>
            </div>
          </div>

        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="section-padding" style={{ backgroundColor: "var(--bg-secondary)", display: "flex", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {/* Subtle green glow behind the form */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", maxWidth: "800px", height: "100%", background: "radial-gradient(circle, rgba(0,219,121,0.15) 0%, transparent 60%)", zIndex: 0, pointerEvents: "none" }}></div>
        
        <div style={{ maxWidth: "600px", width: "100%", backgroundColor: "rgba(255, 255, 255, 0.03)", borderRadius: "24px", padding: "clamp(24px, 4vw, 48px)", border: "1px solid rgba(0, 219, 121, 0.2)", backdropFilter: "blur(20px)", boxShadow: "0 30px 60px rgba(0,0,0,0.3)", zIndex: 1, position: "relative" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "16px", textAlign: "center", color: "#ffffff" }}>Pronto para escalar?</h2>
          <p style={{ textAlign: "center", marginBottom: "40px", color: "rgba(255, 255, 255, 0.7)", fontSize: "18px" }}>Fale com nossos engenheiros e consultores.</p>
          
          {formSuccess ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Mensagem enviada!</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Entraremos em contato em breve.</p>
              <button type="button" onClick={() => setFormSuccess(false)} className="btn-primary" style={{ marginTop: '20px', padding: '12px 24px', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Enviar outra</button>
            </div>
          ) : (
          <form style={{ display: "flex", flexDirection: "column", gap: "24px" }} onSubmit={handleContactSubmit}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>Nome Completo</label>
              <input type="text" placeholder="Seu nome" required value={formNome} onChange={e => setFormNome(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(0,0,0,0.2)", color: "#fff", fontSize: "16px", fontFamily: "inherit", outline: "none", transition: "all 0.2s" }} onFocus={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.4)"; e.target.style.borderColor="var(--accent-primary)"; }} onBlur={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.2)"; e.target.style.borderColor="rgba(255,255,255,0.1)"; }} />
            </div>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 200px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>E-mail Corporativo</label>
                <input type="email" placeholder="nome@empresa.com" required value={formEmail} onChange={e => setFormEmail(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(0,0,0,0.2)", color: "#fff", fontSize: "16px", fontFamily: "inherit", outline: "none", transition: "all 0.2s" }} onFocus={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.4)"; e.target.style.borderColor="var(--accent-primary)"; }} onBlur={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.2)"; e.target.style.borderColor="rgba(255,255,255,0.1)"; }} />
              </div>
              <div style={{ flex: "1 1 200px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>WhatsApp</label>
                <input type="text" placeholder="(11) 99999-9999" maxLength={15} value={formWhatsapp} onChange={handleWhatsappChange} style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(0,0,0,0.2)", color: "#fff", fontSize: "16px", fontFamily: "inherit", outline: "none", transition: "all 0.2s" }} onFocus={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.4)"; e.target.style.borderColor="var(--accent-primary)"; }} onBlur={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.2)"; e.target.style.borderColor="rgba(255,255,255,0.1)"; }} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>Como podemos ajudar?</label>
              <textarea placeholder="Conte-nos sobre seu desafio atual..." rows={4} value={formMessage} onChange={e => setFormMessage(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(0,0,0,0.2)", color: "#fff", fontSize: "16px", fontFamily: "inherit", resize: "vertical", outline: "none", transition: "all 0.2s" }} onFocus={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.4)"; e.target.style.borderColor="var(--accent-primary)"; }} onBlur={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.2)"; e.target.style.borderColor="rgba(255,255,255,0.1)"; }}></textarea>
            </div>
            <button type="submit" className="btn-primary" disabled={formSubmitting} style={{ width: "100%", padding: "18px", fontSize: "16px", marginTop: "12px", border: "none", borderRadius: "12px", cursor: "pointer", opacity: formSubmitting ? 0.7 : 1 }}>
              {formSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </form>
          )}
        </div>
      </section>

      {/* Clients Carousel Section */}
      <section style={{ backgroundColor: "var(--bg-secondary)", padding: "80px 0", borderTop: "1px solid var(--bg-tertiary)", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", paddingLeft: "clamp(16px, 4vw, 48px)", paddingRight: "clamp(16px, 4vw, 48px)" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.5px", textAlign: "center", marginBottom: "16px", color: "var(--text-primary)" }}>
            Nossos <span className="text-gradient">Clientes</span>
          </h2>
          <p className="text-secondary" style={{ textAlign: "center", fontSize: "17px", marginBottom: "60px", maxWidth: "500px", margin: "0 auto 60px" }}>
            Empresas que confiam na Infinity OnDemand para escalar seus negócios.
          </p>
        </div>

        {/* Carousel Track */}
        <div style={{ position: "relative", width: "100%", overflow: "hidden", maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)" }}>
          <div className="clients-carousel-track" style={{ display: "flex", gap: "48px", width: "max-content" }}>
            {[
              { name: "Moov Contábil", logo: "/clientes/moov-contabil.png" },
              { name: "Larissa Paz Mendes", logo: "/clientes/larissa-paz.png" },
              { name: "Eduarda Jatobá", logo: "/clientes/eduarda-jatoba.png" },
              { name: "MedClin Exames", logo: "/clientes/medclin.png" },
              { name: "Moreira Advocacia", logo: "/clientes/moreira-advocacia.webp", darkBg: true },
              { name: "Ecalê", logo: "/clientes/ecale.webp" },
              { name: "Pizzaria Farinha", logo: "/clientes/pizzaria-farinha.png" },
              { name: "Black Burguer", logo: "/clientes/black-burguer.png" },
              { name: "Método Sociedade", logo: "/clientes/metodo-sociedade.png" },
              { name: "Cão Lavado", logo: "/clientes/cao-lavado.png" },
              { name: "Studio Dani Melo", logo: "/clientes/studio-dani-melo.png" },
              { name: "Tutti Sabores", logo: "/clientes/tutti-sabores.webp" },
              { name: "Sportsystem", logo: "/clientes/sportsystem.webp" },
              { name: "Joyce Fenolia Joias", logo: "/clientes/joyce-fenolia.webp" },
              { name: "Josy Oliveira", logo: "/clientes/josy-oliveira.webp" },
              { name: "Flor do Atlântico", logo: "/clientes/flor-do-atlantico.png" },
              { name: "Patty Garden", logo: "/clientes/patty-garden.webp" },
              { name: "Conexem", logo: "/clientes/conexem.png" },
              { name: "Dom Black", logo: "/clientes/dom-black.svg", darkBg: true },
              { name: "Innoveda", logo: "/clientes/innoveda.webp" },
              { name: "Moov Contábil", logo: "/clientes/moov-contabil.png" },
              { name: "Larissa Paz Mendes", logo: "/clientes/larissa-paz.png" },
              { name: "Eduarda Jatobá", logo: "/clientes/eduarda-jatoba.png" },
              { name: "MedClin Exames", logo: "/clientes/medclin.png" },
              { name: "Moreira Advocacia", logo: "/clientes/moreira-advocacia.webp", darkBg: true },
              { name: "Ecalê", logo: "/clientes/ecale.webp" },
              { name: "Pizzaria Farinha", logo: "/clientes/pizzaria-farinha.png" },
              { name: "Black Burguer", logo: "/clientes/black-burguer.png" },
              { name: "Método Sociedade", logo: "/clientes/metodo-sociedade.png" },
              { name: "Cão Lavado", logo: "/clientes/cao-lavado.png" },
              { name: "Studio Dani Melo", logo: "/clientes/studio-dani-melo.png" },
              { name: "Tutti Sabores", logo: "/clientes/tutti-sabores.webp" },
              { name: "Sportsystem", logo: "/clientes/sportsystem.webp" },
              { name: "Joyce Fenolia Joias", logo: "/clientes/joyce-fenolia.webp" },
              { name: "Josy Oliveira", logo: "/clientes/josy-oliveira.webp" },
              { name: "Flor do Atlântico", logo: "/clientes/flor-do-atlantico.png" },
              { name: "Patty Garden", logo: "/clientes/patty-garden.webp" },
              { name: "Conexem", logo: "/clientes/conexem.png" },
              { name: "Dom Black", logo: "/clientes/dom-black.svg", darkBg: true },
              { name: "Innoveda", logo: "/clientes/innoveda.webp" },
            ].map((client: { name: string; logo: string; darkBg?: boolean }, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                <div style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  backgroundColor: client.darkBg ? "#1a1a2e" : "rgba(255,255,255,0.95)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer"
                }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,223,129,0.2)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)"; }}
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%" }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement!.innerHTML = `<span style="font-size:14px;font-weight:700;color:#0B0F19;text-align:center;line-height:1.2">${client.name}</span>`;
                    }}
                  />
                </div>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)", textAlign: "center", maxWidth: "120px" }}>
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="section-padding" style={{ backgroundColor: "var(--bg-primary)", borderTop: "1px solid var(--bg-tertiary)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "60px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "var(--bg-secondary)", color: "var(--accent-primary)", borderRadius: "20px", fontSize: "13px", fontWeight: 600, marginBottom: "16px", border: "1px solid var(--bg-tertiary)", letterSpacing: "1px", textTransform: "uppercase" }}>Blog</div>
              <h2 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, letterSpacing: "-1px" }}>
                Insights do <span className="text-gradient">Infinity Blog</span>
              </h2>
              <p className="text-secondary" style={{ fontSize: "17px", marginTop: "8px" }}>Artigos, guias e novidades sobre tecnologia, e-commerce e inovação.</p>
            </div>
            <a href="/blog" style={{ padding: "12px 28px", border: "1px solid var(--bg-tertiary)", borderRadius: "10px", color: "var(--text-primary)", fontWeight: 600, fontSize: "14px", transition: "all 0.3s ease", textDecoration: "none" }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--accent-primary)"; e.currentTarget.style.color = "var(--accent-primary)"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            >
              Ver todos os artigos →
            </a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "32px" }}>

            {/* Blog Post 1 - Featured Large */}
            <a href="/blog/agentes-ia-revolucionando-ecommerce-2026" style={{ textDecoration: "none", color: "inherit", borderRadius: "20px", overflow: "hidden", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--bg-tertiary)", transition: "transform 0.3s ease, box-shadow 0.3s ease", display: "flex", flexDirection: "column" }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,223,129,0.1)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
                <img src="/blog_ai.png" alt="Inteligência Artificial" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} />
                <div style={{ position: "absolute", top: "16px", left: "16px", padding: "6px 12px", backgroundColor: "rgba(0,223,129,0.9)", borderRadius: "6px", fontSize: "11px", fontWeight: 700, color: "#000", letterSpacing: "0.5px", textTransform: "uppercase" }}>I.A. & Machine Learning</div>
              </div>
              <div style={{ padding: "28px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div className="text-secondary" style={{ fontSize: "13px", marginBottom: "12px" }}>19 Mar, 2026 • 8 min de leitura</div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, lineHeight: 1.4, marginBottom: "12px" }}>Como Agentes de I.A. Estão Revolucionando o E-commerce em 2026</h3>
                <p className="text-secondary" style={{ fontSize: "14px", lineHeight: 1.6, flex: 1 }}>Descubra como agentes autônomos preditivos podem antecipar rupturas de estoque e otimizar sua operação online.</p>
                <div style={{ marginTop: "20px", fontSize: "14px", fontWeight: 600, color: "var(--accent-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  Ler artigo <span style={{ transition: "transform 0.2s" }}>→</span>
                </div>
              </div>
            </a>

            {/* Blog Post 2 */}
            <a href="/blog/5-estrategias-performance-triplicam-vendas" style={{ textDecoration: "none", color: "inherit", borderRadius: "20px", overflow: "hidden", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--bg-tertiary)", transition: "transform 0.3s ease, box-shadow 0.3s ease", display: "flex", flexDirection: "column" }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,170,255,0.1)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
                <img src="/blog_ecommerce.png" alt="E-commerce" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} />
                <div style={{ position: "absolute", top: "16px", left: "16px", padding: "6px 12px", backgroundColor: "rgba(0,170,255,0.9)", borderRadius: "6px", fontSize: "11px", fontWeight: 700, color: "#fff", letterSpacing: "0.5px", textTransform: "uppercase" }}>E-commerce</div>
              </div>
              <div style={{ padding: "28px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div className="text-secondary" style={{ fontSize: "13px", marginBottom: "12px" }}>15 Mar, 2026 • 6 min de leitura</div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, lineHeight: 1.4, marginBottom: "12px" }}>5 Estratégias de Performance que Triplicam suas Vendas Online</h3>
                <p className="text-secondary" style={{ fontSize: "14px", lineHeight: 1.6, flex: 1 }}>Técnicas avançadas de otimização de CAC e ROAS para campanhas multicanal de alta conversão.</p>
                <div style={{ marginTop: "20px", fontSize: "14px", fontWeight: 600, color: "var(--accent-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  Ler artigo <span>→</span>
                </div>
              </div>
            </a>

            {/* Blog Post 3 */}
            <a href="/blog/futuro-delivery-tecnologia-restaurantes" style={{ textDecoration: "none", color: "inherit", borderRadius: "20px", overflow: "hidden", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--bg-tertiary)", transition: "transform 0.3s ease, box-shadow 0.3s ease", display: "flex", flexDirection: "column" }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,223,129,0.1)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
                <img src="/blog_delivery.png" alt="Delivery" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} />
                <div style={{ position: "absolute", top: "16px", left: "16px", padding: "6px 12px", backgroundColor: "rgba(255,200,50,0.9)", borderRadius: "6px", fontSize: "11px", fontWeight: 700, color: "#000", letterSpacing: "0.5px", textTransform: "uppercase" }}>Delivery & SaaS</div>
              </div>
              <div style={{ padding: "28px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div className="text-secondary" style={{ fontSize: "13px", marginBottom: "12px" }}>10 Mar, 2026 • 5 min de leitura</div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, lineHeight: 1.4, marginBottom: "12px" }}>O Futuro do Delivery: Como a Tecnologia Está Transformando Restaurantes</h3>
                <p className="text-secondary" style={{ fontSize: "14px", lineHeight: 1.6, flex: 1 }}>De cardápios digitais a gestão Kanban de pedidos — como plataformas SaaS estão dominando o food service.</p>
                <div style={{ marginTop: "20px", fontSize: "14px", fontWeight: 600, color: "#FFC832", display: "flex", alignItems: "center", gap: "6px" }}>
                  Ler artigo <span>→</span>
                </div>
              </div>
            </a>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
