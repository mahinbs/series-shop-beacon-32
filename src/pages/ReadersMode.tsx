import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, Download, Share2, Bookmark, Book, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const ReadersMode = () => {
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
            onClick={() => navigate('/our-series')}
            className="text-white hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="font-semibold">{series.title}</h1>
            <p className="text-sm text-gray-400">
              Page {currentPage} of {series.totalPages}
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
              {series.pages.map((page, index) => (
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
                    src={page}
                    alt={`Page ${index + 1}`}
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
                src={series.pages[currentPage - 1]}
                alt={`${series.title} - Page ${currentPage}`}
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
              src={series.pages[currentPage - 1]}
              alt={`${series.title} - Page ${currentPage}`}
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
        
        <span className="text-sm">{currentPage} / {series.totalPages}</span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, series.totalPages))}
          disabled={currentPage === series.totalPages}
          className="text-white hover:bg-gray-800 disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ReadersMode;