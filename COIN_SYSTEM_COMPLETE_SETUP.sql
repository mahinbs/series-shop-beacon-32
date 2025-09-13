-- COMPLETE COIN SYSTEM SETUP FOR SUPABASE
-- Run this script in your Supabase SQL Editor to create all coin system tables and sample data

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

-- Insert default coin packages (exactly matching the mock data)
INSERT INTO public.coin_packages (name, coins, price, bonus, popular, best_value) VALUES
    ('Starter Pack', 100, 0.99, 0, FALSE, FALSE),
    ('Popular Pack', 500, 4.99, 50, TRUE, FALSE),
    ('Best Value', 1200, 9.99, 200, FALSE, TRUE),
    ('Premium Pack', 2500, 19.99, 500, FALSE, FALSE),
    ('Ultimate Pack', 6000, 49.99, 1500, FALSE, FALSE)
ON CONFLICT DO NOTHING;

-- Insert sample user coins data
INSERT INTO public.user_coins (user_id, balance, total_earned, total_spent) VALUES
    ('4ddcbf4e-7836-42f8-bc30-4b9864ec277c', 1250, 2000, 750),
    ('c1b34a0a-6e05-42b9-800c-d199124821c4', 500, 1000, 500),
    ('bf476b65-3f48-441b-b726-648a0ee0826c', 200, 500, 300)
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample transactions
INSERT INTO public.coin_transactions (user_id, type, amount, balance, description, reference) VALUES
    ('4ddcbf4e-7836-42f8-bc30-4b9864ec277c', 'purchase', 500, 500, 'Purchased Popular Pack', 'PKG-2'),
    ('4ddcbf4e-7836-42f8-bc30-4b9864ec277c', 'purchase', 1200, 1700, 'Purchased Best Value Pack', 'PKG-3'),
    ('4ddcbf4e-7836-42f8-bc30-4b9864ec277c', 'spend', -450, 1250, 'Unlocked premium content', 'CONTENT-1'),
    ('c1b34a0a-6e05-42b9-800c-d199124821c4', 'purchase', 500, 500, 'Purchased Popular Pack', 'PKG-2'),
    ('c1b34a0a-6e05-42b9-800c-d199124821c4', 'spend', -100, 400, 'Unlocked episode', 'EPISODE-1'),
    ('bf476b65-3f48-441b-b726-648a0ee0826c', 'purchase', 200, 200, 'Purchased Starter Pack', 'PKG-1'),
    ('bf476b65-3f48-441b-b726-648a0ee0826c', 'earn', 50, 250, 'Daily login bonus', 'BONUS-1'),
    ('bf476b65-3f48-441b-b726-648a0ee0826c', 'spend', -50, 200, 'Unlocked chapter', 'CHAPTER-1')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.coin_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_coins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_purchases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies with IF NOT EXISTS
DO $$
BEGIN
    -- RLS Policies for coin_packages (public read access)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'coin_packages_public_read' AND tablename = 'coin_packages') THEN
        CREATE POLICY "coin_packages_public_read" ON public.coin_packages
            FOR SELECT USING (true);
    END IF;

    -- RLS Policies for user_coins (users can only see their own data)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_coins_own_data' AND tablename = 'user_coins') THEN
        CREATE POLICY "user_coins_own_data" ON public.user_coins
            FOR ALL USING (auth.uid()::text = user_id::text);
    END IF;

    -- RLS Policies for coin_transactions (users can only see their own data)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'coin_transactions_own_data' AND tablename = 'coin_transactions') THEN
        CREATE POLICY "coin_transactions_own_data" ON public.coin_transactions
            FOR ALL USING (auth.uid()::text = user_id::text);
    END IF;

    -- RLS Policies for coin_purchases (users can only see their own data)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'coin_purchases_own_data' AND tablename = 'coin_purchases') THEN
        CREATE POLICY "coin_purchases_own_data" ON public.coin_purchases
            FOR ALL USING (auth.uid()::text = user_id::text);
    END IF;
END $$;

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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_coin_packages_updated_at ON public.coin_packages;
CREATE TRIGGER update_coin_packages_updated_at BEFORE UPDATE ON public.coin_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_coins_updated_at ON public.user_coins;
CREATE TRIGGER update_user_coins_updated_at BEFORE UPDATE ON public.user_coins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coin_purchases_updated_at ON public.coin_purchases;
CREATE TRIGGER update_coin_purchases_updated_at BEFORE UPDATE ON public.coin_purchases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify the setup
SELECT 'Coin Packages:' as table_name, COUNT(*) as record_count FROM public.coin_packages
UNION ALL
SELECT 'User Coins:', COUNT(*) FROM public.user_coins
UNION ALL
SELECT 'Coin Transactions:', COUNT(*) FROM public.coin_transactions
UNION ALL
SELECT 'Coin Purchases:', COUNT(*) FROM public.coin_purchases;
