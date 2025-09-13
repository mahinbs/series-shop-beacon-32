-- Create Coin System Tables in Supabase
-- Run this script in your Supabase SQL Editor to create the missing coin system tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create coin packages table
CREATE TABLE IF NOT EXISTS public.coin_packages (
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

-- Create user coins table
CREATE TABLE IF NOT EXISTS public.user_coins (
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

-- Create coin transactions table
CREATE TABLE IF NOT EXISTS public.coin_transactions (
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

-- Create coin purchases table
CREATE TABLE IF NOT EXISTS public.coin_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    package_id UUID NOT NULL REFERENCES public.coin_packages(id),
    coins INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_coins_user_id ON public.user_coins(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_id ON public.coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_timestamp ON public.coin_transactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_coin_purchases_user_id ON public.coin_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_purchases_status ON public.coin_purchases(status);

-- Insert default coin packages
INSERT INTO public.coin_packages (name, coins, price, bonus, popular, best_value) VALUES
    ('Starter Pack', 100, 0.99, 0, FALSE, FALSE),
    ('Popular Pack', 500, 4.99, 50, TRUE, FALSE),
    ('Best Value', 1200, 9.99, 200, FALSE, TRUE),
    ('Premium Pack', 2500, 19.99, 500, FALSE, FALSE),
    ('Ultimate Pack', 6000, 49.99, 1500, FALSE, FALSE)
ON CONFLICT DO NOTHING;

-- Create RLS policies
ALTER TABLE public.coin_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_coins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coin_packages (public read access)
CREATE POLICY "coin_packages_public_read" ON public.coin_packages
    FOR SELECT USING (true);

-- RLS Policies for user_coins (users can only see their own data)
CREATE POLICY "user_coins_own_data" ON public.user_coins
    FOR ALL USING (auth.uid()::text = user_id::text);

-- RLS Policies for coin_transactions (users can only see their own data)
CREATE POLICY "coin_transactions_own_data" ON public.coin_transactions
    FOR ALL USING (auth.uid()::text = user_id::text);

-- RLS Policies for coin_purchases (users can only see their own data)
CREATE POLICY "coin_purchases_own_data" ON public.coin_purchases
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Grant necessary permissions
GRANT SELECT ON public.coin_packages TO anon, authenticated;
GRANT ALL ON public.user_coins TO authenticated;
GRANT ALL ON public.coin_transactions TO authenticated;
GRANT ALL ON public.coin_purchases TO authenticated;

-- Create a function to initialize user coins
CREATE OR REPLACE FUNCTION public.initialize_user_coins(user_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.user_coins (user_id, balance, total_earned, total_spent)
    VALUES (user_id, 0, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to add coins to user
CREATE OR REPLACE FUNCTION public.add_user_coins(user_id UUID, amount INTEGER, description TEXT)
RETURNS VOID AS $$
DECLARE
    current_balance INTEGER;
BEGIN
    -- Initialize user coins if not exists
    PERFORM public.initialize_user_coins(user_id);
    
    -- Get current balance
    SELECT balance INTO current_balance FROM public.user_coins WHERE user_coins.user_id = add_user_coins.user_id;
    
    -- Update user coins
    UPDATE public.user_coins 
    SET 
        balance = balance + amount,
        total_earned = total_earned + GREATEST(amount, 0),
        total_spent = total_spent + GREATEST(-amount, 0),
        last_updated = NOW()
    WHERE user_coins.user_id = add_user_coins.user_id;
    
    -- Insert transaction record
    INSERT INTO public.coin_transactions (user_id, type, amount, balance, description)
    VALUES (
        user_id, 
        CASE WHEN amount > 0 THEN 'purchase' ELSE 'spend' END,
        amount, 
        current_balance + amount,
        description
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.initialize_user_coins(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_user_coins(UUID, INTEGER, TEXT) TO authenticated;

-- Verify tables were created
SELECT 
    'coin_packages' as table_name,
    COUNT(*) as record_count
FROM public.coin_packages
UNION ALL
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
