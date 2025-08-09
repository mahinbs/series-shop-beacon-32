import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Mail, Package, Calendar, CreditCard, MapPin, User } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { orderData } = location.state || {};

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Order not found</h2>
          <Button onClick={() => navigate('/shop-all')}>Return to Shop</Button>
        </div>
      </div>
    );
  }

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    console.log('Downloading receipt for order:', orderData.orderNumber);
  };

  const handleTrackOrder = () => {
    // In a real app, this would navigate to order tracking page
    console.log('Tracking order:', orderData.orderNumber);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Order Confirmed!</h1>
            <p className="text-xl text-gray-300 mb-2">
              Thank you for your order. We'll notify you when your item ships.
            </p>
            <p className="text-lg text-gray-400">
              Order Number: <span className="text-white font-semibold">{orderData.orderNumber}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Information */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Package className="w-5 h-5 mr-2 text-green-400" />
                    Order Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <img
                      src={orderData.product.images?.[0] || orderData.product.imageUrl}
                      alt={orderData.product.title}
                      className="w-20 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg">{orderData.product.title}</h3>
                      <p className="text-gray-400">by {orderData.product.author}</p>
                      <p className="text-gray-400">Quantity: {orderData.quantity}</p>
                      <div className="flex items-center mt-2">
                        <Calendar className="w-4 h-4 text-purple-400 mr-2" />
                        <span className="text-purple-300 text-sm">Expected Release: {orderData.product.releaseDate}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Package className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="text-blue-300 text-sm">Estimated Shipping: {orderData.product.estimatedShipping}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">${orderData.product.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-300">
                    <p className="font-semibold">{orderData.firstName} {orderData.lastName}</p>
                    <p>{orderData.address}</p>
                    <p>{orderData.city}, {orderData.state} {orderData.zipCode}</p>
                    <p>{orderData.country}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-yellow-400" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div className="text-gray-300">
                      <p>•••• •••• •••• {orderData.cardNumber?.slice(-4) || '1234'}</p>
                      <p className="text-sm text-gray-400">{orderData.cardName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary & Actions */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${orderData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>${orderData.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span>${orderData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">What's Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      onClick={handleDownloadReceipt}
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                    </Button>
                    
                    <Button
                      onClick={handleTrackOrder}
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Track Order
                    </Button>
                    
                    <Button
                      onClick={() => navigate('/shop-all')}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Email Confirmation */}
              <Card className="bg-blue-900/20 border-blue-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 text-blue-300">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Confirmation email sent to</span>
                  </div>
                  <p className="text-blue-200 font-semibold mt-1">{orderData.email}</p>
                </CardContent>
              </Card>

              {/* Support */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <h4 className="text-white font-semibold mb-2">Need Help?</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Contact our support team if you have any questions about your order.
                  </p>
                  <Button
                    onClick={() => navigate('/contact-us')}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Contact Support
                  </Button>
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

export default PaymentSuccess;
