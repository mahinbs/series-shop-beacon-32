-- Add Sample Coin Data to Test the System
-- Run this script in your Supabase SQL Editor to add sample data

-- Insert sample user coins data
INSERT INTO public.user_coins (user_id, balance, total_earned, total_spent) VALUES
    ('local-admin-user', 1000, 1500, 500),
    ('local-user-1', 250, 500, 250),
    ('local-user-2', 750, 1000, 250),
    ('local-user-3', 500, 800, 300)
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample coin transactions
INSERT INTO public.coin_transactions (user_id, type, amount, balance, description, reference) VALUES
    ('local-admin-user', 'purchase', 1000, 1000, 'Purchased Ultimate Pack', 'PKG-5'),
    ('local-user-1', 'purchase', 500, 500, 'Purchased Popular Pack', 'PKG-2'),
    ('local-user-2', 'purchase', 1000, 1000, 'Purchased Best Value Pack', 'PKG-3'),
    ('local-user-3', 'purchase', 800, 800, 'Purchased Premium Pack', 'PKG-4'),
    ('local-admin-user', 'spend', -500, 500, 'Unlocked premium content', 'CONTENT-1'),
    ('local-user-1', 'spend', -250, 250, 'Unlocked episode', 'EPISODE-1'),
    ('local-user-2', 'spend', -250, 750, 'Unlocked feature', 'FEATURE-1'),
    ('local-user-3', 'spend', -300, 500, 'Unlocked series', 'SERIES-1')
ON CONFLICT DO NOTHING;

-- Insert sample coin purchases
INSERT INTO public.coin_purchases (user_id, package_id, coins, price, status, payment_method, transaction_id) VALUES
    ('local-admin-user', (SELECT id FROM public.coin_packages WHERE name = 'Ultimate Pack' LIMIT 1), 6000, 49.99, 'completed', 'credit_card', 'TXN-001'),
    ('local-user-1', (SELECT id FROM public.coin_packages WHERE name = 'Popular Pack' LIMIT 1), 500, 4.99, 'completed', 'paypal', 'TXN-002'),
    ('local-user-2', (SELECT id FROM public.coin_packages WHERE name = 'Best Value' LIMIT 1), 1200, 9.99, 'completed', 'stripe', 'TXN-003'),
    ('local-user-3', (SELECT id FROM public.coin_packages WHERE name = 'Premium Pack' LIMIT 1), 2500, 19.99, 'completed', 'credit_card', 'TXN-004')
ON CONFLICT DO NOTHING;

-- Verify the data was inserted
SELECT 
    'user_coins' as table_name,
    COUNT(*) as record_count
FROM public.user_coins
UNION ALL
SELECT 
    'coin_transactions' as table_name,
    COUNT(*) as record_count
FROM public.coin_transactions
UNION ALL
SELECT 
    'coin_purchases' as table_name,
    COUNT(*) as record_count
FROM public.coin_purchases;
