import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const supabase = getServerSupabase();
    const data = await req.json();

    const { briefing_type, company_name, contact_name, contact_phone, answers } = data;

    if (!briefing_type || !company_name || !contact_name || !contact_phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase
      .from('infinity_briefing_submissions')
      .insert([
        {
          briefing_type,
          company_name,
          contact_name,
          contact_phone,
          answers,
          status: 'pending'
        }
      ]);

    if (error) {
      console.error('Supabase Insert Error:', error);
      // If table doesn't exist, provide a clear hint
      if (error.message?.includes('relation') || error.code === '42P01') {
        return NextResponse.json({ 
          error: 'Tabela infinity_briefing_submissions não existe. Execute o briefing_schema.sql no Supabase.' 
        }, { status: 500 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Briefing created successfully' });

  } catch (error) {
    console.error('Server Action Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
