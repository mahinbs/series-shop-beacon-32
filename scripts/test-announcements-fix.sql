-- Test script to verify announcements table is working
-- Run this after applying the fix

-- Test inserting a sample announcement
INSERT INTO public.announcements (
    title,
    description,
    full_description,
    date_info,
    image_url,
    status,
    features,
    badge_type,
    display_order,
    is_active
) VALUES (
    'Test Announcement',
    'This is a test announcement',
    'This is a full description of the test announcement',
    'Available Now',
    'https://example.com/image.jpg',
    'General',
    ARRAY['Feature 1', 'Feature 2'],
    'new',
    1,
    true
);

-- Check if the insert was successful
SELECT * FROM public.announcements WHERE title = 'Test Announcement';

-- Clean up test data
DELETE FROM public.announcements WHERE title = 'Test Announcement';
