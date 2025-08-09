
import { useState } from 'react';
import ProductCard from './ProductCard';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useBooks } from '@/hooks/useBooks';

const ProductGrid = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.1);
  const { books, isLoading, getBooksBySection } = useBooks();
  const [activeSection, setActiveSection] = useState('best-sellers');
  const [showAll, setShowAll] = useState(false);

  // Always render something visible - this ensures the component shows up
  console.log('ProductGrid rendering with:', { 
    booksCount: books?.length || 0, 
    isLoading, 
    activeSection,
    showAll 
  });

  // Transform books data to match ProductCard interface
  const transformBooksToProducts = (booksList: any[]) => {
    return booksList.map(book => ({
      title: book.title,
      author: book.author,
      volume: book.category,
      price: `$${book.price}`,
      originalPrice: book.original_price ? `$${book.original_price}` : undefined,
      coins: book.coins || `${Math.round(book.price * 100)} coins`,
      imageUrl: book.image_url,
      hoverImageUrl: book.hover_image_url,
      isNew: book.is_new,
      isOnSale: book.is_on_sale,
      canUnlockWithCoins: book.can_unlock_with_coins,
      label: book.label || undefined,
    }));
  };

  const getProductsForSection = () => {
    if (!books || books.length === 0) return [];
    
    if (showAll) {
      return transformBooksToProducts(books);
    }
    
    const sectionBooks = getBooksBySection(activeSection);
    return transformBooksToProducts(sectionBooks);
  };

  const products = getProductsForSection();
  
  // Debug logging
  console.log('ProductGrid Debug:', {
    totalBooks: books?.length || 0,
    activeSection,
    showAll,
    booksInActiveSection: books ? getBooksBySection(activeSection).length : 0,
    allBooks: books,
    products: products
  });

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setShowAll(false);
    console.log(`Switched to ${section} section`);
  };

  const handleViewAll = () => {
    setShowAll(true);
    console.log('Showing all products');
  };

  const sectionOrder = ['new-releases', 'best-sellers', 'leaving-soon'];

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

  // Show empty state if no books
  if (!books || books.length === 0) {
    return (
      <section className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-12 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="text-white text-lg">No books available. Add books through the CMS to see them here.</div>
          <div className="text-gray-400 text-sm mt-2">Debug: Total books in database = {books.length}</div>
        </div>
      </section>
    );
  }

  // Show products count for debugging
  if (products.length === 0) {
    return (
      <section className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-12 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="text-white text-lg">No products to display in "{activeSection}" section</div>
          <div className="text-gray-400 text-sm mt-2">
            Debug: Total books = {books.length}, Active section = {activeSection}
          </div>
          <div className="text-gray-400 text-sm">
            Available sections: {books.map(b => b.section_type).join(', ')}
          </div>
          <div className="mt-4">
            <button 
              onClick={() => setActiveSection('best-sellers')} 
              className="bg-red-600 text-white px-4 py-2 rounded mr-2"
            >
              Try Best Sellers
            </button>
            <button 
              onClick={() => setShowAll(true)} 
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Show All Books
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={elementRef}
      className={`relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-12 overflow-hidden transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Navigation with proper spacing */}
        <div className={`flex items-center justify-between mb-8 transition-all duration-1000 delay-200 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <div className="flex space-x-6">
            {sectionOrder.map((section) => {
              const labels = {
                'new-releases': 'New Releases',
                'best-sellers': 'Best Sellers', 
                'leaving-soon': 'Leaving Soon'
              };
              
              return (
                <button 
                  key={section}
                  onClick={() => handleSectionChange(section)}
                  className={`group relative font-semibold pb-2 transform hover:scale-105 transition-all duration-300 ${
                    activeSection === section ? 'text-red-500' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{labels[section]}</span>
                  <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-red-600 transform transition-transform duration-300 ${
                    activeSection === section ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></div>
                  {activeSection === section && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-400 blur-sm"></div>
                  )}
                </button>
              );
            })}
          </div>
          <button 
            onClick={handleViewAll}
            className="group text-red-500 hover:text-red-400 text-sm font-medium transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <span>View All</span>
          </button>
        </div>

        {/* Product Grid with improved spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className={`group transition-all duration-1000 transform hover:scale-105 hover:-translate-y-3 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ 
                transitionDelay: `${400 + index * 150}ms`,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }}
            >
              <div className="relative">
                <ProductCard {...product} />
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
