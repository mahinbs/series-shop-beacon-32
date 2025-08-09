import { useState, useEffect } from 'react';
import { useDummyAuth } from '@/hooks/useDummyAuth';
import { useCMS } from '@/hooks/useCMS';
import { AdminSidebar } from './AdminSidebar';
import { PageEditor } from './PageEditor';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export const AdminDashboard = () => {
  const { isLoading } = useCMS();
  const { user } = useDummyAuth();
  const [selectedPage, setSelectedPage] = useState('home-page');
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Add a timeout fallback for loading
  useEffect(() => {
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000); // 5 second timeout

      return () => clearTimeout(timeoutId);
    } else {
      setLoadingTimeout(false);
    }
  }, [isLoading]);

  console.log('AdminDashboard render:', { user, isLoading, loadingTimeout, selectedPage });

  if (!user) {
    console.log('AdminDashboard: No user, showing access denied');
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

  // Show loading for a maximum of 5 seconds, then proceed anyway
  if (isLoading && !loadingTimeout) {
    console.log('AdminDashboard: Loading CMS...');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-lg text-muted-foreground">Loading CMS...</p>
          <p className="text-sm text-muted-foreground">This may take a few moments</p>
        </div>
      </div>
    );
  }

  console.log('AdminDashboard: Rendering main dashboard');
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar 
          selectedPage={selectedPage} 
          onPageSelect={setSelectedPage} 
        />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex items-center h-full px-4 gap-4">
              <SidebarTrigger className="ml-0" />
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h1 className="text-sm font-medium">CMS Admin Dashboard</h1>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                Welcome, {user.email}
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-6 max-w-6xl">
              <PageEditor selectedPage={selectedPage} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};