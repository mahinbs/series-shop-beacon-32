import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { BookCharacterImage } from '@/services/bookCharacterService';

interface CharacterImageGalleryProps {
  images: BookCharacterImage[];
  characterName: string;
}

export const CharacterImageGallery = ({ images, characterName }: CharacterImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentImageIndex];
  const mainImage = images.find(img => img.is_main) || images[0];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative group">
        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
          <img
            src={currentImage.image_url}
            alt={currentImage.alt_text || `${characterName} image`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Zoom Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl p-0">
            <div className="aspect-[4/3] w-full">
              <img
                src={currentImage.image_url}
                alt={currentImage.alt_text || `${characterName} image`}
                className="w-full h-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => selectImage(index)}
              className={`flex-shrink-0 relative ${
                index === currentImageIndex 
                  ? 'ring-2 ring-primary' 
                  : 'hover:ring-2 hover:ring-muted-foreground/50'
              }`}
            >
              <div className="w-16 h-12 rounded overflow-hidden bg-muted">
                <img
                  src={image.image_url}
                  alt={image.alt_text || `${characterName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {image.is_main && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="text-center text-sm text-muted-foreground">
          {currentImageIndex + 1} of {images.length}
        </div>
      )}
    </div>
  );
};