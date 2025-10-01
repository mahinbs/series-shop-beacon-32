-- ONE SCRIPT TO FIX EVERYTHING
-- Copy and paste this entire script into your Supabase SQL Editor and run it

-- Add ALL missing columns
ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS badge_type TEXT CHECK (badge_type IN ('hot', 'new', 'limited'));

ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}';

ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS date_info TEXT DEFAULT '';

ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS full_description TEXT DEFAULT '';

ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';

ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT '';

ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS title TEXT DEFAULT '';

ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create the update trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_announcements_updated_at ON public.announcements;
CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Verify everything is working
SELECT 'SUCCESS: All columns added successfully!' as status;
