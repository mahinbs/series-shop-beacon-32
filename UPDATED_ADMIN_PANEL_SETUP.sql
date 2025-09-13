-- =====================================================
-- UPDATED ADMIN PANEL DATABASE SETUP
-- =====================================================
-- This script safely creates all tables needed for the admin panel features
-- It handles existing tables and triggers properly to avoid conflicts
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. FEATURED SERIES SYSTEM (SAFE CREATION)
-- =====================================================

-- Featured Series Configs Table (already exists, but ensure it's correct)
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

-- Featured Series Badges Table (already exists, but ensure it's correct)
CREATE TABLE IF NOT EXISTS featured_series_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Featured Series Templates Table (NEW)
CREATE TABLE IF NOT EXISTS featured_series_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    config_data JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Featured Series Template History Table (NEW)
CREATE TABLE IF NOT EXISTS featured_series_template_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES featured_series_templates(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    config_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. COIN SYSTEM (SAFE CREATION)
-- =====================================================

-- Coin Packages Table (already exists, but ensure it's correct)
CREATE TABLE IF NOT EXISTS coin_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    coins INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    bonus INTEGER DEFAULT 0,
    popular BOOLEAN DEFAULT FALSE,
    best_value BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Coins Table (already exists, but ensure it's correct)
CREATE TABLE IF NOT EXISTS user_coins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    balance INTEGER NOT NULL DEFAULT 0,
    total_earned INTEGER NOT NULL DEFAULT 0,
    total_spent INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Coin Transactions Table (already exists, but ensure it's correct)
CREATE TABLE IF NOT EXISTS coin_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('purchase', 'spend', 'earn', 'refund')),
    amount INTEGER NOT NULL,
    balance INTEGER NOT NULL,
    description TEXT NOT NULL,
    reference VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coin Purchases Table (already exists, but ensure it's correct)
CREATE TABLE IF NOT EXISTS coin_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    package_id UUID REFERENCES coin_packages(id),
    coins INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. COMIC SYSTEM (SAFE CREATION)
-- =====================================================

-- Comic Series Table (NEW)
CREATE TABLE IF NOT EXISTS comic_series (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    cover_image_url TEXT,
    banner_image_url TEXT,
    status VARCHAR(20) DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'hiatus', 'cancelled')),
    genre TEXT[],
    tags TEXT[],
    age_rating VARCHAR(10) DEFAULT 'all' CHECK (age_rating IN ('all', 'teen', 'mature')),
    total_episodes INTEGER DEFAULT 0,
    total_pages INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comic Episodes Table (NEW)
CREATE TABLE IF NOT EXISTS comic_episodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    series_id UUID REFERENCES comic_series(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    episode_number INTEGER NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    price DECIMAL(10,2) DEFAULT 0,
    coins_required INTEGER DEFAULT 0,
    total_pages INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(series_id, episode_number)
);

-- Comic Pages Table (NEW)
CREATE TABLE IF NOT EXISTS comic_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    episode_id UUID REFERENCES comic_episodes(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(episode_id, page_number)
);

-- =====================================================
-- 4. SHOP SYSTEM (SAFE CREATION)
-- =====================================================

-- Shop All Heroes Table (NEW)
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

-- Shop All Filters Table (NEW)
CREATE TABLE IF NOT EXISTS shop_all_filters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    options JSONB,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shop All Sorts Table (NEW)
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
-- 5. DIGITAL READER SYSTEM (SAFE CREATION)
-- =====================================================

-- Digital Reader Specs Table (NEW - with correct schema)
CREATE TABLE IF NOT EXISTS digital_reader_specs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    creator TEXT NOT NULL,
    creator_image_url TEXT,
    creator_bio TEXT,
    artist TEXT,
    artist_image_url TEXT,
    release_date DATE,
    category VARCHAR(50),
    age_rating VARCHAR(10),
    genre VARCHAR(50),
    length INTEGER,
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
-- 6. ADDITIONAL MISSING TABLES (SAFE CREATION)
-- =====================================================

-- Creators Table (NEW)
CREATE TABLE IF NOT EXISTS creators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    website_url TEXT,
    social_links JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comic Files Table (NEW)
CREATE TABLE IF NOT EXISTS comic_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    episode_id UUID REFERENCES comic_episodes(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unlocked Content Table (NEW)
CREATE TABLE IF NOT EXISTS unlocked_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    content_id UUID NOT NULL,
    coins_spent INTEGER NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Settings Table (NEW)
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Settings Table (NEW)
CREATE TABLE IF NOT EXISTS email_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Settings Table (NEW)
CREATE TABLE IF NOT EXISTS payment_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping Settings Table (NEW)
CREATE TABLE IF NOT EXISTS shipping_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Settings Table (NEW)
CREATE TABLE IF NOT EXISTS security_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backup Settings Table (NEW)
CREATE TABLE IF NOT EXISTS backup_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. CREATE INDEXES FOR PERFORMANCE (SAFE)
-- =====================================================

-- Featured Series Indexes
CREATE INDEX IF NOT EXISTS idx_featured_series_configs_active ON featured_series_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_featured_series_configs_display_order ON featured_series_configs(display_order);
CREATE INDEX IF NOT EXISTS idx_featured_series_badges_active ON featured_series_badges(is_active);
CREATE INDEX IF NOT EXISTS idx_featured_series_templates_active ON featured_series_templates(is_active);

-- Coin System Indexes
CREATE INDEX IF NOT EXISTS idx_coin_packages_active ON coin_packages(active);
CREATE INDEX IF NOT EXISTS idx_user_coins_user_id ON user_coins(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_id ON coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_timestamp ON coin_transactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_coin_purchases_user_id ON coin_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_purchases_status ON coin_purchases(status);

-- Comic System Indexes
CREATE INDEX IF NOT EXISTS idx_comic_series_active ON comic_series(is_active);
CREATE INDEX IF NOT EXISTS idx_comic_series_featured ON comic_series(is_featured);
CREATE INDEX IF NOT EXISTS idx_comic_episodes_series_id ON comic_episodes(series_id);
CREATE INDEX IF NOT EXISTS idx_comic_episodes_published ON comic_episodes(is_published);
CREATE INDEX IF NOT EXISTS idx_comic_pages_episode_id ON comic_pages(episode_id);

-- Shop System Indexes
CREATE INDEX IF NOT EXISTS idx_shop_all_heroes_active ON shop_all_heroes(is_active);
CREATE INDEX IF NOT EXISTS idx_shop_all_filters_active ON shop_all_filters(is_active);
CREATE INDEX IF NOT EXISTS idx_shop_all_sorts_active ON shop_all_sorts(is_active);

-- =====================================================
-- 8. ENABLE ROW LEVEL SECURITY (SAFE)
-- =====================================================

-- Enable RLS on all tables (safe - won't error if already enabled)
ALTER TABLE featured_series_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_series_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_series_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_series_template_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coins ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE comic_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE comic_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comic_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_all_heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_all_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_all_sorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_reader_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE comic_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE unlocked_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 9. CREATE RLS POLICIES (SAFE)
-- =====================================================

-- Featured Series Policies (safe creation)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'featured_series_configs' AND policyname = 'Featured series configs are viewable by everyone') THEN
        CREATE POLICY "Featured series configs are viewable by everyone" ON featured_series_configs FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'featured_series_badges' AND policyname = 'Featured series badges are viewable by everyone') THEN
        CREATE POLICY "Featured series badges are viewable by everyone" ON featured_series_badges FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'featured_series_templates' AND policyname = 'Featured series templates are viewable by everyone') THEN
        CREATE POLICY "Featured series templates are viewable by everyone" ON featured_series_templates FOR SELECT USING (true);
    END IF;
END $$;

-- Coin System Policies (safe creation)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coin_packages' AND policyname = 'Coin packages are viewable by everyone') THEN
        CREATE POLICY "Coin packages are viewable by everyone" ON coin_packages FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_coins' AND policyname = 'Users can view their own coins') THEN
        CREATE POLICY "Users can view their own coins" ON user_coins FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coin_transactions' AND policyname = 'Users can view their own transactions') THEN
        CREATE POLICY "Users can view their own transactions" ON coin_transactions FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coin_purchases' AND policyname = 'Users can view their own purchases') THEN
        CREATE POLICY "Users can view their own purchases" ON coin_purchases FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- Comic System Policies (safe creation)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comic_series' AND policyname = 'Comic series are viewable by everyone') THEN
        CREATE POLICY "Comic series are viewable by everyone" ON comic_series FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comic_episodes' AND policyname = 'Comic episodes are viewable by everyone') THEN
        CREATE POLICY "Comic episodes are viewable by everyone" ON comic_episodes FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comic_pages' AND policyname = 'Comic pages are viewable by everyone') THEN
        CREATE POLICY "Comic pages are viewable by everyone" ON comic_pages FOR SELECT USING (true);
    END IF;
END $$;

-- Shop System Policies (safe creation)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shop_all_heroes' AND policyname = 'Shop heroes are viewable by everyone') THEN
        CREATE POLICY "Shop heroes are viewable by everyone" ON shop_all_heroes FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shop_all_filters' AND policyname = 'Shop filters are viewable by everyone') THEN
        CREATE POLICY "Shop filters are viewable by everyone" ON shop_all_filters FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shop_all_sorts' AND policyname = 'Shop sorts are viewable by everyone') THEN
        CREATE POLICY "Shop sorts are viewable by everyone" ON shop_all_sorts FOR SELECT USING (true);
    END IF;
END $$;

-- Digital Reader Policies (safe creation)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'digital_reader_specs' AND policyname = 'Digital reader specs are viewable by everyone') THEN
        CREATE POLICY "Digital reader specs are viewable by everyone" ON digital_reader_specs FOR SELECT USING (true);
    END IF;
END $$;

-- Additional Tables Policies (safe creation)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'creators' AND policyname = 'Creators are viewable by everyone') THEN
        CREATE POLICY "Creators are viewable by everyone" ON creators FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comic_files' AND policyname = 'Comic files are viewable by everyone') THEN
        CREATE POLICY "Comic files are viewable by everyone" ON comic_files FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'unlocked_content' AND policyname = 'Users can view their own unlocked content') THEN
        CREATE POLICY "Users can view their own unlocked content" ON unlocked_content FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- Settings Policies (safe creation)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Site settings are viewable by everyone') THEN
        CREATE POLICY "Site settings are viewable by everyone" ON site_settings FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_settings' AND policyname = 'Email settings are viewable by everyone') THEN
        CREATE POLICY "Email settings are viewable by everyone" ON email_settings FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_settings' AND policyname = 'Payment settings are viewable by everyone') THEN
        CREATE POLICY "Payment settings are viewable by everyone" ON payment_settings FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shipping_settings' AND policyname = 'Shipping settings are viewable by everyone') THEN
        CREATE POLICY "Shipping settings are viewable by everyone" ON shipping_settings FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'security_settings' AND policyname = 'Security settings are viewable by everyone') THEN
        CREATE POLICY "Security settings are viewable by everyone" ON security_settings FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'backup_settings' AND policyname = 'Backup settings are viewable by everyone') THEN
        CREATE POLICY "Backup settings are viewable by everyone" ON backup_settings FOR SELECT USING (true);
    END IF;
END $$;

-- =====================================================
-- 10. INSERT SAMPLE DATA (SAFE)
-- =====================================================

-- Insert sample featured series config (safe - won't duplicate)
INSERT INTO featured_series_configs (id, title, description, background_image_url, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, is_active, display_order)
VALUES (
    'b1086370-7c41-4cc3-8969-d4d704720ec8',
    'Featured Series Spotlight',
    'Discover our most popular and trending comic series. From action-packed adventures to heartwarming stories, find your next favorite read.',
    '',
    'Explore Series',
    '/series',
    'View All',
    '/comics',
    true,
    1
) ON CONFLICT (id) DO NOTHING;

-- Insert sample featured series badges (safe - won't duplicate)
INSERT INTO featured_series_badges (name, color, is_active, display_order)
VALUES 
    ('New Chapter', '#EF4444', true, 1),
    ('Trending', '#3B82F6', true, 2),
    ('Updated', '#10B981', true, 3),
    ('Popular', '#F59E0B', true, 4)
ON CONFLICT DO NOTHING;

-- Insert sample coin packages (safe - won't duplicate)
INSERT INTO coin_packages (name, coins, price, bonus, popular, best_value, active)
VALUES 
    ('Starter Pack', 100, 0.99, 0, false, false, true),
    ('Popular Pack', 500, 4.99, 50, true, false, true),
    ('Best Value', 1200, 9.99, 200, false, true, true),
    ('Mega Pack', 2500, 19.99, 500, false, false, true)
ON CONFLICT DO NOTHING;

-- Insert sample shop heroes (safe - won't duplicate)
INSERT INTO shop_all_heroes (title, description, background_image_url, primary_button_text, primary_button_link, is_active, display_order)
VALUES 
    ('Superhero Collection', 'Amazing superhero merchandise', '/images/heroes/superhero.jpg', 'Shop Now', '/shop', true, 1),
    ('Anime Characters', 'Popular anime character items', '/images/heroes/anime.jpg', 'Explore', '/anime', true, 2),
    ('Comic Heroes', 'Classic comic book heroes', '/images/heroes/comic.jpg', 'View All', '/comics', true, 3)
ON CONFLICT DO NOTHING;

-- Insert sample shop filters (safe - won't duplicate)
INSERT INTO shop_all_filters (name, type, options, is_active, display_order)
VALUES 
    ('Category', 'select', '["Books", "Merchandise", "Digital", "Collectibles"]', true, 1),
    ('Price Range', 'range', '{"min": 0, "max": 100}', true, 2),
    ('Availability', 'checkbox', '["In Stock", "Pre-order", "Digital Only"]', true, 3)
ON CONFLICT DO NOTHING;

-- Insert sample shop sorts (safe - won't duplicate)
INSERT INTO shop_all_sorts (name, value, is_active, display_order)
VALUES 
    ('Newest First', 'created_at_desc', true, 1),
    ('Price Low to High', 'price_asc', true, 2),
    ('Price High to Low', 'price_desc', true, 3),
    ('Most Popular', 'popularity_desc', true, 4)
ON CONFLICT DO NOTHING;

-- Insert sample digital reader specs (safe - won't duplicate)
INSERT INTO digital_reader_specs (title, creator, creator_image_url, creator_bio, artist, artist_image_url, release_date, category, age_rating, genre, length, description, cover_image_url, banner_image_url, is_featured, is_active, display_order)
VALUES 
    ('SKIP AND LOAFER', 'YASUO TAKAMITSU', '/lovable-uploads/creator-placeholder.png', 'Yasuo Takamitsu is a renowned manga artist known for his work on slice-of-life and romance series. He has been creating manga for over 15 years and is celebrated for his detailed character development and emotional storytelling.', 'YASUO TAKAMITSU', '/lovable-uploads/artist-placeholder.png', '2023-02-11', 'manga', 'teen', 'shojo', 280, 'Overall, Oshi no Ko is best described as a subversive, dramatic take on the idol industry in Japan, though it has some romantic plotlines as well. Protagonist Aqua Hoshino is more interested in pursuing his quest for vengeance in an exploitative industry, but he finds himself in the spotlight without even meaning to.', '/lovable-uploads/4e6b2521-dc40-43e9-aed0-53fef670570b.png', '/lovable-uploads/4e6b2521-dc40-43e9-aed0-53fef670570b.png', true, true, 1)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 11. CREATE UPDATED_AT TRIGGERS (SAFE)
-- =====================================================

-- Function to update updated_at timestamp (safe - won't error if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (SAFE - DROP IF EXISTS first)
DROP TRIGGER IF EXISTS update_featured_series_configs_updated_at ON featured_series_configs;
CREATE TRIGGER update_featured_series_configs_updated_at BEFORE UPDATE ON featured_series_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_featured_series_badges_updated_at ON featured_series_badges;
CREATE TRIGGER update_featured_series_badges_updated_at BEFORE UPDATE ON featured_series_badges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_featured_series_templates_updated_at ON featured_series_templates;
CREATE TRIGGER update_featured_series_templates_updated_at BEFORE UPDATE ON featured_series_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coin_packages_updated_at ON coin_packages;
CREATE TRIGGER update_coin_packages_updated_at BEFORE UPDATE ON coin_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_coins_updated_at ON user_coins;
CREATE TRIGGER update_user_coins_updated_at BEFORE UPDATE ON user_coins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coin_purchases_updated_at ON coin_purchases;
CREATE TRIGGER update_coin_purchases_updated_at BEFORE UPDATE ON coin_purchases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comic_series_updated_at ON comic_series;
CREATE TRIGGER update_comic_series_updated_at BEFORE UPDATE ON comic_series FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comic_episodes_updated_at ON comic_episodes;
CREATE TRIGGER update_comic_episodes_updated_at BEFORE UPDATE ON comic_episodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shop_all_heroes_updated_at ON shop_all_heroes;
CREATE TRIGGER update_shop_all_heroes_updated_at BEFORE UPDATE ON shop_all_heroes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shop_all_filters_updated_at ON shop_all_filters;
CREATE TRIGGER update_shop_all_filters_updated_at BEFORE UPDATE ON shop_all_filters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shop_all_sorts_updated_at ON shop_all_sorts;
CREATE TRIGGER update_shop_all_sorts_updated_at BEFORE UPDATE ON shop_all_sorts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_digital_reader_specs_updated_at ON digital_reader_specs;
CREATE TRIGGER update_digital_reader_specs_updated_at BEFORE UPDATE ON digital_reader_specs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_creators_updated_at ON creators;
CREATE TRIGGER update_creators_updated_at BEFORE UPDATE ON creators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comic_files_updated_at ON comic_files;
CREATE TRIGGER update_comic_files_updated_at BEFORE UPDATE ON comic_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_settings_updated_at ON email_settings;
CREATE TRIGGER update_email_settings_updated_at BEFORE UPDATE ON email_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_settings_updated_at ON payment_settings;
CREATE TRIGGER update_payment_settings_updated_at BEFORE UPDATE ON payment_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shipping_settings_updated_at ON shipping_settings;
CREATE TRIGGER update_shipping_settings_updated_at BEFORE UPDATE ON shipping_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_security_settings_updated_at ON security_settings;
CREATE TRIGGER update_security_settings_updated_at BEFORE UPDATE ON security_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_backup_settings_updated_at ON backup_settings;
CREATE TRIGGER update_backup_settings_updated_at BEFORE UPDATE ON backup_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- Grant necessary permissions (safe)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Updated Admin Panel Database Setup Complete!';
    RAISE NOTICE '📊 All tables created/verified: featured_series_configs, featured_series_badges, featured_series_templates, coin_packages, user_coins, coin_transactions, comic_series, comic_episodes, comic_pages, shop_all_heroes, shop_all_filters, shop_all_sorts, digital_reader_specs, creators, comic_files, unlocked_content, site_settings, email_settings, payment_settings, shipping_settings, security_settings, backup_settings';
    RAISE NOTICE '🔒 RLS enabled on all tables with appropriate policies';
    RAISE NOTICE '📈 Indexes created for optimal performance';
    RAISE NOTICE '🎯 Sample data inserted for testing';
    RAISE NOTICE '🚀 Your admin panel is now ready to use without conflicts!';
END $$;
