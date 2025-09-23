import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Heart, ShoppingCart, BookOpen, Star, Users, Clock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Book } from '@/services/database';

const BookDetail = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  
  const [book, setBook] = useState<Book | null>(null);
  const [volumes, setVolumes] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      setIsLoading(true);
      
      // Fetch the main book
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .eq('is_active', true)
        .or('is_volume.is.null,is_volume.eq.false')
        .single();

      if (bookError) {
        throw bookError;
      }

      setBook(bookData);

      // Fetch volumes for this book
      const { data: volumesData, error: volumesError } = await supabase
        .from('books')
        .select('*')
        .eq('parent_book_id', bookId)
        .eq('is_active', true)
        .eq('is_volume', true)
        .order('volume_number', { ascending: true });

      if (volumesError) {
        console.error('Error fetching volumes:', volumesError);
      } else {
        setVolumes(volumesData || []);
      }

    } catch (err) {
      console.error('Error fetching book details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load book details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (book: Book) => {
    try {
      const cartItem = {
        id: book.id,
        title: book.title,
        author: book.author || 'Unknown Author',
        price: book.price,
        originalPrice: book.original_price,
        imageUrl: book.image_url,
        category: book.category,
        product_type: (book.product_type === 'merchandise' ? 'merchandise' : 'book') as 'book' | 'merchandise',
        inStock: book.is_active !== false,
        coins: book.coins,
        canUnlockWithCoins: book.can_unlock_with_coins || false
      };

      addToCart(cartItem);
      toast({
        title: "Added to cart",
        description: `${book.title} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  const handleWishlistToggle = async (book: Book) => {
    try {
      if (isInWishlist(book.id)) {
        removeFromWishlist(book.id);
        toast({
          title: "Removed from wishlist",
          description: `${book.title} has been removed from your wishlist`,
        });
      } else {
        addToWishlist({
          product_id: book.id,
          title: book.title,
          author: book.author || 'Unknown Author',
          price: book.price,
          originalPrice: book.original_price,
          imageUrl: book.image_url,
          category: book.category,
          product_type: (book.product_type === 'merchandise' ? 'merchandise' : 'book') as 'book' | 'merchandise',
          inStock: book.is_active !== false
        });
        toast({
          title: "Added to wishlist",
          description: `${book.title} has been added to your wishlist`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

  const handleVolumeAddToCart = async (volume: Book) => {
    try {
      const cartItem = {
        id: volume.id,
        title: volume.title,
        author: volume.author || 'Unknown Author',
        price: volume.price,
        originalPrice: volume.original_price,
        imageUrl: volume.image_url,
        category: volume.category,
        product_type: (volume.product_type === 'merchandise' ? 'merchandise' : 'book') as 'book' | 'merchandise',
        inStock: volume.is_active !== false,
        coins: volume.coins,
        canUnlockWithCoins: volume.can_unlock_with_coins || false
      };

      addToCart(cartItem);
      toast({
        title: "Added to cart",
        description: `${volume.title} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">Loading book details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
            <p className="text-gray-400 mb-6">{error || 'The book you are looking for does not exist.'}</p>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button 
          onClick={() => navigate(-1)} 
          variant="ghost" 
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Book Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Book Image */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={book.image_url}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={() => handleAddToCart(book)}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart - ${book.price}
              </Button>
              <Button
                onClick={() => handleWishlistToggle(book)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:border-red-500"
              >
                <Heart className={`w-4 h-4 ${isInWishlist(book.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Book Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{book.title}</h1>
              <p className="text-gray-400 text-lg">by {book.author}</p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {book.is_new && <Badge className="bg-green-600">New</Badge>}
              {book.is_on_sale && <Badge className="bg-red-600">On Sale</Badge>}
              {book.label && <Badge variant="outline">{book.label}</Badge>}
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-white">${book.price}</span>
              {book.original_price && book.original_price > book.price && (
                <span className="text-xl text-gray-400 line-through">${book.original_price}</span>
              )}
            </div>

            {/* Description */}
            {book.description && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-gray-300 leading-relaxed">{book.description}</p>
              </div>
            )}

            {/* Book Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Category:</span>
                <span className="text-white ml-2">{book.category}</span>
              </div>
              <div>
                <span className="text-gray-400">Product Type:</span>
                <span className="text-white ml-2 capitalize">{book.product_type || 'book'}</span>
              </div>
              {book.age_rating && (
                <div>
                  <span className="text-gray-400">Age Rating:</span>
                  <span className="text-white ml-2">{book.age_rating}</span>
                </div>
              )}
              {book.stock_quantity !== null && (
                <div>
                  <span className="text-gray-400">Stock:</span>
                  <span className="text-white ml-2">{book.stock_quantity} available</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Volumes Section */}
        {volumes.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Available Volumes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {volumes.map((volume) => (
                <div
                  key={volume.id}
                  className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
                >
                  <div className="aspect-[3/4] bg-gray-700 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={volume.image_url}
                      alt={volume.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{volume.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">Volume {volume.volume_number}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">${volume.price}</span>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVolumeAddToCart(volume);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                  
                  {volume.description && (
                    <p className="text-gray-300 text-sm mt-3 line-clamp-2">{volume.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BookDetail;
