'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface FormQuestion {
  id: string;
  title: string;
  helper?: string;
  type:
    | 'select'
    | 'checkbox'
    | 'text'
    | 'textarea'
    | 'number'
    | 'currency'
    | 'phone'
    | 'email'
    | 'date'
    | 'rating';
  options?: string[];
  required: boolean;
}

interface FormItem {
  id: string;
  title: string;
  slug: string;
  tenantType: 'infinity' | 'client';
  clientName?: string;
  niche: string;
  whatsappDestination?: string;
  sendToWhatsapp: boolean;
  thankYouTitle: string;
  thankYouMessage: string;
  autoRedirectSeconds: number;
  questions: FormQuestion[];
  brandName?: string;
  brandLogoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundStyle?: string;
}

function DynamicFormFunnel() {
  const searchParams = useSearchParams();
  const slug = searchParams?.get('slug') || searchParams?.get('form') || 'e-commerce-moda';
  const utmSource = searchParams?.get('utm_source') || '';
  const utmMedium = searchParams?.get('utm_medium') || '';
  const utmCampaign = searchParams?.get('utm_campaign') || '';

  const [form, setForm] = useState<FormItem | null>(null);
  const [loadingForm, setLoadingForm] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Armazenamento de respostas: questionId -> valor (string, number, array)
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadCompany, setLeadCompany] = useState('');

  const [validationError, setValidationError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [countdown, setCountdown] = useState(4);

  // Carregar dados do formulário da API
  useEffect(() => {
    async function fetchForm() {
      try {
        setLoadingForm(true);
        const res = await fetch(`/api/forms?slug=${slug}`);
        const data = await res.json();
        if (data.form) {
          setForm(data.form);
        }
      } catch (err) {
        console.error('Erro ao buscar formulário:', err);
      } finally {
        setLoadingForm(false);
      }
    }
    fetchForm();
  }, [slug]);

  const questions = form?.questions || [];
  const currentQuestion = questions[currentStepIndex];
  const totalQuestions = questions.length;
  const progressPercent = totalQuestions > 0 ? Math.round(((currentStepIndex) / totalQuestions) * 100) : 0;

  // Máscara de telefone
  const formatPhone = (val: string) => {
    let digits = val.replace(/\D/g, '');
    if (digits.length > 11) digits = digits.slice(0, 11);
    if (digits.length <= 2) return digits.length ? `(${digits}` : '';
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  // Redirecionamento automático WhatsApp na conclusão
  useEffect(() => {
    if (isCompleted && whatsappUrl && form?.sendToWhatsapp) {
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            window.location.href = whatsappUrl;
            return 0;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCompleted, whatsappUrl, form]);

  if (loadingForm) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#050814',
          color: '#00DF81',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
        }}
      >
        Carregando Infinity Forms...
      </div>
    );
  }

  if (!form || questions.length === 0) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#050814',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', sans-serif",
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Formulário não encontrado</h2>
        <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '20px' }}>
          O link acessado ({slug}) não possui perguntas ativas no momento.
        </p>
        <a
          href="https://infinityondemand.com.br"
          style={{ padding: '10px 20px', borderRadius: '10px', backgroundColor: '#00DF81', color: '#070B18', fontWeight: 800, textDecoration: 'none' }}
        >
          Voltar ao site
        </a>
      </div>
    );
  }

  // Avançar etapa com validação de campo obrigatório
  const handleNextStep = async () => {
    if (!currentQuestion) return;

    const currentVal = answers[currentQuestion.id];

    // Validação de obrigatório
    if (currentQuestion.required) {
      if (
        currentVal === undefined ||
        currentVal === null ||
        (typeof currentVal === 'string' && !currentVal.trim()) ||
        (Array.isArray(currentVal) && currentVal.length === 0)
      ) {
        setValidationError('Esta pergunta é obrigatória. Por favor, responda para continuar.');
        return;
      }
    }

    setValidationError('');

    // Capturar dados de contato em perguntas de texto/telefone/email
    if (currentQuestion.type === 'phone' && currentVal) {
      setLeadPhone(String(currentVal));
    }
    if (currentQuestion.type === 'email' && currentVal) {
      setLeadEmail(String(currentVal));
    }
    if (currentQuestion.type === 'text' && !leadName && currentQuestion.title.toLowerCase().includes('nome')) {
      setLeadName(String(currentVal));
    }

    // Se estiver na última etapa, submeter formulário
    if (currentStepIndex >= totalQuestions - 1) {
      await handleFinalSubmit();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  // Voltar etapa
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setValidationError('');
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Manipular seleção única (Select / Radio)
  const handleSelectOption = (opt: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: opt }));
    setValidationError('');
    setTimeout(() => {
      if (currentStepIndex >= totalQuestions - 1) {
        handleFinalSubmit({ ...answers, [currentQuestion.id]: opt });
      } else {
        setCurrentStepIndex((prev) => prev + 1);
      }
    }, 220);
  };

  // Manipular caixas de seleção múltipla (Checkboxes: 2, 3 ou mais opções)
  const handleCheckboxToggle = (opt: string) => {
    const currentList: string[] = Array.isArray(answers[currentQuestion.id]) ? [...answers[currentQuestion.id]] : [];
    const exists = currentList.includes(opt);
    let updated: string[];
    if (exists) {
      updated = currentList.filter((item) => item !== opt);
    } else {
      updated = [...currentList, opt];
    }
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: updated }));
    if (updated.length > 0) setValidationError('');
  };

  // Envio final para API
  const handleFinalSubmit = async (finalAnswersOverride?: Record<string, any>) => {
    try {
      setSubmitting(true);
      const payloadAnswers = finalAnswersOverride || answers;

      // Mapear respostas com títulos das perguntas para fácil leitura
      const mappedAnswers: Record<string, any> = {};
      questions.forEach((q) => {
        const val = payloadAnswers[q.id];
        if (val !== undefined) {
          mappedAnswers[q.title] = val;
        }
      });

      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_slug: form.slug,
          form_title: form.title,
          name: leadName || answers['q1'] || 'Lead Interessado',
          phone: leadPhone || answers['q2'] || '',
          email: leadEmail || '',
          company: leadCompany || '',
          answers: mappedAnswers,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
        }),
      });

      const data = await res.json();
      if (data.whatsapp_url) {
        setWhatsappUrl(data.whatsapp_url);
      }
      setIsCompleted(true);
    } catch (err) {
      console.error(err);
      setIsCompleted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: "url('/forms-bg.jpg')",
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundColor: '#050814',
        color: '#FFFFFF',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 16px',
        boxSizing: 'border-box',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Overlay escuro translúcido */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 8, 20, 0.72)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── HEADER: LOGO DISCRETO + STEPPER ── */}
      <header
        style={{
          width: '100%',
          maxWidth: '540px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: '16px',
        }}
      >
        <a
          href="https://infinityondemand.com.br"
          target="_blank"
          rel="noopener noreferrer"
          title="Infinity On Demand"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '14px',
            textDecoration: 'none',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <img
            src="/logo-infinity.png"
            alt="Infinity On Demand"
            style={{
              height: '28px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 10px rgba(0, 223, 129, 0.45))',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 900, letterSpacing: '-0.3px' }}>
            <span>INFINITY</span>
            <span style={{ color: '#00DF81' }}>ON DEMAND</span>
          </div>
        </a>

        {/* Stepper Progress Bar */}
        {!isCompleted && totalQuestions > 0 && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: 800, letterSpacing: '0.8px', color: '#00DF81', textTransform: 'uppercase' }}>
              <span>Etapa {currentStepIndex + 1} de {totalQuestions}</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 600 }}>{progressPercent}%</span>
            </div>

            <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.max(progressPercent, 6)}%`,
                  background: 'linear-gradient(90deg, #00DF81 0%, #00F0FF 100%)',
                  borderRadius: '999px',
                  transition: 'width 0.4s ease-out',
                }}
              />
            </div>
          </div>
        )}
      </header>

      {/* ── CARD CENTRAL DO FORMULÁRIO ── */}
      <main
        style={{
          width: '100%',
          maxWidth: '540px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(11, 15, 28, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '32px 28px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            transition: 'all 0.3s ease',
          }}
        >

          {/* ════════ TELAS DE PERGUNTAS ATIVAS ════════ */}
          {!isCompleted && currentQuestion && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', lineHeight: '1.3', marginBottom: '6px' }}>
                  {currentQuestion.title}
                  {currentQuestion.required && (
                    <span style={{ color: '#00DF81', marginLeft: '6px' }} title="Obrigatória">*</span>
                  )}
                </h1>
                {currentQuestion.helper && (
                  <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
                    {currentQuestion.helper}
                  </p>
                )}
              </div>

              {/* TIPO: MÚLTIPLA ESCOLHA (1 OPÇÃO - RADIO / 1-CLIQUE) */}
              {currentQuestion.type === 'select' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(currentQuestion.options || []).map((opt, oIdx) => {
                    const isSelected = answers[currentQuestion.id] === opt;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        style={{
                          width: '100%',
                          padding: '16px 18px',
                          borderRadius: '14px',
                          border: isSelected ? '1px solid #00DF81' : '1px solid rgba(255, 255, 255, 0.12)',
                          backgroundColor: isSelected ? 'rgba(0, 223, 129, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                          color: '#fff',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          fontSize: '14px',
                          fontWeight: 600,
                          transition: 'all 0.18s',
                        }}
                      >
                        <span>{opt}</span>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: isSelected ? '2px solid #00DF81' : '2px solid rgba(255, 255, 255, 0.3)',
                            backgroundColor: isSelected ? '#00DF81' : 'transparent',
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TIPO: CAIXAS DE SELEÇÃO (MÚLTIPLAS OPÇÕES - MARCAR 2, 3 OU MAIS) */}
              {currentQuestion.type === 'checkbox' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p style={{ fontSize: '11px', color: '#00DF81', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
                    ✓ Você pode selecionar múltiplas opções:
                  </p>
                  {(currentQuestion.options || []).map((opt, oIdx) => {
                    const selectedList: string[] = Array.isArray(answers[currentQuestion.id]) ? answers[currentQuestion.id] : [];
                    const isSelected = selectedList.includes(opt);
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleCheckboxToggle(opt)}
                        style={{
                          width: '100%',
                          padding: '14px 18px',
                          borderRadius: '14px',
                          border: isSelected ? '1px solid #00DF81' : '1px solid rgba(255, 255, 255, 0.12)',
                          backgroundColor: isSelected ? 'rgba(0, 223, 129, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                          color: '#fff',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          fontSize: '14px',
                          fontWeight: 600,
                          transition: 'all 0.18s',
                        }}
                      >
                        <span>{opt}</span>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '6px',
                            border: isSelected ? '2px solid #00DF81' : '2px solid rgba(255, 255, 255, 0.3)',
                            backgroundColor: isSelected ? '#00DF81' : 'transparent',
                            color: '#070B18',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: '12px',
                          }}
                        >
                          {isSelected ? '✓' : ''}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TIPO: TEXTO CURTO (VARCHAR) */}
              {currentQuestion.type === 'text' && (
                <div>
                  <input
                    type="text"
                    autoFocus
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => {
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }));
                      if (validationError) setValidationError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNextStep();
                    }}
                    placeholder="Sua resposta..."
                    style={{
                      width: '100%',
                      padding: '16px 18px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(0, 0, 0, 0.45)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}

              {/* TIPO: TEXTO LONGO (PARÁGRAFO / TEXTAREA) */}
              {currentQuestion.type === 'textarea' && (
                <div>
                  <textarea
                    rows={4}
                    autoFocus
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => {
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }));
                      if (validationError) setValidationError('');
                    }}
                    placeholder="Digite sua resposta com detalhes..."
                    style={{
                      width: '100%',
                      padding: '16px 18px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(0, 0, 0, 0.45)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                  />
                </div>
              )}

              {/* TIPO: NÚMERO / QUANTIDADE */}
              {currentQuestion.type === 'number' && (
                <div>
                  <input
                    type="number"
                    autoFocus
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => {
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }));
                      if (validationError) setValidationError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNextStep();
                    }}
                    placeholder="Ex: 5"
                    style={{
                      width: '100%',
                      padding: '16px 18px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(0, 0, 0, 0.45)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}

              {/* TIPO: VALOR MONETÁRIO / CURRENCY / FAiXA */}
              {currentQuestion.type === 'currency' && (
                currentQuestion.options && currentQuestion.options.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {currentQuestion.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        style={{
                          width: '100%',
                          padding: '14px 18px',
                          borderRadius: '12px',
                          border: answers[currentQuestion.id] === opt ? '1px solid #00DF81' : '1px solid rgba(255, 255, 255, 0.1)',
                          backgroundColor: answers[currentQuestion.id] === opt ? 'rgba(0, 223, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                          color: '#fff',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      >
                        💰 {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#00DF81', fontWeight: 800 }}>R$</span>
                    <input
                      type="text"
                      autoFocus
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => {
                        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }));
                        if (validationError) setValidationError('');
                      }}
                      placeholder="50.000,00"
                      style={{
                        width: '100%',
                        padding: '16px 18px 16px 48px',
                        borderRadius: '14px',
                        backgroundColor: 'rgba(0, 0, 0, 0.45)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#fff',
                        fontSize: '16px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )
              )}

              {/* TIPO: WHATSAPP / TELEFONE */}
              {currentQuestion.type === 'phone' && (
                <div>
                  <input
                    type="tel"
                    autoFocus
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: formatted }));
                      if (validationError) setValidationError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNextStep();
                    }}
                    placeholder="(00) 00000-0000"
                    style={{
                      width: '100%',
                      padding: '16px 18px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(0, 0, 0, 0.45)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}

              {/* TIPO: E-MAIL */}
              {currentQuestion.type === 'email' && (
                <div>
                  <input
                    type="email"
                    autoFocus
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => {
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }));
                      if (validationError) setValidationError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNextStep();
                    }}
                    placeholder="seu@email.com"
                    style={{
                      width: '100%',
                      padding: '16px 18px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(0, 0, 0, 0.45)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}

              {/* TIPO: DATA */}
              {currentQuestion.type === 'date' && (
                <div>
                  <input
                    type="date"
                    autoFocus
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => {
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }));
                      if (validationError) setValidationError('');
                    }}
                    style={{
                      width: '100%',
                      padding: '16px 18px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(0, 0, 0, 0.45)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}

              {/* TIPO: AVALIAÇÃO / ESTRELAS (1 A 5) */}
              {currentQuestion.type === 'rating' && (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', padding: '16px 0' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleSelectOption(String(star))}
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '14px',
                        backgroundColor: answers[currentQuestion.id] === String(star) ? '#00DF81' : 'rgba(255, 255, 255, 0.08)',
                        color: answers[currentQuestion.id] === String(star) ? '#070B18' : '#fff',
                        fontSize: '20px',
                        fontWeight: 900,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.15s',
                      }}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              )}

              {/* Mensagem de Erro de Validação */}
              {validationError && (
                <p style={{ fontSize: '12px', color: '#FF4D4D', margin: 0, fontWeight: 600 }}>
                  ⚠️ {validationError}
                </p>
              )}

              {/* BOTÕES DE NAVEGAÇÃO */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
                {currentStepIndex > 0 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      padding: '10px 18px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    ← Voltar
                  </button>
                ) : <div />}

                {currentQuestion.type !== 'select' && currentQuestion.type !== 'rating' && (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={submitting}
                    style={{
                      padding: '14px 28px',
                      borderRadius: '12px',
                      background: 'linear-gradient(90deg, #00DF81 0%, #00c972 100%)',
                      color: '#070B18',
                      fontWeight: 800,
                      fontSize: '13px',
                      border: 'none',
                      cursor: submitting ? 'wait' : 'pointer',
                      boxShadow: '0 4px 16px rgba(0, 223, 129, 0.3)',
                    }}
                  >
                    {submitting ? 'Enviando...' : (currentStepIndex >= totalQuestions - 1 ? 'Finalizar e Enviar →' : 'Continuar →')}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ════════ TELA DE OBRIGADO (THANK YOU PAGE CONFIGURÁVEL) ════════ */}
          {isCompleted && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px', padding: '10px 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '20px', backgroundColor: 'rgba(0, 223, 129, 0.15)', border: '1px solid rgba(0, 223, 129, 0.3)', color: '#00DF81', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                <span>✓</span> Concluído com Sucesso
              </div>

              <div>
                <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
                  {form.thankYouTitle || 'Obrigado por responder!'}
                </h2>
                <p style={{ fontSize: '14px', color: '#94A3B8', maxWidth: '400px', margin: '0 auto', lineHeight: '1.5' }}>
                  {form.thankYouMessage || 'Suas respostas foram salvas com segurança e nossa equipe já foi notificada.'}
                </p>
              </div>

              {/* AÇÃO DO WHATSAPP SE ATIVADA */}
              {form.sendToWhatsapp && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '8px' }}>
                  <a
                    href={whatsappUrl || (form.whatsappDestination ? `https://wa.me/${form.whatsappDestination.replace(/\D/g, '')}` : '#')}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'linear-gradient(90deg, #00DF81 0%, #00F0FF 100%)',
                      color: '#070B18',
                      fontWeight: 900,
                      fontSize: '14px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 20px rgba(0, 223, 129, 0.35)',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span>Falar no WhatsApp com o especialista</span>
                    {countdown > 0 && (
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.25)', fontWeight: 800 }}>
                        ({countdown}s)
                      </span>
                    )}
                  </a>

                  <p style={{ fontSize: '11px', color: '#94A3B8' }}>
                    Redirecionando automaticamente em {countdown}s... Se não abrir, toque no botão acima.
                  </p>
                </div>
              )}

              {!form.sendToWhatsapp && (
                <a
                  href="https://infinityondemand.com.br"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  Voltar ao site principal
                </a>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ── FOOTER DISCRETO ── */}
      <footer
        style={{
          width: '100%',
          maxWidth: '540px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          paddingTop: '16px',
          paddingBottom: '8px',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.4)',
        }}
      >
        <div>Infinity On Demand • Diagnóstico Empresarial Seguro © 2026</div>
      </footer>
    </div>
  );
}

export default function FormsRuntimePage() {
  return (
    <React.Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: '#050814',
            color: '#00DF81',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
          }}
        >
          Carregando Infinity Forms...
        </div>
      }
    >
      <DynamicFormFunnel />
    </React.Suspense>
  );
}
