# 🗄️ Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for image uploads in your Products Management system.

## 📋 Prerequisites

1. **Supabase Project**: Make sure you have a Supabase project set up
2. **Admin Access**: Access to your Supabase Dashboard
3. **Storage Enabled**: Storage feature must be enabled in your Supabase project

## 🚀 Step-by-Step Setup

### Step 1: Enable Storage in Supabase

1. **Open Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Navigate to your project: `fgsqmtielwzqzzxowzhr`

2. **Enable Storage**
   - In the left sidebar, click **"Storage"**
   - If not enabled, click **"Enable Storage"**
   - Wait for the setup to complete

### Step 2: Create Storage Bucket

1. **Create New Bucket**
   - Click **"New bucket"**
   - **Bucket name**: `product-images`
   - **Public bucket**: ✅ **Check this box** (important for public access)
   - Click **"Create bucket"**

2. **Configure Bucket Settings**
   - **File size limit**: 5MB (or your preference)
   - **Allowed MIME types**: 
     ```
     image/jpeg,image/jpg,image/png,image/webp,image/gif
     ```

### Step 3: Set Up Storage Policies

1. **Go to Storage Policies**
   - In Storage section, click on your `product-images` bucket
   - Click **"Policies"** tab

2. **Create Upload Policy**
   ```sql
   -- Allow authenticated users to upload files
   CREATE POLICY "Allow authenticated uploads" ON storage.objects
   FOR INSERT WITH CHECK (
     bucket_id = 'product-images' AND
     auth.role() = 'authenticated'
   );
   ```

3. **Create Public Access Policy**
   ```sql
   -- Allow public access to read files
   CREATE POLICY "Allow public access" ON storage.objects
   FOR SELECT USING (bucket_id = 'product-images');
   ```

4. **Create Delete Policy**
   ```sql
   -- Allow authenticated users to delete their files
   CREATE POLICY "Allow authenticated deletes" ON storage.objects
   FOR DELETE USING (
     bucket_id = 'product-images' AND
     auth.role() = 'authenticated'
   );
   ```

### Step 4: Test Storage Setup

1. **Open Browser Console**
   - Go to your admin panel: `http://localhost:8080/admin`
   - Open Developer Tools (F12)
   - Go to Console tab

2. **Run Storage Test**
   ```javascript
   // Import and test storage
   import('/src/utils/storageTest.js').then(module => {
     module.testStorageUpload().then(result => {
       console.log('Storage test result:', result);
     });
   });
   ```

3. **Expected Result**
   ```
   ✅ Storage test successful!
   📁 File uploaded to: test/1234567890-abc123.txt
   🔗 Public URL: https://fgsqmtielwzqzzxowzhr.supabase.co/storage/v1/object/public/product-images/test/1234567890-abc123.txt
   🧹 Test file cleaned up
   ```

## 🔧 Troubleshooting

### Common Issues

1. **"Bucket not found" Error**
   - **Solution**: Make sure the bucket `product-images` exists
   - **Fix**: Create the bucket in Supabase Dashboard

2. **"Permission denied" Error**
   - **Solution**: Check storage policies
   - **Fix**: Run the policy SQL commands above

3. **"File too large" Error**
   - **Solution**: Check file size limits
   - **Fix**: Increase bucket file size limit or compress images

4. **"Invalid file type" Error**
   - **Solution**: Check MIME type restrictions
   - **Fix**: Update allowed MIME types in bucket settings

5. **Images not displaying**
   - **Solution**: Check if bucket is public
   - **Fix**: Enable "Public bucket" in bucket settings

### Storage Configuration

Your storage service is configured with:
- **Bucket name**: `product-images`
- **Max file size**: 5MB
- **Allowed types**: JPEG, JPG, PNG, WebP, GIF
- **Folder structure**: `products/{product_type}/{filename}`

## 🎯 Features Available

Once storage is set up, you'll have:

### ✅ **Image Upload**
- Drag & drop file upload
- Real-time preview
- Progress indicators
- Error handling

### ✅ **File Management**
- Automatic file organization
- Unique filename generation
- File cleanup on delete
- Public URL generation

### ✅ **Storage Optimization**
- File size validation
- MIME type checking
- Memory cleanup
- Error recovery

## 🚀 Next Steps

1. **Test Upload**: Try uploading an image in Products Management
2. **Verify Storage**: Check your Supabase Storage dashboard
3. **Test Public Access**: Verify images load in the frontend
4. **Monitor Usage**: Check storage usage in Supabase

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify Supabase project status
3. Ensure all policies are correctly set
4. Test with the storage test function

Your Products Management system is now ready for real image uploads! 🎉
