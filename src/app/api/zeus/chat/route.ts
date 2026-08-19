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

    // 1. Fetch live metrics from Supabase CRM
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [contactsResult, todayContactsResult, clientsResult] = await Promise.all([
      supabase.from('crm_contacts').select('id, estimated_value, project_interest, city, contact_type, created_at'),
      supabase.from('crm_contacts').select('id, name, project_interest, city').gte('created_at', today.toISOString()),
      supabase.from('crm_contacts').select('id').eq('contact_type', 'client'),
    ]);

    const allContacts = contactsResult.data || [];
    const todayContacts = todayContactsResult.data || [];
    const activeClients = clientsResult.data || [];

    const totalLeads = allContacts.filter(c => c.contact_type === 'lead' || !c.contact_type).length;
    const minedTodayCount = todayContacts.length;
    const activeClientsCount = activeClients.length;
    const totalPipelineValue = allContacts.reduce((sum, c) => sum + (Number(c.estimated_value) || 0), 0);

    // Calculate top segments
    const segmentCounts: Record<string, number> = {};
    allContacts.forEach(c => {
      const seg = c.project_interest || 'Geral';
      segmentCounts[seg] = (segmentCounts[seg] || 0) + 1;
    });
    const topSegments = Object.entries(segmentCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([seg, count]) => `${seg}: ${count} leads`)
      .join(', ');

    // 2. Initialize OpenAI
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json({
        reply: `👑 *Zeus Relatórios:*\n\n📊 *Métricas Atuais do Ecossistema Olimpo:*\n• *Leads minerados hoje:* ${minedTodayCount}\n• *Total em Prospecção:* ${totalLeads}\n• *Clientes Ativos:* ${activeClientsCount}\n• *Valor no Pipeline:* R$ ${totalPipelineValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n• *Principais Nichos:* ${topSegments || 'Diversos'}\n\n_Para habilitar respostas com IA conversacional, configure a OPENAI_API_KEY no .env._`,
      });
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    const systemPrompt = `Você é ZEUS, o Conselheiro Estratégico e Diretor de BI do Ecossistema Olimpo da "Infinity On Demand" (empresa de tecnologia, presença digital com IA e automações para negócios locais fundada pelo CEO Angelo Marques).

SEU PAPEL:
- Você é a mente estratégica e analítica do ecossistema Olimpo.
- Fala diretamente com o CEO Angelo pelo Telegram.
- Tom de voz: Soberano, respeitoso, executivo, altamente estratégico e focado em metas de faturamento e escala.
- Use emojis elegantes (👑, 🏛️, 📊, ⚡, 🎯, 📈).
- Responda de forma concisa, direta e bem formatada em Markdown do Telegram.

DADOS REAIS EM TEMPO REAL DO CRM DA INFINITY ON DEMAND HOJE:
- Leads Minerados Hoje: ${minedTodayCount}
- Total de Leads em Prospecção: ${totalLeads}
- Total de Clientes Ativos Fechados: ${activeClientsCount}
- Valor Total Estimado no Pipeline: R$ ${totalPipelineValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Principais Nichos Minerados na Base: ${topSegments || 'Diversos'}
- Agente de Prospecção Parceira: Artemis (responsável pelas abordagens ativas no WhatsApp via Evolution API e mineração no Apify).

INSTRUÇÕES DE RESPOSTA:
- Responda à dúvida ou pergunta do CEO Angelo com base nos dados reais acima.
- Se ele perguntar sobre quantos leads foram minerados hoje, informe os ${minedTodayCount} leads minerados hoje e o total acumulado.
- Se ele pedir conselhos de prospecção ou nichos, recomende nichos de alto ticket (Clínicas Odontológicas, Harmonização/Estética, Escritórios de Advocacia, Hamburguerias/Restaurantes, Imobiliárias).
- Mantenha respostas com no máximo 3 ou 4 parágrafos curtos para leitura rápida no celular.`;

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
      reply = `👑 *Zeus Relatórios:*\n\n📊 *Métricas Atuais do Ecossistema Olimpo:*\n• *Leads minerados hoje:* ${minedTodayCount}\n• *Total em Prospecção:* ${totalLeads}\n• *Clientes Ativos:* ${activeClientsCount}\n• *Valor no Pipeline:* R$ ${totalPipelineValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n• *Principais Nichos:* ${topSegments || 'Diversos'}`;
    }

    return NextResponse.json({ reply, metrics: { minedTodayCount, totalLeads, activeClientsCount, totalPipelineValue } });
  } catch (error: any) {
    console.error('Zeus chat API error:', error);
    return NextResponse.json({ error: error.message || 'Erro interno no Zeus' }, { status: 500 });
  }
}
