import { supabase } from '@/integrations/supabase/client';

export interface AboutUsHero {
  id: string;
  title: string;
  subtitle: string;
  background_image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AboutUsSection {
  id: string;
  section_key: 'about' | 'mission' | 'team';
  title: string;
  heading: string;
  main_text: string;
  subtext?: string;
  highlights: string[];
  additional_text?: string;
  closing_text?: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class AboutUsService {
  // Hero Section Methods
  static async getHeroContent(): Promise<AboutUsHero | null> {
    try {
      const { data, error } = await supabase
        .from('about_us_hero')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching hero content:', error);
        return null;
      }

      return data as AboutUsHero;
    } catch (error) {
      console.error('Error in getHeroContent:', error);
      return null;
    }
  }

  static async updateHeroContent(updates: Partial<Omit<AboutUsHero, 'id' | 'created_at' | 'updated_at'>>): Promise<AboutUsHero | null> {
    try {
      // First, get the current hero content
      const current = await this.getHeroContent();
      
      if (current) {
        // Update existing record
        const { data, error } = await supabase
          .from('about_us_hero')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', current.id)
          .select()
          .single();

        if (error) throw error;
        return data as AboutUsHero;
      } else {
        // Create new record if none exists
        const { data, error } = await supabase
          .from('about_us_hero')
          .insert({
            title: updates.title || 'About Crossed Hearts',
            subtitle: updates.subtitle || 'Default subtitle',
            background_image_url: updates.background_image_url || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570',
            is_active: true
          })
          .select()
          .single();

        if (error) throw error;
        return data as AboutUsHero;
      }
    } catch (error) {
      console.error('Error updating hero content:', error);
      return null;
    }
  }

  // Sections Methods
  static async getSections(): Promise<AboutUsSection[]> {
    try {
      const { data, error } = await supabase
        .from('about_us_sections')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) {
        console.error('Error fetching sections:', error);
        return [];
      }

      return (data as AboutUsSection[]) || [];
    } catch (error) {
      console.error('Error in getSections:', error);
      return [];
    }
  }

  static async getSection(sectionKey: string): Promise<AboutUsSection | null> {
    try {
      const { data, error } = await supabase
        .from('about_us_sections')
        .select('*')
        .eq('section_key', sectionKey)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching section:', error);
        return null;
      }

      return data as AboutUsSection;
    } catch (error) {
      console.error('Error in getSection:', error);
      return null;
    }
  }

  static async updateSection(sectionKey: string, updates: Partial<Omit<AboutUsSection, 'id' | 'section_key' | 'created_at' | 'updated_at'>>): Promise<AboutUsSection | null> {
    try {
      const { data, error } = await supabase
        .from('about_us_sections')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('section_key', sectionKey)
        .select()
        .single();

      if (error) throw error;
      return data as AboutUsSection;
    } catch (error) {
      console.error('Error updating section:', error);
      return null;
    }
  }

  static async createSection(sectionData: Omit<AboutUsSection, 'id' | 'created_at' | 'updated_at'>): Promise<AboutUsSection | null> {
    try {
      const { data, error } = await supabase
        .from('about_us_sections')
        .insert(sectionData)
        .select()
        .single();

      if (error) throw error;
      return data as AboutUsSection;
    } catch (error) {
      console.error('Error creating section:', error);
      return null;
    }
  }

  // Utility method to get all content formatted for frontend
  static async getAllContent(): Promise<{
    hero: AboutUsHero | null;
    sections: { [key: string]: AboutUsSection };
  }> {
    try {
      const [hero, sections] = await Promise.all([
        this.getHeroContent(),
        this.getSections()
      ]);

      const sectionsMap: { [key: string]: AboutUsSection } = {};
      sections.forEach(section => {
        sectionsMap[section.section_key] = section;
      });

      return {
        hero,
        sections: sectionsMap
      };
    } catch (error) {
      console.error('Error getting all content:', error);
      return {
        hero: null,
        sections: {}
      };
    }
  }
}
