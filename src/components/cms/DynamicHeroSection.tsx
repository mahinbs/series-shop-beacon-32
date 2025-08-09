import { useCMS } from '@/hooks/useCMS';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

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
  
  const content = getSectionContent(pageName, sectionName);
  const {
    title = defaultContent.title || 'Welcome',
    subtitle = defaultContent.subtitle || 'Discover our amazing content',
    backgroundImage = defaultContent.backgroundImage || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96'
  } = content;

  return (
    <section 
      ref={elementRef}
      className={`relative py-20 sm:py-32 md:py-44 bg-gradient-to-b from-gray-900 to-black transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage}
          alt="Hero background" 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
          {title.includes('Crossed Hearts') ? (
            <>
              {title.split('Crossed Hearts')[0]}
              <span className="text-red-500">Crossed Hearts</span>
              {title.split('Crossed Hearts')[1]}
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