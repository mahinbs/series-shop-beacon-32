import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Play, RefreshCw } from 'lucide-react';
import { ComicService, type ComicSeries } from '@/services/comicService';
import { FeaturedSeriesService, type FeaturedSeriesConfig, type FeaturedSeriesBadge } from '@/services/featuredSeriesService';

const FeaturedSeriesSlideshow = () => {
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {activeConfig?.title || 'Featured Series'}
            </h2>
            {activeConfig?.description && (
              <p className="text-gray-300 mt-2 max-w-2xl">
                {activeConfig.description}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                console.log('🔍 FeaturedSeriesSlideshow Debug:');
                console.log('📊 Configs:', configs);
                console.log('🎯 Active Config:', activeConfig);
                console.log('🏷️ Badges:', badges);
                console.log('⭐ Featured Series:', featuredSeries);
                console.log('💾 localStorage configs:', localStorage.getItem('featured_series_configs'));
                console.log('💾 localStorage badges:', localStorage.getItem('featured_series_badges'));
              }}
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Debug
            </Button>
            <Button
              onClick={loadFeaturedSeriesData}
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        {featuredSeries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No featured series available</p>
            <p className="text-gray-500 text-sm mt-2">Add some series and mark them as featured in the admin panel</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSeries.map((series, index) => {
              const badgeInfo = getBadgeForSeries(series, index);
              return (
            <div
              key={series.id}
              className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-transform duration-300 group"
                  onClick={() => handleSeriesClick(series)}
            >
              {/* Image with Badge */}
              <div className="relative">
                <img
                      src={series.cover_image_url || "/placeholder.svg"}
                  alt={series.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Enhanced hover overlay with series details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                  <div className="text-white space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-lg font-bold text-red-300">{series.title}</h3>
                    <p className="text-xs text-gray-300 line-clamp-2">{series.description}</p>
                    <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 uppercase">{series.genre?.[0] || 'Action'}</span>
                          <span className="text-xs text-gray-400">{series.total_episodes || 0} episodes</span>
                    </div>
                    <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 uppercase">{series.status || 'Ongoing'}</span>
                    </div>
                  </div>
                </div>
                
                    <div className={`absolute top-3 right-3 ${badgeInfo.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {badgeInfo.name}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Title */}
                <div className="mb-2">
                  <h3 className="text-xl font-bold text-white">{series.title}</h3>
                </div>

                {/* Description */}
                    <div className="mb-4">
                      <p className="text-gray-300 text-sm line-clamp-3">{series.description}</p>
                    </div>

                {/* Genres */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {series.genre?.slice(0, 3).map((genre, genreIndex) => (
                    <span
                            key={genreIndex}
                            className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                      </div>
                </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReadClick(series);
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Start Reading
                      </Button>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                          handleSeriesClick(series);
                  }}
                        variant="outline"
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                        <Play className="h-4 w-4 mr-2" />
                        View Series
                </Button>
              </div>
            </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Configuration Buttons */}
        {activeConfig && (activeConfig.primary_button_text || activeConfig.secondary_button_text) && (
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
        )}
      </div>
    </section>
  );
};

export default FeaturedSeriesSlideshow;