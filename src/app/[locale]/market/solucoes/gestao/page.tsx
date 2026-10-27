import { Metadata } from 'next';
import Link from 'next/link';
import MarketHeader from '@/components/MarketHeader';
import MarketFooter from '@/components/MarketFooter';
import {
  LayoutDashboard,
  BarChart3,
  Layers,
  Store,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { locales, type Locale, isValidLocale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Painel de Gestão e Backoffice para Supermercados | Infinity Market',
  description: 'Controle toda a operação online em uma única tela: pedidos em tempo real, catálogo de mais de 30 mil produtos, multiloja e relatórios de faturamento e CMV.',
  keywords: [
    'painel de gestão supermercado',
    'backoffice e-commerce supermercado',
    'instabuy gestão',
    'kanban de pedidos supermercado',
    'relatórios delivery mercado',
    'gestão multiloja supermercado'
  ]
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SolucaoGestaoPage({
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
          <span style={{ color: '#00AAFF', fontWeight: 600 }}>Gestão & Backoffice</span>
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
                <LayoutDashboard size={16} />
                Solução para Controle & Inteligência
              </div>

              <h1 style={{
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#fff',
                marginBottom: '20px',
                letterSpacing: '-0.02em'
              }}>
                Controle Toda a Sua Operação em <span style={{ color: '#00AAFF' }}>Um Único Painel</span>.
              </h1>

              <p style={{
                fontSize: '17px',
                lineHeight: 1.65,
                color: '#94A3B8',
                marginBottom: '32px',
                maxWidth: '560px'
              }}>
                Acompanhe o fluxo de pedidos minuto a minuto, altere preços de gôndola instantaneamente, administre filiais em modo multiloja e tome decisões estratégicas com relatórios de CMV e ruptura de estoque.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <a
                  href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Quero%20uma%20demonstra%C3%A7%C3%A3o%20do%20Painel%20de%20Gest%C3%A3o%20do%20Infinity%20Market."
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
                  Conhecer o Painel Administrativo
                  <ArrowRight size={18} />
                </a>
              </div>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', color: '#64748B', fontSize: '13px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} color="#00AAFF" /> Acesso seguro em nuvem
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} color="#00AAFF" /> Níveis de permissão por usuário
                </span>
              </div>
            </div>

            {/* Simulated Dashboard View */}
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
                    <BarChart3 size={18} color="#00AAFF" />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Dashboard Operacional • Visão Geral</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#00DF81', fontWeight: 700 }}>● Online</span>
                </div>

                {/* KPI Cards inside mockup */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>Faturamento Hoje</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#00DF81' }}>R$ 18.420,50</div>
                    <div style={{ fontSize: '10px', color: '#10B981' }}>+24% vs ontem</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>Pedidos Ativos</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#00AAFF' }}>68 Pedidos</div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>12 em separação</div>
                  </div>
                </div>

                {/* Kanban Status Mini-bar */}
                <div style={{ background: '#0B0F19', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>Fluxo de Pedidos em Tempo Real</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center', fontSize: '11px' }}>
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', padding: '8px 4px' }}>
                      <strong style={{ color: '#F59E0B', display: 'block', fontSize: '13px' }}>14</strong>
                      <span style={{ color: '#94A3B8' }}>Novos</span>
                    </div>
                    <div style={{ background: 'rgba(0, 223, 129, 0.1)', border: '1px solid rgba(0, 223, 129, 0.3)', borderRadius: '8px', padding: '8px 4px' }}>
                      <strong style={{ color: '#00DF81', display: 'block', fontSize: '13px' }}>12</strong>
                      <span style={{ color: '#94A3B8' }}>Picker</span>
                    </div>
                    <div style={{ background: 'rgba(0, 170, 255, 0.1)', border: '1px solid rgba(0, 170, 255, 0.3)', borderRadius: '8px', padding: '8px 4px' }}>
                      <strong style={{ color: '#00AAFF', display: 'block', fontSize: '13px' }}>18</strong>
                      <span style={{ color: '#94A3B8' }}>Em Rota</span>
                    </div>
                    <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '8px', padding: '8px 4px' }}>
                      <strong style={{ color: '#A855F7', display: 'block', fontSize: '13px' }}>24</strong>
                      <span style={{ color: '#94A3B8' }}>Entregues</span>
                    </div>
                  </div>
                </div>

                {/* Case OxeeGo pill */}
                <div style={{ marginTop: '16px', background: 'rgba(0, 223, 129, 0.08)', border: '1px solid rgba(0, 223, 129, 0.25)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src="/market/oxeego_instagram_avatar.jpg" alt="OxeeGo" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                  <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
                    <strong style={{ color: '#00DF81' }}>Case OxeeGo:</strong> Gestão diária de hortifrúti fresco e perecíveis sem desperdício.
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
              Gestão Robusta & Confiável
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
              Recursos construídos para o dia a dia do varejo alimentar
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            
            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 170, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00AAFF', marginBottom: '20px' }}>
                <Store size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                Arquitetura Multiloja
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Possui duas ou mais lojas físicas? O cliente insere o CEP e o sistema direciona automaticamente o pedido para a unidade mais próxima, respeitando os preços e o estoque local de cada filial.
              </p>
            </div>

            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 223, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00DF81', marginBottom: '20px' }}>
                <Layers size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                Catálogo Centralizado
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Cadastre e ative produtos em massa. Altere fotos, descrições, tabelas nutricionais e regras de preço promocional para dias específicos (Segunda da Limpeza, Sexta da Cerveja) com poucos cliques.
              </p>
            </div>

            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', marginBottom: '20px' }}>
                <FileSpreadsheet size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                Relatórios Gerenciais de CMV
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Acompanhe o custo das mercadorias vendidas, os produtos com maior índice de falta na gôndola, a curva ABC de clientes e o desempenho de separação de cada funcionário da equipe.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#0F172A', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            Experimente o painel de gestão do Infinity Market
          </h2>
          <p style={{ fontSize: '15px', color: '#94A3B8', marginBottom: '28px' }}>
            Agende uma demonstração guiada e conheça todas as telas administrativas e operacionais.
          </p>
          <a
            href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20demonstra%C3%A7%C3%A3o%20do%20Painel%20de%20Gest%C3%A3o."
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
            Agendar Demonstração Guiada
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <MarketFooter locale={locale} />
    </div>
  );
}
