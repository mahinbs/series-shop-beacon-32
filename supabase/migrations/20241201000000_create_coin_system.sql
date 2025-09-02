-- Create coin system tables
-- Migration: 20241201000000_create_coin_system.sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create coin packages table
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

-- Create user coins table
CREATE TABLE IF NOT EXISTS user_coins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    balance INTEGER NOT NULL DEFAULT 0,
    total_earned INTEGER NOT NULL DEFAULT 0,
    total_spent INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create coin transactions table
CREATE TABLE IF NOT EXISTS coin_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('purchase', 'spend', 'earn', 'refund')),
    amount INTEGER NOT NULL,
    balance INTEGER NOT NULL,
    description TEXT NOT NULL,
    reference VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coin purchases table
CREATE TABLE IF NOT EXISTS coin_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    package_id UUID NOT NULL REFERENCES coin_packages(id),
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
CREATE INDEX IF NOT EXISTS idx_user_coins_user_id ON user_coins(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_id ON coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_timestamp ON coin_transactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_coin_purchases_user_id ON coin_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_purchases_status ON coin_purchases(status);

-- Insert default coin packages
INSERT INTO coin_packages (name, coins, price, bonus, popular, best_value) VALUES
    ('Starter Pack', 100, 0.99, 0, FALSE, FALSE),
    ('Popular Pack', 500, 4.99, 50, TRUE, FALSE),
    ('Best Value', 1200, 9.99, 200, FALSE, TRUE),
    ('Premium Pack', 2500, 19.99, 500, FALSE, FALSE),
    ('Ultimate Pack', 6000, 49.99, 1500, FALSE, FALSE)
ON CONFLICT DO NOTHING;

-- Create RLS policies
ALTER TABLE coin_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coins ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_purchases ENABLE ROW LEVEL SECURITY;

-- Coin packages: anyone can read
CREATE POLICY "Anyone can read coin packages" ON coin_packages
    FOR SELECT USING (true);

-- User coins: users can only see their own coins
CREATE POLICY "Users can view own coins" ON user_coins
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own coins" ON user_coins
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coins" ON user_coins
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Coin transactions: users can only see their own transactions
CREATE POLICY "Users can view own transactions" ON coin_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON coin_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Coin purchases: users can only see their own purchases
CREATE POLICY "Users can view own purchases" ON coin_purchases
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases" ON coin_purchases
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own purchases" ON coin_purchases
    FOR UPDATE USING (auth.uid() = user_id);

-- Create functions for coin operations
CREATE OR REPLACE FUNCTION add_coins_to_user(
    p_user_id UUID,
    p_amount INTEGER,
    p_type VARCHAR(20),
    p_description TEXT,
    p_reference VARCHAR(255) DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_balance INTEGER;
    v_new_balance INTEGER;
BEGIN
    -- Get current balance
    SELECT COALESCE(balance, 0) INTO v_current_balance
    FROM user_coins
    WHERE user_id = p_user_id;
    
    -- If no record exists, create one
    IF v_current_balance IS NULL THEN
        INSERT INTO user_coins (user_id, balance, total_earned, total_spent)
        VALUES (p_user_id, p_amount, 
                CASE WHEN p_type = 'earn' THEN p_amount ELSE 0 END,
                CASE WHEN p_type = 'spend' THEN ABS(p_amount) ELSE 0 END);
        v_new_balance := p_amount;
    ELSE
        -- Update existing record
        v_new_balance := v_current_balance + p_amount;
        
        UPDATE user_coins
        SET balance = v_new_balance,
            total_earned = total_earned + CASE WHEN p_type = 'earn' THEN p_amount ELSE 0 END,
            total_spent = total_spent + CASE WHEN p_type = 'spend' THEN ABS(p_amount) ELSE 0 END,
            last_updated = NOW(),
            updated_at = NOW()
        WHERE user_id = p_user_id;
    END IF;
    
    -- Record transaction
    INSERT INTO coin_transactions (user_id, type, amount, balance, description, reference)
    VALUES (p_user_id, p_type, p_amount, v_new_balance, p_description, p_reference);
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;

-- Create function to check if user can afford content
CREATE OR REPLACE FUNCTION can_user_afford(
    p_user_id UUID,
    p_cost INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_balance INTEGER;
BEGIN
    SELECT COALESCE(balance, 0) INTO v_balance
    FROM user_coins
    WHERE user_id = p_user_id;
    
    RETURN COALESCE(v_balance, 0) >= p_cost;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON coin_packages TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_coins TO authenticated;
GRANT SELECT, INSERT ON coin_transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON coin_purchases TO authenticated;
GRANT EXECUTE ON FUNCTION add_coins_to_user(UUID, INTEGER, VARCHAR, TEXT, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION can_user_afford(UUID, INTEGER) TO authenticated;
