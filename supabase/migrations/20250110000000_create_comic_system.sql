-- Create comprehensive comic management system
-- Migration: 20250110000000_create_comic_system.sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create creators table for detailed creator information
CREATE TABLE IF NOT EXISTS public.creators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    website_url TEXT,
    social_links JSONB DEFAULT '{}',
    specialties TEXT[] DEFAULT '{}', -- e.g., ['writer', 'artist', 'colorist']
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comic_series table
CREATE TABLE IF NOT EXISTS public.comic_series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- URL-friendly version of title
    description TEXT,
    cover_image_url TEXT,
    banner_image_url TEXT,
    status TEXT DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'hiatus', 'cancelled')),
    genre TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    age_rating TEXT DEFAULT 'all' CHECK (age_rating IN ('all', 'teen', 'mature')),
    total_episodes INTEGER DEFAULT 0,
    total_pages INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create series_creators junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.series_creators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    series_id UUID NOT NULL REFERENCES public.comic_series(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('writer', 'artist', 'colorist', 'letterer', 'editor', 'publisher')),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(series_id, creator_id, role)
);

-- Create comic_episodes table
CREATE TABLE IF NOT EXISTS public.comic_episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    series_id UUID NOT NULL REFERENCES public.comic_series(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    total_pages INTEGER DEFAULT 0,
    is_free BOOLEAN DEFAULT false,
    coin_price INTEGER DEFAULT 0, -- Price in coins to unlock
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(series_id, episode_number)
);

-- Create comic_pages table
CREATE TABLE IF NOT EXISTS public.comic_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    episode_id UUID NOT NULL REFERENCES public.comic_episodes(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT, -- Smaller version for previews
    alt_text TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(episode_id, page_number)
);

-- Create comic_files table for PDF and other file storage
CREATE TABLE IF NOT EXISTS public.comic_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    episode_id UUID NOT NULL REFERENCES public.comic_episodes(id) ON DELETE CASCADE,
    file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'zip', 'cbz', 'cbr')),
    file_url TEXT NOT NULL,
    file_size BIGINT, -- File size in bytes
    original_filename TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comic_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comic_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comic_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comic_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for creators
CREATE POLICY "Anyone can view active creators" ON public.creators FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage creators" ON public.creators FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for comic_series
CREATE POLICY "Anyone can view active comic series" ON public.comic_series FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage comic series" ON public.comic_series FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for series_creators
CREATE POLICY "Anyone can view series creators" ON public.series_creators FOR SELECT USING (true);
CREATE POLICY "Admins can manage series creators" ON public.series_creators FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for comic_episodes
CREATE POLICY "Anyone can view published episodes" ON public.comic_episodes FOR SELECT USING (is_active = true AND is_published = true);
CREATE POLICY "Admins can manage all episodes" ON public.comic_episodes FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for comic_pages
CREATE POLICY "Anyone can view active comic pages" ON public.comic_pages FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage comic pages" ON public.comic_pages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for comic_files
CREATE POLICY "Anyone can view active comic files" ON public.comic_files FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage comic files" ON public.comic_files FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comic_series_slug ON public.comic_series(slug);
CREATE INDEX IF NOT EXISTS idx_comic_series_status ON public.comic_series(status);
CREATE INDEX IF NOT EXISTS idx_comic_series_featured ON public.comic_series(is_featured);
CREATE INDEX IF NOT EXISTS idx_comic_episodes_series_id ON public.comic_episodes(series_id);
CREATE INDEX IF NOT EXISTS idx_comic_episodes_published ON public.comic_episodes(is_published);
CREATE INDEX IF NOT EXISTS idx_comic_pages_episode_id ON public.comic_pages(episode_id);
CREATE INDEX IF NOT EXISTS idx_comic_pages_page_number ON public.comic_pages(page_number);
CREATE INDEX IF NOT EXISTS idx_series_creators_series_id ON public.series_creators(series_id);
CREATE INDEX IF NOT EXISTS idx_series_creators_creator_id ON public.series_creators(creator_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_creators_updated_at
    BEFORE UPDATE ON public.creators
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comic_series_updated_at
    BEFORE UPDATE ON public.comic_series
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comic_episodes_updated_at
    BEFORE UPDATE ON public.comic_episodes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comic_pages_updated_at
    BEFORE UPDATE ON public.comic_pages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comic_files_updated_at
    BEFORE UPDATE ON public.comic_files
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update series statistics
CREATE OR REPLACE FUNCTION update_series_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total episodes count
    UPDATE public.comic_series 
    SET total_episodes = (
        SELECT COUNT(*) 
        FROM public.comic_episodes 
        WHERE series_id = COALESCE(NEW.series_id, OLD.series_id)
        AND is_active = true
    )
    WHERE id = COALESCE(NEW.series_id, OLD.series_id);
    
    -- Update total pages count
    UPDATE public.comic_series 
    SET total_pages = (
        SELECT COALESCE(SUM(total_pages), 0)
        FROM public.comic_episodes 
        WHERE series_id = COALESCE(NEW.series_id, OLD.series_id)
        AND is_active = true
    )
    WHERE id = COALESCE(NEW.series_id, OLD.series_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update series stats when episodes change
CREATE TRIGGER update_series_stats_on_episode_change
    AFTER INSERT OR UPDATE OR DELETE ON public.comic_episodes
    FOR EACH ROW
    EXECUTE FUNCTION update_series_stats();

-- Create function to update episode page count
CREATE OR REPLACE FUNCTION update_episode_page_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.comic_episodes 
    SET total_pages = (
        SELECT COUNT(*) 
        FROM public.comic_pages 
        WHERE episode_id = COALESCE(NEW.episode_id, OLD.episode_id)
        AND is_active = true
    )
    WHERE id = COALESCE(NEW.episode_id, OLD.episode_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update episode page count when pages change
CREATE TRIGGER update_episode_page_count_on_page_change
    AFTER INSERT OR UPDATE OR DELETE ON public.comic_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_episode_page_count();
