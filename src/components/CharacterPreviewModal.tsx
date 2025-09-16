import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { CharacterImageGrid } from '@/components/CharacterImageGrid';
import { BookCharacterImage } from '@/services/bookCharacterService';

interface Character {
  id: string;
  name: string;
  description: string;
  role: string;
  image: string;
  images?: BookCharacterImage[];
  stats?: {
    strength?: number;
    intelligence?: number;
    charisma?: number;
    magic?: number;
  };
  backstory?: string;
  abilities?: string[];
  relationships?: string[];
}

interface CharacterPreviewModalProps {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CharacterPreviewModal = ({ character, isOpen, onClose }: CharacterPreviewModalProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedImage, setSelectedImage] = useState('/placeholder.svg');

  // Update selected image when character changes
  useEffect(() => {
    if (character?.images?.length > 0) {
      const mainImage = character.images.find(img => img.is_main);
      const newSelectedImage = mainImage?.image_url || character.images[0].image_url;
      setSelectedImage(newSelectedImage);
      console.log('🖼️ Character images loaded:', character.images.length, 'images for', character.name);
      console.log('🖼️ Selected image:', newSelectedImage);
    } else if (character?.image) {
      setSelectedImage(character.image);
      console.log('🖼️ Using fallback image for', character.name);
    } else {
      setSelectedImage('/placeholder.svg');
    }
  }, [character]);

  if (!character) return null;

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out ${character.name}!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/5 border-primary/20">
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-30" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-2xl" />
        
        <DialogHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {character.name}
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavorite}
                className="hover:scale-110 transition-transform duration-200"
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="hover:scale-110 transition-transform duration-200"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <Badge variant="secondary" className="w-fit bg-primary/10 text-primary border-primary/20">
            <Sparkles className="h-3 w-3 mr-1" />
            {character.role}
          </Badge>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 relative z-10 overflow-y-auto max-h-[70vh]">
          {/* Main Image - Left Side */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 relative group">
              <img
                src={selectedImage}
                alt={character.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-medium">{character.name}</p>
              </div>
            </div>
          </div>

          {/* Image Grid - Right Side */}
          <div className="space-y-4">
            {character.images && character.images.length > 0 && (
              <CharacterImageGrid
                images={character.images}
                characterName={character.name}
                onImageSelect={setSelectedImage}
                selectedImageUrl={selectedImage}
              />
            )}
          </div>

          {/* Character Details */}
          <div className="space-y-6 col-span-2">
            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{character.description}</p>
            </div>

            {/* Backstory */}
            {character.backstory && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Backstory</h3>
                <p className="text-muted-foreground leading-relaxed">{character.backstory}</p>
              </div>
            )}

            {/* Abilities */}
            {character.abilities && character.abilities.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Special Abilities</h3>
                <div className="flex flex-wrap gap-2">
                  {character.abilities.map((ability, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:border-primary/40 transition-colors duration-200"
                    >
                      {ability}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Relationships */}
            {character.relationships && character.relationships.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Relationships</h3>
                <div className="space-y-2">
                  {character.relationships.map((relationship, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 border border-muted-foreground/10"
                    >
                      <p className="text-sm text-muted-foreground">{relationship}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i * 10)}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + (i * 0.3)}s`
              }}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};