'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './academy.css';

const tracks = [
  { ico: '📈', bg: 'rgba(0,219,121,0.12)', title: 'Marketing', titleEs: 'Marketing', desc: 'Tráfego pago, criativos com IA, funis e growth que geram ROI real.', descEs: 'Tráfico pago, creativos con IA, embudos y growth con ROI real.' },
  { ico: '💰', bg: 'rgba(0,170,255,0.12)', title: 'Vendas', titleEs: 'Ventas', desc: 'Prospecção, SPIN, closing e cadências para times previsíveis.', descEs: 'Prospección, SPIN, closing y cadencias para equipos predecibles.' },
  { ico: '📊', bg: 'rgba(124,58,237,0.14)', title: 'Administração', titleEs: 'Administración', desc: 'Processos, KPIs e finanças para donos que querem escalar.', descEs: 'Procesos, KPIs y finanzas para dueños que quieren escalar.' },
  { ico: '🤖', bg: 'rgba(245,158,11,0.14)', title: 'IA & Automação', titleEs: 'IA & Automatización', desc: 'Aplique inteligência artificial em toda a operação do negócio.', descEs: 'Aplica inteligencia artificial en toda la operación del negocio.' },
];

const steps = [
  { n: '1', title: 'Assine e escolha sua trilha', titleEs: 'Suscríbete y elige tu ruta', desc: 'Acesso imediato a todos os cursos de Marketing, Vendas, Administração e IA.', descEs: 'Acceso inmediato a todos los cursos de Marketing, Ventas, Administración e IA.' },
  { n: '2', title: 'Aprenda no seu ritmo', titleEs: 'Aprende a tu ritmo', desc: 'Player que retoma de onde parou, no computador ou no celular. Sem perder o fio.', descEs: 'Reproductor que retoma donde lo dejaste, en el ordenador o el móvil.' },
  { n: '3', title: 'Ganhe XP e evolua', titleEs: 'Gana XP y evoluciona', desc: 'Conquiste níveis, mantenha o streak e desbloqueie conquistas enquanto aplica.', descEs: 'Sube de nivel, mantén tu racha y desbloquea logros mientras aplicas.' },
];

const b2cFeatures = [
  ['Todas as trilhas liberadas', 'Todas las rutas liberadas'],
  ['Certificados de conclusão', 'Certificados de finalización'],
  ['Player que retoma de onde parou', 'Reproductor que retoma donde lo dejaste'],
  ['Gamificação: XP, níveis e conquistas', 'Gamificación: XP, niveles y logros'],
  ['Novos cursos todo mês', 'Nuevos cursos cada mes'],
  ['Comunidade e suporte', 'Comunidad y soporte'],
];

const b2bFeatures = [
  ['Gestão de assentos e equipes', 'Gestión de asientos y equipos'],
  ['Dashboard de progresso do time', 'Dashboard de progreso del equipo'],
  ['Trilhas personalizadas por cargo', 'Rutas personalizadas por cargo'],
  ['Relatórios de engajamento', 'Reportes de engagement'],
  ['Onboarding e conteúdo sob medida', 'Onboarding y contenido a medida'],
  ['Gerente de sucesso dedicado', 'Gerente de éxito dedicado'],
];

const faqs = [
  { q: 'Preciso ter conhecimento prévio?', qEs: '¿Necesito conocimientos previos?', a: 'Não. As trilhas começam do zero e evoluem até o nível avançado, no seu ritmo.', aEs: 'No. Las rutas comienzan desde cero y avanzan hasta el nivel avanzado, a tu ritmo.' },
  { q: 'Serve para minha empresa treinar o time?', qEs: '¿Sirve para que mi empresa capacite al equipo?', a: 'Sim. No plano Empresas você gerencia assentos, acompanha o progresso de cada pessoa e recebe trilhas sob medida por cargo.', aEs: 'Sí. En el plan Empresas gestionas asientos, sigues el progreso de cada persona y recibes rutas a medida por cargo.' },
  { q: 'O acesso é vitalício ou assinatura?', qEs: '¿El acceso es vitalicio o suscripción?', a: 'É assinatura: enquanto ativa, você tem acesso a tudo, incluindo os cursos novos lançados todo mês.', aEs: 'Es suscripción: mientras esté activa, tienes acceso a todo, incluidos los cursos nuevos cada mes.' },
  { q: 'Ganho certificado?', qEs: '¿Obtengo certificado?', a: 'Sim, cada curso concluído gera um certificado da Infinity Academy.', aEs: 'Sí, cada curso finalizado genera un certificado de Infinity Academy.' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AcademyContent({ dict, locale }: { dict: any; locale: string }) {
  const es = locale === 'es';
  const membersUrl = '/aluno';

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header dict={dict} locale={locale} />

      {/* HERO */}
      <section className="acd-hero">
        <div className="acd-hero-noise" />
        <div className="acd-container">
          <div style={{ maxWidth: 720 }}>
            <div className="acd-badge acd-fade-in">∞ Infinity Academy</div>
            <h1 className="acd-fade-in" style={{ fontSize: 'clamp(40px, 6.5vw, 76px)', fontWeight: 800, letterSpacing: '-2.5px', lineHeight: 1.03, marginBottom: 24 }}>
              {es ? 'A escola de quem quer' : 'A escola de quem quer'}<br />
              <span className="text-gradient">{es ? 'escalar el negocio.' : 'escalar o negócio.'}</span>
            </h1>
            <p className="acd-fade-in-2 text-secondary" style={{ fontSize: 20, lineHeight: 1.7, marginBottom: 40, maxWidth: 600 }}>
              {es
                ? 'Rutas prácticas de Marketing, Ventas y Administración con IA en el centro. Para ti y para tu equipo — al estilo Netflix, con reproductor que retoma donde lo dejaste y gamificación.'
                : 'Trilhas práticas de Marketing, Vendas e Administração com IA no centro. Para você e para o seu time — em uma área estilo Netflix, com player que retoma de onde parou e gamificação.'}
            </p>
            <div className="acd-fade-in-3" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="#planos" className="btn-primary" style={{ padding: '18px 40px', fontSize: 17 }}>
                {es ? 'Comenzar ahora' : 'Começar agora'}
              </a>
              <Link href={membersUrl} className="btn-secondary" style={{ padding: '16px 32px' }}>
                {es ? 'Entrar na área do aluno' : 'Entrar na área do aluno'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '40px 48px', background: '#070b14', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="acd-stats">
            {[
              { v: '+120', l: es ? 'Aulas práticas' : 'Aulas práticas' },
              { v: '4', l: es ? 'Trilhas: Mkt, Vendas, Gestão, IA' : 'Trilhas: Mkt, Vendas, Gestão, IA' },
              { v: '3x', l: es ? 'Mais conclusão com gamificação' : 'Mais conclusão com gamificação' },
              { v: 'B2C+B2B', l: es ? 'Para pessoas e empresas' : 'Para pessoas e empresas' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div className="acd-stat-value">{s.v}</div>
                <div className="acd-stat-label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRILHAS */}
      <section className="acd-section" id="trilhas">
        <div className="acd-eyebrow">{es ? 'Las rutas' : 'As trilhas'}</div>
        <h2 className="acd-h2">{es ? 'Todo lo que tu negocio necesita, en un solo lugar' : 'Tudo que o seu negócio precisa, em um só lugar'}</h2>
        <p className="acd-lead" style={{ marginBottom: 40 }}>
          {es ? 'Contenido aplicado, no teoría. Cada ruta te lleva de la base a la ejecución.' : 'Conteúdo aplicado, não teoria. Cada trilha te leva da base à execução.'}
        </p>
        <div className="acd-grid-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {tracks.map((t, i) => (
            <div key={i} className="acd-track">
              <div className="acd-track-ico" style={{ background: t.bg }}>{t.ico}</div>
              <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10 }}>{es ? t.titleEs : t.title}</h3>
              <p className="text-secondary" style={{ fontSize: 14.5, lineHeight: 1.6 }}>{es ? t.descEs : t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="acd-section" id="como-funciona" style={{ background: '#070b14', maxWidth: '100%' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="acd-eyebrow">{es ? 'Cómo funciona' : 'Como funciona'}</div>
          <h2 className="acd-h2">{es ? 'Del play al resultado' : 'Do play ao resultado'}</h2>
          <div className="acd-grid-3" style={{ marginTop: 40 }}>
            {steps.map((s, i) => (
              <div key={i} className="acd-step">
                <div className="acd-step-num">{s.n}</div>
                <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10 }}>{es ? s.titleEs : s.title}</h3>
                <p className="text-secondary" style={{ fontSize: 15, lineHeight: 1.6 }}>{es ? s.descEs : s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS B2C */}
      <section className="acd-section" id="planos">
        <div className="acd-eyebrow">{es ? 'Para ti' : 'Para você'}</div>
        <h2 className="acd-h2">{es ? 'Planes individuales' : 'Planos individuais'}</h2>
        <p className="acd-lead" style={{ marginBottom: 40 }}>{es ? 'Cancela cuando quieras. Sin fidelidad.' : 'Cancele quando quiser. Sem fidelidade.'}</p>
        <div className="acd-grid-3">
          {/* Mensal */}
          <div className="acd-plan">
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-secondary)' }}>{es ? 'Mensual' : 'Mensal'}</div>
            <div style={{ margin: '14px 0 4px' }}><span className="acd-plan-price">R$97</span><span className="text-secondary">/{es ? 'mes' : 'mês'}</span></div>
            <p className="text-secondary" style={{ fontSize: 14, marginBottom: 20 }}>{es ? 'Flexibilidad total' : 'Flexibilidade total'}</p>
            <div style={{ flex: 1 }}>
              {b2cFeatures.map((f, i) => (<div key={i} className="acd-plan-feat"><span className="acd-check">✓</span>{es ? f[1] : f[0]}</div>))}
            </div>
            <a href="#contact" className="btn-secondary" style={{ marginTop: 22, width: '100%' }}>{es ? 'Empezar' : 'Começar'}</a>
          </div>
          {/* Anual — featured */}
          <div className="acd-plan acd-plan--featured">
            <div className="acd-plan-badge">{es ? 'Más popular' : 'Mais popular'}</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--accent-primary)' }}>{es ? 'Anual' : 'Anual'}</div>
            <div style={{ margin: '14px 0 4px' }}><span className="acd-plan-price">R$67</span><span className="text-secondary">/{es ? 'mes' : 'mês'}</span></div>
            <p className="text-secondary" style={{ fontSize: 14, marginBottom: 20 }}>{es ? 'Ahorra 30% · cobro anual' : 'Economize 30% · cobrança anual'}</p>
            <div style={{ flex: 1 }}>
              {b2cFeatures.map((f, i) => (<div key={i} className="acd-plan-feat"><span className="acd-check">✓</span>{es ? f[1] : f[0]}</div>))}
              <div className="acd-plan-feat"><span className="acd-check">✓</span>{es ? '2 meses gratis' : '2 meses grátis'}</div>
            </div>
            <a href="#contact" className="btn-primary" style={{ marginTop: 22, width: '100%', color: '#fff' }}>{es ? 'Quiero el anual' : 'Quero o anual'}</a>
          </div>
          {/* Trial */}
          <div className="acd-plan">
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-secondary)' }}>{es ? 'Prueba' : 'Degustação'}</div>
            <div style={{ margin: '14px 0 4px' }}><span className="acd-plan-price">{es ? 'Gratis' : 'Grátis'}</span></div>
            <p className="text-secondary" style={{ fontSize: 14, marginBottom: 20 }}>{es ? '3 clases de muestra' : '3 aulas de amostra'}</p>
            <div style={{ flex: 1 }}>
              <div className="acd-plan-feat"><span className="acd-check">✓</span>{es ? 'Sin tarjeta de crédito' : 'Sem cartão de crédito'}</div>
              <div className="acd-plan-feat"><span className="acd-check">✓</span>{es ? 'Acceso a la plataforma' : 'Acesso à plataforma'}</div>
              <div className="acd-plan-feat"><span className="acd-check">✓</span>{es ? 'Prueba la gamificación' : 'Experimente a gamificação'}</div>
            </div>
            <Link href={membersUrl} className="btn-secondary" style={{ marginTop: 22, width: '100%' }}>{es ? 'Probar gratis' : 'Testar grátis'}</Link>
          </div>
        </div>
      </section>

      {/* B2B */}
      <section className="acd-section" id="empresas">
        <div className="acd-b2b">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }} className="acd-b2b-grid">
            <div>
              <div className="acd-eyebrow">Infinity Academy for Business</div>
              <h2 className="acd-h2">{es ? 'Capacita a tu equipo para vender y escalar' : 'Capacite seu time para vender e escalar'}</h2>
              <p className="acd-lead" style={{ marginBottom: 28 }}>
                {es ? 'Educación corporativa práctica en Marketing, Ventas y Gestión — con panel de progreso, asientos y rutas por cargo.' : 'Educação corporativa prática em Marketing, Vendas e Gestão — com dashboard de progresso, assentos e trilhas por cargo.'}
              </p>
              <a href="#contact" className="btn-primary" style={{ padding: '16px 34px' }}>{es ? 'Hablar con ventas' : 'Falar com vendas'}</a>
            </div>
            <div>
              {b2bFeatures.map((f, i) => (<div key={i} className="acd-plan-feat" style={{ fontSize: 16 }}><span className="acd-check">✓</span>{es ? f[1] : f[0]}</div>))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="acd-section" id="faq">
        <div className="acd-eyebrow">FAQ</div>
        <h2 className="acd-h2" style={{ marginBottom: 32 }}>{es ? 'Preguntas frecuentes' : 'Perguntas frequentes'}</h2>
        <div className="acd-faq">
          {faqs.map((f, i) => (
            <div key={i} className="acd-faq-item">
              <div className="acd-faq-q">{es ? f.qEs : f.q}</div>
              <div className="acd-faq-a">{es ? f.aEs : f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="acd-cta-final">
        <h2 className="acd-h2" style={{ marginBottom: 16 }}>{es ? 'La nueva era del aprendizaje ya empezó' : 'A nova era do aprendizado já começou'}</h2>
        <p className="acd-lead" style={{ margin: '0 auto 32px' }}>{es ? 'Automatiza. Escala. Domina — ahora también con conocimiento.' : 'Automatize. Escale. Domine — agora também com conhecimento.'}</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#planos" className="btn-primary" style={{ padding: '18px 44px', fontSize: 17 }}>{es ? 'Comenzar ahora' : 'Começar agora'}</a>
          <Link href={membersUrl} className="btn-secondary" style={{ padding: '16px 34px' }}>{es ? 'Área del alumno' : 'Área do aluno'}</Link>
        </div>
      </section>

      <Footer dict={dict} locale={locale} />
    </main>
  );
}
