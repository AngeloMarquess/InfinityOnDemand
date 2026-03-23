import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateApiKey, rateLimit } from '@/lib/api-security';

/**
 * GET /api/prospecting/email-logs
 * Returns a list of leads that were contacted by Flash Email.
 * Requires: Authorization: Bearer <FLASH_API_SECRET>
 */
export async function GET(request: NextRequest) {
  const auth = validateApiKey(request);
  if (!auth.valid) return auth.error!;

  const rl = rateLimit(request, { maxRequests: 30, windowMs: 60_000, keyPrefix: 'email-logs' });
  if (!rl.allowed) return rl.error!;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const crmOwnerId = process.env.CRM_OWNER_USER_ID;

    if (!supabaseUrl || !supabaseServiceKey || !crmOwnerId) {
      return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50');

    // Fetch contacts that have been emailed by Flash
    const { data, error } = await supabase
      .from('crm_contacts')
      .select('id, name, email, notes, updated_at, city, stage_id')
      .eq('user_id', crmOwnerId)
      .like('notes', '%Flash prospectou por email%')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Parse each log entry
    const emails = (data || []).map(lead => {
      // Extract subject from notes: Assunto: "xxx"
      const subjectMatch = lead.notes?.match(/Assunto: "([^"]+)"/);
      const subject = subjectMatch?.[1] || 'Sem assunto';
      
      // Extract date from notes: Flash prospectou por email em DD/MM/YYYY
      const dateMatch = lead.notes?.match(/Flash prospectou por email em (\d{2}\/\d{2}\/\d{4})/);
      const sentDate = dateMatch?.[1] || new Date(lead.updated_at).toLocaleDateString('pt-BR');

      return {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        subject,
        sentDate,
        city: lead.city,
        updatedAt: lead.updated_at,
      };
    });

    return NextResponse.json({ emails, total: emails.length });
  } catch (error) {
    console.error('Email logs error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
