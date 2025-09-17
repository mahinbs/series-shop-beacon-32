-- Add sample character data for test books
-- Run this script in Supabase SQL Editor

-- First, let's get the book IDs for our test books
-- We'll use the book titles to find the IDs

-- Insert characters for Test Book 1
INSERT INTO public.book_characters (
    book_id,
    name,
    description,
    image_url,
    role,
    display_order,
    is_active
)
SELECT 
    b.id,
    'Hero Character',
    'The main protagonist of the story, brave and determined.',
    'https://via.placeholder.com/300x400/FF6B6B/FFFFFF?text=Hero',
    'main',
    1,
    true
FROM public.books b 
WHERE b.title = 'Test Book 1'
LIMIT 1;

INSERT INTO public.book_characters (
    book_id,
    name,
    description,
    image_url,
    role,
    display_order,
    is_active
)
SELECT 
    b.id,
    'Villain Character',
    'The antagonist who challenges our hero at every turn.',
    'https://via.placeholder.com/300x400/4ECDC4/FFFFFF?text=Villain',
    'antagonist',
    2,
    true
FROM public.books b 
WHERE b.title = 'Test Book 1'
LIMIT 1;

INSERT INTO public.book_characters (
    book_id,
    name,
    description,
    image_url,
    role,
    display_order,
    is_active
)
SELECT 
    b.id,
    'Supporting Character',
    'A loyal friend who helps the hero on their journey.',
    'https://via.placeholder.com/300x400/45B7D1/FFFFFF?text=Support',
    'supporting',
    3,
    true
FROM public.books b 
WHERE b.title = 'Test Book 1'
LIMIT 1;

-- Insert characters for Test Book 2
INSERT INTO public.book_characters (
    book_id,
    name,
    description,
    image_url,
    role,
    display_order,
    is_active
)
SELECT 
    b.id,
    'Main Character',
    'The central figure in this exciting adventure.',
    'https://via.placeholder.com/300x400/96CEB4/FFFFFF?text=Main',
    'main',
    1,
    true
FROM public.books b 
WHERE b.title = 'Test Book 2'
LIMIT 1;

INSERT INTO public.book_characters (
    book_id,
    name,
    description,
    image_url,
    role,
    display_order,
    is_active
)
SELECT 
    b.id,
    'Mentor Character',
    'A wise guide who teaches important lessons.',
    'https://via.placeholder.com/300x400/FFEAA7/FFFFFF?text=Mentor',
    'mentor',
    2,
    true
FROM public.books b 
WHERE b.title = 'Test Book 2'
LIMIT 1;

-- Insert characters for Test Book 3
INSERT INTO public.book_characters (
    book_id,
    name,
    description,
    image_url,
    role,
    display_order,
    is_active
)
SELECT 
    b.id,
    'Protagonist',
    'The hero of this thrilling story.',
    'https://via.placeholder.com/300x400/DDA0DD/FFFFFF?text=Hero',
    'main',
    1,
    true
FROM public.books b 
WHERE b.title = 'Test Book 3'
LIMIT 1;

INSERT INTO public.book_characters (
    book_id,
    name,
    description,
    image_url,
    role,
    display_order,
    is_active
)
SELECT 
    b.id,
    'Love Interest',
    'The romantic interest who adds depth to the story.',
    'https://via.placeholder.com/300x400/98D8C8/FFFFFF?text=Love',
    'love_interest',
    2,
    true
FROM public.books b 
WHERE b.title = 'Test Book 3'
LIMIT 1;

INSERT INTO public.book_characters (
    book_id,
    name,
    description,
    image_url,
    role,
    display_order,
    is_active
)
SELECT 
    b.id,
    'Comic Relief',
    'A funny character who lightens the mood.',
    'https://via.placeholder.com/300x400/F7DC6F/FFFFFF?text=Funny',
    'comic_relief',
    3,
    true
FROM public.books b 
WHERE b.title = 'Test Book 3'
LIMIT 1;

INSERT INTO public.book_characters (
    book_id,
    name,
    description,
    image_url,
    role,
    display_order,
    is_active
)
SELECT 
    b.id,
    'Mysterious Character',
    'An enigmatic figure with hidden motives.',
    'https://via.placeholder.com/300x400/BB8FCE/FFFFFF?text=Mystery',
    'mysterious',
    4,
    true
FROM public.books b 
WHERE b.title = 'Test Book 3'
LIMIT 1;

-- Verify the data was inserted
SELECT 
    '✅ Sample characters added successfully!' as status,
    COUNT(*) as total_characters
FROM public.book_characters;

-- Show the characters by book
SELECT 
    b.title as book_title,
    bc.name as character_name,
    bc.role,
    bc.display_order
FROM public.books b
LEFT JOIN public.book_characters bc ON b.id = bc.book_id
WHERE b.title IN ('Test Book 1', 'Test Book 2', 'Test Book 3')
ORDER BY b.title, bc.display_order;
