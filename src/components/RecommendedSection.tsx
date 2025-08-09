import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Book as BookType } from '@/services/database';
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

      await addToCart({
        id: book.id,
        title: book.title,
        author: book.author || undefined,
        price: Number(book.price),
        imageUrl: book.image_url,
        category: book.category,
        product_type: normalizeProductType(book.product_type),
        inStock: true,
        coins: (book as any).coins || undefined,
        canUnlockWithCoins: book.can_unlock_with_coins || undefined,
      });
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
      <h2 className="text-2xl font-semibold mb-4">New Releases</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {books.map((book) => (
            <div key={book.id} className="rounded-lg border p-3">
              <img
                src={book.image_url}
                alt={book.title}
                className="w-full h-48 object-cover rounded"
                loading="lazy"
              />
              <div className="mt-2">
                <div className="font-medium truncate">{book.title}</div>
                <div className="text-sm text-gray-500">{book.author || 'Unknown'}</div>
                <div className="text-sm mt-1">${book.price}</div>
                <Button
                  className="w-full mt-2"
                  onClick={() => handleAddToCart({ ...book, product_type: normalizeProductType(book.product_type) })}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendedSection;
