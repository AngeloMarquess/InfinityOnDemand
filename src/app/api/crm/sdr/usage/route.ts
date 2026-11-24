import { NextResponse } from 'next/server';

const DEFAULT_APIFY_TOKEN = process.env.APIFY_API_TOKEN || '';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token') || DEFAULT_APIFY_TOKEN;

    if (!token) {
      return NextResponse.json({ ok: false, error: 'Token Apify não configurado' }, { status: 400 });
    }

    const [usageRes, userRes] = await Promise.all([
      fetch(`https://api.apify.com/v2/users/me/usage/monthly?token=${token}`),
      fetch(`https://api.apify.com/v2/users/me?token=${token}`),
    ]);

    if (!usageRes.ok || !userRes.ok) {
      return NextResponse.json({
        ok: false,
        error: 'Falha ao consultar a API do Apify',
      }, { status: 502 });
    }

    const usageJson = await usageRes.json();
    const userJson = await userRes.json();

    const totalUsage = usageJson.data?.totalUsageCreditsUsdAfterVolumeDiscount || 0;
    const maxCredits = userJson.data?.plan?.monthlyUsageCreditsUsd || 5.0;
    const cycle = usageJson.data?.usageCycle || {};

    return NextResponse.json({
      ok: true,
      data: {
        username: userJson.data?.username || 'infinityondemand',
        plan: userJson.data?.plan?.id || 'FREE',
        totalUsageUsd: totalUsage,
        totalUsageBrl: totalUsage * 6.0, // Cotação base R$ 6,00
        monthlyLimitUsd: maxCredits,
        remainingCreditsUsd: Math.max(0, maxCredits - totalUsage),
        cycleStart: cycle.startAt,
        cycleEnd: cycle.endAt,
        costPerLeadUsd: 0.004,
        costPerLeadBrl: 0.024,
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar usage do Apify:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
