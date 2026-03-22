import Header from '@/components/Header';
import Footer from '@/components/Footer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SobreContent({ dict, locale }: { dict: any; locale: string }) {
  const es = locale === 'es';
  const prefix = locale === 'pt' ? '' : `/${locale}`;

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header dict={dict} locale={locale} />

      <section className="section-padding" style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,219,121,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '24px', letterSpacing: '1px', textTransform: 'uppercase' }}>{es ? 'Nuestra Historia' : 'Nossa História'}</div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.15, marginBottom: '24px' }}>{es ? 'Nacimos de lo' : 'Nascemos do'} <span className="text-gradient">{es ? 'imposible' : 'impossível'}</span></h1>
          <p className="text-secondary" style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', lineHeight: 1.7, maxWidth: '650px', margin: '0 auto' }}>{es ? 'Una conversación en una gasolinera, en plena pandemia, entre dos amigos con miedo de perder el empleo — así empezó Infinity OnDemand.' : 'Uma conversa num posto de gasolina, em plena pandemia, entre dois amigos com medo de perder o emprego — foi assim que a Infinity OnDemand começou.'}</p>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'center', marginBottom: '80px' }}>
            <div style={{ flex: '1 1 280px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '280px', height: '340px', borderRadius: '24px', overflow: 'hidden', position: 'relative', boxShadow: '0 20px 60px rgba(0,219,121,0.15), 0 0 0 1px rgba(0,219,121,0.15)' }}>
                <img src="/angelo-marques.png" alt="Angelo Marques — Fundador da Infinity OnDemand" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px 16px', background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)' }}>
                  <div style={{ fontWeight: 700, fontSize: '18px', color: '#fff' }}>Angelo Marques</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{es ? 'Co-Fundador y CEO' : 'Co-Fundador & CEO'}</div>
                </div>
              </div>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.3, marginBottom: '24px' }}>
                {es ? 'De una conversación en la gasolinera' : 'De uma conversa de posto'}<br />{es ? 'a una' : 'a uma'} <span className="text-gradient">{es ? 'consultoría de tecnología' : 'consultoria de tecnologia'}</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <p>{es ? 'En' : 'Em'} <strong style={{ color: 'var(--text-primary)' }}>2020</strong>, {es ? 'en plena pandemia, cuando todo el mundo estaba parado, dos amigos se encontraron en una gasolinera en Recife. Angelo Marques y su socio compartían el mismo miedo:' : 'no auge da pandemia, quando o mundo inteiro estava parado e a incerteza dominava tudo, dois amigos se encontraram num posto de gasolina em Recife. Angelo Marques e seu sócio compartilhavam o mesmo medo:'} <em>{es ? 'perder el empleo' : 'perder o emprego'}</em>.</p>
                <p>{es ? 'Pero en vez de paralizarse, decidieron actuar. Fundaron ahí mismo el embrión de lo que vendría a ser' : 'Mas ao invés de se paralisar, decidiram agir. Fundaram ali mesmo o embrião do que viria a ser a'} <strong style={{ color: 'var(--accent-primary)' }}>Infinity OnDemand</strong> — {es ? 'inicialmente una agencia de marketing digital.' : 'inicialmente uma agência de marketing digital.'}</p>
                <p>{es ? 'Lo que empezó con campañas de tráfico pago y gestión de redes sociales, rápidamente evolucionó. Hoy, Infinity desarrolla plataformas SaaS, sistemas de gestión integrados y ecosistemas completos de ventas online.' : 'O que começou com campanhas de tráfego pago, rapidamente evoluiu. Hoje, a Infinity desenvolve plataformas SaaS proprietárias, sistemas de gestão integrados e ecossistemas completos de vendas online.'}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '24px', marginBottom: '20px' }}>
            {[
              { year: '2020', text: es ? 'Fundación durante la pandemia' : 'Fundação durante a pandemia', icon: '🚀' },
              { year: '2021', text: es ? 'Primeros clientes de e-commerce' : 'Primeiros clientes de e-commerce', icon: '🛒' },
              { year: '2023', text: 'Parceiro Silver Nuvemshop', icon: '☁️' },
              { year: '2024', text: es ? 'Premiación Ciclo 100K' : 'Premiação Ciclo 100K', icon: '🏆' },
              { year: '2025', text: es ? 'Publicación de libro en Amazon' : 'Publicação de livro na Amazon', icon: '📖' },
              { year: '2026', text: es ? 'Consolidación en Delivery y Podcast' : 'Consolidação no Delivery e Podcast', icon: '🎙️' },
            ].map((item) => (
              <div key={item.year} style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px', border: '1px solid var(--bg-tertiary)', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '24px', marginBottom: '6px' }} className="text-gradient">{item.year}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--bg-tertiary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: '16px' }}>{es ? 'Lo que nos' : 'O que nos'} <span className="text-gradient">{es ? 'mueve' : 'move'}</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '24px' }}>
            {[
              { icon: '⚡', title: es ? 'Velocidad y Ejecución' : 'Velocidade & Execução', text: es ? 'Entregamos rápido sin comprometer calidad. Nacimos en una crisis — la urgencia está en nuestro ADN.' : 'Entregamos rápido sem comprometer qualidade. Nascemos numa crise — urgência está no nosso DNA.', gradient: 'linear-gradient(135deg, #00DF81, #00AAFF)' },
              { icon: '🔬', title: es ? 'Innovación Obsesiva' : 'Inovação Obsessiva', text: es ? 'Nuestro Labs prueba tecnologías antes de que se conviertan en tendencia. Agentes de I.A., headless commerce y automatizaciones de punta.' : 'Nosso Labs testa tecnologias antes de virarem tendência. Agentes de I.A., headless commerce e automações de ponta.', gradient: 'linear-gradient(135deg, #00AAFF, #7C3AED)' },
              { icon: '🤝', title: es ? 'Asociación Real' : 'Parceria Real', text: es ? 'No somos proveedores — somos socios de tu crecimiento. Cada cliente es tratado como nuestro propio negocio.' : 'Não somos fornecedores — somos parceiros do seu crescimento. Cada cliente é tratado como nosso próprio negócio.', gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)' },
            ].map((item) => (
              <div key={item.title} style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '32px', border: '1px solid var(--bg-tertiary)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: item.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>{item.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '20px', marginBottom: '12px' }}>{item.title}</h3>
                <p className="text-secondary" style={{ fontSize: '15px', lineHeight: 1.7 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding-sm" style={{ background: 'linear-gradient(135deg, rgba(0,223,129,0.1) 0%, rgba(0,170,255,0.1) 100%)', borderTop: '1px solid var(--bg-tertiary)', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, marginBottom: '16px' }}>{es ? '¿Vamos a construir el' : 'Vamos construir o'} <span className="text-gradient">{es ? 'próximo capítulo' : 'próximo capítulo'}</span> {es ? 'juntos?' : 'juntos?'}</h2>
          <p className="text-secondary" style={{ fontSize: '17px', marginBottom: '32px', lineHeight: 1.7 }}>{es ? 'Si tu empresa necesita tecnología de verdad — no solo promesas — habla con nosotros.' : 'Se a sua empresa precisa de tecnologia de verdade — não só promessas — fale com a gente.'}</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`${prefix}/#contact`} className="btn-primary" style={{ padding: '16px 32px', fontSize: '16px' }}>{es ? 'Hablar con Infinity' : 'Falar com a Infinity'}</a>
            <a href="https://wa.me/558193997207" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '16px 32px', fontSize: '16px', gap: '8px' }}>WhatsApp</a>
          </div>
        </div>
      </section>

      <Footer dict={dict} locale={locale} />
    </main>
  );
}
