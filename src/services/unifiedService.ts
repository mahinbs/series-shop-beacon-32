import { supabase } from '@/integrations/supabase/client';

// Unified service that handles both Supabase and local storage
export class UnifiedService {
  private static isSupabaseAvailable = true;

  // Test Supabase connection
  static async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('count')
        .limit(1);
      
      if (error) {
        this.isSupabaseAvailable = false;
        return false;
      }
      
      this.isSupabaseAvailable = true;
      return true;
    } catch (error) {
      this.isSupabaseAvailable = false;
      return false;
    }
  }

  // Generic CRUD operations with fallback
  static async getData<T>(
    tableName: string, 
    localStorageKey: string,
    query?: string
  ): Promise<T[]> {
    try {
      // Try Supabase first
      if (this.isSupabaseAvailable) {
        const { data, error } = await supabase
          .from(tableName)
          .select(query || '*');
        
        if (!error && data) {
          return data;
        }
      }
    } catch (error) {
      // Supabase connection failed, using local storage
    }
    
    // Fallback to local storage
    try {
      const storedData = localStorage.getItem(localStorageKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        return parsedData;
      }
    } catch (error) {
      console.error(`Error loading ${tableName} from localStorage:`, error);
    }
    
    return [];
  }

  static async createData<T>(
    tableName: string,
    localStorageKey: string,
    data: Omit<T, 'id' | 'created_at' | 'updated_at'>
  ): Promise<T> {
    try {
      // Try Supabase first
      if (this.isSupabaseAvailable) {
        const { data: newData, error } = await supabase
          .from(tableName)
          .insert(data)
          .select()
          .single();
        
        if (!error && newData) {
          // Successfully created in Supabase
          return newData;
        } else {
          // Supabase error, falling back to local storage
        }
      }
    } catch (error) {
      // Supabase connection failed, using local storage
    }
    
    // Fallback to local storage
    const existingData = await this.getData<T>(tableName, localStorageKey);
    const newItem = {
      id: `${tableName}-${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as T;
    
    const updatedData = [...existingData, newItem];
    localStorage.setItem(localStorageKey, JSON.stringify(updatedData));
    console.log(`💾 Created ${tableName} in localStorage:`, newItem);
    
    return newItem;
  }

  static async updateData<T>(
    tableName: string,
    localStorageKey: string,
    id: string,
    updates: Partial<T>
  ): Promise<T> {
    try {
      // Try Supabase first
      if (this.isSupabaseAvailable) {
        const { data: updatedData, error } = await supabase
          .from(tableName)
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        
        if (!error && updatedData) {
          // Successfully updated in Supabase
          return updatedData;
        } else {
          // Supabase error, falling back to local storage
        }
      }
    } catch (error) {
      // Supabase connection failed, using local storage
    }
    
    // Fallback to local storage
    const existingData = await this.getData<T>(tableName, localStorageKey);
    const itemIndex = existingData.findIndex((item: any) => item.id === id);
    
    if (itemIndex === -1) {
      throw new Error(`${tableName} item not found`);
    }
    
    const updatedItem = {
      ...existingData[itemIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    existingData[itemIndex] = updatedItem;
    localStorage.setItem(localStorageKey, JSON.stringify(existingData));
    console.log(`💾 Updated ${tableName} in localStorage:`, updatedItem);
    
    return updatedItem;
  }

  static async deleteData<T>(
    tableName: string,
    localStorageKey: string,
    id: string
  ): Promise<void> {
    try {
      // Try Supabase first
      if (this.isSupabaseAvailable) {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq('id', id);
        
        if (!error) {
          // Successfully deleted from Supabase
          return;
        } else {
          // Supabase error, falling back to local storage
        }
      }
    } catch (error) {
      // Supabase connection failed, using local storage
    }
    
    // Fallback to local storage
    const existingData = await this.getData<T>(tableName, localStorageKey);
    const filteredData = existingData.filter((item: any) => item.id !== id);
    localStorage.setItem(localStorageKey, JSON.stringify(filteredData));
    console.log(`💾 Deleted ${tableName} from localStorage`);
  }
}

// Initialize connection test
UnifiedService.testConnection();
