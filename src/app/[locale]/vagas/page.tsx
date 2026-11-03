import CarreirasPage from '@/app/carreiras/page';
import { locales } from '@/lib/i18n';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleVagasPage() {
  return <CarreirasPage />;
}
