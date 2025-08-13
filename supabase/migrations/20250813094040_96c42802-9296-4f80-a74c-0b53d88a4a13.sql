-- Create admin user account and assign admin role
-- This will create the admin@series-shop.com user with password Admin@2024!

-- First, let's insert the user into auth.users (this simulates a signup)
-- Note: In production, you would typically use the Supabase dashboard or auth API
-- For now, we'll create a user profile and role that can be used when the user signs up

-- Create a function to setup admin user when they sign up
CREATE OR REPLACE FUNCTION public.setup_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function will be used to assign admin role to admin@series-shop.com when they sign up
  -- We'll create the role mapping that will be applied automatically
  
  -- Insert admin role mapping for the admin email
  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin'::app_role
  FROM auth.users 
  WHERE email = 'admin@series-shop.com'
  ON CONFLICT (user_id, role) DO NOTHING;
  
END;
$$;

-- Create a trigger to automatically assign admin role to admin@series-shop.com when they sign up
CREATE OR REPLACE FUNCTION public.handle_admin_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if this is the admin email
  IF NEW.email = 'admin@series-shop.com' THEN
    -- Insert admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Create profile
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (NEW.id, NEW.email, 'Admin User')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to handle admin signup
DROP TRIGGER IF EXISTS on_admin_user_created ON auth.users;
CREATE TRIGGER on_admin_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  WHEN (NEW.email = 'admin@series-shop.com')
  EXECUTE FUNCTION public.handle_admin_signup();