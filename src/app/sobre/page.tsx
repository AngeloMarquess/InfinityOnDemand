import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nós | Infinity OnDemand",
  description: "Conheça a história da Infinity OnDemand — da pandemia ao crescimento acelerado em tecnologia, e-commerce e delivery.",
};

export default function SobrePage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* ========== HERO ABOUT ========== */}
      <section className="section-padding" style={{
        background: "linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}>
        {/* Decorative gradient orb */}
        <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(0,219,121,0.08) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "var(--accent-light)", color: "var(--accent-primary)", borderRadius: "20px", fontSize: "13px", fontWeight: 600, marginBottom: "24px", letterSpacing: "1px", textTransform: "uppercase" }}>
            Nossa História
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.15, marginBottom: "24px" }}>
            Nascemos do <span className="text-gradient">impossível</span>
          </h1>
          <p className="text-secondary" style={{ fontSize: "clamp(16px, 2.5vw, 20px)", lineHeight: 1.7, maxWidth: "650px", margin: "0 auto" }}>
            Uma conversa num posto de gasolina, em plena pandemia, entre dois amigos com medo de perder o emprego — foi assim que a Infinity OnDemand começou.
          </p>
        </div>
      </section>

      {/* ========== ORIGIN STORY ========== */}
      <section className="section-padding" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "48px", alignItems: "center", marginBottom: "80px" }}>

            {/* Founder Photo */}
            <div style={{ flex: "1 1 280px", display: "flex", justifyContent: "center" }}>
              <div style={{
                width: "280px",
                height: "340px",
                borderRadius: "24px",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 20px 60px rgba(0,219,121,0.15), 0 0 0 1px rgba(0,219,121,0.15)",
              }}>
                <img src="/angelo-marques.png" alt="Angelo Marques — Fundador da Infinity OnDemand" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                {/* Gradient overlay at bottom */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "24px 20px 16px",
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                }}>
                  <div style={{ fontWeight: 700, fontSize: "18px", color: "#fff" }}>Angelo Marques</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>Co-Fundador & CEO</div>
                </div>
              </div>
            </div>

            {/* Story Text */}
            <div style={{ flex: "1 1 400px" }}>
              <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1.3, marginBottom: "24px" }}>
                De uma conversa de posto<br />a uma <span className="text-gradient">consultoria de tecnologia</span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                <p>
                  Em <strong style={{ color: "var(--text-primary)" }}>2020</strong>, no auge da pandemia, quando o mundo inteiro estava parado e a incerteza dominava tudo, dois amigos se encontraram num posto de gasolina em Recife. Angelo Marques e seu sócio compartilhavam o mesmo medo: <em>perder o emprego</em>.
                </p>
                <p>
                  Mas ao invés de se paralisar, decidiram agir. Fundaram ali mesmo, naquela conversa, o embrião do que viria a ser a <strong style={{ color: "var(--accent-primary)" }}>Infinity OnDemand</strong> — inicialmente uma agência de marketing digital.
                </p>
                <p>
                  O que começou com campanhas de tráfego pago e gestão de redes sociais, rapidamente evoluiu. A demanda por soluções mais robustas levou a empresa a se transformar em uma <strong style={{ color: "var(--text-primary)" }}>consultoria de tecnologia</strong>, especializada em <strong style={{ color: "var(--text-primary)" }}>e-commerce</strong> e <strong style={{ color: "var(--text-primary)" }}>delivery</strong>.
                </p>
                <p>
                  Hoje, a Infinity desenvolve plataformas SaaS proprietárias, sistemas de gestão integrados e ecossistemas completos de vendas online — sempre movida pela mesma inquietude daquela noite no posto.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline markers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
            gap: "24px",
            marginBottom: "20px",
          }}>
            {[
              { year: "2020", text: "Fundação durante a pandemia", icon: "🚀" },
              { year: "2021", text: "Primeiros clientes de e-commerce", icon: "🛒" },
              { year: "2023", text: "Parceiro Silver Nuvemshop", icon: "☁️" },
              { year: "2024", text: "Premiação Ciclo 100K", icon: "🏆" },
              { year: "2025", text: "Publicação de livro na Amazon", icon: "📖" },
              { year: "2026", text: "Consolidação no Delivery e Podcast", icon: "🎙️" },
            ].map((item) => (
              <div key={item.year} style={{
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid var(--bg-tertiary)",
                textAlign: "center",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{item.icon}</div>
                <div style={{ fontWeight: 800, fontSize: "24px", marginBottom: "6px" }} className="text-gradient">{item.year}</div>
                <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ACHIEVEMENTS ========== */}
      <section className="section-padding" style={{ backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--bg-tertiary)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, letterSpacing: "-1px", marginBottom: "16px" }}>
              Conquistas & <span className="text-gradient">Reconhecimento</span>
            </h2>
            <p className="text-secondary" style={{ fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
              Cada marco é prova de que começar com coragem vale a pena.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", alignItems: "stretch" }}>

            {/* Ciclo 100K Award */}
            <div style={{
              flex: "1 1 500px",
              borderRadius: "24px",
              overflow: "hidden",
              position: "relative",
              border: "1px solid var(--bg-tertiary)",
              boxShadow: "var(--shadow-lg)",
              display: "flex",
              flexDirection: "column",
            }}>
              <div style={{ overflow: "hidden" }}>
                <img src="/ciclo-100k.jpg" alt="Premiação Ciclo 100K — Infinity OnDemand" style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
              <div style={{ padding: "32px", backgroundColor: "var(--bg-primary)", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "32px" }}>🏆</span>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: "22px" }}>Premiação Ciclo 100K</h3>
                    <p className="text-secondary" style={{ fontSize: "14px" }}>Faturamento acima de R$ 100.000</p>
                  </div>
                </div>
                <p className="text-secondary" style={{ fontSize: "15px", lineHeight: 1.7 }}>
                  A Infinity OnDemand foi reconhecida no evento <strong style={{ color: "var(--accent-primary)" }}>Ciclo</strong> por ultrapassar a marca de <strong style={{ color: "var(--text-primary)" }}>R$ 100 mil em faturamento</strong>. Mais do que um número, é a validação de que tecnologia bem aplicada transforma negócios.
                </p>
              </div>
            </div>

            {/* Right column: Partner + Book */}
            <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "32px" }}>

              {/* Nuvemshop Silver Partner */}
              <div style={{
                flex: 1,
                backgroundColor: "var(--bg-primary)",
                borderRadius: "24px",
                padding: "32px",
                border: "1px solid var(--bg-tertiary)",
                display: "flex",
                alignItems: "center",
                gap: "24px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}>
                <div style={{ width: "100px", height: "100px", borderRadius: "16px", overflow: "hidden", flexShrink: 0, boxShadow: "var(--shadow-md)" }}>
                  <img src="/nuvemshop-silver.png" alt="Nuvemshop Silver Partner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: "1 1 180px" }}>
                  <h3 style={{ fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>Silver Partner</h3>
                  <p className="text-secondary" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                    Parceiro oficial <strong style={{ color: "var(--text-primary)" }}>Nuvemshop</strong> com certificação Silver — atendendo e-commerces com excelência técnica e suporte dedicado.
                  </p>
                </div>
              </div>

              {/* Published Book */}
              <div style={{
                flex: 1,
                borderRadius: "24px",
                padding: "32px",
                border: "1px solid rgba(0, 219, 121, 0.2)",
                background: "linear-gradient(135deg, rgba(0,219,121,0.05) 0%, rgba(0,170,255,0.05) 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "32px" }}>📖</span>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: "18px" }}>Livro Publicado</h3>
                    <p className="text-secondary" style={{ fontSize: "13px" }}>Disponível na Amazon</p>
                  </div>
                </div>
                <p className="text-secondary" style={{ fontSize: "14px", lineHeight: 1.7, marginBottom: "20px" }}>
                  <strong style={{ color: "var(--text-primary)" }}>Neurociência & Designer</strong> — Angelo Marques explora no livro como a neurociência pode ser aplicada ao design e à experiência do usuário, unindo ciência e criatividade.
                </p>
                <a
                  href="https://www.amazon.com.br/Neuroci%C3%AAncia-Designer-Angelo-Ferreira-Marques-ebook/dp/B0F7GM77LV"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ padding: "12px 24px", fontSize: "14px", display: "inline-flex", alignSelf: "flex-start", gap: "8px" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21.94 13.11c.19-.56.06-1.13-.31-1.67a1.52 1.52 0 00-.15-.18l-.01-.02-.01-.02-.01-.01s-.01-.01-.02-.02a.42.42 0 00-.06-.05l-.01-.01a.8.8 0 00-.18-.12l-.01-.01c-.56-.3-1.63-.69-3.17-1.13a53.4 53.4 0 00-4.13-.99c-.11-.02-.2-.04-.3-.06a.38.38 0 00.06-.14.47.47 0 00-.14-.43.38.38 0 00-.25-.1H9.5a.38.38 0 00-.25.1.47.47 0 00-.14.43c.01.05.03.1.06.14-.1.02-.19.04-.3.06a53.4 53.4 0 00-4.13.99c-1.54.44-2.61.83-3.17 1.13l-.01.01a.8.8 0 00-.18.12l-.01.01a.42.42 0 00-.06.05s-.01.01-.02.02l-.01.01-.01.02-.01.02c-.14.17-.25.36-.31.55-.15.53-.02 1.11.31 1.67v.01c.32.12.61.29.86.51.8.7 1.16 1.67 1.06 2.66l-.03.26a.95.95 0 00.27.83.76.76 0 00.82.2l.14-.05c.67-.24 1.35-.52 2.03-.84a20.15 20.15 0 002.11-1.1 17.6 17.6 0 001.11-.73c.34-.25.56-.42.56-.42l.18-.14c.1-.07.19-.14.27-.2.38-.28.65-.36.92-.36.27 0 .54.08.92.36.08.06.17.13.27.2l.18.14s.22.17.56.42a17.6 17.6 0 001.11.73 20.15 20.15 0 002.11 1.1c.68.32 1.36.6 2.03.84l.14.05a.76.76 0 00.82-.2.95.95 0 00.27-.83l-.03-.26c-.1-.99.26-1.96 1.06-2.66.25-.22.54-.39.86-.51z"/></svg>
                  Ver na Amazon
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PODCAST SECTION ========== */}
      <section className="section-padding" style={{ backgroundColor: "var(--bg-primary)", borderTop: "1px solid var(--bg-tertiary)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", alignItems: "center" }}>

            {/* Text */}
            <div style={{ flex: "1 1 350px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "linear-gradient(135deg, #1DB954, #00AAFF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", boxShadow: "0 4px 15px rgba(29,185,84,0.3)" }}>🎙️</div>
                <div>
                  <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 700, lineHeight: 1.2 }}>Nosso <span className="text-gradient">Podcast</span></h2>
                  <p className="text-secondary" style={{ fontSize: "14px" }}>Marketing & Tecnologia</p>
                </div>
              </div>
              <p className="text-secondary" style={{ fontSize: "16px", lineHeight: 1.8, marginBottom: "24px" }}>
                No nosso podcast, mergulhamos nos temas que movem o mercado digital: <strong style={{ color: "var(--text-primary)" }}>estratégias de marketing</strong>, <strong style={{ color: "var(--text-primary)" }}>inovações tecnológicas</strong>, e-commerce, I.A. aplicada e os bastidores da construção de um negócio digital de verdade.
              </p>
              <a
                href="https://open.spotify.com/show/0BvAnMoSWEOXCwrc7cYDxe?si=142dc5436ef14faa"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 24px",
                  borderRadius: "24px",
                  background: "#1DB954",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "15px",
                  textDecoration: "none",
                  boxShadow: "0 4px 15px rgba(29,185,84,0.3)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                Ouvir no Spotify
              </a>
            </div>

            {/* Spotify Embed */}
            <div style={{ flex: "1 1 300px", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
              <iframe
                style={{ borderRadius: "12px", border: "none", width: "100%", height: "352px" }}
                src="https://open.spotify.com/embed/show/0BvAnMoSWEOXCwrc7cYDxe?utm_source=generator&theme=0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== VALUES / MISSION ========== */}
      <section className="section-padding" style={{ backgroundColor: "var(--bg-primary)", borderTop: "1px solid var(--bg-tertiary)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-1px", marginBottom: "16px" }}>
              O que nos <span className="text-gradient">move</span>
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: "24px",
          }}>
            {[
              {
                icon: "⚡",
                title: "Velocidade & Execução",
                text: "Entregamos rápido sem comprometer qualidade. Nascemos numa crise — urgência está no nosso DNA.",
                gradient: "linear-gradient(135deg, #00DF81, #00AAFF)",
              },
              {
                icon: "🔬",
                title: "Inovação Obsessiva",
                text: "Nosso Labs testa tecnologias antes de virarem tendência. Agentes de I.A., headless commerce e automações de ponta.",
                gradient: "linear-gradient(135deg, #00AAFF, #7C3AED)",
              },
              {
                icon: "🤝",
                title: "Parceria Real",
                text: "Não somos fornecedores — somos parceiros do seu crescimento. Cada cliente é tratado como nosso próprio negócio.",
                gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
              },
            ].map((item) => (
              <div key={item.title} style={{
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "20px",
                padding: "32px",
                border: "1px solid var(--bg-tertiary)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "16px",
                  background: item.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "24px", marginBottom: "20px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "20px", marginBottom: "12px" }}>{item.title}</h3>
                <p className="text-secondary" style={{ fontSize: "15px", lineHeight: 1.7 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="section-padding-sm" style={{
        background: "linear-gradient(135deg, rgba(0,223,129,0.1) 0%, rgba(0,170,255,0.1) 100%)",
        borderTop: "1px solid var(--bg-tertiary)",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, marginBottom: "16px" }}>
            Vamos construir o <span className="text-gradient">próximo capítulo</span> juntos?
          </h2>
          <p className="text-secondary" style={{ fontSize: "17px", marginBottom: "32px", lineHeight: 1.7 }}>
            Se a sua empresa precisa de tecnologia de verdade — não só promessas — fale com a gente.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/#contact" className="btn-primary" style={{ padding: "16px 32px", fontSize: "16px" }}>
              Falar com a Infinity
            </a>
            <a
              href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Vi%20o%20site%20e%20quero%20saber%20mais%20sobre%20a%20Infinity%20OnDemand."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: "16px 32px", fontSize: "16px", gap: "8px" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
