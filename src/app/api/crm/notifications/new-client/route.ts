import { NextResponse } from 'next/server';
import { getNewClientNotificationEmailHtml, NewClientEmailData } from '@/lib/emails/client-notification';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body: NewClientEmailData = await request.json();

    if (!body.clientName && !body.clientEmail) {
      return NextResponse.json({ error: 'Nome ou email do cliente são obrigatórios.' }, { status: 400, headers: corsHeaders });
    }

    const html = getNewClientNotificationEmailHtml(body);
    const subject = `🚀 Novo Cliente Cadastrado no CRM Infinity — ${body.clientName} · ${body.companyName || body.planName || 'Novo Lead'}`;

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'notificacoes@infinityondemand.com.br';
    const adminRecipients = ['angelo.marques@infinityondemand.com.br'];

    // Se houver email secundário de backup
    if (process.env.ADMIN_NOTIFY_EMAIL && !adminRecipients.includes(process.env.ADMIN_NOTIFY_EMAIL)) {
      adminRecipients.push(process.env.ADMIN_NOTIFY_EMAIL);
    }

    let emailSent = false;
    let resendError = null;

    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: `Infinity CRM <${fromEmail}>`,
            to: adminRecipients,
            subject,
            html,
          }),
        });

        const resData = await response.json();
        if (response.ok) {
          emailSent = true;
        } else {
          resendError = resData;
          // Fallback se o domínio 'infinityondemand.com.br' não tiver DKIM completo no Resend: tentar com onboarding@resend.dev
          try {
            const fallbackResponse = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`,
              },
              body: JSON.stringify({
                from: 'Infinity CRM <onboarding@resend.dev>',
                to: adminRecipients,
                subject,
                html,
              }),
            });
            if (fallbackResponse.ok) {
              emailSent = true;
            }
          } catch {}
        }
      } catch (err: any) {
        resendError = err?.message || String(err);
      }
    }

    return NextResponse.json({
      success: true,
      emailSent,
      resendError,
      recipient: adminRecipients,
    }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Erro ao processar notificação' }, { status: 500, headers: corsHeaders });
  }
}
