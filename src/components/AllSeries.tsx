import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ComicService, type ComicSeries } from '@/services/comicService';
import { BookOpen } from 'lucide-react';

const AllSeries = () => {
  const navigate = useNavigate();
  const [allSeries, setAllSeries] = useState<ComicSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    try {
      setIsLoading(true);
      const seriesData = await ComicService.getSeries();
      // Filter out "Drama Seryes" series
      const filteredSeries = seriesData.filter(series => 
        series.title.toLowerCase() !== 'drama seryes'
      );
      setAllSeries(filteredSeries);
    } catch (error) {
      console.error('Error loading series:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReadClick = (series: ComicSeries) => {
    navigate(`/readers/${series.slug}`);
  };

  return (
    <section id="all-series" className="bg-gray-850 py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">All Series</h2>
          <span className="text-gray-400">Showing {allSeries.length} series</span>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            <span className="ml-3 text-gray-400">Loading series...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {allSeries.map((series, index) => (
            <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img 
                    src={series.cover_image_url || '/placeholder.svg'} 
                    alt={series.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Enhanced hover overlay with series details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                    <div className="text-white space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-lg font-bold text-red-300">{series.title}</h3>
                      <p className="text-xs text-gray-300 line-clamp-2">{series.description || 'No description available'}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 uppercase">{series.genre?.[0] || 'General'}</span>
                        <span className="text-xs text-gray-400">{series.total_episodes || 0} episodes</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <Button 
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReadClick(series);
                      }}
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      Read Now
                    </Button>
                  </div>
                </div>
              <h3 className="text-white font-medium text-sm group-hover:text-red-400 transition-colors duration-200 line-clamp-2">
                {series.title}
              </h3>
            </div>
          ))}
          </div>
        )}
        
        {!isLoading && allSeries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white text-lg mb-2">No series available</div>
            <div className="text-gray-400 text-sm">Check back soon for new series!</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllSeries;
