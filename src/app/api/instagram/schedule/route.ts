import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

const META_API = 'https://graph.facebook.com/v21.0';

interface ScheduleRequest {
  type: 'IMAGE' | 'CAROUSEL';
  imageUrl?: string;       // for single image
  imageUrls?: string[];    // for carousel
  caption: string;
  scheduledTime?: number;  // Unix timestamp (seconds)
  dayKey?: string;         // e.g. 'seg', 'ter', etc.
  platform?: 'instagram' | 'facebook' | 'both';
}

async function createMediaContainer(
  userId: string,
  token: string,
  imageUrl: string,
  caption?: string,
  isCarouselItem?: boolean,
  scheduledTime?: number,
) {
  const params = new URLSearchParams();
  params.append('image_url', imageUrl);

  if (isCarouselItem) {
    params.append('is_carousel_item', 'true');
  } else {
    if (caption) params.append('caption', caption);
    if (scheduledTime) {
      params.append('published', 'false');
      params.append('scheduled_publish_time', String(scheduledTime));
    }
  }

  const res = await fetch(`${META_API}/${userId}/media?access_token=${token}`, {
    method: 'POST',
    body: params,
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.id as string;
}

async function createCarouselContainer(
  userId: string,
  token: string,
  childrenIds: string[],
  caption: string,
  scheduledTime?: number,
) {
  const params = new URLSearchParams();
  params.append('media_type', 'CAROUSEL');
  params.append('caption', caption);
  params.append('children', childrenIds.join(','));

  if (scheduledTime) {
    params.append('published', 'false');
    params.append('scheduled_publish_time', String(scheduledTime));
  }

  const res = await fetch(`${META_API}/${userId}/media?access_token=${token}`, {
    method: 'POST',
    body: params,
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.id as string;
}

async function publishMedia(userId: string, token: string, containerId: string) {
  const params = new URLSearchParams();
  params.append('creation_id', containerId);

  const res = await fetch(`${META_API}/${userId}/media_publish?access_token=${token}`, {
    method: 'POST',
    body: params,
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.id as string;
}

async function checkContainerStatus(token: string, containerId: string) {
  const res = await fetch(
    `${META_API}/${containerId}?fields=status_code,status&access_token=${token}`
  );
  return await res.json();
}

async function waitForContainer(token: string, containerId: string, maxAttempts = 15) {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await checkContainerStatus(token, containerId);
    if (status.status_code === 'FINISHED') return true;
    if (status.status_code === 'ERROR') throw new Error(`Container error: ${status.status}`);
    if (status.status_code === 'EXPIRED') throw new Error('Container expired');
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error('Container processing timeout — tente novamente');
}

export async function POST(request: NextRequest) {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    const userId = process.env.INSTAGRAM_USER_ID;

    if (!token || !userId) {
      return NextResponse.json(
        { error: 'Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_USER_ID in .env.local' },
        { status: 500 }
      );
    }

    const body: ScheduleRequest = await request.json();
    const { type, imageUrl, imageUrls, caption, scheduledTime, dayKey } = body;

    // Validate scheduled time
    if (scheduledTime) {
      const now = Math.floor(Date.now() / 1000);
      const minTime = now + 600;
      const maxTime = now + 75 * 24 * 60 * 60;
      if (scheduledTime < minTime) {
        return NextResponse.json(
          { error: 'Horário deve ser pelo menos 10 min no futuro' },
          { status: 400 }
        );
      }
      if (scheduledTime > maxTime) {
        return NextResponse.json(
          { error: 'Horário não pode ser mais de 75 dias no futuro' },
          { status: 400 }
        );
      }
    }

    // Inicializar Supabase
    let supabase;
    try {
      supabase = getServerSupabase();
    } catch {
      // Supabase não configurado — continua sem persistir
      console.warn('Supabase not configured — posts will not be persisted');
    }

    // Salvar no Supabase com status 'processing'
    let supabaseRecordId: string | null = null;
    const allImageUrls = type === 'CAROUSEL' ? (imageUrls || []) : (imageUrl ? [imageUrl] : []);
    console.log('📸 Image URLs received:', allImageUrls);
    
    if (supabase) {
      const { data: record, error: insertError } = await supabase
        .from('scheduled_posts')
        .insert({
          platform: 'instagram',
          post_type: type,
          caption,
          image_urls: allImageUrls,
          scheduled_time: scheduledTime ? new Date(scheduledTime * 1000).toISOString() : null,
          status: 'processing',
          day_key: dayKey || null,
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Supabase insert error:', insertError.message);
      } else {
        supabaseRecordId = record.id;
      }
    }

    let containerId: string;
    let publishedId: string | undefined;

    try {
      if (type === 'IMAGE') {
        if (!imageUrl) {
          return NextResponse.json({ error: 'imageUrl is required for IMAGE type' }, { status: 400 });
        }

        containerId = await createMediaContainer(userId, token, imageUrl, caption, false, scheduledTime);

        if (!scheduledTime) {
          await waitForContainer(token, containerId);
          publishedId = await publishMedia(userId, token, containerId);
        }
      } else if (type === 'CAROUSEL') {
        if (!imageUrls || imageUrls.length < 2) {
          return NextResponse.json(
            { error: 'imageUrls precisa ter pelo menos 2 imagens para CAROUSEL' },
            { status: 400 }
          );
        }

        const childIds: string[] = [];
        for (const url of imageUrls) {
          const childId = await createMediaContainer(userId, token, url, undefined, true);
          childIds.push(childId);
          await new Promise(r => setTimeout(r, 500));
        }

        for (const childId of childIds) {
          await waitForContainer(token, childId);
        }

        containerId = await createCarouselContainer(userId, token, childIds, caption, scheduledTime);

        if (!scheduledTime) {
          await waitForContainer(token, containerId);
          publishedId = await publishMedia(userId, token, containerId);
        }
      } else {
        return NextResponse.json({ error: 'Tipo inválido. Use IMAGE ou CAROUSEL' }, { status: 400 });
      }

      // Atualizar Supabase com sucesso
      if (supabase && supabaseRecordId) {
        await supabase
          .from('scheduled_posts')
          .update({
            status: scheduledTime ? 'scheduled' : 'published',
            instagram_container_id: containerId,
            instagram_published_id: publishedId || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', supabaseRecordId);
      }

      return NextResponse.json({
        success: true,
        containerId,
        publishedId,
        scheduled: !!scheduledTime,
        scheduledTime: scheduledTime ? new Date(scheduledTime * 1000).toISOString() : null,
        supabaseId: supabaseRecordId,
        message: scheduledTime
          ? `Post agendado para ${new Date(scheduledTime * 1000).toLocaleString('pt-BR')}`
          : 'Post publicado com sucesso!',
      });

    } catch (apiError: unknown) {
      // Atualizar Supabase com erro
      const errorMsg = apiError instanceof Error ? apiError.message : 'Unknown error';
      
      if (supabase && supabaseRecordId) {
        await supabase
          .from('scheduled_posts')
          .update({
            status: 'error',
            error_message: errorMsg,
            updated_at: new Date().toISOString(),
          })
          .eq('id', supabaseRecordId);
      }

      throw apiError;
    }

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Instagram schedule error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
