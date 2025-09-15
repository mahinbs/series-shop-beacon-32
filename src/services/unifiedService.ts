import { supabase } from '@/integrations/supabase/client';

// Unified service that handles both Supabase and local storage
export class UnifiedService {
  private static isSupabaseAvailable = true;

  // Test Supabase connection
  static async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await (supabase as any)
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
        const { data, error } = await (supabase as any)
          .from(tableName)
          .select(query || '*');
        
        if (!error && data) {
          return data as T[];
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
    data: any
  ): Promise<T> {
    try {
      // Try Supabase first
      if (this.isSupabaseAvailable) {
        const { data: newData, error } = await (supabase as any)
          .from(tableName)
          .insert(data)
          .select()
          .single();
        
        if (!error && newData) {
          // Successfully created in Supabase
          return newData as T;
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
        const { data: updatedData, error } = await (supabase as any)
          .from(tableName)
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        
        if (!error && updatedData) {
          // Successfully updated in Supabase
          return updatedData as T;
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
        const { error } = await (supabase as any)
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

  // Legacy support methods (matching the previous interface)
  static async getItems<T>(tableName: string, fields?: string): Promise<T[]> {
    return this.getData<T>(tableName, tableName, fields);
  }

  static async createItem<T>(tableName: string, item: any): Promise<T | null> {
    try {
      return await this.createData<T>(tableName, tableName, item);
    } catch (error) {
      console.error(`Error creating item in ${tableName}:`, error);
      return null;
    }
  }

  static async updateItem<T>(tableName: string, id: string, updates: Partial<T>): Promise<T | null> {
    try {
      return await this.updateData<T>(tableName, tableName, id, updates);
    } catch (error) {
      console.error(`Error updating item in ${tableName}:`, error);
      return null;
    }
  }

  static async deleteItem(tableName: string, id: string): Promise<boolean> {
    try {
      await this.deleteData(tableName, tableName, id);
      return true;
    } catch (error) {
      console.error(`Error deleting item from ${tableName}:`, error);
      return false;
    }
  }

  static async getItemById<T>(tableName: string, id: string): Promise<T | null> {
    try {
      const { data, error } = await (supabase as any)
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Error fetching item from ${tableName}:`, error);
        return null;
      }

      return data as T;
    } catch (error) {
      console.error(`Error in getItemById for ${tableName}:`, error);
      return null;
    }
  }
}

// Initialize connection test
UnifiedService.testConnection();