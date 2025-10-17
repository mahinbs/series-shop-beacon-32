import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Book as BookType } from "@/services/database";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Eye, Heart, Diamond, Star, BookOpen, Play, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { removeVolumeFromTitle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChapterService } from "@/services/chapterService";

const PopularRecommendations = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);
  const [volumeCounts, setVolumeCounts] = useState<Record<string, number>>({});
  const [selectedFilter, setSelectedFilter] = useState<
    "digital" | "print" | "merchandise"
  >("digital");
  const [activeTab, setActiveTab] = useState<"recommendations" | "genres">(
    "recommendations"
  );
  const [dynamicGenreSections, setDynamicGenreSections] = useState<Array<{
    name: string;
    books: Array<{
      id: string;
      title: string;
      author: string;
      price: string;
      coins: string;
      type: string;
      imageUrl: string;
    }>;
  }>>([]);
  const [showAllBooks, setShowAllBooks] = useState(false);
  const displayLimit = 6;
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  useEffect(() => {
    const fetchPopularBooks = async () => {
      setIsLoading(true);
      setShowAllBooks(false); // Reset to collapsed view when filter changes
      try {
        // Fetch products based on selected filter
        let query = supabase
          .from("books")
          .select("*")
          .eq("is_active", true);

        // Filter by product type based on selected filter
        if (selectedFilter === "digital") {
          // Show all products that are NOT explicitly print or merchandise (everything else is digital)
          // Only show popular recommendations for digital
          query = query.eq("is_popular_recommendation", true);
          // Don't filter further - we'll filter in JavaScript to include null, 'book', 'digital', etc
        } else if (selectedFilter === "print") {
          // Show only products explicitly marked as print
          query = query.eq("product_type", "print");
        } else if (selectedFilter === "merchandise") {
          // Show only products explicitly marked as merchandise
          query = query.eq("product_type", "merchandise");
        }

        const { data, error } = await query.order("display_order", { ascending: true });

        if (error) {
          console.error("Error fetching popular books:", error);
          toast({
            title: "Error",
            description: "Failed to load popular recommendations.",
            variant: "destructive",
          });
        }

        if (data) {
          // For digital filter, exclude print and merchandise products
          let filteredData = data;
          if (selectedFilter === "digital") {
            filteredData = data.filter(book => 
              book.product_type !== 'print' && book.product_type !== 'merchandise'
            );
          }
          
          console.log(`🔍 Fetched ${filteredData.length} products for filter: ${selectedFilter}`);
          console.log('📦 Products:', filteredData.map(p => ({ id: p.id, title: p.title, product_type: p.product_type })));
          
          // For merchandise, show all products without deduplication
          // For other types, deduplicate by removing volume information from titles
          let processedBooks = filteredData;
          
          if (selectedFilter !== "merchandise") {
            processedBooks = filteredData.reduce((acc: any[], book: any) => {
              const baseTitle = removeVolumeFromTitle(book.title);
              const existingBook = acc.find(
                (b) => removeVolumeFromTitle(b.title) === baseTitle
              );

              if (!existingBook) {
                acc.push(book);
              }
              return acc;
            }, []);
          }

          console.log(`✅ Processed ${processedBooks.length} books for display`);
          setBooks(processedBooks);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularBooks();
  }, [selectedFilter]);

  // Fetch genre data for genres tab
  useEffect(() => {
    const fetchGenreData = async () => {
      try {
        const { data, error } = await supabase
          .from("books")
          .select("id, title, author, price, genre, image_url, product_type, can_unlock_with_coins")
          .eq("is_active", true)
          .not("genre", "is", null);

        if (error) {
          console.error("Error fetching genre data:", error);
          return;
        }

        if (data) {
          // Extract unique genres and group books
          const genreMap = new Map<string, any[]>();
          
          data.forEach(book => {
            if (book.genre && Array.isArray(book.genre)) {
              book.genre.forEach(genre => {
                if (genre && genre.trim()) {
                  const normalizedGenre = genre.toUpperCase().trim();
                  if (!genreMap.has(normalizedGenre)) {
                    genreMap.set(normalizedGenre, []);
                  }
                  genreMap.get(normalizedGenre)?.push(book);
                }
              });
            }
          });

          // Convert to genre sections format, limit to 4 books per genre
          const genreSections = Array.from(genreMap.entries())
            .filter(([_, books]) => books.length > 0)
            .slice(0, 6) // Limit to first 6 genres
            .map(([genreName, genreBooks]) => ({
              name: genreName,
              books: genreBooks.slice(0, 4).map(book => ({
                id: book.id,
                title: book.title,
                author: book.author || "Unknown Author",
                price: `$${Number(book.price).toFixed(2)}`,
                coins: book.can_unlock_with_coins ? 
                  `${Math.round(Number(book.price) * 100)} coins` : 
                  "Not available with coins",
                type: book.product_type === 'merchandise' ? 'merchandise' : 'digital',
                imageUrl: book.image_url || '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png'
              }))
            }));

          setDynamicGenreSections(genreSections);
        }
      } catch (error) {
        console.error("Error fetching genre data:", error);
      }
    };

    if (activeTab === "genres") {
      fetchGenreData();
    }
  }, [activeTab]);

  // Load volume counts for books
  useEffect(() => {
    const loadVolumeCounts = async () => {
      if (books.length > 0) {
        try {
          const { booksService } = await import('@/services/database');
          const counts: Record<string, number> = {};
          
          for (const book of books) {
            if (!book.is_volume) {
              try {
                const volumes = await booksService.getVolumes(book.id);
                counts[book.id] = volumes.length;
              } catch (error) {
                console.error(`Error loading volumes for book ${book.id}:`, error);
                counts[book.id] = 0;
              }
            }
          }
          
          setVolumeCounts(counts);
        } catch (error) {
          console.error('Error loading volume counts:', error);
        }
      }
    };

    loadVolumeCounts();
  }, [books]);

  const handleAddToCart = async (book: BookType) => {
    try {
      if (!book?.id) {
        toast({
          title: "Error",
          description: "This book does not have a valid ID.",
          variant: "destructive",
        });
        return;
      }

      const normalizeProductType = (t: any) =>
        (["book", "merchandise", "digital", "other"].includes(t)
          ? t
          : "book") as "book" | "merchandise" | "digital" | "other";

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
      toast({
        title: "Added to Cart!",
        description: `${book.title} added to cart!`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBuyNow = (book: BookType) => {
    // Navigate directly to direct checkout with product details
    const productId =
      book.id ||
      `${book.title.replace(/\s+/g, "-").toLowerCase()}-${book.author
        ?.replace(/\s+/g, "-")
        .toLowerCase()}`;
    navigate(`/direct-checkout/${productId}`, {
      state: {
        product: {
          id: productId,
          title: book.title,
          author: book.author,
          price: Number(book.price),
          originalPrice: book.original_price,
          imageUrl: book.image_url,
          category: book.category || "General",
          product_type: "book" as const,
          inStock: true,
        },
        quantity: 1,
        totalPrice: Number(book.price),
      },
    });
  };

  const handleViewProduct = (book: BookType) => {
    // Navigate to merchandise detail page for merchandise products
    if (book.product_type === 'merchandise') {
      navigate(`/merchandise/${book.id}`, {
        state: { product: book }
      });
    } else {
      // For other products, use the regular product page
      navigate(`/product/${book.id}`);
    }
  };

  const handleGenreClick = (genreName: string) => {
    // Navigate to shop page with genre filter
    navigate(`/shop-all?genre=${genreName.toLowerCase()}`);
  };

  const handleWishlistToggle = (book: BookType) => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
      toast({
        title: "Removed from Wishlist",
        description: `${book.title} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        product_id: book.id,
        title: book.title,
        author: book.author || "Unknown Author",
        price: Number(book.price),
        originalPrice: book.original_price
          ? Number(book.original_price)
          : undefined,
        imageUrl: book.image_url,
        category: book.category,
        product_type: (book.product_type as "book" | "merchandise") || "book",
        inStock: book.stock_quantity ? book.stock_quantity > 0 : true,
        volume: book.volume_number,
      });
      toast({
        title: "Added to Wishlist",
        description: `${book.title} has been added to your wishlist.`,
      });
    }
  };

  // Print series data
  const printSeries = [
    {
      title: "Demon Slayer",
      description: "Follow Tanjiro's quest to cure his sister and battle demons",
      rating: 4.9,
      status: "Ongoing",
      image: "/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png",
      tags: ["Action", "Supernatural", "Drama"],
      episodes: "44 Episodes",
      views: "2.3M",
      gradient: "from-red-900/20 to-orange-900/20"
    },
    {
      title: "Jujutsu Kaisen",
      description: "Enter a world where curses can be fought and exercised",
      rating: 4.8,
      status: "Ongoing", 
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop&crop=center",
      tags: ["Action", "Fantasy", "Horror"],
      episodes: "24 Episodes",
      views: "1.8M",
      gradient: "from-purple-900/20 to-blue-900/20"
    },
    {
      title: "One Piece",
      description: "Join Luffy and his pirate crew on their grand adventure",
      rating: 4.9,
      status: "Ongoing",
      image: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop&crop=center",
      tags: ["Adventure", "Action", "Comedy"],
      episodes: "1000+ Episodes",
      views: "5.1M",
      gradient: "from-blue-900/20 to-teal-900/20"
    }
  ];


  return (
    <section
      ref={elementRef}
      className={`relative bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 py-16 overflow-hidden transition-all duration-1000 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-10 w-80 h-80 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div
          className={`text-left mb-12 transition-all duration-1000 delay-200 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab("recommendations")}
                  className={`text-4xl font-bold transition-all duration-300 ${
                    activeTab === "recommendations"
                      ? "text-red-400 underline decoration-2 underline-offset-4"
                      : "text-gray-400 hover:text-red-400"
                  }`}
                >
                  Popular Recommendations
                </button>
                <span className="text-white text-4xl">|</span>
                <button
                  onClick={() => setActiveTab("genres")}
                  className={`text-4xl font-bold transition-all duration-300 ${
                    activeTab === "genres"
                      ? "text-red-400 underline decoration-2 underline-offset-4"
                      : "text-gray-400 hover:text-red-400"
                  }`}
                >
                  Genres
                </button>
              </div>
              <p className="text-gray-400 text-lg">
                {activeTab === "recommendations"
                  ? "Discover trending books and series"
                  : "Discover your favorite genres"}
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-col items-end gap-12">
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => setSelectedFilter("digital")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    selectedFilter === "digital"
                      ? "bg-red-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Digital
                </button>
                <button
                  onClick={() => setSelectedFilter("print")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    selectedFilter === "print"
                      ? "bg-red-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Print
                </button>
                <button
                  onClick={() => setSelectedFilter("merchandise")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    selectedFilter === "merchandise"
                      ? "bg-red-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Merchandise
                </button>
              </div>
              {activeTab === "recommendations" && (
                <button
                  onClick={() => {
                    const filteredBooks = books.filter((book) => {
                      if (selectedFilter === "digital")
                        return book.product_type !== "merchandise" && book.product_type !== "print";
                      if (selectedFilter === "print")
                        return book.product_type === "print";
                      if (selectedFilter === "merchandise")
                        return book.product_type === "merchandise";
                      return true;
                    });

                    if (filteredBooks.length > displayLimit && !showAllBooks) {
                      setShowAllBooks(true);
                    } else if (showAllBooks) {
                      setShowAllBooks(false);
                    } else {
                      window.location.href = "/shop-all";
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                >
                  {(() => {
                    const filteredBooks = books.filter((book) => {
                      if (selectedFilter === "digital")
                        return book.product_type !== "merchandise" && book.product_type !== "print";
                      if (selectedFilter === "print")
                        return book.product_type === "print";
                      if (selectedFilter === "merchandise")
                        return book.product_type === "merchandise";
                      return true;
                    });

                    if (filteredBooks.length > displayLimit && showAllBooks) {
                      return "Show Less";
                    } else if (filteredBooks.length > displayLimit) {
                      return `View All (${filteredBooks.length})`;
                    } else {
                      return `View All (${filteredBooks.length})`;
                    }
                  })()}
                </button>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <div className="text-white text-lg">
              Loading popular recommendations...
            </div>
          </div>
        ) : (
          <>
            {activeTab === "recommendations" ? (
              <>
                {selectedFilter === "print" ? (
                  /* Print Books Grid */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {books
                      .filter(book => book.product_type === 'print')
                      .slice(0, showAllBooks ? undefined : displayLimit)
                      .map((book, index) => (
                      <div
                        key={book.id}
                        className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 min-h-[560px] transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 hover:scale-105 cursor-pointer"
                        onMouseEnter={() => setHoveredBook(book.id)}
                        onMouseLeave={() => setHoveredBook(null)}
                        onClick={() => handleViewProduct(book)}
                      >
                        {/* Image Section with Badges */}
                        <div className="relative overflow-hidden">
                          <img 
                            src={book.image_url || '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png'}
                            alt={book.title}
                            className="w-full h-96 object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                          />
                          
                          {/* Subtle hover overlay to indicate clickability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Enhanced hover overlay with book details */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                            <div className="text-white space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                              <h3 className="text-lg font-bold text-red-300">{book.title}</h3>
                              {book.author && (
                                <p className="text-sm text-gray-300">by {book.author}</p>
                              )}
                              <p className="text-xs text-gray-400 uppercase tracking-wide">{book.category || 'General'}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-white">${book.price}</span>
                                {book.original_price && (
                                  <span className="text-sm text-gray-400 line-through">${book.original_price}</span>
                                )}
                              </div>
                              {book.description && (
                                <p className="text-xs text-gray-300 line-clamp-2 mt-2">{book.description}</p>
                              )}
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="absolute top-3 left-3 space-y-2 z-10">
                            {book.is_new && (
                              <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                NEW
                              </span>
                            )}
                            {book.is_on_sale && (
                              <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                SALE
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Content Section - Shadow Hunter Chronicles Style */}
                        <div className="p-6 bg-gradient-to-br from-gray-900/95 to-black/95">
                          {/* Title */}
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors duration-300">
                            {book.title}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                            {book.description || `An epic adventure following the journey of ${book.author || 'the protagonist'}.`}
                          </p>
                          
                          {/* Print books: Show category (Novel, Adventure, Drama, etc) */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {book.category && (
                              <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full uppercase">
                                {book.category}
                              </span>
                            )}
                            <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full uppercase">
                              Print
                            </span>
                          </div>
                          
                          {/* Series Details */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-sm text-gray-400">
                              {book.is_volume 
                                ? `Vol. ${book.volume_number || 1}` 
                                : `${volumeCounts[book.id] || 0} Volume${(volumeCounts[book.id] || 0) !== 1 ? 's' : ''}`
                              }
                            </div>
                            <div className="text-sm text-gray-400">
                              {book.is_new ? 'New Release' : 'Available'}
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-bold text-white">${book.price}</span>
                            {book.original_price && (
                              <span className="text-sm text-gray-400 line-through">${book.original_price}</span>
                            )}
                          </div>
                          
                          {/* Action Buttons - Print: Add to Cart + Buy Now */}
                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(book);
                              }}
                              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBuyNow(book);
                              }}
                              variant="outline"
                              className="w-full bg-white border-gray-600 text-black hover:bg-gray-100 hover:text-black font-semibold py-3 rounded-lg transition-all duration-300"
                            >
                              Buy Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {books.filter(book => book.product_type === 'print').length === 0 && (
                      <div className="col-span-full text-center py-12">
                        <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No print books available yet.</p>
                        <p className="text-gray-500 text-sm">Check back later for new releases!</p>
                      </div>
                    )}
                  </div>
                ) : selectedFilter === "merchandise" ? (
                  /* Merchandise Grid */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {books.map((item, index) => (
                      <div
                        key={item.id}
                        className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 min-h-[560px] transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 hover:scale-105 cursor-pointer"
                        onMouseEnter={() => setHoveredSeries(item.id)}
                        onMouseLeave={() => setHoveredSeries(null)}
                        onClick={() => handleViewProduct(item)}
                      >
                        {/* Image Section with Badges */}
                        <div className="relative overflow-hidden">
                          <img 
                            src={item.image_url || item.hover_image_url || "/placeholder.svg"} 
                            alt={item.title}
                            className="w-full h-96 object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                          />
                          
                          {/* Subtle hover overlay to indicate clickability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Enhanced hover overlay with merchandise details */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                            <div className="text-white space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                              <h3 className="text-lg font-bold text-red-300">{item.title}</h3>
                              <p className="text-xs text-gray-400 uppercase tracking-wide">{item.category || 'Merchandise'}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-white">${item.price || '0.00'}</span>
                                {item.original_price && (
                                  <span className="text-sm text-gray-400 line-through">${item.original_price}</span>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-xs text-gray-300 line-clamp-2 mt-2">{item.description}</p>
                              )}
                              <p className="text-xs text-gray-400">Stock: {item.stock_quantity || 0}</p>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="absolute top-3 left-3 space-y-2 z-10">
                            {item.is_new && (
                              <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                NEW
                              </span>
                            )}
                            {item.is_on_sale && (
                              <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                SALE
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Content Section */}
                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-red-400 text-xs font-semibold uppercase tracking-wide">{item.category}</span>
                          </div>
                          
                          <h3 className="text-white font-semibold text-lg truncate group-hover:text-red-300 transition-colors duration-300">
                            {item.title}
                          </h3>
                          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                            {item.product_type || 'Merchandise'}
                          </p>
                          <p className="text-gray-500 text-xs line-clamp-2 group-hover:text-gray-400 transition-colors duration-300">
                            {item.description}
                          </p>
                          
                          <div className="flex items-center justify-between pt-2">
                            <div className="text-gray-400 text-xs">
                              Stock: {item.stock_quantity || 0}
                            </div>
                            <Button 
                              size="sm" 
                              disabled={!(item.stock_quantity && item.stock_quantity > 0)}
                              className={`${
                                item.stock_quantity && item.stock_quantity > 0
                                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white' 
                                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              } text-xs font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (item.stock_quantity && item.stock_quantity > 0) {
                                  handleAddToCart(item);
                                }
                              }}
                            >
                              {item.stock_quantity && item.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {books.length === 0 && (
                      <div className="col-span-full text-center py-12">
                        <div className="text-gray-400 text-lg mb-2">No merchandise available yet.</div>
                        <div className="text-gray-500 text-sm">Check back later for new merchandise!</div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Popular Recommendations from Database */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {books
                  .slice(0, showAllBooks ? undefined : displayLimit)
                  .map((book, index) => (
                  <div
                    key={book.id}
                    className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 min-h-[560px] transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 hover:scale-105 cursor-pointer"
                    onMouseEnter={() => setHoveredBook(book.id)}
                    onMouseLeave={() => setHoveredBook(null)}
                    onClick={() => handleViewProduct(book)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          book.image_url ||
                          "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png"
                        }
                        alt={book.title}
                        className="w-full h-96 object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                      />
                      
                      {/* Subtle hover overlay to indicate clickability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Popular badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                          POPULAR
                        </span>
                      </div>

                      {/* Additional badges */}
                      <div className="absolute top-3 right-3 space-y-2 z-10">
                        {book.is_new && (
                          <span className="bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                            NEW
                          </span>
                        )}
                        {book.is_on_sale && (
                          <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                            SALE
                          </span>
                        )}
                      </div>

                      {/* Hover overlay with action buttons */}
                      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProduct(book);
                            }}
                            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(book);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                            title="Add to Cart"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                          <button 
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                            title="Add to Favorites"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                      </div> */}

                      {/* Enhanced hover overlay with book details */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                        <div className="text-white space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-lg font-bold text-red-300">
                            {book.title}
                          </h3>
                          {book.author && (
                            <p className="text-sm text-gray-300">
                              by {book.author}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 uppercase tracking-wide">
                            {book.category || "General"}
                          </p>
                          {/* Digital products don't show price in hover */}
                          {book.description && (
                            <p className="text-xs text-gray-300 line-clamp-2 mt-2">
                              {book.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 space-y-2 z-10">
                        {book.is_new && (
                          <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            NEW
                          </span>
                        )}
                        {book.is_on_sale && (
                          <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            SALE
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3 space-y-3 flex-1 flex flex-col">
                      {/* Content Section */}
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-semibold text-base group-hover:text-orange-300 transition-colors duration-300 line-clamp-2 flex-1 mr-2">
                            {removeVolumeFromTitle(book.title)}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWishlistToggle(book);
                            }}
                            className={`transition-all duration-300 transform hover:scale-110 w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full ${
                              isInWishlist(book.id)
                                ? "text-red-500 hover:text-red-400 hover:bg-red-500/20"
                                : "text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                            }`}
                            title={
                              isInWishlist(book.id)
                                ? "Remove from Wishlist"
                                : "Add to Wishlist"
                            }
                          >
                            <Diamond
                              className={`w-4 h-4 transition-transform duration-300 ${
                                isInWishlist(book.id)
                                  ? "fill-current animate-pulse"
                                  : "group-hover:animate-pulse"
                              }`}
                            />
                          </button>
                        </div>

                        {book.author && (
                          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                            by {book.author}
                          </p>
                        )}

                        {/* Digital books: Show genre tags from admin */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {book.genre && Array.isArray(book.genre) && book.genre.length > 0 ? (
                            book.genre.slice(0, 3).map((g: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
                                {g}
                              </span>
                            ))
                          ) : (
                            <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
                              {book.category || 'Digital'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Button Section - Digital: Read Now button only */}
                      <div className="flex flex-col space-y-2 pt-2 mt-auto">
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              // Fetch chapters for this book
                              const chapters = await ChapterService.getBookChapters(book.id);
                              
                              if (chapters && chapters.length > 0) {
                                // Navigate to first chapter
                                const firstChapter = chapters[0];
                                navigate(`/chapter/${firstChapter.id}`);
                              } else {
                                // Show toast if no chapters available
                                toast({
                                  title: "No Chapters Available",
                                  description: "This book doesn't have any chapters yet. Please check back later.",
                                  variant: "destructive",
                                });
                              }
                            } catch (error) {
                              console.error('Error fetching chapters:', error);
                              toast({
                                title: "Error",
                                description: "Failed to load chapters. Please try again.",
                                variant: "destructive",
                              });
                            }
                          }}
                          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 transform hover:scale-105"
                        >
                          <BookOpen className="w-4 h-4 inline mr-2" />
                          Read Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                  </div>
                )}
              </>
            ) : (
              /* Genre-based Content */
              <div className="space-y-12">
                {activeTab === "genres" && dynamicGenreSections.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">
                      {isLoading ? "Loading genres..." : "No genres available at the moment."}
                    </p>
                  </div>
                ) : (
                  dynamicGenreSections.map((genre, genreIndex) => (
                    <div key={genre.name} className="space-y-6">
                      {/* Genre Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-bold text-white">
                          {genre.name}
                        </h3>
                        <button
                          onClick={() => handleGenreClick(genre.name)}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                        >
                          View All
                        </button>
                      </div>

                      {/* Books Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {genre.books.map((book, bookIndex) => (
                          <div
                            key={`${genre.name}-${bookIndex}`}
                            className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 min-h-[400px] transition-all duration-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 hover:border-orange-500/30"
                            onMouseEnter={() =>
                              setHoveredBook(`${genre.name}-${bookIndex}`)
                            }
                            onMouseLeave={() => setHoveredBook(null)}
                          >
                            <div className="relative overflow-hidden">
                              <img
                                src={book.imageUrl}
                                alt={book.title}
                                className="w-full h-64 object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-110"
                              />

                            {/* Type Badge */}
                            <div className="absolute top-3 left-3 z-10">
                              <span
                                className={`text-xs font-bold px-3 py-1 rounded-full shadow-lg ${
                                  book.type === "digital"
                                    ? "bg-red-600 text-white"
                                    : book.type === "merchandise"
                                    ? "bg-gray-600 text-white"
                                    : "bg-blue-600 text-white"
                                }`}
                              >
                                {book.type === "digital"
                                  ? "Digital"
                                  : book.type === "merchandise"
                                  ? "Merchandise"
                                  : "Print"}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 space-y-3">
                            <h4 className="text-white font-semibold text-lg group-hover:text-orange-300 transition-colors duration-300 line-clamp-2">
                              {book.title}
                            </h4>

                            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                              by {book.author}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-white font-bold text-xl">
                                  {book.price}
                                </span>
                              </div>
                              <span className="text-gray-400 text-xs">
                                {book.coins}
                              </span>
                            </div>

                            <div className="flex flex-col space-y-2">
                              {book.type === 'digital' ? (
                                <button
                                  onClick={async () => {
                                    try {
                                      // Note: Genre books are sample data, may not have real IDs
                                      // For now, navigate to product page as fallback
                                      navigate(`/product/${book.title.toLowerCase().replace(/\s+/g, '-')}`);
                                    } catch (error) {
                                      console.error('Error:', error);
                                      toast({
                                        title: "Error",
                                        description: "Failed to open book. Please try again.",
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30"
                                >
                                  <BookOpen className="w-4 h-4 inline mr-2" />
                                  Read Now
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleAddToCart(book as any)}
                                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30"
                                  >
                                    <ShoppingCart className="w-4 h-4 inline mr-2" />
                                    Add to Cart
                                  </button>

                                  <button
                                    onClick={() => handleBuyNow(book as any)}
                                    className="w-full bg-white hover:bg-gray-100 text-black text-sm font-semibold py-2 rounded-lg transition-all duration-300 hover:shadow-lg"
                                  >
                                    Buy Now
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {books.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-white text-lg">
              No popular recommendations available
            </div>
            <div className="text-gray-400 text-sm mt-2">
              Check back soon for trending items!
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularRecommendations;
