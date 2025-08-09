import { useCMS } from '@/hooks/useCMS';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DynamicTimelineSectionProps {
  pageName: string;
  sectionName: string;
}

export const DynamicTimelineSection = ({ pageName, sectionName }: DynamicTimelineSectionProps) => {
  const { getSectionContent } = useCMS();
  const { elementRef, isVisible } = useScrollAnimation(0.2);
  
  const content = getSectionContent(pageName, sectionName);
  const {
    title = 'Our Journey',
    timeline = []
  } = content;

  // Default timeline data if none provided
  const defaultTimeline = [
    {
      year: 2020,
      book: {
        title: 'Beginning of Hearts',
        description: 'Where our journey started with passion for manga and webtoons.',
        leftImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
        rightImage: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d'
      }
    },
    {
      year: 2021,
      book: {
        title: 'Growing Community',
        description: 'Building relationships with creators and readers worldwide.',
        leftImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43',
        rightImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794'
      }
    },
    {
      year: 2022,
      book: {
        title: 'Global Expansion',
        description: 'Reaching readers across continents with amazing stories.',
        leftImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570',
        rightImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
      }
    }
  ];

  const timelineData = timeline.length > 0 ? timeline : defaultTimeline;
  const [selectedYear, setSelectedYear] = useState(timelineData[0]?.year || 2020);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
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
    const newIndex = currentIndex > 0 ? currentIndex - 1 : timelineData.length - 1;
    setCurrentIndex(newIndex);
    setSelectedYear(timelineData[newIndex].year);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % timelineData.length;
    setCurrentIndex(newIndex);
    setSelectedYear(timelineData[newIndex].year);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setSelectedYear(timelineData[index].year);
  };

  const selectedData = timelineData.find(item => item.year === selectedYear) || timelineData[0];

  return (
    <section 
      ref={elementRef}
      className={`py-20 bg-gray-900 transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Follow our evolution through the years as we've grown from a small startup to a global publishing house.
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
                src={selectedData.book.leftImage} 
                alt="Timeline left"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
            
            <div className="order-1 md:order-2 text-center">
              <h3 className="text-3xl font-bold text-white mb-4">
                {selectedData.book.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {selectedData.book.description}
              </p>
            </div>
            
            <div className="order-3">
              <img 
                src={selectedData.book.rightImage} 
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