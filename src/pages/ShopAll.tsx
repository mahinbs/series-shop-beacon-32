
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import ShopGrid from '@/components/ShopGrid';
import ShopFilters from '@/components/ShopFilters';
import FeaturedSeriesSlideshow from '@/components/FeaturedSeriesSlideshow';
import SeriesGrid from '@/components/SeriesGrid';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useState } from 'react';
import shopHeroBg from '@/assets/shop-hero-bg.jpg';

const ShopAll = () => {
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation(0.1);
  const { elementRef: statsRef, isVisible: statsVisible } = useScrollAnimation(0.2);
  const { elementRef: filtersRef, isVisible: filtersVisible } = useScrollAnimation(0.2);
  const { elementRef: gridRef, isVisible: gridVisible } = useScrollAnimation(0.2);
  
  const [viewMode, setViewMode] = useState<'series' | 'volume'>('series');
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState('Newest First');

  const handleFiltersApply = (filters: string[]) => {
    setAppliedFilters(filters);
    console.log('Applied filters:', filters);
    // Here you would typically filter your data based on the applied filters
  };

  const handleSortChange = (sortOption: string) => {
    setSelectedSort(sortOption);
    console.log('Selected sort:', sortOption);
    // Here you would typically sort your data based on the selected sort option
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section 
        ref={heroRef as any}
        className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black py-16 overflow-hidden"
      >
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img 
            src={shopHeroBg}
            alt="Explore Series Background"
            className="w-full h-full object-cover opacity-80"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between min-h-[400px]">
            <div className="text-left lg:w-1/2">
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 transition-all duration-1000 transform ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                Explore Series
              </h1>
              <p className={`text-lg md:text-xl text-gray-300 max-w-lg mb-8 leading-relaxed transition-all duration-1000 delay-300 transform ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                Discover new series through manga and anime stories. Read stories, discover new characters, and learn lore through the life cycle.
              </p>
              
              <div className={`flex flex-wrap gap-4 transition-all duration-1000 delay-500 transform ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2">
                  <span>Popular Series</span>
                </button>
                <button className="bg-transparent border border-white/30 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2">
                  <span>Browse All</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <ShopFilters 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        onFiltersApply={handleFiltersApply}
        onSortChange={handleSortChange}
      />

      {/* Featured Series Slideshow */}
      <FeaturedSeriesSlideshow />

      {/* Content Grid - Show SeriesGrid or ShopGrid based on view mode */}
      <div 
        ref={gridRef as any}
        className={`transition-all duration-1000 transform ${
          gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {viewMode === 'series' ? <SeriesGrid /> : <ShopGrid />}
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default ShopAll;
