import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Heart, ShoppingCart, Package, Truck, Shield, RotateCcw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MerchandiseDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Get product data from location state or use mock data
  const product = location.state?.product || {
    id: parseInt(productId || '1'),
    title: "One Piece Figure Set",
    category: "Figures",
    type: "Collectibles",
    description: "Premium quality figures featuring Luffy, Zoro, and Sanji from the Straw Hat Pirates.",
    imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
    rating: 5,
    popularity: 95,
    price: "$89.99",
    priceValue: 89.99,
    inStock: true,
    reviews: "2.1K"
  };

  const sizes = ['S', 'M', 'L', 'XL'];
  const images = [
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
    product.imageUrl
  ];

  const handleCheckout = () => {
    console.log('🛍️ Proceeding to checkout for merchandise');
    console.log('📦 Product:', product);
    console.log('📊 Quantity:', quantity);
    
    navigate(`/checkout/${productId}`, {
      state: {
        product: {
          ...product,
          price: product.priceValue || parseFloat(product.price.replace('$', ''))
        },
        quantity,
        totalPrice: (product.priceValue || parseFloat(product.price.replace('$', ''))) * quantity
      }
    });
  };

  const totalPrice = (product.priceValue || parseFloat(product.price.replace('$', ''))) * quantity;

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/shop-all')}
          className="text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <div key={index} className="aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-red-600 text-white">
                  {product.category}
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {product.type}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-gray-400 ml-2">({product.reviews} reviews)</span>
                </div>
              </div>
              <p className="text-xl font-bold text-white mb-4">{product.price}</p>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection (if applicable) */}
            {product.category === 'Apparel' && (
              <div>
                <h3 className="text-white font-semibold mb-3">Size</h3>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md transition-colors ${
                        selectedSize === size
                          ? 'border-red-500 bg-red-500/10 text-red-400'
                          : 'border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-white font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-600 rounded-md text-gray-400 hover:border-gray-500 hover:text-white transition-colors"
                >
                  -
                </button>
                <span className="text-white font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-600 rounded-md text-gray-400 hover:border-gray-500 hover:text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleCheckout}
                disabled={!product.inStock}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.inStock ? `Checkout - $${totalPrice.toFixed(2)}` : 'Out of Stock'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="w-full border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400"
              >
                <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            {/* Product Features */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-300">
                    <Truck className="w-5 h-5 mr-3 text-red-400" />
                    <div>
                      <div className="font-semibold">Free Shipping</div>
                      <div className="text-sm text-gray-400">On orders over $50</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 mr-3 text-red-400" />
                    <div>
                      <div className="font-semibold">Authentic</div>
                      <div className="text-sm text-gray-400">100% Official</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <RotateCcw className="w-5 h-5 mr-3 text-red-400" />
                    <div>
                      <div className="font-semibold">Easy Returns</div>
                      <div className="text-sm text-gray-400">30-day policy</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Package className="w-5 h-5 mr-3 text-red-400" />
                    <div>
                      <div className="font-semibold">Gift Wrapping</div>
                      <div className="text-sm text-gray-400">Available</div>
                    </div>
                  </div>
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

export default MerchandiseDetail;