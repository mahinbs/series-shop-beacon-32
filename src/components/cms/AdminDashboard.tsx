import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useCMS } from '@/hooks/useCMS';
import { AdminSidebar } from './AdminSidebar';
import { PageEditor } from './PageEditor';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export const AdminDashboard = () => {
  const { isLoading } = useCMS();
  const { user, isAdmin, isLoading: authLoading } = useSupabaseAuth();
  const [selectedPage, setSelectedPage] = useState(() => {
    // Restore selected page from localStorage
    return localStorage.getItem('admin:selectedPage') || 'home-page';
  });
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [stableSession, setStableSession] = useState(false);
  
  // Track if we've completed initial loading check to prevent reloading on window focus
  const [initialLoadingComplete, setInitialLoadingComplete] = useState(false);

  // Persist selected page to localStorage
  useEffect(() => {
    localStorage.setItem('admin:selectedPage', selectedPage);
  }, [selectedPage]);

  // Track stable session to prevent unnecessary loading screens
  useEffect(() => {
    if (user && isAdmin && !authLoading) {
      const timer = setTimeout(() => {
        setStableSession(true);
      }, 500); // Small delay to ensure auth is stable
      
      return () => clearTimeout(timer);
    } else {
      setStableSession(false);
    }
  }, [user, isAdmin, authLoading]);

  // Track when initial loading is complete
  useEffect(() => {
    if (!authLoading && !isLoading && user && isAdmin) {
      if (!initialLoadingComplete) {
        setInitialLoadingComplete(true);
      }
    }
  }, [authLoading, isLoading, user, isAdmin, initialLoadingComplete]);

  // Add a timeout fallback for loading - but only if session isn't stable
  useEffect(() => {
    if (isLoading && !stableSession) {
      const timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 2000); // Reduced timeout for better UX

      return () => clearTimeout(timeoutId);
    } else {
      setLoadingTimeout(false);
    }
  }, [isLoading, stableSession]);

  // console.log('AdminDashboard render:', { user, isLoading, loadingTimeout, selectedPage });

  if (!user || !isAdmin) {
    // console.log('AdminDashboard: No user, showing access denied');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              Access denied. Admin privileges required.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading only on initial load, not when switching windows
  if ((authLoading || (isLoading && !stableSession)) && !loadingTimeout && !initialLoadingComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-lg text-muted-foreground">Loading Admin Panel...</p>
          <p className="text-sm text-muted-foreground">
            {authLoading ? 'Authenticating...' : 'Initializing dashboard components'}
          </p>
        </div>
      </div>
    );
  }

  // console.log('AdminDashboard: Rendering main dashboard');
  return (
    <div className="min-h-screen w-full bg-background">
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full">
          {/* Sidebar */}
          <AdminSidebar 
            selectedPage={selectedPage} 
            onPageSelect={setSelectedPage} 
          />

          {/* Main content area */}
          <SidebarInset className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 flex-shrink-0">
              <div className="flex items-center h-full px-6 gap-4">
                <SidebarTrigger />
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h1 className="text-lg font-semibold">CMS Admin Dashboard</h1>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  Welcome, {user?.email}
                </div>
              </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto bg-muted/20">
              <div className="container mx-auto p-6 max-w-7xl">
                <PageEditor selectedPage={selectedPage} />
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};