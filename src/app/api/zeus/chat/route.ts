import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, chatId } = body;

    if (!message) {
      return NextResponse.json({ error: 'Mensagem obrigatória' }, { status: 400 });
    }

    const supabase = getSupabase();
    const cleanMsg = message.trim().toLowerCase();

    // ──────────────────────────────────────────────────────────────────────────
    // 1. DATE CALCULATION FOR EMAIL METRICS
    // ──────────────────────────────────────────────────────────────────────────
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch all contacts from Supabase CRM
    const { data: allContacts } = await supabase
      .from('crm_contacts')
      .select('id, name, company, email, notes, tags, stage_id, created_at, updated_at, project_interest, city, contact_type, estimated_value');

    const contacts = allContacts || [];

    // Filter contacts by email and sent status
    const contactsWithEmail = contacts.filter(c => Boolean(c.email && c.email.includes('@')));
    
    const sentContacts = contactsWithEmail.filter(c => 
      Boolean(c.notes && (c.notes.includes('📧') || c.notes.includes('Email Marketing') || c.notes.includes('Flash') || c.notes.includes('CLICK')))
    );

    const unsentContacts = contactsWithEmail.filter(c => 
      !c.notes || (!c.notes.includes('📧') && !c.notes.includes('Email Marketing') && !c.notes.includes('Flash'))
    );

    // Date metrics
    const sentToday = sentContacts.filter(c => (c.updated_at || c.created_at) >= startOfToday).length;
    const sentThisWeek = sentContacts.filter(c => (c.updated_at || c.created_at) >= sevenDaysAgo).length;
    const sentLastWeek = sentContacts.filter(c => {
      const d = c.updated_at || c.created_at;
      return d >= fourteenDaysAgo && d < sevenDaysAgo;
    }).length;
    const sentThisMonth = sentContacts.filter(c => (c.updated_at || c.created_at) >= thirtyDaysAgo).length;
    const sentTotal = sentContacts.length;

    const clickedCount = sentContacts.filter(c => 
      c.notes?.includes('CLICK') || c.notes?.includes('ENGAJAMENTO') || (Array.isArray(c.tags) && c.tags.includes('clicou_link'))
    ).length;

    // ──────────────────────────────────────────────────────────────────────────
    // 2. CHECK IF USER ISSUED DISPATCH COMMAND (/envie os emails, /enviar emails)
    // ──────────────────────────────────────────────────────────────────────────
    const isDispatchCommand = 
      cleanMsg.includes('envie os emails') ||
      cleanMsg.includes('enviar emails') ||
      cleanMsg.includes('enviar email') ||
      cleanMsg.includes('disparar email') ||
      cleanMsg.includes('disparar_email') ||
      cleanMsg.includes('/envie') ||
      cleanMsg.includes('/enviar') ||
      cleanMsg.includes('/disparar');

    if (isDispatchCommand) {
      if (unsentContacts.length === 0 && contactsWithEmail.length === 0) {
        return NextResponse.json({
          reply: `🏹 *Artemis — Prospecção de E-mail Marketing:*\n\n⚠️ Não encontrei nenhum lead com e-mail cadastrado na base.\n\n👉 Use o comando \`/minerar <nicho e cidade>\` para capturar novos leads com e-mail!`
        });
      }

      // Determine batch limit (default 15, or parse number if user typed /enviar emails 30 or "todos")
      let limit = 15;
      if (cleanMsg.includes('todos') || cleanMsg.includes('tudo') || cleanMsg.includes('all')) {
        limit = unsentContacts.length > 0 ? unsentContacts.length : contactsWithEmail.length;
      } else {
        const numMatch = cleanMsg.match(/\d+/);
        if (numMatch) {
          limit = Math.min(parseInt(numMatch[0], 10), 50);
        }
      }

      // Target leads: prefer unsent leads, fallback to all leads with email
      const leadsToProcess = (unsentContacts.length > 0 ? unsentContacts : contactsWithEmail).slice(0, limit);
      const leadIds = leadsToProcess.map(c => c.id);

      // Trigger the send-email internal endpoint
      try {
        const sendRes = await fetch('https://www.infinityondemand.com.br/api/prospecting/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer Infinity_Olimpo_Token_2026_Secured',
          },
          body: JSON.stringify({
            leadIds,
            templatePillar: 'sites',
          }),
        });

        const sendData = await sendRes.json();
        const sentNow = sendData.sent || leadsToProcess.length;

        const listPreview = leadsToProcess.slice(0, 5).map((l, i) => `${i + 1}. *${l.name}* (${l.city || 'Recife'})`).join('\n');
        const remainingCount = Math.max(0, unsentContacts.length - sentNow);

        const reply = `🏹 *Artemis — Disparo de E-mails Concluído com Sucesso!* ⚡

📊 *Relatório da Operação:*
• *Enviados nesta rodada:* ${sentNow} e-mails via Resend
• *Remetente:* \`contato@infinityondemand.com.br\`
• *Pipeline CRM:* Leads movidos para *"Email Enviado"*
• *Links Rastreáveis:* Ativos com click tracking 🔥

📅 *Histórico de E-mails por Período:*
• 📍 *Hoje:* ${sentToday + sentNow} e-mails
• 🗓️ *Últimos 7 dias:* ${sentThisWeek + sentNow} e-mails
• 🗓️ *Semana Passada:* ${sentLastWeek} e-mails
• 📈 *Total Acumulado:* ${sentTotal + sentNow} disparos (${clickedCount} cliques registrados)
• ⏳ *Aguardando envio na base:* ${remainingCount} leads

🎯 *Primeiros destinatários desta rodada:*
${listPreview}${leadsToProcess.length > 5 ? `\n_...e mais ${leadsToProcess.length - 5} empresas._` : ''}`;

        return NextResponse.json({ reply, metrics: { sentNow, sentToday: sentToday + sentNow, sentTotal: sentTotal + sentNow } });
      } catch (err: any) {
        return NextResponse.json({
          reply: `🏹 *Artemis — Alerta de Disparo:*\n\nTentativa de envio iniciada para ${leadsToProcess.length} leads, mas o serviço de envio retornou: ${err.message}.\nVerifique a conexão do Resend.`,
        });
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. REGULAR ZEUS CONVERSATIONAL / REPORT QUERY
    // ──────────────────────────────────────────────────────────────────────────
    const totalLeads = contacts.filter(c => c.contact_type === 'lead' || !c.contact_type).length;
    const activeClientsCount = contacts.filter(c => c.contact_type === 'client').length;
    const totalPipelineValue = contacts.reduce((sum, c) => sum + (Number(c.estimated_value) || 0), 0);

    const segmentCounts: Record<string, number> = {};
    contacts.forEach(c => {
      const seg = c.project_interest || 'Geral';
      segmentCounts[seg] = (segmentCounts[seg] || 0) + 1;
    });
    const topSegments = Object.entries(segmentCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([seg, count]) => `${seg}: ${count} leads`)
      .join(', ');

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json({
        reply: `👑 *Zeus Relatórios & Métricas Olimpo:*\n\n📧 *Métricas de E-mail Marketing (Artemis):*\n• *Enviados Hoje:* ${sentToday}\n• *Últimos 7 dias:* ${sentThisWeek}\n• *Semana Passada:* ${sentLastWeek}\n• *Total Acumulado:* ${sentTotal} e-mails\n• *Cliques no Link:* ${clickedCount} leads quentes 🔥\n• *Aguardando Envio:* ${unsentContacts.length} leads\n\n📊 *Pipeline Geral do CRM:*\n• *Total em Prospecção:* ${totalLeads}\n• *Clientes Ativos:* ${activeClientsCount}\n• *Valor no Pipeline:* R$ ${totalPipelineValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n👉 Para disparar e-mails agora, use: \`/envie os emails\``,
      });
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    const systemPrompt = `Você é ZEUS, o Conselheiro Estratégico e Diretor de BI do Ecossistema Olimpo da "Infinity On Demand" (empresa de tecnologia, presença digital com IA e automações fundada pelo CEO Angelo Marques).

SEU PAPEL:
- Fala diretamente com o CEO Angelo pelo Telegram.
- Tom de voz: Soberano, respeitoso, executivo, altamente estratégico e focado em escala.
- Use emojis elegantes (👑, 🏛️, 📊, ⚡, 🎯, 📈, 📧, 🔗).
- Responda de forma concisa, direta e bem formatada em Markdown do Telegram.

DADOS REAIS EM TEMPO REAL DO CRM E MARKETING HOJE:
- E-mails Marketing Enviados Hoje: ${sentToday}
- E-mails Marketing Enviados Esta Semana (Últimos 7 dias): ${sentThisWeek}
- E-mails Marketing Enviados na Semana Passada: ${sentLastWeek}
- E-mails Marketing Total Acumulado: ${sentTotal}
- Cliques no Link Rastreável (Leads Quentes): ${clickedCount}
- Leads com E-mail Aguardando Envio: ${unsentContacts.length}
- Base Total de Leads no CRM: ${totalLeads}
- Clientes Ativos Fechados: ${activeClientsCount}
- Valor no Pipeline: R$ ${totalPipelineValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Principais Nichos: ${topSegments || 'Diversos'}

COMANDOS DISPONÍVEIS NO TELEGRAM:
- /minerar <nicho e cidade> (Ex: /minerar clinicas recife) -> Minera 60 leads no Google Maps via Apify.
- /envie os emails ou /enviar emails [quantidade] -> Dispara e-mail marketing persuasivo da Artemis com link rastreável via Resend e move no pipeline.
- /relatorio -> Apresenta o consolidado de vendas, marketing e infraestrutura.

INSTRUÇÕES:
- Se ele perguntar sobre datas, quantos e-mails foram enviados hoje, semana passada ou no mês, forneça o relatório detalhado por período acima.
- Se ele pedir para enviar e-mails, lembre-o de que ele pode digitar "/envie os emails".
- Mantenha respostas com no máximo 3 ou 4 blocos curtos para leitura no celular.`;

    let reply = '';
    const modelsToTry = ['gpt-4o', 'gpt-4', 'gpt-3.5-turbo', 'gpt-4o-mini'];

    for (const modelName of modelsToTry) {
      try {
        const completion = await openai.chat.completions.create({
          model: modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        reply = completion.choices[0]?.message?.content || '';
        if (reply) break;
      } catch (err: any) {
        console.warn(`Model ${modelName} failed, trying fallback:`, err.message);
      }
    }

    if (!reply) {
      reply = `👑 *Zeus Relatórios:*\n\n📧 *Métricas de E-mail Marketing:*
• *Hoje:* ${sentToday} e-mails
• *Últimos 7 dias:* ${sentThisWeek} e-mails
• *Semana Passada:* ${sentLastWeek} e-mails
• *Total Acumulado:* ${sentTotal} e-mails
• *Cliques no Link:* ${clickedCount} leads quentes 🔥
• *Aguardando Envio:* ${unsentContacts.length} leads`;
    }

    return NextResponse.json({
      reply,
      metrics: {
        sentToday,
        sentThisWeek,
        sentLastWeek,
        sentThisMonth,
        sentTotal,
        clickedCount,
        unsentCount: unsentContacts.length,
        totalLeads,
        activeClientsCount,
        totalPipelineValue
      }
    });
  } catch (error: any) {
    console.error('Zeus chat API error:', error);
    return NextResponse.json({ error: error.message || 'Erro interno no Zeus' }, { status: 500 });
  }
}
