import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Eye,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminService, type AdminStats } from '@/services/adminService';

interface AnalyticsData {
  revenue: {
    total: number;
    monthly: number;
    daily: number;
    growth: number;
  };
  orders: {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    growth: number;
  };
  products: {
    total: number;
    active: number;
    out_of_stock: number;
    low_stock: number;
  };
  users: {
    total: number;
    active: number;
    new_today: number;
    growth: number;
  };
  coins: {
    total_users_with_coins: number;
    total_coins_in_circulation: number;
    total_revenue_from_coins: number;
    average_coins_per_user: number;
    transactions_today: number;
  };
  topProducts: Array<{
    id: string;
    title: string;
    sales: number;
    revenue: number;
    image_url?: string;
  }>;
  recentOrders: Array<{
    id: string;
    order_number: string;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
  }>;
  salesChart: Array<{
    date: string;
    sales: number;
    revenue: number;
  }>;
}

export const AnalyticsDashboard = () => {
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const [statsData, topProductsData, recentOrdersData] = await Promise.all([
          AdminService.getStats(),
          AdminService.getTopProducts(),
          AdminService.getRecentOrders(5)
        ]);
        
        // Transform the data to match AnalyticsData interface
        const mockData: AnalyticsData = {
          revenue: {
            total: statsData.total_revenue,
            monthly: statsData.total_revenue * 0.3, // Approximate monthly
            daily: statsData.total_revenue * 0.01, // Approximate daily
            growth: 12.5 // Mock growth percentage
          },
          orders: {
            total: statsData.total_orders,
            completed: statsData.completed_orders,
            pending: statsData.pending_orders,
            cancelled: Math.floor(statsData.total_orders * 0.05), // Approximate cancelled
            growth: 8.3 // Mock growth percentage
          },
          products: {
            total: 156, // Mock data - would need separate service
            active: 142,
            out_of_stock: 8,
            low_stock: 6
          },
          users: {
            total: statsData.total_users,
            active: statsData.active_users,
            new_today: statsData.new_users_today,
            growth: 15.2 // Mock growth percentage
          },
          coins: {
            total_users_with_coins: statsData.total_users_with_coins,
            total_coins_in_circulation: statsData.total_coins_in_circulation,
            total_revenue_from_coins: statsData.total_revenue_from_coins,
            average_coins_per_user: statsData.average_coins_per_user,
            transactions_today: statsData.coins_transactions_today
          },
          topProducts: topProductsData.map(product => ({
            id: product.id,
            title: product.title,
            sales: product.sales,
            revenue: product.revenue,
            image_url: product.image_url || 'https://picsum.photos/60/80'
          })),
          recentOrders: recentOrdersData.map(order => ({
            id: order.id,
            order_number: order.order_number,
            customer_name: order.customer_name,
            total: order.total,
            status: order.status,
            created_at: order.created_at
          })),
          salesChart: [
            { date: '2024-12-14', sales: 12, revenue: 156.50 },
            { date: '2024-12-15', sales: 18, revenue: 234.75 },
            { date: '2024-12-16', sales: 15, revenue: 198.30 },
            { date: '2024-12-17', sales: 22, revenue: 287.60 },
            { date: '2024-12-18', sales: 25, revenue: 325.40 },
            { date: '2024-12-19', sales: 20, revenue: 260.80 },
            { date: '2024-12-20', sales: 28, revenue: 364.20 }
          ]
        };

        setAnalyticsData(mockData);
      } catch (error) {
        console.error('Error loading analytics:', error);
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [timeRange, toast]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600';
      case 'shipped': return 'text-blue-600';
      case 'processing': return 'text-yellow-600';
      case 'pending': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Track your business performance</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your business performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(analyticsData.revenue.total)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+{analyticsData.revenue.growth}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{analyticsData.orders.total}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+{analyticsData.orders.growth}%</span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{analyticsData.users.total}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+{analyticsData.users.growth}%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Products</p>
                <p className="text-2xl font-bold">{analyticsData.products.active}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {analyticsData.products.out_of_stock} out of stock
                </p>
              </div>
              <Package className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="sales">Sales Chart</TabsTrigger>
          <TabsTrigger value="coins">Coins Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                    <span className="font-medium">{formatCurrency(analyticsData.revenue.monthly)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Daily Average</span>
                    <span className="font-medium">{formatCurrency(analyticsData.revenue.daily)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Growth Rate</span>
                    <span className="font-medium text-green-600">+{analyticsData.revenue.growth}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <span className="font-medium text-green-600">{analyticsData.orders.completed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <span className="font-medium text-yellow-600">{analyticsData.orders.pending}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cancelled</span>
                    <span className="font-medium text-red-600">{analyticsData.orders.cancelled}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <img 
                      src={product.image_url} 
                      alt={product.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(product.revenue)}</p>
                      <p className="text-sm text-muted-foreground">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(order.total)}</p>
                      <p className={`text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.salesChart.map((day) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{formatDate(day.date)}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{day.sales} orders</span>
                      <span className="font-medium">{formatCurrency(day.revenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coins" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Users with Coins</p>
                    <p className="text-2xl font-bold">{analyticsData.coins.total_users_with_coins.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Coins in Circulation</p>
                    <p className="text-2xl font-bold">{analyticsData.coins.total_coins_in_circulation.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Coins Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(analyticsData.coins.total_revenue_from_coins)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Transactions Today</p>
                    <p className="text-2xl font-bold">{analyticsData.coins.transactions_today}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Coins Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Coins per User</span>
                    <span className="text-lg font-bold">{analyticsData.coins.average_coins_per_user.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Coins Revenue</span>
                    <span className="text-lg font-bold">{formatCurrency(analyticsData.coins.total_revenue_from_coins)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Users with Coins</span>
                    <span className="text-lg font-bold">{analyticsData.coins.total_users_with_coins.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Coins in System</span>
                    <span className="text-lg font-bold">{analyticsData.coins.total_coins_in_circulation.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coins Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Revenue per User</span>
                    <span className="text-lg font-bold">
                      {formatCurrency(analyticsData.coins.total_revenue_from_coins / analyticsData.coins.total_users_with_coins)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Coins per Dollar</span>
                    <span className="text-lg font-bold">
                      {(analyticsData.coins.total_coins_in_circulation / analyticsData.coins.total_revenue_from_coins).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Daily Transactions</span>
                    <span className="text-lg font-bold">{analyticsData.coins.transactions_today}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Adoption Rate</span>
                    <span className="text-lg font-bold">
                      {((analyticsData.coins.total_users_with_coins / analyticsData.users.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
