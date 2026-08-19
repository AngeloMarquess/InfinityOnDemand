import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    const crmOwnerId = process.env.CRM_OWNER_USER_ID || 'c7d7e35b-d352-475d-88b1-5fe1ba3cfb97';

    if (!body.name) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, contact: data });
  } catch (err: any) {
    console.error('Unexpected error in /api/crm/contact:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
