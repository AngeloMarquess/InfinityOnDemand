import { NextRequest, NextResponse } from 'next/server';

const META_API = 'https://graph.facebook.com/v21.0';

export async function GET(request: NextRequest) {
  try {
    const token = process.env.META_USER_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const adsetId = searchParams.get('adsetId');

    if (!adsetId) {
      return NextResponse.json({ error: 'Missing adsetId' }, { status: 400 });
    }

    const fields = 'name,status,creative,adset_id,created_time';
    const res = await fetch(
      `${META_API}/${adsetId}/ads?fields=${fields}&limit=50&access_token=${token}`
    );
    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    return NextResponse.json({ ads: data.data || [] });
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
      adsetId,
      imageUrl,
      message,
      headline,
      callToAction,
      linkUrl,
      status,
      accountId,
    } = body;

    const adAccountId = accountId || process.env.META_AD_ACCOUNT_ID;
    const pageId = process.env.META_PAGE_ID;

    if (!name || !adsetId) {
      return NextResponse.json({ error: 'name and adsetId are required' }, { status: 400 });
    }

    // Step 1: Upload image to ad account (if imageUrl provided)
    let imageHash: string | undefined;
    if (imageUrl) {
      const imgParams = new URLSearchParams();
      imgParams.append('url', imageUrl);

      const imgRes = await fetch(`${META_API}/${adAccountId}/adimages?access_token=${token}`, {
        method: 'POST',
        body: imgParams,
      });
      const imgData = await imgRes.json();

      if (imgData.error) {
        return NextResponse.json({ error: `Image upload failed: ${imgData.error.message}` }, { status: 400 });
      }

      // Extract hash from response
      const images = imgData.images;
      if (images) {
        const firstKey = Object.keys(images)[0];
        imageHash = images[firstKey]?.hash;
      }
    }

    // Step 2: Create ad creative
    const creativeData: Record<string, unknown> = {
      name: `Creative - ${name}`,
      object_story_spec: {
        page_id: pageId,
        link_data: {
          message: message || '',
          link: linkUrl || 'https://infinityondemand.com.br',
          name: headline || name,
          call_to_action: {
            type: callToAction || 'LEARN_MORE',
          },
          ...(imageHash ? { image_hash: imageHash } : {}),
        },
      },
    };

    const creativeParams = new URLSearchParams();
    Object.entries(creativeData).forEach(([key, value]) => {
      creativeParams.append(key, typeof value === 'string' ? value : JSON.stringify(value));
    });

    const creativeRes = await fetch(`${META_API}/${adAccountId}/adcreatives?access_token=${token}`, {
      method: 'POST',
      body: creativeParams,
    });
    const creative = await creativeRes.json();

    if (creative.error) {
      return NextResponse.json({ error: `Creative creation failed: ${creative.error.message}` }, { status: 400 });
    }

    // Step 3: Create the ad
    const adParams = new URLSearchParams();
    adParams.append('name', name);
    adParams.append('adset_id', adsetId);
    adParams.append('creative', JSON.stringify({ creative_id: creative.id }));
    adParams.append('status', status || 'PAUSED');

    const adRes = await fetch(`${META_API}/${adAccountId}/ads?access_token=${token}`, {
      method: 'POST',
      body: adParams,
    });
    const adData = await adRes.json();

    if (adData.error) {
      return NextResponse.json({ error: `Ad creation failed: ${adData.error.message}` }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      adId: adData.id,
      creativeId: creative.id,
      imageHash,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
