'use client';

import React, { useState, useEffect, useCallback } from 'react';
import CampanhasTab from './CampanhasTab';
import EvolucaoTab from './EvolucaoTab';
import AnalyticsLiveTab from './AnalyticsLiveTab';
import ConfiguracoesTab from './ConfiguracoesTab';
import AgentTab from './AgentTab';
import FlashSDRTab from './FlashSDRTab';

/* ─────────── DATA ─────────── */
const profileData = {
  username: '@infinityondemand',
  name: 'Infinity on Demand | Presença Digital com IA',
  bio: '🚀 Performance real com IA para escalar pequenos negócios\n📈 +30 empresas atendidas com tráfego estratégico\n📲 Agende sua Consultoria Gratuita',
  followers: 555,
  following: 527,
  posts: 70,
  engagementRate: 0.66,
  avgLikes: 3.63,
  avgComments: 0.03,
  totalLikes: 109,
  totalComments: 1,
  profilePicture: 'https://scontent.ffor39-1.fna.fbcdn.net/v/t51.82787-15/648541428_17928126726239249_8964040198016592073_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=7d201b&_nc_ohc=GlDNfc6U3WAQ7kNvwG1btWh&_nc_zt=23&_nc_ht=scontent.ffor39-1.fna&edm=AGaHXAAEAAAA&oh=00_Afyhq756RopCOT8o8Eel4rC22ijjr1P5QxIkkt2IhzRiaw&oe=69C112FB',
};

const topPosts = [
  { rank: 1, likes: 9, comments: 0, rate: '1.62%', type: 'IMAGE', date: '25/Mar/25', link: 'https://www.instagram.com/p/DHo7ASZuaBE/', theme: 'Mídias sociais – estratégia completa' },
  { rank: 2, likes: 9, comments: 0, rate: '1.62%', type: 'VIDEO', date: '09/Mar/25', link: 'https://www.instagram.com/reel/DG9rQjVuPh8/', theme: 'Consultoria gratuita – site performance' },
  { rank: 3, likes: 8, comments: 1, rate: '1.62%', type: 'IMAGE', date: '30/Mai/25', link: 'https://www.instagram.com/p/DKSY_Giu2Lk/', theme: 'Placa 100K – prova social' },
  { rank: 4, likes: 8, comments: 0, rate: '1.44%', type: 'VIDEO', date: '19/Mai/25', link: 'https://www.instagram.com/reel/DJ2LTNQupXV/', theme: 'E-commerce conversão (tom pessoal)' },
  { rank: 5, likes: 7, comments: 0, rate: '1.26%', type: 'VIDEO', date: '12/Mar/25', link: 'https://www.instagram.com/reel/DHFcQkmOkJM/', theme: 'E-commerce + tráfego pago' },
  { rank: 6, likes: 5, comments: 0, rate: '0.90%', type: 'VIDEO', date: '20/Mai/25', link: 'https://www.instagram.com/reel/DJ5OL7VOxRt/', theme: 'Tráfego pago – conversão' },
  { rank: 7, likes: 5, comments: 0, rate: '0.90%', type: 'CAROUSEL', date: '13/Abr/25', link: 'https://www.instagram.com/p/DIZqMXCuvuV/', theme: 'Pack mensagens WhatsApp' },
  { rank: 8, likes: 5, comments: 0, rate: '0.90%', type: 'IMAGE', date: '28/Mar/25', link: 'https://www.instagram.com/p/DHv_8HjOe3h/', theme: 'Leads qualificados' },
  { rank: 9, likes: 4, comments: 0, rate: '0.72%', type: 'VIDEO', date: '21/Mar/25', link: 'https://www.instagram.com/reel/DHcMhJsuuNN/', theme: 'Consultoria gratuita Calendly' },
  { rank: 10, likes: 4, comments: 0, rate: '0.72%', type: 'VIDEO', date: '14/Set/25', link: 'https://www.instagram.com/reel/DOkP5TUDjiQ/', theme: 'Revolução Digital Lançamento' },
];

const formatComparison = [
  { type: 'IMAGE', count: 7, totalLikes: 31, avg: 4.43, rate: '0.80%', color: '#8B5CF6', icon: '🖼️' },
  { type: 'VIDEO (Reels)', count: 20, totalLikes: 69, avg: 3.45, rate: '0.62%', color: '#EC4899', icon: '🎬' },
  { type: 'CAROUSEL', count: 3, totalLikes: 9, avg: 3.0, rate: '0.54%', color: '#06B6D4', icon: '📑' },
];

const dayAnalysis = [
  { day: 'Seg', posts: 2, avg: 3.0 },
  { day: 'Ter', posts: 3, avg: 3.3 },
  { day: 'Qua', posts: 3, avg: 5.7 },
  { day: 'Qui', posts: 5, avg: 4.0 },
  { day: 'Sex', posts: 3, avg: 3.3 },
  { day: 'Sáb', posts: 5, avg: 3.2 },
  { day: 'Dom', posts: 3, avg: 2.7 },
];

const hourAnalysis = [
  { range: '00h – 06h', posts: 8, avg: 2.4, label: 'Madrugada' },
  { range: '06h – 12h', posts: 3, avg: 6.3, label: 'Manhã' },
  { range: '12h – 18h', posts: 8, avg: 3.6, label: 'Tarde' },
  { range: '18h – 00h', posts: 11, avg: 4.0, label: 'Noite' },
];

const timeline = [
  { period: 'Mar/2025', posts: 10, status: 'active' },
  { period: 'Abr/2025', posts: 2, status: 'low' },
  { period: 'Mai/2025', posts: 10, status: 'active' },
  { period: 'Jun/2025', posts: 0, status: 'gap' },
  { period: 'Jul/2025', posts: 0, status: 'gap' },
  { period: 'Ago/2025', posts: 0, status: 'gap' },
  { period: 'Set/2025', posts: 1, status: 'low' },
  { period: 'Out/2025', posts: 0, status: 'gap' },
  { period: 'Nov/2025', posts: 0, status: 'gap' },
  { period: 'Dez/2025', posts: 0, status: 'gap' },
  { period: 'Jan/2026', posts: 0, status: 'gap' },
  { period: 'Fev/2026', posts: 0, status: 'gap' },
  { period: 'Mar/2026', posts: 7, status: 'active' },
];

const recommendations = [
  { action: 'Postar diariamente (5x/semana mínimo)', priority: 'Crítica', impact: 'Recuperar distribuição orgânica', icon: '📅', color: '#EF4444' },
  { action: '2-3 stories/dia (bastidores, enquetes)', priority: 'Crítica', impact: 'Manter presença no topo do feed', icon: '📱', color: '#EF4444' },
  { action: 'CTA claro em todo post ("Comente X", "Salve")', priority: 'Alta', impact: '+500% comentários', icon: '💬', color: '#F59E0B' },
  { action: 'Publicar entre 8h-11h ou 18h-21h', priority: 'Alta', impact: '+50% alcance potencial', icon: '⏰', color: '#F59E0B' },
  { action: '1 carrossel educativo premium por semana', priority: 'Alta', impact: 'Aumentar salvamentos', icon: '📊', color: '#F59E0B' },
  { action: '1 post de prova social por semana', priority: 'Alta', impact: 'Construir autoridade', icon: '🏆', color: '#F59E0B' },
  { action: 'Reels com gancho nos 3 primeiros segundos', priority: 'Média', impact: 'Melhorar retenção', icon: '🎯', color: '#10B981' },
  { action: 'Parar conteúdo duplicado', priority: 'Crítica', impact: 'Evitar penalização', icon: '🚫', color: '#EF4444' },
];

const goals = [
  { metric: 'Seguidores', current: '555', target: '750-800', icon: '👥' },
  { metric: 'Taxa de Engajamento', current: '0.66%', target: '2.5%+', icon: '📈' },
  { metric: 'Comentários/post', current: '0.03', target: '2-3', icon: '💬' },
  { metric: 'Stories/dia', current: '0', target: '2-3', icon: '📱' },
  { metric: 'Frequência', current: 'Irregular', target: '5x/semana', icon: '📅' },
];

const campaignCalendar = [
  {
    day: 'Segunda',
    pillar: 'Provocação',
    pillarColor: '#EF4444',
    format: 'Carrossel (5 slides)',
    title: '5 sinais de que seu delivery está te fazendo PERDER dinheiro',
    image: '/campaign/post-segunda.png',
    storyCTA: 'Enquete: "Você ainda usa comanda de papel? SIM / NÃO"',
    caption: `Se você se identificar com 3 desses sinais,\nvocê está literalmente queimando dinheiro todo mês. 🔥\n\nSlide 2: Suas comandas são de papel (e somem no rush)\nSlide 3: Você calcula taxa de entrega "no olho"\nSlide 4: Seu WhatsApp trava toda sexta à noite\nSlide 5: Você não sabe quanto lucrou ontem\n\nA verdade? Se seu delivery depende de papel e improviso,\nvocê não tem um negócio — tem um incêndio controlado.\n\nQuer mudar isso? Link na bio. Demonstração gratuita.\n\nComente "EU" se você se identificou com pelo menos 2 ⬇️\n\n#delivery #gestaodelivery #foodtech #restaurantes\n#empreendedorismo #saas #infinityondemand`,
  },
  {
    day: 'Terça',
    pillar: 'Educação',
    pillarColor: '#4a90e2',
    format: 'Reel (30-45 seg)',
    title: '3 métricas que todo dono de delivery PRECISA acompanhar',
    image: '/campaign/post-terca.png',
    storyCTA: 'Caixa de perguntas: "Qual a MAIOR dificuldade do seu delivery?"',
    caption: `Se você não mede, você não gerencia.\nE se você não gerencia, você perde dinheiro.\n\nSão só 3 números que separam um delivery amador\nde uma operação profissional:\n\n1️⃣ Ticket médio por pedido\n2️⃣ Tempo médio de produção + entrega\n3️⃣ Taxa de recompra (quantos clientes voltam?)\n\nSe você não sabe esses 3 de cabeça agora,\ncomente "MÉTRICAS" que eu mando um checklist\ncompleto no seu DM. 📊\n\n#gestaodelivery #metricas #foodtech #dados\n#infinityondemand #delivery #pizzaria`,
  },
  {
    day: 'Quarta ⭐',
    pillar: 'Autoridade',
    pillarColor: '#F59E0B',
    format: 'Carrossel premium (8-10 slides)',
    title: 'Como a Dom Black saiu do caos para faturar com nosso sistema',
    image: '/campaign/post-quarta.png',
    storyCTA: 'Before/After do Kanban + "Quer ver ao vivo? Responda 🙋‍♂️"',
    caption: `Quando o @domblack.delivery nos procurou,\na operação era um caos:\n\n❌ Comandas se perdendo\n❌ WhatsApp lotado de reclamação\n❌ Motoboys sem rota definida\n❌ Zero controle financeiro\n\nAí instalamos o Infinity Delivery OS.\n\nO que mudou? Arraste para ver 👉\n\n✅ Painel Kanban substituiu o papel\n✅ App do entregador com rota automática\n✅ Cliente rastreia pedido em tempo real\n✅ Dashboard financeiro integrado\n\nResultado? Operação rodando com METADE\nda dor de cabeça e o DOBRO do controle.\n\nQuer o mesmo para o seu delivery?\nLink na bio → Demonstração gratuita.\n\nSalve este post para consultar depois 📌\n\n#casesdesucesso #delivery #foodtech #saas\n#infinityondemand #tecnologia #gestao`,
  },
  {
    day: 'Quinta',
    pillar: 'Educação',
    pillarColor: '#4a90e2',
    format: 'Imagem estática (design forte)',
    title: 'O erro nº1 que donos de pizzaria cometem no delivery',
    image: '/campaign/post-quinta.png',
    storyCTA: 'Quiz: "Qual a melhor hora para postar no delivery?"',
    caption: `O erro nº1?\n\nTratar o delivery como um "extra"\ne não como uma operação completa.\n\nDelivery não é só "receber pedido e mandar motoboy".\nÉ logística. É tecnologia. É experiência do cliente.\n\nSe você trata delivery como algo secundário,\nele vai te dar resultados secundários.\n\nA Infinity Delivery OS transforma esse "extra"\nnuma máquina de faturamento.\n\nConcorda? Comente 🔥\nDiscorda? Me conta por quê nos comentários ⬇️\n\n#delivery #pizzaria #restaurante #gestao\n#empreendedorismo #infinityondemand`,
  },
  {
    day: 'Sexta',
    pillar: 'Oferta',
    pillarColor: '#00DB79',
    format: 'Reel (15-20 seg)',
    title: '20 segundos que vão mudar sua visão sobre delivery',
    image: '/campaign/post-sexta.png',
    storyCTA: 'Poll: "Você paga quanto de taxa pro iFood por mês? 💸"',
    caption: `Isso aqui é o que seus clientes veem\nquando pedem pela sua plataforma própria.\n\nSem iFood. Sem taxa abusiva.\n100% seu.\n\n→ Cardápio responsivo como app nativo\n→ Carrinho sem interromper navegação\n→ Rastreio ao vivo do pedido\n→ Cálculo automático de taxa por CEP\n\nIsso não é futuro. É hoje.\nE custa menos do que você paga de taxa pro iFood.\n\nDM com "DEMO" → demonstração gratuita.\n\n#delivery #foodtech #saas #plataformapropria\n#infinityondemand #ecommerce #restaurante`,
  },
];

const creatives: { category: string; items: { title: string; image: string; images?: string[]; caption: string }[] }[] = [
  { category: 'Feed', items: [
    { title: 'Segunda — Provocação (Carrossel 5 slides)', image: '/campaign/post-segunda.png', images: [
      '/campaign/post-segunda.png',
      '/campaign/carousel-seg-slide2.png',
      '/campaign/carousel-seg-slide3.png',
      '/campaign/carousel-seg-slide4.png',
      '/campaign/carousel-seg-slide5.png',
    ], caption: campaignCalendar[0].caption },
    { title: 'Terça — Educação (Carrossel 4 slides)', image: '/campaign/post-terca.png', images: [
      '/campaign/post-terca.png',
      '/campaign/carousel-ter-slide2.png',
      '/campaign/carousel-ter-slide3.png',
      '/campaign/carousel-ter-slide4.png',
    ], caption: campaignCalendar[1].caption },
    { title: 'Quarta — Autoridade ⭐ (Carrossel 8 slides)', image: '/campaign/post-quarta.png', images: [
      '/campaign/post-quarta.png',
      '/campaign/carousel-qua-slide2.png',
      '/campaign/carousel-qua-slide3.png',
      '/campaign/carousel-qua-slide4.png',
      '/campaign/carousel-qua-slide5.png',
      '/campaign/carousel-qua-slide6.png',
      '/campaign/carousel-qua-slide7.png',
      '/campaign/carousel-qua-slide8.png',
    ], caption: campaignCalendar[2].caption },
    { title: 'Quinta — Educação', image: '/campaign/post-quinta.png', caption: campaignCalendar[3].caption },
    { title: 'Sexta — Oferta', image: '/campaign/post-sexta.png', caption: campaignCalendar[4].caption },
  ]},
  { category: 'Stories — Segunda (Provocação)', items: [
    { title: '☀️ 8h — Bom Dia', image: '/campaign/story-8h-bomdia.png', caption: 'Story matinal motivacional.\nFormato: Foto real do setup + texto overlay\n\nTexto: "Bom dia! Mais um dia construindo o futuro do delivery 🚀"\n\nSticker: Localização + Horário\nObjetivo: Humanizar a marca' },
    { title: '🗳️ 12h — Enquete Provocação', image: '/campaign/story-12h-enquete.png', caption: 'Story interativo com enquete.\n\nTexto: "Qual a MAIOR dificuldade do seu delivery?"\n\nOpções:\n📄 Comandas de papel\n📱 WhatsApp travando\n🛵 Organizar motoboys\n💰 Controle financeiro\n\nSticker: Enquete (4 opções)\nObjetivo: Coletar dados + gerar interação' },
    { title: '💡 15h — Dica Taxa por CEP', image: '/campaign/story-15h-dica.png', caption: 'Story educativo.\n\nTexto: "Sabia que calcular taxa por CEP pode AUMENTAR sua margem em até 15%?"\n\nSticker: Caixa de perguntas "Quer saber como?"\nObjetivo: Educar + gerar curiosidade' },
    { title: '🔁 18h — Repost do Feed', image: '/campaign/story-18h-repost.png', caption: 'Repostar carrossel "5 sinais" no story.\n\nTexto: "Acabou de sair no feed! Confira 👇"\nSticker: Link para o post' },
    { title: '🌙 21h — Bastidores', image: '/campaign/story-21h-bastidor.png', caption: 'Bastidor noturno.\n\nTexto: "É assim que nasce a tecnologia que transforma deliverys..."\nSticker: Música ambiente' },
    { title: '🗳️ Extra — Enquete Comanda', image: '/campaign/story-enquete.png', caption: 'Enquete SIM/NÃO: "Você ainda usa comanda de papel no seu delivery?"\n\nPostar junto com o carrossel de segunda.' },
  ]},
  { category: 'Stories — Terça (Educação)', items: [
    { title: '☀️ 8h — Bom Dia', image: '/campaign/story-8h-bomdia.png', caption: 'Story matinal.\n\nTexto: "Terça de dados! Hoje vamos falar de métricas 📊"\nSticker: Localização + Horário' },
    { title: '🗳️ 12h — Enquete Ticket Médio', image: '/campaign/story-ter-12h.png', caption: 'Story interativo.\n\nTexto: "Você sabe seu TICKET MÉDIO de cabeça?"\n\nOpções: SIM ✅ / NÃO ❌\n\nSubtexto: "Se não sabe, está precificando no escuro..."\nSticker: Enquete\nObjetivo: Mostrar a importância da métrica 1' },
    { title: '💡 15h — Dica Ticket Médio', image: '/campaign/story-ter-15h.png', caption: 'Story educativo.\n\nTexto: "Como calcular seu TICKET MÉDIO:"\n\n1️⃣ Some o faturamento do mês\n2️⃣ Divida pelo total de pedidos\n3️⃣ Se < R$35, você está perdendo margem\n\nCTA: "Arraste para cima → Checklist gratuito"' },
    { title: '🔁 18h — Repost do Feed', image: '/campaign/story-18h-repost.png', caption: 'Repostar o post de terça "3 métricas".\n\nTexto: "Se você não viu ainda, corre! 👆"\nSticker: Link para o post' },
    { title: '🌙 21h — Bastidores', image: '/campaign/story-21h-bastidor.png', caption: 'Bastidor noturno.\n\nTexto: "Analisando métricas de clientes antes de dormir 😅"\nSticker: Música ambiente' },
  ]},
  { category: 'Stories — Quarta (Autoridade)', items: [
    { title: '☀️ 8h — Bom Dia', image: '/campaign/story-8h-bomdia.png', caption: 'Story matinal.\n\nTexto: "Quarta de resultado! Hoje vocês vão ver um case REAL ⭐"\nSticker: Countdown para o post do feed' },
    { title: '🗳️ 12h — Enquete Sistema Próprio', image: '/campaign/story-qua-12h.png', caption: 'Story interativo.\n\nTexto: "Seu delivery tem SISTEMA próprio ou depende de app de terceiros?"\n\nOpções:\n🏠 Sistema próprio\n📱 iFood / Rappi\n\nSubtexto: "Veja o que mudou para nosso cliente →"\nSticker: Enquete' },
    { title: '💡 15h — Bastidor do Sistema', image: '/campaign/story-qua-15h.png', caption: 'Story de bastidor real.\n\nTexto: "Isso aqui é REAL. É o painel do @domblack.delivery"\nSubtexto: "Cada card é um pedido em tempo real"\n\nMostrar screenshot real do Kanban\nObjetivo: Prova social + autoridade' },
    { title: '🔁 18h — Repost do Feed', image: '/campaign/story-18h-repost.png', caption: 'Repostar o case Dom Black.\n\nTexto: "O case mais comentado da semana! 🔥"\nSticker: Link para o post' },
    { title: '🌙 21h — Bastidores', image: '/campaign/story-21h-bastidor.png', caption: 'Bastidor noturno.\n\nTexto: "Reunião de onboarding com novo cliente finalizada ✅"\nSticker: Música ambiente' },
  ]},
  { category: 'Stories — Quinta (Educação)', items: [
    { title: '☀️ 8h — Bom Dia', image: '/campaign/story-8h-bomdia.png', caption: 'Story matinal.\n\nTexto: "Quinta de aprendizado! Hoje vamos falar de ERROS que custam caro 💸"\nSticker: Localização + Horário' },
    { title: '🗳️ 12h — Enquete Erros', image: '/campaign/story-qui-12h.png', caption: 'Story interativo.\n\nTexto: "Qual ERRO você mais comete no delivery?"\n\nOpções:\n📋 Não registrar pedidos\n⏱️ Ignorar tempo de entrega\n💰 Não acompanhar custos\n🛵 Despachar sem rota\n\nSticker: Quiz (4 opções)\nObjetivo: Educar sobre dores operacionais' },
    { title: '💡 15h — Dica Despacho', image: '/campaign/story-qui-15h.png', caption: 'Story educativo.\n\nTexto: "O ERRO Nº1 que 80%% dos deliverys cometem:"\n\n❌ DESPACHAR ÀS CEGAS\nSem rota, sem rastreio, sem previsão.\n\n✅ Com o app do entregador:\nRota automática + rastreio ao vivo\n\nObjetivo: Mostrar a solução para a dor' },
    { title: '🔁 18h — Repost do Feed', image: '/campaign/story-18h-repost.png', caption: 'Repostar post "O erro nº1 que donos de pizzaria cometem".\n\nTexto: "Você comete esse erro? 🤔"\nSticker: Link para o post' },
    { title: '🌙 21h — Bastidores', image: '/campaign/story-21h-bastidor.png', caption: 'Bastidor noturno.\n\nTexto: "Testando nova feature do app do entregador 🛵"\nSticker: Música ambiente' },
  ]},
  { category: 'Stories — Sexta (Oferta)', items: [
    { title: '☀️ 8h — Bom Dia', image: '/campaign/story-8h-bomdia.png', caption: 'Story matinal.\n\nTexto: "SEXTOU! E com oferta especial 🔥"\nSticker: Countdown "Oferta expira hoje!"' },
    { title: '🗳️ 12h — Enquete Comissão', image: '/campaign/story-sex-12h.png', caption: 'Story interativo.\n\nTexto: "Quanto de COMISSÃO você paga pro iFood por mês?"\n\nOpções:\nAté R$ 500\nR$ 500-1000\nR$ 1000-2000\nMais de R$ 2000 😱\n\nSubtexto: "E se esse dinheiro ficasse no SEU bolso?"\nSticker: Enquete' },
    { title: '⏰ 15h — Countdown Oferta', image: '/campaign/story-sex-15h.png', caption: 'Story de urgência.\n\nTexto: "OFERTA EXPIRA EM 24H"\nSubtexto: "Demonstração GRATUITA + Setup completo SEM custo"\n\nCTA: "TOQUE AQUI → Link na bio"\n"Vagas limitadas para esta semana"\n\nSticker: Countdown + Link' },
    { title: '🔁 18h — Repost do Feed', image: '/campaign/story-18h-repost.png', caption: 'Repostar oferta do feed.\n\nTexto: "ÚLTIMA CHANCE! Link na bio 🔥"\nSticker: Link + Countdown' },
    { title: '🌙 21h — Bastidores', image: '/campaign/story-21h-bastidor.png', caption: 'Bastidor noturno.\n\nTexto: "Semana intensa! Descansem bem, segunda tem mais 💪"\nSticker: Música ambiente' },
  ]},
  { category: 'Anúncios Pagos', items: [
    { title: 'Topo de Funil — Alcance', image: '/campaign/ad-topo.png', caption: 'Campanha: Alcance / Reconhecimento\nPúblico: Donos de restaurantes, pizzarias, deliverys\nInteresses: iFood, Rappi, Gestão de restaurantes\nOrçamento: R$ 15/dia\nCTA: "Saiba Mais" → Link na bio' },
    { title: 'Retargeting — Geração de Leads', image: '/campaign/ad-retargeting.png', caption: 'Campanha: Leads / Mensagens\nPúblico: Retargeting de quem interagiu nos últimos 30 dias\nOrçamento: R$ 15-20/dia\nCopy: "Seu delivery merece tecnologia de verdade.\nAgende uma demonstração gratuita →"\nCTA: "Enviar mensagem" → WhatsApp' },
  ]},
];
/* ─────────── COMPONENTS ─────────── */

const MetricCard = ({ title, value, subtitle, icon, trend, color = '#00DB79' }: {
  title: string; value: string | number; subtitle?: string; icon: string; trend?: string; color?: string;
}) => (
  <div style={{
    background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  }}>
    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: color, opacity: 0.05, filter: 'blur(30px)' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '28px' }}>{icon}</span>
      {trend && <span style={{ fontSize: '13px', color: trend.startsWith('+') ? '#10B981' : '#EF4444', fontWeight: 600, backgroundColor: trend.startsWith('+') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '4px 10px', borderRadius: '20px' }}>{trend}</span>}
    </div>
    <div style={{ fontSize: '36px', fontWeight: 700, color: '#fff', letterSpacing: '-1px' }}>{value}</div>
    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{title}</div>
    {subtitle && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{subtitle}</div>}
  </div>
);

const SectionTitle = ({ title, subtitle, icon }: { title: string; subtitle?: string; icon: string }) => (
  <div style={{ marginBottom: '32px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
      <span style={{ fontSize: '28px' }}>{icon}</span>
      <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>{title}</h2>
    </div>
    {subtitle && <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', marginLeft: '40px' }}>{subtitle}</p>}
  </div>
);

/* ─────────── PAGE ─────────── */

export default function RelatoriosInfinity() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'timing' | 'actions' | 'campaign' | 'creatives' | 'agenda' | 'campanhas_ads' | 'evolucao' | 'agent' | 'config' | 'sdr'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [carouselSlides, setCarouselSlides] = useState<Record<string, number>>({});
  const [scheduleStatus, setScheduleStatus] = useState<Record<string, { status: 'idle' | 'loading' | 'success' | 'error'; message?: string }>>({
    'seg': { status: 'idle' }, 'ter': { status: 'idle' }, 'qua': { status: 'idle' }, 'qui': { status: 'idle' }, 'sex': { status: 'idle' },
  });
  const [supabaseImageMap, setSupabaseImageMap] = useState<Record<string, string>>({});
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [creativeStatuses, setCreativeStatuses] = useState<Record<string, { status: string; postedAt: string | null }>>({});
  const [liveStoryCount, setLiveStoryCount] = useState(0);
  const [liveFollowers, setLiveFollowers] = useState(555);

  // Check auth on mount
  useEffect(() => {
    const session = localStorage.getItem('analytics_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.token && parsed.user?.role) {
          setIsAuthenticated(true);
        }
      } catch {
        localStorage.removeItem('analytics_session');
      }
    }
    setAuthLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/analytics-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('analytics_session', JSON.stringify(data));
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || 'Credenciais inválidas');
      }
    } catch {
      setLoginError('Erro de conexão. Tente novamente.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('analytics_session');
    setIsAuthenticated(false);
    setLoginEmail('');
    setLoginPassword('');
  };

  // Carregar imagens do Supabase Storage
  const loadImagesFromSupabase = useCallback(async () => {
    try {
      const res = await fetch('/api/storage/upload');
      const result = await res.json();
      if (result.images && Array.isArray(result.images)) {
        const map: Record<string, string> = {};
        for (const img of result.images) {
          map[img.name] = img.url;
        }
        setSupabaseImageMap(map);
        if (result.count > 0) setUploadStatus('done');
      }
    } catch {
      console.warn('Could not load images from Supabase Storage');
    }
  }, []);

  // Carregar status do Supabase ao montar
  const loadPostsFromSupabase = useCallback(async () => {
    try {
      const res = await fetch('/api/posts');
      const result = await res.json();
      if (result.posts && Array.isArray(result.posts)) {
        const newStatus: Record<string, { status: 'idle' | 'loading' | 'success' | 'error'; message?: string }> = {
          seg: { status: 'idle' }, ter: { status: 'idle' }, qua: { status: 'idle' }, qui: { status: 'idle' }, sex: { status: 'idle' },
        };
        for (const post of result.posts) {
          if (post.day_key && newStatus[post.day_key]) {
            if (post.status === 'published' || post.status === 'scheduled') {
              newStatus[post.day_key] = { status: 'success', message: post.status === 'scheduled'
                ? `Agendado para ${new Date(post.scheduled_time).toLocaleString('pt-BR')}`
                : 'Publicado com sucesso!' };
            } else if (post.status === 'error') {
              newStatus[post.day_key] = { status: 'error', message: post.error_message || 'Erro desconhecido' };
            } else if (post.status === 'processing') {
              newStatus[post.day_key] = { status: 'loading', message: 'Processando...' };
            }
          }
        }
        setScheduleStatus(newStatus);
      }
    } catch {
      console.warn('Could not load posts from Supabase');
    }
  }, []);

  // Carregar status dos criativos
  const loadCreativeStatuses = useCallback(async () => {
    try {
      const res = await fetch('/api/creative-status');
      const data = await res.json();
      if (data.statuses) setCreativeStatuses(data.statuses);
    } catch {
      console.warn('Could not load creative statuses');
    }
  }, []);

  // Carregar dados live do Instagram
  const loadLiveInstagramData = useCallback(async () => {
    try {
      const res = await fetch('/api/instagram/analytics');
      const data = await res.json();
      if (data.stories) setLiveStoryCount(data.stories.length);
      if (data.profile?.followers_count) setLiveFollowers(data.profile.followers_count);
    } catch {
      console.warn('Could not load live Instagram data');
    }
  }, []);

  const toggleCreativeStatus = async (id: string, title: string, category: string) => {
    const current = creativeStatuses[id]?.status || 'pending';
    const newStatus = current === 'posted' ? 'pending' : 'posted';

    // Optimistic update
    setCreativeStatuses(prev => ({
      ...prev,
      [id]: { status: newStatus, postedAt: newStatus === 'posted' ? new Date().toISOString() : null },
    }));

    try {
      await fetch('/api/creative-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title, category, status: newStatus }),
      });
    } catch {
      // Revert on error
      setCreativeStatuses(prev => ({
        ...prev,
        [id]: { status: current, postedAt: null },
      }));
    }
  };

  useEffect(() => {
    loadPostsFromSupabase();
    loadImagesFromSupabase();
    loadCreativeStatuses();
    loadLiveInstagramData();
  }, [loadPostsFromSupabase, loadImagesFromSupabase, loadCreativeStatuses, loadLiveInstagramData]);

  // Upload de imagens para Supabase Storage
  const uploadImagesToSupabase = async () => {
    setUploadStatus('loading');
    setUploadMessage('Enviando imagens para a nuvem...');
    try {
      const res = await fetch('/api/storage/upload', { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        setUploadStatus('done');
        setUploadMessage(`${result.uploaded}/${result.total} imagens enviadas!`);
        await loadImagesFromSupabase();
      } else {
        setUploadStatus('error');
        setUploadMessage(result.error || 'Erro ao enviar');
      }
    } catch {
      setUploadStatus('error');
      setUploadMessage('Erro de rede');
    }
  };

  // Helper: resolve imagem local para URL do Supabase
  const resolveImageUrl = (localPath: string): string => {
    const filename = localPath.split('/').pop() || '';
    if (supabaseImageMap[filename]) {
      return supabaseImageMap[filename];
    }
    // Fallback para URL local
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}${localPath}`;
  };

  const feedScheduleData: Record<string, { type: 'IMAGE' | 'CAROUSEL'; images: string[]; caption: string }> = {
    seg: {
      type: 'CAROUSEL',
      images: ['/campaign/post-segunda.png', '/campaign/carousel-seg-slide2.png', '/campaign/carousel-seg-slide3.png', '/campaign/carousel-seg-slide4.png', '/campaign/carousel-seg-slide5.png'],
      caption: campaignCalendar[0].caption,
    },
    ter: {
      type: 'CAROUSEL',
      images: ['/campaign/post-terca.png', '/campaign/carousel-ter-slide2.png', '/campaign/carousel-ter-slide3.png', '/campaign/carousel-ter-slide4.png'],
      caption: campaignCalendar[1].caption,
    },
    qua: {
      type: 'CAROUSEL',
      images: ['/campaign/post-quarta.png', '/campaign/carousel-qua-slide2.png', '/campaign/carousel-qua-slide3.png', '/campaign/carousel-qua-slide4.png', '/campaign/carousel-qua-slide5.png', '/campaign/carousel-qua-slide6.png', '/campaign/carousel-qua-slide7.png', '/campaign/carousel-qua-slide8.png'],
      caption: campaignCalendar[2].caption,
    },
    qui: {
      type: 'IMAGE',
      images: ['/campaign/post-quinta.png'],
      caption: campaignCalendar[3].caption,
    },
    sex: {
      type: 'IMAGE',
      images: ['/campaign/post-sexta.png'],
      caption: campaignCalendar[4].caption,
    },
  };

  const schedulePost = async (dayKey: string, dayIndex: number) => {
    const data = feedScheduleData[dayKey];
    if (!data) return;

    setScheduleStatus(prev => ({ ...prev, [dayKey]: { status: 'loading', message: 'Enviando para Instagram...' } }));

    try {
      // Calculate scheduled time: 10:00 AM on the day
      const postDate = new Date(2026, 2, 23 + dayIndex, 10, 0, 0);
      const scheduledTime = Math.floor(postDate.getTime() / 1000);
      const now = Math.floor(Date.now() / 1000);
      const isFuture = scheduledTime > now + 600;

      const body: Record<string, unknown> = {
        type: data.type,
        caption: data.caption,
        dayKey: dayKey,
      };

      if (data.type === 'CAROUSEL') {
        body.imageUrls = data.images.map(img => resolveImageUrl(img));
      } else {
        body.imageUrl = resolveImageUrl(data.images[0]);
      }

      // NOTA: Agendamento futuro (scheduled_publish_time) requer App Review da Meta.
      // Por enquanto, publicamos imediatamente.
      // if (isFuture) {
      //   body.scheduledTime = scheduledTime;
      // }

      const res = await fetch('/api/instagram/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (result.success) {
        setScheduleStatus(prev => ({
          ...prev,
          [dayKey]: { status: 'success', message: result.message },
        }));
      } else {
        setScheduleStatus(prev => ({
          ...prev,
          [dayKey]: { status: 'error', message: result.error },
        }));
      }
      // Recarregar do Supabase para garantir consistência
      await loadPostsFromSupabase();
    } catch (err) {
      setScheduleStatus(prev => ({
        ...prev,
        [dayKey]: { status: 'error', message: err instanceof Error ? err.message : 'Erro de rede' },
      }));
    }
  };

  const scheduleAllPosts = async () => {
    const dayKeys = ['seg', 'ter', 'qua', 'qui', 'sex'];
    for (let i = 0; i < dayKeys.length; i++) {
      if (scheduleStatus[dayKeys[i]]?.status !== 'success') {
        await schedulePost(dayKeys[i], i);
        await new Promise(r => setTimeout(r, 3000)); // wait between posts
      }
    }
  };

  const tabs = [
    { id: 'overview' as const, label: 'Visão Geral', icon: '📊' },
    { id: 'content' as const, label: 'Análise de Conteúdo', icon: '📝' },
    { id: 'timing' as const, label: 'Horários & Tendências', icon: '⏱️' },
    { id: 'actions' as const, label: 'Plano de Ação', icon: '🎯' },
    { id: 'campaign' as const, label: 'Campanha', icon: '🚀' },
    { id: 'creatives' as const, label: 'Criativos', icon: '🎨' },
    { id: 'agenda' as const, label: 'Agenda', icon: '📅' },
    { id: 'campanhas_ads' as const, label: 'Campanhas', icon: '💰' },
    { id: 'evolucao' as const, label: 'Evolução', icon: '📈' },
    { id: 'agent' as const, label: 'Flash IA', icon: '⚡' },
    { id: 'sdr' as const, label: 'Flash SDR', icon: '💬' },
    { id: 'config' as const, label: 'Configurações', icon: '⚙️' },
  ];

  // ─── Auth Guards (placed after ALL hooks to respect Rules of Hooks) ───
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#08090b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#00DB79', fontSize: '18px', fontFamily: "'Inter', sans-serif" }}>⏳ Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#08090b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '420px', background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '48px 36px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,219,121,0.15), transparent)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,170,255,0.1), transparent)', filter: 'blur(30px)' }} />
          <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: '4px' }}>
              Infinity <span style={{ background: 'linear-gradient(135deg, #00DB79, #00AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Analytics</span>
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>Acesso restrito a administradores</p>
          </div>
          <form onSubmit={handleLogin} style={{ position: 'relative' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', fontWeight: 600 }}>Email</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="admin@infinityondemand.com.br" required
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '15px', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,219,121,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', fontWeight: 600 }}>Senha</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" required
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '15px', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,219,121,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            {loginError && (
              <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontSize: '13px', marginBottom: '16px', fontWeight: 500 }}>
                ⚠️ {loginError}
              </div>
            )}
            <button type="submit" disabled={loginLoading}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: loginLoading ? 'rgba(0,219,121,0.3)' : 'linear-gradient(135deg, #00DB79, #00AAFF)', color: '#fff', fontSize: '16px', fontWeight: 700, fontFamily: 'inherit', cursor: loginLoading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', letterSpacing: '0.3px' }}
            >
              {loginLoading ? '⏳ Entrando...' : '🔐 Entrar'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginTop: '24px' }}>Infinity OnDemand © 2026</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#08090b', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Header ── */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '16px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(8,9,11,0.8)',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/infinity-logo.png" alt="Infinity OnDemand" style={{
            width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover',
          }} />
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.5px' }}>Infinity Analytics</h1>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Relatório Instagram • Mar 2026</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ padding: '6px 10px', borderRadius: '8px', backgroundColor: 'rgba(0,219,121,0.1)', border: '1px solid rgba(0,219,121,0.2)', fontSize: '11px', color: '#00DB79', fontWeight: 600 }}>
            18/Mar/2026
          </div>
          <button
            onClick={handleLogout}
            title="Sair"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px',
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: '11px',
              color: '#EF4444',
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            Sair
          </button>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '8px 10px',
              cursor: 'pointer',
              fontSize: '18px',
              lineHeight: 1,
              color: '#fff',
              display: 'none',
            }}
            className="mobile-menu-btn"
            aria-label="Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* ── Tab Navigation ── */}
      <nav className="tab-nav" style={{
        display: 'flex', gap: '4px', padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        backgroundColor: 'rgba(8,9,11,0.6)',
        backdropFilter: 'blur(10px)',
        position: 'sticky', top: '69px', zIndex: 99,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'inherit',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '6px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.4)',
              backgroundColor: activeTab === tab.id ? 'rgba(0,219,121,0.15)' : 'transparent',
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </nav>

      {/* ── Mobile Dropdown Menu (visible only on small screens when toggled) ── */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown" style={{
          position: 'fixed',
          top: '69px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(8,9,11,0.95)',
          backdropFilter: 'blur(20px)',
          zIndex: 98,
          padding: '16px',
          overflowY: 'auto',
          display: 'none',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                style={{
                  padding: '16px 12px',
                  borderRadius: '14px',
                  border: activeTab === tab.id ? '1px solid rgba(0,219,121,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
                  backgroundColor: activeTab === tab.id ? 'rgba(0,219,121,0.12)' : 'rgba(255,255,255,0.03)',
                }}
              >
                <span style={{ fontSize: '22px' }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Responsive CSS ── */}
      <style>{`
        .tab-nav::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .tab-nav { display: none !important; }
          .mobile-dropdown { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-dropdown { display: none !important; }
          .mobile-menu-btn { display: none !important; }
          header { padding: 24px 48px !important; }
          .tab-nav { padding: 16px 48px !important; top: 93px !important; }
          main { padding: 40px 48px !important; }
          footer { padding: 24px 48px !important; }
        }
      `}</style>

      {/* ── Content ── */}
      <main style={{ padding: '20px 16px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* ═══════════ TAB: OVERVIEW ═══════════ */}
        {activeTab === 'overview' && (
          <>
            {/* Profile Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,219,121,0.08) 0%, rgba(74,144,226,0.08) 100%)',
              border: '1px solid rgba(0,219,121,0.15)',
              borderRadius: '24px',
              padding: '24px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              alignItems: 'center',
              marginBottom: '32px',
            }}>
              <img
                src={profileData.profilePicture}
                alt="Profile"
                style={{ width: '90px', height: '90px', borderRadius: '50%', border: '3px solid rgba(0,219,121,0.4)', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div style={{ flex: '1 1 300px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>{profileData.username}</h2>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>{profileData.name}</p>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{profileData.bio}</p>
              </div>
              <div style={{ display: 'flex', gap: '32px' }}>
                {[
                  { label: 'Seguidores', value: profileData.followers },
                  { label: 'Seguindo', value: profileData.following },
                  { label: 'Posts', value: profileData.posts },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>{s.value}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <MetricCard icon="❤️" title="Taxa de Engajamento" value={`${profileData.engagementRate}%`} subtitle="Benchmark: 2-6% (abaixo)" trend="-80%" color="#EF4444" />
              <MetricCard icon="👍" title="Likes Médios/Post" value={profileData.avgLikes} subtitle={`Total: ${profileData.totalLikes} likes`} color="#8B5CF6" />
              <MetricCard icon="💬" title="Comentários Médios" value={profileData.avgComments} subtitle={`Total: ${profileData.totalComments} comentário`} trend="-97%" color="#F59E0B" />
              <MetricCard icon="📐" title="Ratio Seguidor/Seguindo" value="1.05" subtitle="Ideal: > 2.0" color="#06B6D4" />
            </div>

            {/* Engagement Gauge */}
            <div style={{
              background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '24px',
              padding: '24px',
              marginBottom: '32px',
              textAlign: 'center',
            }}>
              <SectionTitle icon="🎯" title="Health Score da Conta" subtitle="Baseado em engajamento, consistência e crescimento" />
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                {/* Gauge visual */}
                <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="18" />
                    <circle cx="100" cy="100" r="85" fill="none" stroke="url(#gauge-gradient)" strokeWidth="18" strokeDasharray={`${0.25 * 534} ${534}`} strokeLinecap="round" />
                    <defs>
                      <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#EF4444" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '48px', fontWeight: 800, color: '#F59E0B' }}>25</span>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>/100</span>
                  </div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  {[
                    { label: 'Engajamento', score: 15, max: 30, color: '#EF4444' },
                    { label: 'Consistência', score: 5, max: 30, color: '#EF4444' },
                    { label: 'Crescimento', score: 3, max: 20, color: '#EF4444' },
                    { label: 'Variedade de conteúdo', score: 2, max: 20, color: '#F59E0B' },
                  ].map(item => (
                    <div key={item.label} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>{item.label}</span>
                        <span style={{ color: item.color, fontWeight: 600 }}>{item.score}/{item.max}</span>
                      </div>
                      <div style={{ width: '260px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div style={{ width: `${(item.score / item.max) * 100}%`, height: '100%', borderRadius: '3px', backgroundColor: item.color, transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════ TAB: CONTENT (LIVE) ═══════════ */}
        {activeTab === 'content' && (
          <AnalyticsLiveTab />
        )}

        {/* ═══════════ TAB: TIMING ═══════════ */}
        {activeTab === 'timing' && (
          <>
            {/* Day Analysis */}
            <SectionTitle icon="📅" title="Melhor Dia da Semana" subtitle="Média de likes por dia da semana" />
            <div style={{
              background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px',
              padding: '40px',
              marginBottom: '48px',
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '200px' }}>
                {dayAnalysis.map(d => {
                  const maxAvg = Math.max(...dayAnalysis.map(x => x.avg));
                  const heightPct = (d.avg / maxAvg) * 100;
                  const isBest = d.avg === maxAvg;
                  return (
                    <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: isBest ? '#00DB79' : 'rgba(255,255,255,0.5)' }}>{d.avg}</span>
                      <div style={{
                        width: '100%',
                        height: `${heightPct}%`,
                        borderRadius: '8px 8px 4px 4px',
                        background: isBest
                          ? 'linear-gradient(180deg, #00DB79, rgba(0,219,121,0.3))'
                          : 'linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                        transition: 'height 1s ease',
                        minHeight: '20px',
                        boxShadow: isBest ? '0 0 20px rgba(0,219,121,0.3)' : 'none',
                      }} />
                      <span style={{
                        fontSize: '13px', fontWeight: 600,
                        color: isBest ? '#00DB79' : 'rgba(255,255,255,0.4)',
                      }}>{d.day}</span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>{d.posts} posts</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: '24px', textAlign: 'center', padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(0,219,121,0.06)', border: '1px solid rgba(0,219,121,0.1)' }}>
                <span style={{ color: '#00DB79', fontWeight: 600, fontSize: '14px' }}>⭐ Quarta-feira é o melhor dia com média de 5.7 likes</span>
              </div>
            </div>

            {/* Hour Analysis */}
            <SectionTitle icon="⏰" title="Melhor Horário" subtitle="Média de likes por faixa horária (UTC-3)" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '32px' }}>
              {hourAnalysis.map(h => {
                const isBest = h.avg === Math.max(...hourAnalysis.map(x => x.avg));
                return (
                  <div key={h.range} style={{
                    background: isBest
                      ? 'linear-gradient(135deg, rgba(0,219,121,0.12) 0%, rgba(0,219,121,0.04) 100%)'
                      : 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
                    border: isBest ? '1px solid rgba(0,219,121,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '20px',
                    padding: '28px',
                    textAlign: 'center',
                    position: 'relative',
                  }}>
                    {isBest && <div style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(0,219,121,0.2)', color: '#00DB79', fontWeight: 700 }}>MELHOR</div>}
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>{h.label}</div>
                    <div style={{ fontSize: '36px', fontWeight: 800, color: isBest ? '#00DB79' : '#fff', marginBottom: '4px' }}>{h.avg}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>likes médio</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>{h.range} • {h.posts} posts</div>
                  </div>
                );
              })}
            </div>

            {/* Timeline */}
            <SectionTitle icon="📈" title="Linha do Tempo de Publicações" subtitle="Frequência mensal de postagens — Mar/2025 a Mar/2026" />
            <div style={{
              background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px',
              padding: '40px',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '160px' }}>
                {timeline.map(t => {
                  const maxPosts = 10;
                  const heightPct = t.posts > 0 ? Math.max((t.posts / maxPosts) * 100, 8) : 8;
                  const color = t.status === 'gap' ? 'rgba(239,68,68,0.3)' : t.status === 'low' ? 'rgba(245,158,11,0.5)' : 'rgba(0,219,121,0.7)';
                  return (
                    <div key={t.period} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: t.status === 'gap' ? 'rgba(239,68,68,0.5)' : '#fff' }}>{t.posts}</span>
                      <div style={{
                        width: '100%', borderRadius: '6px',
                        height: `${heightPct}%`,
                        backgroundColor: color,
                        minHeight: '8px',
                        transition: 'height 1s ease',
                        border: t.status === 'gap' ? '1px dashed rgba(239,68,68,0.3)' : 'none',
                      }} />
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: '50px' }}>{t.period}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.15)',
              borderRadius: '16px',
              padding: '24px 32px',
              display: 'flex', gap: '12px', alignItems: 'flex-start',
              marginBottom: '48px',
            }}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#EF4444', marginBottom: '4px' }}>Alerta: Padrão de Inatividade Crítico</h4>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                  Dois gaps enormes de inatividade (Jun-Ago/2025 e Out/2025-Fev/2026) destroem o algoritmo. O padrão de &quot;batch posting&quot; (vários posts seguidos de meses de silêncio) é o pior cenário possível para crescimento no Instagram.
                </p>
              </div>
            </div>
          </>
        )}

        {/* ═══════════ TAB: ACTIONS ═══════════ */}
        {activeTab === 'actions' && (
          <>
            <SectionTitle icon="🎯" title="Plano de Ação Estratégico" subtitle="Recomendações priorizadas para os próximos 30 dias" />
            <div style={{ display: 'grid', gap: '12px', marginBottom: '48px' }}>
              {recommendations.map((rec, i) => (
                <div key={i} style={{
                  background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  padding: '24px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  transition: 'all 0.2s',
                }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = `${rec.color}33`; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    backgroundColor: `${rec.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px', flexShrink: 0,
                  }}>{rec.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{rec.action}</p>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>Impacto: {rec.impact}</p>
                  </div>
                  <span style={{
                    padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                    color: rec.color,
                    backgroundColor: `${rec.color}15`,
                    flexShrink: 0,
                  }}>{rec.priority}</span>
                </div>
              ))}
            </div>

            {/* Goals Table */}
            <SectionTitle icon="📈" title="Metas para 60 Dias" subtitle="Objetivos realistas baseados na análise atual" />
            <div style={{
              background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px',
              overflow: 'hidden',
              marginBottom: '48px',
            }}>
              {[
                { metric: 'Seguidores', current: String(liveFollowers), target: '750-800', icon: '👥' },
                { metric: 'Taxa de Engajamento', current: '0.66%', target: '2.5%+', icon: '📈' },
                { metric: 'Comentários/post', current: '0.03', target: '2-3', icon: '💬' },
                { metric: 'Stories/dia', current: String(liveStoryCount), target: '2-3', icon: '📱' },
                { metric: 'Frequência', current: 'Irregular', target: '5x/semana', icon: '📅' },
              ].map((goal, i, arr) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', padding: '20px 28px', gap: '20px',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <span style={{ fontSize: '24px', width: '40px', textAlign: 'center' }}>{goal.icon}</span>
                  <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', flex: 1, fontWeight: 500 }}>{goal.metric}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#EF4444', opacity: 0.8 }}>{goal.current}</span>
                    <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '20px' }}>→</span>
                    <span style={{
                      fontSize: '15px', fontWeight: 700, color: '#00DB79',
                      backgroundColor: 'rgba(0,219,121,0.1)',
                      padding: '4px 12px', borderRadius: '8px',
                    }}>{goal.target}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,219,121,0.1) 0%, rgba(74,144,226,0.1) 100%)',
              border: '1px solid rgba(0,219,121,0.2)',
              borderRadius: '24px',
              padding: '48px',
              textAlign: 'center',
            }}>
              <h3 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Pronto para executar este plano?</h3>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', marginBottom: '28px' }}>Agende uma sessão de estratégia com Angelo Marques e comece a escalar sua presença digital.</p>
              <a href="https://wa.me/558193997207" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '16px 36px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #00DB79 0%, #00bf68 100%)',
                color: '#000', fontWeight: 700, fontSize: '16px',
                textDecoration: 'none',
                boxShadow: '0 10px 30px rgba(0,219,121,0.3)',
                transition: 'all 0.2s',
              }}>
                💬 Falar pelo WhatsApp
              </a>
            </div>
          </>
        )}

        {/* ═══════════ TAB: CAMPAIGN ═══════════ */}
        {activeTab === 'campaign' && (
          <>
            <SectionTitle icon="🚀" title="Campanha: Operação Reativação" subtitle="Calendário editorial Semana 1 — De 0.66% para 3%+ em 30 dias" />

            {/* Strategy Pillars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
              {[
                { pillar: '🏆 Autoridade', pct: '35%', desc: 'Cases, resultados, bastidores', color: '#F59E0B' },
                { pillar: '🎓 Educação', pct: '30%', desc: 'Dicas, tutoriais, frameworks', color: '#4a90e2' },
                { pillar: '🔥 Provocação', pct: '20%', desc: 'Dores, mitos, controvérsias', color: '#EF4444' },
                { pillar: '💼 Oferta', pct: '15%', desc: 'CTA direto, demonstrações', color: '#00DB79' },
              ].map(p => (
                <div key={p.pillar} style={{
                  background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  padding: '24px',
                  borderTop: `3px solid ${p.color}`,
                }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{p.pillar}</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: p.color, marginBottom: '8px' }}>{p.pct}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{p.desc}</div>
                </div>
              ))}
            </div>

            {/* Calendar Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
              {campaignCalendar.map((item, i) => (
                <div key={i} style={{
                  background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  display: 'flex',
                  transition: 'border-color 0.2s',
                }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = `${item.pillarColor}44`; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                >
                  {/* Image */}
                  <div style={{ width: '280px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', padding: '6px 14px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', fontSize: '12px', fontWeight: 600, color: '#fff' }}>{item.format}</div>
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        padding: '4px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
                        color: item.pillarColor, backgroundColor: `${item.pillarColor}15`,
                      }}>{item.day}</span>
                      <span style={{
                        padding: '4px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                        color: item.pillarColor, backgroundColor: `${item.pillarColor}10`,
                        border: `1px solid ${item.pillarColor}30`,
                      }}>{item.pillar}</span>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{item.title}</h3>
                    <pre style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0, flex: 1, maxHeight: '200px', overflow: 'auto' }}>{item.caption}</pre>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontSize: '16px' }}>📱</span>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Story: {item.storyCTA}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stories Strategy */}
            <SectionTitle icon="📱" title="Estratégia de Stories" subtitle="3-5 stories/dia, todos os dias (inclusive fim de semana)" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '48px' }}>
              {[
                { hour: '8h', type: 'Bom dia + bastidor', icon: '☀️', color: '#F59E0B' },
                { hour: '12h', type: 'Enquete do tema do dia', icon: '🗳️', color: '#8B5CF6' },
                { hour: '15h', type: 'Mini-tip ou screenshot', icon: '💡', color: '#06B6D4' },
                { hour: '18h', type: 'Repost do feed + link', icon: '🔁', color: '#00DB79' },
                { hour: '21h', type: 'Bastidor pessoal', icon: '🌙', color: '#EC4899' },
              ].map(s => (
                <div key={s.hour} style={{
                  background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  borderTop: `3px solid ${s.color}`,
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: s.color, marginBottom: '4px' }}>{s.hour}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{s.type}</div>
                </div>
              ))}
            </div>

            {/* Execution Timeline */}
            <SectionTitle icon="📋" title="Cronograma de Execução" subtitle="4 semanas de ativação progressiva" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '48px' }}>
              {[
                { week: 'Semana 1', label: '🟢 Lançamento', tasks: ['Postar 5x + 3 stories/dia', 'Ativar pilares de conteúdo', 'Carrossel case Dom Black'] },
                { week: 'Semana 2', label: '🟡 Aceleração', tasks: ['Mesma estrutura de pilares', 'Ativar Campanha Ads (retargeting)', 'Responder TODAS DMs em <2h'] },
                { week: 'Semana 3', label: '🟠 Consolidação', tasks: ['Gravar depoimento cliente real', 'Ativar Campanha conversão', 'Primeira live ou Q&A'] },
                { week: 'Semana 4', label: '🔴 Colheita', tasks: ['Post de resultados da campanha', 'Recapitulação + super CTA', 'Análise e plan mês 2'] },
              ].map(w => (
                <div key={w.week} style={{
                  background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  padding: '24px',
                }}>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{w.week}</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>{w.label}</div>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {w.tasks.map((t, j) => (
                      <li key={j} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{ color: '#00DB79', flexShrink: 0 }}>•</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ═══════════ TAB: CREATIVES ═══════════ */}
        {activeTab === 'creatives' && (
          <>
            {/* Progress Counter */}
            {(() => {
              const totalItems = creatives.reduce((sum, s) => sum + s.items.length, 0);
              const postedItems = creatives.reduce((sum, s) => sum + s.items.filter((_, i) => creativeStatuses[`${s.category}-${i}`]?.status === 'posted').length, 0);
              const pct = totalItems > 0 ? Math.round((postedItems / totalItems) * 100) : 0;
              return (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px',
                  padding: '20px 28px', borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(0,219,121,0.06), rgba(74,144,226,0.06))',
                  border: '1px solid rgba(0,219,121,0.15)',
                }}>
                  <span style={{ fontSize: '28px' }}>📋</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 700 }}>Progresso da Semana</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#00DB79' }}>{postedItems}/{totalItems} postados ({pct}%)</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, borderRadius: '4px', background: 'linear-gradient(90deg, #00DB79, #4a90e2)', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                </div>
              );
            })()}

            {creatives.map((section, si) => {
              const sectionPosted = section.items.filter((_, i) => creativeStatuses[`${section.category}-${i}`]?.status === 'posted').length;
              return (
              <div key={si} style={{ marginBottom: '48px' }}>
                <SectionTitle
                  icon={section.category === 'Feed' ? '📸' : section.category.includes('Stories') ? '📱' : '💰'}
                  title={`Criativos — ${section.category}`}
                  subtitle={`${section.items.length} peças • ${sectionPosted}/${section.items.length} postadas`}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {section.items.map((item, i) => {
                    const creativeId = `${section.category}-${i}`;
                    const isPosted = creativeStatuses[creativeId]?.status === 'posted';
                    return (
                    <div key={i} style={{
                      background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
                      border: isPosted ? '1px solid rgba(0,219,121,0.2)' : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      display: 'flex',
                      transition: 'all 0.3s',
                      opacity: isPosted ? 0.55 : 1,
                      position: 'relative' as const,
                    }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(0,219,121,0.2)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'; e.currentTarget.style.opacity = '1'; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = isPosted ? 'rgba(0,219,121,0.2)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.opacity = isPosted ? '0.55' : '1'; }}
                    >
                      {/* Image Side */}
                      <div style={{ width: '380px', flexShrink: 0, position: 'relative', backgroundColor: '#0a0c10' }}>
                        {item.images && item.images.length > 1 ? (
                          <>
                            <img src={item.images[carouselSlides[`${si}-${i}`] || 0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            {/* Slide counter */}
                            <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 12px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', fontSize: '12px', fontWeight: 600, color: '#fff' }}>
                              {(carouselSlides[`${si}-${i}`] || 0) + 1}/{item.images.length}
                            </div>
                            {/* Prev/Next */}
                            <button onClick={() => setCarouselSlides(prev => ({ ...prev, [`${si}-${i}`]: Math.max((prev[`${si}-${i}`] || 0) - 1, 0) }))} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '18px', cursor: 'pointer', display: (carouselSlides[`${si}-${i}`] || 0) === 0 ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                            <button onClick={() => setCarouselSlides(prev => ({ ...prev, [`${si}-${i}`]: Math.min((prev[`${si}-${i}`] || 0) + 1, (item.images?.length || 1) - 1) }))} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '18px', cursor: 'pointer', display: (carouselSlides[`${si}-${i}`] || 0) === (item.images?.length || 1) - 1 ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                            {/* Dots */}
                            <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                              {item.images.map((_, di) => (
                                <button key={di} onClick={() => setCarouselSlides(prev => ({ ...prev, [`${si}-${i}`]: di }))} style={{ width: di === (carouselSlides[`${si}-${i}`] || 0) ? '20px' : '8px', height: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer', backgroundColor: di === (carouselSlides[`${si}-${i}`] || 0) ? '#00DB79' : 'rgba(255,255,255,0.3)', transition: 'all 0.2s' }} />
                              ))}
                            </div>
                          </>
                        ) : (
                          <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        )}
                      </div>
                      {/* Caption Side */}
                      <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{item.title}</h3>
                            {isPosted && (
                              <span style={{
                                padding: '4px 10px', borderRadius: '6px',
                                background: 'rgba(0,219,121,0.15)', border: '1px solid rgba(0,219,121,0.25)',
                                fontSize: '10px', fontWeight: 700, color: '#00DB79',
                                letterSpacing: '0.5px', whiteSpace: 'nowrap',
                              }}>✅ POSTADO</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                            <button
                              onClick={() => toggleCreativeStatus(creativeId, item.title, section.category)}
                              style={{
                                padding: '8px 16px', borderRadius: '8px', fontSize: '12px',
                                fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                                backgroundColor: isPosted ? 'rgba(239,68,68,0.1)' : 'rgba(139,92,246,0.1)',
                                color: isPosted ? '#EF4444' : '#8B5CF6',
                                border: `1px solid ${isPosted ? 'rgba(239,68,68,0.2)' : 'rgba(139,92,246,0.2)'}`,
                                transition: 'all 0.2s',
                              }}
                            >{isPosted ? '↩️ Desfazer' : '✅ Já Postei'}</button>
                            <button
                              onClick={() => { navigator.clipboard.writeText(item.caption); }}
                              style={{
                                padding: '8px 16px', borderRadius: '8px', fontSize: '12px',
                                fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                                backgroundColor: 'rgba(0,219,121,0.1)', color: '#00DB79',
                                border: '1px solid rgba(0,219,121,0.2)', transition: 'all 0.2s',
                              }}
                              onMouseOver={e => { e.currentTarget.style.backgroundColor = 'rgba(0,219,121,0.2)'; }}
                              onMouseOut={e => { e.currentTarget.style.backgroundColor = 'rgba(0,219,121,0.1)'; }}
                            >📋 Copiar Legenda</button>
                          </div>
                        </div>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Legenda / Copy</div>
                        <pre style={{
                          flex: 1,
                          fontSize: '14px',
                          color: 'rgba(255,255,255,0.65)',
                          lineHeight: 1.7,
                          whiteSpace: 'pre-wrap',
                          fontFamily: 'inherit',
                          margin: 0,
                          padding: '20px',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.04)',
                          overflow: 'auto',
                          maxHeight: '400px',
                        }}>{item.caption}</pre>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
              );
            })}
          </>
        )}

        {/* ═══════════ TAB: AGENDA ═══════════ */}
        {activeTab === 'agenda' && (() => {
          const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
          const dayThemes = ['Provocação', 'Educação', 'Autoridade', 'Educação', 'Oferta'];
          const dayColors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#4ECDC4', '#FF6B6B'];
          const dayEmojis = ['🔴', '🔵', '🟡', '🔵', '🔴'];
          // Start date: next Monday from March 24, 2026
          const startDate = new Date(2026, 2, 23); // March 23, 2026 (Monday)
          const schedule: { time: string; type: string; color: string; items: { label: string; format: string; image?: string }[] }[] = [
            { time: '08:00', type: 'Story', color: '#A855F7', items: [
              { label: 'Bom Dia + Bastidor', format: 'Story' },
              { label: 'Terça de dados!', format: 'Story' },
              { label: 'Quarta de resultado!', format: 'Story' },
              { label: 'Quinta de aprendizado!', format: 'Story' },
              { label: 'SEXTOU! Oferta especial', format: 'Story' },
            ]},
            { time: '10:00', type: 'Feed', color: '#00DB79', items: [
              { label: '5 Sinais — Carrossel 5 slides', format: 'Carrossel', image: '/campaign/post-segunda.png' },
              { label: '3 Métricas — Carrossel 4 slides', format: 'Carrossel', image: '/campaign/post-terca.png' },
              { label: 'Case Dom Black — Carrossel 8 slides', format: 'Carrossel', image: '/campaign/post-quarta.png' },
              { label: 'Erro nº1 Pizzaria — Imagem', format: 'Imagem', image: '/campaign/post-quinta.png' },
              { label: '20 seg Delivery — Reel', format: 'Reel', image: '/campaign/post-sexta.png' },
            ]},
            { time: '12:00', type: 'Story', color: '#A855F7', items: [
              { label: 'Enquete: Dificuldade do delivery', format: 'Enquete' },
              { label: 'Enquete: Ticket médio', format: 'Enquete' },
              { label: 'Enquete: Sistema próprio?', format: 'Enquete' },
              { label: 'Enquete: Erros no delivery', format: 'Quiz' },
              { label: 'Enquete: Comissão iFood', format: 'Enquete' },
            ]},
            { time: '15:00', type: 'Story', color: '#A855F7', items: [
              { label: 'Dica: Taxa por CEP +15%', format: 'Dica' },
              { label: 'Dica: Calcular ticket médio', format: 'Dica' },
              { label: 'Bastidor: Screenshot Kanban', format: 'Screenshot' },
              { label: 'Dica: Despacho às cegas', format: 'Dica' },
              { label: 'Countdown: Oferta 24h', format: 'Urgência' },
            ]},
            { time: '18:00', type: 'Story', color: '#A855F7', items: [
              { label: 'Repost do carrossel', format: 'Repost' },
              { label: 'Repost: 3 métricas', format: 'Repost' },
              { label: 'Repost: Case Dom Black', format: 'Repost' },
              { label: 'Repost: Erro nº1', format: 'Repost' },
              { label: 'Repost: Oferta final', format: 'Repost' },
            ]},
            { time: '21:00', type: 'Story', color: '#A855F7', items: [
              { label: 'Bastidor noturno', format: 'Bastidor' },
              { label: 'Bastidor: Métricas', format: 'Bastidor' },
              { label: 'Bastidor: Onboarding', format: 'Bastidor' },
              { label: 'Bastidor: App entregador', format: 'Bastidor' },
              { label: 'Bastidor: Fim de semana', format: 'Bastidor' },
            ]},
          ];
          return (
            <>
              <SectionTitle icon="📅" title="Agenda de Publicações" subtitle="Calendário semanal com horários programados — pronto para automação" />

              {/* Week selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', padding: '16px 24px', background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>Semana:</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#00DB79' }}>23 — 27 de Março, 2026</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>Semana 1 de 4 • Fase: Provocação + Educação</span>
              </div>

              {/* Calendar Grid */}
              <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)', gap: '2px', minWidth: '900px' }}>
                  {/* Header row */}
                  <div style={{ padding: '16px 8px', textAlign: 'center' }} />
                  {days.map((day, di) => {
                    const date = new Date(startDate);
                    date.setDate(startDate.getDate() + di);
                    return (
                      <div key={di} style={{
                        padding: '16px 12px',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
                        borderRadius: '12px 12px 0 0',
                        borderBottom: `3px solid ${dayColors[di]}`,
                      }}>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {dayEmojis[di]} {dayThemes[di]}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>{day}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                          {date.getDate()}/{String(date.getMonth() + 1).padStart(2, '0')}
                        </div>
                      </div>
                    );
                  })}

                  {/* Time rows */}
                  {schedule.map((slot, si) => (
                    <React.Fragment key={si}>
                      {/* Time label */}
                      <div style={{
                        padding: '12px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: slot.type === 'Feed' ? '#00DB79' : '#A855F7',
                      }}>
                        {slot.time}
                      </div>
                      {/* Day cells */}
                      {slot.items.map((item, di) => (
                        <div key={di} style={{
                          padding: '10px 12px',
                          background: si % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.025)',
                          border: '1px solid rgba(255,255,255,0.04)',
                          borderRadius: si === 0 ? '0' : si === schedule.length - 1 ? '0 0 8px 8px' : '0',
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                          onMouseOver={e => { e.currentTarget.style.backgroundColor = 'rgba(0,219,121,0.05)'; e.currentTarget.style.borderColor = 'rgba(0,219,121,0.15)'; }}
                          onMouseOut={e => { e.currentTarget.style.backgroundColor = si % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.025)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <span style={{
                              fontSize: '9px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: slot.type === 'Feed'
                                ? 'rgba(0,219,121,0.15)'
                                : 'rgba(168,85,247,0.15)',
                              color: slot.type === 'Feed' ? '#00DB79' : '#A855F7',
                            }}>
                              {slot.type}
                            </span>
                            <span style={{
                              fontSize: '9px',
                              fontWeight: 600,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              color: 'rgba(255,255,255,0.4)',
                            }}>
                              {item.format}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.3 }}>
                            {item.label}
                          </div>
                          {item.image && (
                            <img src={item.image} alt="" style={{ width: '100%', height: '40px', objectFit: 'cover', borderRadius: '4px', marginTop: '6px', opacity: 0.6 }} />
                          )}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '24px', marginTop: '24px', padding: '16px 24px', background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Legenda:</span>
                {[
                  { label: 'Post no Feed', color: '#00DB79' },
                  { label: 'Story', color: '#A855F7' },
                  { label: 'Carrossel', color: '#4ECDC4' },
                  { label: 'Reel', color: '#FF6B6B' },
                  { label: 'Enquete', color: '#FFD93D' },
                ].map((l, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: l.color }} />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{l.label}</span>
                  </div>
                ))}
              </div>

              {/* Summary stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
                {[
                  { icon: '📸', value: '5', label: 'Posts no Feed', sub: '2 carrosséis + 1 imagem + 2 reels' },
                  { icon: '📱', value: '25', label: 'Stories/semana', sub: '5 por dia × 5 dias' },
                  { icon: '💰', value: '2', label: 'Anúncios ativos', sub: 'Topo de funil + Retargeting' },
                  { icon: '⏰', value: '30', label: 'Publicações/semana', sub: 'Feed + Stories + Extras' },
                ].map((s, i) => (
                  <div key={i} style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, #111318 0%, #0c0e12 100%)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#00DB79' }}>{s.value}</div>
                    <div style={{ fontSize: '13px', color: '#fff', fontWeight: 600, marginTop: '4px' }}>{s.label}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Scheduling Panel */}
              <div style={{
                marginTop: '32px',
                padding: '28px',
                background: 'linear-gradient(135deg, rgba(0,219,121,0.06) 0%, rgba(0,219,121,0.02) 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(0,219,121,0.15)',
              }}>
                {/* Upload para Supabase Storage */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', padding: '16px', borderRadius: '12px', background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}>
                  <span style={{ fontSize: '24px' }}>☁️</span>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#A855F7' }}>Imagens na Nuvem (Supabase Storage)</h4>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                      {uploadStatus === 'done' ? `✅ ${Object.keys(supabaseImageMap).length} imagens disponíveis — URLs públicas prontas` 
                        : uploadStatus === 'loading' ? '⏳ ' + uploadMessage
                        : uploadStatus === 'error' ? '❌ ' + uploadMessage
                        : 'As imagens precisam estar em URLs públicas para a API do Instagram'}
                    </p>
                  </div>
                  {uploadStatus !== 'done' && (
                    <button
                      onClick={uploadImagesToSupabase}
                      disabled={uploadStatus === 'loading'}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: 'none',
                        background: uploadStatus === 'loading' ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: uploadStatus === 'loading' ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {uploadStatus === 'loading' ? '⏳ Enviando...' : '☁️ Upload para Nuvem'}
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px' }}>🚀</span>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#00DB79' }}>Agendar no Instagram</h3>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Via Meta Graph API • Posts do Feed (Carrosséis + Imagens)</p>
                    </div>
                  </div>
                  <button
                    onClick={scheduleAllPosts}
                    disabled={Object.values(scheduleStatus).every(s => s.status === 'success')}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '12px',
                      border: 'none',
                      background: Object.values(scheduleStatus).every(s => s.status === 'success')
                        ? 'rgba(255,255,255,0.1)'
                        : 'linear-gradient(135deg, #00DB79 0%, #00b865 100%)',
                      color: Object.values(scheduleStatus).every(s => s.status === 'success') ? 'rgba(255,255,255,0.3)' : '#000',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: Object.values(scheduleStatus).every(s => s.status === 'success') ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    📅 Agendar Semana Toda
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                  {['seg', 'ter', 'qua', 'qui', 'sex'].map((dayKey, di) => {
                    const st = scheduleStatus[dayKey] || { status: 'idle' };
                    const data = feedScheduleData[dayKey];
                    return (
                      <div key={dayKey} style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: st.status === 'success' ? 'rgba(0,219,121,0.08)'
                          : st.status === 'error' ? 'rgba(255,107,107,0.08)'
                          : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${
                          st.status === 'success' ? 'rgba(0,219,121,0.2)'
                          : st.status === 'error' ? 'rgba(255,107,107,0.2)'
                          : 'rgba(255,255,255,0.06)'
                        }`,
                        textAlign: 'center',
                      }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'][di]}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                          {data?.type} • {data?.images.length} img{data && data.images.length > 1 ? 's' : ''}
                        </div>
                        <div style={{ fontSize: '11px', marginBottom: '10px', color: 'rgba(255,255,255,0.3)' }}>10:00</div>
                        {st.status === 'idle' && (
                          <button
                            onClick={() => schedulePost(dayKey, di)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '8px',
                              border: '1px solid rgba(0,219,121,0.3)',
                              background: 'rgba(0,219,121,0.1)',
                              color: '#00DB79',
                              fontWeight: 600,
                              fontSize: '12px',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,219,121,0.2)'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,219,121,0.1)'; }}
                          >
                            🚀 Agendar
                          </button>
                        )}
                        {st.status === 'loading' && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#FFD93D', fontSize: '12px' }}>
                            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Enviando...
                          </div>
                        )}
                        {st.status === 'success' && (
                          <div style={{ color: '#00DB79', fontSize: '12px', fontWeight: 600 }}>✅ Agendado!</div>
                        )}
                        {st.status === 'error' && (
                          <div>
                            <div style={{ color: '#FF6B6B', fontSize: '11px', marginBottom: '6px' }}>❌ {st.message?.substring(0, 50)}</div>
                            <button
                              onClick={() => {
                                setScheduleStatus(prev => ({ ...prev, [dayKey]: { status: 'idle' } }));
                              }}
                              style={{
                                padding: '4px 12px',
                                borderRadius: '6px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: '11px',
                                cursor: 'pointer',
                              }}
                            >
                              Tentar novamente
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(255,216,61,0.06)', border: '1px solid rgba(255,216,61,0.1)' }}>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                    ⚠️ <strong>Importante:</strong> As imagens precisam estar em uma URL pública para a API do Instagram acessar.
                    Stories não são suportados pela API de publicações — poste manualmente pelo app do Instagram.
                  </p>
                </div>
              </div>
            </>
          );
        })()}

        {activeTab === 'campanhas_ads' && <CampanhasTab />}
        {activeTab === 'evolucao' && <EvolucaoTab />}

        {/* ═══════════ TAB: AGENTE IA ═══════════ */}
        {activeTab === 'agent' && <AgentTab />}

        {/* ═══════════ TAB: CONFIGURAÇÕES ═══════════ */}
        {activeTab === 'config' && <ConfiguracoesTab />}

        {/* ═══════════ TAB: FLASH SDR ═══════════ */}
        {activeTab === 'sdr' && <FlashSDRTab />}

      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '16px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
          Relatório gerado via Meta Graph API v21.0 • Infinity OnDemand Analytics • 18/Mar/2026
        </p>
      </footer>
    </div>
  );
}
