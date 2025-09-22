import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Heart, ShoppingCart, Package, Truck, Shield, RotateCcw, Plus, Minus, Zap, Award } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/use-toast';
import type { Book as BookType } from '@/services/database';

const MerchandiseDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState<BookType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  // Fetch product data from database
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Try to get product from location state first (for faster navigation)
        if (location.state?.product) {
          setProduct(location.state.product);
          setIsLoading(false);
          return;
        }

        // Fetch from database
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('id', productId)
          .eq('product_type', 'merchandise')
          .eq('is_active', true)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
          setError('Product not found');
          return;
        }

        if (data) {
          setProduct(data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, location.state]);

  // Check if product is in wishlist
  useEffect(() => {
    if (product) {
      setIsWishlisted(isInWishlist(product.id));
    }
  }, [product, isInWishlist]);

  const sizes = ['S', 'M', 'L', 'XL'];
  
  // Generate multiple images (using the same image for now, but can be extended)
  const images = product ? [
    product.image_url,
    product.hover_image_url || product.image_url,
    product.image_url,
    product.image_url
  ].filter(Boolean) : [];

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart({
        id: product.id,
        title: product.title,
        author: product.author || undefined,
        price: Number(product.price),
        imageUrl: product.image_url,
        category: product.category,
        product_type: 'merchandise',
        inStock: product.stock_quantity ? product.stock_quantity > 0 : true,
        coins: (product as any).coins || undefined,
        canUnlockWithCoins: product.can_unlock_with_coins || undefined,
      });

      toast({
        title: "Added to Cart!",
        description: `${product.title} added to cart!`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
      toast({
        title: "Removed from Wishlist",
        description: `${product.title} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        product_id: product.id,
        title: product.title,
        author: product.author || "Unknown Author",
        price: Number(product.price),
        originalPrice: product.original_price ? Number(product.original_price) : undefined,
        imageUrl: product.image_url,
        category: product.category,
        product_type: 'merchandise',
        inStock: product.stock_quantity ? product.stock_quantity > 0 : true,
        volume: product.volume_number,
      });
      setIsWishlisted(true);
      toast({
        title: "Added to Wishlist",
        description: `${product.title} has been added to your wishlist.`,
      });
    }
  };

  const handleCheckout = () => {
    if (!product) return;

    console.log('🛍️ Proceeding to checkout for merchandise');
    console.log('📦 Product:', product);
    console.log('📊 Quantity:', quantity);
    
    navigate(`/checkout/${productId}`, {
      state: {
        product: {
          ...product,
          price: Number(product.price)
        },
        quantity,
        totalPrice: Number(product.price) * quantity
      }
    });
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <Button onClick={() => navigate('/shop-all')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalPrice = Number(product.price) * quantity;
  const isInStock = product.stock_quantity ? product.stock_quantity > 0 : true;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--heart))_0%,transparent_50%)] opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--diamond))_0%,transparent_50%)] opacity-10" />
        
        <div className="relative container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/shop-all')}
            className="text-muted-foreground hover:text-foreground mb-6 group transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Shop
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-6">
              {/* Main Image with Enhanced Styling */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-heart via-diamond to-spade rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative aspect-square bg-card border border-border rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={product.image_url || '/placeholder.svg'}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay Badges */}
                  <div className="absolute top-4 left-4 space-y-2">
                    {isInStock && (
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                        <Zap className="w-3 h-3 mr-1" />
                        In Stock
                      </Badge>
                    )}
                    {!isInStock && (
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
                        Out of Stock
                      </Badge>
                    )}
                    {product.is_new && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                        <Award className="w-3 h-3 mr-1" />
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {/* {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((image, index) => (
                    <div 
                      key={index} 
                      className="aspect-square bg-card border border-border rounded-lg overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )} */}
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              {/* Product Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-gradient-to-r from-heart to-heart/80 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <Award className="w-3 h-3 mr-1" />
                    {product.category}
                  </Badge>
                  <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground hover:border-foreground hover:text-foreground transition-colors duration-300">
                    Merchandise
                  </Badge>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
                  {product.title}
                </h1>
                
                {product.author && (
                  <p className="text-lg text-muted-foreground">by {product.author}</p>
                )}
                
                <div className="flex items-baseline gap-4 mb-6">
                  <p className="text-4xl font-bold bg-gradient-to-r from-heart to-diamond bg-clip-text text-transparent">
                    ${product.price}
                  </p>
                  {product.original_price && (
                    <>
                      <p className="text-lg text-muted-foreground line-through">
                        ${product.original_price}
                      </p>
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        {Math.round(((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100)}% OFF
                      </Badge>
                    </>
                  )}
                </div>
                
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {product.description || 'Premium quality merchandise for anime and manga fans.'}
                </p>

                {/* Stock Information */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Stock:</span>
                  <span className={`font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock_quantity || 0} available
                  </span>
                </div>
              </div>

              {/* Size Selection (Enhanced) */}
              {product.category === 'Apparel' && (
                <div className="space-y-4">
                  <h3 className="text-foreground font-semibold text-lg">Size</h3>
                  <div className="flex gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 border rounded-lg transition-all duration-300 font-medium ${
                          selectedSize === size
                            ? 'border-heart bg-heart/10 text-heart shadow-lg shadow-heart/20'
                            : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground hover:bg-accent/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector (Enhanced) */}
              <div className="space-y-4">
                <h3 className="text-foreground font-semibold text-lg">Quantity</h3>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border-border hover:border-foreground hover:bg-accent transition-colors duration-300"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-foreground font-bold text-xl w-16 text-center bg-accent/30 py-2 rounded-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!isInStock || (product.stock_quantity && quantity >= product.stock_quantity)}
                    className="w-12 h-12 border-border hover:border-foreground hover:bg-accent transition-colors duration-300"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {product.stock_quantity && quantity >= product.stock_quantity && (
                  <p className="text-sm text-muted-foreground">Maximum quantity reached</p>
                )}
              </div>

              {/* Action Buttons (Enhanced) */}
              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className="w-full h-14 bg-gradient-to-r from-heart to-heart/90 hover:from-heart/90 hover:to-heart text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  {isInStock ? `Add to Cart - $${totalPrice.toFixed(2)}` : 'Out of Stock'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className="w-full h-12 border-border text-muted-foreground hover:border-heart hover:text-heart hover:bg-heart/5 transition-all duration-300"
                >
                  <Heart className={`w-5 h-5 mr-3 transition-all duration-300 ${
                    isWishlisted ? 'fill-current text-heart scale-110' : ''
                  }`} />
                  {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gradient-to-br from-accent/20 via-background to-secondary/20">
        <div className="container mx-auto px-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-2xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Why Choose Our Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-heart to-heart/80 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-semibold text-foreground mb-2">Free Shipping</div>
                  <div className="text-sm text-muted-foreground">On orders over $50</div>
                </div>
                
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-diamond to-diamond/80 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-semibold text-foreground mb-2">100% Authentic</div>
                  <div className="text-sm text-muted-foreground">Official merchandise</div>
                </div>
                
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-club to-club/80 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <RotateCcw className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-semibold text-foreground mb-2">Easy Returns</div>
                  <div className="text-sm text-muted-foreground">30-day policy</div>
                </div>
                
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-spade to-spade/80 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-semibold text-foreground mb-2">Gift Wrapping</div>
                  <div className="text-sm text-muted-foreground">Available at checkout</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MerchandiseDetail;