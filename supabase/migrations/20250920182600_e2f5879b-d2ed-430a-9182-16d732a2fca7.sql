-- Fix product_type constraint to include 'print'
-- Drop the existing constraint that doesn't include 'print'
ALTER TABLE public.books DROP CONSTRAINT IF EXISTS books_product_type_check;

-- Add new constraint that includes 'print' as a valid option
ALTER TABLE public.books ADD CONSTRAINT books_product_type_check 
CHECK (product_type IN ('book', 'merchandise', 'digital', 'print', 'other'));

-- Verify the constraint was added correctly
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'books_product_type_check';