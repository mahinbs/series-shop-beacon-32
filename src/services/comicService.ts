import { supabase } from '@/integrations/supabase/client';

// Helper function to check if user is using local storage auth
const isLocalAuth = (userId?: string) => {
  return userId && userId.startsWith('local-');
};

// Helper function to check if we should use local storage (global check)
const shouldUseLocalStorage = () => {
  try {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      const user = JSON.parse(localUser);
      return isLocalAuth(user.id);
    }
  } catch (error) {
    console.error('Error checking local storage:', error);
  }
  return false;
};

// Types
export interface Creator {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  website_url?: string;
  social_links?: Record<string, string>;
  specialties?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComicSeries {
  id: string;
  title: string;
  slug: string;
  description?: string;
  cover_image_url?: string;
  banner_image_url?: string;
  status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled';
  genre?: string[];
  tags?: string[];
  age_rating: 'all' | 'teen' | 'mature';
  total_episodes: number;
  total_pages: number;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  creators?: SeriesCreator[];
}

export interface SeriesCreator {
  id: string;
  series_id: string;
  creator_id: string;
  role: 'writer' | 'artist' | 'colorist' | 'letterer' | 'editor' | 'publisher';
  is_primary: boolean;
  creator?: Creator;
}

export interface ComicEpisode {
  id: string;
  series_id: string;
  episode_number: number;
  title: string;
  description?: string;
  cover_image_url?: string;
  total_pages: number;
  is_free: boolean;
  coin_price: number;
  is_published: boolean;
  published_at?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  series?: ComicSeries;
  pages?: ComicPage[];
  files?: ComicFile[];
}

export interface ComicPage {
  id: string;
  episode_id: string;
  page_number: number;
  image_url: string;
  thumbnail_url?: string;
  alt_text?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComicFile {
  id: string;
  episode_id: string;
  file_type: 'pdf' | 'zip' | 'cbz' | 'cbr';
  file_url: string;
  file_size?: number;
  original_filename?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class ComicService {
  // Creator Management
  static async getCreators(): Promise<Creator[]> {
    try {
      if (shouldUseLocalStorage()) {
        // Load from localStorage first
        const storedCreators = localStorage.getItem('creators');
        if (storedCreators) {
          const creators = JSON.parse(storedCreators);
          console.log('👥 Loaded creators from localStorage:', creators);
          return creators;
        }
        
        // If no creators in localStorage, return expanded mock data
        const mockCreators = [
          {
            id: 'creator-1',
            name: 'Alex Chen',
            bio: 'Award-winning comic book writer and artist known for fantasy and adventure stories.',
            avatar_url: 'https://picsum.photos/100/100',
            website_url: 'https://alexchen.com',
            social_links: {
              twitter: '@alexchen',
              instagram: '@alexchen_art'
            },
            specialties: ['writer', 'artist'],
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'creator-2',
            name: 'Sarah Johnson',
            bio: 'Renowned colorist and digital artist specializing in sci-fi and cyberpunk themes.',
            avatar_url: 'https://picsum.photos/101/101',
            website_url: 'https://sarahjohnson.com',
            social_links: {
              twitter: '@sarahj_art',
              instagram: '@sarahjohnson_art'
            },
            specialties: ['colorist', 'artist'],
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'creator-3',
            name: 'Michael Rodriguez',
            bio: 'Experienced letterer and editor with over 15 years in the comic industry.',
            avatar_url: 'https://picsum.photos/102/102',
            website_url: 'https://michaelrodriguez.com',
            social_links: {
              twitter: '@mrodriguez',
              linkedin: 'michael-rodriguez'
            },
            specialties: ['letterer', 'editor'],
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'creator-4',
            name: 'Emma Thompson',
            bio: 'Creative writer and publisher known for innovative storytelling techniques.',
            avatar_url: 'https://picsum.photos/103/103',
            website_url: 'https://emmathompson.com',
            social_links: {
              twitter: '@emmathompson',
              instagram: '@emma_writes'
            },
            specialties: ['writer', 'publisher'],
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'creator-5',
            name: 'David Kim',
            bio: 'Versatile artist and writer with expertise in manga and webcomics.',
            avatar_url: 'https://picsum.photos/104/104',
            website_url: 'https://davidkim.com',
            social_links: {
              twitter: '@davidkim_art',
              instagram: '@davidkim_comics'
            },
            specialties: ['artist', 'writer'],
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        
        // Save mock creators to localStorage
        localStorage.setItem('creators', JSON.stringify(mockCreators));
        console.log('👥 Created mock creators in localStorage:', mockCreators);
        return mockCreators;
      }

      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return (data as any[]) || [];
    } catch (error) {
      console.error('Error fetching creators:', error);
      return [];
    }
  }

  static async createCreator(creator: Omit<Creator, 'id' | 'created_at' | 'updated_at'>): Promise<Creator> {
    try {
      if (shouldUseLocalStorage()) {
        const newCreator: Creator = {
          id: `creator-${Date.now()}`,
          ...creator,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Save to localStorage
        const existingCreators = await this.getCreators();
        const updatedCreators = [...existingCreators, newCreator];
        localStorage.setItem('creators', JSON.stringify(updatedCreators));
        
        console.log('✅ Creator created in localStorage:', newCreator);
        return newCreator;
      }

      const { data, error } = await supabase
        .from('creators')
        .insert(creator)
        .select()
        .single();

      if (error) throw error;
      return data as any;
    } catch (error) {
      console.error('Error creating creator:', error);
      throw error;
    }
  }

  static async updateCreator(id: string, updates: Partial<Creator>): Promise<Creator> {
    try {
      if (shouldUseLocalStorage()) {
        return {
          id,
          ...updates,
          updated_at: new Date().toISOString()
        } as Creator;
      }

      const { data, error } = await supabase
        .from('creators')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as any;
    } catch (error) {
      console.error('Error updating creator:', error);
      throw error;
    }
  }

  static async deleteCreator(id: string): Promise<void> {
    try {
      if (shouldUseLocalStorage()) {
        return;
      }

      const { error } = await supabase
        .from('creators')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting creator:', error);
      throw error;
    }
  }

  // Series Management
  static async getSeries(): Promise<ComicSeries[]> {
    try {
      console.log('📖 Getting series...');
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('comic_series')
          .select(`
            *,
            creators:series_creators(
              *,
              creator:creators(*)
            )
          `)
          .order('display_order');

        if (!error && data) {
          console.log('✅ Successfully loaded series from Supabase:', data);
          return (data as any).map(series => ({
            ...series,
            status: series.status as "ongoing" | "completed" | "hiatus" | "cancelled",
            creators: (series as any).comic_series_creators?.map(creator => ({
              id: creator.creator_profiles?.id || '',
              name: creator.creator_profiles?.name || '',
              role: creator.role,
              bio: creator.creator_profiles?.bio || null,
              avatar_url: creator.creator_profiles?.avatar_url || null,
              social_links: creator.creator_profiles?.social_links || null
            })) || []
          })) as ComicSeries[];
        } else {
          // Don't log error if table doesn't exist (PGRST205)
          if (error?.code !== 'PGRST205' && !error?.message?.includes('relation') && !error?.message?.includes('does not exist')) {
            console.log('⚠️ Supabase error, falling back to local storage:', error);
          }
        }
      } catch (supabaseError) {
        // Don't log error if table doesn't exist
        if (!supabaseError?.message?.includes('relation') && !supabaseError?.message?.includes('does not exist')) {
          console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
        }
      }
      
      // Fallback to local storage
      console.log('📖 Getting series from localStorage...');
      const storedSeries = localStorage.getItem('comic_series');
      console.log('💾 Stored series from localStorage:', storedSeries);
      
      if (storedSeries) {
        const parsedSeries = JSON.parse(storedSeries);
        console.log('📚 Parsed series:', parsedSeries);
        return parsedSeries;
      }

      console.log('🆕 No stored series found, returning default data');
      
      // Return default mock data
      const defaultSeries = [
        {
          id: 'series-1',
          title: 'Shadow Hunter Chronicles',
          slug: 'shadow-hunter-chronicles',
          description: 'An epic fantasy adventure following the journey of a young shadow hunter.',
          cover_image_url: 'https://picsum.photos/300/400',
          banner_image_url: 'https://picsum.photos/800/300',
          status: 'ongoing' as const,
          genre: ['Fantasy', 'Adventure', 'Action'],
          tags: ['magic', 'heroes', 'quest'],
          age_rating: 'teen' as const,
          total_episodes: 5,
          total_pages: 120,
          is_featured: true,
          is_active: true,
          display_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          creators: [
            {
              id: 'sc-1',
              series_id: 'series-1',
              creator_id: 'creator-1',
              role: 'writer' as const,
              is_primary: true,
              creator: {
                id: 'creator-1',
                name: 'Alex Chen',
                bio: 'Award-winning comic book writer and artist.',
                avatar_url: 'https://picsum.photos/100/100',
                specialties: ['writer', 'artist'],
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            }
          ]
        },
        {
          id: 'series-2',
          title: 'Cyber City Warriors',
          slug: 'cyber-city-warriors',
          description: 'A cyberpunk tale of hackers and rebels fighting against corporate control.',
          cover_image_url: 'https://picsum.photos/300/400',
          banner_image_url: 'https://picsum.photos/800/300',
          status: 'ongoing' as const,
          genre: ['Sci-Fi', 'Action', 'Cyberpunk'],
          tags: ['technology', 'rebellion', 'future'],
          age_rating: 'mature' as const,
          total_episodes: 3,
          total_pages: 72,
          is_featured: false,
          is_active: true,
          display_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          creators: []
        }
      ];

      // Store default data in localStorage
      localStorage.setItem('comic_series', JSON.stringify(defaultSeries));
      return defaultSeries;
    } catch (error) {
      console.error('Error fetching series:', error);
      return [];
    }
  }

  static async getSeriesBySlug(slug: string): Promise<ComicSeries | null> {
    try {
      if (shouldUseLocalStorage()) {
        const series = await this.getSeries();
        return series.find(s => s.slug === slug) || null;
      }

      const { data, error } = await supabase
        .from('comic_series')
        .select(`
          *,
          creators:series_creators(
            *,
            creator:creators(*)
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) {
        // Don't throw error if table doesn't exist
        if (error.code === 'PGRST205' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          return null;
        }
        throw error;
      }
      return data as any;
    } catch (error) {
      // Don't log error if table doesn't exist
      if (!error?.message?.includes('relation') && !error?.message?.includes('does not exist')) {
        console.error('Error fetching series by slug:', error);
      }
      return null;
    }
  }

  static async createSeries(series: Omit<ComicSeries, 'id' | 'created_at' | 'updated_at' | 'total_episodes' | 'total_pages'>): Promise<ComicSeries> {
    try {
      console.log('➕ Creating new series:', series);
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('comic_series')
          .insert(series)
          .select()
          .single();

        if (!error && data) {
          console.log('✅ Successfully created series in Supabase:', data);
          return {
            ...data,
            status: data.status as "ongoing" | "completed" | "hiatus" | "cancelled",
            creators: (data as any).comic_series_creators?.map(creator => ({
              id: creator.creator_profiles?.id || '',
              name: creator.creator_profiles?.name || '',
              role: creator.role,
              bio: creator.creator_profiles?.bio || null,
              avatar_url: creator.creator_profiles?.avatar_url || null,
              social_links: creator.creator_profiles?.social_links || null
            })) || []
          } as ComicSeries;
        } else {
          // Don't log error if table doesn't exist
          if (error?.code !== 'PGRST205' && !error?.message?.includes('relation') && !error?.message?.includes('does not exist')) {
            console.log('⚠️ Supabase error, falling back to local storage:', error);
          }
        }
      } catch (supabaseError) {
        // Don't log error if table doesn't exist
        if (!supabaseError?.message?.includes('relation') && !supabaseError?.message?.includes('does not exist')) {
          console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
        }
      }
      
      // Fallback to local storage
      const existingSeries = await this.getSeries();
      console.log('📚 Existing series before adding:', existingSeries);
      
      const newSeries: ComicSeries = {
        id: `series-${Date.now()}`,
        ...series,
        total_episodes: 0,
        total_pages: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('🆕 New series created:', newSeries);

      const updatedSeries = [...existingSeries, newSeries];
      console.log('📝 Updated series array:', updatedSeries);
      
      localStorage.setItem('comic_series', JSON.stringify(updatedSeries));
      console.log('💾 Series saved to localStorage');
      
      return newSeries;
    } catch (error) {
      console.error('Error creating series:', error);
      throw error;
    }
  }

  static async updateSeries(id: string, updates: Partial<ComicSeries>): Promise<ComicSeries> {
    try {
      console.log('🔄 Updating series with ID:', id);
      console.log('📝 Updates:', updates);
      
      // Use local storage instead of database
      const existingSeries = await this.getSeries();
      console.log('📚 Existing series:', existingSeries);
      
      const seriesIndex = existingSeries.findIndex(s => s.id === id);
      console.log('🔍 Series index:', seriesIndex);
      
      if (seriesIndex === -1) {
        console.error('❌ Series not found with ID:', id);
        throw new Error('Series not found');
      }

      const updatedSeries = {
        ...existingSeries[seriesIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };

      console.log('✅ Updated series:', updatedSeries);

      existingSeries[seriesIndex] = updatedSeries;
      localStorage.setItem('comic_series', JSON.stringify(existingSeries));
      
      console.log('💾 Series saved to localStorage');
      return updatedSeries;
    } catch (error) {
      console.error('Error updating series:', error);
      throw error;
    }
  }

  static async deleteSeries(id: string): Promise<void> {
    try {
      if (shouldUseLocalStorage()) {
        const existingSeries = await this.getSeries();
        const filteredSeries = existingSeries.filter(s => s.id !== id);
        localStorage.setItem('comic_series', JSON.stringify(filteredSeries));
        console.log('✅ Series deleted from localStorage:', id);
        return;
      }

      const { error } = await supabase
        .from('comic_series')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        // Don't throw error if table doesn't exist
        if (error.code === 'PGRST205' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          return;
        }
        throw error;
      }
    } catch (error) {
      // Don't log error if table doesn't exist
      if (!error?.message?.includes('relation') && !error?.message?.includes('does not exist')) {
        console.error('Error deleting series:', error);
        throw error;
      }
    }
  }

  // Episode Management
  static async getEpisodes(seriesId?: string): Promise<ComicEpisode[]> {
    try {
      if (shouldUseLocalStorage()) {
        // Load from localStorage
        const storedEpisodes = localStorage.getItem('comic_episodes');
        let episodes = storedEpisodes ? JSON.parse(storedEpisodes) : [];
        
        // If no episodes in localStorage, return empty array
        if (episodes.length === 0) {
          console.log('📖 No episodes found in localStorage');
          return [];
        }
        
        // Filter by series if specified
        if (seriesId) {
          episodes = episodes.filter((e: ComicEpisode) => e.series_id === seriesId);
        }
        
        console.log('📖 Loaded episodes from localStorage:', episodes);
        return episodes;
      }

      let query = supabase
        .from('comic_episodes')
        .select(`
          *,
          series:comic_series(*),
          pages:comic_pages(*),
          files:comic_files(*)
        `)
        .eq('is_active', true);

      if (seriesId) {
        query = query.eq('series_id', seriesId);
      }

      const { data, error } = await query.order('episode_number');

      if (error) throw error;
      return (data as any) || [];
    } catch (error) {
      console.error('Error fetching episodes:', error);
      return [];
    }
  }

  static async getEpisode(id: string): Promise<ComicEpisode | null> {
    try {
      if (shouldUseLocalStorage()) {
        const episodes = await this.getEpisodes();
        return episodes.find(e => e.id === id) || null;
      }

      const { data, error } = await supabase
        .from('comic_episodes')
        .select(`
          *,
          series:comic_series(*),
          pages:comic_pages(*),
          files:comic_files(*)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data as any;
    } catch (error) {
      console.error('Error fetching episode:', error);
      return null;
    }
  }

  static async createEpisode(episode: Omit<ComicEpisode, 'id' | 'created_at' | 'updated_at' | 'total_pages'>): Promise<ComicEpisode> {
    try {
      if (shouldUseLocalStorage()) {
        const newEpisode: ComicEpisode = {
          id: `episode-${Date.now()}`,
          ...episode,
          total_pages: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Save to localStorage
        const storedEpisodes = localStorage.getItem('comic_episodes');
        const episodes = storedEpisodes ? JSON.parse(storedEpisodes) : [];
        episodes.push(newEpisode);
        localStorage.setItem('comic_episodes', JSON.stringify(episodes));
        
        console.log('✅ Episode created in localStorage:', newEpisode);
        return newEpisode;
      }

      const { data, error } = await supabase
        .from('comic_episodes')
        .insert(episode)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating episode:', error);
      throw error;
    }
  }

  static async updateEpisode(id: string, updates: Partial<ComicEpisode>): Promise<ComicEpisode> {
    try {
      if (shouldUseLocalStorage()) {
        const storedEpisodes = localStorage.getItem('comic_episodes');
        const episodes = storedEpisodes ? JSON.parse(storedEpisodes) : [];
        const episodeIndex = episodes.findIndex((e: ComicEpisode) => e.id === id);
        
        if (episodeIndex !== -1) {
          episodes[episodeIndex] = {
            ...episodes[episodeIndex],
            ...updates,
            updated_at: new Date().toISOString()
          };
          localStorage.setItem('comic_episodes', JSON.stringify(episodes));
          console.log('✅ Episode updated in localStorage:', episodes[episodeIndex]);
          return episodes[episodeIndex];
        }
        
        throw new Error('Episode not found');
      }

      const { data, error } = await supabase
        .from('comic_episodes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating episode:', error);
      throw error;
    }
  }

  static async deleteEpisode(id: string): Promise<void> {
    try {
      if (shouldUseLocalStorage()) {
        const storedEpisodes = localStorage.getItem('comic_episodes');
        const episodes = storedEpisodes ? JSON.parse(storedEpisodes) : [];
        const filteredEpisodes = episodes.filter((e: ComicEpisode) => e.id !== id);
        localStorage.setItem('comic_episodes', JSON.stringify(filteredEpisodes));
        console.log('✅ Episode deleted from localStorage:', id);
        return;
      }

      const { error } = await supabase
        .from('comic_episodes')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting episode:', error);
      throw error;
    }
  }

  // Page Management
  static async getPages(episodeId: string, forceRefresh: boolean = false): Promise<ComicPage[]> {
    try {
      if (shouldUseLocalStorage() && !forceRefresh) {
        // Load from localStorage
        const storedPages = localStorage.getItem('comic_pages');
        let pages = storedPages ? JSON.parse(storedPages) : [];
        
        // Filter by episode
        pages = pages.filter((p: ComicPage) => p.episode_id === episodeId);
        
        console.log('📄 Loaded pages from localStorage for episode:', episodeId, pages);
        return pages;
      }

      console.log('📄 Fetching fresh pages from database for episode:', episodeId);
      const { data, error } = await supabase
        .from('comic_pages')
        .select('*')
        .eq('episode_id', episodeId)
        .eq('is_active', true)
        .order('page_number');

      if (error) throw error;
      const pages = (data as any) || [];
      console.log('📄 Fresh pages loaded:', pages.length, 'pages with page numbers:', pages.map(p => p.page_number));
      return pages;
    } catch (error) {
      console.error('Error fetching pages:', error);
      return [];
    }
  }

  static async getPagesByEpisode(episodeId: string): Promise<ComicPage[]> {
    return this.getPages(episodeId);
  }

  static async createPage(page: Omit<ComicPage, 'id' | 'created_at' | 'updated_at'>): Promise<ComicPage> {
    try {
      if (shouldUseLocalStorage()) {
        const newPage: ComicPage = {
          id: `page-${Date.now()}`,
          ...page,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Save to localStorage
        const storedPages = localStorage.getItem('comic_pages');
        const pages = storedPages ? JSON.parse(storedPages) : [];
        pages.push(newPage);
        localStorage.setItem('comic_pages', JSON.stringify(pages));
        
        console.log('✅ Page created in localStorage:', newPage);
        return newPage;
      }

      console.log('📄 Creating page with number:', page.page_number, 'for episode:', page.episode_id);
      const { data, error } = await supabase
        .from('comic_pages')
        .insert(page)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating page:', error);
        throw error;
      }
      
      console.log('✅ Page created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  }

  // New method to create page with automatic page number assignment and conflict resolution
  static async createPageWithRetry(pageData: Omit<ComicPage, 'id' | 'created_at' | 'updated_at' | 'page_number' | 'episode_id'>, episodeId: string, maxRetries: number = 5): Promise<ComicPage> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Get fresh page data from database
        const currentPages = await this.getPages(episodeId, true);
        const existingPageNumbers = currentPages.map(p => p.page_number).sort((a, b) => a - b);
        
        // Find next available page number
        let nextPageNumber = 1;
        for (const pageNum of existingPageNumbers) {
          if (pageNum === nextPageNumber) {
            nextPageNumber++;
          } else {
            break;
          }
        }
        
        console.log(`📄 Attempt ${attempt}: Using page number ${nextPageNumber} (existing: [${existingPageNumbers.join(', ')}])`);
        
        const page = {
          ...pageData,
          episode_id: episodeId,
          page_number: nextPageNumber
        };
        
        return await this.createPage(page);
        
      } catch (error: any) {
        const isDuplicateKeyError = error?.code === '23505' || error?.message?.includes('duplicate key value violates unique constraint');
        
        if (isDuplicateKeyError && attempt < maxRetries) {
          console.warn(`⚠️ Duplicate key error on attempt ${attempt}, retrying...`);
          // Wait a bit before retrying to avoid race conditions
          await new Promise(resolve => setTimeout(resolve, 100 * attempt));
          continue;
        }
        
        console.error(`❌ Failed to create page after ${attempt} attempts:`, error);
        throw error;
      }
    }
    
    throw new Error(`Failed to create page after ${maxRetries} attempts`);
  }

  static async updatePage(id: string, updates: Partial<ComicPage>): Promise<ComicPage> {
    try {
      if (shouldUseLocalStorage()) {
        const storedPages = localStorage.getItem('comic_pages');
        const pages = storedPages ? JSON.parse(storedPages) : [];
        const pageIndex = pages.findIndex((p: ComicPage) => p.id === id);
        
        if (pageIndex !== -1) {
          pages[pageIndex] = {
            ...pages[pageIndex],
            ...updates,
            updated_at: new Date().toISOString()
          };
          localStorage.setItem('comic_pages', JSON.stringify(pages));
          console.log('✅ Page updated in localStorage:', pages[pageIndex]);
          return pages[pageIndex];
        }
        
        throw new Error('Page not found');
      }

      const { data, error } = await supabase
        .from('comic_pages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating page:', error);
      throw error;
    }
  }

  static async deletePage(id: string): Promise<void> {
    try {
      if (shouldUseLocalStorage()) {
        const storedPages = localStorage.getItem('comic_pages');
        const pages = storedPages ? JSON.parse(storedPages) : [];
        const filteredPages = pages.filter((p: ComicPage) => p.id !== id);
        localStorage.setItem('comic_pages', JSON.stringify(filteredPages));
        console.log('✅ Page deleted from localStorage:', id);
        return;
      }

      const { error } = await supabase
        .from('comic_pages')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  }

  // File Management
  static async getFiles(episodeId: string): Promise<ComicFile[]> {
    try {
      if (shouldUseLocalStorage()) {
        return [];
      }

      const { data, error } = await supabase
        .from('comic_files')
        .select('*')
        .eq('episode_id', episodeId)
        .eq('is_active', true);

      if (error) throw error;
      return (data as any) || [];
    } catch (error) {
      console.error('Error fetching files:', error);
      return [];
    }
  }

  static async createFile(file: Omit<ComicFile, 'id' | 'created_at' | 'updated_at'>): Promise<ComicFile> {
    try {
      if (shouldUseLocalStorage()) {
        const newFile: ComicFile = {
          id: `file-${Date.now()}`,
          ...file,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return newFile;
      }

      const { data, error } = await supabase
        .from('comic_files')
        .insert(file)
        .select()
        .single();

      if (error) throw error;
      return data as any;
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }

  static async deleteFile(id: string): Promise<void> {
    try {
      if (shouldUseLocalStorage()) {
        return;
      }

      const { error } = await supabase
        .from('comic_files')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}
