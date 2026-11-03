import type { Metadata } from 'next';
import PrivacyContent from '../[locale]/privacy/PrivacyContent';

export const metadata: Metadata = {
  title: 'Política de Privacidade & LGPD | Infinity OnDemand',
  description: 'Conheça nossa Política de Privacidade, conformidade com a LGPD e o compromisso da Infinity OnDemand com a segurança dos seus dados.',
  alternates: {
    canonical: 'https://infinityondemand.com.br/privacy',
  },
};

export default function PrivacyPage() {
  return <PrivacyContent locale="pt" />;
}
