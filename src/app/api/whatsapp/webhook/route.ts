import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';
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
    const supabase = getServerSupabase();
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
    const messageType = message.type;
    let messageText = '';

    // If it's audio/voice, transcribe it using Whisper
    if (messageType === 'audio' || messageType === 'voice') {
      const mediaId = message.audio?.id || message.voice?.id;
      if (mediaId) {
        console.log(`🎙️ Processing audio from ${contactName}...`);
        messageText = await transcribeWhatsAppAudio(mediaId);
        if (!messageText) {
          await sendWhatsAppMessage(from, '⚡ Desculpe, não consegui entender o áudio. Pode me mandar por escrito?');
          return NextResponse.json({ status: 'audio_error' }, { status: 200 });
        }
      }
    } else if (messageType === 'text') {
      messageText = message.text?.body || '';
    }

    // Only handle if we have some text to work with
    if (!messageText) {
      if (messageType !== 'text' && messageType !== 'audio' && messageType !== 'voice') {
        // Acknowledge other non-text messages
        await sendWhatsAppMessage(from, '⚡ Recebi sua mensagem, mas no momento consigo entender apenas texto ou áudio. Me envie sua dúvida por escrito!');
      }
      return NextResponse.json({ status: 'non_handled_type' }, { status: 200 });
    }

    console.log(`📩 WhatsApp from ${contactName} (${from}): ${messageText}`);

    // Save incoming message to Supabase
    await supabase.from('whatsapp_conversations').insert({
      phone: from,
      name: contactName,
      role: 'lead',
      message: messageText,
      status: 'open',
      metadata: (messageType === 'audio' || messageType === 'voice') ? { audio: true } : null
    });

    // Load conversation history for context
    const { data: history } = await supabase
      .from('whatsapp_conversations')
      .select('role, message, status')
      .eq('phone', from)
      .order('created_at', { ascending: false })
      .limit(10);

    // Reverse so oldest is first (OpenAI expects chronological order)
    const sortedHistory = (history || []).reverse();

    // Skip bot if already transferred or handled by human
    const isTransferred = sortedHistory.some(h => h.status === 'transferred' || h.status === 'human');
    if (isTransferred) {
      console.log(`⏹️ Skipping bot for ${from} (Transferred to human)`);
      return NextResponse.json({ status: 'transferred_skipped' }, { status: 200 });
    }

    // ─── Attendant Hand-off Logic ───
    const attendantKeywords = ['atendente', 'humano', 'falar com alguém', 'pessoa', 'suporte', 'ajuda', 'falar com ricardo', 'falar com angelo'];
    const isAttendantRequest = attendantKeywords.some(k => messageText.toLowerCase().includes(k));

    if (isAttendantRequest) {
      const userRequests = sortedHistory.filter(h => 
        h.role === 'lead' && attendantKeywords.some(k => h.message.toLowerCase().includes(k))
      );
      
      // If this is the 3rd request (asked 2 times in history)
      if (userRequests.length >= 2) {
        const ownerPhone = '5581971027939'; // User's requested phone
        const notification = `🚨 *HAND-OFF FLASH*\n\nO cliente *${contactName}* (+${from}) pediu atendimento humano pela ${userRequests.length + 1}ª vez.\n\n*Última mensagem:* "${messageText}"\n\nAbra o painel para assumir: https://flash.infinityondemand.com.br/relatorios_infinity`;
        
        await sendWhatsAppMessage(ownerPhone, notification);
        
        const finalLeadMsg = `Certo, ${contactName}! Percebi que você deseja falar com um especialista. Eu já acionei o meu supervisor humano (Angelo/Ricardo) e ele vai assumir essa conversa a partir de agora! 👨‍💻`;
        await sendWhatsAppMessage(from, finalLeadMsg);
        
        await supabase.from('whatsapp_conversations').insert({
          phone: from,
          name: contactName,
          role: 'flash',
          message: finalLeadMsg,
          status: 'transferred'
        });
        
        return NextResponse.json({ status: 'transferred' }, { status: 200 });
      }
    }

    // Load business settings for context
    const { data: settings } = await supabase
      .from('agent_settings')
      .select('*')
      .eq('client_id', 'default')
      .single();

    // Build conversation messages for OpenAI (only last 10 messages for focus)
    const conversationMessages = sortedHistory.map(h => ({
      role: h.role === 'lead' ? 'user' as const : 'assistant' as const,
      content: h.message,
    }));

    // Debug: Log what we're sending to OpenAI
    console.log(`🧠 Sending ${conversationMessages.length} messages to GPT. Last user msg: "${messageText}"`);

    // Generate Flash response
    const apiKey = settings?.openai_api_key || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      await sendWhatsAppMessage(from, 'Olá! Recebi sua mensagem. Em breve um consultor vai entrar em contato. 😊');
      return NextResponse.json({ status: 'no_ai_key' }, { status: 200 });
    }

    const openai = new OpenAI({ apiKey });
    const systemPrompt = buildSDRPrompt(settings || {}, contactName);

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
    const sendRes = await sendWhatsAppMessage(from, flashResponse);
    
    // Raio-X: Get Meta response body for debugging
    let metaResponse = {};
    try {
      metaResponse = await sendRes.clone().json();
    } catch {
      metaResponse = { raw: 'Could not parse JSON' };
    }

    // Save Flash response to Supabase
    const { error: insertError } = await supabase.from('whatsapp_conversations').insert({
      phone: from,
      name: contactName,
      role: 'flash',
      message: flashResponse,
      status: 'open',
      metadata: { 
        meta_status: sendRes.status, 
        meta_ok: sendRes.ok, 
        meta_response: metaResponse 
      }
    });

    if (insertError) console.error('Supabase insert error:', insertError);

    console.log(`⚡ Flash replied to ${contactName}: ${flashResponse.substring(0, 100)}...`);

    return NextResponse.json({ status: 'replied' }, { status: 200 });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    // Always return 200 to prevent Meta from retrying
    return NextResponse.json({ status: 'error' }, { status: 200 });
  }
}

// ─── Formatting ───
function formatWhatsAppTo(to: string): string {
  let cleaned = to.replace(/\D/g, '');
  if (cleaned.startsWith('55')) {
    const ddd = cleaned.substring(2, 4);
    const body = cleaned.substring(4);
    // If it's a mobile number (starts with 6-9) and missing the 9th digit
    if (body.length === 8 && /^[6-9]/.test(body)) {
      return `55${ddd}9${body}`;
    }
  }
  return cleaned;
}

// ─── Send WhatsApp Message ───
async function sendWhatsAppMessage(to: string, text: string) {
  const formattedTo = formatWhatsAppTo(to);
  const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;

  console.log(`📡 Sending to ${formattedTo} (original: ${to})...`);

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
      text: { body: text },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error('WhatsApp send error:', err);
  }

  return res;
}

// ─── Transcribe Audio with Whisper ───
async function transcribeWhatsAppAudio(mediaId: string): Promise<string> {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // 1. Get Media URL from Meta
    const mediaUrlRes = await fetch(`https://graph.facebook.com/v21.0/${mediaId}`, {
      headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` }
    });
    const mediaData = await mediaUrlRes.json();
    if (!mediaData.url) return '';

    // 2. Download the audio file
    const audioContentRes = await fetch(mediaData.url, {
      headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` }
    });
    const audioBuffer = Buffer.from(await audioContentRes.arrayBuffer());

    // 3. Create a virtual file for OpenAI (OpenAI Node SDK requires a file-like object)
    // We create a tiny buffer wrapper with name/type
    const audioFile = new File([audioBuffer], 'voice_note.ogg', { type: 'audio/ogg' });

    // 4. Send to Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1'
    });

    return transcription.text || '';
  } catch (error) {
    console.error('Whisper Transcription Error:', error);
    return '';
  }
}

// ─── Flash SDR System Prompt ───
function buildSDRPrompt(settings: Record<string, unknown>, contactName?: string): string {
  const flashRules = settings.flash_rules as string || '';
  const flashProducts = settings.flash_products as string || '';
  const flashPricing = settings.flash_pricing as string || '';
  const flashFaq = settings.flash_faq as string || '';
  const flashRestrictions = settings.flash_restrictions as string || '';
  const leadName = contactName || 'Lead';

  let prompt = `Você é o **Flash** ⚡ — SDR (Sales Development Representative) da ${settings.business_name || 'Infinity On Demand'}.

## REGRA CRÍTICA
- O nome do lead é **${leadName}**. SEMPRE use o nome "${leadName}" ao se dirigir ao cliente. NUNCA use outro nome.
- NUNCA diga apenas "Oi, como posso ajudar?". SEMPRE responda diretamente ao que o lead perguntou ou disse.
- Se o lead fez uma pergunta, RESPONDA a pergunta. Não mude de assunto.

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
- **Tom**: ${settings.brand_tone || 'profissional, consultivo e amigável'}`;

  // Dynamic products catalog
  if (flashProducts) {
    prompt += `\n\n## CATÁLOGO DE PRODUTOS/SERVIÇOS\n${flashProducts}`;
  } else {
    prompt += `\n\n## PRODUTOS/SERVIÇOS
- Plataforma de Delivery (cardápio digital, Kanban de pedidos, app do entregador)
- Gestão Financeira integrada
- Marketing Digital e Tráfego Pago
- Consultoria de Presença Digital`;
  }

  // Dynamic pricing
  if (flashPricing) {
    prompt += `\n\n## TABELA DE PREÇOS\n${flashPricing}`;
  }

  // Dynamic FAQ
  if (flashFaq) {
    prompt += `\n\n## PERGUNTAS FREQUENTES (FAQ)\n${flashFaq}`;
  }

  // Custom rules from client
  if (flashRules) {
    prompt += `\n\n## REGRAS PERSONALIZADAS DO CLIENTE\n${flashRules}`;
  }

  // Base rules
  prompt += `\n\n## REGRAS GERAIS
1. Responda SEMPRE em português brasileiro
2. Seja BREVE — WhatsApp não é lugar para textos longos (máx 3 parágrafos)
3. Use emojis com moderação (2-3 por mensagem)
4. Seja HUMANO — fale como um consultor de verdade, não um robô
5. Quando o lead demonstrar interesse, sugira agendar uma demo: "Posso agendar uma demonstração gratuita de 15 min? 📅"
6. Se o lead for frio ou não respondeu a qualificação, faça uma pergunta aberta
7. Sempre termine com uma pergunta ou CTA claro
8. Não use listas longas — prefira frases curtas e diretas`;

  // Dynamic restrictions
  if (flashRestrictions) {
    prompt += `\n\n## RESTRIÇÕES E PROIBIÇÕES\n${flashRestrictions}`;
  } else {
    prompt += `\n\n## RESTRIÇÕES
- NUNCA invente dados ou preços que não estejam listados acima
- Se não sabe a resposta, diga que vai verificar com a equipe`;
  }

  return prompt;
}
