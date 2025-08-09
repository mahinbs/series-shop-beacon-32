-- 🔍 CHECK AND CREATE TABLES - Run this in Supabase SQL Editor
-- This script will check for existing tables and create them if needed

-- Step 1: Check if tables exist
SELECT 
    'Checking existing tables...' as status;

SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN 'EXISTS'
        ELSE 'MISSING'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('books', 'hero_banners', 'announcements', 'profiles', 'user_roles', 'page_sections')
ORDER BY table_name;

-- Step 2: Create app_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
    RAISE NOTICE 'Created app_role enum';
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE 'app_role enum already exists';
END $$;

-- Step 3: Create books table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.books (
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

-- Step 4: Create other tables if they don't exist
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_name TEXT NOT NULL,
    section_name TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 5: Enable RLS on all tables
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- Step 6: Create trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 7: Create triggers for all tables
DROP TRIGGER IF EXISTS update_books_updated_at ON public.books;
CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON public.books
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_hero_banners_updated_at ON public.hero_banners;
CREATE TRIGGER update_hero_banners_updated_at
    BEFORE UPDATE ON public.hero_banners
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_announcements_updated_at ON public.announcements;
CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_page_sections_updated_at ON public.page_sections;
CREATE TRIGGER update_page_sections_updated_at
    BEFORE UPDATE ON public.page_sections
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Step 8: Drop all existing policies
DROP POLICY IF EXISTS "Anyone can view active books" ON public.books;
DROP POLICY IF EXISTS "Admins can manage books" ON public.books;
DROP POLICY IF EXISTS "Allow all operations for books" ON public.books;
DROP POLICY IF EXISTS "Users can view books" ON public.books;
DROP POLICY IF EXISTS "Users can manage books" ON public.books;

DROP POLICY IF EXISTS "Anyone can view active hero_banners" ON public.hero_banners;
DROP POLICY IF EXISTS "Admins can manage hero_banners" ON public.hero_banners;
DROP POLICY IF EXISTS "Allow all operations for hero_banners" ON public.hero_banners;

DROP POLICY IF EXISTS "Anyone can view active announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow all operations for announcements" ON public.announcements;

-- Step 9: Create completely permissive policies for all tables
CREATE POLICY "Allow all operations for books" 
ON public.books 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations for hero_banners" 
ON public.hero_banners 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations for announcements" 
ON public.announcements 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations for profiles" 
ON public.profiles 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations for user_roles" 
ON public.user_roles 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations for page_sections" 
ON public.page_sections 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Step 10: Grant all permissions
GRANT ALL ON public.books TO anon, authenticated;
GRANT ALL ON public.hero_banners TO anon, authenticated;
GRANT ALL ON public.announcements TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.user_roles TO anon, authenticated;
GRANT ALL ON public.page_sections TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Step 11: Create has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = _user_id AND role = _role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 12: Check what books exist in the database
SELECT 
    '📚 CURRENT BOOKS IN DATABASE:' as status;

SELECT 
    id,
    title,
    author,
    category,
    price,
    section_type,
    is_active,
    created_at
FROM public.books 
ORDER BY display_order, created_at;

-- Step 13: Show table counts
SELECT 
    '📊 DATABASE SUMMARY:' as status,
    (SELECT COUNT(*) FROM public.books) as books_count,
    (SELECT COUNT(*) FROM public.hero_banners) as banners_count,
    (SELECT COUNT(*) FROM public.announcements) as announcements_count;
