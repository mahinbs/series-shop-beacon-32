import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Book as BookType } from '@/services/database';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Eye, Heart, Diamond } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { removeVolumeFromTitle } from '@/lib/utils';

const RecommendedSection = (props: any) => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('section_type', 'new-releases')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(5);

        if (error) {
          console.error("Error fetching books:", error);
          toast({
            title: "Error",
            description: "Failed to load recommended books.",
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

    fetchBooks();
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

  const handleBuyNow = (book: BookType) => {
    // Navigate directly to direct checkout with product details
    const productId = book.id || `${book.title.replace(/\s+/g, '-').toLowerCase()}-${book.author?.replace(/\s+/g, '-').toLowerCase()}`;
    navigate(`/direct-checkout/${productId}`, {
      state: {
        product: {
          id: productId,
          title: book.title,
          author: book.author,
          price: Number(book.price),
          originalPrice: book.original_price,
          imageUrl: book.image_url,
          category: book.category || 'General',
          product_type: 'book' as const,
          inStock: true
        },
        quantity: 1,
        totalPrice: Number(book.price)
      }
    });
  };

  const handleViewProduct = (book: BookType) => {
    navigate(`/product/${book.id}`);
  };

  const handleWishlistToggle = (book: BookType) => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
      toast({
        title: "Removed from Wishlist",
        description: `${book.title} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        product_id: book.id,
        title: book.title,
        author: book.author || "Unknown Author",
        price: Number(book.price),
        originalPrice: book.original_price ? Number(book.original_price) : undefined,
        imageUrl: book.image_url,
        category: book.category,
        product_type: (book.product_type as 'book' | 'merchandise') || 'book',
        inStock: book.stock_quantity ? book.stock_quantity > 0 : true,
        volume: book.volume_number,
      });
      toast({
        title: "Added to Wishlist",
        description: `${book.title} has been added to your wishlist.`,
      });
    }
  };

  const normalizeProductType = (t: any) =>
    (['book', 'merchandise', 'digital', 'other'].includes(t) ? t : 'book') as 'book' | 'merchandise' | 'digital' | 'other';

  return (
    <section className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-16 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 bg-clip-text text-transparent">
              New Releases
            </span>
          </h2>
          <p className="text-gray-400 text-lg">Discover the latest manga and novels</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-white text-lg">Loading new releases...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {books.map((book, index) => (
              <div 
                key={book.id} 
                className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 min-h-[560px] transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-2"
                onMouseEnter={() => setHoveredBook(book.id)}
                onMouseLeave={() => setHoveredBook(null)}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  opacity: 1,
                  transform: 'translateY(0)'
                }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={book.image_url || '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png'} 
                    alt={book.title}
                    className="w-full h-96 object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 space-y-2 z-10">
                    {book.is_new && (
                      <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        NEW
                      </span>
                    )}
                    {book.is_on_sale && (
                      <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        SALE
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  {book.label && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                      {book.label}
                    </div>
                  )}

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
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Enhanced hover overlay with book details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                    <div className="text-white space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-lg font-bold text-red-300">{removeVolumeFromTitle(book.title)}</h3>
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
                
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-lg group-hover:text-red-300 transition-colors duration-300 line-clamp-2 flex-1 mr-2">
                      {removeVolumeFromTitle(book.title)}
                    </h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(book);
                      }}
                      className={`transition-all duration-300 transform hover:scale-110 w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full ${
                        isInWishlist(book.id)
                          ? "text-red-500 hover:text-red-400 hover:bg-red-500/20"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                      }`}
                      title={isInWishlist(book.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Diamond className={`w-4 h-4 transition-transform duration-300 ${
                        isInWishlist(book.id)
                          ? "fill-current animate-pulse"
                          : "group-hover:animate-pulse"
                      }`} />
                    </button>
                  </div>
                  
                  {book.author && (
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                      {book.author}
                    </p>
                  )}
                  
                  <p className="text-red-400 text-xs font-semibold uppercase tracking-wide">
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
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 transform hover:scale-105"
                    >
                      <ShoppingCart className="w-4 h-4 inline mr-2" />
                      Add to Cart
                    </button>
                    
                    <button 
                      onClick={() => handleBuyNow(book)}
                      className="w-full bg-white hover:bg-gray-100 text-black text-sm font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                    >
                      Buy Now
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
            <div className="text-white text-lg">No new releases available</div>
            <div className="text-gray-400 text-sm mt-2">Check back soon for the latest releases!</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedSection;
