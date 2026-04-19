import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize supersonic database client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Briefing created successfully' });

  } catch (error) {
    console.error('Server Action Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
