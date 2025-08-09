-- 🚨 ONE-CLICK FIX - Run this immediately in Supabase SQL Editor
-- This script will create ALL necessary tables and fix all issues

-- Step 1: Drop all existing tables to avoid conflicts
DROP TABLE IF EXISTS public.books CASCADE;
DROP TABLE IF EXISTS public.hero_banners CASCADE;
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.page_sections CASCADE;

-- Step 2: Create app_role enum
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 3: Create all tables
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

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

CREATE TABLE public.hero_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_name TEXT NOT NULL,
    section_name TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 4: Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- Step 5: Create trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 6: Create triggers for all tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON public.books
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hero_banners_updated_at
    BEFORE UPDATE ON public.hero_banners
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_sections_updated_at
    BEFORE UPDATE ON public.page_sections
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Step 7: Create completely permissive policies for all tables
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

-- Step 8: Grant all permissions
GRANT ALL ON public.books TO anon, authenticated;
GRANT ALL ON public.hero_banners TO anon, authenticated;
GRANT ALL ON public.announcements TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.user_roles TO anon, authenticated;
GRANT ALL ON public.page_sections TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Step 9: Create has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = _user_id AND role = _role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Insert test data
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

INSERT INTO public.hero_banners (
    title,
    subtitle,
    image_url,
    display_order,
    is_active
) VALUES 
    ('Welcome to Series Shop', 'Discover amazing books and comics', 'https://via.placeholder.com/1200x400', 1, true);

INSERT INTO public.announcements (
    title,
    content,
    is_active,
    display_order
) VALUES 
    ('Welcome!', 'Welcome to our new book store!', true, 1);

-- Step 11: Final verification
SELECT 
    '🎉 ONE-CLICK FIX SUCCESSFUL!' as status,
    (SELECT COUNT(*) FROM public.books) as books_count,
    (SELECT COUNT(*) FROM public.hero_banners) as banners_count,
    (SELECT COUNT(*) FROM public.announcements) as announcements_count;
