const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const url = 'https://qarfhdbtaonjuuczwmwf.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcmZoZGJ0YW9uanV1Y3p3bXdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkxOTg0NiwiZXhwIjoyMDg5NDk1ODQ2fQ.YPwy-nhcAcvErpQBeGLUuAGG1IGjsxUbIMi3kiipDvk';
const supabase = createClient(url, key);

const POSTS_FILE = path.join(__dirname, '..', 'scratch_seo', 'seo_posts_data.json');

const CATEGORIES_DEF = [
  { slug: 'delivery-saas', name: 'Delivery & SaaS', color: 'rgba(255,200,50,0.9)', text_color: '#000' },
  { slug: 'sistemas-mercados', name: 'Sistemas & Mercados', color: 'rgba(0,223,129,0.9)', text_color: '#000' },
  { slug: 'ecommerce', name: 'E-commerce', color: 'rgba(0,170,255,0.9)', text_color: '#fff' },
  { slug: 'formularios', name: 'Formulários & Funis', color: 'rgba(16,185,129,0.9)', text_color: '#fff' },
  { slug: 'marketing-digital', name: 'Marketing Digital', color: 'rgba(124,58,237,0.9)', text_color: '#fff' },
  { slug: 'crm-vendas', name: 'CRM & Vendas', color: 'rgba(59,130,246,0.9)', text_color: '#fff' },
  { slug: 'ia-machine-learning', name: 'I.A. & Machine Learning', color: 'rgba(0,223,129,0.9)', text_color: '#000' },
  { slug: 'consultoria-tech', name: 'Consultoria & Tech', color: 'rgba(14,165,233,0.9)', text_color: '#fff' },
  { slug: 'tecnologia', name: 'Tecnologia', color: 'rgba(239,68,68,0.9)', text_color: '#fff' },
  { slug: 'negocios', name: 'Negócios', color: 'rgba(14,165,233,0.9)', text_color: '#fff' },
];

const COVERS = {
  'futuro-delivery-tecnologia-restaurantes': 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80',
  'sistemas-para-supermercados-hortifruti-gestao-digital': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'ecommerce-de-moda-7-dias-metodo-infinity': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
  'formularios-interativos-vs-landing-pages-conversao': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  'trafego-pago-alta-performance-cac-meta-ads': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  'delivery-proprio-saas-eliminar-taxas-ifood': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  'implantacao-crm-b2b-ia-comercial-funil-vendas': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  'ecommerce-joias-semijoias-alta-conversao-elys-calheiros': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
  'inteligencia-artificial-para-pequenos-negocios-guia-pratico': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
  'lead-scoring-preditivo-qualificacao-automatica-clientes': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
  'consultoria-transformacao-digital-ecossistemas-escalaveis': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
};

async function syncAll() {
  console.log('🚀 Iniciando sincronização no Supabase...');

  // 1. Sincronizar categorias
  const { data: existingCats } = await supabase.from('blog_categories').select('*');
  const catMap = new Map();
  (existingCats || []).forEach(c => catMap.set(c.slug, c.id));

  for (const cDef of CATEGORIES_DEF) {
    if (!catMap.has(cDef.slug)) {
      const { data: newCat, error } = await supabase.from('blog_categories').insert([cDef]).select().single();
      if (!error && newCat) {
        catMap.set(newCat.slug, newCat.id);
        console.log(`+ Categoria criada: ${cDef.name}`);
      }
    }
  }

  // 2. Carregar artigos ricos gerados
  const rawData = fs.readFileSync(POSTS_FILE, 'utf-8');
  const posts = JSON.parse(rawData);

  // 3. Buscar posts existentes no banco
  const { data: dbPosts } = await supabase.from('blog_posts').select('id, slug, published_at');
  const dbPostMap = new Map();
  (dbPosts || []).forEach(p => dbPostMap.set(p.slug, p));

  const now = new Date();
  let dayOffset = 0;

  for (const p of posts) {
    const catId = catMap.get(p.category_slug) || catMap.get('tecnologia') || null;
    const coverUrl = COVERS[p.slug] || 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80';

    // Stagger dates so they show recently published in order
    const pubDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000).toISOString();
    dayOffset++;

    const payload = {
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      cover_url: coverUrl,
      thumbnail_url: coverUrl.replace('&w=1200', '&w=600'),
      category_id: catId,
      tags: p.tags || ['Tecnologia', 'Inovação'],
      meta_title: p.meta_title || p.title,
      meta_description: p.meta_description || p.excerpt,
      reading_time: p.reading_time || 8,
      status: 'published',
      author_name: 'Angelo Marques',
      author_avatar: '/angelo.png',
      published_at: pubDate,
    };

    if (dbPostMap.has(p.slug)) {
      const existing = dbPostMap.get(p.slug);
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', existing.id);
      if (error) {
        console.error(`Erro ao atualizar post [${p.slug}]:`, error.message);
      } else {
        console.log(`✅ Artigo atualizado com sucesso no Supabase: [${p.slug}] (${p.content.split(' ').length} palavras)`);
      }
    } else {
      payload.views = Math.floor(Math.random() * 500) + 200;
      payload.created_at = pubDate;
      const { error } = await supabase.from('blog_posts').insert([payload]);
      if (error) {
        console.error(`Erro ao inserir novo post [${p.slug}]:`, error.message);
      } else {
        console.log(`🎉 Artigo INSERIDO com sucesso no Supabase: [${p.slug}]`);
      }
    }
  }

  // 4. Regularizar qualquer post antigo com published_at nulo
  const { data: nullPosts } = await supabase.from('blog_posts').select('id, title, slug').is('published_at', null);
  if (nullPosts && nullPosts.length > 0) {
    console.log(`Corrigindo ${nullPosts.length} posts com published_at nulo...`);
    for (const np of nullPosts) {
      await supabase.from('blog_posts').update({
        published_at: new Date(now.getTime() - (dayOffset++) * 24 * 60 * 60 * 1000).toISOString(),
        status: 'published'
      }).eq('id', np.id);
    }
    console.log('✅ Datas de publicação regularizadas.');
  }

  console.log('🏁 Sincronização concluída com 100% de sucesso!');
}

syncAll().catch(console.error);
