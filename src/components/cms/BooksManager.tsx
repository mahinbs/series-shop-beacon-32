import { useState, useRef } from "react";
import { useBooksOnly } from "@/hooks/useBooks";
import {
  BookCharacterService,
  BookCharacter,
} from "@/services/bookCharacterService";
import { CharacterImageManager } from "@/components/CharacterImageManager";
import { testDatabaseConnection, booksService } from "@/services/database";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  Plus,
  Save,
  Edit,
  Upload,
  BookOpen,
  Database,
  X,
  Users,
  User,
  BookCopy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import VolumePagesManager from './VolumePagesManager';

interface BookForm {
  title: string;
  author: string;
  category: string;
  price: number;
  original_price?: number;
  coins?: string;
  image_url: string;
  hover_image_url: string;
  cover_page_url: string;
  video_url?: string;
  can_unlock_with_coins: boolean;
  section_type:
    | "new-releases"
    | "best-sellers"
    | "leaving-soon"
    | "featured"
    | "trending";
  age_rating?: string;
  label?: string;
  is_new: boolean;
  is_on_sale: boolean;
  display_order: number;
  is_active: boolean;
  product_type: string;
  description: string;
  tags: string[];
  sku?: string;
  dimensions?: string;
  weight?: number;
  stock_quantity: number;
  is_popular_recommendation: boolean;
}

interface CharacterForm {
  name: string;
  description: string;
  role: string;
  display_order: number;
  images: CharacterImageForm[];
}

interface CharacterImageForm {
  id?: string;
  image_url: string;
  is_main: boolean;
  display_order: number;
  alt_text: string;
}

interface VolumeForm {
  volume_number: number;
  price: number;
  original_price?: number;
  label?: string;
  is_new: boolean;
  is_on_sale: boolean;
  stock_quantity: number;
  description?: string;
  image_url?: string;
}

export const BooksManager = () => {
  const { books, isLoading, createBook, updateBook, deleteBook, loadBooks } =
    useBooksOnly();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hoverFileInputRef = useRef<HTMLInputElement>(null);
  const coverPageFileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [characters, setCharacters] = useState<BookCharacter[]>([]);
  const [originalCharacters, setOriginalCharacters] = useState<BookCharacter[]>(
    []
  );
  const [showCharacterForm, setShowCharacterForm] = useState(false);
  const [characterForm, setCharacterForm] = useState<CharacterForm>({
    name: "",
    description: "",
    role: "main",
    display_order: 0,
    images: [],
  });
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(
    null
  );

  // Volume management state
  const [volumes, setVolumes] = useState<any[]>([]);
  const [showVolumeForm, setShowVolumeForm] = useState(false);
  const [editingVolumeId, setEditingVolumeId] = useState<string | null>(null);
  const [selectedVolumeForPages, setSelectedVolumeForPages] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [volumeForm, setVolumeForm] = useState<VolumeForm>({
    volume_number: 1,
    price: 0,
    original_price: undefined,
    label: "",
    is_new: false,
    is_on_sale: false,
    stock_quantity: 0,
    description: "",
    image_url: "",
  });
  const [formData, setFormData] = useState<BookForm>({
    title: "",
    author: "",
    category: "",
    price: 0,
    original_price: undefined,
    coins: "",
    image_url: "",
    hover_image_url: "",
    cover_page_url: "",
    video_url: "",
    can_unlock_with_coins: false,
    section_type: "new-releases",
    age_rating: "all",
    label: "",
    is_new: false,
    is_on_sale: false,
    display_order: 0,
    is_active: true,
    product_type: "book",
    description: "",
    tags: [],
    sku: "",
    dimensions: "",
    weight: undefined,
    stock_quantity: 0,
    is_popular_recommendation: false,
  });

  const resetFormData = () => {
    console.log("Resetting form data only");
    setFormData({
      title: "",
      author: "",
      category: "",
      price: 0,
      original_price: undefined,
      coins: "",
      image_url: "",
      hover_image_url: "",
      cover_page_url: "",
      video_url: "",
      can_unlock_with_coins: false,
      section_type: "new-releases",
      age_rating: "all",
      label: "",
      is_new: false,
      is_on_sale: false,
      display_order: 0,
      is_active: true,
      product_type: "book",
      description: "",
      tags: [],
      sku: "",
      dimensions: "",
      weight: undefined,
      stock_quantity: 0,
      is_popular_recommendation: false,
    });
    setEditingId(null);
    setCharacters([]);
    setOriginalCharacters([]);
    setShowCharacterForm(false);
    setCharacterForm({
      name: "",
      description: "",
      role: "main",
      display_order: 0,
      images: [],
    });
    setEditingCharacterId(null);
  };

  const testDatabase = async () => {
    setTesting(true);
    try {
      const result = await testDatabaseConnection();
      if (result.success) {
        toast({
          title: "Database Test Successful",
          description: "Database connection is working properly",
        });
      } else {
        toast({
          title: "Database Test Failed",
          description: `Error: ${result.error}. Please run the database setup script.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Database Test Failed",
        description: "Failed to test database connection",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const saveCharactersForBook = async (bookId: string) => {
    try {
      console.log("🎭 Starting character save process for book:", bookId);

      // Check authentication
      const {
        data: { session },
      } = await (supabase as any).auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description:
            "Please sign in via /auth to save characters. Only Supabase authentication is supported.",
          variant: "destructive",
        });
        return false;
      }

      // Get current characters from database
      const currentDbCharacters = await BookCharacterService.getBookCharacters(
        bookId
      );

      // Find characters to create (temp IDs)
      const charactersToCreate = characters.filter((c) =>
        c.id.startsWith("temp_")
      );

      // Find characters to update (existing IDs that changed)
      const charactersToUpdate = characters.filter(
        (c) =>
          !c.id.startsWith("temp_") &&
          originalCharacters.some(
            (orig) =>
              orig.id === c.id && JSON.stringify(orig) !== JSON.stringify(c)
          )
      );

      // Find characters to delete (in original but not in current)
      const charactersToDelete = originalCharacters.filter(
        (orig) => !characters.some((c) => c.id === orig.id)
      );

      console.log("🎭 Characters to create:", charactersToCreate.length);
      console.log("🎭 Characters to update:", charactersToUpdate.length);
      console.log("🎭 Characters to delete:", charactersToDelete.length);

      // Create new characters with their images
      for (const character of charactersToCreate) {
        console.log(
          "🎭 Creating character:",
          character.name,
          "with",
          character.images?.length || 0,
          "images"
        );
        console.log(
          "🔍 Character images data:",
          character.images?.map((img) => ({
            url: img.image_url,
            is_main: img.is_main,
            alt_text: img.alt_text,
          }))
        );

        const { id, created_at, updated_at, images, ...characterData } =
          character;

        // Create the character first
        const savedCharacter = await BookCharacterService.createBookCharacter({
          ...characterData,
          book_id: bookId,
        });

        console.log("✅ Character created with ID:", savedCharacter.id);

        // Now save the character images with enhanced error handling
        if (images && images.length > 0) {
          console.log(
            "🖼️ Processing",
            images.length,
            "images for character:",
            savedCharacter.id
          );

          const imageErrors: string[] = [];
          let savedImageCount = 0;

          for (let i = 0; i < images.length; i++) {
            const image = images[i];
            try {
              console.log(
                `🖼️ Saving image ${i + 1}/${images.length} for character ${
                  savedCharacter.id
                }:`,
                {
                  url: image.image_url,
                  is_main: image.is_main,
                  alt_text: image.alt_text,
                  display_order: image.display_order,
                }
              );

              const {
                id: imageId,
                character_id,
                created_at: imgCreated,
                updated_at: imgUpdated,
                ...imageData
              } = image;

              // Validate image data before saving
              if (!imageData.image_url || imageData.image_url.trim() === "") {
                throw new Error(`Image ${i + 1} has no URL`);
              }

              const savedImage = await BookCharacterService.addCharacterImage({
                ...imageData,
                character_id: savedCharacter.id,
              });

              console.log(
                `✅ Image ${i + 1} saved successfully for character:`,
                savedCharacter.id,
                "Image ID:",
                savedImage.id
              );
              savedImageCount++;

              // Add small delay to prevent potential race conditions
              await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (imageError) {
              const errorMsg = `Image ${i + 1}: ${
                imageError instanceof Error
                  ? imageError.message
                  : "Unknown error"
              }`;
              console.error(
                "❌ Error saving image for character:",
                savedCharacter.id,
                errorMsg
              );
              imageErrors.push(errorMsg);
            }
          }

          console.log(
            `📊 Image save results for character ${savedCharacter.id}: ${savedImageCount}/${images.length} successful`
          );

          // If no images were saved successfully, rollback character creation
          if (savedImageCount === 0 && images.length > 0) {
            console.error("❌ No images saved for character, rolling back");
            await BookCharacterService.deleteBookCharacter(savedCharacter.id);
            throw new Error(
              `Failed to save any images for character "${
                character.name
              }". Errors: ${imageErrors.join(", ")}`
            );
          }

          // If some images failed, show warning but don't rollback
          if (imageErrors.length > 0) {
            console.warn(
              `⚠️ Some images failed to save for character ${savedCharacter.id}:`,
              imageErrors
            );
            toast({
              title: "Partial Success",
              description: `Character "${character.name}" saved with ${savedImageCount}/${images.length} images. Some images failed to save.`,
              variant: "default",
            });
          }
        }
      }

      // Update existing characters and their images
      for (const character of charactersToUpdate) {
        console.log("🎭 Updating character:", character.name);

        const { created_at, updated_at, images, ...characterData } = character;
        await BookCharacterService.updateBookCharacter(
          character.id,
          characterData
        );

        // Handle image updates for existing characters
        if (images && images.length > 0) {
          console.log("🖼️ Updating images for character:", character.id);

          // Get current images for this character
          const currentImages = await BookCharacterService.getCharacterImages(
            character.id
          );

          // Delete images that are no longer present
          const imagesToDelete = currentImages.filter(
            (currentImg) =>
              !images.some((newImg) => newImg.id === currentImg.id)
          );

          for (const imageToDelete of imagesToDelete) {
            await BookCharacterService.deleteCharacterImage(imageToDelete.id);
          }

          // Update or create images
          for (const image of images) {
            const {
              character_id,
              created_at: imgCreated,
              updated_at: imgUpdated,
              ...imageData
            } = image;

            if (image.id && !image.id.startsWith("temp_")) {
              // Update existing image
              await BookCharacterService.updateCharacterImage(
                image.id,
                imageData
              );
            } else {
              // Create new image
              await BookCharacterService.addCharacterImage({
                ...imageData,
                character_id: character.id,
              });
            }
          }
        }
      }

      // Delete removed characters (this will cascade delete their images)
      for (const character of charactersToDelete) {
        console.log("🗑️ Deleting character:", character.name);
        await BookCharacterService.deleteBookCharacter(character.id);
      }

      if (
        charactersToCreate.length > 0 ||
        charactersToUpdate.length > 0 ||
        charactersToDelete.length > 0
      ) {
        toast({
          title: "Success",
          description: "Characters and images saved successfully",
        });
      }

      console.log("✅ Character save process completed successfully");
      return true;
    } catch (error) {
      console.error("❌ Error saving characters:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save characters",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    console.log("Submitting book data:", formData);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.category.trim()) {
        throw new Error("Category is required");
      }
      if (formData.price <= 0) {
        throw new Error("Price must be greater than 0");
      }
      if (!formData.image_url.trim()) {
        throw new Error("Image URL is required");
      }

      let bookId = editingId;

      if (editingId) {
        console.log("Updating book with ID:", editingId);
        await updateBook(editingId, formData);

        // Save characters for existing book
        const charactersSaved = await saveCharactersForBook(editingId);
        if (!charactersSaved) {
          return; // Don't reset form if characters failed to save
        }

        toast({
          title: "Success",
          description: "Book updated successfully",
        });
      } else {
        console.log("Creating new book");
        const createdBook = await createBook({
          ...formData,
          age_rating: formData.age_rating || "all",
          coins: formData.coins || "",
          label: formData.label || "",
          video_url: formData.video_url || null,
          original_price: formData.original_price || null,
          description: formData.description || "",
          dimensions: formData.dimensions || "",
          product_type: formData.product_type,
          sku: null,
          stock_quantity: 0,
          weight: null,
          tags: [],
          // Volume-specific fields (optional for regular books)
          parent_book_id: null,
          volume_number: null,
          is_volume: false,
          series_title: null,
        });

        bookId = createdBook.id;

        // Save characters for new book
        if (characters.length > 0) {
          const charactersSaved = await saveCharactersForBook(bookId);
          if (!charactersSaved) {
            return; // Don't reset form if characters failed to save
          }
        }

        toast({
          title: "Success",
          description: "Book created successfully",
        });
      }
      resetFormData();
      setShowAddForm(false);
      await loadBooks();
    } catch (error) {
      console.error("Error saving book:", error);
      let errorMessage = "Failed to save book";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (book: any) => {
    setFormData({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "",
      price: book.price || 0,
      original_price: book.original_price,
      coins: book.coins || "",
      image_url: book.image_url || "",
      hover_image_url: book.hover_image_url || "",
      cover_page_url: book.cover_page_url || "",
      video_url: book.video_url || "",
      can_unlock_with_coins: book.can_unlock_with_coins || false,
      section_type: book.section_type || "new-releases",
      age_rating: book.age_rating || "all",
      label: book.label || "",
      is_new: book.is_new || false,
      is_on_sale: book.is_on_sale || false,
      display_order: book.display_order || 0,
      is_active: book.is_active !== undefined ? book.is_active : true,
      product_type: book.product_type || "book",
      description: book.description || "",
      tags: Array.isArray(book.tags) ? book.tags : [],
      sku: book.sku || "",
      dimensions: book.dimensions || "",
      weight: book.weight,
      stock_quantity: book.stock_quantity || 0,
      is_popular_recommendation: book.is_popular_recommendation || false,
    });
    setEditingId(book.id);

    // Load existing characters for this book
    const bookCharacters = await BookCharacterService.getBookCharacters(
      book.id
    );
    setCharacters(bookCharacters);
    setOriginalCharacters([...bookCharacters]);

    // Load existing volumes for this book
    try {
      const { data: volumesData, error: volumesError } = await supabase
        .from('books')
        .select('*')
        .eq('parent_book_id', book.id)
        .eq('is_active', true)
        .eq('is_volume', true)
        .order('volume_number', { ascending: true });

      if (volumesError) {
        console.error('Error fetching volumes:', volumesError);
        setVolumes([]);
      } else {
        setVolumes(volumesData || []);
      }
    } catch (error) {
      console.error('Error loading volumes:', error);
      setVolumes([]);
    }

    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(id);
        toast({
          title: "Success",
          description: "Book deleted successfully",
        });
        await loadBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
        let errorMessage = "Failed to delete book";

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  const handleImageUpload = async (
    file: File,
    imageType: "main" | "hover" | "cover" = "main"
  ) => {
    setUploading(true);
    try {
      // Create temporary preview URL for immediate display
      const tempUrl = URL.createObjectURL(file);
      if (imageType === "hover") {
        setFormData((prev) => ({ ...prev, hover_image_url: tempUrl }));
      } else if (imageType === "cover") {
        setFormData((prev) => ({ ...prev, cover_page_url: tempUrl }));
      } else {
        setFormData((prev) => ({ ...prev, image_url: tempUrl }));
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `book-images/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('comic-pages')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('comic-pages')
        .getPublicUrl(filePath);

      // Update form data with permanent URL
      if (imageType === "hover") {
        setFormData((prev) => ({ ...prev, hover_image_url: urlData.publicUrl }));
      } else if (imageType === "cover") {
        setFormData((prev) => ({ ...prev, cover_page_url: urlData.publicUrl }));
      } else {
        setFormData((prev) => ({ ...prev, image_url: urlData.publicUrl }));
      }

      // Clean up temporary URL
      URL.revokeObjectURL(tempUrl);

      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully to cloud storage",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEditCharacter = (character: BookCharacter) => {
    setCharacterForm({
      name: character.name,
      description: character.description || "",
      role: character.role,
      display_order: character.display_order,
      images:
        character.images?.map((img) => ({
          id: img.id,
          image_url: img.image_url,
          is_main: img.is_main,
          display_order: img.display_order,
          alt_text: img.alt_text || "",
        })) || [],
    });
    setEditingCharacterId(character.id);
    setShowCharacterForm(true);
  };

  const handleSubmitCharacter = async () => {
    if (!characterForm.name.trim()) {
      toast({
        title: "Error",
        description: "Character name is required",
        variant: "destructive",
      });
      return;
    }

    // Validate images
    if (characterForm.images.length === 0) {
      toast({
        title: "Warning",
        description: "No images added for this character",
        variant: "default",
      });
    }

    console.log(
      "🎭 Preparing character with",
      characterForm.images.length,
      "images"
    );
    console.log(
      "🔍 Character form images:",
      characterForm.images.map((img) => ({
        url: img.image_url,
        is_main: img.is_main,
        alt_text: img.alt_text,
        display_order: img.display_order,
      }))
    );

    // Check if we're editing an existing character
    if (editingCharacterId) {
      // Update existing character
      try {
        const {
          data: { session },
        } = await (supabase as any).auth.getSession();
        if (!session) {
          toast({
            title: "Authentication Required",
            description: "Please sign in to update characters",
            variant: "destructive",
          });
          return;
        }

        const mainImage =
          characterForm.images.find((img) => img.is_main) ||
          characterForm.images[0];

        // Update the character data
        await BookCharacterService.updateBookCharacter(editingCharacterId, {
          name: characterForm.name,
          description: characterForm.description,
          image_url: mainImage?.image_url || null,
          role: characterForm.role,
          display_order: characterForm.display_order,
        });

        // Handle image updates
        if (characterForm.images.length > 0) {
          // Get current images for this character
          const currentImages = await BookCharacterService.getCharacterImages(
            editingCharacterId
          );

          // Delete images that are no longer present
          const imagesToDelete = currentImages.filter(
            (currentImg) =>
              !characterForm.images.some(
                (newImg) => newImg.id === currentImg.id
              )
          );

          for (const imageToDelete of imagesToDelete) {
            await BookCharacterService.deleteCharacterImage(imageToDelete.id);
          }

          // Update or create images
          for (const image of characterForm.images) {
            if (image.id && !image.id.startsWith("temp_")) {
              // Update existing image
              await BookCharacterService.updateCharacterImage(image.id, {
                image_url: image.image_url,
                is_main: image.is_main,
                display_order: image.display_order,
                alt_text: image.alt_text,
              });
            } else {
              // Create new image
              await BookCharacterService.addCharacterImage({
                image_url: image.image_url,
                is_main: image.is_main,
                display_order: image.display_order,
                alt_text: image.alt_text,
                character_id: editingCharacterId,
              });
            }
          }
        }

        // Reload characters to reflect changes
        if (editingId) {
          const updatedCharacters =
            await BookCharacterService.getBookCharacters(editingId);
          setCharacters(updatedCharacters);
          setOriginalCharacters([...updatedCharacters]);
        }

        toast({
          title: "Success",
          description: "Character updated successfully",
        });
      } catch (error) {
        console.error("❌ Error updating character:", error);
        toast({
          title: "Error",
          description: "Failed to update character",
          variant: "destructive",
        });
        return;
      }
    } else {
      // Create new character
      const mainImage =
        characterForm.images.find((img) => img.is_main) ||
        characterForm.images[0];
      const tempId = `temp_${Date.now()}_${Math.random()}`;

      const newCharacter: BookCharacter = {
        id: tempId,
        book_id: editingId || "",
        name: characterForm.name,
        description: characterForm.description,
        image_url: mainImage?.image_url || null,
        role: characterForm.role,
        display_order: characterForm.display_order,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        images: characterForm.images.map((img, index) => ({
          ...img,
          id: img.id || `temp_img_${tempId}_${index}`,
          character_id: tempId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })),
      };

      // If editing an existing book, save immediately
      if (editingId) {
        try {
          const {
            data: { session },
          } = await (supabase as any).auth.getSession();
          if (!session) {
            toast({
              title: "Authentication Required",
              description: "Please sign in to save characters",
              variant: "destructive",
            });
            return;
          }

          const { id, created_at, updated_at, images, ...characterData } =
            newCharacter;

          // Create the character first
          const savedCharacter = await BookCharacterService.createBookCharacter(
            {
              ...characterData,
              book_id: editingId,
            }
          );

          // Now save the character images
          if (images && images.length > 0) {
            for (const image of images) {
              const {
                id: imageId,
                character_id,
                created_at: imgCreated,
                updated_at: imgUpdated,
                ...imageData
              } = image;

              if (imageData.image_url && imageData.image_url.trim()) {
                await BookCharacterService.addCharacterImage({
                  ...imageData,
                  character_id: savedCharacter.id,
                });
              }
            }
          }

          // Reload characters to get the saved character with images
          const updatedCharacters =
            await BookCharacterService.getBookCharacters(editingId);
          setCharacters(updatedCharacters);
          setOriginalCharacters([...updatedCharacters]);

          toast({
            title: "Success",
            description: "Character created successfully",
          });
        } catch (error) {
          console.error("❌ Error saving character:", error);
          toast({
            title: "Error",
            description: "Failed to save character",
            variant: "destructive",
          });
          return;
        }
      } else {
        // For new books, just add to local state
        setCharacters([...characters, newCharacter]);
        toast({
          title: "Success",
          description: "Character added to book",
        });
      }
    }

    setCharacterForm({
      name: "",
      description: "",
      role: "main",
      display_order: characters.length,
      images: [],
    });
    setEditingCharacterId(null);
    setShowCharacterForm(false);
  };

  const handleRemoveCharacter = async (characterId: string) => {
    // If it's an existing character (has a real ID), delete from database
    if (!characterId.startsWith("temp_") && editingId) {
      try {
        const {
          data: { session },
        } = await (supabase as any).auth.getSession();
        if (!session) {
          toast({
            title: "Authentication Required",
            description: "Please sign in to delete characters",
            variant: "destructive",
          });
          return;
        }

        const success = await BookCharacterService.deleteBookCharacter(
          characterId
        );
        if (!success) {
          toast({
            title: "Error",
            description: "Failed to delete character",
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        console.error("Error deleting character:", error);
        toast({
          title: "Error",
          description: "Failed to delete character",
          variant: "destructive",
        });
        return;
      }
    }

    setCharacters(characters.filter((c) => c.id !== characterId));
    toast({
      title: "Success",
      description: "Character removed from book",
    });
  };

  const handleAddVolume = () => {
    // Calculate next volume number
    const maxVolumeNumber = volumes.length > 0 ? Math.max(...volumes.map((v) => v.volume_number), 0) : 0;
    setVolumeForm({
      volume_number: maxVolumeNumber + 1,
      price: 0,
      original_price: undefined,
      label: "",
      is_new: false,
      is_on_sale: false,
      stock_quantity: 0,
      description: "",
      image_url: "",
    });
    setEditingVolumeId(null);
    setShowVolumeForm(true);
  };

  const handleEditVolume = (volume: any) => {
    setEditingVolumeId(volume.id);
    setVolumeForm({
      volume_number: volume.volume_number,
      price: volume.price,
      original_price: volume.original_price,
      label: volume.label || "",
      is_new: volume.is_new || false,
      is_on_sale: volume.is_on_sale || false,
      stock_quantity: volume.stock_quantity || 0,
      description: volume.description || "",
      image_url: volume.image_url || "",
    });
    setShowVolumeForm(true);
  };

  const loadVolumes = async (bookId: string) => {
    try {
      const { data: volumesData, error: volumesError } = await supabase
        .from('books')
        .select('*')
        .eq('parent_book_id', bookId)
        .eq('is_active', true)
        .eq('is_volume', true)
        .order('volume_number', { ascending: true });

      if (volumesError) {
        console.error('Error fetching volumes:', volumesError);
        setVolumes([]);
      } else {
        setVolumes(volumesData || []);
      }
    } catch (error) {
      console.error('Error loading volumes:', error);
      setVolumes([]);
    }
  };

  const handleSubmitVolume = async () => {
    if (!editingId || !volumeForm.volume_number) {
      toast({
        title: "Error",
        description: "Please fill in the volume number",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingVolumeId) {
        // Update existing volume
        console.log('Updating volume with data:', volumeForm);
        await booksService.updateVolume(editingVolumeId, volumeForm);
        await loadVolumes(editingId);
        toast({
          title: "Success",
          description: "Volume updated successfully",
        });
      } else {
        // Create new volume
        await booksService.createVolume(editingId, volumeForm);
        await loadVolumes(editingId);
        toast({
          title: "Success",
          description: "Volume added successfully",
        });
      }

      // Reset form
      setVolumeForm({
        volume_number: Math.max(...volumes.map((v) => v.volume_number), 0) + 1,
        price: 0,
        original_price: undefined,
        label: "",
        is_new: false,
        is_on_sale: false,
        stock_quantity: 0,
        description: "",
        image_url: "",
      });
      setShowVolumeForm(false);
      setEditingVolumeId(null);
    } catch (error) {
      console.error("Error adding/updating volume:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add/update volume",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveVolume = async (volumeId: string) => {
    try {
      setSubmitting(true);
      await booksService.deleteVolume(volumeId);
      await loadVolumes(editingId!);

      toast({
        title: "Success",
        description: "Volume removed successfully",
      });
    } catch (error) {
      console.error("Error removing volume:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to remove volume",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading books...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={testDatabase}
              variant="outline"
              size="sm"
              disabled={testing}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              {testing ? "Testing..." : "Test DB"}
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(
                  "Add Book button clicked, showAddForm before:",
                  showAddForm
                );
                resetFormData(); // Reset form data first
                setShowAddForm(true);
                console.log("setShowAddForm(true) called");
              }}
              className="flex items-center gap-2"
              disabled={submitting}
            >
              <Plus className="h-4 w-4" />
              Add Book
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {books.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No books created yet. Start by adding your first book to display
                in the product sections.
              </p>
              <p className="text-sm text-muted-foreground">
                Books will be organized into sections: New Releases, Best
                Sellers, and Leaving Soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {books.map((book) => (
                <Card key={book.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {book.image_url && (
                        <img
                          src={book.image_url}
                          alt={book.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {book.title}
                          {book.is_volume && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              Vol.{book.volume_number}
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {book.author} • {book.category} • ${book.price}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Section: {book.section_type} • Order:{" "}
                          {book.display_order}
                          {book.is_volume && book.parent_book_id && (
                            <span className="ml-2 text-blue-600">
                              • Volume of series
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(book)}
                        disabled={submitting}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(book.id)}
                        disabled={submitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {(console.log("showAddForm value:", showAddForm), showAddForm) && (
        <Card className="border-2 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-blue-600">
                {editingId ? "Edit Book" : "Add New Book"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Fill out the form below to add a new book
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                resetFormData();
                setShowAddForm(false);
              }}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Rated as *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="section_type">Section Type</Label>
                  <Select
                    value={formData.section_type}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, section_type: value })
                    }
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-releases">New Releases</SelectItem>
                      <SelectItem value="best-sellers">Best Sellers</SelectItem>
                      <SelectItem value="leaving-soon">Leaving Soon</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="age_rating">Rated as</Label>
                  <Select
                    value={formData.age_rating || "all"}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, age_rating: value })
                    }
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ages</SelectItem>
                      <SelectItem value="teen">Teen (13+)</SelectItem>
                      <SelectItem value="mature">Mature (17+)</SelectItem>
                      <SelectItem value="18+">Adults Only (18+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="product_type">Product Type</Label>
                  <Select
                    value={formData.product_type}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, product_type: value })
                    }
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="print">Print</SelectItem>
                      <SelectItem value="merchandise">Merchandise</SelectItem>
                      <SelectItem value="digital">Digital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        display_order: parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={submitting}
                  />
                </div>
              </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="image_url">Main Image *</Label>
                    <div className="space-y-2">
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) =>
                          setFormData({ ...formData, image_url: e.target.value })
                        }
                        placeholder="Enter image URL or upload file below"
                        required
                        disabled={submitting}
                      />
                      <div className="flex items-center space-x-2">
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, "main");
                            }
                          }}
                          className="hidden"
                          disabled={submitting}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={submitting || uploading}
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          {uploading ? "Uploading..." : "Upload Image"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="hover_image_url">Hover Image</Label>
                    <div className="space-y-2">
                      <Input
                        id="hover_image_url"
                        value={formData.hover_image_url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hover_image_url: e.target.value,
                          })
                        }
                        placeholder="Enter hover image URL or upload file below"
                        disabled={submitting}
                      />
                      <div className="flex items-center space-x-2">
                        <Input
                          ref={hoverFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, "hover");
                            }
                          }}
                          className="hidden"
                          disabled={submitting}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => hoverFileInputRef.current?.click()}
                          disabled={submitting || uploading}
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          {uploading ? "Uploading..." : "Upload Hover Image"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

              <div>
                <Label htmlFor="cover_page_url">Cover Page Image</Label>
                <div className="space-y-2">
                  <Input
                    id="cover_page_url"
                    value={formData.cover_page_url}
                    onChange={(e) =>
                      setFormData({ ...formData, cover_page_url: e.target.value })
                    }
                    placeholder="Enter cover image URL or upload file below"
                    disabled={submitting}
                  />
                  <div className="flex items-center space-x-2">
                    <Input
                      ref={coverPageFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, "cover");
                        }
                      }}
                      className="hidden"
                      disabled={submitting}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => coverPageFileInputRef.current?.click()}
                      disabled={submitting || uploading}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {uploading ? "Uploading..." : "Upload Cover Image"}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Optional: Add a cover image that will display at the top of
                  the book detail page (LinkedIn-style)
                </p>
              </div>

              <div>
                <Label htmlFor="video_url">YouTube Video URL</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) =>
                    setFormData({ ...formData, video_url: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  disabled={submitting}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Optional: Add a YouTube video that will be displayed above the
                  characters section
                </p>
              </div>

              {/* Characters Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <Label className="text-lg font-semibold">Characters</Label>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCharacterForm(true)}
                    disabled={submitting}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Character
                  </Button>
                </div>

                {characters.length > 0 && (
                  <div className="grid gap-2">
                    {characters.map((character) => {
                      const mainImage =
                        character.images?.find((img) => img.is_main) ||
                        character.images?.[0];
                      const imageCount = character.images?.length || 0;

                      return (
                        <div
                          key={character.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {mainImage?.image_url || character.image_url ? (
                              <div className="relative">
                                <img
                                  src={
                                    mainImage?.image_url || character.image_url
                                  }
                                  alt={character.name}
                                  className="w-10 h-10 rounded object-cover"
                                />
                                {imageCount > 1 && (
                                  <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {imageCount}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                                <User className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{character.name}</p>
                              <p className="text-sm text-muted-foreground capitalize">
                                {character.role}
                                {imageCount > 0 && (
                                  <span className="ml-2 text-xs bg-primary/10 text-primary px-1 rounded">
                                    {imageCount} image
                                    {imageCount !== 1 ? "s" : ""}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCharacter(character)}
                              disabled={submitting}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleRemoveCharacter(character.id)
                              }
                              disabled={submitting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {showCharacterForm && (
                  <Card className="border-2 border-blue-200">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">
                          {editingCharacterId
                            ? "Edit Character"
                            : "Add Character"}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowCharacterForm(false);
                            setEditingCharacterId(null);
                            setCharacterForm({
                              name: "",
                              description: "",
                              role: "main",
                              display_order: 0,
                              images: [],
                            });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="character_name">Name *</Label>
                          <Input
                            id="character_name"
                            value={characterForm.name}
                            onChange={(e) =>
                              setCharacterForm({
                                ...characterForm,
                                name: e.target.value,
                              })
                            }
                            disabled={submitting}
                          />
                        </div>

                        <div>
                          <Label htmlFor="character_role">Role</Label>
                          <Select
                            value={characterForm.role}
                            onValueChange={(value) =>
                              setCharacterForm({
                                ...characterForm,
                                role: value,
                              })
                            }
                            disabled={submitting}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="main">
                                Main Character
                              </SelectItem>
                              <SelectItem value="supporting">
                                Supporting Character
                              </SelectItem>
                              <SelectItem value="antagonist">
                                Antagonist
                              </SelectItem>
                              <SelectItem value="side">
                                Side Character
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="character_description">
                          Description
                        </Label>
                        <Textarea
                          id="character_description"
                          value={characterForm.description}
                          onChange={(e) =>
                            setCharacterForm({
                              ...characterForm,
                              description: e.target.value,
                            })
                          }
                          disabled={submitting}
                          rows={3}
                        />
                      </div>

                      <div>
                        <CharacterImageManager
                          images={characterForm.images}
                          onImagesChange={(images) =>
                            setCharacterForm({ ...characterForm, images })
                          }
                          disabled={submitting}
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowCharacterForm(false);
                            setEditingCharacterId(null);
                            setCharacterForm({
                              name: "",
                              description: "",
                              role: "main",
                              display_order: 0,
                              images: [],
                            });
                          }}
                          disabled={submitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={handleSubmitCharacter}
                          disabled={submitting}
                        >
                          {editingCharacterId
                            ? "Update Character"
                            : "Add Character"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Volume Management Section */}
              {editingId &&
                !books.find((b) => b.id === editingId)?.is_volume && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookCopy className="h-5 w-5 text-primary" />
                        <Label className="text-lg font-semibold">
                          Volume Management
                        </Label>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddVolume}
                        disabled={submitting}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Volume
                      </Button>
                    </div>

                    {volumes.length > 0 && (
                      <div className="grid gap-2">
                        {volumes.map((volume) => (
                          <div
                            key={volume.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={volume.image_url}
                                alt={volume.title}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div>
                                <p className="font-medium">
                                  {volume.title} • Vol.{volume.volume_number}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  ${volume.price} • Stock:{" "}
                                  {volume.stock_quantity}
                                  {volume.is_new && (
                                    <span className="ml-2 text-green-600">
                                      NEW
                                    </span>
                                  )}
                                  {volume.is_on_sale && (
                                    <span className="ml-2 text-red-600">
                                      ON SALE
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedVolumeForPages({
                                  id: volume.id,
                                  title: volume.title
                                })}
                                disabled={submitting}
                                title="Manage Pages"
                              >
                                <BookOpen className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditVolume(volume)}
                                disabled={submitting}
                                title="Edit Volume"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveVolume(volume.id)}
                                disabled={submitting}
                                title="Delete Volume"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {showVolumeForm && (
                      <Card className="border-2 border-green-200">
                        <CardContent className="p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">
                              {editingVolumeId ? "Edit Volume" : "Add Volume"}
                            </h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowVolumeForm(false)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="volume_number">
                                Volume Number *
                              </Label>
                              <Input
                                id="volume_number"
                                type="number"
                                min="1"
                                value={volumeForm.volume_number}
                                onChange={(e) =>
                                  setVolumeForm({
                                    ...volumeForm,
                                    volume_number:
                                      parseInt(e.target.value) || 1,
                                  })
                                }
                                disabled={submitting}
                              />
                            </div>

                            <div>
                              <Label htmlFor="volume_price">Price *</Label>
                              <Input
                                id="volume_price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={volumeForm.price}
                                onChange={(e) =>
                                  setVolumeForm({
                                    ...volumeForm,
                                    price: parseFloat(e.target.value) || 0,
                                  })
                                }
                                disabled={submitting}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="volume_original_price">
                                Original Price
                              </Label>
                              <Input
                                id="volume_original_price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={volumeForm.original_price || ""}
                                onChange={(e) =>
                                  setVolumeForm({
                                    ...volumeForm,
                                    original_price: e.target.value
                                      ? parseFloat(e.target.value)
                                      : undefined,
                                  })
                                }
                                disabled={submitting}
                              />
                            </div>

                            <div>
                              <Label htmlFor="volume_stock">
                                Stock Quantity
                              </Label>
                              <Input
                                id="volume_stock"
                                type="number"
                                min="0"
                                value={volumeForm.stock_quantity}
                                onChange={(e) =>
                                  setVolumeForm({
                                    ...volumeForm,
                                    stock_quantity:
                                      parseInt(e.target.value) || 0,
                                  })
                                }
                                disabled={submitting}
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="volume_label">
                              Label (e.g., "Pre-Order")
                            </Label>
                            <Input
                              id="volume_label"
                              value={volumeForm.label || ""}
                              onChange={(e) =>
                                setVolumeForm({
                                  ...volumeForm,
                                  label: e.target.value,
                                })
                              }
                              disabled={submitting}
                            />
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="volume_is_new"
                                checked={volumeForm.is_new}
                                onCheckedChange={(checked) =>
                                  setVolumeForm({
                                    ...volumeForm,
                                    is_new: checked,
                                  })
                                }
                                disabled={submitting}
                              />
                              <Label htmlFor="volume_is_new">New</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Switch
                                id="volume_is_on_sale"
                                checked={volumeForm.is_on_sale}
                                onCheckedChange={(checked) =>
                                  setVolumeForm({
                                    ...volumeForm,
                                    is_on_sale: checked,
                                  })
                                }
                                disabled={submitting}
                              />
                              <Label htmlFor="volume_is_on_sale">On Sale</Label>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="volume_image_url">Volume Cover Image</Label>
                            <div className="space-y-2">
                              <Input
                                id="volume_image_url"
                                value={volumeForm.image_url || ""}
                                onChange={(e) =>
                                  setVolumeForm({
                                    ...volumeForm,
                                    image_url: e.target.value,
                                  })
                                }
                                placeholder="Enter image URL or upload file below"
                                disabled={submitting}
                              />
                              <div className="flex items-center space-x-2">
                                <Input
                                  id="volume_file_upload"
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      try {
                                        setUploading(true);
                                        const fileExt = file.name.split('.').pop();
                                        const fileName = `volume_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
                                        const filePath = `book-images/${fileName}`;
                                        
                                        const { data: uploadData, error: uploadError } = await supabase.storage
                                          .from('comic-pages')
                                          .upload(filePath, file);
                                        
                                        if (uploadError) throw uploadError;

                                        const { data: urlData } = supabase.storage
                                          .from('comic-pages')
                                          .getPublicUrl(filePath);

                                        setVolumeForm(prev => ({ ...prev, image_url: urlData.publicUrl }));
                                        
                                        toast({
                                          title: "Image uploaded",
                                          description: "Volume cover image uploaded successfully",
                                        });
                                      } catch (error) {
                                        console.error('Volume image upload error:', error);
                                        toast({
                                          title: "Upload failed",
                                          description: "Failed to upload volume image",
                                          variant: "destructive",
                                        });
                                      } finally {
                                        setUploading(false);
                                      }
                                    }
                                  }}
                                  className="hidden"
                                  disabled={submitting || uploading}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const input = document.getElementById('volume_file_upload') as HTMLInputElement;
                                    input?.click();
                                  }}
                                  disabled={submitting || uploading}
                                  className="flex items-center gap-2"
                                >
                                  <Upload className="h-4 w-4" />
                                  {uploading ? "Uploading..." : "Upload Image"}
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Optional: Upload a custom cover image for this volume
                            </p>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setShowVolumeForm(false);
                                setEditingVolumeId(null);
                              }}
                              disabled={submitting}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              onClick={handleSubmitVolume}
                              disabled={submitting}
                            >
                              {editingVolumeId ? "Update Volume" : "Add Volume"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_new"
                    checked={formData.is_new}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_new: checked })
                    }
                    disabled={submitting}
                  />
                  <Label htmlFor="is_new">New</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_on_sale"
                    checked={formData.is_on_sale}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_on_sale: checked })
                    }
                    disabled={submitting}
                  />
                  <Label htmlFor="is_on_sale">On Sale</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked })
                    }
                    disabled={submitting}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_popular_recommendation"
                    checked={formData.is_popular_recommendation}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_popular_recommendation: checked })
                    }
                    disabled={submitting}
                  />
                  <Label htmlFor="is_popular_recommendation">Popular Recommendation</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    resetFormData();
                    setShowAddForm(false);
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {editingId ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {editingId ? "Update Book" : "Create Book"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Volume Pages Manager Modal */}
      {selectedVolumeForPages && (
        <VolumePagesManager
          volumeId={selectedVolumeForPages.id}
          volumeTitle={selectedVolumeForPages.title}
          onClose={() => setSelectedVolumeForPages(null)}
        />
      )}
    </div>
  );
};
