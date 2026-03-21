import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consultoria de Tecnologia & Sistemas Sob Medida",
  description:
    "Consultoria estratégica digital + desenvolvimento de sistemas modulares para empresas que querem escalar. Diagnóstico gratuito, automação de processos, BI, integrações e segurança LGPD.",
  keywords: [
    "consultoria de tecnologia",
    "consultoria digital",
    "sistemas sob medida",
    "automação de processos",
    "business intelligence",
    "consultoria e-commerce",
    "desenvolvimento de sistemas",
    "consultoria estratégica digital",
    "Infinity OnDemand consultoria",
  ],
  openGraph: {
    title: "Consultoria de Tecnologia & Sistemas Sob Medida | Infinity OnDemand",
    description:
      "Da estratégia ao código. Consultoria + desenvolvimento de sistemas modulares para empresas que querem escalar com tecnologia de ponta.",
    url: "https://infinityondemand.com.br/consultoria",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://infinityondemand.com.br/consultoria",
  },
};

export default function ConsultoriaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
