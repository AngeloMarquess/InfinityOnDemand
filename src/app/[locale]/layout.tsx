import { getDictionary, isValidLocale, locales, type Locale } from '@/lib/i18n';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'pt';
  const dict = await getDictionary(locale);

  return (
    <div data-locale={locale} data-dict={JSON.stringify(dict)}>
      {children}
    </div>
  );
}
