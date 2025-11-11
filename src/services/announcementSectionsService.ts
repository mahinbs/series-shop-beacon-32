import { supabase } from '@/integrations/supabase/client';

export interface EventCalendarItem {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  event_type: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ReleaseScheduleItem {
  id: string;
  title: string;
  description: string | null;
  release_date: string;
  series_name: string | null;
  volume_number: number | null;
  release_type: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  event_type?: string;
  display_order?: number;
}

export interface CreateReleaseData {
  title: string;
  description?: string;
  release_date: string;
  series_name?: string;
  volume_number?: number;
  release_type?: string;
  display_order?: number;
}

export interface CreateFAQData {
  question: string;
  answer: string;
  category?: string;
  display_order?: number;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  is_active?: boolean;
}

export interface UpdateReleaseData extends Partial<CreateReleaseData> {
  is_active?: boolean;
}

export interface UpdateFAQData extends Partial<CreateFAQData> {
  is_active?: boolean;
}

class AnnouncementSectionsService {
  // Event Calendar Methods
  async getEvents(): Promise<EventCalendarItem[]> {
    try {
      console.log('🔧 Service: Fetching events from Supabase...');
      const { data, error } = await supabase
        .from('event_calendar' as any)
        .select('*')
        .eq('is_active', true)
        .order('event_date', { ascending: true });

      if (error) {
        console.error('❌ Service: Error fetching events:', error);
        return [];
      }

      console.log('✅ Service: Events fetched successfully:', data);
      return (data as unknown as EventCalendarItem[]) || [];
    } catch (error) {
      console.error('💥 Service: Exception fetching events:', error);
      return [];
    }
  }

  async createEvent(data: CreateEventData): Promise<EventCalendarItem | null> {
    try {
      const { data: result, error } = await supabase
        .from('event_calendar' as any)
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        return null;
      }

      return result as unknown as EventCalendarItem;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  }

  async updateEvent(id: string, data: UpdateEventData): Promise<EventCalendarItem | null> {
    try {
      const { data: result, error } = await supabase
        .from('event_calendar' as any)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating event:', error);
        return null;
      }

      return result as unknown as EventCalendarItem;
    } catch (error) {
      console.error('Error updating event:', error);
      return null;
    }
  }

  async deleteEvent(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('event_calendar' as any)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting event:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  }

  // Release Schedule Methods
  async getReleases(): Promise<ReleaseScheduleItem[]> {
    try {
      const { data, error } = await supabase
        .from('release_schedule' as any)
        .select('*')
        .eq('is_active', true)
        .order('release_date', { ascending: true });

      if (error) {
        console.error('Error fetching releases:', error);
        return [];
      }

      return (data as unknown as ReleaseScheduleItem[]) || [];
    } catch (error) {
      console.error('Error fetching releases:', error);
      return [];
    }
  }

  async createRelease(data: CreateReleaseData): Promise<ReleaseScheduleItem | null> {
    try {
      const { data: result, error } = await supabase
        .from('release_schedule' as any)
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('Error creating release:', error);
        return null;
      }

      return result as unknown as ReleaseScheduleItem;
    } catch (error) {
      console.error('Error creating release:', error);
      return null;
    }
  }

  async updateRelease(id: string, data: UpdateReleaseData): Promise<ReleaseScheduleItem | null> {
    try {
      const { data: result, error } = await supabase
        .from('release_schedule' as any)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating release:', error);
        return null;
      }

      return result as unknown as ReleaseScheduleItem;
    } catch (error) {
      console.error('Error updating release:', error);
      return null;
    }
  }

  async deleteRelease(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('release_schedule' as any)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting release:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting release:', error);
      return false;
    }
  }

  // FAQ Methods
  async getFAQs(): Promise<FAQItem[]> {
    try {
      const { data, error } = await supabase
        .from('faq_items' as any)
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching FAQs:', error);
        return [];
      }

      return (data as unknown as FAQItem[]) || [];
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }
  }

  async createFAQ(data: CreateFAQData): Promise<FAQItem | null> {
    try {
      const { data: result, error } = await supabase
        .from('faq_items' as any)
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('Error creating FAQ:', error);
        return null;
      }

      return result as unknown as FAQItem;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      return null;
    }
  }

  async updateFAQ(id: string, data: UpdateFAQData): Promise<FAQItem | null> {
    try {
      const { data: result, error } = await supabase
        .from('faq_items' as any)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating FAQ:', error);
        return null;
      }

      return result as unknown as FAQItem;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      return null;
    }
  }

  async deleteFAQ(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('faq_items' as any)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting FAQ:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      return false;
    }
  }
}

export const announcementSectionsService = new AnnouncementSectionsService();