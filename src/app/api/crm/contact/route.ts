import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getSupabase();
    const crmOwnerId = process.env.CRM_OWNER_USER_ID || '682d777e-f875-40bf-b10f-d3f44b67da54';

    if (!body.name) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400, headers: corsHeaders });
    }

    const payload: any = {
      ...body,
      user_id: body.user_id || crmOwnerId,
      updated_at: new Date().toISOString(),
    };

    // If stage_id is missing, get the first stage
    if (!payload.stage_id) {
      const { data: stages } = await supabase
        .from('crm_stages')
        .select('id')
        .eq('user_id', crmOwnerId)
        .order('order_index', { ascending: true })
        .limit(1);
      if (stages && stages.length > 0) {
        payload.stage_id = stages[0].id;
      }
    }

    const { data, error } = await supabase
      .from('crm_contacts')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error in /api/crm/contact:', error);
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, contact: data }, { headers: corsHeaders });
  } catch (err: any) {
    console.error('Unexpected error in /api/crm/contact:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400, headers: corsHeaders });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('crm_contacts')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error in PATCH /api/crm/contact:', error);
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, contact: data }, { headers: corsHeaders });
  } catch (err: any) {
    console.error('Unexpected error in PATCH /api/crm/contact:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}
