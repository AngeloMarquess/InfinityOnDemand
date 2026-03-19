import { NextResponse } from 'next/server';

const META_API = 'https://graph.facebook.com/v21.0';

export async function GET() {
  try {
    const token = process.env.META_USER_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Missing META_USER_ACCESS_TOKEN' }, { status: 500 });
    }

    const res = await fetch(
      `${META_API}/me/adaccounts?fields=name,account_id,account_status,currency,business_name&access_token=${token}`
    );
    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    // Filter only active accounts (status 1)
    const accounts = (data.data || []).map((acc: Record<string, unknown>) => ({
      id: acc.id,
      accountId: acc.account_id,
      name: acc.name,
      status: acc.account_status,
      currency: acc.currency,
      businessName: acc.business_name,
    }));

    return NextResponse.json({ accounts });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
