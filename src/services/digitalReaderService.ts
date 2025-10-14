import { supabase } from '@/integrations/supabase/client';

export interface DigitalReaderSpec {
  id: string;
  title: string;
  creator: string;
  creator_image_url?: string;
  creator_bio?: string;
  artist: string;
  artist_image_url?: string;
  release_date: string;
  category: string;
  age_rating: string;
  genre: string;
  length: number;
  description: string;
  cover_image_url: string;
  banner_image_url: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export class DigitalReaderService {
  // Clear cache
  static clearCache(): void {
    localStorage.removeItem('digital_reader_specs');
    console.log('🧹 Cleared digital reader specs cache');
  }

  // Get all digital reader specifications
  static async getSpecs(): Promise<DigitalReaderSpec[]> {
    try {
      console.log('📖 Getting digital reader specs...');
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('digital_reader_specs')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (!error && data) {
          console.log('✅ Successfully loaded specs from Supabase:', data);
          return data;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      console.log('📖 Getting specs from localStorage...');
      const storedSpecs = localStorage.getItem('digital_reader_specs');
      console.log('💾 Stored specs from localStorage:', storedSpecs);
      
      if (storedSpecs) {
        const parsedSpecs = JSON.parse(storedSpecs);
        console.log('📚 Parsed specs:', parsedSpecs);
        return parsedSpecs.filter((spec: DigitalReaderSpec) => spec.is_active);
      }

      console.log('🆕 No stored specs found, returning default data');
      
      // Return default mock data
      const defaultSpecs = [
        {
          id: 'spec-1',
          title: 'SKIP AND LOAFER',
          creator: 'YASUO TAKAMITSU',
          creator_image_url: '/lovable-uploads/creator-placeholder.png',
          creator_bio: 'Yasuo Takamitsu is a renowned manga artist known for his work on slice-of-life and romance series. He has been creating manga for over 15 years and is celebrated for his detailed character development and emotional storytelling.',
          artist: 'YASUO TAKAMITSU',
          artist_image_url: '/lovable-uploads/artist-placeholder.png',
          release_date: '2023-02-11',
          category: 'manga',
          age_rating: 'teen',
          genre: 'shojo',
          length: 280,
          description: 'Overall, Oshi no Ko is best described as a subversive, dramatic take on the idol industry in Japan, though it has some romantic plotlines as well. Protagonist Aqua Hoshino is more interested in pursuing his quest for vengeance in an exploitative industry, but he finds himself in the spotlight without even meaning to.',
          cover_image_url: '/lovable-uploads/4e6b2521-dc40-43e9-aed0-53fef670570b.png',
          banner_image_url: '/lovable-uploads/4e6b2521-dc40-43e9-aed0-53fef670570b.png',
          is_featured: true,
          is_active: true,
          display_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      localStorage.setItem('digital_reader_specs', JSON.stringify(defaultSpecs));
      return defaultSpecs;
    } catch (error) {
      console.error('Error fetching digital reader specs:', error);
      return [];
    }
  }

  // Get featured specifications
  static async getFeaturedSpecs(): Promise<DigitalReaderSpec[]> {
    try {
      const allSpecs = await this.getSpecs();
      return allSpecs.filter(spec => spec.is_featured);
    } catch (error) {
      console.error('Error fetching featured specs:', error);
      return [];
    }
  }

  // Get specification by ID
  static async getSpecById(id: string): Promise<DigitalReaderSpec | null> {
    try {
      const allSpecs = await this.getSpecs();
      return allSpecs.find(spec => spec.id === id) || null;
    } catch (error) {
      console.error('Error fetching spec by ID:', error);
      return null;
    }
  }

  // Create new specification
  static async createSpec(spec: Omit<DigitalReaderSpec, 'id' | 'created_at' | 'updated_at'>): Promise<DigitalReaderSpec> {
    try {
      console.log('➕ Creating new digital reader spec:', spec);
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('digital_reader_specs')
          .insert(spec)
          .select()
          .single();

        if (!error && data) {
          console.log('✅ Successfully created spec in Supabase:', data);
          return data;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedSpecs = localStorage.getItem('digital_reader_specs');
      const existingSpecs = storedSpecs ? JSON.parse(storedSpecs) : [];
      
      const newSpec: DigitalReaderSpec = {
        id: `spec-${Date.now()}`,
        ...spec,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('🆕 New spec created:', newSpec);
      const updatedSpecs = [...existingSpecs, newSpec];
      console.log('📝 Updated specs array:', updatedSpecs);
      
      localStorage.setItem('digital_reader_specs', JSON.stringify(updatedSpecs));
      console.log('💾 Spec saved to localStorage');
      
      return newSpec;
    } catch (error) {
      console.error('Error creating digital reader spec:', error);
      throw error;
    }
  }

  // Update specification
  static async updateSpec(id: string, updates: Partial<DigitalReaderSpec>): Promise<DigitalReaderSpec> {
    try {
      console.log('🔄 Updating digital reader spec with ID:', id);
      console.log('📝 Updates:', updates);
      
      // Try Supabase first
      try {
        // Filter out fields that shouldn't be updated
        const { id: _, created_at, updated_at, ...cleanUpdates } = updates;
        
        // Only include defined fields
        const validFields = [
          'title', 'creator', 'creator_image_url', 'creator_bio', 'artist', 
          'artist_image_url', 'release_date', 'category', 'age_rating', 
          'genre', 'length', 'description', 'cover_image_url', 'banner_image_url', 
          'is_featured', 'is_active', 'display_order'
        ];
        
        const cleanUpdateData: any = {};
        validFields.forEach(field => {
          if (updates[field as keyof DigitalReaderSpec] !== undefined) {
            cleanUpdateData[field] = updates[field as keyof DigitalReaderSpec];
          }
        });
        
        cleanUpdateData.updated_at = new Date().toISOString();
        
        console.log('🧹 Clean update data:', cleanUpdateData);
        
        const { data, error } = await supabase
          .from('digital_reader_specs')
          .update(cleanUpdateData)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          console.log('✅ Successfully updated spec in Supabase:', data);
          return data;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
          
          // If it's a "not found" error, try to create the record instead
          if (error?.code === 'PGRST116') {
            console.log('🔄 Record not found in Supabase, attempting to create new one...');
            try {
              const { data: newData, error: createError } = await supabase
                .from('digital_reader_specs')
                .insert({
                  id,
                  ...cleanUpdateData
                })
                .select()
                .single();
              
              if (!createError && newData) {
                console.log('✅ Successfully created spec in Supabase:', newData);
                return newData;
              } else {
                console.log('⚠️ Failed to create spec in Supabase:', createError);
              }
            } catch (createSupabaseError) {
              console.log('⚠️ Supabase create failed, using local storage:', createSupabaseError);
            }
          }
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedSpecs = localStorage.getItem('digital_reader_specs');
      const existingSpecs = storedSpecs ? JSON.parse(storedSpecs) : [];
      const specIndex = existingSpecs.findIndex(s => s.id === id);
      console.log('🔍 Spec index:', specIndex);
      
      if (specIndex === -1) {
        console.log('⚠️ Spec not found in local storage, creating new one with ID:', id);
        // Create a new spec with the provided ID and updates
        const newSpec: DigitalReaderSpec = {
          id,
          title: updates.title || 'Untitled Spec',
          creator: updates.creator || 'Unknown Creator',
          creator_image_url: updates.creator_image_url || '',
          creator_bio: updates.creator_bio || '',
          artist: updates.artist || 'Unknown Artist',
          artist_image_url: updates.artist_image_url || '',
          release_date: updates.release_date || new Date().toISOString().split('T')[0],
          category: updates.category || 'manga',
          age_rating: updates.age_rating || 'all',
          genre: updates.genre || 'action',
          length: updates.length || 0,
          description: updates.description || '',
          cover_image_url: updates.cover_image_url || '',
          banner_image_url: updates.banner_image_url || '',
          is_featured: updates.is_featured || false,
          is_active: updates.is_active !== undefined ? updates.is_active : true,
          display_order: updates.display_order || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        console.log('✅ Created new spec in local storage:', newSpec);
        const updatedSpecs = [...existingSpecs, newSpec];
        localStorage.setItem('digital_reader_specs', JSON.stringify(updatedSpecs));
        console.log('💾 New spec saved to localStorage');
        
        return newSpec;
      }
      
      const updatedSpec = {
        ...existingSpecs[specIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      console.log('✅ Updated spec:', updatedSpec);
      
      existingSpecs[specIndex] = updatedSpec;
      localStorage.setItem('digital_reader_specs', JSON.stringify(existingSpecs));
      console.log('💾 Spec saved to localStorage');
      
      return updatedSpec;
    } catch (error) {
      console.error('Error updating digital reader spec:', error);
      throw error;
    }
  }

  // Delete specification
  static async deleteSpec(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting digital reader spec with ID:', id);
      
      // Try Supabase first
      try {
        const { error } = await supabase
          .from('digital_reader_specs')
          .delete()
          .eq('id', id);

        if (!error) {
          console.log('✅ Successfully deleted spec from Supabase');
          return;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedSpecs = localStorage.getItem('digital_reader_specs');
      const existingSpecs = storedSpecs ? JSON.parse(storedSpecs) : [];
      const filteredSpecs = existingSpecs.filter(s => s.id !== id);
      localStorage.setItem('digital_reader_specs', JSON.stringify(filteredSpecs));
      console.log('💾 Spec deleted from localStorage');
    } catch (error) {
      console.error('Error deleting digital reader spec:', error);
      throw error;
    }
  }

  // Get a spec by slug
  static async getSpecBySlug(slugOrId: string) {
    // Try slug first
    try {
      const { data, error } = await (supabase as any)
        .from('digital_reader_specs')
        .select('*')
        .eq('slug', slugOrId)
        .eq('is_active', true)
        .single();
      if (!error && data) return data;
    } catch (_) {}
    // Fallback to id
    const { data } = await (supabase as any)
      .from('digital_reader_specs')
      .select('*')
      .eq('id', slugOrId)
      .eq('is_active', true)
      .single();
    return data;
  }

  // Episodes for a spec
  static async getEpisodes(specId: string) {
    const { data, error } = await (supabase as any)
      .from('digital_reader_episodes')
      .select('*')
      .eq('spec_id', specId)
      .eq('is_published', true)
      .order('chapter_number', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  static async getEpisodesCount(specId: string): Promise<number> {
    const { count, error } = await (supabase as any)
      .from('digital_reader_episodes')
      .select('*', { count: 'exact', head: true })
      .eq('spec_id', specId)
      .eq('is_published', true);
    if (error) return 0;
    return Number(count || 0);
  }

  static async getLatestEpisodeUpdate(specId: string): Promise<string | null> {
    const { data, error } = await (supabase as any)
      .from('digital_reader_episodes')
      .select('updated_at')
      .eq('spec_id', specId)
      .eq('is_published', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return data.updated_at as string;
  }

  // Get pages for an episode
  static async getEpisodePages(episodeId: string): Promise<Array<{ page_number: number; image_url: string }>> {
    const { data, error } = await (supabase as any)
      .from('digital_reader_pages')
      .select('page_number, image_url')
      .eq('episode_id', episodeId)
      .order('page_number');
    if (error) throw error;
    return (data || []).map((p: any) => ({ page_number: p.page_number, image_url: p.image_url }));
  }
  // Subscriber count via view
  static async getSubscriberCount(specId: string): Promise<number> {
    const { data, error } = await (supabase as any)
      .from('digital_reader_subscriber_counts')
      .select('subscriber_count')
      .eq('spec_id', specId)
      .single();
    if (error) return 0;
    return Number(data?.subscriber_count || 0);
  }

  static async subscribe(specId: string, userId: string) {
    const { error } = await (supabase as any)
      .from('digital_reader_subscriptions')
      .insert({ spec_id: specId, user_id: userId });
    if (error && !String(error.message).includes('duplicate')) throw error;
  }

  static async unsubscribe(specId: string, userId: string) {
    const { error } = await (supabase as any)
      .from('digital_reader_subscriptions')
      .delete()
      .eq('spec_id', specId)
      .eq('user_id', userId);
    if (error) throw error;
  }
}
