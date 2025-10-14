-- Pages per episode (images)
CREATE TABLE IF NOT EXISTS public.digital_reader_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID NOT NULL REFERENCES public.digital_reader_episodes(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(episode_id, page_number)
);

ALTER TABLE public.digital_reader_pages ENABLE ROW LEVEL SECURITY;

-- Public can read pages of published episodes only
DROP POLICY IF EXISTS "Public read episode pages" ON public.digital_reader_pages;
CREATE POLICY "Public read episode pages" ON public.digital_reader_pages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.digital_reader_episodes e
    JOIN public.digital_reader_specs s ON s.id = e.spec_id
    WHERE e.id = episode_id AND e.is_published = true AND s.is_active = true
  )
);

-- Admins manage pages
DROP POLICY IF EXISTS "Admins manage pages" ON public.digital_reader_pages;
CREATE POLICY "Admins manage pages" ON public.digital_reader_pages
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

