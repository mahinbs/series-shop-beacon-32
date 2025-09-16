import { useState, useEffect } from 'react';
import { BookCharacterService, BookCharacter } from '@/services/bookCharacterService';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Users, Sparkles, Star, Heart } from 'lucide-react';
import { CharacterPreviewModal } from '@/components/CharacterPreviewModal';

interface BookCharactersProps {
  bookId: string;
  className?: string;
}

export const BookCharacters = ({ bookId, className = '' }: BookCharactersProps) => {
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadCharacters = async () => {
      setLoading(true);
      try {
        const data = await BookCharacterService.getBookCharacters(bookId);
        // Transform data for character preview
        const enhancedCharacters = data.map(char => {
          const mainImage = char.images?.find(img => img.is_main) || char.images?.[0];
          return {
            ...char,
            image: mainImage?.image_url || char.image_url || "/placeholder.svg",
            backstory: char.description + " Their journey has been filled with challenges that have shaped them into who they are today.",
            abilities: ['Unique Skill', 'Special Power', 'Ancient Knowledge', 'Hidden Talent'],
            relationships: ['Connected to the main story', 'Influences key events', 'Beloved by readers']
          };
        });
        setCharacters(enhancedCharacters);
      } catch (error) {
        console.error('Failed to load characters:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      loadCharacters();
    }
  }, [bookId]);

  const handleCharacterClick = (character: any) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };


  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-6 bg-muted rounded"></div>
          <div className="h-6 w-32 bg-muted rounded"></div>
        </div>
        <div className="flex gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-48 h-64 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (characters.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/30 rounded-lg">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Characters
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        </h3>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {characters.map((character, index) => (
            <CarouselItem key={character.id} className="pl-2 md:pl-4 basis-auto">
              <HoverCard openDelay={300} closeDelay={200}>
                <HoverCardTrigger asChild>
                  <Card 
                    className="w-48 h-64 overflow-hidden group cursor-pointer transition-all duration-700 transform hover:scale-110 hover:-translate-y-2 hover:rotate-1 hover:shadow-2xl hover:shadow-primary/25 border-2 hover:border-primary/50"
                    onClick={() => handleCharacterClick(character)}
                  >
                    <div className="relative h-full">
                      {/* Enhanced hover indicator */}
                      <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                        <div className="bg-primary/25 backdrop-blur-sm rounded-full p-1.5 border border-primary/40">
                          <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                        </div>
                      </div>

                      {/* Enhanced floating particles */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-primary rounded-full animate-bounce"
                            style={{
                              left: `${20 + (i * 20)}%`,
                              top: `${25 + (i * 15)}%`,
                              animationDelay: `${i * 0.2}s`,
                              animationDuration: `${1.2 + (i * 0.1)}s`
                            }}
                          />
                        ))}
                      </div>

                      {character.image ? (
                        <img
                          src={character.image}
                          alt={character.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:brightness-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center relative overflow-hidden">
                          <User className="h-16 w-16 text-primary/60 group-hover:text-primary group-hover:scale-110 transition-all duration-500 relative z-10" />
                        </div>
                      )}
                      
                      {/* Enhanced overlays and info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-500" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-20">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-sm group-hover:text-primary transition-colors duration-500">
                            {character.name}
                          </h4>
                          <Sparkles className="h-3 w-3 text-primary animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        {character.role && (
                          <Badge variant="secondary" className="bg-primary/90 text-primary-foreground border-primary/50 text-xs backdrop-blur-sm">
                            <Star className="w-2 w-2 mr-1" />
                            {character.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                </HoverCardTrigger>
                
                <HoverCardContent 
                  side="top" 
                  className="w-[650px] p-0 border-primary/20 bg-gradient-to-br from-background/98 via-background/95 to-primary/10 backdrop-blur-xl shadow-2xl shadow-primary/20 ring-1 ring-primary/20"
                  sideOffset={18}
                  align="center"
                >
                  <div className="relative overflow-hidden rounded-lg">
                    {/* Enhanced background effects */}
                    <div className="absolute inset-0 bg-gradient-radial from-primary/15 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-primary/25 to-transparent rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-xl" />
                    
                    <div className="relative flex flex-col md:flex-row h-[350px]">
                      {/* Image Section - 60% */}
                      <div className="relative w-full md:w-3/5 h-40 md:h-full">
                        <img
                          src={character.image || "/placeholder.svg"}
                          alt={character.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/60 md:bg-gradient-to-r md:from-transparent md:to-background/80" />
                        
                        {/* Character name overlay on image */}
                        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                          <h4 className="font-bold text-xl md:text-2xl text-foreground mb-2 flex items-center gap-2">
                            {character.name}
                            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                          </h4>
                          <div className="flex gap-2">
                            {character.role && (
                              <Badge variant="outline" className="bg-primary/15 text-primary border-primary/30 text-sm backdrop-blur-sm">
                                <Star className="h-3 w-3 mr-1" />
                                {character.role}
                              </Badge>
                            )}
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-sm backdrop-blur-sm">
                              <Heart className="h-3 w-3 mr-1" />
                              Book Character
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Details Section - 40% */}
                      <div className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-4">
                          <p className="text-muted-foreground text-sm leading-relaxed bg-muted/30 p-3 rounded-lg border border-primary/10">
                            {character.description}
                          </p>

                          
                          {/* Interactive buttons */}
                          <div className="flex gap-2 pt-3 border-t border-primary/10">
                            <Button size="sm" variant="outline" className="flex-1 text-xs border-primary/30 text-primary hover:bg-primary/10">
                              <Heart className="h-3 w-3 mr-1" />
                              Favorite
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-xs border-primary/30 text-primary hover:bg-primary/10">
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
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>

      <CharacterPreviewModal
        character={selectedCharacter}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};