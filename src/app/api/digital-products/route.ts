import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export interface DigitalProduct {
  id: string;
  name: string;
  description: string;
  sales_page_url: string;
  price: number;
  currency: string;
  category?: string;
  payment_type: 'single' | 'subscription';
  delivery_type: 'members_area' | 'external' | 'files' | 'payments_only';
  members_area_name?: string;
  file_url?: string;
  image_url?: string;
  email_language?: string;
  status: 'active' | 'draft' | 'paused';
  total_sales: number;
  total_revenue: number;
  created_at?: string;
}

// In-memory fallback catalog
let FALLBACK_PRODUCTS: DigitalProduct[] = [
  {
    id: 'prod_1',
    name: 'NeuroDesign',
    description: 'E-book e templates de neurodesign aplicados a criativos de alta conversão para tráfego pago e mídias sociais.',
    sales_page_url: 'https://infinityondemand.com.br',
    price: 24.90,
    currency: 'BRL',
    category: 'Design & IA',
    payment_type: 'single',
    delivery_type: 'members_area',
    members_area_name: 'NeuroDesign',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    email_language: 'Português',
    status: 'active',
    total_sales: 14,
    total_revenue: 348.60,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod_2',
    name: 'E-book: IA para Criadores de Conteúdo',
    description: 'Guia passo a passo para automatizar a produção de conteúdo, carrosséis e roteiros com prompts profissionais.',
    sales_page_url: 'https://infinityondemand.com.br',
    price: 39.90,
    currency: 'BRL',
    category: 'Inteligência Artificial',
    payment_type: 'single',
    delivery_type: 'members_area',
    members_area_name: 'Área Infinity',
    image_url: 'https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=600&auto=format&fit=crop&q=80',
    email_language: 'Português',
    status: 'active',
    total_sales: 28,
    total_revenue: 1117.20,
    created_at: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('digital_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, products: data });
    }
  } catch (err) {
    console.log('Digital products database fallback:', err);
  }

  return NextResponse.json({ success: true, products: FALLBACK_PRODUCTS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    const supabase = getServerSupabase();

    // ------------------------------------------------------------ SAVE PRODUCT
    if (action === 'save_product') {
      const { id, ...prodData } = payload;

      if (id && !id.startsWith('prod_')) {
        try {
          const { data, error } = await supabase
            .from('digital_products')
            .update(prodData)
            .eq('id', id)
            .select()
            .single();
          if (!error && data) {
            return NextResponse.json({ success: true, product: data });
          }
        } catch {
          // fallback
        }
      } else if (!id) {
        try {
          const { data, error } = await supabase
            .from('digital_products')
            .insert(prodData)
            .select()
            .single();
          if (!error && data) {
            return NextResponse.json({ success: true, product: data });
          }
        } catch {
          // fallback
        }
      }

      // In-memory fallback
      if (id) {
        FALLBACK_PRODUCTS = FALLBACK_PRODUCTS.map((p) => (p.id === id ? { ...p, ...prodData } : p));
        const updated = FALLBACK_PRODUCTS.find((p) => p.id === id);
        return NextResponse.json({ success: true, product: updated });
      } else {
        const newProduct: DigitalProduct = {
          id: `prod_${Date.now()}`,
          name: prodData.name || 'Novo Produto',
          description: prodData.description || '',
          sales_page_url: prodData.sales_page_url || 'https://infinityondemand.com.br',
          price: Number(prodData.price) || 0,
          currency: prodData.currency || 'BRL',
          category: prodData.category || 'Marketing & Negócios',
          payment_type: prodData.payment_type || 'single',
          delivery_type: prodData.delivery_type || 'members_area',
          members_area_name: prodData.members_area_name || 'Área de Membros',
          image_url: prodData.image_url || null,
          email_language: prodData.email_language || 'Português',
          status: prodData.status || 'active',
          total_sales: 0,
          total_revenue: 0,
          created_at: new Date().toISOString(),
        };
        FALLBACK_PRODUCTS = [newProduct, ...FALLBACK_PRODUCTS];
        return NextResponse.json({ success: true, product: newProduct });
      }
    }

    // ---------------------------------------------------------- DELETE PRODUCT
    if (action === 'delete_product') {
      const { id } = payload;
      try {
        await supabase.from('digital_products').delete().eq('id', id);
      } catch {
        // ignore
      }
      FALLBACK_PRODUCTS = FALLBACK_PRODUCTS.filter((p) => p.id !== id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Ação desconhecida.' }, { status: 400 });
  } catch (error) {
    console.error('Digital products POST error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao processar produto.' }, { status: 500 });
  }
}
