import { supabase } from '@/integrations/supabase/client';

export interface BookChapter {
  id: string;
  book_id: string;
  chapter_number: number;
  chapter_title: string;
  chapter_description?: string;
  is_preview: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ChapterPage {
  id: string;
  chapter_id: string;
  page_number: number;
  page_url?: string;
  page_title?: string;
  page_description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class ChapterService {
  // Get all chapters for a book
  static async getBookChapters(bookId: string): Promise<BookChapter[]> {
    try {
      const { data, error } = await supabase
        .from('book_chapters')
        .select('*')
        .eq('book_id', bookId)
        .eq('is_active', true)
        .order('chapter_number', { ascending: true });

      if (error) {
        console.error('Error fetching book chapters:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('ChapterService.getBookChapters error:', error);
      throw error;
    }
  }

  // Get a specific chapter by ID
  static async getChapterById(chapterId: string): Promise<BookChapter | null> {
    try {
      const { data, error } = await supabase
        .from('book_chapters')
        .select('*')
        .eq('id', chapterId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching chapter:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('ChapterService.getChapterById error:', error);
      return null;
    }
  }

  // Create a new chapter
  static async createChapter(chapter: Omit<BookChapter, 'id' | 'created_at' | 'updated_at'>): Promise<BookChapter> {
    try {
      const { data, error } = await supabase
        .from('book_chapters')
        .insert([chapter])
        .select()
        .single();

      if (error) {
        console.error('Error creating chapter:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('ChapterService.createChapter error:', error);
      throw error;
    }
  }

  // Update a chapter
  static async updateChapter(chapterId: string, updates: Partial<BookChapter>): Promise<BookChapter> {
    try {
      const { data, error } = await supabase
        .from('book_chapters')
        .update(updates)
        .eq('id', chapterId)
        .select()
        .single();

      if (error) {
        console.error('Error updating chapter:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('ChapterService.updateChapter error:', error);
      throw error;
    }
  }

  // Delete a chapter
  static async deleteChapter(chapterId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('book_chapters')
        .delete()
        .eq('id', chapterId);

      if (error) {
        console.error('Error deleting chapter:', error);
        throw error;
      }
    } catch (error) {
      console.error('ChapterService.deleteChapter error:', error);
      throw error;
    }
  }

  // Get all pages for a chapter
  static async getChapterPages(chapterId: string): Promise<ChapterPage[]> {
    try {
      const { data, error } = await supabase
        .from('book_chapter_pages')
        .select('*')
        .eq('chapter_id', chapterId)
        .eq('is_active', true)
        .order('page_number', { ascending: true });

      if (error) {
        console.error('Error fetching chapter pages:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('ChapterService.getChapterPages error:', error);
      throw error;
    }
  }

  // Create a new chapter page
  static async createChapterPage(page: Omit<ChapterPage, 'id' | 'created_at' | 'updated_at'>): Promise<ChapterPage> {
    try {
      const { data, error } = await supabase
        .from('book_chapter_pages')
        .insert([page])
        .select()
        .single();

      if (error) {
        console.error('Error creating chapter page:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('ChapterService.createChapterPage error:', error);
      throw error;
    }
  }

  // Update a chapter page
  static async updateChapterPage(pageId: string, updates: Partial<ChapterPage>): Promise<ChapterPage> {
    try {
      const { data, error } = await supabase
        .from('book_chapter_pages')
        .update(updates)
        .eq('id', pageId)
        .select()
        .single();

      if (error) {
        console.error('Error updating chapter page:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('ChapterService.updateChapterPage error:', error);
      throw error;
    }
  }

  // Delete a chapter page
  static async deleteChapterPage(pageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('book_chapter_pages')
        .delete()
        .eq('id', pageId);

      if (error) {
        console.error('Error deleting chapter page:', error);
        throw error;
      }
    } catch (error) {
      console.error('ChapterService.deleteChapterPage error:', error);
      throw error;
    }
  }
}
