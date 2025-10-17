-- Create Announcement Page Sections
-- Migration: 20250116000001_create_announcement_sections.sql

-- Create event_calendar table
CREATE TABLE IF NOT EXISTS public.event_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    location TEXT,
    event_type TEXT DEFAULT 'event',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create release_schedule table
CREATE TABLE IF NOT EXISTS public.release_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    release_date DATE NOT NULL,
    series_name TEXT,
    volume_number INTEGER,
    release_type TEXT DEFAULT 'volume',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create faq_items table
CREATE TABLE IF NOT EXISTS public.faq_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.event_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.release_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for event_calendar
CREATE POLICY "Allow public read access to events" ON public.event_calendar
FOR SELECT TO public
USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage events" ON public.event_calendar
FOR ALL TO authenticated
USING (true);

-- Create RLS policies for release_schedule
CREATE POLICY "Allow public read access to releases" ON public.release_schedule
FOR SELECT TO public
USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage releases" ON public.release_schedule
FOR ALL TO authenticated
USING (true);

-- Create RLS policies for faq_items
CREATE POLICY "Allow public read access to faq" ON public.faq_items
FOR SELECT TO public
USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage faq" ON public.faq_items
FOR ALL TO authenticated
USING (true);

-- Insert sample data for event_calendar
INSERT INTO public.event_calendar (title, description, event_date, location, event_type, display_order) VALUES
('Summer Manga Festival 2025', 'Join us for the biggest manga festival of the year', '2025-07-03', 'Tokyo Convention Center', 'festival', 1),
('Manga Creator Meetup', 'Meet and greet with your favorite manga creators', '2025-07-15', 'Virtual Event', 'meetup', 2),
('Annual Manga Awards', 'Celebrating the best manga of the year', '2025-08-10', 'Online Ceremony', 'awards', 3)
ON CONFLICT DO NOTHING;

-- Insert sample data for release_schedule
INSERT INTO public.release_schedule (title, description, release_date, series_name, volume_number, release_type, display_order) VALUES
('Demon Slayer Volume 25', 'The epic conclusion to the Demon Slayer series', '2025-07-05', 'Demon Slayer', 25, 'volume', 1),
('Naruto Anniversary Edition', 'Special anniversary edition with bonus content', '2025-07-06', 'Naruto', 1, 'special', 2),
('One Piece Volume 105', 'The adventure continues in the New World', '2025-07-12', 'One Piece', 105, 'volume', 3)
ON CONFLICT DO NOTHING;

-- Insert sample data for faq_items
INSERT INTO public.faq_items (question, answer, category, display_order) VALUES
('What is Crossed Hearts customer service policy?', 'We provide 24/7 customer support through our chat system and email. Our team is committed to resolving any issues within 24 hours.', 'support', 1),
('How do I track my order?', 'You can track your order by logging into your account and going to the Orders section. You will receive email updates at each stage of shipping.', 'orders', 2),
('What payment methods do you accept?', 'We accept all major credit cards, PayPal, and bank transfers. All transactions are secured with SSL encryption.', 'payment', 3),
('How do I reset my password?', 'Click on the "Forgot Password" link on the login page and enter your email address. You will receive a password reset link.', 'account', 4),
('How do I become a Crossed Hearts affiliate?', 'Visit our Affiliation Programs page and fill out the application form. We will review your application and get back to you within 5 business days.', 'affiliate', 5)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_event_calendar_date ON public.event_calendar(event_date);
CREATE INDEX IF NOT EXISTS idx_event_calendar_active ON public.event_calendar(is_active);
CREATE INDEX IF NOT EXISTS idx_event_calendar_order ON public.event_calendar(display_order);

CREATE INDEX IF NOT EXISTS idx_release_schedule_date ON public.release_schedule(release_date);
CREATE INDEX IF NOT EXISTS idx_release_schedule_active ON public.release_schedule(is_active);
CREATE INDEX IF NOT EXISTS idx_release_schedule_order ON public.release_schedule(display_order);

CREATE INDEX IF NOT EXISTS idx_faq_items_category ON public.faq_items(category);
CREATE INDEX IF NOT EXISTS idx_faq_items_active ON public.faq_items(is_active);
CREATE INDEX IF NOT EXISTS idx_faq_items_order ON public.faq_items(display_order);
