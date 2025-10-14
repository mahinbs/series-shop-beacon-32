
import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Loader2, Activity, BookOpen } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { AuthService } from '@/services/auth';
import { supabase } from '@/integrations/supabase/client';

const ProfileActivity = () => {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user || !isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch recent activities from various sources
        const activitiesList: any[] = [];

        // 1) Recent orders
        try {
          const orders = await AuthService.getOrders(user.id);
          const recentOrders = orders.slice(0, 3).map((order: any) => ({
            id: `order-${order.id}`,
            type: 'order',
            title: `Order #${order.order_number} placed`,
            date: order.created_at,
            icon: ShoppingBag,
            bgColor: 'bg-blue-500/20',
            iconColor: 'text-blue-400'
          }));
          activitiesList.push(...recentOrders);
        } catch (err) {
          console.error('Error fetching orders for activity:', err);
        }

        // 2) Recent wishlist additions
        try {
          const { data: wishlist, error: wishlistError } = await supabase
            .from('wishlist')
            .select('id, created_at, product:books(id, title)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(3);
          if (!wishlistError && wishlist) {
            const mapped = wishlist.map((w: any) => ({
              id: `wish-${w.id}`,
              type: 'wishlist',
              title: `Added to wishlist: ${w.product?.title ?? 'Item'}`,
              date: w.created_at,
              icon: Heart,
              bgColor: 'bg-pink-500/20',
              iconColor: 'text-pink-400'
            }));
            activitiesList.push(...mapped);
          }
        } catch (err) {
          console.error('Error fetching wishlist for activity:', err);
        }

        // 3) Recent cart activity
        try {
          const { data: cartItems, error: cartError } = await supabase
            .from('cart_items')
            .select('id, created_at, product:books(id, title)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(3);
          if (!cartError && cartItems) {
            const mapped = cartItems.map((c: any) => ({
              id: `cart-${c.id}`,
              type: 'cart',
              title: `Added to cart: ${c.product?.title ?? 'Item'}`,
              date: c.created_at,
              icon: BookOpen,
              bgColor: 'bg-amber-500/20',
              iconColor: 'text-amber-400'
            }));
            activitiesList.push(...mapped);
          }
        } catch (err) {
          console.error('Error fetching cart items for activity:', err);
        }

        // Do not inject any static placeholder items. Only show real data when available.

        // Sort by date (most recent first) and take only 3
        const sortedActivities = activitiesList
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        setActivities(sortedActivities);
        setError(null);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities. Please try again later.');
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user, isAuthenticated]);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <p className="text-blue-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Please sign in to view your activity.</p>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No recent activity.</p>
          <p className="text-gray-500 text-sm mt-2">Start shopping to see your activity here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
        {/* View All Activity hidden as requested */}
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const IconComponent = activity.icon;
          return (
            <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors">
              <div className={`${activity.bgColor} ${activity.iconColor} p-2 rounded-full flex-shrink-0`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{activity.title}</p>
                <p className="text-gray-400 text-sm">{activity.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileActivity;
