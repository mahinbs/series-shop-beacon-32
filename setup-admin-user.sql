-- Setup Admin User Script
-- Run this in your Supabase SQL Editor

-- Step 1: Find the user ID for mahinstlucia@gmail.com
SELECT id, email FROM auth.users WHERE email = 'mahinstlucia@gmail.com';

-- Step 2: Add admin role (replace the UUID below with the actual UUID from step 1)
-- Example: If the user ID is 'abc123-def4-5678-90ab-cdef12345678', replace it below
INSERT INTO public.user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'mahinstlucia@gmail.com'),
  'admin'
) ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Verify the admin role was added
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'mahinstlucia@gmail.com';

-- Step 4: Show all admin users
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';
