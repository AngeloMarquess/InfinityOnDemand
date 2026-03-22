export const locales = ['pt', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pt';

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dictionaries: Record<Locale, () => Promise<any>> = {
  pt: () => import('@/dictionaries/pt.json').then((m) => m.default),
  es: () => import('@/dictionaries/es.json').then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  if (!isValidLocale(locale)) {
    return dictionaries[defaultLocale]();
  }
  return dictionaries[locale]();
}
