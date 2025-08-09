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
      console.log('Starting to load books...');
      
      // Try to get active books first, if that fails, get all books
      let data;
      try {
        data = await booksService.getActive();
        console.log('Active books loaded:', data);
      } catch (activeError) {
        console.log('Failed to load active books, trying to load all books:', activeError);
        data = await booksService.getAll();
        console.log('All books loaded:', data);
      }
      
      setBooks(data);
    } catch (err) {
      console.error('Error loading books:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
      console.log('Books loading finished');
    }
  };

  const createBook = async (book: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating book:', book);
      const newBook = await booksService.create(book);
      console.log('Book created:', newBook);
      
      // Update local state
      setBooks(prev => [...prev, newBook].sort((a, b) => a.display_order - b.display_order));
      return newBook;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    try {
      console.log('Updating book:', id, updates);
      const updatedBook = await booksService.update(id, updates);
      console.log('Book updated:', updatedBook);
      
      // Update local state
      setBooks(prev => 
        prev.map(book => 
          book.id === id ? updatedBook : book
        ).sort((a, b) => a.display_order - b.display_order)
      );
      return updatedBook;
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      console.log('Deleting book:', id);
      await booksService.delete(id);
      console.log('Book deleted:', id);
      
      // Update local state
      setBooks(prev => prev.filter(book => book.id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
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