import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Copy,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const REQUIRED_TABLES = [
  'books',
  'hero_banners', 
  'announcements',
  'page_sections',
  'profiles',
  'user_roles',
  'comic_series',
  'comic_episodes',
  'comic_pages',
  'creators',
  'series_creators',
  'coin_packages',
  'user_coins',
  'coin_transactions',
  'digital_reader_specs',
  'shop_all_heroes',
  'shop_all_filters',
  'shop_all_sorts',
  'featured_series_configs',
  'featured_series_badges'
];

const SQL_SETUP_SCRIPT = `
-- Complete Database Setup Script for Series Shop
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  coins TEXT,
  image_url TEXT,
  hover_image_url TEXT,
  can_unlock_with_coins BOOLEAN DEFAULT false,
  section_type TEXT DEFAULT 'featured',
  label TEXT,
  is_new BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero banners table
CREATE TABLE IF NOT EXISTS hero_banners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  full_description TEXT,
  date_info TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  features TEXT[],
  badge_type TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page sections table
CREATE TABLE IF NOT EXISTS page_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_name TEXT NOT NULL,
  section_name TEXT NOT NULL,
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comic series table
CREATE TABLE IF NOT EXISTS comic_series (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  banner_image_url TEXT,
  status TEXT DEFAULT 'ongoing',
  genre TEXT[],
  tags TEXT[],
  age_rating TEXT DEFAULT 'all',
  total_episodes INTEGER DEFAULT 0,
  total_pages INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creators table
CREATE TABLE IF NOT EXISTS creators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Series creators junction table
CREATE TABLE IF NOT EXISTS series_creators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  series_id UUID REFERENCES comic_series(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comic episodes table
CREATE TABLE IF NOT EXISTS comic_episodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  series_id UUID REFERENCES comic_series(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_free BOOLEAN DEFAULT true,
  coin_price INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comic pages table
CREATE TABLE IF NOT EXISTS comic_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  episode_id UUID REFERENCES comic_episodes(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  is_free BOOLEAN DEFAULT true,
  coin_price INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coin packages table
CREATE TABLE IF NOT EXISTS coin_packages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  coins INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  bonus INTEGER DEFAULT 0,
  popular BOOLEAN DEFAULT false,
  best_value BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User coins table
CREATE TABLE IF NOT EXISTS user_coins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  balance INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coin transactions table
CREATE TABLE IF NOT EXISTS coin_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  balance INTEGER NOT NULL,
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Digital reader specifications table
CREATE TABLE IF NOT EXISTS digital_reader_specs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  creator TEXT NOT NULL,
  creator_image_url TEXT,
  creator_bio TEXT,
  artist TEXT NOT NULL,
  artist_image_url TEXT,
  release_date DATE NOT NULL,
  category TEXT NOT NULL,
  age_rating TEXT NOT NULL,
  genre TEXT NOT NULL,
  length INTEGER NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  banner_image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shop All hero sections table
CREATE TABLE IF NOT EXISTS shop_all_heroes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  background_image_url TEXT,
  primary_button_text TEXT,
  primary_button_link TEXT,
  secondary_button_text TEXT,
  secondary_button_link TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shop All filters table
CREATE TABLE IF NOT EXISTS shop_all_filters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('category', 'price', 'status', 'type')),
  options TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shop All sort options table
CREATE TABLE IF NOT EXISTS shop_all_sorts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comic_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE comic_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comic_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coins ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_reader_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_all_heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_all_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_all_sorts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access" ON books FOR SELECT USING (true);
CREATE POLICY "Public read access" ON hero_banners FOR SELECT USING (true);
CREATE POLICY "Public read access" ON announcements FOR SELECT USING (true);
CREATE POLICY "Public read access" ON page_sections FOR SELECT USING (true);
CREATE POLICY "Public read access" ON comic_series FOR SELECT USING (true);
CREATE POLICY "Public read access" ON creators FOR SELECT USING (true);
CREATE POLICY "Public read access" ON series_creators FOR SELECT USING (true);
CREATE POLICY "Public read access" ON comic_episodes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON comic_pages FOR SELECT USING (true);
CREATE POLICY "Public read access" ON coin_packages FOR SELECT USING (true);
CREATE POLICY "Public read access" ON digital_reader_specs FOR SELECT USING (true);
CREATE POLICY "Public read access" ON shop_all_heroes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON shop_all_filters FOR SELECT USING (true);
CREATE POLICY "Public read access" ON shop_all_sorts FOR SELECT USING (true);

-- Create policies for authenticated users
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own coins" ON user_coins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own transactions" ON coin_transactions FOR SELECT USING (auth.uid() = user_id);

-- Create policies for admin users
CREATE POLICY "Admins can manage all data" ON books FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all data" ON hero_banners FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all data" ON announcements FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all data" ON page_sections FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all data" ON comic_series FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all data" ON creators FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all data" ON series_creators FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all data" ON comic_episodes FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all data" ON comic_pages FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all data" ON coin_packages FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all data" ON digital_reader_specs FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all data" ON shop_all_heroes FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all data" ON shop_all_filters FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all data" ON shop_all_sorts FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Insert sample data
INSERT INTO books (title, author, category, price, image_url, section_type, is_active) VALUES
('Sample Book 1', 'Author 1', 'Fiction', 19.99, '/placeholder.svg', 'featured', true),
('Sample Book 2', 'Author 2', 'Non-Fiction', 24.99, '/placeholder.svg', 'new-releases', true);

INSERT INTO hero_banners (title, subtitle, image_url, display_order, is_active) VALUES
('Welcome to Series Shop', 'Discover amazing content', '/placeholder.svg', 1, true);

INSERT INTO announcements (title, description, status, is_active) VALUES
('Welcome!', 'Welcome to our platform', 'active', true);

INSERT INTO coin_packages (name, coins, price, bonus, popular, best_value, active) VALUES
('Starter Pack', 100, 4.99, 0, false, false, true),
('Popular Pack', 500, 19.99, 50, true, false, true),
('Best Value', 1000, 34.99, 200, false, true, true);

INSERT INTO digital_reader_specs (title, creator, creator_image_url, creator_bio, artist, artist_image_url, release_date, category, age_rating, genre, length, description, cover_image_url, banner_image_url, is_featured, is_active, display_order) VALUES
('SKIP AND LOAFER', 'YASUO TAKAMITSU', '/lovable-uploads/creator-placeholder.png', 'Yasuo Takamitsu is a renowned manga artist known for his work on slice-of-life and romance series. He has been creating manga for over 15 years and is celebrated for his detailed character development and emotional storytelling.', 'YASUO TAKAMITSU', '/lovable-uploads/artist-placeholder.png', '2023-02-11', 'manga', 'teen', 'shojo', 280, 'Overall, Oshi no Ko is best described as a subversive, dramatic take on the idol industry in Japan, though it has some romantic plotlines as well. Protagonist Aqua Hoshino is more interested in pursuing his quest for vengeance in an exploitative industry, but he finds himself in the spotlight without even meaning to.', '/lovable-uploads/4e6b2521-dc40-43e9-aed0-53fef670570b.png', '/lovable-uploads/4e6b2521-dc40-43e9-aed0-53fef670570b.png', true, true, 1);

INSERT INTO shop_all_heroes (title, description, background_image_url, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, is_active, display_order) VALUES
('Explore Series', 'Discover new series through manga and anime stories. Read stories, discover new characters, and learn lore through the life cycle.', '/lovable-uploads/shop-hero-bg.jpg', 'Popular Series', '/our-series', 'Browse All', '/shop-all', true, 1);

INSERT INTO shop_all_filters (name, type, options, is_active, display_order) VALUES
('Types', 'type', ARRAY['Manga', 'Webtoon', 'Light Novel', 'Anthology'], true, 1),
('Price', 'price', ARRAY['Free', 'Under $5', '$5-$10', '$10-$20', '$20+'], true, 2),
('Status', 'status', ARRAY['Ongoing', 'Completed', 'Upcoming', 'On Hold'], true, 3);

INSERT INTO shop_all_sorts (name, value, is_active, display_order) VALUES
('Newest First', 'newest-first', true, 1),
('Oldest First', 'oldest-first', true, 2),
('A-Z', 'a-z', true, 3),
('Z-A', 'z-a', true, 4),
('Price: Low to High', 'price-low-high', true, 5),
('Price: High to Low', 'price-high-low', true, 6),
('Most Popular', 'most-popular', true, 7),
('Highest Rated', 'highest-rated', true, 8);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_section_type ON books(section_type);
CREATE INDEX IF NOT EXISTS idx_books_is_active ON books(is_active);
CREATE INDEX IF NOT EXISTS idx_hero_banners_display_order ON hero_banners(display_order);
CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);
CREATE INDEX IF NOT EXISTS idx_comic_series_status ON comic_series(status);
CREATE INDEX IF NOT EXISTS idx_comic_series_is_featured ON comic_series(is_featured);
CREATE INDEX IF NOT EXISTS idx_comic_episodes_series_id ON comic_episodes(series_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_id ON coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_digital_reader_specs_category ON digital_reader_specs(category);
CREATE INDEX IF NOT EXISTS idx_digital_reader_specs_genre ON digital_reader_specs(genre);
CREATE INDEX IF NOT EXISTS idx_digital_reader_specs_is_featured ON digital_reader_specs(is_featured);
CREATE INDEX IF NOT EXISTS idx_digital_reader_specs_is_active ON digital_reader_specs(is_active);
CREATE INDEX IF NOT EXISTS idx_digital_reader_specs_display_order ON digital_reader_specs(display_order);
CREATE INDEX IF NOT EXISTS idx_shop_all_heroes_is_active ON shop_all_heroes(is_active);
CREATE INDEX IF NOT EXISTS idx_shop_all_heroes_display_order ON shop_all_heroes(display_order);
CREATE INDEX IF NOT EXISTS idx_shop_all_filters_is_active ON shop_all_filters(is_active);
CREATE INDEX IF NOT EXISTS idx_shop_all_filters_display_order ON shop_all_filters(display_order);
CREATE INDEX IF NOT EXISTS idx_shop_all_sorts_is_active ON shop_all_sorts(is_active);
CREATE INDEX IF NOT EXISTS idx_shop_all_sorts_display_order ON shop_all_sorts(display_order);

-- Featured Series Configurations table
CREATE TABLE IF NOT EXISTS featured_series_configs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  background_image_url TEXT,
  primary_button_text TEXT,
  primary_button_link TEXT,
  secondary_button_text TEXT,
  secondary_button_link TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Featured Series Badges table
CREATE TABLE IF NOT EXISTS featured_series_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  text_color TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Featured Series tables
ALTER TABLE featured_series_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_series_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Featured Series Configurations
CREATE POLICY "Public read access" ON featured_series_configs FOR SELECT USING (true);
CREATE POLICY "Admins can manage all data" ON featured_series_configs FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- RLS Policies for Featured Series Badges
CREATE POLICY "Public read access" ON featured_series_badges FOR SELECT USING (true);
CREATE POLICY "Admins can manage all data" ON featured_series_badges FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Insert default Featured Series configurations
INSERT INTO featured_series_configs (title, description, background_image_url, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, is_active, display_order) VALUES
('Featured Series', 'Discover our most popular and trending series', '/lovable-uploads/featured-series-bg.jpg', 'View All Series', '/our-series', 'Start Reading', '/digital-reader', true, 1);

-- Insert default Featured Series badges
INSERT INTO featured_series_badges (name, color, text_color, is_active, display_order) VALUES
('New Chapter', 'bg-red-600', 'text-white', true, 1),
('Trending', 'bg-blue-600', 'text-white', true, 2),
('Updated', 'bg-green-600', 'text-white', true, 3),
('Popular', 'bg-purple-600', 'text-white', true, 4);

-- Create indexes for Featured Series tables
CREATE INDEX IF NOT EXISTS idx_featured_series_configs_is_active ON featured_series_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_featured_series_configs_display_order ON featured_series_configs(display_order);
CREATE INDEX IF NOT EXISTS idx_featured_series_badges_is_active ON featured_series_badges(is_active);
CREATE INDEX IF NOT EXISTS idx_featured_series_badges_display_order ON featured_series_badges(display_order);
`;

export const DatabaseSetupHelper = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [tableStatus, setTableStatus] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const checkTables = async () => {
    setIsChecking(true);
    const status: Record<string, boolean> = {};
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      for (const table of REQUIRED_TABLES) {
        try {
          const { error } = await (supabase as any)
            .from(table)
            .select('count')
            .limit(1);
          
          status[table] = !error;
        } catch (error) {
          status[table] = false;
        }
      }
      
      setTableStatus(status);
    } catch (error) {
      console.error('Error checking tables:', error);
      toast({
        title: "Error",
        description: "Failed to check database tables",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(SQL_SETUP_SCRIPT);
      toast({
        title: "Copied!",
        description: "SQL script copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const downloadScript = () => {
    const blob = new Blob([SQL_SETUP_SCRIPT], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database-setup.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "SQL script downloaded successfully"
    });
  };

  const existingTables = Object.values(tableStatus).filter(Boolean).length;
  const totalTables = REQUIRED_TABLES.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Setup Helper
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Database Status</h3>
              <p className="text-sm text-muted-foreground">
                {existingTables} of {totalTables} required tables exist
              </p>
            </div>
            <Button onClick={checkTables} disabled={isChecking} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              Check Tables
            </Button>
          </div>

          {existingTables < totalTables && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Database Setup Required</strong>
                <p className="mt-2">
                  Some required tables are missing. Use the SQL script below to set up your database.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {existingTables === totalTables && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Database Ready!</strong>
                <p className="mt-2">
                  All required tables are present and the database is properly configured.
                </p>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">Table Status:</h4>
            <div className="grid grid-cols-2 gap-2">
              {REQUIRED_TABLES.map((table) => (
                <div key={table} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm font-mono">{table}</span>
                  {tableStatus[table] ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy SQL Script
              </Button>
              <Button onClick={downloadScript} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download SQL Script
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Instructions:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Copy or download the SQL script above</li>
                <li>Go to your Supabase project dashboard</li>
                <li>Navigate to the SQL Editor</li>
                <li>Paste and run the complete script</li>
                <li>Refresh this page to verify setup</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
