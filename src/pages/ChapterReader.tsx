import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Maximize,
  Minimize,
  Menu,
  X,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { ChapterService, BookChapter, ChapterPage } from '@/services/chapterService';
import { booksService } from '@/services/database';

const ChapterReader = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [chapter, setChapter] = useState<BookChapter | null>(null);
  const [book, setBook] = useState<any>(null);
  const [pages, setPages] = useState<ChapterPage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [viewMode, setViewMode] = useState<'pdf' | 'page'>('page');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const initialPage = searchParams.get('page');
    if (initialPage) {
      setCurrentPage(parseInt(initialPage, 10));
    }
    loadChapterData();
  }, [chapterId]);

  const loadChapterData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load chapter details
      const chapterData = await ChapterService.getChapterById(chapterId!);
      if (!chapterData) {
        setError('Chapter not found');
        return;
      }

      setChapter(chapterData);

      // Load book details
      const bookData = await booksService.getById(chapterData.book_id);
      if (!bookData) {
        setError('Book not found');
        return;
      }

      setBook(bookData);

      // Load chapter pages
      const pagesData = await ChapterService.getChapterPages(chapterId!);
      setPages(pagesData);
      
      if (pagesData.length === 0) {
        setError('No pages available for this chapter');
      }

    } catch (err) {
      console.error('Error loading chapter data:', err);
      setError('Failed to load chapter details');
    } finally {
      setIsLoading(false);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= pages.length) {
      setCurrentPage(pageNumber);
      // Update URL without page reload
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('page', pageNumber.toString());
      navigate(`?${newSearchParams.toString()}`, { replace: true });
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
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        prevPage();
        break;
      case 'ArrowRight':
        nextPage();
        break;
      case 'Home':
        goToPage(1);
        break;
      case 'End':
        goToPage(pages.length);
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

  const currentPageData = pages[currentPage - 1];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">{chapter?.chapter_title}</h1>
              <p className="text-sm text-gray-400">
                {book?.title} • Chapter {chapter?.chapter_number}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-white hover:bg-gray-700"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-gray-700"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Chapter Pages</h3>
                <div className="space-y-2">
                  {pages.map((page, index) => (
                    <div
                      key={page.id}
                      className={`p-3 rounded cursor-pointer transition-colors ${
                        currentPage === index + 1
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => goToPage(index + 1)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Page {page.page_number}</span>
                        {page.page_title && (
                          <Badge variant="outline" className="text-xs">
                            {page.page_title}
                          </Badge>
                        )}
                      </div>
                      {page.page_description && (
                        <p className="text-sm text-gray-400 mt-1">
                          {page.page_description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-gray-800 border-b border-gray-700 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage <= 1}
                  className="text-white hover:bg-gray-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  {currentPage} of {pages.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage >= pages.length}
                  className="text-white hover:bg-gray-700"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  className="text-white hover:bg-gray-700"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm min-w-[60px] text-center">{zoom}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  className="text-white hover:bg-gray-700"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetZoom}
                  className="text-white hover:bg-gray-700"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div 
            ref={containerRef}
            className="flex-1 flex items-center justify-center p-4 overflow-auto"
          >
            {currentPageData ? (
              <div 
                className="max-w-full max-h-full"
                style={{ transform: `scale(${zoom / 100})` }}
              >
                {currentPageData.page_url ? (
                  <img
                    ref={imageRef}
                    src={currentPageData.page_url}
                    alt={`Page ${currentPageData.page_number}`}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      console.error('Error loading page image:', e);
                      setError('Failed to load page image');
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <BookOpen className="h-16 w-16 mx-auto mb-4" />
                    <p>No page content available</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <BookOpen className="h-16 w-16 mx-auto mb-4" />
                <p>No page data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterReader;
