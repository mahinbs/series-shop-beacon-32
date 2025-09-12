# Database Setup Guide

## 🚨 Issue: Missing Database Tables

The error you're seeing is because the `comic_series` table doesn't exist in your Supabase database. This is why you're getting 404 errors when trying to create or fetch series.

## ✅ Solution: Create Database Tables

I've created a SQL script that will set up all the necessary tables for the comic series system.

### **Step 1: Access Supabase Dashboard**

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: `fgsqmtielwzqzzxowzhr`

### **Step 2: Open SQL Editor**

1. In your Supabase dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"** to create a new SQL script

### **Step 3: Run the SQL Script**

1. Copy the entire contents of the file `create-comic-series-tables.sql`
2. Paste it into the SQL Editor
3. Click **"Run"** to execute the script

### **Step 4: Verify Tables Created**

After running the script, you should see:
- ✅ `creators` table created
- ✅ `comic_series` table created
- ✅ `series_creators` table created
- ✅ `comic_episodes` table created
- ✅ `comic_pages` table created
- ✅ `comic_files` table created
- ✅ Sample data inserted
- ✅ RLS policies created

## 🎯 What This Script Does:

### **Creates Tables:**
- **creators**: For managing comic creators/authors
- **comic_series**: For managing comic series
- **series_creators**: Links creators to series
- **comic_episodes**: For managing individual episodes
- **comic_pages**: For managing episode pages
- **comic_files**: For managing episode files

### **Sets Up Security:**
- **Row Level Security (RLS)** enabled
- **Public read access** for published content
- **Admin access** for authenticated users

### **Adds Sample Data:**
- 3 sample creators
- 3 sample series (including "Shadow Hunter Chronicles")
- Sample episodes and creator assignments

## 🚀 After Running the Script:

### **Test the Admin Panel:**
1. Go to: http://localhost:8080/admin
2. Click "All Series"
3. You should now see the sample series
4. Try creating a new series - it should work!

### **Test the Website:**
1. Go to: http://localhost:8080
2. Check "Featured Series" section
3. Check "All Series" section
4. You should see the sample series

## 🔧 If You Get Errors:

### **Permission Errors:**
- Make sure you're logged in as the project owner
- Check that your Supabase project is active

### **Table Already Exists:**
- The script uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times
- If tables exist, they won't be recreated

### **RLS Policy Errors:**
- The script creates policies that should work with your current setup
- If you get policy errors, you can run the script again

## 📊 Expected Result:

After running this script:
- ✅ No more 404 errors
- ✅ Admin panel shows series
- ✅ Website displays series
- ✅ You can create/edit series
- ✅ All functionality works

## 🎉 Success!

Once you run this SQL script, your comic series management system will be fully functional with a proper database backend!
