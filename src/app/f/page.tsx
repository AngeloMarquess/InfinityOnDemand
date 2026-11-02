'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  phase?: string; // ex: 'SOBRE VOCÊ', 'SUA EMPRESA', 'QUALIFICAÇÃO', 'AGENDAMENTO'
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
  enableScheduling?: boolean;
  phases?: string[];
  qualifyingQuestionId?: string;
  qualifyingOptions?: string[];
  disqualifiedMessage?: string;
}

// Calcular os próximos 3 dias úteis a partir de hoje
function getNextBusinessDays(count = 3): string[] {
  const days: string[] = [];
  const date = new Date();
  const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  let added = 0;
  let safety = 0;
  date.setDate(date.getDate() + 1);

  while (added < count && safety < 14) {
    safety++;
    const dow = date.getDay();
    if (dow !== 0 && dow !== 6) { // Ignorar Domingo (0) e Sábado (6)
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      days.push(`${dayNames[dow]}, ${dd}/${mm}`);
      added++;
    }
    date.setDate(date.getDate() + 1);
  }

  return days;
}

const AVAILABLE_TIMES = ['10:30', '13:00', '14:30', '16:00', '17:30', '19:00'];

function DynamicFormFunnel() {
  const searchParams = useSearchParams();
  let resolvedSlug = searchParams?.get('slug') || searchParams?.get('form') || '';
  if (!resolvedSlug && typeof window !== 'undefined') {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];
    if (lastPart && lastPart !== 'f') {
      resolvedSlug = lastPart;
    }
  }
  const slug = resolvedSlug || 'diagnostico';
  const utmSource = searchParams?.get('utm_source') || '';
  const utmMedium = searchParams?.get('utm_medium') || '';
  const utmCampaign = searchParams?.get('utm_campaign') || '';

  const [form, setForm] = useState<FormItem | null>(null);
  const primaryColor: string = form?.primaryColor || '#00DF81'; // Estilo vibrante Arcus / Infinity
  const [loadingForm, setLoadingForm] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Armazenamento de respostas
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadCompany, setLeadCompany] = useState('');

  // Agendamento Inteligente Arcus
  const [schedulingPhase, setSchedulingPhase] = useState<'none' | 'date' | 'time' | 'disqualified'>('none');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [validationError, setValidationError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [countdown, setCountdown] = useState(3);

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

  // Interpolação dinâmica de variáveis ({nome}, %nome%, {empresa}, %empresa%)
  function interpolateVariables(str: string, name: string, comp: string): string {
    if (!str) return '';
    const cleanName = name?.trim() || 'você';
    const cleanCompany = comp?.trim() || 'sua empresa';
    return str
      .replace(/\{nome\}|%nome%|%%nome%%|anfelo/gi, cleanName)
      .replace(/\{empresa\}|%empresa%|%%empresa%%|asdasd/gi, cleanCompany)
      .replace(/%%/g, cleanName)
      .replace(/%\s/g, `${cleanCompany} `);
  }

  // Filtragem dinâmica de perguntas (Branching condicional da Q6)
  const rawQuestions = form?.questions || [];
  const questions = useMemo(() => {
    if (!rawQuestions || rawQuestions.length === 0) return [];
    const q5Ans = answers['q5'] || '';
    return rawQuestions.filter((q) => {
      if (q.id === 'q6_site') {
        return q5Ans === 'Já possuo uma loja virtual';
      }
      if (q.id === 'q6_meta') {
        return q5Ans === 'Não possuo loja virtual';
      }
      return true;
    });
  }, [rawQuestions, answers]);

  const currentQuestion = questions[currentStepIndex];
  const totalQuestions = questions.length;

  // Dias úteis calculados dinamicamente
  const businessDays = useMemo(() => getNextBusinessDays(3), []);

  // Determinar a Fase Atual (exibida acima da barra de progresso)
  const currentPhaseName = useMemo(() => {
    if (schedulingPhase === 'date' || schedulingPhase === 'time') {
      return 'AGENDAMENTO';
    }
    if (currentQuestion?.phase) {
      return currentQuestion.phase.toUpperCase();
    }
    // Regra automática baseada nas perguntas:
    // 1 a 3: SOBRE VOCÊ
    // 4 a 6: SUA EMPRESA
    // 7 em diante: QUALIFICAÇÃO
    if (currentStepIndex < 3) return 'SOBRE VOCÊ';
    if (currentStepIndex < 6) return 'SUA EMPRESA';
    return 'QUALIFICAÇÃO';
  }, [schedulingPhase, currentQuestion, currentStepIndex]);

  // Progresso total
  const progressPercent = useMemo(() => {
    if (schedulingPhase === 'time') return 95;
    if (schedulingPhase === 'date') return 85;
    if (totalQuestions === 0) return 0;
    return Math.round(((currentStepIndex) / totalQuestions) * 75);
  }, [schedulingPhase, currentStepIndex, totalQuestions]);

  // Máscara de telefone
  const formatPhone = (val: string) => {
    let digits = val.replace(/\D/g, '');
    if (digits.length > 11) digits = digits.slice(0, 11);
    if (digits.length <= 2) return digits.length ? `(${digits}` : '';
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  // Verificar se o lead é qualificado para agendamento
  const checkIsQualified = (currentAnswers: Record<string, any>) => {
    if (form?.enableScheduling === false) return false;

    // 1. Verificar se é colaborador (Q12)
    const socioVal = String(currentAnswers['q12'] || '');
    if (socioVal.toLowerCase().includes('colaborador')) {
      return false;
    }

    // 2. Verificar Faturamento (Q9 ou qualifyingQuestionId)
    const qualQId = form?.qualifyingQuestionId || 'q9';
    const fatVal = String(currentAnswers[qualQId] || currentAnswers['q9'] || '');
    if (fatVal) {
      if (form?.qualifyingOptions && form.qualifyingOptions.length > 0) {
        if (!form.qualifyingOptions.includes(fatVal)) {
          return false;
        }
      } else {
        if (fatVal.includes('Ainda não') || fatVal.includes('Até 5 mil')) {
          return false;
        }
      }
    }

    return true;
  };

  // Avançar etapa regular
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

    // Capturar dados de contato
    if (currentQuestion.type === 'phone' && currentVal) {
      setLeadPhone(String(currentVal));
    }
    if (currentQuestion.type === 'email' && currentVal) {
      setLeadEmail(String(currentVal));
    }
    const lowerTitle = currentQuestion.title.toLowerCase();
    if (currentQuestion.type === 'text' && !leadName && lowerTitle.includes('nome')) {
      setLeadName(String(currentVal));
    }
    if (currentQuestion.type === 'text' && !leadCompany && (lowerTitle.includes('empresa') || lowerTitle.includes('marca'))) {
      setLeadCompany(String(currentVal));
    }

    // Se estiver na última etapa das perguntas regulares
    if (currentStepIndex >= totalQuestions - 1) {
      if (checkIsQualified(answers)) {
        setSchedulingPhase('date');
      } else {
        setSchedulingPhase('disqualified');
      }
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  // Voltar etapa
  const handlePrevStep = () => {
    if (schedulingPhase === 'time') {
      setSchedulingPhase('date');
      return;
    }
    if (schedulingPhase === 'date' || schedulingPhase === 'disqualified') {
      setSchedulingPhase('none');
      return;
    }
    if (currentStepIndex > 0) {
      setValidationError('');
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Manipular seleção única (Select / Radio)
  const handleSelectOption = (opt: string) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: opt };
    setAnswers(updatedAnswers);
    setValidationError('');

    const lowerTitle = currentQuestion.title.toLowerCase();
    if (!leadCompany && (lowerTitle.includes('empresa') || lowerTitle.includes('marca'))) {
      setLeadCompany(opt);
    }

    setTimeout(() => {
      if (currentStepIndex >= totalQuestions - 1) {
        if (checkIsQualified(updatedAnswers)) {
          setSchedulingPhase('date');
        } else {
          setSchedulingPhase('disqualified');
        }
      } else {
        setCurrentStepIndex((prev) => prev + 1);
      }
    }, 200);
  };

  // Selecionar Data de Agendamento
  const handleSelectDate = (day: string) => {
    setSelectedDate(day);
    setValidationError('');
    setSchedulingPhase('time');
  };

  // Selecionar Horário e Finalizar (Envia e já redireciona para WhatsApp)
  const handleSelectTimeAndFinish = async (time: string) => {
    setSelectedTime(time);
    await handleFinalSubmit(answers, {
      data_agendamento: selectedDate,
      horario_agendamento: time,
    });
  };

  // Manipular caixas de seleção múltipla (Checkboxes)
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

  // Envio final para API e redirecionamento direto para o WhatsApp
  const handleFinalSubmit = async (
    finalAnswersOverride?: Record<string, any>,
    extraSchedulingData?: { data_agendamento?: string; horario_agendamento?: string }
  ) => {
    try {
      setSubmitting(true);
      const payloadAnswers = finalAnswersOverride || answers;

      const mappedAnswers: Record<string, any> = {};
      questions.forEach((q) => {
        const val = payloadAnswers[q.id];
        if (val !== undefined) {
          mappedAnswers[q.title] = val;
        }
      });

      if (extraSchedulingData?.data_agendamento) {
        mappedAnswers['Data Agendada'] = extraSchedulingData.data_agendamento;
      }
      if (extraSchedulingData?.horario_agendamento) {
        mappedAnswers['Horário Agendado'] = extraSchedulingData.horario_agendamento;
      }

      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_slug: form?.slug || slug,
          form_title: form?.title || 'Diagnóstico Infinity',
          name: leadName || answers['qa1'] || answers['q1'] || 'Lead Interessado',
          phone: leadPhone || answers['qa2'] || answers['q2'] || '',
          email: leadEmail || answers['qa4'] || answers['q4'] || '',
          company: leadCompany || answers['qa3'] || answers['q3'] || '',
          whatsapp_destination: form?.whatsappDestination || '5581981280719',
          answers: mappedAnswers,
          data_agendamento: extraSchedulingData?.data_agendamento || selectedDate || '',
          horario_agendamento: extraSchedulingData?.horario_agendamento || selectedTime || '',
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
        }),
      });

      const data = await res.json();
      const targetWaUrl = data.whatsapp_url || data.whatsappUrl;

      if (targetWaUrl) {
        setWhatsappUrl(targetWaUrl);
        // Redireciona imediatamente para o WhatsApp
        window.location.href = targetWaUrl;
      }
      setIsCompleted(true);
    } catch (err) {
      console.error(err);
      setIsCompleted(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Redirecionamento de segurança caso o navegador bloqueie o primeiro redirecionamento
  useEffect(() => {
    if (isCompleted && whatsappUrl) {
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
  }, [isCompleted, whatsappUrl]);

  if (loadingForm) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#050814',
          color: primaryColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
        }}
      >
        Carregando formulário...
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
          style={{ padding: '10px 20px', borderRadius: '10px', backgroundColor: primaryColor, color: '#070B18', fontWeight: 800, textDecoration: 'none' }}
        >
          Voltar ao site
        </a>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: form?.backgroundImageUrl
          ? (form.backgroundImageUrl.startsWith('data:') ? `url(${form.backgroundImageUrl})` : `url('${form.backgroundImageUrl}')`)
          : "url('/forms-bg.jpg')",
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
        padding: '28px 16px',
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
          backgroundColor: 'rgba(5, 8, 20, 0.78)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── HEADER DISCRETO COM LOGO CENTRAL + BARRA DE FASE ESTILO ARCUS ── */}
      <header
        style={{
          width: '100%',
          maxWidth: '560px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: '20px',
        }}
      >
        {/* Logo Central da Marca */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          {form?.brandLogoUrl ? (
            <img
              src={form.brandLogoUrl}
              alt={form?.brandName || 'Logo'}
              style={{
                height: '38px',
                width: 'auto',
                maxWidth: '180px',
                objectFit: 'contain',
                filter: `drop-shadow(0 0 10px ${primaryColor}66)`,
              }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 900, letterSpacing: '0.04em' }}>
              <span style={{ color: '#fff' }}>{(form?.brandName || 'INFINITY ON DEMAND').split(' ')[0]}</span>
              <span style={{ color: primaryColor }}>{(form?.brandName || 'INFINITY ON DEMAND').split(' ').slice(1).join(' ')}</span>
            </div>
          )}
        </div>

        {/* Barra de Progresso com Indicador de FASE (SOBRE VOCÊ / SUA EMPRESA / QUALIFICAÇÃO / AGENDAMENTO) */}
        {!isCompleted && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span style={{ 
                fontSize: '12px', 
                fontWeight: 900, 
                letterSpacing: '1.2px', 
                color: primaryColor, 
                textTransform: 'uppercase' 
              }}>
                {currentPhaseName}
              </span>
              <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', fontWeight: 600 }}>
                {schedulingPhase === 'time' ? 'Horário' : schedulingPhase === 'date' ? 'Data' : `Etapa ${currentStepIndex + 1} de ${totalQuestions}`}
              </span>
            </div>

            {/* Linha da Barra de Progresso */}
            <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.max(progressPercent, 10)}%`,
                  backgroundColor: primaryColor,
                  borderRadius: '999px',
                  transition: 'width 0.35s ease-out',
                  boxShadow: `0 0 12px ${primaryColor}`,
                }}
              />
            </div>
          </div>
        )}
      </header>

      {/* ── CARD CENTRAL DO FORMULÁRIO ESTILO ARCUS ── */}
      <main
        style={{
          width: '100%',
          maxWidth: '560px',
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
            backgroundColor: 'rgba(13, 18, 36, 0.92)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '36px 30px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            transition: 'all 0.3s ease',
          }}
        >

          {/* ════════ TELAS REGULARES DE PERGUNTAS ════════ */}
          {!isCompleted && schedulingPhase === 'none' && currentQuestion && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', lineHeight: '1.3', marginBottom: '8px' }}>
                  {interpolateVariables(currentQuestion.title, leadName, leadCompany)}
                  {currentQuestion.required && (
                    <span style={{ color: primaryColor, marginLeft: '6px' }} title="Obrigatória">*</span>
                  )}
                </h1>
                {currentQuestion.helper && (
                  <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
                    {interpolateVariables(currentQuestion.helper, leadName, leadCompany)}
                  </p>
                )}
              </div>

              {/* TIPO: SELEÇÃO ÚNICA (RADIO / 1-CLIQUE) */}
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
                          padding: '16px 20px',
                          borderRadius: '14px',
                          border: isSelected ? `1px solid ${primaryColor}` : '1px solid rgba(255, 255, 255, 0.12)',
                          backgroundColor: isSelected ? `${primaryColor}22` : 'rgba(255, 255, 255, 0.03)',
                          color: '#fff',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          fontSize: '15px',
                          fontWeight: 600,
                          transition: 'all 0.18s',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                        }}
                      >
                        <span>{opt}</span>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: isSelected ? `2px solid ${primaryColor}` : '2px solid rgba(255, 255, 255, 0.3)',
                            backgroundColor: isSelected ? primaryColor : 'transparent',
                            flexShrink: 0,
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TIPO: CAIXAS DE SELEÇÃO (MÚLTIPLAS OPÇÕES) */}
              {currentQuestion.type === 'checkbox' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p style={{ fontSize: '11px', color: primaryColor, fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
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
                          padding: '15px 18px',
                          borderRadius: '14px',
                          border: isSelected ? `1px solid ${primaryColor}` : '1px solid rgba(255, 255, 255, 0.12)',
                          backgroundColor: isSelected ? `${primaryColor}22` : 'rgba(255, 255, 255, 0.03)',
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
                            border: isSelected ? `2px solid ${primaryColor}` : '2px solid rgba(255, 255, 255, 0.3)',
                            backgroundColor: isSelected ? primaryColor : 'transparent',
                            color: '#070B18',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: '12px',
                            flexShrink: 0,
                          }}
                        >
                          {isSelected ? '✓' : ''}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TIPO: TEXTO CURTO */}
              {currentQuestion.type === 'text' && (
                <div>
                  <input
                    type="text"
                    autoFocus
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
                      const lowerTitle = currentQuestion.title.toLowerCase();
                      if (lowerTitle.includes('nome') && !lowerTitle.includes('empresa')) {
                        setLeadName(val);
                      }
                      if (lowerTitle.includes('empresa') || lowerTitle.includes('marca')) {
                        setLeadCompany(val);
                      }
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

              {/* TIPO: TEXTAREA */}
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

              {/* TIPO: NÚMERO */}
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
                          padding: '15px 18px',
                          borderRadius: '12px',
                          border: answers[currentQuestion.id] === opt ? `1px solid ${primaryColor}` : '1px solid rgba(255, 255, 255, 0.1)',
                          backgroundColor: answers[currentQuestion.id] === opt ? `${primaryColor}22` : 'rgba(255, 255, 255, 0.03)',
                          color: '#fff',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '15px',
                          fontWeight: 600,
                        }}
                      >
                        💰 {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: primaryColor, fontWeight: 800 }}>R$</span>
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
                      const masked = formatPhone(e.target.value);
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: masked }));
                      setLeadPhone(masked);
                      if (validationError) setValidationError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNextStep();
                    }}
                    placeholder="(81) 98888-8888"
                    style={{
                      width: '100%',
                      padding: '16px 18px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(0, 0, 0, 0.45)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '17px',
                      letterSpacing: '0.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}

              {/* TIPO: EMAIL */}
              {currentQuestion.type === 'email' && (
                <div>
                  <input
                    type="email"
                    autoFocus
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => {
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }));
                      setLeadEmail(e.target.value);
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

              {/* TIPO: AVALIAÇÃO / ESTRELAS */}
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
                        backgroundColor: answers[currentQuestion.id] === String(star) ? primaryColor : 'rgba(255, 255, 255, 0.08)',
                        color: answers[currentQuestion.id] === String(star) ? '#070B18' : '#fff',
                        fontSize: '20px',
                        fontWeight: 900,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              )}

              {/* Erro de Validação */}
              {validationError && (
                <p style={{ fontSize: '13px', color: '#FF4D4D', margin: 0, fontWeight: 600 }}>
                  ⚠️ {validationError}
                </p>
              )}

              {/* BOTÕES DE NAVEGAÇÃO E RODAPÉ DO CARD ESTILO ARCUS */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
                {currentStepIndex > 0 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      color: 'rgba(255, 255, 255, 0.85)',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
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
                      background: primaryColor,
                      color: '#070B18',
                      fontWeight: 800,
                      fontSize: '14px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: `0 4px 20px ${primaryColor}66`,
                    }}
                  >
                    {submitting ? 'Enviando...' : (currentStepIndex >= totalQuestions - 1 ? 'Continuar →' : 'Continuar →')}
                  </button>
                )}
              </div>

              {/* Indicador discreto Arcus de resposta salva */}
              <div style={{ textAlign: 'right', marginTop: '6px' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 600 }}>
                  RESPOSTA SALVA
                </span>
              </div>

            </div>
          )}

          {/* ════════ LEAD MENOR / COLABORADOR: AVISO E CONTATO DIRETO NO WHATSAPP ════════ */}
          {!isCompleted && schedulingPhase === 'disqualified' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: `${primaryColor}22`,
                  color: primaryColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  margin: '0 auto',
                  border: `1px solid ${primaryColor}55`,
                }}
              >
                💬
              </div>

              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', lineHeight: '1.3', marginBottom: '10px' }}>
                  Obrigado pelo seu tempo, {leadName || 'você'}!
                </h1>
                <p style={{ fontSize: '15px', color: '#CBD5E1', margin: 0, lineHeight: 1.6 }}>
                  {form?.disqualifiedMessage || `Com base nas informações da ${leadCompany || 'sua empresa'}, nossa equipe especializada entrará em contato diretamente com você pelo WhatsApp para apresentar o diagnóstico personalizado e te orientar nos próximos passos.`}
                </p>
              </div>

              <div style={{ paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleFinalSubmit(answers)}
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '16px 28px',
                    borderRadius: '14px',
                    background: '#25D366',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '15px',
                    border: 'none',
                    cursor: submitting ? 'wait' : 'pointer',
                    boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>💬 {submitting ? 'Abrindo WhatsApp...' : 'Falar no WhatsApp com nossa Equipe →'}</span>
                </button>
              </div>

              {/* Botão Voltar */}
              <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={submitting}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    color: 'rgba(255, 255, 255, 0.85)',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  ← Voltar
                </button>
              </div>
            </div>
          )}

          {/* ════════ AGENDAMENTO INTELIGENTE: ETAPA DE ESCOLHA DE DATA ════════ */}
          {!isCompleted && schedulingPhase === 'date' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', lineHeight: '1.3', marginBottom: '8px' }}>
                  Parabéns, a {leadCompany || leadName || 'sua empresa'} foi aprovada para nosso diagnóstico! 🎉 Para qual dia você gostaria de agendar?
                </h1>
                <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
                  Selecione um dos dias úteis para nossa sessão estratégica online de 30 minutos.
                </p>
              </div>

              {/* Cards de Dias Úteis */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                {businessDays.map((day, dIdx) => (
                  <button
                    key={dIdx}
                    type="button"
                    onClick={() => handleSelectDate(day)}
                    style={{
                      padding: '18px 14px',
                      borderRadius: '14px',
                      backgroundColor: selectedDate === day ? `${primaryColor}22` : 'rgba(255, 255, 255, 0.04)',
                      border: selectedDate === day ? `1px solid ${primaryColor}` : '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.18s',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedDate !== day) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedDate !== day) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    }}
                  >
                    <span>{day.split(',')[0]}</span>
                    <span style={{ color: primaryColor, fontSize: '13px', fontWeight: 800 }}>{day.split(',')[1]}</span>
                  </button>
                ))}
              </div>

              {/* Botão Voltar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={handlePrevStep}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    color: 'rgba(255, 255, 255, 0.85)',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  ← Voltar
                </button>

                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 600 }}>
                  RESPOSTA SALVA
                </span>
              </div>
            </div>
          )}

          {/* ════════ AGENDAMENTO INTELIGENTE: ETAPA DE ESCOLHA DE HORÁRIO ════════ */}
          {!isCompleted && schedulingPhase === 'time' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', lineHeight: '1.3', marginBottom: '8px' }}>
                  E qual o melhor horário?
                </h1>
                <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
                  Dia selecionado: <strong style={{ color: primaryColor }}>{selectedDate}</strong> (Horário de Brasília).
                </p>
              </div>

              {/* Grid 6 Horários estilo Arcus */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {AVAILABLE_TIMES.map((time, tIdx) => (
                  <button
                    key={tIdx}
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSelectTimeAndFinish(time)}
                    style={{
                      padding: '16px 12px',
                      borderRadius: '14px',
                      backgroundColor: selectedTime === time ? primaryColor : 'rgba(255, 255, 255, 0.04)',
                      border: selectedTime === time ? `1px solid ${primaryColor}` : '1px solid rgba(255, 255, 255, 0.12)',
                      color: selectedTime === time ? '#070B18' : '#fff',
                      fontSize: '16px',
                      fontWeight: 800,
                      cursor: submitting ? 'wait' : 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.18s',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTime !== time) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.borderColor = primaryColor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTime !== time) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      }
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>

              {/* Botão Voltar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={submitting}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    color: 'rgba(255, 255, 255, 0.85)',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  ← Voltar
                </button>

                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 600 }}>
                  {submitting ? 'ENVIANDO AO WHATSAPP...' : 'RESPOSTA SALVA'}
                </span>
              </div>
            </div>
          )}

          {/* ════════ TELA DE CONCLUSÃO / REDIRECIONAMENTO WHATSAPP ════════ */}
          {isCompleted && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  backgroundColor: `${primaryColor}22`,
                  color: primaryColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  margin: '0 auto 20px',
                  boxShadow: `0 0 30px ${primaryColor}44`,
                }}
              >
                ✓
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '10px', color: '#fff' }}>
                Diagnóstico e Agendamento Confirmados!
              </h2>

              <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '24px', lineHeight: 1.6 }}>
                Redirecionando diretamente para o WhatsApp do nosso consultor em <strong style={{ color: primaryColor }}>{countdown}s</strong>...
              </p>

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 28px',
                    borderRadius: '14px',
                    backgroundColor: '#25D366',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '15px',
                    textDecoration: 'none',
                    boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)',
                  }}
                >
                  <span>💬 Abrir WhatsApp Agora</span>
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
          textAlign: 'center',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.35)',
          paddingTop: '20px',
          zIndex: 10,
        }}
      >
        <div>{form?.brandName || 'Infinity On Demand'} • Diagnóstico Inteligente © 2026</div>
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
