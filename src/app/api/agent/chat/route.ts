import { NextRequest } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';
import OpenAI from 'openai';

export const runtime = 'nodejs';

// Build system prompt with business context
function buildSystemPrompt(settings: Record<string, unknown>): string {
  return `Você é o **Flash** ⚡ — um especialista em marketing digital, campanhas para Instagram e estratégias de tráfego pago. Você trabalha para a agência Infinity On Demand. Você é rápido, direto e eficiente — como o Flash.

## SEU PAPEL
- Criar campanhas de marketing otimizadas
- Analisar concorrentes e sugerir melhorias
- Gerar copies, legendas e ideias de conteúdo
- Recomendar estratégias de tráfego pago
- Questionar o cliente para entender melhor o negócio

## CONTEXTO DO CLIENTE
- **Negócio**: ${settings.business_name || '(não informado)'}
- **Segmento**: ${settings.business_segment || '(não informado)'}
- **Descrição**: ${settings.business_description || '(não informado)'}
- **Público-alvo**: ${settings.target_audience || '(não informado)'}
- **Tom da marca**: ${settings.brand_tone || 'profissional e acessível'}
- **Concorrentes**: ${(settings.competitors as string[])?.join(', ') || '(nenhum cadastrado)'}

## REGRAS
1. Sempre responda em português brasileiro
2. Seja proativo: sugira melhorias, questione estratégias fracas
3. Use dados reais quando disponíveis
4. Formate respostas com markdown (negrito, listas, emojis)
5. Quando criar campanhas, inclua: objetivo, público, copy, formato, CTA, orçamento estimado
6. Se o contexto do cliente estiver vazio, PERGUNTE sobre o negócio antes de sugerir campanhas
7. Simule um consultor humano: seja direto, use opinião, tenha personalidade
8. Use emojis com moderação para dar vida às respostas`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, clientId = 'default' } = body;
    const supabase = getServerSupabase();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Load client settings
    const { data: settings } = await supabase
      .from('agent_settings')
      .select('*')
      .eq('client_id', clientId)
      .single();

    const apiKey = settings?.openai_api_key || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API Key não configurada. Vá em ⚙️ Configurações para adicionar.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const openai = new OpenAI({ apiKey });

    const systemPrompt = buildSystemPrompt(settings || {});

    // Stream response
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Create a ReadableStream that forwards the OpenAI stream
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: (err as Error).message })}\n\n`));
          controller.close();
        }
      },
    });

    // Save user message to history (non-blocking)
    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg?.role === 'user') {
      supabase.from('agent_conversations').insert({
        client_id: clientId,
        role: 'user',
        content: lastUserMsg.content,
      }).then(() => {});
    }

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
