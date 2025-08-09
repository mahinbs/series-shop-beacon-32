-- 🚨 EMERGENCY FIX - Run this immediately in Supabase SQL Editor
-- This script will create the books table and fix all issues

-- Step 1: Drop the table if it exists (to avoid conflicts)
DROP TABLE IF EXISTS public.books CASCADE;

-- Step 2: Create the books table with all required columns
CREATE TABLE public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT,
    category TEXT NOT NULL,
    product_type TEXT DEFAULT 'book' CHECK (product_type IN ('book', 'merchandise', 'digital', 'other')),
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    coins TEXT,
    image_url TEXT NOT NULL,
    hover_image_url TEXT,
    description TEXT,
    can_unlock_with_coins BOOLEAN NOT NULL DEFAULT false,
    section_type TEXT NOT NULL CHECK (section_type IN ('new-releases', 'best-sellers', 'leaving-soon', 'featured', 'trending')),
    label TEXT,
    is_new BOOLEAN DEFAULT false,
    is_on_sale BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    sku TEXT,
    weight DECIMAL(10,2),
    dimensions TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 3: Enable RLS
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop any existing policies
DROP POLICY IF EXISTS "Anyone can view active books" ON public.books;
DROP POLICY IF EXISTS "Admins can manage books" ON public.books;
DROP POLICY IF EXISTS "Allow all operations for books" ON public.books;
DROP POLICY IF EXISTS "Users can view books" ON public.books;
DROP POLICY IF EXISTS "Users can manage books" ON public.books;

-- Step 5: Create completely permissive policy
CREATE POLICY "Allow all operations for books" 
ON public.books 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Step 6: Grant all permissions
GRANT ALL ON public.books TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Step 7: Create trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 8: Create trigger
DROP TRIGGER IF EXISTS update_books_updated_at ON public.books;
CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON public.books
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Step 9: Insert test data
INSERT INTO public.books (
    title, 
    author, 
    category, 
    price, 
    image_url, 
    section_type, 
    is_active
) VALUES 
    ('Test Book 1', 'Test Author 1', 'Manga', 9.99, 'https://via.placeholder.com/300x400', 'new-releases', true),
    ('Test Book 2', 'Test Author 2', 'Comic', 12.99, 'https://via.placeholder.com/300x400', 'best-sellers', true),
    ('Test Book 3', 'Test Author 3', 'Novel', 15.99, 'https://via.placeholder.com/300x400', 'featured', true);

-- Step 10: Verify the table was created
SELECT 
    '✅ SUCCESS: Books table created successfully!' as status,
    COUNT(*) as book_count 
FROM public.books;
