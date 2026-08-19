import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { join } from 'path';
import { validateApiKey, rateLimit } from '@/lib/api-security';

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

// 4 High-Conversion Segment Templates
export const SEGMENT_TEMPLATES: Record<string, { subject: string; body: string; pillar: string }> = {
  sites: {
    pillar: 'Sites & Presença Digital',
    subject: 'Novo posicionamento digital para {empresa}',
    body: 'Olá! Notei que a presença online do {empresa} tem grande potencial de crescimento. Na Infinity On Demand, desenvolvemos landing pages e sites de alta conversão integrados com inteligência artificial para transformar visitantes em clientes qualificados todos os dias.\n\nPodemos apresentar um diagnóstico rápido de 5 minutos sem compromisso?'
  },
  sistemas: {
    pillar: 'Sistemas & Automações com IA',
    subject: 'Automação inteligente de atendimento para {empresa}',
    body: 'Olá equipe do {empresa}! Criamos sistemas sob medida e robôs com IA que atendem no WhatsApp 24h por dia, agendam serviços e eliminam trabalho manual da sua operação.\n\nGostaria de ver uma demonstração de como a IA pode atender seus clientes automaticamente?'
  },
  ecommerce: {
    pillar: 'E-commerce & Lojas Virtuais',
    subject: 'Escala de vendas e catálogo online para {empresa}',
    body: 'Olá! Vimos o excelente trabalho do {empresa} e preparamos uma solução para turbinar suas vendas online. Nossa plataforma de e-commerce e catálogo digital conta com checkout transparente e integração direta com WhatsApp para multiplicar seus pedidos diários.\n\nPodemos te enviar uma demonstração gratuita da loja virtual?'
  },
  trafego: {
    pillar: 'Tráfego Pago & Performance',
    subject: 'Atraia mais clientes qualificados em {cidade} para {empresa}',
    body: 'Olá! Gerenciamos campanhas de tráfego de alta performance no Google e Meta Ads focadas exclusivamente em gerar contatos e vendas reais para o {empresa} na sua região.\n\nPodemos fazer uma estimativa gratuita de quantos novos clientes você pode atrair este mês?'
  }
};

function detectSegmentPillar(lead: any): 'sites' | 'sistemas' | 'ecommerce' | 'trafego' {
  const text = `${lead.name || ''} ${lead.company || ''} ${lead.project_interest || ''} ${lead.notes || ''}`.toLowerCase();
  
  if (text.includes('loja') || text.includes('moda') || text.includes('roupa') || text.includes('calcado') || text.includes('biquini') || text.includes('ecommerce') || text.includes('delivery') || text.includes('burger') || text.includes('pizza') || text.includes('restaurante')) {
    return 'ecommerce';
  }
  if (text.includes('clinica') || text.includes('estetica') || text.includes('odonto') || text.includes('advoc') || text.includes('consult') || text.includes('imobiliaria')) {
    return 'sites';
  }
  if (text.includes('sistema') || text.includes('automac') || text.includes('software') || text.includes('ia') || text.includes('bot')) {
    return 'sistemas';
  }
  return 'trafego';
}

export async function POST(request: NextRequest) {
  // Auth check
  const auth = validateApiKey(request);
  if (!auth.valid) return auth.error!;

  // Rate limit: 10 email sends per minute
  const limit_check = rateLimit(request, { maxRequests: 10, windowMs: 60_000, keyPrefix: 'email-send' });
  if (!limit_check.allowed) return limit_check.error!;

  try {
    const body = await request.json().catch(() => ({}));
    const { leadId, templatePillar } = body;
    const limit = Math.min(body.limit || 10, 50);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const crmOwnerId = process.env.CRM_OWNER_USER_ID;
    const openaiKey = process.env.OPENAI_API_KEY;
    const RESEND_API_KEY = getEnvVar('RESEND_API_KEY');
    const FROM_EMAIL = getEnvVar('RESEND_FROM_EMAIL') || 'contato@infinityondemand.com.br';

    if (!supabaseUrl || !supabaseServiceKey || !crmOwnerId) {
      return NextResponse.json({ error: 'Missing server configuration' }, { status: 500 });
    }
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: 'Resend API not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get stages or ensure "Email Enviado" exists
    const { data: stagesData } = await supabase
      .from('crm_stages')
      .select('id, name, order_index')
      .eq('user_id', crmOwnerId)
      .order('order_index', { ascending: true });

    let stages = stagesData || [];
    let emailEnviadoStage = stages.find(s => s.name.toLowerCase().includes('email enviado') || s.name.toLowerCase().includes('e-mail enviado'));

    // Create "Email Enviado" stage automatically if missing
    if (!emailEnviadoStage) {
      const maxOrder = stages.reduce((max, s) => Math.max(max, s.order_index || 0), 0);
      const { data: createdStage } = await supabase
        .from('crm_stages')
        .insert([{
          user_id: crmOwnerId,
          name: 'Email Enviado',
          color: '#ef4444',
          order_index: maxOrder + 1
        }])
        .select()
        .single();
      
      if (createdStage) {
        emailEnviadoStage = createdStage;
      }
    }

    const targetStageId = emailEnviadoStage?.id || stages.find(s => s.name === 'Primeiro Contato')?.id;

    let leads: any[] = [];

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
      const novoLeadStage = stages.find(s => s.name === 'Novo Lead');
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
        const pillarKey = templatePillar || detectSegmentPillar(lead);
        const template = SEGMENT_TEMPLATES[pillarKey] || SEGMENT_TEMPLATES.sites;

        let subject = template.subject
          .replace(/{empresa}/g, lead.name || 'sua empresa')
          .replace(/{cidade}/g, lead.city || 'sua região');
        
        let textBody = template.body
          .replace(/{empresa}/g, lead.name || 'sua empresa')
          .replace(/{cidade}/g, lead.city || 'sua região');

        // Enhance with OpenAI if available
        if (openaiKey) {
          try {
            const openai = new OpenAI({ apiKey: openaiKey });
            const completion = await openai.chat.completions.create({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: `Você é o Flash ⚡ / Artemis, especialista em Prospecção B2B da Infinity On Demand.
Gere um JSON {"subject": "...", "body": "..."} para email de prospecção focado no pilar: "${template.pillar}".
Seja direto, profissional, humanizado e com forte proposta de valor. Máximo 4 parágrafos curtos.`,
                },
                {
                  role: 'user',
                  content: `Empresa: ${lead.name}\nEmail: ${lead.email}\nCidade: ${lead.city || 'Recife'}\nNicho: ${lead.project_interest || 'Comércio/Serviços'}\nTemplate base:\n${textBody}`,
                },
              ],
              temperature: 0.7,
              max_tokens: 250,
            });

            const raw = completion.choices[0]?.message?.content || '';
            const parsed = JSON.parse(raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
            if (parsed.subject) subject = parsed.subject;
            if (parsed.body) textBody = parsed.body;
          } catch {
            // Use base template
          }
        }

        // Build HTML email
        const htmlEmail = buildProspectingEmail(lead.name, textBody, template.pillar);

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
          const now = new Date().toLocaleDateString('pt-BR');
          const updatedNotes = (lead.notes || '') + `\n\n📧 Email Marketing [${template.pillar}] enviado em ${now}:\nAssunto: "${subject}"`;

          if (targetStageId) {
            await supabase
              .from('crm_contacts')
              .update({
                stage_id: targetStageId,
                notes: updatedNotes,
              })
              .eq('id', lead.id);
          }

          sent++;
          results.push({ name: lead.name, email: lead.email, status: 'sent', message: subject });
        } else {
          failed++;
          results.push({ name: lead.name, email: lead.email, status: 'failed', message: resendData?.message || 'Resend error' });
        }

        await new Promise(resolve => setTimeout(resolve, 800));
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

function buildProspectingEmail(leadName: string, bodyText: string, pillarName: string): string {
  const bodyHtml = bodyText.replace(/\n/g, '<br>');
  
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#090d16 0%,#111827 100%);border-radius:16px 16px 0 0;padding:36px 32px;text-align:center;border-bottom:3px solid #10b981;">
      <div style="font-size:24px;font-weight:800;color:#fff;margin-bottom:6px;">
        <span style="color:#10b981;font-size:28px;margin-right:6px;">∞</span>
        <span style="color:#ffffff;letter-spacing:-0.5px;">Infinity On Demand</span>
      </div>
      <p style="color:#94a3b8;margin:0;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">${pillarName}</p>
    </div>

    <!-- Body -->
    <div style="background:#ffffff;padding:36px 32px;border-radius:0 0 16px 16px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.05);">
      <p style="color:#1e293b;font-size:15px;line-height:1.75;margin:0 0 28px;">
        ${bodyHtml}
      </p>

      <!-- CTA Button -->
      <div style="text-align:center;margin:32px 0;">
        <a href="https://infinityondemand.com.br" style="display:inline-block;background:#10b981;color:#ffffff;font-weight:700;font-size:15px;padding:14px 36px;border-radius:12px;text-decoration:none;box-shadow:0 4px 12px rgba(16,185,129,0.3);">
          Conhecer Soluções da Infinity →
        </a>
      </div>

      <div style="border-top:1px solid #f1f5f9;padding-top:20px;margin-top:28px;">
        <p style="color:#64748b;font-size:13px;margin:0;line-height:1.5;">
          <strong>Angelo Marques</strong><br>
          CEO & Fundador | Infinity On Demand<br>
          <a href="https://wa.me/5581971027939" style="color:#10b981;text-decoration:none;">(81) 97102-7939 (WhatsApp)</a>
        </p>
      </div>

      <p style="color:#94a3b8;font-size:11px;text-align:center;margin:24px 0 0;">
        Se você não deseja receber novidades sobre tecnologia para sua empresa, basta ignorar este e-mail.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px;color:#94a3b8;font-size:12px;">
      <p style="margin:0;">Infinity On Demand © ${new Date().getFullYear()} — Tecnologia, Presença Digital & IA</p>
      <p style="margin:4px 0 0;">Recife, PE • Brasil</p>
    </div>
  </div>
</body>
</html>`;
}
