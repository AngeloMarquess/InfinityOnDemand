'use client';

import React from 'react';
import Head from 'next/head';

export default function InstagramCarousel() {
  return (
    <div className="min-h-screen bg-[#050505] p-12 flex flex-col items-center gap-[700px] pb-[800px] font-sans overflow-x-hidden">
      <div className="text-center max-w-3xl mb-[-500px] relative z-20 bg-[#050505]/80 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00DB79] to-[#4a90e2] mb-4">
          Carrossel Instagram: Infinity Delivery OS
        </h1>
        <p className="text-gray-400 text-lg">
          As imagens abaixo estão configuradas no formato ideal para portrait no Instagram (1080x1350) em alta resolução. 
          Recomendamos abrir esta página no Google Chrome, clicar com o botão direito na imagem desejada, inspecionar, e usar o atalho de captura de nó (Capture Node Screenshot) para extraí-las com perfeição, ou tirar um print screen.
        </p>
        <p className="text-[#00DB79] font-medium mt-4">
          Não esqueça de salvar o logo fornecido como <code className="bg-black text-[#00DB79] px-2 py-1 rounded">public/logo-nova.jpg</code>.
        </p>
      </div>

      <CarouselSlide>
        {/* Logo Layer */}
        <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-full flex justify-center opacity-80 mix-blend-screen">
            {/* Imagem do logo (Placeholder) */}
            <img 
               src="/logo-nova.jpg" 
               alt="Infinity OnDemand" 
               className="w-[300px] h-[300px] object-contain drop-shadow-[0_0_40px_rgba(0,219,121,0.5)]"
               onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
               }}
            />
            <div className="hidden text-center">
              <span className="text-5xl font-bold text-white tracking-widest">INFINITY</span>
              <div className="text-[#00DB79] font-semibold tracking-[0.3em] uppercase mt-2 text-xl">OnDemand</div>
            </div>
        </div>

        {/* Content */}
        <div className="mt-[200px] flex flex-col items-center text-center">
          <div className="px-8 py-3 rounded-full border border-[#00DB79]/30 bg-[#00DB79]/10 text-[#00DB79] text-2xl font-semibold uppercase tracking-widest mb-16 backdrop-blur-md inline-block">
            Chega de amadorismo
          </div>
          
          <h1 className="text-[85px] font-bold leading-[1.05] tracking-tight text-white mb-16 drop-shadow-2xl">
            Transforme o <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">caos</span> do seu delivery em uma operação <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00DB79] to-[#4a90e2]">premium.</span>
          </h1>
          
          <p className="text-[34px] text-gray-300 leading-relaxed max-w-[900px] font-medium opacity-90">
            Conheça a tecnologia SaaS que elimina comandas de papel e automatiza sua logística.
          </p>
        </div>
      </CarouselSlide>

      <CarouselSlide>
        <div className="flex flex-col h-full justify-center">
          <div className="flex items-center gap-6 mb-16">
            <div className="w-[80px] h-[80px] rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white text-4xl shadow-[0_0_30px_rgba(239,68,68,0.4)]">
              TrendingDown
            </div>
            <h2 className="text-[60px] font-bold text-white leading-tight">
              Você perde margem de lucro quando:
            </h2>
          </div>
          
          <div className="space-y-10 mt-8">
            {[
              "Usa comandas de papel que se perdem no pico do movimento.",
              'Sofre com o "colapso do WhatsApp" e linhas congestionadas.',
              "Perde dinheiro com cálculos manuais incorretos de taxas de entrega.",
              'Realiza o "despacho às cegas", sem saber qual rota o motoboy deve otimizar.'
            ].map((text, i) => (
              <div key={i} className="flex gap-8 bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-md transform transition-transform hover:scale-[1.02]">
                <div className="flex-shrink-0 mt-2 flex items-center justify-center w-[50px] h-[50px] rounded-full bg-red-500/20 text-red-400 text-2xl font-bold border border-red-500/30">
                  ✗
                </div>
                <p className="text-[36px] text-gray-200 leading-[1.4] font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </CarouselSlide>

      <CarouselSlide>
        <div className="flex flex-col h-full justify-center">
          <div className="inline-block px-8 py-3 rounded-full bg-[#4a90e2]/10 border border-[#4a90e2]/30 text-[#4a90e2] text-2xl font-semibold uppercase tracking-widest mb-8 self-start">
            Gestão Visual Kanban
          </div>
          
          <h2 className="text-[75px] font-bold text-white leading-tight mb-20 drop-shadow-xl">
            O <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a90e2] to-cyan-400">Cérebro</span> da sua Cozinha.
          </h2>
          
          <div className="grid grid-cols-2 gap-8">
            {[
              { title: "Painel Live", desc: "Fluxo arrastar-e-soltar intuitivo e em tempo real.", icon: "🖱️" },
              { title: "Alerta Sonoro", desc: "Para novos pedidos que já caem 100% formatados.", icon: "🔔" },
              { title: "Dashboard Térmico", desc: "Impressão na chapa em apenas 1 clique.", icon: "🖨️" },
              { title: "Auto-arquivamento", desc: "Após 2h para manter o painel sempre limpo e organizado.", icon: "🧹" }
            ].map((feature, i) => (
              <div key={i} className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-10 rounded-3xl backdrop-blur-md flex flex-col items-start gap-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 transition-opacity"></div>
                <div className="text-[55px] bg-white/10 w-[100px] h-[100px] rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">{feature.icon}</div>
                <div>
                  <h3 className="text-[34px] font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-[26px] text-gray-400 leading-[1.4]">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CarouselSlide>

      <CarouselSlide>
        <div className="flex flex-col h-full justify-center">
          <div className="inline-block px-8 py-3 rounded-full bg-[#00DB79]/10 border border-[#00DB79]/30 text-[#00DB79] text-2xl font-semibold uppercase tracking-widest mb-8 self-start">
            Courier App
          </div>
          
          <h2 className="text-[75px] font-bold text-white leading-tight mb-8 drop-shadow-xl">
            Foco em <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00DB79] to-emerald-400">Roteirização</span> e Precisão.
          </h2>
          <p className="text-[32px] text-gray-300 mb-16 font-medium">Logística inteligente e app do entregador de ponta a ponta.</p>
          
          <div className="space-y-8 flex-1">
            {[
              { title: "Atribuição Inteligente", desc: "Bloqueio de saída do estabelecimento sem um entregador vinculado.", icon: "🛣️", color: "text-[#00DB79]" },
              { title: "Navegação Nativa", desc: "Botões que abrem a rota instantaneamente no Google Maps ou Waze.", icon: "🗺️", color: "text-blue-400" },
              { title: "Magia de Comunicação", desc: "Botão 'Avisar no WhatsApp' para notificar o cliente com um toque: 'Estou chegando!'.", icon: "💬", color: "text-green-400" }
            ].map((feature, i) => (
              <div key={i} className="flex gap-8 items-center bg-[#0a0f12] border border-white/10 p-10 rounded-[32px] overflow-hidden relative">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#00DB79] to-[#4a90e2]"></div>
                <div className="text-[60px]">{feature.icon}</div>
                <div>
                  <h3 className={`text-[36px] font-bold mb-3 ${feature.color}`}>{feature.title}</h3>
                  <p className="text-[28px] text-gray-300 leading-[1.4] opacity-90">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CarouselSlide>

      <CarouselSlide>
        <div className="flex flex-col h-full justify-center">
          <div className="inline-block px-8 py-3 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-2xl font-semibold uppercase tracking-widest mb-8 self-start">
            Front-End PWA
          </div>
          
          <h2 className="text-[65px] font-bold text-white leading-tight mb-16 drop-shadow-xl">
            Checkout <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Sem Fricção</span> e "Sensação de App"
          </h2>
          
          <div className="grid grid-cols-1 gap-8 w-full">
            {[
              { title: "Side-Drawer Inteligente", desc: "O carrinho desliza lateralmente sem interromper a navegação no cardápio.", icon: "🛍️", color: "from-purple-500/20" },
              { title: "Busca Ultra-Rápida", desc: "Filtros e pesquisa em tempo real para encontrar itens em milissegundos.", icon: "⚡", color: "from-yellow-500/20" },
              { title: "Rastreio ao Vivo", desc: "Acompanhamento de status (Aguardando → Preparo → Saiu para Entrega).", icon: "📍", color: "from-[#00DB79]/20" },
              { title: "Cálculo Infalível", desc: "Integração instantânea de CEP para garantir a taxa exata e proteger suas margens.", icon: "💰", color: "from-blue-500/20" }
            ].map((feature, i) => (
              <div key={i} className={`bg-gradient-to-r ${feature.color} to-transparent border border-white/10 p-10 rounded-3xl flex items-center gap-8`}>
                <div className="w-[90px] h-[90px] flex-shrink-0 bg-black/50 rounded-2xl flex items-center justify-center text-[45px] border border-white/5 shadow-inner">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-[34px] font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-[26px] text-gray-300 leading-[1.4]">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CarouselSlide>

      <CarouselSlide>
        <div className="flex flex-col h-full bg-[radial-gradient(ellipse_at_center,rgba(0,219,121,0.15)_0%,rgba(0,0,0,0)_70%)] rounded-[40px]">
          
          <div className="flex-1 flex flex-col items-center justify-center text-center mt-20">
            <h2 className="text-[85px] font-bold text-white leading-[1.1] mb-12 max-w-[900px]">
              Assuma o <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00DB79] to-[#4a90e2]">controle</span> da sua operação.
            </h2>
            <p className="text-[38px] text-gray-300 font-medium mb-20 max-w-[800px] leading-snug">
              Pare de apagar incêndios na chapa. Escale seu delivery hoje.
            </p>

            <div className="bg-gradient-to-r from-[#00DB79] to-[#00bf68] p-1 rounded-[32px] shadow-[0_0_50px_rgba(0,219,121,0.4)] mb-16 transform transition hover:scale-105 cursor-pointer">
              <div className="bg-[#050B08] rounded-[28px] px-16 py-8 flex flex-col items-center gap-4 text-center">
                 <span className="text-[32px] font-bold text-white tracking-wide uppercase">Agende uma demonstração</span>
                 <span className="text-[40px] font-extrabold text-[#00DB79]">Link na Bio</span>
              </div>
            </div>

            <div className="flex items-center gap-6 bg-white/5 px-10 py-6 rounded-full border border-white/10 backdrop-blur-md">
              <span className="text-4xl">💬</span>
              <span className="text-[32px] text-white font-semibold">WhatsApp: <span className="text-[#00DB79]">(81) 97102-7939</span></span>
            </div>
            <div className="mt-6">
              <span className="text-[28px] text-gray-400 font-medium">Falar direto com <b>Angelo Marques</b></span>
            </div>
          </div>

          <div className="mt-auto pt-10 border-t border-white/10 flex flex-col items-center pb-8 opacity-80">
             <div className="flex items-center gap-4 mb-4">
                <span className="text-yellow-400 text-4xl">🌟</span>
                <span className="text-3xl font-bold text-white">Case de Sucesso Comprovado</span>
             </div>
             <p className="text-[24px] text-gray-400 max-w-[700px] text-center">
               Tecnologia auditada e aprovada pela <b className="text-white">Dom Black Delivery</b>. Reforçando a autoridade e performance da nossa solução.
             </p>
          </div>
        </div>
      </CarouselSlide>

    </div>
  );
}

const CarouselSlide = ({ children, bgImage }: { children: React.ReactNode, bgImage?: string }) => {
  return (
    <div 
      className="relative overflow-hidden bg-[#0A0D10] text-white flex flex-col border border-white/10 rounded-[40px] shadow-2xl flex-shrink-0"
      style={{ 
        width: '1080px', 
        height: '1350px', 
        transform: 'scale(0.45)', 
        transformOrigin: 'top center', 
        marginBottom: '-740px' 
      }}
    >
      {/* Dynamic Background Noise / Pattern */}
      <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      
      {/* Decorative gradients */}
      <div className="absolute -top-[300px] -right-[300px] w-[800px] h-[800px] rounded-full bg-[#00DB79] opacity-[0.07] blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-[300px] -left-[300px] w-[800px] h-[800px] rounded-full bg-[#4a90e2] opacity-[0.05] blur-[120px] pointer-events-none"></div>

      {bgImage && (
         <div className="absolute inset-0 z-0">
             <img src={bgImage} className="w-full h-full object-cover opacity-20" alt="background pattern" />
             <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D10]/50 to-[#0A0D10]"></div>
         </div>
      )}

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full p-[100px] flex flex-col box-border">
        {children}
      </div>
      
      {/* Bottom subtle branding */}
      <div className="absolute bottom-[40px] left-0 right-0 flex justify-center items-center gap-4 opacity-30 z-20">
         <span className="w-12 h-[2px] bg-white rounded-full"></span>
         <span className="text-2xl font-bold tracking-[0.2em]">INFINITY ONDEMAND</span>
         <span className="w-12 h-[2px] bg-white rounded-full"></span>
      </div>
    </div>
  );
};
