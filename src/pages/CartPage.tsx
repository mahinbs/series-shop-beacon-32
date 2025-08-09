import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CreditCard, Heart, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock cart items data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Demon Slayer: Kimetsu no Yaiba Volume 23",
      author: "Koyoharu Gotouge",
      price: 9.99,
      originalPrice: null,
      image: "/lovable-uploads/26efc76c-fa83-4369-8d8d-354eab1433e6.png",
      category: "Manga",
      quantity: 2,
      inStock: true,
      shippingWeight: 0.5
    },
    {
      id: 2,
      title: "One Piece Box Set: East Blue and Baroque Works",
      author: "Eiichiro Oda",
      price: 299.99,
      originalPrice: 349.99,
      image: "/lovable-uploads/503cc23b-a28f-4564-86f9-53896fa75f10.png",
      category: "Manga",
      quantity: 1,
      inStock: true,
      shippingWeight: 5.2
    },
    {
      id: 3,
      title: "Attack on Titan Figure - Eren Yeager",
      author: "Good Smile Company",
      price: 89.99,
      originalPrice: 99.99,
      image: "/lovable-uploads/781ea40e-866e-4ee8-9bf7-862a42bb8716.png",
      category: "Merchandise",
      quantity: 1,
      inStock: false,
      shippingWeight: 1.2
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    const item = cartItems.find(item => item.id === id);
    setCartItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: `${item?.title} has been removed from your cart.`,
    });
  };

  const moveToWishlist = (id: number) => {
    const item = cartItems.find(item => item.id === id);
    removeItem(id);
    toast({
      title: "Moved to wishlist",
      description: `${item?.title} has been moved to your wishlist.`,
    });
  };

  const applyPromoCode = () => {
    // Mock promo code logic
    const validCodes = {
      'SAVE10': 10,
      'WELCOME20': 20,
      'MANGA15': 15
    };
    
    if (validCodes[promoCode.toUpperCase()]) {
      setDiscount(validCodes[promoCode.toUpperCase()]);
      toast({
        title: "Promo code applied!",
        description: `You saved ${validCodes[promoCode.toUpperCase()]}% with code ${promoCode.toUpperCase()}`,
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please check your code and try again.",
        variant: "destructive"
      });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const shipping = subtotal > 50 ? 0 : 7.99;
  const tax = (subtotal - discountAmount) * 0.08; // 8% tax
  const total = subtotal - discountAmount + shipping + tax;

  const handleContinueShopping = () => {
    // Track analytics for continue shopping action
    console.log('Analytics: User continued shopping from cart', {
      cartItems: cartItems.length,
      cartValue: total.toFixed(2),
      timestamp: new Date().toISOString()
    });

    toast({
      title: "Happy shopping!",
      description: "Browse our collection and find more amazing items.",
    });

    // Navigate to shop page
    navigate('/shop-all');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out.",
        variant: "destructive"
      });
      return;
    }

    const outOfStockItems = cartItems.filter(item => !item.inStock);
    if (outOfStockItems.length > 0) {
      toast({
        title: "Some items are out of stock",
        description: "Please remove out of stock items before proceeding.",
        variant: "destructive"
      });
      return;
    }

    // Navigate to checkout with cart data
    navigate('/checkout/multiple', {
      state: {
        cartItems: cartItems,
        totals: {
          subtotal,
          discount: discountAmount,
          shipping,
          tax,
          total
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                <ShoppingCart className="w-8 h-8" />
                Shopping Cart
              </h1>
              <p className="text-muted-foreground">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/shop-all">
              <Button variant="destructive" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Your Items</h2>
              
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="relative">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-20 h-28 object-cover rounded"
                        />
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                            <Badge variant="destructive" className="text-xs">
                              Out of Stock
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground line-clamp-2">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.author}</p>
                            <Badge variant="outline" className="mt-1">{item.category}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">${item.price}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${item.originalPrice}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={!item.inStock}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-12 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={!item.inStock}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveToWishlist(item.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Heart className="w-4 h-4 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-right">
                          <span className="font-semibold text-foreground">
                            Total: ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Promo Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Promo Code</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button variant="outline" onClick={applyPromoCode}>
                        <Tag className="w-4 h-4" />
                      </Button>
                    </div>
                    {discount > 0 && (
                      <p className="text-sm text-green-600">
                        {discount}% discount applied!
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Pricing Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discount}%)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {shipping === 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        🎉 You qualify for free shipping!
                      </p>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0 || cartItems.some(item => !item.inStock)}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Proceed to Checkout
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleContinueShopping}
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CartPage;