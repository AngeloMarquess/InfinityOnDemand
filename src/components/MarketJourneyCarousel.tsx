'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Smartphone,
  Layers,
  Scale,
  Truck,
  Repeat,
  CheckCircle2
} from 'lucide-react';

interface JourneyStep {
  id: number;
  badge: string;
  pill: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  highlightText: string;
  linkUrl: string;
  linkText: string;
  icon: any;
}

const steps: JourneyStep[] = [
  {
    id: 0,
    badge: '01. Canais de Venda',
    pill: 'Omnicanalidade',
    title: 'O cliente escolhe como comprar',
    description:
      'Pelo aplicativo próprio (iOS e Android), pela loja virtual web ou pelo WhatsApp oficial, sempre com a identidade da sua marca. Em qualquer canal, o pedido sai com o catálogo atualizado, preços promocionais e estoque sincronizado em tempo real.',
    image: '/market/jornada-1-escolha.png',
    imageAlt: 'Cliente navegando no e-commerce de supermercado em casa',
    highlightText: 'App Próprio • Loja Virtual • WhatsApp',
    linkUrl: '/market/solucoes/aplicativo',
    linkText: 'Conhecer Aplicativo e Loja Virtual',
    icon: Smartphone,
  },
  {
    id: 1,
    badge: '02. Centralização',
    pill: 'Fluxo Unificado',
    title: 'O pedido chega à operação',
    description:
      'Venha do site, do aplicativo, do WhatsApp ou de um canal parceiro, todos os pedidos entram na mesma fila inteligente, ordenados rigorosamente pelo horário de entrega ou janela de retirada. E volta para o seu ERP sem ninguém precisar redigitar.',
    image: '/market/jornada-2-operacao.png',
    imageAlt: 'Painel Kanban de pedidos centralizado com WhatsApp e ERP',
    highlightText: 'Fila única • Integração ERP sem redigitação',
    linkUrl: '/market/solucoes/gestao',
    linkText: 'Ver Painel de Gestão e Pedidos',
    icon: Layers,
  },
  {
    id: 2,
    badge: '03. Estoque & Balança',
    pill: 'Separação Sem Erros',
    title: 'A equipe prepara a compra',
    description:
      'No smartphone ou coletor, o separador (picker) vê a lista organizada pela ordem lógica dos corredores. Lê o código de barras e pesa hortifrúti na balança eletrônica com ajuste dinâmico no caixa. Se faltar um produto, envia foto das opções de substituição no WhatsApp do cliente em 1 toque.',
    image: '/market/jornada-3-preparo.png',
    imageAlt: 'Operador com app de separação e pesagem no setor de hortifrúti',
    highlightText: 'Leitura de balança • Substituição com foto no WhatsApp',
    linkUrl: '/market/solucoes/separacao',
    linkText: 'Explorar App do Separador (Picker)',
    icon: Scale,
  },
  {
    id: 3,
    badge: '04. Entrega OxeeGo',
    pill: 'Logística de Ponta',
    title: 'A compra chega ao cliente',
    description:
      'O app do motorista agrupa entregas por bairros e monta a rota mais rápida. Cada sacola é conferida pelo QR Code no embarque e a entrega é finalizada com comprovante digital (foto ou assinatura). Vans e frotas adesivadas da OxeeGo entregam em Recife e RMR com rastreio ao vivo no WhatsApp.',
    image: '/market/jornada-4-oxeego-van.jpg',
    imageAlt: 'Van de entrega adesivada da OxeeGo Supermercado em rota em Recife',
    highlightText: 'Van adesivada OxeeGo • Rastreio via GPS para o cliente',
    linkUrl: '/market/solucoes/entregas',
    linkText: 'Ver Roteirizador e App de Entregas',
    icon: Truck,
  },
  {
    id: 4,
    badge: '05. Recorrência',
    pill: 'Fidelização Contínua',
    title: 'O relacionamento continua',
    description:
      'Clube de assinaturas semanais de hortifrúti, cashback, cupons segmentados e botão de recompra em 1 toque saem do mesmo painel onde a venda acontece. Você programa avisos push no celular do cliente e transforma compradores casuais em clientes fiéis todo mês.',
    image: '/market/jornada-5-fidelizacao.png',
    imageAlt: 'Cliente consultando clube de benefícios e assinaturas de compras',
    highlightText: 'Assinatura semanal de feira • Cashback próprio',
    linkUrl: '/market/solucoes/fidelidade',
    linkText: 'Conhecer Clube de Assinaturas',
    icon: Repeat,
  },
];

const STEP_DURATION = 6000; // 6 seconds per slide

export default function MarketJourneyCarousel({ locale = 'pt' }: { locale?: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const prefix = locale === 'pt' ? '' : `/${locale}`;

  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 50; // update progress every 50ms
    const stepIncrement = (intervalTime / STEP_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentStep((curr) => (curr + 1) % steps.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, currentStep]);

  const handleStepClick = (idx: number) => {
    setCurrentStep(idx);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentStep((curr) => (curr === 0 ? steps.length - 1 : curr - 1));
    setProgress(0);
  };

  const handleNext = () => {
    setCurrentStep((curr) => (curr + 1) % steps.length);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const step = steps[currentStep];
  const StepIcon = step.icon;

  return (
    <section style={{
      padding: '96px 24px',
      backgroundColor: '#090D16',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(0, 223, 129, 0.08) 0%, rgba(9, 13, 22, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'left', marginBottom: '52px', maxWidth: '820px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '1.2px',
            color: '#00DF81',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '10px'
          }}>
            ● Do primeiro clique à entrega na porta
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 4.5vw, 44px)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: '6px 0 16px'
          }}>
            Da primeira compra à fidelização contínua: estamos com você em cada etapa.
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#94A3B8', margin: 0 }}>
            Acompanhamos sua operação de ponta a ponta para que cada detalhe funcione perfeitamente: o cliente escolhe onde comprar, o pedido unifica na operação, a equipe separa com balança, a van entrega com rota otimizada e o relacionamento continua para a próxima feira.
          </p>
        </div>

        {/* Carousel Container Card */}
        <div style={{
          background: 'linear-gradient(145deg, #111827 0%, #0F172A 100%)',
          border: '1px solid rgba(0, 223, 129, 0.25)',
          borderRadius: '24px',
          padding: 'clamp(20px, 4vw, 44px)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
          position: 'relative'
        }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(24px, 4vw, 48px)',
            alignItems: 'center'
          }}>
            
            {/* Left: Image Container with Van & Badges */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: '#0B0F19',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
                position: 'relative',
                aspectRatio: '4 / 3',
                maxHeight: '380px'
              }}>
                <img
                  key={step.image}
                  src={step.image}
                  alt={step.imageAlt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    animation: 'fadeIn 0.4s ease forwards'
                  }}
                />

                {/* Badge Overlay */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(11, 15, 25, 0.88)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 223, 129, 0.4)',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <StepIcon size={14} color="#00DF81" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                    {step.pill}
                  </span>
                </div>

                {/* Specific highlight for OxeeGo Van */}
                {step.id === 3 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    background: 'rgba(11, 15, 25, 0.92)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(0, 223, 129, 0.4)',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <img
                      src="/market/oxeego_instagram_avatar.jpg"
                      alt="OxeeGo"
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #00DF81' }}
                    />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>
                        Frota Adesivada • OxeeGo Recife
                      </div>
                      <div style={{ fontSize: '11px', color: '#00DF81' }}>
                        Entregas pontuais e rastreamento em tempo real por bairro
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Step Content & Progress Indicators */}
            <div>
              
              {/* Top Progress Bar Row (5 segments + Play/Pause) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '32px'
              }}>
                {steps.map((s, idx) => {
                  const isActive = idx === currentStep;
                  const isCompleted = idx < currentStep;

                  return (
                    <button
                      key={s.id}
                      onClick={() => handleStepClick(idx)}
                      title={`Ir para etapa ${s.id + 1}: ${s.title}`}
                      style={{
                        flex: 1,
                        height: '28px',
                        background: 'transparent',
                        border: 'none',
                        padding: '8px 0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative'
                      }}
                    >
                      {/* Outer capsule track */}
                      <div style={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '999px',
                        background: isActive
                          ? 'rgba(255, 255, 255, 0.12)'
                          : isCompleted
                          ? '#00DF81'
                          : 'rgba(255, 255, 255, 0.08)',
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'background 0.2s',
                        border: isActive ? '1px solid rgba(0, 223, 129, 0.5)' : 'none'
                      }}>
                        {/* Inner active fill bar */}
                        {isActive && (
                          <div
                            style={{
                              height: '100%',
                              width: `${progress}%`,
                              backgroundColor: '#00DF81',
                              transition: 'width 0.05s linear',
                              boxShadow: '0 0 8px #00DF81'
                            }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Play / Pause Toggle Button */}
                <button
                  onClick={togglePlayPause}
                  aria-label={isPlaying ? 'Pausar carrossel' : 'Iniciar carrossel'}
                  title={isPlaying ? 'Pausar carrossel automático' : 'Iniciar carrossel automático'}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginLeft: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0, 223, 129, 0.2)'; e.currentTarget.style.borderColor = '#00DF81'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
                >
                  {isPlaying ? <Pause size={13} fill="#fff" /> : <Play size={13} fill="#fff" style={{ marginLeft: '1px' }} />}
                </button>
              </div>

              {/* Step Info Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: 800,
                color: '#00DF81',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                marginBottom: '10px'
              }}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(0, 223, 129, 0.15)',
                  border: '1px solid rgba(0, 223, 129, 0.3)'
                }}>
                  {step.badge}
                </span>
                <span style={{ color: '#64748B' }}>• Etapa {currentStep + 1} de {steps.length}</span>
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: 'clamp(22px, 3.2vw, 32px)',
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1.2,
                marginBottom: '16px',
                letterSpacing: '-0.01em'
              }}>
                {step.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '15px',
                lineHeight: 1.7,
                color: '#CBD5E1',
                marginBottom: '24px'
              }}>
                {step.description}
              </p>

              {/* Feature highlight line */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: '#00DF81',
                fontWeight: 600,
                marginBottom: '28px',
                background: 'rgba(0, 223, 129, 0.06)',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(0, 223, 129, 0.15)'
              }}>
                <CheckCircle2 size={16} />
                <span>{step.highlightText}</span>
              </div>

              {/* Action Buttons & Manual Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <Link
                  href={`${prefix}${step.linkUrl}`}
                  style={{
                    backgroundColor: '#00DF81',
                    color: '#0B0F19',
                    padding: '12px 22px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '14px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(0, 223, 129, 0.3)',
                    transition: 'transform 0.2s'
                  }}
                >
                  {step.linkText}
                  <ArrowRight size={16} />
                </Link>

                {/* Left/Right manual arrow buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handlePrev}
                    aria-label="Etapa anterior"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = '#00DF81'; e.currentTarget.style.color = '#00DF81'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.color = '#fff'; }}
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    onClick={handleNext}
                    aria-label="Próxima etapa"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = '#00DF81'; e.currentTarget.style.color = '#00DF81'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.color = '#fff'; }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
