import { useState, useEffect } from 'react';
import { booksService, type Book } from '@/services/database';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

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
      
      // Update local state
      setBooks(prev => [...prev, newBook].sort((a, b) => a.display_order - b.display_order));
      return newBook;
    } catch (error) {
      throw error;
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    try {
      const updatedBook = await booksService.update(id, updates);
      
      // Update local state
      setBooks(prev => 
        prev.map(book => 
          book.id === id ? updatedBook : book
        ).sort((a, b) => a.display_order - b.display_order)
      );
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