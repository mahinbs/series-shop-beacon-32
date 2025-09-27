-- Create retailers table for managing Where to Buy options
-- Migration: 20250120000002_create_retailers_table.sql

-- Create retailers table
CREATE TABLE IF NOT EXISTS public.retailers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  website_url TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create book_retailers junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.book_retailers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  retailer_id UUID NOT NULL REFERENCES public.retailers(id) ON DELETE CASCADE,
  format_type VARCHAR(50) NOT NULL CHECK (format_type IN ('digital', 'paperback', 'hardcover')),
  url TEXT,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, retailer_id, format_type)
);

-- Add comments for documentation
COMMENT ON TABLE public.retailers IS 'Stores retailer information for Where to Buy section';
COMMENT ON TABLE public.book_retailers IS 'Junction table linking books to retailers with format-specific URLs';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_retailers_is_active ON public.retailers(is_active);
CREATE INDEX IF NOT EXISTS idx_retailers_display_order ON public.retailers(display_order);
CREATE INDEX IF NOT EXISTS idx_book_retailers_book_id ON public.book_retailers(book_id);
CREATE INDEX IF NOT EXISTS idx_book_retailers_retailer_id ON public.book_retailers(retailer_id);
CREATE INDEX IF NOT EXISTS idx_book_retailers_format_type ON public.book_retailers(format_type);

-- Enable RLS
ALTER TABLE public.retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_retailers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for retailers
CREATE POLICY "Retailers are viewable by everyone" ON public.retailers
  FOR SELECT USING (true);

CREATE POLICY "Retailers are manageable by authenticated users" ON public.retailers
  FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for book_retailers
CREATE POLICY "Book retailers are viewable by everyone" ON public.book_retailers
  FOR SELECT USING (true);

CREATE POLICY "Book retailers are manageable by authenticated users" ON public.book_retailers
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert some default retailers
INSERT INTO public.retailers (name, website_url, logo_url, display_order) VALUES
  ('Flipkart', 'https://flipkart.com', null, 1),
  ('Amazon', 'https://amazon.com', null, 2),
  ('Amazon India', 'https://amazon.in', null, 3),
  ('Book Depository', 'https://bookdepository.com', null, 4),
  ('Barnes & Noble', 'https://barnesandnoble.com', null, 5),
  ('Waterstones', 'https://waterstones.com', null, 6)
ON CONFLICT DO NOTHING;
