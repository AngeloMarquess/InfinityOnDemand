export default function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Infinity OnDemand",
    alternateName: "Infinity Labs",
    url: "https://infinityondemand.com.br",
    logo: "https://infinityondemand.com.br/logo.png",
    description:
      "Consultoria de tecnologia especializada em e-commerce, delivery e sistemas sob medida. Desenvolvemos plataformas SaaS, CRM e automações com IA.",
    foundingDate: "2020",
    founder: {
      "@type": "Person",
      name: "Angelo Marques",
      jobTitle: "Co-Fundador & CEO",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Recife",
      addressRegion: "PE",
      addressCountry: "BR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-81-93997207",
      contactType: "sales",
      availableLanguage: ["Portuguese"],
    },
    sameAs: [
      "https://open.spotify.com/show/0BvAnMoSWEOXCwrc7cYDxe",
      "https://github.com/AngeloMarquess",
      "https://www.amazon.com.br/Neuroci%C3%AAncia-Designer-Angelo-Ferreira-Marques-ebook/dp/B0F7GM77LV",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Infinity OnDemand",
    url: "https://infinityondemand.com.br",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://infinityondemand.com.br/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const deliverySoftware = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Infinity Delivery OS",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "97",
      priceCurrency: "BRL",
      priceValidUntil: "2027-12-31",
    },
    description:
      "Plataforma SaaS completa para delivery e restaurantes. Cardápio digital, gestão Kanban de pedidos, PDV integrado, relatórios em tempo real e domínio personalizado.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
    },
  };

  const crmSoftware = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Infinity CRM",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
    description:
      "CRM inteligente para gestão de vendas, leads e relacionamento com clientes. Desenvolvido pelo Infinity Labs com foco em alta conversão e análise de dados.",
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "O que é a Infinity OnDemand?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Infinity OnDemand é uma consultoria de tecnologia especializada em e-commerce, delivery e sistemas sob medida. Fundada em 2020 em Recife-PE, desenvolvemos plataformas SaaS proprietárias, CRMs, automações com IA e soluções completas para negócios digitais.",
        },
      },
      {
        "@type": "Question",
        name: "Quais serviços a Infinity OnDemand oferece?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oferecemos consultoria estratégica digital, desenvolvimento de e-commerce, plataforma de delivery (Infinity Delivery OS), CRM proprietário (Infinity CRM), automação de processos com IA, gestão de tráfego pago, business intelligence e integrações com APIs e ERPs.",
        },
      },
      {
        "@type": "Question",
        name: "Como funciona o Infinity Delivery OS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O Infinity Delivery OS é uma plataforma SaaS completa para restaurantes e delivery. Inclui cardápio digital white-label, gestão de pedidos com Kanban drag-and-drop, PDV integrado, módulo financeiro, relatórios em tempo real e domínio personalizado. Setup em 5 minutos, teste grátis por 14 dias.",
        },
      },
      {
        "@type": "Question",
        name: "A Infinity OnDemand atende qual região?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Atendemos clientes em todo o Brasil de forma remota. Nossa sede é em Recife-PE, mas nossos sistemas são 100% online e nosso suporte funciona via WhatsApp 24/7 através do Flash, nosso SDR com inteligência artificial.",
        },
      },
      {
        "@type": "Question",
        name: "O que é o Flash, o SDR com IA da Infinity?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O Flash é nosso consultor de vendas automatizado com inteligência artificial. Ele atende via WhatsApp 24 horas por dia, 7 dias por semana, tirando dúvidas sobre nossos serviços e montando propostas personalizadas para cada cliente automaticamente.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(deliverySoftware) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crmSoftware) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
