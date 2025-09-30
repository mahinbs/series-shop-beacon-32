import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingCart,
  Package,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  Zap,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const MerchandiseDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get product data from location state
  const productData = location.state?.product;

  // Debug logging
  console.log("🔍 MerchandiseDetail - Product Data:", productData);
  console.log("🔍 MerchandiseDetail - Product ID:", productId);
  console.log("🔍 MerchandiseDetail - Location State:", location.state);

  // Fetch product data if not available in location state
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productData && productId) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from("books")
            .select("*")
            .eq("id", productId)
            .eq("product_type", "merchandise")
            .single();

          if (error) {
            console.error("Error fetching product:", error);
          } else {
            console.log("🔍 Fetched product data:", data);
            setFetchedProduct(data);
          }
        } catch (err) {
          console.error("Error in fetchProduct:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();
  }, [productData, productId]);

  // Use productData from location state or fetchedProduct
  const actualProductData = productData || fetchedProduct;

  // Transform database product data to match component expectations
  const product = actualProductData
    ? {
        id: actualProductData.id,
        title: actualProductData.title,
        category: actualProductData.category || "Merchandise",
        type: actualProductData.product_type || "Collectibles",
        description:
          actualProductData.description || "Premium quality merchandise item.",
        imageUrl:
          actualProductData.image_url ||
          actualProductData.hover_image_url ||
          "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
        rating: 5, // Default rating since it's not in database
        popularity: 95, // Default popularity
        price: `$${actualProductData.price || "0.00"}`,
        priceValue: Number(actualProductData.price) || 0,
        inStock: !!actualProductData.stock_quantity,
        reviews: "2.1K", // Default reviews
        originalPrice: actualProductData.original_price,
        stockQuantity: actualProductData.stock_quantity,
        isNew: actualProductData.is_new,
        canUnlockWithCoins: actualProductData.can_unlock_with_coins,
        coins: actualProductData.coins,
      }
    : {
        id: parseInt(productId || "1"),
        title: "One Piece Figure Set",
        category: "Figures",
        type: "Collectibles",
        description:
          "Premium quality figures featuring Luffy, Zoro, and Sanji from the Straw Hat Pirates.",
        imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
        rating: 5,
        popularity: 95,
        price: "$89.99",
        priceValue: 89.99,
        inStock: true,
        reviews: "2.1K",
      };

  const sizes = ["S", "M", "L", "XL"];
  const images = [
    product.imageUrl,
    actualProductData?.hover_image_url || product.imageUrl,
    product.imageUrl,
    product.imageUrl,
  ].filter(Boolean);

  const handleCheckout = () => {
    console.log("🛍️ Proceeding to checkout for merchandise");
    console.log("📦 Product:", product);
    console.log("📊 Quantity:", quantity);

    navigate(`/checkout/${productId}`, {
      state: {
        product: {
          ...product,
          price:
            product.priceValue ||
            parseFloat(
              typeof product.price === "string"
                ? product.price.replace("$", "")
                : product.price
            ),
        },
        quantity,
        totalPrice:
          (product.priceValue ||
            parseFloat(
              typeof product.price === "string"
                ? product.price.replace("$", "")
                : product.price
            )) * quantity,
      },
    });
  };

  const totalPrice =
    (product.priceValue ||
      parseFloat(
        typeof product.price === "string"
          ? product.price.replace("$", "")
          : product.price
      )) * quantity;

  // Handle image navigation
  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Handle touch/swipe events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      // Only handle horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          handlePreviousImage();
        } else {
          handleNextImage();
        }
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-muted-foreground">
            Loading merchandise details...
          </div>
        </div>
      </div>
    );
  }

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
            onClick={() => navigate("/shop-all")}
            className="text-muted-foreground hover:text-foreground mb-6 group transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Shop
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-6">
              {/* Main Image with Enhanced Styling */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-heart via-diamond to-spade rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div
                  className="relative aspect-[4/3] bg-card border border-border rounded-lg overflow-hidden shadow-2xl"
                  onTouchStart={handleTouchStart}
                >
                  <img
                    src={images[currentImageIndex]}
                    alt={product.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePreviousImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}

                  {/* Overlay Badges */}
                  <div className="absolute top-4 left-4 space-y-2">
                    {product.inStock && (
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                        <Zap className="w-3 h-3 mr-1" />
                        In Stock
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                        NEW
                      </Badge>
                    )}
                    {product.stockQuantity && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
                        {product.stockQuantity} left
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => handleImageChange(index)}
                    className={`aspect-square bg-card border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      currentImageIndex === index
                        ? "border-heart shadow-lg shadow-heart/20 opacity-100"
                        : "border-border opacity-70 hover:opacity-100"
                    }`}
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
            <div className="space-y-8">
              {/* Product Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-gradient-to-r from-heart to-heart/80 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <Award className="w-3 h-3 mr-1" />
                    {product.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-muted-foreground/30 text-muted-foreground hover:border-foreground hover:text-foreground transition-colors duration-300"
                  >
                    {product.type}
                  </Badge>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-foreground bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
                  {product.title}
                </h1>

                <div className="flex items-baseline gap-4 mb-6">
                  <p className="text-4xl font-bold text-white">
                    {product.price}
                  </p>
                  {product.originalPrice && (
                    <>
                      <p className="text-lg text-muted-foreground line-through">
                        ${Number(product.originalPrice).toFixed(2)}
                      </p>
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        {Math.round(
                          ((Number(product.originalPrice) -
                            Number(product.priceValue)) /
                            Number(product.originalPrice)) *
                            100
                        )}
                        % OFF
                      </Badge>
                    </>
                  )}
                </div>

                <p className="text-white leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Size Selection (Enhanced) */}
              {product.category === "Apparel" && (
                <div className="space-y-4">
                  <h3 className="text-foreground font-semibold text-lg">
                    Size
                  </h3>
                  <div className="flex gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 border rounded-lg transition-all duration-300 font-medium ${
                          selectedSize === size
                            ? "border-heart bg-heart/10 text-heart shadow-lg shadow-heart/20"
                            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground hover:bg-accent/50"
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
                <h3 className="text-foreground font-semibold text-lg">
                  Quantity
                </h3>
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
                  {product.inStock
                    ? `Add to Cart - $${totalPrice.toFixed(2)}`
                    : "Out of Stock"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="w-full h-12 border-border text-muted-foreground hover:border-heart hover:text-heart hover:bg-heart/5 transition-all duration-300"
                >
                  <Heart
                    className={`w-5 h-5 mr-3 transition-all duration-300 ${
                      isWishlisted ? "fill-current text-heart scale-110" : ""
                    }`}
                  />
                  {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
                </Button>
              </div>
              <div className="bg-gray-800 rounded-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        Free Shipping
                      </h3>
                      <p className="text-sm text-gray-400">
                        On orders over $50
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        Authentic
                      </h3>
                      <p className="text-sm text-gray-400">100% Official</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <RotateCcw className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        Easy Returns
                      </h3>
                      <p className="text-sm text-gray-400">30-day policy</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        Gift Wrapping
                      </h3>
                      <p className="text-sm text-gray-400">Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      {/* <div className="py-16 bg-gradient-to-br from-accent/20 via-background to-secondary/20">
        <div className="container mx-auto px-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-2xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Why Choose Our Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-heart to-heart/80 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-semibold text-foreground mb-2">
                    Free Shipping
                  </div>
                  <div className="text-sm text-muted-foreground">
                    On orders over $50
                  </div>
                </div>

                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-diamond to-diamond/80 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-semibold text-foreground mb-2">
                    100% Authentic
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Official merchandise
                  </div>
                </div>

                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-club to-club/80 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <RotateCcw className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-semibold text-foreground mb-2">
                    Easy Returns
                  </div>
                  <div className="text-sm text-muted-foreground">
                    30-day policy
                  </div>
                </div>

                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-spade to-spade/80 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-semibold text-foreground mb-2">
                    Gift Wrapping
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Available at checkout
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div> */}

      <Footer />
    </div>
  );
};

export default MerchandiseDetail;
