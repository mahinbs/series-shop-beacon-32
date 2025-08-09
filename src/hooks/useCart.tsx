import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './use-toast';
import { AuthService, type CartItemWithProduct } from '@/services/auth';
import { useSupabaseAuth } from './useSupabaseAuth';

export interface CartItem {
  id: string;
  title: string;
  author?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category?: string;
  product_type?: 'book' | 'merchandise' | 'digital' | 'other';
  quantity: number;
  inStock?: boolean;
  shippingWeight?: number;
  coins?: string;
  canUnlockWithCoins?: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isInCart: (itemId: string) => boolean;
  isLoading: boolean;
  syncCartWithBackend: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useSupabaseAuth();

  // Load cart from backend or localStorage
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // Load from backend for authenticated users
          const backendCartItems = await AuthService.getCartItems(user.id);
          const transformedItems: CartItem[] = backendCartItems.map(item => ({
            id: item.id,
            title: item.product.title,
            author: item.product.author || undefined,
            price: item.product.price,
            imageUrl: item.product.image_url,
            product_type: item.product.product_type,
            quantity: item.quantity,
            inStock: true,
          }));
          setCartItems(transformedItems);
        } else {
          // Load from localStorage for anonymous users
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            try {
              const parsedCart = JSON.parse(savedCart);
              setCartItems(parsedCart);
            } catch (error) {
              console.error('Error loading cart from localStorage:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        toast({
          title: "Error",
          description: "Failed to load cart items",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // Save cart to localStorage for anonymous users
  useEffect(() => {
    if (!user && cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    try {
      if (user) {
        // Add to backend for authenticated users
        await AuthService.addToCart(user.id, item.id, 1);
        
        // Update local state
        setCartItems(prevItems => {
          const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
          
          if (existingItem) {
            return prevItems.map(cartItem =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
          } else {
            return [...prevItems, { ...item, quantity: 1 }];
          }
        });

        toast({
          title: "Added to cart",
          description: `${item.title} has been added to your cart.`,
        });
      } else {
        // Add to localStorage for anonymous users
        setCartItems(prevItems => {
          const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
          
          if (existingItem) {
            const updatedItems = prevItems.map(cartItem =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
            
            toast({
              title: "Quantity updated",
              description: `${item.title} quantity increased in your cart.`,
            });
            
            return updatedItems;
          } else {
            const newItem: CartItem = { ...item, quantity: 1 };
            
            toast({
              title: "Added to cart",
              description: `${item.title} has been added to your cart.`,
            });
            
            return [...prevItems, newItem];
          }
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      if (user) {
        // Remove from backend for authenticated users
        await AuthService.removeFromCart(user.id, itemId);
      }

      const item = cartItems.find(item => item.id === itemId);
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      
      if (item) {
        toast({
          title: "Item removed",
          description: `${item.title} has been removed from your cart.`,
        });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity < 1) {
        await removeFromCart(itemId);
        return;
      }

      if (user) {
        // Update in backend for authenticated users
        await AuthService.updateCartItemQuantity(user.id, itemId, quantity);
      }
      
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        // Clear from backend for authenticated users
        await AuthService.clearCart(user.id);
      }

      setCartItems([]);
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (itemId: string) => {
    return cartItems.some(item => item.id === itemId);
  };

  const syncCartWithBackend = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const backendCartItems = await AuthService.getCartItems(user.id);
      const transformedItems: CartItem[] = backendCartItems.map(item => ({
        id: item.id,
        title: item.product.title,
        author: item.product.author || undefined,
        price: item.product.price,
        imageUrl: item.product.image_url,
        product_type: item.product.product_type,
        quantity: item.quantity,
        inStock: true,
      }));
      setCartItems(transformedItems);
    } catch (error) {
      console.error('Error syncing cart:', error);
      toast({
        title: "Error",
        description: "Failed to sync cart with backend",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemCount,
      isInCart,
      isLoading,
      syncCartWithBackend
    }}>
      {children}
    </CartContext.Provider>
  );
};
