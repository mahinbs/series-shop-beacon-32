-- Drop NOT NULL pdf_url column from digital_reader_episodes (we use image pages instead)
ALTER TABLE public.digital_reader_episodes DROP COLUMN IF EXISTS pdf_url;

