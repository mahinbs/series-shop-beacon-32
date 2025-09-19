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
  const [selectedFilter, setSelectedFilter] = useState<'digital' | 'print' | 'merchandise'>('digital');
  const [activeTab, setActiveTab] = useState<'recommendations' | 'genres'>('recommendations');
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

  const handleGenreClick = (genreName: string) => {
    // Navigate to shop page with genre filter
    navigate(`/shop-all?genre=${genreName.toLowerCase()}`);
  };

  // Sample genre data with books
  const genreSections = [
    {
      name: 'SLICE OF LIFE',
      books: [
        { title: 'Tokyo Ghoul Vol. 14', author: 'Sui Ishida', price: '$12.99', coins: '1299 coins', type: 'digital' },
        { title: 'Demon Slayer Tanjiro Figure', author: 'Koyoharu Gotouge', price: '$49.99', coins: '4999 coins', type: 'merchandise' },
        { title: 'Naruto Vol. 72', author: 'Masashi Kishimoto', price: '$9.99', coins: '999 coins', type: 'digital' },
        { title: 'My Hero Academia Vol. 35', author: 'Kohei Horikoshi', price: '$11.99', coins: '1199 coins', type: 'digital' }
      ]
    },
    {
      name: 'DRAMA',
      books: [
        { title: 'Tokyo Ghoul Vol. 14', author: 'Sui Ishida', price: '$12.99', coins: '1299 coins', type: 'merchandise' },
        { title: 'Demon Slayer Tanjiro Figure', author: 'Koyoharu Gotouge', price: '$49.99', coins: '4999 coins', type: 'digital' },
        { title: 'Naruto Vol. 72', author: 'Masashi Kishimoto', price: '$9.99', coins: '999 coins', type: 'digital' },
        { title: 'My Hero Academia Vol. 35', author: 'Kohei Horikoshi', price: '$11.99', coins: '1199 coins', type: 'digital' }
      ]
    }
  ];

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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`text-4xl font-bold transition-all duration-300 ${
                  activeTab === 'recommendations'
                    ? 'bg-gradient-to-r from-orange-600 via-red-500 to-red-400 bg-clip-text text-transparent'
                    : 'text-gray-400 hover:text-orange-400'
                }`}
              >
                Popular Recommendations
              </button>
              <span className="text-white text-4xl">|</span>
              <button
                onClick={() => setActiveTab('genres')}
                className={`text-4xl font-bold transition-all duration-300 ${
                  activeTab === 'genres'
                    ? 'text-red-400 underline'
                    : 'text-gray-400 hover:text-red-400'
                }`}
              >
                Genres
              </button>
            </div>
            <div className="p-2 bg-gradient-to-br from-red-500/20 to-orange-500/30 rounded-lg">
              <Star className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <p className="text-gray-400 text-lg">
            {activeTab === 'recommendations' ? 'Discover trending books and series' : 'Discover your favorite genres'}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedFilter('digital')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
              selectedFilter === 'digital'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Digital
          </button>
          <button
            onClick={() => setSelectedFilter('print')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
              selectedFilter === 'print'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Print
          </button>
          <button
            onClick={() => setSelectedFilter('merchandise')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
              selectedFilter === 'merchandise'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Merchandise
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <div className="text-white text-lg">Loading popular recommendations...</div>
          </div>
        ) : activeTab === 'recommendations' ? (
          <div className="space-y-12">
            {genreSections.map((genre, genreIndex) => (
              <div key={genre.name} className="space-y-6">
                {/* Genre Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-white">{genre.name}</h3>
                  <button 
                    onClick={() => handleGenreClick(genre.name)}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    View All
                  </button>
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {genre.books.map((book, bookIndex) => (
                    <div 
                      key={`${genre.name}-${bookIndex}`}
                      className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 min-h-[400px] transition-all duration-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 hover:border-orange-500/30"
                      onMouseEnter={() => setHoveredBook(`${genre.name}-${bookIndex}`)}
                      onMouseLeave={() => setHoveredBook(null)}
                    >
                      <div className="relative overflow-hidden">
                        <img 
                          src="/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png" 
                          alt={book.title}
                          className="w-full h-64 object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-110"
                        />
                        
                        {/* Type Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-lg ${
                            book.type === 'digital' ? 'bg-red-600 text-white' :
                            book.type === 'merchandise' ? 'bg-gray-600 text-white' :
                            'bg-blue-600 text-white'
                          }`}>
                            {book.type === 'digital' ? 'Digital' : 
                             book.type === 'merchandise' ? 'Merchandise' : 'Print'}
                          </span>
                        </div>

                        {/* Hover overlay with action buttons */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewProduct(book as any)}
                              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleAddToCart(book as any)}
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
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <h4 className="text-white font-semibold text-lg group-hover:text-orange-300 transition-colors duration-300 line-clamp-2">
                          {book.title}
                        </h4>
                        
                        <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                          by {book.author}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-bold text-xl">{book.price}</span>
                          </div>
                          <span className="text-gray-400 text-xs">
                            {book.coins}
                          </span>
                        </div>
                        
                        <button 
                          onClick={() => handleAddToCart(book as any)}
                          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-sm font-semibold py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30"
                        >
                          <ShoppingCart className="w-4 h-4 inline mr-2" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Genres Tab Content */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              { name: 'Action', count: 24, color: 'from-red-500 to-red-600', books: 156 },
              { name: 'Romance', count: 18, color: 'from-pink-500 to-pink-600', books: 98 },
              { name: 'Fantasy', count: 15, color: 'from-purple-500 to-purple-600', books: 87 },
              { name: 'Sci-Fi', count: 12, color: 'from-blue-500 to-blue-600', books: 65 },
              { name: 'Horror', count: 9, color: 'from-gray-600 to-gray-700', books: 43 },
              { name: 'Comedy', count: 7, color: 'from-yellow-500 to-yellow-600', books: 32 },
              { name: 'Drama', count: 6, color: 'from-green-500 to-green-600', books: 28 },
              { name: 'Adventure', count: 5, color: 'from-orange-500 to-orange-600', books: 21 }
            ].map((genre, index) => (
              <div 
                key={genre.name}
                className="group cursor-pointer bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700/50 p-6 hover:border-orange-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20"
                onClick={() => handleGenreClick(genre.name)}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${genre.color}`}></div>
                    <h3 className="text-white font-bold text-lg">{genre.name}</h3>
                  </div>
                  <span className="text-gray-400 text-sm">{genre.count} series</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Books available</span>
                    <span className="text-white font-semibold">{genre.books}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${genre.color} transition-all duration-500`}
                      style={{ width: `${(genre.count / 24) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30">
                    Explore {genre.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {books.length === 0 && !isLoading && activeTab === 'recommendations' && (
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