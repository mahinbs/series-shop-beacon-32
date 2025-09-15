import { useState, useEffect } from 'react';
import { BookCharacterService, BookCharacter } from '@/services/bookCharacterService';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { User, Users } from 'lucide-react';

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
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Characters</h3>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {characters.map((character) => (
            <CarouselItem key={character.id} className="pl-2 md:pl-4 basis-auto">
              <Card className="w-48 h-64 overflow-hidden group hover-scale">
                <div className="relative h-full">
                  {character.image_url ? (
                    <img
                      src={character.image_url}
                      alt={character.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                      <User className="h-16 w-16 text-primary/40" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h4 className="font-semibold text-sm mb-1">{character.name}</h4>
                    {character.role && (
                      <p className="text-xs text-white/80 capitalize">{character.role}</p>
                    )}
                    {character.description && (
                      <p className="text-xs text-white/70 mt-1 line-clamp-2">
                        {character.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};