'use client';

import { useState, Suspense, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(0,219,121,0.2)', borderTop: '3px solid #00DB79', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  ),
});


interface HomeBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  cover_url: string;
  reading_time: number;
  published_at: string;
  categoryName: string;
  categoryColor: string;
  categoryTextColor: string;
}

const DEFAULT_LATEST_POSTS: HomeBlogPost[] = [
  {
    slug: 'futuro-delivery-tecnologia-restaurantes',
    title: 'O Futuro do Delivery: Como a Tecnologia Está Transformando Restaurantes',
    excerpt: 'Dossiê completo sobre a virada estratégica do food service brasileiro: como restaurantes eliminam taxas abusivas com plataformas próprias sob demanda.',
    cover_url: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80',
    reading_time: 10,
    published_at: '2026-11-02T12:00:00.000Z',
    categoryName: 'Delivery & SaaS',
    categoryColor: '#FFC832',
    categoryTextColor: '#000000',
  },
  {
    slug: 'desvende-o-poder-das-estrategias-de-trafego-pago-para-seu-ecommerce',
    title: 'Desvende o Poder das Estratégias de Tráfego Pago para seu E-commerce',
    excerpt: 'Descubra cinco estratégias avançadas de tráfego pago (Meta Ads, Google Ads e TikTok) para escalar vendas com previsibilidade e ROAS consistente.',
    cover_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    reading_time: 8,
    published_at: '2026-11-02T12:00:00.000Z',
    categoryName: 'Tráfego & Vendas',
    categoryColor: '#00AAFF',
    categoryTextColor: '#FFFFFF',
  },
  {
    slug: 'revolucao-inteligencia-artificial-atendimento-vendas-whatsapp-2026',
    title: 'A Revolução da Inteligência Artificial no Atendimento e Vendas pelo WhatsApp em 2026',
    excerpt: 'Como agentes cognitivos autônomos e automações integradas estão remodelando as conversões e o suporte comercial 24/7.',
    cover_url: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=1200&q=80',
    reading_time: 7,
    published_at: '2026-11-02T12:00:00.000Z',
    categoryName: 'I.A. & Automação',
    categoryColor: '#00DF81',
    categoryTextColor: '#000000',
  },
];

export default function Home() {
  const [formNome, setFormNome] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phraseVisible, setPhraseVisible] = useState(true);

  const [blogPosts, setBlogPosts] = useState<HomeBlogPost[]>(DEFAULT_LATEST_POSTS);

  useEffect(() => {
    fetch('/api/blog/posts?limit=3')
      .then(res => res.json())
      .then(data => {
        if (data && data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
          const mapped: HomeBlogPost[] = data.posts.slice(0, 3).map((p: any) => ({
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt || '',
            cover_url: p.cover_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
            reading_time: p.reading_time || 6,
            published_at: p.published_at || new Date().toISOString(),
            categoryName: p.blog_categories?.name || 'Inovação & Tech',
            categoryColor: p.blog_categories?.color || '#00DF81',
            categoryTextColor: p.blog_categories?.text_color || '#000000',
          }));
          setBlogPosts(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const formatPostDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return 'Nov, 2026';
    }
  };


  const heroPhases = [
    "AUTOMATIZE. ESCALE. DOMINE.",
    "IA QUE TRANSFORMA NEGÓCIOS.",
    "DO CÓDIGO AO CRESCIMENTO.",
    "O FUTURO É AGORA.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseVisible(false);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % heroPhases.length);
        setPhraseVisible(true);
      }, 600);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroPhases.length]);

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

  const splineContainerRef = useRef<HTMLDivElement>(null);

  const handleSplineLoad = useCallback(() => {
    // Remove "Built with Spline" watermark
    setTimeout(() => {
      const container = splineContainerRef.current;
      if (!container) return;
      // Find and hide all non-canvas elements inside the spline wrapper
      const allDivs = container.querySelectorAll('div > div > div > a, div > div > a, a[href*="spline"]');
      allDivs.forEach((el: Element) => {
        (el as HTMLElement).style.display = 'none';
      });
      // Also target by position (bottom-right watermark)
      const children = container.querySelectorAll('div > div > div');
      children.forEach((el: Element) => {
        const style = window.getComputedStyle(el);
        if (style.position === 'absolute' && (style.bottom === '0px' || style.right === '0px')) {
          const links = el.querySelectorAll('a');
          if (links.length > 0) {
            (el as HTMLElement).style.display = 'none';
          }
        }
      });
    }, 1000);
  }, []);
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* Hero 1 — Editorial "NEW AI ERA" */}
      <section className="hero-editorial">
        
        <div className="hero-editorial-content" style={{ position: "relative" }}>
          
          {/* Spline 3D Robot */}
          <div className="hero-spline-container" id="spline-hero" ref={splineContainerRef}>
            <Suspense fallback={<div style={{ width: '100%', height: '100%' }} />}>
              <Spline 
                scene="https://prod.spline.design/mYumKXmmRbZMP5Zg/scene.splinecode" 
                onLoad={handleSplineLoad}
              />
            </Suspense>
          </div>

          {/* Mega Typography */}
          <h1 className="hero-mega-text">
            NEW <span className="hero-text-highlight">AI</span> <span className="hero-text-outline">ERA</span>
          </h1>

          {/* Bottom info row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px", marginTop: "32px" }}>
            {/* Left — Animated Phrases */}
            <div className="hero-side-text" style={{ maxWidth: "420px", color: "rgba(255,255,255,0.7)", minHeight: "60px", position: "relative" }}>
              <span style={{ color: "rgba(0,219,121,0.8)", fontWeight: 700 }}>// </span>
              <span 
                key={phraseIndex}
                style={{
                  display: "inline-block",
                  fontSize: "clamp(16px, 2vw, 22px)",
                  fontWeight: 800,
                  letterSpacing: "2px",
                  opacity: phraseVisible ? 1 : 0,
                  transform: phraseVisible ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(10px)',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {heroPhases[phraseIndex]}
              </span>
            </div>
            {/* Right */}
            <div className="hero-side-text" style={{ textAlign: "right", color: "rgba(255,255,255,0.6)" }}>
              <span style={{ color: "rgba(0,219,121,0.8)", fontWeight: 700 }}>// </span>AUTOMATION THAT<br />
              <span style={{ color: "rgba(0,219,121,0.8)", fontWeight: 700 }}>&nbsp;&nbsp;&nbsp;</span>SCALES YOUR BUSINESS
            </div>
          </div>

        </div>

        {/* Client Logos Carousel */}
        <div className="hero-clients-bar" style={{ overflow: "hidden" }}>
          <div className="clients-carousel-track" style={{ display: "flex", gap: "60px", width: "max-content", alignItems: "center" }}>
            {[
              "SUPABASE", "NEXT.JS", "VERCEL", "META ADS", "REACT", "NODE.JS", "GOOGLE ADS",
              "SUPABASE", "NEXT.JS", "VERCEL", "META ADS", "REACT", "NODE.JS", "GOOGLE ADS",
              "SUPABASE", "NEXT.JS", "VERCEL", "META ADS", "REACT", "NODE.JS", "GOOGLE ADS",
            ].map((text, i) => (
              <span key={i}>{text}</span>
            ))}
          </div>
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
            {blogPosts.map((post) => (
              <a 
                key={post.slug}
                href={`/blog/${post.slug}`} 
                style={{ 
                  textDecoration: "none", 
                  color: "inherit", 
                  borderRadius: "20px", 
                  overflow: "hidden", 
                  backgroundColor: "var(--bg-secondary)", 
                  border: "1px solid var(--bg-tertiary)", 
                  transition: "transform 0.3s ease, box-shadow 0.3s ease", 
                  display: "flex", 
                  flexDirection: "column" 
                }}
                onMouseOver={(e) => { 
                  e.currentTarget.style.transform = "translateY(-6px)"; 
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,223,129,0.12)"; 
                }}
                onMouseOut={(e) => { 
                  e.currentTarget.style.transform = "translateY(0)"; 
                  e.currentTarget.style.boxShadow = "none"; 
                }}
              >
                <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
                  <img 
                    src={post.cover_url} 
                    alt={post.title} 
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} 
                  />
                  <div style={{ 
                    position: "absolute", 
                    top: "16px", 
                    left: "16px", 
                    padding: "6px 12px", 
                    backgroundColor: post.categoryColor || "rgba(0,223,129,0.9)", 
                    borderRadius: "6px", 
                    fontSize: "11px", 
                    fontWeight: 700, 
                    color: post.categoryTextColor || "#000", 
                    letterSpacing: "0.5px", 
                    textTransform: "uppercase" 
                  }}>
                    {post.categoryName}
                  </div>
                </div>
                <div style={{ padding: "28px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div className="text-secondary" style={{ fontSize: "13px", marginBottom: "12px" }}>
                    {formatPostDate(post.published_at)} • {post.reading_time} min de leitura
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, lineHeight: 1.4, marginBottom: "12px" }}>
                    {post.title}
                  </h3>
                  <p className="text-secondary" style={{ fontSize: "14px", lineHeight: 1.6, flex: 1 }}>
                    {post.excerpt}
                  </p>
                  <div style={{ marginTop: "20px", fontSize: "14px", fontWeight: 600, color: "var(--accent-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                    Ler artigo <span style={{ transition: "transform 0.2s" }}>→</span>
                  </div>
                </div>
              </a>
            ))}
          </div></div>
      </section>

      <Footer />
    </main>
  );
}
