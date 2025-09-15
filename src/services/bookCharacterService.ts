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
}

export class BookCharacterService {
  // Get characters for a specific book
  static async getBookCharacters(bookId: string): Promise<BookCharacter[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('book_characters')
        .select('*')
        .eq('book_id', bookId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching book characters:', error);
        return [];
      }

      return (data as BookCharacter[]) || [];
    } catch (error) {
      console.error('Error in getBookCharacters:', error);
      return [];
    }
  }

  // Create a new character for a book
  static async createBookCharacter(characterData: Omit<BookCharacter, 'id' | 'created_at' | 'updated_at'>): Promise<BookCharacter | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('book_characters')
        .insert([characterData])
        .select()
        .single();

      if (error) {
        console.error('Error creating book character:', error);
        return null;
      }

      return data as BookCharacter;
    } catch (error) {
      console.error('Error in createBookCharacter:', error);
      return null;
    }
  }

  // Update a character
  static async updateBookCharacter(id: string, characterData: Partial<BookCharacter>): Promise<BookCharacter | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('book_characters')
        .update(characterData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating book character:', error);
        return null;
      }

      return data as BookCharacter;
    } catch (error) {
      console.error('Error in updateBookCharacter:', error);
      return null;
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
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteBookCharacter:', error);
      return false;
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
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all characters:', error);
        return [];
      }

      return (data as any[]) || [];
    } catch (error) {
      console.error('Error in getAllCharacters:', error);
      return [];
    }
  }
}