'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { signIn, signUp, signInWithGoogle, resetPassword } from '@/lib/academy/client';

// Interactive/Animated Particle Streams in Infinity Colors
function InfinityWaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Floating bokeh particles
    const bokehParticles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      alpha: number;
      alphaSpeed: number;
    }> = [];

    const colors = [
      'rgba(0, 223, 129, ',   // emerald neon
      'rgba(0, 170, 255, ',   // electric cyan
      'rgba(163, 230, 53, ',  // lime highlight
      'rgba(56, 189, 248, ',  // sky blue
    ];

    for (let i = 0; i < 70; i++) {
      bokehParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        alphaSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    let time = 0;

    const render = () => {
      time += 0.008;
      ctx.clearRect(0, 0, width, height);

      // Deep dark cosmic background
      const bgGrad = ctx.createRadialGradient(
        width * 0.5, height * 0.4, 50,
        width * 0.5, height * 0.5, Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#0a1322');
      bgGrad.addColorStop(0.5, '#060a12');
      bgGrad.addColorStop(1, '#030508');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw flowing curved particle ribbons / waves
      const lines = 36;
      for (let i = 0; i < lines; i++) {
        const lineProgress = i / lines;
        const colorFactor = (Math.sin(time + lineProgress * Math.PI) + 1) / 2;

        ctx.beginPath();
        const startY = height * 0.2 + lineProgress * (height * 0.6);

        // Gradient for this strand
        const strandGrad = ctx.createLinearGradient(0, 0, width, height);
        strandGrad.addColorStop(0, `rgba(0, 170, 255, ${0.12 + colorFactor * 0.15})`);
        strandGrad.addColorStop(0.5, `rgba(0, 223, 129, ${0.25 + colorFactor * 0.25})`);
        strandGrad.addColorStop(1, `rgba(0, 170, 255, ${0.08 + colorFactor * 0.15})`);

        ctx.strokeStyle = strandGrad;
        ctx.lineWidth = 1.2;

        const points = 24;
        for (let j = 0; j <= points; j++) {
          const x = (width / points) * j;
          const wave1 = Math.sin(j * 0.35 + time * 1.5 + i * 0.12) * 55;
          const wave2 = Math.cos(j * 0.25 - time * 0.8 + i * 0.08) * 35;
          const y = startY + wave1 + wave2;

          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          // Dense glowing dots along the strand
          if (j % 2 === 0 && Math.random() > 0.3) {
            ctx.fillStyle = `rgba(0, 223, 129, ${0.4 + colorFactor * 0.4})`;
            ctx.fillRect(x + (Math.random() - 0.5) * 4, y + (Math.random() - 0.5) * 4, 1.5, 1.5);
          }
        }
        ctx.stroke();
      }

      // Draw ambient bokeh particles
      for (const p of bokehParticles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaSpeed;

        if (p.alpha > 0.8 || p.alpha < 0.15) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();

        // Subtle glow around larger particles
        if (p.radius > 2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.alpha * 0.25})`;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}

export default function AuthGate({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('angelo.marques@infinityondemand.com.br');
  const [pass, setPass] = useState('Aa271239852@');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      if (mode === 'forgot') {
        if (!email) {
          setMsg({ type: 'error', text: 'Informe seu e-mail para recuperar a senha.' });
          setLoading(false);
          return;
        }
        const { error } = await resetPassword(email);
        if (error) throw error;
        setMsg({ type: 'success', text: 'Link de redefinição enviado! Verifique seu e-mail.' });
        return;
      }

      if (mode === 'login') {
        const { error } = await signIn(email, pass);
        if (error) throw error;
        onAuthed();
      } else {
        if (pass.length < 6) {
          setMsg({ type: 'error', text: 'A senha deve conter no mínimo 6 caracteres.' });
          setLoading(false);
          return;
        }
        if (confirmPass && pass !== confirmPass) {
          setMsg({ type: 'error', text: 'As senhas não coincidem.' });
          setLoading(false);
          return;
        }
        const { data, error } = await signUp(email, pass, name || 'Aluno Infinity');
        if (error) throw error;
        if (data.session) {
          onAuthed();
        } else {
          setMsg({ type: 'success', text: 'Conta criada com sucesso! Você já pode entrar.' });
          setMode('login');
        }
      }
    } catch (err) {
      const m = err instanceof Error ? err.message : 'Erro ao autenticar';
      const cleanMsg = m.includes('Invalid login') || m.includes('invalid_grant')
        ? 'E-mail ou senha incorretos. Verifique suas credenciais.'
        : m.includes('already registered')
        ? 'Este e-mail já está cadastrado. Faça login ou recupere a senha.'
        : m;
      setMsg({ type: 'error', text: cleanMsg });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setMsg(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao conectar com Google.' });
      setLoading(false);
    }
  }

  return (
    <div className="alu-split-auth">
      {/* LEFT COLUMN: FORM */}
      <div className="alu-split-left">
        <div className="alu-split-form-box">
          {/* Logo Header */}
          <div className="alu-auth-brand">
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(0, 219, 121, 0.12)',
                border: '1px solid rgba(0, 219, 121, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="28" height="14" viewBox="0 0 100 50" fill="none" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="inf-auth-logo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00DB79" />
                      <stop offset="100%" stopColor="#00AAFF" />
                    </linearGradient>
                  </defs>
                  <path d="M30 10 C15 10 10 25 10 25 C10 25 15 40 30 40 C45 40 55 10 70 10 C85 10 90 25 90 25 C90 25 85 40 70 40 C55 40 45 10 30 10 Z" stroke="url(#inf-auth-logo-grad)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
                <span className="text-gradient" style={{ fontWeight: 800, fontSize: 18, letterSpacing: '0.8px' }}>INFINITY</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>ACADEMY</span>
              </div>
            </Link>
          </div>

          {/* Titles */}
          <div style={{ marginBottom: 26 }}>
            <h1 className="alu-auth-title">
              {mode === 'login' && 'Já estuda com a gente?'}
              {mode === 'signup' && 'Criar sua conta de aluno'}
              {mode === 'forgot' && 'Recuperar acesso'}
            </h1>
            <p className="alu-auth-subtitle">
              {mode === 'login' && 'Faça seu login e boa aula!'}
              {mode === 'signup' && 'Comece sua jornada de aprendizado na prática.'}
              {mode === 'forgot' && 'Digite seu e-mail para receber as instruções de recuperação.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="alu-input-group">
                <label className="alu-input-label">NOME COMPLETO</label>
                <div className="alu-input-wrapper">
                  <span className="alu-input-icon">👤</span>
                  <input
                    type="text"
                    className="alu-custom-input"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="alu-input-group">
              <label className="alu-input-label">E-MAIL</label>
              <div className="alu-input-wrapper">
                <span className="alu-input-icon">✉️</span>
                <input
                  type="email"
                  className="alu-custom-input"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="alu-input-group">
                <label className="alu-input-label">SENHA</label>
                <div className="alu-input-wrapper">
                  <span className="alu-input-icon">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="alu-custom-input"
                    placeholder="Sua senha secreta"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="alu-eye-btn"
                    onClick={() => setShowPass(!showPass)}
                    aria-label="Alternar visualização da senha"
                  >
                    {showPass ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="alu-input-group">
                <label className="alu-input-label">CONFIRMAR SENHA</label>
                <div className="alu-input-wrapper">
                  <span className="alu-input-icon">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="alu-custom-input"
                    placeholder="Confirme sua senha"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            )}

            {/* Remember me & Forgot password row */}
            {mode === 'login' && (
              <div className="alu-auth-options-row">
                <label className="alu-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="alu-checkbox"
                  />
                  <span>Lembrar de mim</span>
                </label>
                <button
                  type="button"
                  className="alu-forgot-link"
                  onClick={() => { setMode('forgot'); setMsg(null); }}
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            {/* Error / Success Feedback */}
            {msg && (
              <div className={`alu-feedback ${msg.type}`}>
                {msg.type === 'error' ? '⚠️ ' : '✅ '}
                {msg.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="alu-btn-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="alu-spinner" />
              ) : mode === 'login' ? (
                <>ENTRAR <span style={{ marginLeft: 6 }}>→</span></>
              ) : mode === 'signup' ? (
                <>CRIAR CONTA DE ALUNO <span style={{ marginLeft: 6 }}>→</span></>
              ) : (
                <>ENVIAR INSTRUÇÕES <span style={{ marginLeft: 6 }}>→</span></>
              )}
            </button>
          </form>

          {/* Social Divider */}
          {mode !== 'forgot' && (
            <>
              <div className="alu-divider">
                <span>OU ACESSE COM</span>
              </div>

              {/* Google Button */}
              <button
                type="button"
                className="alu-btn-google"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Logar com Google</span>
              </button>
            </>
          )}

          {/* Footer Switcher */}
          <div className="alu-auth-footer">
            {mode === 'login' ? (
              <div>
                Primeiro acesso?{' '}
                <button
                  type="button"
                  className="alu-link-highlight"
                  onClick={() => { setMode('signup'); setMsg(null); }}
                >
                  Crie sua conta de aluno
                </button>
              </div>
            ) : (
              <div>
                Já tem cadastro?{' '}
                <button
                  type="button"
                  className="alu-link-highlight"
                  onClick={() => { setMode('login'); setMsg(null); }}
                >
                  Fazer login
                </button>
              </div>
            )}

            <div style={{ marginTop: 10 }}>
              É empresa ou infoprodutor?{' '}
              <a
                href="https://wa.me/558193997207?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20as%20solu%C3%A7%C3%B5es%20corporativas%20da%20Infinity%20Academy."
                target="_blank"
                rel="noopener noreferrer"
                className="alu-link-subtle"
              >
                Fale com nossa equipe
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: BRANDING HERO BANNER WITH PARTICLES */}
      <div className="alu-split-right">
        <InfinityWaveBackground />

        <div className="alu-banner-content">
          {/* Logo Badge Card - perfectly proportioned and centered */}
          <div className="alu-banner-badge">
            <svg
              width="46"
              height="23"
              viewBox="0 0 100 50"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
              style={{ filter: 'drop-shadow(0 0 10px rgba(0, 219, 121, 0.75))', display: 'block' }}
            >
              <defs>
                <linearGradient id="inf-badge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00DB79" />
                  <stop offset="100%" stopColor="#00AAFF" />
                </linearGradient>
              </defs>
              <path
                d="M30 10 C15 10 10 25 10 25 C10 25 15 40 30 40 C45 40 55 10 70 10 C85 10 90 25 90 25 C90 25 85 40 70 40 C55 40 45 10 30 10 Z"
                stroke="url(#inf-badge-grad)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2 className="alu-banner-heading">
            Ainda não estuda<br />com a gente?
          </h2>

          <p className="alu-banner-desc">
            Matricule-se hoje e tenha acesso a dezenas de cursos nas áreas de IA, Marketing, Gestão e Vendas, com certificados oficiais inclusos.
          </p>

          <Link href="/academy#planos" className="alu-btn-matricula">
            FAZER MATRÍCULA
          </Link>
        </div>
      </div>
    </div>
  );
}
