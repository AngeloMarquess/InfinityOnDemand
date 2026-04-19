'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { briefingCategories } from '@/config/briefingQuestions';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

export default function BriefingFormPage() {
  const router = useRouter();
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  
  const type = params?.type as string;
  const category = briefingCategories[type];

  const [formData, setFormData] = useState<Record<string, any>>({
    company_name: '',
    contact_name: '',
    contact_phone: '',
    // Dynamic answers will go here
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!category) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#00DB79]/20 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#00AAFF]/20 blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center z-10 p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
        >
          <h1 className="text-3xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">Categoria não encontrada</h1>
          <p className="text-gray-400 mb-8">O tipo de projeto que você procura não está disponível ou a URL está incorreta.</p>
          <Link href="/Briefing" className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 hover:bg-[#00DB79]/20 hover:text-[#00DB79] transition-all font-medium border border-white/5 hover:border-[#00DB79]/50">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para opções
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (id: string, option: string, checked: boolean) => {
    setFormData(prev => {
      const currentArr = prev[id] || [];
      if (checked) {
        return { ...prev, [id]: [...currentArr, option] };
      } else {
        return { ...prev, [id]: currentArr.filter((item: string) => item !== option) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { company_name, contact_name, contact_phone, ...answers } = formData;
      
      const response = await fetch('/api/Briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefing_type: type,
          company_name,
          contact_name,
          contact_phone,
          answers,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        // After 4 seconds, go back to home or briefing page
        setTimeout(() => {
          router.push('/Briefing');
        }, 4000);
      } else {
        alert('Erro ao enviar o briefing. Tente novamente mais tarde.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white py-12 px-4 md:px-8 relative overflow-hidden">
      
      {/* Premium Background Gradients */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-[#00DB79]/15 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#00AAFF]/15 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F19]/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-[#111827]/90 backdrop-blur-xl border border-[#00DB79]/50 p-10 rounded-[2rem] shadow-[0_0_80px_rgba(0,219,121,0.25)] text-center max-w-sm w-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00DB79]/10 to-transparent pointer-events-none" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-24 h-24 bg-gradient-to-br from-[#00DB79]/20 to-[#00DB79]/5 rounded-full flex items-center justify-center mb-6 shadow-inner border border-[#00DB79]/30"
              >
                <CheckCircle className="w-12 h-12 text-[#00DB79]" />
              </motion.div>
              <h2 className="text-3xl font-extrabold mb-3 text-white tracking-tight">Fantástico!</h2>
              <p className="text-gray-300 text-lg leading-relaxed">Seu briefing foi enviado e nossa equipe já está analisando.</p>
              <div className="mt-8 flex justify-center">
                <div className="animate-pulse flex space-x-2">
                  <div className="w-2 h-2 bg-[#00DB79] rounded-full"></div>
                  <div className="w-2 h-2 bg-[#00DB79] rounded-full animation-delay-200"></div>
                  <div className="w-2 h-2 bg-[#00DB79] rounded-full animation-delay-400"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/Briefing" className="inline-flex items-center text-gray-400 hover:text-[#00DB79] mb-10 transition-colors group">
          <div className="p-2 bg-white/5 rounded-full mr-3 group-hover:bg-[#00DB79]/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-medium tracking-wide text-sm uppercase">Explorar outros projetos</span>
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center md:text-left"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#00DB79]/10 text-[#00DB79] font-medium text-sm mb-4 border border-[#00DB79]/20 tracking-wide uppercase">
            Processo de Briefing
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight">Configuração de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00DF81] to-[#00AAFF]">{category.title}</span></h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl">Precisamos de todas as informações chave para esculpir um projeto perfeito. Cada detalhe importa.</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onSubmit={handleSubmit} 
          className="space-y-10 bg-[#111827]/60 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden relative"
        >
          {/* Glass light reflection effect */}
          <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#00DB79]/50 to-transparent"></div>
          
          {/* Global Info */}
          <div className="space-y-8 pb-10 border-b border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00DF81] to-[#00AAFF] flex items-center justify-center text-white font-bold text-sm">1</div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Dados Gerais</h2>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide uppercase">Nome da Empresa <span className="text-red-500">*</span></label>
              <input required type="text" placeholder="Como devemos chamar seu negócio?" value={formData.company_name} onChange={e => handleChange('company_name', e.target.value)} className="w-full bg-[#0B0F19]/80 text-white rounded-xl p-4 border border-white/10 outline-none focus:border-[#00DB79] focus:ring-1 focus:ring-[#00DB79]/50 transition-all placeholder:text-gray-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide uppercase">Seu Nome / Responsável <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="Nome completo" value={formData.contact_name} onChange={e => handleChange('contact_name', e.target.value)} className="w-full bg-[#0B0F19]/80 text-white rounded-xl p-4 border border-white/10 outline-none focus:border-[#00DB79] focus:ring-1 focus:ring-[#00DB79]/50 transition-all placeholder:text-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide uppercase">WhatsApp / Telefone <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="(00) 00000-0000" value={formData.contact_phone} onChange={e => handleChange('contact_phone', e.target.value)} className="w-full bg-[#0B0F19]/80 text-white rounded-xl p-4 border border-white/10 outline-none focus:border-[#00DB79] focus:ring-1 focus:ring-[#00DB79]/50 transition-all placeholder:text-gray-600" />
              </div>
            </div>
          </div>

          {/* Dynamic Info */}
          <div className="space-y-8 pt-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00AAFF] to-[#8A2BE2] flex items-center justify-center text-white font-bold text-sm">2</div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Especificações Técnicas</h2>
            </div>
            
            {category.questions.map((q, i) => (
              <motion.div 
                key={q.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + (i * 0.05) }}
                className="group"
              >
                <label className="block text-base font-medium text-gray-200 mb-3 group-hover:text-white transition-colors">
                  {q.label} {q.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {q.type === 'text' && (
                  <input required={q.required} type="text" value={formData[q.id] || ''} onChange={e => handleChange(q.id, e.target.value)} className="w-full bg-[#0B0F19]/80 text-white rounded-xl p-4 border border-white/10 outline-none focus:border-[#00AAFF] focus:ring-1 focus:ring-[#00AAFF]/50 transition-all" />
                )}

                {q.type === 'textarea' && (
                  <textarea required={q.required} rows={4} value={formData[q.id] || ''} onChange={e => handleChange(q.id, e.target.value)} className="w-full bg-[#0B0F19]/80 text-white rounded-xl p-4 border border-white/10 outline-none focus:border-[#00AAFF] focus:ring-1 focus:ring-[#00AAFF]/50 transition-all resize-none custom-scrollbar" />
                )}

                {q.type === 'radio' && q.options && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {q.options.map(opt => (
                      <label key={opt} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData[q.id] === opt ? 'border-[#00AAFF] bg-[#00AAFF]/10' : 'border-white/5 bg-[#0B0F19]/50 hover:bg-[#0B0F19] hover:border-white/20'}`}>
                        <div className="relative flex items-center justify-center">
                          <input required={q.required} type="radio" name={q.id} value={opt} checked={formData[q.id] === opt} onChange={e => handleChange(q.id, e.target.value)} className="sr-only" />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${formData[q.id] === opt ? 'border-[#00AAFF]' : 'border-gray-500'}`}>
                            {formData[q.id] === opt && <div className="w-2.5 h-2.5 rounded-full bg-[#00AAFF]" />}
                          </div>
                        </div>
                        <span className={formData[q.id] === opt ? 'text-white font-medium' : 'text-gray-400'}>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'checkbox' && q.options && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {q.options.map(opt => {
                      const isChecked = (formData[q.id] || []).includes(opt);
                      return (
                        <label key={opt} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${isChecked ? 'border-[#00AAFF] bg-[#00AAFF]/10' : 'border-white/5 bg-[#0B0F19]/50 hover:bg-[#0B0F19] hover:border-white/20'}`}>
                          <input type="checkbox" checked={isChecked} onChange={e => handleCheckboxChange(q.id, opt, e.target.checked)} className="sr-only" />
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-colors ${isChecked ? 'border-[#00AAFF] bg-[#00AAFF]' : 'border-gray-500 block'}`}>
                            {isChecked && <CheckCircle className="w-3 h-3 text-[white]" />}
                          </div>
                          <span className={isChecked ? 'text-white font-medium' : 'text-gray-400'}>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="pt-10 mt-6 border-t border-white/5">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full relative group overflow-hidden bg-white/5 text-white font-bold py-5 rounded-2xl transition-all border border-white/10 hover:border-[#00DB79]/50 hover:shadow-[0_0_40px_rgba(0,219,121,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#00DF81] to-[#00AAFF] opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center justify-center text-lg shadow-sm">
                {isSubmitting ? (
                  <span className="flex items-center animate-pulse">Enviando Requisição...</span>
                ) : (
                  <span className="flex items-center">Transmitir Briefing <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></span>
                )}
              </span>
            </button>
            <p className="text-center text-xs text-gray-500 mt-6 uppercase tracking-widest">Tecnologia desenvolvida pela Infinity On Demand</p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
