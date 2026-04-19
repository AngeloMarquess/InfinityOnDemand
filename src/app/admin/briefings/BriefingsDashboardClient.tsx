'use client';

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { briefingCategories } from '@/config/briefingQuestions';
import { Eye, FileText, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BriefingsDashboardClient({ initialData }: { initialData: any[] }) {
  const [selectedBriefing, setSelectedBriefing] = useState<any | null>(null);

  // Group data for the charts
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    initialData.forEach(b => {
      counts[b.briefing_type] = (counts[b.briefing_type] || 0) + 1;
    });

    return Object.keys(briefingCategories).map(key => ({
      name: briefingCategories[key].title,
      id: key,
      value: counts[key] || 0,
    }));
  }, [initialData]);

  // Handle modal closing
  const closeModal = () => setSelectedBriefing(null);

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold border-l-4 border-[#00DB79] pl-4 text-white">Dashboard de Briefings</h1>
        <p className="text-gray-400 mt-2">Visão geral e análises estatísticas dos pedidos de projetos.</p>
      </div>

      {/* Stats and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* Total stats card */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-[#1E293B] rounded-xl text-[#00AAFF]">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Recebidos</p>
              <h2 className="text-4xl font-bold text-white">{initialData.length}</h2>
            </div>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full mt-4">
            <div className="bg-gradient-to-r from-[#00DF81] to-[#00AAFF] h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Chart card */}
        <div className="lg:col-span-2 bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Volume por Categoria</h3>
          <div className="h-64 w-full text-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#4B5563" tick={{ fill: '#9CA3AF' }} />
                <YAxis stroke="#4B5563" tick={{ fill: '#9CA3AF' }} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: '#1E293B' }} 
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#00DB79' : '#1E293B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Últimos Briefings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E293B] text-gray-400 text-sm">
                <th className="p-4 font-medium">Data</th>
                <th className="p-4 font-medium">Empresa</th>
                <th className="p-4 font-medium">Tipo</th>
                <th className="p-4 font-medium">Contato</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {initialData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-400">Nenhum briefing recebido ainda.</td>
                </tr>
              ) : (
                initialData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-800 hover:bg-[#1E293B]/50 transition-colors">
                    <td className="p-4 text-gray-300">
                      {new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </td>
                    <td className="p-4 font-medium text-white">{item.company_name}</td>
                    <td className="p-4">
                      <span className="bg-[#00AAFF]/10 text-[#00AAFF] px-2 py-1 rounded text-xs font-semibold">
                        {briefingCategories[item.briefing_type]?.title || item.briefing_type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">
                      <div>{item.contact_name}</div>
                      <div className="text-gray-500 text-xs">{item.contact_phone}</div>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-gray-400">
                        {item.status === 'pending' ? <Clock className="w-4 h-4 text-orange-400" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                        {item.status === 'pending' ? 'Pendente' : 'Concluído'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedBriefing(item)}
                        className="p-2 bg-[#1E293B] hover:bg-[#00DB79]/20 hover:text-[#00DB79] rounded text-gray-400 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Details */}
      <AnimatePresence>
        {selectedBriefing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F19]/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#111827] border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#1E293B]">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{selectedBriefing.company_name}</h2>
                  <p className="text-[#00DB79] text-sm">
                    {briefingCategories[selectedBriefing.briefing_type]?.title || selectedBriefing.briefing_type}
                  </p>
                </div>
                <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors text-2xl leading-none">&times;</button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-2 gap-4 mb-8 bg-[#0B0F19] p-4 rounded-lg">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Contato</span>
                    <span className="text-gray-300">{selectedBriefing.contact_name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Telefone/WhatsApp</span>
                    <span className="text-gray-300">{selectedBriefing.contact_phone}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-800 pb-2">Respostas do Formulário</h3>
                
                <div className="space-y-6">
                  {Object.entries(selectedBriefing.answers).map(([key, value]) => {
                    const questionDef = briefingCategories[selectedBriefing.briefing_type]?.questions.find(q => q.id === key);
                    const label = questionDef ? questionDef.label : key;
                    const displayValue = Array.isArray(value) ? (value as string[]).join(', ') : (typeof value === 'string' ? value : JSON.stringify(value));

                    return (
                      <div key={key}>
                        <h4 className="text-sm font-medium text-[#00AAFF] mb-1">{label}</h4>
                        <div className="bg-[#1E293B] p-4 rounded-lg text-gray-300 text-sm whitespace-pre-wrap">
                          {displayValue || <span className="text-gray-600 italic">Não respondido</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 border-t border-gray-800 bg-[#111827] flex justify-end">
                <button onClick={closeModal} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
