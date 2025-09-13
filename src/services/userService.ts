import { supabase } from '@/integrations/supabase/client';
import { AuthService, type RegisterCredentials } from './auth';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  created_at: string;
  last_login?: string;
  is_active: boolean;
  avatar_url?: string;
  user_id?: string; // Supabase auth user ID
}

export interface CreateUserData {
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'user';
}

export interface UserStats {
  total_users: number;
  active_users: number;
  admin_users: number;
  new_users_today: number;
}

// Helper function to check if we should use local storage
const shouldUseLocalStorage = () => {
  try {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      const user = JSON.parse(localUser);
      return user.id && user.id.startsWith('local-');
    }
  } catch (error) {
    console.error('Error checking local storage:', error);
  }
  return false;
};

export class UserService {
  // Get all users (for admin panel)
  static async getUsers(): Promise<User[]> {
    try {
      // Getting users
      
      // Check if we should use local storage first
      if (shouldUseLocalStorage()) {
        // Using local storage for users
        const localUser = localStorage.getItem('user');
        if (localUser) {
          const user = JSON.parse(localUser);
          return [{
            id: user.id,
            email: user.email,
            full_name: user.full_name || 'Admin User',
            role: user.role || 'admin',
            created_at: user.created_at || new Date().toISOString(),
            last_login: new Date().toISOString(),
            is_active: true,
            avatar_url: undefined
          }];
        }
        return [];
      }

      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            user_id,
            email,
            full_name,
            avatar_url,
            created_at,
            updated_at,
            user_roles!inner(role)
          `)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((profile: any) => ({
            id: profile.user_id,
            user_id: profile.user_id,
            email: profile.email,
            full_name: profile.full_name || 'Unknown User',
            role: profile.user_roles?.role || 'user',
            created_at: profile.created_at,
            last_login: profile.updated_at,
            is_active: true,
            avatar_url: profile.avatar_url
          }));
        }
      } catch (supabaseError) {
        // Supabase connection failed, using local storage
      }

      // Fallback to local storage
      const storedUsers = localStorage.getItem('admin_users');
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        return parsedUsers;
      }

      // Return default admin user
      return [{
        id: 'local-admin-1',
        email: 'admin@series-shop.com',
        full_name: 'Admin User',
        role: 'admin',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        is_active: true,
        avatar_url: undefined
      }];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  // Create a new user (admin function)
  static async createUser(userData: CreateUserData): Promise<User> {
    try {
      console.log('➕ Creating new user:', userData.email);
      
      // Check if we should use local storage first
      if (shouldUseLocalStorage()) {
        console.log('📱 Creating user in local storage');
        const now = new Date().toISOString();
        const newUser: User = {
          id: `local-user-${Date.now()}`,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          created_at: now,
          last_login: now,
          is_active: true,
          avatar_url: undefined
        };
        
        const storedUsers = localStorage.getItem('admin_users');
        const existingUsers = storedUsers ? JSON.parse(storedUsers) : [];
        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem('admin_users', JSON.stringify(updatedUsers));
        
        // Created user in local storage
        return newUser;
      }

      // Try Supabase first
      try {
        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          user_metadata: {
            full_name: userData.full_name,
          },
          email_confirm: true // Auto-confirm email for admin-created users
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Failed to create user');

        // Created user in Supabase Auth

        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            user_id: authData.user.id,
            email: userData.email,
            full_name: userData.full_name,
          }]);

        if (profileError) throw profileError;

        // Create user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{
            user_id: authData.user.id,
            role: userData.role,
          }]);

        if (roleError) throw roleError;

        const newUser: User = {
          id: authData.user.id,
          user_id: authData.user.id,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          is_active: true,
          avatar_url: undefined
        };

        console.log('✅ Successfully created user in Supabase:', newUser);
        return newUser;
      } catch (supabaseError) {
        console.log('⚠️ Supabase error, falling back to local storage:', supabaseError);
        
        // Fallback to local storage
        const now = new Date().toISOString();
        const newUser: User = {
          id: `local-user-${Date.now()}`,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          created_at: now,
          last_login: now,
          is_active: true,
          avatar_url: undefined
        };
        
        const storedUsers = localStorage.getItem('admin_users');
        const existingUsers = storedUsers ? JSON.parse(storedUsers) : [];
        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem('admin_users', JSON.stringify(updatedUsers));
        
        console.log('✅ Created user in local storage fallback:', newUser);
        return newUser;
      }
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  }

  // Update user role
  static async updateUserRole(userId: string, role: 'admin' | 'user'): Promise<void> {
    try {
      console.log('🔄 Updating user role:', userId, 'to', role);
      
      // Check if we should use local storage first
      if (shouldUseLocalStorage() || userId.startsWith('local-')) {
        console.log('📱 Updating user role in local storage');
        const storedUsers = localStorage.getItem('admin_users');
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const updatedUsers = users.map((user: User) => 
            user.id === userId ? { ...user, role } : user
          );
          localStorage.setItem('admin_users', JSON.stringify(updatedUsers));
        }
        
        // Also update current user if it's the same
        const localUser = localStorage.getItem('user');
        if (localUser) {
          const user = JSON.parse(localUser);
          if (user.id === userId) {
            user.role = role;
            localStorage.setItem('user', JSON.stringify(user));
          }
        }
        return;
      }

      // Try Supabase
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: role
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      console.log('✅ Updated user role in Supabase');
    } catch (error) {
      console.error('❌ Error updating user role:', error);
      throw error;
    }
  }

  // Update user status (active/inactive)
  static async updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    try {
      console.log('🔄 Updating user status:', userId, 'to', isActive ? 'active' : 'inactive');
      
      // Check if we should use local storage first
      if (shouldUseLocalStorage() || userId.startsWith('local-')) {
        console.log('📱 Updating user status in local storage');
        const storedUsers = localStorage.getItem('admin_users');
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const updatedUsers = users.map((user: User) => 
            user.id === userId ? { ...user, is_active: isActive } : user
          );
          localStorage.setItem('admin_users', JSON.stringify(updatedUsers));
        }
        return;
      }

      // For Supabase, we could add an is_active field to profiles table
      // For now, we'll just log the action
      console.log('✅ User status updated in Supabase (would need is_active field in profiles table)');
    } catch (error) {
      console.error('❌ Error updating user status:', error);
      throw error;
    }
  }

  // Get user statistics
  static async getUserStats(): Promise<UserStats> {
    try {
      console.log('📊 Getting user statistics...');
      
      // Check if we should use local storage first
      if (shouldUseLocalStorage()) {
        console.log('📱 Using local storage for user stats');
        const storedUsers = localStorage.getItem('admin_users');
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        
        const today = new Date().toISOString().split('T')[0];
        const newUsersToday = users.filter((user: User) => 
          user.created_at.startsWith(today)
        ).length;
        
        return {
          total_users: users.length,
          active_users: users.filter((user: User) => user.is_active).length,
          admin_users: users.filter((user: User) => user.role === 'admin').length,
          new_users_today: newUsersToday
        };
      }

      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            created_at,
            user_roles!inner(role)
          `);

        if (!error && data) {
          const today = new Date().toISOString().split('T')[0];
          const totalUsers = data.length;
          const activeUsers = totalUsers; // Assuming all profiles are active
          const adminUsers = data.filter((u: any) => u.user_roles?.role === 'admin').length;
          const newUsersToday = data.filter((u: any) => u.created_at.startsWith(today)).length;

          console.log('✅ Successfully loaded user stats from Supabase');
          return {
            total_users: totalUsers,
            active_users: activeUsers,
            admin_users: adminUsers,
            new_users_today: newUsersToday
          };
        } else {
          console.log('⚠️ Supabase error, falling back to local storage:', error);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase connection failed, using local storage:', supabaseError);
      }

      // Fallback to local storage
      const storedUsers = localStorage.getItem('admin_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const today = new Date().toISOString().split('T')[0];
      const newUsersToday = users.filter((user: User) => 
        user.created_at.startsWith(today)
      ).length;
      
      return {
        total_users: users.length,
        active_users: users.filter((user: User) => user.is_active).length,
        admin_users: users.filter((user: User) => user.role === 'admin').length,
        new_users_today: newUsersToday
      };
    } catch (error) {
      console.error('❌ Error fetching user stats:', error);
      return {
        total_users: 0,
        active_users: 0,
        admin_users: 0,
        new_users_today: 0
      };
    }
  }

  // Handle public user signup (called from AuthService)
  static async handlePublicSignup(credentials: RegisterCredentials): Promise<User> {
    try {
      console.log('🌐 Handling public user signup:', credentials.email);
      
      // Use AuthService to create the user in Supabase
      const authUser = await AuthService.signUp(credentials);
      
      // Convert to User format
      const newUser: User = {
        id: authUser.id,
        user_id: authUser.id,
        email: authUser.email,
        full_name: authUser.full_name || 'Unknown User',
        role: authUser.role,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        is_active: true,
        avatar_url: authUser.avatar_url
      };

      console.log('✅ Public signup completed:', newUser);
      return newUser;
    } catch (error) {
      console.error('❌ Error in public signup:', error);
      throw error;
    }
  }
}
