-- ═══════════════════════════════════════════════════════════════
-- JobinLink — Storage Buckets Setup
-- Run this in Supabase SQL Editor ONCE
-- ═══════════════════════════════════════════════════════════════

-- 1. Create storage buckets (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('banners',  'banners',  true, 10485760, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit;

-- 2. Storage policies — allow authenticated users to upload their own files
-- Avatars: read (public), write (owner only)
CREATE POLICY "Public read avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND auth.uid() IS NOT NULL
  );

-- Banners
CREATE POLICY "Public read banners" ON storage.objects
  FOR SELECT USING (bucket_id = 'banners');

CREATE POLICY "Users upload own banner" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'banners' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users update own banner" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'banners' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users delete own banner" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'banners' AND auth.uid() IS NOT NULL
  );

-- 3. Ensure mini_sites table has all needed columns
ALTER TABLE mini_sites
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS banner_url TEXT,
  ADD COLUMN IF NOT EXISTS site_name TEXT,
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS tagline TEXT,
  ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#8b5cf6',
  ADD COLUMN IF NOT EXISTS bg_style TEXT DEFAULT 'light',
  ADD COLUMN IF NOT EXISTS gradient TEXT,
  ADD COLUMN IF NOT EXISTS columns INTEGER DEFAULT 2,
  ADD COLUMN IF NOT EXISTS show_cv BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS cv_headline TEXT,
  ADD COLUMN IF NOT EXISTS cv_location TEXT,
  ADD COLUMN IF NOT EXISTS cv_skills TEXT,
  ADD COLUMN IF NOT EXISTS contact_price NUMERIC DEFAULT 20,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'jobinlink',
  ADD COLUMN IF NOT EXISTS boost_rank INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS boost_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS badge TEXT,
  ADD COLUMN IF NOT EXISTS monthly_price NUMERIC DEFAULT 14.99,
  ADD COLUMN IF NOT EXISTS blocked BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. RLS policies for mini_sites
ALTER TABLE mini_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own site" ON mini_sites
  FOR SELECT USING (user_id = auth.uid() OR published = true);

CREATE POLICY "Users insert own site" ON mini_sites
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own site" ON mini_sites
  FOR UPDATE USING (user_id = auth.uid());

-- 5. Auth callback URL — run this to confirm it's set
-- Go to: Supabase Dashboard → Authentication → URL Configuration
-- Site URL: https://jobinlink.com
-- Redirect URLs (add all):
--   https://jobinlink.com/auth/callback
--   https://jobinlink.com/**
--   http://localhost:3000/auth/callback

SELECT 'Storage buckets created successfully!' as status;
