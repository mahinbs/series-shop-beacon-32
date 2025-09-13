-- =====================================================
-- FIX ALL RLS POLICIES FOR ADMIN PANEL TABLES
-- =====================================================
-- This script adds INSERT, UPDATE, and DELETE permissions to all admin panel tables

-- =====================================================
-- FEATURED SERIES POLICIES
-- =====================================================

-- Featured Series Configs
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'featured_series_configs' AND policyname = 'Featured series configs can be inserted by everyone') THEN
        CREATE POLICY "Featured series configs can be inserted by everyone" ON featured_series_configs FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'featured_series_configs' AND policyname = 'Featured series configs can be updated by everyone') THEN
        CREATE POLICY "Featured series configs can be updated by everyone" ON featured_series_configs FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'featured_series_configs' AND policyname = 'Featured series configs can be deleted by everyone') THEN
        CREATE POLICY "Featured series configs can be deleted by everyone" ON featured_series_configs FOR DELETE USING (true);
    END IF;
END $$;

-- Featured Series Badges
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'featured_series_badges' AND policyname = 'Featured series badges can be inserted by everyone') THEN
        CREATE POLICY "Featured series badges can be inserted by everyone" ON featured_series_badges FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'featured_series_badges' AND policyname = 'Featured series badges can be updated by everyone') THEN
        CREATE POLICY "Featured series badges can be updated by everyone" ON featured_series_badges FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'featured_series_badges' AND policyname = 'Featured series badges can be deleted by everyone') THEN
        CREATE POLICY "Featured series badges can be deleted by everyone" ON featured_series_badges FOR DELETE USING (true);
    END IF;
END $$;

-- Featured Series Templates
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'featured_series_templates' AND policyname = 'Featured series templates can be inserted by everyone') THEN
        CREATE POLICY "Featured series templates can be inserted by everyone" ON featured_series_templates FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'featured_series_templates' AND policyname = 'Featured series templates can be updated by everyone') THEN
        CREATE POLICY "Featured series templates can be updated by everyone" ON featured_series_templates FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'featured_series_templates' AND policyname = 'Featured series templates can be deleted by everyone') THEN
        CREATE POLICY "Featured series templates can be deleted by everyone" ON featured_series_templates FOR DELETE USING (true);
    END IF;
END $$;

-- =====================================================
-- COIN SYSTEM POLICIES
-- =====================================================

-- Coin Packages
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coin_packages' AND policyname = 'Coin packages can be inserted by everyone') THEN
        CREATE POLICY "Coin packages can be inserted by everyone" ON coin_packages FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coin_packages' AND policyname = 'Coin packages can be updated by everyone') THEN
        CREATE POLICY "Coin packages can be updated by everyone" ON coin_packages FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coin_packages' AND policyname = 'Coin packages can be deleted by everyone') THEN
        CREATE POLICY "Coin packages can be deleted by everyone" ON coin_packages FOR DELETE USING (true);
    END IF;
END $$;

-- =====================================================
-- COMIC SYSTEM POLICIES
-- =====================================================

-- Comic Series
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comic_series' AND policyname = 'Comic series can be inserted by everyone') THEN
        CREATE POLICY "Comic series can be inserted by everyone" ON comic_series FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comic_series' AND policyname = 'Comic series can be updated by everyone') THEN
        CREATE POLICY "Comic series can be updated by everyone" ON comic_series FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comic_series' AND policyname = 'Comic series can be deleted by everyone') THEN
        CREATE POLICY "Comic series can be deleted by everyone" ON comic_series FOR DELETE USING (true);
    END IF;
END $$;

-- Comic Episodes
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comic_episodes' AND policyname = 'Comic episodes can be inserted by everyone') THEN
        CREATE POLICY "Comic episodes can be inserted by everyone" ON comic_episodes FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comic_episodes' AND policyname = 'Comic episodes can be updated by everyone') THEN
        CREATE POLICY "Comic episodes can be updated by everyone" ON comic_episodes FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comic_episodes' AND policyname = 'Comic episodes can be deleted by everyone') THEN
        CREATE POLICY "Comic episodes can be deleted by everyone" ON comic_episodes FOR DELETE USING (true);
    END IF;
END $$;

-- Comic Pages
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comic_pages' AND policyname = 'Comic pages can be inserted by everyone') THEN
        CREATE POLICY "Comic pages can be inserted by everyone" ON comic_pages FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comic_pages' AND policyname = 'Comic pages can be updated by everyone') THEN
        CREATE POLICY "Comic pages can be updated by everyone" ON comic_pages FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comic_pages' AND policyname = 'Comic pages can be deleted by everyone') THEN
        CREATE POLICY "Comic pages can be deleted by everyone" ON comic_pages FOR DELETE USING (true);
    END IF;
END $$;

-- =====================================================
-- SHOP SYSTEM POLICIES
-- =====================================================

-- Shop All Heroes
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shop_all_heroes' AND policyname = 'Shop heroes can be inserted by everyone') THEN
        CREATE POLICY "Shop heroes can be inserted by everyone" ON shop_all_heroes FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shop_all_heroes' AND policyname = 'Shop heroes can be updated by everyone') THEN
        CREATE POLICY "Shop heroes can be updated by everyone" ON shop_all_heroes FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shop_all_heroes' AND policyname = 'Shop heroes can be deleted by everyone') THEN
        CREATE POLICY "Shop heroes can be deleted by everyone" ON shop_all_heroes FOR DELETE USING (true);
    END IF;
END $$;

-- Shop All Filters
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shop_all_filters' AND policyname = 'Shop filters can be inserted by everyone') THEN
        CREATE POLICY "Shop filters can be inserted by everyone" ON shop_all_filters FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shop_all_filters' AND policyname = 'Shop filters can be updated by everyone') THEN
        CREATE POLICY "Shop filters can be updated by everyone" ON shop_all_filters FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shop_all_filters' AND policyname = 'Shop filters can be deleted by everyone') THEN
        CREATE POLICY "Shop filters can be deleted by everyone" ON shop_all_filters FOR DELETE USING (true);
    END IF;
END $$;

-- Shop All Sorts
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shop_all_sorts' AND policyname = 'Shop sorts can be inserted by everyone') THEN
        CREATE POLICY "Shop sorts can be inserted by everyone" ON shop_all_sorts FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shop_all_sorts' AND policyname = 'Shop sorts can be updated by everyone') THEN
        CREATE POLICY "Shop sorts can be updated by everyone" ON shop_all_sorts FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shop_all_sorts' AND policyname = 'Shop sorts can be deleted by everyone') THEN
        CREATE POLICY "Shop sorts can be deleted by everyone" ON shop_all_sorts FOR DELETE USING (true);
    END IF;
END $$;

-- =====================================================
-- DIGITAL READER POLICIES
-- =====================================================

-- Digital Reader Specs
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'digital_reader_specs' AND policyname = 'Digital reader specs can be inserted by everyone') THEN
        CREATE POLICY "Digital reader specs can be inserted by everyone" ON digital_reader_specs FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'digital_reader_specs' AND policyname = 'Digital reader specs can be updated by everyone') THEN
        CREATE POLICY "Digital reader specs can be updated by everyone" ON digital_reader_specs FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'digital_reader_specs' AND policyname = 'Digital reader specs can be deleted by everyone') THEN
        CREATE POLICY "Digital reader specs can be deleted by everyone" ON digital_reader_specs FOR DELETE USING (true);
    END IF;
END $$;

-- =====================================================
-- ADDITIONAL TABLES POLICIES
-- =====================================================

-- Creators
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'creators' AND policyname = 'Creators can be inserted by everyone') THEN
        CREATE POLICY "Creators can be inserted by everyone" ON creators FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'creators' AND policyname = 'Creators can be updated by everyone') THEN
        CREATE POLICY "Creators can be updated by everyone" ON creators FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'creators' AND policyname = 'Creators can be deleted by everyone') THEN
        CREATE POLICY "Creators can be deleted by everyone" ON creators FOR DELETE USING (true);
    END IF;
END $$;

-- Comic Files
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comic_files' AND policyname = 'Comic files can be inserted by everyone') THEN
        CREATE POLICY "Comic files can be inserted by everyone" ON comic_files FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comic_files' AND policyname = 'Comic files can be updated by everyone') THEN
        CREATE POLICY "Comic files can be updated by everyone" ON comic_files FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comic_files' AND policyname = 'Comic files can be deleted by everyone') THEN
        CREATE POLICY "Comic files can be deleted by everyone" ON comic_files FOR DELETE USING (true);
    END IF;
END $$;

-- =====================================================
-- SETTINGS TABLES POLICIES
-- =====================================================

-- Site Settings
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Site settings can be inserted by everyone') THEN
        CREATE POLICY "Site settings can be inserted by everyone" ON site_settings FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Site settings can be updated by everyone') THEN
        CREATE POLICY "Site settings can be updated by everyone" ON site_settings FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Site settings can be deleted by everyone') THEN
        CREATE POLICY "Site settings can be deleted by everyone" ON site_settings FOR DELETE USING (true);
    END IF;
END $$;

-- Email Settings
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_settings' AND policyname = 'Email settings can be inserted by everyone') THEN
        CREATE POLICY "Email settings can be inserted by everyone" ON email_settings FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_settings' AND policyname = 'Email settings can be updated by everyone') THEN
        CREATE POLICY "Email settings can be updated by everyone" ON email_settings FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_settings' AND policyname = 'Email settings can be deleted by everyone') THEN
        CREATE POLICY "Email settings can be deleted by everyone" ON email_settings FOR DELETE USING (true);
    END IF;
END $$;

-- Payment Settings
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_settings' AND policyname = 'Payment settings can be inserted by everyone') THEN
        CREATE POLICY "Payment settings can be inserted by everyone" ON payment_settings FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_settings' AND policyname = 'Payment settings can be updated by everyone') THEN
        CREATE POLICY "Payment settings can be updated by everyone" ON payment_settings FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_settings' AND policyname = 'Payment settings can be deleted by everyone') THEN
        CREATE POLICY "Payment settings can be deleted by everyone" ON payment_settings FOR DELETE USING (true);
    END IF;
END $$;

-- Shipping Settings
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shipping_settings' AND policyname = 'Shipping settings can be inserted by everyone') THEN
        CREATE POLICY "Shipping settings can be inserted by everyone" ON shipping_settings FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shipping_settings' AND policyname = 'Shipping settings can be updated by everyone') THEN
        CREATE POLICY "Shipping settings can be updated by everyone" ON shipping_settings FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shipping_settings' AND policyname = 'Shipping settings can be deleted by everyone') THEN
        CREATE POLICY "Shipping settings can be deleted by everyone" ON shipping_settings FOR DELETE USING (true);
    END IF;
END $$;

-- Security Settings
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'security_settings' AND policyname = 'Security settings can be inserted by everyone') THEN
        CREATE POLICY "Security settings can be inserted by everyone" ON security_settings FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'security_settings' AND policyname = 'Security settings can be updated by everyone') THEN
        CREATE POLICY "Security settings can be updated by everyone" ON security_settings FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'security_settings' AND policyname = 'Security settings can be deleted by everyone') THEN
        CREATE POLICY "Security settings can be deleted by everyone" ON security_settings FOR DELETE USING (true);
    END IF;
END $$;

-- Backup Settings
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'backup_settings' AND policyname = 'Backup settings can be inserted by everyone') THEN
        CREATE POLICY "Backup settings can be inserted by everyone" ON backup_settings FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'backup_settings' AND policyname = 'Backup settings can be updated by everyone') THEN
        CREATE POLICY "Backup settings can be updated by everyone" ON backup_settings FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'backup_settings' AND policyname = 'Backup settings can be deleted by everyone') THEN
        CREATE POLICY "Backup settings can be deleted by everyone" ON backup_settings FOR DELETE USING (true);
    END IF;
END $$;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ All RLS Policies Fixed!';
    RAISE NOTICE '🔓 Added INSERT, UPDATE, and DELETE permissions for all admin panel tables';
    RAISE NOTICE '🚀 All admin panel features should now work with Supabase!';
    RAISE NOTICE '📊 Tables updated: featured_series_configs, featured_series_badges, featured_series_templates, coin_packages, comic_series, comic_episodes, comic_pages, shop_all_heroes, shop_all_filters, shop_all_sorts, digital_reader_specs, creators, comic_files, site_settings, email_settings, payment_settings, shipping_settings, security_settings, backup_settings';
END $$;
