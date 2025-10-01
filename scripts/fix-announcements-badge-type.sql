-- Fix announcements table by adding missing badge_type column
-- Run this in your Supabase SQL Editor

-- Add badge_type column to announcements table
ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS badge_type TEXT CHECK (badge_type IN ('hot', 'new', 'limited'));

-- Add comment to the column
COMMENT ON COLUMN public.announcements.badge_type IS 'Badge type for announcements (hot, new, limited)';

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'announcements' 
AND table_schema = 'public'
ORDER BY ordinal_position;
