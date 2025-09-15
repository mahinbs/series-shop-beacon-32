import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '@/components/cms/AdminDashboard';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, LogOut, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AdminPanel = () => {
  const { user, profile, signOut, isAdmin, isLoading } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to finish before deciding
    if (isLoading) {
      return;
    }

    // If not logged in, send to auth and preserve intent
    if (!user) {
      navigate('/auth', { state: { from: '/admin' } });
      return;
    }

    // Logged-in but not an admin: send to home
    if (!isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Show loading while resolving auth/admin status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-primary animate-pulse" />
            <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
            <p className="text-muted-foreground mb-4">Verifying admin access...</p>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
              <p>User: {user ? 'Found' : 'None'}</p>
              <p>Admin: {isAdmin ? 'Yes' : 'No'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground mb-4">Please sign in to access the admin panel.</p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/auth', { state: { from: '/admin' } })} className="w-full">
                Go to Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  // Debug auth state (only in development)
                    if (process.env.NODE_ENV === 'development') {
                      console.log('Current auth state:', { user, isAdmin, isLoading });
                      console.log('LocalStorage:', {
                        isAuthenticated: localStorage.getItem('isAuthenticated'),
                        user: localStorage.getItem('user'),
                        adminSession: localStorage.getItem('admin_session')
                      });
                    }
                }}
                className="w-full text-xs"
              >
                Debug Auth State
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is admin
  // Supabase role is determined by `isAdmin`

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            {isAdmin && (
              <Badge variant="default" className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Admin
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {profile?.full_name || user.email}
              {isAdmin && (
                <span className="ml-2 text-xs text-primary font-medium">
                  (Administrator)
                </span>
              )}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <AdminDashboard />
    </div>
  );
};

export default AdminPanel;