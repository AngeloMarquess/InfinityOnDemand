import fs from 'fs';
import path from 'path';

export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'all';
export type TriggerType = 'post_comment' | 'new_follower' | 'story_mention' | 'direct_keyword' | 'live_comment';

export interface SocialAutomationRule {
  id: string;
  name: string;
  platform: SocialPlatform;
  triggerType: TriggerType;
  postTarget: 'all_posts' | 'specific_post';
  targetPostId?: string;
  targetPostUrl?: string;
  keywordMatching: 'exact' | 'contains' | 'any';
  keywords: string[];
  publicReplyEnabled: boolean;
  publicReplies: string[]; // Variações de resposta pública no comentário (rotação anti-spam)
  privateDmMessage: string; // Mensagem privada com variáveis {{name}} e {{username}}
  attachmentType?: 'none' | 'image' | 'file';
  attachmentUrl?: string;
  attachmentName?: string;
  buttonText?: string;
  buttonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  status: 'active' | 'paused';
  delaySeconds: number; // Delay humanizado antes de responder (2 a 10s)
  tags: string[];
  stats: {
    triggersCount: number;
    repliesSent: number;
    dmsSent: number;
    lastTriggeredAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SocialContact {
  id: string;
  platform: SocialPlatform;
  username: string;
  fullName: string;
  avatarUrl?: string;
  lastInteraction: string;
  within24hWindow: boolean;
  ruleTriggered: string;
  lastMessageSent: string;
  tags: string[];
  status: 'active' | 'lead_hot' | 'converted';
}

export interface ComplianceWindowStats {
  status: 'compliant' | 'warning' | 'restricted';
  totalChecked: number;
  within24hCount: number;
  outside24hBlocked: number;
  complianceRate: number; // Ex: 100%
  lastAuditDate: string;
  notes: string;
}

export interface SocialAutomationConfig {
  engineToken?: string;
  engineConnected: boolean;
  engineAccountName?: string;
  manychatApiKey?: string;
  manychatConnected?: boolean;
  manychatPageName?: string;
  // Instagram
  instagramAccessToken?: string;
  instagramAccountId?: string;
  instagramUsername?: string;
  instagramConnected: boolean;
  // Facebook
  facebookPageId?: string;
  facebookPageAccessToken?: string;
  facebookPageName?: string;
  facebookConnected: boolean;
  // TikTok
  tiktokClientKey?: string;
  tiktokClientSecret?: string;
  tiktokAccessToken?: string;
  tiktokConnected: boolean;
  // YouTube
  youtubeApiKey?: string;
  youtubeChannelId?: string;
  youtubeConnected: boolean;
  // Flags globais
  antiSpamVariationEnabled: boolean;
  humanizedDelayEnabled: boolean;
  autoSyncWithSdr: boolean;
}

export interface SocialAutomationDatabase {
  rules: SocialAutomationRule[];
  contacts: SocialContact[];
  compliance: ComplianceWindowStats;
  config: SocialAutomationConfig;
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'social-automations.json');
const TMP_DATA_FILE = path.join('/tmp', 'social-automations.json');

const INITIAL_RULES: SocialAutomationRule[] = [
  {
    id: 'rule-instagram-velocidade-ia',
    name: 'Instagram • Post "Velocidade de Resposta no WhatsApp" (Comenta "IA")',
    platform: 'instagram',
    triggerType: 'post_comment',
    postTarget: 'specific_post',
    targetPostUrl: 'https://www.instagram.com/p/velocidade-resposta-ia/',
    keywordMatching: 'contains',
    keywords: ['IA', 'I.A.', 'QUERO IA', 'ROBÔ', 'ROBO', 'WHATSAPP', 'SDR', 'FLASH SDR'],
    publicReplyEnabled: true,
    publicReplies: [
      'Acabei de te enviar como funciona no Direct! Dá uma olhada lá 🚀',
      'Te mandei no privado como não perder mais vendas no WhatsApp 😉',
      'Prontinho! Quem responde primeiro leva o cliente. Mandei na sua DM 📩',
      'Enviado no seu direct! Confere o material da IA para WhatsApp 🔥'
    ],
    privateDmMessage: 'Fala {{name}}! 🚀 Vi que você comentou no nosso post sobre Velocidade de Resposta no WhatsApp.\n\nA verdade é dura: se sua empresa demora 15 minutos para responder um lead, 70% das chances de venda vão para o concorrente.\n\nCom o Flash SDR da Infinity, seu WhatsApp responde em menos de 10 segundos com Inteligência Artificial, qualifica o cliente e agenda o atendimento ou fecha a venda 24 horas por dia.\n\nBaixe o PDF em anexo e clique abaixo para ver uma demonstração gratuita ao vivo:',
    attachmentType: 'file',
    attachmentUrl: 'https://infinityondemand.com.br/materiais/Checklist-Velocidade-IA-WhatsApp.pdf',
    attachmentName: 'Checklist_Velocidade_IA_WhatsApp.pdf',
    buttonText: '⚡ Ver Demonstração da IA no WhatsApp',
    buttonUrl: 'https://infinityondemand.com.br/#demo',
    secondaryButtonText: '📲 Testar Robô no WhatsApp Agora',
    secondaryButtonUrl: 'https://wa.me/5581981280719?text=Olá,%20vi%20o%20post%20sobre%20IA%20no%20Instagram%20e%20quero%20testar',
    status: 'active',
    delaySeconds: 3,
    tags: ['Lead-Post-IA', 'Velocidade-WhatsApp', 'Interesse-Flash-SDR'],
    stats: {
      triggersCount: 12,
      repliesSent: 12,
      dmsSent: 12,
      lastTriggeredAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-instagram-metricas',
    name: 'Instagram • Post Comentário "MÉTRICAS" → Envio de Checklist & Diagnóstico',
    platform: 'instagram',
    triggerType: 'post_comment',
    postTarget: 'all_posts',
    keywordMatching: 'contains',
    keywords: ['METRICAS', 'MÉTRICAS', 'PLANILHA', 'CHECKLIST', 'QUERO', 'EU QUERO'],
    publicReplyEnabled: true,
    publicReplies: [
      'Acabei de te enviar o checklist completo no Direct! Dá uma conferida lá 🚀',
      'Te chamei no privado com o material! Dá uma olhada nas suas mensagens 📩',
      'Prontinho! Mandei o checklist no seu direct agora mesmo 😉',
      'Checklist enviado com sucesso no seu direct! Bons insights 📊🔥'
    ],
    privateDmMessage: 'Fala {{name}}! 🚀 Vi que você comentou no nosso post sobre métricas de performance.\n\nPreparamos esse checklist exclusivo com os 3 números vitais que separam uma operação amadora de uma empresa escalável:\n\n1️⃣ Ticket médio por pedido\n2️⃣ Tempo médio de ciclo/produção\n3️⃣ Taxa de recompra e retenção\n\nClique no botão abaixo para baixar o material e agendar seu diagnóstico gratuito:',
    buttonText: '📊 Baixar Checklist & Agendar Demo',
    buttonUrl: 'https://infinityondemand.com.br/relatorios_infinity',
    secondaryButtonText: '💬 Falar no WhatsApp',
    secondaryButtonUrl: 'https://wa.me/5581981280719?text=Olá,%20comentei%20no%20Instagram%20e%20gostaria%20de%20saber%20mais',
    status: 'active',
    delaySeconds: 4,
    tags: ['Lead-Métricas', 'Instagram-Comment', 'Interessado-Gestão'],
    stats: {
      triggersCount: 47,
      repliesSent: 47,
      dmsSent: 46,
      lastTriggeredAt: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    },
    createdAt: '2026-03-01T12:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-welcome-followers',
    name: 'Instagram & Facebook • Boas-vindas para Novos Seguidores',
    platform: 'instagram',
    triggerType: 'new_follower',
    postTarget: 'all_posts',
    keywordMatching: 'any',
    keywords: [],
    publicReplyEnabled: false,
    publicReplies: [],
    privateDmMessage: 'Seja muito bem-vindo(a) à Infinity On Demand, {{name}}! 👋\n\nAqui nós transformamos operações locais e e-commerces em máquinas previsíveis de vendas com Tráfego Estratégico e IA.\n\n🎁 Para começar com o pé direito, preparamos uma Consultoria de Posicionamento Digital Gratuita para o seu negócio. Quer dar uma olhada?',
    buttonText: '🚀 Agendar Consultoria Gratuita',
    buttonUrl: 'https://infinityondemand.com.br',
    secondaryButtonText: '📲 Conhecer Nossos Cases',
    secondaryButtonUrl: 'https://infinityondemand.com.br/#cases',
    status: 'active',
    delaySeconds: 6,
    tags: ['Novo-Seguidor', 'Boas-Vindas', 'Topo-Funil'],
    stats: {
      triggersCount: 89,
      repliesSent: 0,
      dmsSent: 88,
      lastTriggeredAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    createdAt: '2026-03-05T09:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-instagram-demo-sistema',
    name: 'Instagram • Reels Comentário "DEMO" / "SISTEMA" → Link do Sistema',
    platform: 'instagram',
    triggerType: 'post_comment',
    postTarget: 'all_posts',
    keywordMatching: 'contains',
    keywords: ['DEMO', 'SISTEMA', 'TESTE', 'PLATAFORMA', 'VALOR', 'PREÇO'],
    publicReplyEnabled: true,
    publicReplies: [
      'Te mandei o acesso da demonstração na DM! Confere lá 🚀',
      'Demonstração ao vivo enviada no seu direct! 🎯',
      'Mandei no seu privado! Dá uma olhada no direct 😉'
    ],
    privateDmMessage: 'Fala {{name}}! 🚀 Que ótimo ver seu interesse na nossa plataforma de tecnologia e delivery.\n\nChega de pagar comissões abusivas de 27% para marketplaces. Tenha seu próprio ecossistema com app de entregador, painel kanban e rastreio em tempo real.\n\nClique abaixo para testar o sistema agora mesmo:',
    buttonText: '⚡ Ver Demonstração Ao Vivo',
    buttonUrl: 'https://infinityondemand.com.br',
    secondaryButtonText: '📲 Falar com Especialista',
    secondaryButtonUrl: 'https://wa.me/5581981280719',
    status: 'active',
    delaySeconds: 3,
    tags: ['Lead-Demo', 'Interesse-Software', 'Fundo-Funil'],
    stats: {
      triggersCount: 31,
      repliesSent: 31,
      dmsSent: 31,
      lastTriggeredAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    createdAt: '2026-03-10T14:30:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-story-mention',
    name: 'Instagram • Resposta Automática a Menções em Stories',
    platform: 'instagram',
    triggerType: 'story_mention',
    postTarget: 'all_posts',
    keywordMatching: 'any',
    keywords: [],
    publicReplyEnabled: false,
    publicReplies: [],
    privateDmMessage: 'Muito obrigado por marcar a @infinityondemand no seu story, {{name}}! 🔥\n\nAdoramos acompanhar o crescimento de quem compartilha da nossa visão de tecnologia e inteligência aplicada aos negócios. Como podemos te ajudar a escalar hoje?',
    buttonText: '🌐 Conhecer a Infinity',
    buttonUrl: 'https://infinityondemand.com.br',
    status: 'active',
    delaySeconds: 5,
    tags: ['Mencao-Story', 'Engajamento-Alto'],
    stats: {
      triggersCount: 19,
      repliesSent: 0,
      dmsSent: 19,
      lastTriggeredAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    },
    createdAt: '2026-03-12T11:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-tiktok-comments',
    name: 'TikTok • Auto-resposta em Vídeos Virais ("QUERO" / "INFO")',
    platform: 'tiktok',
    triggerType: 'post_comment',
    postTarget: 'all_posts',
    keywordMatching: 'contains',
    keywords: ['QUERO', 'COMO FAZ', 'INFO', 'LINK', 'SITE'],
    publicReplyEnabled: true,
    publicReplies: [
      'Link liberado no primeiro comentário fixado e na bio do perfil! 🚀',
      'Confere o link direto na nossa bio para agendar sua consultoria 😉',
      'Manda uma DM pra gente ou clica no link do perfil para receber o acesso! 🔥'
    ],
    privateDmMessage: 'Olá {{name}}! Obrigado por comentar no nosso TikTok. O link para a consultoria de IA e presença digital está disponível aqui:',
    buttonText: '🚀 Acessar Consultoria Grátis',
    buttonUrl: 'https://infinityondemand.com.br',
    status: 'active',
    delaySeconds: 3,
    tags: ['TikTok-Lead', 'Viral-Traffic'],
    stats: {
      triggersCount: 24,
      repliesSent: 24,
      dmsSent: 22,
      lastTriggeredAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    createdAt: '2026-03-14T16:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-youtube-comments',
    name: 'YouTube • Auto-reply em Comentários de Vídeos & Shorts',
    platform: 'youtube',
    triggerType: 'post_comment',
    postTarget: 'all_posts',
    keywordMatching: 'contains',
    keywords: ['QUERO', 'SISTEMA', 'COMO FUNCIONA', 'ORÇAMENTO', 'CONTATO'],
    publicReplyEnabled: true,
    publicReplies: [
      'Fala! Valeu pelo comentário! Todos os links de demonstração e contato estão fixados na descrição e no primeiro comentário fixado deste vídeo 🚀',
      'Excelente pergunta! Acesse https://infinityondemand.com.br ou fale direto com nosso estrategista pelo WhatsApp no link da descrição 📈'
    ],
    privateDmMessage: '',
    status: 'active',
    delaySeconds: 2,
    tags: ['YouTube-Subscriber', 'High-Intent'],
    stats: {
      triggersCount: 15,
      repliesSent: 15,
      dmsSent: 0,
      lastTriggeredAt: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
    },
    createdAt: '2026-03-15T18:00:00.000Z',
    updatedAt: new Date().toISOString(),
  }
];

const INITIAL_CONTACTS: SocialContact[] = [
  {
    id: 'cont-1',
    platform: 'instagram',
    username: '@gabriel.restaurante',
    fullName: 'Gabriel Vasconcelos',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    lastInteraction: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    within24hWindow: true,
    ruleTriggered: 'Instagram • Post Comentário "MÉTRICAS"',
    lastMessageSent: 'Fala Gabriel! 🚀 Vi que você comentou no nosso post sobre métricas...',
    tags: ['Lead-Métricas', 'Quente', 'Restaurante'],
    status: 'lead_hot',
  },
  {
    id: 'cont-2',
    platform: 'instagram',
    username: '@carol_boutique',
    fullName: 'Carolina Mendes',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    lastInteraction: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    within24hWindow: true,
    ruleTriggered: 'Instagram & Facebook • Boas-vindas para Novos Seguidores',
    lastMessageSent: 'Seja muito bem-vindo(a) à Infinity On Demand, Carolina! 👋...',
    tags: ['Novo-Seguidor', 'Moda'],
    status: 'active',
  },
  {
    id: 'cont-3',
    platform: 'instagram',
    username: '@marcos_pizzaria',
    fullName: 'Marcos Almeida',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    lastInteraction: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    within24hWindow: true,
    ruleTriggered: 'Instagram • Reels Comentário "DEMO" / "SISTEMA"',
    lastMessageSent: 'Fala Marcos! 🚀 Que ótimo ver seu interesse na nossa plataforma...',
    tags: ['Lead-Demo', 'Delivery', 'Demo Agendada'],
    status: 'converted',
  },
  {
    id: 'cont-4',
    platform: 'facebook',
    username: 'roberto.silva.emp',
    fullName: 'Roberto Silva',
    lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    within24hWindow: true,
    ruleTriggered: 'Instagram & Facebook • Boas-vindas para Novos Seguidores',
    lastMessageSent: 'Seja muito bem-vindo(a) à Infinity On Demand, Roberto! 👋...',
    tags: ['Facebook-Page', 'E-commerce'],
    status: 'active',
  },
  {
    id: 'cont-5',
    platform: 'tiktok',
    username: '@lucas_growth',
    fullName: 'Lucas Fernandes',
    lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    within24hWindow: false,
    ruleTriggered: 'TikTok • Auto-resposta em Vídeos Virais ("QUERO" / "INFO")',
    lastMessageSent: 'Olá Lucas! Obrigado por comentar no nosso TikTok...',
    tags: ['TikTok-Lead', 'Janela Expirada'],
    status: 'active',
  }
];

const INITIAL_COMPLIANCE: ComplianceWindowStats = {
  status: 'compliant',
  totalChecked: 142,
  within24hCount: 139,
  outside24hBlocked: 3,
  complianceRate: 100.0,
  lastAuditDate: new Date().toISOString(),
  notes: 'Nenhum bot tentou enviar mensagens fora da janela de 24 horas sem a devida Message Tag permitida pela Meta. A conta está com saúde máxima e conformidade ativa.',
};

const INITIAL_CONFIG: SocialAutomationConfig = {
  engineToken: '',
  engineConnected: false,
  engineAccountName: 'Angelo Brito | Agência de Marketing Digital',
  manychatApiKey: '',
  manychatConnected: false,
  // Instagram
  instagramAccessToken: process.env.INSTAGRAM_ACCESS_TOKEN || 'EAAPIjRG4SCMBTCnW77FLanrseYevZA7WML88zhKGVR5LKZC2DpiwHOII0tV9VWYBCLiiB15coq4rd84rr2WzPIh9nUKHQF9tnzFsGZBl8bD9L3ZB2VJBVFfLEmUAd9UF6LPTuSA9bnpwzYPDMhG9zIBE24opIxTyY371fVvVPohyE2aFiDZB6uTMXLzQMHwVJPavZBjLz3OaMtyW224ZB2EZCAGoxfZCZCWSjyuGZBTNSbh4RMZD',
  instagramAccountId: process.env.INSTAGRAM_USER_ID || '17841467177463270',
  instagramUsername: '@infinityondemand',
  instagramConnected: true,
  // Facebook
  facebookPageId: process.env.META_PAGE_ID || '308754922483880',
  facebookPageAccessToken: process.env.META_USER_ACCESS_TOKEN || 'EAAPIjRG4SCMBTCnW77FLanrseYevZA7WML88zhKGVR5LKZC2DpiwHOII0tV9VWYBCLiiB15coq4rd84rr2WzPIh9nUKHQF9tnzFsGZBl8bD9L3ZB2VJBVFfLEmUAd9UF6LPTuSA9bnpwzYPDMhG9zIBE24opIxTyY371fVvVPohyE2aFiDZB6uTMXLzQMHwVJPavZBjLz3OaMtyW224ZB2EZCAGoxfZCZCWSjyuGZBTNSbh4RMZD',
  facebookPageName: 'Infinity on Demand',
  facebookConnected: true,
  // TikTok
  tiktokClientKey: '',
  tiktokClientSecret: '',
  tiktokAccessToken: '',
  tiktokConnected: false,
  // YouTube
  youtubeApiKey: '',
  youtubeChannelId: '@infinityondemand',
  youtubeConnected: false,
  // Globais
  antiSpamVariationEnabled: true,
  humanizedDelayEnabled: true,
  autoSyncWithSdr: true,
};

function getStorageFilePath(): string {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    return DATA_FILE;
  } catch {
    return TMP_DATA_FILE;
  }
}

export function loadSocialAutomations(): SocialAutomationDatabase {
  try {
    const filePath = getStorageFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      let rulesList = Array.isArray(data.rules) && data.rules.length > 0 ? data.rules : INITIAL_RULES;
      if (!rulesList.some((r: any) => r.id === 'rule-instagram-velocidade-ia')) {
        rulesList.unshift(INITIAL_RULES[0]);
      }
      const mergedConfig = { ...INITIAL_CONFIG, ...(data.config || {}) };
      if (!mergedConfig.instagramAccessToken || mergedConfig.instagramAccessToken.length < 20) {
        mergedConfig.instagramAccessToken = INITIAL_CONFIG.instagramAccessToken;
        mergedConfig.instagramConnected = true;
      }
      if (!mergedConfig.facebookPageAccessToken || mergedConfig.facebookPageAccessToken.length < 20) {
        mergedConfig.facebookPageAccessToken = INITIAL_CONFIG.facebookPageAccessToken;
        mergedConfig.facebookConnected = true;
      }

      return {
        rules: rulesList,
        contacts: Array.isArray(data.contacts) ? data.contacts : INITIAL_CONTACTS,
        compliance: data.compliance || INITIAL_COMPLIANCE,
        config: mergedConfig,
      };
    }
  } catch (err) {
    console.error('[social-automations] Error reading file, using initial data:', err);
  }

  // Se não existir, salva o inicial e retorna
  const initDb: SocialAutomationDatabase = {
    rules: INITIAL_RULES,
    contacts: INITIAL_CONTACTS,
    compliance: INITIAL_COMPLIANCE,
    config: INITIAL_CONFIG,
  };
  saveSocialAutomations(initDb);
  return initDb;
}

export function saveSocialAutomations(db: SocialAutomationDatabase): boolean {
  try {
    const filePath = getStorageFilePath();
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[social-automations] Error saving file:', err);
    try {
      fs.writeFileSync(TMP_DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
      return true;
    } catch {
      return false;
    }
  }
}
