import { supabase } from '@/integrations/supabase/client';

export interface BookCharacter {
  id: string;
  book_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  role: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images?: BookCharacterImage[];
}

export interface BookCharacterImage {
  id: string;
  character_id: string;
  image_url: string;
  is_main: boolean;
  display_order: number;
  alt_text: string | null;
  created_at: string;
  updated_at: string;
}

export class BookCharacterService {
  // Get characters for a specific book with their images
  static async getBookCharacters(bookId: string): Promise<BookCharacter[]> {
    try {
      console.log('🎭 BookCharacterService: Fetching characters for bookId:', bookId);
      
      const { data, error } = await (supabase as any)
        .from('book_characters')
        .select(`
          *,
          book_character_images (
            id,
            image_url,
            is_main,
            display_order,
            alt_text,
            created_at,
            updated_at
          )
        `)
        .eq('book_id', bookId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      console.log('🎭 BookCharacterService: Raw data from database:', data);
      console.log('🎭 BookCharacterService: Error from database:', error);

      if (error) {
        console.error('🎭 BookCharacterService: Error fetching book characters:', error);
        return [];
      }

      const result = (data as any[])?.map(character => ({
        ...character,
        images: character.book_character_images?.sort((a: BookCharacterImage, b: BookCharacterImage) => {
          if (a.is_main && !b.is_main) return -1;
          if (!a.is_main && b.is_main) return 1;
          return a.display_order - b.display_order;
        }) || []
      })) || [];
      
      console.log('🎭 BookCharacterService: Processed result:', result);
      return result;
    } catch (error) {
      console.error('🎭 BookCharacterService: Error in getBookCharacters:', error);
      return [];
    }
  }

  // Create a new character for a book
  static async createBookCharacter(characterData: Omit<BookCharacter, 'id' | 'created_at' | 'updated_at'>): Promise<BookCharacter> {
    try {
      const { data, error } = await (supabase as any)
        .from('book_characters')
        .insert([characterData])
        .select()
        .single();

      if (error) {
        console.error('Error creating book character:', error);
        throw new Error(`Failed to create character: ${error.message}`);
      }

      return data as BookCharacter;
    } catch (error) {
      console.error('Error in createBookCharacter:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create character');
    }
  }

  // Update a character
  static async updateBookCharacter(id: string, characterData: Partial<BookCharacter>): Promise<BookCharacter> {
    try {
      const { data, error } = await (supabase as any)
        .from('book_characters')
        .update(characterData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating book character:', error);
        throw new Error(`Failed to update character: ${error.message}`);
      }

      return data as BookCharacter;
    } catch (error) {
      console.error('Error in updateBookCharacter:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update character');
    }
  }

  // Delete a character
  static async deleteBookCharacter(id: string): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('book_characters')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting book character:', error);
        throw new Error(`Failed to delete character: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error in deleteBookCharacter:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to delete character');
    }
  }

  // Get all characters (for admin view)
  static async getAllCharacters(): Promise<BookCharacter[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('book_characters')
        .select(`
          *,
          books (
            title
          ),
          book_character_images (
            id,
            image_url,
            is_main,
            display_order,
            alt_text,
            created_at,
            updated_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all characters:', error);
        return [];
      }

      return (data as any[])?.map(character => ({
        ...character,
        images: character.book_character_images?.sort((a: BookCharacterImage, b: BookCharacterImage) => {
          if (a.is_main && !b.is_main) return -1;
          if (!a.is_main && b.is_main) return 1;
          return a.display_order - b.display_order;
        }) || []
      })) || [];
    } catch (error) {
      console.error('Error in getAllCharacters:', error);
      return [];
    }
  }

  // Get character images
  static async getCharacterImages(characterId: string): Promise<BookCharacterImage[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('book_character_images')
        .select('*')
        .eq('character_id', characterId)
        .order([
          { column: 'is_main', ascending: false },
          { column: 'display_order', ascending: true }
        ]);

      if (error) {
        console.error('Error fetching character images:', error);
        return [];
      }

      return (data as BookCharacterImage[]) || [];
    } catch (error) {
      console.error('Error in getCharacterImages:', error);
      return [];
    }
  }

  // Add character image
  static async addCharacterImage(imageData: Omit<BookCharacterImage, 'id' | 'created_at' | 'updated_at'>): Promise<BookCharacterImage> {
    try {
      const { data, error } = await (supabase as any)
        .from('book_character_images')
        .insert([imageData])
        .select()
        .single();

      if (error) {
        console.error('Error adding character image:', error);
        throw new Error(`Failed to add character image: ${error.message}`);
      }

      return data as BookCharacterImage;
    } catch (error) {
      console.error('Error in addCharacterImage:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to add character image');
    }
  }

  // Update character image
  static async updateCharacterImage(imageId: string, imageData: Partial<BookCharacterImage>): Promise<BookCharacterImage> {
    try {
      const { data, error } = await (supabase as any)
        .from('book_character_images')
        .update(imageData)
        .eq('id', imageId)
        .select()
        .single();

      if (error) {
        console.error('Error updating character image:', error);
        throw new Error(`Failed to update character image: ${error.message}`);
      }

      return data as BookCharacterImage;
    } catch (error) {
      console.error('Error in updateCharacterImage:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update character image');
    }
  }

  // Delete character image
  static async deleteCharacterImage(imageId: string): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('book_character_images')
        .delete()
        .eq('id', imageId);

      if (error) {
        console.error('Error deleting character image:', error);
        throw new Error(`Failed to delete character image: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error in deleteCharacterImage:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to delete character image');
    }
  }

  // Set main image for character
  static async setMainImage(characterId: string, imageId: string): Promise<boolean> {
    try {
      // The database trigger will handle unsetting other main images
      const { error } = await (supabase as any)
        .from('book_character_images')
        .update({ is_main: true })
        .eq('id', imageId)
        .eq('character_id', characterId);

      if (error) {
        console.error('Error setting main character image:', error);
        throw new Error(`Failed to set main character image: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error in setMainImage:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to set main character image');
    }
  }
}