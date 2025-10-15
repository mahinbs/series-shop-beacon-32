-- Create reviews table for digital comics with like/dislike functionality
CREATE TABLE IF NOT EXISTS public.comic_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comic_id uuid NOT NULL REFERENCES public.digital_reader_specs(id) ON DELETE CASCADE,
  comment text NOT NULL,
  likes_count integer DEFAULT 0,
  dislikes_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, comic_id) -- One review per user per comic
);

-- Enable RLS
ALTER TABLE public.comic_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view reviews" 
ON public.comic_reviews FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert their own reviews" 
ON public.comic_reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON public.comic_reviews FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.comic_reviews FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create table for tracking user reactions to reviews
CREATE TABLE IF NOT EXISTS public.review_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL REFERENCES public.comic_reviews(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type text NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  created_at timestamptz NOT NULL DEFAULT now(),
  
  UNIQUE(review_id, user_id) -- A user can only react once per review
);

-- Enable RLS on review_reactions
ALTER TABLE public.review_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for review_reactions
CREATE POLICY "Anyone can view review reactions" 
ON public.review_reactions FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert their own reactions" 
ON public.review_reactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reactions" 
ON public.review_reactions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" 
ON public.review_reactions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comic_reviews_comic_id ON public.comic_reviews(comic_id);
CREATE INDEX IF NOT EXISTS idx_comic_reviews_user_id ON public.comic_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_comic_reviews_created_at ON public.comic_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_reactions_review_id ON public.review_reactions(review_id);
CREATE INDEX IF NOT EXISTS idx_review_reactions_user_id ON public.review_reactions(user_id);

-- Trigger to keep updated_at fresh
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_comic_reviews_updated_at ON public.comic_reviews;
CREATE TRIGGER update_comic_reviews_updated_at
BEFORE UPDATE ON public.comic_reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update like/dislike counts
CREATE OR REPLACE FUNCTION public.update_review_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.reaction_type = 'like' THEN
      UPDATE public.comic_reviews 
      SET likes_count = likes_count + 1 
      WHERE id = NEW.review_id;
    ELSIF NEW.reaction_type = 'dislike' THEN
      UPDATE public.comic_reviews 
      SET dislikes_count = dislikes_count + 1 
      WHERE id = NEW.review_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle reaction type change
    IF OLD.reaction_type = 'like' AND NEW.reaction_type = 'dislike' THEN
      UPDATE public.comic_reviews 
      SET likes_count = likes_count - 1, dislikes_count = dislikes_count + 1 
      WHERE id = NEW.review_id;
    ELSIF OLD.reaction_type = 'dislike' AND NEW.reaction_type = 'like' THEN
      UPDATE public.comic_reviews 
      SET dislikes_count = dislikes_count - 1, likes_count = likes_count + 1 
      WHERE id = NEW.review_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.reaction_type = 'like' THEN
      UPDATE public.comic_reviews 
      SET likes_count = likes_count - 1 
      WHERE id = OLD.review_id;
    ELSIF OLD.reaction_type = 'dislike' THEN
      UPDATE public.comic_reviews 
      SET dislikes_count = dislikes_count - 1 
      WHERE id = OLD.review_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update counts
DROP TRIGGER IF EXISTS update_review_reaction_counts_trigger ON public.review_reactions;
CREATE TRIGGER update_review_reaction_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.review_reactions
  FOR EACH ROW EXECUTE FUNCTION public.update_review_reaction_counts();

-- Create a view for reviews with user profile information
CREATE OR REPLACE VIEW public.comic_reviews_with_profiles AS
SELECT 
  r.*,
  p.full_name as reviewer_name,
  p.avatar_url as reviewer_avatar
FROM public.comic_reviews r
LEFT JOIN public.profiles p ON r.user_id = p.user_id
ORDER BY r.created_at DESC;
