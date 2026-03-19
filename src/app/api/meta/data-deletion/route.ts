import { NextRequest, NextResponse } from 'next/server';

// Meta Data Deletion Callback
// Quando um usuário remove o app, a Meta envia um request para este endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { signed_request } = body;

    if (!signed_request) {
      return NextResponse.json({ error: 'Missing signed_request' }, { status: 400 });
    }

    // Em produção, decodificar e verificar o signed_request
    // Para compliance da Meta, retornamos um confirmation_code e url
    const confirmationCode = `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://infinityondemand.com.br'}/privacy`,
      confirmation_code: confirmationCode,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
