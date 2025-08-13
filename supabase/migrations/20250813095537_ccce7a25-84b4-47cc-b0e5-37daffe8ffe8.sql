-- Update existing hero banners with compelling manga/comics content
UPDATE hero_banners 
SET 
  title = 'Discover Your Next Adventure',
  subtitle = 'Experience the finest English localizations of Japanese manga and Korean webtoons'
WHERE id = '09478369-b113-4bf5-b9d9-6089ea336025';

UPDATE hero_banners 
SET 
  title = 'Where Stories Come Alive',
  subtitle = 'Bringing incredible stories from across the globe to readers worldwide'
WHERE id = 'feb26f42-61bb-4b60-b596-902b26bfcf62';

-- Insert additional compelling banners
INSERT INTO hero_banners (title, subtitle, image_url, is_active, display_order) VALUES
('Epic Tales Await', 'Premium publishing quality meets captivating storytelling', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', true, 3),
('Journey Beyond Imagination', 'Dive into worlds of adventure, romance, and mystery crafted by master storytellers', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', true, 4);