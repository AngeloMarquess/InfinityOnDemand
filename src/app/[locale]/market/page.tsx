import { Metadata } from 'next';
import Link from 'next/link';
import MarketHeader from '@/components/MarketHeader';
import MarketFooter from '@/components/MarketFooter';
import {
  Store,
  Smartphone,
  MessageSquare,
  ScanBarcode,
  Truck,
  LayoutDashboard,
  HeartHandshake,
  Repeat,
  Layers,
  Zap,
  TrendingUp,
  CheckCircle2,
  Scale,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
  MapPin,
  Users,
  BarChart3,
  Check,
  ChevronRight,
  Headphones,
  CheckSquare
} from 'lucide-react';
import { locales, type Locale, isValidLocale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Infinity Market | Plataforma de E-commerce e Logística para Supermercados',
  description: 'A plataforma completa de e-commerce, app próprio, separação com balança e entregas para supermercados, hortifrutis e empórios. Inspirado no melhor do mercado com o case OxeeGo.',
  keywords: [
    'ecommerce para supermercado',
    'app de supermercado',
    'separação de mercadorias',
    'app picker supermercado',
    'balança pesáveis delivery',
    'oxeego supermercado recife',
    'instabuy alternativa',
    'delivery de hortifruti',
    'infinity market'
  ],
  openGraph: {
    title: 'Infinity Market | Tecnologia Completa para Supermercados',
    description: 'Venda online, automatize o picker na balança e roteirize entregas. Conheça o case OxeeGo.',
    images: ['/market/oxeego_hero_products.png']
  }
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function MarketHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'pt';
  const prefix = locale === 'pt' ? '' : `/${locale}`;

  return (
    <div style={{ backgroundColor: '#0B0F19', minHeight: '100vh', color: '#F8FAFC' }}>
      <MarketHeader locale={locale} />

      {/* ================= HERO SECTION ================= */}
      <section style={{
        position: 'relative',
        padding: '80px 24px 60px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0, 223, 129, 0.15), rgba(11, 15, 25, 0))'
      }}>
        {/* Glow ambient */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '380px',
          height: '380px',
          background: 'rgba(0, 170, 255, 0.08)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            
            {/* Left Column: Copy & Actions */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(0, 223, 129, 0.1)',
                border: '1px solid rgba(0, 223, 129, 0.3)',
                fontSize: '13px',
                color: '#00DF81',
                fontWeight: 700,
                marginBottom: '20px'
              }}>
                <Sparkles size={16} />
                Lançamento • Infinity Market
              </div>

              <h1 style={{
                fontSize: 'clamp(32px, 5vw, 54px)',
                fontWeight: 900,
                lineHeight: 1.12,
                marginBottom: '20px',
                letterSpacing: '-0.02em',
                color: '#fff'
              }}>
                A plataforma completa de <span style={{ color: '#00DF81' }}>e-commerce e operação</span> para supermercados.
              </h1>

              <p style={{
                fontSize: 'clamp(16px, 2vw, 19px)',
                lineHeight: 1.6,
                color: '#94A3B8',
                marginBottom: '32px',
                maxWidth: '560px'
              }}>
                Venda mais pelo <strong>app próprio</strong>, site e WhatsApp. Automatize a <strong>separação com pesáveis na balança</strong>, roteirize entregas expressas e fidelize clientes sem pagar comissões abusivas.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '36px' }}>
                <a
                  href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Quero%20conhecer%20o%20Infinity%20Market%20para%20meu%20supermercado."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#00DF81',
                    color: '#0B0F19',
                    padding: '16px 30px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '16px',
                    textDecoration: 'none',
                    boxShadow: '0 8px 24px rgba(0, 223, 129, 0.35)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  Agendar Demonstração Gratuita
                  <ArrowRight size={18} />
                </a>

                <Link
                  href="#solucoes"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '15px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Ver Soluções
                </Link>
              </div>

              {/* Micro Trust Proof */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', color: '#64748B', fontSize: '13px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} color="#00DF81" /> 0% de comissão por venda
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} color="#00DF81" /> Integração com balança
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} color="#00DF81" /> App com a sua marca
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual Card with OxeeGo Products & Live Badges */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'linear-gradient(145deg, #111827 0%, #0F172A 100%)',
                border: '1px solid rgba(0, 223, 129, 0.3)',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Glow accent */}
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '180px',
                  height: '180px',
                  background: 'rgba(0, 223, 129, 0.2)',
                  borderRadius: '50%',
                  filter: 'blur(50px)'
                }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }} />
                    <span style={{ fontSize: '12px', color: '#94A3B8', marginLeft: '6px', fontWeight: 600 }}>
                      market.infinityondemand.com.br
                    </span>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#00DF81',
                    background: 'rgba(0, 223, 129, 0.15)',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>
                    AO VIVO
                  </span>
                </div>

                {/* Hero Showcase Image */}
                <div style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#0B0F19',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  position: 'relative'
                }}>
                  <img
                    src="/market/oxeego_hero_products.png"
                    alt="Ecossistema Infinity Market com Case OxeeGo"
                    style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                  />
                  
                  {/* Floating Overlay Badge: Picker Conectado */}
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    background: 'rgba(11, 15, 25, 0.92)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 223, 129, 0.4)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      background: 'rgba(0, 223, 129, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00DF81'
                    }}>
                      <Scale size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Balança & Pesáveis Ativos</div>
                      <div style={{ fontSize: '11px', color: '#00DF81' }}>OxeeGo: 1.480 kg conferidos hoje</div>
                    </div>
                  </div>

                  {/* Floating Overlay Badge: Entrega em Rota */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(11, 15, 25, 0.92)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 170, 255, 0.4)',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Truck size={16} color="#00AAFF" />
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>
                      24 entregas em rota (Recife)
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= STATS BANNER ================= */}
      <section style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: '#0F172A',
        padding: '36px 24px'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '38px', fontWeight: 900, color: '#00DF81', lineHeight: 1 }}>+38%</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#E2E8F0', marginTop: '6px' }}>Aumento no Ticket Médio</div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>Com listas salvas e combos inteligentes</div>
            </div>

            <div>
              <div style={{ fontSize: '38px', fontWeight: 900, color: '#00AAFF', lineHeight: 1 }}>-60%</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#E2E8F0', marginTop: '6px' }}>Tempo de Separação</div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>App picker com rota por corredores</div>
            </div>

            <div>
              <div style={{ fontSize: '38px', fontWeight: 900, color: '#00DF81', lineHeight: 1 }}>99.8%</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#E2E8F0', marginTop: '6px' }}>Precisão em Pesáveis</div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>Zero prejuízo com pesagem incorreta</div>
            </div>

            <div>
              <div style={{ fontSize: '38px', fontWeight: 900, color: '#F59E0B', lineHeight: 1 }}>0%</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#E2E8F0', marginTop: '6px' }}>Comissão Abusiva</div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>O canal de venda e os clientes são seus</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3 PILLARS / SOLUTIONS GRID ================= */}
      <section id="solucoes" style={{ padding: '96px 24px', backgroundColor: '#0B0F19' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '1.2px',
              color: '#00DF81',
              textTransform: 'uppercase'
            }}>
              Arquitetura Completa de Ponta a Ponta
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
              Tudo o que seu supermercado precisa para dominar o digital
            </h2>
            <p style={{ fontSize: '16px', color: '#94A3B8', maxWidth: '680px', margin: '12px auto 0' }}>
              Três pilares integrados para transformar uma operação física tradicional em um gigante do e-commerce omnicanal.
            </p>
          </div>

          {/* Pillars Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px' }}>
            
            {/* PILLAR 1: VENDER */}
            <div style={{
              background: 'linear-gradient(180deg, #111827 0%, #0E1524 100%)',
              border: '1px solid rgba(0, 223, 129, 0.25)',
              borderRadius: '20px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  color: '#00DF81',
                  background: 'rgba(0, 223, 129, 0.12)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  textTransform: 'uppercase'
                }}>
                  Pilar 01 • Vender
                </span>
                <Store size={22} color="#00DF81" />
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                Canais de Venda Próprios
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '24px' }}>
                Alcance clientes onde eles estiverem com experiência de compra rápida, busca inteligente e checkout em 3 passos.
              </p>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px', flex: 1 }}>
                <Link
                  href={`${prefix}/market/solucoes/aplicativo`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Smartphone size={20} color="#00DF81" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>App Próprio iOS & Android</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Com sua marca na App Store e Google Play</div>
                  </div>
                </Link>

                <Link
                  href={`${prefix}/market/solucoes/loja-online`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <Store size={20} color="#00DF81" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Loja Online Web & Mobile</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Corredores virtuais, encarte e SEO local</div>
                  </div>
                </Link>

                <Link
                  href={`${prefix}/market/solucoes/whatsapp`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <MessageSquare size={20} color="#00DF81" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Vendas via WhatsApp</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Robô de listas e link de pagamento seguro</div>
                  </div>
                </Link>
              </div>

              <Link
                href={`${prefix}/market/solucoes/aplicativo`}
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#00DF81',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Explorar Soluções de Venda <ArrowRight size={14} />
              </Link>
            </div>

            {/* PILLAR 2: OPERAR (Core highlight) */}
            <div style={{
              background: 'linear-gradient(180deg, #111827 0%, #0E1524 100%)',
              border: '2px solid #00DF81',
              borderRadius: '20px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 12px 36px rgba(0, 223, 129, 0.15)'
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '24px',
                background: '#00DF81',
                color: '#0B0F19',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '999px',
                textTransform: 'uppercase'
              }}>
                Diferencial Exclusivo
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  color: '#00AAFF',
                  background: 'rgba(0, 170, 255, 0.12)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  textTransform: 'uppercase'
                }}>
                  Pilar 02 • Operar
                </span>
                <ScanBarcode size={22} color="#00AAFF" />
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                Separação, Balança & Entregas
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '24px' }}>
                O coração da rentabilidade de um mercado: zero erros no quilo da fruta e rota expressa para o motorista.
              </p>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px', flex: 1 }}>
                <Link
                  href={`${prefix}/market/solucoes/separacao`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(0, 223, 129, 0.08)',
                    border: '1px solid rgba(0, 223, 129, 0.25)'
                  }}
                >
                  <Scale size={20} color="#00DF81" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      App de Separação (Picker)
                      <span style={{ fontSize: '9px', background: '#00DF81', color: '#0B0F19', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>Destaque</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Conexão com balança, pesáveis e substituição</div>
                  </div>
                </Link>

                <Link
                  href={`${prefix}/market/solucoes/entregas`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <Truck size={20} color="#00AAFF" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>App do Entregador & Rotas</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Roteirizador inteligente e rastreio ao vivo</div>
                  </div>
                </Link>

                <Link
                  href={`${prefix}/market/solucoes/gestao`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <LayoutDashboard size={20} color="#00AAFF" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Painel Central de Gestão</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Kanban de pedidos, multiloja e relatórios</div>
                  </div>
                </Link>
              </div>

              <Link
                href={`${prefix}/market/solucoes/separacao`}
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#00DF81',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Conhecer a Separação Inteligente <ArrowRight size={14} />
              </Link>
            </div>

            {/* PILLAR 3: CRESCER */}
            <div style={{
              background: 'linear-gradient(180deg, #111827 0%, #0E1524 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  color: '#A855F7',
                  background: 'rgba(168, 85, 247, 0.12)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  textTransform: 'uppercase'
                }}>
                  Pilar 03 • Crescer
                </span>
                <TrendingUp size={22} color="#A855F7" />
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                Fidelidade & Integrações
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '24px' }}>
                Transforme compradores esporádicos em assinantes recorrentes e conecte seu ERP sem retrabalho.
              </p>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px', flex: 1 }}>
                <Link
                  href={`${prefix}/market/solucoes/fidelidade`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <Repeat size={20} color="#A855F7" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Clube de Assinatura & Cestas</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Cobrança automática semanal / quinzenal</div>
                  </div>
                </Link>

                <Link
                  href={`${prefix}/market/solucoes/integracoes`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <Layers size={20} color="#A855F7" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Integrações com ERP & PDV</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Totvs, Linx, Sysmo, Viasoft e muito mais</div>
                  </div>
                </Link>

                <Link
                  href={`${prefix}/market/solucoes/fidelidade`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <HeartHandshake size={20} color="#A855F7" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Cashback & Campanhas</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Disparo segmentado via WhatsApp e push</div>
                  </div>
                </Link>
              </div>

              <Link
                href={`${prefix}/market/solucoes/fidelidade`}
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#A855F7',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Descobrir Recursos de Crescimento <ArrowRight size={14} />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ================= CASE DE SUCESSO OXEEGO ================= */}
      <section id="case-oxeego" style={{
        padding: '100px 24px',
        backgroundColor: '#0F172A',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ambient Glow */}
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 223, 129, 0.12) 0%, rgba(15, 23, 42, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <img
              src="/market/oxeego_instagram_avatar.jpg"
              alt="OxeeGo Avatar"
              style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #00DF81' }}
            />
            <div>
              <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', color: '#00DF81', textTransform: 'uppercase' }}>
                Case de Sucesso Oficial • Infinity On Demand
              </span>
              <div style={{ fontSize: '14px', color: '#94A3B8' }}>OxeeGo Supermercado Online • Recife & RMR</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            
            {/* Left Column: Narrative & Metrics */}
            <div>
              <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 46px)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '20px' }}>
                Como a <span style={{ color: '#00DF81' }}>OxeeGo</span> construiu o delivery de hortifrúti mais rápido e confiável de Recife.
              </h2>
              
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#CBD5E1', marginBottom: '24px' }}>
                A OxeeGo nasceu com a missão de entregar frutas, verduras, carnes e compras do mês no mesmo dia ou com horário agendado em toda a Região Metropolitana do Recife (Boa Viagem, Espinheiro, Casa Forte, Olinda e Jaboatão).
              </p>

              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#94A3B8', marginBottom: '32px' }}>
                Utilizando o ecossistema do <strong>Infinity Market</strong>, a operação integrou desde o checkout do cliente até a pesagem exata na balança com o <strong>App de Separação (Picker)</strong> durante a madrugada, disparando rotas organizadas para a frota às 6h da manhã.
              </p>

              {/* Achievements Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '36px'
              }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(0, 223, 129, 0.25)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#00DF81' }}>+4.800</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginTop: '2px' }}>Pedidos Entregues</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>Em Recife e Região Metropolitana</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(0, 170, 255, 0.25)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#00AAFF' }}>100%</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginTop: '2px' }}>Balança Conectada</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>Pesáveis conferidos no grama</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#F59E0B' }}>4.9 ★</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginTop: '2px' }}>Avaliação dos Clientes</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>NPS líder de mercado regional</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#A855F7' }}>Recorrência</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginTop: '2px' }}>Clube de Assinaturas</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>Cestas semanais automáticas</div>
                </div>
              </div>

              {/* Quote */}
              <div style={{
                borderLeft: '3px solid #00DF81',
                paddingLeft: '18px',
                marginBottom: '32px'
              }}>
                <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#CBD5E1', marginBottom: '8px' }}>
                  "O maior desafio de vender hortifrúti online sempre foi o item pesável e a velocidade da separação. Com a tecnologia da Infinity On Demand, nossos separadores operam na balança com zero erro e o cliente recebe frutas selecionadas na porta de casa."
                </p>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                  Diretoria de Operações • OxeeGo
                </div>
              </div>

              <a
                href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Vi%20o%20case%20da%20OxeeGo%20e%20quero%20uma%20solu%C3%A7%C3%A3o%20semelhante%20para%20o%20meu%20mercado."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#00DF81',
                  color: '#0B0F19',
                  padding: '14px 26px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Quero o mesmo sistema para o meu negócio
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Right Column: OxeeGo Photos Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                borderRadius: '18px',
                overflow: 'hidden',
                border: '1px solid rgba(0, 223, 129, 0.3)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)'
              }}>
                <img
                  src="/market/oxeego-team-banner.jpg"
                  alt="Equipe e Operação OxeeGo em Recife"
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 223, 129, 0.1) 0%, rgba(0, 170, 255, 0.05) 100%)',
                border: '1px solid rgba(0, 223, 129, 0.25)',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <MapPin size={20} color="#00DF81" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Operação Regional Ativa</span>
                </div>
                <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
                  Rotas automatizadas conectando centros de distribuição aos principais bairros da Região Metropolitana do Recife com tempo de trânsito otimizado e conferência em tempo real.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= CORE FEATURES DEEP DIVE ================= */}
      <section style={{ padding: '96px 24px', backgroundColor: '#0B0F19' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', color: '#00DF81', textTransform: 'uppercase' }}>
              Engenharia de Performance Supermercadista
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
              Desenvolvido para as dores reais do seu dia a dia
            </h2>
            <p style={{ fontSize: '16px', color: '#94A3B8', maxWidth: '640px', margin: '12px auto 0' }}>
              Não é um e-commerce genérico: o Infinity Market foi construído sob medida para a dinâmica de produtos perecíveis, substituições e balança.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
            
            {/* Feature 1 */}
            <div style={{
              background: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '28px'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 223, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00DF81', marginBottom: '20px' }}>
                <Scale size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                Pesáveis & Balança Eletrônica
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                O cliente pede 500g de carne ou 1kg de tomate. O separador pesa e o sistema recalcula o valor exato no cartão ou Pix sem gerar cobrança duplicada.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{
              background: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '28px'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 170, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00AAFF', marginBottom: '20px' }}>
                <MessageSquare size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                Substituição Inteligente no WhatsApp
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Faltou uma marca na gôndola? O separador tira foto no app e manda mensagem em 1 toque no WhatsApp do cliente com opções de substituição.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{
              background: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '28px'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', marginBottom: '20px' }}>
                <Layers size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                Catálogo Base com 30.000 SKUs
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Não perca semanas cadastrando fotos. Oferecemos banco pronto com imagens em alta resolução, códigos de barras e tabelas nutricionais.
              </p>
            </div>

            {/* Feature 4 */}
            <div style={{
              background: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '28px'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A855F7', marginBottom: '20px' }}>
                <Repeat size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                Recorrência e Recompra em 1 Clique
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Compras de supermercado são cíclicas. O app aprende a frequência de cada cliente e envia lembrete para refazer a feira com a lista anterior.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section style={{ padding: '80px 24px', backgroundColor: '#0F172A', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', color: '#00DF81', textTransform: 'uppercase' }}>
              Tire Suas Dúvidas
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
              Perguntas frequentes de quem já opera supermercados
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                1. O Infinity Market cobra porcentagem sobre as vendas?
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Não! Ao contrário dos marketplaces tradicionais que cobram até 12% ou 25% por pedido, o Infinity Market opera no modelo SaaS de mensalidade fixa e previsível. Todo o lucro das vendas é 100% seu.
              </p>
            </div>

            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                2. Como funciona a pesagem de frutas, legumes e carnes?
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                O cliente seleciona o peso aproximado no app ou site. No estoque, o operador usa o App de Separação conectado à balança (ou digita a etiqueta pesada). O sistema calcula a variação real e liquida a diferença automaticamente na cobrança.
              </p>
            </div>

            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                3. O aplicativo fica com o nome do meu supermercado ou do Infinity?
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Fica 100% com o seu nome e sua marca! O app é publicado na Google Play Store e Apple App Store com o seu logotipo, cores e identidade visual, fortalecendo a sua marca perante o cliente.
              </p>
            </div>

            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                4. Vocês fazem a integração com o meu sistema ERP atual?
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Sim! Possuímos integração com os principais softwares de gestão de supermercados do Brasil (Totvs, Sysmo, Linx, Viasoft, RP Info, entre outros), sincronizando preços, produtos e estoque automaticamente.
              </p>
            </div>

            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                5. Quanto tempo leva para colocar minha loja no ar?
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Graças à nossa base de mais de 30.000 produtos já pré-cadastrados, colocamos sua loja virtual no ar em menos de 10 dias úteis, com treinamento completo da sua equipe de separação e caixas.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section style={{
        padding: '96px 24px',
        backgroundColor: '#0B0F19',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '1px', color: '#00DF81', textTransform: 'uppercase' }}>
            Pronto para transformar seu supermercado?
          </span>
          <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 900, color: '#fff', margin: '16px 0 20px', lineHeight: 1.15 }}>
            Agende uma conversa estratégica com nossos especialistas em varejo alimentar.
          </h2>
          <p style={{ fontSize: '17px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '36px' }}>
            Apresentamos uma simulação completa do seu app com a marca do seu mercado, demonstrando a balança em tempo real e a estimativa de faturamento online.
          </p>

          <a
            href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20demonstra%C3%A7%C3%A3o%20do%20Infinity%20Market."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#00DF81',
              color: '#0B0F19',
              padding: '18px 36px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '17px',
              textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(0, 223, 129, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            Falar pelo WhatsApp Agora
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      <MarketFooter locale={locale} />
    </div>
  );
}
