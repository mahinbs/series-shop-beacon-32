-- NUCLEAR OPTION: Disable RLS entirely on storage.objects
-- This allows all uploads without any policies
-- WARNING: Less secure, but will fix upload errors immediately

ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Ensure avatars bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars','avatars', true, 5242880, array['image/jpeg','image/png','image/gif','image/webp'])
ON CONFLICT (id) DO NOTHING;


