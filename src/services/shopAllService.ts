import { supabase } from '@/integrations/supabase/client';

export interface ShopAllHero {
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

export interface ShopAllFilter {
  id: string;
  name: string;
  type: 'category' | 'price' | 'status' | 'type' | 'genre' | 'age_rating' | 'author' | 'publisher';
  options: string[] | object | string; // Can be array, object, or string (JSON)
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ShopAllSort {
  id: string;
  name: string;
  value: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export class ShopAllService {
  // Get all hero sections
  static async getHeroSections(): Promise<ShopAllHero[]> {
    try {
      console.log('🎯 Getting shop all hero sections...');
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('shop_all_heroes')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (!error && data) {
          console.log('✅ Successfully loaded hero sections from Supabase:', data);
          return data;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      console.log('📖 Getting hero sections from localStorage...');
      const storedHeroes = localStorage.getItem('shop_all_heroes');
      console.log('💾 Stored hero sections from localStorage:', storedHeroes);
      console.log('🔍 Raw localStorage data:', localStorage.getItem('shop_all_heroes'));
      
      if (storedHeroes) {
        const parsedHeroes = JSON.parse(storedHeroes);
        console.log('🎯 Parsed hero sections:', parsedHeroes);
        return parsedHeroes.filter((hero: ShopAllHero) => hero.is_active);
      }

      console.log('🆕 No stored hero sections found, returning default data');
      
      // Return default mock data
      const defaultHeroes: ShopAllHero[] = [
        {
          id: 'hero-1',
          title: 'Explore Series',
          description: 'Discover new series through manga and anime stories. Read stories, discover new characters, and learn lore through the life cycle.',
          background_image_url: '/lovable-uploads/shop-hero-bg.jpg',
          primary_button_text: 'Popular Series',
          primary_button_link: '/our-series',
          secondary_button_text: 'Browse All',
          secondary_button_link: '/shop-all',
          is_active: true,
          display_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      // Store default data in localStorage
      localStorage.setItem('shop_all_heroes', JSON.stringify(defaultHeroes));
      return defaultHeroes;
    } catch (error) {
      console.error('❌ Error getting hero sections:', error);
      return [];
    }
  }

  // Get all filters
  static async getFilters(): Promise<ShopAllFilter[]> {
    try {
      console.log('🔍 Getting shop all filters...');
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('shop_all_filters')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (!error && data) {
          console.log('✅ Successfully loaded filters from Supabase:', data);
          return (data as any).map(filter => ({
            ...filter,
            type: filter.type as "publisher" | "author" | "category" | "price" | "status" | "type" | "age_rating" | "genre"
          })) as ShopAllFilter[];
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      console.log('📖 Getting filters from localStorage...');
      const storedFilters = localStorage.getItem('shop_all_filters');
      console.log('💾 Stored filters from localStorage:', storedFilters);
      
      if (storedFilters) {
        const parsedFilters = JSON.parse(storedFilters);
        console.log('🔍 Parsed filters:', parsedFilters);
        return parsedFilters.filter((filter: ShopAllFilter) => filter.is_active);
      }

      console.log('🆕 No stored filters found, returning default data');
      
      // Return default mock data
      const defaultFilters: ShopAllFilter[] = [
        {
          id: 'filter-1',
          name: 'Types',
          type: 'type',
          options: ['Manga', 'Webtoon', 'Light Novel', 'Anthology'],
          is_active: true,
          display_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'filter-2',
          name: 'Price',
          type: 'price',
          options: ['Free', 'Under $5', '$5-$10', '$10-$20', '$20+'],
          is_active: true,
          display_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'filter-3',
          name: 'Status',
          type: 'status',
          options: ['Ongoing', 'Completed', 'Upcoming', 'On Hold'],
          is_active: true,
          display_order: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      // Store default data in localStorage
      localStorage.setItem('shop_all_filters', JSON.stringify(defaultFilters));
      return defaultFilters;
    } catch (error) {
      console.error('❌ Error getting filters:', error);
      return [];
    }
  }

  // Get all sort options
  static async getSortOptions(): Promise<ShopAllSort[]> {
    try {
      console.log('📊 Getting shop all sort options...');
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('shop_all_sorts')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (!error && data) {
          console.log('✅ Successfully loaded sort options from Supabase:', data);
          return data;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      console.log('📖 Getting sort options from localStorage...');
      const storedSorts = localStorage.getItem('shop_all_sorts');
      console.log('💾 Stored sort options from localStorage:', storedSorts);
      
      if (storedSorts) {
        const parsedSorts = JSON.parse(storedSorts);
        console.log('📊 Parsed sort options:', parsedSorts);
        return parsedSorts.filter((sort: ShopAllSort) => sort.is_active);
      }

      console.log('🆕 No stored sort options found, returning default data');
      
      // Return default mock data
      const defaultSorts: ShopAllSort[] = [
        {
          id: 'sort-1',
          name: 'Newest First',
          value: 'newest-first',
          is_active: true,
          display_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'sort-2',
          name: 'Oldest First',
          value: 'oldest-first',
          is_active: true,
          display_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'sort-3',
          name: 'A-Z',
          value: 'a-z',
          is_active: true,
          display_order: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'sort-4',
          name: 'Z-A',
          value: 'z-a',
          is_active: true,
          display_order: 4,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'sort-5',
          name: 'Price: Low to High',
          value: 'price-low-high',
          is_active: true,
          display_order: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'sort-6',
          name: 'Price: High to Low',
          value: 'price-high-low',
          is_active: true,
          display_order: 6,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'sort-7',
          name: 'Most Popular',
          value: 'most-popular',
          is_active: true,
          display_order: 7,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'sort-8',
          name: 'Highest Rated',
          value: 'highest-rated',
          is_active: true,
          display_order: 8,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      // Store default data in localStorage
      localStorage.setItem('shop_all_sorts', JSON.stringify(defaultSorts));
      return defaultSorts;
    } catch (error) {
      console.error('❌ Error getting sort options:', error);
      return [];
    }
  }

  // Create hero section
  static async createHeroSection(heroData: Partial<ShopAllHero>): Promise<ShopAllHero> {
    try {
      console.log('➕ Creating hero section...');
      
      // Try Supabase first
      try {
        const { data, error } = await (supabase as any)
          .from('shop_all_heroes')
          .insert(heroData)
          .select()
          .single();

        if (!error && data) {
          console.log('✅ Successfully created hero section in Supabase:', data);
          return data;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const now = new Date().toISOString();
      const newHero: ShopAllHero = {
        id: `hero-${Date.now()}`,
        title: heroData.title || '',
        description: heroData.description || '',
        background_image_url: heroData.background_image_url || '',
        primary_button_text: heroData.primary_button_text || '',
        primary_button_link: heroData.primary_button_link || '',
        secondary_button_text: heroData.secondary_button_text || '',
        secondary_button_link: heroData.secondary_button_link || '',
        is_active: heroData.is_active ?? true,
        display_order: heroData.display_order || 0,
        created_at: now,
        updated_at: now
      };
      
      const storedHeroes = localStorage.getItem('shop_all_heroes');
      const existingHeroes = storedHeroes ? JSON.parse(storedHeroes) : [];
      const updatedHeroes = [...existingHeroes, newHero];
      localStorage.setItem('shop_all_heroes', JSON.stringify(updatedHeroes));
      
      console.log('✅ Created hero section in local storage:', newHero);
      return newHero;
    } catch (error) {
      console.error('❌ Error creating hero section:', error);
      throw error;
    }
  }

  // Update hero section
  static async updateHeroSection(id: string, heroData: Partial<ShopAllHero>): Promise<ShopAllHero> {
    try {
      console.log('🔄 Updating hero section...');
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('shop_all_heroes')
          .update({ ...heroData, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          console.log('✅ Successfully updated hero section in Supabase:', data);
          return data;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedHeroes = localStorage.getItem('shop_all_heroes');
      const existingHeroes = storedHeroes ? JSON.parse(storedHeroes) : [];
      const heroIndex = existingHeroes.findIndex((hero: ShopAllHero) => hero.id === id);
      
      if (heroIndex !== -1) {
        existingHeroes[heroIndex] = {
          ...existingHeroes[heroIndex],
          ...heroData,
          updated_at: new Date().toISOString()
        };
        localStorage.setItem('shop_all_heroes', JSON.stringify(existingHeroes));
        console.log('✅ Updated hero section in local storage:', existingHeroes[heroIndex]);
        return existingHeroes[heroIndex];
      }
      
      throw new Error('Hero section not found');
    } catch (error) {
      console.error('❌ Error updating hero section:', error);
      throw error;
    }
  }

  // Delete hero section
  static async deleteHeroSection(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting hero section...');
      
      // Try Supabase first
      try {
        const { error } = await supabase
          .from('shop_all_heroes')
          .delete()
          .eq('id', id);

        if (!error) {
          console.log('✅ Successfully deleted hero section from Supabase');
          return;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedHeroes = localStorage.getItem('shop_all_heroes');
      const existingHeroes = storedHeroes ? JSON.parse(storedHeroes) : [];
      const filteredHeroes = existingHeroes.filter((hero: ShopAllHero) => hero.id !== id);
      localStorage.setItem('shop_all_heroes', JSON.stringify(filteredHeroes));
      
      console.log('✅ Deleted hero section from local storage');
    } catch (error) {
      console.error('❌ Error deleting hero section:', error);
      throw error;
    }
  }

  // Create filter
  static async createFilter(filterData: Partial<ShopAllFilter>): Promise<ShopAllFilter> {
    try {
      console.log('➕ Creating filter...');
      
      // Try Supabase first
      try {
        const { data, error } = await (supabase as any)
          .from('shop_all_filters')
          .insert(filterData)
          .select()
          .single();

        if (!error && data) {
          console.log('✅ Successfully created filter in Supabase:', data);
          return {
            ...data,
            type: (data as any).type as "publisher" | "author" | "category" | "price" | "status" | "type" | "age_rating" | "genre"
          } as ShopAllFilter;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const now = new Date().toISOString();
      const newFilter: ShopAllFilter = {
        id: `filter-${Date.now()}`,
        name: filterData.name || '',
        type: filterData.type || 'category',
        options: filterData.options || [],
        is_active: filterData.is_active ?? true,
        display_order: filterData.display_order || 0,
        created_at: now,
        updated_at: now
      };
      
      const storedFilters = localStorage.getItem('shop_all_filters');
      const existingFilters = storedFilters ? JSON.parse(storedFilters) : [];
      const updatedFilters = [...existingFilters, newFilter];
      localStorage.setItem('shop_all_filters', JSON.stringify(updatedFilters));
      
      console.log('✅ Created filter in local storage:', newFilter);
      return newFilter;
    } catch (error) {
      console.error('❌ Error creating filter:', error);
      throw error;
    }
  }

  // Update filter
  static async updateFilter(id: string, filterData: Partial<ShopAllFilter>): Promise<ShopAllFilter> {
    try {
      console.log('🔄 Updating filter...');
      
      // Try Supabase first
      try {
        const { data, error } = await (supabase as any)
          .from('shop_all_filters')
          .update({ 
            ...filterData, 
            updated_at: new Date().toISOString(),
            options: JSON.stringify(filterData.options)
          })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          console.log('✅ Successfully updated filter in Supabase:', data);
          return {
            ...data,
            type: (data as any).type as "publisher" | "author" | "category" | "price" | "status" | "type" | "age_rating" | "genre"
          } as ShopAllFilter;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedFilters = localStorage.getItem('shop_all_filters');
      const existingFilters = storedFilters ? JSON.parse(storedFilters) : [];
      const filterIndex = existingFilters.findIndex((filter: ShopAllFilter) => filter.id === id);
      
      if (filterIndex !== -1) {
        existingFilters[filterIndex] = {
          ...existingFilters[filterIndex],
          ...filterData,
          updated_at: new Date().toISOString()
        };
        localStorage.setItem('shop_all_filters', JSON.stringify(existingFilters));
        console.log('✅ Updated filter in local storage:', existingFilters[filterIndex]);
        return existingFilters[filterIndex];
      }
      
      throw new Error('Filter not found');
    } catch (error) {
      console.error('❌ Error updating filter:', error);
      throw error;
    }
  }

  // Delete filter
  static async deleteFilter(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting filter...');
      
      // Try Supabase first
      try {
        const { error } = await supabase
          .from('shop_all_filters')
          .delete()
          .eq('id', id);

        if (!error) {
          console.log('✅ Successfully deleted filter from Supabase');
          return;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedFilters = localStorage.getItem('shop_all_filters');
      const existingFilters = storedFilters ? JSON.parse(storedFilters) : [];
      const filteredFilters = existingFilters.filter((filter: ShopAllFilter) => filter.id !== id);
      localStorage.setItem('shop_all_filters', JSON.stringify(filteredFilters));
      
      console.log('✅ Deleted filter from local storage');
    } catch (error) {
      console.error('❌ Error deleting filter:', error);
      throw error;
    }
  }

  // Create sort option
  static async createSortOption(sortData: Partial<ShopAllSort>): Promise<ShopAllSort> {
    try {
      console.log('➕ Creating sort option...');
      
      // Try Supabase first
      try {
        const { data, error } = await (supabase as any)
          .from('shop_all_sorts')
          .insert(sortData)
          .select()
          .single();

        if (!error && data) {
          console.log('✅ Successfully created sort option in Supabase:', data);
          return data;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const now = new Date().toISOString();
      const newSort: ShopAllSort = {
        id: `sort-${Date.now()}`,
        name: sortData.name || '',
        value: sortData.value || '',
        is_active: sortData.is_active ?? true,
        display_order: sortData.display_order || 0,
        created_at: now,
        updated_at: now
      };
      
      const storedSorts = localStorage.getItem('shop_all_sorts');
      const existingSorts = storedSorts ? JSON.parse(storedSorts) : [];
      const updatedSorts = [...existingSorts, newSort];
      localStorage.setItem('shop_all_sorts', JSON.stringify(updatedSorts));
      
      console.log('✅ Created sort option in local storage:', newSort);
      return newSort;
    } catch (error) {
      console.error('❌ Error creating sort option:', error);
      throw error;
    }
  }

  // Update sort option
  static async updateSortOption(id: string, sortData: Partial<ShopAllSort>): Promise<ShopAllSort> {
    try {
      console.log('🔄 Updating sort option...');
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('shop_all_sorts')
          .update({ ...sortData, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          console.log('✅ Successfully updated sort option in Supabase:', data);
          return data;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedSorts = localStorage.getItem('shop_all_sorts');
      const existingSorts = storedSorts ? JSON.parse(storedSorts) : [];
      const sortIndex = existingSorts.findIndex((sort: ShopAllSort) => sort.id === id);
      
      if (sortIndex !== -1) {
        existingSorts[sortIndex] = {
          ...existingSorts[sortIndex],
          ...sortData,
          updated_at: new Date().toISOString()
        };
        localStorage.setItem('shop_all_sorts', JSON.stringify(existingSorts));
        console.log('✅ Updated sort option in local storage:', existingSorts[sortIndex]);
        return existingSorts[sortIndex];
      }
      
      throw new Error('Sort option not found');
    } catch (error) {
      console.error('❌ Error updating sort option:', error);
      throw error;
    }
  }

  // Delete sort option
  static async deleteSortOption(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting sort option...');
      
      // Try Supabase first
      try {
        const { error } = await supabase
          .from('shop_all_sorts')
          .delete()
          .eq('id', id);

        if (!error) {
          console.log('✅ Successfully deleted sort option from Supabase');
          return;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedSorts = localStorage.getItem('shop_all_sorts');
      const existingSorts = storedSorts ? JSON.parse(storedSorts) : [];
      const filteredSorts = existingSorts.filter((sort: ShopAllSort) => sort.id !== id);
      localStorage.setItem('shop_all_sorts', JSON.stringify(filteredSorts));
      
      console.log('✅ Deleted sort option from local storage');
    } catch (error) {
      console.error('❌ Error deleting sort option:', error);
      throw error;
    }
  }
}
