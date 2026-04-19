'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { briefingCategories } from '@/config/briefingQuestions';
import { CheckCircle, ArrowLeft, Send, Upload, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function BriefingFormPage() {
  const router = useRouter();
  const routeParams = useParams();
  const [mounted, setMounted] = useState(false);

  const type = routeParams?.type as string;
  const category = briefingCategories[type];

  const [formData, setFormData] = useState<Record<string, any>>({
    company_name: '',
    contact_name: '',
    contact_phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [filePreviews, setFilePreviews] = useState<Record<string, { file: File; preview: string }[]>>({});
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleFileSelect = (id: string, files: FileList | null, maxFiles: number = 5) => {
    if (!files) return;
    const existing = filePreviews[id] || [];
    const remaining = maxFiles - existing.length;
    const newFiles = Array.from(files).slice(0, remaining);
    const newPreviews = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFilePreviews(prev => ({ ...prev, [id]: [...existing, ...newPreviews] }));
  };

  const removeFile = (id: string, index: number) => {
    setFilePreviews(prev => {
      const arr = [...(prev[id] || [])];
      URL.revokeObjectURL(arr[index].preview);
      arr.splice(index, 1);
      return { ...prev, [id]: arr };
    });
  };

  const uploadFiles = async (id: string): Promise<string[]> => {
    const items = filePreviews[id];
    if (!items || items.length === 0) return [];
    setUploadingField(id);
    try {
      const fd = new FormData();
      items.forEach(item => fd.append('files', item.file));
      const res = await fetch('/api/Briefing/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        return data.urls || [];
      }
    } catch (e) { console.error('Upload error:', e); }
    finally { setUploadingField(null); }
    return [];
  };

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  if (!category) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0B0F19 0%, #111827 50%, #0B0F19 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Inter', sans-serif", padding: '40px 20px',
      }}>
        <div style={{
          background: '#fff', borderRadius: '24px', padding: '48px',
          textAlign: 'center', maxWidth: '420px', width: '100%',
          boxShadow: '0 25px 60px -12px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: '28px',
          }}>⚠️</div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' }}>Categoria não encontrada</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>O tipo de projeto que você procura não está disponível.</p>
          <Link href="/Briefing" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '12px 28px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #00DF81, #00AAFF)',
            color: '#fff', fontWeight: '600', fontSize: '14px', textDecoration: 'none',
          }}>
            <ArrowLeft size={16} /> Voltar
          </Link>
        </div>
      </div>
    );
  }

  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits.length ? `(${digits}` : '';
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, contact_phone: formatPhone(value) }));
  };

  const handleCheckboxChange = (id: string, option: string, checked: boolean) => {
    setFormData(prev => {
      const arr = prev[id] || [];
      return { ...prev, [id]: checked ? [...arr, option] : arr.filter((i: string) => i !== option) };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Upload all files first
      const fileAnswers: Record<string, string[]> = {};
      for (const fieldId of Object.keys(filePreviews)) {
        if (filePreviews[fieldId].length > 0) {
          const urls = await uploadFiles(fieldId);
          fileAnswers[fieldId] = urls;
        }
      }

      const { company_name, contact_name, contact_phone, ...answers } = formData;
      const allAnswers = { ...answers, ...fileAnswers };

      const res = await fetch('/api/Briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefing_type: type, company_name, contact_name, contact_phone, answers: allAnswers }),
      });
      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => router.push('/Briefing'), 4000);
      } else { alert('Erro ao enviar. Tente novamente.'); }
    } catch { alert('Erro inesperado.'); }
    finally { setIsSubmitting(false); }
  };

  const inputStyle = (id: string): React.CSSProperties => ({
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: focusedField === id ? '2px solid #00DB79' : '2px solid #e5e7eb',
    fontSize: '15px',
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    transition: 'all 0.2s ease',
    background: '#fafafa',
    color: '#1a1a2e',
    boxShadow: focusedField === id ? '0 0 0 4px rgba(0,219,121,0.1)' : 'none',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '14px', fontWeight: '600',
    color: '#374151', marginBottom: '8px',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0B0F19 0%, #111827 50%, #0B0F19 100%)',
      fontFamily: "'Inter', sans-serif",
      padding: '40px 20px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: '-200px', left: '-200px', width: '600px', height: '600px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,219,121,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-200px', right: '-200px', width: '600px', height: '600px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,170,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Success Overlay */}
      {isSuccess && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff', borderRadius: '28px', padding: '48px',
            textAlign: 'center', maxWidth: '400px', width: '90%',
            boxShadow: '0 25px 60px -12px rgba(0,0,0,0.4)',
            animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(0,219,121,0.15), rgba(0,170,255,0.1))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              border: '3px solid rgba(0,219,121,0.3)',
            }}>
              <CheckCircle size={40} color="#00DB79" />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' }}>Fantástico! 🎉</h2>
            <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6' }}>Seu briefing foi enviado com sucesso.<br/>Nossa equipe já está analisando.</p>
            <div style={{ marginTop: '24px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00DB79', animation: 'pulse 1.4s infinite' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00DB79', animation: 'pulse 1.4s infinite 0.2s' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00DB79', animation: 'pulse 1.4s infinite 0.4s' }} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Back Link */}
        <Link href="/Briefing" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          color: '#9ca3af', fontSize: '14px', fontWeight: '500',
          textDecoration: 'none', marginBottom: '24px',
          padding: '8px 16px', borderRadius: '10px',
          background: 'rgba(255,255,255,0.05)',
          transition: 'all 0.2s ease',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <ArrowLeft size={16} /> Voltar aos projetos
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'inline-block', padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(0,219,121,0.1)', border: '1px solid rgba(0,219,121,0.2)',
            color: '#00DB79', fontSize: '12px', fontWeight: '600',
            letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px',
          }}>Briefing</div>
          <h1 style={{
            fontSize: '36px', fontWeight: '800', color: '#fff',
            lineHeight: '1.2', marginBottom: '8px',
          }}>
            {category.title}
          </h1>
          <p style={{ fontSize: '16px', color: '#9ca3af', lineHeight: '1.6' }}>
            Preencha os campos abaixo com o máximo de detalhes para que possamos criar o melhor projeto possível.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 25px 60px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        }}>
          {/* Section 1 */}
          <div style={{ marginBottom: '36px', paddingBottom: '36px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #00DF81, #00AAFF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: '700', fontSize: '14px',
              }}>1</div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e' }}>Informações da Empresa</h2>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Nome da Empresa <span style={{ color: '#ef4444' }}>*</span></label>
              <input required type="text" placeholder="Ex: Padaria do João"
                style={inputStyle('company_name')}
                value={formData.company_name}
                onChange={e => handleChange('company_name', e.target.value)}
                onFocus={() => setFocusedField('company_name')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Seu Nome <span style={{ color: '#ef4444' }}>*</span></label>
                <input required type="text" placeholder="Nome completo"
                  style={inputStyle('contact_name')}
                  value={formData.contact_name}
                  onChange={e => handleChange('contact_name', e.target.value)}
                  onFocus={() => setFocusedField('contact_name')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              <div>
                <label style={labelStyle}>WhatsApp <span style={{ color: '#ef4444' }}>*</span></label>
                <input required type="tel" placeholder="(00) 00000-0000"
                  maxLength={15}
                  style={inputStyle('contact_phone')}
                  value={formData.contact_phone}
                  onChange={e => handlePhoneChange(e.target.value)}
                  onFocus={() => setFocusedField('contact_phone')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>
          </div>

          {/* Section 2 - dynamic questions */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #00AAFF, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: '700', fontSize: '14px',
              }}>2</div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e' }}>Detalhes do Projeto</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {category.questions.map((q) => (
                <div key={q.id}>
                  <label style={labelStyle}>
                    {q.label} {q.required && <span style={{ color: '#ef4444' }}>*</span>}
                  </label>

                  {q.type === 'text' && (
                    <input
                      required={q.required} type="text"
                      style={inputStyle(q.id)}
                      value={formData[q.id] || ''}
                      onChange={e => handleChange(q.id, e.target.value)}
                      onFocus={() => setFocusedField(q.id)}
                      onBlur={() => setFocusedField(null)}
                    />
                  )}

                  {q.type === 'textarea' && (
                    <textarea
                      required={q.required} rows={4}
                      style={{ ...inputStyle(q.id), resize: 'vertical' as const }}
                      value={formData[q.id] || ''}
                      onChange={e => handleChange(q.id, e.target.value)}
                      onFocus={() => setFocusedField(q.id)}
                      onBlur={() => setFocusedField(null)}
                    />
                  )}

                  {q.type === 'radio' && q.options && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {q.options.map(opt => {
                        const isSel = formData[q.id] === opt;
                        return (
                          <label key={opt} onClick={() => handleChange(q.id, opt)} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                            border: isSel ? '2px solid #00DB79' : '2px solid #f0f0f0',
                            background: isSel ? 'rgba(0,219,121,0.06)' : '#fafafa',
                            transition: 'all 0.2s ease',
                          }}>
                            <div style={{
                              width: '20px', height: '20px', borderRadius: '50%',
                              border: isSel ? '2px solid #00DB79' : '2px solid #d1d5db',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}>
                              {isSel && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00DB79' }} />}
                            </div>
                            <span style={{ fontSize: '14px', color: isSel ? '#065f46' : '#4b5563', fontWeight: isSel ? '600' : '400' }}>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'checkbox' && q.options && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {q.options.map(opt => {
                        const isChk = (formData[q.id] || []).includes(opt);
                        return (
                          <label key={opt} onClick={() => handleCheckboxChange(q.id, opt, !isChk)} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                            border: isChk ? '2px solid #00AAFF' : '2px solid #f0f0f0',
                            background: isChk ? 'rgba(0,170,255,0.06)' : '#fafafa',
                            transition: 'all 0.2s ease',
                          }}>
                            <div style={{
                              width: '20px', height: '20px', borderRadius: '6px',
                              border: isChk ? '2px solid #00AAFF' : '2px solid #d1d5db',
                              background: isChk ? '#00AAFF' : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}>
                              {isChk && <CheckCircle size={12} color="#fff" />}
                            </div>
                            <span style={{ fontSize: '14px', color: isChk ? '#1e40af' : '#4b5563', fontWeight: isChk ? '600' : '400' }}>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'file' && (
                    <div>
                      <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(q.id); }}
                        onDragLeave={() => setDragOver(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOver(null);
                          handleFileSelect(q.id, e.dataTransfer.files, q.maxFiles || 5);
                        }}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = q.accept || 'image/*';
                          input.multiple = (q.maxFiles || 5) > 1;
                          input.onchange = (ev) => handleFileSelect(q.id, (ev.target as HTMLInputElement).files, q.maxFiles || 5);
                          input.click();
                        }}
                        style={{
                          border: dragOver === q.id ? '2px dashed #00DB79' : '2px dashed #d1d5db',
                          borderRadius: '16px',
                          padding: '32px 20px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: dragOver === q.id ? 'rgba(0,219,121,0.06)' : '#fafafa',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Upload size={28} color={dragOver === q.id ? '#00DB79' : '#9ca3af'} style={{ margin: '0 auto 8px' }} />
                        <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500' }}>
                          Clique ou arraste as imagens aqui
                        </p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                          Máx. {q.maxFiles || 5} imagens · PNG, JPG ou WEBP · até 10MB
                        </p>
                      </div>

                      {/* Previews */}
                      {(filePreviews[q.id] || []).length > 0 && (
                        <div style={{
                          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                          gap: '12px', marginTop: '16px',
                        }}>
                          {(filePreviews[q.id] || []).map((item, idx) => (
                            <div key={idx} style={{
                              position: 'relative', borderRadius: '12px', overflow: 'hidden',
                              border: '2px solid #e5e7eb', background: '#f9fafb',
                              aspectRatio: '1',
                            }}>
                              <img src={item.preview} alt="Preview" style={{
                                width: '100%', height: '100%', objectFit: 'cover',
                              }} />
                              <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(q.id, idx); }} style={{
                                position: 'absolute', top: '4px', right: '4px',
                                width: '24px', height: '24px', borderRadius: '50%',
                                background: 'rgba(0,0,0,0.6)', border: 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                              }}>
                                <X size={14} color="#fff" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {uploadingField === q.id && (
                        <p style={{ fontSize: '13px', color: '#00DB79', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ImageIcon size={14} /> Fazendo upload das imagens...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={isSubmitting} style={{
            width: '100%', padding: '16px',
            borderRadius: '14px', border: 'none',
            background: isSubmitting ? '#d1d5db' : 'linear-gradient(135deg, #00DF81, #00AAFF)',
            color: '#fff', fontWeight: '700', fontSize: '16px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: isSubmitting ? 'none' : '0 4px 20px rgba(0,219,121,0.3)',
            transition: 'all 0.2s ease',
            fontFamily: "'Inter', sans-serif",
          }}>
            {isSubmitting ? 'Enviando...' : (
              <>Enviar Briefing <Send size={18} /></>
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Tecnologia por Infinity On Demand
          </p>
        </form>
      </div>
    </div>
  );
}
