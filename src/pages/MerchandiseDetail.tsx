import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, ShoppingCart, Package, Truck, Shield, RotateCcw, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { booksService } from '@/services/database';
import { ComicService } from '@/services/comicService';
import { BookCharacters } from '@/components/BookCharacters';
import { YouTubeVideo } from '@/components/YouTubeVideo';

const MerchandiseDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Debug logging
  console.log('🎯 MerchandiseDetail: Component loaded');
  console.log('🆔 MerchandiseDetail: Product ID from URL:', productId);
  console.log('📦 MerchandiseDetail: Location state:', location.state);

  // Load product data - simplified approach
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setError('No product ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // First try to get from location state (if navigated from a product list)
        if (location.state?.product) {
          console.log('📦 Using product from location state:', location.state.product);
          setProduct(location.state.product);
          setIsLoading(false);
          // Note: Do not return here; we will fetch fresh data to ensure all fields (e.g., video_url)
        }

        // Primary method: Try to fetch directly from books service
        console.log('🔍 Fetching product from books service with ID:', productId);
        try {
          const book = await booksService.getById(productId);
          if (book) {
            console.log('✅ Found product in books:', book);
            setProduct(book);
            setIsLoading(false);
            return;
          }
        } catch (bookError) {
          console.log('📚 Book not found, trying comic series...');
        }

        // Fallback: Try comic series
        await searchInComicSeries();
        
      } catch (err) {
        console.error('❌ Error loading product:', err);
        setError('Failed to load product');
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId, location.state]);

  // Function to search in comic series
  const searchInComicSeries = async () => {
    try {
      console.log('🔍 Searching in comic series for ID:', productId);
      const series = await ComicService.getSeries();
      console.log('📚 Available comic series:', series.map(s => ({ id: s.id, title: s.title })));
      
      const foundSeries = series.find(s => s.id === productId);
      if (foundSeries) {
        console.log('✅ Found product in comic series:', foundSeries);
        // Transform comic series data to match product format
        const transformedProduct = {
          id: foundSeries.id,
          title: foundSeries.title,
          author: 'Comic Series',
          category: 'Comic',
          product_type: 'book',
          price: 0,
          original_price: 0,
          image_url: foundSeries.cover_image_url,
          hover_image_url: foundSeries.banner_image_url,
          description: foundSeries.description,
          is_new: false,
          is_on_sale: false,
          stock_quantity: 999,
          display_order: foundSeries.display_order || 0,
          is_active: foundSeries.is_active || true,
          created_at: foundSeries.created_at,
          updated_at: foundSeries.updated_at
        };
        setProduct(transformedProduct);
        setIsLoading(false);
      } else {
        console.log('❌ Product not found in comic series either');
        console.log('🔍 Available comic series IDs:', series.map(s => s.id));
        setError(`Product not found. Searched for ID: ${productId}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ Error searching comic series:', error);
      setError(`Product not found. Searched for ID: ${productId}`);
      setIsLoading(false);
    }
  };

  const sizes = ['S', 'M', 'L', 'XL'];
  
  // Create images array from product data
  const images = product ? [
    product.image_url || product.imageUrl,
    product.hover_image_url || product.image_url || product.imageUrl,
    product.image_url || product.imageUrl,
    product.image_url || product.imageUrl
  ] : [];

  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      const cartItem = {
        id: product.id.toString(),
        title: product.title,
        author: product.author || undefined,
        price: product.price || parseFloat(product.price?.toString().replace('$', '') || '0'),
        imageUrl: product.image_url || product.imageUrl,
        category: product.category,
        product_type: (product.product_type || 'merchandise') as 'book' | 'merchandise' | 'digital',
        inStock: product.stock_quantity !== undefined ? product.stock_quantity > 0 : true,
        quantity: quantity
      };
      
      addToCart(cartItem);
      toast({
        title: "Added to Cart!",
        description: `${product.title} has been added to your cart.`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleCheckout = () => {
    if (!product) return;
    
    console.log('🛍️ Proceeding to checkout for merchandise');
    console.log('📦 Product:', product);
    console.log('📊 Quantity:', quantity);
    
    const price = product.price || parseFloat(product.price?.toString().replace('$', '') || '0');
    
    navigate(`/checkout/${productId}`, {
      state: {
        product: {
          ...product,
          price: price
        },
        quantity,
        totalPrice: price * quantity
      }
    });
  };

  const totalPrice = product ? (product.price || parseFloat(product.price?.toString().replace('$', '') || '0')) * quantity : 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
              <p className="text-white">Loading product details...</p>
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
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-500 text-xl mb-4">Product not found</p>
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

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/shop-all')}
          className="text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={product.image_url || product.imageUrl || '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <div key={index} className="aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-red-600 text-white">
                  {product.category}
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {product.product_type || product.type || 'Product'}
                </Badge>
                {product.is_new && <Badge variant="secondary" className="bg-green-600 text-white">🆕 New</Badge>}
                {product.is_on_sale && <Badge variant="destructive" className="text-white">🏷️ Sale</Badge>}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.title}</h1>
              {product.author && (
                <p className="text-lg text-gray-400 mb-2">by {product.author}</p>
              )}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <span className="text-gray-400">({product.reviews || '0'} reviews)</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <p className="text-xl font-bold text-white">${product.price}</p>
                {product.original_price && product.original_price > product.price && (
                  <p className="text-lg text-gray-400 line-through">${product.original_price}</p>
                )}
              </div>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection (if applicable) */}
            {product.category === 'Apparel' && (
              <div>
                <h3 className="text-white font-semibold mb-3">Size</h3>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md transition-colors ${
                        selectedSize === size
                          ? 'border-red-500 bg-red-500/10 text-red-400'
                          : 'border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-white font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-600 rounded-md text-gray-400 hover:border-gray-500 hover:text-white transition-colors"
                >
                  -
                </button>
                <span className="text-white font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-600 rounded-md text-gray-400 hover:border-gray-500 hover:text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock_quantity !== undefined ? product.stock_quantity <= 0 : false}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {(product.stock_quantity !== undefined ? product.stock_quantity > 0 : true) ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <Button
                onClick={handleCheckout}
                disabled={product.stock_quantity !== undefined ? product.stock_quantity <= 0 : false}
                variant="outline"
                className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white py-6 text-lg font-semibold"
              >
                Checkout Now - ${totalPrice.toFixed(2)}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="w-full border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400"
              >
                <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            {/* Product Features */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-300">
                    <Truck className="w-5 h-5 mr-3 text-red-400" />
                    <div>
                      <div className="font-semibold">Free Shipping</div>
                      <div className="text-sm text-gray-400">On orders over $50</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 mr-3 text-red-400" />
                    <div>
                      <div className="font-semibold">Authentic</div>
                      <div className="text-sm text-gray-400">100% Official</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <RotateCcw className="w-5 h-5 mr-3 text-red-400" />
                    <div>
                      <div className="font-semibold">Easy Returns</div>
                      <div className="text-sm text-gray-400">30-day policy</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Package className="w-5 h-5 mr-3 text-red-400" />
                    <div>
                      <div className="font-semibold">Gift Wrapping</div>
                      <div className="text-sm text-gray-400">Available</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* YouTube Video Section */}
        {product && product.video_url && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Featured Video</h2>
            <YouTubeVideo 
              url={product.video_url} 
              className="max-w-4xl mx-auto"
            />
          </div>
        )}

        {/* Characters Section */}
        {product && product.id && (
          <div className="mt-12">
            <BookCharacters bookId={product.id} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MerchandiseDetail;