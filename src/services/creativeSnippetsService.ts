import { supabase } from '@/integrations/supabase/client';

export interface CreativeSnippetItem {
  id: string;
  title: string;
  description: string;
  volume_chapter: string | null;
  background_image_url: string | null;
  video_url: string | null;
  video_file_path: string | null;
  series_name: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreativeSnippetsSection {
  id: string;
  title: string;
  subtitle: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const creativeSnippetsService = {
  // Section management
  async getSection(): Promise<CreativeSnippetsSection | null> {
    const { data, error } = await supabase
      .from('creative_snippets_section')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching Creative Snippets section:', error);
      return null;
    }
    
    return data;
  },

  async updateSection(section: { title: string; subtitle: string }): Promise<CreativeSnippetsSection | null> {
    const { data, error } = await supabase
      .from('creative_snippets_section')
      .update(section)
      .eq('id', (await this.getSection())?.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating Creative Snippets section:', error);
      throw error;
    }
    
    return data;
  },

  // Items management
  async getItems(): Promise<CreativeSnippetItem[]> {
    console.log('Fetching creative snippets items from database...');
    try {
      const { data, error } = await supabase
        .from('creative_snippets_items')
        .select('*')
        .order('display_order', { ascending: true });
      
      console.log('Raw database response:', { data, error });
      
      if (error) {
        console.error('Error fetching Creative Snippets items:', error);
        return [];
      }
      
      console.log('Returning items:', data || []);
      return data || [];
    } catch (exception) {
      console.error('Exception in getItems:', exception);
      return [];
    }
  },

  async createItem(item: Omit<CreativeSnippetItem, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<CreativeSnippetItem | null> {
    const { data, error } = await supabase
      .from('creative_snippets_items')
      .insert(item)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating creative snippet item:', error);
      throw error;
    }
    
    return data;
  },

  async updateItem(id: string, item: Partial<Omit<CreativeSnippetItem, 'id' | 'created_at' | 'updated_at'>>): Promise<CreativeSnippetItem | null> {
    const { data, error } = await supabase
      .from('creative_snippets_items')
      .update(item)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating creative snippet item:', error);
      throw error;
    }
    
    return data;
  },

  async deleteItem(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('creative_snippets_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting creative snippet item:', error);
      throw error;
    }
    
    return true;
  },

  // Video upload helper
  async uploadVideo(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `creative-snippets/videos/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, file);
    
    if (uploadError) {
      throw uploadError;
    }
    
    const { data } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  },

  // Image upload helper
  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `creative-snippets/images/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);
    
    if (uploadError) {
      throw uploadError;
    }
    
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }
};
