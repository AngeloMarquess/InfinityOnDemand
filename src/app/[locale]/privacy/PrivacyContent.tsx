'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Database, 
  UserCheck, 
  Cookie, 
  RefreshCw, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  Building,
  KeyRound,
  Trash2,
  AlertCircle
} from 'lucide-react';

interface SectionItem {
  id: string;
  icon: React.ReactNode;
  tag: string;
  title: string;
  color: string;
  content: string;
  bullets?: string[];
  table?: { col1: string; col2: string }[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PrivacyContent({ dict, locale }: { dict?: any; locale?: string }) {
  const currentLocale = locale || 'pt';
  const es = currentLocale === 'es';
  const [openSection, setOpenSection] = useState<string | null>('dados-coletados');
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('contato@infinityondemand.com.br');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const sections: SectionItem[] = [
    {
      id: 'controlador',
      icon: <Building size={22} color="#00DF81" />,
      tag: es ? '01 • Identificación' : '01 • Identificação',
      title: es ? 'Identificación del Controlador de Datos' : 'Identificação do Controlador de Dados',
      color: '#00DF81',
      content: es 
        ? 'Infinity OnDemand opera como Controlador de Datos Personales, responsable de las decisiones sobre el tratamiento de datos recopilados a través de nuestro sitio web, aplicaciones SaaS (Delivery OS, Infinity Forms, CRM B2B) y servicios de consultoría.'
        : 'A Infinity OnDemand atua como Controladora de Dados Pessoais, sendo responsável pelas decisões referentes ao tratamento de dados coletados por meio do nosso website, aplicações SaaS proprietárias (Infinity Delivery OS, Infinity Forms, CRM B2B) e serviços de consultoria e engenharia de software.',
      bullets: es ? [
        'Razón Social: Infinity OnDemand Tecnologia e Marketing Digital Ltda.',
        'Sede Operativa: Recife - PE, Brasil',
        'Canal de Privacidad: contato@infinityondemand.com.br',
        'Sitio Oficial: infinityondemand.com.br'
      ] : [
        'Denominação: Infinity OnDemand Tecnologia & Soluções Digitais',
        'Sede Operacional: R. Cap. José da Luz, 137, Sala 0203 - Coelhos, Recife - PE',
        'Canal de Privacidade e DPO: contato@infinityondemand.com.br',
        'Domínio Oficial e Plataformas: https://infinityondemand.com.br'
      ]
    },
    {
      id: 'dados-coletados',
      icon: <Database size={22} color="#00AAFF" />,
      tag: es ? '02 • Recopilación' : '02 • Coleta de Dados',
      title: es ? 'Datos Personales que Recopilamos' : 'Quais Dados Pessoais Coletamos',
      color: '#00AAFF',
      content: es
        ? 'Recopilamos únicamente los datos necesarios para brindar nuestros servicios, mejorar la experiencia y formalizar contratos.'
        : 'Coletamos apenas os dados estritamente necessários para a prestação de serviços de excelência, desenvolvimento de sistemas, execução de propostas comerciais e suporte técnico contínuo.',
      bullets: es ? [
        'Datos de Contacto y Registro: Nombre completo, correo electrónico corporativo, WhatsApp/teléfono, empresa y cargo.',
        'Datos de Proyectos y Formularios: Presupuesto estimado, volumen de pedidos de delivery, desafíos técnicos y briefing.',
        'Datos Técnicos de Navegación: Dirección IP anonimizada, navegador, dispositivo, páginas visitadas y tiempo de permanência.',
        'Tokens e Integraciones Autorizadas: Credenciales de API de Meta (Instagram/Facebook) y Google cuando son expresamente conectadas por el cliente.'
      ] : [
        'Dados Cadastrais e de Contato: Nome completo, endereço de e-mail corporativo ou pessoal, telefone/WhatsApp, nome da empresa e cargo.',
        'Dados de Formulários Interativos e Diagnósticos: Faturamento aproximado, volume de entregas ou pedidos, nicho de atuação e desafios técnicos informados no Infinity Forms.',
        'Dados de Navegação e Telemetria: Endereço IP (com mascaramento), identificadores de sessão, geolocalização aproximada por cidade, tipo de navegador, sistema operacional e métricas de desempenho.',
        'Tokens e Credenciais de APIs Conectadas: Tokens de acesso OAuth para Meta Graph API (Instagram e Facebook) e Google Cloud, exclusivamente quando autorizados pelo próprio cliente.'
      ]
    },
    {
      id: 'finalidades',
      icon: <FileText size={22} color="#F59E0B" />,
      tag: es ? '03 • Propósito' : '03 • Finalidades',
      title: es ? 'Finalidades y Bases Legales del Tratamiento' : 'Finalidades e Bases Legais do Tratamento (LGPD)',
      color: '#F59E0B',
      content: es
        ? 'Todo tratamiento de datos realizado por Infinity se fundamenta estrictamente en las bases legales del Artículo 7 de la LGPD.'
        : 'Todo e qualquer tratamento de dados realizado pela Infinity OnDemand possui finalidade legítima, específica e está respaldado pelas bases legais da Lei Geral de Proteção de Dados (Art. 7º da Lei 13.709/2018):',
      table: [
        { col1: es ? 'Ejecución de Contrato (Art. 7, V)' : 'Execução de Contrato (Art. 7º, V)', col2: es ? 'Desarrollo de sitios web, provisión de SaaS, emisión de facturas y onboarding.' : 'Desenvolvimento de software, fornecimento das plataformas SaaS, faturamento e suporte.' },
        { col1: es ? 'Consentimiento (Art. 7, I)' : 'Consentimento (Art. 7º, I)', col2: es ? 'Envío de newsletters, diagnósticos comerciales por WhatsApp y cookies no esenciales.' : 'Envio de propostas comerciais, comunicações via WhatsApp e formulários de briefing.' },
        { col1: es ? 'Interés Legítimo (Art. 7, IX)' : 'Legítimo Interesse (Art. 7º, IX)', col2: es ? 'Mejora continua de la seguridad del sitio, prevención de fraudes y análisis de rendimiento.' : 'Segurança contra ataques cibernéticos, auditoria de código e análise de usabilidade.' },
        { col1: es ? 'Cumplimiento Legal (Art. 7, II)' : 'Cumprimento de Obrigação Legal (Art. 7º, II)', col2: es ? 'Almacenamiento de registros de conexión conforme al Marco Civil de Internet.' : 'Guarda de logs de conexão conforme determinação do Marco Civil da Internet (Art. 15).' }
      ]
    },
    {
      id: 'seguranca',
      icon: <Lock size={22} color="#00DF81" />,
      tag: es ? '04 • Seguridad' : '04 • Segurança & Criptografia',
      title: es ? 'Almacenamiento Seguro, Nube y Criptografía' : 'Armazenamento Seguro, Infraestrutura em Nuvem e Criptografia',
      color: '#00DF81',
      content: es
        ? 'Adoptamos las mejores prácticas de la industria en seguridad informática para garantizar la confidencialidad, integridad y disponibilidad de sus datos.'
        : 'Adotamos padrões internacionais de segurança da informação (InfoSec) para proteger seus dados contra acessos não autorizados, incidentes e vazamentos.',
      bullets: es ? [
        'Criptografía en Tránsito y Reposo: Protocolos TLS 1.3/HTTPS y cifrado AES-256 en bases de datos.',
        'Infraestructura de Nube Segura: Alojamientos en Supabase / PostgreSQL con políticas RLS (Row Level Security).',
        'Aislamiento de Entorno: Variables de servidor aisladas y sin exposición de secretos en el frontend.',
        'Copias de Seguridad Automatizadas: Backups periódicos cifrados con redundancia geográfica.'
      ] : [
        'Criptografia de Ponta a Ponta: Tráfego 100% criptografado com TLS 1.3 / SSL bancário e dados em repouso protegidos por AES-256.',
        'Banco de Dados Supabase (PostgreSQL): Políticas ativas de Row Level Security (RLS) que impedem que qualquer usuário acesse dados de terceiros.',
        'Edge Network Global (Vercel & Cloudflare): Proteção ativa contra ataques DDoS, rate limiting inteligente e firewall de aplicação web (WAF).',
        'Controle de Acesso Rígido: Princípio do menor privilégio (PoLP) para a equipe técnica e uso obrigatório de autenticação em dois fatores (2FA).'
      ]
    },
    {
      id: 'compartilhamento',
      icon: <KeyRound size={22} color="#A855F7" />,
      tag: es ? '05 • Compartir' : '05 • Compartilhamento de Dados',
      title: es ? 'Compartición Responsable con Terceros' : 'Compartilhamento Responsável de Dados',
      color: '#A855F7',
      content: es
        ? 'NUNCA vendemos, alquilamos ni comercializamos datos personales a terceros. Compartimos datos únicamente con proveedores de infraestructura esenciales.'
        : 'A Infinity OnDemand declara solenemente: NUNCA comercializamos, alugamos, repassamos ou monetizamos dados pessoais com terceiros para fins publicitários de outros. O compartilhamento ocorre exclusivamente com parceiros tecnológicos indispensáveis:',
      bullets: es ? [
        'Vercel Inc.: Servidores globales y hosting de borde (Edge Runtime).',
        'Supabase Inc.: Base de datos relacional PostgreSQL con certificación SOC2.',
        'Meta Platforms Inc.: APIs oficiales de WhatsApp Business e Instagram Graph quando integradas pelo cliente.',
        'Google Analytics & Google Tag Manager: Métricas de tráfico anonimizadas para optimización del sitio.',
        'Stripe / Gateways Bancarios: Procesamiento seguro de pagos con certificación PCI-DSS Nivel 1.'
      ] : [
        'Vercel Inc. (EUA / Global): Hospedagem de infraestrutura em nuvem, Edge Runtime e CDN global.',
        'Supabase Inc.: Banco de dados PostgreSQL corporativo com certificação de segurança SOC2 Tipo II.',
        'Meta Platforms (WhatsApp Cloud API / Graph API): Disparos transacionais e automações contratadas expressamente.',
        'OpenAI / Anthropic: Processamento de inteligência artificial de agentes sob termos de estrita confidencialidade (sem uso de dados de clientes para treinamento de modelos públicos).',
        'Gateways de Pagamento Homologados (Stripe, Mercado Pago, Asaas): Processamento seguro com certificação PCI-DSS.'
      ]
    },
    {
      id: 'cookies',
      icon: <Cookie size={22} color="#EC4899" />,
      tag: es ? '06 • Cookies' : '06 • Cookies & Rastreamento',
      title: es ? 'Política de Cookies y Tecnologías de Rastreamento' : 'Política de Cookies e Tecnologias de Rastreamento',
      color: '#EC4899',
      content: es
        ? 'Utilizamos cookies y tecnologías similares para garantizar el funcionamiento técnico del sitio web, recordar sus preferencias y analizar métricas de visitas.'
        : 'Utilizamos cookies e tecnologias similares para proporcionar a melhor navegação, lembrar suas preferências de idioma e analisar métricas de engajamento.',
      bullets: es ? [
        'Cookies Esenciales: Necesarios para la navegación, autenticación en portales y seguridad.',
        'Cookies de Rendimiento y Análisis: Google Analytics con IP anonimizada para entender qué contenidos son más útiles.',
        'Cookies de Conversión: Píxeles de Meta y Google Ads para medir la efectividad de campañas publicitarias.',
        'Control del Usuario: Puede deshabilitar o bloquear las cookies en cualquier momento en la configuración de su navegador.'
      ] : [
        'Cookies Estritamente Necessários: Indispensáveis para carregamento do site, controle de sessão, segurança e roteamento de idioma.',
        'Cookies Analíticos (Google Analytics / GTM): Coletam métricas anônimas sobre páginas visitadas e velocidade de carregamento.',
        'Cookies de Desempenho e Marketing: Medem o retorno de anúncios no Google e Meta para evitar exibir anúncios repetidos.',
        'Como Gerenciar: Você pode limpar ou desabilitar cookies a qualquer instante nas preferências do seu navegador (Chrome, Safari, Firefox ou Edge).'
      ]
    },
    {
      id: 'direitos',
      icon: <UserCheck size={22} color="#00DF81" />,
      tag: es ? '07 • Derechos' : '07 • Seus Direitos (Art. 18 LGPD)',
      title: es ? 'Tus Derechos como Titular de Datos' : 'Seus Direitos como Titular de Dados Pessoais',
      color: '#00DF81',
      content: es
        ? 'Garantizamos el pleno ejercicio de los derechos previstos en la legislación de protección de datos (LGPD y regulaciones internacionales).'
        : 'Em conformidade com o Artigo 18 da Lei Geral de Proteção de Dados (LGPD), você pode exercer a qualquer momento os seguintes direitos mediante solicitação gratuita:',
      bullets: es ? [
        'Confirmación y Acceso: Saber si tratamos sus datos y recibir una copia completa de los mismos.',
        'Corrección: Solicitar la actualización de datos incompletos, inexactos o desactualizados.',
        'Anonimización o Bloqueo: Para datos innecesarios o tratados en disconformidad con la ley.',
        'Eliminación de Datos: Borrar de forma permanente sus datos de nuestras bases activas.',
        'Portabilidad: Recibir sus datos en formato estructurado e interoperable.',
        'Revocación del Consentimiento: Retirar su autorización en cualquier momento con efecto inmediato.'
      ] : [
        'Confirmação da Existência de Tratamento e Acesso Fácil: Saber quais dados seus possuímos e como foram tratados.',
        'Correção de Dados Incompletos, Inexatos ou Desatualizados.',
        'Anonimização, Bloqueio ou Eliminação de dados desnecessários ou tratados em desconformidade com a lei.',
        'Portabilidade dos Dados a outro fornecedor de serviços ou produtos digitais.',
        'Eliminação dos Dados Pessoais tratados com o consentimento do titular.',
        'Revogação do Consentimento a qualquer momento mediante manifestação expressa e simplificada.',
        'Informação sobre Compartilhamento: Saber com quais entidades públicas ou privadas compartilhamos dados.'
      ]
    },
    {
      id: 'retencao',
      icon: <Trash2 size={22} color="#F59E0B" />,
      tag: es ? '08 • Retención' : '08 • Retenção e Descarte',
      title: es ? 'Retención y Eliminación Segura de Datos' : 'Retenção e Descarte Seguro de Dados',
      color: '#F59E0B',
      content: es
        ? 'Conservamos sus datos personales únicamente durante el período necesario para cumplir las finalidades para las que fueron recopilados.'
        : 'Os dados pessoais são armazenados apenas pelo tempo necessário para atingir as finalidades para as quais foram coletados, respeitando os prazos mínimos de guarda exigidos pela legislação brasileira (como o Marco Civil da Internet para logs de conexão - 6 meses, e o Código Civil para obrigações tributárias e contratuais - 5 anos).',
      bullets: es ? [
        'Leads Comerciales: Conservados durante 12 meses para seguimiento o eliminados inmediatamente a petición.',
        'Clientes Activos: Conservados durante la vigencia del contrato de prestación de servicios.',
        'Eliminación Segura: Al expirar los plazos legales, los datos se eliminan o se anonimizan de forma irreversible.'
      ] : [
        'Dados de Contatos e Leads: Mantidos por até 12 meses para histórico de diagnósticos ou excluídos prontamente mediante solicitação.',
        'Contratos e Dados Fiscais: Retidos pelo período legal de 5 (cinco) anos conforme exigência da Receita Federal e Código Tributário Nacional.',
        'Exclusão Imediata: Você pode solicitar o apagamento completo dos seus registros pelo e-mail contato@infinityondemand.com.br.'
      ]
    },
    {
      id: 'dpo',
      icon: <Mail size={22} color="#00AAFF" />,
      tag: es ? '09 • Contacto' : '09 • Contato & Encarregado (DPO)',
      title: es ? 'Canal del Encarregado de Protección de Datos (DPO)' : 'Canal do Encarregado de Proteção de Dados (DPO)',
      color: '#00AAFF',
      content: es
        ? 'Para cualquier consulta, solicitud de derechos o dudas sobre esta Política de Privacidad, comuníquese con nuestro canal oficial:'
        : 'Para exercer qualquer um dos seus direitos previstos na LGPD, tirar dúvidas sobre esta Política ou relatar qualquer preocupação referente à privacidade dos seus dados, entre em contato direto com o nosso Encarregado:',
      bullets: [
        'E-mail Oficial DPO: contato@infinityondemand.com.br',
        'WhatsApp Oficial de Atendimento: +55 (81) 98128-0719',
        'Tempo Médio de Resposta: Até 48 horas úteis (com prazo legal máximo de 15 dias para solicitações complexas).'
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: '#070B18', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <Header dict={dict} locale={locale} />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '100px 24px 60px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 0%, rgba(0, 223, 129, 0.12) 0%, transparent 70%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          
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
            <ShieldCheck size={16} /> {es ? 'CONFORMIDAD LGPD & SEGURIDAD DIGITAL' : 'CONFORMIDADE LGPD & SEGURANÇA DIGITAL'}
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            marginBottom: '20px',
            color: '#ffffff'
          }}>
            {es ? 'Política de' : 'Política de'}{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00DF81 0%, #00AAFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {es ? 'Privacidad y Protección de Datos' : 'Privacidade & Proteção de Dados'}
            </span>
          </h1>

          <p style={{
            fontSize: '17px',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: 1.7,
            maxWidth: '720px',
            margin: '0 auto 32px'
          }}>
            {es 
              ? 'Conozca con total transparencia cómo la Infinity OnDemand trata, almacena y protege su información en conformidad con la LGPD (Ley 13.709/2018) y el Marco Civil de Internet.'
              : 'Saiba com total clareza e transparência como a Infinity OnDemand coleta, utiliza, armazena e protege suas informações em estrita observância à Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e ao Marco Civil da Internet.'}
          </p>

          {/* Metadata Cards */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <RefreshCw size={14} color="#00DF81" />
              <span>{es ? 'Actualizado: Noviembre de 2026' : 'Atualizado em: Novembro de 2026'}</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <Lock size={14} color="#00AAFF" />
              <span>{es ? 'Cifrado TLS 1.3 / AES-256' : 'Criptografia TLS 1.3 & AES-256'}</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <CheckCircle2 size={14} color="#F59E0B" />
              <span>{es ? 'Cumplimiento Legal LGPD' : 'Conformidade Integral LGPD'}</span>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: '60px 24px 100px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Quick Highlights Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '50px'
        }}>
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(0, 223, 129, 0.2)',
            borderRadius: '18px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ color: '#00DF81', fontSize: '24px', marginBottom: '12px' }}>🔒</div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: '#fff' }}>
              {es ? 'Cero Comercialización' : 'Zero Comercialização'}
            </h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
              {es 
                ? 'Nunca vendemos ni alquilamos su información personal a terceros bajo ninguna circunstancia.'
                : 'Jamais comercializamos, alugamos ou monetizamos dados com terceiros sob qualquer hipótese.'}
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(0, 170, 255, 0.2)',
            borderRadius: '18px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ color: '#00AAFF', fontSize: '24px', marginBottom: '12px' }}>⚡</div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: '#fff' }}>
              {es ? 'Autonomía y Control' : 'Autonomia e Controle'}
            </h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
              {es 
                ? 'Usted puede solicitar la exclusión, actualización o copia de sus datos en cualquier momento.'
                : 'Você pode solicitar a alteração, eliminação ou exportação dos seus dados em poucos cliques.'}
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '18px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ color: '#F59E0B', fontSize: '24px', marginBottom: '12px' }}>🛡️</div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: '#fff' }}>
              {es ? 'Bancos de Datos Seguros' : 'Bancos de Dados Seguros'}
            </h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
              {es 
                ? 'PostgreSQL con Row Level Security y cifrado de alta gama alojado en la nube de Supabase.'
                : 'PostgreSQL corporativo com isolamento de linhas (RLS) e criptografia em trânsito e repouso.'}
            </p>
          </div>
        </div>

        {/* Index Accordion Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sections.map((sec) => {
            const isOpen = openSection === sec.id;
            return (
              <div 
                key={sec.id}
                style={{
                  backgroundColor: '#0F172A',
                  border: isOpen ? `1px solid ${sec.color}55` : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: isOpen ? `0 12px 30px ${sec.color}15` : 'none'
                }}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(sec.id)}
                  style={{
                    width: '100%',
                    padding: '24px 28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: `${sec.color}15`,
                      border: `1px solid ${sec.color}35`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {sec.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: sec.color, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '2px' }}>
                        {sec.tag}
                      </div>
                      <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                        {sec.title}
                      </h2>
                    </div>
                  </div>

                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease'
                  }}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                {/* Accordion Body */}
                {isOpen && (
                  <div style={{
                    padding: '0 28px 28px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingTop: '20px'
                  }}>
                    <p style={{
                      fontSize: '15px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.8,
                      marginBottom: sec.bullets || sec.table ? '20px' : '0'
                    }}>
                      {sec.content}
                    </p>

                    {/* Bullets List */}
                    {sec.bullets && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {sec.bullets.map((bullet, bIdx) => (
                          <div 
                            key={bIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px',
                              backgroundColor: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                              borderRadius: '12px',
                              padding: '12px 16px',
                              fontSize: '14px',
                              color: 'rgba(255, 255, 255, 0.75)',
                              lineHeight: 1.6
                            }}
                          >
                            <span style={{ color: sec.color, fontWeight: 800, marginTop: '2px' }}>✓</span>
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Table if any */}
                    {sec.table && (
                      <div style={{
                        marginTop: '16px',
                        overflowX: 'auto',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                      }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                              <th style={{ padding: '12px 16px', color: '#fff', fontWeight: 700 }}>Base Legal LGPD</th>
                              <th style={{ padding: '12px 16px', color: '#fff', fontWeight: 700 }}>Aplicação Prática na Infinity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sec.table.map((row, rIdx) => (
                              <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                                <td style={{ padding: '12px 16px', color: sec.color, fontWeight: 600 }}>{row.col1}</td>
                                <td style={{ padding: '12px 16px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5 }}>{row.col2}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* DPO Contact Banner */}
        <div style={{
          marginTop: '60px',
          background: 'linear-gradient(135deg, rgba(0, 223, 129, 0.1) 0%, rgba(0, 170, 255, 0.1) 100%)',
          border: '1px solid rgba(0, 223, 129, 0.3)',
          borderRadius: '24px',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '20px',
            backgroundColor: 'rgba(0, 223, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <Mail size={28} color="#00DF81" />
          </div>

          <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
            {es ? '¿Dudas sobre tus Datos o Solicitudes LGPD?' : 'Dúvidas sobre seus Dados ou Solicitação LGPD?'}
          </h3>
          <p style={{
            fontSize: '15px',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '620px',
            lineHeight: 1.6,
            marginBottom: '28px'
          }}>
            {es 
              ? 'Nuestro Oficial de Protección de Datos (DPO) está a su disposición para resolver cualquier solicitud en un plazo de hasta 48 horas.'
              : 'Nosso Encarregado pelo Tratamento de Dados Pessoais (DPO) está à disposição para atender requisições de titulares e garantir que seus direitos sejam plenamente atendidos.'}
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={handleCopyEmail}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#00DF81',
                color: '#070B18',
                fontWeight: 800,
                fontSize: '14px',
                padding: '14px 28px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0, 223, 129, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              {copied ? '✓ E-mail copiado!' : 'Copiar E-mail do DPO: contato@infinityondemand.com.br'}
            </button>

            <a
              href="https://wa.me/5581981280719?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20o%20Encarregado%20de%20Privacidade%20(DPO)%20da%20Infinity%20OnDemand."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '14px',
                padding: '14px 28px',
                borderRadius: '12px',
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                transition: 'all 0.2s'
              }}
            >
              Falar via WhatsApp
            </a>
          </div>
        </div>

      </section>

      <Footer dict={dict} locale={locale} />
    </div>
  );
}
