import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

function cors() {
  return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: cors() });
}

// GET all subscribers (admin)
export async function GET() {
  const supabase = getSupabase();
  const { data, error, count } = await supabase
    .from('blog_subscribers')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: cors() });
  return NextResponse.json({ subscribers: data || [], total: count || 0 }, { headers: cors() });
}

// POST — subscribe (public)
export async function POST(request: Request) {
  const { email, name } = await request.json();
  if (!email) return NextResponse.json({ error: 'Email obrigatório' }, { status: 400, headers: cors() });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('blog_subscribers')
    .upsert({ email, name, subscribed: true }, { onConflict: 'email' })
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: cors() });
  return NextResponse.json({ success: true, subscriber: data }, { headers: cors() });
}

// DELETE — unsubscribe or remove
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const email = searchParams.get('email');

  const supabase = getSupabase();

  if (email) {
    // Public unsubscribe
    await supabase.from('blog_subscribers').update({ subscribed: false }).eq('email', email);
  } else if (id) {
    // Admin delete
    await supabase.from('blog_subscribers').delete().eq('id', id);
  } else {
    return NextResponse.json({ error: 'ID ou email obrigatório' }, { status: 400, headers: cors() });
  }

  return NextResponse.json({ success: true }, { headers: cors() });
}
