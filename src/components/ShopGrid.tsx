import React from 'react';
import { useState, useEffect } from 'react';
import type { Book } from '@/services/database';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useBooks } from '@/hooks/useBooks';
import { toast } from 'sonner';
import { removeVolumeFromTitle } from '@/lib/utils';

interface ShopGridProps {
  category?: string;
  sectionType?: string;
  searchTerm?: string;
  appliedFilters?: string[];
  sortBy?: string;
}

const ShopGrid: React.FC<ShopGridProps> = ({ category, sectionType, searchTerm, appliedFilters = [], sortBy = 'Newest First' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(12);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  const { books, isLoading, error } = useBooks();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    let filtered = [...books];
    
    // Apply category filter
    if (category) {
      filtered = filtered.filter(book => book.category === category);
    }
    
    // Apply section type filter
    if (sectionType) {
      filtered = filtered.filter(book => book.section_type === sectionType);
    }
    
    // Apply search filter
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchLower) ||
        book.author?.toLowerCase().includes(searchLower) ||
        book.category?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply other filters
    if (appliedFilters.length > 0) {
      filtered = filtered.filter(book => 
        appliedFilters.some(filter => 
          book.category?.toLowerCase().includes(filter.toLowerCase()) ||
          book.title.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'A-Z':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Z-A':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'Newest First':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'Oldest First':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'Price: Low to High':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    
    // Deduplicate books by removing volume information from titles
    const deduplicatedBooks = filtered.reduce((acc: Book[], book: Book) => {
      const baseTitle = removeVolumeFromTitle(book.title);
      const existingBook = acc.find(b => removeVolumeFromTitle(b.title) === baseTitle);
      
      if (!existingBook) {
        acc.push(book);
      }
      return acc;
    }, []);
    
    setFilteredBooks(deduplicatedBooks);
  }, [books, category, sectionType, searchTerm, appliedFilters, sortBy]);

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const normalizeProductType = (t: any) =>
    (['book', 'merchandise', 'digital', 'other'].includes(t) ? t : 'book') as 'book' | 'merchandise' | 'digital' | 'other';

  // Wherever addToCart is called, ensure product_type is normalized:
  // Example: addToCart({ ...product, product_type: normalizeProductType(product.product_type) })

  return (
    <div className="container mx-auto py-8">
      {isLoading && <div className="text-center text-white">Loading books...</div>}
      {error && <div className="text-red-500 text-center">Error: {error}</div>}
      
      {filteredBooks.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No books found</p>
          <p className="text-gray-500 text-sm mt-2">
            {searchTerm || appliedFilters.length > 0 ? 'Try adjusting your search or filters' : 'No books available in the database'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {currentBooks.map((product, index) => (
          <div 
            key={product.id} 
            className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 min-h-[560px] transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-2 cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
            style={{ 
              transitionDelay: `${index * 100}ms`,
              opacity: 1,
              transform: 'translateY(0)'
            }}
          >
            <div className="relative overflow-hidden">
              <img
                src={product.image_url || '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png'}
                alt={product.title}
                className="w-full h-96 object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 space-y-2 z-10">
                {product.is_new && (
                  <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                    NEW
                  </span>
                )}
                {product.is_on_sale && (
                  <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                    SALE
                  </span>
                )}
              </div>

              {/* Label */}
              {product.label && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg max-w-[120px] text-center">
                  {product.label}
                </div>
              )}

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
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">${product.price}</span>
                    {product.original_price && (
                      <span className="text-sm text-gray-400 line-through">${product.original_price}</span>
                    )}
                  </div>
                  {product.description && (
                    <p className="text-xs text-gray-300 line-clamp-2 mt-2">{product.description}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-red-400 text-xs font-semibold uppercase tracking-wide">{product.category || 'General'}</span>
              </div>
              
              <h3 className="text-white font-semibold text-lg truncate group-hover:text-red-300 transition-colors duration-300">
                {removeVolumeFromTitle(product.title)}
              </h3>
              
              {product.author && (
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                  by {product.author}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-bold text-xl">${product.price}</span>
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
              
              <div className="flex items-center justify-between pt-2">
                <div className="text-gray-400 text-xs">
                  {product.section_type || 'Book'}
                </div>
                <button 
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      id: product.id,
                      title: product.title,
                      author: product.author || undefined,
                      price: Number(product.price),
                      imageUrl: product.image_url,
                      category: product.category,
                      product_type: normalizeProductType(product.product_type),
                      inStock: true,
                      coins: (product as any).coins || undefined,
                      canUnlockWithCoins: product.can_unlock_with_coins || undefined,
                    });
                    toast.success(`${removeVolumeFromTitle(product.title)} added to cart!`);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredBooks.length > booksPerPage && (
        <div className="flex justify-center mt-8">
          {Array.from({ length: Math.ceil(filteredBooks.length / booksPerPage) }, (_, i) => i + 1).map(number => (
            <button key={number} onClick={() => paginate(number)} className={`mx-1 px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              {number}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopGrid;
