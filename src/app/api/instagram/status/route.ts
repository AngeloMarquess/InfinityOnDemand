import { NextRequest, NextResponse } from 'next/server';

const META_API = 'https://graph.facebook.com/v21.0';

export async function GET(request: NextRequest) {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const containerId = searchParams.get('id');

    if (!containerId) {
      return NextResponse.json({ error: 'Missing container id' }, { status: 400 });
    }

    const res = await fetch(
      `${META_API}/${containerId}?fields=status_code,status,id,timestamp&access_token=${token}`
    );
    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    return NextResponse.json({
      id: data.id,
      statusCode: data.status_code,
      status: data.status,
      timestamp: data.timestamp,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
