import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Book {
  id: string;
  title: string;
  author?: string;
  category: string;
  product_type?: 'book' | 'merchandise' | 'digital' | 'other';
  price: number;
  original_price?: number;
  coins?: string;
  image_url: string;
  hover_image_url?: string;
  description?: string;
  can_unlock_with_coins: boolean;
  section_type: 'new-releases' | 'best-sellers' | 'leaving-soon' | 'featured' | 'trending';
  label?: string;
  is_new: boolean;
  is_on_sale: boolean;
  display_order: number;
  is_active: boolean;
  stock_quantity?: number;
  sku?: string;
  weight?: number;
  dimensions?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBooks();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('books_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'books'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBooks(prev => [...prev, payload.new as Book].sort((a, b) => a.display_order - b.display_order));
          } else if (payload.eventType === 'UPDATE') {
            setBooks(prev => 
              prev.map(book => 
                book.id === payload.new.id ? payload.new as Book : book
              ).sort((a, b) => a.display_order - b.display_order)
            );
          } else if (payload.eventType === 'DELETE') {
            setBooks(prev => 
              prev.filter(book => book.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      console.log('Starting to load books...');
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      console.log('Books query result:', { data, error, count: data?.length });
      
      if (error) {
        console.error('Supabase books error:', error);
        throw error;
      }
      
      console.log('Setting books data:', data);
      setBooks((data || []) as Book[]);
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
      // Prepare the book data, excluding fields that might not exist yet
      const bookData: any = {
        title: book.title,
        author: book.author,
        category: book.category,
        price: book.price,
        original_price: book.original_price,
        coins: book.coins,
        image_url: book.image_url,
        hover_image_url: book.hover_image_url,
        can_unlock_with_coins: book.can_unlock_with_coins || false,
        section_type: book.section_type || 'new-releases',
        label: book.label,
        is_new: book.is_new || false,
        is_on_sale: book.is_on_sale || false,
        display_order: book.display_order || 0,
        is_active: book.is_active !== undefined ? book.is_active : true,
      };

      // Only add new fields if they exist in the database
      // These will be added after the migration is applied
      if (book.description !== undefined) bookData.description = book.description;
      if (book.stock_quantity !== undefined) bookData.stock_quantity = book.stock_quantity;
      if (book.sku !== undefined) bookData.sku = book.sku;
      if (book.weight !== undefined) bookData.weight = book.weight;
      if (book.dimensions !== undefined) bookData.dimensions = book.dimensions;
      if (book.tags !== undefined) bookData.tags = book.tags;
      if (book.product_type !== undefined) bookData.product_type = book.product_type;

      const { error } = await supabase
        .from('books')
        .insert([bookData]);

      if (error) {
        console.error('Error creating book:', error);
        
        // If it's an RLS issue, provide helpful message
        if (error.code === '42501') {
          throw new Error('Permission denied. Please check your authentication and admin privileges. The books table has restrictive security policies.');
        }
        
        // If it's a column not found error, provide helpful message
        if (error.message && error.message.includes('product_type')) {
          throw new Error('Database migration required. Please run the SQL migration to add the product_type column and other new fields to the books table.');
        }
        
        throw error;
      }
      
      // Reload data after successful creation
      setTimeout(() => loadBooks(), 100);
    } catch (err) {
      console.error('Error creating book:', err);
      throw err;
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    try {
      // Prepare the update data, excluding fields that might not exist yet
      const updateData: any = {};
      
      // Only include fields that exist in the current database schema
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.author !== undefined) updateData.author = updates.author;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.original_price !== undefined) updateData.original_price = updates.original_price;
      if (updates.coins !== undefined) updateData.coins = updates.coins;
      if (updates.image_url !== undefined) updateData.image_url = updates.image_url;
      if (updates.hover_image_url !== undefined) updateData.hover_image_url = updates.hover_image_url;
      if (updates.can_unlock_with_coins !== undefined) updateData.can_unlock_with_coins = updates.can_unlock_with_coins;
      if (updates.section_type !== undefined) updateData.section_type = updates.section_type;
      if (updates.label !== undefined) updateData.label = updates.label;
      if (updates.is_new !== undefined) updateData.is_new = updates.is_new;
      if (updates.is_on_sale !== undefined) updateData.is_on_sale = updates.is_on_sale;
      if (updates.display_order !== undefined) updateData.display_order = updates.display_order;
      if (updates.is_active !== undefined) updateData.is_active = updates.is_active;

      // Only add new fields if they exist in the database
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.stock_quantity !== undefined) updateData.stock_quantity = updates.stock_quantity;
      if (updates.sku !== undefined) updateData.sku = updates.sku;
      if (updates.weight !== undefined) updateData.weight = updates.weight;
      if (updates.dimensions !== undefined) updateData.dimensions = updates.dimensions;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.product_type !== undefined) updateData.product_type = updates.product_type;

      const { error } = await supabase
        .from('books')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating book:', error);
        
        // If it's an RLS issue, provide helpful message
        if (error.code === '42501') {
          throw new Error('Permission denied. Please check your authentication and admin privileges. The books table has restrictive security policies.');
        }
        
        // If it's a column not found error, provide helpful message
        if (error.message && error.message.includes('product_type')) {
          throw new Error('Database migration required. Please run the SQL migration to add the product_type column and other new fields to the books table.');
        }
        
        throw error;
      }
      
      // Reload data after successful update  
      setTimeout(() => loadBooks(), 100);
    } catch (err) {
      console.error('Error updating book:', err);
      throw err;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting book:', error);
        
        // If it's an RLS issue, provide helpful message
        if (error.code === '42501') {
          throw new Error('Permission denied. Please check your authentication and admin privileges. The books table has restrictive security policies.');
        }
        
        throw error;
      }
      
      // Reload data after successful deletion
      setTimeout(() => loadBooks(), 100);
    } catch (err) {
      console.error('Error deleting book:', err);
      throw err;
    }
  };

  const getBooksBySection = (sectionType: string) => {
    return books.filter(book => book.section_type === sectionType);
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
  };
};