import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// Configuração padrão do anúncio do topo
let currentAnnouncement = {
  active: true,
  badgeText: '■ Black Friday Sale',
  headline: 'Garanta 50% de Desconto',
  buttonText: 'Aproveitar Agora →',
  buttonLink: '/crm',
  termsText: '*Termos & Condições aplicáveis',
  displayTarget: 'all', // 'all' | 'crm_only' | 'site_only'
  theme: 'honey_purple', // 'honey_purple' | 'infinity_cyan' | 'gold_amber'
};

export async function GET() {
  return NextResponse.json(currentAnnouncement, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    currentAnnouncement = {
      ...currentAnnouncement,
      ...body,
    };
    return NextResponse.json({ success: true, announcement: currentAnnouncement }, { status: 200, headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro ao processar anúncio' }, { status: 400, headers: corsHeaders });
  }
}
