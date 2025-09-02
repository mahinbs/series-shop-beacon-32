import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, Download, Share2, Bookmark, Book, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const DigitalReader = () => {
  const { seriesTitle } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState<'pdf' | 'page'>('pdf');

  // Mock series data with pages
  const seriesData = {
    "demon-slayer": {
      title: "Demon Slayer",
      totalPages: 24,
      pages: Array.from({ length: 24 }, (_, i) => `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`)
    },
    "jujutsu-kaisen": {
      title: "Jujutsu Kaisen", 
      totalPages: 20,
      pages: Array.from({ length: 20 }, (_, i) => `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`)
    },
    "one-piece": {
      title: "One Piece",
      totalPages: 30,
      pages: Array.from({ length: 30 }, (_, i) => `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`)
    },
    "chainsaw-man": {
      title: "Chainsaw Man",
      totalPages: 22,
      pages: Array.from({ length: 22 }, (_, i) => `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`)
    },
    "my-hero-academia": {
      title: "My Hero Academia",
      totalPages: 20,
      pages: Array.from({ length: 20 }, (_, i) => `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`)
    },
    "attack-on-titan": {
      title: "Attack on Titan",
      totalPages: 26,
      pages: Array.from({ length: 26 }, (_, i) => `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`)
    },
    "spy-x-family": {
      title: "Spy x Family",
      totalPages: 18,
      pages: Array.from({ length: 18 }, (_, i) => `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`)
    },
    "tokyo-revengers": {
      title: "Tokyo Revengers",
      totalPages: 21,
      pages: Array.from({ length: 21 }, (_, i) => `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`)
    },
    "black-clover": {
      title: "Black Clover",
      totalPages: 19,
      pages: Array.from({ length: 19 }, (_, i) => `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`)
    },
    "bleach": {
      title: "Bleach",
      totalPages: 25,
      pages: Array.from({ length: 25 }, (_, i) => `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`)
    },
    "naruto": {
      title: "Naruto",
      totalPages: 28,
      pages: Array.from({ length: 28 }, (_, i) => `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`)
    },
    "dragon-ball-super": {
      title: "Dragon Ball Super",
      totalPages: 23,
      pages: Array.from({ length: 23 }, (_, i) => `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`)
    },
    "one-punch-man": {
      title: "One Punch Man",
      totalPages: 17,
      pages: Array.from({ length: 17 }, (_, i) => `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`)
    },
    "haikyuu!": {
      title: "Haikyuu!",
      totalPages: 20,
      pages: Array.from({ length: 20 }, (_, i) => `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`)
    }
  };

  const series = seriesData[seriesTitle as keyof typeof seriesData];

  if (!series) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Series not found</h1>
          <Button onClick={() => navigate('/our-series')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Series
          </Button>
        </div>
      </div>
    );
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= series.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDownload = () => {
    // Mock download functionality
    console.log('Downloading page', currentPage);
  };

  const handleShare = () => {
    // Mock share functionality
    if (navigator.share) {
      navigator.share({
        title: `${series.title} - Page ${currentPage}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleBookmark = () => {
    // Mock bookmark functionality
    console.log('Bookmarking page', currentPage);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button and Title */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/our-series')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">{series.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {series.totalPages}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-muted rounded-md p-1">
                <Button
                  variant={viewMode === 'pdf' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('pdf')}
                  className="h-8 px-3"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button
                  variant={viewMode === 'page' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('page')}
                  className="h-8 px-3"
                >
                  <Book className="w-4 h-4 mr-2" />
                  Page
                </Button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 50}
                  className="h-8 w-8"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium min-w-[3rem] text-center">
                  {zoomLevel}%
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 200}
                  className="h-8 w-8"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              {/* Action Buttons */}
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
                  max={series.totalPages}
                  value={currentPage}
                  onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
                  className="w-16 h-8 px-2 text-center border rounded-md bg-background"
                />
                <span className="text-sm text-muted-foreground">of {series.totalPages}</span>
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= series.totalPages}
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
                <img
                  src={series.pages[currentPage - 1]}
                  alt={`${series.title} - Page ${currentPage}`}
                  className="max-w-full h-auto"
                  style={{ maxHeight: '80vh' }}
                />
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
                disabled={currentPage >= series.totalPages}
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
