import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, RefreshCw } from 'lucide-react';
import { ComicService, type ComicSeries } from '@/services/comicService';
import { FeaturedSeriesService, type FeaturedSeriesConfig, type FeaturedSeriesBadge } from '@/services/featuredSeriesService';
import { fuzzySearchItems } from '@/utils/fuzzySearch';

interface FeaturedSeriesSlideshowProps {
  appliedFilters?: string[];
  searchTerm?: string;
  sortBy?: string;
}

const FeaturedSeriesSlideshow = ({ appliedFilters = [], searchTerm = '', sortBy = 'Newest First' }: FeaturedSeriesSlideshowProps) => {
  const navigate = useNavigate();
  const [featuredSeries, setFeaturedSeries] = useState<ComicSeries[]>([]);
  const [configs, setConfigs] = useState<FeaturedSeriesConfig[]>([]);
  const [badges, setBadges] = useState<FeaturedSeriesBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedSeriesData();
  }, []);

  const loadFeaturedSeriesData = async () => {
    try {
      console.log('⭐ Loading Featured Series Slideshow data...');
      setIsLoading(true);
      
      // Load featured series
      const seriesData = await ComicService.getSeries();
      const featured = seriesData.filter(s => s.is_featured && s.is_active).slice(0, 3);
      setFeaturedSeries(featured);
      console.log('⭐ Featured series loaded for slideshow:', featured);

      // Load configurations
      const configData = await FeaturedSeriesService.getConfigs();
      setConfigs(configData);
      console.log('⭐ Configs loaded for slideshow:', configData);
      console.log('🖼️ Background image URLs in configs:', configData.map(c => ({ id: c.id, title: c.title, background_image_url: c.background_image_url })));
      
      // Log the active config details
      const activeConfig = configData.find(config => config.is_active) || configData[0];
      if (activeConfig) {
        console.log('🎯 Active config for slideshow:', {
          id: activeConfig.id,
          title: activeConfig.title,
          background_image_url: activeConfig.background_image_url,
          hasBackgroundImage: !!activeConfig.background_image_url
        });
      }

      // Load badges
      const badgeData = await FeaturedSeriesService.getBadges();
      setBadges(badgeData);
      console.log('⭐ Badges loaded for slideshow:', badgeData);
    } catch (error) {
      console.error('❌ Error loading Featured Series Slideshow data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeForSeries = (series: ComicSeries, index: number): { name: string; color: string } => {
    // Use badges from admin panel if available, otherwise use default logic
    if (badges.length > 0) {
      const badgeIndex = index % badges.length;
      const badge = badges[badgeIndex];
      return {
        name: badge.name,
        color: badge.color
      };
    }
    
    // Fallback to default badges
    const defaultBadges = [
      { name: "New Chapter", color: "bg-red-600" },
      { name: "Trending", color: "bg-blue-600" },
      { name: "Updated", color: "bg-green-600" }
    ];
    const badgeIndex = index % defaultBadges.length;
    return defaultBadges[badgeIndex];
  };

  const handleSeriesClick = (series: ComicSeries) => {
    navigate(`/series/${series.id}`);
  };

  const handleReadClick = (series: ComicSeries) => {
    navigate(`/digital-reader/${encodeURIComponent(series.slug || series.title.toLowerCase().replace(/\s+/g, '-'))}`);
  };

  // Filter and sort series based on props
  const filteredAndSortedSeries = useMemo(() => {
    let filtered = [...featuredSeries];

    console.log('🎬 FeaturedSeriesSlideshow: Starting filter process');
    console.log('📊 Total featured series:', filtered.length);
    console.log('🔍 Search term:', searchTerm);
    console.log('🎯 Applied filters:', appliedFilters);

    // Apply search filter with fuzzy matching
    if (searchTerm.trim()) {
      // Use fuzzy search for better typo tolerance
      filtered = fuzzySearchItems(
        filtered,
        searchTerm,
        ['title', 'description'],
        0.6 // 60% similarity threshold
      );
      console.log('🔍 After fuzzy search filter:', filtered.length, 'series remain');
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

    console.log('✅ Final filtered featured series:', filtered.length, 'out of', featuredSeries.length);
    return filtered;
  }, [featuredSeries, appliedFilters, searchTerm, sortBy]);

  if (isLoading) {
    return (
      <section id="featured-series" className="relative bg-gray-900 py-8 border-b border-gray-700/50">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-white">Loading featured series...</p>
          </div>
        </div>
      </section>
    );
  }

  // Get the active configuration
  const activeConfig = configs.find(config => config.is_active) || configs[0];

  try {
    return (
      <section 
        id="featured-series" 
        className="relative py-8 border-b border-gray-700/50"
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
        </div>
        
        {filteredAndSortedSeries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {featuredSeries.length === 0 
                ? "No featured series available" 
                : "No featured series match your current filters"
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
              const badgeInfo = getBadgeForSeries(series, index);
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
                    {badgeInfo.name}
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
        {/* {activeConfig && (activeConfig.primary_button_text || activeConfig.secondary_button_text) && (
          <div className="flex justify-center gap-4 mt-8">
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
        )} */}
      </div>
    </section>
    );
  } catch (error) {
    console.error('Error in FeaturedSeriesSlideshow:', error);
    return (
      <section id="featured-series" className="relative bg-gray-900 py-8 border-b border-gray-700/50">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-white text-lg">Error loading featured series</p>
            <p className="text-gray-400 text-sm mt-2">Please try refreshing the page</p>
          </div>
        </div>
      </section>
    );
  }
};

export default FeaturedSeriesSlideshow;