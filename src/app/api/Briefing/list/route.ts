import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const isRealServiceKey = serviceKey.startsWith('eyJ') && serviceKey.length > 100;
    const key = isRealServiceKey ? serviceKey : anonKey;

    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from('infinity_briefing_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('List briefings error:', error);
      return NextResponse.json({ data: [], error: error.message });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('List briefings error:', error);
    return NextResponse.json({ data: [], error: 'Internal Server Error' });
  }
}
