
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Link } from 'react-router-dom';

const CreativeCorner = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.2);

  const scrollingImages = [
    "/lovable-uploads/a0c88e05-5aba-4550-8ee0-7644ad456776.png",
    "/lovable-uploads/26efc76c-fa83-4369-8d8d-354eab1433e6.png",
    "/lovable-uploads/97f88fee-e070-4d97-a73a-c747112fa093.png",
    "/lovable-uploads/dec36eb1-43e4-40dc-9068-88317b09eab2.png",
    "/lovable-uploads/c329fdd6-be7b-4f27-8670-008a030b5b9e.png",
    "/lovable-uploads/e5072af9-fcd6-47c6-868c-035382ab9e20.png"
  ];

  return (
    <section 
      ref={elementRef}
      className={`py-16 bg-black transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <h2 className="text-5xl font-bold text-white mb-4">
              Creative <span className="text-red-500">Snippets</span>
            </h2>
            
          </div>
        </div>
        
        <div className="relative">
          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Side - Large Image */}
            <div className="relative">
              <img 
                src="/lovable-uploads/a0c88e05-5aba-4550-8ee0-7644ad456776.png"
                alt="Featured Story"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            
            {/* Right Side - Title and Description */}
            <div className="flex flex-col justify-center">
              <h3 className="text-4xl font-bold text-red-500 mb-4 tracking-wider">
                AO HARU RIDE
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Io Sakisaka wanted to draw a story about growing up, and for Ao Haru Ride, she wanted to focus on the characters' self-journey and discovering who they truly were. Futaba and Kou's accidental kiss was based on a real-life experience Sakisaka had in the past.
              </p>
              <div className="text-white">
                <span className="text-gray-400">VOL 01 - </span>
                <span className="text-red-500 font-bold">CH 01</span>
              </div>
            </div>
          </div>

          {/* Scrolling Images Container */}
          <div className="relative overflow-hidden h-48">
            <div className="absolute inset-0 flex items-center">
              <div className="flex animate-scroll space-x-4 min-w-max">
                {/* First set of images */}
                {scrollingImages.map((image, index) => (
                  <div key={`first-${index}`} className="flex-shrink-0">
                    <img
                      src={image}
                      alt={`Story ${index + 1}`}
                      className="w-40 h-40 object-cover rounded-lg border-2 border-gray-700 hover:border-red-500 transition-colors cursor-pointer"
                    />
                  </div>
                ))}
                {/* Duplicate set for seamless scrolling */}
                {scrollingImages.map((image, index) => (
                  <div key={`second-${index}`} className="flex-shrink-0">
                    <img
                      src={image}
                      alt={`Story ${index + 1}`}
                      className="w-40 h-40 object-cover rounded-lg border-2 border-gray-700 hover:border-red-500 transition-colors cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Video Section */}
          <div className="mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Video Container */}
              <div className="relative group cursor-pointer">
                <img 
                  src="/lovable-uploads/26efc76c-fa83-4369-8d8d-354eab1433e6.png"
                  alt="Video Preview 1"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300 group-hover:scale-110 transform">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Right Video Container */}
              <div className="relative group cursor-pointer">
                <img 
                  src="/lovable-uploads/97f88fee-e070-4d97-a73a-c747112fa093.png"
                  alt="Video Preview 2"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300 group-hover:scale-110 transform">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreativeCorner;
