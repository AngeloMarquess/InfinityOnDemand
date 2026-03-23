import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validateApiKey, rateLimit } from '@/lib/api-security';

// GET — List conversations or messages for a specific phone
export async function GET(request: NextRequest) {
  const auth = validateApiKey(request);
  if (!auth.valid) return auth.error!;

  const rl = rateLimit(request, { maxRequests: 30, windowMs: 60_000, keyPrefix: 'wa-conv-read' });
  if (!rl.allowed) return rl.error!;

  const phone = request.nextUrl.searchParams.get('phone');

  if (phone) {
    // Get messages for a specific phone number
    const { data, error } = await supabase
      .from('whatsapp_conversations')
      .select('role, message, created_at')
      .eq('phone', phone)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({ messages: data || [] });
  }

  // Get unique conversations (grouped by phone)
  const { data, error } = await supabase
    .from('whatsapp_conversations')
    .select('phone, name, role, message, status, created_at')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ conversations: [] });
  }

  // Group by phone and get latest message
  const grouped: Record<string, {
    phone: string; name: string; lastMessage: string;
    lastTime: string; status: string; messageCount: number;
  }> = {};

  for (const row of (data || [])) {
    if (!grouped[row.phone]) {
      grouped[row.phone] = {
        phone: row.phone,
        name: row.name || row.phone,
        lastMessage: row.message,
        lastTime: row.created_at,
        status: row.status || 'open',
        messageCount: 1,
      };
    } else {
      grouped[row.phone].messageCount++;
    }
  }

  const conversations = Object.values(grouped).sort(
    (a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
  );

  return NextResponse.json({ conversations });
}

// POST — Save a manual message
export async function POST(request: NextRequest) {
  const auth = validateApiKey(request);
  if (!auth.valid) return auth.error!;

  const rl = rateLimit(request, { maxRequests: 10, windowMs: 60_000, keyPrefix: 'wa-conv-write' });
  if (!rl.allowed) return rl.error!;

  try {
    const { phone, message, role = 'flash' } = await request.json();

    const { error } = await supabase.from('whatsapp_conversations').insert({
      phone,
      name: 'Angelo',
      role,
      message,
      status: 'open',
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
