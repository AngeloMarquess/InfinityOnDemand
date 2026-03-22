import { getDictionary, isValidLocale, locales, type Locale } from '@/lib/i18n';
import EcommerceContent from './EcommerceContent';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleEcommercePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'pt';
  const dict = await getDictionary(locale);
  return <EcommerceContent dict={dict} locale={locale} />;
}
