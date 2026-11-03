import type { Metadata } from 'next';
import SiteInstitucionalContent from '../[locale]/site-institucional/SiteInstitucionalContent';

export const metadata: Metadata = {
  title: 'Desenvolvimento de Sites Institucionais & Landing Pages | Infinity OnDemand',
  description: 'Desenvolvimento de sites institucionais de alto padrão em Next.js e React. Design exclusivo no Figma, velocidade máxima, otimização para SEO e conversão.',
  alternates: {
    canonical: 'https://infinityondemand.com.br/site-institucional',
  },
};

export default function SiteInstitucionalPage() {
  return <SiteInstitucionalContent locale="pt" />;
}
