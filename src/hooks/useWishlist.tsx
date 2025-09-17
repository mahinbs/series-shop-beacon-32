import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export interface WishlistItem {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  product_type: 'book' | 'merchandise';
  inStock: boolean;
  volume?: number;
  addedDate: string;
  product_id: string;
}

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, isAuthenticated } = useSupabaseAuth();

  // Load wishlist from database and localStorage
  useEffect(() => {
    const loadWishlist = async () => {
      if (!isAuthenticated || !user) {
        // Load from localStorage for non-authenticated users and validate items
        try {
          const stored = localStorage.getItem('wishlist');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              // Validate each item exists in database
              const validatedItems: WishlistItem[] = [];
              for (const item of parsed) {
                if (item.product_id) {
                  try {
                    const { data: productData } = await supabase
                      .from('books')
                      .select('*')
                      .eq('id', item.product_id)
                      .single();
                    
                    if (productData) {
                      validatedItems.push({
                        ...item,
                        title: productData.title,
                        author: productData.author || 'Unknown Author',
                        price: Number(productData.price),
                        originalPrice: productData.original_price ? Number(productData.original_price) : undefined,
                        imageUrl: productData.image_url,
                        category: productData.category,
                        product_type: (productData.product_type as 'book' | 'merchandise') || 'book',
                        inStock: productData.stock_quantity > 0,
                        volume: productData.volume_number,
                      });
                    }
                  } catch (error) {
                    console.log('Item not found in database, removing from wishlist:', item.product_id);
                  }
                }
              }
              setWishlist(validatedItems);
            } else {
              setWishlist([]);
            }
          }
        } catch (error) {
          console.error('Error loading wishlist from localStorage:', error);
          setWishlist([]);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      try {
        // Fetch wishlist from database
        const { data: wishlistData, error } = await supabase
          .from('wishlist')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        // Fetch product details for each wishlist item
        const wishlistItems: WishlistItem[] = [];
        for (const item of wishlistData || []) {
          const { data: productData, error: productError } = await supabase
            .from('books')
            .select('*')
            .eq('id', item.product_id)
            .single();

          if (!productError && productData) {
            wishlistItems.push({
              id: item.id,
              product_id: item.product_id,
              title: productData.title,
              author: productData.author || 'Unknown Author',
              price: Number(productData.price),
              originalPrice: productData.original_price ? Number(productData.original_price) : undefined,
              imageUrl: productData.image_url,
              category: productData.category,
              product_type: (productData.product_type as 'book' | 'merchandise') || 'book',
              inStock: productData.stock_quantity > 0,
              volume: productData.volume_number,
              addedDate: item.added_at
            });
          }
        }

        setWishlist(wishlistItems);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        // Fallback to localStorage
        try {
          const stored = localStorage.getItem('wishlist');
          if (stored) {
            const parsed = JSON.parse(stored);
            setWishlist(Array.isArray(parsed) ? parsed : []);
          }
        } catch (localError) {
          console.error('Error loading from localStorage:', localError);
          setWishlist([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [user, isAuthenticated]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoading]);

  const addToWishlist = async (item: Omit<WishlistItem, 'addedDate' | 'id'>) => {
    // Check if item already exists
    const exists = wishlist.find(existing => existing.product_id === item.product_id);
    if (exists) {
      toast({
        title: "Already in Wishlist",
        description: "This item is already in your wishlist.",
        duration: 3000,
      });
      return;
    }

    if (isAuthenticated && user) {
      try {
        // Add to database
        const { data, error } = await supabase
          .from('wishlist')
          .insert({
            user_id: user.id,
            product_id: item.product_id,
            product_type: item.product_type
          })
          .select()
          .single();

        if (error) throw error;

        const wishlistItem: WishlistItem = {
          id: data.id,
          ...item,
          addedDate: data.added_at
        };

        setWishlist(prev => [...prev, wishlistItem]);
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        toast({
          title: "Error",
          description: "Failed to add item to wishlist. Please try again.",
          duration: 3000,
          variant: "destructive"
        });
        return;
      }
    } else {
      // Add to localStorage for non-authenticated users
      const wishlistItem: WishlistItem = {
        id: crypto.randomUUID(),
        ...item,
        addedDate: new Date().toISOString()
      };
      setWishlist(prev => [...prev, wishlistItem]);
    }

    toast({
      title: "Added to Wishlist!",
      description: `${item.title} has been added to your wishlist.`,
      duration: 3000,
    });
  };

  const removeFromWishlist = async (itemId: string) => {
    const item = wishlist.find(item => item.id === itemId);
    if (!item) return;

    if (isAuthenticated && user) {
      try {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('id', itemId)
          .eq('user_id', user.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        toast({
          title: "Error",
          description: "Failed to remove item from wishlist. Please try again.",
          duration: 3000,
          variant: "destructive"
        });
        return;
      }
    }

    setWishlist(prev => prev.filter(item => item.id !== itemId));
    
    toast({
      title: "Removed from Wishlist",
      description: `${item.title} has been removed from your wishlist.`,
      duration: 3000,
    });
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some(item => item.product_id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    toast({
      title: "Wishlist Cleared",
      description: "Your wishlist has been cleared.",
      duration: 3000,
    });
  };

  const getWishlistCount = (): number => {
    return wishlist.length;
  };

  return {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount
  };
};
