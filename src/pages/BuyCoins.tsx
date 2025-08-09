import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Coins, CreditCard, Smartphone, Wallet, Crown, Star, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const BuyCoins = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState('package-2');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Mock coin packages
  const coinPackages = [
    {
      id: 'package-1',
      coins: 100,
      price: 99,
      bonus: 0,
      popular: false,
      savings: 0
    },
    {
      id: 'package-2',
      coins: 300,
      price: 249,
      bonus: 50,
      popular: true,
      savings: 20
    },
    {
      id: 'package-3',
      coins: 600,
      price: 449,
      bonus: 150,
      popular: false,
      savings: 25
    },
    {
      id: 'package-4',
      coins: 1200,
      price: 799,
      bonus: 400,
      popular: false,
      savings: 35
    }
  ];

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Pay with any UPI app' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Rupay' },
    { id: 'wallet', name: 'Digital Wallet', icon: Wallet, description: 'Paytm, PhonePe, Google Pay' }
  ];

  const selectedPackageData = coinPackages.find(pkg => pkg.id === selectedPackage);

  const handlePurchase = () => {
    // In real app, this would integrate with payment gateway
    console.log('Processing payment...', { selectedPackage, paymentMethod });
    // Mock success - redirect to success page
    navigate('/payment-success', { 
      state: { 
        coins: selectedPackageData?.coins,
        bonus: selectedPackageData?.bonus,
        total: selectedPackageData ? selectedPackageData.coins + selectedPackageData.bonus : 0
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Buy Coins</h1>
            <p className="text-xl text-gray-300">Unlock amazing comics and support your favorite creators</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coin Packages */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-white mb-6">Choose Your Package</h2>
              
              <RadioGroup value={selectedPackage} onValueChange={setSelectedPackage} className="space-y-4">
                {coinPackages.map((pkg) => (
                  <div key={pkg.id} className="relative">
                    <RadioGroupItem value={pkg.id} id={pkg.id} className="sr-only" />
                    <Label 
                      htmlFor={pkg.id} 
                      className={`block cursor-pointer transition-all duration-300 ${
                        selectedPackage === pkg.id 
                          ? 'ring-2 ring-red-500 transform scale-105' 
                          : 'hover:ring-1 hover:ring-gray-600'
                      }`}
                    >
                      <Card className={`bg-gray-800 border-gray-700 ${pkg.popular ? 'border-yellow-500' : ''}`}>
                        <CardContent className="p-6">
                          {pkg.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <Badge className="bg-yellow-600 text-white">
                                <Crown className="w-3 h-3 mr-1" />
                                Most Popular
                              </Badge>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Coins className="w-6 h-6 text-yellow-400" />
                                <span className="text-2xl font-bold text-white">{pkg.coins}</span>
                                <span className="text-gray-400">coins</span>
                              </div>
                              
                              {pkg.bonus > 0 && (
                                <div className="flex items-center gap-2 text-green-400">
                                  <Star className="w-4 h-4" />
                                  <span className="text-sm">+{pkg.bonus} bonus coins</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="text-right">
                              <div className="text-2xl font-bold text-white">₹{pkg.price}</div>
                              {pkg.savings > 0 && (
                                <Badge className="bg-green-600 text-white text-xs">
                                  {pkg.savings}% OFF
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-400">
                            Total: {pkg.coins + pkg.bonus} coins
                          </div>
                          
                          {pkg.bonus > 0 && (
                            <div className="mt-3 p-3 bg-green-600/10 border border-green-600/20 rounded-lg">
                              <div className="flex items-center gap-2 text-green-400 text-sm">
                                <Zap className="w-4 h-4" />
                                <span>Limited time bonus!</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Order Summary & Payment */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800 border-gray-700 sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Order Summary</h3>
                  
                  {selectedPackageData && (
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Base Coins:</span>
                        <span className="text-white">{selectedPackageData.coins}</span>
                      </div>
                      
                      {selectedPackageData.bonus > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Bonus Coins:</span>
                          <span className="text-green-400">+{selectedPackageData.bonus}</span>
                        </div>
                      )}
                      
                      <hr className="border-gray-700" />
                      
                      <div className="flex justify-between font-semibold">
                        <span className="text-white">Total Coins:</span>
                        <span className="text-white">{selectedPackageData.coins + selectedPackageData.bonus}</span>
                      </div>
                      
                      <div className="flex justify-between font-semibold text-lg">
                        <span className="text-white">Amount:</span>
                        <span className="text-white">₹{selectedPackageData.price}</span>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-4">Payment Method</h4>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-3">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <Label htmlFor={method.id} className="flex items-center gap-3 cursor-pointer flex-1">
                            <method.icon className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="text-white font-medium">{method.name}</div>
                              <div className="text-gray-400 text-sm">{method.description}</div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <Button 
                    onClick={handlePurchase}
                    className="w-full bg-red-600 hover:bg-red-700 text-lg py-3"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay ₹{selectedPackageData?.price}
                  </Button>

                  <div className="mt-4 text-center text-xs text-gray-400">
                    <p>🔒 Secure payment powered by industry-standard encryption</p>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="bg-gray-800 border-gray-700 mt-6">
                <CardContent className="p-6">
                  <h4 className="text-white font-semibold mb-4">Why Buy Coins?</h4>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>Support amazing creators</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span>Unlock premium episodes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-purple-400" />
                      <span>Get early access to new content</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BuyCoins;