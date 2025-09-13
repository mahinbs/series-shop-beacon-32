
-- Quick verification script to check if all tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IN (
            'featured_series_configs', 'featured_series_badges', 'featured_series_templates',
            'coin_packages', 'user_coins', 'coin_transactions', 'coin_purchases',
            'comic_series', 'comic_episodes', 'comic_pages',
            'shop_all_heroes', 'shop_all_filters', 'shop_all_sorts',
            'digital_reader_specs'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'featured_series_configs', 'featured_series_badges', 'featured_series_templates',
    'coin_packages', 'user_coins', 'coin_transactions', 'coin_purchases',
    'comic_series', 'comic_episodes', 'comic_pages',
    'shop_all_heroes', 'shop_all_filters', 'shop_all_sorts',
    'digital_reader_specs'
)
ORDER BY table_name;
