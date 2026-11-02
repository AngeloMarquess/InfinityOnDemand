'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function FormsPage() {
  const searchParams = useSearchParams();

  // Coleta automática de UTMs de Tráfego Pago
  const utmSource = searchParams?.get('utm_source') || '';
  const utmMedium = searchParams?.get('utm_medium') || '';
  const utmCampaign = searchParams?.get('utm_campaign') || '';
  const utmContent = searchParams?.get('utm_content') || '';

  // Etapa atual (1 a 9)
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8; // 8 etapas de perguntas + 9 é a tela de conclusão

  // Respostas do formulário
  const [formData, setFormData] = useState({
    situacao: '',
    nicho: '',
    tipo_marca: '',
    instagram: '',
    canais_venda: '',
    faturamento: '',
    possui_socios: '',
    name: '',
    company: '',
    phone: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [countdown, setCountdown] = useState(4);
  const [phoneError, setPhoneError] = useState('');

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

  // Avançar com seleção de opção (efeito Typeform)
  const selectOptionAndAdvance = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, 9));
    }, 280);
  };

  // Voltar etapa
  const goBack = () => {
    if (currentStep > 1 && currentStep <= 8) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Envio final dos dados
  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setPhoneError('Por favor, informe seu WhatsApp com DDD.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        form_slug: 'e-commerce-moda',
        form_title: 'Diagnóstico E-commerce 7 Dias',
        ...formData,
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
      setCurrentStep(9); // Ir para tela de sucesso
    } catch (err) {
      console.error(err);
      // Fallback
      setCurrentStep(9);
    } finally {
      setLoading(false);
    }
  };

  // Contagem regressiva para abrir o WhatsApp automaticamente na etapa 9
  useEffect(() => {
    if (currentStep === 9 && whatsappUrl) {
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
    if (currentStep <= 4) return 'SUA EMPRESA';
    if (currentStep === 5) return 'SUA OPERAÇÃO';
    if (currentStep === 6) return 'FATURAMENTO';
    if (currentStep === 7) return 'QUALIFICAÇÃO';
    if (currentStep === 8) return 'SEUS DADOS';
    return 'DIAGNÓSTICO CONCLUÍDO';
  };

  const progressPercent = Math.min(Math.round(((currentStep - 1) / totalSteps) * 100), 100);

  return (
    <div className="min-h-screen bg-[#070B18] text-white flex flex-col items-center justify-between font-sans selection:bg-emerald-500 selection:text-black relative overflow-x-hidden">
      {/* Background ambiente com luzes cibernéticas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full" />
        {/* Padrão sutil de textura de escritório moderno */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />
      </div>

      {/* ── HEADER COM LOGO E STEPPER ── */}
      <header className="w-full max-w-xl mx-auto px-5 pt-7 pb-4 relative z-10 flex flex-col items-center space-y-4">
        {/* Logo Oficial Neon da Infinity */}
        <div className="flex items-center gap-2.5">
          <img
            src="/infinity-logo.png"
            alt="Infinity On Demand"
            className="h-8 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,223,129,0.4)]"
            onError={(e) => {
              // Fallback gracioso
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex items-center gap-1.5 text-base font-black tracking-tight text-white">
            <span>INFINITY</span>
            <span className="text-emerald-400">ON DEMAND</span>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        {currentStep <= 8 && (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold tracking-widest text-emerald-400/90 uppercase">
              <span>{getPhaseName()}</span>
              <span className="text-gray-400 text-[10px] font-medium">{progressPercent}% Concluído</span>
            </div>

            {/* Barra de Progresso */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {/* ── CONTAINER PRINCIPAL DO FORMULÁRIO (CARD) ── */}
      <main className="w-full max-w-md mx-auto px-4 py-2 relative z-10 flex-1 flex flex-col justify-center">
        <div className="bg-[#0B1021]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative transition-all duration-300">

          {/* ════════ ETAPA 1: SITUAÇÃO DA EMPRESA ════════ */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Qual a situação atual da sua empresa?
              </h2>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => selectOptionAndAdvance('situacao', 'Vendo produtos físicos e quero desenvolver um e-commerce')}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3.5 group cursor-pointer ${
                    formData.situacao === 'Vendo produtos físicos e quero desenvolver um e-commerce'
                      ? 'border-emerald-500 bg-emerald-500/15 text-white'
                      : 'border-white/10 bg-white/5 hover:border-emerald-500/50 hover:bg-white/10 text-gray-200'
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
                      ? 'border-emerald-500 bg-emerald-500/15 text-white'
                      : 'border-white/10 bg-white/5 hover:border-emerald-500/50 hover:bg-white/10 text-gray-200'
                  }`}
                >
                  <span className="text-2xl shrink-0 p-2 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                    🔧
                  </span>
                  <span className="text-sm font-semibold leading-relaxed">
                    Tenho um e-commerce e quero reestruturar
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* ════════ ETAPA 2: NICHO DA EMPRESA ════════ */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Qual é o nicho da sua empresa?
              </h2>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                {[
                  { icon: '👕', label: 'Moda (vestuário e calçados)' },
                  { icon: '👜', label: 'Bolsas e acessórios' },
                  { icon: '💍', label: 'Joias e Semijoias' },
                  { icon: '🧴', label: 'Saúde e Beleza' },
                  { icon: '🛋️', label: 'Casa e Decoração' },
                  { icon: '🐾', label: 'Mercado Pet' },
                  { icon: '🍽️', label: 'Alimentos e Bebidas' },
                  { icon: '🔌', label: 'Eletrônicos' },
                  { icon: '🔞', label: 'Sex Shop' },
                  { icon: '🌸', label: 'Perfumes' },
                  { icon: '🪑', label: 'Móveis' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => selectOptionAndAdvance('nicho', item.label)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 group cursor-pointer ${
                      formData.nicho === item.label
                        ? 'border-emerald-500 bg-emerald-500/15 text-white'
                        : 'border-white/10 bg-white/5 hover:border-emerald-500/50 hover:bg-white/10 text-gray-200'
                    }`}
                  >
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ════════ ETAPA 3: MARCA PRÓPRIA OU RÉPLICAS ════════ */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                As peças são de marca própria/fornecedor autorizado ou réplicas?
              </h2>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => selectOptionAndAdvance('tipo_marca', 'Marca própria ou fornecedor autorizado')}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3.5 group cursor-pointer ${
                    formData.tipo_marca === 'Marca própria ou fornecedor autorizado'
                      ? 'border-emerald-500 bg-emerald-500/15 text-white'
                      : 'border-white/10 bg-white/5 hover:border-emerald-500/50 hover:bg-white/10 text-gray-200'
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
                      ? 'border-emerald-500 bg-emerald-500/15 text-white'
                      : 'border-white/10 bg-white/5 hover:border-emerald-500/50 hover:bg-white/10 text-gray-200'
                  }`}
                >
                  <span className="text-2xl shrink-0 p-2 rounded-xl bg-amber-500/10">⚠️</span>
                  <span className="text-sm font-semibold">São réplicas</span>
                </button>
              </div>
            </div>
          )}

          {/* ════════ ETAPA 4: INSTAGRAM DA MARCA ════════ */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Qual o instagram da marca?
              </h2>

              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
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
                    className="w-full bg-white/5 border border-white/15 focus:border-emerald-500 rounded-2xl pl-9 pr-4 py-4 text-base text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  disabled={!formData.instagram.trim()}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* ════════ ETAPA 5: CANAIS DE VENDA ════════ */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Quais são os canais de vendas da sua empresa?
              </h2>

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
                        ? 'border-emerald-500 bg-emerald-500/15 text-white'
                        : 'border-white/10 bg-white/5 hover:border-emerald-500/50 hover:bg-white/10 text-gray-200'
                    }`}
                  >
                    <span className="text-2xl shrink-0 p-1.5 rounded-xl bg-white/5">{item.icon}</span>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ════════ ETAPA 6: FATURAMENTO MÉDIO ════════ */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Sua operação na loja física está faturando quanto em média?
              </h2>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
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
                        ? 'border-emerald-500 bg-emerald-500/15 text-white'
                        : 'border-white/10 bg-white/5 hover:border-emerald-500/50 hover:bg-white/10 text-gray-200'
                    }`}
                  >
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ════════ ETAPA 7: SÓCIOS / QUALIFICAÇÃO ════════ */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Você possui sócios?
              </h2>

              <div className="space-y-3">
                {[
                  { icon: '🧑‍💼', label: 'Não, sou o único proprietário' },
                  { icon: '🤝', label: 'Sim, tenho um ou mais sócios' },
                  { icon: '👔', label: 'Sou colaborador' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => selectOptionAndAdvance('possui_socios', item.label)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3.5 group cursor-pointer ${
                      formData.possui_socios === item.label
                        ? 'border-emerald-500 bg-emerald-500/15 text-white'
                        : 'border-white/10 bg-white/5 hover:border-emerald-500/50 hover:bg-white/10 text-gray-200'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ════════ ETAPA 8: CAPTURA DOS DADOS ════════ */}
          {currentStep === 8 && (
            <form onSubmit={handleSubmitFinal} className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
                  Pronto! Pra gente seguir com o projeto da sua loja, como faço pra te encontrar?
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Seus dados são usados pra continuar o atendimento e enviar o link da reunião.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome"
                    className="w-full bg-white/5 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Empresa / Marca
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                    placeholder="Nome da sua loja"
                    className="w-full bg-white/5 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    WhatsApp (com DDD)
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-white/5 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                  {phoneError && <p className="text-xs text-rose-400 mt-1">{phoneError}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                    className="w-full bg-white/5 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Processando diagnóstico...' : 'Solicite seu orçamento →'}
              </button>

              <p className="text-center text-[11px] text-gray-400 pt-1 flex items-center justify-center gap-1">
                <span>🛡️</span> Seus dados estão 100% seguros.
              </p>
            </form>
          )}

          {/* ════════ ETAPA 9: TELA DE SUCESSO & REDIRECIONAMENTO WHATSAPP ════════ */}
          {currentStep === 9 && (
            <div className="space-y-6 text-center animate-fade-in py-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mx-auto">
                <span>💬</span> Diagnóstico Recebido
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Tudo certo, {formData.name || 'Cliente'}!
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 max-w-sm mx-auto leading-relaxed">
                  Um de nossos especialistas vai continuar com você pelo WhatsApp — em instantes você será levado para lá.
                </p>
              </div>

              {/* Card de Resumo do Diagnóstico */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-gray-400 uppercase font-semibold text-[10px]">Empresa</span>
                  <span className="font-bold text-white">{formData.company || formData.name}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-gray-400 uppercase font-semibold text-[10px]">Nicho</span>
                  <span className="font-bold text-emerald-300">{formData.nicho || 'Geral'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-gray-400 uppercase font-semibold text-[10px]">Faturamento</span>
                  <span className="font-bold text-cyan-300">{formData.faturamento || 'Não informado'}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-400 uppercase font-semibold text-[10px]">Canal Principal</span>
                  <span className="font-bold text-white">{formData.canais_venda || 'Loja física'}</span>
                </div>
              </div>

              {/* Botão de WhatsApp */}
              <div className="space-y-2 pt-2">
                <a
                  href={whatsappUrl || 'https://wa.me/5581981280719'}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Falar com o especialista no WhatsApp</span>
                  {countdown > 0 && <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">({countdown}s)</span>}
                </a>

                <p className="text-[11px] text-gray-500">
                  Se o WhatsApp não abrir automaticamente em {countdown}s, toque no botão acima.
                </p>
              </div>
            </div>
          )}

          {/* ── FOOTER DE CADA PASSO: BOTÃO VOLTAR E RESPOSTA SALVA ── */}
          {currentStep > 1 && currentStep <= 8 && (
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
      <footer className="w-full py-4 text-center text-[11px] text-gray-500 relative z-10">
        Infinity On Demand • Diagnóstico Empresarial Seguro © 2026
      </footer>
    </div>
  );
}
