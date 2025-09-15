import { useState, useEffect } from 'react';
import { BookCharacterService, BookCharacter } from '@/services/bookCharacterService';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { User, Users, Sparkles, Star } from 'lucide-react';

interface BookCharactersProps {
  bookId: string;
  className?: string;
}

export const BookCharacters = ({ bookId, className = '' }: BookCharactersProps) => {
  const [characters, setCharacters] = useState<BookCharacter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCharacters = async () => {
      setLoading(true);
      try {
        const data = await BookCharacterService.getBookCharacters(bookId);
        setCharacters(data);
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
              <HoverCard openDelay={300} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <Card className="w-48 h-64 overflow-hidden group cursor-pointer transition-all duration-700 transform hover:scale-110 hover:-translate-y-2 hover:rotate-1 hover:shadow-2xl hover:shadow-primary/25 border-2 hover:border-primary/50">
                    <div className="relative h-full">
                      {/* Floating particles effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10">
                        <div className="absolute top-2 left-2 w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: `${index * 0.1}s`}}></div>
                        <div className="absolute top-4 right-3 w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: `${index * 0.1 + 0.2}s`}}></div>
                        <div className="absolute bottom-8 left-3 w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: `${index * 0.1 + 0.4}s`}}></div>
                        <div className="absolute bottom-12 right-2 w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: `${index * 0.1 + 0.6}s`}}></div>
                      </div>

                      {character.image_url ? (
                        <img
                          src={character.image_url}
                          alt={character.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:brightness-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/20 to-primary/30 group-hover:from-primary/20 group-hover:via-primary/30 group-hover:to-primary/40 transition-all duration-500"></div>
                          <User className="h-16 w-16 text-primary/60 group-hover:text-primary group-hover:scale-110 transition-all duration-500 relative z-10" />
                        </div>
                      )}
                      
                      {/* Enhanced gradient overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 group-hover:via-black/10 transition-all duration-500" />
                      
                      {/* Role badge that appears on hover */}
                      {character.role && (
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0 z-20">
                          <Badge variant="secondary" className="bg-primary/90 text-primary-foreground border-primary/50 text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            {character.role}
                          </Badge>
                        </div>
                      )}
                      
                      {/* Character info with enhanced styling */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
                        <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors duration-500 tracking-wide">
                          {character.name}
                        </h4>
                        {character.description && (
                          <p className="text-xs text-white/80 group-hover:text-white/90 mt-1 line-clamp-2 transition-colors duration-300">
                            {character.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Enhanced glow effects */}
                      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl scale-110"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent 
                  side="top" 
                  className="w-80 p-6 bg-gradient-to-br from-background to-muted border border-primary/30 shadow-2xl shadow-primary/20"
                  sideOffset={15}
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/50 bg-gradient-to-br from-primary/20 to-primary/40">
                        {character.image_url ? (
                          <img 
                            src={character.image_url} 
                            alt={character.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-primary text-lg">{character.name}</h4>
                        {character.role && (
                          <Badge variant="outline" className="border-primary/50 text-primary text-xs capitalize">
                            {character.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                    {character.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{character.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs font-medium">Character Profile</span>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-all duration-300" />
        <CarouselNext className="hidden md:flex hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-all duration-300" />
      </Carousel>
    </div>
  );
};