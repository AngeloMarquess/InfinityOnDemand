import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

// ─── Environment Variable Reader ───
function getEnvVar(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  try {
    const envPath = join(process.cwd(), '.env.local');
    const content = readFileSync(envPath, 'utf-8');
    const match = content.match(new RegExp(`^${name}=(.+)$`, 'm'));
    return match?.[1]?.trim() || undefined;
  } catch {
    return undefined;
  }
}

// ─── API Key & Session Authentication ───
// Validates requests using:
// 1. Shared secret key (FLASH_API_SECRET) for internal services/cron jobs
// 2. Supabase User JWT for authenticated CRM dashboard requests
export async function validateApiKey(request: NextRequest): Promise<{ valid: boolean; error?: NextResponse; user?: any }> {
  const secret = getEnvVar('FLASH_API_SECRET');
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  
  if (!authHeader) {
    return {
      valid: false,
      error: NextResponse.json(
        { error: 'Autenticação necessária. Envie Authorization: Bearer <TOKEN>' },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  // 1. Chave secreta de serviço backend (cron/internal)
  if (secret && token === secret) {
    return { valid: true };
  }

  // 2. Validação de token JWT do Supabase (usuário logado no CRM)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && serviceKey && token.length > 20) {
    try {
      const supabase = createClient(supabaseUrl, serviceKey);
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        return { valid: true, user };
      }
    } catch {
      // Falha ao validar token
    }
  }

  return {
    valid: false,
    error: NextResponse.json(
      { error: 'Chave ou token de autenticação inválido.' },
      { status: 403 }
    ),
  };
}

// ─── Rate Limiter ───
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function rateLimit(
  request: NextRequest,
  options: { maxRequests?: number; windowMs?: number; keyPrefix?: string } = {}
): { allowed: boolean; error?: NextResponse; remaining: number } {
  const { maxRequests = 30, windowMs = 60_000, keyPrefix = 'global' } = options;

  // Extract client IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0].trim() : realIp || 'unknown';

  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    // First request or window expired
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      error: NextResponse.json(
        {
          error: 'Muitas requisições. Tente novamente mais tarde.',
          retryAfter: retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSeconds),
          },
        }
      ),
    };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}
