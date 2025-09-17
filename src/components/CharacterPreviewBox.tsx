import React, { useState, useEffect } from 'react';
import { BookCharacterService } from '@/services/bookCharacterService';

interface CharacterPreviewBoxProps {
  bookId: string | undefined;
  onCharacterBoxClick?: () => void;
}

export const CharacterPreviewBox: React.FC<CharacterPreviewBoxProps> = ({ bookId, onCharacterBoxClick }) => {
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCharacters = async () => {
      if (!bookId) {
        console.log('🎭 CharacterPreviewBox: No bookId provided');
        return;
      }
      
      console.log('🎭 CharacterPreviewBox: Loading characters for bookId:', bookId);
      setLoading(true);
      try {
        const data = await BookCharacterService.getBookCharacters(bookId);
        console.log('🎭 CharacterPreviewBox: Loaded characters:', data);
        console.log('🎭 CharacterPreviewBox: Number of characters:', data.length);
        setCharacters(data.slice(0, 4)); // Only show first 4 characters
      } catch (error) {
        console.error("🎭 CharacterPreviewBox: Failed to load characters:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, [bookId]);

  // Helper function to get the best image for a character
  const getCharacterImage = (character: any) => {
    console.log('🎭 CharacterPreviewBox: Getting image for character:', character);
    
    // First try to get the main image from the images array
    if (character.images && character.images.length > 0) {
      console.log('🎭 CharacterPreviewBox: Character has images:', character.images);
      const mainImage = character.images.find((img: any) => img.is_main);
      if (mainImage) {
        console.log('🎭 CharacterPreviewBox: Using main image:', mainImage.image_url);
        return mainImage.image_url;
      }
      // If no main image, use the first image
      console.log('🎭 CharacterPreviewBox: Using first image:', character.images[0].image_url);
      return character.images[0].image_url;
    }
    // Fallback to the character's image_url field
    console.log('🎭 CharacterPreviewBox: Using fallback image_url:', character.image_url);
    return character.image_url || '/placeholder.svg';
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-xs font-bold text-primary/70">No Characters</span>
      </div>
    );
  }

  const handleClick = () => {
    console.log('🎭 CharacterPreviewBox: Clicked!', { onCharacterBoxClick: !!onCharacterBoxClick });
    if (onCharacterBoxClick) {
      onCharacterBoxClick();
    }
  };

  return (
    <div className="w-full h-full relative cursor-pointer" onClick={handleClick}>
      {characters.length === 1 ? (
        // Single character - full size
        <img
          src={getCharacterImage(characters[0])}
          alt={characters[0]?.name || 'Character'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      ) : characters.length === 2 ? (
        // Two characters - side by side
        <div className="w-full h-full flex">
          <img
            src={getCharacterImage(characters[0])}
            alt={characters[0]?.name || 'Character'}
            className="w-1/2 h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
          <img
            src={getCharacterImage(characters[1])}
            alt={characters[1]?.name || 'Character'}
            className="w-1/2 h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
      ) : characters.length === 3 ? (
        // Three characters - 2 on top, 1 on bottom
        <div className="w-full h-full grid grid-cols-2 grid-rows-2">
          <img
            src={getCharacterImage(characters[0])}
            alt={characters[0]?.name || 'Character'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
          <img
            src={getCharacterImage(characters[1])}
            alt={characters[1]?.name || 'Character'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
          <img
            src={getCharacterImage(characters[2])}
            alt={characters[2]?.name || 'Character'}
            className="w-full h-full object-cover col-span-2"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
      ) : (
        // Four or more characters - 2x2 grid
        <div className="w-full h-full grid grid-cols-2 grid-rows-2">
          {characters.slice(0, 4).map((character, index) => (
            <img
              key={index}
              src={getCharacterImage(character)}
              alt={character?.name || 'Character'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          ))}
        </div>
      )}
      
      {/* Show character count if more than 4 */}
      {characters.length > 4 && (
        <div className="absolute top-2 right-2 bg-black/80 text-white text-sm px-2 py-1 rounded font-bold">
          +{characters.length - 4}
        </div>
      )}
      
    </div>
  );
};
