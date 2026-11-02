'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function FormsContent() {
  const searchParams = useSearchParams();

  // Coleta automática de UTMs e Slug
  const formSlugParam = searchParams?.get('form') || 'e-commerce-moda';
  const utmSource = searchParams?.get('utm_source') || '';
  const utmMedium = searchParams?.get('utm_medium') || '';
  const utmCampaign = searchParams?.get('utm_campaign') || '';
  const utmContent = searchParams?.get('utm_content') || '';

  // Etapa atual (1 a 11: 10 perguntas + 11 conclusão)
  const [currentStep, setCurrentStep] = useState(1);
  const totalQuestions = 10;

  // Respostas do formulário
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    situacao: '',
    nicho: '',
    tipo_marca: '',
    instagram: '',
    canais_venda: '',
    faturamento: '',
    possui_socios: '',
    company: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [countdown, setCountdown] = useState(4);
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');

  // Máscara de telefone/WhatsApp
  const formatPhone = (val: string) => {
    let digits = val.replace(/\D/g, '');
    if (digits.length > 11) digits = digits.slice(0, 11);
    if (digits.length <= 2) return digits.length ? `(${digits}` : '';
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
    if (formatted.replace(/\D/g, '').length >= 10) {
      setPhoneError('');
    }
  };

  // Avançar com clique direto na opção (experiência interativa ágil estilo Typeform)
  const selectOptionAndAdvance = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, 11));
    }, 240);
  };

  // Voltar etapa
  const goBack = () => {
    if (currentStep > 1 && currentStep <= totalQuestions) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Avanço da etapa 1 (Nome)
  const handleNameNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      setNameError('Por favor, informe seu nome.');
      return;
    }
    setNameError('');
    setCurrentStep(2);
  };

  // Avanço da etapa 2 (WhatsApp)
  const handlePhoneNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = formData.phone.replace(/\D/g, '');
    if (clean.length < 10) {
      setPhoneError('Por favor, informe um WhatsApp válido com DDD.');
      return;
    }
    setPhoneError('');
    setCurrentStep(3);
  };

  // Envio final dos dados (Etapa 10)
  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payload = {
        form_slug: formSlugParam,
        form_title: formSlugParam === 'e-commerce-moda' ? 'Diagnóstico E-commerce 7 Dias' : `Funil ${formSlugParam}`,
        ...formData,
        company: formData.company || formData.name,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
      };

      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.whatsapp_url) {
        setWhatsappUrl(data.whatsapp_url);
      }
      setCurrentStep(11); // Tela de conclusão
    } catch (err) {
      console.error(err);
      setCurrentStep(11);
    } finally {
      setLoading(false);
    }
  };

  // Contagem regressiva para abrir o WhatsApp automaticamente na etapa 11
  useEffect(() => {
    if (currentStep === 11 && whatsappUrl) {
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
  }, [currentStep, whatsappUrl]);

  // Indicador de fase ativa na barra superior
  const getPhaseName = () => {
    if (currentStep <= 2) return 'SOBRE VOCÊ';
    if (currentStep <= 6) return 'SUA EMPRESA';
    if (currentStep <= 9) return 'SUA OPERAÇÃO';
    if (currentStep === 10) return 'FINALIZAÇÃO';
    return 'DIAGNÓSTICO CONCLUÍDO';
  };

  const progressPercent = Math.min(Math.round(((currentStep - 1) / totalQuestions) * 100), 100);

  // Primeiro nome para personalização
  const firstName = formData.name.trim().split(' ')[0] || '';

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center justify-between font-sans selection:bg-[#00DF81] selection:text-black relative overflow-x-hidden"
      style={{
        backgroundImage: "url('/forms-bg.jpg')",
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundColor: '#040711',
      }}
    >
      {/* Overlay sutil para garantir legibilidade máxima e estética glass premium */}
      <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-[2px] pointer-events-none z-0" />

      {/* ── HEADER SUPERIOR: LOGO CENTRALIZADO + INDICADOR DE ETAPA ── */}
      <header className="w-full max-w-lg mx-auto px-6 pt-6 sm:pt-8 pb-3 relative z-10 flex flex-col items-center">
        {/* Logo discreto oficial com link para o site institucional */}
        <a
          href="https://infinityondemand.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mb-4 hover:opacity-90 transition-opacity group cursor-pointer"
          title="Infinity On Demand - Página Principal"
        >
          <img
            src="/logo-infinity.png"
            alt="Infinity On Demand"
            className="h-7 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,223,129,0.35)]"
          />
          <div className="flex items-center gap-1 text-sm font-black tracking-tight text-white">
            <span>INFINITY</span>
            <span className="text-[#00DF81]">ON DEMAND</span>
          </div>
        </a>

        {/* Stepper Progress Indicator (Estilo Arcus / Typeform) */}
        {currentStep <= totalQuestions && (
          <div className="w-full max-w-md space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-[#00DF81] uppercase">
              <span>{getPhaseName()}</span>
              <span className="text-gray-400 font-medium text-[10px]">{progressPercent}%</span>
            </div>

            {/* Barra de Progresso suave com gradiente */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00DF81] to-[#00F0FF] transition-all duration-500 ease-out"
                style={{ width: `${Math.max(progressPercent, 5)}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {/* ── CONTAINER PRINCIPAL: CARD DE VIDRO ESCURO CENTRALIZADO ── */}
      <main className="w-full max-w-lg mx-auto px-4 py-4 relative z-10 flex-1 flex flex-col justify-center">
        <div className="bg-[#0B0F1C]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] relative transition-all duration-300">

          {/* ════════ ETAPA 1: NOME (SOBRE VOCÊ) ════════ */}
          {currentStep === 1 && (
            <form onSubmit={handleNameNext} className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-white leading-tight">
                  Para começarmos, me diz seu nome.
                </h1>
                <p className="text-sm text-gray-400 font-normal">
                  Seu nome será usado pra personalizar o diagnóstico.
                </p>
              </div>

              <div className="space-y-4 pt-1">
                <input
                  type="text"
                  autoFocus
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                    if (nameError) setNameError('');
                  }}
                  placeholder="Seu nome completo"
                  className="w-full bg-black/40 border border-white/15 focus:border-[#00DF81] focus:ring-1 focus:ring-[#00DF81] rounded-2xl px-5 py-4 text-base sm:text-lg text-white placeholder:text-gray-500 outline-none transition-all"
                />
                {nameError && <p className="text-xs text-rose-400">{nameError}</p>}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#00DF81] to-[#00c972] hover:brightness-110 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Continuar →
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ════════ ETAPA 2: WHATSAPP ════════ */}
          {currentStep === 2 && (
            <form onSubmit={handlePhoneNext} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight text-white leading-tight">
                  Show{firstName ? `, ${firstName}` : ''}! Qual seu WhatsApp?
                </h2>
                <p className="text-sm text-gray-400 font-normal">
                  Nosso time entrará em contato para apresentar seu diagnóstico personalizado.
                </p>
              </div>

              <div className="space-y-4 pt-1">
                <input
                  type="tel"
                  autoFocus
                  required
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-black/40 border border-white/15 focus:border-[#00DF81] focus:ring-1 focus:ring-[#00DF81] rounded-2xl px-5 py-4 text-base sm:text-lg text-white placeholder:text-gray-500 outline-none transition-all"
                />
                {phoneError && <p className="text-xs text-rose-400">{phoneError}</p>}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#00DF81] to-[#00c972] hover:brightness-110 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Continuar →
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ════════ ETAPA 3: SITUAÇÃO DA EMPRESA ════════ */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-[26px] font-bold tracking-tight text-white leading-tight">
                  Qual a situação atual da sua empresa?
                </h2>
                <p className="text-sm text-gray-400">
                  Selecione o momento atual da sua operação comercial.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => selectOptionAndAdvance('situacao', 'Vendo produtos físicos e quero desenvolver um e-commerce')}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3.5 group cursor-pointer ${
                    formData.situacao === 'Vendo produtos físicos e quero desenvolver um e-commerce'
                      ? 'border-[#00DF81] bg-[#00DF81]/15 text-white shadow-[0_0_20px_rgba(0,223,129,0.15)]'
                      : 'border-white/10 bg-white/5 hover:border-[#00DF81]/50 hover:bg-white/10 text-gray-200'
                  }`}
                >
                  <span className="text-2xl shrink-0 p-2 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                    🛒
                  </span>
                  <span className="text-sm font-semibold leading-relaxed">
                    Vendo produtos físicos e quero desenvolver um e-commerce
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => selectOptionAndAdvance('situacao', 'Tenho um e-commerce e quero reestruturar')}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3.5 group cursor-pointer ${
                    formData.situacao === 'Tenho um e-commerce e quero reestruturar'
                      ? 'border-[#00DF81] bg-[#00DF81]/15 text-white shadow-[0_0_20px_rgba(0,223,129,0.15)]'
                      : 'border-white/10 bg-white/5 hover:border-[#00DF81]/50 hover:bg-white/10 text-gray-200'
                  }`}
                >
                  <span className="text-2xl shrink-0 p-2 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                    🚀
                  </span>
                  <span className="text-sm font-semibold leading-relaxed">
                    Tenho um e-commerce e quero reestruturar
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* ════════ ETAPA 4: NICHO DA EMPRESA ════════ */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-[26px] font-bold tracking-tight text-white leading-tight">
                  Qual é o nicho da sua empresa?
                </h2>
                <p className="text-xs text-gray-400">
                  Adaptamos a estrutura do funil e e-commerce para seu segmento.
                </p>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {[
                  { icon: '👕', label: 'Moda (vestuário e calçados)' },
                  { icon: '👜', label: 'Bolsas e acessórios' },
                  { icon: '💍', label: 'Joias e Semijoias' },
                  { icon: '🧴', label: 'Saúde e Beleza' },
                  { icon: '🛋️', label: 'Casa e Decoração' },
                  { icon: '🐾', label: 'Mercado Pet' },
                  { icon: '🍽️', label: 'Alimentos e Bebidas' },
                  { icon: '🔌', label: 'Eletrônicos e Gadgets' },
                  { icon: '🌸', label: 'Perfumes e Cosméticos' },
                  { icon: '🪑', label: 'Móveis e Design' },
                  { icon: '✨', label: 'Outro Nicho' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => selectOptionAndAdvance('nicho', item.label)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 group cursor-pointer ${
                      formData.nicho === item.label
                        ? 'border-[#00DF81] bg-[#00DF81]/15 text-white'
                        : 'border-white/10 bg-white/5 hover:border-[#00DF81]/50 hover:bg-white/10 text-gray-200'
                    }`}
                  >
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ════════ ETAPA 5: MARCA PRÓPRIA OU RÉPLICAS ════════ */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                  As peças são de marca própria/fornecedor autorizado ou réplicas?
                </h2>
                <p className="text-sm text-gray-400">
                  Importante para conformidade nas políticas do Meta Ads e gateways.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => selectOptionAndAdvance('tipo_marca', 'Marca própria ou fornecedor autorizado')}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3.5 group cursor-pointer ${
                    formData.tipo_marca === 'Marca própria ou fornecedor autorizado'
                      ? 'border-[#00DF81] bg-[#00DF81]/15 text-white'
                      : 'border-white/10 bg-white/5 hover:border-[#00DF81]/50 hover:bg-white/10 text-gray-200'
                  }`}
                >
                  <span className="text-2xl shrink-0 p-2 rounded-xl bg-emerald-500/10">✅</span>
                  <span className="text-sm font-semibold">Marca própria ou fornecedor autorizado</span>
                </button>

                <button
                  type="button"
                  onClick={() => selectOptionAndAdvance('tipo_marca', 'São réplicas')}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3.5 group cursor-pointer ${
                    formData.tipo_marca === 'São réplicas'
                      ? 'border-[#00DF81] bg-[#00DF81]/15 text-white'
                      : 'border-white/10 bg-white/5 hover:border-[#00DF81]/50 hover:bg-white/10 text-gray-200'
                  }`}
                >
                  <span className="text-2xl shrink-0 p-2 rounded-xl bg-amber-500/10">⚠️</span>
                  <span className="text-sm font-semibold">São réplicas</span>
                </button>
              </div>
            </div>
          )}

          {/* ════════ ETAPA 6: INSTAGRAM DA MARCA ════════ */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-[26px] font-bold tracking-tight text-white leading-tight">
                  Qual o Instagram da marca?
                </h2>
                <p className="text-sm text-gray-400">
                  Analisamos sua presença visual e catálogo atual.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">
                    @
                  </span>
                  <input
                    type="text"
                    value={formData.instagram.replace(/^@/, '')}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        instagram: e.target.value ? `@${e.target.value.replace(/^@/, '')}` : '',
                      }))
                    }
                    placeholder="suamarca"
                    autoFocus
                    className="w-full bg-black/40 border border-white/15 focus:border-[#00DF81] rounded-2xl pl-10 pr-4 py-4 text-base sm:text-lg text-white placeholder:text-gray-500 outline-none transition-all"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(7)}
                    disabled={!formData.instagram.trim()}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#00DF81] to-[#00c972] hover:brightness-110 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continuar →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ════════ ETAPA 7: CANAIS DE VENDA ════════ */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-[26px] font-bold tracking-tight text-white leading-tight">
                  Quais são os canais de vendas da sua empresa?
                </h2>
                <p className="text-sm text-gray-400">
                  Onde seus clientes compram hoje.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { icon: '🏬', label: 'Apenas loja física' },
                  { icon: '📸', label: 'Física + Instagram' },
                  { icon: '💬', label: 'Apenas no WhatsApp' },
                  { icon: '🛍️', label: 'Apenas em Marketplace' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => selectOptionAndAdvance('canais_venda', item.label)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3.5 group cursor-pointer ${
                      formData.canais_venda === item.label
                        ? 'border-[#00DF81] bg-[#00DF81]/15 text-white'
                        : 'border-white/10 bg-white/5 hover:border-[#00DF81]/50 hover:bg-white/10 text-gray-200'
                    }`}
                  >
                    <span className="text-2xl shrink-0 p-1.5 rounded-xl bg-white/5">{item.icon}</span>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ════════ ETAPA 8: FATURAMENTO MÉDIO ════════ */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                  Sua operação física/online está faturando quanto em média por mês?
                </h2>
                <p className="text-xs text-gray-400">
                  Dado sigiloso para dimensionar o plano de tráfego e infraestrutura ideal.
                </p>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {[
                  { icon: '🌱', label: 'Ainda não faturamos' },
                  { icon: '🛟', label: 'Até 5 mil por mês' },
                  { icon: '💵', label: 'De 5 a 10 mil por mês' },
                  { icon: '📈', label: 'De 10 a 25 mil por mês' },
                  { icon: '💸', label: 'De 25 a 50 mil no mês' },
                  { icon: '🏛️', label: 'De 50 a 100 mil no mês' },
                  { icon: '🔥', label: 'Acima de 100 mil no mês' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => selectOptionAndAdvance('faturamento', item.label)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center gap-3.5 group cursor-pointer ${
                      formData.faturamento === item.label
                        ? 'border-[#00DF81] bg-[#00DF81]/15 text-white'
                        : 'border-white/10 bg-white/5 hover:border-[#00DF81]/50 hover:bg-white/10 text-gray-200'
                    }`}
                  >
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ════════ ETAPA 9: SÓCIOS / QUALIFICAÇÃO ════════ */}
          {currentStep === 9 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-[26px] font-bold tracking-tight text-white leading-tight">
                  Você possui sócios na empresa?
                </h2>
                <p className="text-sm text-gray-400">
                  Para definirmos quem deve participar da apresentação do projeto.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { icon: '🧑‍💼', label: 'Não, sou o único proprietário' },
                  { icon: '🤝', label: 'Sim, tenho um ou mais sócios' },
                  { icon: '👔', label: 'Sou colaborador / Gestor' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => selectOptionAndAdvance('possui_socios', item.label)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3.5 group cursor-pointer ${
                      formData.possui_socios === item.label
                        ? 'border-[#00DF81] bg-[#00DF81]/15 text-white'
                        : 'border-white/10 bg-white/5 hover:border-[#00DF81]/50 hover:bg-white/10 text-gray-200'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ════════ ETAPA 10: NOME DA LOJA & E-MAIL FINAL ════════ */}
          {currentStep === 10 && (
            <form onSubmit={handleSubmitFinal} className="space-y-5">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-[26px] font-bold tracking-tight text-white leading-tight">
                  Pronto{firstName ? `, ${firstName}` : ''}! Qual o nome da loja e seu melhor e-mail?
                </h2>
                <p className="text-sm text-gray-400">
                  Geramos o diagnóstico formal e enviamos a cópia para seu e-mail.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Nome da Empresa / Loja
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                    placeholder="Ex: Minha Loja Brand"
                    className="w-full bg-black/40 border border-white/15 focus:border-[#00DF81] rounded-xl px-4 py-3.5 text-sm sm:text-base text-white placeholder:text-gray-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    E-mail Comercial
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                    className="w-full bg-black/40 border border-white/15 focus:border-[#00DF81] rounded-xl px-4 py-3.5 text-sm sm:text-base text-white placeholder:text-gray-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00DF81] via-emerald-400 to-[#00F0FF] hover:brightness-110 text-slate-950 font-black text-sm sm:text-base tracking-wide shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Gerando seu diagnóstico...' : 'Solicite seu orçamento →'}
                </button>

                <p className="text-center text-[11px] text-gray-400 pt-3 flex items-center justify-center gap-1.5">
                  <span>🔒</span> Seus dados são confidenciais e protegidos pela LGPD.
                </p>
              </div>
            </form>
          )}

          {/* ════════ ETAPA 11: CONCLUSÃO & REDIRECIONAMENTO WHATSAPP ════════ */}
          {currentStep === 11 && (
            <div className="space-y-6 text-center py-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mx-auto">
                <span>💬</span> Diagnóstico Registrado
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Tudo certo{firstName ? `, ${firstName}` : ''}!
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 max-w-sm mx-auto leading-relaxed">
                  Nosso especialista já foi notificado e vai continuar o atendimento com você no WhatsApp.
                </p>
              </div>

              {/* Card Resumo do Diagnóstico */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 text-left space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-gray-400 uppercase font-semibold text-[10px]">Empresa</span>
                  <span className="font-bold text-white">{formData.company || formData.name}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-gray-400 uppercase font-semibold text-[10px]">WhatsApp</span>
                  <span className="font-bold text-emerald-400">{formData.phone}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-gray-400 uppercase font-semibold text-[10px]">Nicho</span>
                  <span className="font-bold text-emerald-300">{formData.nicho || 'Geral'}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-400 uppercase font-semibold text-[10px]">Faturamento</span>
                  <span className="font-bold text-cyan-300">{formData.faturamento || 'Ainda não informado'}</span>
                </div>
              </div>

              {/* Botão de Ação Imediata WhatsApp */}
              <div className="space-y-2 pt-2">
                <a
                  href={whatsappUrl || `https://wa.me/5581981280719?text=${encodeURIComponent(`Olá, sou ${formData.name} da empresa ${formData.company || ''} e acabei de concluir meu diagnóstico no Forms.`)}`}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00DF81] to-[#00F0FF] hover:brightness-110 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Falar com o especialista no WhatsApp</span>
                  {countdown > 0 && (
                    <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full font-bold">
                      ({countdown}s)
                    </span>
                  )}
                </a>

                <p className="text-[11px] text-gray-500">
                  Redirecionando automaticamente em {countdown}s... Se não abrir, toque no botão acima.
                </p>
              </div>
            </div>
          )}

          {/* ── FOOTER DO CARD: BOTÃO VOLTAR E INDICADOR ── */}
          {currentStep > 1 && currentStep <= totalQuestions && (
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                ← Voltar
              </button>

              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400/80 flex items-center gap-1">
                <span>✓</span> Resposta salva
              </span>
            </div>
          )}

        </div>
      </main>

      {/* ── FOOTER DISCRETO ── */}
      <footer className="w-full py-4 text-center text-[11px] text-gray-400 relative z-10 flex flex-col items-center gap-1">
        <div>
          Infinity On Demand • Diagnóstico Empresarial Seguro © 2026
        </div>
        <a
          href="https://infinityondemand.com.br"
          className="text-gray-500 hover:text-emerald-400 transition-colors text-[10px]"
        >
          Voltar ao site principal
        </a>
      </footer>
    </div>
  );
}

export default function FormsPage() {
  return (
    <React.Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: '#040711',
            color: '#00DF81',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          Carregando Infinity Forms...
        </div>
      }
    >
      <FormsContent />
    </React.Suspense>
  );
}
