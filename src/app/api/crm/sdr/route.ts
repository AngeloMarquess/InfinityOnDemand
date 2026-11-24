import { NextResponse } from 'next/server';

const DEFAULT_APIFY_TOKEN = process.env.APIFY_API_TOKEN || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nicho, cidade, estado, cep, raioKm, lat, lng, limite = 15, minRating = 4.5, token } = body;

    const apifyToken = token || DEFAULT_APIFY_TOKEN;

    // Constrói termo de busca inteligente com base no Nicho e Localização
    const nichoAlvo = nicho?.trim() || 'Empresas';
    let searchTerm = `${nichoAlvo} em ${cidade ? `${cidade}, ` : ''}${estado || 'Brasil'}`;
    
    if (cep) {
      const cleanCep = cep.replace(/\D/g, '');
      searchTerm = `${nichoAlvo} perto de CEP ${cleanCep}${raioKm ? ` raio ${raioKm}km` : ''}`;
    }

    // Executa o crawler de Google Places do Apify
    const apifyUrl = `https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=${apifyToken}&timeout=50`;

    const runInput: any = {
      searchStringsArray: [searchTerm],
      maxCrawledPlacesPerSearch: Math.min(Number(limite) || 15, 50),
      language: 'pt-BR',
      countryCode: 'br',
      skipClosedPlaces: true,
    };

    if (cep) {
      runInput.postalCode = cep.replace(/\D/g, '');
    }

    if (lat && lng) {
      runInput.customGeolocation = {
        type: 'Point',
        coordinates: [Number(lng), Number(lat)],
      };
    }

    const apifyRes = await fetch(apifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(runInput),
    });

    if (!apifyRes.ok) {
      const errText = await apifyRes.text();
      console.warn('Apify run response:', errText);
      return NextResponse.json(
        {
          ok: false,
          message: 'Apify timeout or busy, returning simulated fallback',
          leads: [],
        },
        { headers: corsHeaders }
      );
    }

    const rawItems = await apifyRes.json();
    const leads = (Array.isArray(rawItems) ? rawItems : []).map((p: any, idx: number) => {
      const rawPhone = p.phone || p.phoneNumber || '';
      const cleanPhone = rawPhone.replace(/\D/g, '');
      const whatsapp = cleanPhone.length >= 10 ? (cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`) : '';
      const titleName = p.title || p.name || `${nichoAlvo} Local ${idx + 1}`;

      return {
        id: p.placeId || `apify_${Date.now()}_${idx}`,
        name: titleName,
        tradeName: titleName,
        phone: rawPhone,
        whatsapp,
        email: p.email || (p.emails && p.emails[0]) || '',
        website: p.website || p.url || '',
        rating: p.totalScore || p.rating || 5.0,
        reviewsCount: p.reviewsCount || 0,
        address: p.address || p.street || cidade || (cep ? `CEP ${cep}` : ''),
        city: p.city || cidade || 'Belo Horizonte',
        state: estado || 'MG',
        categoryName: p.categoryName || nichoAlvo,
        instagram: p.instagram || (p.socials && p.socials.instagram) || '',
        location: p.location || (lat && lng ? { lat: Number(lat), lng: Number(lng) } : undefined),
      };
    });

    return NextResponse.json(
      {
        ok: true,
        total: leads.length,
        leads,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Erro na API SDR Apify:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}
