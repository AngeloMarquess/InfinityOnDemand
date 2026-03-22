import { getDictionary, isValidLocale, locales, type Locale } from '@/lib/i18n';
import PrivacyContent from './PrivacyContent';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocalePrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'pt';
  const dict = await getDictionary(locale);
  return <PrivacyContent dict={dict} locale={locale} />;
}
