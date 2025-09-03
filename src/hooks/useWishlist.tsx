import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
}

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const stored = localStorage.getItem('wishlist');
        if (stored) {
          const parsed = JSON.parse(stored);
          setWishlist(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
        setWishlist([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoading]);

  const addToWishlist = (item: Omit<WishlistItem, 'addedDate'>) => {
    const wishlistItem: WishlistItem = {
      ...item,
      addedDate: new Date().toISOString()
    };

    setWishlist(prev => {
      // Check if item already exists
      const exists = prev.find(existing => existing.id === item.id);
      if (exists) {
        toast({
          title: "Already in Wishlist",
          description: "This item is already in your wishlist.",
          duration: 3000,
        });
        return prev;
      }

      toast({
        title: "Added to Wishlist!",
        description: `${item.title} has been added to your wishlist.`,
        duration: 3000,
      });

      return [...prev, wishlistItem];
    });
  };

  const removeFromWishlist = (itemId: string) => {
    const item = wishlist.find(item => item.id === itemId);
    setWishlist(prev => prev.filter(item => item.id !== itemId));
    
    if (item) {
      toast({
        title: "Removed from Wishlist",
        description: `${item.title} has been removed from your wishlist.`,
        duration: 3000,
      });
    }
  };

  const isInWishlist = (itemId: string): boolean => {
    return wishlist.some(item => item.id === itemId);
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
