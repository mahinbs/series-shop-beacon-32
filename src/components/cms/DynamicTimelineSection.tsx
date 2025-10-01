import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { ourJourneyService, type OurJourneyTimelineItem, type OurJourneySection } from '@/services/ourJourneyService';

interface DynamicTimelineSectionProps {
  pageName: string;
  sectionName: string;
}

export const DynamicTimelineSection = ({ pageName, sectionName }: DynamicTimelineSectionProps) => {
  const { elementRef, isVisible } = useScrollAnimation(0.2);
  const [section, setSection] = useState<OurJourneySection | null>(null);
  const [timeline, setTimeline] = useState<OurJourneyTimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from database
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load section settings
      const sectionData = await ourJourneyService.getSection();
      if (sectionData) {
        setSection(sectionData);
      }
      
      // Load timeline items
      const timelineData = await ourJourneyService.getTimelineItems();
      setTimeline(timelineData);
      
    } catch (error) {
      console.error('Error loading Our Journey data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Refresh data when window gains focus (user might have updated in admin panel)
  useEffect(() => {
    const handleFocus = () => {
      loadData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const timelineData = timeline || [];
  const [selectedYear, setSelectedYear] = useState(timelineData[0]?.year || 2020);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update selected year when timeline data changes
  useEffect(() => {
    if (timelineData.length > 0) {
      // If current selected year doesn't exist in new data, reset to first item
      const yearExists = timelineData.find(item => item.year === selectedYear);
      if (!yearExists) {
        setSelectedYear(timelineData[0].year);
        setCurrentIndex(0);
      } else {
        // Update current index to match the selected year
        const newIndex = timelineData.findIndex(item => item.year === selectedYear);
        if (newIndex !== -1) {
          setCurrentIndex(newIndex);
        }
      }
    }
  }, [timelineData, selectedYear]);

  useEffect(() => {
    if (timelineData.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % timelineData.length;
        setSelectedYear(timelineData[nextIndex].year);
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [timelineData]);

  const goToPrevious = () => {
    if (timelineData.length === 0) return;
    const newIndex = currentIndex > 0 ? currentIndex - 1 : timelineData.length - 1;
    setCurrentIndex(newIndex);
    setSelectedYear(timelineData[newIndex].year);
  };

  const goToNext = () => {
    if (timelineData.length === 0) return;
    const newIndex = (currentIndex + 1) % timelineData.length;
    setCurrentIndex(newIndex);
    setSelectedYear(timelineData[newIndex].year);
  };

  const goToSlide = (index: number) => {
    if (timelineData.length === 0 || index < 0 || index >= timelineData.length) return;
    setCurrentIndex(index);
    setSelectedYear(timelineData[index].year);
  };

  const selectedData = timelineData.find(item => item.year === selectedYear) || timelineData[0] || null;

  // Show loading state
  if (isLoading) {
    return (
      <section 
        ref={elementRef}
        className="py-20 bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading Our Journey...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no data
  if (!selectedData || timelineData.length === 0) {
    return (
      <section 
        ref={elementRef}
        className="py-20 bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Our Journey</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Follow our evolution through the years as we've grown from a small startup to a global publishing house.
            </p>
            <p className="text-gray-400 mt-8">No timeline data available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={elementRef}
      className={`py-20 bg-gray-900 transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-4xl font-bold text-white">{section?.title || 'Our Journey'}</h2>
            <button
              onClick={loadData}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {section?.subtitle || 'Follow our evolution through the years as we\'ve grown from a small startup to a global publishing house.'}
          </p>
        </div>

        {/* Year Selection */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-4">
            {timelineData.map((item, index) => (
              <button
                key={item.year}
                onClick={() => goToSlide(index)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedYear === item.year
                    ? 'bg-red-600 text-white shadow-lg scale-105'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {item.year}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Content */}
        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="order-2 md:order-1">
              <img 
                src={selectedData?.left_image_url || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96'} 
                alt="Timeline left"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
            
            <div className="order-1 md:order-2 text-center">
              <h3 className="text-3xl font-bold text-white mb-4">
                {selectedData?.header || 'Timeline Item'}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {selectedData?.description || 'Description not available'}
              </p>
            </div>
            
            <div className="order-3">
              <img 
                src={selectedData?.right_image_url || 'https://images.unsplash.com/photo-1553729459-efe14ef6055d'} 
                alt="Timeline right"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full transition-all duration-300 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full transition-all duration-300 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {timelineData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-red-500 scale-125'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};