-- =====================================================
-- SHOP ALL & DIGITAL READER SYSTEM - COMPLETE DATABASE SETUP
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CREATE SHOP ALL HEROES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS shop_all_heroes (
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
-- 2. CREATE SHOP ALL FILTERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS shop_all_filters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) DEFAULT 'category',
    options JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE SHOP ALL SORTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS shop_all_sorts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    value VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. CREATE DIGITAL READER SPECS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS digital_reader_specs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    creator VARCHAR(255) NOT NULL,
    creator_image_url TEXT,
    creator_bio TEXT,
    artist VARCHAR(255) NOT NULL,
    artist_image_url TEXT,
    release_date DATE,
    category VARCHAR(100),
    age_rating VARCHAR(20) DEFAULT 'all',
    genre VARCHAR(100),
    length INTEGER DEFAULT 0,
    description TEXT,
    cover_image_url TEXT,
    banner_image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Shop All Heroes indexes
CREATE INDEX IF NOT EXISTS idx_shop_all_heroes_active ON shop_all_heroes(is_active);
CREATE INDEX IF NOT EXISTS idx_shop_all_heroes_display_order ON shop_all_heroes(display_order);

-- Shop All Filters indexes
CREATE INDEX IF NOT EXISTS idx_shop_all_filters_active ON shop_all_filters(is_active);
CREATE INDEX IF NOT EXISTS idx_shop_all_filters_display_order ON shop_all_filters(display_order);
CREATE INDEX IF NOT EXISTS idx_shop_all_filters_type ON shop_all_filters(type);

-- Shop All Sorts indexes
CREATE INDEX IF NOT EXISTS idx_shop_all_sorts_active ON shop_all_sorts(is_active);
CREATE INDEX IF NOT EXISTS idx_shop_all_sorts_display_order ON shop_all_sorts(display_order);

-- Digital Reader Specs indexes
CREATE INDEX IF NOT EXISTS idx_digital_reader_specs_active ON digital_reader_specs(is_active);
CREATE INDEX IF NOT EXISTS idx_digital_reader_specs_display_order ON digital_reader_specs(display_order);
CREATE INDEX IF NOT EXISTS idx_digital_reader_specs_featured ON digital_reader_specs(is_featured);
CREATE INDEX IF NOT EXISTS idx_digital_reader_specs_category ON digital_reader_specs(category);

-- =====================================================
-- 6. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE shop_all_heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_all_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_all_sorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_reader_specs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. CREATE RLS POLICIES
-- =====================================================

-- Shop All Heroes Policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'shop_all_heroes' 
        AND policyname = 'Public read access for shop all heroes'
    ) THEN
        CREATE POLICY "Public read access for shop all heroes" 
        ON shop_all_heroes FOR SELECT 
        USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'shop_all_heroes' 
        AND policyname = 'Admin full access for shop all heroes'
    ) THEN
        CREATE POLICY "Admin full access for shop all heroes" 
        ON shop_all_heroes FOR ALL 
        USING (auth.role() = 'admin');
    END IF;
END $$;

-- Shop All Filters Policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'shop_all_filters' 
        AND policyname = 'Public read access for shop all filters'
    ) THEN
        CREATE POLICY "Public read access for shop all filters" 
        ON shop_all_filters FOR SELECT 
        USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'shop_all_filters' 
        AND policyname = 'Admin full access for shop all filters'
    ) THEN
        CREATE POLICY "Admin full access for shop all filters" 
        ON shop_all_filters FOR ALL 
        USING (auth.role() = 'admin');
    END IF;
END $$;

-- Shop All Sorts Policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'shop_all_sorts' 
        AND policyname = 'Public read access for shop all sorts'
    ) THEN
        CREATE POLICY "Public read access for shop all sorts" 
        ON shop_all_sorts FOR SELECT 
        USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'shop_all_sorts' 
        AND policyname = 'Admin full access for shop all sorts'
    ) THEN
        CREATE POLICY "Admin full access for shop all sorts" 
        ON shop_all_sorts FOR ALL 
        USING (auth.role() = 'admin');
    END IF;
END $$;

-- Digital Reader Specs Policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'digital_reader_specs' 
        AND policyname = 'Public read access for digital reader specs'
    ) THEN
        CREATE POLICY "Public read access for digital reader specs" 
        ON digital_reader_specs FOR SELECT 
        USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'digital_reader_specs' 
        AND policyname = 'Admin full access for digital reader specs'
    ) THEN
        CREATE POLICY "Admin full access for digital reader specs" 
        ON digital_reader_specs FOR ALL 
        USING (auth.role() = 'admin');
    END IF;
END $$;

-- =====================================================
-- 8. CREATE UPDATE TRIGGER FUNCTION (if not exists)
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- 9. CREATE TRIGGERS
-- =====================================================

-- Shop All Heroes Trigger
DROP TRIGGER IF EXISTS update_shop_all_heroes_updated_at ON shop_all_heroes;
CREATE TRIGGER update_shop_all_heroes_updated_at
    BEFORE UPDATE ON shop_all_heroes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Shop All Filters Trigger
DROP TRIGGER IF EXISTS update_shop_all_filters_updated_at ON shop_all_filters;
CREATE TRIGGER update_shop_all_filters_updated_at
    BEFORE UPDATE ON shop_all_filters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Shop All Sorts Trigger
DROP TRIGGER IF EXISTS update_shop_all_sorts_updated_at ON shop_all_sorts;
CREATE TRIGGER update_shop_all_sorts_updated_at
    BEFORE UPDATE ON shop_all_sorts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Digital Reader Specs Trigger
DROP TRIGGER IF EXISTS update_digital_reader_specs_updated_at ON digital_reader_specs;
CREATE TRIGGER update_digital_reader_specs_updated_at
    BEFORE UPDATE ON digital_reader_specs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample shop all heroes
INSERT INTO shop_all_heroes (title, description, background_image_url, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, is_active, display_order) VALUES
(
    'Explore Series',
    'Discover new series through manga and anime stories. Read stories, discover new characters, and learn lore through the life cycle.',
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=600&fit=crop',
    'Popular Series',
    '/our-series',
    'Browse All',
    '/shop-all',
    true,
    1
),
(
    'New Releases',
    'Fresh content added weekly! Stay up-to-date with the latest episodes and chapters from your favorite creators.',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop',
    'View New',
    '/series?filter=new',
    'Subscribe',
    '/subscribe',
    true,
    2
)
ON CONFLICT DO NOTHING;

-- Insert sample shop all filters
INSERT INTO shop_all_filters (name, type, options, is_active, display_order) VALUES
('Category', 'category', '["All", "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Romance", "Sci-Fi", "Thriller"]', true, 1),
('Age Rating', 'age_rating', '["All", "All Ages", "Teen", "Mature"]', true, 2),
('Status', 'status', '["All", "Ongoing", "Completed", "Hiatus"]', true, 3),
('Genre', 'genre', '["All", "Shounen", "Shoujo", "Seinen", "Josei", "Isekai", "Slice of Life"]', true, 4)
ON CONFLICT DO NOTHING;

-- Insert sample shop all sorts
INSERT INTO shop_all_sorts (name, value, is_active, display_order) VALUES
('Newest First', 'newest', true, 1),
('Oldest First', 'oldest', true, 2),
('A-Z', 'alphabetical', true, 3),
('Z-A', 'reverse_alphabetical', true, 4),
('Most Popular', 'popular', true, 5),
('Highest Rated', 'rating', true, 6),
('Price: Low to High', 'price_low', true, 7),
('Price: High to Low', 'price_high', true, 8)
ON CONFLICT DO NOTHING;

-- Insert sample digital reader specs
INSERT INTO digital_reader_specs (title, creator, artist, release_date, category, age_rating, genre, length, description, cover_image_url, banner_image_url, is_featured, is_active, display_order) VALUES
(
    'Digital Reader Pro',
    'Tech Innovations Inc.',
    'Design Studio Alpha',
    '2024-01-15',
    'Technology',
    'all',
    'Gadget Review',
    120,
    'The ultimate digital reading experience with advanced features and seamless integration.',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=400&fit=crop',
    true,
    true,
    1
),
(
    'E-Reader Classic',
    'BookTech Solutions',
    'Creative Design Co.',
    '2024-02-20',
    'Technology',
    'all',
    'Product Review',
    90,
    'A reliable and affordable e-reader perfect for everyday reading.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop',
    false,
    true,
    2
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 11. GRANT PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT ON shop_all_heroes TO authenticated;
GRANT SELECT ON shop_all_filters TO authenticated;
GRANT SELECT ON shop_all_sorts TO authenticated;
GRANT SELECT ON digital_reader_specs TO authenticated;

-- Grant permissions to anon users (for public access)
GRANT SELECT ON shop_all_heroes TO anon;
GRANT SELECT ON shop_all_filters TO anon;
GRANT SELECT ON shop_all_sorts TO anon;
GRANT SELECT ON digital_reader_specs TO anon;

-- =====================================================
-- 12. VERIFICATION QUERIES
-- =====================================================

-- Verify tables were created
SELECT 'shop_all_heroes' as table_name, COUNT(*) as record_count FROM shop_all_heroes
UNION ALL
SELECT 'shop_all_filters' as table_name, COUNT(*) as record_count FROM shop_all_filters
UNION ALL
SELECT 'shop_all_sorts' as table_name, COUNT(*) as record_count FROM shop_all_sorts
UNION ALL
SELECT 'digital_reader_specs' as table_name, COUNT(*) as record_count FROM digital_reader_specs;

-- Verify sample data
SELECT 'Sample Shop All Heroes:' as info;
SELECT id, title, is_active, display_order FROM shop_all_heroes ORDER BY display_order;

SELECT 'Sample Shop All Filters:' as info;
SELECT id, name, type, is_active, display_order FROM shop_all_filters ORDER BY display_order;

SELECT 'Sample Shop All Sorts:' as info;
SELECT id, name, value, is_active, display_order FROM shop_all_sorts ORDER BY display_order;

SELECT 'Sample Digital Reader Specs:' as info;
SELECT id, title, creator, is_featured, is_active, display_order FROM digital_reader_specs ORDER BY display_order;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

-- The Shop All and Digital Reader systems are now ready to use!
-- Tables created: shop_all_heroes, shop_all_filters, shop_all_sorts, digital_reader_specs
-- Sample data inserted: 2 heroes, 4 filters, 8 sorts, 2 specs
-- RLS policies enabled for secure access
-- Triggers set up for automatic timestamp updates
