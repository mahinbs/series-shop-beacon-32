import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Play, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ComicService, type ComicSeries } from '@/services/comicService';
import { FeaturedSeriesService, type FeaturedSeriesConfig, type FeaturedSeriesBadge } from '@/services/featuredSeriesService';

interface FeaturedSeriesProps {
  filters?: {
    search: string;
    genre: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

const FeaturedSeries = ({ filters }: FeaturedSeriesProps) => {
  const navigate = useNavigate();
  const [featuredSeries, setFeaturedSeries] = useState<ComicSeries[]>([]);
  const [configs, setConfigs] = useState<FeaturedSeriesConfig[]>([]);
  const [badges, setBadges] = useState<FeaturedSeriesBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedSeries();
  }, []);

  const loadFeaturedSeries = async () => {
    try {
      const series = await ComicService.getSeries();
      // Filter for featured series and limit to 3
      const featured = series.filter(s => s.is_featured && s.is_active).slice(0, 3);
      setFeaturedSeries(featured);
    } catch (error) {
      console.error('Error loading featured series:', error);
      // Fallback to dummy data if database fails
      setFeaturedSeries([
        {
          id: "1",
      title: "Demon Slayer",
          slug: "demon-slayer",
      description: "Follow Tanjiro's quest to cure his sister and battle demons",
          status: "ongoing",
          cover_image_url: "/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png",
          genre: ["Action", "Supernatural", "Drama"],
      tags: ["Action", "Supernatural", "Drama"],
          age_rating: "all",
          total_episodes: 44,
          total_pages: 0,
          is_featured: true,
          is_active: true,
          display_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "2",
      title: "Jujutsu Kaisen",
          slug: "jujutsu-kaisen",
      description: "Enter a world where curses can be fought and exercised",
          status: "ongoing",
          cover_image_url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop&crop=center",
          genre: ["Action", "Fantasy", "Horror"],
      tags: ["Action", "Fantasy", "Horror"],
          age_rating: "all",
          total_episodes: 24,
          total_pages: 0,
          is_featured: true,
          is_active: true,
          display_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "3",
      title: "One Piece",
          slug: "one-piece",
      description: "Join Luffy and his pirate crew on their grand adventure",
          status: "ongoing",
          cover_image_url: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop&crop=center",
          genre: ["Adventure", "Action", "Comedy"],
      tags: ["Adventure", "Action", "Comedy"],
          age_rating: "all",
          total_episodes: 1000,
          total_pages: 0,
          is_featured: true,
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

  // Load configurations and badges
  useEffect(() => {
    const loadConfigsAndBadges = async () => {
      try {
        // Load configurations
        const configData = await FeaturedSeriesService.getConfigs();
        setConfigs(configData);
        console.log('⭐ Configs loaded in FeaturedSeries:', configData);

        // Load badges
        const badgeData = await FeaturedSeriesService.getBadges();
        setBadges(badgeData);
        console.log('⭐ Badges loaded in FeaturedSeries:', badgeData);
      } catch (error) {
        console.error('❌ Error loading configs and badges:', error);
      }
    };
    
    loadConfigsAndBadges();
  }, []);

  // Filter and sort series based on filters
  const filteredAndSortedSeries = useMemo(() => {
    let filtered = [...featuredSeries];

    // Apply search filter
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(series => 
        series.title.toLowerCase().includes(searchTerm) ||
        series.description.toLowerCase().includes(searchTerm) ||
        series.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply genre filter
    if (filters?.genre && filters.genre !== 'All') {
      filtered = filtered.filter(series => 
        series.genre?.includes(filters.genre) || 
        series.tags?.includes(filters.genre)
      );
    }

    // Apply sorting
    if (filters?.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (filters.sortBy) {
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'episodes':
            aValue = a.total_episodes || 0;
            bValue = b.total_episodes || 0;
            break;
          case 'status':
            aValue = a.status || '';
            bValue = b.status || '';
            break;
          case 'created_at':
            aValue = new Date(a.created_at).getTime();
            bValue = new Date(b.created_at).getTime();
            break;
          default:
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
        }

        if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [featuredSeries, filters]);

  const getBadgeInfo = (series: ComicSeries, index: number) => {
    // Use badges from admin panel if available, otherwise use default logic
    if (badges.length > 0) {
      const badgeIndex = index % badges.length;
      const badge = badges[badgeIndex];
      return {
        text: badge.name,
        color: badge.color
      };
    }
    
    // Fallback to default badges
    const defaultBadges = [
      { text: "New", color: "bg-blue-500" },
      { text: "Popular", color: "bg-green-500" },
      { text: "Top Rated", color: "bg-purple-500" }
    ];
    return defaultBadges[index] || { text: "Featured", color: "bg-red-500" };
  };

  if (isLoading) {
  return (
    <section className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-12">Featured Series</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
                <div className="w-full h-64 bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Get the active configuration
  const activeConfig = configs.find(config => config.is_active) || configs[0];

  return (
    <section 
      className="py-16"
      style={{
        backgroundImage: activeConfig?.background_image_url ? `url(${activeConfig.background_image_url})` : undefined,
        backgroundColor: activeConfig?.background_image_url ? undefined : '#111827'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white">
            Featured Series
          </h2>
          {activeConfig?.description && (
            <p className="text-gray-300 mt-2 max-w-2xl">
              {activeConfig.description}
            </p>
          )}
        </div>
        
        {filteredAndSortedSeries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {featuredSeries.length === 0 
                ? "No featured series available" 
                : "No series match your current filters"
              }
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {featuredSeries.length === 0 
                ? "Add some series and mark them as featured in the admin panel"
                : "Try adjusting your search or filter criteria"
              }
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredAndSortedSeries.map((series, index) => {
              const badgeInfo = getBadgeInfo(series, index);
              return (
            <div
              key={series.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 min-h-[560px] transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 hover:scale-105 cursor-pointer group"
              onClick={() => navigate(`/readers/${series.slug}`)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={series.cover_image_url || "/placeholder.svg"}
                  alt={series.title}
                  className="w-full h-96 object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                />
                
                {/* Subtle hover overlay to indicate clickability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Enhanced hover overlay with series details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                  <div className="text-white space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-lg font-bold text-red-300">{series.title}</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{series.genre?.join(', ') || 'General'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{series.total_episodes} Episodes</span>
                      <span className="text-sm text-gray-300 capitalize">{series.status}</span>
                    </div>
                    {series.description && (
                      <p className="text-xs text-gray-300 line-clamp-2 mt-2">{series.description}</p>
                    )}
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 space-y-2 z-10">
                  <span className={`${badgeInfo.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                    {badgeInfo.text}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{series.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{series.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {series.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{series.total_episodes} Episodes</span>
                  <span className="capitalize">{series.status}</span>
                </div>
                
                {/* Read Button */}
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/readers/${series.slug}`);
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read Now
                </Button>
              </div>
            </div>
              );
            })}
          </div>
        )}

        {/* Configuration Buttons */}
        {activeConfig && (activeConfig.primary_button_text || activeConfig.secondary_button_text) && (
          <div className="flex justify-center gap-4 mt-12">
            {activeConfig.primary_button_text && (
              <Button
                onClick={() => window.location.href = activeConfig.primary_button_link || '#'}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
              >
                {activeConfig.primary_button_text}
              </Button>
            )}
            {activeConfig.secondary_button_text && (
              <Button
                onClick={() => window.location.href = activeConfig.secondary_button_link || '#'}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-6 py-2"
              >
                {activeConfig.secondary_button_text}
              </Button>
            )}
        </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSeries;
