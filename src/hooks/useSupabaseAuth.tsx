
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
      // IMMEDIATELY clear any old user data that doesn't have the local- prefix
      try {
        const oldUserData = localStorage.getItem('user');
        if (oldUserData) {
          const user = JSON.parse(oldUserData);
          if (user.id && !user.id.startsWith('local-')) {
            console.log('🚨 CLEARING OLD USER DATA - User ID does not start with local-');
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('anonymous_cart'); // Also clear cart data
            console.log('✅ Old user data cleared successfully');
          }
        }
      } catch (error) {
        console.error('Error checking old user data:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('anonymous_cart');
      }

      // Check local storage first for bypass authentication
      const checkLocalAuth = () => {
        try {
          const isAuthenticated = localStorage.getItem('isAuthenticated');
          const userData = localStorage.getItem('user');
          
          if (isAuthenticated === 'true' && userData) {
            const user = JSON.parse(userData);
            console.log('Restoring user from local storage:', user);
            setUser(user);
            setProfile({
              id: user.id,
              user_id: user.id,
              email: user.email,
              full_name: user.full_name,
              avatar_url: user.avatar_url
            });
            setIsAdmin(user.role === 'admin');
            setIsLoading(false);
            return true;
          }
        } catch (error) {
          console.error('Error restoring auth from local storage:', error);
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('user');
        }
        return false;
      };

      // Try Supabase first (prioritize real authentication)
      console.log('Checking Supabase authentication...');
      
      // Only use local storage as fallback if Supabase fails
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.user) {
          console.log('Found Supabase session, using Supabase auth');
          setSession(currentSession);
          setUser(currentSession.user);
          await loadUserProfile(currentSession.user);
          return;
        }
      } catch (error) {
        console.log('Supabase auth check failed:', error);
      }
      
      // Fallback to local storage only if no Supabase session
      if (checkLocalAuth()) {
        console.log('No Supabase session, using local storage auth');
        return;
      }
      
      console.log('No authentication found, user needs to login');
    };

    initializeAuth();

    // Fallback to Supabase auth if local storage fails
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
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
      console.log('Initial session:', session?.user?.id);
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
      console.log('Loading profile for user:', userId);
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
        console.log('Profile loaded:', data);
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
          console.log('Profile created:', createdProfile);
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
      console.log('Checking admin role for user:', userId);
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
      console.log('Admin status:', adminStatus, data);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error in checkAdminRole:', error);
      setIsAdmin(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      // BYPASS SUPABASE AUTH - Use local storage instead
      const userData = {
        id: `local-${crypto.randomUUID()}`,
        email: email.trim().toLowerCase(),
        full_name: fullName || 'User',
        role: email.toLowerCase() === 'admin@series-shop.com' ? 'admin' : 'user',
        created_at: new Date().toISOString()
      };

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Set user state
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
      
      console.log('Local signup successful:', userData);
      
    } catch (error: any) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // BYPASS SUPABASE AUTH - Use local storage instead
      const userData = {
        id: `local-${crypto.randomUUID()}`,
        email: email.trim().toLowerCase(),
        full_name: 'Admin User',
        role: email.toLowerCase() === 'admin@series-shop.com' ? 'admin' : 'user',
        created_at: new Date().toISOString()
      };

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Set user state
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
      
      console.log('Local signin successful:', userData);
      
    } catch (error: any) {
      console.error('Signin failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      
      // Clear state
      setUser(null);
      setIsAdmin(false);
      
      console.log('Local signout successful');
    } catch (error) {
      console.error('Signout failed:', error);
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
      
      console.log('Local logout successful');
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
