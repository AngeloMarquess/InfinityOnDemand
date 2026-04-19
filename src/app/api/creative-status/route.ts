import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';
const supabase = getServerSupabase();

// GET — List all creative statuses
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('creative_posts')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('creative_posts query error:', error.message);
      return NextResponse.json({ statuses: {} });
    }

    // Convert array to map keyed by id
    const statuses: Record<string, { status: string; postedAt: string | null; notes: string | null }> = {};
    for (const row of data || []) {
      statuses[row.id] = {
        status: row.status,
        postedAt: row.posted_at,
        notes: row.notes,
      };
    }

    return NextResponse.json({ statuses });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('creative-status GET error:', message);
    return NextResponse.json({ statuses: {} });
  }
}

// POST — Update a creative's status
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, category, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
    }

    const now = new Date().toISOString();

    const { error } = await supabase
      .from('creative_posts')
      .upsert({
        id,
        title: title || id,
        category: category || 'unknown',
        status,
        posted_at: status === 'posted' ? now : null,
        notes: notes || null,
      }, { onConflict: 'id' });

    if (error) {
      console.error('creative_posts upsert error:', error.message, error.details, error.hint);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, id, status, postedAt: status === 'posted' ? now : null });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
