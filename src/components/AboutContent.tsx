
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Card, CardContent } from '@/components/ui/card';

const AboutContent = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.2);

  return (
    <section 
      ref={elementRef}
      className={`py-16 bg-black transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              At Crossed Hearts, we believe that great stories transcend borders and languages. Our mission is to bring the most compelling manga and webtoon stories from Japan and Korea to English-speaking audiences around the world.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              We work closely with talented creators to ensure that every translation captures not just the words, but the emotion, humor, and cultural nuances that make these stories truly special.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <h3 className="text-red-500 text-2xl font-bold mb-2">500+</h3>
                  <p className="text-gray-300">Titles Published</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <h3 className="text-red-500 text-2xl font-bold mb-2">50+</h3>
                  <p className="text-gray-300">Partner Creators</p>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/lovable-uploads/a0c88e05-5aba-4550-8ee0-7644ad456776.png"
              alt="About Crossed Hearts"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;
