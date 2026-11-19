import { NextRequest, NextResponse } from 'next/server';
import { loadSocialAutomations, saveSocialAutomations, SocialContact } from '@/lib/social-automations';

// Handshake de verificação do Webhook da Meta (Instagram / Facebook)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'infinity_social_secure_token_2026';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('[Meta Webhook Handshake Verified]');
      return new NextResponse(challenge, { status: 200 });
    }

    return NextResponse.json({
      status: 'active',
      service: 'Infinity Social Automation Webhook Engine',
      supportedPlatforms: ['Instagram Graph API', 'Facebook Graph API', 'TikTok Webhook', 'Universal Social Webhook'],
      instructions: 'Configure esta URL no Painel Meta for Developers com o Verify Token configurado.',
      webhookUrl: 'https://infinityondemand.com.br/api/social-automations/webhook',
      verifyToken: VERIFY_TOKEN,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Receptor e Processador de Eventos em Tempo Real
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const db = loadSocialAutomations();

    console.log('[Social Webhook Received Event]:', JSON.stringify(payload));

    const metaToken = db.config.instagramAccessToken || process.env.INSTAGRAM_ACCESS_TOKEN || process.env.META_USER_ACCESS_TOKEN;
    const igAccountId = db.config.instagramAccountId || process.env.INSTAGRAM_USER_ID || '17841467177463270';

    // ── 1. EVENTO PADRÃO DA META (INSTAGRAM GRAPH API OU FACEBOOK PAGE) ──
    if (payload.object === 'instagram' || payload.object === 'page') {
      const entries = payload.entry || [];

      for (const entry of entries) {
        // A) COMENTÁRIOS NO POST OU REEL (changes -> comments)
        const changes = entry.changes || [];
        for (const change of changes) {
          if (change.field === 'comments') {
            const commentValue = change.value;
            const commentId = commentValue?.id;
            const text = (commentValue?.text || '').trim();
            const fromUser = commentValue?.from?.username ? `@${commentValue.from.username}` : '@usuario';
            const fromName = commentValue?.from?.name || commentValue?.from?.username || 'Cliente';
            const mediaId = commentValue?.media?.id; // ID do post onde foi feito o comentário

            if (!text || !commentId) continue;

            // Localiza regra correspondente
            const matchedRule = db.rules.find((r) => {
              if (r.status !== 'active') return false;
              if (r.platform !== 'instagram' && r.platform !== 'all') return false;
              if (r.triggerType !== 'post_comment') return false;

              // Filtro de post específico (se configurado)
              if (r.postTarget === 'specific_post') {
                if (r.targetPostId && mediaId && r.targetPostId !== mediaId) return false;
                // Se informou URL do post, checa se bate
                if (r.targetPostUrl && mediaId && !r.targetPostUrl.includes(mediaId)) {
                  // Aceita correspondência flexível se o targetPostUrl tiver o shortcode
                }
              }

              // Filtro de palavra-chave
              if (r.keywordMatching === 'any' || r.keywords.length === 0) return true;
              const cleanText = text.toUpperCase();
              return r.keywords.some((kw) => cleanText.includes(kw.toUpperCase().trim()));
            });

            if (matchedRule) {
              console.log(`[Regra Ativada]: ${matchedRule.name} para o comentário: "${text}" de ${fromUser}`);

              // Escolhe resposta pública com rotação anti-spam
              let publicReply = '';
              if (matchedRule.publicReplyEnabled && matchedRule.publicReplies.length > 0) {
                const randIndex = Math.floor(Math.random() * matchedRule.publicReplies.length);
                publicReply = matchedRule.publicReplies[randIndex];
              }

              // Monta a mensagem privada
              const personalizedDm = matchedRule.privateDmMessage
                .replace(/\{\{name\}\}/gi, fromName)
                .replace(/\{\{username\}\}/gi, fromUser);

              // ── EXECUÇÃO 1: Responder comentário publicamente no Instagram via Graph API ──
              if (publicReply && metaToken && commentId) {
                try {
                  const replyRes = await fetch(`https://graph.facebook.com/v21.0/${commentId}/replies`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      message: publicReply,
                      access_token: metaToken,
                    }),
                  });
                  const replyJson = await replyRes.json();
                  console.log('[Instagram Public Reply Sent]:', replyJson);
                  if (replyJson.id) matchedRule.stats.repliesSent += 1;
                } catch (err) {
                  console.error('[Error sending public reply]:', err);
                }
              }

              // ── EXECUÇÃO 2: Enviar DM Privada no Instagram via Private Reply to Comment ──
              if (personalizedDm && metaToken && commentId) {
                try {
                  // No Instagram Graph API oficial, para responder um comentário por DM, usa-se /messages com recipient: { comment_id }
                  const dmRes = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/messages`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      recipient: {
                        comment_id: commentId,
                      },
                      message: {
                        text: personalizedDm,
                      },
                      access_token: metaToken,
                    }),
                  });
                  const dmJson = await dmRes.json();
                  console.log('[Instagram Private DM Sent]:', dmJson);
                  if (dmJson.message_id || dmJson.recipient_id) matchedRule.stats.dmsSent += 1;

                  // Se houver anexo (PDF ou Imagem), envia o segundo balão com o arquivo!
                  if (matchedRule.attachmentType && matchedRule.attachmentType !== 'none' && matchedRule.attachmentUrl) {
                    try {
                      await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/messages`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          recipient: { comment_id: commentId },
                          message: {
                            attachment: {
                              type: matchedRule.attachmentType === 'image' ? 'image' : 'file',
                              payload: {
                                url: matchedRule.attachmentUrl,
                                is_reusable: true,
                              },
                            },
                          },
                          access_token: metaToken,
                        }),
                      });
                    } catch (attErr) {
                      console.error('[Error sending attachment]:', attErr);
                    }
                  }
                } catch (err) {
                  console.error('[Error sending private DM]:', err);
                }
              }

              // Atualiza métricas e contato
              matchedRule.stats.triggersCount += 1;
              matchedRule.stats.lastTriggeredAt = new Date().toISOString();

              const existingContact = db.contacts.find((c) => c.username.toLowerCase() === fromUser.toLowerCase());
              const now = new Date().toISOString();
              if (existingContact) {
                existingContact.lastInteraction = now;
                existingContact.within24hWindow = true;
                existingContact.ruleTriggered = matchedRule.name;
                existingContact.lastMessageSent = personalizedDm.slice(0, 100) + '...';
              } else {
                db.contacts.unshift({
                  id: `cont-${Date.now()}`,
                  platform: 'instagram',
                  username: fromUser,
                  fullName: fromName,
                  lastInteraction: now,
                  within24hWindow: true,
                  ruleTriggered: matchedRule.name,
                  lastMessageSent: personalizedDm.slice(0, 100) + '...',
                  tags: [...matchedRule.tags],
                  status: 'lead_hot',
                });
              }

              db.compliance.totalChecked += 1;
              db.compliance.within24hCount += 1;
            }
          }
        }
      }

      saveSocialAutomations(db);
      return NextResponse.json({ success: true, processed: 'meta_event' });
    }

    // ── 2. EVENTO DE MOTOR EXTERNO / BRIDGE WEBHOOK ──
    if (payload.event === 'new_subscriber' || payload.type === 'infinity_event') {
      const subscriber = payload.subscriber || payload;
      const contactName = subscriber.first_name ? `${subscriber.first_name} ${subscriber.last_name || ''}`.trim() : 'Lead Infinity';
      const username = subscriber.username || `@lead_${Date.now().toString().slice(-4)}`;

      db.contacts.unshift({
        id: `cont-inf-${Date.now()}`,
        platform: 'instagram',
        username,
        fullName: contactName,
        lastInteraction: new Date().toISOString(),
        within24hWindow: true,
        ruleTriggered: 'Infinity Webhook Bridge',
        lastMessageSent: 'Evento externo sincronizado com a Infinity On Demand',
        tags: ['Infinity-Sync', 'Lead-Capturado'],
        status: 'lead_hot',
      });
      db.compliance.totalChecked += 1;
      db.compliance.within24hCount += 1;
      saveSocialAutomations(db);

      return NextResponse.json({ success: true, processed: 'bridge_event' });
    }

    return NextResponse.json({ success: true, status: 'EVENT_ACKNOWLEDGED' });
  } catch (err: any) {
    console.error('[Social Webhook Error]:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
