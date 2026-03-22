import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

/**
 * Prospecting Send — Flash contacts leads via WhatsApp.
 * 
 * POST body:
 *   { leadId: string }     — contact a single specific lead
 *   { limit?: number }     — batch: contact N Apify leads in "Novo Lead" (default 10, max 50)
 * 
 * Flow:
 * 1. Fetch lead(s)
 * 2. Generate personalized message via GPT
 * 3. Send via WhatsApp API
 * 4. Move lead to "Primeiro Contato" stage
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { leadId } = body;
    const limit = Math.min(body.limit || 10, 50);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const crmOwnerId = process.env.CRM_OWNER_USER_ID;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!supabaseUrl || !supabaseServiceKey || !crmOwnerId) {
      return NextResponse.json({ error: 'Missing server configuration' }, { status: 500 });
    }

    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      return NextResponse.json({ error: 'WhatsApp API not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get stages
    const { data: stagesData } = await supabase
      .from('crm_stages')
      .select('id, name')
      .eq('user_id', crmOwnerId);

    const stages = stagesData || [];
    const novoLeadStage = stages.find(s => s.name === 'Novo Lead');
    const primeiroContatoStage = stages.find(s => s.name === 'Primeiro Contato');

    if (!primeiroContatoStage) {
      return NextResponse.json({ error: 'Pipeline stage "Primeiro Contato" not found' }, { status: 400 });
    }

    let leads;

    if (leadId) {
      // ─── Single lead mode ───
      const { data, error } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('id', leadId)
        .eq('user_id', crmOwnerId)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }
      if (!data.phone) {
        return NextResponse.json({ error: 'Lead has no phone number' }, { status: 400 });
      }
      leads = [data];
    } else {
      // ─── Batch mode (Apify leads in "Novo Lead") ───
      if (!novoLeadStage) {
        return NextResponse.json({ error: 'Pipeline stage "Novo Lead" not found' }, { status: 400 });
      }
      const { data, error: fetchError } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('user_id', crmOwnerId)
        .eq('origin', 'apify')
        .eq('stage_id', novoLeadStage.id)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (fetchError) {
        return NextResponse.json({ error: `Failed to fetch leads: ${fetchError.message}` }, { status: 500 });
      }
      leads = data || [];
    }

    if (leads.length === 0) {
      return NextResponse.json({ message: 'No leads to contact', sent: 0 });
    }

    // Load business settings for Flash context
    const { data: settings } = await supabase
      .from('agent_settings')
      .select('*')
      .eq('client_id', 'default')
      .single();

    const businessName = (settings?.business_name as string) || 'Infinity On Demand';
    const businessDesc = (settings?.business_description as string) || 'Plataforma completa de delivery com cardápio digital, painel de pedidos e gestão financeira.';

    let sent = 0;
    let failed = 0;
    const results: { name: string; phone: string; status: string; message?: string }[] = [];

    for (const lead of leads) {
      try {
        // Generate personalized message
        let flashMessage: string;

        if (openaiKey) {
          const openai = new OpenAI({ apiKey: openaiKey });

          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `Você é o Flash ⚡, SDR da ${businessName}. ${businessDesc}

Gere uma ÚNICA mensagem curta e personalizada de prospecção para o lead abaixo. 

REGRAS:
- Máximo 3 linhas
- Mencione o nome do estabelecimento
- Seja cordial e direto
- Termine com uma pergunta aberta
- Use no máximo 2 emojis
- NÃO use negrito/itálico/markdown
- Tom: profissional e consultivo
- Fale de forma natural como um vendedor real`,
              },
              {
                role: 'user',
                content: `Lead: ${lead.name}\nCidade: ${lead.city || 'não informado'}\nCategoria: ${lead.notes?.match(/Categoria: (.+)/)?.[1] || 'restaurante'}\nNota Google: ${lead.notes?.match(/Nota: ([\d.]+)/)?.[1] || 'não informado'}`,
              },
            ],
            temperature: 0.8,
            max_tokens: 150,
          });

          flashMessage = completion.choices[0]?.message?.content || '';
        } else {
          // Fallback message without AI
          flashMessage = `Olá! Sou o Flash da ${businessName}. Vi o ${lead.name} no Google Maps e achei que nossa plataforma de delivery pode ajudar vocês a vender mais! Posso te mostrar em 5 minutos como funciona?`;
        }

        if (!flashMessage) continue;

        // Send via WhatsApp
        const sendRes = await sendWhatsAppMessage(lead.phone, flashMessage);

        if (sendRes.ok) {
          // Move to "Primeiro Contato" stage
          const now = new Date().toLocaleDateString('pt-BR');
          const updatedNotes = (lead.notes || '') + `\n\n💬 Flash prospectou em ${now}:\n"${flashMessage}"`;

          await supabase
            .from('crm_contacts')
            .update({
              stage_id: primeiroContatoStage.id,
              notes: updatedNotes,
            })
            .eq('id', lead.id);

          // Also save to whatsapp_conversations so webhook can track replies
          await supabase.from('whatsapp_conversations').insert({
            phone: lead.phone,
            name: lead.name,
            role: 'flash',
            message: flashMessage,
            status: 'open',
            metadata: { source: 'prospecting', lead_id: lead.id },
          });

          sent++;
          results.push({ name: lead.name, phone: lead.phone, status: 'sent', message: flashMessage });
        } else {
          const errData = await sendRes.json().catch(() => ({}));
          failed++;
          results.push({ name: lead.name, phone: lead.phone, status: 'failed', message: errData.error?.message || 'WhatsApp send failed' });
        }

        // Rate limiting: wait 2 seconds between messages
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (err) {
        failed++;
        results.push({ name: lead.name, phone: lead.phone, status: 'error', message: (err as Error).message });
      }
    }

    return NextResponse.json({
      success: true,
      total: leads.length,
      sent,
      failed,
      results,
    });
  } catch (error) {
    console.error('Prospecting send error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ─── Send WhatsApp Message ───
async function sendWhatsAppMessage(to: string, text: string) {
  // Format number
  let formattedTo = to.replace(/\D/g, '');
  if (formattedTo.startsWith('55')) {
    const ddd = formattedTo.substring(2, 4);
    const body = formattedTo.substring(4);
    if (body.length === 8 && /^[6-9]/.test(body)) {
      formattedTo = `55${ddd}9${body}`;
    }
  }

  const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;

  return fetch(url, {
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
}
