# 🔐 User Authentication & Cart Management Guide

## 🎯 Overview

This guide covers the complete user authentication system and persistent cart functionality for Crossed Hearts.

## ✨ Key Features

### 🔑 User Authentication
- **Email/Password Registration**: Secure user signup with validation
- **Email/Password Login**: Quick and secure authentication
- **Session Persistence**: Automatic login state management
- **Profile Management**: User profiles with personal information
- **Password Recovery**: Email-based password reset (optional)

### 🛒 Persistent Cart System
- **Anonymous Cart**: Cart items stored in localStorage for non-logged-in users
- **Authenticated Cart**: Cart items stored in database for logged-in users
- **Automatic Merge**: Anonymous cart items are merged when user logs in
- **Cross-Device Sync**: Cart persists across devices and browsers
- **Real-time Updates**: Cart updates immediately across all components

### 🎨 User Experience
- **Seamless Transition**: Smooth cart migration when logging in
- **Visual Feedback**: Toast notifications for all cart actions
- **Cart Indicators**: Real-time cart count in header
- **Profile Display**: User name/email shown in header dropdown

## 🚀 Getting Started

### 1. User Registration

1. **Navigate to Auth Page**:
   - Go to `http://localhost:8082/auth`
   - Click "Sign Up" tab

2. **Fill in Registration Form**:
   - **Full Name**: Your display name
   - **Email**: Valid email address
   - **Password**: Strong password (min 6 characters)

3. **Complete Registration**:
   - Click "Sign Up" button
   - Check email for verification (if enabled)
   - Sign in with your credentials

### 2. User Login

1. **Access Login**:
   - Go to `http://localhost:8082/auth`
   - Click "Sign In" tab

2. **Enter Credentials**:
   - **Email**: Your registered email
   - **Password**: Your password

3. **Successful Login**:
   - Automatic redirect to dashboard
   - Cart items are merged if any exist in localStorage
   - Profile information is loaded

### 3. Cart Management

#### Adding Items
- **Browse Products**: Navigate to shop pages
- **Add to Cart**: Click "Add to Cart" on any product
- **Quantity Management**: Use +/- buttons to adjust quantities
- **Cart View**: Click cart icon in header to view cart

#### Cart Persistence
- **Anonymous Users**: Items stored in browser localStorage
- **Authenticated Users**: Items stored in database
- **Automatic Sync**: Cart merges when logging in
- **Cross-Device**: Cart syncs across all devices

#### Cart Actions
- **Update Quantity**: Change quantities in cart
- **Remove Items**: Remove items from cart
- **Clear Cart**: Remove all items at once
- **Continue Shopping**: Return to product pages

## 🔧 Technical Implementation

### Authentication Flow

```typescript
// 1. User signs up
await signUp(email, password, fullName);

// 2. User signs in
await signIn(email, password);

// 3. Session management
const { user, isAuthenticated } = useSupabaseAuth();

// 4. Profile management
const { profile, updateProfile } = useSupabaseAuth();
```

### Cart Flow

```typescript
// 1. Add to cart (anonymous)
addToCart(product); // Stores in localStorage

// 2. Login triggers merge
// Anonymous cart → Database cart

// 3. Add to cart (authenticated)
addToCart(product); // Stores in database

// 4. Cart persistence
const { cartItems, getCartTotal } = useCart();
```

### Database Schema

#### Users & Profiles
```sql
-- Users table (Supabase Auth)
auth.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Profiles table
profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'United States',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- User roles
user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  role app_role DEFAULT 'user',
  created_at TIMESTAMP
)
```

#### Cart System
```sql
-- Cart items
cart_items (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES books(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id, product_id)
)

-- Orders
orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  order_number TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  subtotal DECIMAL(10,2),
  tax DECIMAL(10,2),
  shipping DECIMAL(10,2),
  discount DECIMAL(10,2),
  total DECIMAL(10,2),
  shipping_address JSONB,
  billing_address JSONB,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Order items
order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES books(id),
  product_title TEXT,
  product_author TEXT,
  product_image_url TEXT,
  quantity INTEGER,
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  created_at TIMESTAMP
)
```

## 🎨 UI Components

### Header Components
- **Cart Icon**: Shows cart item count badge
- **User Dropdown**: Profile menu with user info
- **Sign In Button**: Prominent login button
- **Mobile Menu**: Responsive navigation

### Cart Components
- **Cart Page**: Full cart management interface
- **Cart Items**: Individual item cards
- **Quantity Controls**: +/- buttons for quantities
- **Cart Summary**: Totals and checkout options

### Auth Components
- **Login Form**: Email/password authentication
- **Registration Form**: New user signup
- **Profile Management**: User profile editing
- **Password Reset**: Email-based reset

## 🔒 Security Features

### Authentication Security
- **Password Hashing**: Secure password storage
- **Session Management**: JWT-based sessions
- **CSRF Protection**: Built-in CSRF protection
- **Rate Limiting**: API rate limiting
- **Input Validation**: Server-side validation

### Cart Security
- **User Isolation**: Users can only see their own cart
- **Data Validation**: Cart data validation
- **SQL Injection**: Parameterized queries
- **XSS Protection**: Input sanitization

## 📊 Analytics & Tracking

### User Analytics
- **Login Events**: Track user login patterns
- **Registration**: Monitor signup conversions
- **Cart Abandonment**: Track cart abandonment rates
- **Purchase Funnel**: Monitor purchase completion

### Cart Analytics
- **Add to Cart**: Track product additions
- **Cart Views**: Monitor cart page visits
- **Checkout Flow**: Track checkout completion
- **Product Performance**: Monitor popular products

## 🆘 Troubleshooting

### Common Issues

#### Authentication Issues
1. **Can't Sign In**:
   - Check email/password combination
   - Verify email is confirmed (if required)
   - Clear browser cache and try again

2. **Session Expired**:
   - Automatic redirect to login
   - Session refresh on page load
   - Clear localStorage if needed

#### Cart Issues
1. **Cart Not Saving**:
   - Check browser localStorage support
   - Verify database connection
   - Clear browser cache

2. **Cart Not Syncing**:
   - Ensure user is logged in
   - Check network connection
   - Refresh page and try again

3. **Cart Items Missing**:
   - Check if items were removed
   - Verify cart merge completed
   - Check database for items

### Error Codes
- `401`: Unauthorized (user not logged in)
- `403`: Forbidden (insufficient permissions)
- `404`: Not found (resource doesn't exist)
- `500`: Server error (database/backend issue)

## 🎯 Best Practices

### User Experience
1. **Seamless Login**: Minimal friction in authentication
2. **Cart Persistence**: Items never lost
3. **Visual Feedback**: Clear success/error messages
4. **Mobile Friendly**: Responsive design

### Security
1. **Strong Passwords**: Enforce password requirements
2. **Session Management**: Secure session handling
3. **Data Validation**: Validate all inputs
4. **Error Handling**: Don't expose sensitive data

### Performance
1. **Lazy Loading**: Load data as needed
2. **Caching**: Cache frequently accessed data
3. **Optimization**: Optimize database queries
4. **Monitoring**: Track performance metrics

## 📞 Support

For technical support:
1. Check browser console for errors
2. Verify database connection
3. Test with different browsers
4. Contact development team

---

**Status**: ✅ **Fully Functional**
**Last Updated**: December 2024
