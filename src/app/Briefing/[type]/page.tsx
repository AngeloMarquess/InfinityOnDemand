'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { briefingCategories } from '@/config/briefingQuestions';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BriefingFormPage({ params }: { params: { type: string } }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Unwrap params depending on nextjs version, but using params.type usually works.
  // Using unwrapping pattern if needed, but standard is fine for client side in 14+ if not async.
  // We'll use React.use(params) style if it's next 15, but let's assume standard Next.js 14 for now 
  // or use the unwrapped value directly.
  const type = params?.type; 
  
  const category = briefingCategories[type as string];

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
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Categoria não encontrada</h1>
          <Link href="/Briefing" className="text-[#00DB79] hover:underline">Voltar para opções</Link>
        </div>
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
      
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F19]/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-[#111827] border border-[#00DB79] p-10 rounded-2xl shadow-[0_0_50px_rgba(0,219,121,0.2)] text-center max-w-sm w-full"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-20 h-20 bg-[#00DB79]/20 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle className="w-10 h-10 text-[#00DB79]" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Sucesso!</h2>
              <p className="text-gray-400">Seu briefing foi recebido pela nossa equipe.</p>
              <p className="text-sm text-gray-500 mt-4">Redirecionando...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto">
        <Link href="/Briefing" className="inline-flex items-center text-gray-400 hover:text-[#00DB79] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>
        
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Briefing de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00DF81] to-[#00AAFF]">{category.title}</span></h1>
          <p className="text-gray-400">Preencha as informações abaixo para iniciarmos seu projeto.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-[#111827] border border-gray-800 p-6 md:p-10 rounded-2xl shadow-xl">
          
          {/* Global Info */}
          <div className="space-y-6 pb-8 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-[#00DB79]">Informações Gerais</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome da Empresa *</label>
              <input required type="text" value={formData.company_name} onChange={e => handleChange('company_name', e.target.value)} className="w-full bg-[#1E293B] text-white rounded-lg p-3 border border-gray-700 outline-none focus:border-[#00DB79]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Seu Nome *</label>
                <input required type="text" value={formData.contact_name} onChange={e => handleChange('contact_name', e.target.value)} className="w-full bg-[#1E293B] text-white rounded-lg p-3 border border-gray-700 outline-none focus:border-[#00DB79]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp / Contato *</label>
                <input required type="text" value={formData.contact_phone} onChange={e => handleChange('contact_phone', e.target.value)} className="w-full bg-[#1E293B] text-white rounded-lg p-3 border border-gray-700 outline-none focus:border-[#00DB79]" />
              </div>
            </div>
          </div>

          {/* Dynamic Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#00AAFF]">Detalhes do Projeto</h2>
            
            {category.questions.map((q) => (
              <div key={q.id}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {q.label} {q.required && <span className="text-red-500">*</span>}
                </label>

                {q.type === 'text' && (
                  <input required={q.required} type="text" value={formData[q.id] || ''} onChange={e => handleChange(q.id, e.target.value)} className="w-full bg-[#1E293B] text-white rounded-lg p-3 border border-gray-700 outline-none focus:border-[#00AAFF]" />
                )}

                {q.type === 'textarea' && (
                  <textarea required={q.required} rows={4} value={formData[q.id] || ''} onChange={e => handleChange(q.id, e.target.value)} className="w-full bg-[#1E293B] text-white rounded-lg p-3 border border-gray-700 outline-none focus:border-[#00AAFF] resize-none" />
                )}

                {q.type === 'radio' && q.options && (
                  <div className="space-y-2">
                    {q.options.map(opt => (
                      <label key={opt} className="flex items-center space-x-3 cursor-pointer">
                        <input required={q.required} type="radio" name={q.id} value={opt} checked={formData[q.id] === opt} onChange={e => handleChange(q.id, e.target.value)} className="w-4 h-4 text-[#00AAFF] bg-[#1E293B] border-gray-600 focus:ring-[#00AAFF]" />
                        <span className="text-gray-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'checkbox' && q.options && (
                  <div className="space-y-2">
                    {q.options.map(opt => (
                      <label key={opt} className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" checked={(formData[q.id] || []).includes(opt)} onChange={e => handleCheckboxChange(q.id, opt, e.target.checked)} className="w-4 h-4 text-[#00AAFF] bg-[#1E293B] border-gray-600 rounded focus:ring-[#00AAFF]" />
                        <span className="text-gray-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#00DF81] to-[#00AAFF] text-white font-bold py-4 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex justify-center items-center"
            >
              {isSubmitting ? 'Enviando...' : 'Finalizar Briefing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
