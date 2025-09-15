-- Create book_characters table for storing character data linked to books
CREATE TABLE IF NOT EXISTS public.book_characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  role TEXT DEFAULT 'main',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE
);

-- Enable RLS for book_characters
ALTER TABLE public.book_characters ENABLE ROW LEVEL SECURITY;

-- Create policies for book_characters
CREATE POLICY "Book characters are viewable by everyone" 
ON public.book_characters 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin can manage book characters" 
ON public.book_characters 
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_book_characters_updated_at
BEFORE UPDATE ON public.book_characters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_book_characters_book_id ON public.book_characters(book_id);
CREATE INDEX idx_book_characters_display_order ON public.book_characters(display_order);