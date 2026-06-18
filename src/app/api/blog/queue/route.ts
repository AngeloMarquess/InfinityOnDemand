import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase env vars');
  return createClient(url, key);
}

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: cors() });
}

// GET /api/blog/queue — List all queued topics
export async function GET() {
  try {
    const supabase = getSupabase();
    
    // Debug logging to see what env var Next.js is actually loading on the server
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    console.log('[DEBUG QUEUE] URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('[DEBUG QUEUE] Key length:', key.length);
    console.log('[DEBUG QUEUE] Key prefix:', key.substring(0, 15));

    const { data, error } = await supabase
      .from('content_queue')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: cors() });
    }

    return NextResponse.json(data || [], { headers: cors() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/blog/queue — Add topics in bulk (one per line)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topics } = body; // Expect array of strings

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json({ error: 'Nenhum tema fornecido' }, { status: 400 });
    }

    const supabase = getSupabase();
    const rows = topics
      .map((topic: string) => ({
        topic: topic.trim(),
        status: 'pending',
      }))
      .filter((r) => r.topic.length > 0);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Nenhum tema válido fornecido' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('content_queue')
      .insert(rows)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: data.length }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/blog/queue — Delete a topic from the queue
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from('content_queue')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
