import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
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
}

interface CharacterPreviewModalProps {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
  characters?: Character[];
  currentIndex?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onNavigateToCharacter?: (index: number) => void;
}

export const CharacterPreviewModal = ({ 
  character, 
  isOpen, 
  onClose, 
  characters = [], 
  currentIndex = 0, 
  onPrevious, 
  onNext,
  onNavigateToCharacter
}: CharacterPreviewModalProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedImage, setSelectedImage] = useState('/placeholder.svg');
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(currentIndex);
  const [selectedCharacter, setSelectedCharacter] = useState(character);

  // Sync local state with props
  useEffect(() => {
    setCurrentCharacterIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    setSelectedCharacter(character);
  }, [character]);

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
            <div className="flex items-center gap-4">
              {/* Navigation Arrows */}
              {characters.length > 1 && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onPrevious}
                    disabled={currentIndex === 0}
                    className="hover:scale-110 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onNext}
                    disabled={currentIndex === characters.length - 1}
                    className="hover:scale-110 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Character Details
              </DialogTitle>
            </div>
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
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 relative z-10 overflow-y-auto max-h-[70vh]">
          {/* Left Side - Main Image */}
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

          {/* Right Side - Character Info */}
          <div className="space-y-6">
            {/* Character Name and Role */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">{character.name}</h2>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                {character.role}
              </Badge>
            </div>

             {/* Description */}
             <div>
               <h3 className="text-lg font-semibold mb-3 text-primary">Description</h3>
               <p className="text-muted-foreground leading-relaxed">{character.description}</p>
             </div>

             {/* All Images Section - Below Description */}
             {character.images && character.images.length > 0 && (
               <div className="mt-6">
                 <div 
                   className="flex gap-4 overflow-x-auto pb-4" 
                   style={{ 
                     scrollbarWidth: 'auto', 
                     msOverflowStyle: 'scrollbar',
                     scrollbarColor: '#3b82f6 #f1f5f9',
                     scrollbarGutter: 'stable'
                   }}
                 >
                   {character.images.map((image, index) => (
                      <div
                        key={index}
                        className={`flex-shrink-0 w-48 h-52 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                          selectedImage === image.image_url 
                            ? 'ring-2 ring-primary shadow-lg scale-105' 
                            : 'hover:scale-105 opacity-80 hover:opacity-100'
                        }`}
                        onClick={() => setSelectedImage(image.image_url)}
                      >
                       <img
                         src={image.image_url}
                         alt={`${character.name} - Image ${index + 1}`}
                         className="w-full h-full object-cover"
                         onError={(e) => {
                           e.currentTarget.src = "/placeholder.svg";
                         }}
                       />
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>
         </div>

        {/* Bottom Right Navigation */}
        {characters.length > 1 && (
          <div className="absolute bottom-6 right-6 z-20">
            <div className="flex flex-col gap-3 items-end">
              
              {/* Navigation Arrows */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPrevious}
                  disabled={currentIndex === 0}
                  className="bg-gradient-to-r from-primary/80 to-primary/60 hover:from-primary hover:to-primary text-white hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-12 w-12 rounded-full shadow-lg hover:shadow-xl hover:scale-110 border-2 border-primary/30 hover:border-primary"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onNext}
                  disabled={currentIndex === characters.length - 1}
                  className="bg-gradient-to-r from-primary/80 to-primary/60 hover:from-primary hover:to-primary text-white hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-12 w-12 rounded-full shadow-lg hover:shadow-xl hover:scale-110 border-2 border-primary/30 hover:border-primary"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
              
              {/* Character Counter */}
              <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-xs font-bold border border-primary/30">
                {currentIndex + 1} of {characters.length}
              </div>
            </div>
          </div>
        )}

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