import { NextResponse } from 'next/server';
import { getAllClients, saveClient, syncStorageWithSupabase, ClientTenant } from '@/lib/forms-storage';
import { getServerSupabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    await syncStorageWithSupabase();

    // 1. Tentar buscar clientes ativos diretamente do CRM (tabela crm_contacts onde contact_type in ('client', 'ativo'))
    try {
      const supabase = getServerSupabase();
      const { data: crmClients, error } = await supabase
        .from('crm_contacts')
        .select('id, name, company, email, phone, project_interest, tags, contact_type')
        .in('contact_type', ['client', 'ativo'])
        .order('name', { ascending: true });

      if (!error && crmClients && crmClients.length > 0) {
        const activeClients: ClientTenant[] = crmClients.map((c: any) => ({
          id: c.id,
          name: c.name,
          company: c.company || c.name,
          phone: c.phone || '',
          email: c.email || '',
          niche: c.project_interest || (Array.isArray(c.tags) && c.tags[0]) || 'Geral',
          created_at: new Date().toISOString(),
        }));
        return NextResponse.json({ clients: activeClients });
      }
    } catch (crmErr) {
      console.warn('Fallback para banco local de clientes:', crmErr);
    }

    // 2. Fallback caso Supabase esteja offline ou sem clientes cadastrados
    const clients = getAllClients();
    return NextResponse.json({ clients });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await syncStorageWithSupabase();
    const body = await req.json();
    if (!body.company) {
      return NextResponse.json({ error: 'Nome da empresa é obrigatório' }, { status: 400 });
    }

    const saved = saveClient(body);
    return NextResponse.json({ success: true, client: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
