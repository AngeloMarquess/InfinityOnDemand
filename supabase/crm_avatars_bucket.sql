-- Create avatars storage bucket for profile photos
-- Run this in Supabase SQL Editor or use the Dashboard > Storage to create the bucket

-- Note: Supabase storage buckets are typically created via the Dashboard UI:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Click "New Bucket"
-- 3. Name: "avatars"
-- 4. Check "Public bucket" (so avatar URLs are accessible without auth)
-- 5. Click "Create bucket"
-- 6. Go to Policies tab, add a policy:
--    - Allow INSERT for authenticated users (with path matching their user ID)
--    - Allow SELECT for everyone (public read)

-- If you prefer SQL, here's the equivalent:
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Authenticated users can upload to their own folder
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy: Authenticated users can update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy: Anyone can view avatars (public)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');
