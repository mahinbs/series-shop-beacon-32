import { useState } from 'react';
import { useBooks } from '@/hooks/useBooks';
import { useCart } from '@/hooks/useCart';
import { Heart, ShoppingCart, Eye, BookOpen, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SimpleProductGrid = () => {
  const { books, isLoading, error } = useBooks();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'books' | 'merchandise'>('books');
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
    }
    
    // If "all" is selected, show all products of the selected type
    if (activeSection === 'all') {
      return filteredProducts;
    }
    
    // Filter by section
    const sectionProducts = filteredProducts.filter(product => product.section_type === activeSection);
    
    // If no products in current section, show all products of the selected type for debugging
    if (sectionProducts.length === 0 && filteredProducts.length > 0) {
      return filteredProducts;
    }
    
    return sectionProducts;
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
    // First add to cart
    handleAddToCart(product);
    
    // Then navigate to cart
    navigate('/cart');
  };

  return (
    <section className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-12 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Product Type Tabs */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex space-x-4 bg-gray-800 p-1 rounded-lg">
            <button 
              onClick={() => {
                setActiveTab('books');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
                activeTab === 'books' 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Books
            </button>
            <button 
              onClick={() => {
                setActiveTab('merchandise');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
                activeTab === 'merchandise' 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Merchandise
            </button>
          </div>
        </div>

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
                All {activeTab === 'books' ? 'Books' : 'Merchandise'}
              </button>
            )}
          </div>
          <button className="text-red-500 hover:text-red-400 text-sm font-medium">
            View All
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 min-h-[560px] transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 hover:scale-105"
                onMouseEnter={() => setHoveredBook(product.id)}
                onMouseLeave={() => setHoveredBook(null)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={hoveredBook === product.id && product.hover_image_url ? product.hover_image_url : product.image_url} 
                    alt={product.title}
                    className="w-full h-96 object-cover transition-all duration-500 ease-in-out"
                  />
                  
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
                  <h3 className="text-white font-semibold text-lg">{product.title}</h3>
                  {activeTab === 'books' && product.author && (
                    <p className="text-gray-400 text-sm">{product.author}</p>
                  )}
                  <p className="text-gray-500 text-xs uppercase tracking-wide">{product.category}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-bold text-lg">${product.price}</span>
                      {product.original_price && (
                        <span className="text-gray-500 line-through text-sm">${product.original_price}</span>
                      )}
                    </div>
                    {product.can_unlock_with_coins && (
                      <span className="text-gray-400 text-xs">
                        {product.coins || `${Math.round(product.price * 100)} coins`}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 pt-2 mt-auto">
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold py-2 rounded transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30"
                    >
                      <ShoppingCart className="w-3 h-3 inline mr-1" />
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => handleBuyNow(product)}
                      className="w-full bg-white hover:bg-gray-100 text-black text-xs py-2 rounded transition-all duration-300 hover:shadow-lg"
                    >
                      Buy Now
                    </button>
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
                Total {activeTab} available: {books?.filter(book => (book.product_type || 'book') === (activeTab === 'books' ? 'book' : 'merchandise')).length || 0}
              </div>
              {books && books.length > 0 && (
                <div className="text-gray-400 text-sm mt-1">
                  Available sections: {books.filter(book => (book.product_type || 'book') === (activeTab === 'books' ? 'book' : 'merchandise')).map(b => b.section_type).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
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
                    View All {activeTab === 'books' ? 'Books' : 'Merchandise'} ({books.filter(book => (book.product_type || 'book') === (activeTab === 'books' ? 'book' : 'merchandise')).length})
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