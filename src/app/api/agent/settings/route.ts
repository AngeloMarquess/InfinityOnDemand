import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

// GET — Load settings for a client
export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('clientId') || 'default';

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('agent_settings')
      .select('*')
      .eq('client_id', clientId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found, which is fine for new setup
      console.warn('agent_settings query error:', error.message);
    }

    return NextResponse.json({
      settings: data || {
        client_id: clientId,
        business_name: '',
        business_segment: '',
        business_description: '',
        target_audience: '',
        competitors: [],
        brand_tone: 'profissional e acessível',
        openai_api_key: '',
        instagram_token: '',
        meta_ads_token: '',
        meta_ad_account_id: '',
        flash_rules: '',
        flash_products: '',
        flash_pricing: '',
        flash_faq: '',
        flash_restrictions: '',
      },
    });
  } catch {
    return NextResponse.json({
      settings: { client_id: clientId, business_name: '', business_segment: '', business_description: '', target_audience: '', competitors: [], brand_tone: '', openai_api_key: '' },
    });
  }
}

// POST — Save settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientId = body.client_id || 'default';

    const settingsData = {
      client_id: clientId,
      business_name: body.business_name || '',
      business_segment: body.business_segment || '',
      business_description: body.business_description || '',
      target_audience: body.target_audience || '',
      competitors: body.competitors || [],
      brand_tone: body.brand_tone || '',
      openai_api_key: body.openai_api_key || '',
      instagram_token: body.instagram_token || '',
      meta_ads_token: body.meta_ads_token || '',
      meta_ad_account_id: body.meta_ad_account_id || '',
      flash_rules: body.flash_rules || '',
      flash_products: body.flash_products || '',
      flash_pricing: body.flash_pricing || '',
      flash_faq: body.flash_faq || '',
      flash_restrictions: body.flash_restrictions || '',
      updated_at: new Date().toISOString(),
    };

    const supabase = getServerSupabase();
    const { error } = await supabase
      .from('agent_settings')
      .upsert(settingsData, { onConflict: 'client_id' });

    if (error) {
      console.error('agent_settings upsert error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
