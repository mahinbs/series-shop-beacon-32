import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  full_description: string;
  date_info: string;
  image_url: string;
  status: string;
  features: string[];
  badge_type?: 'hot' | 'new' | 'limited';
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useSupabaseAuth();

  useEffect(() => {
    loadAnnouncements();
    
    // Disable real-time subscription to prevent WebSocket errors
    // Real-time updates are not critical for the application functionality
    let channel: any = null;
    // Commented out to prevent WebSocket connection errors
    /*
    if (!user || !user.id || !user.id.startsWith('local-')) {
      channel = supabase
        .channel('announcements_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'announcements'
          },
          (payload) => {
            if (payload.eventType === 'INSERT' && payload.new.is_active) {
              setAnnouncements(prev => [...prev, payload.new as Announcement].sort((a, b) => a.display_order - b.display_order));
            } else if (payload.eventType === 'UPDATE') {
              if (payload.new.is_active) {
                setAnnouncements(prev => 
                  prev.map(announcement => 
                    announcement.id === payload.new.id ? payload.new as Announcement : announcement
                  ).sort((a, b) => a.display_order - b.display_order)
                );
              } else {
                // If announcement becomes inactive, remove it
                setAnnouncements(prev => 
                  prev.filter(announcement => announcement.id !== payload.new.id)
                );
              }
            } else if (payload.eventType === 'DELETE') {
              setAnnouncements(prev => 
                prev.filter(announcement => announcement.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();
    }
    */

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user]);

  const loadAnnouncements = async () => {
    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error loading announcements:', error);
        // If there's an error, try to provide fallback data
        setAnnouncements([]);
        return;
      }

      // Transform data to ensure all required fields exist
      const transformedData = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title || 'Untitled Announcement',
        description: item.description || item.content || 'No description available',
        full_description: item.full_description || item.description || item.content || 'No detailed description available',
        date_info: item.date_info || 'Available Now',
        image_url: item.image_url || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        status: item.status || 'Available',
        features: item.features || ['Great content', 'High quality', 'Exclusive access'],
        badge_type: item.badge_type || 'new',
        display_order: item.display_order || 0,
        is_active: item.is_active !== false,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setAnnouncements(transformedData as Announcement[]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load announcements');
      console.error('Error loading announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .insert([announcement as any]);

      if (error) throw error;
      await loadAnnouncements();
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await loadAnnouncements();
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  };

  return {
    announcements,
    isLoading,
    error,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    loadAnnouncements,
  };
};