import { useState, useEffect } from 'react';
import { useCMS } from '@/hooks/useCMS';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { AboutUsService, type AboutUsHero } from '@/services/aboutUsService';

interface DynamicHeroSectionProps {
  pageName: string;
  sectionName: string;
  defaultContent?: any;
}

export const DynamicHeroSection = ({ 
  pageName, 
  sectionName, 
  defaultContent = {} 
}: DynamicHeroSectionProps) => {
  const { getSectionContent } = useCMS();
  const { elementRef, isVisible } = useScrollAnimation(0.2);
  const [heroContent, setHeroContent] = useState(null);
  
  // Load hero content from Supabase if it's the about us page
  useEffect(() => {
    if (pageName === 'about_us' && sectionName === 'hero') {
      const loadHeroContent = async () => {
        try {
          const heroData = await AboutUsService.getHeroContent();
          if (heroData) {
            setHeroContent({
              title: heroData.title,
              subtitle: heroData.subtitle,
              backgroundImage: heroData.background_image_url
            });
            console.log('✅ Loaded About Us hero content from Supabase:', heroData);
          }
        } catch (error) {
          console.error('Error loading about us hero content:', error);
        }
      };
      
      loadHeroContent();
    }
  }, [pageName, sectionName]);
  
  const content = getSectionContent(pageName, sectionName);
  
  // Use admin-managed content if available, otherwise fall back to CMS or default
  const finalContent = heroContent || content;
  
  const {
    title = defaultContent.title || 'Welcome',
    subtitle = defaultContent.subtitle || 'Discover our amazing content',
    backgroundImage = defaultContent.backgroundImage || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96'
  } = finalContent;

  return (
    <section 
      ref={elementRef}
      className={`relative py-20 sm:py-32 md:py-44 bg-gradient-to-b from-gray-900 to-black transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <>
            <img 
              src={backgroundImage}
              alt="Hero background" 
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        )}
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
          {title.includes('Crossed Heart') ? (
            <>
              {title.split('Crossed Heart')[0]}
              <span className="text-orange-400">Crossed Heart</span>
              {title.split('Crossed Heart')[1]}
            </>
          ) : (
            title
          )}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
          {subtitle}
        </p>
      </div>
    </section>
  );
};