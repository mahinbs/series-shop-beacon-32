import { useState, useEffect } from 'react';
import { heroBannersService, type HeroBanner } from '@/services/database';

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
      setError(null);
      console.log('Loading hero banners...');
      
      const data = await heroBannersService.getActive();
      console.log('Database banners:', data);
      
      // Combine database banners with temporary banners
      const tempBanners = loadTemporaryBanners();
      console.log('Temporary banners:', tempBanners);
      const combinedBanners = [...data, ...tempBanners];
      const sortedBanners = combinedBanners.sort((a, b) => a.display_order - b.display_order);
      console.log('Combined and sorted banners:', sortedBanners);
      setBanners(sortedBanners);
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
  }, []);

  const createBanner = async (banner: Omit<HeroBanner, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating banner:', banner);
      
      // Try to create in database first
      try {
        const newBanner = await heroBannersService.create(banner);
        console.log('Banner created in database:', newBanner);
        
        // Update local state
        setBanners(prev => [...prev, newBanner].sort((a, b) => a.display_order - b.display_order));
        return newBanner;
      } catch (dbError) {
        console.warn('Database creation failed, using local storage:', dbError);
        
        // If database fails, create temporary banner
        const tempBanner: HeroBanner = {
          id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...banner,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Store in localStorage
        const existingBanners = loadTemporaryBanners();
        const updatedBanners = [...existingBanners, tempBanner];
        localStorage.setItem('tempHeroBanners', JSON.stringify(updatedBanners));
        
        // Update local state
        setBanners(prev => [...prev, tempBanner].sort((a, b) => a.display_order - b.display_order));
        
        return tempBanner;
      }
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  };

  const updateBanner = async (id: string, updates: Partial<HeroBanner>) => {
    try {
      console.log('Updating banner:', id, updates);
      
      // Check if it's a temporary banner
      if (id.startsWith('temp-')) {
        // Update temporary banner in localStorage
        const existingBanners = loadTemporaryBanners();
        const updatedBanners = existingBanners.map(banner => 
          banner.id === id ? { ...banner, ...updates, updated_at: new Date().toISOString() } : banner
        );
        localStorage.setItem('tempHeroBanners', JSON.stringify(updatedBanners));
        
        // Update local state
        setBanners(prev => 
          prev.map(banner => 
            banner.id === id ? { ...banner, ...updates, updated_at: new Date().toISOString() } : banner
          ).sort((a, b) => a.display_order - b.display_order)
        );
        
        return updatedBanners.find(banner => banner.id === id);
      } else {
        // Update in database
        const updatedBanner = await heroBannersService.update(id, updates);
        console.log('Banner updated in database:', updatedBanner);
        
        // Update local state
        setBanners(prev => 
          prev.map(banner => 
            banner.id === id ? updatedBanner : banner
          ).sort((a, b) => a.display_order - b.display_order)
        );
        
        return updatedBanner;
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      console.log('Deleting banner:', id);
      
      // Check if it's a temporary banner
      if (id.startsWith('temp-')) {
        // Remove from localStorage
        const existingBanners = loadTemporaryBanners();
        const updatedBanners = existingBanners.filter(banner => banner.id !== id);
        localStorage.setItem('tempHeroBanners', JSON.stringify(updatedBanners));
        
        // Update local state
        setBanners(prev => prev.filter(banner => banner.id !== id));
      } else {
        // Delete from database
        await heroBannersService.delete(id);
        console.log('Banner deleted from database:', id);
        
        // Update local state
        setBanners(prev => prev.filter(banner => banner.id !== id));
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
  };

  const clearTemporaryBanners = () => {
    localStorage.removeItem('tempHeroBanners');
    setBanners(prev => prev.filter(banner => !banner.id.startsWith('temp-')));
  };

  return {
    banners,
    isLoading,
    error,
    createBanner,
    updateBanner,
    deleteBanner,
    loadHeroBanners,
    clearTemporaryBanners
  };
};