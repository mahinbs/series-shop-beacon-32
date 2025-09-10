import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';

interface PageSection {
  id: string;
  page_name: string;
  section_name: string;
  content: any;
  created_at: string;
  updated_at: string;
}

export const useCMS = () => {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useSupabaseAuth();

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // For local storage auth users, skip Supabase loading
        if (user && user.id && user.id.startsWith('local-')) {
          console.log('Using local storage auth, skipping CMS data loading');
          setSections([]);
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('page_sections')
          .select('*')
          .order('page_name', { ascending: true })
          .order('section_name', { ascending: true });

        if (!isMounted) return;

        if (error) {
          console.error('Error loading sections:', error);
          setSections([]);
        } else {
          setSections(data || []);
        }
      } catch (error) {
        console.error('Error loading sections:', error);
        if (isMounted) {
          setSections([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    
    // Set up real-time subscription (skip for local storage auth)
    let channel: any = null;
    if (!user || !user.id || !user.id.startsWith('local-')) {
      channel = supabase
        .channel('page_sections_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'page_sections'
          },
          (payload) => {
            if (!isMounted) return;
            
            if (payload.eventType === 'INSERT') {
              setSections(prev => [...prev, payload.new as PageSection]);
            } else if (payload.eventType === 'UPDATE') {
              setSections(prev => 
                prev.map(section => 
                  section.id === payload.new.id ? payload.new as PageSection : section
                )
              );
            } else if (payload.eventType === 'DELETE') {
              setSections(prev => 
                prev.filter(section => section.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();
    }

    // Add a timeout to prevent infinite loading (skip for local storage auth)
    let timeoutId: NodeJS.Timeout | null = null;
    if (!user || !user.id || !user.id.startsWith('local-')) {
      timeoutId = setTimeout(() => {
        if (isMounted && isLoading) {
          console.warn('CMS loading timeout - forcing completion');
          setIsLoading(false);
        }
      }, 5000); // 5 second timeout
    }

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [user]);

  const getSectionContent = (pageName: string, sectionName: string) => {
    const section = sections.find(
      s => s.page_name === pageName && s.section_name === sectionName
    );
    return section?.content || {};
  };

  const updateSectionContent = async (
    pageName: string, 
    sectionName: string, 
    content: any
  ) => {
    if (!user || !isAdmin) {
      throw new Error('Only admins can update content');
    }

    // For local storage auth users, simulate success
    if (user.id && user.id.startsWith('local-')) {
      console.log('Using local storage auth, simulating section creation');
      // Create a mock section object
      const newSection = {
        id: `local-${Date.now()}`,
        page_name: pageName,
        section_name: sectionName,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add to local state
      setSections(prev => [...prev, newSection]);
      return;
    }

    try {
      const { error } = await supabase
        .from('page_sections')
        .upsert({
          page_name: pageName,
          section_name: sectionName,
          content
        }, {
          onConflict: 'page_name,section_name'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating section:', error);
      throw error;
    }
  };

  const getSectionsByPage = (pageName: string) => {
    return sections.filter(s => s.page_name === pageName);
  };

  return {
    sections,
    isLoading,
    getSectionContent,
    updateSectionContent,
    getSectionsByPage,
  };
};