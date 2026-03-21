import type { Metadata } from "next";
import "./globals.css";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://infinityondemand.com.br"),
  title: {
    default: "Infinity OnDemand | Consultoria de Tecnologia, E-commerce & Delivery",
    template: "%s | Infinity OnDemand",
  },
  description:
    "Consultoria de tecnologia e marketing digital em Recife. Desenvolvemos e-commerce, sistemas de delivery (Infinity Delivery OS), CRM, automações com IA e soluções sob medida para escalar seu negócio.",
  keywords: [
    "consultoria de tecnologia",
    "e-commerce",
    "desenvolvimento de loja virtual",
    "sistema de delivery",
    "cardápio digital",
    "CRM para empresas",
    "automação com IA",
    "tráfego pago",
    "agência de performance",
    "Infinity OnDemand",
    "Infinity Delivery OS",
    "Infinity CRM",
    "Infinity Labs",
    "Recife",
    "sistema para pizzaria",
    "plataforma delivery restaurante",
  ],
  authors: [{ name: "Infinity OnDemand", url: "https://infinityondemand.com.br" }],
  creator: "Infinity OnDemand",
  publisher: "Infinity OnDemand",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://infinityondemand.com.br",
    siteName: "Infinity OnDemand",
    title: "Infinity OnDemand | Consultoria de Tecnologia, E-commerce & Delivery",
    description:
      "Consultoria de tecnologia em Recife. E-commerce, delivery, CRM, automações com IA e soluções sob medida para escalar seu negócio.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Infinity OnDemand — Tecnologia, E-commerce e Delivery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infinity OnDemand | Tecnologia, E-commerce & Delivery",
    description:
      "Consultoria de tecnologia em Recife. Sistemas de e-commerce, delivery, CRM e automações com IA.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://infinityondemand.com.br",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18032348244" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18032348244');
            `,
          }}
        />
        <JsonLd />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
