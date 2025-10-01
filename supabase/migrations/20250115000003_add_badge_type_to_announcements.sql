-- Add badge_type column to announcements table
ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS badge_type TEXT CHECK (badge_type IN ('hot', 'new', 'limited'));

-- Add comment to the column
COMMENT ON COLUMN public.announcements.badge_type IS 'Badge type for announcements (hot, new, limited)';
