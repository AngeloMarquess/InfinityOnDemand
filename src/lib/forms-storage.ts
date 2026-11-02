import fs from 'fs';
import path from 'path';
import { getServerSupabase } from './supabase';

export interface FormQuestion {
  id: string;
  title: string;
  helper?: string;
  type:
    | 'select' // Seleção única (1-clique / Radio)
    | 'checkbox' // Múltipla seleção (marcar 2, 3 ou mais)
    | 'text' // Texto curto (Varchar)
    | 'textarea' // Texto longo (Parágrafo)
    | 'number' // Número / Quantidade
    | 'currency' // Valor monetário (R$)
    | 'phone' // WhatsApp / Telefone com máscara
    | 'email' // E-mail
    | 'date' // Data
    | 'rating'; // Avaliação (1 a 5 estrelas)
  options?: string[];
  required: boolean;
  minOptions?: number;
  maxOptions?: number;
  phase?: string; // ex: 'SOBRE VOCÊ', 'SUA EMPRESA', 'QUALIFICAÇÃO', 'AGENDAMENTO'
}

export interface ClientTenant {
  id: string;
  name: string;
  company: string;
  phone: string;
  email?: string;
  niche: string;
  logoUrl?: string;
  primaryColor?: string;
  backgroundImageUrl?: string;
  created_at: string;
}

export interface FormItem {
  id: string;
  title: string;
  slug: string;
  tenantType: 'infinity' | 'client';
  clientId?: string;
  clientName?: string;
  niche: string;
  whatsappDestination: string;
  sendToWhatsapp: boolean; // se envia ou não para WhatsApp
  thankYouTitle: string;
  thankYouMessage: string;
  redirectUrl?: string;
  autoRedirectSeconds: number;
  status: 'Ativo' | 'Pausado';
  questions: FormQuestion[];
  created_at: string;
  updated_at: string;
  // ── CUSTOMIZAÇÃO VISUAL WHITE-LABEL (MARCA, LOGO, CORES, FUNDO) ──
  brandName?: string;
  brandLogoUrl?: string;
  primaryColor?: string; // ex: #00e599, #3b82f6, #ec4899, #eab308, #a855f7
  secondaryColor?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundStyle?: 'infinity-waves' | 'custom-image' | 'dark-gradient' | 'minimal';
  // ── AGENDAMENTO INTELIGENTE (ESTILO ARCUS) ──
  enableScheduling?: boolean;
  minScoreForScheduling?: number;
  schedulingDays?: string[];
  schedulingTimes?: string[];
}

export interface LeadSubmission {
  id: string;
  form_id?: string;
  form_slug: string;
  form_title: string;
  client_id?: string;
  client_name?: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  nicho?: string;
  faturamento?: string;
  lead_score: number;
  answers: Record<string, any>; // id ou título da pergunta -> resposta (string ou array para checkbox)
  status: 'novo' | 'em_contato' | 'reuniao_agendada' | 'fechado' | 'descartado';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at: string;
}

interface StorageSchema {
  clients: ClientTenant[];
  forms: FormItem[];
  leads: LeadSubmission[];
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'forms-database.json');
const TMP_DATA_FILE = path.join('/tmp', 'forms-database.json');

const INITIAL_CLIENTS: ClientTenant[] = [
  {
    id: '962f688c-c1b8-4136-8b5c-030e427c23c1',
    name: 'Cactus Moda',
    company: 'Cactus Calorosos',
    phone: '5581981280719',
    email: 'contato@cactuscalorosos.com.br',
    niche: 'Moda & Vestuário',
    primaryColor: '#10b981',
    created_at: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'f384667a-92c0-4287-a84b-c6536b11e944',
    name: 'Elys Joias',
    company: 'Elys Calheiros Joias',
    phone: '5581981280719',
    email: 'contato@elyscalheirosjoias.com.br',
    niche: 'Joias & Semijoias',
    primaryColor: '#eab308',
    created_at: '2026-03-05T10:00:00.000Z',
  },
  {
    id: 'client-3',
    name: 'Supermercado São José',
    company: 'Rede São José Varejo',
    phone: '5581981280719',
    email: 'contato@saojosemercados.com.br',
    niche: 'Supermercados & Varejo',
    primaryColor: '#3b82f6',
    created_at: '2026-03-10T10:00:00.000Z',
  },
];

const INITIAL_FORMS: FormItem[] = [
  {
    id: 'form-angelo',
    title: 'Diagnóstico com Angelo Marques',
    slug: 'angelo',
    tenantType: 'infinity',
    clientName: 'Angelo Marques',
    niche: 'Consultoria de Tecnologia & Estratégia Digital',
    whatsappDestination: '5581981280719',
    sendToWhatsapp: true,
    thankYouTitle: 'Diagnóstico Registrado!',
    thankYouMessage: 'Angelo Marques e a equipe Infinity entrarão em contato direto no seu WhatsApp.',
    autoRedirectSeconds: 4,
    status: 'Ativo',
    primaryColor: '#00e599',
    brandName: 'ANGELO MARQUES • INFINITY',
    created_at: '2026-03-01T10:00:00.000Z',
    updated_at: '2026-03-01T10:00:00.000Z',
    questions: [
      { id: 'qa1', title: 'Para começarmos, me diz seu nome completo.', helper: 'Usado para personalizar a apresentação.', type: 'text', required: true },
      { id: 'qa2', title: 'Qual seu WhatsApp comercial com DDD?', helper: 'Receba o diagnóstico detalhado por lá.', type: 'phone', required: true },
      { id: 'qa3', title: 'Qual é o nome da sua marca ou empresa?', helper: 'Nome da operação que você lidera.', type: 'text', required: true },
      { id: 'qa4', title: 'Qual é o seu melhor e-mail corporativo ou pessoal?', helper: 'Enviaremos o resumo executivo formal.', type: 'email', required: true },
      { id: 'qa5', title: 'Qual é a situação atual da sua empresa?', type: 'select', options: ['Tenho negócio e quero desenvolver uma nova solução digital', 'Quero escalar vendas através de tráfego pago & IA', 'Preciso automatizar processos de atendimento e CRM', 'Quero consultoria personalizada diretamente com Angelo'], required: true },
      { id: 'qa6', title: 'Qual a média do seu faturamento mensal atual?', type: 'currency', options: ['Até R$ 5.000', 'R$ 5.000 a R$ 15.000', 'R$ 15.000 a R$ 50.000', 'R$ 50.000 a R$ 100.000', 'Acima de R$ 100.000'], required: true },
      { id: 'qa7', title: 'Quanto você pretende investir mensalmente em crescimento e tecnologia?', type: 'currency', options: ['R$ 1.500 a R$ 3.000', 'R$ 3.000 a R$ 7.000', 'R$ 7.000 a R$ 15.000', 'Acima de R$ 15.000'], required: true },
    ],
  },
  {
    id: 'form-ecommerce-moda',
    title: 'Diagnóstico E-commerce 7 Dias',
    slug: 'e-commerce-moda',
    tenantType: 'infinity',
    niche: 'Moda & Vestuário',
    whatsappDestination: '5581981280719',
    sendToWhatsapp: true,
    thankYouTitle: 'Diagnóstico Registrado!',
    thankYouMessage: 'Nosso especialista já foi notificado e vai continuar o atendimento com você no WhatsApp.',
    autoRedirectSeconds: 4,
    status: 'Ativo',
    primaryColor: '#00e599',
    brandName: 'INFINITY ON DEMAND',
    created_at: '2026-03-01T10:00:00.000Z',
    updated_at: '2026-03-01T10:00:00.000Z',
    questions: [
      { id: 'q1', title: 'Para começarmos, me diz seu nome completo.', helper: 'Usado para personalizar a apresentação.', type: 'text', required: true },
      { id: 'q2', title: 'Qual seu WhatsApp comercial com DDD?', helper: 'Receba o diagnóstico detalhado por lá.', type: 'phone', required: true },
      { id: 'q3', title: 'Qual a situação atual da sua empresa?', type: 'select', options: ['Vendo produtos físicos e quero desenvolver um e-commerce', 'Tenho um e-commerce e quero reestruturar'], required: true },
      { id: 'q4', title: 'Quais nichos melhor definem o seu catálogo? (Pode marcar mais de um)', helper: 'Selecione todas as opções que você vende.', type: 'checkbox', options: ['Moda Feminina', 'Moda Masculina', 'Calçados', 'Bolsas e Acessórios', 'Joias e Semijoias', 'Decoração & Casa'], required: true },
      { id: 'q5', title: 'Qual a média do seu faturamento mensal atual?', type: 'currency', options: ['Até R$ 5.000', 'R$ 5.000 a R$ 15.000', 'R$ 15.000 a R$ 50.000', 'R$ 50.000 a R$ 100.000', 'Acima de R$ 100.000'], required: true },
      { id: 'q6', title: 'Quais canais de venda sua empresa utiliza hoje? (Marque todos)', type: 'checkbox', options: ['Loja Física Própria', 'Instagram Direct / Stories', 'WhatsApp Direto', 'Mercado Livre / Shopee', 'Site / Loja Virtual'], required: true },
      { id: 'q7', title: 'Qual é o nome da sua marca ou empresa?', helper: 'Usado na formalização do projeto.', type: 'text', required: true },
      { id: 'q8', title: 'Qual é o seu melhor e-mail corporativo ou pessoal?', helper: 'Enviaremos o resumo executivo formal.', type: 'email', required: true },
    ],
  },
  {
    id: 'form-trafego',
    title: 'Qualificação para Tráfego Pago & Performance',
    slug: 'trafego',
    tenantType: 'infinity',
    niche: 'Tráfego Pago & Performance',
    whatsappDestination: '5581981280719',
    sendToWhatsapp: true,
    thankYouTitle: 'Diagnóstico de Tráfego Recebido!',
    thankYouMessage: 'Vamos analisar seu nicho e apresentar o plano de escala de vendas no WhatsApp.',
    autoRedirectSeconds: 4,
    status: 'Ativo',
    primaryColor: '#00e599',
    brandName: 'INFINITY ON DEMAND',
    created_at: '2026-03-02T10:00:00.000Z',
    updated_at: '2026-03-02T10:00:00.000Z',
    questions: [
      { id: 'qt1', title: 'Qual é o seu nome completo?', type: 'text', required: true },
      { id: 'qt2', title: 'Qual o seu WhatsApp comercial com DDD?', type: 'phone', required: true },
      { id: 'qt3', title: 'Qual é a sua empresa ou marca?', type: 'text', required: true },
      { id: 'qt4', title: 'Qual o seu melhor e-mail corporativo ou pessoal?', helper: 'Enviaremos o plano de métricas por e-mail.', type: 'email', required: true },
      { id: 'qt5', title: 'Qual o nicho do seu produto ou serviço?', type: 'select', options: ['Moda & Vestuário', 'Supermercados & Varejo', 'Joias & Acessórios', 'Restaurantes & Food', 'Serviços B2B', 'Clínica / Saúde', 'Outro Nicho'], required: true },
      { id: 'qt6', title: 'Quanto você fatura hoje por mês?', type: 'currency', options: ['Ainda não faturo', 'Até R$ 10 mil', 'R$ 10 a R$ 30 mil', 'R$ 30 a R$ 100 mil', 'Acima de R$ 100 mil'], required: true },
      { id: 'qt7', title: 'Quanto você pretende investir mensalmente em anúncios no Meta Ads / Google?', type: 'currency', options: ['R$ 1.000 a R$ 2.500', 'R$ 2.500 a R$ 5.000', 'R$ 5.000 a R$ 10.000', 'Acima de R$ 10.000'], required: true },
      { id: 'qt8', title: 'Quais plataformas você quer anunciar? (Pode marcar mais de uma)', type: 'checkbox', options: ['Instagram e Facebook (Meta Ads)', 'Google Ads & Pesquisa', 'TikTok Ads', 'Campanhas diretas para WhatsApp'], required: true },
    ],
  },
  {
    id: 'form-mercado',
    title: 'Sistemas & Delivery para Supermercados e Hortifrútis',
    slug: 'mercado',
    tenantType: 'infinity',
    niche: 'Supermercados & Varejo',
    whatsappDestination: '5581981280719',
    sendToWhatsapp: true,
    thankYouTitle: 'Solicitação de Projeto de Mercado Recebida!',
    thankYouMessage: 'Nossa equipe de engenharia para varejo entrará em contato em instantes.',
    autoRedirectSeconds: 4,
    status: 'Ativo',
    primaryColor: '#3b82f6',
    brandName: 'INFINITY RETAIL & SYSTEMS',
    created_at: '2026-03-05T10:00:00.000Z',
    updated_at: '2026-03-05T10:00:00.000Z',
    questions: [
      { id: 'qm1', title: 'Nome do responsável e nome do Supermercado / Hortifrúti:', type: 'text', required: true },
      { id: 'qm2', title: 'WhatsApp comercial com DDD:', type: 'phone', required: true },
      { id: 'qm3', title: 'Qual é o seu melhor e-mail?', type: 'email', required: true },
      { id: 'qm4', title: 'Quantos caixas / PDVs de atendimento sua loja possui?', type: 'number', required: true },
      { id: 'qm5', title: 'Quais módulos sua operação necessita? (Marque todos necessários)', type: 'checkbox', options: ['Frente de Caixa (PDV Rápido)', 'Controle de Hortifrúti & Validade', 'Integração com Balanças', 'App e Web Delivery Próprio', 'Separação de Pedidos (Picking)'], required: true },
    ],
  },
];

// Cache em memória compartilhado durante o ciclo de vida do worker
let memoryStore: StorageSchema | null = null;

function ensureStorage(): StorageSchema {
  if (memoryStore) {
    return memoryStore;
  }

  // Tenta ler do diretório src/data (local) ou /tmp (serverless Vercel)
  const pathsToTry = [DATA_FILE, TMP_DATA_FILE];
  for (const p of pathsToTry) {
    try {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.forms) && parsed.forms.length > 0) {
          // Garante que o form 'angelo' esteja mesclado
          const hasAngelo = parsed.forms.some((f: FormItem) => f.slug === 'angelo');
          if (!hasAngelo) {
            parsed.forms.unshift(INITIAL_FORMS[0]);
          }
          memoryStore = {
            clients: parsed.clients || INITIAL_CLIENTS,
            forms: parsed.forms || INITIAL_FORMS,
            leads: parsed.leads || [],
          };
          return memoryStore;
        }
      }
    } catch (e) {
      // Ignora erro e tenta próximo
    }
  }

  // Fallback inicial
  memoryStore = {
    clients: INITIAL_CLIENTS,
    forms: INITIAL_FORMS,
    leads: [],
  };

  saveStorage(memoryStore);
  return memoryStore;
}

function saveStorage(data: StorageSchema) {
  memoryStore = data;

  // 1. Tenta gravar no caminho local (src/data/forms-database.json)
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // Se for read-only (ex: Vercel lambda), grava em /tmp
    try {
      fs.writeFileSync(TMP_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (tmpErr) {
      // Ignora
    }
  }

  // 2. Persistência assíncrona no Supabase Storage para persistir através de todos os lambdas da Vercel
  try {
    const supabase = getServerSupabase();
    const jsonStr = JSON.stringify(data);
    supabase.storage
      .from('campaign-images')
      .upload('infinity-forms-state.json', Buffer.from(jsonStr), {
        contentType: 'application/json',
        upsert: true,
      })
      .then(() => {})
      .catch(() => {});
  } catch (e) {
    // Silencia se supabase storage não configurado
  }
}

// ── Sincronização inicial com Supabase Storage se disponível ──
let hasAttemptedSupabaseRestore = false;
export async function syncStorageWithSupabase(): Promise<void> {
  if (hasAttemptedSupabaseRestore) return;
  hasAttemptedSupabaseRestore = true;

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase.storage
      .from('campaign-images')
      .download('infinity-forms-state.json');

    if (!error && data) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      if (parsed && Array.isArray(parsed.forms) && parsed.forms.length > 0) {
        // Normalizar IDs legados para os UUIDs oficiais do CRM
        parsed.forms.forEach((f: any) => {
          if (f.clientId === 'client-1' || f.clientName?.toLowerCase().includes('cactus')) {
            f.clientId = '962f688c-c1b8-4136-8b5c-030e427c23c1';
          } else if (f.clientId === 'client-2' || f.clientName?.toLowerCase().includes('elys')) {
            f.clientId = 'f384667a-92c0-4287-a84b-c6536b11e944';
          }
        });
        if (parsed.leads) {
          parsed.leads.forEach((l: any) => {
            if (l.client_id === 'client-1' || l.client_name?.toLowerCase().includes('cactus')) {
              l.client_id = '962f688c-c1b8-4136-8b5c-030e427c23c1';
            } else if (l.client_id === 'client-2' || l.client_name?.toLowerCase().includes('elys')) {
              l.client_id = 'f384667a-92c0-4287-a84b-c6536b11e944';
            }
          });
        }
        // Mesclar com memória sem perder novos
        const currentStore = ensureStorage();
        const mergedForms = [...parsed.forms];
        for (const cf of currentStore.forms) {
          if (!mergedForms.some((mf) => mf.id === cf.id || mf.slug === cf.slug)) {
            mergedForms.push(cf);
          }
        }
        currentStore.forms = mergedForms;
        if (parsed.clients) {
          currentStore.clients = parsed.clients;
        }
        if (parsed.leads && parsed.leads.length > currentStore.leads.length) {
          currentStore.leads = parsed.leads;
        }
        memoryStore = currentStore;
      }
    }
  } catch (e) {
    // Silencia
  }
}

// ── Funções de Acesso ──

export function getAllForms(): FormItem[] {
  const store = ensureStorage();
  return store.forms;
}

export function getFormBySlug(slug: string): FormItem | undefined {
  const store = ensureStorage();
  const cleanSlug = slug.toLowerCase().trim();
  return store.forms.find((f) => f.slug.toLowerCase().trim() === cleanSlug);
}

export function saveOrUpdateForm(form: FormItem): FormItem {
  const store = ensureStorage();
  const existingIdx = store.forms.findIndex(
    (f) => f.id === form.id || f.slug.toLowerCase() === form.slug.toLowerCase()
  );
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    store.forms[existingIdx] = {
      ...store.forms[existingIdx],
      ...form,
      updated_at: now,
    };
  } else {
    store.forms.unshift({
      ...form,
      id: form.id || `form-${Date.now()}`,
      created_at: now,
      updated_at: now,
    });
  }
  saveStorage(store);
  return form;
}

export function deleteForm(id: string): boolean {
  const store = ensureStorage();
  const initialLen = store.forms.length;
  store.forms = store.forms.filter((f) => f.id !== id && f.slug !== id);
  if (store.forms.length !== initialLen) {
    saveStorage(store);
    return true;
  }
  return false;
}

// ── Clientes / Tenants ──

export function getAllClients(): ClientTenant[] {
  const store = ensureStorage();
  return store.clients;
}

export function saveClient(client: ClientTenant): ClientTenant {
  const store = ensureStorage();
  const existingIdx = store.clients.findIndex((c) => c.id === client.id);
  if (existingIdx >= 0) {
    store.clients[existingIdx] = {
      ...store.clients[existingIdx],
      ...client,
    };
  } else {
    store.clients.unshift({
      ...client,
      id: client.id || `client-${Date.now()}`,
      created_at: new Date().toISOString(),
    });
  }
  saveStorage(store);
  return client;
}

// ── Leads ──

export function getAllLeads(formSlug?: string, clientId?: string): LeadSubmission[] {
  const store = ensureStorage();
  let list = [...store.leads];

  if (formSlug && formSlug !== 'all') {
    list = list.filter((l) => l.form_slug.toLowerCase() === formSlug.toLowerCase());
  }
  if (clientId && clientId !== 'all') {
    list = list.filter((l) => l.client_id === clientId);
  }
  return list;
}

export function saveLead(lead: LeadSubmission): LeadSubmission {
  const store = ensureStorage();
  const newLead: LeadSubmission = {
    ...lead,
    id: lead.id || `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    created_at: lead.created_at || new Date().toISOString(),
    status: lead.status || 'novo',
  };
  store.leads.unshift(newLead);
  saveStorage(store);
  return newLead;
}

export function saveLeadSubmission(lead: Omit<LeadSubmission, 'id' | 'created_at'>): LeadSubmission {
  return saveLead({
    ...lead,
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
  });
}

export function updateLeadStatus(id: string, status: LeadSubmission['status']): boolean {
  const store = ensureStorage();
  const lead = store.leads.find((l) => l.id === id);
  if (lead) {
    lead.status = status;
    saveStorage(store);
    return true;
  }
  return false;
}


export function calculateLeadScore(answers: Record<string, any>): number {
  let score = 50;
  const answersStr = JSON.stringify(answers).toLowerCase();

  if (answersStr.includes('100k') || answersStr.includes('500k') || answersStr.includes('milhão') || answersStr.includes('milhao') || answersStr.includes('acima de 50')) {
    score += 30;
  } else if (answersStr.includes('30k') || answersStr.includes('50k') || answersStr.includes('20k')) {
    score += 20;
  }

  if (answersStr.includes('imediato') || answersStr.includes('o mais rápido') || answersStr.includes('urgente') || answersStr.includes('sócio') || answersStr.includes('proprietário') || answersStr.includes('diretor')) {
    score += 15;
  }

  if (answersStr.includes('@') && (answersStr.includes('9') || answersStr.includes('whatsapp'))) {
    score += 10;
  }

  return Math.min(100, Math.max(10, score));
}

export function saveSubmission(lead: any): LeadSubmission {
  return saveLeadSubmission(lead);
}
