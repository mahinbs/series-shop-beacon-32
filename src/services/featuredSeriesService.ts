import { supabase } from '@/integrations/supabase/client';

export interface FeaturedSeriesConfig {
  id: string;
  title: string;
  description: string;
  background_image_url: string;
  primary_button_text: string;
  primary_button_link: string;
  secondary_button_text: string;
  secondary_button_link: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface FeaturedSeriesBadge {
  id: string;
  name: string;
  color: string;
  text_color: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export class FeaturedSeriesService {
  // Get featured series configurations
  static async getConfigs(): Promise<FeaturedSeriesConfig[]> {
    try {
      console.log('⭐ Getting featured series configs...');
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('featured_series_configs')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (!error && data) {
          console.log('✅ Successfully loaded configs from Supabase:', data);
          return data;
        } else {
          // Check if it's a table not found error
          if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
            console.log('⚠️ Featured series tables not found, using local storage fallback');
          } else {
            console.log('⚠️ Supabase error, falling back to local storage:', error);
          }
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedConfigs = localStorage.getItem('featured_series_configs');
      
      if (storedConfigs) {
        const parsedConfigs = JSON.parse(storedConfigs);
        console.log('⭐ Loaded configs from localStorage:', parsedConfigs.length, 'configs');
        return parsedConfigs.filter((config: FeaturedSeriesConfig) => config.is_active);
      }

      console.log('🆕 No stored configs found, returning default data');
      
      // Return default mock data
      const defaultConfigs: FeaturedSeriesConfig[] = [
        {
          id: 'config-1',
          title: 'Featured Series',
          description: 'Discover our most popular and trending series',
          background_image_url: '/lovable-uploads/featured-series-bg.jpg',
          primary_button_text: 'View All Series',
          primary_button_link: '/our-series',
          secondary_button_text: 'Start Reading',
          secondary_button_link: '/digital-reader',
          is_active: true,
          display_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      // Store default data in localStorage
      localStorage.setItem('featured_series_configs', JSON.stringify(defaultConfigs));
      return defaultConfigs;
    } catch (error) {
      console.error('❌ Error getting configs:', error);
      return [];
    }
  }

  // Get featured series badges
  static async getBadges(): Promise<FeaturedSeriesBadge[]> {
    try {
      console.log('🏷️ Getting featured series badges...');
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('featured_series_badges')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (!error && data) {
          console.log('✅ Successfully loaded badges from Supabase:', data);
          return data;
        } else {
          // Check if it's a table not found error
          if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
            console.log('⚠️ Featured series tables not found, using local storage fallback');
          } else {
            console.log('⚠️ Supabase error, falling back to local storage:', error);
          }
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedBadges = localStorage.getItem('featured_series_badges');
      
      if (storedBadges) {
        const parsedBadges = JSON.parse(storedBadges);
        console.log('🏷️ Loaded badges from localStorage:', parsedBadges.length, 'badges');
        return parsedBadges.filter((badge: FeaturedSeriesBadge) => badge.is_active);
      }

      console.log('🆕 No stored badges found, returning default data');
      
      // Return default mock data
      const defaultBadges: FeaturedSeriesBadge[] = [
        {
          id: 'badge-1',
          name: 'New Chapter',
          color: 'bg-red-600',
          text_color: 'text-white',
          is_active: true,
          display_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'badge-2',
          name: 'Trending',
          color: 'bg-blue-600',
          text_color: 'text-white',
          is_active: true,
          display_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'badge-3',
          name: 'Updated',
          color: 'bg-green-600',
          text_color: 'text-white',
          is_active: true,
          display_order: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'badge-4',
          name: 'Popular',
          color: 'bg-purple-600',
          text_color: 'text-white',
          is_active: true,
          display_order: 4,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      // Store default data in localStorage
      localStorage.setItem('featured_series_badges', JSON.stringify(defaultBadges));
      return defaultBadges;
    } catch (error) {
      console.error('❌ Error getting badges:', error);
      return [];
    }
  }

  // Create configuration
  static async createConfig(configData: Partial<FeaturedSeriesConfig>): Promise<FeaturedSeriesConfig> {
    try {
      console.log('➕ Creating featured series config...');
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('featured_series_configs')
          .insert([configData])
          .select()
          .single();

        if (!error && data) {
          console.log('✅ Successfully created config in Supabase:', data);
          return data;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const now = new Date().toISOString();
      const newConfig: FeaturedSeriesConfig = {
        id: `config-${Date.now()}`,
        title: configData.title || '',
        description: configData.description || '',
        background_image_url: configData.background_image_url || '',
        primary_button_text: configData.primary_button_text || '',
        primary_button_link: configData.primary_button_link || '',
        secondary_button_text: configData.secondary_button_text || '',
        secondary_button_link: configData.secondary_button_link || '',
        is_active: configData.is_active ?? true,
        display_order: configData.display_order || 0,
        created_at: now,
        updated_at: now
      };
      
      const storedConfigs = localStorage.getItem('featured_series_configs');
      const existingConfigs = storedConfigs ? JSON.parse(storedConfigs) : [];
      const updatedConfigs = [...existingConfigs, newConfig];
      localStorage.setItem('featured_series_configs', JSON.stringify(updatedConfigs));
      
      console.log('✅ Created config in local storage:', newConfig);
      return newConfig;
    } catch (error) {
      console.error('❌ Error creating config:', error);
      throw error;
    }
  }

  // Update configuration
  static async updateConfig(id: string, configData: Partial<FeaturedSeriesConfig>): Promise<FeaturedSeriesConfig> {
    try {
      console.log('🔄 Updating featured series config...');
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('featured_series_configs')
          .update({ ...configData, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          console.log('✅ Successfully updated config in Supabase:', data);
          return data;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedConfigs = localStorage.getItem('featured_series_configs');
      const existingConfigs = storedConfigs ? JSON.parse(storedConfigs) : [];
      const configIndex = existingConfigs.findIndex((config: FeaturedSeriesConfig) => config.id === id);
      
      if (configIndex !== -1) {
        existingConfigs[configIndex] = {
          ...existingConfigs[configIndex],
          ...configData,
          updated_at: new Date().toISOString()
        };
        localStorage.setItem('featured_series_configs', JSON.stringify(existingConfigs));
        console.log('✅ Updated config in local storage:', existingConfigs[configIndex]);
        return existingConfigs[configIndex];
      }
      
      throw new Error('Config not found');
    } catch (error) {
      console.error('❌ Error updating config:', error);
      throw error;
    }
  }

  // Delete configuration
  static async deleteConfig(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting featured series config...');
      
      // Try Supabase first
      try {
        const { error } = await supabase
          .from('featured_series_configs')
          .delete()
          .eq('id', id);

        if (!error) {
          console.log('✅ Successfully deleted config from Supabase');
          return;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedConfigs = localStorage.getItem('featured_series_configs');
      const existingConfigs = storedConfigs ? JSON.parse(storedConfigs) : [];
      const filteredConfigs = existingConfigs.filter((config: FeaturedSeriesConfig) => config.id !== id);
      localStorage.setItem('featured_series_configs', JSON.stringify(filteredConfigs));
      
      console.log('✅ Deleted config from local storage');
    } catch (error) {
      console.error('❌ Error deleting config:', error);
      throw error;
    }
  }

  // Create badge
  static async createBadge(badgeData: Partial<FeaturedSeriesBadge>): Promise<FeaturedSeriesBadge> {
    try {
      console.log('➕ Creating featured series badge...');
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('featured_series_badges')
          .insert([badgeData])
          .select()
          .single();

        if (!error && data) {
          console.log('✅ Successfully created badge in Supabase:', data);
          return data;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const now = new Date().toISOString();
      const newBadge: FeaturedSeriesBadge = {
        id: `badge-${Date.now()}`,
        name: badgeData.name || '',
        color: badgeData.color || 'bg-red-600',
        text_color: badgeData.text_color || 'text-white',
        is_active: badgeData.is_active ?? true,
        display_order: badgeData.display_order || 0,
        created_at: now,
        updated_at: now
      };
      
      const storedBadges = localStorage.getItem('featured_series_badges');
      const existingBadges = storedBadges ? JSON.parse(storedBadges) : [];
      const updatedBadges = [...existingBadges, newBadge];
      localStorage.setItem('featured_series_badges', JSON.stringify(updatedBadges));
      
      console.log('✅ Created badge in local storage:', newBadge);
      return newBadge;
    } catch (error) {
      console.error('❌ Error creating badge:', error);
      throw error;
    }
  }

  // Update badge
  static async updateBadge(id: string, badgeData: Partial<FeaturedSeriesBadge>): Promise<FeaturedSeriesBadge> {
    try {
      console.log('🔄 Updating featured series badge...');
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('featured_series_badges')
          .update({ ...badgeData, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          console.log('✅ Successfully updated badge in Supabase:', data);
          return data;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedBadges = localStorage.getItem('featured_series_badges');
      const existingBadges = storedBadges ? JSON.parse(storedBadges) : [];
      const badgeIndex = existingBadges.findIndex((badge: FeaturedSeriesBadge) => badge.id === id);
      
      if (badgeIndex !== -1) {
        existingBadges[badgeIndex] = {
          ...existingBadges[badgeIndex],
          ...badgeData,
          updated_at: new Date().toISOString()
        };
        localStorage.setItem('featured_series_badges', JSON.stringify(existingBadges));
        console.log('✅ Updated badge in local storage:', existingBadges[badgeIndex]);
        return existingBadges[badgeIndex];
      }
      
      throw new Error('Badge not found');
    } catch (error) {
      console.error('❌ Error updating badge:', error);
      throw error;
    }
  }

  // Delete badge
  static async deleteBadge(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting featured series badge...');
      
      // Try Supabase first
      try {
        const { error } = await supabase
          .from('featured_series_badges')
          .delete()
          .eq('id', id);

        if (!error) {
          console.log('✅ Successfully deleted badge from Supabase');
          return;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedBadges = localStorage.getItem('featured_series_badges');
      const existingBadges = storedBadges ? JSON.parse(storedBadges) : [];
      const filteredBadges = existingBadges.filter((badge: FeaturedSeriesBadge) => badge.id !== id);
      localStorage.setItem('featured_series_badges', JSON.stringify(filteredBadges));
      
      console.log('✅ Deleted badge from local storage');
    } catch (error) {
      console.error('❌ Error deleting badge:', error);
      throw error;
    }
  }
}
