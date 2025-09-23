import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, ShoppingCart, BookOpen, Star, Clock, User, Tag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/hooks/useWishlist';
import { booksService } from '@/services/database';
import { supabase } from '@/integrations/supabase/client';

interface VolumePage {
  id: string;
  volume_id: string;
  page_number: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const VolumeDetail = () => {
  const { bookId, volumeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [volume, setVolume] = useState<any>(null);
  const [parentBook, setParentBook] = useState<any>(null);
  const [volumePages, setVolumePages] = useState<VolumePage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get volume data from location state if available
  const volumeData = location.state?.volume;

  useEffect(() => {
    loadVolumeData();
  }, [volumeId, bookId]);

  const loadVolumeData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load volume details
      const volumeDetails = await booksService.getById(volumeId!);
      if (!volumeDetails) {
        setError('Volume not found');
        return;
      }

      setVolume(volumeDetails);

      // Load parent book details
      if (volumeDetails.parent_book_id) {
        const parentBookDetails = await booksService.getById(volumeDetails.parent_book_id);
        setParentBook(parentBookDetails);
      }

      // Load volume pages
      await loadVolumePages(volumeId!);

      // Check if volume is in wishlist
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const isInWishlist = wishlist.some((item: any) => item.id === volumeId);
      setIsWishlisted(isInWishlist);

    } catch (err) {
      console.error('Error loading volume data:', err);
      setError('Failed to load volume details');
    } finally {
      setIsLoading(false);
    }
  };

  const loadVolumePages = async (volId: string) => {
    try {
      const { data, error } = await supabase
        .from('volume_pages')
        .select('*')
        .eq('volume_id', volId)
        .eq('is_active', true)
        .order('page_number', { ascending: true });

      if (error) {
        console.error('Error loading volume pages:', error);
        setVolumePages([]);
      } else {
        setVolumePages(data || []);
      }
    } catch (error) {
      console.error('Error loading volume pages:', error);
      setVolumePages([]);
    }
  };

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!volume) return;

    const cartItem = {
      id: volume.id,
      title: volume.title,
      author: volume.author || 'Unknown Author',
      price: volume.price,
      originalPrice: volume.original_price,
      imageUrl: volume.image_url,
      category: volume.category,
      product_type: (volume.product_type || 'book') as 'book' | 'merchandise' | 'digital' | 'other',
      inStock: volume.stock_quantity > 0,
      coins: volume.coins,
      canUnlockWithCoins: volume.can_unlock_with_coins || false,
      quantity: quantity
    };

    addToCart(cartItem);
    toast({
      title: "Added to Cart",
      description: `${volume.title} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    if (!volume) return;

    if (isWishlisted) {
      removeFromWishlist(volume.id);
      setIsWishlisted(false);
      toast({
        title: "Removed from Wishlist",
        description: `${volume.title} has been removed from your wishlist.`,
      });
    } else {
      const wishlistItem = {
        id: volume.id,
        title: volume.title,
        author: volume.author || 'Unknown Author',
        price: volume.price,
        originalPrice: volume.original_price,
        imageUrl: volume.image_url,
        category: volume.category,
        product_type: (volume.product_type || 'book') as 'book' | 'merchandise' | 'digital' | 'other',
        inStock: volume.stock_quantity > 0,
        coins: volume.coins,
        canUnlockWithCoins: volume.can_unlock_with_coins || false,
        product_id: volume.id
      };
      addToWishlist(wishlistItem);
      setIsWishlisted(true);
      toast({
        title: "Added to Wishlist",
        description: `${volume.title} has been added to your wishlist.`,
      });
    }
  };

  const handleReadNow = () => {
    if (volumePages.length > 0) {
      navigate(`/volume-reader/${volumeId}`);
    } else {
      toast({
        title: "No Content Available",
        description: "This volume doesn't have any pages yet.",
        variant: "destructive",
      });
    }
  };

  const handlePurchaseNow = () => {
    navigate(`/direct-checkout/${volumeId}`, {
      state: {
        product: {
          id: volume.id,
          title: volume.title,
          author: volume.author || 'Unknown Author',
          price: volume.price,
          originalPrice: volume.original_price,
          imageUrl: volume.image_url,
          category: volume.category,
          product_type: (volume.product_type || 'book') as 'book' | 'merchandise' | 'digital' | 'other',
          inStock: volume.stock_quantity > 0,
          coins: volume.coins,
          canUnlockWithCoins: volume.can_unlock_with_coins || false
        },
        quantity: quantity,
        totalPrice: volume.price * quantity
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading volume details...</div>
      </div>
    );
  }

  if (error || !volume) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">{error || 'Volume not found'}</div>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
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
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Volume Image */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={volume.image_url || '/placeholder.svg'}
                alt={volume.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Volume Pages Preview */}
            {volumePages.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-white font-semibold">Preview Pages</h3>
                <div className="grid grid-cols-4 gap-2">
                  {volumePages.slice(0, 4).map((page) => (
                    <div key={page.id} className="aspect-[3/4] bg-gray-800 rounded overflow-hidden">
                      <img
                        src={page.image_url}
                        alt={`Page ${page.page_number}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => navigate(`/volume-reader/${volumeId}?page=${page.page_number}`)}
                      />
                    </div>
                  ))}
                  {volumePages.length > 4 && (
                    <div className="aspect-[3/4] bg-gray-800 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-sm">+{volumePages.length - 4} more</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Volume Details */}
          <div className="space-y-6">
            {/* Volume Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-red-600 text-white">
                  Vol. {volume.volume_number}
                </Badge>
                {volume.is_new && (
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    New
                  </Badge>
                )}
                {volume.is_on_sale && (
                  <Badge variant="secondary" className="bg-orange-600 text-white">
                    On Sale
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-2">
                {volume.title.includes(',') && volume.title.includes('Vol.') 
                  ? volume.title.split(',')[0] 
                  : volume.title}
              </h1>
              
              {parentBook && (
                <p className="text-gray-400 mb-4">
                  Part of: <span className="text-white">{parentBook.title}</span>
                </p>
              )}
              
              <p className="text-gray-300 text-lg mb-4">{volume.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-white">${volume.price}</span>
              {volume.original_price && volume.original_price > volume.price && (
                <span className="text-xl text-gray-400 line-through">${volume.original_price}</span>
              )}
            </div>

            {/* Volume Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <BookOpen className="w-4 h-4" />
                <span>{volumePages.length} Pages</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-4 h-4" />
                <span>Available</span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {volume.stock_quantity > 0 ? (
                <span className="text-green-400 font-semibold">In Stock ({volume.stock_quantity} available)</span>
              ) : (
                <span className="text-red-400 font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-white font-semibold">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="text-white w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= volume.stock_quantity}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {volumePages.length > 0 && (
                <Button
                  onClick={handleReadNow}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
                  size="lg"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read Now
                </Button>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={volume.stock_quantity <= 0}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                
                <Button
                  onClick={handlePurchaseNow}
                  disabled={volume.stock_quantity <= 0}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                >
                  Purchase Now
                </Button>
              </div>
              
              <Button
                onClick={handleWishlistToggle}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VolumeDetail;
