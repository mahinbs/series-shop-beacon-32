import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import {
  BookCharacterService,
  BookCharacter,
} from "@/services/bookCharacterService";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Users, Sparkles, Star, Heart } from "lucide-react";
import { CharacterPreviewModal } from "@/components/CharacterPreviewModal";

interface BookCharactersProps {
  bookId: string;
  className?: string;
}

export interface BookCharactersRef {
  openFirstCharacter: () => void;
}

export const BookCharacters = forwardRef<
  BookCharactersRef,
  BookCharactersProps
>(({ bookId, className = "" }, ref) => {
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userClickedCharacter, setUserClickedCharacter] = useState(false);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);

  // Debug logging to track modal state
  console.log("🎭 BookCharacters: Modal state:", {
    isModalOpen,
    selectedCharacter: selectedCharacter?.name || "none",
  });

  // Safeguard: Reset modal state if it somehow gets opened without a character or user interaction
  useEffect(() => {
    if (isModalOpen && (!selectedCharacter || !userClickedCharacter)) {
      console.log(
        "🚨 BookCharacters: Modal is open without proper conditions, closing it"
      );
      console.log("🚨 BookCharacters: Conditions:", {
        isModalOpen,
        selectedCharacter: selectedCharacter?.name || "none",
        userClickedCharacter,
      });
      setIsModalOpen(false);
      setSelectedCharacter(null);
      setUserClickedCharacter(false);
    }
  }, [isModalOpen, selectedCharacter, userClickedCharacter]);

  useEffect(() => {
    const loadCharacters = async () => {
      setLoading(true);
      try {
        const data = await BookCharacterService.getBookCharacters(bookId);
        // Transform data for character preview
        const enhancedCharacters = data.map((char) => {
          const mainImage =
            char.images?.find((img) => img.is_main) || char.images?.[0];
          return {
            ...char,
            image: mainImage?.image_url || char.image_url || "/placeholder.svg",
            backstory:
              char.description +
              " Their journey has been filled with challenges that have shaped them into who they are today.",
            abilities: [
              "Unique Skill",
              "Special Power",
              "Ancient Knowledge",
              "Hidden Talent",
            ],
            relationships: [
              "Connected to the main story",
              "Influences key events",
              "Beloved by readers",
            ],
          };
        });
        setCharacters(enhancedCharacters);
        console.log(
          "🎭 BookCharacters: Loaded",
          enhancedCharacters.length,
          "characters for book:",
          bookId
        );
        console.log(
          "🎭 BookCharacters: Modal should remain closed after loading"
        );
        console.log("🎭 BookCharacters: Current modal state after loading:", {
          isModalOpen,
          selectedCharacter: selectedCharacter?.name || "none",
        });

        // Ensure modal is closed and reset when characters are loaded
        setIsModalOpen(false);
        setSelectedCharacter(null);
        setUserClickedCharacter(false);
        console.log(
          "🎭 BookCharacters: Reset modal state after character loading"
        );

        // Check if any character is being automatically selected
        if (enhancedCharacters.length > 0) {
          console.log(
            "🎭 BookCharacters: First character data:",
            enhancedCharacters[0]
          );
        }
      } catch (error) {
        console.error("Failed to load characters:", error);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      loadCharacters();
    }
  }, [bookId]);

  const handleCharacterClick = (character: any) => {
    console.log("🎭 BookCharacters: Character clicked:", character.name);
    const characterIndex = characters.findIndex(
      (char) => char.id === character.id
    );
    setCurrentCharacterIndex(characterIndex);
    setUserClickedCharacter(true);
    setSelectedCharacter(character);
    setIsModalOpen(true);
    console.log(
      "🎭 BookCharacters: Modal opened for character:",
      character.name,
      "at index:",
      characterIndex
    );
  };

  const handlePreviousCharacter = () => {
    if (currentCharacterIndex > 0) {
      const newIndex = currentCharacterIndex - 1;
      setCurrentCharacterIndex(newIndex);
      setSelectedCharacter(characters[newIndex]);
      console.log(
        "🎭 BookCharacters: Navigated to previous character:",
        characters[newIndex].name
      );
    }
  };

  const handleNextCharacter = () => {
    if (currentCharacterIndex < characters.length - 1) {
      const newIndex = currentCharacterIndex + 1;
      setCurrentCharacterIndex(newIndex);
      setSelectedCharacter(characters[newIndex]);
      console.log(
        "🎭 BookCharacters: Navigated to next character:",
        characters[newIndex].name
      );
    }
  };

  const handleNavigateToCharacter = (index: number) => {
    if (index >= 0 && index < characters.length) {
      setCurrentCharacterIndex(index);
      setSelectedCharacter(characters[index]);
      console.log(
        "🎭 BookCharacters: Navigated to character at index:",
        index,
        characters[index].name
      );
    }
  };

  // Expose methods to parent component
  useImperativeHandle(
    ref,
    () => ({
      openFirstCharacter: () => {
        if (characters.length > 0) {
          console.log(
            "🎭 BookCharacters: Opening first character from external trigger"
          );
          setCurrentCharacterIndex(0);
          setUserClickedCharacter(true);
          setSelectedCharacter(characters[0]);
          setIsModalOpen(true);
        }
      },
    }),
    [characters]
  );

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
        <h3 className="text-red-400 font-bold text-lg mb-4 uppercase">
          Characters
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
            <CarouselItem
              key={character.id}
              className="pl-2 md:pl-4 basis-auto"
            >
              <Card
                className="w-48 h-64 overflow-hidden cursor-pointer border-2"
                onClick={() => handleCharacterClick(character)}
              >
                <div className="relative h-full">
                  {character.image ? (
                    <img
                      src={character.image}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center relative overflow-hidden">
                      <User className="h-16 w-16 text-primary/60 relative z-10" />
                    </div>
                  )}

                  {/* Enhanced overlays and info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-20">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm">{character.name}</h4>
                    </div>
                    {character.role && (
                      <Badge
                        variant="secondary"
                        className="bg-primary/90 text-primary-foreground border-primary/50 text-xs backdrop-blur-sm"
                      >
                        <Star className="w-2 min-w-2 mr-1" />
                        {character.role}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>

      <CharacterPreviewModal
        character={selectedCharacter}
        isOpen={
          isModalOpen && selectedCharacter !== null && userClickedCharacter
        }
        characters={characters}
        currentIndex={currentCharacterIndex}
        onPrevious={handlePreviousCharacter}
        onNext={handleNextCharacter}
        onNavigateToCharacter={handleNavigateToCharacter}
        onClose={() => {
          console.log("🎭 BookCharacters: Modal closing");
          setIsModalOpen(false);
          setSelectedCharacter(null);
          setUserClickedCharacter(false);
        }}
      />
    </div>
  );
});

BookCharacters.displayName = "BookCharacters";
