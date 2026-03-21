import { NextRequest, NextResponse } from 'next/server';

const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || process.env.META_USER_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export async function GET(request: NextRequest) {
  const to = request.nextUrl.searchParams.get('to');
  
  if (!to) {
    return NextResponse.json({ error: 'Missing "to" parameter' }, { status: 400 });
  }

  const result: any = {
    diagnostics: {
      time: new Date().toISOString(),
      phoneNumberId: PHONE_NUMBER_ID ? `${PHONE_NUMBER_ID.substring(0, 4)}***` : 'MISSING',
      tokenExists: !!WHATSAPP_TOKEN,
      tokenStart: WHATSAPP_TOKEN ? `${WHATSAPP_TOKEN.substring(0, 8)}...` : 'MISSING'
    }
  };

  try {
    const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
    
    // Fix Brazilian number format (add 9 if missing)
    let formattedTo = to.replace(/\D/g, '');
    if (formattedTo.startsWith('55')) {
      const ddd = formattedTo.substring(2, 4);
      const body = formattedTo.substring(4);
      if (body.length === 8 && /^[6-9]/.test(body)) {
        formattedTo = `55${ddd}9${body}`;
      }
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedTo,
        type: 'text',
        text: { body: `🚀 Teste de Diagnóstico da VPS (Time: ${new Date().toLocaleTimeString('pt-BR')}) - Enviando para ${formattedTo}` },
      }),
    });

    result.status = res.status;
    result.ok = res.ok;
    result.meta_response = await res.json().catch(() => ({ error: 'Not JSON' }));
    
    return NextResponse.json(result);
  } catch (error: any) {
    result.error = error.message || 'Unknown fetch error';
    return NextResponse.json(result, { status: 500 });
  }
}
