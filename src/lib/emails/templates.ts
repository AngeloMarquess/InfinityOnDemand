/**
 * Infinity On Demand - Email Templates
 * Brand Colors:
 * - Background: #0B0F19
 * - Card/Container: #111622
 * - Green: #00DF81
 * - Blue: #00AAFF
 * - Text: #FFFFFF
 * - Text Secondary: #8F9CAE
 */

export function getWelcomeEmailHtml(userName: string): string {
  const name = userName || 'cliente';
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo à Infinity On Demand! 🚀</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0B0F19;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #FFFFFF;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #111622;
      border: 1px solid #1F2A3F;
      border-radius: 16px;
      overflow: hidden;
      margin-top: 40px;
      margin-bottom: 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .header {
      padding: 40px 40px 20px 40px;
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .content {
      padding: 40px;
    }
    .footer {
      background-color: #0D111A;
      padding: 30px 40px;
      text-align: center;
      border-top: 1px solid rgba(255,255,255,0.05);
      font-size: 12px;
      color: #5F6E80;
    }
    .logo-text-gradient {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin: 0;
      color: #00DF81;
    }
    .logo-sub {
      font-size: 11px;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #8F9CAE;
      margin-top: 2px;
    }
    h1 {
      font-size: 26px;
      font-weight: 800;
      margin-top: 0;
      margin-bottom: 16px;
      color: #FFFFFF;
      letter-spacing: -0.5px;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #8F9CAE;
      margin-top: 0;
      margin-bottom: 24px;
    }
    .highlight-box {
      background-color: rgba(0, 223, 129, 0.03);
      border: 1px dashed rgba(0, 223, 129, 0.2);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 30px;
    }
    .feature-item {
      margin-bottom: 16px;
    }
    .feature-item:last-child {
      margin-bottom: 0;
    }
    .feature-title {
      font-weight: 700;
      color: #00DF81;
      font-size: 15px;
      display: inline-block;
      margin-bottom: 4px;
    }
    .feature-desc {
      font-size: 14px;
      color: #8F9CAE;
      margin: 0;
      line-height: 1.5;
    }
    .btn-container {
      text-align: center;
      margin-top: 30px;
      margin-bottom: 30px;
    }
    .btn {
      background-color: #00DF81;
      background-image: linear-gradient(135deg, #00DF81 0%, #00AAFF 100%);
      color: #0B0F19 !important;
      font-weight: 700;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 12px;
      display: inline-block;
      font-size: 15px;
      box-shadow: 0 4px 15px rgba(0, 223, 129, 0.3);
      transition: all 0.3s ease;
    }
    .social-links {
      margin-top: 15px;
      margin-bottom: 15px;
    }
    .social-links a {
      color: #8F9CAE;
      text-decoration: none;
      margin: 0 10px;
      font-size: 14px;
    }
    .social-links a:hover {
      color: #00DF81;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo-text-gradient">Infinity</div>
      <div class="logo-sub">Ondemand</div>
    </div>
    
    <div class="content">
      <h1>Olá, ${name}! 👋</h1>
      
      <p>Seja muito bem-vindo à <strong>Infinity On Demand</strong>! Estamos extremamente felizes em ter você conosco.</p>
      
      <p>A partir de agora, você tem acesso ao nosso CRM completo, projetado especificamente para ajudar você a gerenciar seus clientes, fechar mais negócios e escalar sua produtividade.</p>
      
      <div class="highlight-box">
        <p style="margin-bottom: 16px; font-weight: 700; color: #FFFFFF;">O que você pode fazer agora no seu CRM:</p>
        
        <div class="feature-item">
          <span class="feature-title">📊 Pipeline Visual (Kanban)</span>
          <p class="feature-desc">Acompanhe suas negociações do primeiro contato ao fechamento de forma visual e intuitiva.</p>
        </div>
        
        <div class="feature-item">
          <span class="feature-title">✍️ Orçamentos e Propostas Rápidas</span>
          <p class="feature-desc">Gere propostas comerciais profissionais em segundos e envie para o WhatsApp do seu cliente.</p>
        </div>
        
        <div class="feature-item">
          <span class="feature-title">🗓️ Agenda & Tarefas Integradas</span>
          <p class="feature-desc">Nunca mais esqueça de fazer um follow-up ou de uma reunião importante.</p>
        </div>
        
        <div class="feature-item">
          <span class="feature-title">💰 Controle Financeiro</span>
          <p class="feature-desc">Saiba exatamente quanto faturou, seu MRR e controle contas a pagar e receber sem planilhas.</p>
        </div>
      </div>
      
      <p>Pronto para começar? Clique no botão abaixo para acessar sua conta agora mesmo:</p>
      
      <div class="btn-container">
        <a href="https://crm.infinityondemand.com.br" class="btn" target="_blank">Acessar Meu Painel CRM</a>
      </div>
      
      <p>Se tiver qualquer dúvida ou precisar de ajuda para configurar sua conta, basta responder a este e-mail. Nossa equipe de suporte está sempre à disposição.</p>
      
      <p>Sucesso nas vendas!<br><strong>Equipe Infinity On Demand</strong></p>
    </div>
    
    <div class="footer">
      <p style="font-size: 11px; margin-bottom: 10px; color: #5F6E80;">Este e-mail foi enviado por Infinity On Demand.<br>&copy; 2026 Infinity On Demand. Todos os direitos reservados.</p>
      <div class="social-links">
        <a href="https://infinityondemand.com.br" target="_blank">Nosso Site</a> | 
        <a href="https://crm.infinityondemand.com.br" target="_blank">Painel CRM</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function getConfirmationEmailHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirme seu Cadastro | Infinity On Demand</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0B0F19;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #FFFFFF;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #111622;
      border: 1px solid #1F2A3F;
      border-radius: 16px;
      overflow: hidden;
      margin-top: 40px;
      margin-bottom: 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .header {
      padding: 40px 40px 20px 40px;
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .content {
      padding: 40px;
      text-align: center;
    }
    .footer {
      background-color: #0D111A;
      padding: 24px 40px;
      text-align: center;
      border-top: 1px solid rgba(255,255,255,0.05);
      font-size: 11px;
      color: #5F6E80;
    }
    .logo-text-gradient {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin: 0;
      color: #00DF81;
    }
    .logo-sub {
      font-size: 11px;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #8F9CAE;
      margin-top: 2px;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      margin-top: 0;
      margin-bottom: 16px;
      color: #FFFFFF;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      color: #8F9CAE;
      margin-top: 0;
      margin-bottom: 24px;
    }
    .btn-container {
      margin-top: 30px;
      margin-bottom: 30px;
    }
    .btn {
      background-color: #00DF81;
      background-image: linear-gradient(135deg, #00DF81 0%, #00AAFF 100%);
      color: #0B0F19 !important;
      font-weight: 700;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 10px;
      display: inline-block;
      font-size: 14px;
      box-shadow: 0 4px 15px rgba(0, 223, 129, 0.3);
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo-text-gradient">Infinity</div>
      <div class="logo-sub">Ondemand</div>
    </div>
    
    <div class="content">
      <h1>Confirme seu cadastro 🔐</h1>
      
      <p>Olá! Obrigado por criar uma conta na Infinity On Demand. Para ter acesso completo ao CRM e ativar sua conta, por favor confirme seu e-mail clicando no botão abaixo:</p>
      
      <div class="btn-container">
        <a href="{{ .ConfirmationURL }}" class="btn">Confirmar Meu E-mail</a>
      </div>
      
      <p style="font-size: 12px; margin-bottom: 0;">Se o botão acima não funcionar, você também pode copiar e colar este link no seu navegador:<br>
      <a href="{{ .ConfirmationURL }}" style="color: #00AAFF; text-decoration: none; word-break: break-all;">{{ .ConfirmationURL }}</a></p>
    </div>
    
    <div class="footer">
      Se você não solicitou este e-mail, pode ignorá-lo com segurança.<br>
      &copy; 2026 Infinity On Demand. Todos os direitos reservados.
    </div>
  </div>
</body>
</html>`;
}
