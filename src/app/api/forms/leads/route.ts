import { NextResponse } from 'next/server';
import { getAllLeads, updateLeadStatus, syncStorageWithSupabase } from '@/lib/forms-storage';
import { getServerSupabase } from '@/lib/supabase';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(req: Request) {
  try {
    await syncStorageWithSupabase();
    const { searchParams } = new URL(req.url);
    const formSlug = searchParams.get('form_slug') || undefined;
    const clientId = searchParams.get('client_id') || undefined;
    const clientName = searchParams.get('client_name') || undefined;
    const status = searchParams.get('status') || undefined;

    // Buscar do storage persistente local
    let leads = getAllLeads(formSlug, clientId);

    // Se houver conexão com Supabase, mesclar com dados do Supabase
    try {
      const supabase = getServerSupabase();
      let query = supabase.from('crm_form_submissions').select('*').order('created_at', { ascending: false });
      if (formSlug && formSlug !== 'all') {
        query = query.eq('form_slug', formSlug);
      }
      const { data: dbLeads } = await query;
      if (dbLeads && dbLeads.length > 0) {
        // Unificar sem duplicar por id
        const existingIds = new Set(leads.map((l) => l.id));
        for (const dl of dbLeads) {
          if (!existingIds.has(dl.id)) {
            leads.push(dl);
          }
        }
      }
    } catch (e) {
      // Ignora erro do Supabase se tabela não existir
    }

    if (clientId && clientId !== 'all') {
      leads = leads.filter((l) => l.client_id === clientId);
    }

    if (clientName && clientName !== 'all') {
      const targetName = clientName.toLowerCase().trim();
      leads = leads.filter((l) => 
        (l.client_name && l.client_name.toLowerCase().includes(targetName)) ||
        (l.company && l.company.toLowerCase().includes(targetName))
      );
    }

    if (status && status !== 'all') {
      leads = leads.filter((l) => l.status === status);
    }

    // Calcular estatísticas agregadas
    const totalLeads = leads.length;
    const nichoCounts: Record<string, number> = {};
    const faturamentoCounts: Record<string, number> = {};
    let highQualifiedCount = 0;

    leads.forEach((l) => {
      if ((l.lead_score || 0) >= 75) highQualifiedCount++;
      const n = l.nicho || 'Geral';
      nichoCounts[n] = (nichoCounts[n] || 0) + 1;

      const f = l.faturamento || 'Não informado';
      faturamentoCounts[f] = (faturamentoCounts[f] || 0) + 1;
    });

    return NextResponse.json({
      leads,
      stats: {
        totalLeads,
        highQualifiedCount,
        qualificationRate: totalLeads > 0 ? Math.round((highQualifiedCount / totalLeads) * 100) : 0,
        nichos: nichoCounts,
        faturamentos: faturamentoCounts,
      },
    }, { headers: corsHeaders });
  } catch (err: any) {
    console.error('Erro em GET /api/forms/leads:', err);
    return NextResponse.json({ leads: [], stats: null, error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'ID e status são obrigatórios' }, { status: 400, headers: corsHeaders });
    }

    updateLeadStatus(id, status);

    try {
      const supabase = getServerSupabase();
      await supabase.from('crm_form_submissions').update({ status }).eq('id', id);
    } catch (e) {}

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}
