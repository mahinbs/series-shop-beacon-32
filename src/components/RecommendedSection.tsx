import React from 'react';
import { Book } from '@/components/ui/Book';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Book as BookType } from '@/types';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const RecommendedSection = (props: any) => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('section_type', 'new-releases')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(5);

        if (error) {
          console.error("Error fetching books:", error);
          toast.error("Failed to load recommended books.");
        }

        if (data) {
          setBooks(data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleAddToCart = async (book: BookType) => {
    try {
      if (!book?.id) {
        toast.error("This book does not have a valid ID.");
        return;
      }

      const normalizeProductType = (t: any) =>
        (['book', 'merchandise', 'digital', 'other'].includes(t) ? t : 'book') as 'book' | 'merchandise' | 'digital' | 'other';

      await addToCart({ ...book, product_type: normalizeProductType(book.product_type) });
      toast.success(`${book.title} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  const normalizeProductType = (t: any) =>
    (['book', 'merchandise', 'digital', 'other'].includes(t) ? t : 'book') as 'book' | 'merchandise' | 'digital' | 'other';

  return (
    <section className="container py-8">
      <SectionTitle title="New Releases" />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {books.map((book) => (
            <div key={book.id}>
              <Book
                key={book.id}
                title={book.title}
                author={book.author || 'Unknown'}
                price={book.price}
                imageUrl={book.image_url}
              />
              <Button
                className="w-full mt-2"
                onClick={() => handleAddToCart({ ...book, product_type: normalizeProductType(book.product_type) })}
              >
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendedSection;
