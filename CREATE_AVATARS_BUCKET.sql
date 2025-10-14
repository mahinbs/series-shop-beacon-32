-- Run this SQL in your Supabase SQL Editor to create the avatars bucket

-- Create avatars storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Note: Storage policies are automatically handled by Supabase for public buckets
-- Users can upload files to their own folders and view all public files
