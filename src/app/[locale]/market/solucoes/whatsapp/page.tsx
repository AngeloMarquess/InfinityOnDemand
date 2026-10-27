import { Metadata } from 'next';
import Link from 'next/link';
import MarketHeader from '@/components/MarketHeader';
import MarketFooter from '@/components/MarketFooter';
import {
  MessageSquare,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
  Send
} from 'lucide-react';
import { locales, type Locale, isValidLocale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Vendas e Atendimento via WhatsApp para Supermercados | Infinity Market',
  description: 'Automatize pedidos de supermercado pelo WhatsApp Oficial. O cliente manda a lista de compras em texto ou áudio e o robô adiciona ao carrinho com link de pagamento seguro.',
  keywords: ['whatsapp supermercado', 'vender mercado pelo whatsapp', 'instabuy whatsapp', 'bot lista de compras supermercado']
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SolucaoWhatsappPage({
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
          <span style={{ color: '#00DF81', fontWeight: 600 }}>Vendas via WhatsApp</span>
        </div>
      </div>

      <section style={{
        position: 'relative',
        padding: '80px 24px 60px',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0, 223, 129, 0.12), rgba(11, 15, 25, 0))'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(0, 223, 129, 0.1)', border: '1px solid rgba(0, 223, 129, 0.3)', fontSize: '13px', color: '#00DF81', fontWeight: 700, marginBottom: '20px' }}>
                <MessageSquare size={16} />
                Solução para Vendas Conversacionais
              </div>

              <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, lineHeight: 1.15, color: '#fff', marginBottom: '20px', letterSpacing: '-0.02em' }}>
                Venda pelo <span style={{ color: '#00DF81' }}>WhatsApp Oficial</span> com Robô de Listas Inteligente.
              </h1>

              <p style={{ fontSize: '17px', lineHeight: 1.65, color: '#94A3B8', marginBottom: '32px', maxWidth: '560px' }}>
                O cliente não precisa nem baixar app se não quiser: ele manda a lista de feira pelo WhatsApp, a IA identifica os itens no seu estoque e devolve o carrinho pronto com link de pagamento Pix ou Cartão.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <a
                  href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Quero%20integrar%20vendas%20por%20WhatsApp%20ao%20meu%20supermercado."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: '#00DF81', color: '#0B0F19', padding: '16px 28px', borderRadius: '12px', fontWeight: 800, fontSize: '15px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(0, 223, 129, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                >
                  Ativar Vendas no WhatsApp
                  <ArrowRight size={18} />
                </a>
              </div>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', color: '#64748B', fontSize: '13px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Check size={16} color="#00DF81" /> API Oficial do WhatsApp Cloud</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Check size={16} color="#00DF81" /> Notificação de status de entrega</span>
              </div>
            </div>

            <div>
              <div style={{ background: 'linear-gradient(145deg, #111827 0%, #0F172A 100%)', border: '1px solid rgba(0, 223, 129, 0.3)', borderRadius: '24px', padding: '24px', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00DF81' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>WhatsApp Supermercado • Atendimento 24h</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <div style={{ background: '#1E293B', padding: '10px 14px', borderRadius: '12px 12px 12px 2px', maxWidth: '85%', alignSelf: 'flex-start', color: '#CBD5E1' }}>
                    Olá! Quero 2 leites desnatados, 1kg de banana prata e 1 sabão em pó 1.6kg.
                  </div>
                  <div style={{ background: 'rgba(0, 223, 129, 0.15)', border: '1px solid rgba(0, 223, 129, 0.3)', padding: '10px 14px', borderRadius: '12px 12px 2px 12px', maxWidth: '85%', alignSelf: 'flex-end', color: '#fff' }}>
                    ✅ Carrinho montado! Total: R$ 39,80. Clique aqui para confirmar endereço e pagar via Pix em 1 toque: <strong>link.infinity.me/ped492</strong>
                  </div>
                </div>

                <div style={{ marginTop: '20px', background: 'rgba(0, 170, 255, 0.08)', border: '1px solid rgba(0, 170, 255, 0.25)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src="/market/oxeego_instagram_avatar.jpg" alt="OxeeGo" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                  <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
                    <strong style={{ color: '#00AAFF' }}>Case OxeeGo:</strong> Atualizações de rota e confirmação de pesagem enviadas automaticamente aos clientes de Recife.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', backgroundColor: '#0F172A', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Venda no canal favorito dos seus clientes</h2>
          <p style={{ fontSize: '15px', color: '#94A3B8', marginBottom: '28px' }}>Integre seu número comercial em menos de 48 horas.</p>
          <a
            href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Quero%20integrar%20o%20WhatsApp%20do%20meu%20mercado."
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: '#00DF81', color: '#0B0F19', padding: '16px 32px', borderRadius: '12px', fontWeight: 800, fontSize: '15px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Falar com Especialista WhatsApp <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <MarketFooter locale={locale} />
    </div>
  );
}
