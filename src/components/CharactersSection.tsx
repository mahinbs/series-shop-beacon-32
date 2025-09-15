import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Star } from 'lucide-react';

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
    <section 
      ref={elementRef}
      className={`relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-16 overflow-hidden transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Background decoration with enhanced effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <div className={`text-center mb-12 transition-all duration-1000 delay-200 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wider flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-red-400 animate-pulse" />
            CHARACTERS
            <Sparkles className="w-8 h-8 text-red-400 animate-pulse" />
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {characters.map((character, index) => (
            <HoverCard key={character.id} openDelay={300} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div
                  className={`group cursor-pointer transition-all duration-700 transform hover:scale-110 hover:-translate-y-4 hover:rotate-1 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                  style={{ 
                    transitionDelay: `${400 + index * 150}ms`,
                  }}
                >
                  <div className="relative overflow-hidden">
                    {/* Floating particles effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute top-2 left-2 w-1 h-1 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                      <div className="absolute top-4 right-3 w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="absolute bottom-3 left-3 w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                      <div className="absolute bottom-2 right-2 w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.6s'}}></div>
                    </div>

                    {/* Character Image with enhanced effects */}
                    <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 group-hover:border-red-500 group-hover:shadow-2xl group-hover:shadow-red-500/25 transition-all duration-500 relative">
                      <img 
                        src={character.image}
                        alt={character.name}
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 group-hover:brightness-110"
                        loading="lazy"
                      />
                      
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 via-transparent to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Role badge that appears on hover */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                        <Badge variant="secondary" className="bg-red-500/90 text-white border-red-400 text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          {character.role}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Character Name with enhanced styling */}
                    <div className="mt-4 text-center">
                      <h3 className="text-white font-bold text-sm md:text-base mb-2 group-hover:text-red-400 transition-colors duration-500 tracking-wide">
                        {character.name}
                      </h3>
                    </div>

                    {/* Enhanced glow effects */}
                    <div className="absolute inset-0 bg-gradient-radial from-red-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl blur-xl scale-110"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 via-purple-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent 
                side="top" 
                className="w-80 p-6 bg-gradient-to-br from-gray-900 to-gray-800 border border-red-500/30 text-white shadow-2xl shadow-red-500/20"
                sideOffset={15}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-400/50">
                      <img 
                        src={character.image} 
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-red-400 text-lg">{character.name}</h4>
                      <Badge variant="outline" className="border-red-400/50 text-red-300 text-xs">
                        {character.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
                  <p className="text-sm text-gray-300 leading-relaxed">{character.description}</p>
                  <div className="flex items-center gap-2 text-red-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-medium">Character Profile</span>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CharactersSection;