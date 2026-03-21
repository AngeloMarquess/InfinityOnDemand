'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Conversation {
  phone: string;
  name: string;
  lastMessage: string;
  lastTime: string;
  status: string;
  messageCount: number;
}

interface ChatMessage {
  role: string;
  message: string;
  created_at: string;
}

export default function FlashSDRTab() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [manualMessage, setManualMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Load conversations list
  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/whatsapp/conversations');
      const data = await res.json();
      if (data.conversations) setConversations(data.conversations);
    } catch {
      console.warn('Could not load conversations');
    }
    setLoading(false);
  }, []);

  // Load messages for a specific phone
  const loadChat = useCallback(async (phone: string) => {
    try {
      const res = await fetch(`/api/whatsapp/conversations?phone=${phone}`);
      const data = await res.json();
      if (data.messages) setChatMessages(data.messages);
    } catch {
      console.warn('Could not load chat');
    }
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  useEffect(() => {
    if (selectedPhone) loadChat(selectedPhone);
  }, [selectedPhone, loadChat]);

  // Auto-refresh every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      loadConversations();
      if (selectedPhone) loadChat(selectedPhone);
    }, 10000);
    return () => clearInterval(interval);
  }, [loadConversations, loadChat, selectedPhone]);

  const sendManualMessage = async () => {
    if (!manualMessage.trim() || !selectedPhone || sending) return;
    setSending(true);
    try {
      await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: selectedPhone, message: manualMessage }),
      });
      // Save to history
      await fetch('/api/whatsapp/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: selectedPhone, message: manualMessage, role: 'flash' }),
      });
      setManualMessage('');
      await loadChat(selectedPhone);
    } catch {
      console.error('Failed to send');
    }
    setSending(false);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'agora';
    if (mins < 60) return `${mins}min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  const statusColors: Record<string, string> = {
    open: '#F59E0B',
    qualified: '#00DB79',
    scheduled: '#8B5CF6',
    transferred: '#EF4444',
    closed: 'rgba(255,255,255,0.3)',
  };

  const statusLabels: Record<string, string> = {
    open: '🟡 Novo',
    qualified: '🟢 Qualificado',
    scheduled: '🟣 Agendado',
    transferred: '🚨 Transf.',
    closed: '⚪ Fechado',
  };

  return (
    <>
      <style>{`
        .flash-sdr-container {
          display: flex;
          gap: 16px;
          height: calc(100vh - 200px);
          max-height: 800px;
        }
        .flash-sdr-left {
          width: 320px;
          flex-shrink: 0;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.06);
          background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .flash-sdr-right {
          flex: 1;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.06);
          background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .flash-sdr-container {
            flex-direction: column;
            height: calc(100vh - 160px);
            max-height: none;
            gap: 0;
          }
          .flash-sdr-left {
            width: 100%;
            flex-shrink: 1;
            border-radius: 16px;
            min-height: 0;
            flex: 1;
          }
          .flash-sdr-right {
            border-radius: 16px;
          }
          .flash-sdr-left.has-selection {
            display: none;
          }
          .flash-sdr-right.no-selection {
            display: none;
          }
          .flash-sdr-right.has-selection {
            flex: 1;
            height: 100%;
          }
        }
      `}</style>
      <div className="flash-sdr-container">

        {/* Left Panel — Conversations List */}
        <div className={`flash-sdr-left ${selectedPhone ? 'has-selection' : ''}`}>
          {/* Header */}
          <div style={{
            padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <img src="/flash-avatar.png" alt="Flash" style={{ width: '32px', height: '32px', borderRadius: '10px', objectFit: 'cover' }} />
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>⚡ Flash SDR</h3>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                {conversations.length} conversa{conversations.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button 
              onClick={async () => {
                const to = prompt('Digite o número para teste (ex: 5581971027939)');
                if (!to) return;
                try {
                  const res = await fetch(`/api/whatsapp/test-delivery?to=${to}`);
                  const data = await res.json();
                  alert(`RESULTADO DIAGNÓSTICO:\nStatus: ${data.status}\nOK: ${data.ok}\nMeta:\n${JSON.stringify(data.meta_response, null, 2)}`);
                } catch (err: any) {
                  alert(`ERRO AO CONECTAR NA API: ${err.message}`);
                }
              }}
              style={{
                padding: '6px 12px', borderRadius: '8px',
                border: '1px solid rgba(0,219,121,0.3)', backgroundColor: 'rgba(0,219,121,0.05)',
                color: '#00DB79', fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              📡 TESTAR
            </button>
          </div>

          {/* Conversations */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                Carregando...
              </div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>Nenhuma conversa ainda</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginTop: '8px' }}>
                  Quando um lead enviar mensagem pelo WhatsApp, o Flash vai responder automaticamente e a conversa aparecerá aqui.
                </p>
              </div>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.phone}
                  onClick={() => setSelectedPhone(conv.phone)}
                  style={{
                    padding: '14px 20px', cursor: 'pointer',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    backgroundColor: selectedPhone === conv.phone ? 'rgba(0,219,121,0.06)' : 'transparent',
                    borderLeft: selectedPhone === conv.phone ? '3px solid #00DB79' : '3px solid transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={e => { if (selectedPhone !== conv.phone) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
                  onMouseOut={e => { if (selectedPhone !== conv.phone) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{conv.name}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>{timeAgo(conv.lastTime)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{
                      fontSize: '12px', color: 'rgba(255,255,255,0.4)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px',
                    }}>{conv.lastMessage}</p>
                    <span style={{
                      fontSize: '10px', fontWeight: 600,
                      color: statusColors[conv.status] || '#F59E0B',
                    }}>
                      {statusLabels[conv.status] || '🟡 Novo'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel — Chat */}
        <div className={`flash-sdr-right ${selectedPhone ? 'has-selection' : 'no-selection'}`}>
          {!selectedPhone ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <img src="/flash-avatar.png" alt="Flash" style={{
                width: '80px', height: '80px', borderRadius: '24px', objectFit: 'cover',
                border: '2px solid rgba(0,219,121,0.2)', boxShadow: '0 0 30px rgba(0,219,121,0.1)',
              }} />
              <h3 style={{ fontSize: '20px', fontWeight: 700 }}>⚡ Flash SDR</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', maxWidth: '400px', textAlign: 'center' }}>
                Selecione uma conversa para visualizar ou enviar mensagens. O Flash responde automaticamente via WhatsApp.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700 }}>
                    {conversations.find(c => c.phone === selectedPhone)?.name || selectedPhone}
                  </h4>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                    +{selectedPhone} • {chatMessages.length} mensagens
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setSelectedPhone(null)} style={{
                    padding: '6px 12px', borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'transparent',
                    color: 'rgba(255,255,255,0.4)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
                  }}>← Voltar</button>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: msg.role === 'lead' ? 'flex-start' : 'flex-end', gap: '8px',
                  }}>
                    {msg.role === 'lead' && (
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', flexShrink: 0, marginTop: '2px',
                      }}>👤</div>
                    )}
                    <div style={{
                      maxWidth: '70%', padding: '10px 14px',
                      borderRadius: msg.role === 'lead' ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
                      backgroundColor: msg.role === 'lead' ? 'rgba(255,255,255,0.05)' : 'rgba(0,219,121,0.1)',
                      border: msg.role === 'lead' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,219,121,0.15)',
                    }}>
                      <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', whiteSpace: 'pre-wrap' }}>
                        {(msg as any).metadata?.audio && <span style={{ marginRight: '6px' }}>🎙️</span>}
                        {msg.message}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', gap: '8px' }}>
                        {!(msg as any).metadata?.meta_ok && (msg as any).role === 'flash' && (
                          <button 
                            onClick={() => alert(`ERRO META: Status ${ (msg as any).metadata?.meta_status}\n${JSON.stringify((msg as any).metadata?.meta_response, null, 2)}`)}
                            style={{ fontSize: '9px', color: '#EF4444', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            ⚠️ ERRO META (Ver Detalhes)
                          </button>
                        )}
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', flex: 1, textAlign: msg.role === 'lead' ? 'left' : 'right' }}>
                          {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    {msg.role === 'flash' && (
                      <img src="/flash-avatar.png" alt="Flash" style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        objectFit: 'cover', flexShrink: 0, marginTop: '2px',
                      }} />
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Manual Send */}
              <div style={{
                padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', gap: '8px',
              }}>
                <input
                  value={manualMessage}
                  onChange={e => setManualMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') sendManualMessage(); }}
                  placeholder="Enviar mensagem manual..."
                  style={{
                    flex: 1, padding: '10px 14px', borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.3)',
                    color: '#fff', fontSize: '13px', fontFamily: 'inherit', outline: 'none',
                  }}
                />
                <button
                  onClick={sendManualMessage}
                  disabled={!manualMessage.trim() || sending}
                  style={{
                    padding: '10px 18px', borderRadius: '10px', border: 'none',
                    backgroundColor: manualMessage.trim() ? 'rgba(0,219,121,0.15)' : 'rgba(255,255,255,0.03)',
                    color: manualMessage.trim() ? '#00DB79' : 'rgba(255,255,255,0.2)',
                    fontWeight: 600, fontSize: '13px', cursor: manualMessage.trim() ? 'pointer' : 'default',
                    fontFamily: 'inherit',
                  }}>
                  Enviar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
