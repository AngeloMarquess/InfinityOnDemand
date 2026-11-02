import fs from 'fs';
import path from 'path';

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
}

export interface ClientTenant {
  id: string;
  name: string;
  company: string;
  phone: string;
  email?: string;
  niche: string;
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

const INITIAL_CLIENTS: ClientTenant[] = [
  {
    id: 'client-1',
    name: 'Cactus Moda',
    company: 'Cactus Calorosos',
    phone: '5581981280719',
    email: 'contato@cactuscalorosos.com.br',
    niche: 'Moda & Vestuário',
    created_at: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'client-2',
    name: 'Elys Joias',
    company: 'Elys Calheiros Joias',
    phone: '5581981280719',
    email: 'contato@elyscalheirosjoias.com.br',
    niche: 'Joias & Semijoias',
    created_at: '2026-03-05T10:00:00.000Z',
  },
  {
    id: 'client-3',
    name: 'Supermercado São José',
    company: 'Rede São José Varejo',
    phone: '5581981280719',
    email: 'contato@saojosemercados.com.br',
    niche: 'Supermercados & Varejo',
    created_at: '2026-03-10T10:00:00.000Z',
  },
];

const INITIAL_FORMS: FormItem[] = [
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
    created_at: '2026-03-01T10:00:00.000Z',
    updated_at: '2026-03-01T10:00:00.000Z',
    questions: [
      { id: 'q1', title: 'Para começarmos, me diz seu nome completo.', helper: 'Usado para personalizar a apresentação.', type: 'text', required: true },
      { id: 'q2', title: 'Qual seu WhatsApp comercial com DDD?', helper: 'Receba o diagnóstico detalhado por lá.', type: 'phone', required: true },
      { id: 'q3', title: 'Qual a situação atual da sua empresa?', type: 'select', options: ['Vendo produtos físicos e quero desenvolver um e-commerce', 'Tenho um e-commerce e quero reestruturar'], required: true },
      { id: 'q4', title: 'Quais nichos melhor definem o seu catálogo? (Pode marcar mais de um)', helper: 'Selecione todas as opções que você vende.', type: 'checkbox', options: ['Moda Feminina', 'Moda Masculina', 'Calçados', 'Bolsas e Acessórios', 'Joias e Semijoias', 'Decoração & Casa'], required: true },
      { id: 'q5', title: 'Qual a média do seu faturamento mensal atual?', type: 'currency', options: ['Até R$ 5.000', 'R$ 5.000 a R$ 15.000', 'R$ 15.000 a R$ 50.000', 'R$ 50.000 a R$ 100.000', 'Acima de R$ 100.000'], required: true },
      { id: 'q6', title: 'Quais canais de venda sua empresa utiliza hoje? (Marque todos)', type: 'checkbox', options: ['Loja Física Própria', 'Instagram Direct / Stories', 'WhatsApp Direto', 'Mercado Livre / Shopee', 'Site / Loja Virtual'], required: true },
      { id: 'q7', title: 'Nome da sua marca / empresa e melhor e-mail:', helper: 'Enviaremos o resumo executivo formal.', type: 'email', required: true },
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
    created_at: '2026-03-02T10:00:00.000Z',
    updated_at: '2026-03-02T10:00:00.000Z',
    questions: [
      { id: 'qt1', title: 'Qual é o seu nome completo?', type: 'text', required: true },
      { id: 'qt2', title: 'Qual o seu WhatsApp comercial com DDD?', type: 'phone', required: true },
      { id: 'qt3', title: 'Qual é a sua empresa ou marca?', type: 'text', required: true },
      { id: 'qt4', title: 'Qual o nicho do seu produto ou serviço?', type: 'select', options: ['Moda & Vestuário', 'Supermercados & Varejo', 'Joias & Acessórios', 'Restaurantes & Food', 'Serviços B2B', 'Clínica / Saúde', 'Outro Nicho'], required: true },
      { id: 'qt5', title: 'Quanto você fatura hoje por mês?', type: 'currency', options: ['Ainda não faturo', 'Até R$ 10 mil', 'R$ 10 a R$ 30 mil', 'R$ 30 a R$ 100 mil', 'Acima de R$ 100 mil'], required: true },
      { id: 'qt6', title: 'Quanto você pretende investir mensalmente em anúncios no Meta Ads / Google?', type: 'currency', options: ['R$ 1.000 a R$ 2.500', 'R$ 2.500 a R$ 5.000', 'R$ 5.000 a R$ 10.000', 'Acima de R$ 10.000'], required: true },
      { id: 'qt7', title: 'Quais plataformas você quer anunciar? (Pode marcar mais de uma)', type: 'checkbox', options: ['Instagram e Facebook (Meta Ads)', 'Google Ads & Pesquisa', 'TikTok Ads', 'Campanhas diretas para WhatsApp'], required: true },
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
    created_at: '2026-03-05T10:00:00.000Z',
    updated_at: '2026-03-05T10:00:00.000Z',
    questions: [
      { id: 'qm1', title: 'Nome do responsável e nome do Supermercado / Hortifrúti:', type: 'text', required: true },
      { id: 'qm2', title: 'WhatsApp comercial com DDD:', type: 'phone', required: true },
      { id: 'qm3', title: 'Quantos caixas / PDVs de atendimento sua loja possui?', type: 'number', required: true },
      { id: 'qm4', title: 'Quais módulos sua operação necessita? (Marque todos necessários)', type: 'checkbox', options: ['Frente de Caixa (PDV Rápido)', 'Controle de Hortifrúti & Validade', 'Integração com Balanças', 'App e Web Delivery Próprio', 'Separação de Pedidos (Picking)'], required: true },
    ],
  },
];

function ensureStorage(): StorageSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial: StorageSchema = {
        clients: INITIAL_CLIENTS,
        forms: INITIAL_FORMS,
        leads: [],
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      clients: parsed.clients || INITIAL_CLIENTS,
      forms: parsed.forms || INITIAL_FORMS,
      leads: parsed.leads || [],
    };
  } catch (err) {
    console.error('Erro ao ler forms-database.json:', err);
    return {
      clients: INITIAL_CLIENTS,
      forms: INITIAL_FORMS,
      leads: [],
    };
  }
}

function saveStorage(data: StorageSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erro ao salvar forms-database.json:', err);
  }
}

// ── Funções de Acesso ──

export function getAllForms(): FormItem[] {
  const store = ensureStorage();
  return store.forms;
}

export function getFormBySlug(slug: string): FormItem | undefined {
  const store = ensureStorage();
  return store.forms.find((f) => f.slug.toLowerCase() === slug.toLowerCase());
}

export function saveOrUpdateForm(form: FormItem): FormItem {
  const store = ensureStorage();
  const existingIdx = store.forms.findIndex((f) => f.id === form.id || f.slug === form.slug);
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
  store.forms = store.forms.filter((f) => f.id !== id);
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
    store.clients[existingIdx] = client;
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

export function getAllLeads(filterFormSlug?: string, filterClientId?: string): LeadSubmission[] {
  const store = ensureStorage();
  let result = store.leads;
  if (filterFormSlug && filterFormSlug !== 'all') {
    result = result.filter((l) => l.form_slug.toLowerCase() === filterFormSlug.toLowerCase());
  }
  if (filterClientId && filterClientId !== 'all') {
    result = result.filter((l) => l.client_id === filterClientId);
  }
  return result;
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

export function updateLeadStatus(id: string, newStatus: LeadSubmission['status']): boolean {
  const store = ensureStorage();
  const lead = store.leads.find((l) => l.id === id);
  if (lead) {
    lead.status = newStatus;
    saveStorage(store);
    return true;
  }
  return false;
}
