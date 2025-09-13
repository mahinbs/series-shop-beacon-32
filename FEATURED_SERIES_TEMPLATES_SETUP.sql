-- =====================================================
-- FEATURED SERIES TEMPLATES SYSTEM - COMPLETE DATABASE SETUP
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CREATE FEATURED SERIES TEMPLATES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS featured_series_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_type VARCHAR(50) DEFAULT 'config', -- 'config', 'badge', 'combined'
    config_data JSONB, -- Store featured series config data
    badge_data JSONB, -- Store badge data
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR(255) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CREATE FEATURED SERIES TEMPLATE HISTORY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS featured_series_template_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES featured_series_templates(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'applied', 'restored'
    previous_data JSONB, -- Store previous state before change
    new_data JSONB, -- Store new state after change
    applied_by VARCHAR(255) DEFAULT 'admin',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Featured Series Templates indexes
CREATE INDEX IF NOT EXISTS idx_featured_series_templates_type ON featured_series_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_featured_series_templates_active ON featured_series_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_featured_series_templates_default ON featured_series_templates(is_default);
CREATE INDEX IF NOT EXISTS idx_featured_series_templates_created_by ON featured_series_templates(created_by);

-- Featured Series Template History indexes
CREATE INDEX IF NOT EXISTS idx_featured_series_template_history_template_id ON featured_series_template_history(template_id);
CREATE INDEX IF NOT EXISTS idx_featured_series_template_history_action ON featured_series_template_history(action);
CREATE INDEX IF NOT EXISTS idx_featured_series_template_history_applied_at ON featured_series_template_history(applied_at);

-- =====================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE featured_series_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_series_template_history ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CREATE RLS POLICIES
-- =====================================================

-- Featured Series Templates Policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'featured_series_templates' 
        AND policyname = 'Public read access for featured series templates'
    ) THEN
        CREATE POLICY "Public read access for featured series templates" 
        ON featured_series_templates FOR SELECT 
        USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'featured_series_templates' 
        AND policyname = 'Admin full access for featured series templates'
    ) THEN
        CREATE POLICY "Admin full access for featured series templates" 
        ON featured_series_templates FOR ALL 
        USING (auth.role() = 'admin');
    END IF;
END $$;

-- Featured Series Template History Policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'featured_series_template_history' 
        AND policyname = 'Public read access for featured series template history'
    ) THEN
        CREATE POLICY "Public read access for featured series template history" 
        ON featured_series_template_history FOR SELECT 
        USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'featured_series_template_history' 
        AND policyname = 'Admin full access for featured series template history'
    ) THEN
        CREATE POLICY "Admin full access for featured series template history" 
        ON featured_series_template_history FOR ALL 
        USING (auth.role() = 'admin');
    END IF;
END $$;

-- =====================================================
-- 6. CREATE UPDATE TRIGGER FUNCTION (if not exists)
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

-- Featured Series Templates Trigger
DROP TRIGGER IF EXISTS update_featured_series_templates_updated_at ON featured_series_templates;
CREATE TRIGGER update_featured_series_templates_updated_at
    BEFORE UPDATE ON featured_series_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. INSERT DEFAULT TEMPLATES
-- =====================================================

-- Insert default "Before Template" - captures current state
INSERT INTO featured_series_templates (name, description, template_type, config_data, badge_data, is_default, is_active, created_by) VALUES
(
    'Before Template',
    'Template capturing the current state before any changes. Use this to restore the original configuration.',
    'combined',
    '{
        "configs": [
            {
                "title": "Featured Series Spotlight",
                "description": "Discover our most popular and trending comic series. From action-packed adventures to heartwarming stories, find your next favorite read.",
                "background_image_url": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=600&fit=crop",
                "primary_button_text": "Explore Series",
                "primary_button_link": "/series",
                "secondary_button_text": "View All",
                "secondary_button_link": "/comics",
                "is_active": true,
                "display_order": 1
            },
            {
                "title": "New Releases",
                "description": "Fresh content added weekly! Stay up-to-date with the latest episodes and chapters from your favorite creators.",
                "background_image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop",
                "primary_button_text": "Browse New",
                "primary_button_link": "/series?filter=new",
                "secondary_button_text": "Subscribe",
                "secondary_button_link": "/subscribe",
                "is_active": true,
                "display_order": 2
            },
            {
                "title": "Premium Collection",
                "description": "Exclusive premium series with high-quality artwork and engaging storylines. Available for coin purchase.",
                "background_image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop",
                "primary_button_text": "View Premium",
                "primary_button_link": "/series?filter=premium",
                "secondary_button_text": "Buy Coins",
                "secondary_button_link": "/coins",
                "is_active": true,
                "display_order": 3
            }
        ]
    }'::jsonb,
    '{
        "badges": [
            {
                "name": "Trending",
                "color": "#EF4444",
                "is_active": true,
                "display_order": 1
            },
            {
                "name": "New",
                "color": "#10B981",
                "is_active": true,
                "display_order": 2
            },
            {
                "name": "Popular",
                "color": "#F59E0B",
                "is_active": true,
                "display_order": 3
            },
            {
                "name": "Premium",
                "color": "#8B5CF6",
                "is_active": true,
                "display_order": 4
            },
            {
                "name": "Completed",
                "color": "#6B7280",
                "is_active": true,
                "display_order": 5
            },
            {
                "name": "Ongoing",
                "color": "#3B82F6",
                "is_active": true,
                "display_order": 6
            }
        ]
    }'::jsonb,
    true,
    true,
    'admin'
),
(
    'Minimal Template',
    'A clean, minimal template with basic configuration.',
    'combined',
    '{
        "configs": [
            {
                "title": "Featured Series",
                "description": "Discover amazing series and stories.",
                "background_image_url": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=600&fit=crop",
                "primary_button_text": "Explore",
                "primary_button_link": "/series",
                "secondary_button_text": "Browse All",
                "secondary_button_link": "/comics",
                "is_active": true,
                "display_order": 1
            }
        ]
    }'::jsonb,
    '{
        "badges": [
            {
                "name": "Featured",
                "color": "#3B82F6",
                "is_active": true,
                "display_order": 1
            },
            {
                "name": "New",
                "color": "#10B981",
                "is_active": true,
                "display_order": 2
            }
        ]
    }'::jsonb,
    false,
    true,
    'admin'
),
(
    'Gaming Theme Template',
    'A gaming-themed template with vibrant colors and gaming terminology.',
    'combined',
    '{
        "configs": [
            {
                "title": "Epic Adventures Await",
                "description": "Level up your reading experience with our most epic series. From legendary quests to heroic journeys, discover your next adventure.",
                "background_image_url": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop",
                "primary_button_text": "Start Quest",
                "primary_button_link": "/series",
                "secondary_button_text": "View Inventory",
                "secondary_button_link": "/comics",
                "is_active": true,
                "display_order": 1
            },
            {
                "title": "New DLC Available",
                "description": "Fresh content drops weekly! Stay ahead of the meta with the latest episodes and chapters.",
                "background_image_url": "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&h=600&fit=crop",
                "primary_button_text": "Download Now",
                "primary_button_link": "/series?filter=new",
                "secondary_button_text": "Season Pass",
                "secondary_button_link": "/subscribe",
                "is_active": true,
                "display_order": 2
            }
        ]
    }'::jsonb,
    '{
        "badges": [
            {
                "name": "Legendary",
                "color": "#FFD700",
                "is_active": true,
                "display_order": 1
            },
            {
                "name": "Epic",
                "color": "#8B5CF6",
                "is_active": true,
                "display_order": 2
            },
            {
                "name": "Rare",
                "color": "#10B981",
                "is_active": true,
                "display_order": 3
            },
            {
                "name": "Common",
                "color": "#6B7280",
                "is_active": true,
                "display_order": 4
            }
        ]
    }'::jsonb,
    false,
    true,
    'admin'
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 9. GRANT PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT ON featured_series_templates TO authenticated;
GRANT SELECT ON featured_series_template_history TO authenticated;

-- Grant permissions to anon users (for public access)
GRANT SELECT ON featured_series_templates TO anon;
GRANT SELECT ON featured_series_template_history TO anon;

-- =====================================================
-- 10. VERIFICATION QUERIES
-- =====================================================

-- Verify tables were created
SELECT 'featured_series_templates' as table_name, COUNT(*) as record_count FROM featured_series_templates
UNION ALL
SELECT 'featured_series_template_history' as table_name, COUNT(*) as record_count FROM featured_series_template_history;

-- Verify sample data
SELECT 'Sample Templates:' as info;
SELECT id, name, template_type, is_default, is_active FROM featured_series_templates ORDER BY is_default DESC, created_at;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

-- The Featured Series Templates system is now ready to use!
-- Tables created: featured_series_templates, featured_series_template_history
-- Sample templates inserted: 3 templates (Before Template, Minimal, Gaming Theme)
-- RLS policies enabled for secure access
-- Triggers set up for automatic timestamp updates
