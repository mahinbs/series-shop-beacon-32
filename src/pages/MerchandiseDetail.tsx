import { useState, useEffect, useRef } from 'react';
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
import { BookCharacters, BookCharactersRef } from '@/components/BookCharacters';
import { CharacterPreviewBox } from '@/components/CharacterPreviewBox';
import { YouTubeVideo } from '@/components/YouTubeVideo';

const MerchandiseDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const bookCharactersRef = useRef<BookCharactersRef>(null);

  const handleCharacterBoxClick = () => {
    console.log('🎭 MerchandiseDetail: Character box clicked!', { 
      refExists: !!bookCharactersRef.current,
      refMethods: bookCharactersRef.current ? Object.keys(bookCharactersRef.current) : 'no ref'
    });
    // Open the first character's popup using the ref
    if (bookCharactersRef.current) {
      bookCharactersRef.current.openFirstCharacter();
    } else {
      console.log('🎭 MerchandiseDetail: No ref available');
    }
  };

  // Function to remove volume information from title
  const getCleanTitle = (title: string) => {
    if (!title) return 'Product Title';
    // Remove patterns like ", VOL.1", ", VOL 1", ", VOLUME 1", etc.
    return title.replace(/,\s*VOL\.?\s*\d+/i, '').replace(/,\s*VOLUME\s*\d+/i, '');
  };

  // Function to extract volume information from title
  const getVolumeInfo = (title: string) => {
    if (!title) return null;
    // Match patterns like ", VOL.1", ", VOL 1", ", VOLUME 1", etc.
    const volumeMatch = title.match(/,\s*(VOL\.?\s*\d+|VOLUME\s*\d+)/i);
    return volumeMatch ? volumeMatch[1].toUpperCase() : null;
  };
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [volumes, setVolumes] = useState<any[]>([]);
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
              
              // If this is a volume, load the parent book details instead
              if (book.is_volume && book.parent_book_id) {
                console.log('📖 This is a volume, loading parent book details...');
                try {
                  const parentBook = await booksService.getById(book.parent_book_id);
                  if (parentBook) {
                    console.log('✅ Found parent book:', parentBook);
                    setProduct(parentBook);
                    
                    // Load all volumes for the parent book
                    try {
                      const bookVolumes = await booksService.getVolumes(parentBook.id);
                      console.log('📚 Loaded volumes for parent book:', bookVolumes);
                      setVolumes(bookVolumes);
                    } catch (volumeError) {
                      console.error('Error loading volumes for parent book:', volumeError);
                      setVolumes([]);
                    }
                  } else {
                    console.log('❌ Parent book not found, showing volume details');
                    setProduct(book);
                  }
                } catch (parentError) {
                  console.error('Error loading parent book:', parentError);
                  setProduct(book);
                }
              } else {
                // Regular book or volume without parent
                setProduct(book);
                
                // Load volumes for this book if it's not a volume itself
                if (!book.is_volume) {
                  try {
                    const bookVolumes = await booksService.getVolumes(book.id);
                    console.log('📚 Loaded volumes:', bookVolumes);
                    setVolumes(bookVolumes);
                  } catch (volumeError) {
                    console.error('Error loading volumes:', volumeError);
                    setVolumes([]);
                  }
                }
              }
              
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

  const handleSeriesClick = () => {
    console.log('🔗 Series title clicked - navigating to series page');
    navigate(`/series/${productId}`);
  };

  // Mock data for new sections
  const mockGenres = ["HIGH SCHOOL", "ROMANCE", "DRAMA", "FANTASY"];

  const totalPrice = product ? (product.price || parseFloat(product.price?.toString().replace('$', '') || '0')) * quantity : 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="min-h-screen bg-black">
        <Header />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
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
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/shop-all')}
          className="text-gray-300 hover:text-white p-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
      
      {/* Large Hero Background Image */}
      <div 
        className="relative h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${product?.cover_page_url || '/lovable-uploads/abed4463-239d-408d-ad63-f574b272f199.png'})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Main Content Container */}
      <div className="bg-black relative">
        <div className="container mx-auto px-4">
          {/* Product Section */}
          <div className="flex flex-col lg:flex-row gap-0 mb-8">
            {/* Left Side - Book Cover (Overlapping Hero) */}
            <div className="flex justify-start lg:justify-start relative -mt-24 z-10 w-80">
              <div className="w-80">
                <img
                  src={product?.image_url || product?.imageUrl || '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png'}
                  alt={product?.title || 'Product'}
                  className="w-full rounded-lg shadow-2xl animate-fade-in"
                />
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="space-y-4 min-h-96 py-8 w-full flex-1 pl-8 pr-24">
              {/* Volume Information */}
              {getVolumeInfo(product?.title) && (
                <div className="mb-6">
                  <h2 className="text-4xl font-bold text-white tracking-wide">
                    {getVolumeInfo(product?.title)}
                  </h2>
                </div>
              )}

              {/* Genre Tags */}
              <div className="flex flex-wrap gap-2">
                {mockGenres.slice(0, 4).map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded uppercase tracking-wide"
                  >
                    {genre}
                  </span>
                ))}
              </div>

               {/* Series Title and Character Preview */}
               <div className="flex items-start gap-6 mt-12">
                 {/* Character Preview Box - Moved to left */}
                 <div className="w-48 h-48 bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-lg overflow-hidden relative flex-shrink-0">
                   <CharacterPreviewBox bookId={productId} onCharacterBoxClick={handleCharacterBoxClick} />
                 </div>
                 
                 <div className="flex-1">
                   <button
                     onClick={handleSeriesClick}
                     className="text-2xl lg:text-3xl font-bold text-white hover:text-red-400 transition-colors duration-200 text-left block"
                   >
                     {getCleanTitle(product?.title)}
                   </button>
                   <p className="text-gray-400 text-sm mt-1">by {product?.author || 'Author'}</p>
                   
                   {/* Action Buttons - Right below author */}
                   <div className="flex space-x-4 mt-4">
                     <Button
                       onClick={handleAddToCart}
                       disabled={product?.stock_quantity !== undefined ? product.stock_quantity <= 0 : false}
                       className={`px-8 py-3 font-bold uppercase transition-all duration-200 ${
                         product?.stock_quantity !== undefined && product.stock_quantity <= 0
                           ? 'bg-gray-500 text-gray-300 cursor-not-allowed hover:bg-gray-500'
                           : 'bg-red-600 hover:bg-red-700 text-white'
                       }`}
                     >
                       {product?.stock_quantity !== undefined && product.stock_quantity <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                     </Button>
                     <Button
                       variant="outline"
                       onClick={() => setIsWishlisted(!isWishlisted)}
                       className="border-gray-500 text-gray-300 hover:bg-gray-700 px-8 py-3 font-bold uppercase"
                     >
                       WISH TO BUY
                     </Button>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Trailer and Preview Section */}
          {product?.video_url && (
            <div className="mt-8 bg-gray-900 p-6 rounded-lg mb-8">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Side - Trailer Video */}
                <div className="lg:w-[60%]">
                  <YouTubeVideo 
                    url={product.video_url} 
                    className="w-full h-[400px] lg:h-[500px]"
                  />
                </div>

                {/* Right Side - Chapter Preview List */}
                <div className="lg:w-[40%]">
                  <div className="bg-white rounded-lg p-4">
                    <h3 className="text-black font-bold text-lg mb-4 uppercase">Preview</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-black font-bold">CH. 1</span>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm font-bold">
                          📖 READ NOW
                        </button>
                      </div>
                      {[2, 3, 4, 5, 6].map((ch) => (
                        <div key={ch} className="flex items-center justify-between py-2 border-b border-gray-200">
                          <span className="text-black font-bold">CH. {ch}</span>
                          <button className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-1 rounded text-sm font-bold">
                            🔒 JOIN TO CONTINUE
                          </button>
                        </div>
                      ))}
                      <div className="text-center pt-2">
                        <button className="text-gray-600 hover:text-gray-800">
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Characters Section */}
          {product?.id && (
            <div id="characters-section" className="mb-12">
              <BookCharacters ref={bookCharactersRef} bookId={String(product.id)} />
            </div>
          )}

          {/* Bottom Details Grid */}
          <div className="flex flex-col md:flex-row gap-6 bg-gray-900 p-6 rounded-lg mb-8">
            {/* Left Container - Book Description (60% width) */}
            <div className="md:w-[60%] border border-gray-700 p-4 rounded-lg">
              <h3 className="text-red-400 font-bold text-lg mb-4 uppercase">About the Series</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {product?.description || 'Product description will be displayed here. This is a placeholder text for the product description section.'}
              </p>
            </div>
            
            {/* Right Container - Details (40% width) */}
            <div className="md:w-[40%] space-y-3 border border-gray-700 p-4 rounded-lg">
              <div className="text-sm">
                <span className="text-red-400 font-bold uppercase">Creator: </span>
                <span className="text-white font-bold">{product?.author || 'Creator Name'}</span>
              </div>
              
              <div className="text-sm">
                <span className="text-red-400 font-bold uppercase">Category: </span>
                <span className="text-white font-bold">{product?.category || 'Category'}</span>
              </div>
              
              <div className="text-sm">
                <span className="text-red-400 font-bold uppercase">Type: </span>
                <span className="text-white font-bold">{product?.product_type || 'Product Type'}</span>
              </div>
              
              <div className="text-sm">
                <span className="text-red-400 font-bold uppercase">Price: </span>
                <span className="text-white font-bold">${product?.price || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="mt-8 text-center mb-8">
            <Button
              onClick={handleCheckout}
              disabled={product?.stock_quantity !== undefined ? product.stock_quantity <= 0 : false}
              className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 text-lg font-bold uppercase"
            >
              CHECKOUT - ${totalPrice.toFixed(2)}
            </Button>
          </div>

          {/* Where to Buy Section */}
          <div className="mt-8 bg-gray-900 p-6 rounded-lg mb-8">
            <h2 className="text-white text-xl font-bold mb-6 uppercase">Where to Buy</h2>
            
            {/* Format Tabs */}
            <div className="flex space-x-1 mb-6">
              <button className="bg-white text-black px-6 py-2 font-bold text-sm uppercase">
                Digital
              </button>
              <button className="bg-transparent text-red-400 px-6 py-2 font-bold text-sm uppercase border-b-2 border-red-400">
                Paperback
              </button>
              <button className="bg-transparent text-red-400 px-6 py-2 font-bold text-sm uppercase border-b-2 border-red-400">
                Hardcover
              </button>
            </div>

            {/* Retailer Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {['Flipkart', 'Amazon', 'Amazon', 'Flipkart', 'Amazon', 'Flipkart', 'Flipkart', 'Amazon', 'Amazon'].map((retailer, index) => (
                <button key={index} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold text-sm uppercase">
                  {retailer}
                </button>
              ))}
            </div>
          </div>

          {/* All The Volume Section */}
          {volumes.length > 0 && (
            <div className="mt-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-xl font-bold uppercase">All The Volume</h2>
                <button className="text-red-400 hover:text-red-300 font-bold text-sm uppercase">
                  See All
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {volumes.map((volume) => (
                  <div key={volume.id} className="bg-gray-900 rounded-lg overflow-hidden">
                    {/* Labels */}
                    {volume.label && (
                      <div className="bg-orange-600 text-white text-center py-1 text-xs font-bold uppercase">
                        {volume.label}
                      </div>
                    )}
                    {volume.is_new && (
                      <div className="bg-green-600 text-white text-center py-1 text-xs font-bold uppercase">
                        New
                      </div>
                    )}
                    {volume.is_on_sale && (
                      <div className="bg-red-600 text-white text-center py-1 text-xs font-bold uppercase">
                        On Sale
                      </div>
                    )}
                    
                    <div className="p-4">
                      <img
                        src={volume.image_url}
                        alt={volume.title}
                        className="w-full h-40 object-cover rounded mb-3"
                      />
                      
                      <div className="text-center">
                        <h3 className="text-red-400 text-xs font-bold mb-1 uppercase">
                          {volume.title}
                        </h3>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <p className="text-white text-xs font-bold">${volume.price}</p>
                          {volume.original_price && volume.original_price > volume.price && (
                            <p className="text-gray-400 text-xs line-through">${volume.original_price}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <button 
                            className={`w-full py-1 px-2 rounded text-xs font-bold uppercase transition-all duration-200 ${
                              volume.stock_quantity > 0
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                            }`}
                            disabled={volume.stock_quantity <= 0}
                            onClick={() => navigate(`/merchandise/${volume.id}`)}
                          >
                            {volume.stock_quantity > 0 ? (volume.label === 'Pre-Order' ? 'Pre-Order Now' : 'Order Now') : 'Out of Stock'}
                          </button>
                          <div className="flex space-x-1">
                            <button 
                              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded text-xs font-bold"
                              disabled={volume.stock_quantity <= 0}
                            >
                              Cart
                            </button>
                            <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded text-xs font-bold">
                              ♡
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MerchandiseDetail;
