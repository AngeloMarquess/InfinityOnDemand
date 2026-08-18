'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase';
import { getUser } from '@/lib/academy/client';
import AuthGate from './AuthGate';
import Dashboard from './Dashboard';

export default function AlunoApp() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    getUser().then((u) => { if (mounted) { setUser(u); setReady(true); } }).catch(() => setReady(true));
    const { data: sub } = getSupabase().auth.onAuthStateChange((_ev, session) => {
      setUser(session?.user ?? null);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  if (!ready) {
    return <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', color: 'var(--text-secondary)' }}>Carregando…</div>;
  }
  if (!user) return <AuthGate onAuthed={async () => setUser(await getUser())} />;
  return <Dashboard user={user} />;
}
