import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, Download, Share2, Bookmark, Book, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { ComicService, ComicSeries, ComicEpisode, ComicPage } from '@/services/comicService';

const ReadersMode = () => {
  const { seriesTitle } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState<'pdf' | 'page'>('pdf');
  const [series, setSeries] = useState<ComicSeries | null>(null);
  const [episodes, setEpisodes] = useState<ComicEpisode[]>([]);
  const [pages, setPages] = useState<ComicPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the previous page from location state or default to home
  const getBackPath = () => {
    if (location.state?.from === 'popular-recommendations') {
      return '/'; // Go back to home page where PopularRecommendations is
    }
    return '/our-series'; // Default fallback
  };

  // Fetch series data and pages
  useEffect(() => {
    const fetchSeriesData = async () => {
      if (!seriesTitle) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching series data for:', seriesTitle);
        
        // Get series by slug
        const seriesData = await ComicService.getSeriesBySlug(seriesTitle);
        if (!seriesData) {
          setError('Series not found');
          return;
        }
        
        setSeries(seriesData);
        console.log('✅ Series found:', seriesData);
        
        // Get episodes for this series
        const seriesEpisodes = await ComicService.getEpisodes(seriesData.id);
        setEpisodes(seriesEpisodes);
        console.log('📚 Episodes found:', seriesEpisodes);
        
        // Get pages from all episodes
        const allPages: ComicPage[] = [];
        for (const episode of seriesEpisodes) {
          const episodePages = await ComicService.getPages(episode.id);
          allPages.push(...episodePages);
        }
        
        // Sort pages by episode number and page number
        allPages.sort((a, b) => {
          const episodeA = seriesEpisodes.find(e => e.id === a.episode_id);
          const episodeB = seriesEpisodes.find(e => e.id === b.episode_id);
          if (episodeA && episodeB) {
            if (episodeA.episode_number !== episodeB.episode_number) {
              return episodeA.episode_number - episodeB.episode_number;
            }
          }
          return a.page_number - b.page_number;
        });
        
        setPages(allPages);
        console.log('📄 Pages found:', allPages.length);
        
      } catch (err) {
        console.error('❌ Error fetching series data:', err);
        setError('Failed to load series data');
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesData();
  }, [seriesTitle]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold">Loading series...</h1>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !series) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-400">{error || 'Series not found'}</h1>
          <Button onClick={() => navigate(getBackPath())} className="bg-red-600 hover:bg-red-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  // No pages available
  if (pages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-yellow-400">No pages available</h1>
          <p className="text-gray-400 mb-4">This series doesn't have any pages yet.</p>
          <Button onClick={() => navigate(getBackPath())} className="bg-red-600 hover:bg-red-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-sm border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(getBackPath())}
            className="text-white hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="font-semibold">{series.title}</h1>
            <p className="text-sm text-gray-400">
              Page {currentPage} of {pages.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <Button
              variant={viewMode === 'pdf' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('pdf')}
              className={`text-white text-xs ${viewMode === 'pdf' ? 'bg-red-600' : 'hover:bg-gray-700'}`}
            >
              <FileText className="w-4 h-4 mr-1" />
              PDF
            </Button>
            <Button
              variant={viewMode === 'page' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('page')}
              className={`text-white text-xs ${viewMode === 'page' ? 'bg-red-600' : 'hover:bg-gray-700'}`}
            >
              <Book className="w-4 h-4 mr-1" />
              Page
            </Button>
          </div>

          <div className="w-px h-6 bg-gray-600 mx-2" />

          {viewMode === 'pdf' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="text-white hover:bg-gray-800"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm px-2">{zoomLevel}%</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="text-white hover:bg-gray-800"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              
              <div className="w-px h-6 bg-gray-600 mx-2" />
            </>
          )}
          
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
            <Bookmark className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'pdf' ? (
        <div className="flex">
          {/* Sidebar with page thumbnails */}
          <div className="w-48 bg-gray-800 p-4 h-screen overflow-y-auto">
            <h3 className="text-sm font-semibold mb-4 text-gray-300">Pages</h3>
            <div className="space-y-2">
              {pages.map((page, index) => (
                <div
                  key={page.id}
                  className={`cursor-pointer border-2 rounded ${
                    currentPage === index + 1 
                      ? 'border-red-500' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  <img
                    src={page.image_url}
                    alt={page.alt_text || `Page ${index + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                  <p className="text-xs text-center py-1">{index + 1}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main viewer */}
          <div className="flex-1 flex justify-center items-start p-8 overflow-auto">
            <div 
              className="bg-white rounded-lg shadow-2xl"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              <img
                src={pages[currentPage - 1]?.image_url}
                alt={pages[currentPage - 1]?.alt_text || `${series.title} - Page ${currentPage}`}
                className="max-w-none w-[600px] h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Page Mode - Full screen single page */
        <div className="flex-1 flex justify-center items-center min-h-screen bg-gray-900 p-4">
          <div className="max-w-4xl w-full">
            <img
              src={pages[currentPage - 1]?.image_url}
              alt={pages[currentPage - 1]?.alt_text || `${series.title} - Page ${currentPage}`}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="text-white hover:bg-gray-800 disabled:opacity-50"
        >
          Previous
        </Button>
        
        <span className="text-sm">{currentPage} / {pages.length}</span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, pages.length))}
          disabled={currentPage === pages.length}
          className="text-white hover:bg-gray-800 disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ReadersMode;
