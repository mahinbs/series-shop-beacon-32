
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Diamond, ShoppingCart, Loader2, Heart } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

const ProfileWishlist = () => {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user || !isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Note: You'll need to create a wishlist table in your database
        // For now, this shows an empty state
        setWishlistItems([]);
        setError(null);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load wishlist. Please try again later.');
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, isAuthenticated]);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Diamond className="w-5 h-5 text-red-400" />
            Wishlist
          </h3>
        </div>
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-red-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Diamond className="w-5 h-5 text-red-400" />
            Wishlist
          </h3>
        </div>
        <div className="text-center py-8">
          <Heart className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Diamond className="w-5 h-5 text-red-400" />
            Wishlist
          </h3>
        </div>
        <div className="text-center py-8">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Please sign in to view your wishlist.</p>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Diamond className="w-5 h-5 text-red-400" />
            Wishlist
          </h3>
        </div>
        <div className="text-center py-8">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Your wishlist is empty.</p>
          <p className="text-gray-500 text-sm mt-2">Start adding items to your wishlist!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Diamond className="w-5 h-5 text-red-400" />
          Wishlist
        </h3>
        <button className="text-red-400 hover:text-red-300 text-sm font-medium">
          View All Wishlist Items
        </button>
      </div>
      
      <div className="space-y-4">
        {wishlistItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-12 h-16 object-cover rounded-md"
            />
            <div className="flex-1">
              <h4 className="text-white font-medium text-sm">{item.title}</h4>
              <p className="text-red-400 font-semibold text-sm">{item.price}</p>
            </div>
            <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 p-2">
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileWishlist;
