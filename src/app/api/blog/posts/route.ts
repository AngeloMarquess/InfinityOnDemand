import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SEED_POSTS } from '@/lib/blog-seed';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
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

// GET /api/blog/posts — List posts (public: only published, admin: all)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin') === 'true';
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const slug = searchParams.get('slug');

    // 1. Single post by slug
    if (slug) {
      // Check seed posts first or as fallback
      const seedMatch = SEED_POSTS.find((p) => p.slug === slug);

      const supabase = getSupabase();
      if (supabase) {
        const { data: post } = await supabase
          .from('blog_posts')
          .select('*, blog_categories(name, slug, color, text_color)')
          .eq('slug', slug)
          .single();

        if (post) {
          // Increment views
          await supabase.from('blog_posts').update({ views: (post.views || 0) + 1 }).eq('id', post.id);
          return NextResponse.json(post, { headers: cors() });
        }
      }

      if (seedMatch) {
        return NextResponse.json(seedMatch, { headers: cors() });
      }

      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404, headers: cors() });
    }

    // 2. List posts
    const supabase = getSupabase();
    let dbPosts: any[] = [];
    let dbCount = 0;

    if (supabase) {
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

      const res = await query;
      if (res.data && res.data.length > 0) {
        dbPosts = res.data;
        dbCount = res.count || res.data.length;
      }
    }

    // Se o banco tiver posts, usamos o banco; caso contrário, usamos os 10 posts estratégicos de SEO
    let allPosts = dbPosts.length > 0 ? dbPosts : SEED_POSTS;

    // Filtros em memória para seed posts
    if (dbPosts.length === 0) {
      if (category) {
        allPosts = allPosts.filter(
          (p) => p.blog_categories?.slug === category || p.tags?.some((t: string) => t.toLowerCase().includes(category.toLowerCase()))
        );
      }
      if (search) {
        const q = search.toLowerCase();
        allPosts = allPosts.filter(
          (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
        );
      }
    }

    const total = dbPosts.length > 0 ? dbCount : allPosts.length;
    const paginated = dbPosts.length > 0 ? allPosts : allPosts.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      posts: paginated,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    }, { headers: cors() });

  } catch (err) {
    console.error('Posts GET catch:', err);
    return NextResponse.json({
      posts: SEED_POSTS.slice(0, 12),
      total: SEED_POSTS.length,
      page: 1,
      totalPages: 1,
    }, { headers: cors() });
  }
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
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase não conectado' }, { status: 500, headers: cors() });
    }

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
    return NextResponse.json({ error: 'Erro interno ao criar post' }, { status: 500, headers: cors() });
  }
}
