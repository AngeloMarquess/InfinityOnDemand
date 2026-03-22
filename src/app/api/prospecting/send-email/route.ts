import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { join } from 'path';

// Manual .env.local reader for vars that Next.js might not load
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

/**
 * Email Prospecting — Flash contacts leads via email (Resend).
 * 
 * POST body:
 *   { leadId: string }     — email a single specific lead
 *   { limit?: number }     — batch: email N leads with email addresses (default 10, max 50)
 * 
 * CORS is handled globally by next.config.ts
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
    const RESEND_API_KEY = getEnvVar('RESEND_API_KEY');
    const FROM_EMAIL = getEnvVar('RESEND_FROM_EMAIL') || 'angelo.marques@infinityondemand.com.br';

    if (!supabaseUrl || !supabaseServiceKey || !crmOwnerId) {
      return NextResponse.json({ error: 'Missing server configuration' }, { status: 500 });
    }
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: 'Resend API not configured' }, { status: 500 });
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
      const { data, error } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('id', leadId)
        .eq('user_id', crmOwnerId)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }
      if (!data.email) {
        return NextResponse.json({ error: 'Lead has no email' }, { status: 400 });
      }
      leads = [data];
    } else {
      if (!novoLeadStage) {
        return NextResponse.json({ error: 'Pipeline stage "Novo Lead" not found' }, { status: 400 });
      }
      const { data, error: fetchError } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('user_id', crmOwnerId)
        .eq('origin', 'apify')
        .eq('stage_id', novoLeadStage.id)
        .not('email', 'is', null)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (fetchError) {
        return NextResponse.json({ error: `Failed to fetch leads: ${fetchError.message}` }, { status: 500 });
      }
      leads = data || [];
    }

    if (leads.length === 0) {
      return NextResponse.json({ message: 'No leads with email to contact', sent: 0 });
    }

    let sent = 0;
    let failed = 0;
    const results: { name: string; email: string; status: string; message?: string }[] = [];

    for (const lead of leads) {
      try {
        // Generate personalized email subject and body via GPT
        let subject: string;
        let textBody: string;

        if (openaiKey) {
          const openai = new OpenAI({ apiKey: openaiKey });
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `Você é o Flash ⚡, SDR da Infinity On Demand. 
Gere um JSON com "subject" e "body" para um email de prospecção.

REGRAS:
- Subject: curto, máximo 60 caracteres, que desperte curiosidade
- Body: texto simples (sem HTML), máximo 5 linhas
- Mencione o nome do estabelecimento
- Seja profissional e direto
- Termine com uma pergunta ou call-to-action
- NÃO use markdown/negrito
- Responda APENAS o JSON, nada mais`,
              },
              {
                role: 'user',
                content: `Lead: ${lead.name}\nEmail: ${lead.email}\nCidade: ${lead.city || 'não informado'}\nCategoria: ${lead.notes?.match(/Categoria: (.+)/)?.[1] || 'estabelecimento'}`,
              },
            ],
            temperature: 0.8,
            max_tokens: 200,
          });

          try {
            const raw = completion.choices[0]?.message?.content || '';
            const parsed = JSON.parse(raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
            subject = parsed.subject || `Proposta para ${lead.name}`;
            textBody = parsed.body || '';
          } catch {
            subject = `Aumente as vendas do ${lead.name} com delivery digital`;
            textBody = `Olá! Sou o Angelo da Infinity On Demand.\n\nEncontrei o ${lead.name} e acredito que nossa plataforma de delivery pode ajudar vocês a vender mais.\n\nPosso te mostrar em 5 minutos?`;
          }
        } else {
          subject = `Aumente as vendas do ${lead.name} com delivery digital`;
          textBody = `Olá! Sou o Angelo da Infinity On Demand.\n\nEncontrei o ${lead.name} e acredito que nossa plataforma de delivery pode ajudar vocês a vender mais.\n\nPosso te mostrar em 5 minutos?`;
        }

        // Build HTML email
        const htmlEmail = buildProspectingEmail(lead.name, textBody);

        // Send via Resend
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `Infinity On Demand <${FROM_EMAIL}>`,
            to: [lead.email],
            subject,
            html: htmlEmail,
            text: textBody,
          }),
        });

        const resendData = await resendRes.json();

        if (resendRes.ok) {
          // Move to "Primeiro Contato" stage
          const now = new Date().toLocaleDateString('pt-BR');
          const updatedNotes = (lead.notes || '') + `\n\n📧 Flash prospectou por email em ${now}:\nAssunto: "${subject}"`;

          await supabase
            .from('crm_contacts')
            .update({
              stage_id: primeiroContatoStage.id,
              notes: updatedNotes,
            })
            .eq('id', lead.id);

          sent++;
          results.push({ name: lead.name, email: lead.email, status: 'sent', message: subject });
        } else {
          failed++;
          results.push({ name: lead.name, email: lead.email, status: 'failed', message: resendData?.message || 'Resend error' });
        }

        // Rate limit: 1 second between emails
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        failed++;
        results.push({ name: lead.name, email: lead.email, status: 'error', message: (err as Error).message });
      }
    }

    return NextResponse.json({ success: true, total: leads.length, sent, failed, results });
  } catch (error) {
    console.error('Email prospecting error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ─── Professional HTML Email Template ───
function buildProspectingEmail(leadName: string, bodyText: string): string {
  const bodyHtml = bodyText.replace(/\n/g, '<br>');
  
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
      <div style="font-size:24px;font-weight:800;color:#fff;margin-bottom:4px;">
        <span style="background:linear-gradient(90deg,#00df81,#007aff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">∞</span>
        <span style="color:#fff;margin-left:8px;">Infinity On Demand</span>
      </div>
      <p style="color:#94a3b8;margin:0;font-size:14px;">Tecnologia para seu negócio crescer</p>
    </div>

    <!-- Body -->
    <div style="background:#fff;padding:32px;border-radius:0 0 16px 16px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 24px;">
        ${bodyHtml}
      </p>

      <!-- CTA Button -->
      <div style="text-align:center;margin:24px 0;">
        <a href="https://infinityondemand.com.br" style="display:inline-block;background:linear-gradient(90deg,#00df81,#007aff);color:#fff;font-weight:700;font-size:15px;padding:14px 40px;border-radius:12px;text-decoration:none;">
          Conhecer a Plataforma →
        </a>
      </div>

      <p style="color:#9ca3af;font-size:12px;text-align:center;margin:16px 0 0;">
        Se não tiver interesse, basta ignorar este email.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px;color:#9ca3af;font-size:11px;">
      <p style="margin:0;">Infinity On Demand © ${new Date().getFullYear()}</p>
      <p style="margin:4px 0 0;">angelo.marques@infinityondemand.com.br</p>
    </div>
  </div>
</body>
</html>`;
}
