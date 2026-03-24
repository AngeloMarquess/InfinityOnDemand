import { NextResponse } from 'next/server';
import OpenAI from 'openai';

function cors() {
  return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: cors() });
}

export async function POST(request: Request) {
  try {
    const { action, topic, content, title } = await request.json();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    if (action === 'generate-draft') {
      // Generate a full blog post draft
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Você é um redator de blog especialista em tecnologia, e-commerce, delivery e marketing digital para a empresa Infinity OnDemand — uma consultoria de tecnologia brasileira. 

Escreva artigos em português do Brasil, com tom profissional mas acessível. Use formatação HTML para o conteúdo (h2, h3, p, ul, li, strong, em, blockquote). 

O artigo deve ter:
- Título chamativo e SEO-friendly
- Introdução envolvente
- 3-5 seções com subtítulos (h2)
- Parágrafos bem estruturados
- Listas quando apropriado
- Conclusão com call-to-action
- 800-1500 palavras

Retorne um JSON com: { "title", "slug", "excerpt" (2 frases), "content" (HTML), "meta_title" (até 60 chars), "meta_description" (até 160 chars), "tags" (array de 3-5 tags), "suggested_category" (uma de: ia-machine-learning, ecommerce, delivery-saas, marketing-digital, tecnologia, negocios) }`
          },
          { role: 'user', content: `Escreva um artigo completo sobre: ${topic}` }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      const text = response.choices[0].message.content || '';
      try {
        // Try to parse as JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json(parsed, { headers: cors() });
        }
      } catch {
        // If not JSON, return raw content
      }
      return NextResponse.json({ content: text, title: topic }, { headers: cors() });

    } else if (action === 'improve-seo') {
      // Improve SEO meta tags
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em SEO. Analise o conteúdo do blog post e retorne um JSON com: { "meta_title" (máx 60 chars, incluir keyword principal), "meta_description" (máx 160 chars, persuasivo), "tags" (array de 5 tags relevantes), "slug" (URL-friendly) }'
          },
          { role: 'user', content: `Título: ${title}\n\nConteúdo: ${content?.substring(0, 2000)}` }
        ],
        temperature: 0.3,
      });

      const text = response.choices[0].message.content || '';
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return NextResponse.json(JSON.parse(jsonMatch[0]), { headers: cors() });
      } catch { /* continue */ }
      return NextResponse.json({ meta_title: title, meta_description: '' }, { headers: cors() });

    } else if (action === 'generate-excerpt') {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Gere um resumo/excerpt de 2 frases (máximo 200 caracteres) para o blog post. Retorne apenas o texto, sem aspas.' },
          { role: 'user', content: `Título: ${title}\n\nConteúdo: ${content?.substring(0, 2000)}` }
        ],
        temperature: 0.5,
        max_tokens: 100,
      });

      return NextResponse.json({ excerpt: response.choices[0].message.content?.trim() }, { headers: cors() });

    } else if (action === 'generate-image') {
      // Generate cover image with DALL-E
      const prompt = topic || `Blog post cover image about: ${title}. Style: futuristic, dark background (#0B0F19), neon green (#00DF81) and blue (#00AAFF) accents, tech/digital aesthetic, clean and modern. No text in the image.`;

      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1792x1024',
        quality: 'hd',
      });

      const imageUrl = response.data?.[0]?.url || null;
      return NextResponse.json({ image_url: imageUrl }, { headers: cors() });
    }

    return NextResponse.json({ error: 'Ação inválida. Use: generate-draft, improve-seo, generate-excerpt, generate-image' }, { status: 400, headers: cors() });
  } catch (err) {
    console.error('AI error:', err);
    return NextResponse.json({ error: 'Erro na geração com IA' }, { status: 500, headers: cors() });
  }
}
