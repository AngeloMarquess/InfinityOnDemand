import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

function cors() {
  return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: cors() });
}

// GET comments for a post or all (admin)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('post_id');
  const admin = searchParams.get('admin') === 'true';

  const supabase = getSupabase();
  let query = supabase.from('blog_comments').select('*, blog_posts(title, slug)').order('created_at', { ascending: false });

  if (postId) query = query.eq('post_id', postId);
  if (!admin) query = query.eq('approved', true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: cors() });
  return NextResponse.json(data || [], { headers: cors() });
}

// POST a new comment (public)
export async function POST(request: Request) {
  const { post_id, author_name, author_email, content } = await request.json();
  if (!post_id || !author_name || !content) {
    return NextResponse.json({ error: 'post_id, nome e conteúdo são obrigatórios' }, { status: 400, headers: cors() });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.from('blog_comments')
    .insert({ post_id, author_name, author_email, content, approved: false })
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: cors() });
  return NextResponse.json(data, { status: 201, headers: cors() });
}

// PUT — approve/unapprove comment (admin)
export async function PUT(request: Request) {
  const { id, approved } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400, headers: cors() });

  const supabase = getSupabase();
  const { data, error } = await supabase.from('blog_comments').update({ approved }).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: cors() });
  return NextResponse.json(data, { headers: cors() });
}

// DELETE comment
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400, headers: cors() });

  const supabase = getSupabase();
  const { error } = await supabase.from('blog_comments').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: cors() });
  return NextResponse.json({ success: true }, { headers: cors() });
}
