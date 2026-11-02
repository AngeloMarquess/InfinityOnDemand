export interface SeedBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string;
  thumbnail_url: string;
  category_id?: string;
  tags: string[];
  meta_title: string;
  meta_description: string;
  status: 'published' | 'draft';
  author_name: string;
  author_avatar?: string;
  reading_time: number;
  views: number;
  published_at: string;
  created_at: string;
  blog_categories: {
    name: string;
    slug: string;
    color: string;
    text_color: string;
  };
}

export const SEED_POSTS: SeedBlogPost[] = [
  {
    id: 'seed-post-1',
    title: 'Sistemas para Supermercados e Hortifrútis: Como a Digitalização Reduz Perdas e Multiplica as Vendas',
    slug: 'sistemas-para-supermercados-hortifruti-gestao-digital',
    excerpt: 'Descubra como redes de varejo alimentar e hortifrutis estão automatizando estoque perecível, integrando PDV moderno e abrindo canais de delivery próprios sem intermediários.',
    meta_title: 'Sistemas para Supermercados e Hortifrútis | Gestão Digital Infinity',
    meta_description: 'Software e sistemas sob demanda para supermercados e hortifrutis. Controle de estoque perecível, PDV rápido e aplicativo de delivery próprio.',
    cover_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    tags: ['Supermercados', 'Hortifrúti', 'Sistemas', 'PDV', 'Varejo Alimentar', 'Delivery Próprio'],
    status: 'published',
    author_name: 'Angelo Marques',
    reading_time: 6,
    views: 412,
    published_at: '2026-03-10T10:00:00.000Z',
    created_at: '2026-03-10T10:00:00.000Z',
    blog_categories: {
      name: 'Sistemas & Mercados',
      slug: 'sistemas-mercados',
      color: '#00DF81',
      text_color: '#070B18',
    },
    content: `
      <h2>O Desafio Operacional dos Supermercados e Hortifrútis Modernos</h2>
      <p>Gerenciar um supermercado ou hortifrúti é uma das operações de varejo mais exigentes do mercado. Com margens apertadas e produtos de alta perecibilidade, qualquer falha no controle de compras, estoque ou precificação reflete imediatamente em perda de margem de lucro.</p>
      
      <h3>1. O Fim das Planilhas e dos Sistemas Legados Travados</h3>
      <p>Muitos gestores ainda enfrentam lentidão em filas de caixa e sistemas arcaicos que não conversam com balanças, leitores biométricos ou sistemas de entrega online. Na <strong>Infinity On Demand</strong>, arquitetamos ecossistemas completos para o varejo alimentar:</p>
      <ul>
        <li><strong>PDV Ultra-Rápido:</strong> Frente de caixa responsiva com suporte a contingência offline e leitura instantânea de código de barras.</li>
        <li><strong>Gestão de Hortifrúti e Perecíveis:</strong> Monitoramento de curva ABC e alertas de validade para reduzir o desperdício de frutas, verduras e laticínios a menos de 1,2%.</li>
        <li><strong>Integração com Balanças e Etiquetas Eletrônicas:</strong> Sincronização automática de preços direto do banco de dados na nuvem.</li>
      </ul>

      <h3>2. O Poder do E-commerce e Delivery de Mercado Próprio</h3>
      <p>Depender exclusivamente de marketplaces ou aplicativos de terceiros consome de 12% a 25% de taxa sobre cada compra de mercado. Com a nossa solução <strong>Infinity Market</strong>, sua rede disponibiliza aos clientes um portal web e app direto onde as compras chegam organizadas por corredor para separação ágil pela equipe de picking.</p>

      <blockquote>"Mercados que digitalizaram seus pedidos de bairro aumentaram em 38% o ticket médio das compras recorrentes da semana."</blockquote>

      <h3>Conclusão</h3>
      <p>A tecnologia certa transforma a rotina do supermercado em uma engrenagem previsível e lucrativa. Fale com nossos consultores para diagnosticar os gargalos da sua operação de varejo.</p>
    `,
  },
  {
    id: 'seed-post-2',
    title: 'E-commerce de Moda & Vestuário Pronto em 7 Dias: O Método Validado da Infinity',
    slug: 'ecommerce-de-moda-7-dias-metodo-infinity',
    excerpt: 'Como estruturamos lojas virtuais premium de moda, bolsas e calçados em tempo recorde de 7 dias, com alta taxa de conversão no checkout e design exclusivo.',
    meta_title: 'E-commerce de Moda em 7 Dias | Método Exclusivo Infinity On Demand',
    meta_description: 'Tenha seu e-commerce de moda pronto para faturar em 7 dias com UX de alto padrão, integrações com correios, gateways e tráfego pago.',
    cover_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    tags: ['E-commerce', 'Moda', 'Vestuário', 'Cactus Calorosos', 'Conversão', 'Shopify'],
    status: 'published',
    author_name: 'Angelo Marques',
    reading_time: 5,
    views: 689,
    published_at: '2026-03-12T14:30:00.000Z',
    created_at: '2026-03-12T14:30:00.000Z',
    blog_categories: {
      name: 'E-commerce',
      slug: 'ecommerce',
      color: '#00AAFF',
      text_color: '#ffffff',
    },
    content: `
      <h2>Por Que a Maioria dos Projetos de E-commerce Demora Meses para Sair do Papel?</h2>
      <p>No setor de moda e vestuário, a agilidade é tudo. Estações do ano mudam, coleções de roupas se esgotam e marcas que levam meses contratando agências tradicionais perdem os momentos de maior pico comercial.</p>

      <h3>O Case Cactus Calorosos</h3>
      <p>Um dos nossos grandes cases de validação é a <a href="https://cactuscalorosos.com.br" target="_blank" rel="noopener">Cactus Calorosos</a>, marca de moda que precisava de um catálogo interativo, checkout transparente veloz e visual que refletisse o lifestyle autêntico da marca.</p>

      <h3>Os 4 Pilares da Entrega em 7 Dias da Infinity:</h3>
      <ol>
        <li><strong>UI/UX de Alta Conversão:</strong> Design concebido especificamente para navegação mobile, onde ocorrem mais de 87% das compras de moda.</li>
        <li><strong>Checkout Transparente Otimizado:</strong> Redução drástica no abandono de carrinho com pagamento via Pix em 1 clique e cartão sem redirecionamento externo.</li>
        <li><strong>Logística Integrada:</strong> Cálculo em tempo real com Correios, Melhor Envio e transportadoras privadas para todo o Brasil.</li>
        <li><strong>Pixel e API de Conversões do Meta:</strong> Instalação técnica precisa com Server-Side Tracking para alimentar as campanhas de Tráfego Pago com dados limpos.</li>
      </ol>

      <p>Se você tem uma marca física ou de Instagram e deseja dar o salto para um e-commerce próprio lucrativo, seu projeto pode estar no ar na próxima semana.</p>
    `,
  },
  {
    id: 'seed-post-3',
    title: 'Formulários Interativos vs Landing Pages Tradicionais: O Futuro da Captação de Leads',
    slug: 'formularios-interativos-vs-landing-pages-conversao',
    excerpt: 'Descubra por que formulários inteligentes no formato One-Question-at-a-Time (estilo Typeform) convertem até 3,8x mais leads qualificados em campanhas de tráfego pago.',
    meta_title: 'Formulários Interativos vs Landing Pages Tradicionais | Infinity Forms',
    meta_description: 'Aumente o ROAS e qualifique leads em tempo real com formulários interativos. Compare as métricas de conversão entre Landing Pages estáticas e Infinity Forms.',
    cover_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    tags: ['Formulários', 'Typeform', 'Lead Capture', 'CRO', 'Tráfego Pago', 'Qualificação'],
    status: 'published',
    author_name: 'Angelo Marques',
    reading_time: 7,
    views: 890,
    published_at: '2026-03-14T09:15:00.000Z',
    created_at: '2026-03-14T09:15:00.000Z',
    blog_categories: {
      name: 'Formulários & Conversão',
      slug: 'formularios',
      color: '#00DF81',
      text_color: '#070B18',
    },
    content: `
      <h2>A Morte da Landing Page Longa com Formulários Pesados</h2>
      <p>Durante anos, a regra do marketing digital foi empilhar 10 dobras de texto em uma landing page estática e colocar um formulário intimidador de 8 campos no final da página. O resultado? Mais de 70% dos usuários desistem antes de digitar o primeiro caractere.</p>

      <h3>Por Que os Formulários Interativos Dominam em 2026?</h3>
      <p>O <strong>Infinity Forms</strong> foi construído sobre a psicologia comportamental do micro-comprometimento (efeito Zeigarnik). Em vez de assustar o visitante:</p>
      <ul>
        <li><strong>Foco em Uma Pergunta por Vez:</strong> O usuário responde perguntas simples e intuitivas, criando ritmo natural de interação.</li>
        <li><strong>Perguntas Dinâmicas e Ramificações:</strong> Se o cliente seleciona "Tenho um e-commerce", a pergunta seguinte é sobre a plataforma dele; se seleciona "Loja Física", pergunta sobre ponto comercial.</li>
        <li><strong>Lead Score Preditivo:</strong> No momento do envio, o sistema calcula uma nota de 0 a 100 baseada no faturamento e maturidade do lead.</li>
        <li><strong>Hand-off Imediato para o WhatsApp:</strong> Leads com alta qualificação são redirecionados em 4 segundos para o WhatsApp do vendedor com todo o diagnóstico preenchido.</li>
      </ul>

      <p>Campanhas que substituíram páginas estáticas pelo Infinity Forms viram o Custo por Lead Qualificado (CPLQ) despencar mais de 45% nas primeiras duas semanas.</p>
    `,
  },
  {
    id: 'seed-post-4',
    title: 'Tráfego Pago de Alta Performance: Otimização Rigorosa de CAC e Escala no Meta Ads & WhatsApp',
    slug: 'trafego-pago-alta-performance-cac-meta-ads',
    excerpt: 'Como estruturar campanhas de Meta Ads com foco em faturamento real e não em métricas de vaidade. Funis diretos para WhatsApp e E-commerce.',
    meta_title: 'Tráfego Pago de Alta Performance | Gestão Meta Ads Infinity',
    meta_description: 'Maximize o ROAS da sua empresa com tráfego pago estratégico. Estratégias de criativos, testes de público e funis de conversão para WhatsApp.',
    cover_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    tags: ['Tráfego Pago', 'Meta Ads', 'CAC', 'ROAS', 'Gestão de Tráfego', 'Performance'],
    status: 'published',
    author_name: 'Angelo Marques',
    reading_time: 6,
    views: 754,
    published_at: '2026-03-15T16:00:00.000Z',
    created_at: '2026-03-15T16:00:00.000Z',
    blog_categories: {
      name: 'Tráfego Pago',
      slug: 'trafego-pago',
      color: '#FFB800',
      text_color: '#070B18',
    },
    content: `
      <h2>Cliques e Curtidas Não Pagam Boletos</h2>
      <p>O maior erro dos anunciantes em 2026 é otimizar campanhas para cliques baratos ou impressões genéricas. Tráfego pago profissional deve ser medido por apenas três letras: <strong>CAC (Custo de Aquisição de Clientes)</strong>, <strong>LTV (Lifetime Value)</strong> e <strong>ROAS (Retorno sobre Investimento em Anúncios)</strong>.</p>

      <h3>Como a Infinity On Demand Opera Campanhas:</h3>
      <ol>
        <li><strong>Filtro de Qualificação Pré-Conversão:</strong> Usamos criativos com comunicação direcionada para repelir curiosos e atrair compradores com poder aquisitivo alinhado.</li>
        <li><strong>Integração com API de Conversões (CAPI):</strong> Com as restrições de cookies dos navegadores modernos, enviamos dados de compra e leads diretamente do servidor, garantindo precisão total aos algoritmos do Facebook e Instagram.</li>
        <li><strong>Automação Comercial no WhatsApp:</strong> O lead que chega do anúncio recebe atendimento instantâneo com triagem inteligente, evitando que o contato esfrie.</li>
      </ol>

      <p>Não invista um único real a mais em anúncios sem antes ter certeza de que seu funil de vendas está preparado para converter visitas em dinheiro no caixa.</p>
    `,
  },
  {
    id: 'seed-post-5',
    title: 'Delivery Próprio SaaS vs Taxas Abusivas de Aplicativos: Como Restaurantes Recuperam 27% de Margem',
    slug: 'delivery-proprio-saas-eliminar-taxas-ifood',
    excerpt: 'Entenda como os principais restaurantes e redes de alimentação estão construindo sua própria base de clientes fiéis com a plataforma Infinity Delivery OS.',
    meta_title: 'Delivery Próprio SaaS Sem Comissões | Infinity Delivery OS',
    meta_description: 'Pare de perder até 27% do faturamento em taxas de marketplaces. Crie seu aplicativo e cardápio digital de delivery próprio com pedidos direto no WhatsApp.',
    cover_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    tags: ['Delivery SaaS', 'Restaurantes', 'Delivery Próprio', 'Food Service', 'Sistemas', 'iFood'],
    status: 'published',
    author_name: 'Angelo Marques',
    reading_time: 5,
    views: 521,
    published_at: '2026-03-16T11:20:00.000Z',
    created_at: '2026-03-16T11:20:00.000Z',
    blog_categories: {
      name: 'Delivery SaaS',
      slug: 'delivery-saas',
      color: '#FF4D4D',
      text_color: '#ffffff',
    },
    content: `
      <h2>A Ilusão do Faturamento Sem Lucro nos Grandes Apps de Entrega</h2>
      <p>Um restaurante fatura R$ 100 mil no mês através de grandes aplicativos de entrega. No final do fechamento, R$ 25 mil a R$ 27 mil ficam retidos em comissões, taxas de entrega e custos de antecipação. Pior: o restaurante não é dono da lista de clientes.</p>

      <h3>O Conceito do Infinity Delivery OS</h3>
      <p>O <strong>Infinity Delivery SaaS</strong> foi desenhado para colocar o restaurante no comando total da sua operação:</p>
      <ul>
        <li><strong>0% de Taxa por Pedido:</strong> Seu faturamento pertence integralmente à sua empresa.</li>
        <li><strong>Cardápio Digital PWA Ultra Rápido:</strong> Abre instantaneamente sem que o cliente precise baixar nada da loja de aplicativos.</li>
        <li><strong>Integração com Impressoras de Cozinha (KDS):</strong> O pedido cai direto na comanda de produção térmica e no painel do despachante.</li>
        <li><strong>Base de Clientes Proprietária:</strong> Telefone, e-mail e histórico de compras de cada cliente ficam salvos para ações de recompra via disparos programados de WhatsApp.</li>
      </ul>

      <p>Mantenha sua presença nos apps para atrair novos clientes pela primeira vez, mas fidelize-os no seu canal próprio com cashback e descontos exclusivos.</p>
    `,
  },
  {
    id: 'seed-post-6',
    title: 'Implantação de CRM B2B e IA Comercial: Automatizando o Funil de Vendas de Ponta a Ponta',
    slug: 'implantacao-crm-b2b-ia-comercial-funil-vendas',
    excerpt: 'Como estruturamos esteiras comerciais modernas que acompanham reuniões, follow-ups de propostas e fechamentos sem depender da memória dos vendedores.',
    meta_title: 'Implantação de CRM B2B e IA Comercial | Consultoria Infinity',
    meta_description: 'Organize seu time de vendas com CRM moderno, automações de follow-up e agentes de IA comercial integrados ao WhatsApp e e-mail.',
    cover_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
    tags: ['CRM B2B', 'Automação Comercial', 'Vendas B2B', 'IA', 'Pipeline', 'Consultoria'],
    status: 'published',
    author_name: 'Angelo Marques',
    reading_time: 6,
    views: 430,
    published_at: '2026-03-17T08:00:00.000Z',
    created_at: '2026-03-17T08:00:00.000Z',
    blog_categories: {
      name: 'CRM & Vendas',
      slug: 'crm-vendas',
      color: '#00DF81',
      text_color: '#070B18',
    },
    content: `
      <h2>Onde os Negócios B2B Realmente Perdem Dinheiro?</h2>
      <p>Na grande maioria das empresas prestadoras de serviço, consultorias e distribuidoras, a perda de receita não acontece na captação do lead — acontece no <strong>follow-up esquecido</strong>. Um vendedor envia a proposta e nunca mais faz contato, ou demora 3 dias para responder um pedido de orçamento.</p>

      <h3>A Revolução do CRM Integrado com IA</h3>
      <p>Na consultoria de CRM da Infinity On Demand, conectamos os pontos de contato da sua empresa:</p>
      <ol>
        <li><strong>Kanban Visual de Negociações:</strong> Cada oportunidade passa por etapas claras: Lead Qualificado → Reunião Agendada → Proposta Apresentada → Contrato em Assinatura.</li>
        <li><strong>Alertas Inteligentes de Estagnação:</strong> Se um lead fica mais de 48h sem interação, o gestor recebe alerta imediato.</li>
        <li><strong>Assistente de IA Comercial:</strong> Redige resumos das conversas, sugere a melhor abordagem de fechamento e preenche campos do contrato automaticamente.</li>
      </ol>

      <p>Uma equipe com processos comerciais automatizados fecha até 3 vezes mais propostas com o mesmo número de leads gerados.</p>
    `,
  },
  {
    id: 'seed-post-7',
    title: 'E-commerce de Joias e Semijoias de Alta Conversão: O Caso de Sucesso da Elys Calheiros',
    slug: 'ecommerce-joias-semijoias-alta-conversao-elys-calheiros',
    excerpt: 'Análise detalhada da experiência de compra, fotografia de produto e checkout de alta confiabilidade aplicados no e-commerce da Elys Calheiros Joias.',
    meta_title: 'Case de Sucesso: E-commerce de Joias Elys Calheiros | Infinity',
    meta_description: 'Veja como a Infinity On Demand desenvolveu a loja virtual de luxo da Elys Calheiros Joias com foco em encantamento visual e alta conversão.',
    cover_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    tags: ['E-commerce', 'Joias', 'Semijoias', 'Elys Calheiros', 'Design de Luxo', 'UX'],
    status: 'published',
    author_name: 'Angelo Marques',
    reading_time: 5,
    views: 612,
    published_at: '2026-03-17T15:45:00.000Z',
    created_at: '2026-03-17T15:45:00.000Z',
    blog_categories: {
      name: 'E-commerce',
      slug: 'ecommerce',
      color: '#00AAFF',
      text_color: '#ffffff',
    },
    content: `
      <h2>O Desafio de Vender Luxo e Detalhes no Meio Digital</h2>
      <p>O mercado de joias e semijoias depende visceralmente da percepção de valor e confiança. O cliente precisa ter certeza do acabamento da peça, do banho de ouro, do brilho das pedras e da segurança absoluta na entrega.</p>

      <h3>O Projeto Elys Calheiros Joias</h3>
      <p>Desenvolvido pela equipe da Infinity On Demand, o e-commerce da <a href="https://elyscalheirosjoias.com.br" target="_blank" rel="noopener">Elys Calheiros</a> foi arquitetado para transmitir sofisticação imediata em cada detalhe:</p>
      <ul>
        <li><strong>Galeria de Alta Definição com Macro Zoom:</strong> Permite visualizar os detalhes mais delicados de cada anel, colar e brinco sem perda de qualidade visual.</li>
        <li><strong>Tabelas Interativas de Medidas de Anel:</strong> Guias visuais que eliminam as dúvidas de numeração e reduzem em 80% as solicitações de troca.</li>
        <li><strong>Checkout Blindado com Garantia Visível:</strong> Selos de garantia, certificado de autenticidade e opções de parcelamento sem juros destacados na página de produto.</li>
      </ul>

      <p>O resultado é uma experiência digital à altura das joalherias mais renomadas do país, com clientes comprando com total segurança e recorrência.</p>
    `,
  },
  {
    id: 'seed-post-8',
    title: 'Inteligência Artificial para Pequenos Negócios: Como Começar Sem Gastar Fortunas',
    slug: 'inteligencia-artificial-para-pequenos-negocios-guia-pratico',
    excerpt: 'Desmistificamos o uso da Inteligência Artificial em PMEs. Aplicações práticas para atendimento ao cliente, geração de relatórios e tomada de decisão.',
    meta_title: 'IA para Pequenos Negócios: Guia Prático de Implementação | Infinity',
    meta_description: 'Aprenda como pequenas e médias empresas estão utilizando inteligência artificial para automatizar tarefas operacionais e acelerar vendas.',
    cover_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80',
    tags: ['Inteligência Artificial', 'PMEs', 'Automação', 'Inovação', 'Chatbots', 'Produtividade'],
    status: 'published',
    author_name: 'Angelo Marques',
    reading_time: 6,
    views: 825,
    published_at: '2026-03-18T09:00:00.000Z',
    created_at: '2026-03-18T09:00:00.000Z',
    blog_categories: {
      name: 'Inovação & AI',
      slug: 'inovacao-ai',
      color: '#00DF81',
      text_color: '#070B18',
    },
    content: `
      <h2>A IA Não é Apenas para Big Techs do Vale do Silício</h2>
      <p>Muito se fala sobre Inteligência Artificial, mas a maioria dos donos de negócios ainda pensa que implementar IA exige orçamentos milionários e times de cientistas de dados. A realidade em 2026 é exatamente o oposto: pequenas operações ganham escala de gigantes ao aplicar soluções modulares.</p>

      <h3>3 Aplicações Imediatas de IA para PMEs:</h3>
      <ol>
        <li><strong>Triagem Comercial 24/7 no WhatsApp:</strong> Agentes de IA treinados na tabela de preços e catálogo da empresa que respondem perguntas frequentes em segundos e qualificam o lead.</li>
        <li><strong>Análise Preditiva de Caixa:</strong> Algoritmos que cruzam contas a pagar, sazonalidade e histórico de faturamento para prever a necessidade de capital de giro com semanas de antecedência.</li>
        <li><strong>Criação Contínua de Conteúdo e Campanhas:</strong> Geração acelerada de variações de textos persuasivos para anúncios e e-mails promocionais.</li>
      </ol>

      <p>A tecnologia existe para tirar o peso do trabalho repetitivo das suas costas e liberar sua mente para a estratégia do negócio.</p>
    `,
  },
  {
    id: 'seed-post-9',
    title: 'Lead Scoring Preditivo: Como Separar Curiosos de Clientes Prontos para Fechar',
    slug: 'lead-scoring-preditivo-qualificacao-automatica-clientes',
    excerpt: 'Pare de perder tempo com contatos que não têm orçamento ou perfil de compra. Conheça as métricas matemáticas que qualificam seus leads em tempo real.',
    meta_title: 'Lead Scoring Preditivo: Qualificação Automática | Infinity Forms',
    meta_description: 'Entenda a metodologia de Lead Scoring inteligente que ranqueia oportunidades de vendas de 0 a 100 antes de chegar ao time comercial.',
    cover_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    tags: ['Lead Scoring', 'Qualificação', 'Vendas', 'CRO', 'Funil Comercial', 'Infinity Forms'],
    status: 'published',
    author_name: 'Angelo Marques',
    reading_time: 5,
    views: 490,
    published_at: '2026-03-18T11:30:00.000Z',
    created_at: '2026-03-18T11:30:00.000Z',
    blog_categories: {
      name: 'Formulários & Conversão',
      slug: 'formularios',
      color: '#00DF81',
      text_color: '#070B18',
    },
    content: `
      <h2>A Síndrome do "Vendedor Cansado"</h2>
      <p>Quando uma campanha de tráfego gera 100 mensagens por dia no WhatsApp, mas 90 delas são de pessoas sem orçamento, a equipe de vendas fica exausta e desmotivada. O pior: os 10 clientes de alto valor acabam recebendo um atendimento demorado e fecham com o concorrente.</p>

      <h3>Como o Algoritmo de Lead Scoring Funciona no Infinity Forms:</h3>
      <p>Conforme o visitante responde ao formulário interativo, critérios ponderados somam pontos à nota do lead:</p>
      <ul>
        <li><strong>Faixa de Faturamento:</strong> Empresas faturando acima de R$ 50 mil/mês somam +25 pontos imediatos.</li>
        <li><strong>Autoridade de Decisão:</strong> Proprietários e sócios somam +15 pontos em relação a colaboradores sem poder de compra.</li>
        <li><strong>Momento de Compra:</strong> Marcas em reestruturação urgente pontuam mais alto do que ideias ainda no papel.</li>
      </ul>

      <p>Com essa métrica, o CRM prioriza no topo da fila os leads com nota 80+, permitindo que o time comercial atue de forma cirúrgica nos clientes mais rentáveis.</p>
    `,
  },
  {
    id: 'seed-post-10',
    title: 'Consultoria em Transformação Digital: Da Ideia no Posto de Gasolina a Ecossistemas Digitais',
    slug: 'consultoria-transformacao-digital-ecossistemas-escalaveis',
    excerpt: 'A história e os princípios de engenharia da Infinity On Demand que transformam negócios tradicionais em operações escaláveis orientadas por tecnologia.',
    meta_title: 'Consultoria em Transformação Digital | Infinity On Demand',
    meta_description: 'Consultoria de tecnologia e engenharia digital sob demanda. Do diagnóstico à implantação de plataformas proprietárias em nuvem.',
    cover_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    tags: ['Consultoria', 'Transformação Digital', 'Tecnologia', 'Angelo Marques', 'História', 'Inovação'],
    status: 'published',
    author_name: 'Angelo Marques',
    reading_time: 7,
    views: 940,
    published_at: '2026-03-18T14:00:00.000Z',
    created_at: '2026-03-18T14:00:00.000Z',
    blog_categories: {
      name: 'Consultoria & Tech',
      slug: 'consultoria-tech',
      color: '#00AAFF',
      text_color: '#ffffff',
    },
    content: `
      <h2>Nascidos do Impossível: Uma Conversa que Mudou Tudo</h2>
      <p>Em plena pandemia de 2020, em um posto de gasolina em Recife, dois profissionais conversavam sobre o medo de perder o emprego e a urgência que as empresas tinham de se digitalizar. Ali nasceu a <strong>Infinity On Demand</strong>: não como uma agência comum, mas como uma consultoria prática de tecnologia sob demanda.</p>

      <h3>Nossa Filosofia de Entrega:</h3>
      <p>Acreditamos que tecnologia corporativa não pode ser lenta, burocrática ou incompreensível para o dono da empresa. Desenvolvemos soluções com três compromissos inegociáveis:</p>
      <ul>
        <li><strong>Velocidade com Robustez:</strong> Entregamos em dias o que o mercado tradicional leva meses para prototipar.</li>
        <li><strong>Foco em Retorno Financeiro Real:</strong> Cada linha de código ou campanha no ar precisa justificar seu custo no aumento de margem ou receita da empresa.</li>
        <li><strong>Arquitetura Proprietária e Escalável:</strong> Seus dados, sua marca e sua base de clientes pertencem a você, sem amarras com plataformas de terceiros.</li>
      </ul>

      <p>Seja para criar um novo e-commerce, automatizar a gestão de uma rede de supermercados ou escalar sua aquisição de clientes com tráfego pago de alto nível, conte com a Infinity On Demand.</p>
    `,
  },
];
