import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ArrowLeft, CreditCard, Lock, ShoppingCart, MapPin, Mail, Plus, Clock, Star } from 'lucide-react';

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  couponCode: string;
}

const Checkout = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { product, quantity, totalPrice } = location.state || {};
  
  console.log('🔍 Checkout page loaded');
  console.log('📍 Current productId from params:', productId);
  console.log('📦 Location state:', location.state);
  console.log('🛒 Product data:', product);
  console.log('📊 Quantity:', quantity);
  console.log('💰 Total price:', totalPrice);
  
  // Mock upcoming releases data
  const upcomingReleases = [
    {
      id: 1,
      title: "Attack on Titan",
      subtitle: "Final Season",
      price: 29.99,
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      releaseDate: "Dec 15, 2024"
    },
    {
      id: 2,
      title: "One Piece",
      subtitle: "Special Edition", 
      price: 34.99,
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      releaseDate: "Jan 10, 2025"
    },
    {
      id: 3,
      title: "Demon Slayer",
      subtitle: "Complete Collection",
      price: 39.99,
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      releaseDate: "Feb 20, 2025"
    },
    {
      id: 4,
      title: "Jujutsu Kaisen",
      subtitle: "Limited Edition",
      price: 32.99,
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      releaseDate: "Mar 15, 2025"
    }
  ];

  // Leaving soon items with images
  const leavingSoonItems = [
    {
      id: 1,
      title: "My Hero Academia Vol. 30",
      author: "Kohei Horikoshi",
      discount: "15%",
      expiresIn: "1 day",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      originalPrice: 12.99,
      salePrice: 11.04
    },
    {
      id: 2,
      title: "Tokyo Ghoul Complete Series", 
      author: "Sui Ishida",
      discount: "25%",
      expiresIn: "2 days",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      originalPrice: 89.99,
      salePrice: 67.49
    },
    {
      id: 3,
      title: "Death Note Box Set",
      author: "Tsugumi Ohba", 
      discount: "20%",
      expiresIn: "3 days",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      originalPrice: 59.99,
      salePrice: 47.99
    }
  ];

  const form = useForm<CheckoutFormData>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
      couponCode: ''
    }
  });

  // Detect product type and calculate shipping
  const productType = product?.type || 'physical';
  const subtotal = totalPrice || 0;
  const shipping = productType === 'physical' ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    navigate('/payment-success', {
      state: {
        orderData: {
          ...data,
          product,
          quantity,
          subtotal,
          tax,
          total,
          orderNumber: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        }
      }
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Product not found</h2>
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

        {/* Upcoming Releases Section */}
        <div className="mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Upcoming Releases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {upcomingReleases.map((release) => (
                  <div key={release.id} className="text-center group cursor-pointer">
                    <div className="relative mb-3">
                      <img
                        src={release.imageUrl}
                        alt={release.title}
                        className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs"
                        >
                          PRE-ORDER
                        </Button>
                      </div>
                    </div>
                    <h4 className="text-white text-sm font-semibold mb-1">{release.title}</h4>
                    <p className="text-gray-400 text-xs mb-1">{release.subtitle}</p>
                    <p className="text-red-400 text-sm font-bold">${release.price}</p>
                    <p className="text-gray-400 text-xs flex items-center justify-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {release.releaseDate}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side - Upcoming Releases and Order Summary */}
          <div className="lg:col-span-5 space-y-6">

            {/* Pre-Order Benefits */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Pre-Order Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Free shipping on all pre-orders</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Early access to exclusive content</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Limited edition covers available</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Priority customer support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Product */}
                <div className="flex space-x-4 p-4 bg-gray-700/50 rounded-lg">
                  <img
                    src={product.images?.[0] || product.imageUrl}
                    alt={product.title}
                    className="w-16 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm">{product.title}</h4>
                    <p className="text-gray-400 text-xs">by {product.author}</p>
                    <p className="text-gray-400 text-xs">Qty: {quantity}</p>
                    <p className="text-white font-semibold">${product.price}</p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-400" : ""}>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Checkout Form */}
          <div className="lg:col-span-7">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-xl">
                  <ShoppingCart className="w-5 h-5 mr-2 text-red-500" />
                  Checkout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-red-500" />
                        Contact Information
                      </h3>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="email"
                                className="bg-gray-700 border-gray-600 text-white focus:border-red-500"
                                placeholder="your.email@example.com"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Shipping Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                        Shipping Address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">First Name</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="bg-gray-700 border-gray-600 text-white focus:border-red-500"
                                  placeholder="John"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Last Name</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="bg-gray-700 border-gray-600 text-white focus:border-red-500"
                                  placeholder="Doe"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Address</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-gray-700 border-gray-600 text-white focus:border-red-500"
                                placeholder="123 Main Street"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">City</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="bg-gray-700 border-gray-600 text-white focus:border-red-500"
                                  placeholder="New York"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">State</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="bg-gray-700 border-gray-600 text-white focus:border-red-500"
                                  placeholder="NY"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">ZIP Code</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="bg-gray-700 border-gray-600 text-white focus:border-red-500"
                                  placeholder="10001"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Coupon Code */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Coupon Code</h3>
                      <FormField
                        control={form.control}
                        name="couponCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-gray-700 border-gray-600 text-white focus:border-red-500"
                                placeholder="Enter coupon code"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Leaving Soon Section */}
                      <div className="mt-6 p-4 bg-orange-900/30 border border-orange-500/30 rounded-lg">
                        <div className="flex items-center space-x-2 mb-4">
                          <Clock className="w-5 h-5 text-orange-400" />
                          <span className="text-orange-300 font-semibold text-lg">Leaving Soon</span>
                        </div>
                        <div className="space-y-4">
                          {leavingSoonItems.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-12 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="text-white font-medium text-sm">{item.title}</h4>
                                <p className="text-gray-400 text-xs">{item.author}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-orange-400 font-semibold text-sm">{item.discount} OFF</span>
                                  <span className="text-gray-400 text-xs">• Expires in {item.expiresIn}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-400 line-through text-xs">${item.originalPrice}</span>
                                  <span className="text-red-400 font-semibold text-sm">${item.salePrice}</span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs"
                              >
                                Add
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <CreditCard className="w-4 h-4 mr-2 text-red-500" />
                        Payment Information
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="cardName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Cardholder Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-gray-700 border-gray-600 text-white focus:border-red-500"
                                placeholder="John Doe"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Card Number</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-gray-700 border-gray-600 text-white focus:border-red-500"
                                placeholder="1234 5678 9012 3456"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Expiry Date</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="bg-gray-700 border-gray-600 text-white focus:border-red-500"
                                  placeholder="MM/YY"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">CVV</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="bg-gray-700 border-gray-600 text-white focus:border-red-500"
                                  placeholder="123"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing Payment...
                        </div>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Complete Checkout - ${total.toFixed(2)}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Recommended for You Section - Separate Container */}
      <div className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <Plus className="w-5 h-5 mr-2 text-red-500" />
                Recommended for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    id: 1,
                    title: "One Piece Vol. 99",
                    author: "Eiichiro Oda",
                    price: 11.99,
                    originalPrice: 14.99,
                    imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
                    discount: "20%"
                  },
                  {
                    id: 2,
                    title: "Naruto Vol. 72",
                    author: "Masashi Kishimoto",
                    price: 10.99,
                    originalPrice: 12.99,
                    imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
                    discount: "15%"
                  },
                  {
                    id: 3,
                    title: "Dragon Ball Super Vol. 15",
                    author: "Akira Toriyama",
                    price: 9.99,
                    originalPrice: 11.99,
                    imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
                    discount: "17%"
                  },
                  {
                    id: 4,
                    title: "Bleach Vol. 74",
                    author: "Tite Kubo",
                    price: 12.99,
                    originalPrice: 15.99,
                    imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
                    discount: "19%"
                  }
                ].map((item) => (
                  <div key={item.id} className="group cursor-pointer">
                    <div className="relative mb-3 overflow-hidden rounded-lg">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        {item.discount} OFF
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-white font-semibold text-sm group-hover:text-red-300 transition-colors duration-300">
                        {item.title}
                      </h4>
                      <p className="text-gray-400 text-xs">{item.author}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-red-400 font-bold">${item.price}</span>
                        <span className="text-gray-500 line-through text-sm">${item.originalPrice}</span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white text-xs py-1"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;