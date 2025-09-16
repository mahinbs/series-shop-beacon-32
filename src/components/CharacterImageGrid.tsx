import { useState } from 'react';
import { BookCharacterImage } from '@/services/bookCharacterService';

interface CharacterImageGridProps {
  images: BookCharacterImage[];
  characterName: string;
  onImageSelect: (imageUrl: string) => void;
  selectedImageUrl: string;
  variant?: 'default' | 'compact';
}

export const CharacterImageGrid = ({ images, characterName, onImageSelect, selectedImageUrl, variant = 'default' }: CharacterImageGridProps) => {
  if (!images || images.length === 0) {
    return null;
  }

  console.log('🖼️ CharacterImageGrid rendering:', images.length, 'images for', characterName);

  const isCompact = variant === 'compact';
  
  return (
    <div className="space-y-3">
      <h4 className={`${isCompact ? 'text-xs' : 'text-sm'} font-semibold text-muted-foreground`}>
        All Images ({images.length})
      </h4>
      <div className={`grid ${isCompact ? 'grid-cols-3 gap-2 max-h-48' : 'grid-cols-2 gap-3 max-h-96'} overflow-y-auto`}>
        {images.map((image, index) => (
          <button
            key={`${image.id}-${index}`} // Use both id and index to ensure uniqueness
            onClick={() => {
              console.log('🖼️ Image selected:', image.image_url, 'for', characterName);
              onImageSelect(image.image_url);
            }}
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
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
            {image.is_main && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border border-background" />
            )}
            {/* Show image metadata */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <p className="text-white text-xs truncate">
                {image.alt_text || `Image ${index + 1}`}
              </p>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
          </button>
        ))}
      </div>
    </div>
  );
};