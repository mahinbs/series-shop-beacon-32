import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, CreditCard, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const CoinPurchase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get package data from location state or default
  const packageData = location.state?.package || {
    amount: 100,
    price: 0.99,
    bonus: 0
  };

  const totalCoins = packageData.amount + packageData.bonus;

  const handlePurchase = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Purchase Successful!",
        description: `You've received ${totalCoins} coins!`,
      });
      
      // Redirect to success page or back to previous page
      setTimeout(() => {
        navigate('/payment-success', { 
          state: { 
            coins: totalCoins,
            amount: packageData.price 
          }
        });
      }, 1000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                <Coins className="w-8 h-8 text-yellow-500" />
                Purchase Coins
              </h1>
              <p className="text-muted-foreground">
                Secure payment processing for your coin purchase
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">{packageData.amount.toLocaleString()} Coins</span>
                    </div>
                    {packageData.bonus > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          +{packageData.bonus} Bonus
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">
                      ${packageData.price}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Coins:</span>
                    <span className="text-yellow-500">{totalCoins.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold mt-2">
                    <span>Total Price:</span>
                    <span className="text-foreground">${packageData.price}</span>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Secure Payment</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Card Number</label>
                    <div className="mt-1 p-3 border border-border rounded-md bg-muted">
                      <span className="text-muted-foreground">**** **** **** 1234</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                      <div className="mt-1 p-3 border border-border rounded-md bg-muted">
                        <span className="text-muted-foreground">12/25</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">CVV</label>
                      <div className="mt-1 p-3 border border-border rounded-md bg-muted">
                        <span className="text-muted-foreground">***</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Cardholder Name</label>
                    <div className="mt-1 p-3 border border-border rounded-md bg-muted">
                      <span className="text-muted-foreground">John Doe</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <Button 
                    className="w-full"
                    size="lg"
                    onClick={handlePurchase}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Complete Purchase ${packageData.price}
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      By completing this purchase, you agree to our Terms of Service
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Info */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Protected Payment</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CoinPurchase;