
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import ShopGrid from '@/components/ShopGrid';
import ShopFilters from '@/components/ShopFilters';
// import FeaturedSeriesSlideshow from '@/components/FeaturedSeriesSlideshow';
import SeriesGrid from '@/components/SeriesGrid';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useState, useEffect } from 'react';
import shopHeroBg from '@/assets/shop-hero-bg.jpg';
import { ShopAllService, type ShopAllHero } from '@/services/shopAllService';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const ShopAll = () => {
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation(0.1);
  const { elementRef: statsRef, isVisible: statsVisible } = useScrollAnimation(0.2);
  const { elementRef: filtersRef, isVisible: filtersVisible } = useScrollAnimation(0.2);
  const { elementRef: gridRef, isVisible: gridVisible } = useScrollAnimation(0.2);
  
  const [viewMode, setViewMode] = useState<'series' | 'volume'>('series');
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState('Newest First');
  const [searchTerm, setSearchTerm] = useState('');
  const [heroSections, setHeroSections] = useState<ShopAllHero[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleFiltersApply = (filters: string[]) => {
    setAppliedFilters(filters);
    console.log('🎯 Applied filters:', filters);
  };

  const handleSortChange = (sortOption: string) => {
    setSelectedSort(sortOption);
    console.log('🔄 Selected sort:', sortOption);
  };

  const handleSearchChange = (searchValue: string) => {
    setSearchTerm(searchValue);
    console.log('🔍 Search term:', searchValue);
  };

  useEffect(() => {
    loadHeroSections();
  }, []);

  const loadHeroSections = async () => {
    try {
      setIsLoading(true);
      console.log('🎯 Loading Shop All hero sections...');
      console.log('🌐 ShopAll page: Starting to load hero sections...');
      
      const heroData = await ShopAllService.getHeroSections();
      setHeroSections(heroData);
      console.log('✅ Loaded hero sections:', heroData);
      console.log('🌐 ShopAll page: Hero sections loaded successfully:', heroData.length, 'sections');
    } catch (error) {
      console.error('❌ Error loading hero sections:', error);
      console.error('🌐 ShopAll page: Error loading hero sections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the first active hero section for display
  const activeHero = heroSections.find(hero => hero.is_active) || heroSections[0];

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      {isLoading ? (
        <section className="relative min-h-[70vh] flex items-center justify-center bg-gray-800">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-white">Loading hero section...</p>
          </div>
        </section>
      ) : activeHero ? (
        <section 
          ref={heroRef as any}
          className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black py-16 overflow-hidden"
        >
          {/* Hero Background Image */}
          <div className="absolute inset-0">
            <img 
              src={activeHero.background_image_url || shopHeroBg}
              alt={activeHero.title || "Explore Series Background"}
              className="w-full h-full object-cover opacity-80"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between min-h-[400px]">
              <div className="text-left lg:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white transition-all duration-1000 transform ${
                    heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    {activeHero.title}
                  </h1>
                  <Button
                    onClick={loadHeroSections}
                    variant="outline"
                    size="sm"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
                <p className={`text-lg md:text-xl text-gray-300 max-w-lg mb-8 leading-relaxed transition-all duration-1000 delay-300 transform ${
                  heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  {activeHero.description}
                </p>
                
                <div className={`flex flex-wrap gap-4 transition-all duration-1000 delay-500 transform ${
                  heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  {activeHero.primary_button_text && (
                    <a 
                      href={activeHero.primary_button_link || '#'}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                    >
                      <span>{activeHero.primary_button_text}</span>
                    </a>
                  )}
                  {activeHero.secondary_button_text && (
                    <a 
                      href={activeHero.secondary_button_link || '#'}
                      className="bg-transparent border border-white/30 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                    >
                      <span>{activeHero.secondary_button_text}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative min-h-[70vh] flex items-center justify-center bg-gray-800">
          <div className="text-center">
            <p className="text-white">No hero section configured</p>
          </div>
        </section>
      )}

      {/* Filters Section */}
      <ShopFilters 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        onFiltersApply={handleFiltersApply}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
      />

      {/* Featured Series Slideshow - Removed to allow proper filtering */}
      {/* <FeaturedSeriesSlideshow /> */}

      {/* Content Grid - Show SeriesGrid or ShopGrid based on view mode */}
      <div 
        ref={gridRef as any}
        className={`transition-all duration-1000 transform ${
          gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {viewMode === 'series' ? (
          <SeriesGrid 
            appliedFilters={appliedFilters}
            searchTerm={searchTerm}
            sortBy={selectedSort}
          />
        ) : (
          <ShopGrid 
            appliedFilters={appliedFilters}
            searchTerm={searchTerm}
            sortBy={selectedSort}
          />
        )}
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default ShopAll;
