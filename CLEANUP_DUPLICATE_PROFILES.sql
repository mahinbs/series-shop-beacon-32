-- Clean up duplicate profiles and ensure user_id uniqueness
-- This will fix the multiple profile issue

-- Step 1: Delete duplicate profiles, keeping only the most recent one per user_id
WITH ranked_profiles AS (
  SELECT id, user_id, 
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC, created_at DESC) as rn
  FROM public.profiles
)
DELETE FROM public.profiles 
WHERE id IN (
  SELECT id FROM ranked_profiles WHERE rn > 1
);

-- Step 2: Ensure user_id is unique (add constraint if it doesn't exist)
-- First check if constraint already exists
DO $$ 
BEGIN
    -- Try to add the unique constraint
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
EXCEPTION 
    WHEN duplicate_table THEN 
        -- Constraint already exists, do nothing
        NULL;
END $$;

-- Step 3: Verify cleanup worked
SELECT user_id, COUNT(*) as profile_count 
FROM public.profiles 
GROUP BY user_id 
HAVING COUNT(*) > 1;

-- This query should return no rows if cleanup worked

