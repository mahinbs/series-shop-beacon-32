-- CLEANUP SAMPLE DATA FROM COIN SYSTEM
-- This script removes all sample data and resets the coin system

-- 1. Delete all sample coin transactions
DELETE FROM public.coin_transactions
WHERE reference IN ('PKG-1', 'PKG-2', 'PKG-3', 'CONTENT-1', 'EPISODE-1', 'BONUS-1', 'CHAPTER-1');

-- 2. Delete all sample user coins
DELETE FROM public.user_coins
WHERE user_id IN (
    '4ddcbf4e-7836-42f8-bc30-4b9864ec277c',
    'c1b34a0a-6e05-42b9-800c-d199124821c4',
    'bf476b65-3f48-441b-b726-648a0ee0826c'
);

-- 3. Delete all sample coin packages
DELETE FROM public.coin_packages
WHERE name IN ('Starter Pack', 'Popular Pack', 'Best Value', 'Premium Pack', 'Ultimate Pack');

-- 4. Delete all sample coin purchases (if any)
DELETE FROM public.coin_purchases
WHERE user_id IN (
    '4ddcbf4e-7836-42f8-bc30-4b9864ec277c',
    'c1b34a0a-6e05-42b9-800c-d199124821c4',
    'bf476b65-3f48-441b-b726-648a0ee0826c'
);

-- 5. Verify cleanup
SELECT 'After Cleanup:' as status;
SELECT 'Coin Packages:' as table_name, COUNT(*) as record_count FROM public.coin_packages
UNION ALL
SELECT 'User Coins:', COUNT(*) FROM public.user_coins
UNION ALL
SELECT 'Coin Transactions:', COUNT(*) FROM public.coin_transactions
UNION ALL
SELECT 'Coin Purchases:', COUNT(*) FROM public.coin_purchases;
