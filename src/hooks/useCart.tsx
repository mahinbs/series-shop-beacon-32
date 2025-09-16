import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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
  mergeAnonymousCart: () => Promise<void>;
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
  const [hasMergedCart, setHasMergedCart] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useSupabaseAuth();

  // Load cart from backend or localStorage
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated && user) {
          // For local storage auth, skip backend cart loading
          if (user.id && user.id.startsWith('local-')) {
            setCartItems([]);
          } else {
            // Load from backend for authenticated users
            try {
              const backendCartItems = await AuthService.getCartItems(user.id);
              
              // Filter out any items without valid product data and transform
              const transformedItems: CartItem[] = backendCartItems
                .filter(item => {
                  if (!item.product || !item.product.id || !item.product.title) {
                    console.warn('Filtering out invalid cart item:', item);
                    return false;
                  }
                  return true;
                })
                .map(item => ({
                  id: item.product.id,
                  title: item.product.title,
                  author: item.product.author || undefined,
                  price: Number(item.product.price) || 0,
                  imageUrl: item.product.image_url || '',
                  product_type: item.product.product_type || 'book',
                  quantity: item.quantity || 1,
                  inStock: true,
                }));
              
              setCartItems(transformedItems);
            } catch (backendError) {
              console.error('Error loading cart from backend:', backendError);
              // Fall back to empty cart instead of showing error
              setCartItems([]);
              // Only show error if it's not a network/auth issue
              if (backendError && !backendError.message?.includes('network')) {
                console.warn('Cart loading failed, starting with empty cart');
              }
            }
          }
        } else {
          // Load from localStorage for anonymous users
          const savedCart = localStorage.getItem('anonymous_cart');
          if (savedCart) {
            try {
              const parsedCart = JSON.parse(savedCart);
              // Validate cart data structure and required fields
              if (Array.isArray(parsedCart) && parsedCart.length > 0) {
                const validCartItems = parsedCart.filter(item => 
                  item && 
                  typeof item === 'object' && 
                  item.id && 
                  item.title && 
                  typeof item.price === 'number' &&
                  typeof item.quantity === 'number'
                );
                setCartItems(validCartItems);
                
                // Update localStorage if we filtered out invalid items
                if (validCartItems.length !== parsedCart.length) {
                  localStorage.setItem('anonymous_cart', JSON.stringify(validCartItems));
                }
              } else {
                // Clear invalid cart data
                localStorage.removeItem('anonymous_cart');
                setCartItems([]);
              }
            } catch (error) {
              console.error('Error loading cart from localStorage:', error);
              // Clear corrupted cart data
              localStorage.removeItem('anonymous_cart');
              setCartItems([]);
            }
          } else {
            setCartItems([]);
          }
        }
      } catch (error) {
        console.error('Critical error loading cart:', error);
        setCartItems([]);
        // Only show user-facing error for critical issues
        toast({
          title: "Notice",
          description: "Started with empty cart",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user, isAuthenticated]);

  // Save cart to localStorage for anonymous users or local storage auth users
  useEffect(() => {
    if (!isAuthenticated || (user && user.id && user.id.startsWith('local-'))) {
      if (cartItems.length > 0) {
        localStorage.setItem('anonymous_cart', JSON.stringify(cartItems));
      } else {
        localStorage.removeItem('anonymous_cart');
      }
    }
  }, [cartItems, isAuthenticated, user]);

  // Merge anonymous cart when user logs in
  const mergeAnonymousCart = useCallback(async () => {
    if (!user || !isAuthenticated || hasMergedCart) return;
    
    // Skip merging for local storage auth users
    if (user.id && user.id.startsWith('local-')) {
      setHasMergedCart(true);
      return;
    }

    try {
      const savedCart = localStorage.getItem('anonymous_cart');
      if (savedCart) {
        const anonymousCart = JSON.parse(savedCart);
        
        if (anonymousCart.length > 0) {
          // Merge anonymous cart items with backend
          for (const item of anonymousCart) {
            try {
              await AuthService.addToCart(user.id, item.id, item.quantity);
            } catch (error) {
              console.error('Error merging cart item:', error);
            }
          }

          // Clear anonymous cart
          localStorage.removeItem('anonymous_cart');
          
          // Refresh cart from backend
          await syncCartWithBackend();
          
          setHasMergedCart(true);
          
          toast({
            title: "Cart merged",
            description: "Your cart items have been merged with your account.",
          });
        }
      }
    } catch (error) {
      console.error('Error merging anonymous cart:', error);
    }
  }, [user, isAuthenticated, hasMergedCart]);

  // Auto-merge cart when user authenticates
  useEffect(() => {
    if (isAuthenticated && user && !hasMergedCart) {
      mergeAnonymousCart();
    }
  }, [isAuthenticated, user, hasMergedCart, mergeAnonymousCart]);

  // Reset merge flag when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setHasMergedCart(false);
    }
  }, [isAuthenticated]);

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    try {
      // Validate item data before adding
      if (!item.id || !item.title || typeof item.price !== 'number') {
        console.error('Invalid item data:', item);
        toast({
          title: "Error",
          description: "Invalid product data",
          variant: "destructive",
        });
        return;
      }

      if (isAuthenticated && user) {
        // For local storage auth, skip backend operations
        if (user.id && user.id.startsWith('local-')) {
          console.log('Using local storage auth, adding to local cart');
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
        } else {
          try {
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
          } catch (backendError) {
            console.error('Backend cart operation failed:', backendError);
            // Fall back to local storage for this operation
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
              description: `${item.title} added (offline mode)`,
            });
            return;
          }
        }

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
      if (isAuthenticated && user) {
        // For local storage auth, skip backend operations
        if (user.id && user.id.startsWith('local-')) {
          console.log('Using local storage auth, removing from local cart');
        } else {
          // Remove from backend for authenticated users
          await AuthService.removeFromCart(user.id, itemId);
        }
      }

      const item = cartItems.find(item => item.id === itemId);
      const updatedCartItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedCartItems);
      
      // Update localStorage for anonymous users or local storage auth users
      if (!isAuthenticated || (user && user.id && user.id.startsWith('local-'))) {
        if (updatedCartItems.length > 0) {
          localStorage.setItem('anonymous_cart', JSON.stringify(updatedCartItems));
          console.log('Cart updated in localStorage after removal:', updatedCartItems);
        } else {
          localStorage.removeItem('anonymous_cart');
          console.log('Cart cleared from localStorage after removal');
        }
      }
      
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

      if (isAuthenticated && user) {
        // For local storage auth, skip backend operations
        if (user.id && user.id.startsWith('local-')) {
          console.log('Using local storage auth, updating local cart quantity');
        } else {
          // Update in backend for authenticated users
          await AuthService.updateCartItemQuantity(user.id, itemId, quantity);
        }
      }
      
      const updatedCartItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setCartItems(updatedCartItems);
      
      // Update localStorage for anonymous users or local storage auth users
      if (!isAuthenticated || (user && user.id && user.id.startsWith('local-'))) {
        localStorage.setItem('anonymous_cart', JSON.stringify(updatedCartItems));
      }
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
      if (isAuthenticated && user) {
        // Clear from backend for authenticated users
        await AuthService.clearCart(user.id);
      }

      setCartItems([]);
      
      // Clear localStorage for anonymous users
      if (!isAuthenticated) {
        localStorage.removeItem('anonymous_cart');
      }
      
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
    if (!isAuthenticated || !user) return;

    try {
      setIsLoading(true);
      const backendCartItems = await AuthService.getCartItems(user.id);
      
      // Filter out any items without valid product data and transform
      const transformedItems: CartItem[] = backendCartItems
        .filter(item => {
          if (!item.product || !item.product.id || !item.product.title) {
            console.warn('Filtering out invalid cart item during sync:', item);
            return false;
          }
          return true;
        })
        .map(item => ({
          id: item.product.id,
          title: item.product.title,
          author: item.product.author || undefined,
          price: Number(item.product.price) || 0,
          imageUrl: item.product.image_url || '',
          product_type: item.product.product_type || 'book',
          quantity: item.quantity || 1,
          inStock: true,
        }));
      
      setCartItems(transformedItems);
    } catch (error) {
      console.error('Error syncing cart:', error);
      // Don't show error to user for sync failures, just log it
      console.warn('Cart sync failed, keeping current cart state');
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
      syncCartWithBackend,
      mergeAnonymousCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
