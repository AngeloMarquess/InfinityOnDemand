'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DeliveryContent({ dict, locale }: { dict: any; locale: string }) {
  const es = locale === 'es';
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
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome, email, whatsapp, origin: 'delivery' }) });
      if (!res.ok) throw new Error('Failed');
      setFormSuccess(true); setNome(''); setEmail(''); setWhatsapp('');
    } catch { alert(es ? 'Hubo un error al enviar. Intenta de nuevo.' : 'Houve um erro ao enviar. Tente novamente.'); }
    setIsSubmitting(false);
  };

  const features = [
    { icon: '📱', title: es ? 'Menú Digital Inteligente' : 'Cardápio Digital Inteligente', desc: es ? 'QR Code en la mesa, link en Instagram o WhatsApp. Tu cliente hace el pedido en segundos, sin necesidad de app.' : 'QR Code na mesa, link no Instagram ou WhatsApp. Seu cliente faz o pedido em segundos, sem precisar de app.' },
    { icon: '🛵', title: es ? 'Gestión de Entregas' : 'Gestão de Entregas', desc: es ? 'Panel Kanban con drag-and-drop para seguir pedidos en tiempo real: Pendiente → Cocina → En camino → Entregado.' : 'Painel Kanban com drag-and-drop para acompanhar pedidos em tempo real: Pendente → Cozinha → Saiu → Entregue.' },
    { icon: '💳', title: es ? 'PDV Integrado' : 'PDV Integrado', desc: es ? 'Módulo de Punto de Venta para mostrador físico, sincronizado en tiempo real con el delivery y flujo de caja.' : 'Módulo de Ponto de Venda para balcão físico, sincronizado em tempo real com o delivery e fluxo de caixa.' },
    { icon: '📊', title: es ? 'Reportes en Tiempo Real' : 'Relatórios em Tempo Real', desc: es ? 'Dashboard con métricas de facturación, ticket promedio, horarios pico y ranking de productos más vendidos.' : 'Dashboard com métricas de faturamento, ticket médio, horários de pico e ranking de produtos mais vendidos.' },
    { icon: '🎨', title: es ? 'Tu Marca, Tu Dominio' : 'Sua Marca, Seu Domínio', desc: es ? 'Menú 100% White-Label con los colores, logo y dominio personalizado de tu establecimiento.' : 'Cardápio 100% White-Label com as cores, logo e domínio personalizado do seu estabelecimento.' },
    { icon: '⚡', title: es ? 'Velocidad Absurda' : 'Velocidade Absurda', desc: es ? 'Carga por debajo de 100ms. Tu cliente nunca más abandona el pedido por lentitud.' : 'Carregamento abaixo de 100ms. Seu cliente nunca mais abandona o pedido por lentidão.' },
  ];

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header dict={dict} locale={locale} />

      <section style={{ padding: '140px 48px 100px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '60px', position: 'relative', overflow: 'hidden', minHeight: '85vh' }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(0,170,255,0.08) 0%, rgba(0,223,129,0.05) 40%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ maxWidth: '580px', flex: '1 1 450px', zIndex: 1 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--accent-gradient)', borderRadius: '20px', fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '20px', letterSpacing: '0.5px' }}>🚀 {es ? 'PLATAFORMA #1 DE DELIVERY' : 'PLATAFORMA #1 DE DELIVERY'}</div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-1.5px', marginBottom: '24px' }}>{es ? 'Tu restaurante' : 'Seu restaurante'} <br /><span className="text-gradient">100% digital.</span></h1>
          <p className="text-secondary" style={{ fontSize: '20px', lineHeight: 1.7, marginBottom: '40px', maxWidth: '480px' }}>{es ? 'Menú digital, gestión de pedidos en tiempo real, PDV integrado y mucho más. Todo lo que necesitas para vender más y gastar menos.' : 'Cardápio digital, gestão de pedidos em tempo real, PDV integrado e muito mais. Tudo que você precisa para vender mais e gastar menos.'}</p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href="#planos" className="btn-primary" style={{ padding: '18px 36px', fontSize: '18px' }}>{es ? 'Prueba Gratis por 14 Días' : 'Teste Grátis por 14 Dias'}</a>
            <a href="#demo" className="btn-secondary">{es ? 'Ver Demostración' : 'Ver Demonstração'}</a>
          </div>
          <div className="text-secondary" style={{ marginTop: '24px', fontSize: '14px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <span>✓ {es ? 'Sin tarjeta de crédito' : 'Sem cartão de crédito'}</span>
            <span>✓ Setup {es ? 'en 5 minutos' : 'em 5 minutos'}</span>
            <span>✓ {es ? 'Cancela cuando quieras' : 'Cancele quando quiser'}</span>
          </div>
        </div>
        <div style={{ flex: '1 1 400px', maxWidth: '500px', display: 'flex', justifyContent: 'center', zIndex: 1 }}>
          <div className="animate-float" style={{ width: '100%', maxWidth: '380px', aspectRatio: '9/18', borderRadius: '36px', overflow: 'hidden', border: '3px solid var(--bg-tertiary)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)', position: 'relative', backgroundColor: 'var(--bg-secondary)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--bg-tertiary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🍕</div>
              <div><div style={{ fontWeight: 700, fontSize: '14px' }}>Pizzaria Tradição</div><div style={{ fontSize: '11px', color: 'var(--accent-primary)' }}>● {es ? 'Abierto ahora' : 'Aberto agora'}</div></div>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', overflowX: 'hidden' }}>
              {['🍕 Pizzas', '🍔 Burgers', '🥤 Bebidas'].map((cat, i) => (<div key={i} style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', background: i === 0 ? 'var(--accent-gradient)' : 'var(--bg-tertiary)', color: i === 0 ? '#fff' : 'var(--text-secondary)' }}>{cat}</div>))}
            </div>
            <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[{ name: 'Calabresa Suprema', price: 'R$ 42,90', badge: '🔥 Popular' }, { name: 'Frango c/ Catupiry', price: 'R$ 39,90', badge: '' }, { name: 'Margherita Premium', price: 'R$ 45,90', badge: '⭐ Novo' }].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 50, height: 50, borderRadius: '10px', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>🍕</div>
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>{item.name}{item.badge && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'var(--accent-light)', color: 'var(--accent-primary)' }}>{item.badge}</span>}</div></div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-primary)', whiteSpace: 'nowrap' }}>{item.price}</div>
                </div>
              ))}
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 20px', background: 'var(--accent-gradient)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>🛒 {es ? 'Ver Carrito (3)' : 'Ver Carrinho (3)'}</span>
              <span style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>R$ 128,70</span>
            </div>
          </div>
        </div>
      </section>

      <section id="funcionalidades" style={{ padding: '120px 48px', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>{es ? 'Todo lo que tu delivery' : 'Tudo que seu delivery'} <span className="text-gradient">{es ? 'necesita' : 'precisa'}</span></h2>
            <p className="text-secondary" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>{es ? 'Una plataforma completa que sustituye decenas de herramientas y transforma tu operación.' : 'Uma plataforma completa que substitui dezenas de ferramentas e transforma sua operação.'}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ width: 52, height: 52, borderRadius: '14px', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700 }}>{f.title}</h3>
                <p className="text-secondary" style={{ fontSize: '15px', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="planos" style={{ padding: '120px 48px', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--bg-tertiary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>{es ? 'Planes que' : 'Planos que'} <span className="text-gradient">{es ? 'caben en tu bolsillo' : 'cabem no bolso'}</span></h2>
            <p className="text-secondary" style={{ fontSize: '18px' }}>{es ? 'Empieza gratis. Escala cuando quieras. Sin sorpresas.' : 'Comece grátis. Escale quando quiser. Sem surpresas.'}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
            {[
              { name: 'Starter', price: '97', desc: es ? 'Ideal para quien está empezando' : 'Ideal para quem está começando', features: [es ? 'Menú Digital Ilimitado' : 'Cardápio Digital Ilimitado', 'QR Code', es ? 'Panel Admin Básico' : 'Painel Admin Básico', es ? '1 Usuario' : '1 Usuário', es ? 'Soporte por E-mail' : 'Suporte por E-mail'], cta: es ? 'Empezar Gratis' : 'Começar Grátis', highlight: false },
              { name: 'Professional', price: '197', desc: es ? 'El más popular para operaciones delivery' : 'O mais popular para operações delivery', features: [es ? 'Todo del Starter +' : 'Tudo do Starter +', 'Módulo Kanban', 'PDV + ' + (es ? 'Flujo de Caja' : 'Fluxo de Caixa'), 'Multi-' + (es ? 'Usuarios (hasta 5)' : 'Usuários (até 5)'), es ? 'Reportes Avanzados' : 'Relatórios Avançados', es ? 'Dominio Personalizado' : 'Domínio Personalizado', es ? 'Soporte WhatsApp' : 'Suporte WhatsApp'], cta: es ? 'Suscribirse Ahora' : 'Assinar Agora', highlight: true },
              { name: 'Enterprise', price: es ? 'Bajo Consulta' : 'Sob Consulta', desc: es ? 'Para redes y franquicias' : 'Para redes e franquias', features: [es ? 'Todo del Professional +' : 'Tudo do Professional +', 'Multi-' + (es ? 'Tiendas (Franquicias)' : 'Lojas (Franquias)'), 'API Customizada', es ? 'Integraciones ERP/Fiscal' : 'Integrações ERP/Fiscal', es ? 'Usuarios Ilimitados' : 'Usuários Ilimitados', es ? 'Gerente de Cuenta' : 'Gerente de Conta', 'SLA ' + (es ? 'Garantizado' : 'Garantido')], cta: es ? 'Hablar con Consultor' : 'Falar com Consultor', highlight: false },
            ].map((plan, i) => (
              <div key={i} style={{ borderRadius: '20px', padding: plan.highlight ? '3px' : '0', background: plan.highlight ? 'var(--accent-gradient)' : 'transparent' }}>
                <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: plan.highlight ? '18px' : '20px', padding: '40px 32px', height: '100%', display: 'flex', flexDirection: 'column', border: plan.highlight ? 'none' : '1px solid var(--bg-tertiary)', position: 'relative' }}>
                  {plan.highlight && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', padding: '4px 16px', background: 'var(--accent-gradient)', borderRadius: '20px', fontSize: '12px', fontWeight: 700, color: '#fff' }}>⭐ {es ? 'MÁS POPULAR' : 'MAIS POPULAR'}</div>}
                  <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>{plan.name}</h3>
                  <p className="text-secondary" style={{ fontSize: '14px', marginBottom: '24px' }}>{plan.desc}</p>
                  <div style={{ marginBottom: '32px' }}>
                    {plan.price === 'Sob Consulta' || plan.price === 'Bajo Consulta' ? <span style={{ fontSize: '32px', fontWeight: 800 }}>{plan.price}</span> : <><span className="text-secondary" style={{ fontSize: '16px' }}>R$</span><span style={{ fontSize: '48px', fontWeight: 800, marginLeft: '4px' }}>{plan.price}</span><span className="text-secondary" style={{ fontSize: '16px' }}>/{es ? 'mes' : 'mês'}</span></>}
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px', flex: 1 }}>
                    {plan.features.map((feat, j) => (<li key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}><span style={{ color: 'var(--accent-primary)', fontSize: '16px' }}>✓</span>{feat}</li>))}
                  </ul>
                  <a href="#contact" className={plan.highlight ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%', padding: '16px', fontSize: '16px', textAlign: 'center', justifyContent: 'center' }}>{plan.cta}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" style={{ padding: '120px 48px', backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--bg-tertiary)', display: 'flex', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '600px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '24px', padding: 'clamp(24px, 4vw, 48px)', border: '1px solid rgba(0, 170, 255, 0.2)', backdropFilter: 'blur(20px)', boxShadow: '0 30px 60px rgba(0,0,0,0.3)', zIndex: 1, position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '16px', textAlign: 'center', color: '#ffffff' }}>{es ? '¿Quieres probar' : 'Quer testar'} <span className="text-gradient">{es ? 'gratis' : 'grátis'}</span>?</h2>
          <p style={{ textAlign: 'center', marginBottom: '40px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>{es ? 'Deja tus datos y te contactaremos para una demostración personalizada.' : 'Deixe seus dados e entraremos em contato para uma demonstração personalizada.'}</p>
          {formSuccess ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}><div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div><h3 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>{es ? '¡Datos enviados con éxito!' : 'Dados enviados com sucesso!'}</h3><p style={{ color: 'rgba(255,255,255,0.7)' }}>{es ? 'Te contactaremos pronto para agendar tu demostración.' : 'Entraremos em contato em breve para agendar sua demonstração.'}</p><button type="button" onClick={() => setFormSuccess(false)} className="btn-primary" style={{ marginTop: '20px', padding: '12px 24px', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>{es ? 'Enviar de nuevo' : 'Enviar novamente'}</button></div>
          ) : (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} onSubmit={handleLeadSubmit}>
              <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>{es ? 'Nombre del Restaurante' : 'Nome do Restaurante'}</label><input type="text" placeholder={es ? 'Ej: Pizzería Familia Faria' : 'Ex: Pizzaria Família Faria'} required value={nome} onChange={e => setNome(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '16px', fontFamily: 'inherit', outline: 'none' }} /></div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}><label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>E-mail</label><input type="email" placeholder={es ? 'tu@email.com' : 'seu@email.com'} required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '16px', fontFamily: 'inherit', outline: 'none' }} /></div>
                <div style={{ flex: '1 1 200px' }}><label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>WhatsApp</label><input type="text" placeholder="(11) 99999-9999" maxLength={15} value={whatsapp} onChange={handleWhatsappChange} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '16px', fontFamily: 'inherit', outline: 'none' }} /></div>
              </div>
              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '18px', fontSize: '16px', marginTop: '12px', border: 'none', borderRadius: '12px', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>{isSubmitting ? (es ? 'Enviando...' : 'Enviando...') : (es ? 'Agendar Demostración Gratuita' : 'Agendar Demonstração Gratuita')}</button>
            </form>
          )}
        </div>
      </section>

      <Footer dict={dict} locale={locale} />
    </main>
  );
}
