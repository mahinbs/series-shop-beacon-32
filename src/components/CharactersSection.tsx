import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Character {
  id: string;
  name: string;
  description: string;
  role: string;
  image: string;
}

// Dummy character data similar to the reference image
const characters: Character[] = [
  {
    id: '1',
    name: 'MITSUMI IWAKURA',
    description: 'A determined student who moves from the countryside to Tokyo for high school. Despite her initial struggles, she maintains an optimistic outlook and strong work ethic.',
    role: 'Main Character',
    image: '/public/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png'
  },
  {
    id: '2', 
    name: 'SOUSUKE SHIMA',
    description: 'A calm and reliable classmate who becomes one of Mitsumi\'s closest friends. He has a gentle personality and often helps others navigate social situations.',
    role: 'Supporting Character',
    image: '/public/lovable-uploads/26efc76c-fa83-4369-8d8d-354eab1433e6.png'
  },
  {
    id: '3',
    name: 'MIKA EGASHIRA', 
    description: 'An energetic and outgoing student who quickly befriends Mitsumi. She has a strong sense of justice and isn\'t afraid to speak her mind.',
    role: 'Supporting Character',
    image: '/public/lovable-uploads/298cc90c-2dff-4daf-b31b-2ebe77649735.png'
  },
  {
    id: '4',
    name: 'MAKOTO KURUME',
    description: 'A popular student who initially seems intimidating but reveals a more complex personality. He has his own struggles with expectations and identity.',
    role: 'Supporting Character', 
    image: '/public/lovable-uploads/464d8ea7-d84c-4d59-a0dc-01715d6ce881.png'
  }
];

const CharactersSection = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  return (
    <TooltipProvider>
      <section 
        ref={elementRef}
        className={`relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-16 overflow-hidden transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Title */}
          <div className={`text-center mb-12 transition-all duration-1000 delay-200 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wider">
              CHARACTERS
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
          </div>

          {/* Characters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {characters.map((character, index) => (
              <Tooltip key={character.id} delayDuration={300}>
                <TooltipTrigger asChild>
                  <div
                    className={`group cursor-pointer transition-all duration-1000 transform hover:scale-105 hover:-translate-y-3 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
                    style={{ 
                      transitionDelay: `${400 + index * 150}ms`,
                    }}
                  >
                    <div className="relative">
                      {/* Character Image */}
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-800 border border-gray-700 group-hover:border-red-500/50 transition-colors duration-300">
                        <img 
                          src={character.image}
                          alt={character.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Character Name */}
                      <div className="mt-4 text-center">
                        <h3 className="text-white font-semibold text-sm md:text-base mb-1 group-hover:text-red-400 transition-colors duration-300">
                          {character.name}
                        </h3>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">
                          {character.role}
                        </p>
                      </div>

                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  className="max-w-xs p-4 bg-gray-800 border border-gray-700 text-white"
                  sideOffset={10}
                >
                  <div>
                    <h4 className="font-semibold text-red-400 mb-2">{character.name}</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{character.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default CharactersSection;