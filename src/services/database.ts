import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type BooksTable = Tables['books'];
type HeroBannersTable = Tables['hero_banners'];
type AnnouncementsTable = Tables['announcements'];
type PageSectionsTable = Tables['page_sections'];
type ProfilesTable = Tables['profiles'];
type UserRolesTable = Tables['user_roles'];

export type Book = BooksTable['Row'];
export type BookInsert = BooksTable['Insert'];
export type BookUpdate = BooksTable['Update'];

export type HeroBanner = HeroBannersTable['Row'];
export type HeroBannerInsert = HeroBannersTable['Insert'];
export type HeroBannerUpdate = HeroBannersTable['Update'];

export type Announcement = AnnouncementsTable['Row'];
export type AnnouncementInsert = AnnouncementsTable['Insert'];
export type AnnouncementUpdate = AnnouncementsTable['Update'];

export type PageSection = PageSectionsTable['Row'];
export type PageSectionInsert = PageSectionsTable['Insert'];
export type PageSectionUpdate = PageSectionsTable['Update'];

export type Profile = ProfilesTable['Row'];
export type ProfileInsert = ProfilesTable['Insert'];
export type ProfileUpdate = ProfilesTable['Update'];

export type UserRole = UserRolesTable['Row'];
export type UserRoleInsert = UserRolesTable['Insert'];
export type UserRoleUpdate = UserRolesTable['Update'];

// Test function to verify database connectivity
export const testDatabaseConnection = async () => {
  try {
    
    // Test if books table exists
    const { data, error } = await supabase
      .from('books')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Database connection test failed:', error);
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
    
    return {
      success: true,
      message: 'Database connection successful'
    };
  } catch (error) {
    console.error('Database connection test error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Books Service
export const booksService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .or('is_volume.is.null,is_volume.eq.false')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching all books:', error);
        throw new Error(`Failed to fetch books: ${error.message}`);
      }
      return data || [];
    } catch (error) {
      console.error('Books service getAll error:', error);
      throw error;
    }
  },

  async getActive() {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_active', true)
        .or('is_volume.is.null,is_volume.eq.false')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching active books:', error);
        throw new Error(`Failed to fetch active books: ${error.message}`);
      }
      return data || [];
    } catch (error) {
      console.error('Books service getActive error:', error);
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching book by ID:', error);
        throw new Error(`Failed to fetch book: ${error.message}`);
      }
      return data;
    } catch (error) {
      console.error('Books service getById error:', error);
      throw error;
    }
  },

  async create(book: BookInsert) {
    try {
      
      // Ensure required fields are present
      const bookData = {
        title: book.title,
        author: book.author || '',
        category: book.category,
        product_type: book.product_type || 'book',
        price: book.price,
        original_price: book.original_price,
        coins: book.coins,
        cover_page_url: book.cover_page_url,
        image_url: book.image_url,
        hover_image_url: book.hover_image_url,
        description: book.description,
        can_unlock_with_coins: book.can_unlock_with_coins || false,
        section_type: book.section_type || 'new-releases',
        label: book.label,
        is_new: book.is_new || false,
        is_on_sale: book.is_on_sale || false,
        display_order: book.display_order || 0,
        is_active: book.is_active !== undefined ? book.is_active : true,
        stock_quantity: book.stock_quantity || 0,
        sku: book.sku,
        weight: book.weight,
        dimensions: book.dimensions,
        tags: book.tags || [],
      };

      const { data, error } = await supabase
        .from('books')
        .insert([bookData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating book:', error);
        if (error.code === '42P01') {
          throw new Error('Books table does not exist. Please run the database setup script.');
        } else if (error.code === '42501') {
          throw new Error('Permission denied. Please check RLS policies.');
        } else {
          throw new Error(`Failed to create book: ${error.message}`);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Books service create error:', error);
      throw error;
    }
  },

  async update(id: string, updates: BookUpdate) {
    try {
      
      const { data, error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating book:', error);
        if (error.code === '42P01') {
          throw new Error('Books table does not exist. Please run the database setup script.');
        } else if (error.code === '42501') {
          throw new Error('Permission denied. Please check RLS policies.');
        } else {
          throw new Error(`Failed to update book: ${error.message}`);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Books service update error:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting book:', error);
        if (error.code === '42P01') {
          throw new Error('Books table does not exist. Please run the database setup script.');
        } else if (error.code === '42501') {
          throw new Error('Permission denied. Please check RLS policies.');
        } else {
          throw new Error(`Failed to delete book: ${error.message}`);
        }
      }
      
    } catch (error) {
      console.error('Books service delete error:', error);
      throw error;
    }
  },

  async getBySection(sectionType: string) {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('section_type', sectionType)
        .eq('is_active', true)
        .or('is_volume.is.null,is_volume.eq.false')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching books by section:', error);
        throw new Error(`Failed to fetch books by section: ${error.message}`);
      }
      return data || [];
    } catch (error) {
      console.error('Books service getBySection error:', error);
      throw error;
    }
  },

  async getByProductType(productType: string) {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('product_type', productType)
        .eq('is_active', true)
        .or('is_volume.is.null,is_volume.eq.false')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching books by product type:', error);
        throw new Error(`Failed to fetch books by product type: ${error.message}`);
      }
      return data || [];
    } catch (error) {
      console.error('Books service getByProductType error:', error);
      throw error;
    }
  },

  // Admin methods that include volumes
  async getAllIncludingVolumes() {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching all books including volumes:', error);
        throw new Error(`Failed to fetch books: ${error.message}`);
      }
      return data || [];
    } catch (error) {
      console.error('Books service getAllIncludingVolumes error:', error);
      throw error;
    }
  },

  async getActiveIncludingVolumes() {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching active books including volumes:', error);
        throw new Error(`Failed to fetch active books: ${error.message}`);
      }
      return data || [];
    } catch (error) {
      console.error('Books service getActiveIncludingVolumes error:', error);
      throw error;
    }
  },

  // Volume management functions
  async getVolumes(parentBookId: string) {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('parent_book_id', parentBookId)
        .eq('is_volume', true)
        .eq('is_active', true)
        .order('volume_number', { ascending: true });
      
      if (error) {
        console.error('Error fetching book volumes:', error);
        throw new Error(`Failed to fetch book volumes: ${error.message}`);
      }
      return data || [];
    } catch (error) {
      console.error('Books service getVolumes error:', error);
      throw error;
    }
  },

  async createVolume(parentBookId: string, volumeData: Partial<BookInsert> & { volume_number: number }) {
    try {
      // Get parent book data to inherit image and other properties
      const parentBook = await this.getById(parentBookId);
      
      const volumeBookData = {
        title: `${parentBook.title}, Vol.${volumeData.volume_number}`,
        author: parentBook.author,
        category: parentBook.category,
        product_type: parentBook.product_type || 'book',
        price: volumeData.price || parentBook.price,
        original_price: volumeData.original_price || parentBook.original_price,
        coins: volumeData.coins || parentBook.coins,
        image_url: volumeData.image_url || parentBook.image_url, // Use custom volume image or inherit parent's image
        hover_image_url: parentBook.hover_image_url,
        cover_page_url: parentBook.cover_page_url,
        description: volumeData.description || parentBook.description,
        can_unlock_with_coins: volumeData.can_unlock_with_coins || parentBook.can_unlock_with_coins,
        section_type: parentBook.section_type,
        label: volumeData.label,
        is_new: volumeData.is_new || false,
        is_on_sale: volumeData.is_on_sale || false,
        display_order: volumeData.display_order || 0,
        is_active: volumeData.is_active !== undefined ? volumeData.is_active : true,
        stock_quantity: volumeData.stock_quantity || 0,
        sku: volumeData.sku,
        weight: volumeData.weight || parentBook.weight,
        dimensions: volumeData.dimensions || parentBook.dimensions,
        tags: volumeData.tags || parentBook.tags || [],
        // Volume-specific fields
        parent_book_id: parentBookId,
        volume_number: volumeData.volume_number,
        is_volume: true,
        series_title: volumeData.series_title || parentBook.title
      };

      const { data, error } = await supabase
        .from('books')
        .insert([volumeBookData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating book volume:', error);
        throw new Error(`Failed to create book volume: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Books service createVolume error:', error);
      throw error;
    }
  },


  async updateVolume(volumeId: string, volumeData: Partial<BookInsert>) {
    try {
      // Get the current volume to get parent book info
      const { data: currentVolume, error: fetchError } = await supabase
        .from('books')
        .select('parent_book_id, volume_number')
        .eq('id', volumeId)
        .eq('is_volume', true)
        .single();

      if (fetchError) {
        console.error('Error fetching current volume:', fetchError);
        throw new Error(`Failed to fetch current volume: ${fetchError.message}`);
      }

      // Get parent book to update title
      const parentBook = await this.getById(currentVolume.parent_book_id);
      
      // Update the title if volume number changed
      const updatedData = {
        ...volumeData,
        title: `${parentBook.title}, Vol.${volumeData.volume_number || currentVolume.volume_number}`
      };

      const { data, error } = await supabase
        .from('books')
        .update(updatedData)
        .eq('id', volumeId)
        .eq('is_volume', true)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating volume:', error);
        throw new Error(`Failed to update volume: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Books service updateVolume error:', error);
      throw error;
    }
  },

  async deleteVolume(volumeId: string) {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', volumeId)
        .eq('is_volume', true);
      
      if (error) {
        console.error('Error deleting book volume:', error);
        throw new Error(`Failed to delete book volume: ${error.message}`);
      }
    } catch (error) {
      console.error('Books service deleteVolume error:', error);
      throw error;
    }
  }
};

// Hero Banners Service
export const heroBannersService = {
  async getAll() {
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getActive() {
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(banner: HeroBannerInsert) {
    const { data, error } = await supabase
      .from('hero_banners')
      .insert([banner])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: HeroBannerUpdate) {
    const { data, error } = await supabase
      .from('hero_banners')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('hero_banners')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Announcements Service
export const announcementsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getActive() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(announcement: AnnouncementInsert) {
    const { data, error } = await supabase
      .from('announcements')
      .insert([announcement])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: AnnouncementUpdate) {
    const { data, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Page Sections Service
export const pageSectionsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('page_sections')
      .select('*')
      .order('page_name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getByPage(pageName: string) {
    const { data, error } = await supabase
      .from('page_sections')
      .select('*')
      .eq('page_name', pageName)
      .order('section_name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('page_sections')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(section: PageSectionInsert) {
    const { data, error } = await supabase
      .from('page_sections')
      .insert([section])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: PageSectionUpdate) {
    const { data, error } = await supabase
      .from('page_sections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('page_sections')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Profiles Service
export const profilesService = {
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(profile: ProfileInsert) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(userId: string, updates: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// User Roles Service
export const userRolesService = {
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  },

  async create(role: UserRoleInsert) {
    const { data, error } = await supabase
      .from('user_roles')
      .insert([role])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(userId: string, role: 'admin' | 'user') {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);
    
    if (error) throw error;
  },

  async isAdmin(userId: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
};

// Utility function to check if user is admin
export const checkAdminRole = async (userId: string): Promise<boolean> => {
  try {
    return await userRolesService.isAdmin(userId);
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};
