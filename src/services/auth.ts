import { supabase } from '@/integrations/supabase/client';
import { UserService } from './userService';

interface User {
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  id?: string;
  created_at?: string;
  updated_at?: string;
}

interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at?: string;
  updated_at?: string;
}

interface Order {
  id: string;
  user_id: string;
  order_number: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  created_at?: string;
  status?: string | null;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_title: string;
  product_author: string | null;
  product_image_url: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name: string;
}

export interface CartItemWithProduct extends CartItem {
  product: {
    id: string;
    title: string;
    author: string | null;
    price: number;
    image_url: string;
    product_type: 'book' | 'merchandise' | 'digital' | 'other';
  };
}

export class AuthService {
  // User authentication methods
  static async signUp(credentials: RegisterCredentials): Promise<AuthUser> {
    try {
      console.log('🌐 Public user signup:', credentials.email);
      
      // Use UserService to handle the signup process
      const newUser = await UserService.handlePublicSignup(credentials);
      
      // Convert to AuthUser format
      const authUser: AuthUser = {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        avatar_url: newUser.avatar_url,
        role: newUser.role,
      };
      
      console.log('✅ Public signup completed:', authUser);
      return authUser;
    } catch (error) {
      console.error('❌ Error in public signup:', error);
      throw error;
    }
  }

  static async signIn(credentials: LoginCredentials): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;

    if (!data.user) throw new Error('Invalid credentials');

    // Get user profile and role
    const [profileResult, roleResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single(),
      supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single(),
    ]);

    if (profileResult.error) throw profileResult.error;
    if (roleResult.error) throw roleResult.error;

    return {
      id: data.user.id,
      email: profileResult.data.email || data.user.email || '',
      full_name: profileResult.data.full_name,
      avatar_url: profileResult.data.avatar_url,
      role: roleResult.data.role,
    };
  }

  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Get user profile and role
    const [profileResult, roleResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single(),
    ]);

    if (profileResult.error || roleResult.error) return null;

    return {
      id: user.id,
      email: profileResult.data.email || user.email || '',
      full_name: profileResult.data.full_name,
      avatar_url: profileResult.data.avatar_url,
      role: roleResult.data.role,
    };
  }

  // Cart methods
  static async getCartItems(userId: string): Promise<CartItemWithProduct[]> {
    const { data, error } = await (supabase as any)
      .from('cart_items')
      .select(`
        *,
        product:books(
          id,
          title,
          author,
          price,
          image_url,
          product_type
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  static async addToCart(userId: string, productId: string, quantity: number = 1): Promise<void> {
    // Check if item already exists in cart
    const { data: existingItem } = await (supabase as any)
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update quantity
      const { error } = await (supabase as any)
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);

      if (error) throw error;
    } else {
      // Add new item
      const { error } = await (supabase as any)
        .from('cart_items')
        .insert([
          {
            user_id: userId,
            product_id: productId,
            quantity,
          },
        ]);

      if (error) throw error;
    }
  }

  static async updateCartItemQuantity(userId: string, cartItemId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await this.removeFromCart(userId, cartItemId);
      return;
    }

    const { error } = await (supabase as any)
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  static async removeFromCart(userId: string, cartItemId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  static async clearCart(userId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Order methods
  static async createOrder(userId: string, orderData: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    shipping_address?: any;
    billing_address?: any;
    payment_method?: string;
    notes?: string;
  }): Promise<Order> {
    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;
    
    const { data: order, error: orderError } = await (supabase as any)
      .from('orders')
      .insert([
        {
          user_id: userId,
          order_number: orderNumber,
          ...orderData,
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;
    return order;
  }

  static async addOrderItems(orderId: string, items: Array<{
    product_id: string;
    product_title: string;
    product_author: string | null;
    product_image_url: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>): Promise<void> {
    const { error } = await (supabase as any)
      .from('order_items')
      .insert(
        items.map(item => ({
          order_id: orderId,
          ...item,
        }))
      );

    if (error) throw error;
  }

  static async getOrders(userId: string): Promise<Order[]> {
    const { data, error } = await (supabase as any)
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getOrderDetails(orderId: string, userId: string): Promise<{
    order: Order;
    items: OrderItem[];
  }> {
    const [orderResult, itemsResult] = await Promise.all([
      (supabase as any)
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', userId)
        .single(),
      (supabase as any)
        .from('order_items')
        .select('*')
        .eq('order_id', orderId),
    ]);

    if (orderResult.error) throw orderResult.error;
    if (itemsResult.error) throw itemsResult.error;

    return {
      order: orderResult.data,
      items: itemsResult.data || [],
    };
  }

  // Profile methods
  static async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  }
}
