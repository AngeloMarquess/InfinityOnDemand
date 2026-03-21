import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistema de Delivery para Restaurantes — Infinity Delivery OS",
  description:
    "Plataforma completa de delivery: cardápio digital, gestão Kanban de pedidos, PDV integrado, módulo financeiro e domínio personalizado. Teste grátis 14 dias. Setup em 5 minutos.",
  keywords: [
    "sistema delivery restaurante",
    "plataforma delivery",
    "cardápio digital",
    "sistema para pizzaria",
    "app de delivery próprio",
    "cardápio online restaurante",
    "sistema de pedidos online",
    "PDV para restaurante",
    "gestão de delivery",
    "Infinity Delivery OS",
    "alternativa ao iFood",
  ],
  openGraph: {
    title: "Infinity Delivery OS — Sistema Completo para Restaurantes",
    description:
      "Cardápio digital, gestão de pedidos, PDV integrado e relatórios em tempo real. Tudo que seu restaurante precisa para vender mais.",
    url: "https://infinityondemand.com.br/delivery",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://infinityondemand.com.br/delivery",
  },
};

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
