'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Palette, LayoutTemplate, Instagram, Sparkles, Video, FileText, Lock } from 'lucide-react';

const options = [
  { id: 'logo', title: 'Logo', desc: 'Criação de logotipo e marca', icon: Palette, color: 'text-green-500' },
  { id: 'landing-page', title: 'Landing Page', desc: 'Página de conversão/vendas', icon: LayoutTemplate, color: 'text-green-500' },
  { id: 'social-media', title: 'Social Media / Criativos', desc: 'Posts, stories e anúncios', icon: Instagram, color: 'text-green-500' },
  { id: 'branding', title: 'Branding / Identidade Visual', desc: 'Identidade visual completa', icon: Sparkles, color: 'text-green-500' },
  { id: 'video-motion', title: 'Vídeo / Motion', desc: 'Vídeos e animações', icon: Video, color: 'text-green-500' },
  { id: 'outro', title: 'Outro', desc: 'Outro tipo de projeto', icon: FileText, color: 'text-green-500' }
];

export default function BriefingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'infinity123') { // Simple hardcoded password for clients/team
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-white p-4">
        <div className="max-w-md w-full bg-[#111827] p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-[#1E293B] rounded-full">
              <Lock className="w-8 h-8 text-[#00DB79]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Acesso Restrito</h1>
          <p className="text-gray-400 text-center mb-8">Insira a senha fornecida para acessar o painel de briefing.</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <input
                type="password"
                placeholder="Senha de acesso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1E293B] text-white rounded-lg p-4 border border-gray-700 outline-none focus:border-[#00DB79] transition-colors"
              />
              {error && <p className="text-red-400 text-sm mt-2">Senha incorreta. Tente novamente.</p>}
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#00DF81] to-[#00AAFF] text-white font-bold py-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Inicie seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00DF81] to-[#00AAFF]">Briefing</span></h1>
        <p className="text-gray-400 text-center mb-12">Selecione o tipo de projeto que deseja iniciar detalhando os requisitos.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <Link href={`/Briefing/${option.id}`} key={option.id}>
                <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 flex items-start gap-4 hover:border-[#00DB79] hover:shadow-[0_0_20px_rgba(0,219,121,0.1)] transition-all cursor-pointer group">
                  <div className="p-3 bg-[#1E293B] rounded-lg group-hover:bg-[#00DB79]/10 transition-colors">
                    <Icon className="w-6 h-6 text-[#00DB79]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{option.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{option.desc}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}
