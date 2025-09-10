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
  const [packageForm, setPackageForm] = useState({
    name: '',
    coins: 0,
    price: 0,
    bonus: 0,
    popular: false,
    best_value: false,
    active: true
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load mock data for now - will be replaced with real API calls
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

        setPackages(mockPackages);
        setTransactions(mockTransactions);
        setStats(mockStats);
      } catch (error) {
        console.error('Error loading coins data:', error);
        toast({
          title: "Error",
          description: "Failed to load coins data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

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
                <p className="text-2xl font-bold">{stats.total_users_with_coins.toLocaleString()}</p>
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
                <p className="text-2xl font-bold">{stats.total_coins_in_circulation.toLocaleString()}</p>
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
                <p className="text-2xl font-bold">${stats.total_revenue_from_coins.toLocaleString()}</p>
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
                <p className="text-2xl font-bold">{stats.average_coins_per_user.toFixed(1)}</p>
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
                <p className="text-2xl font-bold">{stats.transactions_today}</p>
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
                {filteredTransactions.map((transaction) => (
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
                ))}
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
    </div>
  );
};
