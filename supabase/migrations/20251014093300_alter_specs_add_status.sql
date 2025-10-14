-- Add status column to digital_reader_specs (ongoing/completed/hiatus etc.)
ALTER TABLE public.digital_reader_specs
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ongoing';

-- No RLS change needed; existing select policy applies

