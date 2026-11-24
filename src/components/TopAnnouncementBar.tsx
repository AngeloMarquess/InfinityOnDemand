'use client';

import { useState, useEffect } from 'react';

export interface TopAnnouncementBarProps {
  initialConfig?: {
    active: boolean;
    badgeText: string;
    headline: string;
    buttonText: string;
    buttonLink: string;
    termsText?: string;
    displayTarget: 'all' | 'crm_only' | 'site_only';
    theme: 'honey_purple' | 'infinity_cyan' | 'gold_amber';
  };
}

export default function TopAnnouncementBar({ initialConfig }: TopAnnouncementBarProps) {
  const [config, setConfig] = useState(initialConfig || {
    active: true,
    badgeText: '■ Black Friday Sale',
    headline: 'Garanta 50% de Desconto',
    buttonText: 'Aproveitar Agora →',
    buttonLink: '/crm',
    termsText: '*Termos & Condições aplicáveis',
    displayTarget: 'all',
    theme: 'honey_purple',
  });
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Carrega anúncio mais recente da API
    fetch('/api/crm/announcement')
      .then(r => r.json())
      .then(data => {
        if (data && typeof data.active === 'boolean') {
          setConfig(data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const bannerKey = `infinity_banner_dismissed_${config.headline}_${config.badgeText}`;
      if (sessionStorage.getItem(bannerKey) === 'true') {
        setIsDismissed(true);
      }
    } catch {}
  }, [config.headline, config.badgeText]);

  if (!config.active) return null;
  if (config.displayTarget === 'crm_only') return null;
  if (isDismissed) return null;

  const handleClose = () => {
    setIsDismissed(true);
    try {
      const bannerKey = `infinity_banner_dismissed_${config.headline}_${config.badgeText}`;
      sessionStorage.setItem(bannerKey, 'true');
    } catch {}
  };

  const handleActionClick = () => {
    if (!config.buttonLink) return;
    window.location.href = config.buttonLink;
  };

  const themeStyles = {
    honey_purple: {
      bgMain: 'bg-[#0E0F12]',
      mosaicColor: 'bg-[#B49BFF]',
      mosaicDark: 'bg-[#0E0F12]',
      badgeColor: 'text-[#FFE600]',
      buttonBg: 'bg-[#FFE600] text-slate-950 hover:bg-[#FFD700]',
      termsColor: 'text-white/60',
    },
    infinity_cyan: {
      bgMain: 'bg-[#060D1A]',
      mosaicColor: 'bg-[#00F2FE]',
      mosaicDark: 'bg-[#060D1A]',
      badgeColor: 'text-[#00DB79]',
      buttonBg: 'bg-gradient-to-r from-[#00F2FE] to-[#00DB79] text-slate-950 hover:brightness-110',
      termsColor: 'text-cyan-200/60',
    },
    gold_amber: {
      bgMain: 'bg-[#140F07]',
      mosaicColor: 'bg-[#F59E0B]',
      mosaicDark: 'bg-[#140F07]',
      badgeColor: 'text-[#FBBF24]',
      buttonBg: 'bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] text-slate-950 hover:brightness-110',
      termsColor: 'text-amber-200/60',
    },
  };

  const currentTheme = (themeStyles as Record<string, any>)[config.theme] || themeStyles.honey_purple;

  return (
    <aside
      aria-label="Aviso Especial"
      className={`relative w-full overflow-hidden select-none z-50 shadow-md ${currentTheme.bgMain} border-b border-white/10`}
    >
      {/* Mosaico geométrico esquerdo */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-44 md:w-60 flex flex-wrap content-start opacity-70 pointer-events-none overflow-hidden">
        <div className="w-full h-full grid grid-cols-6 sm:grid-cols-8 grid-rows-3 gap-0.5">
          <div className={`${currentTheme.mosaicColor} opacity-90`} />
          <div className={`${currentTheme.mosaicDark}`} />
          <div className={`${currentTheme.mosaicColor} opacity-60`} />
          <div className={`${currentTheme.mosaicColor} opacity-90`} />
          <div className={`${currentTheme.mosaicDark}`} />
          <div className={`${currentTheme.mosaicColor} opacity-80`} />
          <div className={`${currentTheme.mosaicDark}`} />
          <div className={`${currentTheme.mosaicColor} opacity-50`} />
          <div className={`${currentTheme.mosaicColor} opacity-90`} />
          <div className={`${currentTheme.mosaicDark}`} />
          <div className={`${currentTheme.mosaicColor} opacity-70`} />
          <div className={`${currentTheme.mosaicDark}`} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/90 pointer-events-none" />
      </div>

      {/* Mosaico geométrico direito */}
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-44 md:w-60 flex flex-wrap content-start opacity-70 pointer-events-none overflow-hidden">
        <div className="w-full h-full grid grid-cols-6 sm:grid-cols-8 grid-rows-3 gap-0.5">
          <div className={`${currentTheme.mosaicDark}`} />
          <div className={`${currentTheme.mosaicColor} opacity-80`} />
          <div className={`${currentTheme.mosaicColor} opacity-50`} />
          <div className={`${currentTheme.mosaicDark}`} />
          <div className={`${currentTheme.mosaicColor} opacity-90`} />
          <div className={`${currentTheme.mosaicDark}`} />
          <div className={`${currentTheme.mosaicColor} opacity-70`} />
          <div className={`${currentTheme.mosaicColor} opacity-90`} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/90 pointer-events-none" />
      </div>

      {/* Conteúdo Central */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3 min-h-[44px]">
        <div className="hidden lg:block w-28 shrink-0" />

        <div className="flex-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 text-center min-w-0">
          {config.badgeText && (
            <div className="inline-flex items-center gap-1.5 font-bold text-xs sm:text-sm tracking-wide shrink-0">
              <span className={currentTheme.badgeColor}>{config.badgeText}</span>
            </div>
          )}

          {config.headline && (
            <span className="text-white font-extrabold text-sm sm:text-base md:text-lg tracking-tight leading-tight">
              {config.headline}
            </span>
          )}

          {config.buttonText && (
            <button
              onClick={handleActionClick}
              type="button"
              className={`inline-flex items-center gap-1.5 ${currentTheme.buttonBg} font-black text-xs sm:text-sm px-4 py-1 sm:py-1.5 rounded-full shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0 ml-1`}
            >
              <span>{config.buttonText}</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 shrink-0">
          {config.termsText && (
            <span className={`hidden md:inline-block text-[10px] sm:text-xs font-medium tracking-tight ${currentTheme.termsColor}`}>
              {config.termsText}
            </span>
          )}

          <button
            onClick={handleClose}
            type="button"
            title="Fechar aviso"
            aria-label="Fechar aviso"
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
}
