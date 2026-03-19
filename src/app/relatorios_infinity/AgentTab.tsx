'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const quickSuggestions = [
  { icon: '🚀', text: 'Criar uma campanha para essa semana' },
  { icon: '🔍', text: 'Analisar meus concorrentes e sugerir melhorias' },
  { icon: '📊', text: 'Como melhorar meu engajamento no Instagram?' },
  { icon: '💡', text: 'Gerar 5 ideias de posts para essa semana' },
  { icon: '📱', text: 'Criar sequência de stories para converter leads' },
  { icon: '💰', text: 'Montar estratégia de tráfego pago com R$ 30/dia' },
];

export default function AgentTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const sendMessage = async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText || isStreaming) return;

    const userMsg: Message = { role: 'user', content: msgText, timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);

    // Add empty assistant message for streaming
    const assistantMsg: Message = { role: 'assistant', content: '', timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          clientId: 'default',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: `❌ **Erro**: ${errorData.error || 'Falha na comunicação com o agente'}`,
          };
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          const lines = text.split('\n').filter(l => l.startsWith('data: '));

          for (const line of lines) {
            const data = line.replace('data: ', '');
            if (data === '[DONE]') break;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: fullContent,
                  };
                  return updated;
                });
              }
              if (parsed.error) {
                fullContent += `\n\n❌ Erro: ${parsed.error}`;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { ...updated[updated.length - 1], content: fullContent };
                  return updated;
                });
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: '❌ **Erro de conexão**. Verifique se a OpenAI API Key está configurada em ⚙️ Configurações.',
        };
        return updated;
      });
    }

    setIsStreaming(false);
  };

  // Simple markdown rendering
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background:rgba(0,0,0,0.3);padding:1px 5px;border-radius:3px;font-size:12px">$1</code>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)',
      maxHeight: '800px',
    }}>

      {/* Chat Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/flash-avatar.png" alt="Flash" style={{
            width: '48px', height: '48px', borderRadius: '16px', objectFit: 'cover',
          }} />
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px' }}>⚡ Flash</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                backgroundColor: isStreaming ? '#F59E0B' : '#00DB79',
                animation: isStreaming ? 'pulse 1s infinite' : 'none',
              }} />
              <span style={{ fontSize: '12px', color: isStreaming ? '#F59E0B' : '#00DB79', fontWeight: 500 }}>
                {isStreaming ? 'Pensando...' : 'Online'}
              </span>
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            style={{
              padding: '8px 16px', borderRadius: '8px',
              border: '1px solid rgba(239,68,68,0.2)', backgroundColor: 'rgba(239,68,68,0.06)',
              color: '#EF4444', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            🗑️ Limpar chat
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1, overflowY: 'auto', borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%)',
        padding: '24px',
        display: 'flex', flexDirection: 'column', gap: '16px',
      }}>
        {messages.length === 0 ? (
          /* Empty state with suggestions */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '28px' }}>
            <div style={{ textAlign: 'center' }}>
              <img src="/flash-avatar.png" alt="Flash" style={{
                width: '80px', height: '80px', borderRadius: '24px',
                objectFit: 'cover', margin: '0 auto 16px',
                border: '2px solid rgba(239,68,68,0.3)',
                boxShadow: '0 0 30px rgba(239,68,68,0.2)',
              }} />
              <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>⚡ Olá! Eu sou o Flash</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', maxWidth: '480px' }}>
                Posso criar campanhas, analisar concorrentes, gerar copies e otimizar sua estratégia de marketing digital.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxWidth: '560px', width: '100%' }}>
              {quickSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s.text)}
                  style={{
                    padding: '14px 16px', borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                    textAlign: 'left', fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(139,92,246,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{s.icon}</span>
                  {s.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: '10px',
              }}
            >
              {msg.role === 'assistant' && (
                <img src="/flash-avatar.png" alt="Flash" style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  objectFit: 'cover', flexShrink: 0, marginTop: '4px',
                }} />
              )}
              <div style={{
                maxWidth: '75%',
                padding: '14px 18px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                backgroundColor: msg.role === 'user'
                  ? 'rgba(0,219,121,0.12)'
                  : 'rgba(255,255,255,0.04)',
                border: msg.role === 'user'
                  ? '1px solid rgba(0,219,121,0.15)'
                  : '1px solid rgba(255,255,255,0.06)',
              }}>
                <div
                  style={{
                    fontSize: '14px', lineHeight: 1.7,
                    color: msg.role === 'user' ? '#fff' : 'rgba(255,255,255,0.85)',
                  }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                />
                {msg.content === '' && isStreaming && i === messages.length - 1 && (
                  <div style={{ display: 'flex', gap: '4px', padding: '4px 0' }}>
                    {[0, 1, 2].map(j => (
                      <div key={j} style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        backgroundColor: 'rgba(139,92,246,0.5)',
                        animation: `pulse 1.2s ${j * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                )}
                {msg.timestamp && (
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', marginTop: '6px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    {msg.timestamp}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  backgroundColor: 'rgba(0,219,121,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', flexShrink: 0, marginTop: '4px',
                }}>👤</div>
              )}
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'flex-end',
      }}>
        <div style={{
          flex: 1, position: 'relative',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Pergunte sobre campanhas, copies, estratégias..."
            rows={1}
            style={{
              width: '100%', padding: '14px 18px',
              border: 'none', backgroundColor: 'transparent',
              color: '#fff', fontSize: '14px', fontFamily: 'inherit',
              resize: 'none', outline: 'none',
              lineHeight: 1.5,
            }}
          />
        </div>
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || isStreaming}
          style={{
            width: '48px', height: '48px', borderRadius: '14px',
            border: 'none',
            background: input.trim() && !isStreaming
              ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
              : 'rgba(255,255,255,0.05)',
            color: input.trim() && !isStreaming ? '#fff' : 'rgba(255,255,255,0.2)',
            fontSize: '20px', cursor: input.trim() && !isStreaming ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
