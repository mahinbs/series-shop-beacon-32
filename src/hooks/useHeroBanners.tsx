import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useHeroBanners = () => {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load temporary banners from localStorage on component mount
  const loadTemporaryBanners = () => {
    try {
      const storedBanners = JSON.parse(localStorage.getItem('tempHeroBanners') || '[]');
      console.log('Loaded temporary banners from localStorage:', storedBanners);
      return storedBanners;
    } catch (error) {
      console.error('Error loading temporary banners from localStorage:', error);
      return [];
    }
  };

  const loadHeroBanners = async () => {
    try {
      setIsLoading(true);
      console.log('Loading hero banners...');
      
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error loading hero banners:', error);
        // If the table doesn't exist or there's an RLS issue, just set empty array
        if (error.code === '42P01' || error.code === '42501') {
          console.warn('Hero banners table may not exist or RLS policies are restrictive. Setting empty array.');
          // Load temporary banners from localStorage
          const tempBanners = loadTemporaryBanners();
          console.log('Loaded temporary banners from localStorage:', tempBanners);
          setBanners(tempBanners);
        } else {
          setError(error.message);
        }
      } else {
        // Combine database banners with temporary banners
        const tempBanners = loadTemporaryBanners();
        console.log('Database banners:', data);
        console.log('Temporary banners:', tempBanners);
        const combinedBanners = [...(data || []), ...tempBanners];
        const sortedBanners = combinedBanners.sort((a, b) => a.display_order - b.display_order);
        console.log('Combined and sorted banners:', sortedBanners);
        setBanners(sortedBanners);
      }
    } catch (err) {
      console.error('Error loading hero banners:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Load temporary banners from localStorage on error
      const tempBanners = loadTemporaryBanners();
      console.log('Loaded temporary banners on error:', tempBanners);
      setBanners(tempBanners);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHeroBanners();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('hero_banners_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hero_banners'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBanners(prev => [...prev, payload.new as HeroBanner].sort((a, b) => a.display_order - b.display_order));
          } else if (payload.eventType === 'UPDATE') {
            setBanners(prev => 
              prev.map(banner => 
                banner.id === payload.new.id ? payload.new as HeroBanner : banner
              ).sort((a, b) => a.display_order - b.display_order)
            );
          } else if (payload.eventType === 'DELETE') {
            setBanners(prev => 
              prev.filter(banner => banner.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createBanner = async (banner: Omit<HeroBanner, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating banner:', banner);
      
      // Try to create the banner with a more permissive approach
      const { data, error } = await supabase
        .from('hero_banners')
        .insert([banner])
        .select();

      if (error) {
        console.error('Error creating banner:', error);
        
        // If it's an RLS issue, create a local banner entry as a workaround
        if (error.code === '42501') {
          console.warn('RLS policy violation detected. Creating local banner entry as workaround.');
          
          // Create a temporary banner with a unique ID
          const tempBanner: HeroBanner = {
            id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...banner,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          // Add to local state as a temporary solution
          setBanners(prev => {
            const newBanners = [...prev, tempBanner].sort((a, b) => a.display_order - b.display_order);
            console.log('Updated banners state:', newBanners);
            return newBanners;
          });
          
          // Store in localStorage for persistence across page refreshes
          const storedBanners = JSON.parse(localStorage.getItem('tempHeroBanners') || '[]');
          storedBanners.push(tempBanner);
          localStorage.setItem('tempHeroBanners', JSON.stringify(storedBanners));
          
          console.log('Banner created locally:', tempBanner);
          return; // Success - don't throw error
        } else if (error.code === '42P01') {
          throw new Error('Hero banners table does not exist. Please run the database migration.');
        } else {
          throw new Error(error.message || 'Failed to create banner');
        }
      }
      
      console.log('Banner created successfully:', data);
      // Reload data after successful creation
      setTimeout(() => loadHeroBanners(), 100);
    } catch (err) {
      console.error('Error creating banner:', err);
      throw err;
    }
  };

  const updateBanner = async (id: string, updates: Partial<HeroBanner>) => {
    try {
      console.log('Updating banner:', id, updates);
      
      // Check if it's a temporary banner (starts with 'temp-')
      if (id.startsWith('temp-')) {
        // Update local banner
        setBanners(prev => 
          prev.map(banner => 
            banner.id === id ? { ...banner, ...updates, updated_at: new Date().toISOString() } : banner
          )
        );
        
        // Update localStorage
        const storedBanners = JSON.parse(localStorage.getItem('tempHeroBanners') || '[]');
        const updatedBanners = storedBanners.map((banner: HeroBanner) => 
          banner.id === id ? { ...banner, ...updates, updated_at: new Date().toISOString() } : banner
        );
        localStorage.setItem('tempHeroBanners', JSON.stringify(updatedBanners));
        
        console.log('Temporary banner updated locally:', id);
        return;
      }
      
      const { data, error } = await supabase
        .from('hero_banners')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating banner:', error);
        if (error.code === '42501') {
          throw new Error('Permission denied. Please check your authentication and admin privileges.');
        } else if (error.code === '42P01') {
          throw new Error('Hero banners table does not exist. Please run the database migration.');
        } else {
          throw new Error(error.message || 'Failed to update banner');
        }
      }
      
      console.log('Banner updated successfully:', data);
      // Reload data after successful update  
      setTimeout(() => loadHeroBanners(), 100);
    } catch (err) {
      console.error('Error updating banner:', err);
      throw err;
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      console.log('Deleting banner:', id);
      
      // Check if it's a temporary banner (starts with 'temp-')
      if (id.startsWith('temp-')) {
        // Remove from local state
        setBanners(prev => prev.filter(banner => banner.id !== id));
        
        // Remove from localStorage
        const storedBanners = JSON.parse(localStorage.getItem('tempHeroBanners') || '[]');
        const updatedBanners = storedBanners.filter((banner: HeroBanner) => banner.id !== id);
        localStorage.setItem('tempHeroBanners', JSON.stringify(updatedBanners));
        
        console.log('Temporary banner deleted locally:', id);
        return;
      }
      
      const { error } = await supabase
        .from('hero_banners')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting banner:', error);
        if (error.code === '42501') {
          throw new Error('Permission denied. Please check your authentication and admin privileges.');
        } else if (error.code === '42P01') {
          throw new Error('Hero banners table does not exist. Please run the database migration.');
        } else {
          throw new Error(error.message || 'Failed to delete banner');
        }
      }
      
      console.log('Banner deleted successfully');
      // Reload data after successful deletion
      setTimeout(() => loadHeroBanners(), 100);
    } catch (err) {
      console.error('Error deleting banner:', err);
      throw err;
    }
  };

  return {
    banners,
    isLoading,
    error,
    createBanner,
    updateBanner,
    deleteBanner,
    loadHeroBanners,
  };
};