import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookCharacterImage } from '@/services/bookCharacterService';

interface CharacterImageGridProps {
  images: BookCharacterImage[];
  characterName: string;
  onImageSelect: (imageUrl: string) => void;
  selectedImageUrl: string;
  variant?: 'default' | 'compact' | 'horizontal';
}

export const CharacterImageGrid = ({ images, characterName, onImageSelect, selectedImageUrl, variant = 'default' }: CharacterImageGridProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasMultipleImages, setHasMultipleImages] = useState(false);
  
  if (!images || images.length === 0) {
    return null;
  }

  console.log('🖼️ CharacterImageGrid rendering:', images.length, 'images for', characterName);

  const isCompact = variant === 'compact';
  const isHorizontal = variant === 'horizontal';

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current || !isHorizontal) return;
    
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const isScrollable = container.scrollWidth > container.clientWidth;
    
    setHasMultipleImages(images.length > 1);
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < maxScrollLeft - 1 && isScrollable);
  };

  // Scroll functions
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: -200, // Scroll by ~1.5 image widths (160px + gap)
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: 200, // Scroll by ~1.5 image widths
      behavior: 'smooth'
    });
  };

  // Set up scroll listeners for horizontal variant
  useEffect(() => {
    if (!isHorizontal) return;
    
    // Set initial state
    setHasMultipleImages(images.length > 1);
    
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    
    // Initial check
    checkScrollPosition();
    
    // Add scroll listener
    container.addEventListener('scroll', checkScrollPosition);
    
    // Add resize observer to handle container size changes
    const resizeObserver = new ResizeObserver(checkScrollPosition);
    resizeObserver.observe(container);
    
    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      resizeObserver.disconnect();
    };
  }, [isHorizontal, images.length]);
  
  if (isHorizontal) {
    return (
      <div className="relative">
        {/* Left fade gradient */}
        {hasMultipleImages && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-[5] pointer-events-none" />
        )}
        
        {/* Left Arrow */}
        {hasMultipleImages && (
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-background/90 hover:bg-background border shadow-lg disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        
        {/* Scrollable Container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-none px-10"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((image, index) => (
            <button
              key={`${image.id}-${index}`}
              onClick={() => {
                console.log('🖼️ Image selected:', image.image_url, 'for', characterName);
                onImageSelect(image.image_url);
              }}
              className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 min-w-40 w-40 h-40 flex-shrink-0 ${
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
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-white text-xs truncate">
                  {image.alt_text || `Image ${index + 1}`}
                </p>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
            </button>
          ))}
        </div>

        {/* Right fade gradient */}
        {hasMultipleImages && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-[5] pointer-events-none" />
        )}

        {/* Right Arrow */}
        {hasMultipleImages && (
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-background/90 hover:bg-background border shadow-lg disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <h4 className={`${isCompact ? 'text-xs' : 'text-sm'} font-semibold text-muted-foreground`}>
        All Images ({images.length})
      </h4>
      <div className={`grid ${isCompact ? 'grid-cols-3 gap-2 max-h-48' : 'grid-cols-2 gap-3 max-h-96'} overflow-y-auto`}>
        {images.map((image, index) => (
          <button
            key={`${image.id}-${index}`}
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