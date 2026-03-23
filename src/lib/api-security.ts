import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

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

// ─── API Key Authentication ───
// Validates requests using a shared secret key.
// The CRM and internal services must send this key in the header:
//   Authorization: Bearer <FLASH_API_SECRET>
//
// The key is stored in .env.local as FLASH_API_SECRET

export function validateApiKey(request: NextRequest): { valid: boolean; error?: NextResponse } {
  const secret = getEnvVar('FLASH_API_SECRET');
  
  if (!secret) {
    console.warn('⚠️ FLASH_API_SECRET not configured — API authentication disabled');
    return { valid: true }; // Fail open in dev, but log warning
  }

  // Allow same-origin requests (internal Next.js pages calling their own APIs)
  const origin = request.headers.get('origin') || '';
  const referer = request.headers.get('referer') || '';
  const allowedOrigins = [
    'https://flash.infinityondemand.com.br',
    'https://infinityondemand.com.br',
    'https://www.infinityondemand.com.br',
    'http://localhost:3000',
    'http://localhost:3001',
  ];
  const isSameOrigin = allowedOrigins.some(o => origin.startsWith(o) || referer.startsWith(o));
  if (isSameOrigin) return { valid: true };

  // Cross-origin requests require Bearer token
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return {
      valid: false,
      error: NextResponse.json(
        { error: 'Authentication required. Send Authorization: Bearer <API_KEY>' },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.replace('Bearer ', '').trim();
  
  if (token !== secret) {
    return {
      valid: false,
      error: NextResponse.json(
        { error: 'Invalid API key' },
        { status: 403 }
      ),
    };
  }

  return { valid: true };
}

// ─── Rate Limiter ───
// Simple in-memory rate limiter per IP address.
// Tracks request counts per window (default: 60s).
// Resets automatically when the window expires.

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
  
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
  
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();
  
  let entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetAt) {
    entry = { count: 1, resetAt: now + windowMs };
    rateLimitStore.set(key, entry);
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  entry.count++;
  
  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      error: NextResponse.json(
        { error: 'Too many requests. Try again later.', retryAfter },
        { 
          status: 429,
          headers: { 'Retry-After': String(retryAfter) }
        }
      ),
    };
  }
  
  return { allowed: true, remaining: maxRequests - entry.count };
}
