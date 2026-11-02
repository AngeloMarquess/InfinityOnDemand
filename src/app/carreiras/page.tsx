'use client';

import React, { useState, useRef, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Briefcase, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Code2, 
  TrendingUp, 
  Headphones, 
  Palette, 
  ShieldCheck, 
  Search,
  Users,
  Heart,
  Flame,
  Award,
  Lightbulb,
  X,
  ArrowRight,
  Clock,
  Laptop
} from 'lucide-react';

interface JobPosition {
  id: string;
  title: string;
  type: string;
  area: 'Tecnologia' | 'Marketing' | 'Vendas' | 'Design' | 'Atendimento';
  level: string;
  remuneration: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
}

const JOB_POSITIONS: JobPosition[] = [
  {
    id: 'fullstack-sr',
    title: 'Desenvolvedor(a) Full Stack Senior (Next.js, TypeScript & IA)',
    type: '100% Remoto',
    area: 'Tecnologia',
    level: 'Senior',
    remuneration: 'Compatível com o mercado + Bônus',
    description: 'Buscamos um(a) engenheiro(a) de software sênior para liderar a arquitetura e desenvolvimento dos nossos ecossistemas SaaS (Delivery OS, Infinity Forms, CRM B2B) e integrações avançadas de IA generativa.',
    requirements: [
      'Next.js 15+ (App Router) & React 19',
      'TypeScript e Node.js em nível avançado',
      'PostgreSQL / Supabase e modelagem relacional',
      'Experiência prática com APIs REST, Webhooks e Serverless',
      'Familiaridade com LLMs, OpenAI API, Anthropic e agentes autônomos'
    ],
    responsibilities: [
      'Construir componentes escaláveis de alta performance',
      'Garantir segurança, tipagem rigorosa e zero dívida técnica',
      'Projetar arquiteturas tolerantes a falhas e microsserviços'
    ]
  },
  {
    id: 'trafego-sr',
    title: 'Gestor(a) de Tráfego Pago & Performance (Meta Ads & Google)',
    type: '100% Remoto',
    area: 'Marketing',
    level: 'Pleno / Senior',
    remuneration: 'Fixo + Bonificação agressiva por ROAS',
    description: 'Você será responsável por gerenciar e escalar contas de tráfego pago de alto investimento no Meta Ads, Google Ads e TikTok Ads para a própria Infinity e clientes de e-commerce e varejo.',
    requirements: [
      'Comprovada experiência em escala de orçamentos (R$ 50k+/mês)',
      'Domínio avançado de CAPI (Conversion API), Pixel e UTMs',
      'Pensamento analítico afiado (CAC, LTV, ROAS, Taxa de Retenção)',
      'Copywriting estratégico orientado à conversão'
    ],
    responsibilities: [
      'Criar hipóteses e testes A/B contínuos de criativos',
      'Otimizar funis de tráfego integrados com Infinity Forms e CRM',
      'Apresentar relatórios executivos de ROI para a diretoria'
    ]
  },
  {
    id: 'sdr-closer',
    title: 'Inside Sales & Closer Comercial B2B (Soluções SaaS & Growth)',
    type: 'Remoto ou Recife (Híbrido)',
    area: 'Vendas',
    level: 'Pleno',
    remuneration: 'Salário Base + Comissões sem teto',
    description: 'Atuação na qualificação ativa e passiva de leads de tráfego pago (inbound), condução de diagnósticos estratégicos e fechamento de contratos de software e consultoria digital.',
    requirements: [
      'Experiência em vendas consultivas B2B ou SaaS',
      'Excelente oratória, persuasão e comunicação escrita',
      'Disciplina na rotina de follow-ups em CRM e WhatsApp Business',
      'Familiaridade com metodologias SPIN Selling e BANT'
    ],
    responsibilities: [
      'Conduzir demonstrações ao vivo dos sistemas Infinity',
      'Negociar propostas personalizadas com empresários e diretores',
      'Garantir taxa de conversão do pipeline acima da média'
    ]
  },
  {
    id: 'copywriter',
    title: 'Copywriter & Estrategista de Conteúdo de Conversão',
    type: '100% Remoto',
    area: 'Marketing',
    level: 'Pleno',
    remuneration: 'Contrato PJ sob demanda ou Fixo',
    description: 'Criação de narrativas irresistíveis, roteiros de criativos para Meta Ads, cartas de vendas, e-mails de nutrição e artigos aprofundados para o Infinity Blog com foco em SEO e conversão.',
    requirements: [
      'Portfólio com textos reais que geraram faturamento',
      'Domínio de gatilhos mentais, storytelling e neurovendas',
      'Conhecimento de SEO on-page e pesquisa de palavras-chave',
      'Velocidade de entrega com rigor gramatical impecável'
    ],
    responsibilities: [
      'Escrever criativos diários para campanhas de mídia paga',
      'Produzir artigos estratégicos para o ecossistema de conteúdo',
      'Construir sequências de automação de WhatsApp e e-mail'
    ]
  },
  {
    id: 'designer-uiux',
    title: 'Designer UI/UX & Web (Figma, Design Systems & Motion)',
    type: '100% Remoto',
    area: 'Design',
    level: 'Pleno / Senior',
    remuneration: 'Fixo + Bonificação por projeto',
    description: 'Criação de interfaces visuais de alto padrão (Landing Pages, Dashboards, Apps móveis e Sistemas SaaS), cuidando da estética premium do nosso ecossistema e dos clientes.',
    requirements: [
      'Figma avançado (Auto Layout, Components, Tokens, Variáveis)',
      'Noção sólida de usabilidade e arquitetura de informação',
      'Olhar estético apurado (tipografia, microinterações, espaçamentos)',
      'Portfólio com projetos reais de produtos digitais'
    ],
    responsibilities: [
      'Prototipar fluxos e telas de alta fidelidade para os desenvolvedores',
      'Evoluir o Design System oficial da Infinity On Demand',
      'Criar peças visuais e criativos conceituais para lançamentos'
    ]
  },
  {
    id: 'suporte-cs',
    title: 'Customer Success & Suporte Técnico Especializado',
    type: 'Remoto ou Recife',
    area: 'Atendimento',
    level: 'Júnior / Pleno',
    remuneration: 'CLT + Benefícios',
    description: 'Apoio direto aos clientes e usuários das plataformas Infinity (Help Desk, treinamento de uso, acompanhamento de métricas de saúde do cliente e resolução ágil).',
    requirements: [
      'Comunicação empática, paciente e altamente resolutiva',
      'Facilidade com tecnologia, plataformas web e WhatsApp',
      'Organização para registrar tickets e documentar melhorias',
      'Disponibilidade para atendimento em horário comercial'
    ],
    responsibilities: [
      'Onboarding humanizado de novos clientes nos sistemas',
      'Acompanhar taxa de adoção e satisfação (NPS)',
      'Intermediar sugestões de novos recursos com a equipe técnica'
    ]
  }
];

export default function CarreirasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('Todas');
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulário Modal
  const [candidateForm, setCandidateForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    portfolio: '',
    motivo: '',
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const vagasSectionRef = useRef<HTMLDivElement>(null);

  // Filtragem de vagas
  const filteredJobs = useMemo(() => {
    return JOB_POSITIONS.filter(job => {
      const matchArea = selectedArea === 'Todas' || job.area === selectedArea;
      const matchSearch = searchTerm === '' || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requirements.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchArea && matchSearch;
    });
  }, [selectedArea, searchTerm]);

  const handleOpenApplyModal = (job: JobPosition) => {
    setSelectedJob(job);
    setIsModalOpen(true);
    setSubmittedSuccess(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const formatPhone = (val: string) => {
    let digits = val.replace(/\D/g, '');
    if (digits.length > 11) digits = digits.slice(0, 11);
    if (digits.length <= 2) return digits.length ? `(${digits}` : '';
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleSubmitCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setLoadingSubmit(true);

    const textMsg = `👋 *Nova Candidatura - Infinity Carreiras*\n\n` +
      `💼 *Vaga:* ${selectedJob.title}\n` +
      `👤 *Candidato(a):* ${candidateForm.nome}\n` +
      `📱 *WhatsApp:* ${candidateForm.telefone}\n` +
      `✉️ *E-mail:* ${candidateForm.email}\n` +
      (candidateForm.portfolio ? `🔗 *LinkedIn / Portfólio:* ${candidateForm.portfolio}\n` : '') +
      (candidateForm.motivo ? `💬 *Sobre o candidato:* ${candidateForm.motivo}\n` : '');

    const waUrl = `https://wa.me/5581981280719?text=${encodeURIComponent(textMsg)}`;

    setTimeout(() => {
      setLoadingSubmit(false);
      setSubmittedSuccess(true);
      window.open(waUrl, '_blank');
    }, 500);
  };

  const scrollToVagas = () => {
    vagasSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#070B18', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <Header />

      {/* ========================================================
          HERO BANNER - DESCONTRAÍDO ESTILO OXE AÇAÍ COM CORES INFINITY
          ======================================================== */}
      <section style={{ 
        position: 'relative', 
        padding: '120px 20px 80px', 
        overflow: 'hidden',
        background: 'radial-gradient(circle at 20% 30%, rgba(0, 223, 129, 0.12) 0%, transparent 60%), radial-gradient(circle at 85% 60%, rgba(0, 170, 255, 0.12) 0%, transparent 60%)'
      }}>
        {/* Background Dot Grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.6,
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '48px', alignItems: 'center' }}>
            
            {/* Left Content */}
            <div>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '6px 16px', 
                borderRadius: '999px', 
                backgroundColor: 'rgba(0, 223, 129, 0.12)', 
                border: '1px solid rgba(0, 223, 129, 0.3)', 
                color: '#00DF81', 
                fontSize: '13px', 
                fontWeight: 700, 
                letterSpacing: '0.5px',
                marginBottom: '20px' 
              }}>
                <Sparkles size={14} /> VEM PRA INFINITY • CARREIRAS
              </div>

              <h1 style={{ 
                fontSize: 'clamp(36px, 5.5vw, 60px)', 
                fontWeight: 900, 
                lineHeight: 1.12, 
                letterSpacing: '-1.5px', 
                marginBottom: '24px',
                color: '#ffffff'
              }}>
                Seu talento tem <br />
                <span style={{ 
                  background: 'linear-gradient(135deg, #00DF81 0%, #00AAFF 100%)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent' 
                }}>
                  lugar aqui, visse!
                </span>
              </h1>

              <p style={{ 
                fontSize: '18px', 
                color: 'rgba(255, 255, 255, 0.75)', 
                lineHeight: 1.6, 
                maxWidth: '560px', 
                marginBottom: '36px' 
              }}>
                Vem fazer parte do time que tá revolucionando ecossistemas de tecnologia, inteligência artificial e marketing de performance no Brasil. Aqui tem espaço pra quem tem energia, autonomia e paixão por construir!
              </p>

              {/* Search Bar Descontraída */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#0F172A', 
                border: '1px solid rgba(255, 255, 255, 0.15)', 
                borderRadius: '16px', 
                padding: '6px 8px 6px 18px', 
                maxWidth: '540px',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
                marginBottom: '16px'
              }}>
                <Search size={20} color="#00DF81" style={{ marginRight: '12px', flexShrink: 0 }} />
                <input 
                  type="text" 
                  placeholder="Procure sua vaga (ex: Desenvolvedor, Tráfego, Vendas)..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '15px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <button 
                  onClick={scrollToVagas}
                  style={{
                    backgroundColor: '#00DF81',
                    color: '#070B18',
                    fontWeight: 800,
                    fontSize: '14px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 16px rgba(0, 223, 129, 0.35)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#00F58D';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#00DF81';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Buscar <ArrowRight size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.55)' }}>
                <span>🔥 {JOB_POSITIONS.length} vagas abertas</span>
                <span>•</span>
                <span>📍 Recife (PE) e 100% Remoto</span>
              </div>
            </div>

            {/* Right Card Visual Tech & Marketing */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: '460px', 
                height: '480px', 
                borderRadius: '28px', 
                overflow: 'hidden',
                border: '1px solid rgba(0, 223, 129, 0.3)',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 223, 129, 0.15)'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80" 
                  alt="Profissional Infinity On Demand" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(7, 11, 24, 0.85) 0%, transparent 55%)'
                }} />

                {/* Floating Badge (Estilo Oxe Açaí "+50 contratados") */}
                <div style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(0, 223, 129, 0.4)',
                  borderRadius: '16px',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 223, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00DF81'
                  }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>+15 contratados em 2026</div>
                    <div style={{ fontSize: '12px', color: '#00DF81', fontWeight: 600 }}>Crescimento Acelerado & IA</div>
                  </div>
                </div>

                {/* Floating Top Pill */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(7, 11, 24, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#00AAFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Laptop size={14} /> 100% Remoto & Flexível
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          NOSSA CULTURA - O JEITINHO INFINITY DE TRABALHAR
          ======================================================== */}
      <section style={{ padding: '90px 20px', backgroundColor: '#0B0F19', borderTop: '1px solid rgba(255, 255, 255, 0.06)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ 
            fontSize: '12px', 
            fontWeight: 800, 
            letterSpacing: '1.5px', 
            textTransform: 'uppercase', 
            color: '#F59E0B', 
            marginBottom: '12px' 
          }}>
            NOSSA CULTURA
          </div>

          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '16px' }}>
            O jeitinho <span style={{ color: '#00DF81' }}>INFINITY</span> de trabalhar
          </h2>

          <p style={{ fontSize: '17px', color: 'rgba(255, 255, 255, 0.65)', maxWidth: '680px', margin: '0 auto 60px', lineHeight: 1.6 }}>
            Nascidos em Recife e com DNA global. Nossa cultura reflete quem somos: acolhedores, inconformados, velozes e apaixonados por resultados reais.
          </p>

          {/* 4 Cards de Cultura */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', textAlign: 'left' }}>
            
            {/* Card 1 */}
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '32px 28px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = 'rgba(0, 223, 129, 0.4)';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 223, 129, 0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🤝</div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>Acolhimento</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6 }}>
                Aqui ninguém é só um número. Cada pessoa importa, cresce junto e tem voz ativa no time, visse?
              </p>
            </div>

            {/* Card 2 */}
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '32px 28px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(245, 158, 11, 0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔥</div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>Energia</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6 }}>
                Trabalho duro com alegria. A gente não aceita o morno: faz acontecer com paixão, leveza e velocidade.
              </p>
            </div>

            {/* Card 3 */}
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '32px 28px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = 'rgba(0, 170, 255, 0.4)';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 170, 255, 0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>💎</div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>Qualidade</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6 }}>
                Do código limpo ao tráfego de milhões, excelência técnica e impacto no cliente é o nosso padrão.
              </p>
            </div>

            {/* Card 4 */}
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '32px 28px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(168, 85, 247, 0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>💡</div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>Inovação</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6 }}>
                Ideias novas são bem-vindas sempre. Aqui todo mundo tem voz para criar, testar e inovar.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          BANNER FOTO EQUIPE - GENTE QUE FAZ ACONTECER, VISSE!
          ======================================================== */}
      <section style={{ padding: '80px 20px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '420px', 
          borderRadius: '32px', 
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80" 
            alt="Time Infinity On Demand" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(7, 11, 24, 0.95) 0%, rgba(7, 11, 24, 0.3) 60%, transparent 100%)'
          }} />

          {/* Text in bottom-left */}
          <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px' }}>
            <div style={{ 
              fontSize: '13px', 
              fontWeight: 800, 
              letterSpacing: '1px', 
              textTransform: 'uppercase', 
              color: '#F59E0B', 
              marginBottom: '8px' 
            }}>
              NOSSO TIME
            </div>
            <h3 style={{ 
              fontSize: 'clamp(28px, 4vw, 44px)', 
              fontWeight: 900, 
              color: '#ffffff',
              letterSpacing: '-1px',
              lineHeight: 1.2
            }}>
              Gente que faz acontecer, <span style={{ color: '#00DF81' }}>visse!</span>
            </h3>
            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.75)', marginTop: '8px', maxWidth: '600px' }}>
              Uma equipe multidisciplinar de engenheiros, copywriters, gestores e estrategistas construindo as soluções digitais mais velozes do mercado.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          LISTA DE VAGAS ABERTAS COM FILTROS (ESTILO INNOVEDA)
          ======================================================== */}
      <section ref={vagasSectionRef} style={{ padding: '40px 20px 100px', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#00DF81', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>OPORTUNIDADES ATIVAS</div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.5px' }}>Vagas Disponíveis</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '15px', marginTop: '4px' }}>
              Mostrando {filteredJobs.length} de {JOB_POSITIONS.length} posições abertas
            </p>
          </div>

          {/* Area Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Todas', 'Tecnologia', 'Marketing', 'Vendas', 'Design', 'Atendimento'].map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  transition: 'all 0.2s',
                  backgroundColor: selectedArea === area ? '#00DF81' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedArea === area ? '#070B18' : 'rgba(255, 255, 255, 0.7)',
                  border: selectedArea === area ? '1px solid #00DF81' : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Job Cards */}
        {filteredJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#0F172A', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Nenhuma vaga encontrada para sua busca</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '20px' }}>Tente buscar com outros termos ou selecione outra categoria.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedArea('Todas'); }}
              style={{ padding: '10px 20px', backgroundColor: '#00DF81', color: '#070B18', borderRadius: '10px', fontWeight: 700, fontSize: '13px' }}
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                style={{
                  backgroundColor: '#0F172A',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(0, 223, 129, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.35)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 800, 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        backgroundColor: 'rgba(0, 223, 129, 0.15)', 
                        color: '#00DF81',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase'
                      }}>
                        {job.area}
                      </span>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        backgroundColor: 'rgba(0, 170, 255, 0.15)', 
                        color: '#00AAFF',
                        letterSpacing: '0.5px'
                      }}>
                        {job.level}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                        <MapPin size={13} color="#00DF81" /> {job.type}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
                      {job.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleOpenApplyModal(job)}
                    style={{
                      padding: '12px 28px',
                      borderRadius: '12px',
                      backgroundColor: '#00DF81',
                      color: '#070B18',
                      fontWeight: 800,
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 16px rgba(0, 223, 129, 0.25)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#00F58D';
                      e.currentTarget.style.transform = 'scale(1.03)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#00DF81';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Candidatar-se <ArrowRight size={16} />
                  </button>
                </div>

                <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.65 }}>
                  {job.description}
                </p>

                {/* Requirements Badges */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Requisitos & Habilidades:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {job.requirements.map((req, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '6px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          color: '#E2E8F0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <CheckCircle2 size={12} color="#00DF81" /> {req}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* ========================================================
          MODAL DE CANDIDATURA DIRETA
          ======================================================== */}
      {isModalOpen && selectedJob && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(7, 11, 24, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#0F172A',
            border: '1px solid rgba(0, 223, 129, 0.3)',
            borderRadius: '24px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '36px',
            position: 'relative',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)'
          }}>
            
            {/* Close Button */}
            <button 
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {submittedSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(0, 223, 129, 0.15)', color: '#00DF81', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>Candidatura Enviada!</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                  Recebemos seus dados e abrimos o canal de contato no WhatsApp com nosso RH. Nosso time analisará seu perfil com carinho, visse!
                </p>
                <button
                  onClick={handleCloseModal}
                  style={{
                    backgroundColor: '#00DF81',
                    color: '#070B18',
                    padding: '12px 28px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '14px'
                  }}
                >
                  Concluir
                </button>
              </div>
            ) : (
              <div>
                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: 800, 
                  color: '#00DF81', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px', 
                  marginBottom: '6px' 
                }}>
                  CANDIDATURA DIRETA
                </div>

                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                  {selectedJob.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.55)', marginBottom: '24px' }}>
                  {selectedJob.type} • {selectedJob.area}
                </p>

                <form onSubmit={handleSubmitCandidate} style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'rgba(255,255,255,0.85)' }}>
                      Nome Completo *
                    </label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ex: João da Silva"
                      value={candidateForm.nome}
                      onChange={e => setCandidateForm(prev => ({ ...prev, nome: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        backgroundColor: '#070B18',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'rgba(255,255,255,0.85)' }}>
                        E-mail *
                      </label>
                      <input 
                        type="email" 
                        required 
                        placeholder="seu@email.com"
                        value={candidateForm.email}
                        onChange={e => setCandidateForm(prev => ({ ...prev, email: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          backgroundColor: '#070B18',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'rgba(255,255,255,0.85)' }}>
                        WhatsApp *
                      </label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="(81) 98888-8888"
                        value={candidateForm.telefone}
                        onChange={e => setCandidateForm(prev => ({ ...prev, telefone: formatPhone(e.target.value) }))}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          backgroundColor: '#070B18',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'rgba(255,255,255,0.85)' }}>
                      Link do LinkedIn, Portfólio ou GitHub
                    </label>
                    <input 
                      type="url" 
                      placeholder="https://linkedin.com/in/seuperfil ou seu site"
                      value={candidateForm.portfolio}
                      onChange={e => setCandidateForm(prev => ({ ...prev, portfolio: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        backgroundColor: '#070B18',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'rgba(255,255,255,0.85)' }}>
                      Por que você quer construir o futuro na Infinity? (Opcional)
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Conte um pouco da sua trajetória e o que te motiva..."
                      value={candidateForm.motivo}
                      onChange={e => setCandidateForm(prev => ({ ...prev, motivo: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        backgroundColor: '#070B18',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loadingSubmit}
                    style={{
                      marginTop: '10px',
                      padding: '14px',
                      borderRadius: '12px',
                      backgroundColor: '#00DF81',
                      color: '#070B18',
                      fontWeight: 800,
                      fontSize: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: loadingSubmit ? 'not-allowed' : 'pointer',
                      opacity: loadingSubmit ? 0.7 : 1,
                      boxShadow: '0 4px 20px rgba(0, 223, 129, 0.35)'
                    }}
                  >
                    {loadingSubmit ? 'Enviando Candidatura...' : 'Enviar Candidatura Agora →'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
