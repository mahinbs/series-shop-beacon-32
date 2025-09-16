import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CharacterImageGrid } from '@/components/CharacterImageGrid';
import { Star, Heart, Sparkles } from 'lucide-react';

interface CharacterHoverPreviewProps {
  character: any;
}

export const CharacterHoverPreview = ({ character }: CharacterHoverPreviewProps) => {
  const handleImageSelect = (imageUrl: string) => {
    // This could update the main image in the preview if needed
    console.log('Image selected in hover preview:', imageUrl);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/15 via-transparent to-transparent opacity-60" />
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-primary/25 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-xl" />
      
      <div className="relative flex h-[350px]">
        {/* Main Image Section - 50% */}
        <div className="relative w-1/2 h-full flex-shrink-0">
          <img
            src={character.image || "/placeholder.svg"}
            alt={character.name}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/40" />
        </div>
        
        {/* Character Details & Image Grid Section - 50% */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Character Name and Role */}
          <div className="mb-3">
            <h4 className="font-bold text-lg text-foreground mb-2 flex items-center gap-2">
              {character.name}
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            </h4>
            <div className="flex gap-2 mb-3">
              {character.role && (
                <Badge variant="outline" className="bg-primary/15 text-primary border-primary/30 text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  {character.role}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-xs leading-relaxed bg-muted/30 p-2 rounded-lg border border-primary/10 mb-4">
            {character.description}
          </p>

          {/* Character Images Grid - positioned at bottom */}
          <div className="flex-1 flex items-end">
            {character.images && character.images.length > 0 && (
              <CharacterImageGrid
                images={character.images}
                characterName={character.name}
                onImageSelect={handleImageSelect}
                selectedImageUrl={character.image || ""}
                variant="horizontal"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};