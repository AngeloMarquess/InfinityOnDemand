import { Metadata } from 'next';
import Link from 'next/link';
import MarketHeader from '@/components/MarketHeader';
import MarketFooter from '@/components/MarketFooter';
import {
  Layers,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
  Server
} from 'lucide-react';
import { locales, type Locale, isValidLocale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Integrações com ERPs e PDVs para Supermercados | Infinity Market',
  description: 'Conecte o Infinity Market com o ERP do seu supermercado (Totvs, Linx, Sysmo, Viasoft, RP Info, Alterdata). Atualização de preços e estoque em tempo real.',
  keywords: ['integracao erp supermercado', 'totvs supermercado ecommerce', 'sysmo delivery mercado', 'instabuy integracoes']
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SolucaoIntegracoesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'pt';
  const prefix = locale === 'pt' ? '' : `/${locale}`;

  const erps = [
    'Totvs (Protheus / WinThor)',
    'Linx Supercon',
    'Sysmo Sistemas',
    'Viasoft Supermercados',
    'RP Info',
    'Alterdata',
    'Magentus / Bluesoft',
    'VR Software',
    'Consinco / Totvs Varejo'
  ];

  return (
    <div style={{ backgroundColor: '#0B0F19', minHeight: '100vh', color: '#F8FAFC' }}>
      <MarketHeader locale={locale} />

      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 24px', backgroundColor: '#090D16' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B' }}>
          <Link href={prefix || '/'} style={{ color: '#94A3B8' }}>Home</Link>
          <ChevronRight size={14} />
          <Link href={`${prefix}/market`} style={{ color: '#94A3B8' }}>Infinity Market</Link>
          <ChevronRight size={14} />
          <span style={{ color: '#A855F7', fontWeight: 600 }}>Integrações ERP</span>
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
                <Layers size={16} />
                Solução para Tecnologia & Conectividade
              </div>

              <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, lineHeight: 1.15, color: '#fff', marginBottom: '20px', letterSpacing: '-0.02em' }}>
                Integração Nativa com os <span style={{ color: '#A855F7' }}>Principais ERPs</span> do Mercado.
              </h1>

              <p style={{ fontSize: '17px', lineHeight: 1.65, color: '#94A3B8', marginBottom: '32px', maxWidth: '560px' }}>
                Não mude o sistema que sua equipe já usa. O Infinity Market se conecta ao seu banco de dados ou API para sincronizar preços de oferta, baixar estoques e emitir cupons fiscais no PDV sem intervenção humana.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <a
                  href="https://wa.me/5581981280719?text=Ol%C3%A1!%20Gostaria%20de%20saber%20sobre%20a%20integra%C3%A7%C3%A3o%20com%20meu%20ERP."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: '#A855F7', color: '#fff', padding: '16px 28px', borderRadius: '12px', fontWeight: 800, fontSize: '15px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(168, 85, 247, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                >
                  Consultar Meu ERP
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>

            {/* List of integrated ERPs */}
            <div>
              <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Server size={18} color="#A855F7" />
                  Sistemas Homologados
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {erps.map((erp, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Check size={14} color="#00DF81" />
                      {erp}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', backgroundColor: '#0F172A', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Zero retrabalho para sua equipe de TI</h2>
          <p style={{ fontSize: '15px', color: '#94A3B8', marginBottom: '28px' }}>Nossa equipe técnica cuida do conector e do mapeamento de campos com total segurança.</p>
          <a
            href="https://wa.me/5581981280719?text=Ol%C3%A1!%20Quero%20falar%20com%20um%20especialista%20sobre%20integra%C3%A7%C3%A3o%20ERP."
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: '#A855F7', color: '#fff', padding: '16px 32px', borderRadius: '12px', fontWeight: 800, fontSize: '15px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Falar com a Engenharia <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <MarketFooter locale={locale} />
    </div>
  );
}
