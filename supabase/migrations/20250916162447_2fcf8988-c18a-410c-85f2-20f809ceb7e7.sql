-- Create table for book character images
CREATE TABLE public.book_character_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.book_characters(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_main BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.book_character_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Book character images are viewable by everyone" 
ON public.book_character_images 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage book character images" 
ON public.book_character_images 
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_book_character_images_updated_at
BEFORE UPDATE ON public.book_character_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_book_character_images_character_id ON public.book_character_images(character_id);
CREATE INDEX idx_book_character_images_is_main ON public.book_character_images(character_id, is_main) WHERE is_main = true;

-- Migrate existing image_url data to the new table
INSERT INTO public.book_character_images (character_id, image_url, is_main, display_order)
SELECT id, image_url, true, 0
FROM public.book_characters 
WHERE image_url IS NOT NULL AND image_url != '';

-- Function to ensure only one main image per character
CREATE OR REPLACE FUNCTION public.ensure_single_main_character_image()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting an image as main, unset all other main images for this character
  IF NEW.is_main = true THEN
    UPDATE public.book_character_images 
    SET is_main = false, updated_at = now()
    WHERE character_id = NEW.character_id 
    AND id != NEW.id 
    AND is_main = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to ensure only one main image per character
CREATE TRIGGER ensure_single_main_character_image_trigger
AFTER INSERT OR UPDATE ON public.book_character_images
FOR EACH ROW
WHEN (NEW.is_main = true)
EXECUTE FUNCTION public.ensure_single_main_character_image();