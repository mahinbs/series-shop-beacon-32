-- DISABLE RLS ONLY for profile-pics bucket
-- This will make ONLY profile-pics publicly accessible
-- Run this in Supabase SQL Editor

-- First, make sure profile-pics bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pics',
  'profile-pics',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET public = true;

-- Remove ALL RLS policies for profile-pics bucket only
DROP POLICY IF EXISTS "Public can view profile pics" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload profile pics" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile pics" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile pics" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile pics" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to profile pics" ON storage.objects;

-- Create ONE simple policy: Allow EVERYONE to do EVERYTHING with profile-pics bucket
CREATE POLICY "profile_pics_public_access" 
ON storage.objects 
FOR ALL 
TO public 
USING (bucket_id = 'profile-pics')
WITH CHECK (bucket_id = 'profile-pics');

-- Verify only profile-pics bucket is affected
SELECT id, name, public FROM storage.buckets WHERE id = 'profile-pics';

