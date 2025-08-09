import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Coins, Unlock, Zap, Gift, Star, CheckCircle, Clock } from 'lucide-react';

const CoinUnlock = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isUnlocking, setIsUnlocking] = useState(false);
  
  const { product, quantity, coinPrice } = location.state || {};
  
  console.log('🪙 CoinUnlock page loaded');
  console.log('📍 Current productId from params:', productId);
  console.log('📦 Product data:', product);
  console.log('🪙 Coin price:', coinPrice);

  // Mock user coin balance - in real app this would come from user context/API
  const userCoins = 15000;
  const requiredCoins = coinPrice || parseInt(product?.coins?.replace(' coins', '') || '0');
  const hasEnoughCoins = userCoins >= requiredCoins;

  // Coin packages for purchase if user doesn't have enough
  const coinPackages = [
    { id: 1, coins: 5000, price: '$9.99', bonus: 0, popular: false },
    { id: 2, coins: 12000, price: '$19.99', bonus: 2000, popular: true },
    { id: 3, coins: 25000, price: '$39.99', bonus: 5000, popular: false },
    { id: 4, coins: 50000, price: '$69.99', bonus: 15000, popular: false }
  ];

  const handleUnlock = async () => {
    if (!hasEnoughCoins) {
      console.log('❌ Not enough coins');
      return;
    }

    setIsUnlocking(true);
    
    // Simulate unlock processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    navigate('/unlock-success', {
      state: {
        unlockData: {
          product,
          coinsUsed: requiredCoins,
          remainingCoins: userCoins - requiredCoins,
          unlockId: 'UNL-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        }
      }
    });
  };

  const handleBuyCoins = (packageItem: any) => {
    console.log('🛒 Buying coin package:', packageItem);
    navigate(`/direct-checkout/coin-package-${packageItem.id}`, {
      state: {
        product: {
          title: `${packageItem.coins.toLocaleString()} Coins Package`,
          author: 'Virtual Currency',
          imageUrl: '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png',
          price: parseFloat(packageItem.price.replace('$', ''))
        },
        quantity: 1,
        totalPrice: parseFloat(packageItem.price.replace('$', '')),
        coinPackage: packageItem
      }
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Content not found</h2>
          <Button onClick={() => navigate('/shop-all')}>Return to Shop</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-gray-300 hover:text-white mb-6 p-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Product
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
            <Coins className="w-8 h-8 mr-3 text-yellow-400" />
            Unlock with Coins
          </h1>
          <p className="text-gray-400">Use your virtual coins to unlock this content instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Side - Product & Unlock */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex space-x-6">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-32 h-40 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{product.title}</h3>
                    <p className="text-gray-400 mb-4">by {product.author}</p>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Coins className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400 font-bold text-xl">{requiredCoins.toLocaleString()} coins</span>
                      </div>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">Instant unlock</span>
                    </div>
                    
                    {/* Unlock Benefits */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Permanent access</span>
                      </div>
                      <div className="flex items-center space-x-2 text-green-400">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm">Instant download</span>
                      </div>
                      <div className="flex items-center space-x-2 text-green-400">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">High quality content</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coin Balance & Unlock */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                  Your Coin Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-gray-400 text-sm">Available Coins</p>
                    <p className="text-2xl font-bold text-yellow-400">{userCoins.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Required</p>
                    <p className="text-xl font-bold text-white">{requiredCoins.toLocaleString()}</p>
                  </div>
                </div>

                {hasEnoughCoins ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span>You have enough coins to unlock this content!</span>
                    </div>
                    <Button
                      onClick={handleUnlock}
                      disabled={isUnlocking}
                      className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white py-4 text-lg font-semibold"
                    >
                      {isUnlocking ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Unlocking...
                        </>
                      ) : (
                        <>
                          <Unlock className="w-5 h-5 mr-2" />
                          Unlock Now - {requiredCoins.toLocaleString()} coins
                        </>
                      )}
                    </Button>
                    <p className="text-center text-gray-400 text-sm">
                      After unlock: {(userCoins - requiredCoins).toLocaleString()} coins remaining
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <div className="flex items-center space-x-2 text-red-400 mb-2">
                        <Clock className="w-5 h-5" />
                        <span className="font-semibold">Insufficient coins</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        You need {(requiredCoins - userCoins).toLocaleString()} more coins to unlock this content.
                      </p>
                    </div>
                    <Button
                      disabled
                      className="w-full bg-gray-700 text-gray-400 py-4 text-lg font-semibold cursor-not-allowed"
                    >
                      <Unlock className="w-5 h-5 mr-2" />
                      Insufficient Coins
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Buy Coins */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700 sticky top-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-red-500" />
                  Buy More Coins
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {coinPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`relative p-4 rounded-lg border transition-all duration-300 hover:scale-105 cursor-pointer ${
                      pkg.popular 
                        ? 'bg-gradient-to-r from-red-600/20 to-red-700/20 border-red-500/50' 
                        : 'bg-gray-700/50 border-gray-600/50 hover:border-gray-500/50'
                    }`}
                    onClick={() => handleBuyCoins(pkg)}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          MOST POPULAR
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Coins className="w-5 h-5 text-yellow-400" />
                        <span className="text-white font-bold text-lg">
                          {pkg.coins.toLocaleString()}
                        </span>
                      </div>
                      
                      {pkg.bonus > 0 && (
                        <p className="text-green-400 text-xs mb-2">
                          +{pkg.bonus.toLocaleString()} bonus coins
                        </p>
                      )}
                      
                      <p className="text-gray-300 font-semibold">{pkg.price}</p>
                      
                      <Button
                        size="sm"
                        className="w-full mt-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="text-center text-gray-400 text-xs mt-4">
                  <p>🔒 Secure payment • 💎 Instant delivery</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CoinUnlock;