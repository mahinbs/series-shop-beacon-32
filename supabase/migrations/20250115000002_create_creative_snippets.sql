-- Creative Snippets Database Setup
-- This migration creates tables for the Creative Snippets section

-- 1. Create Creative Snippets Section table
CREATE TABLE IF NOT EXISTS public.creative_snippets_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT 'Creative Snippets',
    subtitle TEXT NOT NULL DEFAULT 'Discover the stories behind your favorite series',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Creative Snippets Items table
CREATE TABLE IF NOT EXISTS public.creative_snippets_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    volume_chapter TEXT,
    background_image_url TEXT,
    video_url TEXT,
    video_file_path TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.creative_snippets_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_snippets_items ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for section
CREATE POLICY "Allow public read access to creative snippets section" 
ON public.creative_snippets_section 
FOR SELECT TO public 
USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage creative snippets section" 
ON public.creative_snippets_section 
FOR ALL TO authenticated 
USING (true);

-- 5. Create RLS policies for items
CREATE POLICY "Allow public read access to creative snippets items" 
ON public.creative_snippets_items 
FOR SELECT TO public 
USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage creative snippets items" 
ON public.creative_snippets_items 
FOR ALL TO authenticated 
USING (true);

-- 6. Insert default section data
INSERT INTO public.creative_snippets_section (title, subtitle) 
VALUES (
    'Creative Snippets', 
    'Discover the stories behind your favorite series'
) ON CONFLICT DO NOTHING;

-- 7. Insert sample creative snippets data
INSERT INTO public.creative_snippets_items (
    title, 
    description, 
    volume_chapter, 
    background_image_url, 
    display_order
) VALUES 
(
    'AO HARU RIDE', 
    'Io Sakisaka wanted to draw a story about growing up, and for Ao Haru Ride, she wanted to focus on the characters'' self-journey and discovering who they truly were. Futaba and Kou''s accidental kiss was based on a real-life experience Sakisaka had in the past.',
    'VOL 01 - CH 01',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    1
),
(
    'SUPERMAN: THE DAY SUPERMAN MARRIED!',
    'A classic Superman story that explores themes of love, responsibility, and heroism. This iconic issue features Superman''s wedding to Lois Lane and the challenges that come with balancing personal life and superhero duties.',
    'VOL 01 - CH 01',
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d',
    2
),
(
    'DEMON: THE LAST BOY ON EARTH',
    'A post-apocalyptic tale of survival and hope. The story follows a young protagonist navigating a world where humanity has been decimated, discovering that sometimes the greatest demons are within ourselves.',
    'VOL 01 - CH 01',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43',
    3
) ON CONFLICT DO NOTHING;

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_creative_snippets_items_display_order 
ON public.creative_snippets_items(display_order);

CREATE INDEX IF NOT EXISTS idx_creative_snippets_items_active 
ON public.creative_snippets_items(is_active);

-- 9. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Create triggers for updated_at
CREATE TRIGGER update_creative_snippets_section_updated_at 
    BEFORE UPDATE ON public.creative_snippets_section 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creative_snippets_items_updated_at 
    BEFORE UPDATE ON public.creative_snippets_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
