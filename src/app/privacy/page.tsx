export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', color: '#fff', background: '#0a0b0e', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>Política de Privacidade</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>Última atualização: 19 de março de 2026</p>
      
      <h2 style={{ fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>1. Informações que coletamos</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
        O aplicativo Infinity OnDemand coleta informações necessárias para o funcionamento do serviço de publicação 
        automática de conteúdo em redes sociais, incluindo tokens de acesso às plataformas Meta (Instagram e Facebook) 
        e dados de publicações agendadas.
      </p>

      <h2 style={{ fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>2. Como usamos suas informações</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
        Utilizamos as informações exclusivamente para: publicação e agendamento de conteúdo nas plataformas autorizadas 
        pelo usuário, análise de desempenho de publicações e geração de relatórios.
      </p>

      <h2 style={{ fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>3. Compartilhamento de dados</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
        Não compartilhamos, vendemos ou distribuímos suas informações pessoais a terceiros. Os dados são transmitidos 
        apenas às APIs oficiais da Meta (Instagram/Facebook) conforme autorizado pelo usuário.
      </p>

      <h2 style={{ fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>4. Armazenamento e segurança</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
        Os dados são armazenados de forma segura utilizando Supabase com criptografia em trânsito e em repouso. 
        Tokens de acesso são armazenados em variáveis de ambiente seguras no servidor.
      </p>

      <h2 style={{ fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>5. Exclusão de dados</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
        Você pode solicitar a exclusão de todos os seus dados a qualquer momento entrando em contato pelo email: 
        angelofe@gmail.com. Também disponibilizamos um endpoint de exclusão automática conforme requisitos da Meta.
      </p>

      <h2 style={{ fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>6. Seus direitos</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
        Você tem o direito de: acessar seus dados pessoais, solicitar correção ou exclusão, revogar o acesso do 
        aplicativo às suas contas de redes sociais a qualquer momento através das configurações de cada plataforma.
      </p>

      <h2 style={{ fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>7. Contato</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
        Para dúvidas sobre esta política, entre em contato: angelofe@gmail.com
      </p>

      <p style={{ color: 'rgba(255,255,255,0.3)', marginTop: '48px', fontSize: '13px' }}>
        © 2026 Infinity OnDemand. Todos os direitos reservados.
      </p>
    </div>
  );
}
