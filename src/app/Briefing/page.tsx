'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Palette, LayoutTemplate, Instagram, Sparkles, Video, FileText } from 'lucide-react';

const options = [
  { id: 'logo', title: 'Logo', desc: 'Criação de logotipo e marca', Icon: Palette },
  { id: 'landing-page', title: 'Landing Page', desc: 'Página de conversão/vendas', Icon: LayoutTemplate },
  { id: 'social-media', title: 'Social Media / Criativos', desc: 'Posts, stories e anúncios', Icon: Instagram },
  { id: 'branding', title: 'Branding / Identidade Visual', desc: 'Identidade visual completa', Icon: Sparkles },
  { id: 'video-motion', title: 'Vídeo / Motion', desc: 'Vídeos e animações', Icon: Video },
  { id: 'outro', title: 'Outro', desc: 'Outro tipo de projeto', Icon: FileText },
];

export default function BriefingPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0B0F19 0%, #111827 50%, #0B0F19 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow effects */}
      <div style={{
        position: 'fixed', top: '-200px', left: '-200px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,219,121,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-200px', right: '-200px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,170,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo / Brand */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/infinity-logo.png" alt="Infinity Logo" style={{
          width: '44px', height: '44px', borderRadius: '12px', objectFit: 'contain',
        }} />
        <span style={{ color: '#fff', fontWeight: '700', fontSize: '18px', letterSpacing: '-0.5px' }}>Infinity On Demand</span>
      </div>

      {/* Main Card Container */}
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '48px 40px 36px',
        maxWidth: '620px',
        width: '100%',
        boxShadow: '0 25px 60px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Header */}
        <h1 style={{
          fontSize: '24px', fontWeight: '700', color: '#1a1a2e',
          marginBottom: '6px', textAlign: 'center',
        }}>Selecione o Tipo de Briefing</h1>
        <p style={{
          fontSize: '14px', color: '#6b7280', textAlign: 'center',
          marginBottom: '32px',
        }}>Escolha a categoria do projeto que deseja iniciar</p>

        {/* Options Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '32px',
        }}>
          {options.map(({ id, title, desc, Icon }) => {
            const isSelected = selected === id;
            const isHovered = hover === id;
            return (
              <div
                key={id}
                onClick={() => setSelected(id)}
                onMouseEnter={() => setHover(id)}
                onMouseLeave={() => setHover(null)}
                style={{
                  padding: '20px 18px',
                  borderRadius: '16px',
                  border: isSelected
                    ? '2px solid #00DB79'
                    : isHovered
                      ? '2px solid #d1d5db'
                      : '2px solid #f0f0f0',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(0,219,121,0.06), rgba(0,170,255,0.04))'
                    : isHovered ? '#fafafa' : '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  transition: 'all 0.2s ease',
                  transform: isHovered ? 'translateY(-2px)' : 'none',
                  boxShadow: isSelected
                    ? '0 4px 20px rgba(0,219,121,0.15)'
                    : isHovered
                      ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: isSelected
                    ? 'linear-gradient(135deg, #00DF81, #00AAFF)'
                    : '#f3f4f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}>
                  <Icon size={20} color={isSelected ? '#fff' : '#00DB79'} />
                </div>
                <div>
                  <div style={{
                    fontSize: '15px', fontWeight: '600',
                    color: isSelected ? '#00936e' : '#1a1a2e',
                    marginBottom: '2px',
                  }}>{title}</div>
                  <div style={{ fontSize: '13px', color: '#9ca3af' }}>{desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue CTA */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {selected ? (
            <Link href={`/Briefing/${selected}`} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '14px 40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00DF81, #00AAFF)',
              color: '#fff',
              fontWeight: '700',
              fontSize: '15px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 20px rgba(0,219,121,0.3)',
              letterSpacing: '0.3px',
            }}>
              Continuar →
            </Link>
          ) : (
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '14px 40px',
              borderRadius: '12px',
              background: '#f3f4f6',
              color: '#9ca3af',
              fontWeight: '600',
              fontSize: '15px',
              cursor: 'not-allowed',
            }}>
              Selecione uma opção
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <p style={{ color: '#4b5563', fontSize: '12px', marginTop: '32px', letterSpacing: '1px', textTransform: 'uppercase' }}>
        Infinity On Demand © {new Date().getFullYear()}
      </p>
    </div>
  );
}
