import { NextRequest, NextResponse } from 'next/server';

const APIFY_WEBHOOK_SECRET = process.env.APIFY_WEBHOOK_SECRET;

/**
 * Apify Webhook — called automatically when a scrape finishes.
 * 
 * Setup in Apify Console:
 *   URL: https://yourdomain.com/api/apify/webhook
 *   Event: ACTOR.RUN.SUCCEEDED
 *   Payload template: leave default
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Optional: verify webhook secret
    if (APIFY_WEBHOOK_SECRET) {
      const secret = request.headers.get('x-apify-webhook-secret');
      if (secret !== APIFY_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Invalid webhook secret' }, { status: 403 });
      }
    }

    // Extract dataset ID from Apify webhook payload
    const datasetId = body?.resource?.defaultDatasetId;

    if (!datasetId) {
      console.log('Apify webhook received but no datasetId found:', JSON.stringify(body).substring(0, 200));
      return NextResponse.json({ error: 'No datasetId in webhook payload' }, { status: 400 });
    }

    console.log(`📦 Apify webhook: importing dataset ${datasetId}...`);

    // Call our import endpoint internally
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
    const importRes = await fetch(`${baseUrl}/api/apify/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ datasetId }),
    });

    const result = await importRes.json();

    if (!importRes.ok) {
      console.error('Apify webhook import failed:', result);
      return NextResponse.json({ error: 'Import failed', details: result }, { status: 500 });
    }

    console.log(`✅ Apify webhook import complete:`, result);

    return NextResponse.json({
      success: true,
      datasetId,
      ...result,
    });
  } catch (error) {
    console.error('Apify webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// GET — health check
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'apify-webhook' });
}
