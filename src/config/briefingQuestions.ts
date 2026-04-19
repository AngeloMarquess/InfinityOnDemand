export type QuestionType = 'text' | 'textarea' | 'radio' | 'checkbox';

export interface BriefingQuestion {
  id: string;
  label: string;
  type: QuestionType;
  options?: string[]; // For radio or checkbox
  required?: boolean;
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
      { id: 'logo_name', label: 'Nome que deve aparecer no Logotipo? (Caso seja diferente da empresa)', type: 'text' },
      { id: 'slogan', label: 'Slogan (se houver)', type: 'text' },
      { id: 'products', label: 'Quais produtos ou serviços você oferece?', type: 'textarea', required: true },
      { id: 'differentiator', label: 'O que você faz melhor que seus concorrentes?', type: 'textarea' },
      { id: 'competitors', label: 'Cite 2 ou 3 concorrentes diretos (Instagram ou site)', type: 'textarea' },
      { id: 'audience', label: 'Descreva seu público principal (Idade, gênero, classe, etc)', type: 'textarea', required: true },
      { id: 'feeling', label: 'Como quer que o público se sinta ao ver sua marca? (Ex: confiança, luxo)', type: 'text' },
      { id: 'adjectives', label: 'Quais adjetivos representam a marca?', type: 'checkbox', options: ['Moderna', 'Clássica', 'Acessível', 'Premium/Luxo', 'Séria', 'Divertida', 'Minimalista'] },
      { id: 'colors_yes', label: 'Possui cores preferidas? Quais?', type: 'text' },
      { id: 'colors_no', label: 'Existe alguma cor que NÃO deseja utilizar?', type: 'text' },
      { id: 'references', label: 'Envie links de logos que você usa como referência (que você gosta)', type: 'textarea' },
      { id: 'no_want', label: 'O que você definitivamente NÃO quer no seu logotipo?', type: 'textarea' }
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
      { id: 'frequency', label: 'Qual a quantidade ou frequência de criativos necessários?', type: 'text' }
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
      // Includes generic basic logo ones as well conceptually, keeping it brief here to combine info.
      { id: 'extra_materials', label: 'Quais materiais extras de branding você precisa? (Papelaria, manual da marca, etc)', type: 'textarea' }
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
      { id: 'budget_deadline', label: 'Você possui um prazo de entrega limite ou expectativa de orçamento?', type: 'text' }
    ]
  }
};
