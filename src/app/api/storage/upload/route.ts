import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const BUCKET_NAME = 'campaign-images';

// POST — Cria o bucket e faz upload de todas as imagens da pasta public/campaign
export async function POST() {
  try {
    const supabase = getServerSupabase();

    // 1. Criar bucket (ignora se já existe)
    const { error: bucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    });

    if (bucketError && !bucketError.message.includes('already exists')) {
      return NextResponse.json({ error: `Bucket error: ${bucketError.message}` }, { status: 500 });
    }

    // 2. Ler imagens da pasta public/campaign
    const campaignDir = path.join(process.cwd(), 'public', 'campaign');
    
    if (!fs.existsSync(campaignDir)) {
      return NextResponse.json({ error: 'Pasta public/campaign não encontrada' }, { status: 404 });
    }

    const files = fs.readdirSync(campaignDir).filter(f => 
      f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.webp')
    );

    const results: { file: string; url?: string; error?: string }[] = [];

    for (const filename of files) {
      const filePath = path.join(campaignDir, filename);
      const fileBuffer = fs.readFileSync(filePath);
      
      const contentType = filename.endsWith('.png') ? 'image/png' 
        : filename.endsWith('.webp') ? 'image/webp' 
        : 'image/jpeg';

      // Upload (upsert para substituir se já existir)
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filename, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        results.push({ file: filename, error: uploadError.message });
        continue;
      }

      // Gerar URL pública
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filename);

      results.push({ file: filename, url: urlData.publicUrl });
    }

    const successCount = results.filter(r => r.url).length;
    const errorCount = results.filter(r => r.error).length;

    return NextResponse.json({
      success: true,
      bucket: BUCKET_NAME,
      total: files.length,
      uploaded: successCount,
      errors: errorCount,
      results,
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Upload error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET — Lista as imagens do bucket com URLs públicas
export async function GET() {
  try {
    const supabase = getServerSupabase();

    const { data: files, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', { limit: 100 });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const images = (files || []).map(file => {
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(file.name);
      
      return {
        name: file.name,
        url: urlData.publicUrl,
        size: file.metadata?.size,
        createdAt: file.created_at,
      };
    });

    return NextResponse.json({ images, count: images.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
