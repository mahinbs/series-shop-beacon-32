import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '@/components/cms/AdminDashboard';
import { useDummyAuth } from '@/hooks/useDummyAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, LogOut, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AdminPanel = () => {
  const { user, logout } = useDummyAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect non-admin users to auth page
    if (!user) {
      navigate('/auth', { state: { from: '/admin' } });
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    logout();
    navigate('/');
  };

  // Show loading or redirect for non-admin users
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground mb-4">
              This area is restricted to administrators only.
            </p>
            <Button onClick={() => navigate('/auth', { state: { from: '/admin' } })} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is admin
  const isAdmin = user.role === 'admin';

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
              Welcome, {user.name || user.email}
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