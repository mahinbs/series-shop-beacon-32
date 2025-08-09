-- Fix RLS policies for books table
-- This migration makes the books table completely permissive for the dummy auth system

-- First, let's check if the table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') THEN
        -- Drop all existing policies
        DROP POLICY IF EXISTS "Allow all operations for books" ON public.books;
        DROP POLICY IF EXISTS "Anyone can view active books" ON public.books;
        DROP POLICY IF EXISTS "Admins can manage books" ON public.books;
        DROP POLICY IF EXISTS "Users can view books" ON public.books;
        DROP POLICY IF EXISTS "Enable read access for all users" ON public.books;
        DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.books;
        DROP POLICY IF EXISTS "Enable update for users based on email" ON public.books;
        DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.books;

        -- Disable RLS temporarily to allow all operations
        ALTER TABLE public.books DISABLE ROW LEVEL SECURITY;

        -- Re-enable RLS with completely permissive policies
        ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

        -- Create completely permissive policies
        CREATE POLICY "Allow all operations for books"
        ON public.books
        FOR ALL
        USING (true)
        WITH CHECK (true);

        RAISE NOTICE 'Books RLS policies updated successfully';
    ELSE
        RAISE NOTICE 'Books table does not exist, skipping RLS update';
    END IF;
END $$;
