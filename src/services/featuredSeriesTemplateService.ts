import { supabase } from '@/integrations/supabase/client';
import { FeaturedSeriesConfig, FeaturedSeriesBadge } from './featuredSeriesService';

export interface FeaturedSeriesTemplate {
  id: string;
  name: string;
  description: string;
  template_type: 'config' | 'badge' | 'combined';
  config_data: {
    configs: FeaturedSeriesConfig[];
  };
  badge_data: {
    badges: FeaturedSeriesBadge[];
  };
  is_default: boolean;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateHistory {
  id: string;
  template_id: string;
  action: 'created' | 'updated' | 'applied' | 'restored';
  previous_data: any;
  new_data: any;
  applied_by: string;
  applied_at: string;
}

export class FeaturedSeriesTemplateService {
  // Clear template cache
  static clearCache(): void {
    console.log('🗑️ Clearing Featured Series Templates cache...');
    localStorage.removeItem('featured_series_templates');
    localStorage.removeItem('featured_series_template_history');
    console.log('✅ Featured Series Templates cache cleared');
  }

  // Get all templates
  static async getTemplates(): Promise<FeaturedSeriesTemplate[]> {
    try {
      console.log('📋 Getting featured series templates...');
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('featured_series_templates')
          .select('*')
          .eq('is_active', true)
          .order('is_default', { ascending: false })
          .order('created_at', { ascending: false });

        if (!error && data) {
          console.log(`✅ Successfully loaded ${data.length} templates from Supabase`);
          // Update local storage with fresh data from Supabase
          localStorage.setItem('featured_series_templates', JSON.stringify(data));
          return data;
        } else {
          // Check if it's a table not found error
          if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
            console.log('📋 Featured series templates table not found - run FEATURED_SERIES_TEMPLATES_SETUP.sql to create it');
          } else {
            console.log('⚠️ Supabase error, falling back to local storage:', error);
          }
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedTemplates = localStorage.getItem('featured_series_templates');
      if (storedTemplates) {
        const templates = JSON.parse(storedTemplates);
        console.log(`✅ Loaded ${templates.length} templates from local storage`);
        return templates;
      }
      
      // Return default templates if nothing is stored
      return this.getDefaultTemplates();
    } catch (error) {
      console.error('❌ Error getting templates:', error);
      return this.getDefaultTemplates();
    }
  }

  // Get template by ID
  static async getTemplate(id: string): Promise<FeaturedSeriesTemplate | null> {
    try {
      console.log('📋 Getting template by ID:', id);
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('featured_series_templates')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          console.log('✅ Successfully loaded template from Supabase:', data);
          return data;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedTemplates = localStorage.getItem('featured_series_templates');
      if (storedTemplates) {
        const templates = JSON.parse(storedTemplates);
        const template = templates.find((t: FeaturedSeriesTemplate) => t.id === id);
        if (template) {
          console.log('✅ Found template in local storage:', template);
          return template;
        }
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error getting template:', error);
      return null;
    }
  }

  // Save template
  static async saveTemplate(templateData: Partial<FeaturedSeriesTemplate>): Promise<FeaturedSeriesTemplate> {
    try {
      console.log('💾 Saving featured series template...');
      
      const template: FeaturedSeriesTemplate = {
        id: templateData.id || crypto.randomUUID(),
        name: templateData.name || 'Untitled Template',
        description: templateData.description || '',
        template_type: templateData.template_type || 'combined',
        config_data: templateData.config_data || { configs: [] },
        badge_data: templateData.badge_data || { badges: [] },
        is_default: templateData.is_default || false,
        is_active: templateData.is_active !== false,
        created_by: templateData.created_by || 'admin',
        created_at: templateData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('featured_series_templates')
          .upsert(template)
          .select()
          .single();

        if (!error && data) {
          console.log('✅ Successfully saved template to Supabase:', data);
          return data;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedTemplates = localStorage.getItem('featured_series_templates');
      const existingTemplates = storedTemplates ? JSON.parse(storedTemplates) : [];
      
      const existingIndex = existingTemplates.findIndex((t: FeaturedSeriesTemplate) => t.id === template.id);
      if (existingIndex !== -1) {
        existingTemplates[existingIndex] = template;
      } else {
        existingTemplates.push(template);
      }
      
      localStorage.setItem('featured_series_templates', JSON.stringify(existingTemplates));
      console.log('✅ Saved template to local storage:', template);
      return template;
    } catch (error) {
      console.error('❌ Error saving template:', error);
      throw error;
    }
  }

  // Apply template (restore configurations and badges)
  static async applyTemplate(templateId: string): Promise<{ configs: FeaturedSeriesConfig[], badges: FeaturedSeriesBadge[] }> {
    try {
      console.log('🔄 Applying template:', templateId);
      
      const template = await this.getTemplate(templateId);
      if (!template) {
        throw new Error('Template not found');
      }
      
      const configs = template.config_data?.configs || [];
      const badges = template.badge_data?.badges || [];
      
      // Save to history before applying
      await this.saveTemplateHistory(templateId, 'applied', null, { configs, badges });
      
      console.log(`✅ Applied template: ${configs.length} configs, ${badges.length} badges`);
      return { configs, badges };
    } catch (error) {
      console.error('❌ Error applying template:', error);
      throw error;
    }
  }

  // Save current state as "Before Template"
  static async saveBeforeTemplate(configs: FeaturedSeriesConfig[], badges: FeaturedSeriesBadge[]): Promise<FeaturedSeriesTemplate> {
    try {
      console.log('💾 Saving current state as "Before Template"...');
      
      const beforeTemplate: Partial<FeaturedSeriesTemplate> = {
        name: 'Before Template',
        description: 'Template capturing the current state before any changes. Use this to restore the original configuration.',
        template_type: 'combined',
        config_data: { configs },
        badge_data: { badges },
        is_default: true,
        is_active: true,
        created_by: 'admin'
      };
      
      return await this.saveTemplate(beforeTemplate);
    } catch (error) {
      console.error('❌ Error saving before template:', error);
      throw error;
    }
  }

  // Delete template
  static async deleteTemplate(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting template:', id);
      
      // Try Supabase first
      try {
        const { error } = await supabase
          .from('featured_series_templates')
          .delete()
          .eq('id', id);

        if (!error) {
          console.log('✅ Successfully deleted template from Supabase');
          return;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedTemplates = localStorage.getItem('featured_series_templates');
      if (storedTemplates) {
        const templates = JSON.parse(storedTemplates);
        const filteredTemplates = templates.filter((t: FeaturedSeriesTemplate) => t.id !== id);
        localStorage.setItem('featured_series_templates', JSON.stringify(filteredTemplates));
        console.log('✅ Deleted template from local storage');
      }
    } catch (error) {
      console.error('❌ Error deleting template:', error);
      throw error;
    }
  }

  // Save template history
  static async saveTemplateHistory(
    templateId: string, 
    action: string, 
    previousData: any, 
    newData: any
  ): Promise<void> {
    try {
      const historyEntry: TemplateHistory = {
        id: crypto.randomUUID(),
        template_id: templateId,
        action: action as any,
        previous_data: previousData,
        new_data: newData,
        applied_by: 'admin',
        applied_at: new Date().toISOString()
      };
      
      // Try Supabase first
      try {
        const { error } = await supabase
          .from('featured_series_template_history')
          .insert(historyEntry);

        if (!error) {
          console.log('✅ Saved template history to Supabase');
          return;
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }
      
      // Fallback to local storage
      const storedHistory = localStorage.getItem('featured_series_template_history');
      const existingHistory = storedHistory ? JSON.parse(storedHistory) : [];
      existingHistory.push(historyEntry);
      localStorage.setItem('featured_series_template_history', JSON.stringify(existingHistory));
      console.log('✅ Saved template history to local storage');
    } catch (error) {
      console.error('❌ Error saving template history:', error);
    }
  }

  // Get default templates
  private static getDefaultTemplates(): FeaturedSeriesTemplate[] {
    return [
      {
        id: 'default-before',
        name: 'Before Template',
        description: 'Template capturing the current state before any changes. Use this to restore the original configuration.',
        template_type: 'combined',
        config_data: {
          configs: [
            {
              id: 'default-config-1',
              title: 'Featured Series Spotlight',
              description: 'Discover our most popular and trending comic series. From action-packed adventures to heartwarming stories, find your next favorite read.',
              background_image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=600&fit=crop',
              primary_button_text: 'Explore Series',
              primary_button_link: '/series',
              secondary_button_text: 'View All',
              secondary_button_link: '/comics',
              is_active: true,
              display_order: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        },
        badge_data: {
          badges: [
            {
              id: 'default-badge-1',
              name: 'Trending',
              color: '#EF4444',
              text_color: 'text-white',
              is_active: true,
              display_order: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 'default-badge-2',
              name: 'New',
              color: '#10B981',
              text_color: 'text-white',
              is_active: true,
              display_order: 2,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        },
        is_default: true,
        is_active: true,
        created_by: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
}
