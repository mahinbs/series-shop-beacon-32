
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
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  
  // Session stability tracking
  const [lastSessionId, setLastSessionId] = useState<string | null>(null);
  const [lastProfileCheck, setLastProfileCheck] = useState<number>(0);
  const [lastAdminCheck, setLastAdminCheck] = useState<number>(0);
  const [isTabVisible, setIsTabVisible] = useState(true);
  
  // Session cache duration (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

// Derive loading state: wait for both profile and admin checks when session exists
useEffect(() => {
  if (session?.user) {
    setIsLoading(!(profileLoaded && adminChecked));
  } else {
    setIsLoading(false);
  }
}, [session, profileLoaded, adminChecked]);

  // Add tab visibility handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsTabVisible(visible);
      console.log(`📱 Tab visibility changed: ${visible ? 'visible' : 'hidden'}`);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Helper function to check if session is stable
  const isSessionStable = (newSession: Session | null): boolean => {
    const newSessionId = newSession?.access_token?.substring(0, 20) || null;
    const isStable = newSessionId === lastSessionId;
    if (!isStable) {
      console.log(`🔄 Session changed: ${lastSessionId?.substring(0, 8)}... → ${newSessionId?.substring(0, 8)}...`);
      setLastSessionId(newSessionId);
    }
    return isStable;
  };

  // Helper function to check if cache is valid
  const isCacheValid = (lastCheck: number): boolean => {
    return Date.now() - lastCheck < CACHE_DURATION;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🚀 Initializing auth...');
      
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
          setLastSessionId(currentSession.access_token?.substring(0, 20) || null);
          
          // Check if we need to refresh profile/admin data
          const now = Date.now();
          const needsProfileCheck = !isCacheValid(lastProfileCheck);
          const needsAdminCheck = !isCacheValid(lastAdminCheck);
          
          if (needsProfileCheck || needsAdminCheck) {
            console.log('🔄 Refreshing cached data...', { needsProfileCheck, needsAdminCheck });
            setIsLoading(true);
            const promises = [];
            
            if (needsProfileCheck) {
              promises.push(loadUserProfile(currentSession.user.id));
            } else {
              setProfileLoaded(true);
            }
            
            if (needsAdminCheck) {
              promises.push(checkAdminRole(currentSession.user.id));
            } else {
              setAdminChecked(true);
            }
            
            if (promises.length > 0) {
              await Promise.all(promises);
            }
          } else {
            console.log('✅ Using cached auth data');
            setProfileLoaded(true);
            setAdminChecked(true);
          }
          return;
        }
      } catch (error) {
        console.error('Error checking Supabase session:', error);
      }
      
      // No authentication found
      console.log('❌ No authentication found');
      setProfileLoaded(false);
      setAdminChecked(false);
      setIsLoading(false);
    };

    initializeAuth();

    // Add debouncing to prevent rapid auth events
    let authDebounceTimer: NodeJS.Timeout | null = null;

    // Set up auth state listener with session stability checks
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`🔐 Auth state change: ${event}`, newSession?.user?.id);
        
        // Ignore token refresh events - just update session silently
        if (event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          return;
        }
        
        // Ignore duplicate INITIAL_SESSION events if session is stable
        if (event === 'INITIAL_SESSION' && isSessionStable(newSession)) {
          console.log('✅ Ignoring duplicate INITIAL_SESSION');
          return;
        }
        
        // Clear any pending debounce timer
        if (authDebounceTimer) {
          clearTimeout(authDebounceTimer);
        }
        
        // Debounce rapid auth changes
        authDebounceTimer = setTimeout(async () => {
          // Check if session is actually stable for non-critical events
          if (isSessionStable(newSession) && !['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) {
            console.log('✅ Session stable, skipping heavy reload');
            setSession(newSession);
            return;
          }
          
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          if (newSession?.user) {
            // Only trigger heavy reload for actual user changes
            if (['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event) || !isSessionStable(newSession)) {
              console.log('🔄 Reloading auth data due to user change');
              setProfileLoaded(false);
              setAdminChecked(false);
              setIsLoading(true);
              
              // Use setTimeout to prevent auth deadlock
              setTimeout(async () => {
                await Promise.all([
                  loadUserProfile(newSession.user.id),
                  checkAdminRole(newSession.user.id)
                ]);
              }, 0);
            }
          } else {
            console.log('🚪 User signed out');
            setProfile(null);
            setIsAdmin(false);
            setProfileLoaded(false);
            setAdminChecked(false);
            setIsLoading(false);
            setLastSessionId(null);
            setLastProfileCheck(0);
            setLastAdminCheck(0);
          }
        }, 1000); // 1 second debounce
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('👤 Loading user profile for:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        setProfileLoaded(true);
        setLastProfileCheck(Date.now());
        return;
      }

      if (data) {
        setProfile(data);
        console.log('✅ Profile loaded successfully');
      } else {
        // Create profile if it doesn't exist using UPSERT to avoid duplicates
        console.log('🆕 Creating new profile...');
        
        // Get display name from user metadata or email
        const displayName = user?.user_metadata?.full_name || 
                           user?.user_metadata?.name || 
                           user?.user_metadata?.display_name || 
                           (user?.email ? user.email.split('@')[0] : 'User');
        
        const newProfile = {
          user_id: userId,
          email: user?.email || null,
          full_name: displayName,
          updated_at: new Date().toISOString()
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .upsert(newProfile, {
            onConflict: 'user_id'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error upserting profile:', createError);
        } else {
          setProfile(createdProfile);
          console.log('✅ Profile upserted successfully');
        }
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    } finally {
      setProfileLoaded(true);
      setLastProfileCheck(Date.now());
    }
  };

  const checkAdminRole = async (userId: string) => {
    try {
      console.log('👑 Checking admin role for:', userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
        setAdminChecked(true);
        setLastAdminCheck(Date.now());
        return;
      }

      const adminStatus = !!data;
      setIsAdmin(adminStatus);
      console.log(`✅ Admin status: ${adminStatus}`);
    } catch (error) {
      console.error('Error in checkAdminRole:', error);
      setIsAdmin(false);
    } finally {
      setAdminChecked(true);
      setLastAdminCheck(Date.now());
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
        
        // Create profile using UPSERT to avoid duplicates
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: data.user.id,
            email: email.trim().toLowerCase(),
            full_name: fullName || 'User',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (profileError) {
          console.error('Profile upsert error:', profileError);
        } else {
          console.log('✅ Profile created/updated during signup');
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
      setProfileLoaded(false);
      setAdminChecked(false);
      
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
