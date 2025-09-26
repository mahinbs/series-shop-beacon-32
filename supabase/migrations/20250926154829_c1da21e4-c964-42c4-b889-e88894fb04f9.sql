-- Add genre column to books table to support multiple genres per book
ALTER TABLE public.books ADD COLUMN genre text[] DEFAULT '{}';

-- Update existing books to have empty genre array if null
UPDATE public.books SET genre = '{}' WHERE genre IS NULL;