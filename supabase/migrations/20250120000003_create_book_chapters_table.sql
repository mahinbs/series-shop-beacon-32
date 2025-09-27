-- Create book_chapters table for storing book chapters
CREATE TABLE IF NOT EXISTS public.book_chapters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    chapter_title TEXT NOT NULL,
    chapter_description TEXT,
    is_preview BOOLEAN DEFAULT false, -- Whether this chapter is available for preview
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, chapter_number) -- Ensure unique chapter numbers per book
);

-- Create book_chapter_pages table for storing individual chapter pages
CREATE TABLE IF NOT EXISTS public.book_chapter_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chapter_id UUID NOT NULL REFERENCES public.book_chapters(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    page_url TEXT,
    page_title TEXT,
    page_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(chapter_id, page_number) -- Ensure unique page numbers per chapter
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_book_chapters_book_id ON public.book_chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_book_chapters_chapter_number ON public.book_chapters(book_id, chapter_number);
CREATE INDEX IF NOT EXISTS idx_book_chapter_pages_chapter_id ON public.book_chapter_pages(chapter_id);
CREATE INDEX IF NOT EXISTS idx_book_chapter_pages_page_number ON public.book_chapter_pages(chapter_id, page_number);

-- Enable RLS
ALTER TABLE public.book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_chapter_pages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for book_chapters
CREATE POLICY "Enable read access for all users" ON public.book_chapters
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.book_chapters
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.book_chapters
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.book_chapters
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for book_chapter_pages
CREATE POLICY "Enable read access for all users" ON public.book_chapter_pages
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.book_chapter_pages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.book_chapter_pages
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.book_chapter_pages
    FOR DELETE USING (auth.role() = 'authenticated');

-- Add updated_at triggers
CREATE TRIGGER update_book_chapters_updated_at 
    BEFORE UPDATE ON public.book_chapters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_chapter_pages_updated_at 
    BEFORE UPDATE ON public.book_chapter_pages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
