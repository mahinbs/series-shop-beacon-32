-- Fix profile-pics bucket RLS policies to make profile pictures work properly
-- Run this in your Supabase SQL Editor

-- First ensure the profile-pics bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pics',
  'profile-pics',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop any existing conflicting policies for profile-pics bucket
DROP POLICY IF EXISTS "Anyone can view profile pics" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload profile pics" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile pics" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile pics" ON storage.objects;
DROP POLICY IF EXISTS "Public can view profile pics" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to profile pics" ON storage.objects;

-- Create comprehensive RLS policies for profile-pics bucket

-- 1. Allow EVERYONE (including anonymous users) to VIEW profile pictures
CREATE POLICY "Public can view profile pics" 
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-pics');

-- 2. Allow authenticated users to UPLOAD profile pictures
CREATE POLICY "Authenticated users can upload profile pics" 
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-pics');

-- 3. Allow authenticated users to UPDATE profile pictures
CREATE POLICY "Authenticated users can update profile pics" 
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-pics');

-- 4. Allow authenticated users to DELETE profile pictures
CREATE POLICY "Authenticated users can delete profile pics" 
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-pics');

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND policyname LIKE '%profile%';

