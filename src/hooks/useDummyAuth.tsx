import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useDummyAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useDummyAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Permanent admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@series-shop.com',
  password: 'Admin@2024!',
  name: 'Admin User',
  id: 'admin-001',
  role: 'admin' as const
};

export const DummyAuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('dummyUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for permanent admin credentials first
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser = {
        id: ADMIN_CREDENTIALS.id,
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${ADMIN_CREDENTIALS.email}`
      };
      
      setUser(adminUser);
      localStorage.setItem('dummyUser', JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    }
    
    // Dummy validation - accept any other email/password combination for regular users
    if (email && password) {
      const dummyUser = {
        id: 'user-' + Date.now(),
        email,
        name: email.split('@')[0],
        role: 'user' as const,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      
      setUser(dummyUser);
      localStorage.setItem('dummyUser', JSON.stringify(dummyUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if trying to register with admin email
    if (email === ADMIN_CREDENTIALS.email) {
      setIsLoading(false);
      return false; // Don't allow registration with admin email
    }
    
    // Dummy validation - accept any other email/password combination
    if (email && password && name) {
      const dummyUser = {
        id: 'user-' + Date.now(),
        email,
        name,
        role: 'user' as const,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      
      setUser(dummyUser);
      localStorage.setItem('dummyUser', JSON.stringify(dummyUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dummyUser');
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('dummyUser', JSON.stringify(updatedUser));
    
    setIsLoading(false);
    return true;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};