import { Metadata } from 'next';
import Link from 'next/link';
import MarketHeader from '@/components/MarketHeader';
import MarketFooter from '@/components/MarketFooter';
import {
  Repeat,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Check
} from 'lucide-react';
import { locales, type Locale, isValidLocale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Clube de Assinatura e Fidelidade para Supermercados | Infinity Market',
  description: 'Crie cestas recorrentes de hortifrúti e compras do mês com débito automático no cartão. Inspire-se no modelo de sucesso da OxeeGo em Recife.',
  keywords: ['clube de assinatura supermercado', 'hortifruti por assinatura', 'oxeego assinatura recife', 'fidelidade supermercado cashback']
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SolucaoFidelidadePage({
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

      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 24px', backgroundColor: '#090D16' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B' }}>
          <Link href={prefix || '/'} style={{ color: '#94A3B8' }}>Home</Link>
          <ChevronRight size={14} />
          <Link href={`${prefix}/market`} style={{ color: '#94A3B8' }}>Infinity Market</Link>
          <ChevronRight size={14} />
          <span style={{ color: '#A855F7', fontWeight: 600 }}>Clube de Assinatura & Fidelidade</span>
        </div>
      </div>

      <section style={{
        position: 'relative',
        padding: '80px 24px 60px',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(168, 85, 247, 0.12), rgba(11, 15, 25, 0))'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', fontSize: '13px', color: '#A855F7', fontWeight: 700, marginBottom: '20px' }}>
                <Repeat size={16} />
                Solução para Recorrência e Retenção
              </div>

              <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, lineHeight: 1.15, color: '#fff', marginBottom: '20px', letterSpacing: '-0.02em' }}>
                Transforme Clientes em <span style={{ color: '#A855F7' }}>Assinantes Recorrentes</span> do Seu Mercado.
              </h1>

              <p style={{ fontSize: '17px', lineHeight: 1.65, color: '#94A3B8', marginBottom: '32px', maxWidth: '560px' }}>
                Garanta previsibilidade de caixa criando planos de entrega semanal ou quinzenal de hortifrúti fresco, carnes selecionadas ou produtos básicos. Cobrança automática no cartão sem necessidade de checkout manual.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <a
                  href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Quero%20criar%20um%20Clube%20de%20Assinaturas%20para%20o%20meu%20supermercado."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: '#A855F7', color: '#fff', padding: '16px 28px', borderRadius: '12px', fontWeight: 800, fontSize: '15px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(168, 85, 247, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                >
                  Criar Meu Clube de Assinaturas
                  <ArrowRight size={18} />
                </a>
              </div>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', color: '#64748B', fontSize: '13px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Check size={16} color="#A855F7" /> Cobrança recorrente no cartão</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Check size={16} color="#A855F7" /> Troca de itens na cesta pelo cliente</span>
              </div>
            </div>

            <div>
              <div style={{ background: 'linear-gradient(145deg, #111827 0%, #0F172A 100%)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '24px', padding: '24px', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Repeat size={18} color="#A855F7" />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Cesta Semanal Personalizada</span>
                  </div>
                  <span style={{ fontSize: '11px', background: 'rgba(168, 85, 247, 0.15)', color: '#A855F7', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>Toda Terça-Feira</span>
                </div>

                <div style={{ background: '#0B0F19', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Cesta Família Hortifrúti (12 itens)</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>Renovação automática • R$ 89,90 / semana</div>
                </div>

                <div style={{ background: 'rgba(0, 223, 129, 0.08)', border: '1px solid rgba(0, 223, 129, 0.25)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src="/market/oxeego_instagram_avatar.jpg" alt="OxeeGo" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                  <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
                    <strong style={{ color: '#00DF81' }}>Pioneirismo OxeeGo:</strong> Dezenas de famílias recebem cestas programadas toda semana em Recife.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', backgroundColor: '#0F172A', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Garanta receita previsível todo mês</h2>
          <p style={{ fontSize: '15px', color: '#94A3B8', marginBottom: '28px' }}>Veja como implantar a esteira de assinaturas em seu supermercado.</p>
          <a
            href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Quero%20conhecer%20o%20m%C3%B3dulo%20de%20Assinaturas."
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: '#A855F7', color: '#fff', padding: '16px 32px', borderRadius: '12px', fontWeight: 800, fontSize: '15px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Falar com Consultor de Recorrência <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <MarketFooter locale={locale} />
    </div>
  );
}
