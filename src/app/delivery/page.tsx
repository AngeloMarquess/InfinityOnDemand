'use client';

import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

const features = [
  { icon: "📱", title: "Cardápio Digital Inteligente", desc: "QR Code na mesa, link no Instagram ou WhatsApp. Seu cliente faz o pedido em segundos, sem precisar de app." },
  { icon: "🛵", title: "Gestão de Entregas", desc: "Painel Kanban com drag-and-drop para acompanhar pedidos em tempo real: Pendente → Cozinha → Saiu → Entregue." },
  { icon: "💳", title: "PDV Integrado", desc: "Módulo de Ponto de Venda para balcão físico, sincronizado em tempo real com o delivery e fluxo de caixa." },
  { icon: "📊", title: "Relatórios em Tempo Real", desc: "Dashboard com métricas de faturamento, ticket médio, horários de pico e ranking de produtos mais vendidos." },
  { icon: "🎨", title: "Sua Marca, Seu Domínio", desc: "Cardápio 100% White-Label com as cores, logo e domínio personalizado do seu estabelecimento." },
  { icon: "⚡", title: "Velocidade Absurda", desc: "Carregamento abaixo de 100ms. Seu cliente nunca mais abandona o pedido por lentidão." },
  { icon: "💰", title: "Módulo Financeiro", desc: "Fluxo de caixa completo com entradas, saídas, contas a pagar/receber e conciliação bancária automática." },
  { icon: "📈", title: "Relatórios Avançados", desc: "Dashboards gerenciais com gráficos de faturamento, comparativos mensais, DRE simplificado e exportação em PDF/Excel." },
  { icon: "👥", title: "Controle de Funcionários", desc: "Gestão de equipe com registro de ponto, escalas de trabalho, permissões por cargo e acompanhamento de desempenho." },
];

const steps = [
  { num: "01", title: "Cadastre seu Cardápio", desc: "Adicione categorias, produtos, variações, tamanhos e preços em minutos." },
  { num: "02", title: "Personalize sua Loja", desc: "Escolha cores, logotipo e configure seu domínio personalizado (ex: seurestaurante.com.br)." },
  { num: "03", title: "Comece a Vender", desc: "Compartilhe o link nas redes sociais e comece a receber pedidos instantaneamente." },
];

const plans = [
  {
    name: "Starter",
    price: "97",
    desc: "Ideal para quem está começando",
    features: ["Cardápio Digital Ilimitado", "QR Code Personalizado", "Painel Admin Básico", "1 Usuário", "Suporte por E-mail"],
    cta: "Começar Grátis",
    highlight: false,
  },
  {
    name: "Professional",
    price: "197",
    desc: "O mais popular para operações delivery",
    features: ["Tudo do Starter +", "Módulo Kanban Completo", "PDV + Fluxo de Caixa", "Multi-Usuários (até 5)", "Relatórios Avançados", "Domínio Personalizado", "Suporte Prioritário WhatsApp"],
    cta: "Assinar Agora",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Sob Consulta",
    desc: "Para redes e franquias",
    features: ["Tudo do Professional +", "Multi-Lojas (Franquias)", "API Customizada", "Integrações ERP/Fiscal", "Usuários Ilimitados", "Gerente de Conta Dedicado", "SLA Garantido"],
    cta: "Falar com Consultor",
    highlight: false,
  },
];

const testimonials = [
  { name: "Ricardo S.", role: "Dono da Pizzaria Tradição", text: "Depois que adotamos o sistema, nosso delivery triplicou em 3 meses. O painel Kanban é sensacional para a cozinha." },
  { name: "Camila T.", role: "Gestora do Burguer Express", text: "Nossos clientes amam a facilidade do cardápio digital. A taxa de abandono caiu 70%!" },
  { name: "João P.", role: "Sócio do Sushi House", text: "O PDV integrado com o delivery nos economiza horas por dia. Tudo sincronizado automaticamente." },
];

export default function DeliveryPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 9) value = `${value.slice(0, 10)}-${value.slice(10)}`;
    setWhatsapp(value);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, whatsapp, origin: 'delivery' }),
      });
      if (!res.ok) throw new Error('Failed');
      setFormSuccess(true);
      setNome('');
      setEmail('');
      setWhatsapp('');
    } catch {
      alert('Houve um erro ao enviar. Tente novamente.');
    }
    setIsSubmitting(false);
  };
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* Hero Section */}
      <section style={{
        padding: "140px 48px 100px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: "60px",
        position: "relative",
        overflow: "hidden",
        minHeight: "85vh",
      }}>
        {/* Glow */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "800px", background: "radial-gradient(circle, rgba(0,170,255,0.08) 0%, rgba(0,223,129,0.05) 40%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: "580px", flex: "1 1 450px", zIndex: 1 }}>
          <div style={{ display: "inline-block", padding: "6px 16px", background: "var(--accent-gradient)", borderRadius: "20px", fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "20px", letterSpacing: "0.5px" }}>
            🚀 PLATAFORMA #1 DE DELIVERY
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.5px", marginBottom: "24px" }}>
            Seu restaurante <br />
            <span className="text-gradient">100% digital.</span>
          </h1>
          <p className="text-secondary" style={{ fontSize: "20px", lineHeight: 1.7, marginBottom: "40px", maxWidth: "480px" }}>
            Cardápio digital, gestão de pedidos em tempo real, PDV integrado e muito mais. Tudo que você precisa para vender mais e gastar menos.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a href="#planos" className="btn-primary" style={{ padding: "18px 36px", fontSize: "18px" }}>
              Teste Grátis por 14 Dias
            </a>
            <a href="#demo" className="btn-secondary">
              Ver Demonstração
            </a>
          </div>
          <div className="text-secondary" style={{ marginTop: "24px", fontSize: "14px", display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <span>✓ Sem cartão de crédito</span>
            <span>✓ Setup em 5 minutos</span>
            <span>✓ Cancele quando quiser</span>
          </div>
        </div>

        <div style={{ flex: "1 1 400px", maxWidth: "500px", display: "flex", justifyContent: "center", zIndex: 1 }}>
          <div className="animate-float" style={{ width: "100%", maxWidth: "380px", aspectRatio: "9/18", borderRadius: "36px", overflow: "hidden", border: "3px solid var(--bg-tertiary)", boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,170,255,0.1)", position: "relative", backgroundColor: "var(--bg-secondary)" }}>
            {/* Phone Mock Header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--bg-tertiary)", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent-gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🍕</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "14px" }}>Pizzaria Tradição</div>
                <div style={{ fontSize: "11px", color: "var(--accent-primary)" }}>● Aberto agora</div>
              </div>
            </div>
            {/* Categories */}
            <div style={{ padding: "12px 16px", display: "flex", gap: "8px", overflowX: "hidden" }}>
              {["🍕 Pizzas", "🍔 Burgers", "🥤 Bebidas", "🍰 Sobremesas"].map((cat, i) => (
                <div key={i} style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap", background: i === 0 ? "var(--accent-gradient)" : "var(--bg-tertiary)", color: i === 0 ? "#fff" : "var(--text-secondary)" }}>
                  {cat}
                </div>
              ))}
            </div>
            {/* Product Items */}
            <div style={{ padding: "8px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { name: "Calabresa Suprema", price: "R$ 42,90", badge: "🔥 Popular" },
                { name: "Frango c/ Catupiry", price: "R$ 39,90", badge: "" },
                { name: "Margherita Premium", price: "R$ 45,90", badge: "⭐ Novo" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", backgroundColor: "var(--bg-tertiary)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ width: 50, height: 50, borderRadius: "10px", background: "linear-gradient(135deg, #1a1a2e, #16213e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>🍕</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                      {item.name}
                      {item.badge && <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "var(--accent-light)", color: "var(--accent-primary)" }}>{item.badge}</span>}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>Borda recheada • Grande</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--accent-primary)", whiteSpace: "nowrap" }}>{item.price}</div>
                </div>
              ))}
            </div>
            {/* Cart bar */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 20px", background: "var(--accent-gradient)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: "14px", color: "#fff" }}>🛒 Ver Carrinho (3)</span>
              <span style={{ fontWeight: 800, fontSize: "16px", color: "#fff" }}>R$ 128,70</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section style={{ padding: "40px 48px", backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--bg-tertiary)", borderBottom: "1px solid var(--bg-tertiary)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "32px", textAlign: "center" }}>
          {[
            { num: "500+", label: "Restaurantes Ativos" },
            { num: "2M+", label: "Pedidos Processados" },
            { num: "99.9%", label: "Uptime Garantido" },
            { num: "4.9★", label: "Avaliação dos Clientes" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-gradient" style={{ fontSize: "36px", fontWeight: 800 }}>{stat.num}</div>
              <div className="text-secondary" style={{ fontSize: "14px", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="funcionalidades" style={{ padding: "120px 48px", backgroundColor: "var(--bg-primary)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "16px" }}>
              Tudo que seu delivery <span className="text-gradient">precisa</span>
            </h2>
            <p className="text-secondary" style={{ fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
              Uma plataforma completa que substitui dezenas de ferramentas e transforma sua operação.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ width: 52, height: 52, borderRadius: "14px", background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 700 }}>{f.title}</h3>
                <p className="text-secondary" style={{ fontSize: "15px", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "100px 48px", backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--bg-tertiary)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "16px" }}>
              Comece em <span className="text-gradient">3 passos</span>
            </h2>
            <p className="text-secondary" style={{ fontSize: "18px" }}>Setup rápido e sem complicação. Você começa a vender hoje.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "32px" }}>
                <div className="text-gradient" style={{ fontSize: "56px", fontWeight: 900, lineHeight: 1, minWidth: "80px" }}>{s.num}</div>
                <div>
                  <h3 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>{s.title}</h3>
                  <p className="text-secondary" style={{ fontSize: "16px", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" style={{ padding: "120px 48px", backgroundColor: "var(--bg-primary)", borderTop: "1px solid var(--bg-tertiary)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "64px", alignItems: "center" }}>
          <div style={{ flex: "1 1 500px" }}>
            <h2 style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: "24px" }}>
              Painel Admin <span className="text-gradient">poderoso</span>
            </h2>
            <p className="text-secondary" style={{ fontSize: "18px", marginBottom: "32px", lineHeight: 1.7 }}>
              Gerencie pedidos com Kanban, acompanhe o faturamento em tempo real, controle estoque e muito mais. Tudo em uma interface Dark Mode rápida e intuitiva.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
              {[
                "Drag & Drop para mover pedidos entre colunas",
                "Notificações sonoras para novos pedidos",
                "Impressão automática na cozinha",
                "Relatórios exportáveis em PDF e Excel",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "6px", background: "var(--accent-gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0 }}>✓</div>
                  <span style={{ fontSize: "16px", fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
            <a href="#planos" className="btn-primary" style={{ padding: "16px 32px", fontSize: "18px" }}>
              Experimentar Gratuitamente
            </a>
          </div>
          <div style={{ flex: "1 1 500px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", minHeight: "400px", backgroundColor: "var(--bg-secondary)", borderRadius: "20px", border: "1px solid var(--bg-tertiary)", boxShadow: "var(--shadow-lg)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {/* Window bar */}
              <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--bg-tertiary)", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#ff5f56" }} />
                <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#ffbd2e" }} />
                <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#27c93f" }} />
                <span style={{ marginLeft: "12px", fontSize: "13px", color: "var(--text-secondary)" }}>admin.seurestaurante.com.br</span>
              </div>
              {/* Kanban Mock */}
              <div style={{ padding: "20px", flex: 1 }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>📋 Quadro de Pedidos</div>
                <div style={{ display: "flex", gap: "12px" }}>
                  {[
                    { title: "Pendente", color: "#ffbd2e", items: ["#2048 - 2x Pizza Calabresa", "#2049 - 1x Combo Burger"] },
                    { title: "Preparando", color: "#ff9500", items: ["#2045 - 3x Pizza Marg.", "#2046 - 1x Sushi Combo", "#2047 - 2x Açaí"] },
                    { title: "Saiu p/ Entrega", color: "#00AAFF", items: ["#2042 - Pedido João S."] },
                    { title: "Entregue", color: "#00DF81", items: ["#2040 - Pedido Maria C.", "#2041 - Pedido Ana P."] },
                  ].map((col, i) => (
                    <div key={i} style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: col.color }} />
                        {col.title}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {col.items.map((item, j) => (
                          <div key={j} style={{ padding: "8px 10px", backgroundColor: "var(--bg-tertiary)", borderRadius: "8px", fontSize: "11px", fontWeight: 500, borderLeft: `3px solid ${col.color}` }}>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cases / Success Stories */}
      <section style={{ padding: "120px 48px", background: "linear-gradient(135deg, #041C10 0%, #0a2a18 50%, #071f12 100%)", borderTop: "1px solid rgba(0,223,129,0.15)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "16px" }}>
              Quem já usa <span className="text-gradient">Infinity Delivery</span>
            </h2>
            <p className="text-secondary" style={{ fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
              Conheça alguns dos nossos cases de sucesso que já operam com a plataforma.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>

            {/* Card 1: DOM BLACK */}
            <a href="https://delivery.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{
                borderRadius: "20px",
                overflow: "hidden",
                position: "relative",
                height: "380px",
                background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
                border: "1px solid var(--bg-tertiary)",
                cursor: "pointer",
                transition: "transform 0.4s ease, box-shadow 0.4s ease",
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-8px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,170,255,0.2), 0 0 30px rgba(0,223,129,0.1)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Glow effect */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(circle at 30% 70%, rgba(0,223,129,0.15) 0%, transparent 60%)", zIndex: 1, pointerEvents: "none" }} />
                {/* Content */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px", zIndex: 2, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-primary)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>🍔 Gourmet Mix</div>
                  <h3 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px", fontStyle: "italic" }}>Dom Black</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>The Container • Hamburgueria artesanal gourmet com cardápio digital completo e gestão de pedidos integrada.</p>
                  <div style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: "var(--accent-secondary)" }}>
                    Ver cardápio ao vivo →
                  </div>
                </div>
                {/* Decorative food emoji */}
                <div style={{ position: "absolute", top: "40px", right: "40px", fontSize: "72px", opacity: 0.15, zIndex: 0 }}>🍔</div>
              </div>
            </a>

            {/* Card 2: Recanto Oriental */}
            <a href="https://delivery.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{
                borderRadius: "20px",
                overflow: "hidden",
                position: "relative",
                height: "380px",
                background: "linear-gradient(135deg, #3b0a0a 0%, #1a0505 100%)",
                border: "1px solid var(--bg-tertiary)",
                cursor: "pointer",
                transition: "transform 0.4s ease, box-shadow 0.4s ease",
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-8px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(255,50,50,0.15), 0 0 30px rgba(255,200,50,0.1)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Glow effect */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(circle at 70% 30%, rgba(200,50,50,0.2) 0%, transparent 60%)", zIndex: 1, pointerEvents: "none" }} />
                {/* Content */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px", zIndex: 2, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#FF6B6B", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>🐉 Culinária Chinesa e Japonesa</div>
                  <h3 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>Recanto Oriental</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>Restaurante oriental com cardápio completo de pratos chineses e japoneses, usando o sistema Infinity para delivery e salão.</p>
                  <div style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: "#FF6B6B" }}>
                    Ver cardápio ao vivo →
                  </div>
                </div>
                {/* Decorative */}
                <div style={{ position: "absolute", top: "40px", right: "40px", fontSize: "72px", opacity: 0.15, zIndex: 0 }}>🏯</div>
              </div>
            </a>

            {/* Card 3: Pizzaria Família Faria */}
            <a href="https://delivery.infinityondemand.com.br/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{
                borderRadius: "20px",
                overflow: "hidden",
                position: "relative",
                height: "380px",
                background: "linear-gradient(135deg, #1a1500 0%, #0d0d00 100%)",
                border: "1px solid var(--bg-tertiary)",
                cursor: "pointer",
                transition: "transform 0.4s ease, box-shadow 0.4s ease",
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-8px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(255,200,50,0.15), 0 0 30px rgba(255,200,50,0.1)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Glow effect */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(circle at 50% 50%, rgba(255,200,50,0.12) 0%, transparent 60%)", zIndex: 1, pointerEvents: "none" }} />
                {/* Shield icon mock */}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -60%)", zIndex: 0, opacity: 0.08 }}>
                  <svg width="200" height="240" viewBox="0 0 200 240" fill="none">
                    <path d="M100 0 L200 60 L200 150 C200 200 150 240 100 240 C50 240 0 200 0 150 L0 60 Z" fill="#FFD700"/>
                  </svg>
                </div>
                {/* Content */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px", zIndex: 2, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#FFD700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>🍕 Pizzaria Tradicional</div>
                  <h3 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>Pizzaria Família Faria</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>Tradição em pizzas artesanais com operação 100% digitalizada — do pedido online ao despacho com rastreio.</p>
                  <div style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: "#FFD700" }}>
                    Ver cardápio ao vivo →
                  </div>
                </div>
                {/* Decorative */}
                <div style={{ position: "absolute", top: "40px", right: "40px", fontSize: "72px", opacity: 0.15, zIndex: 0 }}>🍕</div>
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" style={{ padding: "120px 48px", backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--bg-tertiary)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "16px" }}>
              Planos que <span className="text-gradient">cabem no bolso</span>
            </h2>
            <p className="text-secondary" style={{ fontSize: "18px" }}>Comece grátis. Escale quando quiser. Sem surpresas.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "stretch" }}>
            {plans.map((plan, i) => (
              <div key={i} style={{
                borderRadius: "20px",
                padding: plan.highlight ? "3px" : "0",
                background: plan.highlight ? "var(--accent-gradient)" : "transparent",
              }}>
                <div style={{
                  backgroundColor: "var(--bg-primary)",
                  borderRadius: plan.highlight ? "18px" : "20px",
                  padding: "40px 32px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: plan.highlight ? "none" : "1px solid var(--bg-tertiary)",
                  position: "relative",
                }}>
                  {plan.highlight && (
                    <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", padding: "4px 16px", background: "var(--accent-gradient)", borderRadius: "20px", fontSize: "12px", fontWeight: 700, color: "#fff" }}>
                      ⭐ MAIS POPULAR
                    </div>
                  )}
                  <h3 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>{plan.name}</h3>
                  <p className="text-secondary" style={{ fontSize: "14px", marginBottom: "24px" }}>{plan.desc}</p>
                  <div style={{ marginBottom: "32px" }}>
                    {plan.price === "Sob Consulta" ? (
                      <span style={{ fontSize: "32px", fontWeight: 800 }}>Sob Consulta</span>
                    ) : (
                      <>
                        <span className="text-secondary" style={{ fontSize: "16px" }}>R$</span>
                        <span style={{ fontSize: "48px", fontWeight: 800, marginLeft: "4px" }}>{plan.price}</span>
                        <span className="text-secondary" style={{ fontSize: "16px" }}>/mês</span>
                      </>
                    )}
                  </div>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px", flex: 1 }}>
                    {plan.features.map((feat, j) => (
                      <li key={j} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px" }}>
                        <span style={{ color: "var(--accent-primary)", fontSize: "16px" }}>✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <a href={plan.name === "Enterprise" ? "https://wa.me/5581971027939?text=Ol%C3%A1%20Flash!%20Quero%20saber%20mais%20sobre%20o%20plano%20Enterprise%20do%20Infinity%20Delivery." : "#contact"} target={plan.name === "Enterprise" ? "_blank" : undefined} rel={plan.name === "Enterprise" ? "noopener noreferrer" : undefined} className={plan.highlight ? "btn-primary" : "btn-secondary"} style={{ width: "100%", padding: "16px", fontSize: "16px", textAlign: "center", justifyContent: "center" }}>
                    {plan.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Flash AI SDR CTA */}
      <section style={{ padding: "80px 48px", background: "linear-gradient(135deg, rgba(0,223,129,0.08) 0%, rgba(0,170,255,0.08) 100%)", borderTop: "1px solid var(--bg-tertiary)", borderBottom: "1px solid var(--bg-tertiary)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "32px" }}>
          <div style={{ flex: "1 1 400px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--accent-gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", boxShadow: "0 0 30px rgba(0,223,129,0.3)" }}>⚡</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "22px" }}>Fale com o <span className="text-gradient">Flash</span></div>
                <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Nosso Consultor de Vendas com I.A.</div>
              </div>
            </div>
            <p className="text-secondary" style={{ fontSize: "16px", lineHeight: 1.7 }}>
              Tire todas as suas dúvidas em tempo real pelo WhatsApp. O Flash é nosso SDR inteligente que entende suas necessidades e monta a melhor proposta para o seu negócio — <strong style={{ color: "var(--text-primary)" }}>24h por dia, 7 dias por semana</strong>.
            </p>
          </div>
          <a 
            href="https://wa.me/5581971027939?text=Ol%C3%A1%20Flash!%20Quero%20saber%20mais%20sobre%20o%20Infinity%20Delivery%20OS." 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary" 
            style={{ padding: "20px 40px", fontSize: "18px", gap: "10px", whiteSpace: "nowrap" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Conversar com o Flash
          </a>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "100px 48px", backgroundColor: "var(--bg-primary)", borderTop: "1px solid var(--bg-tertiary)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-1px" }}>
              O que nossos <span className="text-gradient">clientes dizem</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ fontSize: "32px", lineHeight: 1, background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>"</div>
                <p style={{ fontSize: "15px", lineHeight: 1.7, flex: 1, color: "var(--text-secondary)" }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent-gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "16px", color: "#fff" }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "14px" }}>{t.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" style={{ padding: "120px 48px", backgroundColor: "var(--bg-primary)", borderTop: "1px solid var(--bg-tertiary)", display: "flex", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", maxWidth: "800px", height: "100%", background: "radial-gradient(circle, rgba(0,170,255,0.12) 0%, transparent 60%)", zIndex: 0, pointerEvents: "none" }}></div>
        <div style={{ maxWidth: "600px", width: "100%", backgroundColor: "rgba(255, 255, 255, 0.03)", borderRadius: "24px", padding: "clamp(24px, 4vw, 48px)", border: "1px solid rgba(0, 170, 255, 0.2)", backdropFilter: "blur(20px)", boxShadow: "0 30px 60px rgba(0,0,0,0.3)", zIndex: 1, position: "relative" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "16px", textAlign: "center", color: "#ffffff" }}>Quer testar <span className="text-gradient">grátis</span>?</h2>
          <p style={{ textAlign: "center", marginBottom: "40px", color: "rgba(255, 255, 255, 0.7)", fontSize: "18px" }}>Deixe seus dados e entraremos em contato para uma demonstração personalizada.</p>
          {formSuccess ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Dados enviados com sucesso!</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Entraremos em contato em breve para agendar sua demonstração.</p>
              <button type="button" onClick={() => setFormSuccess(false)} className="btn-primary" style={{ marginTop: '20px', padding: '12px 24px', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Enviar novamente</button>
            </div>
          ) : (
          <form style={{ display: "flex", flexDirection: "column", gap: "24px" }} onSubmit={handleLeadSubmit}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>Nome do Restaurante</label>
              <input type="text" placeholder="Ex: Pizzaria Família Faria" required value={nome} onChange={e => setNome(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(0,0,0,0.2)", color: "#fff", fontSize: "16px", fontFamily: "inherit", outline: "none", transition: "all 0.2s" }} onFocus={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.4)"; e.target.style.borderColor="var(--accent-secondary)"; }} onBlur={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.2)"; e.target.style.borderColor="rgba(255,255,255,0.1)"; }} />
            </div>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 200px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>E-mail</label>
                <input type="email" placeholder="seu@email.com" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(0,0,0,0.2)", color: "#fff", fontSize: "16px", fontFamily: "inherit", outline: "none", transition: "all 0.2s" }} onFocus={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.4)"; e.target.style.borderColor="var(--accent-secondary)"; }} onBlur={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.2)"; e.target.style.borderColor="rgba(255,255,255,0.1)"; }} />
              </div>
              <div style={{ flex: "1 1 200px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>WhatsApp</label>
                <input type="text" placeholder="(11) 99999-9999" maxLength={15} value={whatsapp} onChange={handleWhatsappChange} style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(0,0,0,0.2)", color: "#fff", fontSize: "16px", fontFamily: "inherit", outline: "none", transition: "all 0.2s" }} onFocus={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.4)"; e.target.style.borderColor="var(--accent-secondary)"; }} onBlur={(e) => { e.target.style.backgroundColor="rgba(0,0,0,0.2)"; e.target.style.borderColor="rgba(255,255,255,0.1)"; }} />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: "100%", padding: "18px", fontSize: "16px", marginTop: "12px", border: "none", borderRadius: "12px", cursor: "pointer", opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Enviando...' : 'Agendar Demonstração Gratuita'}
            </button>
          </form>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "120px 48px", backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--bg-tertiary)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(0,170,255,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "650px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "44px", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: "24px" }}>
            Pronto para <span className="text-gradient">revolucionar</span> seu delivery?
          </h2>
          <p className="text-secondary" style={{ fontSize: "18px", marginBottom: "40px", lineHeight: 1.7 }}>
            Junte-se a centenas de restaurantes que já faturam mais com a plataforma Infinity Delivery OS.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <a href="#planos" className="btn-primary" style={{ padding: "20px 48px", fontSize: "20px" }}>
              Comece Agora — É Grátis
            </a>
            <a 
              href="https://wa.me/5581971027939?text=Ol%C3%A1%20Flash!%20Quero%20saber%20mais%20sobre%20o%20Infinity%20Delivery%20OS." 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary" 
              style={{ padding: "20px 36px", fontSize: "18px", gap: "8px" }}
            >
              💬 Falar com o Flash
            </a>
          </div>
          <div className="text-secondary" style={{ marginTop: "16px", fontSize: "14px" }}>
            14 dias grátis • Sem cartão • Cancele a qualquer momento
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
