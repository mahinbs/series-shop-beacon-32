import { supabase } from '@/integrations/supabase/client';

export const checkCreativeSnippetsDatabase = async () => {
  try {
    console.log('Checking Creative Snippets database tables...');
    
    // Check if creative_snippets_section table exists
    const { data: sectionData, error: sectionError } = await supabase
      .from('creative_snippets_section')
      .select('*')
      .limit(1);
    
    if (sectionError) {
      console.error('creative_snippets_section table error:', sectionError);
      return { sectionExists: false, itemsExist: false, error: sectionError.message };
    }
    
    console.log('creative_snippets_section table exists:', sectionData);
    
    // Check if creative_snippets_items table exists
    const { data: itemsData, error: itemsError } = await supabase
      .from('creative_snippets_items')
      .select('*')
      .limit(1);
    
    if (itemsError) {
      console.error('creative_snippets_items table error:', itemsError);
      return { sectionExists: true, itemsExist: false, error: itemsError.message };
    }
    
    console.log('creative_snippets_items table exists:', itemsData);
    
    return { 
      sectionExists: true, 
      itemsExist: true, 
      sectionCount: sectionData?.length || 0,
      itemsCount: itemsData?.length || 0
    };
    
  } catch (error) {
    console.error('Database check failed:', error);
    return { sectionExists: false, itemsExist: false, error: 'Database connection failed' };
  }
};
