import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Use direct PostgreSQL-style query via Supabase's SQL endpoint
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Alternative: use the supabase client to test if the table exists
    const supabase = createClient(supabaseUrl, serviceKey);

    // Try to create table by inserting and catching error
    const { error: testError } = await supabase
      .from('creative_posts')
      .select('id')
      .limit(1);

    if (testError && testError.message.includes('does not exist')) {
      return NextResponse.json({
        error: 'Table does not exist. Please create it in Supabase SQL Editor.',
        sql: `CREATE TABLE IF NOT EXISTS creative_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  posted_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE creative_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON creative_posts
  FOR ALL USING (true) WITH CHECK (true);`,
      }, { status: 400 });
    }

    // Suppress unused variable warning
    void res;

    return NextResponse.json({ success: true, message: 'Table creative_posts exists!' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
