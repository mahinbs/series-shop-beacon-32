import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Book as BookType } from '@/services/database';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Eye, Heart, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { removeVolumeFromTitle } from '@/lib/utils';

const PopularRecommendations = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  useEffect(() => {
    const fetchPopularBooks = async () => {
      setIsLoading(true);
      try {
        // Fetch popular books - you can modify this query based on your popularity criteria
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(6);

        if (error) {
          console.error("Error fetching popular books:", error);
          toast({
            title: "Error",
            description: "Failed to load popular recommendations.",
            variant: "destructive",
          });
        }

        if (data) {
          // Deduplicate books by removing volume information from titles
          const deduplicatedBooks = data.reduce((acc: any[], book: any) => {
            const baseTitle = removeVolumeFromTitle(book.title);
            const existingBook = acc.find(b => removeVolumeFromTitle(b.title) === baseTitle);
            
            if (!existingBook) {
              acc.push(book);
            }
            return acc;
          }, []);
          
          setBooks(deduplicatedBooks);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularBooks();
  }, []);

  const handleAddToCart = async (book: BookType) => {
    try {
      if (!book?.id) {
        toast({
          title: "Error",
          description: "This book does not have a valid ID.",
          variant: "destructive",
        });
        return;
      }

      const normalizeProductType = (t: any) =>
        (['book', 'merchandise', 'digital', 'other'].includes(t) ? t : 'book') as 'book' | 'merchandise' | 'digital' | 'other';

      await addToCart({
        id: book.id,
        title: book.title,
        author: book.author || undefined,
        price: Number(book.price),
        imageUrl: book.image_url,
        category: book.category,
        product_type: normalizeProductType(book.product_type),
        inStock: true,
        coins: (book as any).coins || undefined,
        canUnlockWithCoins: book.can_unlock_with_coins || undefined,
      });
      toast({
        title: "Added to Cart!",
        description: `${book.title} added to cart!`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewProduct = (book: BookType) => {
    navigate(`/product/${book.id}`);
  };

  return (
    <section 
      ref={elementRef}
      className={`relative bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 py-16 overflow-hidden transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-1000 delay-200 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-orange-500/20 to-red-500/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-500" />
            </div>
            <h2 className="text-4xl font-bold text-white">
              <span className="bg-gradient-to-r from-orange-600 via-red-500 to-red-400 bg-clip-text text-transparent">
                Popular Recommendations
              </span>
            </h2>
            <div className="p-2 bg-gradient-to-br from-red-500/20 to-orange-500/30 rounded-lg">
              <Star className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <p className="text-gray-400 text-lg">Discover what's trending and loved by readers</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <div className="text-white text-lg">Loading popular recommendations...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book, index) => (
              <div 
                key={book.id} 
                className={`group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 min-h-[580px] transition-all duration-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 hover:border-orange-500/30 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                onMouseEnter={() => setHoveredBook(book.id)}
                onMouseLeave={() => setHoveredBook(null)}
                style={{ 
                  transitionDelay: `${400 + index * 150}ms`,
                  opacity: 1,
                  transform: 'translateY(0)'
                }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={book.image_url || '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png'} 
                    alt={book.title}
                    className="w-full h-96 object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-110"
                  />
                  
                  {/* Popular badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      POPULAR
                    </span>
                  </div>

                  {/* Additional badges */}
                  <div className="absolute top-3 right-3 space-y-2 z-10">
                    {book.is_new && (
                      <span className="bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        NEW
                      </span>
                    )}
                    {book.is_on_sale && (
                      <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        SALE
                      </span>
                    )}
                  </div>

                  {/* Hover overlay with action buttons */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewProduct(book)}
                        className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleAddToCart(book)}
                        className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <button 
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                        title="Add to Favorites"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Enhanced hover overlay with book details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                    <div className="text-white space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-lg font-bold text-orange-300">{book.title}</h3>
                      {book.author && (
                        <p className="text-sm text-gray-300">by {book.author}</p>
                      )}
                      <p className="text-xs text-gray-400 uppercase tracking-wide">{book.category || 'General'}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">${book.price}</span>
                        {book.original_price && (
                          <span className="text-sm text-gray-400 line-through">${book.original_price}</span>
                        )}
                      </div>
                      {book.description && (
                        <p className="text-xs text-gray-300 line-clamp-2 mt-2">{book.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <h3 className="text-white font-semibold text-lg group-hover:text-orange-300 transition-colors duration-300 line-clamp-2">
                    {removeVolumeFromTitle(book.title)}
                  </h3>
                  
                  {book.author && (
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                      by {book.author}
                    </p>
                  )}
                  
                  <p className="text-orange-400 text-xs font-semibold uppercase tracking-wide">
                    {book.category || 'General'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-bold text-xl">${book.price}</span>
                      {book.original_price && (
                        <span className="text-gray-500 line-through text-sm">${book.original_price}</span>
                      )}
                    </div>
                    {book.can_unlock_with_coins && (
                      <span className="text-gray-400 text-xs">
                        {book.coins || `${Math.round(book.price * 100)} coins`}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 pt-2 mt-auto">
                    <button 
                      onClick={() => handleAddToCart(book)}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-sm font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 transform hover:scale-105"
                    >
                      <ShoppingCart className="w-4 h-4 inline mr-2" />
                      Add to Cart
                    </button>
                    
                    <button 
                      onClick={() => handleViewProduct(book)}
                      className="w-full bg-white hover:bg-gray-100 text-black text-sm font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                    >
                      View Details
                    </button>
                    
                    {book.can_unlock_with_coins && (
                      <button className="w-full text-gray-400 hover:text-white text-sm border border-gray-600 hover:border-gray-400 py-3 rounded-lg transition-all duration-300 hover:bg-gray-800">
                        Unlock with {book.coins || `${Math.round(book.price * 100)} coins`}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {books.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-white text-lg">No popular recommendations available</div>
            <div className="text-gray-400 text-sm mt-2">Check back soon for trending items!</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularRecommendations;
