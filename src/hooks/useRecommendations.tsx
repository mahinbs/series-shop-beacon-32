import { useState, useEffect } from 'react';
import { useSupabaseAuth } from './useSupabaseAuth';
import { useBooks } from './useBooks';

interface RecommendedProduct {
  id: string;
  title: string;
  author: string;
  price: string;
  coins: string;
  imageUrl: string;
  genre: string[];
  rating: number;
  type: string;
  isPersonalized?: boolean;
}

export const useRecommendations = () => {
  const { user } = useSupabaseAuth();
  const { books, isLoading: booksLoading } = useBooks();
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Transform books data to recommended products format
  const transformBooksToRecommendations = (booksData: any[]): RecommendedProduct[] => {
    if (!booksData || booksData.length === 0) return [];

    return booksData
      .filter(book => book.is_active) // Only show active products
      .sort((a, b) => {
        // Sort by display_order if available, otherwise by title
        if (a.display_order !== undefined && b.display_order !== undefined) {
          return a.display_order - b.display_order;
        }
        return a.title.localeCompare(b.title);
      })
      .map(book => ({
        id: book.id,
        title: book.title,
        author: book.author || 'Unknown Author',
        price: `$${Number(book.price).toFixed(2)}`,
        coins: book.coins || `${Math.round(Number(book.price) * 100)} coins`,
        imageUrl: book.image_url || '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png',
        genre: [book.category || 'General'],
        rating: 5, // Default rating
        type: book.product_type === 'book' ? 'Digital' : 
              book.product_type === 'merchandise' ? 'Merchandise' : 
              book.product_type === 'digital' ? 'Digital' : 'Other',
        isPersonalized: !!user
      }))
      .slice(0, 8); // Limit to 8 recommendations
  };

  // Generate personalized recommendations based on user data
  const generatePersonalizedRecommendations = (booksData: any[]): RecommendedProduct[] => {
    if (!booksData || booksData.length === 0) return [];

    // For now, just return the first 8 active products with personalized flag
    // In a real app, this would use user data from Supabase to personalize
    return transformBooksToRecommendations(booksData).map(item => ({
      ...item,
      isPersonalized: true
    }));
  };

  useEffect(() => {
    if (booksLoading) {
      setLoading(true);
      return;
    }

    setLoading(true);
    
    // Simulate API call delay for better UX
    const timer = setTimeout(() => {
      try {
        if (books && books.length > 0) {
          if (user) {
            setRecommendations(generatePersonalizedRecommendations(books));
          } else {
            setRecommendations(transformBooksToRecommendations(books));
          }
        } else {
          // Fallback to empty array if no books
          setRecommendations([]);
        }
      } catch (error) {
        console.error('Error transforming recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [books, booksLoading, user]);

  return {
    recommendations,
    loading: loading || booksLoading,
    isPersonalized: !!user
  };
};