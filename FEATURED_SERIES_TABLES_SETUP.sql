-- =====================================================
-- FEATURED SERIES SYSTEM - COMPLETE DATABASE SETUP
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CREATE FEATURED SERIES CONFIGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS featured_series_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    background_image_url TEXT,
    primary_button_text VARCHAR(100),
    primary_button_link TEXT,
    secondary_button_text VARCHAR(100),
    secondary_button_link TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CREATE FEATURED SERIES BADGES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS featured_series_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color code
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_featured_series_configs_active ON featured_series_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_featured_series_configs_display_order ON featured_series_configs(display_order);
CREATE INDEX IF NOT EXISTS idx_featured_series_badges_active ON featured_series_badges(is_active);
CREATE INDEX IF NOT EXISTS idx_featured_series_badges_display_order ON featured_series_badges(display_order);

-- =====================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE featured_series_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_series_badges ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CREATE RLS POLICIES
-- =====================================================

-- Featured Series Configs Policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'featured_series_configs' 
        AND policyname = 'Public read access for featured series configs'
    ) THEN
        CREATE POLICY "Public read access for featured series configs" 
        ON featured_series_configs FOR SELECT 
        USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'featured_series_configs' 
        AND policyname = 'Admin full access for featured series configs'
    ) THEN
        CREATE POLICY "Admin full access for featured series configs" 
        ON featured_series_configs FOR ALL 
        USING (auth.role() = 'admin');
    END IF;
END $$;

-- Featured Series Badges Policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'featured_series_badges' 
        AND policyname = 'Public read access for featured series badges'
    ) THEN
        CREATE POLICY "Public read access for featured series badges" 
        ON featured_series_badges FOR SELECT 
        USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'featured_series_badges' 
        AND policyname = 'Admin full access for featured series badges'
    ) THEN
        CREATE POLICY "Admin full access for featured series badges" 
        ON featured_series_badges FOR ALL 
        USING (auth.role() = 'admin');
    END IF;
END $$;

-- =====================================================
-- 6. CREATE UPDATE TRIGGER FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- 7. CREATE TRIGGERS
-- =====================================================

-- Featured Series Configs Trigger
DROP TRIGGER IF EXISTS update_featured_series_configs_updated_at ON featured_series_configs;
CREATE TRIGGER update_featured_series_configs_updated_at
    BEFORE UPDATE ON featured_series_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Featured Series Badges Trigger
DROP TRIGGER IF EXISTS update_featured_series_badges_updated_at ON featured_series_badges;
CREATE TRIGGER update_featured_series_badges_updated_at
    BEFORE UPDATE ON featured_series_badges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample featured series configs
INSERT INTO featured_series_configs (title, description, background_image_url, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, is_active, display_order) VALUES
(
    'Featured Series Spotlight',
    'Discover our most popular and trending comic series. From action-packed adventures to heartwarming stories, find your next favorite read.',
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=600&fit=crop',
    'Explore Series',
    '/series',
    'View All',
    '/comics',
    true,
    1
),
(
    'New Releases',
    'Fresh content added weekly! Stay up-to-date with the latest episodes and chapters from your favorite creators.',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop',
    'Browse New',
    '/series?filter=new',
    'Subscribe',
    '/subscribe',
    true,
    2
),
(
    'Premium Collection',
    'Exclusive premium series with high-quality artwork and engaging storylines. Available for coin purchase.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop',
    'View Premium',
    '/series?filter=premium',
    'Buy Coins',
    '/coins',
    true,
    3
)
ON CONFLICT DO NOTHING;

-- Insert sample featured series badges
INSERT INTO featured_series_badges (name, color, is_active, display_order) VALUES
('Trending', '#EF4444', true, 1),
('New', '#10B981', true, 2),
('Popular', '#F59E0B', true, 3),
('Premium', '#8B5CF6', true, 4),
('Completed', '#6B7280', true, 5),
('Ongoing', '#3B82F6', true, 6)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 9. GRANT PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT ON featured_series_configs TO authenticated;
GRANT SELECT ON featured_series_badges TO authenticated;

-- Grant permissions to anon users (for public access)
GRANT SELECT ON featured_series_configs TO anon;
GRANT SELECT ON featured_series_badges TO anon;

-- =====================================================
-- 10. VERIFICATION QUERIES
-- =====================================================

-- Verify tables were created
SELECT 'featured_series_configs' as table_name, COUNT(*) as record_count FROM featured_series_configs
UNION ALL
SELECT 'featured_series_badges' as table_name, COUNT(*) as record_count FROM featured_series_badges;

-- Verify sample data
SELECT 'Sample Configs:' as info;
SELECT id, title, is_active, display_order FROM featured_series_configs ORDER BY display_order;

SELECT 'Sample Badges:' as info;
SELECT id, name, color, is_active, display_order FROM featured_series_badges ORDER BY display_order;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

-- The featured series system is now ready to use!
-- Tables created: featured_series_configs, featured_series_badges
-- Sample data inserted: 3 configs, 6 badges
-- RLS policies enabled for secure access
-- Triggers set up for automatic timestamp updates
