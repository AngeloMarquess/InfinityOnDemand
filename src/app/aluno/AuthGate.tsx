'use client';

import { useState } from 'react';
import { signIn, signUp } from '@/lib/academy/client';
import { InfinityMark } from './ui';

export default function AuthGate({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, pass);
        if (error) throw error;
        onAuthed();
      } else {
        const { data, error } = await signUp(email, pass, name);
        if (error) throw error;
        if (data.session) { onAuthed(); }
        else { setMsg('Conta criada! Confirme seu e-mail para entrar.'); setMode('login'); }
      }
    } catch (err) {
      const m = err instanceof Error ? err.message : 'Erro ao autenticar';
      setMsg(m.includes('Invalid login') ? 'E-mail ou senha incorretos.' : m);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="alu-auth">
      <div className="alu-auth-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 8 }}>
          <InfinityMark size={38} />
          <div style={{ fontWeight: 800, fontSize: 20 }}><span className="text-gradient">INFINITY</span> Academy</div>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
          {mode === 'login' ? 'Entre para continuar de onde parou' : 'Crie sua conta e comece a aprender'}
        </p>

        <div style={{ display: 'flex', marginBottom: 22, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className={`alu-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Entrar</div>
          <div className={`alu-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>Criar conta</div>
        </div>

        <form onSubmit={submit}>
          {mode === 'signup' && (
            <input className="alu-input" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <input className="alu-input" type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="alu-input" type="password" placeholder="Senha" value={pass} onChange={(e) => setPass(e.target.value)} required minLength={6} />
          {msg && <div style={{ color: msg.includes('criada') ? 'var(--accent-primary)' : '#f87171', fontSize: 13, marginBottom: 14 }}>{msg}</div>}
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: 14, color: '#fff' }} disabled={loading}>
            {loading ? '...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 12, marginTop: 18 }}>
          Ao continuar você concorda com os termos da Infinity Academy.
        </p>
      </div>
    </div>
  );
}
