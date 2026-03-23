import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

// POST /api/crm/webhook/leads?token=xxx — receive a lead from the client's site form
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token obrigatório' }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  // Find which user owns this webhook token
  const { data: integration, error: intError } = await supabase
    .from('crm_integrations')
    .select('user_id')
    .eq('site_webhook_token', token)
    .eq('site_enabled', true)
    .single();

  if (intError || !integration) {
    return NextResponse.json({ error: 'Token inválido ou integração desativada' }, { status: 401 });
  }

  const userId = integration.user_id;

  // Parse the lead data from form or JSON
  let leadData: Record<string, string> = {};
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    leadData = await request.json();
  } else if (contentType.includes('form')) {
    const formData = await request.formData();
    formData.forEach((value, key) => {
      leadData[key] = value.toString();
    });
  } else {
    // Try JSON fallback
    try {
      leadData = await request.json();
    } catch {
      return NextResponse.json({ error: 'Formato de dados não suportado. Use JSON ou FormData.' }, { status: 400 });
    }
  }

  const name = leadData.name || leadData.nome || 'Lead sem nome';
  const email = leadData.email || null;
  const phone = leadData.phone || leadData.telefone || leadData.whatsapp || null;
  const notes = leadData.notes || leadData.mensagem || leadData.message || null;

  // Get the user's first stage (Novo Lead) to place the lead
  const { data: firstStage } = await supabase
    .from('crm_stages')
    .select('id')
    .eq('user_id', userId)
    .order('order_index', { ascending: true })
    .limit(1)
    .single();

  // Insert the lead
  const { data: newLead, error: leadError } = await supabase
    .from('crm_contacts')
    .insert({
      user_id: userId,
      name,
      email,
      phone,
      notes,
      origin: 'site',
      contact_type: 'lead',
      stage_id: firstStage?.id || null,
    })
    .select('id, name')
    .single();

  if (leadError) {
    console.error('Error creating lead:', leadError);
    return NextResponse.json({ error: 'Erro ao criar lead' }, { status: 500 });
  }

  // If form submission (not API), redirect to a thank you page
  if (contentType.includes('form') && leadData.redirect_url) {
    return NextResponse.redirect(leadData.redirect_url);
  }

  return NextResponse.json({ 
    success: true, 
    lead: { id: newLead.id, name: newLead.name },
    message: 'Lead criado com sucesso!' 
  });
}
