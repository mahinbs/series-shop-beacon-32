import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, Download, Share2, Bookmark, Book, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { ComicService, type ComicSeries, type ComicEpisode, type ComicPage } from '@/services/comicService';
import { useToast } from '@/hooks/use-toast';

const ReadersMode = () => {
  const { seriesTitle } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState<'pdf' | 'page'>('pdf');
  const [series, setSeries] = useState<ComicSeries | null>(null);
  const [episodes, setEpisodes] = useState<ComicEpisode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<ComicEpisode | null>(null);
  const [pages, setPages] = useState<ComicPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load series data from database
  useEffect(() => {
    const loadSeriesData = async () => {
      if (!seriesTitle) {
        setError('No series specified');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Load series by slug
        const seriesData = await ComicService.getSeriesBySlug(seriesTitle);
        if (!seriesData) {
          // Fallback to mock data
          const mockSeriesData = {
            "demon-slayer": {
              title: "Demon Slayer",
              totalPages: 24,
              pages: Array.from({ length: 24 }, (_, i) => `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`)
            },
            "jujutsu-kaisen": {
              title: "Jujutsu Kaisen",
              totalPages: 24,
              pages: Array.from({ length: 24 }, (_, i) => `https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop&crop=center`)
            },
            "one-piece": {
              title: "One Piece",
              totalPages: 1000,
              pages: Array.from({ length: 1000 }, (_, i) => `https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop&crop=center`)
            },
            "shadow-hunter-chronicles": {
              title: "Shadow Hunter Chronicles",
              totalPages: 45,
              pages: Array.from({ length: 45 }, (_, i) => `/lovable-uploads/4e6b2521-dc40-43e9-aed0-53fef670570b.png`)
            },
            "romantic-coffee-shop": {
              title: "Romantic Coffee Shop",
              totalPages: 28,
              pages: Array.from({ length: 28 }, (_, i) => `/lovable-uploads/6ce223e4-a7e8-4282-a3a6-0f55f5341a03.png`)
            },
            "cyberpunk-dreams": {
              title: "Cyberpunk Dreams",
              totalPages: 67,
              pages: Array.from({ length: 67 }, (_, i) => `/lovable-uploads/781ea40e-866e-4ee8-9bf7-862a42bb8716.png`)
            }
          };

          const mockSeries = mockSeriesData[seriesTitle as keyof typeof mockSeriesData] || {
            title: seriesTitle?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown Series',
            totalPages: 24,
            pages: Array.from({ length: 24 }, (_, i) => `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`)
          };

          // Create mock series and episode data
          const mockSeriesObj = {
            id: seriesTitle || 'mock-series',
            title: mockSeries.title,
            slug: seriesTitle || 'mock-series',
            description: `Read ${mockSeries.title} online`,
            cover_image_url: mockSeries.pages[0],
            status: 'ongoing',
            is_featured: true,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          const mockEpisode = {
            id: `${seriesTitle}-episode-1`,
            series_id: seriesTitle || 'mock-series',
            episode_number: 1,
            title: `${mockSeries.title} - Episode 1`,
            description: `First episode of ${mockSeries.title}`,
            is_free: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          const mockPages = mockSeries.pages.map((pageUrl, index) => ({
            id: `${seriesTitle}-page-${index + 1}`,
            episode_id: `${seriesTitle}-episode-1`,
            page_number: index + 1,
            image_url: pageUrl,
            alt_text: `${mockSeries.title} - Page ${index + 1}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));

          setSeries(mockSeriesObj);
          setEpisodes([mockEpisode]);
          setCurrentEpisode(mockEpisode);
          setPages(mockPages);
          setCurrentPage(1); // Ensure we start at page 1
          setIsLoading(false);
          return;
        }

        setSeries(seriesData);

        // Load episodes for this series
        const episodesData = await ComicService.getEpisodes(seriesData.id);
        setEpisodes(episodesData);

        // Set first episode as current if available
        if (episodesData.length > 0) {
          setCurrentEpisode(episodesData[0]);
          // Load pages for first episode
          const pagesData = await ComicService.getPages(episodesData[0].id);
          setPages(pagesData);
        }

      } catch (err) {
        console.error('Error loading series data:', err);
        setError('Failed to load series data');
      } finally {
        setIsLoading(false);
      }
    };

    loadSeriesData();
  }, [seriesTitle]);

  // Load pages when episode changes
  useEffect(() => {
    const loadEpisodePages = async () => {
      if (!currentEpisode) return;

      try {
        const pagesData = await ComicService.getPages(currentEpisode.id);
        setPages(pagesData);
        setCurrentPage(1); // Reset to first page
      } catch (err) {
        console.error('Error loading episode pages:', err);
        toast({
          title: "Error",
          description: "Failed to load episode pages",
          variant: "destructive"
        });
      }
    };

    loadEpisodePages();
  }, [currentEpisode, toast]);

  // Ensure currentPage is set to 1 when pages are loaded
  useEffect(() => {
    if (pages.length > 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [pages, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pages.length) {
      setCurrentPage(page);
    }
  };

  const handleEpisodeChange = (episode: ComicEpisode) => {
    setCurrentEpisode(episode);
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading comic...</p>
        </div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Series not found</h1>
          <p className="text-gray-400 mb-4">{error || 'The requested series could not be found.'}</p>
          <Button onClick={() => navigate('/our-series')} className="bg-primary hover:bg-primary/90">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Series
          </Button>
        </div>
      </div>
    );
  }

  if (!currentEpisode || pages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No episodes available</h1>
          <p className="text-gray-400 mb-4">This series doesn't have any published episodes yet.</p>
          <Button onClick={() => navigate('/our-series')} className="bg-primary hover:bg-primary/90">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Series
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-sm border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/our-series')}
            className="text-white hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="font-semibold">{series.title}</h1>
            <p className="text-sm text-gray-400">
              {currentEpisode.title} - Page {currentPage} of {pages.length}
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

      {/* Episode Navigation */}
      {episodes.length > 1 && (
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">Episodes:</span>
              <div className="flex items-center gap-2 max-w-2xl overflow-x-auto">
                {episodes.map((episode, index) => (
                  <Button
                    key={episode.id}
                    variant={currentEpisode.id === episode.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleEpisodeChange(episode)}
                    className={`whitespace-nowrap ${
                      currentEpisode.id === episode.id 
                        ? 'bg-primary text-white' 
                        : 'text-gray-300 border-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    Ep. {episode.episode_number}
                    {episode.is_free ? (
                      <Badge variant="secondary" className="ml-2 text-xs bg-green-600 text-white">Free</Badge>
                    ) : (
                      <Badge variant="outline" className="ml-2 text-xs border-yellow-500 text-yellow-400">
                        {episode.coin_price} coins
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
                  if (currentIndex > 0) {
                    handleEpisodeChange(episodes[currentIndex - 1]);
                  }
                }}
                disabled={episodes.findIndex(ep => ep.id === currentEpisode.id) === 0}
                className="text-gray-300 hover:bg-gray-700"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev Episode
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
                  if (currentIndex < episodes.length - 1) {
                    handleEpisodeChange(episodes[currentIndex + 1]);
                  }
                }}
                disabled={episodes.findIndex(ep => ep.id === currentEpisode.id) === episodes.length - 1}
                className="text-gray-300 hover:bg-gray-700"
              >
                Next Episode
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

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
                    currentPage === page.page_number 
                      ? 'border-red-500' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setCurrentPage(page.page_number)}
                >
                  <img
                    src={page.image_url}
                    alt={page.alt_text || `Page ${page.page_number}`}
                    className="w-full h-20 object-cover rounded"
                  />
                  <p className="text-xs text-center py-1">{page.page_number}</p>
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
              {(() => {
                const currentPageData = pages.find(p => p.page_number === currentPage);
                const firstPageData = pages.find(p => p.page_number === 1);
                console.log('Current page:', currentPage);
                console.log('Pages available:', pages.map(p => p.page_number));
                console.log('Current page data:', currentPageData);
                console.log('First page data:', firstPageData);
                
                const pageToShow = currentPageData || firstPageData;
                return pageToShow && (
                  <img
                    src={pageToShow.image_url}
                    alt={pageToShow.alt_text || `${series.title} - Page ${currentPage}`}
                    className="max-w-none w-[600px] h-auto rounded-lg"
                  />
                );
              })()}
            </div>
          </div>
        </div>
      ) : (
        /* Page Mode - Full screen single page */
        <div className="flex-1 flex justify-center items-center min-h-screen bg-gray-900 p-4">
          <div className="max-w-4xl w-full">
            {(() => {
              const currentPageData = pages.find(p => p.page_number === currentPage);
              const firstPageData = pages.find(p => p.page_number === 1);
              console.log('Page Mode - Current page:', currentPage);
              console.log('Page Mode - Pages available:', pages.map(p => p.page_number));
              console.log('Page Mode - Current page data:', currentPageData);
              console.log('Page Mode - First page data:', firstPageData);
              
              const pageToShow = currentPageData || firstPageData;
              return pageToShow && (
                <img
                  src={pageToShow.image_url}
                  alt={pageToShow.alt_text || `${series.title} - Page ${currentPage}`}
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              );
            })()}
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
