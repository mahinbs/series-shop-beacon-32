
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Globe, BookOpen, Rocket } from 'lucide-react';
import HeroSection from './HeroSection';
import ProductGrid from './ProductGrid';
import RecommendedSection from './RecommendedSection';

const AboutTeam = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.2);

  const values = [
    {
      title: "Quality First",
      description: "We never compromise on the quality of our translations and localizations. Every panel, every dialogue bubble receives meticulous attention.",
      Icon: Star
    },
    {
      title: "Cultural Respect",
      description: "We honor the original creators' vision while making stories accessible to new audiences, preserving cultural nuances.",
      Icon: Globe
    },
    {
      title: "Reader Focus",
      description: "Everything we do is guided by what will create the best possible reading experience for our global community.",
      Icon: BookOpen
    },
    {
      title: "Innovation",
      description: "We continuously explore new technologies and methods to improve our publishing process and reader experience.",
      Icon: Rocket
    }
  ];

  return (
    <>
      <section 
        ref={elementRef}
        className={`py-16 bg-black transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Our <span className="text-red-500">Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {values.map((value, index) => (
              <Card 
                key={index}
                className={`bg-gray-800 border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${200 + index * 150}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-lg mb-4">
                    <value.Icon className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-red-500 text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Homepage sections */}
      <HeroSection />
      <ProductGrid />
      <RecommendedSection />
    </>
  );
};

export default AboutTeam;
