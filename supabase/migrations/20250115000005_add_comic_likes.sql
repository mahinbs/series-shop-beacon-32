-- Add comic likes system
CREATE TABLE IF NOT EXISTS public.comic_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comic_id uuid NOT NULL REFERENCES public.digital_reader_specs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  
  UNIQUE(comic_id, user_id) -- A user can only like a comic once
);

-- Enable RLS on comic_likes
ALTER TABLE public.comic_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comic_likes
CREATE POLICY "Anyone can view comic likes" 
ON public.comic_likes FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert their own likes" 
ON public.comic_likes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
ON public.comic_likes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_comic_likes_comic_id ON public.comic_likes(comic_id);
CREATE INDEX IF NOT EXISTS idx_comic_likes_user_id ON public.comic_likes(user_id);

-- Create a view to get comic like counts
CREATE OR REPLACE VIEW public.comic_like_counts AS
SELECT 
  comic_id,
  COUNT(*) as like_count
FROM public.comic_likes
GROUP BY comic_id;
