import { getDictionary, isValidLocale, locales, type Locale } from '@/lib/i18n';
import type { Metadata } from 'next';
import AcademyContent from './AcademyContent';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Infinity Academy — Marketing, Vendas e Gestão com IA',
  description:
    'A escola de quem quer escalar o negócio. Trilhas práticas de Marketing, Vendas e Administração com IA no centro. Para você e para o seu time.',
};

export default async function LocaleAcademyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'pt';
  const dict = await getDictionary(locale);
  return <AcademyContent dict={dict} locale={locale} />;
}
