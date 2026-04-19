import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Client público (pode ser usado no front-end) — lazy init
let _supabase: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }
  return _supabase;
}

// Backward compat - proxy to lazy getter
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  }
});

// Server client (só em API routes — tem acesso total)
// Lê env vars no momento da chamada, nunca no nível do módulo
export function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL is not set');
  }
  return createClient(url, key);
}
