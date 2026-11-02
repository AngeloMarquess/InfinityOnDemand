import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Sistemas & Mercados', slug: 'sistemas-mercados', color: '#00DF81', text_color: '#070B18' },
  { id: 'cat-2', name: 'E-commerce', slug: 'ecommerce', color: '#00AAFF', text_color: '#ffffff' },
  { id: 'cat-3', name: 'Formulários & Conversão', slug: 'formularios', color: '#00DF81', text_color: '#070B18' },
  { id: 'cat-4', name: 'Tráfego Pago', slug: 'trafego-pago', color: '#FFB800', text_color: '#070B18' },
  { id: 'cat-5', name: 'Delivery SaaS', slug: 'delivery-saas', color: '#FF4D4D', text_color: '#ffffff' },
  { id: 'cat-6', name: 'CRM & Vendas', slug: 'crm-vendas', color: '#00DF81', text_color: '#070B18' },
  { id: 'cat-7', name: 'Inovação & AI', slug: 'inovacao-ai', color: '#00DF81', text_color: '#070B18' },
  { id: 'cat-8', name: 'Consultoria & Tech', slug: 'consultoria-tech', color: '#00AAFF', text_color: '#ffffff' },
];

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
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
    if (!supabase) {
      return NextResponse.json(DEFAULT_CATEGORIES, { headers: cors() });
    }
    const { data, error } = await supabase.from('blog_categories').select('*').order('name');
    if (error || !data || data.length === 0) {
      return NextResponse.json(DEFAULT_CATEGORIES, { headers: cors() });
    }
    return NextResponse.json(data, { headers: cors() });
  } catch (err) {
    console.error('Categories catch:', err);
    return NextResponse.json(DEFAULT_CATEGORIES, { headers: cors() });
  }
}

export async function POST(request: Request) {
  try {
    const { name, slug, color, text_color } = await request.json();
    if (!name || !slug) return NextResponse.json({ error: 'Nome e slug obrigatórios' }, { status: 400, headers: cors() });

    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500, headers: cors() });

    const { data, error } = await supabase.from('blog_categories').insert({ name, slug, color, text_color }).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: cors() });
    return NextResponse.json(data, { status: 201, headers: cors() });
  } catch (err) {
    console.error('Categories POST error:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500, headers: cors() });
  }
}
