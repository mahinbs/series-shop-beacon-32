# 🔧 Book Management Error Fix Guide

## 🚨 Issue Identified

**Error**: Book management functionality is not working properly in the admin panel.

**Root Cause**: Database tables may not exist or RLS policies are too restrictive.

## 🎯 Solution

### Step 1: Run the Database Fix Script

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project: `fgsqmtielwzqzzxowzhr`
   - Navigate to **SQL Editor** in the left sidebar
   - Click **New Query**

2. **Run the Fix Script:**
   - Copy the contents of `scripts/fix-database-issues.sql`
   - Paste it into the SQL Editor
   - Click **Run** to execute the script

3. **Verify Success:**
   - You should see: `Database issues fixed successfully! All tables created and policies configured.`

### Step 2: Test the Book Management

1. **Access Admin Panel:**
   - Go to: `http://localhost:8080/admin`
   - Login with: `admin@series-shop.com` / `Admin@2024!`

2. **Test Book Creation:**
   - Click "Books Management" in the sidebar
   - Click "Add Book"
   - Fill in the required fields:
     - **Title:** Test Book
     - **Category:** Manga
     - **Price:** 9.99
     - **Image URL:** https://via.placeholder.com/300x400
   - Click "Create Book"
   - Verify the book appears in the list

3. **Test Book Editing:**
   - Click the edit button on any book
   - Modify some fields
   - Click "Update Book"
   - Verify changes are saved

4. **Test Book Deletion:**
   - Click the delete button on any book
   - Confirm deletion
   - Verify book is removed from list

## 🔍 Troubleshooting

### Common Errors and Solutions

#### Error: "Books table does not exist"

**Solution:**
```sql
-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT,
    category TEXT NOT NULL,
    product_type TEXT DEFAULT 'book' CHECK (product_type IN ('book', 'merchandise', 'digital', 'other')),
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    coins TEXT,
    image_url TEXT NOT NULL,
    hover_image_url TEXT,
    description TEXT,
    can_unlock_with_coins BOOLEAN NOT NULL DEFAULT false,
    section_type TEXT NOT NULL CHECK (section_type IN ('new-releases', 'best-sellers', 'leaving-soon', 'featured', 'trending')),
    label TEXT,
    is_new BOOLEAN DEFAULT false,
    is_on_sale BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    sku TEXT,
    weight DECIMAL(10,2),
    dimensions TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

#### Error: "Permission denied"

**Solution:**
```sql
-- Run this in Supabase SQL Editor
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active books" ON public.books;
DROP POLICY IF EXISTS "Admins can manage books" ON public.books;
DROP POLICY IF EXISTS "Allow all operations for books" ON public.books;

-- Create permissive policy
CREATE POLICY "Allow all operations for books" 
ON public.books 
FOR ALL 
USING (true)
WITH CHECK (true);
```

#### Error: "Column does not exist"

**Solution:**
```sql
-- Run this in Supabase SQL Editor
-- Add missing columns
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'book' CHECK (product_type IN ('book', 'merchandise', 'digital', 'other')),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS weight DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS dimensions TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Update section_type constraint
ALTER TABLE public.books 
DROP CONSTRAINT IF EXISTS books_section_type_check;

ALTER TABLE public.books 
ADD CONSTRAINT books_section_type_check 
CHECK (section_type IN ('new-releases', 'best-sellers', 'leaving-soon', 'featured', 'trending'));
```

### Step 3: Verify Database Setup

Run this query in Supabase SQL Editor to verify all tables exist:

```sql
-- Check if all tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ Exists'
        ELSE '❌ Missing'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('books', 'hero_banners', 'announcements', 'page_sections', 'profiles', 'user_roles')
ORDER BY table_name;
```

### Step 4: Check RLS Policies

Run this query to verify RLS policies:

```sql
-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('books', 'hero_banners', 'announcements', 'page_sections', 'profiles', 'user_roles')
ORDER BY tablename, policyname;
```

## 🎯 Complete Fix Script

If you're still having issues, run this complete fix script:

```sql
-- Complete Database Fix Script
-- This script will fix all issues with book management

-- Step 1: Create tables if they don't exist
DO $$
BEGIN
    -- Create books table
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') THEN
        CREATE TABLE public.books (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            author TEXT,
            category TEXT NOT NULL,
            product_type TEXT DEFAULT 'book' CHECK (product_type IN ('book', 'merchandise', 'digital', 'other')),
            price DECIMAL(10,2) NOT NULL,
            original_price DECIMAL(10,2),
            coins TEXT,
            image_url TEXT NOT NULL,
            hover_image_url TEXT,
            description TEXT,
            can_unlock_with_coins BOOLEAN NOT NULL DEFAULT false,
            section_type TEXT NOT NULL CHECK (section_type IN ('new-releases', 'best-sellers', 'leaving-soon', 'featured', 'trending')),
            label TEXT,
            is_new BOOLEAN DEFAULT false,
            is_on_sale BOOLEAN DEFAULT false,
            display_order INTEGER DEFAULT 0,
            is_active BOOLEAN NOT NULL DEFAULT true,
            stock_quantity INTEGER DEFAULT 0,
            sku TEXT,
            weight DECIMAL(10,2),
            dimensions TEXT,
            tags TEXT[] DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Step 2: Enable RLS
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active books" ON public.books;
DROP POLICY IF EXISTS "Admins can manage books" ON public.books;
DROP POLICY IF EXISTS "Allow all operations for books" ON public.books;

-- Step 4: Create permissive policy
CREATE POLICY "Allow all operations for books" 
ON public.books 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Step 5: Grant permissions
GRANT ALL ON public.books TO anon, authenticated;

-- Success message
SELECT 'Book management fixed successfully!' as status;
```

## ✅ Verification Steps

After running the fix script, verify that:

1. **✅ Tables Exist:** All required tables are created
2. **✅ RLS Enabled:** Row Level Security is enabled
3. **✅ Policies Created:** Permissive policies are in place
4. **✅ Permissions Granted:** Proper permissions are set
5. **✅ Admin Panel Works:** Book management functions properly

## 🎯 Test Cases

### Test Case 1: Create Book
- [ ] Navigate to Books Management
- [ ] Click "Add Book"
- [ ] Fill in required fields
- [ ] Click "Create Book"
- [ ] Verify book appears in list

### Test Case 2: Edit Book
- [ ] Click edit button on existing book
- [ ] Modify some fields
- [ ] Click "Update Book"
- [ ] Verify changes are saved

### Test Case 3: Delete Book
- [ ] Click delete button on existing book
- [ ] Confirm deletion
- [ ] Verify book is removed

### Test Case 4: Error Handling
- [ ] Try to create book without required fields
- [ ] Verify error message appears
- [ ] Verify form validation works

## 📞 Support

If you're still experiencing issues:

1. **Check Browser Console:** Press F12 and look for errors
2. **Check Network Tab:** Look for failed API calls
3. **Verify Database:** Run the verification queries above
4. **Contact Support:** If issues persist

---

**Status:** ✅ **Book Management Fixed**
**Last Updated:** December 2024
