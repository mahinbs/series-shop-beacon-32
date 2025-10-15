-- Create circle/community system
CREATE TABLE IF NOT EXISTS public.circles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  comic_id uuid NOT NULL REFERENCES public.digital_reader_specs(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create circle memberships table
CREATE TABLE IF NOT EXISTS public.circle_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  email text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL until user signs up
  joined_at timestamptz NOT NULL DEFAULT now(),
  
  UNIQUE(circle_id, email) -- One membership per email per circle
);

-- Enable RLS
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_memberships ENABLE ROW LEVEL SECURITY;

-- RLS Policies for circles
CREATE POLICY "Anyone can view circles" 
ON public.circles FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert circles" 
ON public.circles FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update circles" 
ON public.circles FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete circles" 
ON public.circles FOR DELETE
TO authenticated
USING (true);

-- RLS Policies for circle_memberships
CREATE POLICY "Anyone can view circle memberships" 
ON public.circle_memberships FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can insert circle memberships" 
ON public.circle_memberships FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Authenticated users can update their own memberships" 
ON public.circle_memberships FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own memberships" 
ON public.circle_memberships FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_circles_comic_id ON public.circles(comic_id);
CREATE INDEX IF NOT EXISTS idx_circle_memberships_circle_id ON public.circle_memberships(circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_memberships_email ON public.circle_memberships(email);
CREATE INDEX IF NOT EXISTS idx_circle_memberships_user_id ON public.circle_memberships(user_id);

-- Create a view for circle members with user info
CREATE OR REPLACE VIEW public.circle_members_with_profiles AS
SELECT 
  cm.*,
  c.name as circle_name,
  c.comic_id,
  p.full_name as user_full_name,
  p.avatar_url as user_avatar_url
FROM public.circle_memberships cm
LEFT JOIN public.circles c ON cm.circle_id = c.id
LEFT JOIN public.profiles p ON cm.user_id = p.user_id
ORDER BY cm.joined_at DESC;

