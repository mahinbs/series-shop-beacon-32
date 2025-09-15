-- Add video_url column to books table
ALTER TABLE public.books 
ADD COLUMN video_url text;

COMMENT ON COLUMN public.books.video_url IS 'YouTube video URL for the book';