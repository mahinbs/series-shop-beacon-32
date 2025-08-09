import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    genres: string[];
    authors: string[];
  };
  searchHistory: string[];
  wishlist: string[];
  browsingHistory: string[];
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  addToSearchHistory: (query: string) => void;
  addToBrowsingHistory: (productId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mock user for demonstration
  useEffect(() => {
    const mockUser: User = {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      preferences: {
        genres: ['manga', 'romance', 'action'],
        authors: ['Eiichiro Oda', 'Hajime Isayama']
      },
      searchHistory: ['One Piece', 'Attack on Titan', 'Romance manga'],
      wishlist: ['1', '3', '5'],
      browsingHistory: ['1', '2', '3', '4', '5']
    };
    
    // Simulate logged in state (for demo purposes)
    setUser(mockUser);
    setIsLoggedIn(true);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login logic
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateUserPreferences = (preferences: Partial<User['preferences']>) => {
    if (user) {
      setUser({
        ...user,
        preferences: { ...user.preferences, ...preferences }
      });
    }
  };

  const addToSearchHistory = (query: string) => {
    if (user) {
      const updatedHistory = [query, ...user.searchHistory.filter(item => item !== query)].slice(0, 10);
      setUser({
        ...user,
        searchHistory: updatedHistory
      });
    }
  };

  const addToBrowsingHistory = (productId: string) => {
    if (user) {
      const updatedHistory = [productId, ...user.browsingHistory.filter(item => item !== productId)].slice(0, 20);
      setUser({
        ...user,
        browsingHistory: updatedHistory
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      login,
      logout,
      updateUserPreferences,
      addToSearchHistory,
      addToBrowsingHistory
    }}>
      {children}
    </AuthContext.Provider>
  );
};