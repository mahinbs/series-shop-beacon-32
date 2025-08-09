import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useHeroBanners } from '@/hooks/useHeroBanners';

interface BannerItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  overlayText?: string;
}

interface BannerCarouselProps {
  banners?: BannerItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const BannerCarousel = ({ 
  banners = [], 
  autoPlay = true, 
  autoPlayInterval = 5000 
}: BannerCarouselProps) => {
  const { elementRef, isVisible } = useScrollAnimation(0.2);
  const { banners: heroBanners, isLoading } = useHeroBanners();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState<{ [key: string]: boolean }>({});

  // Transform hero banners to banner items format
  const transformedBanners: BannerItem[] = heroBanners.map((banner) => ({
    id: banner.id,
    type: 'image' as const,
    url: banner.image_url,
    title: banner.title,
    subtitle: banner.subtitle,
    buttonText: 'Shop Now',
    buttonLink: '/shop-all',
    overlayText: undefined
  }));

  // Use CMS banners if available, otherwise use custom banners
  const activeBanners = transformedBanners.length > 0 ? transformedBanners : banners;
  
  console.log('Current banner data for display:', activeBanners[currentIndex]);


  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || activeBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeBanners.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, activeBanners.length, currentIndex]);

  // Update currentIndex bounds when activeBanners changes
  useEffect(() => {
    if (activeBanners.length > 0 && currentIndex >= activeBanners.length) {
      setCurrentIndex(0);
    }
  }, [activeBanners.length, currentIndex]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => 
      prev === 0 ? activeBanners.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeBanners.length);
  };

  const toggleVideoPlay = (bannerId: string) => {
    setVideoPlaying(prev => ({
      ...prev,
      [bannerId]: !prev[bannerId]
    }));
  };

  // Show loading state
  if (isLoading && transformedBanners.length === 0) {
    return (
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-white text-lg">Loading...</div>
      </section>
    );
  }

  // Show no banners state
  if (activeBanners.length === 0) {
    return (
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-white text-lg">No banners available</div>
      </section>
    );
  }

  // Ensure currentIndex is within bounds
  const safeCurrentIndex = Math.min(currentIndex, activeBanners.length - 1);
  const currentBanner = activeBanners[safeCurrentIndex];


  // Don't render if no current banner
  if (!currentBanner) {
    return null;
  }

  return (
    <section 
      ref={elementRef}
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    >
      {/* Background Carousel */}
      <div className="absolute inset-0">
        {activeBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            {banner.type === 'image' ? (
              <img
                src={banner.url}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  src={banner.url}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay={videoPlaying[banner.id]}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => toggleVideoPlay(banner.id)}
                >
                  {videoPlaying[banner.id] ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <div
            className={`transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            >
            {currentBanner.overlayText && typeof currentBanner.overlayText === 'string' && (
              <div
                className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold px-4 py-2 rounded-full mb-6 animate-pulse shadow-lg"
                style={{ transitionDelay: '200ms' }}
              >
                {currentBanner.overlayText}
              </div>
            )}
            
            <h1
              className="text-6xl md:text-8xl font-black mb-6 leading-tight relative z-50"
              style={{ 
                transitionDelay: '400ms',
                color: '#FFFFFF',
                textShadow: '4px 4px 8px rgba(0,0,0,1), 2px 2px 4px rgba(0,0,0,0.8)',
                fontWeight: '900'
              }}
            >
              {currentBanner?.title || 'No Title Available'}
            </h1>
            
            <p
              className="text-2xl md:text-3xl mb-8 max-w-2xl leading-relaxed relative z-50"
              style={{ 
                transitionDelay: '600ms',
                color: '#FFFFFF',
                textShadow: '3px 3px 6px rgba(0,0,0,1), 1px 1px 2px rgba(0,0,0,0.8)',
                fontWeight: '600'
              }}
            >
              {currentBanner?.subtitle || 'No Subtitle Available'}
            </p>
            
            <div
              className="flex flex-col sm:flex-row gap-4"
              style={{ transitionDelay: '800ms' }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                onClick={() => window.location.href = currentBanner.buttonLink}
              >
                {currentBanner.buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 transition-all duration-300"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 transition-all duration-300"
            onClick={goToNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Pagination Dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-red-500 scale-125 shadow-lg shadow-red-500/50'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 right-10 w-20 h-20 border border-red-500/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-16 h-16 border border-red-500/20 rounded-full animate-pulse delay-1000"></div>
      </div>
    </section>
  );
};

export default BannerCarousel;