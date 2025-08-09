import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Coins, Star, ArrowRight, Gift } from 'lucide-react';

const UnlockSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { unlockData } = location.state || {};
  
  if (!unlockData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Unlock not found</h2>
          <Button onClick={() => navigate('/shop-all')}>Return to Shop</Button>
        </div>
      </div>
    );
  }

  const handleDownloadContent = () => {
    // Simulate download
    console.log('📥 Downloading content:', unlockData.product.title);
    // In real app, this would trigger the actual download
  };

  const handleContinueShopping = () => {
    navigate('/shop-all');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Content Unlocked!</h1>
            <p className="text-gray-400">Your content has been successfully unlocked and is ready for access</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Unlock Details */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Unlock Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Info */}
                <div className="flex space-x-4 p-4 bg-gray-700/50 rounded-lg">
                  <img
                    src={unlockData.product.imageUrl}
                    alt={unlockData.product.title}
                    className="w-16 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{unlockData.product.title}</h4>
                    <p className="text-gray-400 text-sm">by {unlockData.product.author}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        UNLOCKED
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="space-y-3 p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex justify-between text-gray-300">
                    <span>Unlock ID</span>
                    <span className="font-mono text-sm">{unlockData.unlockId}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Coins Used</span>
                    <span className="flex items-center space-x-1">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span>{unlockData.coinsUsed.toLocaleString()}</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Remaining Balance</span>
                    <span className="flex items-center space-x-1">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span>{unlockData.remainingCoins.toLocaleString()}</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Unlock Date</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Access Information */}
                <div className="space-y-3">
                  <h4 className="text-white font-semibold">What you get:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Permanent access to content</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">High-quality digital format</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Offline reading capability</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Multi-device sync</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Side - Actions */}
            <div className="space-y-6">
              {/* Download Section */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Download className="w-5 h-5 mr-2 text-blue-500" />
                    Access Your Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">
                    Your content is now available for download and viewing. You can access it anytime from your library.
                  </p>
                  
                  <Button
                    onClick={handleDownloadContent}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Now
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate('/readers-mode')}
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Read Online
                  </Button>
                </CardContent>
              </Card>

              {/* Library Access */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                    Your Library
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">
                    This content has been added to your personal library. Access it anytime from your profile.
                  </p>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate('/profile')}
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    View Library
                  </Button>
                </CardContent>
              </Card>

              {/* More Coins */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Gift className="w-5 h-5 mr-2 text-red-500" />
                    Need More Coins?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">
                    Continue unlocking more content with additional coin packages.
                  </p>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate('/shop-all')}
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Buy More Coins
                  </Button>
                </CardContent>
              </Card>

              {/* Continue Shopping */}
              <Button
                onClick={handleContinueShopping}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UnlockSuccess;