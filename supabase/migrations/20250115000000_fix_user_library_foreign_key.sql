-- Fix user_library table to support both comic_series and digital_reader_specs
-- Remove the foreign key constraint that only allows comic_series

-- First, drop the existing foreign key constraint
ALTER TABLE public.user_library 
DROP CONSTRAINT IF EXISTS user_library_series_id_fkey;

-- The series_id column will now accept any UUID, not just from comic_series
-- This allows us to store both comic_series IDs and digital_reader_specs IDs

-- Add a comment to clarify the new behavior
COMMENT ON COLUMN public.user_library.series_id IS 'References either comic_series.id or digital_reader_specs.id';
