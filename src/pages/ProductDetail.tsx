import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Heart, ShoppingCart, Package, Truck, Shield, RotateCcw, Plus, Minus, Zap, Award, BookOpen, Download } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { booksService } from '@/services/database';
import { ComicService } from '@/services/comicService';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/use-toast';
import { BookCharacters, BookCharactersRef } from '@/components/BookCharacters';
import { CharacterPreviewBox } from '@/components/CharacterPreviewBox';
import { YouTubeVideo } from '@/components/YouTubeVideo';
import type { Book as BookType } from '@/services/database';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState<BookType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  // Fetch product data from database
  useEffect(() => {
    const loadProduct = async () => {
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

        // Fetch from database using booksService
        let productData;
        try {
          productData = await booksService.getById(productId);
        } catch (bookError) {
          // If not found in books, try ComicService
          try {
            productData = await ComicService.getComicById(productId);
          } catch (comicError) {
            console.error('Product not found in both books and comics:', { bookError, comicError });
            setError('Product not found');
            return;
          }
        }

        if (productData) {
          setProduct(productData);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
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
      const cartItem = {
        id: product.id,
        title: product.title,
        author: product.author || 'Unknown Author',
        price: typeof product.price === 'string' ? parseFloat(product.price.replace('$', '')) : product.price,
        originalPrice: product.original_price ? (typeof product.original_price === 'string' ? parseFloat(product.original_price.replace('$', '')) : product.original_price) : undefined,
        imageUrl: product.image_url || '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png',
        category: product.category || 'General',
        product_type: product.product_type || 'book',
        inStock: product.is_active !== false,
        coins: product.coins,
        canUnlockWithCoins: product.can_unlock_with_coins || false
      };

      addToCart(cartItem);
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        variant: "destructive",
      });
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        toast({
          title: "Removed from wishlist",
          description: `${product.title} has been removed from your wishlist.`,
        });
      } else {
        await addToWishlist(product.id);
        toast({
          title: "Added to wishlist",
          description: `${product.title} has been added to your wishlist.`,
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    if (!product) return;
    
    const totalPrice = (typeof product.price === 'string' ? parseFloat(product.price.replace('$', '')) : product.price) * quantity;
    
    navigate(`/checkout/${productId}`, {
      state: {
        product: {
          ...product,
          price: typeof product.price === 'string' ? parseFloat(product.price.replace('$', '')) : product.price
        },
        quantity,
        totalPrice
      }
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading product details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The product you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/shop-all')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shop
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalPrice = (typeof product.price === 'string' ? parseFloat(product.price.replace('$', '')) : product.price) * quantity;
  const isMerchandise = product.product_type === 'merchandise';
  const isBook = product.product_type === 'book' || !product.product_type;

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 transition-all duration-1000">
            {/* Product Images */}
            <div className="space-y-6">
              {/* Main Image with Enhanced Styling */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-heart via-diamond to-spade rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative aspect-square bg-card border border-border rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={images[selectedImageIndex]}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay Badges */}
                  <div className="absolute top-4 left-4 space-y-2">
                    {product.is_active && (
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                        <Zap className="w-3 h-3 mr-1" />
                        In Stock
                      </Badge>
                    )}
                    {isBook && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                        <BookOpen className="w-3 h-3 mr-1" />
                        Book
                      </Badge>
                    )}
                    {isMerchandise && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
                        <Package className="w-3 h-3 mr-1" />
                        Merchandise
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square bg-card border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        selectedImageIndex === index
                          ? 'border-primary opacity-100 shadow-lg shadow-primary/20'
                          : 'border-border opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-8 transition-all duration-1000 delay-300">
              {/* Product Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-gradient-to-r from-heart to-heart/80 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <Award className="w-3 h-3 mr-1" />
                    {product.category || 'Product'}
                  </Badge>
                  <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground hover:border-foreground hover:text-foreground transition-colors duration-300">
                    {product.product_type || 'book'}
                  </Badge>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-foreground bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
                  {product.title}
                </h1>

                {product.author && (
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center">
                      <span className="text-muted-foreground text-lg">by</span>
                      <span className="text-foreground text-lg font-semibold ml-2">{product.author}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-baseline gap-4 mb-6">
                  <p className="text-4xl font-bold bg-gradient-to-r from-heart to-diamond bg-clip-text text-transparent">
                    ${typeof product.price === 'string' ? parseFloat(product.price.replace('$', '')).toFixed(2) : product.price.toFixed(2)}
                  </p>
                  {product.original_price && (
                    <>
                      <p className="text-lg text-muted-foreground line-through">
                        ${typeof product.original_price === 'string' ? parseFloat(product.original_price.replace('$', '')).toFixed(2) : product.original_price.toFixed(2)}
                      </p>
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        {Math.round((1 - (typeof product.price === 'string' ? parseFloat(product.price.replace('$', '')) : product.price) / (typeof product.original_price === 'string' ? parseFloat(product.original_price.replace('$', '')) : product.original_price)) * 100)}% OFF
                      </Badge>
                    </>
                  )}
                </div>

                {product.description && (
                  <p className="text-muted-foreground leading-relaxed text-lg">{product.description}</p>
                )}
              </div>

              {/* Size Selection (for merchandise) */}
              {isMerchandise && (
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

              {/* Quantity Selector */}
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
                    className="w-12 h-12 border-border hover:border-foreground hover:bg-accent transition-colors duration-300"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={handleCheckout}
                  disabled={!product.is_active}
                  className="w-full h-14 bg-gradient-to-r from-heart to-heart/90 hover:from-heart/90 hover:to-heart text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  {product.is_active ? `Add to Cart - $${totalPrice.toFixed(2)}` : 'Out of Stock'}
                </Button>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handleWishlistToggle}
                    className="flex-1 h-12 border-border text-muted-foreground hover:border-heart hover:text-heart hover:bg-heart/5 transition-all duration-300"
                  >
                    <Heart className={`w-5 h-5 mr-3 transition-all duration-300 ${
                      isWishlisted ? 'fill-current text-heart scale-110' : ''
                    }`} />
                    {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
                  </Button>

                  {isBook && (
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/comic/${productId}`)}
                      className="flex-1 h-12 border-border text-muted-foreground hover:border-blue-500 hover:text-blue-500 hover:bg-blue-500/5 transition-all duration-300"
                    >
                      <Download className="w-5 h-5 mr-3" />
                      Read Now
                    </Button>
                  )}
                </div>
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

      {/* Characters Section (for books) */}
      {isBook && (
        <div className="py-16">
          <div className="container mx-auto px-4">
            <BookCharacters bookId={product.id} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
