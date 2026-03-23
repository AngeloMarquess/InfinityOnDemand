import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { validateApiKey, rateLimit } from '@/lib/api-security';

// Manual .env.local reader for vars that Next.js might not load in production
function getEnvVar(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  try {
    const envPath = join(process.cwd(), '.env.local');
    const content = readFileSync(envPath, 'utf-8');
    const match = content.match(new RegExp(`^${name}=(.+)$`, 'm'));
    return match?.[1]?.trim() || undefined;
  } catch {
    return undefined;
  }
}
// ─── Template Configuration ───
// Categories that should use the delivery/restaurant template
const FOOD_CATEGORIES = [
  'restaurant', 'restaurante', 'pizza', 'pizzaria', 'burger', 'hamburgueria',
  'delivery', 'comida', 'food', 'lanchonete', 'bar', 'churrascaria',
  'padaria', 'cafeteria', 'sushi', 'açaí', 'sorveteria', 'doceria',
  'pastelaria', 'marmitaria', 'espetaria',
];

function chooseTemplate(category: string): { name: string; language: string; hasVariable: boolean } {
  const lower = (category || '').toLowerCase();
  const isFood = FOOD_CATEGORIES.some(kw => lower.includes(kw));
  
  if (isFood) {
    // flash_prospeccao is for restaurants/delivery — has {{1}} variable for business name
    return { name: 'flash_prospeccao', language: 'pt_BR', hasVariable: true };
  }
  // flash is for all other businesses (sites, consulting, etc.) — no variables
  return { name: 'flash', language: 'pt_BR', hasVariable: false };
}

/**
 * Prospecting Send — Flash contacts leads via WhatsApp using Message Templates.
 * 
 * POST body:
 *   { leadId: string }     — contact a single specific lead
 *   { limit?: number }     — batch: contact N Apify leads in "Novo Lead" (default 10, max 50)
 * 
 * Flow:
 * 1. Fetch lead(s)
 * 2. Choose template based on lead category
 * 3. Send via WhatsApp Template API
 * 4. Move lead to "Primeiro Contato" stage
 * 
 * Requires: Authorization: Bearer <FLASH_API_SECRET>
 */
export async function POST(request: NextRequest) {
  // Auth check
  const auth = validateApiKey(request);
  if (!auth.valid) return auth.error!;

  // Rate limit: 5 WhatsApp sends per minute
  const rl = rateLimit(request, { maxRequests: 5, windowMs: 60_000, keyPrefix: 'whatsapp-send' });
  if (!rl.allowed) return rl.error!;

  try {
    const body = await request.json().catch(() => ({}));
    const { leadId } = body;
    const limit = Math.min(body.limit || 10, 50);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const crmOwnerId = process.env.CRM_OWNER_USER_ID;

    if (!supabaseUrl || !supabaseServiceKey || !crmOwnerId) {
      return NextResponse.json({ error: 'Missing server configuration' }, { status: 500 });
    }

    const WHATSAPP_TOKEN = getEnvVar('WHATSAPP_ACCESS_TOKEN');
    const PHONE_NUMBER_ID = getEnvVar('WHATSAPP_PHONE_NUMBER_ID');

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

    let sent = 0;
    let failed = 0;
    const results: { name: string; phone: string; status: string; template?: string; message?: string }[] = [];

    for (const lead of leads) {
      try {
        // Extract category from notes
        const categoryMatch = lead.notes?.match(/Categoria: (.+)/);
        const category = categoryMatch?.[1] || '';

        // Choose template based on category
        const template = chooseTemplate(category);

        // Send via WhatsApp Template API
        const sendRes = await sendWhatsAppTemplate(lead.phone, template.name, template.language, lead.name, template.hasVariable);

        const resData = await sendRes.json().catch(() => ({}));

        if (sendRes.ok) {
          // Move to "Primeiro Contato" stage
          const now = new Date().toLocaleDateString('pt-BR');
          const updatedNotes = (lead.notes || '') + `\n\n💬 Flash prospectou em ${now} (template: ${template.name})`;

          await supabase
            .from('crm_contacts')
            .update({
              stage_id: primeiroContatoStage.id,
              notes: updatedNotes,
            })
            .eq('id', lead.id);

          // Save to whatsapp_conversations for tracking
          await supabase.from('whatsapp_conversations').insert({
            phone: lead.phone,
            name: lead.name,
            role: 'flash',
            message: `[Template: ${template.name}] Variável: ${lead.name}`,
            status: 'open',
            metadata: {
              source: 'prospecting',
              lead_id: lead.id,
              template: template.name,
              meta_ok: true,
              meta_status: sendRes.status,
              meta_response: resData,
            },
          });

          sent++;
          results.push({ name: lead.name, phone: lead.phone, status: 'sent', template: template.name });
        } else {
          const errMsg = resData?.error?.message || JSON.stringify(resData);
          
          // Save failed message to conversations so it shows in chat
          await supabase.from('whatsapp_conversations').insert({
            phone: lead.phone,
            name: lead.name,
            role: 'flash',
            message: `[Template: ${template.name}] Variável: ${lead.name}`,
            status: 'open',
            metadata: {
              source: 'prospecting',
              lead_id: lead.id,
              template: template.name,
              meta_ok: false,
              meta_status: sendRes.status,
              meta_response: resData,
            },
          });

          failed++;
          results.push({ name: lead.name, phone: lead.phone, status: 'failed', template: template.name, message: errMsg });
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

// ─── Send WhatsApp Template Message ───
async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  language: string,
  businessName: string,
  hasVariable: boolean = true
) {
  // Format number
  let formattedTo = to.replace(/\D/g, '');
  if (formattedTo.startsWith('55')) {
    const ddd = formattedTo.substring(2, 4);
    const body = formattedTo.substring(4);
    if (body.length === 8 && /^[6-9]/.test(body)) {
      formattedTo = `55${ddd}9${body}`;
    }
  }

  const WHATSAPP_TOKEN = getEnvVar('WHATSAPP_ACCESS_TOKEN');
  const PHONE_NUMBER_ID = getEnvVar('WHATSAPP_PHONE_NUMBER_ID');
  const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;

  const templatePayload: Record<string, unknown> = {
    name: templateName,
    language: { code: language },
  };

  // Only add body components if the template has variables
  if (hasVariable) {
    templatePayload.components = [
      {
        type: 'body',
        parameters: [
          {
            type: 'text',
            text: businessName, // {{1}} = nome do estabelecimento
          },
        ],
      },
    ];
  }

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
      type: 'template',
      template: templatePayload,
    }),
  });
}
