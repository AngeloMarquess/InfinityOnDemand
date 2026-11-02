const { createClient } = require('@supabase/supabase-js');

const url = 'https://qarfhdbtaonjuuczwmwf.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcmZoZGJ0YW9uanV1Y3p3bXdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkxOTg0NiwiZXhwIjoyMDg5NDk1ODQ2fQ.YPwy-nhcAcvErpQBeGLUuAGG1IGjsxUbIMi3kiipDvk';
const supabase = createClient(url, key);

// Mapa temático exclusivo para CADA post ter sua capa profissional única
const THEMATIC_COVERS = {
  // Tráfego e Performance
  'desvende-o-poder-das-estrategias-de-trafego-pago-para-seu-ecommerce': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  'domine-o-trafego-pago-5-estrategias-essenciais-para-seu-e-commerce': 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=80',
  'trafego-pago-alta-performance-cac-meta-ads': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  '5-estrategias-performance-triplicam-vendas': 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',

  // Delivery e Restaurantes
  'futuro-delivery-tecnologia-restaurantes': 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80',
  'como-lucrar-com-delivery-independente': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80',
  'delivery-proprio-saas-eliminar-taxas-ifood': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  'vantagem-ter-app-proprio-de-delivery': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
  'independencia-digital-crie-seu-proprio-aplicativo-de-delivery': 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80',
  'cardapio-digital-vs-cardapio-fisico-a-revolucao-nos-restaurantes': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',

  // IA e Atendimento WhatsApp
  'revolucao-inteligencia-artificial-atendimento-vendas-whatsapp-2026': 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=1200&q=80',
  'revolucione-atendimento-cliente-whatsapp-inteligencia-artificial-2026': 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=1200&q=80',
  'agentes-ia-revolucionando-ecommerce-2026': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'inteligencia-artificial-para-pequenos-negocios-guia-pratico': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',

  // CRM e Vendas B2B
  'implantacao-crm-b2b-ia-comercial-funil-vendas': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  'crm-inteligente-transforme-leads-frios-em-clientes-fieis-com-automacao': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
  'como-automatizar-seu-funil-de-vendas-com-ia-e-whatsapp-business': 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80',
  'lead-scoring-preditivo-qualificacao-automatica-clientes': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',

  // E-commerce e Moda
  'ecommerce-de-moda-7-dias-metodo-infinity': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
  'ecommerce-joias-semijoias-alta-conversao-elys-calheiros': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
  'o-futuro-do-e-commerce-no-brasil-tendencias-e-tecnologias-ate-2027': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
  'como-criar-loja-virtual-do-zero-2026-guia-definitivo-iniciantes': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  'maximizando-valor-cliente-pos-venda': 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',

  // Sistemas, Web e SEO
  'sistemas-para-supermercados-hortifruti-gestao-digital': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'formularios-interativos-vs-landing-pages-conversao': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  'guia-completo-desenvolvimento-sites-negocios-locais': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  'guia-pratico-de-seo-para-pequenas-empresas': 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&w=1200&q=80',
  'automacao-de-marketing-enviando-mensagem-certa': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  'importancia-dos-testes-software': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  'consultoria-transformacao-digital-ecossistemas-escalaveis': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
  'bem-vindo-ao-infinity-blog': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
};

async function fixCoversAndLinks() {
  console.log('🖼️ Iniciando personalização de todas as capas e links de contato...');
  const { data: posts, error: fetchErr } = await supabase.from('blog_posts').select('id, slug, title, cover_url, content');
  if (fetchErr) {
    console.error('Erro buscando posts:', fetchErr.message);
    return;
  }

  for (const post of posts) {
    const slug = post.slug;
    const cleanCover = THEMATIC_COVERS[slug] || (post.cover_url ? post.cover_url.trim() : null);

    const updates = {};
    if (cleanCover) {
      const thumb = cleanCover.replace('&w=1200', '&w=600');
      updates.cover_url = cleanCover;
      updates.thumbnail_url = thumb;
    }

    if (post.content && post.content.includes('/contato')) {
      updates.content = post.content.split('/contato').join('/#contact');
      console.log(`🔗 Corrigido link /contato -> /#contact no post [${slug}]`);
    }

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase.from('blog_posts').update(updates).eq('id', post.id);
      if (error) {
        console.error(`Erro atualizando post ${slug}:`, error.message);
      } else {
        console.log(`✅ Post [${slug}] atualizado com sucesso!`);
      }
    }
  }

  console.log('🎉 Todas as capas e links de contato foram atualizados no Supabase!');
}

fixCoversAndLinks().catch(console.error);
