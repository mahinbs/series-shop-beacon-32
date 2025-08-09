
import { Button } from '@/components/ui/button';
import { Play, Eye } from 'lucide-react';

const SeriesHero = () => {
  const scrollToFeaturedSeries = () => {
    const element = document.getElementById('featured-series');
    if (element) {
      const headerHeight = 80; // Account for any fixed header
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToAllSeries = () => {
    // Add a small delay to ensure the page is fully loaded
    setTimeout(() => {
      const element = document.getElementById('all-series');
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };
  return (
    <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16 sm:py-20 lg:py-24 overflow-hidden min-h-[500px] sm:min-h-[600px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1920&h=800&fit=crop&crop=center"
          alt="Anime and Manga Series Collection"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-2xl text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">
            Explore Series
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 sm:mb-8 leading-relaxed drop-shadow-md px-4 sm:px-0">
            Discover your next favorite manga and anime series. From classic masterpieces to the latest hits, dive into worlds of endless imagination.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 sm:px-0">
            <Button 
              variant="outline" 
              className="bg-white border-2 border-white text-black hover:bg-gray-100 hover:text-gray-900 px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg backdrop-blur-sm transition-colors w-full sm:w-auto"
              onClick={scrollToAllSeries}
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Browse All
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeriesHero;
