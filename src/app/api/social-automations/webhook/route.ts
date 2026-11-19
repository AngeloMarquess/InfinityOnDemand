import { NextRequest, NextResponse } from 'next/server';
import { loadSocialAutomations, saveSocialAutomations, SocialContact } from '@/lib/social-automations';

// Handshake de verificação do Webhook da Meta (Instagram / Facebook)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'infinity_manychat_secure_token_2026';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('[Meta Webhook Verified]');
      return new NextResponse(challenge, { status: 200 });
    }

    // Retorna status informativo se acessado no navegador
    return NextResponse.json({
      status: 'active',
      service: 'Infinity Social Automation Webhook Engine',
      supportedPlatforms: ['Instagram Graph API', 'Facebook Graph API', 'ManyChat Webhook', 'TikTok Webhook'],
      instructions: 'Configure esta URL no Painel Meta for Developers ou ManyChat Webhook.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Receptor de eventos em tempo real
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const db = loadSocialAutomations();

    console.log('[Social Automation Webhook Received]:', JSON.stringify(payload).slice(0, 300));

    // Suporte a Payload do ManyChat
    if (payload.event === 'new_subscriber' || payload.type === 'manychat_event') {
      const subscriber = payload.subscriber || payload;
      const contactName = subscriber.first_name ? `${subscriber.first_name} ${subscriber.last_name || ''}`.trim() : 'Lead ManyChat';
      const username = subscriber.username || `@lead_${Date.now().toString().slice(-4)}`;

      const newContact: SocialContact = {
        id: `cont-mc-${Date.now()}`,
        platform: 'instagram',
        username,
        fullName: contactName,
        lastInteraction: new Date().toISOString(),
        within24hWindow: true,
        ruleTriggered: 'ManyChat Webhook Sync',
        lastMessageSent: 'Disparo via ManyChat sincronizado com a Infinity On Demand',
        tags: ['ManyChat-Sync', 'Lead-Capturado'],
        status: 'lead_hot',
      };

      db.contacts.unshift(newContact);
      db.compliance.totalChecked += 1;
      db.compliance.within24hCount += 1;
      saveSocialAutomations(db);

      return NextResponse.json({ success: true, processed: 'manychat_event' });
    }

    // Suporte a Payload padrão da Meta (Instagram / Facebook)
    if (payload.object === 'instagram' || payload.object === 'page') {
      const entries = payload.entry || [];
      for (const entry of entries) {
        // Trata comentários ou mensagens
        const messaging = entry.messaging || [];
        const changes = entry.changes || [];

        // Exemplo: novo comentário (changes)
        for (const change of changes) {
          if (change.field === 'comments') {
            const commentValue = change.value;
            const text = commentValue?.text || '';
            const fromUser = commentValue?.from?.username || '@usuario_instagram';

            // Localiza regra correspondente
            const rule = db.rules.find((r) => {
              if (r.status !== 'active') return false;
              if (r.platform !== 'instagram' && r.platform !== 'all') return false;
              if (r.triggerType !== 'post_comment') return false;
              if (r.keywordMatching === 'any') return true;
              return r.keywords.some((kw) => text.toUpperCase().includes(kw.toUpperCase().trim()));
            });

            if (rule) {
              rule.stats.triggersCount += 1;
              rule.stats.repliesSent += 1;
              rule.stats.dmsSent += 1;
              rule.stats.lastTriggeredAt = new Date().toISOString();
            }
          }
        }
      }

      saveSocialAutomations(db);
    }

    return NextResponse.json({ success: true, status: 'EVENT_RECEIVED' });
  } catch (err: any) {
    console.error('[Social Webhook Error]:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
