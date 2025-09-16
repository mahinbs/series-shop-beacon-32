import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCoins } from '@/hooks/useCoins';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { PaymentService, type PaymentMethod } from '@/services/paymentService';
import { 
  Coins as CoinsIcon, 
  TrendingUp, 
  History, 
  ShoppingCart, 
  Gift, 
  Star,
  ArrowUpRight,
  CheckCircle,
  Zap
} from 'lucide-react';
import { COIN_PACKAGES } from '@/types/coins';

const Coins = () => {
  const { user, isAuthenticated } = useSupabaseAuth();
  const { 
    balance, 
    totalEarned, 
    totalSpent, 
    packages, 
    transactions, 
    isLoading,
    purchaseCoins 
  } = useCoins();
  
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Sign In</h2>
          <p className="text-gray-400 mb-6">You need to be signed in to access your coins.</p>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Load payment methods on component mount
  useEffect(() => {
    const loadPaymentMethods = async () => {
      const methods = await PaymentService.getPaymentMethods();
      setPaymentMethods(methods);
    };
    loadPaymentMethods();
  }, []);

  const handlePurchase = async (packageId: string) => {
    setSelectedPackage(packageId);
    setShowPaymentModal(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedPackage || !selectedPaymentMethod || !user) return;

    setIsPurchasing(true);
    try {
      const pkg = COIN_PACKAGES.find(p => p.id === selectedPackage);
      if (!pkg) return;

      const paymentRequest = {
        packageId: pkg.id,
        userId: user.id,
        amount: pkg.price,
        coins: pkg.coins + pkg.bonus,
        paymentMethod: selectedPaymentMethod,
        currency: 'USD'
      };

      const result = await PaymentService.processCoinPurchase(paymentRequest);
      
      if (result.success) {
        // Add coins to user balance
        await purchaseCoins(pkg.id, selectedPaymentMethod);
        
        setShowPaymentModal(false);
        setSelectedPackage(null);
        setSelectedPaymentMethod('');
      } else {
        console.error('Payment failed:', result.error);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ShoppingCart className="w-4 h-4 text-blue-500" />;
      case 'earn':
        return <Gift className="w-4 h-4 text-green-500" />;
      case 'spend':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      default:
        return <CoinsIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'text-blue-500';
      case 'earn':
        return 'text-green-500';
      case 'spend':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
                         <div className="inline-flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-6 py-3 mb-6">
               <CoinsIcon className="w-6 h-6 text-yellow-400" />
               <span className="text-yellow-400 font-semibold">Crossed Hearts Coins</span>
             </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
              Your Coin Balance
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Manage your virtual currency, purchase new coins, and track your spending history
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                                     <div className="p-3 bg-yellow-500/20 rounded-full">
                     <CoinsIcon className="w-6 h-6 text-yellow-400" />
                   </div>
                  <div>
                    <p className="text-sm text-yellow-300">Available Balance</p>
                    <h3 className="text-2xl font-bold text-white">
                      {isLoading ? '...' : balance.toLocaleString()}
                    </h3>
                  </div>
                </div>
                <p className="text-yellow-200 text-sm">Coins ready to spend</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-green-300">Total Earned</p>
                    <h3 className="text-2xl font-bold text-white">
                      {totalEarned.toLocaleString()}
                    </h3>
                  </div>
                </div>
                <p className="text-green-200 text-sm">Coins earned over time</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-500/20 rounded-full">
                    <ArrowUpRight className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-red-300">Total Spent</p>
                    <h3 className="text-2xl font-bold text-white">
                      {totalSpent.toLocaleString()}
                    </h3>
                  </div>
                </div>
                <p className="text-red-200 text-sm">Coins spent on content</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="purchase" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
              <TabsTrigger value="purchase" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white">
                Purchase Coins
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white">
                Transaction History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="purchase" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COIN_PACKAGES.map((pkg) => (
                  <Card 
                    key={pkg.id} 
                    className={`relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer ${
                      selectedPackage === pkg.id 
                        ? 'ring-2 ring-yellow-500 bg-yellow-500/5' 
                        : 'bg-gray-800 border-gray-700 hover:border-yellow-500/50'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {pkg.popular && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-600 text-white text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      </div>
                    )}
                    {pkg.bestValue && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-600 text-white text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Best Value
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-xl text-white">{pkg.name}</CardTitle>
                                             <div className="flex items-center justify-center gap-2">
                         <CoinsIcon className="w-5 h-5 text-yellow-400" />
                         <span className="text-2xl font-bold text-yellow-400">
                           {pkg.coins.toLocaleString()}
                         </span>
                       </div>
                      {pkg.bonus > 0 && (
                        <div className="text-sm text-green-400">
                          +{pkg.bonus} bonus coins!
                        </div>
                      )}
                    </CardHeader>
                    
                    <CardContent className="text-center">
                      <div className="text-3xl font-bold text-white mb-4">
                        ${pkg.price}
                      </div>
                      <Button 
                        className={`w-full ${
                          selectedPackage === pkg.id 
                            ? 'bg-yellow-600 hover:bg-yellow-700' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePurchase(pkg.id);
                        }}
                        disabled={isPurchasing}
                      >
                        {isPurchasing && selectedPackage === pkg.id ? (
                          'Processing...'
                        ) : (
                          'Purchase Now'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

            </TabsContent>

            <TabsContent value="history" className="mt-8">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Transaction History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                                         <div className="text-center py-8">
                       <CoinsIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                       <p className="text-gray-400">No transactions yet</p>
                       <p className="text-gray-500 text-sm">Your coin activity will appear here</p>
                     </div>
                  ) : (
                    <div className="space-y-3">
                      {transactions.map((transaction) => (
                        <div 
                          key={transaction.id}
                          className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {getTransactionIcon(transaction.type)}
                            <div>
                              <p className="text-white font-medium">
                                {transaction.description}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {formatDate(transaction.timestamp)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                              {transaction.amount > 0 ? '+' : ''}{transaction.amount} coins
                            </p>
                            <p className="text-gray-400 text-sm">
                              Balance: {transaction.balance}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Info Section */}
          <div className="mt-16 text-center">
            <Card className="bg-gray-800/50 border-gray-700 max-w-4xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  How Crossed Hearts Coins Work
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h4 className="text-white font-semibold mb-2">Purchase Coins</h4>
                    <p className="text-gray-400 text-sm">
                      Buy coin packages with real money to unlock premium content
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-6 h-6 text-green-400" />
                    </div>
                    <h4 className="text-white font-semibold mb-2">Earn Rewards</h4>
                    <p className="text-gray-400 text-sm">
                      Get bonus coins for purchases and special promotions
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-6 h-6 text-blue-400" />
                    </div>
                    <h4 className="text-white font-semibold mb-2">Unlock Content</h4>
                    <p className="text-gray-400 text-sm">
                      Spend coins to access exclusive episodes and premium features
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Payment Modal */}
      {showPaymentModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Complete Your Purchase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const pkg = COIN_PACKAGES.find(p => p.id === selectedPackage);
                if (!pkg) return null;
                
                return (
                  <>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="font-semibold text-white">{pkg.name}</h3>
                      <p className="text-sm text-gray-300">
                        {pkg.coins.toLocaleString()} coins
                        {pkg.bonus > 0 && ` + ${pkg.bonus} bonus`}
                      </p>
                      <p className="text-lg font-bold text-yellow-400">${pkg.price.toFixed(2)}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-white">Payment Method</label>
                      <select 
                        value={selectedPaymentMethod} 
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="w-full mt-2 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      >
                        <option value="">Select payment method</option>
                        {paymentMethods.filter(method => method.isEnabled).map((method) => (
                          <option key={method.id} value={method.id}>
                            {method.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowPaymentModal(false);
                          setSelectedPackage(null);
                          setSelectedPaymentMethod('');
                        }}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleProcessPayment}
                        disabled={isPurchasing || !selectedPaymentMethod}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        {isPurchasing ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          'Complete Purchase'
                        )}
                      </Button>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Coins;
