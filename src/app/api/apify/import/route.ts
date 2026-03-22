import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;

interface ApifyGoogleMapsItem {
  title?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  countryCode?: string;
  website?: string;
  totalScore?: number;
  reviewsCount?: number;
  categoryName?: string;
  categories?: string[];
  url?: string;
  address?: string;
  emails?: string[];
  instagrams?: string[];
  facebooks?: string[];
  // Alternate field names from different scrapers
  Place_name?: string;
  Phone?: string;
  Street?: string;
  City?: string;
  State?: string;
}

function formatBrazilianPhone(raw: string | undefined | null): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, '');
  // Must have at least 10 digits (DDD + 8-digit number)
  if (digits.length < 10) return null;
  // Add country code if missing
  if (!digits.startsWith('55')) {
    digits = '55' + digits;
  }
  // Add 9 for mobile numbers if needed
  const ddd = digits.substring(2, 4);
  const body = digits.substring(4);
  if (body.length === 8 && /^[6-9]/.test(body)) {
    digits = `55${ddd}9${body}`;
  }
  // Valid Brazilian mobile: 55 + 2 DDD + 9 digits = 13 digits
  if (digits.length < 12 || digits.length > 13) return null;
  return digits;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { datasetId, items: directItems } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const crmOwnerId = process.env.CRM_OWNER_USER_ID;

    if (!supabaseUrl || !supabaseServiceKey || !crmOwnerId) {
      return NextResponse.json({ error: 'Missing server configuration' }, { status: 500 });
    }

    // ─── Fetch items from Apify or use direct JSON ───
    let items: ApifyGoogleMapsItem[] = [];

    if (directItems && Array.isArray(directItems)) {
      items = directItems;
    } else if (datasetId) {
      if (!APIFY_API_TOKEN) {
        return NextResponse.json({ error: 'APIFY_API_TOKEN not configured. Add it to .env.local' }, { status: 400 });
      }
      const url = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_API_TOKEN}&format=json`;
      const res = await fetch(url);
      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ error: `Apify API error: ${err}` }, { status: 400 });
      }
      items = await res.json();
    } else {
      return NextResponse.json({ error: 'Provide datasetId or items array' }, { status: 400 });
    }

    if (!items.length) {
      return NextResponse.json({ error: 'No items found in dataset' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get "Novo Lead" stage
    const { data: stages } = await supabase
      .from('crm_stages')
      .select('id')
      .eq('user_id', crmOwnerId)
      .eq('name', 'Novo Lead')
      .limit(1);

    const novoLeadStageId = stages?.[0]?.id || null;

    // Get existing phones to deduplicate
    const { data: existingContacts } = await supabase
      .from('crm_contacts')
      .select('phone')
      .eq('user_id', crmOwnerId)
      .not('phone', 'is', null);

    const existingPhones = new Set(
      (existingContacts || []).map(c => c.phone).filter(Boolean)
    );

    // Process and deduplicate items
    let imported = 0;
    let skipped = 0;
    let noPhone = 0;

    const leadsToInsert = [];

    for (const item of items) {
      const placeName = item.title || item.Place_name || 'Sem nome';
      const rawPhone = item.phone || item.Phone;
      const formattedPhone = formatBrazilianPhone(rawPhone);

      if (!formattedPhone) {
        noPhone++;
        continue;
      }

      if (existingPhones.has(formattedPhone)) {
        skipped++;
        continue;
      }

      // Mark as seen to avoid duplicates within this batch
      existingPhones.add(formattedPhone);

      const city = item.city || item.City || '';
      const state = item.state || item.State || '';
      const street = item.street || item.Street || '';
      const rating = item.totalScore || 0;
      const reviews = item.reviewsCount || 0;
      const website = item.website || '';
      const categories = item.categoryName || (item.categories || []).join(', ') || '';
      const googleUrl = item.url || '';
      const email = (item.emails && item.emails.length > 0) ? item.emails[0] : null;
      const instagram = (item.instagrams && item.instagrams.length > 0) ? item.instagrams[0] : null;

      const notes = [
        `📍 Lead capturado via Apify (Google Maps) em ${new Date().toLocaleDateString('pt-BR')}.`,
        rating ? `⭐ Nota: ${rating} (${reviews} avaliações)` : '',
        categories ? `📂 Categoria: ${categories}` : '',
        street ? `📍 Endereço: ${street}` : '',
        website ? `🌐 Site: ${website}` : '',
        email ? `📧 Email: ${email}` : '',
        instagram ? `📸 Instagram: ${instagram}` : '',
        googleUrl ? `🗺 Maps: ${googleUrl}` : '',
      ].filter(Boolean).join('\n');

      leadsToInsert.push({
        user_id: crmOwnerId,
        name: placeName,
        phone: formattedPhone,
        email: email,
        company: placeName,
        city: city,
        state: state,
        origin: 'apify',
        contact_type: 'lead',
        stage_id: novoLeadStageId,
        notes: notes,
        estimated_value: 0,
        address: street || null,
      });
    }

    // Batch insert (max 50 at a time to avoid timeout)
    const batchSize = 50;
    for (let i = 0; i < leadsToInsert.length; i += batchSize) {
      const batch = leadsToInsert.slice(i, i + batchSize);
      const { error } = await supabase.from('crm_contacts').insert(batch);
      if (error) {
        console.error('Batch insert error:', error);
        return NextResponse.json({
          error: `Insert error at batch ${Math.floor(i / batchSize) + 1}: ${error.message}`,
          imported,
          skipped,
          noPhone,
        }, { status: 500 });
      }
      imported += batch.length;
    }

    return NextResponse.json({
      success: true,
      total: items.length,
      imported,
      skipped,
      noPhone,
      message: `${imported} leads importados para o CRM. ${skipped} duplicados ignorados. ${noPhone} sem telefone válido.`,
    });
  } catch (error) {
    console.error('Apify import error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
