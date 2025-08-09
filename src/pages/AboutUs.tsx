
import Header from '@/components/Header';
import AboutHero from '@/components/AboutHero';
import AboutTabs from '@/components/AboutTabs';

import { DynamicHeroSection } from '@/components/cms/DynamicHeroSection';
import { DynamicTimelineSection } from '@/components/cms/DynamicTimelineSection';
import CreativeCorner from '@/components/CreativeCorner';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Simple gradient background without parallax */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black opacity-50 pointer-events-none" />
      
      <div className="relative z-10">
        <Header />
        
        <section id="hero">
          <DynamicHeroSection 
            pageName="about_us" 
            sectionName="hero"
            defaultContent={{
              title: "About Crossed Hearts",
              subtitle: "A global publishing house specialising in the English localization of Japanese manga and Korean webtoon comics, bringing incredible stories to readers worldwide."
            }}
          />
        </section>
        
        <section id="tabs" className="px-4 sm:px-0">
          <AboutTabs />
        </section>
        
        <section id="timeline">
          <DynamicTimelineSection pageName="about_us" sectionName="yearly_timeline" />
        </section>
        
        <section id="creative-corner">
          <CreativeCorner />
        </section>
        
        <section id="newsletter">
          <Newsletter />
        </section>
        
        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;
