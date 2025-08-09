import React from 'react';
import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface ShopGridProps {
  category?: string;
  sectionType?: string;
  searchTerm?: string;
}

const ShopGrid: React.FC<ShopGridProps> = ({ category, sectionType, searchTerm }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(12);

  const { addToCart } = useCart();

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
        setBooks(data);
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
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link to={`/product/${product.id}`}>
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-64 object-cover"
              />
            </Link>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
              <p className="text-gray-600">${product.price}</p>
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  addToCart({ ...product, product_type: normalizeProductType(product.product_type) });
                  toast.success(`${product.title} added to cart!`);
                }}
              >
                Add to Cart
              </button>
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
