-- Create volume_pages table for storing individual volume content
CREATE TABLE IF NOT EXISTS public.volume_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    volume_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    page_url TEXT,
    page_title TEXT,
    page_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_volume_pages_volume_id ON public.volume_pages(volume_id);
CREATE INDEX IF NOT EXISTS idx_volume_pages_page_number ON public.volume_pages(volume_id, page_number);

-- Enable RLS
ALTER TABLE public.volume_pages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON public.volume_pages
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.volume_pages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.volume_pages
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.volume_pages
    FOR DELETE USING (auth.role() = 'authenticated');

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_volume_pages_updated_at 
    BEFORE UPDATE ON public.volume_pages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
