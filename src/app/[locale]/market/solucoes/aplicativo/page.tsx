import { Metadata } from 'next';
import Link from 'next/link';
import MarketHeader from '@/components/MarketHeader';
import MarketFooter from '@/components/MarketFooter';
import {
  Smartphone,
  Bell,
  Repeat,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Heart,
  TrendingUp,
  ShieldCheck,
  Check
} from 'lucide-react';
import { locales, type Locale, isValidLocale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Aplicativo Próprio para Supermercados (iOS e Android) | Infinity Market',
  description: 'Publique seu próprio aplicativo na Google Play e App Store com sua marca. Fidelize clientes, envie notificações push de ofertas e aumente seu ticket médio em 38%.',
  keywords: [
    'app para supermercado',
    'aplicativo supermercado ios android',
    'instabuy aplicativo',
    'app delivery mercado',
    'app oxeego supermercado',
    'notificações push supermercado'
  ]
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SolucaoAplicativoPage({
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

      {/* Breadcrumb Bar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 24px', backgroundColor: '#090D16' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B' }}>
          <Link href={prefix || '/'} style={{ color: '#94A3B8' }}>Home</Link>
          <ChevronRight size={14} />
          <Link href={`${prefix}/market`} style={{ color: '#94A3B8' }}>Infinity Market</Link>
          <ChevronRight size={14} />
          <span style={{ color: '#00DF81', fontWeight: 600 }}>Aplicativo Próprio</span>
        </div>
      </div>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '80px 24px 60px',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0, 223, 129, 0.12), rgba(11, 15, 25, 0))'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            
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
                <Smartphone size={16} />
                Solução para Vendas Móveis
              </div>

              <h1 style={{
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#fff',
                marginBottom: '20px',
                letterSpacing: '-0.02em'
              }}>
                Seu Próprio <span style={{ color: '#00DF81' }}>Aplicativo de Supermercado</span> nas Lojas iOS e Android.
              </h1>

              <p style={{
                fontSize: '17px',
                lineHeight: 1.65,
                color: '#94A3B8',
                marginBottom: '32px',
                maxWidth: '560px'
              }}>
                Esteja na tela inicial do celular do seu cliente. Envie alertas de ofertas relâmpago, permita recompra em 1 toque, ofereça pagamento com Pix, Cartão ou Vale Alimentação e construa fidelidade duradoura.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <a
                  href="https://wa.me/5581981280719?text=Ol%C3%A1!%20Quero%20um%20aplicativo%20pr%C3%B3prio%20para%20o%20meu%20supermercado."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#00DF81',
                    color: '#0B0F19',
                    padding: '16px 28px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '15px',
                    textDecoration: 'none',
                    boxShadow: '0 8px 24px rgba(0, 223, 129, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  Solicitar Simulação do Meu App
                  <ArrowRight size={18} />
                </a>
              </div>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', color: '#64748B', fontSize: '13px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} color="#00DF81" /> Publicação oficial na App Store & Play Store
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} color="#00DF81" /> Notificações push ilimitadas
                </span>
              </div>
            </div>

            {/* App Mockup Card */}
            <div>
              <div style={{
                background: 'linear-gradient(145deg, #111827 0%, #0F172A 100%)',
                border: '1px solid rgba(0, 223, 129, 0.3)',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#00DF81', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B0F19', fontWeight: 900 }}>
                      M
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>Supermercado Modelo App</div>
                      <div style={{ fontSize: '11px', color: '#00DF81' }}>Disponível para iOS e Android</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', background: 'rgba(0, 223, 129, 0.15)', color: '#00DF81', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    100% White-Label
                  </span>
                </div>

                {/* Simulated Push Notification */}
                <div style={{ background: '#1E293B', border: '1px solid rgba(0, 223, 129, 0.3)', borderRadius: '14px', padding: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Bell size={16} color="#00DF81" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Notificação Push • Agora</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#E2E8F0', marginBottom: '2px' }}>
                    🥦 Quarta do Hortifrúti Fresquinho!
                  </div>
                  <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
                    Frutas selecionadas direto do produtor com entrega gratuita hoje nas compras acima de R$ 80. Toque para ver!
                  </p>
                </div>

                {/* Recompra 1 Touch Card */}
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Repetir Minha Última Feira</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>24 itens frequentes prontos no carrinho</div>
                  </div>
                  <button style={{ backgroundColor: '#00DF81', color: '#0B0F19', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 800 }}>
                    1 Toque
                  </button>
                </div>

                {/* Case OxeeGo pill */}
                <div style={{ marginTop: '16px', background: 'rgba(0, 170, 255, 0.08)', border: '1px solid rgba(0, 170, 255, 0.25)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src="/market/oxeego_instagram_avatar.jpg" alt="OxeeGo" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                  <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
                    <strong style={{ color: '#00AAFF' }}>Case OxeeGo:</strong> 74% dos pedidos recorrentes acontecem direto pelo aplicativo móvel.
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section style={{ padding: '96px 24px', backgroundColor: '#0B0F19' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', color: '#00DF81', textTransform: 'uppercase' }}>
              Vantagens do App Nativo
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
              Por que ter seu próprio app é o maior ativo do seu supermercado
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            
            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 223, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00DF81', marginBottom: '20px' }}>
                <Bell size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                Notificações Push Gratuitas
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Esqueça os custos caros de SMS. Dispare mensagens ilimitadas anunciando ofertas do dia da carne, encarte digital e promoções de fim de semana diretamente na tela bloqueada do cliente.
              </p>
            </div>

            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 170, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00AAFF', marginBottom: '20px' }}>
                <Repeat size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                Recompra em 1 Toque
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Ninguém gosta de procurar arroz, feijão e café toda semana. O app guarda o histórico de compras e permite adicionar todos os itens frequentes ao carrinho em um único clique.
              </p>
            </div>

            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', marginBottom: '20px' }}>
                <CreditCard size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                Aceitação de Vales Alimentação
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                O supermercado atrai o público de maior poder de compra online integrando pagamento por cartões de benefícios e vale alimentação (VR, VA, Ticket, Alelo, Sodexo) e Pix com cashback.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#0F172A', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            Tenha o app do seu supermercado no ar em até 10 dias
          </h2>
          <p style={{ fontSize: '15px', color: '#94A3B8', marginBottom: '28px' }}>
            Nossa equipe cuida de toda a publicação nas lojas e do cadastro inicial do catálogo de produtos.
          </p>
          <a
            href="https://wa.me/5581981280719?text=Ol%C3%A1!%20Quero%20publicar%20o%20aplicativo%20do%20meu%20supermercado."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#00DF81',
              color: '#0B0F19',
              padding: '16px 32px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '15px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Quero Meu App Próprio
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <MarketFooter locale={locale} />
    </div>
  );
}
