import { useState } from 'react';
import { useBooks } from '@/hooks/useBooks';
import { Heart, ShoppingCart, Eye } from 'lucide-react';

const SimpleProductGrid = () => {
  const { books, isLoading } = useBooks();
  const [activeSection, setActiveSection] = useState('best-sellers');
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);

  // Filter books based on selected section
  const getFilteredBooks = () => {
    if (!books || books.length === 0) return [];
    return books.filter(book => book.section_type === activeSection);
  };

  const filteredBooks = getFilteredBooks();

  // Show loading state
  if (isLoading) {
    return (
      <section className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-12 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="text-white text-lg">Loading books...</div>
        </div>
      </section>
    );
  }

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
          </div>
          <button className="text-red-500 hover:text-red-400 text-sm font-medium">
            View All
          </button>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book, index) => (
              <div 
                key={book.id} 
                className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 min-h-[560px] transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 hover:scale-105"
                onMouseEnter={() => setHoveredBook(book.id)}
                onMouseLeave={() => setHoveredBook(null)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={hoveredBook === book.id && book.hover_image_url ? book.hover_image_url : book.image_url} 
                    alt={book.title}
                    className="w-full h-96 object-cover transition-all duration-500 ease-in-out"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 space-y-2 z-10">
                    {book.is_new && (
                      <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        NEW
                      </span>
                    )}
                    {book.is_on_sale && (
                      <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
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
                </div>
                
                <div className="p-3 space-y-3 flex-1 flex flex-col">
                  <h3 className="text-white font-semibold text-lg">{book.title}</h3>
                  <p className="text-gray-400 text-sm">{book.author}</p>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">{book.category}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-bold text-lg">${book.price}</span>
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
                    <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold py-2 rounded transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30">
                      Add to Cart
                    </button>
                    <button className="w-full bg-white hover:bg-gray-100 text-black text-xs py-2 rounded transition-all duration-300 hover:shadow-lg">
                      Buy Now
                    </button>
                    {book.can_unlock_with_coins && (
                      <button className="w-full text-gray-400 hover:text-white text-xs border border-gray-600 hover:border-gray-400 py-2 rounded transition-all duration-300">
                        Unlock with {book.coins || `${Math.round(book.price * 100)} coins`}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-white text-lg">No books in "{activeSection.replace('-', ' ')}" section</div>
              <div className="text-gray-400 text-sm mt-2">
                Total books available: {books?.length || 0}
              </div>
              {books && books.length > 0 && (
                <div className="text-gray-400 text-sm mt-1">
                  Available sections: {books.map(b => b.section_type).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Debug Information */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h4 className="text-white font-semibold mb-2">Debug Information:</h4>
          <p className="text-gray-300 text-sm">Active section: {activeSection}</p>
          <p className="text-gray-300 text-sm">Total books: {books?.length || 0}</p>
          <p className="text-gray-300 text-sm">Books in current section: {filteredBooks.length}</p>
          {books && books.length > 0 && (
            <p className="text-gray-300 text-sm">
              Book sections: {books.map(book => `${book.title} (${book.section_type})`).join(', ')}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SimpleProductGrid;