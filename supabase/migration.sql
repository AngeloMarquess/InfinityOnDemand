-- Create scheduled_posts table for tracking Instagram/Facebook posts
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL DEFAULT 'instagram' CHECK (platform IN ('instagram', 'facebook', 'both')),
  post_type TEXT NOT NULL CHECK (post_type IN ('IMAGE', 'CAROUSEL', 'VIDEO')),
  caption TEXT NOT NULL,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  scheduled_time TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'published', 'scheduled', 'error')),
  instagram_container_id TEXT,
  instagram_published_id TEXT,
  facebook_post_id TEXT,
  error_message TEXT,
  day_key TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;

-- Policy: allow all operations for service role (API routes use service role key)
CREATE POLICY "Allow all for service role" ON scheduled_posts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index for fast lookups on status and day_key
CREATE INDEX idx_scheduled_posts_status ON scheduled_posts (status);
CREATE INDEX idx_scheduled_posts_day_key ON scheduled_posts (day_key);
