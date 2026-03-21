import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Desenvolvimento de E-commerce — Lojas Virtuais de Alta Conversão",
  description:
    "Criamos lojas virtuais B2B e B2C de alta performance. Desenvolvimento de e-commerce com UX focado em vendas, integrações com ERPs, gateways de pagamento e tempo de carregamento ultra-rápido.",
  keywords: [
    "desenvolvimento de e-commerce",
    "criar loja virtual",
    "loja virtual B2B",
    "e-commerce de alta conversão",
    "agência e-commerce",
    "loja virtual Recife",
    "desenvolvimento loja online",
    "integração ERP e-commerce",
    "Nuvemshop partner",
  ],
  openGraph: {
    title: "Desenvolvimento de E-commerce | Infinity OnDemand",
    description:
      "Lojas virtuais de alta performance, B2B e B2C. UX focado em vendas, integrações complexas e tempo de carregamento ultra-rápido.",
    url: "https://infinityondemand.com.br/ecommerce",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://infinityondemand.com.br/ecommerce",
  },
};

export default function EcommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
