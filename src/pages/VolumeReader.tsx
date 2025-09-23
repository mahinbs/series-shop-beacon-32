import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ZoomIn, ZoomOut, RotateCcw, BookOpen, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { booksService } from '@/services/database';

interface VolumePage {
  id: string;
  volume_id: string;
  page_number: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const VolumeReader = () => {
  const { volumeId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [volume, setVolume] = useState<any>(null);
  const [pages, setPages] = useState<VolumePage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [viewMode, setViewMode] = useState<'pdf' | 'page'>('pdf');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const initialPage = searchParams.get('page');
    if (initialPage) {
      setCurrentPage(parseInt(initialPage, 10));
    }
    loadVolumeData();
  }, [volumeId]);

  const loadVolumeData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load volume details
      const volumeDetails = await booksService.getById(volumeId!);
      if (!volumeDetails) {
        setError('Volume not found');
        return;
      }

      setVolume(volumeDetails);

      // Load volume pages
      const { data, error } = await supabase
        .from('volume_pages')
        .select('*')
        .eq('volume_id', volumeId)
        .eq('is_active', true)
        .order('page_number', { ascending: true });

      if (error) {
        console.error('Error loading volume pages:', error);
        setError('Failed to load volume pages');
        return;
      }

      setPages(data || []);
      
      if (data && data.length === 0) {
        setError('No pages available for this volume');
      }

    } catch (err) {
      console.error('Error loading volume data:', err);
      setError('Failed to load volume details');
    } finally {
      setIsLoading(false);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= pages.length) {
      setCurrentPage(pageNumber);
      // Update URL without page reload
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('page', pageNumber.toString());
      window.history.replaceState({}, '', newUrl.toString());
    }
  };

  const nextPage = () => {
    if (currentPage < pages.length) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const resetZoom = () => {
    setZoom(100);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        nextPage();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        prevPage();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'Escape':
        if (isFullscreen) {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, pages.length, isFullscreen]);

  const currentPageData = pages.find(page => page.page_number === currentPage);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading volume reader...</div>
      </div>
    );
  }

  if (error || !volume) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">{error || 'Volume not found'}</div>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">No pages available for this volume</div>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="flex h-screen">
        {/* Sidebar for PDF mode */}
        {viewMode === 'pdf' && showSidebar && (
          <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">{volume.title}</h3>
              <p className="text-gray-400 text-sm">Vol. {volume.volume_number}</p>
            </div>
            
            <div className="p-4 space-y-2">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    page.page_number === currentPage
                      ? 'border-red-500'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => goToPage(page.page_number)}
                >
                  <img
                    src={page.image_url}
                    alt={`Page ${page.page_number}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2">
                    <p className="text-white text-sm font-medium">
                      Page {page.page_number}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header Controls */}
          <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="text-gray-400 hover:text-white"
                >
                  <BookOpen className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    onClick={() => setViewMode('pdf')}
                    className={`text-sm ${viewMode === 'pdf' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    PDF
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setViewMode('page')}
                    className={`text-sm ${viewMode === 'page' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Page
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={handleZoomOut}
                className="text-gray-400 hover:text-white"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              
              <span className="text-white text-sm min-w-[60px] text-center">{zoom}%</span>
              
              <Button
                variant="ghost"
                onClick={handleZoomIn}
                className="text-gray-400 hover:text-white"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                onClick={resetZoom}
                className="text-gray-400 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                onClick={toggleFullscreen}
                className="text-gray-400 hover:text-white"
              >
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>
            </div>
          </div>

          {/* Page Content */}
          <div 
            ref={containerRef}
            className="flex-1 overflow-auto bg-gray-900 flex items-center justify-center p-4"
          >
            {currentPageData && (
              <div className="max-w-full max-h-full">
                <img
                  ref={imageRef}
                  src={currentPageData.image_url}
                  alt={`Page ${currentPageData.page_number}`}
                  className="max-w-full max-h-full object-contain"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'center',
                    transition: 'transform 0.2s ease-in-out'
                  }}
                />
              </div>
            )}
          </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevPage}
          disabled={currentPage === 1}
          className="text-white hover:bg-gray-800 disabled:opacity-50"
        >
          Previous
        </Button>
        
        <span className="text-sm">{currentPage} / {pages.length}</span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={nextPage}
          disabled={currentPage === pages.length}
          className="text-white hover:bg-gray-800 disabled:opacity-50"
        >
          Next
        </Button>
      </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VolumeReader;
