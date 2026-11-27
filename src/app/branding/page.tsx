import type { Metadata } from 'next';
import BrandingContent from '../[locale]/branding/BrandingContent';

export const metadata: Metadata = {
  title: 'Branding, Identidade Visual & Design System | Infinity OnDemand',
  description: 'Construa uma marca memorável que comanda autoridade e vende mais caro. Estratégia de marca, logotipo, identidade visual completa, manual de marca e design system para empresas que lideram.',
  alternates: {
    canonical: 'https://infinityondemand.com.br/branding',
  },
  openGraph: {
    title: 'Branding & Identidade Visual de Alto Padrão | Infinity OnDemand',
    description: 'Transforme o seu negócio em uma marca desejada. Estratégia, identidade visual, logotipo e design system integrados à sua presença digital.',
    images: ['/branding/brand_board.png'],
  },
};

export default function BrandingPage() {
  return <BrandingContent locale="pt" />;
}
