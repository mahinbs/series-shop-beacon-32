-- =====================================================
-- COMPLETE ADMIN PANEL DATABASE SETUP
-- =====================================================
-- This script creates all tables needed for the admin panel features
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. FEATURED SERIES SYSTEM
-- =====================================================

-- Featured Series Configs Table
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

-- Featured Series Badges Table
CREATE TABLE IF NOT EXISTS featured_series_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Featured Series Templates Table
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

-- Featured Series Template History Table
CREATE TABLE IF NOT EXISTS featured_series_template_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES featured_series_templates(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    config_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. COIN SYSTEM
-- =====================================================

-- Coin Packages Table
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

-- User Coins Table
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

-- Coin Transactions Table
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

-- Coin Purchases Table
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
-- 3. COMIC SYSTEM
-- =====================================================

-- Comic Series Table
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

-- Comic Episodes Table
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

-- Comic Pages Table
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
-- 4. SHOP SYSTEM
-- =====================================================

-- Shop All Heroes Table
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

-- Shop All Filters Table
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

-- Shop All Sorts Table
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
-- 5. DIGITAL READER SYSTEM
-- =====================================================

-- Digital Reader Specs Table
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
-- 6. CREATE INDEXES FOR PERFORMANCE
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
-- 7. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
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

-- =====================================================
-- 8. CREATE RLS POLICIES
-- =====================================================

-- Featured Series Policies (Public read, Admin write)
CREATE POLICY "Featured series configs are viewable by everyone" ON featured_series_configs FOR SELECT USING (true);
CREATE POLICY "Featured series badges are viewable by everyone" ON featured_series_badges FOR SELECT USING (true);
CREATE POLICY "Featured series templates are viewable by everyone" ON featured_series_templates FOR SELECT USING (true);

-- Coin System Policies (User-specific for user_coins and transactions)
CREATE POLICY "Coin packages are viewable by everyone" ON coin_packages FOR SELECT USING (true);
CREATE POLICY "Users can view their own coins" ON user_coins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own transactions" ON coin_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own purchases" ON coin_purchases FOR SELECT USING (auth.uid() = user_id);

-- Comic System Policies (Public read)
CREATE POLICY "Comic series are viewable by everyone" ON comic_series FOR SELECT USING (true);
CREATE POLICY "Comic episodes are viewable by everyone" ON comic_episodes FOR SELECT USING (true);
CREATE POLICY "Comic pages are viewable by everyone" ON comic_pages FOR SELECT USING (true);

-- Shop System Policies (Public read)
CREATE POLICY "Shop heroes are viewable by everyone" ON shop_all_heroes FOR SELECT USING (true);
CREATE POLICY "Shop filters are viewable by everyone" ON shop_all_filters FOR SELECT USING (true);
CREATE POLICY "Shop sorts are viewable by everyone" ON shop_all_sorts FOR SELECT USING (true);

-- Digital Reader Policies (Public read)
CREATE POLICY "Digital reader specs are viewable by everyone" ON digital_reader_specs FOR SELECT USING (true);

-- =====================================================
-- 9. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample featured series config
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

-- Insert sample featured series badges
INSERT INTO featured_series_badges (name, color, is_active, display_order)
VALUES 
    ('New Chapter', '#EF4444', true, 1),
    ('Trending', '#3B82F6', true, 2),
    ('Updated', '#10B981', true, 3),
    ('Popular', '#F59E0B', true, 4)
ON CONFLICT DO NOTHING;

-- Insert sample coin packages
INSERT INTO coin_packages (name, coins, price, bonus, popular, best_value, active)
VALUES 
    ('Starter Pack', 100, 0.99, 0, false, false, true),
    ('Popular Pack', 500, 4.99, 50, true, false, true),
    ('Best Value', 1200, 9.99, 200, false, true, true),
    ('Mega Pack', 2500, 19.99, 500, false, false, true)
ON CONFLICT DO NOTHING;

-- Insert sample shop heroes
INSERT INTO shop_all_heroes (title, description, background_image_url, primary_button_text, primary_button_link, is_active, display_order)
VALUES 
    ('Superhero Collection', 'Amazing superhero merchandise', '/images/heroes/superhero.jpg', 'Shop Now', '/shop', true, 1),
    ('Anime Characters', 'Popular anime character items', '/images/heroes/anime.jpg', 'Explore', '/anime', true, 2),
    ('Comic Heroes', 'Classic comic book heroes', '/images/heroes/comic.jpg', 'View All', '/comics', true, 3)
ON CONFLICT DO NOTHING;

-- Insert sample shop filters
INSERT INTO shop_all_filters (name, type, options, is_active, display_order)
VALUES 
    ('Category', 'select', '["Books", "Merchandise", "Digital", "Collectibles"]', true, 1),
    ('Price Range', 'range', '{"min": 0, "max": 100}', true, 2),
    ('Availability', 'checkbox', '["In Stock", "Pre-order", "Digital Only"]', true, 3)
ON CONFLICT DO NOTHING;

-- Insert sample shop sorts
INSERT INTO shop_all_sorts (name, value, is_active, display_order)
VALUES 
    ('Newest First', 'created_at_desc', true, 1),
    ('Price Low to High', 'price_asc', true, 2),
    ('Price High to Low', 'price_desc', true, 3),
    ('Most Popular', 'popularity_desc', true, 4)
ON CONFLICT DO NOTHING;

-- Insert sample digital reader specs
INSERT INTO digital_reader_specs (title, creator, creator_image_url, creator_bio, artist, artist_image_url, release_date, category, age_rating, genre, length, description, cover_image_url, banner_image_url, is_featured, is_active, display_order)
VALUES 
    ('SKIP AND LOAFER', 'YASUO TAKAMITSU', '/lovable-uploads/creator-placeholder.png', 'Yasuo Takamitsu is a renowned manga artist known for his work on slice-of-life and romance series. He has been creating manga for over 15 years and is celebrated for his detailed character development and emotional storytelling.', 'YASUO TAKAMITSU', '/lovable-uploads/artist-placeholder.png', '2023-02-11', 'manga', 'teen', 'shojo', 280, 'Overall, Oshi no Ko is best described as a subversive, dramatic take on the idol industry in Japan, though it has some romantic plotlines as well. Protagonist Aqua Hoshino is more interested in pursuing his quest for vengeance in an exploitative industry, but he finds himself in the spotlight without even meaning to.', '/lovable-uploads/4e6b2521-dc40-43e9-aed0-53fef670570b.png', '/lovable-uploads/4e6b2521-dc40-43e9-aed0-53fef670570b.png', true, true, 1)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 10. CREATE UPDATED_AT TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_featured_series_configs_updated_at BEFORE UPDATE ON featured_series_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_featured_series_badges_updated_at BEFORE UPDATE ON featured_series_badges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_featured_series_templates_updated_at BEFORE UPDATE ON featured_series_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coin_packages_updated_at BEFORE UPDATE ON coin_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_coins_updated_at BEFORE UPDATE ON user_coins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coin_purchases_updated_at BEFORE UPDATE ON coin_purchases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comic_series_updated_at BEFORE UPDATE ON comic_series FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comic_episodes_updated_at BEFORE UPDATE ON comic_episodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shop_all_heroes_updated_at BEFORE UPDATE ON shop_all_heroes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shop_all_filters_updated_at BEFORE UPDATE ON shop_all_filters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shop_all_sorts_updated_at BEFORE UPDATE ON shop_all_sorts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_digital_reader_specs_updated_at BEFORE UPDATE ON digital_reader_specs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 11. ADDITIONAL MISSING TABLES
-- =====================================================

-- Creators Table (for comic system)
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

-- Comic Files Table (for comic system)
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

-- Unlocked Content Table (for coin system)
CREATE TABLE IF NOT EXISTS unlocked_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    content_id UUID NOT NULL,
    coins_spent INTEGER NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Settings Table
CREATE TABLE IF NOT EXISTS email_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Settings Table
CREATE TABLE IF NOT EXISTS payment_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping Settings Table
CREATE TABLE IF NOT EXISTS shipping_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Settings Table
CREATE TABLE IF NOT EXISTS security_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backup Settings Table
CREATE TABLE IF NOT EXISTS backup_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 12. ENABLE RLS ON ADDITIONAL TABLES
-- =====================================================

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
-- 13. CREATE RLS POLICIES FOR ADDITIONAL TABLES
-- =====================================================

-- Creators policies
CREATE POLICY "Creators are viewable by everyone" ON creators FOR SELECT USING (true);

-- Comic files policies
CREATE POLICY "Comic files are viewable by everyone" ON comic_files FOR SELECT USING (true);

-- Unlocked content policies
CREATE POLICY "Users can view their own unlocked content" ON unlocked_content FOR SELECT USING (auth.uid() = user_id);

-- Settings policies (admin only)
CREATE POLICY "Site settings are viewable by everyone" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Email settings are viewable by everyone" ON email_settings FOR SELECT USING (true);
CREATE POLICY "Payment settings are viewable by everyone" ON payment_settings FOR SELECT USING (true);
CREATE POLICY "Shipping settings are viewable by everyone" ON shipping_settings FOR SELECT USING (true);
CREATE POLICY "Security settings are viewable by everyone" ON security_settings FOR SELECT USING (true);
CREATE POLICY "Backup settings are viewable by everyone" ON backup_settings FOR SELECT USING (true);

-- =====================================================
-- 14. CREATE TRIGGERS FOR ADDITIONAL TABLES
-- =====================================================

CREATE TRIGGER update_creators_updated_at BEFORE UPDATE ON creators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comic_files_updated_at BEFORE UPDATE ON comic_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_settings_updated_at BEFORE UPDATE ON email_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_settings_updated_at BEFORE UPDATE ON payment_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shipping_settings_updated_at BEFORE UPDATE ON shipping_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_security_settings_updated_at BEFORE UPDATE ON security_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_backup_settings_updated_at BEFORE UPDATE ON backup_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Admin Panel Database Setup Complete!';
    RAISE NOTICE '📊 Created tables: featured_series_configs, featured_series_badges, featured_series_templates, coin_packages, user_coins, coin_transactions, comic_series, comic_episodes, comic_pages, shop_all_heroes, shop_all_filters, shop_all_sorts, digital_reader_specs';
    RAISE NOTICE '🔒 RLS enabled on all tables with appropriate policies';
    RAISE NOTICE '📈 Indexes created for optimal performance';
    RAISE NOTICE '🎯 Sample data inserted for testing';
    RAISE NOTICE '🚀 Your admin panel is now ready to use!';
END $$;
