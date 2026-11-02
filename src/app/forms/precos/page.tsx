'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FormsPrecosRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/forms#precos');
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#070B18',
      color: '#fff',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(0, 223, 129, 0.2)',
          borderTopColor: '#00DF81',
          borderRadius: '50%',
          margin: '0 auto 16px'
        }} />
        <p style={{ color: '#00DF81', fontWeight: 600, fontSize: '15px' }}>
          Redirecionando para a página oficial do Infinity Forms...
        </p>
      </div>
    </div>
  );
}
