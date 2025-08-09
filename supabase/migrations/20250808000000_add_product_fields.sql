-- Add new product-related fields to books table
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'book' CHECK (product_type IN ('book', 'merchandise', 'digital', 'other')),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS weight DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS dimensions TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Update section_type to include new sections
ALTER TABLE public.books 
DROP CONSTRAINT IF EXISTS books_section_type_check;

ALTER TABLE public.books 
ADD CONSTRAINT books_section_type_check 
CHECK (section_type IN ('new-releases', 'best-sellers', 'leaving-soon', 'featured', 'trending'));

-- Make author field optional for non-book products
ALTER TABLE public.books 
ALTER COLUMN author DROP NOT NULL;

-- Make hover_image_url optional
ALTER TABLE public.books 
ALTER COLUMN hover_image_url DROP NOT NULL;

-- Add index for product_type for better performance
CREATE INDEX IF NOT EXISTS idx_books_product_type ON public.books(product_type);

-- Add index for section_type for better performance
CREATE INDEX IF NOT EXISTS idx_books_section_type ON public.books(section_type);
