import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Heart, ShoppingCart, Package, Truck, Shield, RotateCcw, Plus, Minus, Zap, Award } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

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

  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { elementRef: detailsRef, isVisible: detailsVisible } = useScrollAnimation();
  const { elementRef: featuresRef, isVisible: featuresVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--heart))_0%,transparent_50%)] opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--diamond))_0%,transparent_50%)] opacity-10" />
        
        <div className="relative container mx-auto px-4 py-8">
      {/* Back Button */}
        <Button
          variant="ghost"
            onClick={() => navigate('/shop-all')}
            className="text-muted-foreground hover:text-foreground mb-6 group transition-all duration-300"
        >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Shop
        </Button>

          <div 
            ref={heroRef as any}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 transition-all duration-1000 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Product Images */}
            <div className="space-y-6">
              {/* Main Image with Enhanced Styling */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-heart via-diamond to-spade rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative aspect-square bg-card border border-border rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay Badges */}
                  <div className="absolute top-4 left-4 space-y-2">
                    {product.inStock && (
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                        <Zap className="w-3 h-3 mr-1" />
                        In Stock
                      </Badge>
                    )}
            </div>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <div 
                    key={index}
                    className="aspect-square bg-card border border-border rounded-lg overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
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
            <div 
              ref={detailsRef as any}
              className={`space-y-8 transition-all duration-1000 delay-300 ${
                detailsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {/* Product Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-gradient-to-r from-heart to-heart/80 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <Award className="w-3 h-3 mr-1" />
                    {product.category}
                  </Badge>
                  <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground hover:border-foreground hover:text-foreground transition-colors duration-300">
                    {product.type}
                  </Badge>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
                  {product.title}
                </h1>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 transition-colors duration-300 ${
                          i < product.rating 
                            ? 'text-yellow-400 fill-current drop-shadow-sm' 
                            : 'text-muted-foreground/40'
                        }`}
                      />
                    ))}
                    <span className="text-muted-foreground ml-3 font-medium">({product.reviews} reviews)</span>
            </div>
          </div>

                <div className="flex items-baseline gap-4 mb-6">
                  <p className="text-4xl font-bold bg-gradient-to-r from-heart to-diamond bg-clip-text text-transparent">
                    {product.price}
                  </p>
                  <p className="text-lg text-muted-foreground line-through">
                    ${(product.priceValue * 1.2).toFixed(2)}
                  </p>
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    17% OFF
                  </Badge>
                </div>

                <p className="text-muted-foreground leading-relaxed text-lg">{product.description}</p>
                      </div>

              {/* Size Selection (Enhanced) */}
              {product.category === 'Apparel' && (
                <div className="space-y-4">
                  <h3 className="text-foreground font-semibold text-lg">Size</h3>
                  <div className="flex gap-3">
                    {sizes.map((size) => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 border rounded-lg transition-all duration-300 font-medium ${
                          selectedSize === size
                            ? 'border-heart bg-heart/10 text-heart shadow-lg shadow-heart/20'
                            : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground hover:bg-accent/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
              </div>
            </div>
          )}

              {/* Quantity Selector (Enhanced) */}
              <div className="space-y-4">
                <h3 className="text-foreground font-semibold text-lg">Quantity</h3>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border-border hover:border-foreground hover:bg-accent transition-colors duration-300"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-foreground font-bold text-xl w-16 text-center bg-accent/30 py-2 rounded-lg">
                    {quantity}
                </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 border-border hover:border-foreground hover:bg-accent transition-colors duration-300"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
              </div>
              </div>

              {/* Action Buttons (Enhanced) */}
              <div className="space-y-4">
                <Button
                  onClick={handleCheckout}
                  disabled={!product.inStock}
                  className="w-full h-14 bg-gradient-to-r from-heart to-heart/90 hover:from-heart/90 hover:to-heart text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  {product.inStock ? `Add to Cart - $${totalPrice.toFixed(2)}` : 'Out of Stock'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="w-full h-12 border-border text-muted-foreground hover:border-heart hover:text-heart hover:bg-heart/5 transition-all duration-300"
                >
                  <Heart className={`w-5 h-5 mr-3 transition-all duration-300 ${
                    isWishlisted ? 'fill-current text-heart scale-110' : ''
                  }`} />
                  {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
            </div>
          </div>
            </div>
          </div>

      {/* Features Section */}
      <div 
        ref={featuresRef as any}
        className={`py-16 bg-gradient-to-br from-accent/20 via-background to-secondary/20 transition-all duration-1000 ${
          featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-2xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Why Choose Our Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-heart to-heart/80 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Truck className="w-8 h-8 text-white" />
                      </div>
                  <div className="font-semibold text-foreground mb-2">Free Shipping</div>
                  <div className="text-sm text-muted-foreground">On orders over $50</div>
                      </div>
                
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-diamond to-diamond/80 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                          </div>
                  <div className="font-semibold text-foreground mb-2">100% Authentic</div>
                  <div className="text-sm text-muted-foreground">Official merchandise</div>
                        </div>

                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-club to-club/80 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <RotateCcw className="w-8 h-8 text-white" />
                          </div>
                  <div className="font-semibold text-foreground mb-2">Easy Returns</div>
                  <div className="text-sm text-muted-foreground">30-day policy</div>
                        </div>
                
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-spade to-spade/80 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-semibold text-foreground mb-2">Gift Wrapping</div>
                  <div className="text-sm text-muted-foreground">Available at checkout</div>
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

export default MerchandiseDetail;