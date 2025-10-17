import { useState } from 'react';
import { useBooks } from '@/hooks/useBooks';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { Heart, ShoppingCart, Eye, Diamond, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { removeVolumeFromTitle } from '@/lib/utils';
import { ChapterService } from '@/services/chapterService';

const SimpleProductGrid = () => {
  const { books, isLoading, error } = useBooks();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'books' | 'merchandise' | 'print'>('books');
  const [activeSection, setActiveSection] = useState('new-releases');
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);

  // Filter products based on selected section and tab
  const getFilteredProducts = () => {
    if (!books || books.length === 0) return [];
    
    // Filter by product type first
    let filteredProducts = books;
    if (activeTab === 'books') {
      filteredProducts = books.filter(book => (book.product_type || 'book') === 'book');
    } else if (activeTab === 'merchandise') {
      filteredProducts = books.filter(book => (book.product_type || 'book') === 'merchandise');
    } else if (activeTab === 'print') {
      filteredProducts = books.filter(book => (book.product_type || 'book') === 'print');
    }
    
    // If "all" is selected, show all products of the selected type (deduplicated)
    if (activeSection === 'all') {
      const deduplicatedProducts = filteredProducts.reduce((acc: any[], product: any) => {
        const baseTitle = removeVolumeFromTitle(product.title);
        const existingProduct = acc.find(p => removeVolumeFromTitle(p.title) === baseTitle);
        
        if (!existingProduct) {
          acc.push(product);
        }
        return acc;
      }, []);
      
      return deduplicatedProducts;
    }
    
    // Filter by section
    const sectionProducts = filteredProducts.filter(product => product.section_type === activeSection);
    
    // If no products in current section, show all products of the selected type for debugging (deduplicated)
    if (sectionProducts.length === 0 && filteredProducts.length > 0) {
      const deduplicatedProducts = filteredProducts.reduce((acc: any[], product: any) => {
        const baseTitle = removeVolumeFromTitle(product.title);
        const existingProduct = acc.find(p => removeVolumeFromTitle(p.title) === baseTitle);
        
        if (!existingProduct) {
          acc.push(product);
        }
        return acc;
      }, []);
      
      return deduplicatedProducts;
    }
    
    // Deduplicate products by removing volume information from titles
    const deduplicatedProducts = sectionProducts.reduce((acc: any[], product: any) => {
      const baseTitle = removeVolumeFromTitle(product.title);
      const existingProduct = acc.find(p => removeVolumeFromTitle(p.title) === baseTitle);
      
      if (!existingProduct) {
        acc.push(product);
      }
      return acc;
    }, []);
    
    return deduplicatedProducts;
  };

  const filteredProducts = getFilteredProducts();

  // Show loading state
  if (isLoading) {
    return (
      <section className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-12 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="text-white text-lg">Loading products...</div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-12 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-400 text-lg">Error loading products: {error}</div>
        </div>
      </section>
    );
  }

  const handleAddToCart = (product: any) => {
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
  };

  const handleBuyNow = (product: any) => {
    // Navigate directly to direct checkout with product details
    navigate(`/direct-checkout/${product.id}`, {
      state: {
        product: {
          id: product.id,
          title: product.title,
          author: product.author,
          price: product.price,
          imageUrl: product.image_url || product.imageUrl,
          category: product.category || 'General',
          product_type: product.product_type || 'book',
          inStock: true
        },
        quantity: 1,
        totalPrice: product.price
      }
    });
  };

  const handleViewProduct = (product: any) => {
    navigate(`/product/${product.id}`);
  };

  const handleWishlistToggle = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.title} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        product_id: product.id,
        title: product.title,
        author: product.author || "Unknown Author",
        price: typeof product.price === 'string' ? parseFloat(product.price.replace('$', '')) : product.price,
        originalPrice: product.original_price ? (typeof product.original_price === 'string' ? parseFloat(product.original_price.replace('$', '')) : product.original_price) : undefined,
        imageUrl: product.image_url,
        category: product.category,
        product_type: (product.product_type as 'book' | 'merchandise') || 'book',
        inStock: product.is_active !== false,
        volume: product.volume_number,
      });
      toast({
        title: "Added to Wishlist",
        description: `${product.title} has been added to your wishlist.`,
      });
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-12 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">

        {/* Section Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-6">
            <button 
              onClick={() => setActiveSection('new-releases')}
              className={`font-semibold pb-2 transition-all duration-300 ${
                activeSection === 'new-releases' ? 'text-red-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              New Releases
            </button>
            <button 
              onClick={() => setActiveSection('best-sellers')}
              className={`font-semibold pb-2 transition-all duration-300 ${
                activeSection === 'best-sellers' ? 'text-red-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              Best Sellers
            </button>
            <button 
              onClick={() => setActiveSection('leaving-soon')}
              className={`font-semibold pb-2 transition-all duration-300 ${
                activeSection === 'leaving-soon' ? 'text-red-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              Leaving Soon
            </button>
            {books && books.length > 0 && filteredProducts.length === 0 && (
              <button 
                onClick={() => setActiveSection('all')}
                className={`font-semibold pb-2 transition-all duration-300 ${
                  activeSection === 'all' ? 'text-red-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                All {activeTab === 'books' ? 'Books' : activeTab === 'print' ? 'Print Books' : 'Merchandise'}
              </button>
            )}
          </div>
          <button 
            onClick={() => window.location.href = '/shop-all'}
            className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors duration-200"
          >
            View All
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 min-h-[560px] transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 hover:scale-105 cursor-pointer"
                onMouseEnter={() => setHoveredBook(product.id)}
                onMouseLeave={() => setHoveredBook(null)}
                onClick={() => handleViewProduct(product)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image_url || '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png'} 
                    alt={product.title}
                    className="w-full h-96 object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                  />
                  
                  {/* Subtle hover overlay to indicate clickability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Enhanced hover overlay with book details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                    <div className="text-white space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-lg font-bold text-red-300">{removeVolumeFromTitle(product.title)}</h3>
                      {product.author && (
                        <p className="text-sm text-gray-300">by {product.author}</p>
                      )}
                      <p className="text-xs text-gray-400 uppercase tracking-wide">{product.category}</p>
                      {/* Only show price for print products */}
                      {product.product_type === 'print' && (
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-white">${product.price}</span>
                          {product.original_price && (
                            <span className="text-sm text-gray-400 line-through">${product.original_price}</span>
                          )}
                        </div>
                      )}
                      {product.description && (
                        <p className="text-xs text-gray-300 line-clamp-2 mt-2">{product.description}</p>
                      )}
                      <div className="flex space-x-2 mt-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleViewProduct(product); }}
                          className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* Only show Add to Cart for print products */}
                        {product.product_type === 'print' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                            title="Add to Cart"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 space-y-2 z-10">
                    {product.is_new && (
                      <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        NEW
                      </span>
                    )}
                    {product.is_on_sale && (
                      <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        SALE
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  {product.label && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                      {product.label}
                    </div>
                  )}
                </div>
                
                <div className="p-3 space-y-3 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-lg flex-1 mr-2">{removeVolumeFromTitle(product.title)}</h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(product);
                      }}
                      className={`transition-all duration-300 transform hover:scale-110 w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full ${
                        isInWishlist(product.id)
                          ? "text-red-500 hover:text-red-400 hover:bg-red-500/20"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                      }`}
                      title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Diamond className={`w-4 h-4 transition-transform duration-300 ${
                        isInWishlist(product.id)
                          ? "fill-current animate-pulse"
                          : "group-hover:animate-pulse"
                      }`} />
                    </button>
                  </div>
                  {activeTab === 'books' && product.author && (
                    <p className="text-gray-400 text-sm">{product.author}</p>
                  )}
                  <p className="text-gray-500 text-xs uppercase tracking-wide">{product.category}</p>
                  
                  {/* Only show price for print products and merchandise */}
                  {(product.product_type === 'print' || product.product_type === 'merchandise') && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-bold text-lg">${product.price}</span>
                        {product.original_price && (
                          <span className="text-gray-500 line-through text-sm">${product.original_price}</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Show coins for digital products that can be unlocked */}
                  {product.product_type !== 'print' && product.product_type !== 'merchandise' && product.can_unlock_with_coins && (
                    <div className="text-gray-400 text-xs">
                      {product.coins || `${Math.round(product.price * 100)} coins`}
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-2 pt-2 mt-auto">
                    {/* Digital books: Show Read Now button */}
                    {product.product_type !== 'print' && product.product_type !== 'merchandise' ? (
                      <button 
                        onClick={async (e) => { 
                          e.stopPropagation();
                          try {
                            // Fetch chapters for this book
                            const chapters = await ChapterService.getBookChapters(product.id);
                            
                            if (chapters && chapters.length > 0) {
                              // Navigate to first chapter
                              const firstChapter = chapters[0];
                              navigate(`/chapter/${firstChapter.id}`);
                            } else {
                              // Show toast if no chapters available
                              toast({
                                title: "No Chapters Available",
                                description: "This book doesn't have any chapters yet. Please check back later.",
                                variant: "destructive",
                              });
                            }
                          } catch (error) {
                            console.error('Error fetching chapters:', error);
                            toast({
                              title: "Error",
                              description: "Failed to load chapters. Please try again.",
                              variant: "destructive",
                            });
                          }
                        }}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold py-2 rounded transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30"
                      >
                        <BookOpen className="w-3 h-3 inline mr-1" />
                        Read Now
                      </button>
                    ) : (
                      /* Print books: Show Add to Cart + Buy Now */
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold py-2 rounded transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30"
                        >
                          <ShoppingCart className="w-3 h-3 inline mr-1" />
                          Add to Cart
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleBuyNow(product); }}
                          className="w-full bg-white hover:bg-gray-100 text-black text-xs py-2 rounded transition-all duration-300 hover:shadow-lg"
                        >
                          Buy Now
                        </button>
                      </>
                    )}
                    {product.can_unlock_with_coins && (
                      <button className="w-full text-gray-400 hover:text-white text-xs border border-gray-600 hover:border-gray-400 py-2 rounded transition-all duration-300">
                        Unlock with {product.coins || `${Math.round(product.price * 100)} coins`}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-white text-lg">No {activeTab} in "{activeSection.replace('-', ' ')}" section</div>
              <div className="text-gray-400 text-sm mt-2">
                Total {activeTab} available: {books?.filter(book => (book.product_type || 'book') === (activeTab === 'books' ? 'book' : activeTab === 'print' ? 'print' : 'merchandise')).length || 0}
              </div>
              {books && books.length > 0 && (
                <div className="text-gray-400 text-sm mt-1">
                  Available sections: {books.filter(book => (book.product_type || 'book') === (activeTab === 'books' ? 'book' : activeTab === 'print' ? 'print' : 'merchandise')).map(b => b.section_type).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                </div>
              )}
              {books && books.length === 0 && (
                <div className="text-gray-400 text-sm mt-1">
                  No {activeTab} found in database. Please add {activeTab} through the admin panel.
                </div>
              )}
              {books && books.length > 0 && (
                <div className="mt-4">
                  <button 
                    onClick={() => setActiveSection('all')}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    View All {activeTab === 'books' ? 'Books' : activeTab === 'print' ? 'Print Books' : 'Merchandise'} ({books.filter(book => (book.product_type || 'book') === (activeTab === 'books' ? 'book' : activeTab === 'print' ? 'print' : 'merchandise')).length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SimpleProductGrid;