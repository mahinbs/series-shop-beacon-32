-- Create volume_pages table for managing individual volume pages
CREATE TABLE IF NOT EXISTS public.volume_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    volume_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(volume_id, page_number)
);

-- Enable Row Level Security
ALTER TABLE public.volume_pages ENABLE ROW LEVEL SECURITY;

-- Create policies for volume_pages
CREATE POLICY "Anyone can view active volume pages" 
ON public.volume_pages 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage volume pages" 
ON public.volume_pages 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role)) 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_volume_pages_updated_at 
BEFORE UPDATE ON public.volume_pages 
FOR EACH ROW 
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_volume_pages_volume_id ON public.volume_pages(volume_id);
CREATE INDEX IF NOT EXISTS idx_volume_pages_page_number ON public.volume_pages(page_number);
CREATE INDEX IF NOT EXISTS idx_volume_pages_is_active ON public.volume_pages(is_active);
