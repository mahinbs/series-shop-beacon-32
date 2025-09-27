-- Add new fields to books table for series information
-- Migration: 20250120000000_add_book_series_fields.sql

-- Add new columns to books table
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS about_series TEXT,
ADD COLUMN IF NOT EXISTS creators TEXT,
ADD COLUMN IF NOT EXISTS length TEXT;

-- Update existing records to have default values if needed
UPDATE public.books 
SET about_series = description 
WHERE about_series IS NULL AND description IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.books.about_series IS 'Series description that appears in the About the Series section';
COMMENT ON COLUMN public.books.creators IS 'Creator names separated by commas';
COMMENT ON COLUMN public.books.length IS 'Length information (e.g., 200 pages, 2 hours)';

-- Create indexes for better performance on new fields
CREATE INDEX IF NOT EXISTS idx_books_creators ON public.books(creators);
CREATE INDEX IF NOT EXISTS idx_books_length ON public.books(length);
