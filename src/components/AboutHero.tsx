
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const AboutHero = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.2);

  return (
    <section 
      ref={elementRef}
      className={`relative py-20 sm:py-32 md:py-44 bg-gradient-to-b from-gray-900 to-black transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Banner Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Library books background" 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
          About <span className="text-red-500">Crossed Hearts</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
          A global publishing house specialising in the English localization of Japanese manga and Korean webtoon comics, bringing incredible stories to readers worldwide.
        </p>
      </div>
    </section>
  );
};

export default AboutHero;
