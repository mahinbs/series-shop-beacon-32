import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, Download, Share2, Bookmark, Book, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DigitalReaderService } from '@/services/digitalReaderService';

interface EpisodePage {
  page_number: number;
  image_url: string;
}

export function EpisodeReader() {
  const { id: episodeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState<'pdf' | 'page'>('pdf');
  const [episodeTitle, setEpisodeTitle] = useState<string>('');
  const [comicTitle, setComicTitle] = useState<string>('');
  const [pages, setPages] = useState<EpisodePage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load episode data and pages
  useEffect(() => {
    const loadEpisodeData = async () => {
      if (!episodeId) {
        setError('No episode specified');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Load episode pages
        const pagesData = await DigitalReaderService.getEpisodePages(episodeId);
        
        if (pagesData.length === 0) {
          setError('No pages found for this episode.');
          return;
        }

        setPages(pagesData);

        // Try to get episode details to set title and comic title
        try {
          const allSpecs = await DigitalReaderService.getSpecs();
          let foundEpisode: any = null;
          let foundSpec: any = null;

          for (const spec of allSpecs) {
            const episodes = await DigitalReaderService.getEpisodes(spec.id);
            foundEpisode = episodes.find((ep: any) => ep.id === episodeId);
            if (foundEpisode) {
              foundSpec = spec;
              break;
            }
          }

          if (foundEpisode && foundSpec) {
            setEpisodeTitle(`Episode ${foundEpisode.chapter_number}: ${foundEpisode.title}`);
            setComicTitle(foundSpec.title);
          } else {
            setEpisodeTitle('Episode');
            setComicTitle('Comic');
          }
        } catch (e) {
          console.error('Failed to load episode details:', e);
          setEpisodeTitle('Episode');
          setComicTitle('Comic');
        }

        if (pagesData.length > 0) {
          setCurrentPage(1);
        }

      } catch (err) {
        console.error('Error loading episode data:', err);
        setError('Failed to load episode data');
      } finally {
        setIsLoading(false);
      }
    };

    loadEpisodeData();
  }, [episodeId]);

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
    toast({
      title: "Download Feature",
      description: "Download functionality will be available soon!",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: episodeTitle,
        text: `Check out this episode: ${episodeTitle}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Episode link copied to clipboard!",
      });
    }
  };

  const handleBookmark = () => {
    toast({
      title: "Bookmark Feature",
      description: "Bookmark functionality will be available soon!",
    });
  };

  const getBackPath = () => {
    return '/comics'; // Go back to comics page
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading episode...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">📖</div>
          <h1 className="text-white text-2xl font-bold mb-4">Episode Not Found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button
            onClick={() => navigate(getBackPath())}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  const currentPageData = pages.find(p => p.page_number === currentPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate(getBackPath())}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-white text-lg font-semibold">{comicTitle}</h1>
                <p className="text-gray-400 text-sm">{episodeTitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
               {/* View Mode Toggle */}
               <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
                 <button
                   onClick={() => setViewMode('pdf')}
                   className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                     viewMode === 'pdf'
                       ? 'bg-red-600 text-white'
                       : 'text-gray-400 hover:text-white'
                   }`}
                 >
                   PDF
                 </button>
                 <button
                   onClick={() => setViewMode('page')}
                   className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                     viewMode === 'page'
                       ? 'bg-red-600 text-white'
                       : 'text-gray-400 hover:text-white'
                   }`}
                 >
                   Page
                 </button>
               </div>
              
              <Button
                onClick={handleBookmark}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleShare}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleDownload}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reader Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-white text-sm">
                  Page {currentPage} of {pages.length}
                </span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pages.length}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleZoomOut}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-white text-sm">{zoomLevel}%</span>
                <Button
                  onClick={handleZoomIn}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
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
                   key={index}
                   className={`cursor-pointer border-2 rounded ${
                     currentPage === index + 1 
                       ? 'border-red-500' 
                       : 'border-gray-600 hover:border-gray-500'
                   }`}
                   onClick={() => setCurrentPage(index + 1)}
                 >
                   <img
                     src={page.image_url}
                     alt={`Page ${index + 1}`}
                     className="w-full h-20 object-cover rounded"
                   />
                   <p className="text-xs text-center py-1 text-white">Page {index + 1}</p>
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
                 src={currentPageData?.image_url}
                 alt={`${comicTitle} - Page ${currentPage}`}
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
               src={currentPageData?.image_url}
               alt={`${comicTitle} - Page ${currentPage}`}
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
         
         <span className="text-sm text-white">{currentPage} / {pages.length}</span>
         
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
}