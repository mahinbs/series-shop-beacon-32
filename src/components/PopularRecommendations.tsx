import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Book as BookType } from "@/services/database";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Eye, Heart, Diamond, Star, BookOpen, Play, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { removeVolumeFromTitle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PopularRecommendations = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<
    "digital" | "print" | "merchandise"
  >("digital");
  const [activeTab, setActiveTab] = useState<"recommendations" | "genres">(
    "recommendations"
  );
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  useEffect(() => {
    const fetchPopularBooks = async () => {
      setIsLoading(true);
      try {
        // Fetch popular books - you can modify this query based on your popularity criteria
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true })
          .limit(6);

        if (error) {
          console.error("Error fetching popular books:", error);
          toast({
            title: "Error",
            description: "Failed to load popular recommendations.",
            variant: "destructive",
          });
        }

        if (data) {
          // Deduplicate books by removing volume information from titles
          const deduplicatedBooks = data.reduce((acc: any[], book: any) => {
            const baseTitle = removeVolumeFromTitle(book.title);
            const existingBook = acc.find(
              (b) => removeVolumeFromTitle(b.title) === baseTitle
            );

            if (!existingBook) {
              acc.push(book);
            }
            return acc;
          }, []);

          setBooks(deduplicatedBooks);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularBooks();
  }, []);

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
    navigate(`/product/${book.id}`);
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

  // Sample genre data with books
  const genreSections = [
    {
      name: "SLICE OF LIFE",
      books: [
        {
          title: "Tokyo Ghoul Vol. 14",
          author: "Sui Ishida",
          price: "$12.99",
          coins: "1299 coins",
          type: "digital",
        },
        {
          title: "Demon Slayer Tanjiro Figure",
          author: "Koyoharu Gotouge",
          price: "$49.99",
          coins: "4999 coins",
          type: "merchandise",
        },
        {
          title: "Naruto Vol. 72",
          author: "Masashi Kishimoto",
          price: "$9.99",
          coins: "999 coins",
          type: "digital",
        },
        {
          title: "My Hero Academia Vol. 35",
          author: "Kohei Horikoshi",
          price: "$11.99",
          coins: "1199 coins",
          type: "digital",
        },
      ],
    },
    {
      name: "DRAMA",
      books: [
        {
          title: "Tokyo Ghoul Vol. 14",
          author: "Sui Ishida",
          price: "$12.99",
          coins: "1299 coins",
          type: "merchandise",
        },
        {
          title: "Demon Slayer Tanjiro Figure",
          author: "Koyoharu Gotouge",
          price: "$49.99",
          coins: "4999 coins",
          type: "digital",
        },
        {
          title: "Naruto Vol. 72",
          author: "Masashi Kishimoto",
          price: "$9.99",
          coins: "999 coins",
          type: "digital",
        },
        {
          title: "My Hero Academia Vol. 35",
          author: "Kohei Horikoshi",
          price: "$11.99",
          coins: "1199 coins",
          type: "digital",
        },
      ],
    },
    {
      name: "HIGH SCHOOL ROMANCE",
      books: [
        {
          title: "Your Name Vol. 1",
          author: "Makoto Shinkai",
          price: "$14.99",
          coins: "1499 coins",
          type: "digital",
        },
        {
          title: "A Silent Voice Vol. 7",
          author: "Yoshitoki Oima",
          price: "$13.99",
          coins: "1399 coins",
          type: "digital",
        },
        {
          title: "Orange Vol. 3",
          author: "Ichigo Takano",
          price: "$12.99",
          coins: "1299 coins",
          type: "digital",
        },
        {
          title: "Toradora! Vol. 10",
          author: "Yuyuko Takemiya",
          price: "$11.99",
          coins: "1199 coins",
          type: "digital",
        },
      ],
    },
    {
      name: "FANTASY",
      books: [
        {
          title: "Attack on Titan Vol. 34",
          author: "Hajime Isayama",
          price: "$15.99",
          coins: "1599 coins",
          type: "digital",
        },
        {
          title: "One Piece Vol. 100",
          author: "Eiichiro Oda",
          price: "$16.99",
          coins: "1699 coins",
          type: "digital",
        },
        {
          title: "Demon Slayer Vol. 23",
          author: "Koyoharu Gotouge",
          price: "$14.99",
          coins: "1499 coins",
          type: "digital",
        },
        {
          title: "Jujutsu Kaisen Vol. 20",
          author: "Gege Akutami",
          price: "$13.99",
          coins: "1399 coins",
          type: "digital",
        },
      ],
    },
    {
      name: "ACTION TALES",
      books: [
        {
          title: "Bleach Vol. 74",
          author: "Tite Kubo",
          price: "$15.99",
          coins: "1599 coins",
          type: "digital",
        },
        {
          title: "Dragon Ball Super Vol. 18",
          author: "Akira Toriyama",
          price: "$16.99",
          coins: "1699 coins",
          type: "digital",
        },
        {
          title: "Black Clover Vol. 32",
          author: "Yuki Tabata",
          price: "$14.99",
          coins: "1499 coins",
          type: "digital",
        },
        {
          title: "Chainsaw Man Vol. 11",
          author: "Tatsuki Fujimoto",
          price: "$13.99",
          coins: "1399 coins",
          type: "digital",
        },
      ],
    },
  ];

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
                  onClick={() => (window.location.href = "/shop-all")}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                >
                  View All (
                  {
                    books.filter((book) => {
                      if (selectedFilter === "digital")
                        return book.product_type === "digital";
                      if (selectedFilter === "print")
                        return book.product_type === "print";
                      if (selectedFilter === "merchandise")
                        return book.product_type === "merchandise";
                      return true;
                    }).length
                  }
                  )
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
                  /* Print Series Grid */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {printSeries.map((series, index) => (
                      <div 
                        key={index} 
                        className={`group relative bg-gradient-to-br ${series.gradient} backdrop-blur-sm rounded-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 border border-gray-800/50 hover:border-red-500/30 shadow-2xl hover:shadow-red-500/10`}
                      >
                        {/* Image Container */}
                        <div className="relative overflow-hidden">
                          <div className="aspect-[4/3] relative">
                            <img 
                              src={series.image} 
                              alt={series.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                            
                            
                            
                          </div>
                        </div>
                        
                        {/* Content Area */}
                        <div className="p-6 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm">
                          {/* Title */}
                          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors duration-300">
                            {series.title}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
                            {series.description}
                          </p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {series.tags.map((tag, tagIndex) => (
                              <span 
                                key={tag} 
                                className={`
                                  px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
                                  ${tagIndex === 0 ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 
                                    tagIndex === 1 ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 
                                    'bg-purple-600/20 text-purple-400 border border-purple-500/30'}
                                  hover:scale-105 cursor-pointer
                                `}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          
                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <Button 
                              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-red-500/30"
                              onClick={() => navigate(`/readers/${series.title.toLowerCase().replace(/\s+/g, '-')}`)}
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              Read Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Popular Recommendations from Database */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {books.map((book, index) => (
                  <div
                    key={book.id}
                    className={`group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 min-h-[580px] transition-all duration-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 hover:border-orange-500/30 cursor-pointer ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    }`}
                    onMouseEnter={() => setHoveredBook(book.id)}
                    onMouseLeave={() => setHoveredBook(null)}
                    onClick={() => handleViewProduct(book)}
                    style={{
                      transitionDelay: `${400 + index * 150}ms`,
                      opacity: 1,
                      transform: "translateY(0)",
                    }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          book.image_url ||
                          "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png"
                        }
                        alt={book.title}
                        className="w-full h-96 object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-110"
                      />

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
                            className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
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
                          <h3 className="text-lg font-bold text-orange-300">
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
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-white">
                              ${book.price}
                            </span>
                            {book.original_price && (
                              <span className="text-sm text-gray-400 line-through">
                                ${book.original_price}
                              </span>
                            )}
                          </div>
                          {book.description && (
                            <p className="text-xs text-gray-300 line-clamp-2 mt-2">
                              {book.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold text-lg group-hover:text-orange-300 transition-colors duration-300 line-clamp-2 flex-1 mr-2">
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

                      <p className="text-orange-400 text-xs font-semibold uppercase tracking-wide">
                        {book.category || "General"}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-bold text-xl">
                            ${book.price}
                          </span>
                          {book.original_price && (
                            <span className="text-gray-500 line-through text-sm">
                              ${book.original_price}
                            </span>
                          )}
                        </div>
                        {book.can_unlock_with_coins && (
                          <span className="text-gray-400 text-xs">
                            {book.coins ||
                              `${Math.round(book.price * 100)} coins`}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 pt-2 mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(book);
                          }}
                          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-sm font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 transform hover:scale-105"
                        >
                          <ShoppingCart className="w-4 h-4 inline mr-2" />
                          Add to Cart
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyNow(book);
                          }}
                          className="w-full bg-white hover:bg-gray-100 text-black text-sm font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                        >
                          Buy Now
                        </button>

                        {book.can_unlock_with_coins && (
                          <button className="w-full text-gray-400 hover:text-white text-sm border border-gray-600 hover:border-gray-400 py-3 rounded-lg transition-all duration-300 hover:bg-gray-800">
                            Unlock with{" "}
                            {book.coins ||
                              `${Math.round(book.price * 100)} coins`}
                          </button>
                        )}
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
                {genreSections.map((genre, genreIndex) => (
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
                              src="/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png"
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
                              <button
                                onClick={() => handleAddToCart(book as any)}
                                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-sm font-semibold py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30"
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
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
