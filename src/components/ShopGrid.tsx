import React from 'react';
import { useState, useEffect } from 'react';
import type { Book } from '@/services/database';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { Eye } from 'lucide-react'; // Added Eye icon import
import { removeVolumeFromTitle } from '@/lib/utils';

interface ShopGridProps {
  category?: string;
  sectionType?: string;
  searchTerm?: string;
  appliedFilters?: string[];
  sortBy?: string;
}

const ShopGrid: React.FC<ShopGridProps> = ({ category, sectionType, searchTerm, appliedFilters = [], sortBy = 'Newest First' }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(12);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      let url = `/api/books?limit=100`;
      if (category) {
        url += `&category=${category}`;
      }
      if (sectionType) {
        url += `&section_type=${sectionType}`;
      }
      if (searchTerm) {
        url += `&searchTerm=${searchTerm}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
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
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category, sectionType, searchTerm]);

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const normalizeProductType = (t: any) =>
    (['book', 'merchandise', 'digital', 'other'].includes(t) ? t : 'book') as 'book' | 'merchandise' | 'digital' | 'other';

  // Wherever addToCart is called, ensure product_type is normalized:
  // Example: addToCart({ ...product, product_type: normalizeProductType(product.product_type) })

  return (
    <div className="container mx-auto py-8">
      {loading && <div className="text-center">Loading books...</div>}
      {error && <div className="text-red-500 text-center">Error: {error}</div>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentBooks.map(product => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <Link to={`/product/${product.id}`}>
              <img
                src={product.image_url || '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png'}
                alt={product.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-all duration-300"
              />
              
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
                  <div className="flex space-x-2 mt-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.id}`);
                      }}
                      className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{removeVolumeFromTitle(product.title)}</h3>
              <p className="text-gray-600">${product.price}</p>
              <div className="flex space-x-2 mt-4">
                <Link
                  to={`/product/${product.id}`}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details
                </Link>
                <button
                  className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        {Array.from({ length: Math.ceil(books.length / booksPerPage) }, (_, i) => i + 1).map(number => (
          <button key={number} onClick={() => paginate(number)} className={`mx-1 px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShopGrid;
