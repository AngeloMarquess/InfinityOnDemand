export type QuestionType = 'text' | 'textarea' | 'radio' | 'checkbox' | 'file';

export interface BriefingQuestion {
  id: string;
  label: string;
  type: QuestionType;
  options?: string[]; // For radio or checkbox
  required?: boolean;
  accept?: string; // For file type, e.g. 'image/*'
  maxFiles?: number;
}

export interface BriefingCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: BriefingQuestion[];
}

export const briefingCategories: Record<string, BriefingCategory> = {
  logo: {
    id: 'logo',
    title: 'Logo',
    description: 'Criação de logotipo e marca',
    icon: 'Palette',
    questions: [
      { id: 'logo_name', label: 'Nome que deve aparecer no Logotipo (caso seja diferente)', type: 'text' },
      { id: 'slogan', label: 'Slogan (se houver)', type: 'text' },
      { id: 'segment', label: 'Ramo de atuação', type: 'text', required: true },
      { id: 'city_state', label: 'Cidade / Estado', type: 'text' },
      { id: 'instagram_site', label: 'Instagram / Site', type: 'text' },
      { id: 'market_time', label: 'Tempo no mercado', type: 'text' },
      { id: 'describe_company', label: 'Descreva sua empresa como se estivesse apresentando para um cliente novo', type: 'textarea', required: true },
      { id: 'products', label: 'Quais produtos ou serviços você oferece?', type: 'textarea', required: true },
      { id: 'main_differentiator', label: 'Qual o principal diferencial da sua empresa hoje?', type: 'textarea' },
      { id: 'differentiator', label: 'O que você faz melhor que seus concorrentes?', type: 'textarea' },
      { id: 'competitors', label: 'Cite 2 ou 3 concorrentes diretos (Instagram ou site)', type: 'textarea' },
      { id: 'gender', label: 'Gênero predominante do público', type: 'radio', options: ['Masculino', 'Feminino', 'Ambos'] },
      { id: 'age_range', label: 'Faixa etária predominante', type: 'radio', options: ['18-25', '25-35', '35-45', '45-60', '60+'] },
      { id: 'social_class', label: 'Classe social predominante', type: 'radio', options: ['A (Alta)', 'B (Média-alta)', 'C (Média)', 'D/E (Popular)'] },
      { id: 'feeling', label: 'Como você quer que seu público se sinta ao ver sua marca? (Ex: confiança, desejo, exclusividade)', type: 'text' },
      { id: 'problem_solved', label: 'Qual problema sua empresa resolve na vida do cliente?', type: 'textarea' },
      { id: 'adjectives', label: 'Marque os adjetivos que representam a sua marca', type: 'checkbox', options: ['Moderna', 'Clássica', 'Acessível', 'Premium/Luxo', 'Séria', 'Divertida', 'Minimalista', 'Ousada', 'Elegante', 'Inovadora'] },
      { id: 'brand_persona', label: 'Se sua marca fosse uma pessoa, como ela se vestiria e se comportaria?', type: 'textarea' },
      { id: 'colors_yes', label: 'Possui cores definidas? Se sim, quais?', type: 'text' },
      { id: 'colors_no', label: 'Existe alguma cor que NÃO deseja utilizar?', type: 'text' },
      { id: 'logo_style', label: 'Qual o estilo de logotipo que prefere?', type: 'radio', options: ['Tipográfico (apenas letras)', 'Símbolo + Texto', 'Monograma (iniciais)', 'Emblema/Badge', 'Abstrato', 'Não sei / Estou aberto'] },
      { id: 'logo_elements', label: 'Existe algum elemento que deseja incluir? (Ex: folha, casa, avião, coroa, iniciais)', type: 'text' },
      { id: 'references_upload', label: 'Envie referências de logos que você gosta', type: 'file', accept: 'image/*', maxFiles: 5 },
      { id: 'no_want', label: 'O que você definitivamente NÃO quer no seu logotipo?', type: 'textarea' },
      { id: 'had_logo_before', label: 'Já teve logotipo antes?', type: 'radio', options: ['Sim', 'Não'] },
      { id: 'old_logo_upload', label: 'Se sim, envie o logotipo anterior', type: 'file', accept: 'image/*', maxFiles: 1 },
      { id: 'mandatory_elements', label: 'Existe algo obrigatório que deve aparecer no novo logo?', type: 'text' },
      { id: 'logo_usage', label: 'Onde o logotipo será utilizado?', type: 'checkbox', options: ['Redes Sociais', 'Site', 'Cartão de Visita', 'Fachada/Placa', 'Embalagens', 'Uniformes', 'Veículos'] },
      { id: 'extra_info', label: 'Existe alguma informação importante que não foi perguntada?', type: 'textarea' },
    ]
  },
  'landing-page': {
    id: 'landing-page',
    title: 'Landing Page',
    description: 'Página de conversão/vendas',
    icon: 'LayoutTemplate',
    questions: [
      { id: 'objective', label: 'Qual o principal objetivo da página?', type: 'radio', options: ['Capturar Contatos (Leads)', 'Vender Produto/Serviço (Venda Direta)', 'Lançamento/Evento'], required: true },
      { id: 'offer', label: 'Qual o produto/serviço central que será oferecido na página e seu preço?', type: 'textarea', required: true },
      { id: 'pain_points', label: 'Quais as principais dores/problemas que o seu produto resolve?', type: 'textarea' },
      { id: 'benefits', label: 'Quais os 3 maiores benefícios do seu produto?', type: 'textarea', required: true },
      { id: 'cta', label: 'Qual é a chamada para ação principal? (Ex: Comprar Agora, Falar no WhatsApp)', type: 'text', required: true },
      { id: 'domain', label: 'Já possui domínio (ex: seunome.com.br) e hospedagem?', type: 'radio', options: ['Sim', 'Não', 'Não sei'] },
      { id: 'identity', label: 'Já tem logotipo e identidade visual prontos?', type: 'radio', options: ['Sim', 'Não'] },
      { id: 'references_upload', label: 'Envie referências de páginas similares que você gosta', type: 'file', accept: 'image/*', maxFiles: 5 },
      { id: 'references', label: 'Links de referências de páginas similares que você gosta', type: 'textarea' }
    ]
  },
  'social-media': {
    id: 'social-media',
    title: 'Social Media / Criativos',
    description: 'Posts, stories e anúncios',
    icon: 'Instagram',
    questions: [
      { id: 'objective_sm', label: 'Qual o objetivo principal dos criativos?', type: 'radio', options: ['Aumentar o Reconhecimento (Branding)', 'Vendas/Conversão e Tráfego Pago', 'Interação/Engajamento', 'Crescer Seguidores'], required: true },
      { id: 'platforms', label: 'Quais redes sociais serão o foco?', type: 'checkbox', options: ['Instagram Feed/Reels', 'Instagram Stories', 'Facebook', 'TikTok', 'LinkedIn', 'Pinterest'], required: true },
      { id: 'voice_tone', label: 'Qual o tom de voz da marca?', type: 'text', required: true },
      { id: 'content_themes', label: 'Quais as principais dores do cliente seus posts devem focar (temas)?', type: 'textarea', required: true },
      { id: 'frequency', label: 'Qual a quantidade ou frequência de criativos necessários?', type: 'text' },
      { id: 'references_upload', label: 'Envie referências visuais de posts que você gosta', type: 'file', accept: 'image/*', maxFiles: 5 },
    ]
  },
  branding: {
    id: 'branding',
    title: 'Branding / Identid. Visual',
    description: 'Identidade visual completa',
    icon: 'Sparkles',
    questions: [
      { id: 'brand_essence', label: 'Como você descreve a essência da sua marca em uma frase?', type: 'textarea', required: true },
      { id: 'positioning', label: 'Como a sua marca irá se posicionar perante a concorrência? (Mais luxo, mais barato, mais ágil)', type: 'textarea', required: true },
      { id: 'long_term', label: 'Qual a visão da marca para daqui a 5 anos?', type: 'textarea' },
      { id: 'typography', label: 'Quais estilos de fontes mais te atraem?', type: 'radio', options: ['Com serifa (Tradicionais, clássicas)', 'Sem serifa (Modernas, limpas)', 'Manuscritas (Assinaturas)', 'Letreiros (Grossas, impacto)'] },
      { id: 'extra_materials', label: 'Quais materiais extras de branding você precisa? (Papelaria, manual da marca, etc)', type: 'textarea' },
      { id: 'references_upload', label: 'Envie referências visuais de marcas que você admira', type: 'file', accept: 'image/*', maxFiles: 5 },
    ]
  },
  'video-motion': {
    id: 'video-motion',
    title: 'Vídeo / Motion',
    description: 'Vídeos e animações',
    icon: 'Video',
    questions: [
      { id: 'video_goal', label: 'Qual o principal objetivo do vídeo?', type: 'text', required: true },
      { id: 'duration', label: 'Qual a duração desejada (aprox.)?', type: 'text' },
      { id: 'platform_video', label: 'Onde o vídeo será vinculado?', type: 'radio', options: ['Instagram Reels/TikTok', 'YouTube', 'Tráfego Pago (Anúncios na Meta/Google)', 'Site Corporativo'] },
      { id: 'voiceover', label: 'Deseja incluir locução comercial (voz)?', type: 'radio', options: ['Sim, voz masculina', 'Sim, voz feminina', 'Não, apenas trilha original', 'Ainda não sei'] },
      { id: 'references_video', label: 'Coloque o link de vídeos de referência de estilo para seguirmos:', type: 'textarea' }
    ]
  },
  outro: {
    id: 'outro',
    title: 'Outro',
    description: 'Outro tipo de projeto',
    icon: 'FileText',
    questions: [
      { id: 'details', label: 'Por favor, descreva detalhadamente a sua necessidade de projeto:', type: 'textarea', required: true },
      { id: 'objective_other', label: 'Qual o principal objetivo com esse projeto?', type: 'textarea' },
      { id: 'budget_deadline', label: 'Você possui um prazo de entrega limite ou expectativa de orçamento?', type: 'text' },
      { id: 'references_upload', label: 'Envie referências visuais relevantes ao projeto', type: 'file', accept: 'image/*', maxFiles: 5 },
    ]
  }
};
