import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';

const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || process.env.META_USER_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'flash_verify_2026';

// ─── GET: Webhook Verification ───
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ WhatsApp webhook verified');
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn('⚠️ WhatsApp webhook verification failed');
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

// ─── POST: Receive Messages ───
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract message data from WhatsApp webhook payload
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    // Only process incoming messages (not status updates)
    if (!value?.messages || value.messages.length === 0) {
      return NextResponse.json({ status: 'no_message' }, { status: 200 });
    }

    const message = value.messages[0];
    const contact = value.contacts?.[0];
    const from = message.from; // phone number
    const contactName = contact?.profile?.name || 'Lead';
    const messageText = message.text?.body || '';
    const messageType = message.type;

    // Only handle text messages for now
    if (messageType !== 'text' || !messageText) {
      // Acknowledge non-text messages
      await sendWhatsAppMessage(from, '⚡ Recebi sua mensagem! No momento, consigo responder apenas mensagens de texto. Me envie sua dúvida por escrito!');
      return NextResponse.json({ status: 'non_text_acknowledged' }, { status: 200 });
    }

    console.log(`📩 WhatsApp from ${contactName} (${from}): ${messageText}`);

    // Save incoming message to Supabase
    await supabase.from('whatsapp_conversations').insert({
      phone: from,
      name: contactName,
      role: 'lead',
      message: messageText,
      status: 'open',
    });

    // Load conversation history for context
    const { data: history } = await supabase
      .from('whatsapp_conversations')
      .select('role, message')
      .eq('phone', from)
      .order('created_at', { ascending: true })
      .limit(20);

    // Load business settings for context
    const { data: settings } = await supabase
      .from('agent_settings')
      .select('*')
      .eq('client_id', 'default')
      .single();

    // Build conversation messages for OpenAI
    const conversationMessages = (history || []).map(h => ({
      role: h.role === 'lead' ? 'user' as const : 'assistant' as const,
      content: h.message,
    }));

    // Generate Flash response
    const apiKey = settings?.openai_api_key || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      await sendWhatsAppMessage(from, 'Olá! Recebi sua mensagem. Em breve um consultor vai entrar em contato. 😊');
      return NextResponse.json({ status: 'no_ai_key' }, { status: 200 });
    }

    const openai = new OpenAI({ apiKey });
    const systemPrompt = buildSDRPrompt(settings || {});

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationMessages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const flashResponse = completion.choices[0]?.message?.content || 'Obrigado pela mensagem! Um consultor vai entrar em contato em breve.';

    // Send response via WhatsApp
    await sendWhatsAppMessage(from, flashResponse);

    // Save Flash response to Supabase
    await supabase.from('whatsapp_conversations').insert({
      phone: from,
      name: contactName,
      role: 'flash',
      message: flashResponse,
      status: 'open',
    });

    console.log(`⚡ Flash replied to ${contactName}: ${flashResponse.substring(0, 100)}...`);

    return NextResponse.json({ status: 'replied' }, { status: 200 });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    // Always return 200 to prevent Meta from retrying
    return NextResponse.json({ status: 'error' }, { status: 200 });
  }
}

// ─── Send WhatsApp Message ───
async function sendWhatsAppMessage(to: string, text: string) {
  const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { body: text },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error('WhatsApp send error:', err);
  }

  return res;
}

// ─── Flash SDR System Prompt ───
function buildSDRPrompt(settings: Record<string, unknown>): string {
  return `Você é o **Flash** ⚡ — SDR (Sales Development Representative) da ${settings.business_name || 'Infinity On Demand'}.

## SEU PAPEL
Você é um vendedor consultivo via WhatsApp. Seu objetivo é:
1. Recepcionar leads com cordialidade
2. Entender a necessidade do lead
3. Apresentar a solução de forma consultiva
4. Qualificar o lead (tamanho do negócio, urgência, orçamento)
5. Agendar uma demonstração gratuita

## CONTEXTO DO NEGÓCIO
- **Empresa**: ${settings.business_name || 'Infinity On Demand'}
- **Segmento**: ${settings.business_segment || 'SaaS para delivery e restaurantes'}
- **Descrição**: ${settings.business_description || 'Plataforma completa de delivery com cardápio digital, painel de pedidos, app do entregador, rastreio ao vivo e gestão financeira.'}
- **Público**: ${settings.target_audience || 'Donos de pizzarias, restaurantes e deliverys'}
- **Tom**: ${settings.brand_tone || 'profissional, consultivo e amigável'}

## PRODUTOS/SERVIÇOS
- Plataforma de Delivery (cardápio digital, Kanban de pedidos, app do entregador)
- Gestão Financeira integrada
- Marketing Digital e Tráfego Pago
- Consultoria de Presença Digital

## REGRAS IMPORTANTES
1. Responda SEMPRE em português brasileiro
2. Seja BREVE — WhatsApp não é lugar para textos longos (máx 3 parágrafos)
3. Use emojis com moderação (2-3 por mensagem)
4. Seja HUMANO — fale como um consultor de verdade, não um robô
5. NUNCA invente dados ou preços — se não sabe, diga que vai verificar
6. Quando o lead demonstrar interesse, sugira agendar uma demo: "Posso agendar uma demonstração gratuita de 15 min? 📅"
7. Se perguntar sobre preço, diga que depende do projeto e convide para uma conversa rápida
8. Se o lead for frio ou não respondeu a qualificação, faça uma pergunta aberta
9. Sempre termine com uma pergunta ou CTA claro
10. Não use listas longas — prefira frases curtas e diretas`;
}
