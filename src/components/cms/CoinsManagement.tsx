import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Coins, 
  Search, 
  Filter, 
  Plus, 
  Minus,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Gift,
  ShoppingCart,
  History,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminService } from '@/services/adminService';
import { PaymentService, type PaymentMethod } from '@/services/paymentService';
import { CoinService } from '@/services/coinService';
import { UserService } from '@/services/userService';

interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  price: number;
  bonus: number;
  popular: boolean;
  best_value: boolean;
  active: boolean;
  created_at: string;
}

interface CoinTransaction {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  type: 'purchase' | 'spend' | 'earn' | 'refund';
  amount: number;
  balance: number;
  description: string;
  reference?: string;
  timestamp: string;
}

interface CoinStats {
  total_users_with_coins: number;
  total_coins_in_circulation: number;
  total_revenue_from_coins: number;
  average_coins_per_user: number;
  transactions_today: number;
  top_spenders: Array<{
    user_id: string;
    user_name: string;
    total_spent: number;
  }>;
}

export const CoinsManagement = () => {
  const { toast } = useToast();
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [stats, setStats] = useState<CoinStats>({
    total_users_with_coins: 0,
    total_coins_in_circulation: 0,
    total_revenue_from_coins: 0,
    average_coins_per_user: 0,
    transactions_today: 0,
    top_spenders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [editingPackage, setEditingPackage] = useState<CoinPackage | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackageForPayment, setSelectedPackageForPayment] = useState<CoinPackage | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [packageForm, setPackageForm] = useState({
    name: '',
    coins: 0,
    price: 0,
    bonus: 0,
    popular: false,
    best_value: false,
    active: true
  });


  // Load data function
  const loadData = async () => {
    if (isDataLoaded) return; // Prevent multiple calls
    
    setIsLoading(true);
    try {
      // Clear cache to ensure fresh data
      CoinService.clearCache();
      
      // Load payment methods
      const methods = await PaymentService.getPaymentMethods();
      setPaymentMethods(methods);
      
      // Load real data from database directly
      console.log('🔄 Loading fresh live data from Supabase...');
      const realPackages = await CoinService.getCoinPackages();
      const realTransactions = await CoinService.getAllTransactions(50);
      const allTransactions = await CoinService.getAllTransactions(1000);
      const allUsers = await CoinService.getAllUsersWithCoins();
      
      console.log('📊 Real data loaded:', {
        packages: realPackages.length,
        transactions: realTransactions.length,
        allTransactions: allTransactions.length,
        users: allUsers.length
      });
      
      // Set real data if available
      if (realPackages.length > 0) {
        console.log('✅ Setting real packages:', realPackages);
        setPackages(realPackages.map(pkg => ({
          ...pkg,
          bonus: pkg.bonus || 0,
          popular: pkg.popular || false,
          bestValue: pkg.bestValue || false,
          best_value: pkg.bestValue || false,
          active: true,
          created_at: new Date().toISOString()
        })));
      } else {
        console.log('⚠️ No real packages found, will use mock data');
      }
      
      if (realTransactions.length > 0) {
        console.log('✅ Setting real transactions:', realTransactions);
        setTransactions(realTransactions.map(tx => ({
          ...tx,
          user_email: `user@example.com`,
          user_name: `User ${tx.user_id.slice(0, 8)}`
        })));
      } else {
        console.log('⚠️ No real transactions found, will use mock data');
      }
      
      // Calculate real statistics
      const totalCoinsInCirculation = allUsers.reduce((sum, user) => sum + user.balance, 0);
      const purchaseTransactions = allTransactions.filter(t => t.type === 'purchase');
      const totalRevenue = purchaseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / 10;
      const avgCoinsPerUser = allUsers.length > 0 ? totalCoinsInCirculation / allUsers.length : 0;
      const transactionsToday = allTransactions.filter(t => {
        const today = new Date().toDateString();
        return new Date(t.timestamp).toDateString() === today;
      }).length;
      
      const realStats: CoinStats = {
        total_users_with_coins: allUsers.length,
        total_coins_in_circulation: totalCoinsInCirculation,
        total_revenue_from_coins: totalRevenue,
        average_coins_per_user: avgCoinsPerUser,
        transactions_today: transactionsToday,
        top_spenders: allUsers
          .sort((a, b) => b.total_spent - a.total_spent)
          .slice(0, 5)
          .map(user => ({
            user_id: user.user_id,
            user_name: user.user_name || 'Unknown User',
            total_spent: user.total_spent
          }))
      };
      
      console.log('📊 Calculated real stats:', realStats);
      setStats(realStats);
      
      // Define mock data for fallback
      const mockPackages: CoinPackage[] = [
          {
            id: '1',
            name: 'Starter Pack',
            coins: 100,
            price: 0.99,
            bonus: 0,
            popular: false,
            best_value: false,
            active: true,
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '2',
            name: 'Popular Pack',
            coins: 500,
            price: 4.99,
            bonus: 50,
            popular: true,
            best_value: false,
            active: true,
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '3',
            name: 'Best Value',
            coins: 1200,
            price: 9.99,
            bonus: 200,
            popular: false,
            best_value: true,
            active: true,
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '4',
            name: 'Premium Pack',
            coins: 2500,
            price: 19.99,
            bonus: 500,
            popular: false,
            best_value: false,
            active: true,
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '5',
            name: 'Ultimate Pack',
            coins: 6000,
            price: 49.99,
            bonus: 1500,
            popular: false,
            best_value: false,
            active: true,
            created_at: '2024-01-01T00:00:00Z'
          }
        ];

      const mockTransactions: CoinTransaction[] = [
          {
            id: '1',
            user_id: 'user-1',
            user_email: 'john@example.com',
            user_name: 'John Doe',
            type: 'purchase',
            amount: 500,
            balance: 500,
            description: 'Purchased Popular Pack',
            reference: 'PKG-2',
            timestamp: '2024-12-20T10:30:00Z'
          },
          {
            id: '2',
            user_id: 'user-2',
            user_email: 'jane@example.com',
            user_name: 'Jane Smith',
            type: 'spend',
            amount: -100,
            balance: 400,
            description: 'Unlocked premium content',
            reference: 'CONTENT-1',
            timestamp: '2024-12-20T09:15:00Z'
          },
          {
            id: '3',
            user_id: 'user-3',
            user_email: 'bob@example.com',
            user_name: 'Bob Johnson',
            type: 'earn',
            amount: 50,
            balance: 150,
            description: 'Welcome bonus',
            reference: 'WELCOME',
            timestamp: '2024-12-20T08:45:00Z'
          }
        ];

        const mockStats: CoinStats = {
          total_users_with_coins: 1247,
          total_coins_in_circulation: 125430,
          total_revenue_from_coins: 18450.75,
          average_coins_per_user: 100.6,
          transactions_today: 23,
          top_spenders: [
            { user_id: 'user-1', user_name: 'John Doe', total_spent: 1250 },
            { user_id: 'user-2', user_name: 'Jane Smith', total_spent: 890 },
            { user_id: 'user-3', user_name: 'Bob Johnson', total_spent: 650 }
          ]
        };
      
      // Only use mock data if no real data is available
      if (realPackages.length === 0) {
        console.log('📦 No coin packages found in database - using fallback packages');
        setPackages(mockPackages);
      } else {
        console.log(`✅ Loaded ${realPackages.length} coin packages from database`);
      }
        
      if (realTransactions.length === 0) {
        console.log('📊 No transactions found in database - showing empty state');
        setTransactions([]); // Use empty array instead of mock data
      } else {
        console.log(`✅ Loaded ${realTransactions.length} real transactions from database`);
      }
      
      if (allUsers.length === 0) {
        console.log('👥 No users with coins found in database - showing empty stats');
        setStats({
          total_users_with_coins: 0,
          total_coins_in_circulation: 0,
          total_revenue_from_coins: 0,
          average_coins_per_user: 0,
          transactions_today: 0,
          top_spenders: []
        }); // Use empty stats instead of mock data
      } else {
        console.log(`✅ Loaded ${allUsers.length} users with coins from database`);
      }
      } catch (error) {
        console.error('Error loading coins data:', error);
        toast({
          title: "Error",
          description: "Failed to load coins data",
          variant: "destructive"
        });
    } finally {
      setIsLoading(false);
      setIsDataLoaded(true);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []); // Remove toast dependency to prevent multiple calls

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleAddPackage = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newPackage: CoinPackage = {
        id: Date.now().toString(),
        ...packageForm,
        created_at: new Date().toISOString()
      };
      
      setPackages(prev => [...prev, newPackage]);
      setShowAddPackage(false);
      resetPackageForm();
      
      toast({
        title: "Success",
        description: "Coin package added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add coin package",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePackage = async (packageId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPackages(prev => prev.map(pkg => 
        pkg.id === packageId ? { ...pkg, ...packageForm } : pkg
      ));
      setEditingPackage(null);
      resetPackageForm();
      
      toast({
        title: "Success",
        description: "Coin package updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update coin package",
        variant: "destructive"
      });
    }
  };

  const handleDeletePackage = async (packageId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
      
      toast({
        title: "Success",
        description: "Coin package deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete coin package",
        variant: "destructive"
      });
    }
  };

  const resetPackageForm = () => {
    setPackageForm({
      name: '',
      coins: 0,
      price: 0,
      bonus: 0,
      popular: false,
      best_value: false,
      active: true
    });
  };

  const handlePurchasePackage = (pkg: CoinPackage) => {
    setSelectedPackageForPayment(pkg);
    setShowPaymentModal(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedPackageForPayment || !selectedPaymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingPayment(true);
    try {
      const paymentRequest = {
        packageId: selectedPackageForPayment.id,
        userId: 'admin', // In real app, this would be the actual user ID
        amount: selectedPackageForPayment.price,
        coins: selectedPackageForPayment.coins + selectedPackageForPayment.bonus,
        paymentMethod: selectedPaymentMethod,
        currency: 'USD'
      };

      const result = await PaymentService.processCoinPurchase(paymentRequest);
      
      if (result.success) {
        toast({
          title: "Payment Successful!",
          description: `You've received ${paymentRequest.coins} coins`,
        });
        
        // Add coins to user balance
        await CoinService.addCoins(
          paymentRequest.userId,
          paymentRequest.coins,
          'purchase',
          `Purchased ${selectedPackageForPayment.name}`,
          result.transactionId
        );
        
        // Refresh data
        loadData();
        
        setShowPaymentModal(false);
        setSelectedPackageForPayment(null);
        setSelectedPaymentMethod('');
      } else {
        toast({
          title: "Payment Failed",
          description: result.error || "Payment could not be processed",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: "Error",
        description: "Payment processing failed",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };


  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case 'spend': return <Minus className="h-4 w-4 text-red-500" />;
      case 'earn': return <Gift className="h-4 w-4 text-blue-500" />;
      case 'refund': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      default: return <History className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'purchase': return <Badge className="bg-green-100 text-green-800">Purchase</Badge>;
      case 'spend': return <Badge className="bg-red-100 text-red-800">Spend</Badge>;
      case 'earn': return <Badge className="bg-blue-100 text-blue-800">Earn</Badge>;
      case 'refund': return <Badge className="bg-orange-100 text-orange-800">Refund</Badge>;
      default: return <Badge variant="secondary">{type}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading coins data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coins Management</h1>
          <p className="text-muted-foreground">
            Manage coin packages, transactions, and user balances
          </p>
        </div>
        <Button 
          onClick={() => {
            setIsDataLoaded(false);
            loadData();
          }}
          variant="outline" 
          className="flex items-center gap-2"
        >
          🔄 Refresh Data
        </Button>
        <Button onClick={() => setShowAddPackage(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Package
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Users with Coins</p>
                <p className="text-2xl font-bold">
                  {stats.total_users_with_coins > 0 ? stats.total_users_with_coins.toLocaleString() : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coins in Circulation</p>
                <p className="text-2xl font-bold">
                  {stats.total_coins_in_circulation > 0 ? stats.total_coins_in_circulation.toLocaleString() : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${stats.total_revenue_from_coins > 0 ? stats.total_revenue_from_coins.toLocaleString() : '0.00'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg per User</p>
                <p className="text-2xl font-bold">
                  {stats.average_coins_per_user > 0 ? stats.average_coins_per_user.toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transactions Today</p>
                <p className="text-2xl font-bold">
                  {stats.transactions_today > 0 ? stats.transactions_today : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="packages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="packages">Coin Packages</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Coin Packages Tab */}
        <TabsContent value="packages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Coin Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Coins className="h-5 w-5 text-yellow-500" />
                        <div>
                          <h3 className="font-semibold">{pkg.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {pkg.coins.toLocaleString()} coins
                            {pkg.bonus > 0 && ` + ${pkg.bonus} bonus`}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {pkg.popular && <Badge className="bg-green-100 text-green-800">Popular</Badge>}
                        {pkg.best_value && <Badge className="bg-blue-100 text-blue-800">Best Value</Badge>}
                        {!pkg.active && <Badge variant="secondary">Inactive</Badge>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold">${pkg.price.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          ${(pkg.price / (pkg.coins + pkg.bonus)).toFixed(4)} per coin
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePurchasePackage(pkg)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPackage(pkg);
                            setPackageForm(pkg);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePackage(pkg.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transaction History</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="spend">Spend</SelectItem>
                      <SelectItem value="earn">Earn</SelectItem>
                      <SelectItem value="refund">Refund</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-lg font-medium">No transactions found</p>
                    <p className="text-sm">Transactions will appear here when users make coin purchases or spend coins.</p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <h3 className="font-semibold">{transaction.user_name}</h3>
                        <p className="text-sm text-muted-foreground">{transaction.user_email}</p>
                        <p className="text-sm">{transaction.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} coins
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Balance: {transaction.balance.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {getTransactionBadge(transaction.type)}
                    </div>
                  </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Spenders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.top_spenders.map((spender, index) => (
                    <div key={spender.user_id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{spender.user_name}</p>
                          <p className="text-sm text-muted-foreground">User ID: {spender.user_id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{spender.total_spent.toLocaleString()} coins</p>
                        <p className="text-sm text-muted-foreground">Total spent</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Package Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{pkg.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {pkg.coins + pkg.bonus} coins for ${pkg.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(pkg.price / (pkg.coins + pkg.bonus)).toFixed(4)}</p>
                        <p className="text-sm text-muted-foreground">per coin</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Package Modal */}
      {(showAddPackage || editingPackage) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{editingPackage ? 'Edit Package' : 'Add New Package'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Package Name</label>
                <Input
                  value={packageForm.name}
                  onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                  placeholder="e.g., Starter Pack"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Coins</label>
                  <Input
                    type="number"
                    value={packageForm.coins}
                    onChange={(e) => setPackageForm({ ...packageForm, coins: parseInt(e.target.value) || 0 })}
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Bonus Coins</label>
                  <Input
                    type="number"
                    value={packageForm.bonus}
                    onChange={(e) => setPackageForm({ ...packageForm, bonus: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Price ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={packageForm.price}
                  onChange={(e) => setPackageForm({ ...packageForm, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.99"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={packageForm.popular}
                    onChange={(e) => setPackageForm({ ...packageForm, popular: e.target.checked })}
                  />
                  <span className="text-sm">Popular</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={packageForm.best_value}
                    onChange={(e) => setPackageForm({ ...packageForm, best_value: e.target.checked })}
                  />
                  <span className="text-sm">Best Value</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={packageForm.active}
                    onChange={(e) => setPackageForm({ ...packageForm, active: e.target.checked })}
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddPackage(false);
                    setEditingPackage(null);
                    resetPackageForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingPackage ? () => handleUpdatePackage(editingPackage.id) : handleAddPackage}
                >
                  {editingPackage ? 'Update' : 'Add'} Package
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedPackageForPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Purchase Coin Package</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold">{selectedPackageForPayment.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedPackageForPayment.coins.toLocaleString()} coins
                  {selectedPackageForPayment.bonus > 0 && ` + ${selectedPackageForPayment.bonus} bonus`}
                </p>
                <p className="text-lg font-bold">${selectedPackageForPayment.price.toFixed(2)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Payment Method</label>
                <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.filter(method => method.isEnabled).map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPackageForPayment(null);
                    setSelectedPaymentMethod('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProcessPayment}
                  disabled={isProcessingPayment || !selectedPaymentMethod}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    'Complete Purchase'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
