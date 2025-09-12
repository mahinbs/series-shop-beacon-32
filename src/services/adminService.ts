import { supabase } from '@/integrations/supabase/client';
import { UserService, type User as UserServiceUser, type UserStats as UserServiceStats } from './userService';

// Helper function to check if user is using local storage auth
const isLocalAuth = (userId?: string) => {
  return userId && userId.startsWith('local-');
};

// Helper function to check if we should use local storage (global check)
const shouldUseLocalStorage = () => {
  try {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      const user = JSON.parse(localUser);
      return isLocalAuth(user.id);
    }
  } catch (error) {
    console.error('Error checking local storage:', error);
  }
  return false;
};

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  created_at: string;
  last_login?: string;
  is_active: boolean;
  avatar_url?: string;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  user_id: string;
  user_email: string;
  user_name: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  total_amount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  items: AdminOrderItem[];
  shipping_address: any;
  billing_address: any;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminOrderItem {
  id: string;
  product_id: string;
  product_title: string;
  product_author?: string;
  product_image_url?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface AdminStats {
  total_users: number;
  active_users: number;
  admin_users: number;
  new_users_today: number;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_revenue: number;
  average_order_value: number;
  orders_today: number;
  // Coins analytics
  total_users_with_coins: number;
  total_coins_in_circulation: number;
  total_revenue_from_coins: number;
  average_coins_per_user: number;
  coins_transactions_today: number;
}

export class AdminService {
  // User Management - Delegate to UserService
  static async getUsers(): Promise<AdminUser[]> {
    try {
      const users = await UserService.getUsers();
      // Convert UserServiceUser to AdminUser format
      return users.map((user: UserServiceUser) => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_at: user.created_at,
        last_login: user.last_login,
        is_active: user.is_active,
        avatar_url: user.avatar_url
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  static async updateUserRole(userId: string, role: 'admin' | 'user'): Promise<void> {
    try {
      await UserService.updateUserRole(userId, role);
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  // Order Management
  static async getOrders(): Promise<AdminOrder[]> {
    try {
      // Check if we should use local storage first
      if (shouldUseLocalStorage()) {
        const localUser = localStorage.getItem('user');
        if (localUser) {
          const user = JSON.parse(localUser);
          // Return mock data for local auth
          return [{
            id: 'order-1',
            order_number: 'ORD-2024-001',
            user_id: user.id,
            user_email: user.email,
            user_name: user.full_name || 'Admin User',
            status: 'delivered',
            payment_status: 'paid',
            total_amount: 45.98,
            subtotal: 39.99,
            tax: 3.20,
            shipping: 2.79,
            discount: 0,
            items: [{
              id: 'item-1',
              product_id: 'book-1',
              product_title: 'Sample Book',
              product_author: 'Sample Author',
              product_image_url: 'https://picsum.photos/100/150',
              quantity: 1,
              unit_price: 39.99,
              total_price: 39.99
            }],
            shipping_address: { name: user.full_name, street: '123 Main St', city: 'Sample City', state: 'SC', zip: '12345', country: 'USA' },
            billing_address: { name: user.full_name, street: '123 Main St', city: 'Sample City', state: 'SC', zip: '12345', country: 'USA' },
            payment_method: 'Credit Card',
            notes: 'Sample order',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }];
        }
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!inner(email, full_name),
          order_items(
            *,
            books(title, author, image_url)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((order: any) => ({
        id: order.id,
        order_number: order.order_number,
        user_id: order.user_id,
        user_email: order.profiles?.email || 'Unknown',
        user_name: order.profiles?.full_name || 'Unknown User',
        status: order.status,
        payment_status: order.payment_status,
        total_amount: parseFloat(order.total || 0),
        subtotal: parseFloat(order.subtotal || 0),
        tax: parseFloat(order.tax || 0),
        shipping: parseFloat(order.shipping || 0),
        discount: parseFloat(order.discount || 0),
        items: (order.order_items || []).map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          product_title: item.product_title || item.books?.title || 'Unknown Product',
          product_author: item.product_author || item.books?.author,
          product_image_url: item.product_image_url || item.books?.image_url,
          quantity: item.quantity,
          unit_price: parseFloat(item.unit_price || 0),
          total_price: parseFloat(item.total_price || 0)
        })),
        shipping_address: order.shipping_address,
        billing_address: order.billing_address,
        payment_method: order.payment_method || 'Unknown',
        notes: order.notes,
        created_at: order.created_at,
        updated_at: order.updated_at
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Return mock data on error
      return [];
    }
  }

  static async updateOrderStatus(orderId: string, status: string): Promise<void> {
    try {
      if (isLocalAuth(orderId)) {
        // For local auth, just simulate success
        console.log(`Order ${orderId} status updated to ${status} (local auth)`);
        return;
      }

      const { error } = await supabase
        .from('orders')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Analytics - Delegate user stats to UserService
  static async getStats(): Promise<AdminStats> {
    try {
      // Get user stats from UserService
      const userStats = await UserService.getUserStats();
      
      // Get order stats (keep existing logic)
      let orderStats = {
        total_orders: 0,
        pending_orders: 0,
        completed_orders: 0,
        total_revenue: 0,
        average_order_value: 0,
        orders_today: 0
      };

      if (!shouldUseLocalStorage()) {
        try {
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('status, total, created_at');

          if (!orderError && orderData) {
            const today = new Date().toISOString().split('T')[0];
            const totalOrders = orderData.length;
            const pendingOrders = orderData.filter((o: any) => ['pending', 'processing'].includes(o.status)).length;
            const completedOrders = orderData.filter((o: any) => o.status === 'delivered').length;
            const totalRevenue = orderData.reduce((sum: number, order: any) => sum + parseFloat(order.total || 0), 0);
            const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
            const ordersToday = orderData.filter((o: any) => o.created_at.startsWith(today)).length;

            orderStats = {
              total_orders: totalOrders,
              pending_orders: pendingOrders,
              completed_orders: completedOrders,
              total_revenue: totalRevenue,
              average_order_value: averageOrderValue,
              orders_today: ordersToday
            };
          }
        } catch (orderError) {
          console.log('⚠️ Could not fetch order stats, using defaults');
        }
      } else {
        // Mock order stats for local storage
        orderStats = {
          total_orders: 1,
          pending_orders: 0,
          completed_orders: 1,
          total_revenue: 45.98,
          average_order_value: 45.98,
          orders_today: 1
        };
      }

      return {
        // User stats from UserService
        total_users: userStats.total_users,
        active_users: userStats.active_users,
        admin_users: userStats.admin_users,
        new_users_today: userStats.new_users_today,
        // Order stats
        ...orderStats,
        // Coins analytics - would need separate queries for real data
        total_users_with_coins: Math.floor(userStats.total_users * 0.8), // Mock: 80% of users have coins
        total_coins_in_circulation: Math.floor(orderStats.total_revenue * 100), // Mock: estimate based on revenue
        total_revenue_from_coins: orderStats.total_revenue * 0.3, // Mock: 30% of revenue from coins
        average_coins_per_user: Math.floor((orderStats.total_revenue * 100) / userStats.total_users) || 0,
        coins_transactions_today: Math.floor(orderStats.orders_today * 1.5) // Mock: more coin transactions than orders
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Return mock stats on error
      return {
        total_users: 1,
        active_users: 1,
        admin_users: 1,
        new_users_today: 1,
        total_orders: 1,
        pending_orders: 0,
        completed_orders: 1,
        total_revenue: 45.98,
        average_order_value: 45.98,
        orders_today: 1,
        // Coins analytics
        total_users_with_coins: 1,
        total_coins_in_circulation: 500,
        total_revenue_from_coins: 4.99,
        average_coins_per_user: 500,
        coins_transactions_today: 1
      };
    }
  }

  // Products Analytics
  static async getTopProducts(): Promise<Array<{
    id: string;
    title: string;
    sales: number;
    revenue: number;
    image_url?: string;
  }>> {
    try {
      // Check if we should use local storage first
      if (shouldUseLocalStorage()) {
        // Return mock data for local auth
        return [{
          id: 'book-1',
          title: 'Sample Book',
          sales: 1,
          revenue: 39.99,
          image_url: 'https://picsum.photos/60/80'
        }];
      }

      const { data, error } = await supabase
        .from('order_items')
        .select(`
          product_id,
          product_title,
          product_image_url,
          quantity,
          total_price,
          books(title, image_url)
        `);

      if (error) throw error;

      // Group by product and calculate totals
      const productMap = new Map();
      
      (data || []).forEach((item: any) => {
        const productId = item.product_id;
        const productTitle = item.product_title || item.books?.title || 'Unknown Product';
        const productImage = item.product_image_url || item.books?.image_url;
        
        if (!productMap.has(productId)) {
          productMap.set(productId, {
            id: productId,
            title: productTitle,
            sales: 0,
            revenue: 0,
            image_url: productImage
          });
        }
        
        const product = productMap.get(productId);
        product.sales += item.quantity;
        product.revenue += parseFloat(item.total_price || 0);
      });

      return Array.from(productMap.values())
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);
    } catch (error) {
      console.error('Error fetching top products:', error);
      // Return mock data on error
      return [{
        id: 'book-1',
        title: 'Sample Book',
        sales: 1,
        revenue: 39.99,
        image_url: 'https://picsum.photos/60/80'
      }];
    }
  }

  // Recent Orders for Analytics
  static async getRecentOrders(limit: number = 5): Promise<Array<{
    id: string;
    order_number: string;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
  }>> {
    try {
      // Check if we should use local storage first
      if (shouldUseLocalStorage()) {
        const localUser = localStorage.getItem('user');
        if (localUser) {
          const user = JSON.parse(localUser);
          // Return mock data for local auth
          return [{
            id: 'order-1',
            order_number: 'ORD-2024-001',
            customer_name: user.full_name || 'Admin User',
            total: 45.98,
            status: 'delivered',
            created_at: new Date().toISOString()
          }];
        }
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total,
          status,
          created_at,
          profiles!inner(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((order: any) => ({
        id: order.id,
        order_number: order.order_number,
        customer_name: order.profiles?.full_name || 'Unknown Customer',
        total: parseFloat(order.total || 0),
        status: order.status,
        created_at: order.created_at
      }));
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      // Return mock data on error
      return [{
        id: 'order-1',
        order_number: 'ORD-2024-001',
        customer_name: 'Admin User',
        total: 45.98,
        status: 'delivered',
        created_at: new Date().toISOString()
      }];
    }
  }
}
