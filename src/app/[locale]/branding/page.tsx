import { getDictionary, isValidLocale, locales, type Locale } from '@/lib/i18n';
import BrandingContent from './BrandingContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Branding, Identidade Visual & Design System | Infinity OnDemand',
  description: 'Construa uma marca memorável que comanda autoridade e vende mais caro. Estratégia de marca, logotipo, identidade visual completa, manual de marca e design system para empresas que lideram.',
  keywords: ['Branding', 'Identidade Visual', 'Design de Logotipo', 'Manual da Marca', 'Design System', 'Rebranding', 'Infinity OnDemand'],
  openGraph: {
    title: 'Branding & Identidade Visual de Alto Padrão | Infinity OnDemand',
    description: 'Transforme o seu negócio em uma marca desejada. Estratégia, identidade visual, logotipo e design system integrados à sua presença digital.',
    images: ['/branding/brand_board.png'],
  },
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleBrandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'pt';
  const dict = await getDictionary(locale);
  return <BrandingContent dict={dict} locale={locale} />;
}
