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

// 4 High-Conversion Segment Templates with Low-Friction Persuasive Hooks
export const SEGMENT_TEMPLATES: Record<string, { subject: string; body: string; pillar: string; ctaText: string }> = {
  sites: {
    pillar: 'Sites & Presença Digital',
    ctaText: 'Quero meu diagnóstico gratuito →',
    subject: '{empresa}, 3 ajustes no site que trariam mais {resultado}',
    body: `Olá! Dei uma olhada na presença digital da {empresa} e vi que uns ajustes simples no site já poderiam converter mais visitantes em {resultado} — sem precisar gastar mais em anúncio.

Na Infinity On Demand a gente cria sites e landing pages de alta velocidade, com IA integrada, feitos pra transformar quem procura {segmento} na região de vocês em cliente de verdade.

Posso te mandar um diagnóstico visual gratuito de 5 minutos apontando 3 pontos de melhoria no site de vocês. Quer que eu envie?`
  },
  sistemas: {
    pillar: 'Sistemas & Automações com IA',
    ctaText: 'Ver demonstração da IA →',
    subject: '{empresa}, como atender clientes no WhatsApp 24h sem aumentar equipe',
    body: `Olá equipe do {empresa}!

Notei que o fluxo de atendimento de vocês pode se beneficiar muito de um agente inteligente com IA. Desenvolvemos robôs sob medida que atendem no WhatsApp 24 horas por dia, agendam {resultado} e tiram dúvidas em tempo real sem fila de espera.

Posso liberar um link de demonstração interativa de 3 minutos para vocês testarem na prática?`
  },
  ecommerce: {
    pillar: 'E-commerce & Lojas Virtuais',
    ctaText: 'Conhecer catálogo inteligente →',
    subject: '{empresa}, como vender online com catálogo direto no WhatsApp',
    body: `Olá! Acompanho o trabalho da {empresa} e vi que vocês têm excelentes produtos.

Estruturamos catálogos digitais e lojas virtuais com checkout transparente e envio automático para o WhatsApp, permitindo gerar mais {resultado} sem depender de taxas abusivas de terceiros.

Posso te mandar uma prévia de como ficaria a vitrine online de vocês?`
  },
  trafego: {
    pillar: 'Tráfego Pago & Performance',
    ctaText: 'Solicitar estimativa de alcance →',
    subject: '{empresa}, estimativa de novos clientes para este mês em {cidade}',
    body: `Olá! Tudo bem?

Fizemos um levantamento rápido de mercado na região de {cidade} e mapeamos centenas de pessoas buscando diariamente por {segmento}.

Com campanhas estratégicas de Google e Meta Ads, conseguimos direcionar essas pessoas prontas para comprar direto para o WhatsApp da {empresa}.

Gostaria de ver nossa estimativa gratuita de alcance e novos contatos para este mês?`
  }
};

function detectSegmentAndResult(lead: any) {
  const text = `${lead.name || ''} ${lead.company || ''} ${lead.project_interest || ''} ${lead.notes || ''}`.toLowerCase();
  
  if (text.includes('clinica') || text.includes('estetica') || text.includes('odonto') || text.includes('dermato') || text.includes('botox') || text.includes('harmonizacao') || text.includes('saude')) {
    return { segmento: 'serviços de estética e saúde', resultado: 'pacientes agendados' };
  }
  if (text.includes('advoc') || text.includes('jurid') || text.includes('direito') || text.includes('contabil')) {
    return { segmento: 'serviços jurídicos e consultivos', resultado: 'novos contratos' };
  }
  if (text.includes('loja') || text.includes('moda') || text.includes('roupa') || text.includes('calcado') || text.includes('biquini') || text.includes('ecommerce') || text.includes('vestuario')) {
    return { segmento: 'moda e vestuário', resultado: 'vendas diretas' };
  }
  if (text.includes('burger') || text.includes('pizza') || text.includes('restaurante') || text.includes('sushi') || text.includes('delivery') || text.includes('lanche')) {
    return { segmento: 'gastronomia e delivery', resultado: 'pedidos diretos' };
  }
  if (text.includes('imobiliaria') || text.includes('corretor') || text.includes('imoveis')) {
    return { segmento: 'imóveis e locação', resultado: 'visitas e propostas' };
  }
  return { segmento: 'seus serviços', resultado: 'clientes qualificados' };
}

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

  try {
    const body = await request.json().catch(() => ({}));
    const { leadId, leadIds, templatePillar, customSubject, customBody, customCtaText, destinationUrl } = body;
    const limit = Math.min(body.limit || 15, 50);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const crmOwnerId = process.env.CRM_OWNER_USER_ID;
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
    let emailSentStage = stages.find(s => s.name.toLowerCase().includes('email enviado') || s.name.toLowerCase().includes('contato feito'));

    if (!emailSentStage && stages.length > 1) {
      emailSentStage = stages[1];
    }

    // Fetch leads to send
    let leadsQuery = supabase
      .from('crm_contacts')
      .select('id, name, company, email, phone, city, notes, tags, project_interest, created_at, stage_id');

    if (leadId) {
      leadsQuery = leadsQuery.eq('id', leadId);
    } else if (Array.isArray(leadIds) && leadIds.length > 0) {
      leadsQuery = leadsQuery.in('id', leadIds);
    } else {
      leadsQuery = leadsQuery.limit(limit);
    }

    const { data: rawLeads, error: leadsErr } = await leadsQuery;
    if (leadsErr || !rawLeads || rawLeads.length === 0) {
      return NextResponse.json({ sent: 0, message: 'Nenhum lead encontrado' });
    }

    // Filter valid emails
    const leads = rawLeads.filter(l => Boolean(l.email && l.email.includes('@') && l.email.trim().length > 3));
    if (leads.length === 0) {
      return NextResponse.json({ sent: 0, message: 'Nenhum lead com email válido' });
    }

    // Process all leads in parallel for instant sub-second dispatch
    const results = await Promise.allSettled(
      leads.map(async (lead) => {
        const pillarKey = templatePillar || detectSegmentPillar(lead);
        const template = SEGMENT_TEMPLATES[pillarKey] || SEGMENT_TEMPLATES.sites;
        const { segmento, resultado } = detectSegmentAndResult(lead);

        const subject = (customSubject || template.subject)
          .replace(/{empresa}/g, lead.name || 'sua empresa')
          .replace(/{cidade}/g, lead.city || 'sua região')
          .replace(/{segmento}/g, segmento)
          .replace(/{resultado}/g, resultado);
        
        const textBody = (customBody || template.body)
          .replace(/{empresa}/g, lead.name || 'sua empresa')
          .replace(/{cidade}/g, lead.city || 'sua região')
          .replace(/{segmento}/g, segmento)
          .replace(/{resultado}/g, resultado);

        const emailCta = customCtaText || template.ctaText || 'Conhecer Soluções da Infinity →';
        const htmlEmail = buildProspectingEmail(lead.name, textBody, template.pillar, emailCta, destinationUrl || 'https://infinityondemand.com.br', lead.id);

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
          }),
        });

        if (!resendRes.ok) {
          const errText = await resendRes.text();
          throw new Error(`Resend error: ${errText}`);
        }

        const resendData = await resendRes.json();

        // Update contact notes and stage in Supabase
        const currentNotes = lead.notes || '';
        const timestamp = new Date().toLocaleString('pt-BR');
        const updatedNotes = `${currentNotes}\n\n📧 [Email Marketing Enviado] via Resend em ${timestamp} (${template.pillar}) - ID: ${resendData.id}`.trim();
        
        const updatePayload: any = {
          notes: updatedNotes,
          updated_at: new Date().toISOString(),
        };

        if (emailSentStage) {
          updatePayload.stage_id = emailSentStage.id;
        }

        await supabase.from('crm_contacts').update(updatePayload).eq('id', lead.id);

        return {
          leadId: lead.id,
          name: lead.name,
          email: lead.email,
          resendId: resendData.id,
        };
      })
    );

    const sentLeads = results.filter(r => r.status === 'fulfilled').map((r: any) => r.value);
    const failedLeads = results.filter(r => r.status === 'rejected').map((r: any) => r.reason?.message);

    return NextResponse.json({
      sent: sentLeads.length,
      failed: failedLeads.length,
      details: sentLeads,
    });
  } catch (error: any) {
    console.error('Send email error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function buildProspectingEmail(name: string, bodyText: string, pillar: string, ctaText: string, destinationUrl: string, leadId: string): string {
  const trackedUrl = `https://www.infinityondemand.com.br/api/track/click?lid=${leadId}&c=${encodeURIComponent(pillar)}&u=${encodeURIComponent(destinationUrl)}`;
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Infinity On Demand</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #111827; border-radius: 16px; border: 1px solid #1f2937; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 36px 24px; border-bottom: 2px solid #10b981;">
              <div style="font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                <span style="color: #10b981; font-size: 30px; margin-right: 6px;">∞</span>
                <span style="color: #ffffff;">Infinity</span> <span style="color: #94a3b8; font-weight: 400;">On Demand</span>
              </div>
              <p style="color: #10b981; margin: 8px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">
                ${pillar}
              </p>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px; color: #e2e8f0; font-size: 15px; line-height: 1.75;">
              <div style="white-space: pre-line; margin-bottom: 32px;">
                ${bodyText}
              </div>
              <!-- CTA Button with Click Tracking -->
              <div style="text-align: center; margin: 36px 0;">
                <a href="${trackedUrl}" target="_blank" style="display: inline-block; background-color: #10b981; color: #ffffff; font-weight: 700; font-size: 14px; padding: 14px 34px; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
                  ${ctaText}
                </a>
              </div>
              <!-- Signature -->
              <div style="border-top: 1px solid #1f2937; padding-top: 24px; margin-top: 32px;">
                <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.5;">
                  <strong style="color: #ffffff; font-size: 14px;">Angelo Marques</strong><br />
                  CEO & Fundador | Infinity On Demand<br />
                  <span style="color: #10b981;">(81) 97102-7939 (WhatsApp)</span>
                </p>
              </div>
              <p style="color: #64748b; font-size: 11px; text-align: center; margin: 28px 0 0;">
                Se não deseja mais receber nossos insights sobre tecnologia, responda "parar".
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 20px; background-color: #090d16; color: #64748b; font-size: 11px; border-top: 1px solid #1f2937;">
              <p style="margin: 0;">Infinity On Demand © ${currentYear} — Tecnologia, Presença Digital & IA</p>
              <p style="margin: 4px 0 0;">Recife, PE • Brasil</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
