import { NextResponse } from 'next/server';
import { getAllForms, getFormBySlug, saveOrUpdateForm, deleteForm } from '@/lib/forms-storage';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const form = getFormBySlug(slug);
      if (!form) {
        // Fallback para o primeiro formulário ativo
        const all = getAllForms();
        return NextResponse.json({ form: all[0] || null });
      }
      return NextResponse.json({ form });
    }

    const forms = getAllForms();
    return NextResponse.json({ forms });
  } catch (err: any) {
    console.error('Erro em GET /api/forms:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Título e slug são obrigatórios' }, { status: 400 });
    }

    const saved = saveOrUpdateForm(body);
    return NextResponse.json({ success: true, form: saved });
  } catch (err: any) {
    console.error('Erro em POST /api/forms:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const ok = deleteForm(id);
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    console.error('Erro em DELETE /api/forms:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
