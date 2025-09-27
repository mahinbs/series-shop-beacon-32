-- Add stock management and format availability fields to books table
-- Migration: 20250120000001_add_stock_management_fields.sql

-- Add new columns to books table for format availability
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS available_digital BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS available_paperback BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS available_hardcover BOOLEAN DEFAULT true;

-- Add new columns for stock quantities
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS digital_stock INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS paperback_stock INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS hardcover_stock INTEGER DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN public.books.available_digital IS 'Whether digital format is available for this book';
COMMENT ON COLUMN public.books.available_paperback IS 'Whether paperback format is available for this book';
COMMENT ON COLUMN public.books.available_hardcover IS 'Whether hardcover format is available for this book';
COMMENT ON COLUMN public.books.digital_stock IS 'Stock quantity for digital format (0 = unlimited)';
COMMENT ON COLUMN public.books.paperback_stock IS 'Stock quantity for paperback format';
COMMENT ON COLUMN public.books.hardcover_stock IS 'Stock quantity for hardcover format';

-- Create indexes for better performance on new fields
CREATE INDEX IF NOT EXISTS idx_books_available_digital ON public.books(available_digital);
CREATE INDEX IF NOT EXISTS idx_books_available_paperback ON public.books(available_paperback);
CREATE INDEX IF NOT EXISTS idx_books_available_hardcover ON public.books(available_hardcover);
CREATE INDEX IF NOT EXISTS idx_books_digital_stock ON public.books(digital_stock);
CREATE INDEX IF NOT EXISTS idx_books_paperback_stock ON public.books(paperback_stock);
CREATE INDEX IF NOT EXISTS idx_books_hardcover_stock ON public.books(hardcover_stock);

-- Update existing records to have default values
UPDATE public.books 
SET 
  available_digital = true,
  available_paperback = true,
  available_hardcover = true,
  digital_stock = 0,
  paperback_stock = stock_quantity,
  hardcover_stock = 0
WHERE available_digital IS NULL;
