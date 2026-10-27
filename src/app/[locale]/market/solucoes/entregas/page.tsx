import { Metadata } from 'next';
import Link from 'next/link';
import MarketHeader from '@/components/MarketHeader';
import MarketFooter from '@/components/MarketFooter';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Navigation,
  FileCheck,
  Check
} from 'lucide-react';
import { locales, type Locale, isValidLocale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Roteirizador e App de Entregas para Supermercados | Infinity Market',
  description: 'Otimize rotas de entrega, reduza custo de frete e dê transparência total ao cliente com rastreio em tempo real e comprovante de entrega digital.',
  keywords: [
    'roteirizador supermercado',
    'app de entregas delivery',
    'instabuy entregas',
    'gestão de frotas supermercado',
    'rastreamento entrega ao vivo',
    'entrega oxeego recife'
  ]
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SolucaoEntregasPage({
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
          <span style={{ color: '#00AAFF', fontWeight: 600 }}>Entregas & Roteirizador</span>
        </div>
      </div>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '80px 24px 60px',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0, 170, 255, 0.12), rgba(11, 15, 25, 0))'
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
                background: 'rgba(0, 170, 255, 0.1)',
                border: '1px solid rgba(0, 170, 255, 0.3)',
                fontSize: '13px',
                color: '#00AAFF',
                fontWeight: 700,
                marginBottom: '20px'
              }}>
                <Truck size={16} />
                Solução Logística & Última Milha
              </div>

              <h1 style={{
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#fff',
                marginBottom: '20px',
                letterSpacing: '-0.02em'
              }}>
                Roteirização Inteligente e <span style={{ color: '#00AAFF' }}>App do Entregador</span> com Rastreio ao Vivo.
              </h1>

              <p style={{
                fontSize: '17px',
                lineHeight: 1.65,
                color: '#94A3B8',
                marginBottom: '32px',
                maxWidth: '560px'
              }}>
                Entregue mais compras com menos carros e menor custo de combustível. O sistema agrupa entregas por bairros e horários, traça o trajeto mais rápido no Waze ou Google Maps e envia link de acompanhamento no WhatsApp do cliente.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <a
                  href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Quero%20conhecer%20o%20m%C3%B3dulo%20de%20Entregas%20do%20Infinity%20Market."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#00AAFF',
                    color: '#0B0F19',
                    padding: '16px 28px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '15px',
                    textDecoration: 'none',
                    boxShadow: '0 8px 24px rgba(0, 170, 255, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  Conhecer o Sistema de Entregas
                  <ArrowRight size={18} />
                </a>
              </div>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', color: '#64748B', fontSize: '13px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} color="#00AAFF" /> Comprovante com foto e assinatura
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} color="#00AAFF" /> Frota própria ou terceirizada
                </span>
              </div>
            </div>

            {/* Delivery Mockup Card */}
            <div>
              <div style={{
                background: 'linear-gradient(145deg, #111827 0%, #0F172A 100%)',
                border: '1px solid rgba(0, 170, 255, 0.3)',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Navigation size={18} color="#00AAFF" />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Rota Otimizada • Rota Zona Sul</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#00AAFF', fontWeight: 700 }}>Van 02 • 14 Entregas</span>
                </div>

                {/* Simulated Stops */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ background: 'rgba(0, 223, 129, 0.08)', border: '1px solid rgba(0, 223, 129, 0.25)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle2 size={18} color="#00DF81" />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Parada 01: Boa Viagem</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>Entregue às 09:24 • Foto anexada</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: '#00DF81', fontWeight: 700 }}>CONCLUÍDO</span>
                  </div>

                  <div style={{ background: '#1E293B', border: '1px solid #00AAFF', borderRadius: '12px', padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MapPin size={18} color="#00AAFF" />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>Parada 02: Pina / Av. Boa Viagem</div>
                          <div style={{ fontSize: '11px', color: '#94A3B8' }}>Previsão: 09:42 (1.8 km) • 3 Sacolas</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '10px', background: '#00AAFF', color: '#0B0F19', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>EM ROTA</span>
                    </div>
                    <div style={{ background: '#0B0F19', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#94A3B8' }}>Cliente acompanhando via GPS</span>
                      <strong style={{ color: '#00DF81' }}>WhatsApp Notificado</strong>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px dashed #64748B' }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#CBD5E1' }}>Parada 03: Piedade / Candeias</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Janela: 10h00 - 11h00</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>Pendente</span>
                  </div>
                </div>

                {/* Case OxeeGo Quote in Mockup */}
                <div style={{ marginTop: '16px', background: 'rgba(0, 223, 129, 0.08)', border: '1px solid rgba(0, 223, 129, 0.25)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src="/market/oxeego_instagram_avatar.jpg" alt="OxeeGo" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                  <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
                    <strong style={{ color: '#00DF81' }}>OxeeGo Recife:</strong> Mais de 4.800 entregas pontuais com roteirização Infinity.
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
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', color: '#00AAFF', textTransform: 'uppercase' }}>
              Controle Total da Frota
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
              Mais eficiência para o motorista, menos ansiedade para o cliente
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            
            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 170, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00AAFF', marginBottom: '20px' }}>
                <Navigation size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                Roteirização Inteligente
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                O algoritmo analisa distâncias, trânsito ao vivo e horários agendados de cada cliente para calcular a sequência ótima de paradas, economizando combustível e pneus.
              </p>
            </div>

            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 223, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00DF81', marginBottom: '20px' }}>
                <Smartphone size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                Rastreio em Tempo Real
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Assim que a van sai da loja, o cliente recebe um link por WhatsApp mostrando a localização no mapa e quantos minutos faltam para a chegada, zerando ligações no SAC.
              </p>
            </div>

            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', marginBottom: '20px' }}>
                <FileCheck size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                Comprovante Digital de Entrega
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                O entregador coleta a assinatura na tela do smartphone ou tira foto do pacote na portaria com geolocalização e horário gravados, protegendo sua operação contra contestações de entrega.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#0F172A', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            Transforme a logística do seu supermercado
          </h2>
          <p style={{ fontSize: '15px', color: '#94A3B8', marginBottom: '28px' }}>
            Fale com nossos consultores e veja como calcular a economia exata de frete da sua região.
          </p>
          <a
            href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Quero%20conhecer%20a%20solu%C3%A7%C3%A3o%20de%20Entregas%20do%20Infinity%20Market."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#00AAFF',
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
            Falar com Especialista em Logística
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <MarketFooter locale={locale} />
    </div>
  );
}
