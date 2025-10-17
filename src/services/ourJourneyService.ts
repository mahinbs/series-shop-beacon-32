import { supabase } from '@/integrations/supabase/client';

export interface OurJourneyTimelineItem {
  id: string;
  year: number;
  header: string;
  description: string;
  left_image_url: string | null;
  right_image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OurJourneySection {
  id: string;
  title: string;
  subtitle: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTimelineItemData {
  year: number;
  header: string;
  description: string;
  left_image_url?: string;
  right_image_url?: string;
  display_order?: number;
}

export interface UpdateTimelineItemData extends Partial<CreateTimelineItemData> {
  is_active?: boolean;
}

export interface UpdateSectionData {
  title?: string;
  subtitle?: string;
  is_active?: boolean;
}

class OurJourneyService {
  // Get section settings
  async getSection(): Promise<OurJourneySection | null> {
    try {
      const { data, error } = await supabase
        .from('our_journey_section')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching our journey section:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching our journey section:', error);
      return null;
    }
  }

  // Update section settings
  async updateSection(data: UpdateSectionData): Promise<OurJourneySection | null> {
    try {
      const { data: result, error } = await supabase
        .from('our_journey_section')
        .update(data)
        .eq('is_active', true)
        .select()
        .single();

      if (error) {
        console.error('Error updating our journey section:', error);
        return null;
      }

      return result;
    } catch (error) {
      console.error('Error updating our journey section:', error);
      return null;
    }
  }

  // Get all timeline items
  async getTimelineItems(): Promise<OurJourneyTimelineItem[]> {
    try {
      const { data, error } = await supabase
        .from('our_journey_timeline')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('year', { ascending: true });

      if (error) {
        console.error('Error fetching timeline items:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching timeline items:', error);
      return [];
    }
  }

  // Create new timeline item
  async createTimelineItem(data: CreateTimelineItemData): Promise<OurJourneyTimelineItem | null> {
    try {
      const { data: result, error } = await supabase
        .from('our_journey_timeline')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('Error creating timeline item:', error);
        return null;
      }

      return result;
    } catch (error) {
      console.error('Error creating timeline item:', error);
      return null;
    }
  }

  // Update timeline item
  async updateTimelineItem(id: string, data: UpdateTimelineItemData): Promise<OurJourneyTimelineItem | null> {
    try {
      console.log('🔧 Service: Updating timeline item with ID:', id);
      console.log('📤 Service: Update data:', data);
      
      const { data: result, error } = await supabase
        .from('our_journey_timeline')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Service: Error updating timeline item:', error);
        return null;
      }

      console.log('✅ Service: Update successful, result:', result);
      return result;
    } catch (error) {
      console.error('💥 Service: Exception updating timeline item:', error);
      return null;
    }
  }

  // Delete timeline item
  async deleteTimelineItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('our_journey_timeline')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting timeline item:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting timeline item:', error);
      return false;
    }
  }

  // Reorder timeline items
  async reorderTimelineItems(items: { id: string; display_order: number }[]): Promise<boolean> {
    try {
      const updates = items.map(item => 
        supabase
          .from('our_journey_timeline')
          .update({ display_order: item.display_order })
          .eq('id', item.id)
      );

      const results = await Promise.all(updates);
      const hasError = results.some(result => result.error);

      if (hasError) {
        console.error('Error reordering timeline items');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error reordering timeline items:', error);
      return false;
    }
  }
}

export const ourJourneyService = new OurJourneyService();
