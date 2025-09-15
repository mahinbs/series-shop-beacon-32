-- Add unique constraint on user_roles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_roles_user_id_role_key'
    ) THEN
        ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
    END IF;
END $$;

-- Add admin role for venteskraft@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('afaf010c-9c03-4833-92dc-8a39eb6d9856', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Update handle_new_user function to recognize both admin emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert profile for all users
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User')
  );

  -- Assign admin role if email matches admin emails
  IF NEW.email = 'admin@series-shop.com' OR NEW.email = 'venteskraft@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    -- Assign default user role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;

  -- Initialize user coins for all users
  INSERT INTO public.user_coins (user_id, balance, total_earned, total_spent)
  VALUES (NEW.id, 100, 100, 0); -- Give 100 welcome coins

  RETURN NEW;
END;
$function$;