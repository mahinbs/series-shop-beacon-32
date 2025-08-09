
import Header from '@/components/Header';
import SeriesHero from '@/components/SeriesHero';
import SeriesFilters from '@/components/SeriesFilters';
import FeaturedSeries from '@/components/FeaturedSeries';
import AllSeries from '@/components/AllSeries';
import SeriesActivity from '@/components/SeriesActivity';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const OurSeries = () => {
  const { elementRef: filtersRef, isVisible: filtersVisible } = useScrollAnimation(0.2);
  const { elementRef: featuredRef, isVisible: featuredVisible } = useScrollAnimation(0.2);
  const { elementRef: allSeriesRef, isVisible: allSeriesVisible } = useScrollAnimation(0.2);
  const { elementRef: activityRef, isVisible: activityVisible } = useScrollAnimation(0.2);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <SeriesHero />
      
      <div 
        ref={filtersRef as any}
        className={`px-4 sm:px-0 transition-all duration-1000 transform ${
          filtersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <SeriesFilters />
      </div>
      
      <div 
        ref={featuredRef as any}
        className={`px-4 sm:px-0 transition-all duration-1000 transform ${
          featuredVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <FeaturedSeries />
      </div>
      
      <div 
        ref={allSeriesRef as any}
        className={`px-4 sm:px-0 transition-all duration-1000 transform ${
          allSeriesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <AllSeries />
      </div>
      
      <div 
        ref={activityRef as any}
        className={`px-4 sm:px-0 transition-all duration-1000 transform ${
          activityVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <SeriesActivity />
      </div>
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default OurSeries;
