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

    if (!accountId) {
      return NextResponse.json({ error: 'Missing accountId' }, { status: 400 });
    }

    const fields = 'name,objective,status,daily_budget,lifetime_budget,start_time,stop_time,created_time,updated_time,buying_type';
    const res = await fetch(
      `${META_API}/${accountId}/campaigns?fields=${fields}&limit=50&access_token=${token}`
    );
    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    const campaigns = (data.data || []).map((c: Record<string, unknown>) => ({
      id: c.id,
      name: c.name,
      objective: c.objective,
      status: c.status,
      dailyBudget: c.daily_budget ? Number(c.daily_budget) / 100 : null,
      lifetimeBudget: c.lifetime_budget ? Number(c.lifetime_budget) / 100 : null,
      startTime: c.start_time,
      stopTime: c.stop_time,
      createdTime: c.created_time,
      buyingType: c.buying_type,
    }));

    return NextResponse.json({ campaigns });
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
    const { name, objective, dailyBudget, status, accountId } = body;
    const adAccountId = accountId || process.env.META_AD_ACCOUNT_ID;

    if (!name || !objective) {
      return NextResponse.json({ error: 'name and objective are required' }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.append('name', name);
    params.append('objective', objective);
    params.append('status', status || 'PAUSED');
    params.append('special_ad_categories', '[]');

    if (dailyBudget) {
      params.append('daily_budget', String(Math.round(dailyBudget * 100)));
    }

    const res = await fetch(`${META_API}/${adAccountId}/campaigns?access_token=${token}`, {
      method: 'POST',
      body: params,
    });

    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, campaignId: data.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
