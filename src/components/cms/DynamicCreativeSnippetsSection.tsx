import React, { useState, useEffect } from 'react';
import { Play, RefreshCw } from 'lucide-react';
import { creativeSnippetsService, CreativeSnippetItem, CreativeSnippetsSection } from '@/services/creativeSnippetsService';

const DynamicCreativeSnippetsSection: React.FC = () => {
  const [section, setSection] = useState<CreativeSnippetsSection | null>(null);
  const [items, setItems] = useState<CreativeSnippetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const sectionData = await creativeSnippetsService.getSection();
      if (sectionData) {
        setSection(sectionData);
      }
      
      const itemsData = await creativeSnippetsService.getItems();
      setItems(itemsData);
      
      // Reset currentIndex if it's out of bounds
      if (currentIndex >= itemsData.length && itemsData.length > 0) {
        setCurrentIndex(0);
      } else if (itemsData.length === 0) {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Error loading Creative Snippets data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      loadData();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Listen for storage events (when admin panel makes changes)
  useEffect(() => {
    const handleStorageChange = () => {
      loadData();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for custom events from admin panel
  useEffect(() => {
    const handleCreativeSnippetsUpdate = () => {
      loadData();
    };
    window.addEventListener('creativeSnippetsUpdated', handleCreativeSnippetsUpdate);
    return () => window.removeEventListener('creativeSnippetsUpdated', handleCreativeSnippetsUpdate);
  }, []);

  // Poll for changes every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && items.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, 5000); // Change every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, items.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-300 rounded mb-4 mx-auto w-96"></div>
              <div className="h-6 bg-gray-300 rounded mb-8 mx-auto w-64"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              {section?.title || 'Creative Snippets'}
            </h2>
            <p className="text-gray-300 text-lg mb-4">
              {section?.subtitle || 'No creative snippets available yet.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-4xl font-bold text-white">
              {section?.title || 'Creative Snippets'}
            </h2>
            <button
              onClick={loadData}
              className="p-2 text-gray-400 hover:text-white transition-colors bg-white bg-opacity-10 rounded-full hover:bg-opacity-20"
              title="Refresh data"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {section?.subtitle || 'Discover the stories behind your favorite series'}
          </p>
          {items.length > 0 && (
            <p className="text-sm text-gray-400 mt-2">
              {items.length} snippet{items.length !== 1 ? 's' : ''} available
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Background Image/Video */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                {currentItem.background_image_url ? (
                  <img
                    src={currentItem.background_image_url}
                    alt={currentItem.title}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-gray-400 text-lg">No background image</span>
                  </div>
                )}
                
                {/* Play Button Overlay */}
                {currentItem.video_url && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => {
                        // Create modal for video playback
                        const modal = document.createElement('div');
                        modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
                        modal.innerHTML = `
                          <div class="relative w-full max-w-4xl mx-4">
                            <button onclick="this.parentElement.parentElement.remove()" class="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300">×</button>
                            <video controls autoplay class="w-full h-auto rounded-lg">
                              <source src="${currentItem.video_url}" type="video/mp4">
                              <source src="${currentItem.video_url}" type="video/webm">
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        `;
                        document.body.appendChild(modal);
                        // Close modal when clicking outside
                        modal.addEventListener('click', (e) => {
                          if (e.target === modal) modal.remove();
                        });
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-colors duration-200"
                    >
                      <Play className="h-8 w-8" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-3xl font-bold text-white">
                    {currentItem.title}
                  </h3>
                  {currentItem.volume_chapter && (
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {currentItem.volume_chapter}
                    </span>
                  )}
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {currentItem.description}
                </p>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={goToPrevious}
                  className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white p-3 rounded-full transition-all duration-200"
                  disabled={items.length <= 1}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex items-center gap-4">
                  <div className="flex space-x-2">
                    {items.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === currentIndex
                            ? 'bg-red-500 scale-125'
                            : 'bg-white bg-opacity-30 hover:bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Auto-play toggle */}
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                      isAutoPlaying 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                    }`}
                  >
                    {isAutoPlaying ? 'Pause' : 'Auto'}
                  </button>
                </div>

                <button
                  onClick={goToNext}
                  className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white p-3 rounded-full transition-all duration-200"
                  disabled={items.length <= 1}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DynamicCreativeSnippetsSection;
