import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Infinity OnDemand',
  description: 'Saiba como a Infinity OnDemand protege seus dados e garante sua privacidade.',
};

const glassCard: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '20px',
  padding: '32px',
  backdropFilter: 'blur(20px)',
  position: 'relative' as const,
  overflow: 'hidden',
};

const sections = [
  {
    icon: '📋',
    title: 'Informações que coletamos',
    color: '#8B5CF6',
    content: 'O aplicativo Infinity OnDemand coleta informações necessárias para o funcionamento do serviço de publicação automática de conteúdo em redes sociais, incluindo tokens de acesso às plataformas Meta (Instagram e Facebook) e dados de publicações agendadas.',
  },
  {
    icon: '⚙️',
    title: 'Como usamos suas informações',
    color: '#4a90e2',
    content: 'Utilizamos as informações exclusivamente para: publicação e agendamento de conteúdo nas plataformas autorizadas pelo usuário, análise de desempenho de publicações e geração de relatórios.',
  },
  {
    icon: '🤝',
    title: 'Compartilhamento de dados',
    color: '#00DB79',
    content: 'Não compartilhamos, vendemos ou distribuímos suas informações pessoais a terceiros. Os dados são transmitidos apenas às APIs oficiais da Meta (Instagram/Facebook) conforme autorizado pelo usuário.',
  },
  {
    icon: '🔒',
    title: 'Armazenamento e segurança',
    color: '#F59E0B',
    content: 'Os dados são armazenados de forma segura utilizando Supabase com criptografia em trânsito e em repouso. Tokens de acesso são armazenados em variáveis de ambiente seguras no servidor.',
  },
  {
    icon: '🗑️',
    title: 'Exclusão de dados',
    color: '#EC4899',
    content: 'Você pode solicitar a exclusão de todos os seus dados a qualquer momento entrando em contato pelo email: contato@infinityondemand.com.br. Também disponibilizamos um endpoint de exclusão automática conforme requisitos da Meta.',
  },
  {
    icon: '✅',
    title: 'Seus direitos',
    color: '#06B6D4',
    items: [
      'Acessar seus dados pessoais',
      'Solicitar correção ou exclusão',
      'Revogar o acesso do aplicativo às suas contas de redes sociais a qualquer momento',
      'Exportar seus dados em formato legível',
    ],
  },
  {
    icon: '📬',
    title: 'Contato',
    color: '#00DB79',
    content: 'Para dúvidas sobre esta política, entre em contato:',
    contact: true,
  },
];

export default function PrivacyPolicy() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0A0F1C 0%, #0d1117 50%, #0A0F1C 100%)',
      color: '#fff',
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: '-200px', right: '-200px', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(0,219,121,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '-200px', left: '-200px', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(74,144,226,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '60px 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* Back link */}
        <a href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none',
          marginBottom: '40px',
        }}>
          ← Voltar ao site
        </a>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(0,219,121,0.15), rgba(74,144,226,0.1))',
            border: '1px solid rgba(0,219,121,0.2)',
            marginBottom: '24px', fontSize: '32px',
          }}>
            🛡️
          </div>
          <h1 style={{
            fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px',
          }}>
            <span style={{ background: 'linear-gradient(135deg, #00DB79, #4a90e2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Política de Privacidade
            </span>
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)' }}>
            Última atualização: 19 de março de 2026
          </p>
        </div>

        {/* Intro badge */}
        <div style={{
          ...glassCard,
          background: 'linear-gradient(135deg, rgba(0,219,121,0.06) 0%, rgba(74,144,226,0.03) 100%)',
          border: '1px solid rgba(0,219,121,0.12)',
          marginBottom: '24px', textAlign: 'center', padding: '24px 32px',
        }}>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
            A <strong style={{ color: '#00DB79' }}>Infinity OnDemand</strong> leva sua privacidade a sério. 
            Este documento explica como coletamos, usamos e protegemos suas informações.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sections.map((section, i) => (
            <div key={i} style={{ ...glassCard, padding: '28px 32px' }}>
              {/* Color accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                background: `linear-gradient(180deg, ${section.color}, transparent)`,
                borderRadius: '4px 0 0 4px',
              }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                {/* Icon */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: `${section.color}15`, border: `1px solid ${section.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', flexShrink: 0,
                }}>
                  {section.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <h2 style={{
                    fontSize: '18px', fontWeight: 700, marginBottom: '12px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                    <span style={{ color: section.color, fontSize: '13px', fontWeight: 600 }}>
                      0{i + 1}
                    </span>
                    {section.title}
                  </h2>

                  {section.content && (
                    <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, fontSize: '14px' }}>
                      {section.content}
                    </p>
                  )}

                  {section.items && (
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {section.items.map((item, j) => (
                        <li key={j} style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          color: 'rgba(255,255,255,0.55)', fontSize: '14px',
                        }}>
                          <div style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            backgroundColor: section.color, flexShrink: 0,
                          }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.contact && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                      <a href="mailto:contato@infinityondemand.com.br" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        color: '#00DB79', fontSize: '14px', textDecoration: 'none',
                        padding: '10px 16px', borderRadius: '10px',
                        backgroundColor: 'rgba(0,219,121,0.08)',
                        border: '1px solid rgba(0,219,121,0.15)',
                        width: 'fit-content',
                      }}>
                        ✉️ contato@infinityondemand.com.br
                      </a>
                      <a href="https://infinityondemand.com.br" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        color: '#4a90e2', fontSize: '14px', textDecoration: 'none',
                        padding: '10px 16px', borderRadius: '10px',
                        backgroundColor: 'rgba(74,144,226,0.08)',
                        border: '1px solid rgba(74,144,226,0.15)',
                        width: 'fit-content',
                      }}>
                        🌐 infinityondemand.com.br
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '48px', paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
            © 2026 Infinity OnDemand. Todos os direitos reservados.
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.12)', marginTop: '8px' }}>
            CNPJ: 00.000.000/0001-00 • Recife, PE — Brasil
          </p>
        </div>
      </div>
    </div>
  );
}
