'use client';

import Link from 'next/link';

export default function MarketFooter({ locale = 'pt' }: { locale?: string }) {
  const prefix = locale === 'pt' ? '' : `/${locale}`;

  return (
    <footer style={{
      backgroundColor: '#090D16',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '72px 24px 36px',
      color: '#94A3B8'
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Top Pre-Footer CTA Bar */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 223, 129, 0.08) 0%, rgba(0, 170, 255, 0.05) 100%)',
          border: '1px solid rgba(0, 223, 129, 0.25)',
          borderRadius: '20px',
          padding: '36px 32px',
          marginBottom: '56px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          <div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#00DF81',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '8px'
            }}>
              ● Pronto para modernizar seu supermercado?
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '4px 0 8px' }}>
              Venda online com a mesma autoridade da sua loja física.
            </h3>
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0, maxWidth: '620px' }}>
              Descubra por que supermercados e hortifrutis escolhem o Infinity Market para acelerar faturamento, zerar erros de balança e fidelizar clientes.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/5581971027939?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20demonstra%C3%A7%C3%A3o%20do%20Infinity%20Market."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#00DF81',
                color: '#0B0F19',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0, 223, 129, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Falar com Especialista
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <Link
              href={`${prefix}/market/solucoes/separacao`}
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none'
              }}
            >
              Ver Demonstração
            </Link>
          </div>
        </div>

        {/* Links Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '40px',
          marginBottom: '56px'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <img src="/logo-infinity.png" alt="Infinity On Demand" style={{ height: '38px', width: 'auto' }} />
              <div style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '1px',
                padding: '2px 8px',
                background: 'rgba(0, 223, 129, 0.15)',
                border: '1px solid rgba(0, 223, 129, 0.3)',
                color: '#00DF81',
                borderRadius: '6px',
                textTransform: 'uppercase'
              }}>
                Market
              </div>
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#94A3B8', marginBottom: '20px' }}>
              A plataforma completa de e-commerce e gestão logística sob demanda para supermercados, hortifrutis e empórios.
            </p>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Desenvolvido com tecnologia de ponta pela <strong style={{ color: '#E2E8F0' }}>Infinity On Demand</strong>.
            </div>
          </div>

          {/* Vender */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#00DF81', marginBottom: '16px' }}>
              Vender
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link href={`${prefix}/market/solucoes/loja-online`} style={{ color: '#CBD5E1', textDecoration: 'none' }}>
                  Loja Virtual e Catálogo
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/market/solucoes/aplicativo`} style={{ color: '#CBD5E1', textDecoration: 'none' }}>
                  Aplicativo Próprio (iOS / Android)
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/market/solucoes/whatsapp`} style={{ color: '#CBD5E1', textDecoration: 'none' }}>
                  Vendas automáticas via WhatsApp
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/market/solucoes/fidelidade`} style={{ color: '#CBD5E1', textDecoration: 'none' }}>
                  Clube de Assinaturas & Fidelidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Operar */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#00AAFF', marginBottom: '16px' }}>
              Operar & Logística
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link href={`${prefix}/market/solucoes/separacao`} style={{ color: '#CBD5E1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span>App de Separação (Picker)</span>
                  <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: 'rgba(0, 223, 129, 0.15)', color: '#00DF81', fontWeight: 700 }}>Balança</span>
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/market/solucoes/entregas`} style={{ color: '#CBD5E1', textDecoration: 'none' }}>
                  Roteirização e App de Entregas
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/market/solucoes/gestao`} style={{ color: '#CBD5E1', textDecoration: 'none' }}>
                  Painel de Gestão e Multiloja
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/market/solucoes/integracoes`} style={{ color: '#CBD5E1', textDecoration: 'none' }}>
                  Integrações com ERPs e PDVs
                </Link>
              </li>
            </ul>
          </div>

          {/* Case OxeeGo */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#fff', marginBottom: '16px' }}>
              Case de Sucesso
            </h4>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <img
                  src="/market/oxeego_instagram_avatar.jpg"
                  alt="OxeeGo"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>OxeeGo Supermercado</div>
                  <div style={{ fontSize: '11px', color: '#00DF81' }}>Recife & RMR • No Ar</div>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: '0 0 10px', lineHeight: 1.5 }}>
                Operação 100% digital com app de separação, pesáveis de hortifrúti na balança e frotas de entrega agendada.
              </p>
              <Link
                href={`${prefix}/market#case-oxeego`}
                style={{ fontSize: '12px', fontWeight: 700, color: '#00DF81', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                Conhecer Case OxeeGo →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '28px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '12px',
          color: '#64748B'
        }}>
          <div>
            © {new Date().getFullYear()} Infinity On Demand Tecnologia Ltda. Todos os direitos reservados.
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link href={`${prefix}/`} style={{ color: '#64748B', textDecoration: 'none' }}>
              Início Infinity
            </Link>
            <Link href={`${prefix}/delivery`} style={{ color: '#64748B', textDecoration: 'none' }}>
              Delivery SaaS
            </Link>
            <Link href={`${prefix}/ecommerce`} style={{ color: '#64748B', textDecoration: 'none' }}>
              E-commerce Customizado
            </Link>
            <a href="https://wa.me/5581971027939" target="_blank" rel="noopener noreferrer" style={{ color: '#00DF81', textDecoration: 'none', fontWeight: 600 }}>
              Suporte & Comercial
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
