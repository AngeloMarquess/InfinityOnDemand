import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const formSlug = searchParams.get('form_slug');
    const status = searchParams.get('status');

    const supabase = getServerSupabase();

    let query = supabase
      .from('crm_form_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (formSlug && formSlug !== 'all') {
      query = query.eq('form_slug', formSlug);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: leads, error } = await query;

    if (error) {
      console.error('Erro ao buscar leads:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calcular estatísticas agregadas
    const totalLeads = leads?.length || 0;
    
    // Nichos
    const nichoCounts: Record<string, number> = {};
    const faturamentoCounts: Record<string, number> = {};
    const situacaoCounts: Record<string, number> = {};
    const tipoMarcaCounts: Record<string, number> = {};
    const canaisCounts: Record<string, number> = {};

    let highQualifiedCount = 0;

    leads?.forEach((l) => {
      if (l.lead_score >= 75) highQualifiedCount++;

      // Nicho
      const n = l.nicho || 'Não especificado';
      nichoCounts[n] = (nichoCounts[n] || 0) + 1;

      // Faturamento
      const f = l.faturamento || 'Não informado';
      faturamentoCounts[f] = (faturamentoCounts[f] || 0) + 1;

      // Situação
      const s = l.situacao || 'Outro';
      situacaoCounts[s] = (situacaoCounts[s] || 0) + 1;

      // Tipo Marca
      const tm = l.tipo_marca || 'Não informado';
      tipoMarcaCounts[tm] = (tipoMarcaCounts[tm] || 0) + 1;

      // Canais
      const c = l.canais_venda || 'Outro';
      canaisCounts[c] = (canaisCounts[c] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      total_leads: totalLeads,
      high_qualified_leads: highQualifiedCount,
      qualification_rate: totalLeads > 0 ? Math.round((highQualifiedCount / totalLeads) * 100) : 0,
      stats: {
        nichos: nichoCounts,
        faturamento: faturamentoCounts,
        situacao: situacaoCounts,
        tipo_marca: tipoMarcaCounts,
        canais: canaisCounts,
      },
      leads: leads || [],
    });
  } catch (err: any) {
    console.error('Erro geral em leads API:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'id e status são obrigatórios' }, { status: 400 });
    }

    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('crm_form_submissions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, lead: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
