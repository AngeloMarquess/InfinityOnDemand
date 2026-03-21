'use client';

import React, { useState } from 'react';

const glassCard: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '24px',
  padding: '40px',
  backdropFilter: 'blur(30px)',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  width: '100%',
  maxWidth: '500px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px 20px',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.1)',
  backgroundColor: 'rgba(0,0,0,0.4)',
  color: '#fff',
  fontSize: '15px',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  marginTop: '8px',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  borderRadius: '16px',
  border: 'none',
  background: 'linear-gradient(135deg, #25D366, #128C7E)',
  color: '#fff',
  fontWeight: 700,
  fontSize: '16px',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'transform 0.2s, box-shadow 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
};

export default function TesteWhatsApp() {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('Olá! Este é um teste do Infinity On Demand. ⚡');
  const [status, setStatus] = useState < 'idle' | 'loading' | 'success' | 'error' > ('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !message) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Falha ao enviar mensagem.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg('Erro de conexão ao servidor.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      color: '#fff',
      fontFamily: '"Outfit", sans-serif',
    }}>
      <div style={glassCard}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', background: 'rgba(37, 211, 102, 0.1)',
            borderRadius: '20px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px', border: '1px solid rgba(37, 211, 102, 0.2)'
          }}>
            <span style={{ fontSize: '32px' }}>⚡</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>
            Teste de WhatsApp
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
            Envie uma mensagem de teste para validar sua integração com a Meta Graph API.
          </p>
        </div>

        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginLeft: '4px' }}>
              Telefone (com DDI e DDD)
            </label>
            <input
              type="text"
              value={to}
              onChange={e => setTo(e.target.value)}
              placeholder="Ex: 5511999999999"
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginLeft: '4px' }}>
              Mensagem
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: 'none' }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              ...buttonStyle,
              opacity: status === 'loading' ? 0.7 : 1,
              transform: status === 'loading' ? 'scale(0.98)' : 'scale(1)',
              background: status === 'success' ? '#00DB79' : status === 'error' ? '#EF4444' : buttonStyle.background as string
            }}
          >
            {status === 'loading' ? (
              <>⏳ Enviando...</>
            ) : status === 'success' ? (
              <>✅ Mensagem Enviada!</>
            ) : status === 'error' ? (
              <>❌ Falha no Envio</>
            ) : (
              <>🚀 Enviar Teste</>
            )}
          </button>

          {status === 'error' && (
            <div style={{
              padding: '12px 16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', fontSize: '13px',
              textAlign: 'center'
            }}>
              {errorMsg}
            </div>
          )}

          {status === 'success' && (
            <div style={{
              padding: '12px 16px', borderRadius: '12px', background: 'rgba(0, 219, 121, 0.1)',
              border: '1px solid rgba(0, 219, 121, 0.2)', color: '#00DB79', fontSize: '13px',
              textAlign: 'center'
            }}>
              Verifique seu WhatsApp! Se não recebeu, confira se o número está correto e se o token é válido.
            </div>
          )}
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
            Dica: Certifique-se que o número de destino está cadastrado como testador no Meta for Developers se estiver usando ambiente de teste.
          </p>
        </div>
      </div>
    </div>
  );
}
