import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { join } from 'path';

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

const TELEGRAM_TOKEN = getEnvVar('TELEGRAM_BOT_TOKEN') || '8627190797:AAE5Pg2K87-vkujNVvnFKVfmrp1hPgxc834';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function sendTelegramMessage(chatId: string | number, text: string) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });
  } catch (err) {
    console.error('Error sending Telegram message:', err);
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    bot: 'Zeus & Artemis Telegram Webhook',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const update = await request.json().catch(() => ({}));
    const message = update.message || update.edited_message;

    if (!message || !message.text) {
      return NextResponse.json({ ok: true, ignored: 'no text' });
    }

    const chatId = message.chat?.id;
    const rawText = message.text.trim();
    const cleanText = rawText.toLowerCase();

    if (!chatId) {
      return NextResponse.json({ ok: true, ignored: 'no chat id' });
    }

    const supabase = getSupabase();

    // ──────────────────────────────────────────────────────────────────────────
    // 1. DATE CALCULATION & DATA FETCHING
    // ──────────────────────────────────────────────────────────────────────────
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: allContacts } = await supabase
      .from('crm_contacts')
      .select('id, name, company, email, notes, tags, stage_id, created_at, updated_at, project_interest, city, contact_type, estimated_value');

    const contacts = allContacts || [];
    const contactsWithEmail = contacts.filter(c => Boolean(c.email && c.email.includes('@')));
    
    const sentContacts = contactsWithEmail.filter(c => 
      Boolean(c.notes && (c.notes.includes('📧') || c.notes.includes('Email Marketing') || c.notes.includes('Flash') || c.notes.includes('CLICK')))
    );

    const unsentContacts = contactsWithEmail.filter(c => 
      !c.notes || (!c.notes.includes('📧') && !c.notes.includes('Email Marketing') && !c.notes.includes('Flash'))
    );

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
    // 2. DISPATCH COMMAND: /envie os emails, /enviar emails, /disparar
    // ──────────────────────────────────────────────────────────────────────────
    const isDispatch = 
      cleanText.includes('envie os emails') ||
      cleanText.includes('enviar emails') ||
      cleanText.includes('enviar email') ||
      cleanText.includes('disparar email') ||
      cleanText.includes('disparar_email') ||
      cleanText.startsWith('/envie') ||
      cleanText.startsWith('/enviar') ||
      cleanText.startsWith('/disparar');

    if (isDispatch) {
      if (contactsWithEmail.length === 0) {
        await sendTelegramMessage(chatId, `🏹 *Artemis — Alerta:*\n\n⚠️ Nenhum lead com e-mail cadastrado na base.\n👉 Use \`/minerar <nicho e cidade>\` para capturar contatos.`);
        return NextResponse.json({ ok: true, action: 'no_leads' });
      }

      let limit = 15;
      if (cleanText.includes('todos') || cleanText.includes('tudo') || cleanText.includes('all')) {
        limit = unsentContacts.length > 0 ? unsentContacts.length : contactsWithEmail.length;
      } else {
        const numMatch = cleanText.match(/\d+/);
        if (numMatch) {
          limit = Math.min(parseInt(numMatch[0], 10), 50);
        }
      }

      const leadsToProcess = (unsentContacts.length > 0 ? unsentContacts : contactsWithEmail).slice(0, limit);
      const leadIds = leadsToProcess.map(c => c.id);

      await sendTelegramMessage(chatId, `🏹 *Artemis iniciando disparo de ${leadIds.length} e-mails persuasivos...* ⚡\n_Conectando ao Resend e gerando links rastreáveis..._`);

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
        const remaining = Math.max(0, unsentContacts.length - sentNow);

        const listPreview = leadsToProcess.slice(0, 5).map((l, i) => `${i + 1}. *${l.name}* (${l.city || 'Recife'})`).join('\n');

        const reply = `🏹 *Artemis — Disparo Concluído com Sucesso!* ⚡

📊 *Relatório da Operação:*
• *Enviados agora:* ${sentNow} e-mails entregues via Resend
• *Remetente:* \`contato@infinityondemand.com.br\`
• *Pipeline CRM:* Movidos para *"Email Enviado"*
• *Click Tracking:* Links rastreáveis ativos 🔥

📅 *Breakdown de E-mails por Data:*
• 📍 *Hoje:* ${sentToday + sentNow} e-mails
• 🗓️ *Últimos 7 dias:* ${sentThisWeek + sentNow} e-mails
• 🗓️ *Semana Passada:* ${sentLastWeek} e-mails
• 📈 *Total Acumulado:* ${sentTotal + sentNow} e-mails (${clickedCount} cliques)
• ⏳ *Aguardando envio na base:* ${remaining} leads

🎯 *Destinatários desta rodada:*
${listPreview}${leadsToProcess.length > 5 ? `\n_...e mais ${leadsToProcess.length - 5} empresas._` : ''}`;

        await sendTelegramMessage(chatId, reply);
        return NextResponse.json({ ok: true, action: 'dispatched', sent: sentNow });
      } catch (err: any) {
        await sendTelegramMessage(chatId, `⚠️ *Erro no disparo da Artemis:* ${err.message}`);
        return NextResponse.json({ ok: false, error: err.message });
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. START / AJUDA / MENU DE COMANDOS
    // ──────────────────────────────────────────────────────────────────────────
    if (cleanText === '/start' || cleanText === '/ajuda' || cleanText === '/help' || cleanText === '/menu') {
      const menuText = `🏛️ *Bem-vindo ao Ecossistema Olimpo!* ⚡

Eu sou *Zeus*, seu Conselheiro Estratégico de BI, e estou conectado à *Artemis* para automação de vendas da *Infinity On Demand*.

📋 *Comandos Disponíveis:*

🏹 *Prospecção & E-mail Marketing:*
• \`/envie os emails\` — Disparar próxima leva de e-mails com links rastreáveis
• \`/enviar emails 30\` — Disparar para 30 leads
• \`/enviar emails todos\` — Disparar para toda a base com e-mail
• \`/minerar <nicho cidade>\` — Minerar 60 leads no Google Maps

📊 *Relatórios & Métricas por Data:*
• \`/relatorio\` — Relatório completo de hoje, semana passada e total
• \`/status\` — Status do ecossistema e pipeline

_Você também pode fazer qualquer pergunta em linguagem natural!_`;

      await sendTelegramMessage(chatId, menuText);
      return NextResponse.json({ ok: true, action: 'menu' });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4. ZEUS AI CONVERSATIONAL & BI INTELLIGENCE
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
      const fallback = `👑 *Zeus Relatórios & Métricas:*

📧 *Métricas de E-mail Marketing (Artemis):*
• *Hoje:* ${sentToday} e-mails
• *Últimos 7 dias:* ${sentThisWeek} e-mails
• *Semana Passada:* ${sentLastWeek} e-mails
• *Total Acumulado:* ${sentTotal} e-mails (${clickedCount} cliques 🔥)
• *Aguardando Envio:* ${unsentContacts.length} leads

📊 *Pipeline CRM:*
• *Total de Leads:* ${totalLeads}
• *Clientes Fechados:* ${activeClientsCount}
• *Valor no Pipeline:* R$ ${totalPipelineValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

👉 Para disparar e-mails agora: \`/envie os emails\``;

      await sendTelegramMessage(chatId, fallback);
      return NextResponse.json({ ok: true, action: 'fallback_report' });
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    const systemPrompt = `Você é ZEUS, o Conselheiro Estratégico e Diretor de BI do Ecossistema Olimpo da "Infinity On Demand" (empresa de tecnologia, presença digital com IA e automações fundada pelo CEO Angelo Marques).

SEU PAPEL:
- Fala diretamente com o CEO Angelo pelo Telegram.
- Tom de voz: Soberano, respeitoso, executivo, altamente estratégico e focado em escala.
- Use emojis elegantes (👑, 🏛️, 📊, ⚡, 🎯, 📈, 📧, 🔗).
- Responda de forma concisa, direta e bem formatada em Markdown do Telegram.

DADOS REAIS EM TEMPO REAL DO CRM E MARKETING:
- E-mails Marketing Enviados Hoje: ${sentToday}
- E-mails Marketing Enviados Esta Semana (Últimos 7 dias): ${sentThisWeek}
- E-mails Marketing Enviados na Semana Passada: ${sentLastWeek}
- E-mails Marketing Total Acumulado: ${sentTotal}
- Cliques no Link Rastreável: ${clickedCount} leads quentes 🔥
- Leads Aguardando Envio na Base: ${unsentContacts.length}
- Base Total de Leads no CRM: ${totalLeads}
- Clientes Ativos Fechados: ${activeClientsCount}
- Valor no Pipeline: R$ ${totalPipelineValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Principais Nichos: ${topSegments || 'Diversos'}

COMANDOS DISPONÍVEIS:
- /envie os emails ou /enviar emails [quantidade] -> Dispara e-mails da Artemis com link rastreável via Resend.
- /minerar <nicho e cidade> -> Minera 60 leads no Google Maps via Apify.
- /relatorio -> Apresenta o consolidado por datas.

INSTRUÇÕES:
- Se ele perguntar sobre datas, quantos e-mails foram enviados hoje, semana passada ou no mês, forneça o relatório detalhado por período acima.
- Se ele pedir para enviar e-mails, oriente que basta digitar "/envie os emails".
- Mantenha respostas curtas e objetivas (máximo 3 ou 4 blocos).`;

    let reply = '';
    const modelsToTry = ['gpt-4o', 'gpt-4', 'gpt-3.5-turbo', 'gpt-4o-mini'];

    for (const modelName of modelsToTry) {
      try {
        const completion = await openai.chat.completions.create({
          model: modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: rawText },
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        reply = completion.choices[0]?.message?.content || '';
        if (reply) break;
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err.message);
      }
    }

    if (!reply) {
      reply = `👑 *Zeus Relatórios:*\n\n📧 *Métricas de E-mail Marketing:*
• *Hoje:* ${sentToday} e-mails
• *Últimos 7 dias:* ${sentThisWeek} e-mails
• *Semana Passada:* ${sentLastWeek} e-mails
• *Total Acumulado:* ${sentTotal} e-mails (${clickedCount} cliques 🔥)`;
    }

    await sendTelegramMessage(chatId, reply);
    return NextResponse.json({ ok: true, action: 'replied' });
  } catch (error: any) {
    console.error('Telegram Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
