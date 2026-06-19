import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

const BUCKET_NAME = 'campaign-images';

export async function POST(request: Request) {
  try {
    // 1. Validar autorização (Segurança para evitar abusos externos)
    const authHeader = request.headers.get('Authorization');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!authHeader || authHeader !== `Bearer ${serviceRoleKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Obter dados do body
    const { base64, filename } = await request.json();

    if (!base64 || !filename) {
      return NextResponse.json({ error: 'Missing base64 or filename parameter' }, { status: 400 });
    }

    // 3. Limpar prefixo data:image/...;base64, se houver
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');

    // 4. Decodificar para buffer
    const fileBuffer = Buffer.from(base64Data, 'base64');

    // 5. Instanciar Supabase com service role key
    const supabase = getServerSupabase();

    // 6. Fazer upload para o bucket
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, fileBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: `Upload error: ${uploadError.message}` }, { status: 500 });
    }

    // 7. Obter URL pública
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Base64 upload error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
