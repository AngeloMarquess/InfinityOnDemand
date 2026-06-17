import { NextResponse } from 'next/server';
import { getWelcomeEmailHtml } from '@/lib/emails/templates';

export async function POST(request: Request) {
  try {
    // 1. Authorization check
    const authHeader = request.headers.get('Authorization');
    const secretKey = process.env.FLASH_API_SECRET;
    
    if (!secretKey) {
      console.error('FLASH_API_SECRET is not configured');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }
    
    if (!authHeader || authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request body
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'angelo.marques@infinityondemand.com.br';

    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not defined in environment variables');
      return NextResponse.json({ error: 'Email service misconfigured' }, { status: 500 });
    }

    // 3. Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Infinity On Demand <${resendFromEmail}>`,
        to: [email],
        subject: 'Seja bem-vindo à Infinity On Demand! 🚀',
        html: getWelcomeEmailHtml(name),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return NextResponse.json({ error: 'Failed to send welcome email', details: data }, { status: response.status });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error: any) {
    console.error('Welcome email API error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
