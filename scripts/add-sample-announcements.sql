-- Add sample announcements data to the existing table
-- This script works with both old and new schema versions

-- First, let's check what columns exist and add missing ones if needed
DO $$
BEGIN
    -- Add new columns if they don't exist (for backward compatibility)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'description') THEN
        ALTER TABLE public.announcements ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'full_description') THEN
        ALTER TABLE public.announcements ADD COLUMN full_description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'date_info') THEN
        ALTER TABLE public.announcements ADD COLUMN date_info TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'status') THEN
        ALTER TABLE public.announcements ADD COLUMN status TEXT DEFAULT 'Available';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'features') THEN
        ALTER TABLE public.announcements ADD COLUMN features TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'badge_type') THEN
        ALTER TABLE public.announcements ADD COLUMN badge_type TEXT CHECK (badge_type IN ('hot', 'new', 'limited'));
    END IF;
    
    -- Update existing content to description if content exists but description doesn't
    UPDATE public.announcements 
    SET description = content 
    WHERE content IS NOT NULL AND (description IS NULL OR description = '');
    
    RAISE NOTICE 'Announcements table schema updated successfully';
END $$;

-- Clear existing announcements to avoid duplicates
DELETE FROM public.announcements;

-- Insert sample announcements data
INSERT INTO public.announcements (
    title,
    description,
    full_description,
    date_info,
    image_url,
    status,
    features,
    badge_type,
    display_order,
    is_active
) VALUES 
(
    'New Manga Series: "Dragon Quest"',
    'Experience the epic adventure of the legendary Dragon Quest series in this stunning new manga adaptation.',
    'Join our hero on an incredible journey through mystical lands filled with dragons, magic, and adventure. This new manga series brings the beloved Dragon Quest universe to life with breathtaking artwork and an engaging storyline that will captivate both new and returning fans.',
    'Available Now',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    'Available',
    ARRAY['Full color artwork', 'Exclusive bonus content', 'Collector''s edition available', 'Digital and physical formats'],
    'new',
    1,
    true
),
(
    'Limited Edition: "One Piece" Volume 100',
    'Celebrate the milestone 100th volume of One Piece with this special limited edition release.',
    'This commemorative volume includes exclusive artwork, behind-the-scenes content, and a special chapter that reveals never-before-seen details about the Straw Hat Pirates'' journey. Limited to 10,000 copies worldwide.',
    'Pre-Order Available',
    'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=600&fit=crop',
    'Pre-Order',
    ARRAY['Exclusive cover art', 'Bonus chapter', 'Collector''s box', 'Signed by author'],
    'limited',
    2,
    true
),
(
    'Hot Release: "Attack on Titan" Final Season',
    'The epic conclusion to the Attack on Titan saga is finally here with the final season manga.',
    'Witness the dramatic finale of one of the most popular manga series of all time. This final season brings closure to the epic story of Eren, Mikasa, and Armin as they face their ultimate destiny in the battle for humanity''s survival.',
    'Now Available',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    'Available',
    ARRAY['Final volume', 'Complete series box set', 'Exclusive epilogue', 'Author commentary'],
    'hot',
    3,
    true
);

-- Update RLS policies for announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow public read access to active announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow admin full access to announcements" ON public.announcements;

-- Create new policies
CREATE POLICY "Allow public read access to active announcements" ON public.announcements
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access to announcements" ON public.announcements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

RAISE NOTICE 'Sample announcements added successfully!';
