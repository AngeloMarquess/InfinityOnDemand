import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

function cors() {
  return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: cors() });
}

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('blog_categories').select('*').order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: cors() });
  return NextResponse.json(data || [], { headers: cors() });
}

export async function POST(request: Request) {
  const { name, slug, color, text_color } = await request.json();
  if (!name || !slug) return NextResponse.json({ error: 'Nome e slug obrigatórios' }, { status: 400, headers: cors() });

  const supabase = getSupabase();
  const { data, error } = await supabase.from('blog_categories').insert({ name, slug, color, text_color }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: cors() });
  return NextResponse.json(data, { status: 201, headers: cors() });
}
