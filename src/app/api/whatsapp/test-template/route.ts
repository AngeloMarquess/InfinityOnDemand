import { NextRequest, NextResponse } from 'next/server';

const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || process.env.META_USER_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export async function GET(request: NextRequest) {
  const to = request.nextUrl.searchParams.get('to') || '5581971027939';
  const template = request.nextUrl.searchParams.get('template') || 'flash_prospeccao';
  const variable = request.nextUrl.searchParams.get('var') || 'Teste Restaurante';

  let formattedTo = to.replace(/\D/g, '');
  if (formattedTo.startsWith('55')) {
    const ddd = formattedTo.substring(2, 4);
    const body = formattedTo.substring(4);
    if (body.length === 8 && /^[6-9]/.test(body)) {
      formattedTo = `55${ddd}9${body}`;
    }
  }

  const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;

  // Try WITH body components (variable)
  const payloadWithVar = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formattedTo,
    type: 'template',
    template: {
      name: template,
      language: { code: 'pt_BR' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: variable },
          ],
        },
      ],
    },
  };

  // Try WITHOUT body components (no variable)
  const payloadNoVar = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formattedTo,
    type: 'template',
    template: {
      name: template,
      language: { code: 'pt_BR' },
    },
  };

  const results: Record<string, unknown> = {
    diagnostics: {
      time: new Date().toISOString(),
      phoneNumberId: PHONE_NUMBER_ID ? `${PHONE_NUMBER_ID.substring(0, 6)}***` : 'MISSING',
      tokenExists: !!WHATSAPP_TOKEN,
      to: formattedTo,
      template,
      variable,
    },
  };

  // Test 1: With variables
  try {
    const res1 = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payloadWithVar),
    });
    results.test1_with_variable = {
      status: res1.status,
      ok: res1.ok,
      payload_sent: payloadWithVar,
      response: await res1.json().catch(() => ({ error: 'Not JSON' })),
    };
  } catch (err: any) {
    results.test1_with_variable = { error: err.message };
  }

  // Only test without variable if test 1 failed
  if (!(results.test1_with_variable as any)?.ok) {
    try {
      const res2 = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadNoVar),
      });
      results.test2_without_variable = {
        status: res2.status,
        ok: res2.ok,
        payload_sent: payloadNoVar,
        response: await res2.json().catch(() => ({ error: 'Not JSON' })),
      };
    } catch (err: any) {
      results.test2_without_variable = { error: err.message };
    }
  }

  return NextResponse.json(results, { status: 200 });
}
