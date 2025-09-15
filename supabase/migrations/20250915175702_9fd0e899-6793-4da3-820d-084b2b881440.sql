-- Add cover_page_url field to books table for LinkedIn-style cover pages
ALTER TABLE public.books 
ADD COLUMN cover_page_url TEXT;