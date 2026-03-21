import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Admin emails allowed to access Infinity Analytics
// Set ANALYTICS_ADMIN_EMAILS in .env as comma-separated emails
// Example: ANALYTICS_ADMIN_EMAILS=admin@infinityondemand.com.br,angelo@infinity.com
const getAdminEmails = (): string[] => {
  const envEmails = process.env.ANALYTICS_ADMIN_EMAILS;
  if (envEmails) {
    return envEmails.split(',').map(e => e.trim().toLowerCase());
  }
  // Default: allow all authenticated Supabase users
  return [];
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    // Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      console.error('Auth error:', authError?.message);
      return NextResponse.json({ error: 'Email ou senha inválidos' }, { status: 401 });
    }

    // Check admin whitelist
    const adminEmails = getAdminEmails();
    const userEmail = authData.user.email?.toLowerCase() || '';

    if (adminEmails.length > 0 && !adminEmails.includes(userEmail)) {
      return NextResponse.json({ 
        error: 'Acesso negado. Seu email não tem permissão de administrador.' 
      }, { status: 403 });
    }

    // Return session info
    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: 'admin',
      },
      token: authData.session?.access_token,
    });
  } catch (error) {
    console.error('Analytics auth error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
