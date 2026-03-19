import { NextRequest, NextResponse } from 'next/server';

const META_API = 'https://graph.facebook.com/v21.0';

export async function GET(request: NextRequest) {
  try {
    const token = process.env.META_USER_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId') || process.env.META_AD_ACCOUNT_ID;
    const campaignId = searchParams.get('campaignId');
    const datePreset = searchParams.get('datePreset') || 'last_30d';
    const level = searchParams.get('level') || 'campaign';

    if (!accountId) {
      return NextResponse.json({ error: 'Missing accountId' }, { status: 400 });
    }

    const fields = 'campaign_name,campaign_id,impressions,clicks,ctr,cpc,cpm,spend,reach,frequency,actions,cost_per_action_type';
    let url = `${META_API}/${accountId}/insights?fields=${fields}&date_preset=${datePreset}&level=${level}&limit=50&access_token=${token}`;

    if (campaignId) {
      url = `${META_API}/${campaignId}/insights?fields=${fields}&date_preset=${datePreset}&access_token=${token}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    const insights = (data.data || []).map((i: Record<string, unknown>) => ({
      campaignName: i.campaign_name,
      campaignId: i.campaign_id,
      impressions: Number(i.impressions || 0),
      clicks: Number(i.clicks || 0),
      ctr: i.ctr ? parseFloat(String(i.ctr)) : 0,
      cpc: i.cpc ? parseFloat(String(i.cpc)) : 0,
      cpm: i.cpm ? parseFloat(String(i.cpm)) : 0,
      spend: i.spend ? parseFloat(String(i.spend)) : 0,
      reach: Number(i.reach || 0),
      frequency: i.frequency ? parseFloat(String(i.frequency)) : 0,
      actions: i.actions,
      costPerAction: i.cost_per_action_type,
    }));

    // Aggregate totals
    const totals = insights.reduce(
      (acc: Record<string, number>, i: Record<string, number>) => ({
        impressions: acc.impressions + i.impressions,
        clicks: acc.clicks + i.clicks,
        spend: acc.spend + i.spend,
        reach: acc.reach + i.reach,
      }),
      { impressions: 0, clicks: 0, spend: 0, reach: 0 }
    );

    return NextResponse.json({
      insights,
      totals: {
        ...totals,
        ctr: totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : '0',
        cpc: totals.clicks > 0 ? (totals.spend / totals.clicks).toFixed(2) : '0',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
