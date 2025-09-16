import { useState } from 'react';
import { BookCharacterImage } from '@/services/bookCharacterService';

interface CharacterImageGridProps {
  images: BookCharacterImage[];
  characterName: string;
  onImageSelect: (imageUrl: string) => void;
  selectedImageUrl: string;
}

export const CharacterImageGrid = ({ images, characterName, onImageSelect, selectedImageUrl }: CharacterImageGridProps) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-muted-foreground">All Images ({images.length})</h4>
      <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => onImageSelect(image.image_url)}
            className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              selectedImageUrl === image.image_url 
                ? 'border-primary ring-2 ring-primary/20' 
                : 'border-muted hover:border-primary/50'
            }`}
          >
            <img
              src={image.image_url}
              alt={image.alt_text || `${characterName} image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            {image.is_main && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border border-background" />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
          </button>
        ))}
      </div>
    </div>
  );
};