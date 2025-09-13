-- =====================================================
-- FIX DIGITAL READER RLS POLICIES
-- =====================================================
-- This script adds INSERT and UPDATE permissions to digital_reader_specs table

-- Add INSERT policy for digital_reader_specs
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'digital_reader_specs' AND policyname = 'Digital reader specs can be inserted by everyone') THEN
        CREATE POLICY "Digital reader specs can be inserted by everyone" ON digital_reader_specs FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Add UPDATE policy for digital_reader_specs
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'digital_reader_specs' AND policyname = 'Digital reader specs can be updated by everyone') THEN
        CREATE POLICY "Digital reader specs can be updated by everyone" ON digital_reader_specs FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Add DELETE policy for digital_reader_specs
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'digital_reader_specs' AND policyname = 'Digital reader specs can be deleted by everyone') THEN
        CREATE POLICY "Digital reader specs can be deleted by everyone" ON digital_reader_specs FOR DELETE USING (true);
    END IF;
END $$;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Digital Reader RLS Policies Fixed!';
    RAISE NOTICE '🔓 Added INSERT, UPDATE, and DELETE permissions for digital_reader_specs';
    RAISE NOTICE '🚀 Digital Reader Management should now work with Supabase!';
END $$;
