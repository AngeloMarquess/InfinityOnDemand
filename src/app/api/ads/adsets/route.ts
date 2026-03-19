import { NextRequest, NextResponse } from 'next/server';

const META_API = 'https://graph.facebook.com/v21.0';

export async function GET(request: NextRequest) {
  try {
    const token = process.env.META_USER_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    if (!campaignId) {
      return NextResponse.json({ error: 'Missing campaignId' }, { status: 400 });
    }

    const fields = 'name,status,daily_budget,targeting,optimization_goal,billing_event,bid_amount,start_time,end_time';
    const res = await fetch(
      `${META_API}/${campaignId}/adsets?fields=${fields}&limit=50&access_token=${token}`
    );
    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    const adsets = (data.data || []).map((a: Record<string, unknown>) => ({
      id: a.id,
      name: a.name,
      status: a.status,
      dailyBudget: a.daily_budget ? Number(a.daily_budget) / 100 : null,
      targeting: a.targeting,
      optimizationGoal: a.optimization_goal,
      billingEvent: a.billing_event,
      startTime: a.start_time,
      endTime: a.end_time,
    }));

    return NextResponse.json({ adsets });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = process.env.META_USER_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 500 });
    }

    const body = await request.json();
    const {
      name,
      campaignId,
      dailyBudget,
      optimizationGoal,
      billingEvent,
      targeting,
      status,
      startTime,
      endTime,
      accountId,
    } = body;

    const adAccountId = accountId || process.env.META_AD_ACCOUNT_ID;

    if (!name || !campaignId) {
      return NextResponse.json({ error: 'name and campaignId are required' }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.append('name', name);
    params.append('campaign_id', campaignId);
    params.append('status', status || 'PAUSED');
    params.append('billing_event', billingEvent || 'IMPRESSIONS');
    params.append('optimization_goal', optimizationGoal || 'REACH');

    if (dailyBudget) {
      params.append('daily_budget', String(Math.round(dailyBudget * 100)));
    }

    if (targeting) {
      params.append('targeting', JSON.stringify(targeting));
    } else {
      // Default targeting: Brazil, 18-65
      params.append('targeting', JSON.stringify({
        geo_locations: { countries: ['BR'] },
        age_min: 18,
        age_max: 65,
      }));
    }

    if (startTime) params.append('start_time', startTime);
    if (endTime) params.append('end_time', endTime);

    const res = await fetch(`${META_API}/${adAccountId}/adsets?access_token=${token}`, {
      method: 'POST',
      body: params,
    });

    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, adsetId: data.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
