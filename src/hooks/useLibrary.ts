import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/hooks/use-toast';

export interface LibraryItem {
  id: string;
  series_id: string;
  created_at: string;
}

export const useLibrary = () => {
  const { user, isAuthenticated } = useSupabaseAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      if (!isAuthenticated || !user) {
        setItems([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_library')
        .select('id, series_id, created_at')
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to load library', error);
      }
      setItems((data as any) || []);
      setIsLoading(false);
    };
    load();
  }, [isAuthenticated, user]);

  const followSeries = async (seriesId: string) => {
    if (!isAuthenticated || !user) {
      toast({ title: 'Login required', description: 'Sign in to add to your library', variant: 'destructive' });
      return;
    }
    // Validate UUID format to prevent 400 errors from Supabase
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(seriesId);
    if (!isUuid) {
      console.warn('followSeries called with non-UUID seriesId:', seriesId);
      toast({ title: 'Unavailable', description: 'This series cannot be added (demo content).', variant: 'destructive' });
      return;
    }
    const { data, error } = await supabase
      .from('user_library')
      .insert({ user_id: user.id, series_id: seriesId })
      .select('id, series_id, created_at')
      .single();
    if (error) {
      console.error('Failed to follow series', error);
      toast({ title: 'Error', description: 'Could not add to library', variant: 'destructive' });
      return;
    }
    setItems(prev => [...prev, data as any]);
    toast({ title: 'Added', description: 'Series added to your library' });
  };

  const unfollowSeries = async (seriesId: string) => {
    if (!isAuthenticated || !user) return;
    const { error } = await supabase
      .from('user_library')
      .delete()
      .eq('user_id', user.id)
      .eq('series_id', seriesId);
    if (error) {
      console.error('Failed to remove from library', error);
      toast({ title: 'Error', description: 'Could not remove from library', variant: 'destructive' });
      return;
    }
    setItems(prev => prev.filter(i => i.series_id !== seriesId));
    toast({ title: 'Removed', description: 'Series removed from your library' });
  };

  const isInLibrary = (seriesId: string) => items.some(i => i.series_id === seriesId);

  return { items, isLoading, followSeries, unfollowSeries, isInLibrary };
};


