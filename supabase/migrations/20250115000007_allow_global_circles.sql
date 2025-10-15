-- Update circles table to allow global circles (comic_id can be null)
ALTER TABLE public.circles 
ALTER COLUMN comic_id DROP NOT NULL;

-- Add comment to clarify the new behavior
COMMENT ON COLUMN public.circles.comic_id IS 'References digital_reader_specs.id for comic-specific circles, or NULL for global circles';
