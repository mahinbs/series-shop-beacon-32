-- Check if Coin System Tables Exist
-- Run this in Supabase SQL Editor to verify table creation

-- Check if tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('coin_packages', 'user_coins', 'coin_transactions', 'coin_purchases')
ORDER BY table_name;

-- Check table structures
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('coin_packages', 'user_coins', 'coin_transactions', 'coin_purchases')
ORDER BY table_name, ordinal_position;

-- Check if coin packages have data
SELECT 
    'coin_packages' as table_name,
    COUNT(*) as record_count
FROM coin_packages
UNION ALL
SELECT 
    'user_coins' as table_name,
    COUNT(*) as record_count
FROM user_coins
UNION ALL
SELECT 
    'coin_transactions' as table_name,
    COUNT(*) as record_count
FROM coin_transactions
UNION ALL
SELECT 
    'coin_purchases' as table_name,
    COUNT(*) as record_count
FROM coin_purchases;
