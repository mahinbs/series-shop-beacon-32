import { supabase } from '@/integrations/supabase/client';

export interface Retailer {
  id: string;
  name: string;
  website_url?: string;
  logo_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BookRetailer {
  id: string;
  book_id: string;
  retailer_id: string;
  format_type: 'digital' | 'paperback' | 'hardcover';
  url?: string;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  retailer?: Retailer;
}

export const RetailerService = {
  // Get all active retailers
  async getRetailers(): Promise<Retailer[]> {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching retailers:', error);
      throw error;
    }
  },

  // Get retailers for a specific book and format
  async getBookRetailers(bookId: string, formatType?: string): Promise<BookRetailer[]> {
    try {
      let query = supabase
        .from('book_retailers')
        .select(`
          *,
          retailer:retailers(*)
        `)
        .eq('book_id', bookId)
        .eq('is_available', true)
        .order('display_order', { ascending: true });

      if (formatType) {
        query = query.eq('format_type', formatType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching book retailers:', error);
      throw error;
    }
  },

  // Add retailer to book
  async addBookRetailer(bookId: string, retailerId: string, formatType: string, url?: string): Promise<BookRetailer> {
    try {
      const { data, error } = await supabase
        .from('book_retailers')
        .insert({
          book_id: bookId,
          retailer_id: retailerId,
          format_type: formatType,
          url: url,
          is_available: true,
          display_order: 0
        })
        .select(`
          *,
          retailer:retailers(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding book retailer:', error);
      throw error;
    }
  },

  // Update book retailer
  async updateBookRetailer(id: string, updates: Partial<BookRetailer>): Promise<BookRetailer> {
    try {
      const { data, error } = await supabase
        .from('book_retailers')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          retailer:retailers(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating book retailer:', error);
      throw error;
    }
  },

  // Remove retailer from book
  async removeBookRetailer(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('book_retailers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing book retailer:', error);
      throw error;
    }
  },

  // Create new retailer
  async createRetailer(retailer: Omit<Retailer, 'id' | 'created_at' | 'updated_at'>): Promise<Retailer> {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .insert(retailer)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating retailer:', error);
      throw error;
    }
  },

  // Update retailer
  async updateRetailer(id: string, updates: Partial<Retailer>): Promise<Retailer> {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating retailer:', error);
      throw error;
    }
  },

  // Delete retailer
  async deleteRetailer(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('retailers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting retailer:', error);
      throw error;
    }
  }
};
