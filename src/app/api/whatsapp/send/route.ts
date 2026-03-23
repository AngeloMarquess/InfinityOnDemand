import { NextRequest, NextResponse } from 'next/server';

const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

function formatBrazilianNumber(phone: string): string {
  let formatted = phone.replace(/\D/g, '');
  if (formatted.startsWith('55')) {
    const ddd = formatted.substring(2, 4);
    const body = formatted.substring(4);
    if (body.length === 8 && /^[6-9]/.test(body)) {
      formatted = `55${ddd}9${body}`;
    }
  }
  return formatted;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message, template, variables } = body;

    if (!to) {
      return NextResponse.json({ error: 'to is required' }, { status: 400 });
    }

    const formattedTo = formatBrazilianNumber(to);
    const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;

    let payload: Record<string, unknown>;

    if (template) {
      // Send as WhatsApp template message
      const components: Record<string, unknown>[] = [];
      
      // Add body parameters if variables exist
      if (variables && variables.length > 0) {
        components.push({
          type: 'body',
          parameters: variables.map((v: string) => ({
            type: 'text',
            text: v,
          })),
        });
      }

      payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedTo,
        type: 'template',
        template: {
          name: template,
          language: { code: 'pt_BR' },
          ...(components.length > 0 ? { components } : {}),
        },
      };
    } else if (message) {
      // Send as regular text message
      payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedTo,
        type: 'text',
        text: { body: message },
      };
    } else {
      return NextResponse.json({ error: 'message or template is required' }, { status: 400 });
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('WhatsApp API error:', JSON.stringify(data));
      return NextResponse.json({ error: data.error?.message || 'Failed to send' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
