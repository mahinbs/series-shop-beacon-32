-- Create print_pages table for print book pages
CREATE TABLE IF NOT EXISTS print_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  print_book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_print_pages_book_id ON print_pages(print_book_id);
CREATE INDEX IF NOT EXISTS idx_print_pages_page_number ON print_pages(print_book_id, page_number);

-- Enable RLS
ALTER TABLE print_pages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Print pages are viewable by everyone" ON print_pages
  FOR SELECT USING (true);

CREATE POLICY "Print pages are manageable by admins" ON print_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_print_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_print_pages_updated_at
  BEFORE UPDATE ON print_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_print_pages_updated_at();
