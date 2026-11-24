/**
 * Template de Notificação de Novo Cliente no CRM Infinity
 * Design fiel ao padrão da Innoveda com identidade visual Infinity OnDemand
 */

export interface NewClientEmailData {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  companyName?: string;
  planName?: string;
  origin?: string;
  city?: string;
  state?: string;
  address?: string;
  projectInterest?: string;
  notes?: string;
  createdAt?: string;
}

export function getNewClientNotificationEmailHtml(data: NewClientEmailData): string {
  const formattedDate = data.createdAt || new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const phoneClean = (data.clientPhone || '').replace(/\D/g, '');
  const whatsappUrl = phoneClean ? `https://wa.me/55${phoneClean.replace(/^55/, '')}` : null;
  const crmUrl = 'https://crm.infinityondemand.com.br/clientes';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Novo Cliente Cadastrado no CRM</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff; }
    a { color: #00AAFF; text-decoration: none; }
    @media(max-width:600px){
      .email-body-td { padding-left: 16px !important; padding-right: 16px !important; }
      .grid-cols-2 { display: block !important; }
      .grid-cols-2 > div { margin-bottom: 12px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#0b0f19;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#fff">
    Novo cliente cadastrado no CRM Infinity: ${data.clientName} (${data.clientEmail})
  </div>

  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#0b0f19;padding:24px 12px;margin:0 auto;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#111622;border-radius:18px;overflow:hidden;border:1px solid #1F2A3F;box-shadow:0 12px 40px rgba(0,0,0,0.6);text-align:left;">
          
          <!-- Header com Gradiente Estilo Innoveda / Infinity -->
          <tr>
            <td style="background:linear-gradient(135deg, #00E5FF 0%, #0066FF 50%, #7000FF 100%);background-color:#0066FF;padding:32px 36px;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size:24px;font-weight:900;color:#ffffff;letter-spacing:1px;text-transform:uppercase;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1;">
                      INFINITY ONDEMAND
                    </div>
                    <div style="font-size:11px;color:rgba(255,255,255,0.9);letter-spacing:0.18em;text-transform:uppercase;margin-top:6px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                      TECNOLOGIA & GESTÃO INTELIGENTE
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Conteúdo Principal -->
          <tr>
            <td style="padding:32px 36px;" class="email-body-td">
              
              <!-- Caixa de Destaque do Pedido / Cadastro -->
              <div style="background:#181F2E;border:1px solid #2D3A54;border-radius:14px;padding:18px 20px;margin-bottom:24px;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="36" valign="middle" style="font-size:28px;padding-right:12px;">
                      🚀
                    </td>
                    <td valign="middle">
                      <div style="font-size:16px;font-weight:800;color:#ffffff;">
                        Novo cliente cadastrado!
                      </div>
                      <div style="font-size:12px;color:#00DB79;margin-top:3px;font-weight:600;">
                        Entrada no CRM · ${formattedDate}
                      </div>
                    </td>
                    <td width="90" align="right" valign="middle">
                      <span style="background:rgba(0,219,121,0.15);color:#00DB79;border:1px solid rgba(0,219,121,0.3);padding:4px 12px;border-radius:99px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;display:inline-block;">
                        Ativo
                      </span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Grid de Dados: Cliente & Plano -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td width="48%" valign="top" style="background:#151B28;border-radius:12px;padding:16px 18px;border:1px solid #222C3F;">
                    <div style="font-size:11px;font-weight:800;color:#8F9CAE;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">
                      CLIENTE
                    </div>
                    <div style="font-size:15px;font-weight:700;color:#ffffff;line-height:1.3;">
                      ${data.clientName}
                    </div>
                    <div style="font-size:13px;color:#00AAFF;margin-top:4px;word-break:break-all;">
                      ${data.clientEmail}
                    </div>
                    ${data.clientPhone ? `
                      <div style="font-size:13px;color:#A0AEC0;margin-top:4px;">
                        📱 ${data.clientPhone}
                        ${whatsappUrl ? ` · <a href="${whatsappUrl}" style="color:#00DB79;font-weight:700;text-decoration:none;">WhatsApp →</a>` : ''}
                      </div>
                    ` : ''}
                  </td>
                  <td width="4%">&nbsp;</td>
                  <td width="48%" valign="top" style="background:#151B28;border-radius:12px;padding:16px 18px;border:1px solid #222C3F;">
                    <div style="font-size:11px;font-weight:800;color:#8F9CAE;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">
                      PLANO & ACESSO
                    </div>
                    <div style="font-size:15px;font-weight:700;color:#00DB79;line-height:1.3;">
                      ${data.planName || 'Trial Grátis 3 Dias (Pro)'}
                    </div>
                    <div style="font-size:13px;color:#A0AEC0;margin-top:4px;">
                      Status: <strong style="color:#ffffff;">Liberado no CRM</strong>
                    </div>
                    <div style="font-size:12px;color:#8F9CAE;margin-top:4px;">
                      Origem: ${data.origin || 'Cadastro Direto'}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Card de Localização / Empresa se houver -->
              ${(data.companyName || data.city || data.state || data.address) ? `
              <div style="background:#151B28;border-radius:12px;padding:16px 18px;border:1px solid #222C3F;margin-bottom:14px;">
                <div style="font-size:11px;font-weight:800;color:#8F9CAE;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">
                  EMPRESA & LOCALIZAÇÃO
                </div>
                ${data.companyName ? `
                  <div style="font-size:14px;font-weight:700;color:#ffffff;margin-bottom:4px;">
                    🏢 Empresa: ${data.companyName}
                  </div>
                ` : ''}
                ${(data.city || data.state || data.address) ? `
                  <div style="font-size:13px;color:#A0AEC0;line-height:1.5;">
                    📍 ${[data.address, data.city, data.state].filter(Boolean).join(' · ')}
                  </div>
                ` : ''}
              </div>
              ` : ''}

              <!-- Observações ou Interesse do Projeto se houver -->
              ${(data.projectInterest || data.notes) ? `
              <div style="background:#151B28;border-radius:12px;padding:16px 18px;border:1px solid #222C3F;margin-bottom:24px;">
                <div style="font-size:11px;font-weight:800;color:#8F9CAE;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">
                  INTERESSE / OBSERVAÇÕES
                </div>
                <div style="font-size:13px;color:#E2E8F0;line-height:1.5;">
                  ${data.projectInterest ? `<strong>Interesse:</strong> ${data.projectInterest}<br/>` : ''}
                  ${data.notes ? `<strong>Notas:</strong> ${data.notes}` : ''}
                </div>
              </div>
              ` : '<div style="margin-bottom:20px;"></div>'}

              <!-- Botão CTA Principal -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:10px;margin-bottom:10px;">
                <tr>
                  <td align="center">
                    <a href="${crmUrl}" style="background:linear-gradient(135deg, #00E5FF 0%, #0066FF 100%);color:#070B14;font-size:14px;font-weight:900;text-decoration:none;padding:14px 28px;border-radius:10px;display:inline-block;letter-spacing:0.03em;box-shadow:0 4px 15px rgba(0,102,255,0.4);">
                      Ver Cliente no Painel CRM →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:22px 36px;background-color:#0D111A;border-top:1px solid #1F2A3F;text-align:center;font-size:12px;color:#5F6E80;line-height:1.6;">
              <p style="margin:0;color:#8F9CAE;">© ${new Date().getFullYear()} Infinity OnDemand · Plataforma de Gestão & CRM.</p>
              <p style="margin:4px 0 0 0;">
                <a href="https://infinityondemand.com.br" style="color:#00AAFF;text-decoration:none;">infinityondemand.com.br</a> · 
                <a href="https://crm.infinityondemand.com.br" style="color:#00DB79;text-decoration:none;">crm.infinityondemand.com.br</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
