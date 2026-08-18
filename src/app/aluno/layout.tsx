import type { Metadata } from 'next';
import './aluno.css';

export const metadata: Metadata = {
  title: 'Infinity Academy — Área do Aluno',
  description: 'Sua área de aprendizado: trilhas de Marketing, Vendas, Administração e IA.',
  robots: { index: false, follow: false },
};

export default function AlunoLayout({ children }: { children: React.ReactNode }) {
  return <div className="alu-shell">{children}</div>;
}
