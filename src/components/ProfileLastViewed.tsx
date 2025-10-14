
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Clock, Loader2, BookOpen } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

const ProfileLastViewed = () => {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [lastViewed, setLastViewed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLastViewed = async () => {
      if (!user || !isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Show last interacted items: prefer recently added to cart and wishlist, then recent orders
        const results: any[] = [];

        // 1) Recently added to cart
        const { data: cartItems } = await supabase
          .from('cart_items')
          .select('created_at, product:books(id, title, author, image_url)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(4);
        if (cartItems) {
          results.push(...cartItems.map((c: any) => ({
            id: `cart-${c.product?.id ?? ''}-${c.created_at}`,
            title: c.product?.title ?? 'Item',
            author: c.product?.author ?? '—',
            imageUrl: c.product?.image_url || '/placeholder.svg',
            viewedAt: new Date(c.created_at).toLocaleDateString(),
            progress: 0
          })));
        }

        // 2) Recently wishlisted
        const { data: wishlist } = await supabase
          .from('wishlist')
          .select('created_at, product:books(id, title, author, image_url)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(4);
        if (wishlist) {
          results.push(...wishlist.map((w: any) => ({
            id: `wish-${w.product?.id ?? ''}-${w.created_at}`,
            title: w.product?.title ?? 'Item',
            author: w.product?.author ?? '—',
            imageUrl: w.product?.image_url || '/placeholder.svg',
            viewedAt: new Date(w.created_at).toLocaleDateString(),
            progress: 0
          })));
        }

        // 3) Recent orders as fallback
        const { data: orders } = await supabase
          .from('orders')
          .select('id, order_number, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(2);
        if (orders) {
          results.push(...orders.map((o: any) => ({
            id: o.id,
            title: `Order #${o.order_number}`,
            author: 'Your Purchase',
            imageUrl: '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png',
            viewedAt: new Date(o.created_at).toLocaleDateString(),
            progress: 100
          })));
        }

        // Prefer the truly last opened product if present (stored by ProductDetails)
        try {
          const lastOpenedRaw = localStorage.getItem('last_viewed_product');
          if (lastOpenedRaw) {
            const lastOpened = JSON.parse(lastOpenedRaw);
            results.unshift({
              id: lastOpened.id,
              title: lastOpened.title,
              author: lastOpened.author,
              imageUrl: lastOpened.imageUrl,
              viewedAt: new Date(lastOpened.viewedAt).toLocaleDateString(),
              progress: 0
            });
          }
        } catch (_e) {}

        // Only keep one most recent item as "Last Viewed"
        const sorted = results
          .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
          .slice(0, 1);

        setLastViewed(sorted);
        setError(null);
      } catch (err) {
        console.error('Error fetching last viewed:', err);
        setError('Failed to load last viewed items. Please try again later.');
        setLastViewed([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLastViewed();
  }, [user, isAuthenticated]);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            Last Viewed
          </h3>
        </div>
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading last viewed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            Last Viewed
          </h3>
        </div>
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <p className="text-blue-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            Last Viewed
          </h3>
        </div>
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Please sign in to view your last viewed items.</p>
        </div>
      </div>
    );
  }

  if (lastViewed.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            Last Viewed
          </h3>
        </div>
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No recently viewed items.</p>
          <p className="text-gray-500 text-sm mt-2">Start browsing to see your last viewed items here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-400" />
          Last Viewed
        </h3>
        {/* View All hidden as requested */}
      </div>
      
      <div className="space-y-4">
        {lastViewed.map((item, index) => (
          <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-16 h-20 object-cover rounded-md"
            />
            <div className="flex-1">
              <h4 className="text-white font-medium">{item.title}</h4>
              <p className="text-gray-400 text-sm">{item.author}</p>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-gray-500 text-xs">{item.viewedAt}</span>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              Continue
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileLastViewed;
