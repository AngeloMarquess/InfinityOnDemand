import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
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

// GET /api/blog/posts — List posts (public: only published, admin: all)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get('admin') === 'true';
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const slug = searchParams.get('slug');

  const supabase = getSupabase();

  // Single post by slug
  if (slug) {
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*, blog_categories(name, slug, color, text_color)')
      .eq('slug', slug)
      .single();

    if (error || !post) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404, headers: cors() });
    }

    // Increment views
    await supabase.from('blog_posts').update({ views: (post.views || 0) + 1 }).eq('id', post.id);

    return NextResponse.json(post, { headers: cors() });
  }

  // List posts
  let query = supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_url, thumbnail_url, category_id, tags, status, author_name, author_avatar, reading_time, views, published_at, created_at, blog_categories(name, slug, color, text_color)', { count: 'exact' });

  if (!admin) {
    query = query.eq('status', 'published');
  } else if (status) {
    query = query.eq('status', status);
  }

  if (category) {
    const { data: cat } = await supabase.from('blog_categories').select('id').eq('slug', category).single();
    if (cat) query = query.eq('category_id', cat.id);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  query = query.order('published_at', { ascending: false, nullsFirst: false })
    .range((page - 1) * limit, page * limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: cors() });
  }

  return NextResponse.json({
    posts: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  }, { headers: cors() });
}

// POST /api/blog/posts — Create post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, cover_url, thumbnail_url, category_id, tags, meta_title, meta_description, status, author_name, reading_time, published_at } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Título e slug são obrigatórios' }, { status: 400, headers: cors() });
    }

    const supabase = getSupabase();

    // Calculate reading time if not provided
    const wordCount = (content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
    const calcReadingTime = reading_time || Math.max(1, Math.ceil(wordCount / 200));

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        excerpt,
        content: content || '',
        cover_url,
        thumbnail_url,
        category_id,
        tags: tags || [],
        meta_title: meta_title || title,
        meta_description: meta_description || excerpt,
        status: status || 'draft',
        author_name: author_name || 'Infinity OnDemand',
        reading_time: calcReadingTime,
        published_at: status === 'published' ? (published_at || new Date().toISOString()) : published_at,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: cors() });
    }

    return NextResponse.json(data, { status: 201, headers: cors() });
  } catch (err) {
    console.error('Error creating post:', err);
    return NextResponse.json({ error: 'Erro ao criar post' }, { status: 500, headers: cors() });
  }
}

// PUT /api/blog/posts — Update post
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400, headers: cors() });
    }

    // Recalculate reading time
    if (updates.content) {
      const wordCount = updates.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      updates.reading_time = Math.max(1, Math.ceil(wordCount / 200));
    }

    // Set published_at when publishing
    if (updates.status === 'published' && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: cors() });
    }

    return NextResponse.json(data, { headers: cors() });
  } catch (err) {
    console.error('Error updating post:', err);
    return NextResponse.json({ error: 'Erro ao atualizar post' }, { status: 500, headers: cors() });
  }
}

// DELETE /api/blog/posts — Delete post
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400, headers: cors() });
  }

  const supabase = getSupabase();
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: cors() });
  }

  return NextResponse.json({ success: true }, { headers: cors() });
}
