-- Fix profiles table RLS to allow users to read their own profile data
-- This is the REAL issue causing profile pictures to disappear

-- First, check current policies on profiles table
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'profiles';

-- Drop existing restrictive policies that might be blocking reads
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can select their own profile" ON public.profiles;

-- Create a comprehensive policy that allows users to read their own profile
CREATE POLICY "Users can read their own profile data" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- Also ensure users can update their own profile (for avatar_url updates)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile data" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow users to insert their own profile if it doesn't exist
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile data" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Verify the policies were created correctly
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles' AND policyname LIKE '%profile%';

