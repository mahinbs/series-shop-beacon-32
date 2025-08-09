import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, Maximize, Heart, Share2, Download, ChevronLeft, ChevronRight, Coins, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { ScreenshotProtection } from '@/components/ScreenshotProtection';
import { useToast } from '@/hooks/use-toast';

export function EpisodeReader() {
  const { episodeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [showSettings, setShowSettings] = useState(false);
  const [userCoins, setUserCoins] = useState(150);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const readerRef = useRef<HTMLDivElement>(null);

  // Mock episode data
  const episode = {
    id: episodeId || '1',
    title: 'Episode 1: The Beginning',
    comicTitle: 'Mystic Adventures',
    totalPages: 25,
    pages: Array.from({ length: 25 }, (_, i) => `/lovable-uploads/${
      ['464d8ea7-d84c-4d59-a0dc-01715d6ce881.png', 
       '907e2c66-ea0e-425d-8b48-a80ffcbd2267.png',
       '781ea40e-866e-4ee8-9bf7-862a42bb8716.png'][i % 3]
    }`),
    nextEpisode: { id: '2', title: 'Episode 2: The Journey Continues', locked: true, price: 10 }
  };

  // Auto-hide controls after inactivity
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  // Mouse/touch activity detection
  useEffect(() => {
    const handleActivity = () => resetControlsTimeout();
    
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('touchstart', handleActivity);
    document.addEventListener('click', handleActivity);
    
    resetControlsTimeout();
    
    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('touchstart', handleActivity);
      document.removeEventListener('click', handleActivity);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [resetControlsTimeout]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      resetControlsTimeout();
    }
  };

  const handleNextPage = () => {
    if (currentPage < episode.totalPages) {
      setCurrentPage(currentPage + 1);
      resetControlsTimeout();
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 25, 200));
    resetControlsTimeout();
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 25, 50));
    resetControlsTimeout();
  };

  const resetZoom = () => {
    setZoomLevel(100);
    resetControlsTimeout();
  };

  const handleExitReader = () => {
    navigate(-1);
  };

  const handleUnlockNext = () => {
    if (userCoins >= episode.nextEpisode.price) {
      setUserCoins(userCoins - episode.nextEpisode.price);
      toast({
        title: "Episode Unlocked!",
        description: `${episode.nextEpisode.title} is now available to read.`,
      });
      navigate(`/episode/${episode.nextEpisode.id}/read`);
    } else {
      navigate('/buy-coins');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          handlePreviousPage();
          break;
        case 'ArrowRight':
          handleNextPage();
          break;
        case 'Escape':
          handleExitReader();
          break;
        case ' ':
          e.preventDefault();
          resetControlsTimeout();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, episode.totalPages, handlePreviousPage, handleNextPage, handleExitReader, resetControlsTimeout]);

  // Update reading progress
  useEffect(() => {
    const progress = (currentPage / episode.totalPages) * 100;
    setReadingProgress(progress);
  }, [currentPage, episode.totalPages]);

  return (
    <ScreenshotProtection isProtected={true}>
      <div 
        ref={readerRef}
        className="fixed inset-0 z-50 bg-black overflow-hidden"
        style={{ filter: `brightness(${brightness}%)` }}
      >
        {/* Top Control Bar */}
        <div className={`absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/90 to-transparent transition-all duration-500 ${
          showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExitReader}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-lg font-semibold text-white">{episode.comicTitle}</h2>
                <p className="text-sm text-gray-300">{episode.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <Coins className="h-4 w-4" />
                <span className="text-sm font-medium">{userCoins}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:bg-white/20"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute top-16 right-4 z-20 bg-black/90 border border-gray-600 rounded-lg p-4 min-w-64">
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm mb-2 block">Brightness</label>
                <Slider
                  value={[brightness]}
                  onValueChange={(value) => setBrightness(value[0])}
                  max={150}
                  min={50}
                  step={10}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Zoom</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomOut}
                    className="text-white hover:bg-white/20"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-white text-sm min-w-[3rem] text-center">{zoomLevel}%</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomIn}
                    className="text-white hover:bg-white/20"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetZoom}
                    className="text-white hover:bg-white/20 text-xs"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Reading Area */}
        <div className="flex-1 flex items-center justify-center overflow-auto">
          <div className="relative w-full max-w-4xl">
            <img
              src={episode.pages[currentPage - 1]}
              alt={`Page ${currentPage}`}
              className="w-full h-auto object-contain select-none"
              style={{ 
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'center top'
              }}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>

        {/* Side Progress Indicator */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
          <div className="h-32 w-1 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="w-full bg-white transition-all duration-300"
              style={{ height: `${readingProgress}%` }}
            />
          </div>
        </div>

        {/* Navigation Areas */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1/3 z-5 cursor-pointer"
          onClick={handlePreviousPage}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/3 z-5 cursor-pointer"
          onClick={handleNextPage}
        />

        {/* Bottom Control Bar */}
        <div className={`absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 to-transparent transition-all duration-500 ${
          showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="text-white hover:bg-white/20 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </Button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white">{currentPage} / {episode.totalPages}</span>
              <Progress value={readingProgress} className="w-32" />
            </div>
            <Button
              variant="ghost"
              onClick={handleNextPage}
              disabled={currentPage === episode.totalPages}
              className="text-white hover:bg-white/20 disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          </div>
        </div>

        {/* Next Episode Prompt */}
        {currentPage === episode.totalPages && (
          <div className="absolute inset-0 z-30 bg-black/80 flex items-center justify-center">
            <Card className="p-6 max-w-md mx-4 bg-gray-900 border-gray-700">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold text-white">Episode Complete!</h3>
                <p className="text-gray-300">Continue with the next episode?</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <span>{episode.nextEpisode.title}</span>
                    {episode.nextEpisode.locked && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Coins className="h-3 w-3" />
                        {episode.nextEpisode.price}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleExitReader}
                      className="flex-1"
                    >
                      Back to List
                    </Button>
                    <Button 
                      onClick={handleUnlockNext}
                      className="flex-1"
                    >
                      {episode.nextEpisode.locked ? 'Unlock & Read' : 'Continue Reading'}
                    </Button>
                  </div>
                  {episode.nextEpisode.locked && userCoins < episode.nextEpisode.price && (
                    <p className="text-xs text-red-400">
                      Insufficient coins. You need {episode.nextEpisode.price - userCoins} more coins.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ScreenshotProtection>
  );
}