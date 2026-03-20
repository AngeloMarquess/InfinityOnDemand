import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { nome, email, whatsapp } = await request.json();

    if (!nome || !email || !whatsapp) {
      return NextResponse.json(
        { error: 'Nome, email e WhatsApp são obrigatórios.' },
        { status: 400 }
      );
    }

    // Use the Infinity Supabase (consolidated CRM tables with crm_ prefix)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const crmOwnerId = process.env.CRM_OWNER_USER_ID;

    if (!supabaseUrl || !supabaseServiceKey || !crmOwnerId) {
      console.error('Missing Supabase env vars for CRM lead insert');
      return NextResponse.json(
        { error: 'Configuração do servidor ausente.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the "Novo Lead" stage for the CRM owner
    const { data: stages } = await supabase
      .from('crm_stages')
      .select('id')
      .eq('user_id', crmOwnerId)
      .eq('name', 'Novo Lead')
      .limit(1);

    const stageId = stages?.[0]?.id || null;

    // Insert contact as a new lead into crm_contacts
    const { data, error } = await supabase
      .from('crm_contacts')
      .insert({
        user_id: crmOwnerId,
        name: nome,
        email: email,
        phone: whatsapp,
        origin: 'ecommerce-site',
        contact_type: 'lead',
        stage_id: stageId,
        notes: `Lead capturado via landing page de e-commerce em ${new Date().toLocaleDateString('pt-BR')}.`,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting lead into CRM:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar o lead no CRM.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, lead: data });
  } catch (err) {
    console.error('Unexpected error in /api/leads:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
