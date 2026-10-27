import { Metadata } from 'next';
import Link from 'next/link';
import MarketHeader from '@/components/MarketHeader';
import MarketFooter from '@/components/MarketFooter';
import {
  ScanBarcode,
  Scale,
  Clock,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Truck,
  RotateCcw,
  Zap,
  Check
} from 'lucide-react';
import { locales, type Locale, isValidLocale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'App de Separação (Picker) com Balança para Supermercados | Infinity Market',
  description: 'Automatize a separação de pedidos no estoque e gôndola com leitura de código de barras, conferência de pesáveis na balança e substituição instantânea via WhatsApp.',
  keywords: [
    'app de separação supermercado',
    'picker supermercado',
    'balança pesáveis delivery',
    'instabuy separação',
    'conferência de estoque e-commerce',
    'separação oxeego recife'
  ]
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SolucaoSeparacaoPage({
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
          <span style={{ color: '#00DF81', fontWeight: 600 }}>Separação & Picker</span>
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
                <Scale size={16} />
                Solução para Operações & Estoque
              </div>

              <h1 style={{
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#fff',
                marginBottom: '20px',
                letterSpacing: '-0.02em'
              }}>
                App de Separação com <span style={{ color: '#00DF81' }}>Balança Conectada</span> e Zero Rupturas.
              </h1>

              <p style={{
                fontSize: '17px',
                lineHeight: 1.65,
                color: '#94A3B8',
                marginBottom: '32px',
                maxWidth: '560px'
              }}>
                Reduza o tempo de coleta de pedidos em até 60%. O operador recebe os pedidos roteirizados por corredores, confere cada código de barras, pesa itens de hortifrúti na balança e resolve substituições no WhatsApp com 1 clique.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <a
                  href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Quero%20conhecer%20o%20App%20de%20Separa%C3%A7%C3%A3o%20do%20Infinity%20Market."
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
                  Agendar Demonstração do App
                  <ArrowRight size={18} />
                </a>
              </div>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', color: '#64748B', fontSize: '13px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} color="#00DF81" /> Compatível com qualquer Android/iOS
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} color="#00DF81" /> Leitura por câmera ou laser
                </span>
              </div>
            </div>

            {/* Interactive Mockup Visual */}
            <div>
              <div style={{
                background: 'linear-gradient(145deg, #111827 0%, #0F172A 100%)',
                border: '1px solid rgba(0, 223, 129, 0.3)',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00DF81' }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Separador em Ação • Pedido #4892</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#00DF81', fontWeight: 700 }}>8 de 10 coletados</span>
                </div>

                {/* Simulated Order List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Item 1 - Concluído */}
                  <div style={{ background: 'rgba(0, 223, 129, 0.08)', border: '1px solid rgba(0, 223, 129, 0.25)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle2 size={20} color="#00DF81" />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Leite Integral Piracanjuba 1L</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>Corredor 03 • Laticínios • EAN 7898215150012</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#00DF81' }}>2 un OK</span>
                  </div>

                  {/* Item 2 - Pesável Ativo */}
                  <div style={{ background: '#1E293B', border: '1px solid #00DF81', borderRadius: '12px', padding: '14px', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Scale size={20} color="#00DF81" />
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>Tomate Italiano Selecionado</div>
                          <div style={{ fontSize: '11px', color: '#94A3B8' }}>Banca 01 • Hortifrúti • Solicitado: 1.000 kg</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', background: '#00DF81', color: '#0B0F19', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>PESANDO</span>
                    </div>
                    <div style={{ background: '#0B0F19', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: '#94A3B8' }}>Leitura da balança:</span>
                      <strong style={{ color: '#00DF81', fontSize: '16px' }}>1.045 kg (R$ 9,39)</strong>
                    </div>
                  </div>

                  {/* Item 3 - Pendente */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px dashed #64748B' }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#CBD5E1' }}>Azeite Extra Virgem Borges 500ml</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Corredor 05 • Mercearia Doce & Salgada</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>1 un</span>
                  </div>
                </div>

                {/* Case OxeeGo pill inside mockup */}
                <div style={{ marginTop: '16px', background: 'rgba(0, 170, 255, 0.08)', border: '1px solid rgba(0, 170, 255, 0.25)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src="/market/oxeego_instagram_avatar.jpg" alt="OxeeGo" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                  <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
                    <strong style={{ color: '#00AAFF' }}>OxeeGo Recife:</strong> Separação em média de 3 min por cesta.
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0F172A', padding: '36px 24px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#00DF81' }}>-60%</div>
            <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>Tempo no corredor</div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#00AAFF' }}>99.8%</div>
            <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>Precisão de pesagem</div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#F59E0B' }}>Zero</div>
            <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>Ruptura não comunicada</div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#A855F7' }}>100%</div>
            <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>Rastreabilidade por operador</div>
          </div>
        </div>
      </section>

      {/* Deep-dive Features */}
      <section style={{ padding: '96px 24px', backgroundColor: '#0B0F19' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', color: '#00DF81', textTransform: 'uppercase' }}>
              Funcionalidades Exclusivas
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
              Como o App de Separação transforma sua loja física
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            
            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 223, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00DF81', marginBottom: '20px' }}>
                <ScanBarcode size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                Organização por Corredores
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Nada de separador zanzando de um lado para o outro. O sistema agrupa os itens da lista na exata sequência física dos corredores da sua loja (Hortifrúti → Padaria → Mercearia → Laticínios → Congelados).
              </p>
            </div>

            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 170, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00AAFF', marginBottom: '20px' }}>
                <Scale size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                Integração com Balanças
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Lê a etiqueta impressa pela balança Toledo/Filizola ou recebe o peso via leitor Bluetooth. O valor exato é recalculado e ajustado no cartão ou Pix sem retrabalho manual.
              </p>
            </div>

            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', marginBottom: '20px' }}>
                <MessageSquare size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                Substituição com Foto no WhatsApp
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Faltou um item? O separador fotografa a gôndola e o app envia uma mensagem padronizada no WhatsApp do cliente com as opções disponíveis. O cliente responde e o carrinho atualiza em tempo real.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Case OxeeGo Highlight */}
      <section style={{ padding: '80px 24px', backgroundColor: '#0F172A', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(0, 223, 129, 0.1) 0%, rgba(0, 170, 255, 0.05) 100%)', border: '1px solid rgba(0, 223, 129, 0.3)', borderRadius: '20px', padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <img src="/market/oxeego_instagram_avatar.jpg" alt="OxeeGo" style={{ width: '44px', height: '44px', borderRadius: '50%' }} />
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>OxeeGo Supermercado • Operação Noturna de Separação</h4>
              <span style={{ fontSize: '12px', color: '#00DF81' }}>Recife & Região Metropolitana</span>
            </div>
          </div>
          <p style={{ fontSize: '15px', color: '#CBD5E1', lineHeight: 1.7, marginBottom: '20px' }}>
            "Na OxeeGo, os pedidos feitos no final do dia são organizados em lotes e separados entre 3h e 5h da manhã. O App de Separação do Infinity Market garante que cada fruta e legume seja pesado e etiquetado com precisão cirúrgica, pronto para carregar as vans de entrega com zero atraso."
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href={`${prefix}/market#case-oxeego`} style={{ fontSize: '13px', fontWeight: 700, color: '#00DF81', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              Ver Case Completo OxeeGo <ArrowRight size={14} />
            </Link>
            <span style={{ color: '#64748B' }}>•</span>
            <Link href={`${prefix}/market/solucoes/entregas`} style={{ fontSize: '13px', fontWeight: 700, color: '#00AAFF', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              Conhecer a Roteirização de Entregas <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#0B0F19', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            Quer testar o App de Separação no seu supermercado?
          </h2>
          <p style={{ fontSize: '15px', color: '#94A3B8', marginBottom: '28px' }}>
            Demonstramos o fluxo completo com balança ao vivo em uma chamada de vídeo rápida de 15 minutos.
          </p>
          <a
            href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Quero%20agendar%20uma%20demonstra%C3%A7%C3%A3o%20do%20App%20de%20Separa%C3%A7%C3%A3o."
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
            Falar com um Especialista Agora
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <MarketFooter locale={locale} />
    </div>
  );
}
