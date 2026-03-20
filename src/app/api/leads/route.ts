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

    // CRM Supabase — use service role key to bypass RLS
    const crmUrl = process.env.CRM_SUPABASE_URL;
    const crmServiceKey = process.env.CRM_SUPABASE_SERVICE_ROLE_KEY;
    const crmUserId = process.env.CRM_OWNER_USER_ID;

    if (!crmUrl || !crmServiceKey || !crmUserId) {
      console.error('Missing CRM Supabase env vars');
      return NextResponse.json(
        { error: 'Configuração do CRM ausente.' },
        { status: 500 }
      );
    }

    const supabaseCRM = createClient(crmUrl, crmServiceKey);

    // Get the "Novo Lead" stage for this user
    const { data: stages } = await supabaseCRM
      .from('stages')
      .select('id')
      .eq('user_id', crmUserId)
      .eq('name', 'Novo Lead')
      .limit(1);

    const stageId = stages?.[0]?.id || null;

    // Insert contact as a new lead
    const { data, error } = await supabaseCRM
      .from('contacts')
      .insert({
        user_id: crmUserId,
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
