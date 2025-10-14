-- Fix profile-pics bucket RLS policies
-- Migration: 20251013000300_fix_profile_pics_rls.sql

-- Ensure the profile-pics bucket exists with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pics',
  'profile-pics',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop any existing conflicting policies for profile-pics bucket
DROP POLICY IF EXISTS "Anyone can view profile pics" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload profile pics" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile pics" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile pics" ON storage.objects;
DROP POLICY IF EXISTS "Public can view profile pics" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to profile pics" ON storage.objects;

-- Create RLS policies for profile-pics bucket

-- Allow public read access to profile pictures (so they show up after refresh)
CREATE POLICY "Public can view profile pics" 
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-pics');

-- Allow authenticated users to upload profile pictures
CREATE POLICY "Authenticated users can upload profile pics" 
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-pics');

-- Allow authenticated users to update profile pictures
CREATE POLICY "Authenticated users can update profile pics" 
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-pics');

-- Allow authenticated users to delete profile pictures
CREATE POLICY "Authenticated users can delete profile pics" 
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-pics');

