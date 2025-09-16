import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Star, Image, Upload } from 'lucide-react';

export interface CharacterImageForm {
  id?: string;
  image_url: string;
  is_main: boolean;
  display_order: number;
  alt_text: string;
}

interface CharacterImageManagerProps {
  images: CharacterImageForm[];
  onImagesChange: (images: CharacterImageForm[]) => void;
  disabled?: boolean;
}

export const CharacterImageManager = ({ images, onImagesChange, disabled = false }: CharacterImageManagerProps) => {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');

  const addImage = () => {
    if (!newImageUrl.trim()) return;

    const newImage: CharacterImageForm = {
      image_url: newImageUrl.trim(),
      is_main: images.length === 0, // First image is main by default
      display_order: images.length,
      alt_text: newImageAlt.trim()
    };

    onImagesChange([...images, newImage]);
    setNewImageUrl('');
    setNewImageAlt('');
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // If we removed the main image, make the first remaining image main
    if (images[index].is_main && newImages.length > 0) {
      newImages[0].is_main = true;
    }
    onImagesChange(newImages);
  };

  const setAsMain = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_main: i === index
    }));
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;

    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    
    // Update display order
    newImages.forEach((img, i) => {
      img.display_order = i;
    });

    onImagesChange(newImages);
  };

  const updateImageAlt = (index: number, altText: string) => {
    const newImages = [...images];
    newImages[index].alt_text = altText;
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold flex items-center gap-2">
        <Image className="h-4 w-4" />
        Character Images
      </Label>

      {/* Existing Images */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map((image, index) => (
            <Card key={index} className={`p-3 ${image.is_main ? 'ring-2 ring-primary' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || `Character image ${index + 1}`}
                    className="w-12 h-12 rounded object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  {image.is_main && (
                    <div className="absolute -top-1 -right-1">
                      <Badge variant="default" className="bg-primary text-primary-foreground px-1 py-0 text-xs">
                        <Star className="h-2 w-2" />
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <Input
                    placeholder="Alt text (optional)"
                    value={image.alt_text}
                    onChange={(e) => updateImageAlt(index, e.target.value)}
                    className="text-xs"
                    disabled={disabled}
                  />
                  <div className="text-xs text-muted-foreground truncate">
                    {image.image_url}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!image.is_main && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setAsMain(index)}
                      disabled={disabled}
                      title="Set as main image"
                    >
                      <Star className="h-3 w-3" />
                    </Button>
                  )}
                  
                  <Button
                    type="button"
                    variant="ghost" 
                    size="sm"
                    onClick={() => moveImage(index, index - 1)}
                    disabled={disabled || index === 0}
                    title="Move up"
                  >
                    ↑
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm" 
                    onClick={() => moveImage(index, index + 1)}
                    disabled={disabled || index === images.length - 1}
                    title="Move down"
                  >
                    ↓
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(index)}
                    disabled={disabled}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Image */}
      <Card className="p-3 border-dashed">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm">Add New Image</Label>
          </div>
          
          <div className="space-y-2">
            <Input
              placeholder="Image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              disabled={disabled}
            />
            <Input
              placeholder="Alt text (optional)"
              value={newImageAlt}
              onChange={(e) => setNewImageAlt(e.target.value)}
              disabled={disabled}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addImage}
            disabled={disabled || !newImageUrl.trim()}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>
      </Card>

      {images.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No images added yet. Add your first image above.</p>
        </div>
      )}
    </div>
  );
};
