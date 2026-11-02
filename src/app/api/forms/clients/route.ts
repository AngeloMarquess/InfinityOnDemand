import { NextResponse } from 'next/server';
import { getAllClients, saveClient } from '@/lib/forms-storage';

export async function GET() {
  try {
    const clients = getAllClients();
    return NextResponse.json({ clients });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.company) {
      return NextResponse.json({ error: 'Nome da empresa é obrigatório' }, { status: 400 });
    }

    const saved = saveClient(body);
    return NextResponse.json({ success: true, client: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
