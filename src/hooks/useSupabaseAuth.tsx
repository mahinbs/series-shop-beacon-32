
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  // Alias fields for legacy code
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  // Accept legacy name/avatar keys and map them internally
  updateProfile: (updates: Partial<Profile> & { name?: string; avatar?: string }) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // Clear any old localStorage-only authentication data
      try {
        const oldUserData = localStorage.getItem('user');
        if (oldUserData) {
          const user = JSON.parse(oldUserData);
          if (user.id && user.id.startsWith('local-')) {
            console.log('🧹 Clearing old localStorage auth data');
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('admin_session');
            localStorage.removeItem('anonymous_cart');
          }
        }
      } catch (error) {
        console.error('Error checking old user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('admin_session');
        localStorage.removeItem('anonymous_cart');
      }

      // Check for existing Supabase session
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.user) {
          console.log('🔐 Found existing Supabase session:', currentSession.user.id);
          setSession(currentSession);
          setUser(currentSession.user);
          await Promise.all([
            loadUserProfile(currentSession.user.id),
            checkAdminRole(currentSession.user.id)
          ]);
          return;
        }
      } catch (error) {
        console.error('Error checking Supabase session:', error);
      }
      
      // No authentication found
      setIsLoading(false);
    };

    initializeAuth();

    // Fallback to Supabase auth if local storage fails
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to prevent deadlock
          setTimeout(async () => {
            await Promise.all([
              loadUserProfile(session.user.id),
              checkAdminRole(session.user.id)
            ]);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await Promise.all([
          loadUserProfile(session.user.id),
          checkAdminRole(session.user.id)
        ]);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        setIsLoading(false);
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          user_id: userId,
          email: user?.email || null,
          full_name: user?.user_metadata?.full_name || null,
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          setProfile(createdProfile);
        }
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
        return;
      }

      const adminStatus = !!data;
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error in checkAdminRole:', error);
      setIsAdmin(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      console.log('🔐 Starting Supabase signup for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName || 'User',
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      if (data.user) {
        console.log('✅ Supabase signup successful:', data.user.id);
        
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            user_id: data.user.id,
            email: email.trim().toLowerCase(),
            full_name: fullName || 'User',
          }]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        // Set admin role if admin email
        if (email.toLowerCase() === 'admin@series-shop.com' || email.toLowerCase() === 'venteskraft@gmail.com') {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert([{
              user_id: data.user.id,
              role: 'admin'
            }]);

          if (roleError) {
            console.error('Admin role assignment error:', roleError);
          }
        }
      }
      
    } catch (error: any) {
      console.error('❌ Supabase signup failed:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Starting Supabase signin for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      if (data.user) {
        console.log('✅ Supabase signin successful:', data.user.id);
        
        // Clear any old localStorage data
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('admin_session');
      }
      
    } catch (error: any) {
      console.error('❌ Supabase signin failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('🔐 Starting signout...');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signout error:', error);
      }
      
      // Clear localStorage completely
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('admin_session');
      localStorage.removeItem('anonymous_cart');
      
      // Clear state
      setUser(null);
      setIsAdmin(false);
      setProfile(null);
      setSession(null);
      
      console.log('✅ Signout completed');
    } catch (error) {
      console.error('❌ Signout failed:', error);
    }
  };

  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      
      // Clear state
      setUser(null);
      setIsAdmin(false);
      
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile> & { name?: string; avatar?: string }) => {
    if (!user || !profile) throw new Error('No user logged in');

    // Map legacy fields to new structure
    const profileUpdates = { ...updates };
    if (updates.name) {
      profileUpdates.full_name = updates.name;
      delete profileUpdates.name;
    }
    if (updates.avatar) {
      profileUpdates.avatar_url = updates.avatar;
      delete profileUpdates.avatar;
    }

    const { error } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('user_id', user.id);

    if (error) throw error;

    setProfile({ ...profile, ...profileUpdates });
  };

  const refreshProfile = async () => {
    if (!user) return;
    await loadUserProfile(user.id);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      isLoading,
      isAdmin,
      isAuthenticated: !!user,
      signUp,
      signIn,
      signOut,
      logout,
      updateProfile,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
