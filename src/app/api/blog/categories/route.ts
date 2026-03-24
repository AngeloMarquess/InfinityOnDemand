import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase env vars');
  return createClient(url, key);
}

function cors() {
  return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: cors() });
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from('blog_categories').select('*').order('name');
    if (error) {
      console.error('Categories error:', error);
      return NextResponse.json([], { headers: cors() });
    }
    return NextResponse.json(data || [], { headers: cors() });
  } catch (err) {
    console.error('Categories catch:', err);
    return NextResponse.json([], { headers: cors() });
  }
}

export async function POST(request: Request) {
  try {
    const { name, slug, color, text_color } = await request.json();
    if (!name || !slug) return NextResponse.json({ error: 'Nome e slug obrigatórios' }, { status: 400, headers: cors() });

    const supabase = getSupabase();
    const { data, error } = await supabase.from('blog_categories').insert({ name, slug, color, text_color }).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: cors() });
    return NextResponse.json(data, { status: 201, headers: cors() });
  } catch (err) {
    console.error('Categories POST error:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500, headers: cors() });
  }
}
