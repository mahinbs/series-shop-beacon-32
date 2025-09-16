-- Add volume management columns to books table
ALTER TABLE public.books 
ADD COLUMN parent_book_id uuid REFERENCES public.books(id),
ADD COLUMN volume_number integer,
ADD COLUMN is_volume boolean DEFAULT false,
ADD COLUMN series_title text;

-- Create index for better performance when querying volumes
CREATE INDEX idx_books_parent_book_id ON public.books(parent_book_id) WHERE parent_book_id IS NOT NULL;
CREATE INDEX idx_books_is_volume ON public.books(is_volume) WHERE is_volume = true;