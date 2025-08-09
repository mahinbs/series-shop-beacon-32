-- Fix RLS policies for hero_banners table
-- This migration makes the hero_banners table completely permissive for the dummy auth system

-- First, let's check if the table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hero_banners') THEN
        -- Drop all existing policies
        DROP POLICY IF EXISTS "Allow all operations for hero banners" ON public.hero_banners;
        DROP POLICY IF EXISTS "Anyone can view active hero banners" ON public.hero_banners;
        DROP POLICY IF EXISTS "Admins can manage hero banners" ON public.hero_banners;
        
        -- Disable RLS temporarily to allow all operations
        ALTER TABLE public.hero_banners DISABLE ROW LEVEL SECURITY;
        
        -- Re-enable RLS with completely permissive policies
        ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
        
        -- Create completely permissive policies
        CREATE POLICY "Allow all operations for hero banners" 
        ON public.hero_banners 
        FOR ALL 
        USING (true)
        WITH CHECK (true);
        
        RAISE NOTICE 'Hero banners RLS policies updated successfully';
    ELSE
        RAISE NOTICE 'Hero banners table does not exist, skipping RLS update';
    END IF;
END $$;
