-- Create user_library table for following/adding series to library
CREATE TABLE IF NOT EXISTS public.user_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  series_id uuid NOT NULL REFERENCES public.comic_series(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, series_id)
);

ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own library" 
ON public.user_library FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own library items" 
ON public.user_library FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own library items" 
ON public.user_library FOR DELETE
USING (auth.uid() = user_id);

-- trigger to keep updated_at fresh
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_library_updated_at ON public.user_library;
CREATE TRIGGER update_user_library_updated_at
BEFORE UPDATE ON public.user_library
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

