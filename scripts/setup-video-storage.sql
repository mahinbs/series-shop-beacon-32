-- Video Storage Bucket Setup
-- Run this in your Supabase SQL Editor

-- 1. Create videos storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'videos', 
  'videos', 
  true, 
  52428800, -- 50MB limit
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/quicktime']
) ON CONFLICT (id) DO NOTHING;

-- 2. Create storage policies for videos bucket
CREATE POLICY "Allow public read access to videos" 
ON storage.objects 
FOR SELECT TO public 
USING (bucket_id = 'videos');

CREATE POLICY "Allow authenticated users to upload videos" 
ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Allow authenticated users to update videos" 
ON storage.objects 
FOR UPDATE TO authenticated 
USING (bucket_id = 'videos');

CREATE POLICY "Allow authenticated users to delete videos" 
ON storage.objects 
FOR DELETE TO authenticated 
USING (bucket_id = 'videos');
