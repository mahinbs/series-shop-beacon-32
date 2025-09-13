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
  Image,
  Server,
  Clock,
  Activity,
  TrendingUp,
  HardDrive,
  Cpu,
  MemoryStick,
  Globe,
  Shield,
  Zap,
  BarChart3,
  FileText,
  ShoppingBag,
  BookOpenCheck,
  Filter
} from 'lucide-react';
import { UnifiedService } from '@/services/unifiedService';
import { supabase } from '@/integrations/supabase/client';

interface ServiceStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'warning';
  message: string;
  icon: any;
  category: 'database' | 'service' | 'system' | 'security';
  responseTime?: number;
  lastChecked?: Date;
  details?: string;
}

interface SystemMetrics {
  totalTables: number;
  activeConnections: number;
  responseTime: number;
  uptime: string;
  memoryUsage: string;
  diskUsage: string;
}

export const AdminPanelStatus = () => {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalTables: 0,
    activeConnections: 0,
    responseTime: 0,
    uptime: '0d 0h 0m',
    memoryUsage: '0%',
    diskUsage: '0%'
  });
  const [autoRefresh, setAutoRefresh] = useState(false);

  const checkAllServices = async () => {
    setIsChecking(true);
    const serviceChecks: ServiceStatus[] = [];
    const startTime = Date.now();

    // Check Supabase connection with response time
    try {
      const checkStart = Date.now();
      const { data, error } = await supabase
        .from('books')
        .select('count')
        .limit(1);
      const responseTime = Date.now() - checkStart;
      
      if (error) {
        serviceChecks.push({
          name: 'Supabase Database',
          status: 'error',
          message: `Connection failed: ${error.message}`,
          icon: Database,
          category: 'database',
          responseTime,
          lastChecked: new Date(),
          details: `Error code: ${error.code}`
        });
      } else {
        serviceChecks.push({
          name: 'Supabase Database',
          status: 'connected',
          message: 'Connected successfully',
          icon: Database,
          category: 'database',
          responseTime,
          lastChecked: new Date(),
          details: `Response time: ${responseTime}ms`
        });
      }
    } catch (error) {
      serviceChecks.push({
        name: 'Supabase Database',
        status: 'disconnected',
        message: 'Connection timeout or network error',
        icon: Database,
        category: 'database',
        lastChecked: new Date(),
        details: 'Network connectivity issue'
      });
    }

    // Check individual services with enhanced details
    const serviceTests = [
      { name: 'Books Management', key: 'books' as const, icon: BookOpen, category: 'service' as const },
      { name: 'Hero Banners', key: 'hero_banners' as const, icon: Image, category: 'service' as const },
      { name: 'Announcements', key: 'announcements' as const, icon: Megaphone, category: 'service' as const },
      { name: 'User Management', key: 'profiles' as const, icon: Users, category: 'service' as const },
      { name: 'Coins System', key: 'coin_packages' as any, icon: Coins, category: 'service' as const },
      { name: 'Coin Transactions', key: 'coin_transactions' as any, icon: Activity, category: 'service' as const },
      { name: 'User Coins', key: 'user_coins' as any, icon: Coins, category: 'service' as const },
      { name: 'Comic Series', key: 'comic_series' as any, icon: BookOpenCheck, category: 'service' as const },
      { name: 'Comic Episodes', key: 'comic_episodes' as any, icon: FileText, category: 'service' as const },
      { name: 'Comic Pages', key: 'comic_pages' as any, icon: FileText, category: 'service' as const },
      { name: 'Featured Series Configs', key: 'featured_series_configs' as any, icon: TrendingUp, category: 'service' as const },
      { name: 'Featured Series Badges', key: 'featured_series_badges' as any, icon: BarChart3, category: 'service' as const },
      { name: 'Shop All Heroes', key: 'shop_all_heroes' as any, icon: ShoppingBag, category: 'service' as const },
      { name: 'Shop All Filters', key: 'shop_all_filters' as any, icon: Filter, category: 'service' as const },
      { name: 'Shop All Sorts', key: 'shop_all_sorts' as any, icon: BarChart3, category: 'service' as const },
      { name: 'Digital Reader Specs', key: 'digital_reader_specs' as any, icon: BookOpen, category: 'service' as const },
    ];

    for (const service of serviceTests) {
      try {
        const checkStart = Date.now();
        const { data, error } = await supabase
          .from(service.key)
          .select('count')
          .limit(1);
        const responseTime = Date.now() - checkStart;
        
        if (error) {
          const status = error.code === 'PGRST205' ? 'warning' : 'error';
          serviceChecks.push({
            name: service.name,
            status,
            message: error.code === 'PGRST205' ? `Table not created: ${service.key}` : `Error: ${error.message}`,
            icon: service.icon,
            category: service.category,
            responseTime,
            lastChecked: new Date(),
            details: `Error code: ${error.code}`
          });
        } else {
          serviceChecks.push({
            name: service.name,
            status: 'connected',
            message: 'Table accessible',
            icon: service.icon,
            category: service.category,
            responseTime,
            lastChecked: new Date(),
            details: `Response time: ${responseTime}ms`
          });
        }
      } catch (error) {
        serviceChecks.push({
          name: service.name,
          status: 'disconnected',
          message: 'Service unavailable',
          icon: service.icon,
          category: service.category,
          lastChecked: new Date(),
          details: 'Network or connection error'
        });
      }
    }

    // Calculate system metrics
    const totalTime = Date.now() - startTime;
    const connectedServices = serviceChecks.filter(s => s.status === 'connected').length;
    const totalTables = serviceChecks.filter(s => s.category === 'service' && s.status === 'connected').length;
    const avgResponseTime = serviceChecks
      .filter(s => s.responseTime)
      .reduce((sum, s) => sum + (s.responseTime || 0), 0) / serviceChecks.filter(s => s.responseTime).length || 0;

    console.log(`🔍 System Status Check Complete: ${connectedServices}/${serviceChecks.length} services connected, ${totalTables} tables accessible, avg response: ${Math.round(avgResponseTime)}ms`);

    setSystemMetrics({
      totalTables,
      activeConnections: connectedServices,
      responseTime: Math.round(avgResponseTime),
      uptime: '24d 12h 30m', // Mock uptime - in real app, calculate from server start
      memoryUsage: '45%', // Mock memory usage
      diskUsage: '23%' // Mock disk usage
    });

    setServices(serviceChecks);
    setLastChecked(new Date());
    setIsChecking(false);
  };

  useEffect(() => {
    checkAllServices();
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(checkAllServices, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
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
      case 'warning':
        return <Badge className="bg-orange-100 text-orange-800">Warning</Badge>;
      case 'disconnected':
        return <Badge className="bg-yellow-100 text-yellow-800">Disconnected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const connectedServices = services.filter(s => s.status === 'connected').length;
  const warningServices = services.filter(s => s.status === 'warning').length;
  const errorServices = services.filter(s => s.status === 'error').length;
  const totalServices = services.length;

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Server className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tables</p>
                <p className="text-2xl font-bold">{systemMetrics.totalTables}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Connections</p>
                <p className="text-2xl font-bold">{systemMetrics.activeConnections}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">{systemMetrics.responseTime}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold">{systemMetrics.uptime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Status
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
              >
                <Activity className="h-4 w-4 mr-2" />
                {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
              </Button>
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                {connectedServices === totalServices ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : errorServices > 0 ? (
                  <XCircle className="h-6 w-6 text-red-500" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                )}
                <div>
                  <h3 className="font-semibold">Overall Status</h3>
                  <p className="text-sm text-muted-foreground">
                    {connectedServices} connected, {warningServices} warnings, {errorServices} errors
                  </p>
                </div>
              </div>
              <Badge 
                className={
                  connectedServices === totalServices 
                    ? "bg-green-100 text-green-800" 
                    : errorServices > 0
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }
              >
                {connectedServices === totalServices 
                  ? 'All Systems Operational' 
                  : errorServices > 0 
                  ? 'Critical Issues Detected'
                  : 'Some Issues Detected'}
              </Badge>
            </div>

            {/* Service List */}
            <div className="space-y-3">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{service.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {service.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{service.message}</p>
                        {service.details && (
                          <p className="text-xs text-muted-foreground mt-1">{service.details}</p>
                        )}
                        {service.responseTime && (
                          <p className="text-xs text-muted-foreground">
                            Response: {service.responseTime}ms
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(service.status)}
                      {service.lastChecked && (
                        <p className="text-xs text-muted-foreground">
                          {service.lastChecked.toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recommendations */}
            {connectedServices < totalServices && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>System Recommendations:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    {services.filter(s => s.status === 'error').map((service, index) => (
                      <li key={index} className="text-red-600">
                        • <strong>{service.name}:</strong> {service.message} - Check database connection and permissions
                      </li>
                    ))}
                    {services.filter(s => s.status === 'warning').map((service, index) => (
                      <li key={index} className="text-orange-600">
                        • <strong>{service.name}:</strong> {service.message} - Consider creating this table for full functionality
                      </li>
                    ))}
                    {services.filter(s => s.status === 'disconnected').map((service, index) => (
                      <li key={index} className="text-yellow-600">
                        • <strong>{service.name}:</strong> {service.message} - Check network connectivity
                      </li>
                    ))}
                    <li className="text-blue-600">• Enable auto-refresh for real-time monitoring</li>
                    <li className="text-blue-600">• Check Supabase project settings and RLS policies</li>
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
