import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ComicService, type ComicSeries } from '@/services/comicService';
import { useBooksOnly, useMerchandiseOnly } from '@/hooks/useBooks';
import { type Book } from '@/services/database';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

interface SeriesGridProps {
  appliedFilters?: string[];
  searchTerm?: string;
  sortBy?: string;
}

const SeriesGrid = ({ appliedFilters = [], searchTerm = '', sortBy = 'Newest First' }: SeriesGridProps) => {
  const navigate = useNavigate();
  const [hoveredSeries, setHoveredSeries] = useState<string | number | null>(null);
  const [activeTab, setActiveTab] = useState<'books' | 'merchandise'>('books');
  const [seriesData, setSeriesData] = useState<ComicSeries[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<ComicSeries[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [filteredMerchandise, setFilteredMerchandise] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [volumeCounts, setVolumeCounts] = useState<Record<string, number>>({});
  
  // Use the specialized hooks for books and merchandise
  const { books, isLoading: booksLoading } = useBooksOnly();
  const { books: merchandise, isLoading: merchandiseLoading } = useMerchandiseOnly();
  
  // Use cart and toast hooks
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    loadSeries();
  }, []);

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

  useEffect(() => {
    applyFiltersAndSearch();
  }, [seriesData, appliedFilters, searchTerm, sortBy]);

  useEffect(() => {
    applyBooksFiltersAndSearch();
  }, [books, appliedFilters, searchTerm, sortBy]);

  useEffect(() => {
    applyMerchandiseFiltersAndSearch();
  }, [merchandise, appliedFilters, searchTerm, sortBy]);

  const applyFiltersAndSearch = () => {
    let filtered = [...seriesData];
    
    console.log('🔍 Starting filter process:');
    console.log('📊 Total series:', seriesData.length);
    console.log('🔍 Search term:', searchTerm);
    console.log('🎯 Applied filters:', appliedFilters);
    console.log('📋 Raw series data:', seriesData.map(s => ({ title: s.title, genre: s.genre, tags: s.tags })));

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(series => {
        const titleMatch = series.title.toLowerCase().includes(searchLower);
        const descMatch = series.description?.toLowerCase().includes(searchLower) || false;
        const genreMatch = series.genre?.some(g => g.toLowerCase().includes(searchLower)) || false;
        const tagsMatch = series.tags?.some(t => t.toLowerCase().includes(searchLower)) || false;
        
        const matches = titleMatch || descMatch || genreMatch || tagsMatch;
        console.log(`🔍 "${series.title}" search match:`, { titleMatch, descMatch, genreMatch, tagsMatch, matches });
        return matches;
      });
      console.log('🔍 After search filter:', filtered.length, 'series remain');
    }

    // Apply category/genre filters
    if (appliedFilters.length > 0) {
      filtered = filtered.filter(series => {
        const hasMatchingGenre = series.genre?.some(g => 
          appliedFilters.some(filter => g.toLowerCase() === filter.toLowerCase())
        ) || false;
        
        const hasMatchingTag = series.tags?.some(t => 
          appliedFilters.some(filter => t.toLowerCase() === filter.toLowerCase())
        ) || false;
        
        const matches = hasMatchingGenre || hasMatchingTag;
        console.log(`🎯 "${series.title}" filter match:`, { 
          genres: series.genre, 
          tags: series.tags, 
          appliedFilters, 
          hasMatchingGenre, 
          hasMatchingTag, 
          matches 
        });
        return matches;
      });
      console.log('🎯 After category filter:', filtered.length, 'series remain');
    }

    // Apply sorting
    switch (sortBy) {
      case 'A-Z':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Z-A':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'Newest First':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'Oldest First':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      default:
        break;
    }

    setFilteredSeries(filtered);
    console.log('✅ Final filtered series:', filtered.length, 'out of', seriesData.length);
    console.log('📋 Final results:', filtered.map(s => s.title));
  };

  const applyBooksFiltersAndSearch = () => {
    let filtered = [...books];
    
    console.log('📚 Starting books filter process:');
    console.log('📊 Total books:', books.length);
    console.log('🔍 Search term:', searchTerm);
    console.log('🎯 Applied filters:', appliedFilters);

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(book => {
        const titleMatch = book.title.toLowerCase().includes(searchLower);
        const descMatch = book.description?.toLowerCase().includes(searchLower) || false;
        const authorMatch = book.author?.toLowerCase().includes(searchLower) || false;
        
        const matches = titleMatch || descMatch || authorMatch;
        console.log(`🔍 "${book.title}" search match:`, { titleMatch, descMatch, authorMatch, matches });
        return matches;
      });
      console.log('🔍 After search filter:', filtered.length, 'books remain');
    }

    // Apply category/genre filters
    if (appliedFilters.length > 0) {
      filtered = filtered.filter(book => {
        const hasMatchingCategory = book.category && 
          appliedFilters.some(filter => 
            book.category.toLowerCase().includes(filter.toLowerCase()) || 
            filter.toLowerCase().includes(book.category.toLowerCase())
          );
        
        const hasMatchingTag = book.tags?.some(tag => 
          appliedFilters.some(filter => 
            tag.toLowerCase().includes(filter.toLowerCase()) || 
            filter.toLowerCase().includes(tag.toLowerCase())
          )
        ) || false;
        
        const matches = hasMatchingCategory || hasMatchingTag;
        console.log(`🎯 "${book.title}" category match:`, { 
          hasMatchingCategory, 
          hasMatchingTag, 
          matches 
        });
        return matches;
      });
      console.log('🎯 After category filter:', filtered.length, 'books remain');
    }

    // Apply sorting
    switch (sortBy) {
      case 'A-Z':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Z-A':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'Newest First':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'Oldest First':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      default:
        break;
    }

    setFilteredBooks(filtered);
    console.log('✅ Final filtered books:', filtered.length, 'out of', books.length);
    console.log('📋 Final results:', filtered.map(b => b.title));
  };

  const applyMerchandiseFiltersAndSearch = () => {
    let filtered = [...merchandise];
    
    console.log('🛍️ Starting merchandise filter process:');
    console.log('📊 Total merchandise:', merchandise.length);
    console.log('🔍 Search term:', searchTerm);
    console.log('🎯 Applied filters:', appliedFilters);

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(searchLower);
        const descMatch = item.description?.toLowerCase().includes(searchLower) || false;
        const categoryMatch = item.category?.toLowerCase().includes(searchLower) || false;
        
        const matches = titleMatch || descMatch || categoryMatch;
        console.log(`🔍 "${item.title}" search match:`, { titleMatch, descMatch, categoryMatch, matches });
        return matches;
      });
      console.log('🔍 After search filter:', filtered.length, 'merchandise remain');
    }

    // Apply category/genre filters
    if (appliedFilters.length > 0) {
      filtered = filtered.filter(item => {
        const hasMatchingCategory = item.category && 
          appliedFilters.some(filter => 
            item.category.toLowerCase().includes(filter.toLowerCase()) || 
            filter.toLowerCase().includes(item.category.toLowerCase())
          );
        
        const hasMatchingTag = item.tags?.some(tag => 
          appliedFilters.some(filter => 
            tag.toLowerCase().includes(filter.toLowerCase()) || 
            filter.toLowerCase().includes(tag.toLowerCase())
          )
        ) || false;
        
        const matches = hasMatchingCategory || hasMatchingTag;
        console.log(`🎯 "${item.title}" category match:`, { 
          hasMatchingCategory, 
          hasMatchingTag, 
          matches 
        });
        return matches;
      });
      console.log('🎯 After category filter:', filtered.length, 'merchandise remain');
    }

    // Apply sorting
    switch (sortBy) {
      case 'A-Z':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Z-A':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'Newest First':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'Oldest First':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      default:
        break;
    }

    setFilteredMerchandise(filtered);
    console.log('✅ Final filtered merchandise:', filtered.length, 'out of', merchandise.length);
    console.log('📋 Final results:', filtered.map(m => m.title));
  };

  const loadSeries = async () => {
    try {
      const series = await ComicService.getSeries();
      console.log('📚 Raw series from ComicService:', series);
      // Filter for active series only
      const activeSeries = series.filter(s => s.is_active);
      console.log('📚 Active series:', activeSeries);
      setSeriesData(activeSeries);
    } catch (error) {
      console.error('Error loading series:', error);
      // Fallback to dummy data if database fails
      setSeriesData([
        {
          id: "1",
      title: "One Piece",
          slug: "one-piece",
      description: "Join Monkey D. Luffy on his epic adventure to become the Pirate King in this legendary manga series.",
          cover_image_url: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
          status: "ongoing",
          genre: ["Adventure"],
          tags: ["Adventure"],
          age_rating: "all",
          total_episodes: 108,
          total_pages: 0,
          is_featured: false,
          is_active: true,
          display_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "2",
      title: "Attack on Titan",
          slug: "attack-on-titan",
      description: "Humanity's last stand against the titans in this gripping and emotional saga.",
          cover_image_url: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
          status: "completed",
          genre: ["Action"],
          tags: ["Action"],
          age_rating: "all",
          total_episodes: 34,
          total_pages: 0,
          is_featured: false,
          is_active: true,
          display_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "3",
      title: "Demon Slayer",
          slug: "demon-slayer",
      description: "Follow Tanjiro's journey to save his sister and defeat demons in this beautifully illustrated series.",
          cover_image_url: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
          status: "completed",
          genre: ["Action"],
          tags: ["Action"],
          age_rating: "all",
          total_episodes: 23,
          total_pages: 0,
          is_featured: false,
          is_active: true,
          display_order: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSeriesClick = (seriesId: string) => {
    console.log('🔍 Series clicked:', seriesId);
    // Navigate to a series detail page instead of pre-order
    navigate(`/series/${seriesId}`);
  };

  const handleBookClick = (bookId: string) => {
    console.log('📚 Book clicked:', bookId);
    // Navigate to the product detail page (books use the same route as merchandise)
    navigate(`/product/${bookId}`);
  };

  const handleAddToCart = async (book: Book) => {
    try {
      console.log('🛒 Adding book to cart:', book.title);
      
      if (!book?.id) {
        toast({
          title: "Error",
          description: "This book does not have a valid ID.",
          variant: "destructive",
        });
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
        coins: book.coins || undefined,
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

  const handleMerchandiseClick = (merchandiseId: string) => {
    console.log('🛍️ SeriesGrid: Merchandise clicked:', merchandiseId);
    console.log('🚀 SeriesGrid: Navigating to merchandise page:', `/merchandise/${merchandiseId}`);
    console.log('📦 SeriesGrid: Available merchandise:', merchandise.map(item => ({ id: item.id, title: item.title })));
    
    const product = merchandise.find(item => item.id === merchandiseId);
    console.log('🔍 SeriesGrid: Found product:', product);
    navigate(`/merchandise/${merchandiseId}`, {
      state: { product }
    });
  };

  return (
    <section className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab('books')}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all duration-300 border ${
                activeTab === 'books'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg border-red-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700 border-gray-600 hover:border-gray-500'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Books
              <span className="text-xs opacity-75">({books.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('merchandise')}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all duration-300 border ${
                activeTab === 'merchandise'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg border-red-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700 border-gray-600 hover:border-gray-500'
              }`}
            >
              <Package className="w-4 h-4" />
              Merchandise
              <span className="text-xs opacity-75">({merchandise.length})</span>
            </button>
          </div>
        </div>

        {/* Books Grid */}
        {activeTab === 'books' && (
          <>
            {booksLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-800 rounded-xl overflow-hidden animate-pulse">
                    <div className="w-full h-80 bg-gray-700"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                      <div className="h-6 bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-full"></div>
                      <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  {appliedFilters.length > 0 || searchTerm ? 'No books found matching your criteria' : 'No books available'}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {appliedFilters.length > 0 || searchTerm ? 'Try adjusting your filters or search term' : 'Add some books in the admin panel'}
                </p>
              </div>
            ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBooks.map((bookItem, index) => (
              <div
                key={bookItem.id}
                className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden hover:from-gray-750 hover:to-gray-850 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 border border-gray-700/50 hover:border-red-500/30 cursor-pointer"
                    onMouseEnter={() => setHoveredSeries(index)}
                onMouseLeave={() => setHoveredSeries(null)}
                onClick={() => handleBookClick(bookItem.id)}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  opacity: 1,
                  transform: 'translateY(0)'
                }}
              >
                <div className="relative overflow-hidden">
                  <img 
                        src={bookItem.image_url || bookItem.cover_page_url || "/placeholder.svg"} 
                    alt={bookItem.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-lg ${
                          bookItem.is_active 
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    }`}>
                      {bookItem.is_active ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                      {/* Price Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          ${bookItem.price || '0.00'}
                    </span>
                  </div>

                  {/* Hover overlay with stats */}
                      {hoveredSeries === index && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="space-y-2">
                        <div className="flex items-center text-white text-sm">
                          <BookOpen className="w-4 h-4 mr-2" />
                              ${bookItem.price || '0.00'}
                        </div>
                        <div className="flex items-center text-white text-sm">
                          <Users className="w-4 h-4 mr-2" />
                              {bookItem.author || 'Unknown Author'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                        <span className="text-red-400 text-xs font-semibold uppercase tracking-wide">{bookItem.category || 'Fiction'}</span>
                  </div>
                  
                  <h3 className="text-white font-semibold text-lg truncate group-hover:text-red-300 transition-colors duration-300">
                    {bookItem.title}
                  </h3>
                  
                  {/* Author name below book title */}
                  <p className="text-gray-400 text-sm font-medium">
                    {bookItem.author || 'Unknown Author'}
                  </p>
                  
                  <p className="text-gray-500 text-xs line-clamp-2 group-hover:text-gray-400 transition-colors duration-300">
                    {bookItem.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    {/* Volume count on the left */}
                    <div className="text-gray-400 text-xs">
                      {bookItem.is_volume 
                        ? `Vol. ${bookItem.volume_number || 1}` 
                        : `${volumeCounts[bookItem.id] || 0} Volume${(volumeCounts[bookItem.id] || 0) !== 1 ? 's' : ''}`
                      }
                    </div>
                    
                    {/* Add to Cart button on the right */}
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(bookItem);
                      }}
                    >
                          Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
            )}
          </>
        )}

        {/* Merchandise Grid */}
        {activeTab === 'merchandise' && (
          <>
            {merchandiseLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-800 rounded-xl overflow-hidden animate-pulse">
                    <div className="w-full h-80 bg-gray-700"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                      <div className="h-6 bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-full"></div>
                      <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMerchandise.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  {appliedFilters.length > 0 || searchTerm ? 'No merchandise found matching your criteria' : 'No merchandise available'}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {appliedFilters.length > 0 || searchTerm ? 'Try adjusting your filters or search term' : 'Add some merchandise in the admin panel'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMerchandise.map((item, index) => (
              <div
                key={item.id}
                className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden hover:from-gray-750 hover:to-gray-850 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 border border-gray-700/50 hover:border-red-500/30 cursor-pointer"
                onMouseEnter={() => setHoveredSeries(item.id)}
                onMouseLeave={() => setHoveredSeries(null)}
                onClick={() => handleMerchandiseClick(item.id)}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  opacity: 1,
                  transform: 'translateY(0)'
                }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={item.image_url || item.hover_image_url || "/placeholder.svg"} 
                    alt={item.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Stock Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-lg ${
                      item.stock_quantity > 0 
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white' 
                        : 'bg-gradient-to-r from-red-600 to-red-700 text-white animate-pulse'
                    }`}>
                      {item.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      ${item.price || '0.00'}
                    </span>
                  </div>

                  {/* Hover overlay with stats */}
                  {hoveredSeries === item.id && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="space-y-2">
                        <div className="flex items-center text-white text-sm">
                          <Package className="w-4 h-4 mr-2" />
                          ${item.price || '0.00'}
                        </div>
                        <div className="flex items-center text-white text-sm">
                          <Users className="w-4 h-4 mr-2" />
                          Stock: {item.stock_quantity || 0}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
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
                      disabled={!item.stock_quantity || item.stock_quantity <= 0}
                      className={`${
                        item.stock_quantity > 0 
                          ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white' 
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      } text-xs font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.stock_quantity > 0) {
                          handleMerchandiseClick(item.id);
                        }
                      }}
                    >
                      {item.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SeriesGrid;
