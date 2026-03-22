import { getDictionary, isValidLocale, locales, type Locale } from '@/lib/i18n';
import ConsultoriaContent from './ConsultoriaContent';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleConsultoriaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'pt';
  const dict = await getDictionary(locale);
  return <ConsultoriaContent dict={dict} locale={locale} />;
}
