'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/app/trafego/trafego.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TrafegoContent({ dict, locale }: { dict?: any; locale?: string }) {
  const currentLocale = locale || 'pt';
  const es = currentLocale === 'es';

  // Calculator State
  const [investimento, setInvestimento] = useState<number>(3000);
  const [ticketMedio, setTicketMedio] = useState<number>(350);

  // Form State
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [faturamento, setFaturamento] = useState('');
  const [gargalo, setGargalo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Reviews Carousel State & Auto-play
  const [reviewIdx, setReviewIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const reviews = [
    {
      name: 'Turismo Tocantins',
      initial: 'TT',
      date: '26/10/2024',
      rating: 5,
      comment: 'Ótimo atendimento, campanhas muito bem estruturadas e volume de contatos diários no nosso WhatsApp aumentou mais de 300% logo no primeiro mês!',
      avatarBg: 'linear-gradient(135deg, #00DF81, #00AAFF)',
    },
    {
      name: 'Global Mudanças em SP',
      initial: 'GM',
      date: '25/06/2024',
      rating: 5,
      comment: 'Ótimo Serviço e Tem Resultado pode Confiar. Trabalho de Total confiança nota 10 👊👍 Fechamento de orçamentos triplicou.',
      avatarBg: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    },
    {
      name: 'Ronívia Aires Pimenta',
      initial: 'R',
      date: '15/06/2024',
      rating: 5,
      comment: 'Parabéns Infinity Ads pelo incrível trabalho! Sua dedicação e atenção aos detalhes fizeram a diferença para a escala do nosso e-commerce.',
      avatarBg: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
    },
    {
      name: 'Dr. Marcos Albuquerque (Clínica Odonto)',
      initial: 'MA',
      date: '12/08/2024',
      rating: 5,
      comment: 'Antes nós impulsionávamos no Instagram e só vinha curioso. Com a Infinity, hoje nossa agenda de implantes e procedimentos vive lotada.',
      avatarBg: 'linear-gradient(135deg, #00AAFF, #00DF81)',
    },
    {
      name: 'Eduardo Silveira (SaaS B2B)',
      initial: 'ES',
      date: '04/09/2024',
      rating: 5,
      comment: 'O alinhamento do LinkedIn Ads com o Google Search foi a virada de chave para nossos contratos corporativos. ROAS de 7.2x comprovado no BI.',
      avatarBg: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    },
    {
      name: 'Camila Duarte (Moda & E-commerce)',
      initial: 'CD',
      date: '18/11/2024',
      rating: 5,
      comment: 'Os criativos que a equipe desenvolve são de outro nível. Pararam de copiar concorrente e criaram uma esteira própria que converte no automático.',
      avatarBg: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
    },
  ];

  // Auto-play reviews carousel every 3.5s (pauses on hover)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setReviewIdx((prev) => (prev >= reviews.length - 2 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered, reviews.length]);

  // Dynamic ROAS calculation
  const calcResults = useMemo(() => {
    const roasEstimado = investimento < 5000 ? 4.5 : investimento < 15000 ? 5.2 : 6.0;
    const faturamentoProjetado = investimento * roasEstimado;
    const vendasEstimadas = Math.round(faturamentoProjetado / (ticketMedio || 1));
    const leadsEstimados = Math.round(investimento / 6.5); // R$ 6,50 por lead qualificado
    const lucroBruto = faturamentoProjetado - investimento;

    return {
      roas: roasEstimado.toFixed(1),
      faturamento: faturamentoProjetado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
      vendas: vendasEstimadas,
      leads: leadsEstimados,
      lucro: lucroBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
    };
  }, [investimento, ticketMedio]);

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 9) value = `${value.slice(0, 10)}-${value.slice(10)}`;
    setWhatsapp(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !whatsapp) return;
    setIsSubmitting(true);

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          whatsapp,
          origin: 'trafego_pago_diagnostico',
          empresa,
          faturamento,
          message: `Empresa: ${empresa || 'N/A'} | Investimento: R$ ${investimento}/mês | Gargalo: ${gargalo || 'Geral'}`
        })
      });
      setFormSuccess(true);

      // Trigger WhatsApp redirect with prefilled diagnostic text
      const msg = encodeURIComponent(
        `Olá, equipe Infinity OnDemand! Gostaria de receber meu Diagnóstico de Tráfego Gratuito.\n\n*Nome:* ${nome}\n*Empresa:* ${empresa || 'Minha Empresa'}\n*Investimento Previsto:* R$ ${investimento}/mês\n*Principal Objetivo:* ${gargalo || 'Aumentar vendas e leads'}`
      );
      window.open(`https://wa.me/5581971027939?text=${msg}`, '_blank');
    } catch {
      alert('Houve um erro ao processar. Vamos te redirecionar diretamente para o WhatsApp.');
      window.open('https://wa.me/5581971027939', '_blank');
    }
    setIsSubmitting(false);
  };

  const faqs = [
    {
      q: es ? '¿En cuánto tiempo comienzo a ver resultados?' : 'Em quanto tempo começo a ver resultados?',
      a: es
        ? 'Las primeras métricas e impresiones se optimizan en las primeras 48 a 72 horas. Entre el 7º y 15º día ya calibramos los anuncios ganadores para generar flujo constante de leads y ventas.'
        : 'Nas primeiras 48 a 72 horas as campanhas entram em fase de aprendizado e primeiras conversões. Entre o 7º e o 15º dia calibramos os criativos e públicos campeões para estabilizar o custo por aquisição e iniciar a escala.'
    },
    {
      q: es ? '¿Cuál es el presupuesto mínimo recomendado para anuncios?' : 'Qual é o orçamento mínimo recomendado para anúncios?',
      a: es
        ? 'Recomendamos a partir de R$ 1.500 a R$ 3.000/mes de inversión directa en las plataformas (Meta/Google) para tener datos suficientes de optimización.'
        : 'Recomendamos a partir de R$ 1.500 a R$ 3.000/mês de investimento direto nas plataformas (Meta/Google Ads) para que os algoritmos tenham volume suficiente de dados para encontrar compradores com rapidez.'
    },
    {
      q: es ? '¿Ustedes crean los anuncios o solo configuran las campañas?' : 'Vocês criam os anúncios ou apenas gerenciam a conta?',
      a: es
        ? 'Hacemos el trabajo completo: copy, diseño de creativos estáticos, orientación de videos, páginas de alta conversión y seguimiento con CAPI y CRM.'
        : 'Fazemos o ecossistema completo: redação persuasiva (copywriting), design de criativos estáticos de alto impacto, roteirização de vídeos, configuração de páginas de alta conversão, API de conversões (CAPI) e integração com seu CRM.'
    },
    {
      q: es ? '¿Ya probé otras agencias y no funcionó, por qué Infinity es diferente?' : 'Já tentei outras agências e não tive resultado. Por que a Infinity é diferente?',
      a: es
        ? 'No nos limitamos a "apretar botones". Unimos ingeniería de software, IA predictiva, neuromarketing y análisis diario sin cajas negras.'
        : 'A maioria das agências apenas aperta botões e manda relatórios cheios de métricas de vaidade. Na Infinity, aplicamos um método científico com análise diária, criativos orientados a neuromarketing, rastreamento avançado e foco 100% no dinheiro que entra no seu caixa.'
    },
    {
      q: es ? '¿Cómo tengo acceso a las métricas de mi cuenta?' : 'Como acompanho o desempenho e os resultados?',
      a: es
        ? 'Recibes un dashboard ejecutivo en tiempo real accesible 24/7, además de reuniones periódicas de alineación estratégica.'
        : 'Você recebe um Dashboard Executivo ao vivo no nosso portal, disponível 24/7, onde acompanha cada centavo investido, custo por lead, vendas geradas e retorno sobre o investimento (ROAS) em tempo real.'
    },
    {
      q: es ? '¿Qué es la API de Conversiones (CAPI) y por qué es obligatoria?' : 'O que é a API de Conversões (CAPI) e por que ela é obrigatória?',
      a: es
        ? 'El pixel tradicional de navegador pierde hasta el 40% de los datos debido a bloqueadores y restricciones de iOS. Con la API de Conversiones del servidor, rastreamos el 100% de las ventas y leads, alimentando el algoritmo con máxima precisión.'
        : 'O pixel tradicional de navegador perde até 40% dos dados por causa de bloqueadores de anúncios e privacidade do iOS. Com a API de Conversões direto no servidor (CAPI), enviamos 100% dos eventos reais para o Meta e Google, fazendo o algoritmo encontrar clientes muito mais baratos.'
    },
    {
      q: es ? '¿Cómo funciona el proceso de onboarding después de contratar?' : 'Como funciona o onboarding após eu fechar com a Infinity?',
      a: es
        ? 'En las primeras 48 horas realizamos la auditoría completa, creamos el grupo dedicado en WhatsApp, alineamos los accesos y comenzamos la producción de los primeros criativos estratégicos.'
        : 'Nas primeiras 48 horas realizamos a auditoria completa de contas, criamos o grupo exclusivo de atendimento no WhatsApp, configuramos acessos/pixels e iniciamos a produção dos primeiros criativos e páginas da estratégia.'
    },
    {
      q: es ? '¿Atienden a empresas de cualquier segmento o tamaño?' : 'Vocês atendem empresas de qualquer nicho ou tamanho?',
      a: es
        ? 'Atendemos e-commerce, clínicas, prestadores de servicios, B2B, infoproductores y empresas locales con facturación a partir de R$ 15k/mes o que tengan presupuesto validado para anuncios.'
        : 'Atendemos empresas de serviços, clínicas, comércios locais, e-commerces, SaaS e negócios B2B que já possuem produto/serviço validado e buscam previsibilidade e escala com tráfego profissional.'
    },
    {
      q: es ? '¿Hay permanencia obligatoria o contrato a largo plazo?' : 'Existe fidelidade ou contrato de longo prazo?',
      a: es
        ? 'Trabajamos con contratos mensuales sin trabas abusivas. Mantenemos a nuestros clientes por los resultados y el ROI generado mes a mes.'
        : 'Não prendemos clientes com cláusulas abusivas de fidelidade forçada. Trabalhamos com ciclos mensais renováveis porque acreditamos que a nossa retenção deve vir do lucro e do retorno que colocamos no seu bolso.'
    },
    {
      q: es ? '¿Cómo se utiliza la Inteligencia Artificial en mis campañas?' : 'Como a Inteligência Artificial é usada nas minhas campanhas?',
      a: es
        ? 'Utilizamos IA para análisis predictivo de audiencias, pruebas de variaciones de copy a gran escala y optimización en tiempo real de pujas y creativos.'
        : 'Usamos IA proprietária e modelos generativos para analisar padrões de conversão do seu mercado, gerar dezenas de variações de criativos/copy em minutos e prever quais canais entregarão o menor custo por cliente.'
    }
  ];

  return (
    <div className="tf-page">
      <Header dict={dict} locale={currentLocale} />

      {/* ============================================================
          HERO SECTION
          ============================================================ */}
      <section className="tf-hero">
        <div className="tf-hero-glow-1" />
        <div className="tf-container">
          <div className="tf-hero-grid">
            
            {/* Left Column: Copy & Value Proposition */}
            <div>
              <div className="tf-badge">
                <span className="tf-badge-dot" />
                {es ? 'Gestión de Tráfico de Alta Performance & IA' : 'Gestão Científica de Tráfego & IA'}
              </div>

              <h1 className="tf-title-hero">
                {es ? 'Existe un ' : 'Existe um '}
                <span className="tf-gradient-text">método científico</span>{' '}
                {es ? 'para que tu empresa nunca pare de vender.' : 'para que sua empresa nunca pare de vender.'}
              </h1>

              <p className="tf-subtitle">
                {es
                  ? 'Si no lo sigues, tu negocio no saldrá del lugar. Transformamos clics en ventas recurrentes con anuncios que paran el scroll, funiles completos y escala predecible en Meta Ads, Google Ads y TikTok.'
                  : 'Se você não segui-lo, ela não vai sair do lugar. Transformamos cliques em vendas recorrentes com anúncios que param o scroll, funis completos e escala previsível no Meta Ads, Google Ads, TikTok e YouTube.'}
              </p>

              <div className="tf-cta-group">
                <a href="#diagnostico" className="tf-btn-primary">
                  <span>{es ? 'Solicitar Diagnóstico Gratuito' : 'Quero Meu Diagnóstico Gratuito'}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>

                <a href="#metodo" className="tf-btn-secondary">
                  <span>{es ? 'Conocer el Método ∞' : 'Ver o Método Infinity ∞'}</span>
                </a>
              </div>

              {/* Social Proof / Trust stats */}
              <div className="tf-hero-trust">
                <div className="tf-trust-item">
                  <div className="tf-trust-value text-gradient">+R$ 15M</div>
                  <div className="tf-trust-label">{es ? 'Ventas Generadas' : 'Em Vendas Geradas'}</div>
                </div>
                <div className="tf-trust-item">
                  <div className="tf-trust-value" style={{ color: '#00DF81' }}>4.8x</div>
                  <div className="tf-trust-label">{es ? 'ROAS Promedio' : 'ROAS Médio Validado'}</div>
                </div>
                <div className="tf-trust-item">
                  <div className="tf-trust-value" style={{ color: '#00AAFF' }}>100%</div>
                  <div className="tf-trust-label">{es ? 'Datos en Tiempo Real' : 'Transparência em BI'}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Performance Dashboard Preview */}
            <div>
              <div className="tf-hero-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00DF81', boxShadow: '0 0 10px #00DF81' }} />
                    <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.5px', color: '#FFF' }}>
                      INFINITY GROWTH ENGINE
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(0, 223, 129, 0.15)', color: '#00DF81', fontWeight: 700 }}>
                    AO VIVO
                  </span>
                </div>

                {/* KPI Grid preview */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '4px' }}>Leads Qualificados</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFF' }}>1.482</div>
                    <div style={{ fontSize: '11px', color: '#00DF81', marginTop: '2px' }}>↑ +38.4% este mês</div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '4px' }}>ROAS Consolidado</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#00DF81' }}>5.42x</div>
                    <div style={{ fontSize: '11px', color: '#00AAFF', marginTop: '2px' }}>R$ 5,42 por R$ 1 investido</div>
                  </div>
                </div>

                {/* Campaign Progress Bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.3)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: 600 }}>
                      <span style={{ color: '#FFF' }}>Meta Ads (Instagram / Feed / Reels)</span>
                      <span style={{ color: '#00DF81' }}>ROAS 5.8x</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #00DF81, #00AAFF)', borderRadius: '3px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: 600 }}>
                      <span style={{ color: '#FFF' }}>Google Ads (Pesquisa Alta Intenção)</span>
                      <span style={{ color: '#00AAFF' }}>CPA R$ 14,20</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #00AAFF, #7C3AED)', borderRadius: '3px' }} />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#9CA3AF' }}>
                  ⚡ Estratégia multicanal sincronizada com Inteligência Artificial e CRM
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION: O CICLO CIENTÍFICO DE VENDAS (PRINT 1)
          ============================================================ */}
      <section className="tf-section" style={{ backgroundColor: '#090E1D' }}>
        <div className="tf-container">
          <div className="tf-section-header">
            <span className="tf-section-badge">MÉTODO CIENTÍFICO VALIDADO</span>
            <h2 className="tf-section-title">
              O Ciclo Contínuo de <span className="tf-gradient-text">Vendas Infinitas</span>
            </h2>
            <p className="tf-section-subtitle">
              Tráfego de verdade não é jogar dinheiro em anúncios e torcer. É um sistema integrado de 4 pilares onde cada fase alimenta a próxima em um loop contínuo.
            </p>
          </div>

          <div className="tf-loop-grid">
            <div className="tf-loop-card">
              <div className="tf-loop-icon">🧲</div>
              <h3 className="tf-loop-title">1. Aquisição</h3>
              <p className="tf-loop-desc">
                Atrair a atenção do público comprador exato através de criativos disruptivos, ganchos magnéticos e segmentação orientada por dados de alta intenção.
              </p>
            </div>

            <div className="tf-loop-card">
              <div className="tf-loop-icon" style={{ color: '#00AAFF', borderColor: 'rgba(0,170,255,0.3)', background: 'rgba(0,170,255,0.1)' }}>💬</div>
              <h3 className="tf-loop-title">2. Engajamento</h3>
              <p className="tf-loop-desc">
                Construir confiança imediata, quebra de objeções e interesse genuíno. O cliente passa a enxergar sua empresa como a única autoridade no seu mercado.
              </p>
            </div>

            <div className="tf-loop-card">
              <div className="tf-loop-icon" style={{ color: '#F59E0B', borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.1)' }}>📈</div>
              <h3 className="tf-loop-title">3. Monetização</h3>
              <p className="tf-loop-desc">
                Realizar mais vendas com ofertas de alta conversão, direcionamento rápido para WhatsApp ou páginas de checkout blindadas de alta velocidade.
              </p>
            </div>

            <div className="tf-loop-card">
              <div className="tf-loop-icon" style={{ color: '#EC4899', borderColor: 'rgba(236,72,153,0.3)', background: 'rgba(236,72,153,0.1)' }}>🔄</div>
              <h3 className="tf-loop-title">4. Retenção</h3>
              <p className="tf-loop-desc">
                Manter os clientes comprando de forma recorrente. Remarketing inteligente, aumento de LTV (Life Time Value) e maximização do lucro por cliente.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <a href="#diagnostico" className="tf-btn-primary">
              <span>Quero Ver Isso na Prática no Meu Negócio</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION: POR QUE A MAIORIA QUEIMA VERBA (PRINT 2)
          ============================================================ */}
      <section className="tf-section">
        <div className="tf-container">
          <div className="tf-section-header">
            <span className="tf-section-badge" style={{ color: '#EF4444' }}>DIAGNÓSTICO DE ERROS</span>
            <h2 className="tf-section-title">
              Por que a maioria <span style={{ color: '#EF4444' }}>queima verba</span> no tráfego
            </h2>
            <p className="tf-section-subtitle">
              Se você já tentou anunciar e sentiu que estava jogando dinheiro fora, o motivo quase sempre está em um desses 5 erros fatais:
            </p>
          </div>

          <div className="tf-pain-grid">
            <div className="tf-pain-card">
              <div className="tf-pain-badge">Erro #01</div>
              <h3 className="tf-pain-title">Impulsionar não é gerir tráfego.</h3>
              <p className="tf-pain-text">
                O botão azul do Instagram entrega curtida e comentário de curioso — não cliente com cartão de crédito pronto para comprar.
              </p>
            </div>

            <div className="tf-pain-card">
              <div className="tf-pain-badge">Erro #02</div>
              <h3 className="tf-pain-title">Público genérico.</h3>
              <p className="tf-pain-text">
                Anunciar para todo mundo é anunciar para ninguém. Sem definição cirúrgica de persona e intenção de busca, seu CPC vai às alturas.
              </p>
            </div>

            <div className="tf-pain-card">
              <div className="tf-pain-badge">Erro #03</div>
              <h3 className="tf-pain-title">Criativo fraco e sem gancho.</h3>
              <p className="tf-pain-text">
                80% do resultado do anúncio está no criativo e na copy que faz a pessoa parar o scroll. Se o criativo for ruim, nenhuma segmentação salva.
              </p>
            </div>

            <div className="tf-pain-card">
              <div className="tf-pain-badge">Erro #04</div>
              <h3 className="tf-pain-title">Sem funil estruturado.</h3>
              <p className="tf-pain-text">
                O clique chega e cai num site lento, sem botão claro de WhatsApp ou formulário confuso. O cliente vai embora em 3 segundos.
              </p>
            </div>

            <div className="tf-pain-card" style={{ gridColumn: 'span 2' }}>
              <div className="tf-pain-badge">Erro #05 — O Mais Grave</div>
              <h3 className="tf-pain-title">Sem medição e sem CAPI.</h3>
              <p className="tf-pain-text">
                Sem pixel configurado, sem API de Conversões do Meta/Google e sem sincronização com CRM — o algoritmo do anúncio aprende com os dados errados e queima o orçamento da sua empresa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION: O MÉTODO INFINITY ∞ (PRINT 3)
          ============================================================ */}
      <section id="metodo" className="tf-section" style={{ backgroundColor: '#070B18' }}>
        <div className="tf-container">
          <div className="tf-method-container">
            <div className="tf-section-header" style={{ marginBottom: '32px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="tf-badge-dot" />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#00DF81', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  PROCESSO DE ALTA PREVISIBILIDADE
                </span>
              </div>
              <h2 className="tf-section-title">
                O Método <span className="tf-gradient-text">INFINITY ∞</span>
              </h2>
              <p className="tf-section-subtitle" style={{ fontSize: '16px' }}>
                Um loop contínuo de crescimento — cada etapa alimenta a próxima com dados reais para escala consistente.
              </p>
            </div>

            <div className="tf-method-grid">
              <div className="tf-method-step">
                <div className="tf-step-num">1</div>
                <div className="tf-step-content">
                  <h4>Diagnóstico Profundo</h4>
                  <p>Auditoria completa da conta de anúncios atual, oferta, esteira de produtos, funil e espionagem da concorrência.</p>
                </div>
              </div>

              <div className="tf-method-step">
                <div className="tf-step-num">2</div>
                <div className="tf-step-content">
                  <h4>Estratégia & Metas</h4>
                  <p>Definição do público comprador, canais ideais, divisão de verba e metas calculadas de CPA (Custo por Lead) e ROAS.</p>
                </div>
              </div>

              <div className="tf-method-step">
                <div className="tf-step-num">3</div>
                <div className="tf-step-content">
                  <h4>Fábrica de Criativos</h4>
                  <p>Produção contínua de anúncios estáticos, carrosséis e vídeos de alta retenção feitos para prender o scroll no primeiro segundo.</p>
                </div>
              </div>

              <div className="tf-method-step">
                <div className="tf-step-num">4</div>
                <div className="tf-step-content">
                  <h4>Lançamento Blindado</h4>
                  <p>Estruturação técnica impecável: testes A/B, API de conversões (CAPI), pixel e integração direta com WhatsApp e CRM.</p>
                </div>
              </div>

              <div className="tf-method-step">
                <div className="tf-step-num">5</div>
                <div className="tf-step-content">
                  <h4>Otimização Diária</h4>
                  <p>Leitura diária das métricas: corte impiedoso do que não performa e injeção de verba rápida nos anúncios vencedores.</p>
                </div>
              </div>

              <div className="tf-method-step">
                <div className="tf-step-num">6</div>
                <div className="tf-step-content">
                  <h4>Escala Acelerada</h4>
                  <p>Replicação dos padrões vencedores para ampliar o alcance e volume de vendas sem perder o retorno sobre a verba.</p>
                </div>
              </div>
            </div>

            <div className="tf-loop-footer">
              <span style={{ fontSize: '20px' }}>🔄</span>
              <span>E volta ao começo. Sempre. Esse é o loop de crescimento infinito ∞</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION: ONDE A GENTE JOGA (PRINT 4)
          ============================================================ */}
      <section className="tf-section">
        <div className="tf-container">
          <div className="tf-section-header">
            <span className="tf-section-badge">ECOSSISTEMA MULTICANAL</span>
            <h2 className="tf-section-title">
              Onde a gente <span className="tf-gradient-text">joga</span>
            </h2>
            <p className="tf-section-subtitle">
              Escolhemos o canal pelo seu objetivo de negócio e pelo perfil do seu comprador — não por modismos passageiros.
            </p>
          </div>

          <div className="tf-channels-grid">
            
            {/* Meta Ads */}
            <div className="tf-channel-card">
              <div className="tf-channel-header">
                <div className="tf-channel-icon" style={{ background: 'rgba(0, 122, 255, 0.15)', color: '#007AFF' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <div>
                  <h3 className="tf-channel-name">Meta Ads</h3>
                  <span className="tf-channel-badge">Facebook & Instagram</span>
                </div>
              </div>
              <p className="tf-channel-desc">
                Ideal para prospecção em massa, geração de desejo visual, volume de leads no WhatsApp e remarketing implacável que cerca o cliente por todos os lados.
              </p>
            </div>

            {/* Google Ads */}
            <div className="tf-channel-card">
              <div className="tf-channel-header">
                <div className="tf-channel-icon" style={{ background: 'rgba(66, 133, 244, 0.15)', color: '#4285F4' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.053 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                </div>
                <div>
                  <h3 className="tf-channel-name">Google Ads</h3>
                  <span className="tf-channel-badge" style={{ color: '#4285F4' }}>Rede de Pesquisa & Shopping</span>
                </div>
              </div>
              <p className="tf-channel-desc">
                Fundo de funil com a maior taxa de conversão da internet. Capturamos pessoas que já estão procurando ativamente comprar o seu produto ou serviço agora.
              </p>
            </div>

            {/* YouTube Ads */}
            <div className="tf-channel-card">
              <div className="tf-channel-header">
                <div className="tf-channel-icon" style={{ background: 'rgba(255, 0, 0, 0.15)', color: '#FF0000' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </div>
                <div>
                  <h3 className="tf-channel-name">YouTube Ads</h3>
                  <span className="tf-channel-badge" style={{ color: '#FF4D4D' }}>Vídeos & Autoridade</span>
                </div>
              </div>
              <p className="tf-channel-desc">
                Vídeos institucionais e ofertas diretas que constroem desejo profundo, autoridade de marca inquestionável e conexão emocional de alto valor.
              </p>
            </div>

            {/* TikTok Ads */}
            <div className="tf-channel-card">
              <div className="tf-channel-header">
                <div className="tf-channel-icon" style={{ background: 'rgba(0, 242, 234, 0.15)', color: '#00F2EA' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.66 1.48-.1 2.7-1.16 2.94-2.61.12-.73.08-1.48.08-2.22V.02z"/></svg>
                </div>
                <div>
                  <h3 className="tf-channel-name">TikTok Ads</h3>
                  <span className="tf-channel-badge" style={{ color: '#00F2EA' }}>Escala Viral & Criativo Nativo</span>
                </div>
              </div>
              <p className="tf-channel-desc">
                Alcance explosivo com CPM muito mais barato. Criativos com estética nativa e UGC que parecem conteúdo orgânico e geram alta conversão.
              </p>
            </div>

            {/* LinkedIn Ads */}
            <div className="tf-channel-card" style={{ gridColumn: 'span 2' }}>
              <div className="tf-channel-header">
                <div className="tf-channel-icon" style={{ background: 'rgba(10, 102, 194, 0.15)', color: '#0A66C2' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </div>
                <div>
                  <h3 className="tf-channel-name">LinkedIn Ads</h3>
                  <span className="tf-channel-badge" style={{ color: '#0A66C2' }}>B2B & Tickets Altos</span>
                </div>
              </div>
              <p className="tf-channel-desc">
                Segmentação cirúrgica por cargo, faturamento da empresa, setor e localização para alcançar diretamente CEOs, diretores e tomadores de decisão em vendas corporativas de alto valor.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION: FUNIL COMPLETO & O QUE A GENTE MEDE (PRINT 5)
          ============================================================ */}
      <section className="tf-section" style={{ backgroundColor: '#090E1D' }}>
        <div className="tf-container">
          
          {/* Funnel Part */}
          <div className="tf-section-header">
            <span className="tf-section-badge">ESTRUTURA DE VENDAS</span>
            <h2 className="tf-section-title">
              Funil completo, <span className="tf-gradient-text">não só o clique</span>
            </h2>
            <p className="tf-section-subtitle">
              Cobrimos cada etapa da jornada para que nenhum prospect qualificado escape sem comprar:
            </p>
          </div>

          <div className="tf-funnel-container">
            
            {/* Left Column: Visual Glowing SVG Funnel */}
            <div className="tf-funnel-visual-box">
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#00DF81', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                ⚡ ARQUITETURA DO FUNIL INFINITY
              </div>

              <svg viewBox="0 0 340 375" fill="none" xmlns="http://www.w3.org/2000/svg" className="tf-funnel-svg">
                <defs>
                  <linearGradient id="fn-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00AAFF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00DF81" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="fn-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00AAFF" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="fn-grad-3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00DF81" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#00AAFF" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="fn-grad-4" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EC4899" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.9" />
                  </linearGradient>
                  <filter id="fn-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Level 1: Topo (Descoberta) */}
                <path d="M20 15 L320 15 L275 85 L65 85 Z" fill="url(#fn-grad-1)" fillOpacity="0.22" stroke="#00AAFF" strokeWidth="2" filter="url(#fn-glow)" />
                <text x="170" y="48" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800" letterSpacing="0.8">1. TOPO — DESCOBERTA</text>
                <text x="170" y="68" textAnchor="middle" fill="#00AAFF" fontSize="11" fontWeight="600">Tráfego Frio • Criativos • Alcance</text>

                {/* Level 2: Meio (Consideração) */}
                <path d="M70 95 L270 95 L230 165 L110 165 Z" fill="url(#fn-grad-2)" fillOpacity="0.25" stroke="#7C3AED" strokeWidth="2" filter="url(#fn-glow)" />
                <text x="170" y="128" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800" letterSpacing="0.8">2. MEIO — CONSIDERAÇÃO</text>
                <text x="170" y="148" textAnchor="middle" fill="#A78BFA" fontSize="11" fontWeight="600">Remarketing • Prova Social</text>

                {/* Level 3: Fundo (Conversão) */}
                <path d="M115 175 L225 175 L195 245 L145 245 Z" fill="url(#fn-grad-3)" fillOpacity="0.35" stroke="#00DF81" strokeWidth="2.5" filter="url(#fn-glow)" />
                <text x="170" y="208" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800" letterSpacing="0.8">3. FUNDO — VENDA</text>
                <text x="170" y="226" textAnchor="middle" fill="#00DF81" fontSize="11" fontWeight="700">Oferta • WhatsApp • Fechamento</text>

                {/* Level 4: Pós (Retenção) */}
                <rect x="125" y="258" width="90" height="52" rx="12" fill="url(#fn-grad-4)" fillOpacity="0.3" stroke="#EC4899" strokeWidth="2" filter="url(#fn-glow)" />
                <text x="170" y="282" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">4. PÓS-VENDA</text>
                <text x="170" y="298" textAnchor="middle" fill="#F472B6" fontSize="10" fontWeight="700">LTV & Recompra ∞</text>

                {/* Flow indicator */}
                <circle cx="170" cy="335" r="14" fill="rgba(0, 223, 129, 0.15)" stroke="#00DF81" strokeWidth="1.5" />
                <text x="170" y="340" textAnchor="middle" fill="#00DF81" fontSize="14" fontWeight="900">↓</text>
              </svg>

              <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: '#9CA3AF' }}>
                🔄 Cada etapa retroalimenta o aprendizado dos algoritmos
              </div>
            </div>

            {/* Right Column: 4 Detailed Stage Cards */}
            <div className="tf-funnel-stack">
              <div className="tf-funnel-layer">
                <div className="tf-funnel-left">
                  <div className="tf-funnel-icon" style={{ background: 'rgba(0, 170, 255, 0.15)', color: '#00AAFF' }}>
                    📢
                  </div>
                  <div>
                    <div className="tf-funnel-badge" style={{ background: 'rgba(0, 170, 255, 0.15)', color: '#00AAFF' }}>
                      Topo — Descoberta
                    </div>
                    <div className="tf-funnel-title">Alcance Qualificado & Criativos Magnéticos</div>
                    <div className="tf-funnel-desc">Vídeos rápidos, criativos de alto impacto e anúncios conceituais que encontram as pessoas certas.</div>
                  </div>
                </div>
                <div className="tf-funnel-goal">Objetivo: Ser Conhecido</div>
              </div>

              <div className="tf-funnel-layer">
                <div className="tf-funnel-left">
                  <div className="tf-funnel-icon" style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#A78BFA' }}>
                    🛡️
                  </div>
                  <div>
                    <div className="tf-funnel-badge" style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#A78BFA' }}>
                      Meio — Consideração
                    </div>
                    <div className="tf-funnel-title">Remarketing Implacável & Prova Social</div>
                    <div className="tf-funnel-desc">Depoimentos reais, comparações, quebra de objeções e autoridade imediata que cercam o prospect.</div>
                  </div>
                </div>
                <div className="tf-funnel-goal">Objetivo: Ser Confiável</div>
              </div>

              <div className="tf-funnel-layer" style={{ borderColor: 'rgba(0, 223, 129, 0.4)', background: 'rgba(0, 223, 129, 0.04)' }}>
                <div className="tf-funnel-left">
                  <div className="tf-funnel-icon" style={{ background: 'rgba(0, 223, 129, 0.15)', color: '#00DF81' }}>
                    🎯
                  </div>
                  <div>
                    <div className="tf-funnel-badge" style={{ background: 'rgba(0, 223, 129, 0.15)', color: '#00DF81' }}>
                      Fundo — Conversão
                    </div>
                    <div className="tf-funnel-title">Oferta Irresistível & Fechamento no WhatsApp</div>
                    <div className="tf-funnel-desc">Páginas ultra-rápidas, senso de urgência, formulários otimizados e direcionamento direto para o comercial.</div>
                  </div>
                </div>
                <div className="tf-funnel-goal" style={{ background: '#00DF81', color: '#060913', fontWeight: 800 }}>
                  Objetivo: Ser Escolhido
                </div>
              </div>

              <div className="tf-funnel-layer">
                <div className="tf-funnel-left">
                  <div className="tf-funnel-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#F472B6' }}>
                    🔄
                  </div>
                  <div>
                    <div className="tf-funnel-badge" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#F472B6' }}>
                      Pós — Retenção
                    </div>
                    <div className="tf-funnel-title">Recompra, Upsell & LTV Máximo</div>
                    <div className="tf-funnel-desc">Campanhas exclusivas para clientes da base para gerar receita recorrente sem gastar com novo CPA.</div>
                  </div>
                </div>
                <div className="tf-funnel-goal">Objetivo: Ser Lembrado</div>
              </div>
            </div>

          </div>

          {/* Metrics Part */}
          <div style={{ marginTop: '90px' }}>
            <div className="tf-section-header" style={{ marginBottom: '40px' }}>
              <span className="tf-section-badge" style={{ color: '#00DF81' }}>TRANSPARÊNCIA TOTAL</span>
              <h2 className="tf-section-title">
                O que a gente <span className="tf-gradient-text">mede</span>
              </h2>
              <p className="tf-section-subtitle">
                Você recebe dashboard ao vivo e relatório executivo mensal. Nada de métricas de vaidade ou caixa-preta.
              </p>
            </div>

            <div className="tf-metrics-grid">
              <div className="tf-metric-card">
                <div className="tf-metric-acronym">CPM</div>
                <div className="tf-metric-name">Custo por Mil</div>
                <div className="tf-metric-desc">Quanto custa para sua marca ser vista pelo público comprador.</div>
              </div>

              <div className="tf-metric-card">
                <div className="tf-metric-acronym" style={{ color: '#00AAFF' }}>CTR</div>
                <div className="tf-metric-name" style={{ color: '#00AAFF' }}>Taxa de Clique</div>
                <div className="tf-metric-desc">Mede o poder de retenção e atração do criativo no feed.</div>
              </div>

              <div className="tf-metric-card">
                <div className="tf-metric-acronym" style={{ color: '#70E1FF' }}>CPC</div>
                <div className="tf-metric-name" style={{ color: '#70E1FF' }}>Custo por Clique</div>
                <div className="tf-metric-desc">Quanto custa trazer um visitante qualificado para sua página.</div>
              </div>

              <div className="tf-metric-card">
                <div className="tf-metric-acronym" style={{ color: '#00DF81' }}>CPA</div>
                <div className="tf-metric-name">Custo por Aquisição</div>
                <div className="tf-metric-desc">Quanto custa cada lead qualificado e cada novo cliente pagante.</div>
              </div>

              <div className="tf-metric-card">
                <div className="tf-metric-acronym" style={{ color: '#10B981' }}>CR %</div>
                <div className="tf-metric-name" style={{ color: '#10B981' }}>Taxa de Conversão</div>
                <div className="tf-metric-desc">% de pessoas que entram na sua página e fecham negócio.</div>
              </div>

              <div className="tf-metric-card">
                <div className="tf-metric-acronym" style={{ color: '#F59E0B' }}>ROAS</div>
                <div className="tf-metric-name" style={{ color: '#F59E0B' }}>Retorno sobre Verba</div>
                <div className="tf-metric-desc">Quantos reais voltam para o seu caixa para cada R$ 1 investido.</div>
              </div>

              <div className="tf-metric-card">
                <div className="tf-metric-acronym" style={{ color: '#FBBF24' }}>ROI</div>
                <div className="tf-metric-name" style={{ color: '#FBBF24' }}>Retorno de Lucro</div>
                <div className="tf-metric-desc">Lucro real da sua empresa após abater todos os custos operacionais.</div>
              </div>

              <div className="tf-metric-card">
                <div className="tf-metric-acronym" style={{ color: '#8B5CF6' }}>CAC</div>
                <div className="tf-metric-name" style={{ color: '#8B5CF6' }}>Custo por Cliente</div>
                <div className="tf-metric-desc">Investimento total dividido pelo número de clientes conquistados.</div>
              </div>

              <div className="tf-metric-card">
                <div className="tf-metric-acronym" style={{ color: '#EC4899' }}>LTV</div>
                <div className="tf-metric-name" style={{ color: '#EC4899' }}>Valor do Cliente</div>
                <div className="tf-metric-desc">Quanto lucro líquido cada cliente deixa ao longo do relacionamento.</div>
              </div>

              <div className="tf-metric-card">
                <div className="tf-metric-acronym" style={{ color: '#F43F5E' }}>RR %</div>
                <div className="tf-metric-name" style={{ color: '#F43F5E' }}>Taxa de Recompra</div>
                <div className="tf-metric-desc">% de clientes recorrentes sem custo de novo anúncio.</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================
          SECTION: CALCULADORA INTERATIVA DE ROAS E FATURAMENTO
          ============================================================ */}
      <section className="tf-section">
        <div className="tf-container">
          <div className="tf-section-header">
            <span className="tf-section-badge">SIMULADOR DE ESCALA</span>
            <h2 className="tf-section-title">
              Projete o <span className="tf-gradient-text">Retorno do seu Investimento</span>
            </h2>
            <p className="tf-section-subtitle">
              Arraste os sliders abaixo para simular a projeção de leads, vendas e faturamento com base no nosso histórico de campanhas:
            </p>
          </div>

          <div className="tf-calc-wrapper">
            <div className="tf-calc-grid">
              
              {/* Sliders Input */}
              <div>
                <div className="tf-slider-group">
                  <div className="tf-slider-label">
                    <span>Investimento Mensal em Anúncios:</span>
                    <span className="tf-slider-val">
                      {investimento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1500"
                    max="50000"
                    step="500"
                    value={investimento}
                    onChange={(e) => setInvestimento(Number(e.target.value))}
                    className="tf-range-input"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B7280', marginTop: '6px' }}>
                    <span>R$ 1.500/mês</span>
                    <span>R$ 50.000/mês</span>
                  </div>
                </div>

                <div className="tf-slider-group">
                  <div className="tf-slider-label">
                    <span>Ticket Médio do seu Produto/Serviço:</span>
                    <span className="tf-slider-val" style={{ color: '#00AAFF' }}>
                      {ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    value={ticketMedio}
                    onChange={(e) => setTicketMedio(Number(e.target.value))}
                    className="tf-range-input"
                    style={{ accentColor: '#00AAFF' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B7280', marginTop: '6px' }}>
                    <span>R$ 50</span>
                    <span>R$ 5.000</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(0, 223, 129, 0.06)', border: '1px solid rgba(0, 223, 129, 0.2)', padding: '16px', borderRadius: '12px', marginTop: '24px' }}>
                  <div style={{ fontSize: '13px', color: '#00DF81', fontWeight: 700, marginBottom: '4px' }}>
                    💡 Estimativa conservadora de ROAS: {calcResults.roas}x
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.5 }}>
                    Calculada com base na média dos nossos clientes ativos no mesmo patamar de investimento.
                  </div>
                </div>
              </div>

              {/* Live Results Card */}
              <div className="tf-calc-result-box">
                <div className="tf-result-item">
                  <div className="tf-result-title">Faturamento Mensal Projetado</div>
                  <div className="tf-result-number text-gradient">{calcResults.faturamento}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '24px 0', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase' }}>Leads Estimados</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFF' }}>~{calcResults.leads}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase' }}>Vendas Estimadas</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#00DF81' }}>~{calcResults.vendas}</div>
                  </div>
                </div>

                <a href="#diagnostico" className="tf-btn-primary" style={{ width: '100%', boxSizing: 'border-box' }}>
                  <span>Alcançar Esse Resultado ➔</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION: AVALIAÇÕES E DEPOIMENTOS (GOOGLE REVIEWS CAROUSEL)
          ============================================================ */}
      <section className="tf-reviews-section">
        <div className="tf-container">
          <div className="tf-section-header" style={{ marginBottom: '32px' }}>
            <span className="tf-section-badge" style={{ color: '#00DF81' }}>AVALIAÇÕES REAIS</span>
            <h2 className="tf-section-title">
              Descubra o que empresários e marcas estão dizendo sobre a <span className="tf-gradient-text">Infinity Ads</span>
            </h2>
          </div>

          <div className="tf-reviews-layout">
            
            {/* Google Rating Summary Card */}
            <div className="tf-google-score-card">
              <div className="tf-score-title">EXCELENTE</div>
              <div className="tf-stars-row">
                ★★★★★
              </div>
              <div className="tf-score-count">
                Com base em <strong>22 avaliações</strong>
              </div>
              <div className="tf-google-logo">
                <span style={{ color: '#4285F4' }}>G</span>
                <span style={{ color: '#EA4335' }}>o</span>
                <span style={{ color: '#FBBC05' }}>o</span>
                <span style={{ color: '#4285F4' }}>g</span>
                <span style={{ color: '#34A853' }}>l</span>
                <span style={{ color: '#EA4335' }}>e</span>
              </div>
            </div>

            {/* Testimonials Carousel */}
            <div
              className="tf-carousel-wrapper"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                className="tf-carousel-track"
                style={{
                  transform: `translateX(-${reviewIdx * (100 / (reviews.length > 3 ? 3 : reviews.length))}%)`,
                }}
              >
                {reviews.map((rev, idx) => (
                  <div key={idx} className="tf-review-card">
                    <div className="tf-reviewer-header">
                      <div className="tf-reviewer-avatar" style={{ background: rev.avatarBg }}>
                        {rev.initial}
                      </div>
                      <div className="tf-reviewer-info">
                        <h4>{rev.name}</h4>
                        <span>{rev.date}</span>
                      </div>
                    </div>

                    <div className="tf-review-stars-row">
                      <span style={{ color: '#FFB800', fontSize: '15px' }}>★★★★★</span>
                      <span className="tf-verified-badge" title="Avaliação Verificada">✓</span>
                    </div>

                    <p className="tf-review-text">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="tf-carousel-controls">
                <div className="tf-trustindex-badge">
                  <span>🛡️ Certificado: Google Verified Reviews</span>
                </div>

                {/* Carousel Dots */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {Array.from({ length: reviews.length - 1 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setReviewIdx(i)}
                      aria-label={`Slide ${i + 1}`}
                      style={{
                        width: reviewIdx === i ? '20px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        backgroundColor: reviewIdx === i ? '#00DF81' : 'rgba(255,255,255,0.2)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="tf-nav-btn"
                    onClick={() => setReviewIdx(Math.max(0, reviewIdx - 1))}
                    disabled={reviewIdx === 0}
                    aria-label="Anterior"
                  >
                    ←
                  </button>
                  <button
                    className="tf-nav-btn"
                    onClick={() => setReviewIdx(Math.min(reviews.length - 2, reviewIdx + 1))}
                    disabled={reviewIdx >= reviews.length - 2}
                    aria-label="Próximo"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION: FORMULÁRIO DE DIAGNÓSTICO GRATUITO
          ============================================================ */}
      <section id="diagnostico" className="tf-section" style={{ backgroundColor: '#070B18' }}>
        <div className="tf-container">
          <div className="tf-form-card">
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div className="tf-badge">
                <span className="tf-badge-dot" />
                VAGAS LIMITADAS POR MÊS
              </div>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, color: '#FFF', marginBottom: '12px' }}>
                Solicite seu <span className="tf-gradient-text">Diagnóstico de Tráfego Gratuito</span>
              </h2>
              <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.6 }}>
                Nossa equipe de estrategistas vai auditar suas campanhas, analisar seu nicho e te entregar um plano de ação claro para multiplicar suas vendas.
              </p>
            </div>

            {formSuccess ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(0, 223, 129, 0.1)', borderRadius: '18px', border: '1px solid #00DF81' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>Diagnóstico Solicitado com Sucesso!</h3>
                <p style={{ fontSize: '15px', color: '#9CA3AF', marginBottom: '24px' }}>
                  Estamos abrindo a conversa no WhatsApp para iniciar a sua análise com nosso time sênior.
                </p>
                <a
                  href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Acabei%20de%20solicitar%20o%20diagn%C3%B3stico%20de%20tr%C3%A1fego%20no%20site."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tf-btn-primary"
                >
                  <span>Abrir WhatsApp Agora</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="tf-input-group">
                  <label className="tf-input-label">Seu Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Angelo Marques"
                    className="tf-input-field"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="tf-input-group">
                    <label className="tf-input-label">WhatsApp (com DDD) *</label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={handleWhatsappChange}
                      placeholder="(81) 99999-9999"
                      className="tf-input-field"
                    />
                  </div>

                  <div className="tf-input-group">
                    <label className="tf-input-label">E-mail Corporativo</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@empresa.com.br"
                      className="tf-input-field"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="tf-input-group">
                    <label className="tf-input-label">Nome da Empresa / Nicho</label>
                    <input
                      type="text"
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                      placeholder="Ex: Clínica / E-commerce / SaaS"
                      className="tf-input-field"
                    />
                  </div>

                  <div className="tf-input-group">
                    <label className="tf-input-label">Faturamento Mensal Atual</label>
                    <select
                      value={faturamento}
                      onChange={(e) => setFaturamento(e.target.value)}
                      className="tf-select-field"
                    >
                      <option value="">Selecione uma faixa</option>
                      <option value="Até R$ 20.000/mês">Até R$ 20.000/mês</option>
                      <option value="R$ 20.000 a R$ 50.000/mês">R$ 20.000 a R$ 50.000/mês</option>
                      <option value="R$ 50.000 a R$ 150.000/mês">R$ 50.000 a R$ 150.000/mês</option>
                      <option value="Acima de R$ 150.000/mês">Acima de R$ 150.000/mês</option>
                    </select>
                  </div>
                </div>

                <div className="tf-input-group">
                  <label className="tf-input-label">Qual é o maior gargalo das suas vendas hoje?</label>
                  <input
                    type="text"
                    value={gargalo}
                    onChange={(e) => setGargalo(e.target.value)}
                    placeholder="Ex: Custo por lead muito alto, poucos fechamentos no WhatsApp, etc."
                    className="tf-input-field"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="tf-btn-primary"
                  style={{ width: '100%', marginTop: '12px' }}
                >
                  {isSubmitting ? 'Processando...' : 'Receber Diagnóstico Gratuito ➔'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#6B7280' }}>
                  🔒 Seus dados estão 100% seguros. Não enviamos spam.
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION: FAQ ACCORDION
          ============================================================ */}
      <section className="tf-section">
        <div className="tf-container">
          <div className="tf-section-header">
            <span className="tf-section-badge">DÚVIDAS FREQUENTES</span>
            <h2 className="tf-section-title">
              Perguntas <span className="tf-gradient-text">Frequentes</span>
            </h2>
          </div>

          <div className="tf-faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className="tf-faq-item">
                <button
                  className="tf-faq-question"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '20px', color: '#00DF81', transition: 'transform 0.2s', transform: openFaq === idx ? 'rotate(45deg)' : 'none' }}>
                    +
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="tf-faq-answer">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION: AGENDAMENTO DE CONSULTORIA (GOOGLE CALENDAR)
          ============================================================ */}
      <section id="agenda" className="tf-calendar-section">
        <div className="tf-container">
          <div className="tf-calendar-card">
            
            {/* Left side: Context & Perks */}
            <div>
              <div className="tf-google-cal-badge">
                <span>📅 Google Calendar Oficial</span>
              </div>

              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 900, color: '#FFF', marginTop: '16px', marginBottom: '14px', lineHeight: 1.15 }}>
                Agende uma <span className="tf-gradient-text">Sessão Estratégica de 30 Minutos</span>
              </h2>

              <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.6 }}>
                Escolha o melhor dia e horário na nossa agenda oficial do Google para uma reunião individual via Google Meet com um estrategista sênior da Infinity.
              </p>

              <div className="tf-calendar-perks">
                <div className="tf-perk-item">
                  <div className="tf-perk-icon">🎯</div>
                  <div>
                    <strong>Diagnóstico 100% Personalizado:</strong> Análise ao vivo da sua conta, concorrência e gargalos de vendas.
                  </div>
                </div>

                <div className="tf-perk-item">
                  <div className="tf-perk-icon">🗺️</div>
                  <div>
                    <strong>Roadmap de Escala:</strong> Plano de ação com canais recomendados, previsão de verba e projeção de ROAS.
                  </div>
                </div>

                <div className="tf-perk-item">
                  <div className="tf-perk-icon">💡</div>
                  <div>
                    <strong>Sem Custo e Sem Compromisso:</strong> Uma conversa direta e prática com quem realmente entende de retorno sobre investimento.
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Calendar Booking CTA Box */}
            <div className="tf-calendar-right-box">
              <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(66, 133, 244, 0.15)', border: '1px solid rgba(66, 133, 244, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                🗓️
              </div>

              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFF', marginBottom: '6px' }}>
                  Consultoria Estratégica Online
                </h3>
                <p style={{ fontSize: '13px', color: '#9CA3AF' }}>
                  Vagas limitadas por semana conforme disponibilidade de agenda.
                </p>
              </div>

              <div style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(0, 223, 129, 0.08)', border: '1px solid rgba(0, 223, 129, 0.2)', fontSize: '13px', color: '#00DF81', fontWeight: 700 }}>
                ⚡ Reunião de 30 minutos via Google Meet
              </div>

              <a
                href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2ckk4GlQIVW6rTUIkTwWzgRNeCkktFgdPYYZ1sn9L7hyPYV-N-bM6TeME9bBMPOTZUtcGoxDeI"
                target="_blank"
                rel="noopener noreferrer"
                className="tf-btn-primary"
                style={{ width: '100%', boxSizing: 'border-box' }}
              >
                <span>Abrir Agenda e Escolher Horário ➔</span>
              </a>

              <div style={{ fontSize: '11px', color: '#6B7280' }}>
                Sincronizado automaticamente com o Google Calendar
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          FLOATING WHATSAPP CTA
          ============================================================ */}
      <a
        href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20a%20gest%C3%A3o%20de%20tr%C3%A1fego%20da%20Infinity."
        target="_blank"
        rel="noopener noreferrer"
        className="tf-float-whatsapp"
        aria-label="Fale no WhatsApp"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span>Falar com Especialista</span>
      </a>

      <Footer dict={dict} locale={currentLocale} />
    </div>
  );
}
