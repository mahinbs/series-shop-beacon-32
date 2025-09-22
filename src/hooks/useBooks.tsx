import { useState, useEffect } from 'react';
import { booksService, type Book } from '@/services/database';

export const useBooks = (productType?: string) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBooks();
  }, [productType]);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to get active books first, if that fails, get all books
      let data;
      try {
        data = await booksService.getActive();
      } catch (activeError) {
        data = await booksService.getAll();
      }
      
      // Filter by product type if specified
      if (productType) {
        data = data.filter(book => book.product_type === productType);
      }
      
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const createBook = async (book: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newBook = await booksService.create(book);
      
      // Update local state only if the new book matches the current filter
      if (!productType || newBook.product_type === productType) {
        setBooks(prev => [...prev, newBook].sort((a, b) => a.display_order - b.display_order));
      }
      return newBook;
    } catch (error) {
      throw error;
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    try {
      const updatedBook = await booksService.update(id, updates);
      
      // Update local state
      setBooks(prev => {
        const filtered = prev.filter(book => book.id !== id);
        
        // Only add back if it matches the current filter
        if (!productType || updatedBook.product_type === productType) {
          return [...filtered, updatedBook].sort((a, b) => a.display_order - b.display_order);
        }
        
        return filtered.sort((a, b) => a.display_order - b.display_order);
      });
      return updatedBook;
    } catch (error) {
      throw error;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      await booksService.delete(id);
      
      // Update local state
      setBooks(prev => prev.filter(book => book.id !== id));
    } catch (error) {
      throw error;
    }
  };

  const getBooksBySection = (sectionType: string) => {
    return books.filter(book => book.section_type === sectionType);
  };

  const getBooksByProductType = (productType: string) => {
    return books.filter(book => book.product_type === productType);
  };

  const getBooksByCategory = (category: string) => {
    return books.filter(book => book.category === category);
  };

  const searchBooks = (searchTerm: string) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return books.filter(book => 
      book.title.toLowerCase().includes(lowerSearchTerm) ||
      (book.author && book.author.toLowerCase().includes(lowerSearchTerm)) ||
      (book.category && book.category.toLowerCase().includes(lowerSearchTerm))
    );
  };

  return {
    books,
    isLoading,
    error,
    createBook,
    updateBook,
    deleteBook,
    loadBooks,
    getBooksBySection,
    getBooksByProductType,
    getBooksByCategory,
    searchBooks
  };
};

// Specialized hooks for different product types
export const useBooksOnly = () => useBooks('book');
export const useMerchandiseOnly = () => useBooks('merchandise');