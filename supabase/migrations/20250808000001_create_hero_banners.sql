-- Create hero_banners table for CMS management
CREATE TABLE IF NOT EXISTS public.hero_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations for hero banners" ON public.hero_banners;
DROP POLICY IF EXISTS "Anyone can view active hero banners" ON public.hero_banners;
DROP POLICY IF EXISTS "Admins can manage hero banners" ON public.hero_banners;

-- Create completely permissive policies for dummy auth system
CREATE POLICY "Allow all operations for hero banners" 
ON public.hero_banners 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_hero_banners_updated_at') THEN
        CREATE TRIGGER update_hero_banners_updated_at
        BEFORE UPDATE ON public.hero_banners
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;
