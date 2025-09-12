import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Database, 
  Wifi, 
  WifiOff,
  RefreshCw,
  Settings,
  BookOpen,
  Users,
  Coins,
  Megaphone,
  Image
} from 'lucide-react';
import { UnifiedService } from '@/services/unifiedService';
import { supabase } from '@/integrations/supabase/client';

interface ServiceStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  message: string;
  icon: any;
}

export const AdminPanelStatus = () => {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkAllServices = async () => {
    setIsChecking(true);
    const serviceChecks: ServiceStatus[] = [];

    // Check Supabase connection
    try {
      const { data, error } = await supabase
        .from('books')
        .select('count')
        .limit(1);
      
      if (error) {
        serviceChecks.push({
          name: 'Supabase Database',
          status: 'error',
          message: `Connection failed: ${error.message}`,
          icon: Database
        });
      } else {
        serviceChecks.push({
          name: 'Supabase Database',
          status: 'connected',
          message: 'Connected successfully',
          icon: Database
        });
      }
    } catch (error) {
      serviceChecks.push({
        name: 'Supabase Database',
        status: 'disconnected',
        message: 'Connection timeout or network error',
        icon: Database
      });
    }

    // Check individual services
    const serviceTests = [
      { name: 'Books Management', key: 'books', icon: BookOpen },
      { name: 'Hero Banners', key: 'hero_banners', icon: Image },
      { name: 'Announcements', key: 'announcements', icon: Megaphone },
      { name: 'User Management', key: 'profiles', icon: Users },
      { name: 'Coins System', key: 'coin_packages', icon: Coins },
      { name: 'Comic Series', key: 'comic_series', icon: BookOpen },
    ];

    for (const service of serviceTests) {
      try {
        const { data, error } = await supabase
          .from(service.key)
          .select('count')
          .limit(1);
        
        if (error) {
          serviceChecks.push({
            name: service.name,
            status: 'error',
            message: `Table not found: ${service.key}`,
            icon: service.icon
          });
        } else {
          serviceChecks.push({
            name: service.name,
            status: 'connected',
            message: 'Table accessible',
            icon: service.icon
          });
        }
      } catch (error) {
        serviceChecks.push({
          name: service.name,
          status: 'disconnected',
          message: 'Service unavailable',
          icon: service.icon
        });
      }
    }

    setServices(serviceChecks);
    setLastChecked(new Date());
    setIsChecking(false);
  };

  useEffect(() => {
    checkAllServices();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'disconnected':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'disconnected':
        return <Badge className="bg-yellow-100 text-yellow-800">Disconnected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const connectedServices = services.filter(s => s.status === 'connected').length;
  const totalServices = services.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Admin Panel Status
            </CardTitle>
            <Button 
              onClick={checkAllServices} 
              disabled={isChecking}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                {connectedServices === totalServices ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                )}
                <div>
                  <h3 className="font-semibold">Overall Status</h3>
                  <p className="text-sm text-muted-foreground">
                    {connectedServices} of {totalServices} services connected
                  </p>
                </div>
              </div>
              <Badge 
                className={
                  connectedServices === totalServices 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }
              >
                {connectedServices === totalServices ? 'All Systems Operational' : 'Some Issues Detected'}
              </Badge>
            </div>

            {/* Service List */}
            <div className="space-y-3">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">{service.message}</p>
                      </div>
                    </div>
                    {getStatusBadge(service.status)}
                  </div>
                );
              })}
            </div>

            {/* Recommendations */}
            {connectedServices < totalServices && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Recommendations:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    {services.filter(s => s.status !== 'connected').map((service, index) => (
                      <li key={index}>
                        • {service.name}: {service.message}
                      </li>
                    ))}
                    <li>• Consider using local storage fallback for offline functionality</li>
                    <li>• Check Supabase project settings and table permissions</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Last Checked */}
            {lastChecked && (
              <p className="text-xs text-muted-foreground text-center">
                Last checked: {lastChecked.toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
