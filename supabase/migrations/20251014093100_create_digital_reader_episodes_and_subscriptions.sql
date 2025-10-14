-- Episodes table
CREATE TABLE IF NOT EXISTS public.digital_reader_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spec_id UUID NOT NULL REFERENCES public.digital_reader_specs(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  cover_image_url TEXT,
  pdf_url TEXT NOT NULL,
  is_free BOOLEAN NOT NULL DEFAULT false,
  coin_cost INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(spec_id, chapter_number)
);

ALTER TABLE public.digital_reader_episodes ENABLE ROW LEVEL SECURITY;

-- Public can read published episodes of active specs
DROP POLICY IF EXISTS "Public read published episodes" ON public.digital_reader_episodes;
CREATE POLICY "Public read published episodes" ON public.digital_reader_episodes
FOR SELECT USING (
  is_published = true AND EXISTS (
    SELECT 1 FROM public.digital_reader_specs s 
    WHERE s.id = spec_id AND s.is_active = true
  )
);

-- Admins manage episodes
DROP POLICY IF EXISTS "Admins manage episodes" ON public.digital_reader_episodes;
CREATE POLICY "Admins manage episodes" ON public.digital_reader_episodes
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DO $$ BEGIN
  CREATE TRIGGER trg_digital_reader_episodes_updated
  BEFORE UPDATE ON public.digital_reader_episodes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Subscriptions table (people who added series to read)
CREATE TABLE IF NOT EXISTS public.digital_reader_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spec_id UUID NOT NULL REFERENCES public.digital_reader_specs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(spec_id, user_id)
);

ALTER TABLE public.digital_reader_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users manage their own subscription
DROP POLICY IF EXISTS "Users read own subscriptions" ON public.digital_reader_subscriptions;
CREATE POLICY "Users read own subscriptions" ON public.digital_reader_subscriptions
FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users insert own subscriptions" ON public.digital_reader_subscriptions;
CREATE POLICY "Users insert own subscriptions" ON public.digital_reader_subscriptions
FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users delete own subscriptions" ON public.digital_reader_subscriptions;
CREATE POLICY "Users delete own subscriptions" ON public.digital_reader_subscriptions
FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Allow public to select aggregate counts via a view (no PII)
CREATE OR REPLACE VIEW public.digital_reader_subscriber_counts AS
SELECT spec_id, count(*)::bigint AS subscriber_count
FROM public.digital_reader_subscriptions
GROUP BY spec_id;

GRANT SELECT ON public.digital_reader_subscriber_counts TO anon, authenticated;

-- Monetization fields on specs
ALTER TABLE public.digital_reader_specs
  ADD COLUMN IF NOT EXISTS free_chapters_count INTEGER NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS coin_per_locked INTEGER NOT NULL DEFAULT 3;

