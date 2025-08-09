import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDummyAuth } from './useDummyAuth';

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
  const { user } = useDummyAuth();

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setIsLoading(true);
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
    
    // Set up real-time subscription
    const channel = supabase
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

    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isMounted && isLoading) {
        console.warn('CMS loading timeout - forcing completion');
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
      clearTimeout(timeoutId);
    };
  }, []);

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
    if (!user) {
      throw new Error('Only admins can update content');
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