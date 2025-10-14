-- NUCLEAR OPTION: Disable RLS on storage.objects entirely
-- This will make ALL storage buckets publicly accessible
-- Run this in Supabase SQL Editor if you have the permissions

-- Disable RLS on storage.objects table
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Make sure all buckets are public
UPDATE storage.buckets SET public = true WHERE id IN ('images', 'profile-pics', 'avatars');

-- Verify the changes
SELECT id, name, public FROM storage.buckets WHERE id IN ('images', 'profile-pics', 'avatars');

