import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

// GET — Lista os posts agendados
export async function GET() {
  try {
    const supabase = getServerSupabase();

    const { data, error } = await supabase
      .from('scheduled_posts')
      .select('*')
      .order('scheduled_time', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ posts: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
