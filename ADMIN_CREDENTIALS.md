# 🔐 Admin Credentials

## Admin Account Setup

Your admin panel uses **Supabase authentication** with the following setup:

### 📧 Admin Login Details

```
Email:    admin@series-shop.com
Password: Admin@2024!
```

### 🎯 How to Access Admin Panel

1. **First Time Setup**: 
   - Go to `/auth` page and **Sign Up** with the admin credentials above
   - The system will automatically assign admin privileges to this email
   
2. **Subsequent Logins**: 
   - Go to `/auth` page and **Sign In** with the admin credentials
   - You'll be redirected to `/admin` dashboard automatically

3. **Direct Admin Access**: After initial setup, go to `/admin` (redirects to auth if not logged in)

### 🔒 Security Features

- ✅ **Supabase Authentication**: Real authentication with secure token management
- ✅ **Auto Admin Role**: admin@series-shop.com automatically gets admin privileges
- ✅ **Secure Password**: Strong password with special characters
- ✅ **Database Triggers**: Automatic profile and role creation on signup

### 🎨 Admin Features

Once logged in as admin, you can:

- 🏠 **Dashboard Overview** - Welcome screen with quick actions
- 🎨 **Hero Banners Management** - Create up to 3 rotating banners
- 📦 **Products Management** - Full CRUD for books, merchandise, digital items
- 📚 **Books Management** - Legacy book management system
- 📄 **Page Sections** - CMS content management
- 📢 **Announcements** - News and updates management

### 🔄 Regular Users

Regular users can still:
- Register with any other email/password combination
- Access regular user features
- Cannot access admin panel

### 🚨 Important Notes

- **Keep these credentials secure** - Don't share them publicly
- **First signup required** - Must sign up first before signing in
- **Supabase authentication** - Uses real database authentication
- **Session persistence** - Login persists until you sign out

### 🆘 Troubleshooting

If you can't login:
1. **First time**: Use **Sign Up** tab with admin credentials
2. **Return visits**: Use **Sign In** tab with admin credentials  
3. Make sure you're using the exact credentials above
4. Check that the email and password are copied correctly
5. Clear browser storage if needed

---

**Status**: ✅ **Admin Account Database Setup Complete**
**Last Updated**: August 13, 2025
