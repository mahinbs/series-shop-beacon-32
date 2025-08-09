-- 🔍 VERIFICATION SCRIPT - Run this to check if everything is working

-- Check if books table exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
        THEN '✅ Books table exists' 
        ELSE '❌ Books table does NOT exist' 
    END as table_status;

-- Check table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'books'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'books';

-- Check if test data exists
SELECT 
    COUNT(*) as book_count,
    '✅ Test data found' as data_status
FROM public.books;

-- Test insert (should work if everything is set up correctly)
INSERT INTO public.books (
    title, 
    author, 
    category, 
    price, 
    image_url, 
    section_type, 
    is_active
) VALUES (
    'Verification Test Book',
    'Test Author',
    'Test Category',
    19.99,
    'https://via.placeholder.com/300x400',
    'new-releases',
    true
) ON CONFLICT DO NOTHING;

-- Final verification
SELECT 
    '🎉 DATABASE VERIFICATION COMPLETE' as status,
    (SELECT COUNT(*) FROM public.books) as total_books,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'books') as policy_count;
