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
        // Return mock data for local auth
        return [
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
          }
        ];
      }

      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
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
        return newCreator;
      }

      const { data, error } = await supabase
        .from('creators')
        .insert(creator)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      return data;
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
      if (shouldUseLocalStorage()) {
        // Return mock data for local auth
        return [
          {
            id: 'series-1',
            title: 'Shadow Hunter Chronicles',
            slug: 'shadow-hunter-chronicles',
            description: 'An epic fantasy adventure following the journey of a young shadow hunter.',
            cover_image_url: 'https://picsum.photos/300/400',
            banner_image_url: 'https://picsum.photos/800/300',
            status: 'ongoing',
            genre: ['Fantasy', 'Adventure', 'Action'],
            tags: ['magic', 'heroes', 'quest'],
            age_rating: 'teen',
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
                role: 'writer',
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
          }
        ];
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
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      return data || [];
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

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching series by slug:', error);
      return null;
    }
  }

  static async createSeries(series: Omit<ComicSeries, 'id' | 'created_at' | 'updated_at' | 'total_episodes' | 'total_pages'>): Promise<ComicSeries> {
    try {
      if (shouldUseLocalStorage()) {
        const newSeries: ComicSeries = {
          id: `series-${Date.now()}`,
          ...series,
          total_episodes: 0,
          total_pages: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return newSeries;
      }

      const { data, error } = await supabase
        .from('comic_series')
        .insert(series)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating series:', error);
      throw error;
    }
  }

  static async updateSeries(id: string, updates: Partial<ComicSeries>): Promise<ComicSeries> {
    try {
      if (shouldUseLocalStorage()) {
        return {
          id,
          ...updates,
          updated_at: new Date().toISOString()
        } as ComicSeries;
      }

      const { data, error } = await supabase
        .from('comic_series')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating series:', error);
      throw error;
    }
  }

  static async deleteSeries(id: string): Promise<void> {
    try {
      if (shouldUseLocalStorage()) {
        return;
      }

      const { error } = await supabase
        .from('comic_series')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting series:', error);
      throw error;
    }
  }

  // Episode Management
  static async getEpisodes(seriesId?: string): Promise<ComicEpisode[]> {
    try {
      if (shouldUseLocalStorage()) {
        // Return mock data for local auth
        return [
          {
            id: 'episode-1',
            series_id: 'series-1',
            episode_number: 1,
            title: 'The Beginning',
            description: 'Our hero discovers their powers and embarks on their first adventure.',
            cover_image_url: 'https://picsum.photos/200/300',
            total_pages: 24,
            is_free: true,
            coin_price: 0,
            is_published: true,
            published_at: new Date().toISOString(),
            is_active: true,
            display_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'episode-2',
            series_id: 'series-1',
            episode_number: 2,
            title: 'The Journey Continues',
            description: 'The adventure deepens as new challenges arise.',
            cover_image_url: 'https://picsum.photos/200/300',
            total_pages: 22,
            is_free: false,
            coin_price: 10,
            is_published: true,
            published_at: new Date().toISOString(),
            is_active: true,
            display_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
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
      return data || [];
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
      return data;
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
        return {
          id,
          ...updates,
          updated_at: new Date().toISOString()
        } as ComicEpisode;
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
  static async getPages(episodeId: string): Promise<ComicPage[]> {
    try {
      if (shouldUseLocalStorage()) {
        // Return mock data for local auth
        return Array.from({ length: 24 }, (_, i) => ({
          id: `page-${i + 1}`,
          episode_id: episodeId,
          page_number: i + 1,
          image_url: `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`,
          thumbnail_url: `/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png`,
          alt_text: `Page ${i + 1}`,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
      }

      const { data, error } = await supabase
        .from('comic_pages')
        .select('*')
        .eq('episode_id', episodeId)
        .eq('is_active', true)
        .order('page_number');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pages:', error);
      return [];
    }
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
        return newPage;
      }

      const { data, error } = await supabase
        .from('comic_pages')
        .insert(page)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  }

  static async updatePage(id: string, updates: Partial<ComicPage>): Promise<ComicPage> {
    try {
      if (shouldUseLocalStorage()) {
        return {
          id,
          ...updates,
          updated_at: new Date().toISOString()
        } as ComicPage;
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
      return data || [];
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
      return data;
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
