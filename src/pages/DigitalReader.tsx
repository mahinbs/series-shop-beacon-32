import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, Download, Share2, Bookmark, Book, FileText, Users, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { ComicService, type ComicSeries, type ComicEpisode, type ComicPage } from '@/services/comicService';

const DigitalReader = () => {
  const { seriesTitle } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState<'pdf' | 'page'>('page');
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
          setError('Series not found');
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
      }
    };

    loadEpisodePages();
  }, [currentEpisode]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pages.length) {
      setCurrentPage(page);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download episode');
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share episode');
  };

  const handleBookmark = () => {
    // TODO: Implement bookmark functionality
    console.log('Bookmark episode');
  };

  const handleEpisodeChange = (episode: ComicEpisode) => {
    setCurrentEpisode(episode);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading comic...</p>
        </div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Series not found</h1>
          <p className="text-muted-foreground mb-4">{error || 'The requested series could not be found.'}</p>
          <Button onClick={() => navigate('/our-series')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Series
          </Button>
        </div>
      </div>
    );
  }

  if (!currentEpisode || pages.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No episodes available</h1>
          <p className="text-muted-foreground mb-4">This series doesn't have any published episodes yet.</p>
          <Button onClick={() => navigate('/our-series')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Series
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/our-series')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">{series.title}</h1>
                <p className="text-sm text-muted-foreground">{currentEpisode.title}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">{zoomLevel}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleBookmark}>
                <Bookmark className="w-4 h-4 mr-2" />
                Bookmark
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Series Info */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-6">
            {series.cover_image_url && (
              <img
                src={series.cover_image_url}
                alt={series.title}
                className="w-16 h-20 object-cover rounded-md"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <Badge variant={series.status === 'ongoing' ? 'default' : 'secondary'}>
                  {series.status}
                </Badge>
                <Badge variant="outline">{series.age_rating}</Badge>
                {series.genre?.map(genre => (
                  <Badge key={genre} variant="outline" className="text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {series.description}
              </p>
              {series.creators && series.creators.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    by {series.creators.map(c => c.creator?.name).filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Episode Selector */}
      {episodes.length > 1 && (
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Episodes:</span>
              {episodes.map((episode) => (
                <Button
                  key={episode.id}
                  variant={currentEpisode.id === episode.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleEpisodeChange(episode)}
                  className="whitespace-nowrap"
                >
                  Episode {episode.episode_number}
                  {episode.is_free ? (
                    <Badge variant="secondary" className="ml-2 text-xs">Free</Badge>
                  ) : (
                    <Badge variant="outline" className="ml-2 text-xs">{episode.coin_price} coins</Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reader Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="max-w-4xl w-full">
            {/* Page Navigation */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Previous Page
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Page</span>
                <input
                  type="number"
                  min="1"
                  max={pages.length}
                  value={currentPage}
                  onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
                  className="w-16 h-8 px-2 text-center border rounded-md bg-background"
                />
                <span className="text-sm text-muted-foreground">of {pages.length}</span>
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pages.length}
              >
                Next Page
              </Button>
            </div>

            {/* Page Content */}
            <div className="bg-card border rounded-lg overflow-hidden shadow-lg">
              <div 
                className="flex justify-center"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              >
                {pages[currentPage - 1] && (
                  <img
                    src={pages[currentPage - 1].image_url}
                    alt={pages[currentPage - 1].alt_text || `${series.title} - Page ${currentPage}`}
                    className="max-w-full h-auto"
                    style={{ maxHeight: '80vh' }}
                  />
                )}
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Previous Page
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pages.length}
              >
                Next Page
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalReader;