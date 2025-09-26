-- Add is_popular_recommendation column to books table
ALTER TABLE public.books ADD COLUMN is_popular_recommendation boolean DEFAULT false;