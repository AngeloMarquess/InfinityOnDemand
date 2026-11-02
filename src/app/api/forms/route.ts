import { NextResponse } from 'next/server';
import {
  getAllForms,
  getFormBySlug,
  saveOrUpdateForm,
  deleteForm,
  syncStorageWithSupabase,
} from '@/lib/forms-storage';
import { getServerSupabase } from '@/lib/supabase';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(req: Request) {
  try {
    await syncStorageWithSupabase();

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const cleanSlug = slug.toLowerCase().trim();
      let form = getFormBySlug(cleanSlug);

      // Se não encontrado em memória, busca na tabela crm_client_documents do Supabase
      if (!form) {
        try {
          const supabase = getServerSupabase();
          const { data: docs } = await supabase
            .from('crm_client_documents')
            .select('*')
            .eq('doc_type', 'crm_client_form')
            .order('created_at', { ascending: false });

          if (docs && docs.length > 0) {
            const match = docs.find((d: any) => {
              const meta = d.metadata?.form || d.metadata;
              return (
                meta?.slug?.toLowerCase()?.trim() === cleanSlug ||
                d.file_name?.replace('.json', '').toLowerCase() === cleanSlug
              );
            });

            if (match) {
              const found = match.metadata?.form || match.metadata;
              saveOrUpdateForm(found);
              form = found;
            }
          }
        } catch (supaErr) {
          console.error('Erro ao consultar formulário no Supabase:', supaErr);
        }
      }

      // Se ainda não encontrou, NÃO devolve fallback enganoso de outro cliente
      if (!form) {
        return NextResponse.json(
          { form: null, error: `Formulário com slug "${slug}" não foi encontrado` },
          { status: 404, headers: corsHeaders }
        );
      }

      // Retorna todos os dados para renderização do formulário
      const { clientId, ...publicData } = form;
      return NextResponse.json({ form: publicData }, { headers: corsHeaders });
    }

    // Se não pediu slug, lista todos os formulários cadastrados
    const forms = getAllForms();
    return NextResponse.json({ forms }, { headers: corsHeaders });
  } catch (err: any) {
    console.error('Erro em GET /api/forms:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: Request) {
  try {
    await syncStorageWithSupabase();
    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: 'Título e slug são obrigatórios' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Normalizar slug
    const cleanSlug = body.slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const formItem = {
      ...body,
      slug: cleanSlug,
      questions: Array.isArray(body.questions) ? body.questions : [],
      primaryColor: body.primaryColor || '#00DF81',
      brandName: body.brandName || body.clientName || 'Minha Empresa',
      whatsappDestination: body.whatsappDestination || '5581981280719',
      sendToWhatsapp: body.sendToWhatsapp !== false,
      thankYouTitle: body.thankYouTitle || 'Obrigado por responder!',
      thankYouMessage: body.thankYouMessage || 'Entraremos em contato via WhatsApp.',
      autoRedirectSeconds: body.autoRedirectSeconds || 4,
      status: body.status || 'Ativo',
    };

    // 1. Salvar no storage local
    const saved = saveOrUpdateForm(formItem);

    // 2. Persistir no Supabase em crm_client_documents
    try {
      const supabase = getServerSupabase();
      await supabase
        .from('crm_client_documents')
        .delete()
        .eq('doc_type', 'crm_client_form')
        .ilike('file_name', `${cleanSlug}.json`);

      await supabase
        .from('crm_client_documents')
        .insert({
          contact_id: body.clientId || null,
          title: `Formulário: ${saved.title}`,
          description: `Funil interativo com slug: ${saved.slug}`,
          file_url: `https://forms.infinityondemand.com.br/f/${saved.slug}`,
          file_name: `${saved.slug}.json`,
          file_type: 'form',
          file_size: 1024,
          uploaded_by: 'client',
          uploader_name: saved.brandName || 'Cliente',
          is_client_visible: true,
          status: 'approved',
          doc_type: 'crm_client_form',
          metadata: {
            slug: saved.slug,
            form: saved,
          },
        });
    } catch (supaErr) {
      console.error('Erro ao sincronizar form com Supabase:', supaErr);
    }

    return NextResponse.json({ success: true, form: saved }, { headers: corsHeaders });
  } catch (err: any) {
    console.error('Erro em POST /api/forms:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400, headers: corsHeaders });
    }

    const ok = deleteForm(id);
    return NextResponse.json({ success: ok }, { headers: corsHeaders });
  } catch (err: any) {
    console.error('Erro em DELETE /api/forms:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}
