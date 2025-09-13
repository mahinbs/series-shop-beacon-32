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
      
      // For local storage auth users, skip Supabase loading
      if (user && user.id && user.id.startsWith('local-')) {
        setAnnouncements([]);
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setAnnouncements((data || []) as unknown as Announcement[]);
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