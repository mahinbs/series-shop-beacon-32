-- Create Our Journey Timeline table
-- Migration: 20250115000001_create_our_journey_timeline.sql

-- Create our_journey_timeline table
CREATE TABLE IF NOT EXISTS public.our_journey_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    header TEXT NOT NULL,
    description TEXT NOT NULL,
    left_image_url TEXT,
    right_image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create our_journey_section table for section settings
CREATE TABLE IF NOT EXISTS public.our_journey_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT 'Our Journey',
    subtitle TEXT NOT NULL DEFAULT 'Follow our evolution through the years as we''ve grown from a small startup to a global publishing house.',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.our_journey_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.our_journey_section ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for our_journey_timeline
CREATE POLICY "Allow public read access to timeline" ON public.our_journey_timeline
FOR SELECT TO public
USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage timeline" ON public.our_journey_timeline
FOR ALL TO authenticated
USING (true);

-- Create RLS policies for our_journey_section
CREATE POLICY "Allow public read access to section" ON public.our_journey_section
FOR SELECT TO public
USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage section" ON public.our_journey_section
FOR ALL TO authenticated
USING (true);

-- Insert default section data
INSERT INTO public.our_journey_section (title, subtitle) VALUES
('Our Journey', 'Follow our evolution through the years as we''ve grown from a small startup to a global publishing house.')
ON CONFLICT DO NOTHING;

-- Insert sample timeline data
INSERT INTO public.our_journey_timeline (year, header, description, left_image_url, right_image_url, display_order) VALUES
(2020, 'Beginning of Hearts', 'Where our journey started with passion for manga and webtoons.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', 'https://images.unsplash.com/photo-1553729459-efe14ef6055d', 1),
(2021, 'Growing Community', 'Building relationships with creators and readers worldwide.', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43', 'https://images.unsplash.com/photo-1512820790803-83ca734da794', 2),
(2022, 'Global Expansion', 'Reaching readers across continents with amazing stories.', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 3)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_our_journey_timeline_year ON public.our_journey_timeline(year);
CREATE INDEX IF NOT EXISTS idx_our_journey_timeline_display_order ON public.our_journey_timeline(display_order);
CREATE INDEX IF NOT EXISTS idx_our_journey_timeline_active ON public.our_journey_timeline(is_active);
