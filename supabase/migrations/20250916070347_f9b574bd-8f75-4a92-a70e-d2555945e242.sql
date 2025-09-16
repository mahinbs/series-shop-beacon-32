-- Fix cart system by adding proper foreign key constraints and cleaning up orphaned data

-- First, remove any orphaned cart items that reference non-existent books
DELETE FROM public.cart_items 
WHERE product_id NOT IN (SELECT id FROM public.books);

-- Add foreign key constraint to prevent orphaned cart items in the future
ALTER TABLE public.cart_items 
ADD CONSTRAINT fk_cart_items_product_id 
FOREIGN KEY (product_id) REFERENCES public.books(id) 
ON DELETE CASCADE;

-- Add index for better performance on cart queries
CREATE INDEX IF NOT EXISTS idx_cart_items_user_product ON public.cart_items(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);