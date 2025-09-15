import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Star, Heart, Zap, Shield, Sword } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  description: string;
  role: string;
  image: string;
  stats?: {
    strength?: number;
    intelligence?: number;
    charisma?: number;
    magic?: number;
  };
  backstory?: string;
  abilities?: string[];
  relationships?: string[];
}

// Enhanced character data with additional properties for modal preview
const characters: Character[] = [
  {
    id: '1',
    name: 'MITSUMI IWAKURA',
    description: 'A determined student who moves from the countryside to Tokyo for high school. Despite her initial struggles, she maintains an optimistic outlook and strong work ethic.',
    role: 'Main Character',
    image: '/public/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png',
    stats: { strength: 70, intelligence: 85, charisma: 90, magic: 45 },
    backstory: 'Born and raised in the peaceful countryside, Mitsumi always dreamed of the bustling city life. Her move to Tokyo represents not just a change of location, but a complete transformation of her world.',
    abilities: ['Leadership', 'Adaptability', 'Perseverance', 'Empathy'],
    relationships: ['Best friend to Sousuke Shima', 'Roommate with Mika', 'Class representative']
  },
  {
    id: '2', 
    name: 'SOUSUKE SHIMA',
    description: 'A calm and reliable classmate who becomes one of Mitsumi\'s closest friends. He has a gentle personality and often helps others navigate social situations.',
    role: 'Supporting Character',
    image: '/public/lovable-uploads/26efc76c-fa83-4369-8d8d-354eab1433e6.png',
    stats: { strength: 60, intelligence: 95, charisma: 75, magic: 40 },
    backstory: 'Growing up in Tokyo, Sousuke learned early on how to read people and situations. His calm demeanor hides a deep understanding of human nature.',
    abilities: ['Social Intelligence', 'Problem Solving', 'Emotional Support', 'Strategic thinking'],
    relationships: ['Mitsumi\'s closest confidant', 'Mediator in group conflicts', 'Academic mentor to classmates']
  },
  {
    id: '3',
    name: 'MIKA EGASHIRA', 
    description: 'An energetic and outgoing student who quickly befriends Mitsumi. She has a strong sense of justice and isn\'t afraid to speak her mind.',
    role: 'Supporting Character',
    image: '/public/lovable-uploads/298cc90c-2dff-4daf-b31b-2ebe77649735.png',
    stats: { strength: 80, intelligence: 70, charisma: 95, magic: 30 },
    backstory: 'Raised in a family of activists, Mika learned to stand up for what she believes in from a young age. Her fiery spirit often gets her into trouble, but also inspires others.',
    abilities: ['Public Speaking', 'Courage', 'Rally Support', 'Quick Thinking'],
    relationships: ['Mitsumi\'s energetic roommate', 'Leader of student advocacy groups', 'Protector of underclassmen']
  },
  {
    id: '4',
    name: 'MAKOTO KURUME',
    description: 'A popular student who initially seems intimidating but reveals a more complex personality. He has his own struggles with expectations and identity.',
    role: 'Supporting Character', 
    image: '/public/lovable-uploads/464d8ea7-d84c-4d59-a0dc-01715d6ce881.png',
    stats: { strength: 85, intelligence: 80, charisma: 65, magic: 55 },
    backstory: 'Born into a wealthy family with high expectations, Makoto struggles between maintaining his popular image and being true to himself. His journey involves learning to be vulnerable.',
    abilities: ['Athletic Prowess', 'Fashion Sense', 'Hidden Sensitivity', 'Protective Instincts'],
    relationships: ['Popular among peers', 'Secretly insecure about family pressure', 'Gradually opens up to the group']
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
            <HoverCard key={character.id} openDelay={300} closeDelay={200}>
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
                    {/* Enhanced floating particles effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-red-400 rounded-full animate-bounce"
                          style={{
                            left: `${15 + (i * 15)}%`,
                            top: `${20 + (i * 12)}%`,
                            animationDelay: `${i * 0.15}s`,
                            animationDuration: `${1.5 + (i * 0.1)}s`
                          }}
                        />
                      ))}
                    </div>

                    {/* Hover indicator */}
                    <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                      <div className="bg-red-500/25 backdrop-blur-sm rounded-full p-1.5 border border-red-400/50">
                        <Sparkles className="h-3 w-3 text-red-400 animate-pulse" />
                      </div>
                    </div>

                    {/* Character Image with enhanced effects */}
                    <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 group-hover:border-red-500 group-hover:shadow-2xl group-hover:shadow-red-500/25 transition-all duration-500 relative">
                      <img 
                        src={character.image}
                        alt={character.name}
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 group-hover:brightness-110"
                        loading="lazy"
                      />
                      
                      {/* Enhanced gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 via-transparent to-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Enhanced role badge that appears on hover */}
                      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-2 group-hover:translate-x-0">
                        <Badge variant="secondary" className="bg-red-500/90 text-white border-red-400 text-xs backdrop-blur-sm">
                          <Star className="w-3 h-3 mr-1" />
                          {character.role}
                        </Badge>
                      </div>

                      {/* Stats preview */}
                      {character.stats && (
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white border border-red-400/30">
                            <div className="flex items-center gap-1">
                              <Sparkles className="h-2 w-2 text-red-400" />
                              <span>Lv {Math.max(...Object.values(character.stats))}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced Character Name with stats */}
                    <div className="mt-4 text-center">
                      <h3 className="text-white font-bold text-sm md:text-base mb-2 group-hover:text-red-400 transition-colors duration-500 tracking-wide">
                        {character.name}
                      </h3>
                      {character.abilities && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <p className="text-xs text-gray-400 truncate">
                            {character.abilities[0]}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Enhanced glow effects with multiple layers */}
                    <div className="absolute inset-0 bg-gradient-radial from-red-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl blur-xl scale-110"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 via-purple-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                    
                    {/* Pulsing corner indicators */}
                    <div className="absolute top-1 left-1 w-2 h-2 bg-red-400/0 group-hover:bg-red-400/60 rounded-full transition-colors duration-500 animate-pulse" />
                    <div className="absolute top-1 right-1 w-2 h-2 bg-red-400/0 group-hover:bg-red-400/60 rounded-full transition-colors duration-500 animate-pulse" style={{ animationDelay: '0.1s' }} />
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent 
                side="top" 
                className="w-[700px] p-0 border-red-500/20 bg-gradient-to-br from-gray-900/98 via-gray-900/95 to-red-900/30 backdrop-blur-xl shadow-2xl shadow-red-500/30 ring-1 ring-red-500/20"
                sideOffset={20}
                align="center"
              >
                <div className="relative overflow-hidden rounded-lg">
                  {/* Enhanced background effects */}
                  <div className="absolute inset-0 bg-gradient-radial from-red-500/20 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-500/30 to-transparent rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/25 to-transparent rounded-full blur-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-red-500/5 to-purple-500/10" />
                  
                  <div className="relative flex flex-col md:flex-row h-[400px] text-white">
                    {/* Image Section - 60% */}
                    <div className="relative w-full md:w-3/5 h-48 md:h-full">
                      <img 
                        src={character.image} 
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/60 md:bg-gradient-to-r md:from-transparent md:to-gray-900/80" />
                      
                      {/* Character name overlay on image */}
                      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                        <h4 className="font-bold text-2xl md:text-3xl text-white mb-2 flex items-center gap-3">
                          {character.name}
                          <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                        </h4>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="border-red-400/60 text-red-300 text-sm bg-red-500/20 backdrop-blur-sm">
                            <Star className="h-3 w-3 mr-1" />
                            {character.role}
                          </Badge>
                          <Badge variant="outline" className="border-purple-400/50 text-purple-300 text-sm bg-purple-500/20 backdrop-blur-sm">
                            <Heart className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* Details Section - 40% */}
                    <div className="flex-1 p-6 overflow-y-auto">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-300 leading-relaxed bg-gray-800/30 p-4 rounded-lg border border-red-500/20">{character.description}</p>
                        
                        {/* Backstory section */}
                        {character.backstory && (
                          <div className="mb-4">
                            <h5 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                              <Sword className="h-3 w-3" />
                              Backstory
                            </h5>
                            <p className="text-xs text-gray-400 leading-relaxed bg-gray-800/20 p-2 rounded border-l-2 border-red-500/40">
                              {character.backstory}
                            </p>
                          </div>
                        )}

                        {/* Enhanced stats preview */}
                        {character.stats && (
                          <div className="mb-4">
                            <h5 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                              <Shield className="h-3 w-3" />
                              Character Stats
                            </h5>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(character.stats).map(([stat, value]) => (
                                <div key={stat} className="bg-gray-800/40 rounded-lg p-2 border border-red-500/20">
                                  <div className="text-xs text-gray-400 capitalize">{stat}</div>
                                  <div className="font-bold text-red-400 text-sm">{value}</div>
                                  <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                                    <div 
                                      className="bg-gradient-to-r from-red-500 to-red-400 h-1 rounded-full transition-all duration-1000"
                                      style={{ width: `${value}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Abilities preview */}
                        {character.abilities && character.abilities.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                              <Zap className="h-3 w-3" />
                              Abilities
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {character.abilities.slice(0, 4).map((ability, i) => (
                                <Badge key={i} variant="secondary" className="text-xs bg-red-500/15 text-red-300 border-red-500/30">
                                  {ability}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Interactive buttons */}
                        <div className="flex gap-2 pt-3 border-t border-red-500/10">
                          <Button size="sm" variant="outline" className="flex-1 text-xs border-red-500/30 text-red-300 hover:bg-red-500/10">
                            <Heart className="h-3 w-3 mr-1" />
                            Favorite
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 text-xs border-red-500/30 text-red-300 hover:bg-red-500/10">
                            <Star className="h-3 w-3 mr-1" />
                            Follow
                          </Button>
                        </div>
                      </div>
                    </div>
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