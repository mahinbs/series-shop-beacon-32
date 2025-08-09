# 🚀 User Authentication Setup Guide

This guide will help you set up user authentication, cart functionality, and checkout system for your Crossed Hearts application.

## 📋 Prerequisites

1. **Supabase Project**: Make sure you have a Supabase project set up
2. **Database Access**: Access to your Supabase SQL Editor
3. **Environment Variables**: Ensure your Supabase URL and keys are configured

## 🗄️ Database Setup

### Step 1: Run the Migration Script

1. Open your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `scripts/setup-user-auth.sql`
4. Click **Run** to execute the script

This will create:
- ✅ User authentication tables (`profiles`, `user_roles`)
- ✅ Cart management tables (`cart_items`)
- ✅ Order management tables (`orders`, `order_items`)
- ✅ User sessions table (`user_sessions`)
- ✅ Row Level Security (RLS) policies
- ✅ Performance indexes
- ✅ Helper functions

### Step 2: Verify Tables Created

After running the script, you should see these tables in your Supabase dashboard:

```
✅ public.profiles
✅ public.user_roles  
✅ public.cart_items
✅ public.orders
✅ public.order_items
✅ public.user_sessions
```

## 🔐 Authentication Features

### User Registration
- Users can create accounts with email and password
- Automatic profile creation
- Email verification (optional)
- Role assignment (user/admin)

### User Login
- Secure email/password authentication
- Session management
- Automatic cart sync
- Profile loading

### Cart Management
- **Authenticated Users**: Cart stored in database
- **Anonymous Users**: Cart stored in localStorage
- Real-time cart updates
- Cart persistence across sessions

### Order Management
- Complete order history
- Order status tracking
- Payment status management
- Order details with items

## 🎯 Key Features Implemented

### 1. **User Authentication**
```typescript
// Sign up
await AuthService.signUp({
  email: 'user@example.com',
  password: 'password123',
  full_name: 'John Doe'
});

// Sign in
await AuthService.signIn({
  email: 'user@example.com',
  password: 'password123'
});
```

### 2. **Cart Management**
```typescript
// Add to cart
await AuthService.addToCart(userId, productId, quantity);

// Get cart items
const cartItems = await AuthService.getCartItems(userId);

// Update quantity
await AuthService.updateCartItemQuantity(userId, cartItemId, quantity);

// Remove from cart
await AuthService.removeFromCart(userId, cartItemId);
```

### 3. **Order Management**
```typescript
// Create order
const order = await AuthService.createOrder(userId, {
  subtotal: 99.99,
  tax: 8.00,
  shipping: 5.99,
  discount: 0,
  total: 113.98
});

// Get orders
const orders = await AuthService.getOrders(userId);
```

## 🔧 Frontend Integration

### 1. **Authentication Context**
The app now uses `SupabaseAuthProvider` for real authentication:

```typescript
// In App.tsx
<SupabaseAuthProvider>
  <CartProvider>
    {/* Your app components */}
  </CartProvider>
</SupabaseAuthProvider>
```

### 2. **Cart Context**
Enhanced cart context with backend integration:

```typescript
// Automatic cart sync for authenticated users
const { cartItems, addToCart, removeFromCart, isLoading } = useCart();
```

### 3. **Protected Routes**
Users can now:
- ✅ Sign up for new accounts
- ✅ Sign in with existing accounts
- ✅ Add items to cart (persisted)
- ✅ View cart with real-time updates
- ✅ Checkout with order creation
- ✅ View order history

## 🎨 User Experience

### Authentication Flow
1. **Sign Up**: Users can create new accounts
2. **Sign In**: Existing users can log in
3. **Cart Sync**: Cart automatically syncs with backend
4. **Order History**: Users can view past orders
5. **Profile Management**: Users can update their profiles

### Cart Experience
- **Add to Cart**: One-click add items to cart
- **Cart Persistence**: Cart survives browser sessions
- **Real-time Updates**: Cart updates immediately
- **Quantity Management**: Easy quantity adjustment
- **Remove Items**: Quick item removal

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Admins can view all data
- Secure cart and order access
- Protected user profiles

### Data Protection
- Password hashing (handled by Supabase)
- Secure session management
- Protected API endpoints
- User data isolation

## 🚀 Getting Started

### 1. **Run the Setup Script**
```bash
# Copy the contents of scripts/setup-user-auth.sql
# Run it in your Supabase SQL Editor
```

### 2. **Test User Registration**
1. Navigate to `/auth` in your app
2. Click "Sign Up" tab
3. Fill in the registration form
4. Verify account creation

### 3. **Test Cart Functionality**
1. Sign in to your account
2. Browse products
3. Click "Add to Cart"
4. View cart at `/cart`
5. Test quantity updates and removal

### 4. **Test Checkout**
1. Add items to cart
2. Navigate to checkout
3. Complete order process
4. View order confirmation

## 🐛 Troubleshooting

### Common Issues

1. **"Table doesn't exist" errors**
   - Make sure you ran the setup script completely
   - Check if all tables were created in Supabase dashboard

2. **Authentication errors**
   - Verify Supabase URL and keys in environment
   - Check if RLS policies are properly configured

3. **Cart not syncing**
   - Ensure user is authenticated
   - Check browser console for errors
   - Verify cart_items table exists

4. **Order creation fails**
   - Check if orders and order_items tables exist
   - Verify RLS policies for orders

### Debug Steps

1. **Check Database Tables**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('profiles', 'user_roles', 'cart_items', 'orders', 'order_items');
   ```

2. **Verify RLS Policies**
   ```sql
   SELECT schemaname, tablename, policyname 
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```

3. **Test Authentication**
   - Try creating a new user account
   - Test login with existing account
   - Check if profile is created automatically

## 📞 Support

If you encounter any issues:

1. **Check the console** for error messages
2. **Verify database setup** using the debug steps above
3. **Test with a fresh user account**
4. **Review RLS policies** in Supabase dashboard

## 🎉 Success!

Once you've completed these steps, your application will have:

- ✅ **Full user authentication** with Supabase
- ✅ **Persistent cart management** for logged-in users
- ✅ **Complete order system** with history
- ✅ **Secure data access** with RLS policies
- ✅ **Modern user experience** with real-time updates

Your users can now register, login, add items to cart, and complete purchases with full backend support!
