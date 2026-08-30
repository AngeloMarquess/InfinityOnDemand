import { getDictionary, isValidLocale, locales, type Locale } from '@/lib/i18n';
import TrafegoContent from './TrafegoContent';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleTrafegoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'pt';
  const dict = await getDictionary(locale);
  return <TrafegoContent dict={dict} locale={locale} />;
}
