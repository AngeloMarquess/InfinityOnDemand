import { NextResponse } from 'next/server';
import { getSubscriptionInfo, checkPlanLimit } from '@/lib/crm/subscription';

// GET /api/crm/subscription?user_id=xxx — returns current plan info
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'user_id é obrigatório.' }, { status: 400 });
  }

  const info = await getSubscriptionInfo(userId);

  if (!info) {
    return NextResponse.json({ error: 'Perfil não encontrado.' }, { status: 404 });
  }

  return NextResponse.json(info);
}

// POST /api/crm/subscription — check if action is allowed
export async function POST(request: Request) {
  const { user_id, resource } = await request.json();

  if (!user_id || !resource) {
    return NextResponse.json({ error: 'user_id e resource são obrigatórios.' }, { status: 400 });
  }

  const validResources = ['leads', 'proposals', 'services', 'tasks'];
  if (!validResources.includes(resource)) {
    return NextResponse.json({ error: `resource deve ser: ${validResources.join(', ')}` }, { status: 400 });
  }

  const result = await checkPlanLimit(user_id, resource as 'leads' | 'proposals' | 'services' | 'tasks');

  if (!result.allowed) {
    return NextResponse.json({
      error: `Limite do plano ${result.plan} atingido. Você tem ${result.current}/${result.limit} ${resource}. Faça upgrade para continuar.`,
      ...result,
    }, { status: 403 });
  }

  return NextResponse.json(result);
}
