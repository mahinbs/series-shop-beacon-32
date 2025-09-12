import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ComicService, type ComicSeries } from '@/services/comicService';

interface SeriesGridProps {
  appliedFilters?: string[];
  searchTerm?: string;
  sortBy?: string;
}

const SeriesGrid = ({ appliedFilters = [], searchTerm = '', sortBy = 'Newest First' }: SeriesGridProps) => {
  const navigate = useNavigate();
  const [hoveredSeries, setHoveredSeries] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'books' | 'merchandise'>('books');
  const [seriesData, setSeriesData] = useState<ComicSeries[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<ComicSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSeries();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [seriesData, appliedFilters, searchTerm, sortBy]);

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

  const merchandise = [
    {
      id: 1,
      title: "One Piece Figure Set",
      category: "Figures",
      type: "Collectibles",
      description: "Premium quality figures featuring Luffy, Zoro, and Sanji from the Straw Hat Pirates.",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      popularity: 95,
      price: "$89.99",
      inStock: true,
      reviews: "2.1K"
    },
    {
      id: 2,
      title: "Attack on Titan Hoodie",
      category: "Apparel",
      type: "Clothing",
      description: "Official Survey Corps hoodie with embroidered wings of freedom logo.",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      popularity: 88,
      price: "$49.99",
      inStock: true,
      reviews: "1.5K"
    },
    {
      id: 3,
      title: "Demon Slayer Sword Replica",
      category: "Weapons",
      type: "Replica",
      description: "High-quality replica of Tanjiro's Nichirin sword with display stand.",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      popularity: 92,
      price: "$129.99",
      inStock: false,
      reviews: "890"
    }
  ];

  const handleSeriesClick = (seriesId: string) => {
    console.log('🔍 Series clicked:', seriesId);
    // Navigate to a series detail page instead of pre-order
    navigate(`/series/${seriesId}`);
  };

  const handleMerchandiseClick = (merchandiseId: number) => {
    console.log('🛍️ Merchandise clicked:', merchandiseId);
    console.log('🚀 Navigating to product page:', `/product/${merchandiseId}`);
    
    const product = merchandise.find(item => item.id === merchandiseId);
    navigate(`/product/${merchandiseId}`, {
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
              <span className="text-xs opacity-75">({seriesData.length})</span>
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
            {isLoading ? (
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
            ) : filteredSeries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  {appliedFilters.length > 0 || searchTerm ? 'No series found matching your criteria' : 'No series available'}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {appliedFilters.length > 0 || searchTerm ? 'Try adjusting your filters or search term' : 'Add some series in the admin panel'}
                </p>
              </div>
            ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSeries.map((seriesItem, index) => (
              <div
                key={seriesItem.id}
                className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden hover:from-gray-750 hover:to-gray-850 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 border border-gray-700/50 hover:border-red-500/30 cursor-pointer"
                    onMouseEnter={() => setHoveredSeries(index)}
                onMouseLeave={() => setHoveredSeries(null)}
                onClick={() => handleSeriesClick(seriesItem.id)}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  opacity: 1,
                  transform: 'translateY(0)'
                }}
              >
                <div className="relative overflow-hidden">
                  <img 
                        src={seriesItem.cover_image_url || "/placeholder.svg"} 
                    alt={seriesItem.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-lg ${
                          seriesItem.status === 'ongoing' 
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white animate-pulse' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    }`}>
                      {seriesItem.status}
                    </span>
                  </div>

                      {/* Episodes Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          {seriesItem.total_episodes} Episodes
                    </span>
                  </div>

                  {/* Hover overlay with stats */}
                      {hoveredSeries === index && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="space-y-2">
                        <div className="flex items-center text-white text-sm">
                          <BookOpen className="w-4 h-4 mr-2" />
                              {seriesItem.total_episodes} Episodes
                        </div>
                        <div className="flex items-center text-white text-sm">
                          <Users className="w-4 h-4 mr-2" />
                              {seriesItem.age_rating} Rating
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                        <span className="text-red-400 text-xs font-semibold uppercase tracking-wide">{seriesItem.genre?.[0] || 'Action'}</span>
                  </div>
                  
                  <h3 className="text-white font-semibold text-lg truncate group-hover:text-red-300 transition-colors duration-300">
                    {seriesItem.title}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-2 group-hover:text-gray-400 transition-colors duration-300">
                    {seriesItem.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-gray-400 text-xs">
                          {seriesItem.total_episodes} episodes
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSeriesClick(seriesItem.id);
                      }}
                    >
                          Read Now
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {merchandise.map((item, index) => (
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
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Stock Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-lg ${
                      item.inStock 
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white' 
                        : 'bg-gradient-to-r from-red-600 to-red-700 text-white animate-pulse'
                    }`}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {item.price}
                    </span>
                  </div>

                  {/* Hover overlay with stats */}
                  {hoveredSeries === item.id && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="space-y-2">
                        <div className="flex items-center text-white text-sm">
                          <Users className="w-4 h-4 mr-2" />
                          {item.reviews} Reviews
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
                    {item.type}
                  </p>
                  <p className="text-gray-500 text-xs line-clamp-2 group-hover:text-gray-400 transition-colors duration-300">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-gray-400 text-xs">
                      {item.reviews} reviews
                    </div>
                    <Button 
                      size="sm" 
                      disabled={!item.inStock}
                      className={`${
                        item.inStock 
                          ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white' 
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      } text-xs font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.inStock) {
                          handleMerchandiseClick(item.id);
                        }
                      }}
                    >
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SeriesGrid;
