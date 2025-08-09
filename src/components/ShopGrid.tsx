import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Diamond, ShoppingCart, Star, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShopGrid = () => {
  const navigate = useNavigate();
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const products = [
    {
      id: 1,
      title: "One Piece Vol. 98",
      author: "Eiichiro Oda",
      category: "Manga",
      price: "$11.99",
      originalPrice: "$14.99",
      coins: "1199 coins",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      isNew: true,
      isOnSale: true,
      rating: 5,
      inStock: true
    },
    {
      id: 2,
      title: "Attack on Titan Vol. 34",
      author: "Hajime Isayama",
      category: "Manga",
      price: "$12.99",
      coins: "1299 coins",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      isNew: true,
      rating: 5,
      inStock: true
    },
    {
      id: 3,
      title: "Demon Slayer Figure Set",
      author: "Koyoharu Gotouge",
      category: "Merchandise",
      price: "$49.99",
      coins: "4999 coins",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      rating: 4,
      inStock: false
    },
    {
      id: 4,
      title: "Jujutsu Kaisen Vol. 15",
      author: "Gege Akutami",
      category: "Manga",
      price: "$9.99",
      originalPrice: "$13.99",
      coins: "999 coins",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      isOnSale: true,
      rating: 4,
      inStock: true
    },
    {
      id: 5,
      title: "Chainsaw Man Vol. 8",
      author: "Tatsuki Fujimoto",
      category: "Manga",
      price: "$10.99",
      coins: "1099 coins",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      rating: 5,
      inStock: true
    },
    {
      id: 6,
      title: "Tokyo Ghoul Complete Box Set",
      author: "Sui Ishida",
      category: "Collectibles",
      price: "$159.99",
      coins: "15999 coins",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      rating: 5,
      inStock: true
    }
  ];

  const handleProductClick = (productId: number) => {
    console.log('🔍 Product clicked:', productId);
    console.log('📍 Current location:', window.location.pathname);
    console.log('🚀 Navigating to:', `/pre-order/${productId}`);
    navigate(`/pre-order/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    console.log('🛒 Add to Cart clicked for product:', productId);
    console.log('📍 Current location:', window.location.pathname);
    console.log('🚀 Navigating to pre-order page:', `/pre-order/${productId}`);
    navigate(`/pre-order/${productId}`);
  };

  return (
    <section className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">
            All Products <span className="text-gray-400 text-lg font-normal">({products.length} items)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden hover:from-gray-750 hover:to-gray-850 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 border border-gray-700/50 hover:border-red-500/30 cursor-pointer"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              onClick={() => handleProductClick(product.id)}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                opacity: 1,
                transform: 'translateY(0)'
              }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.title}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 space-y-2">
                  {product.isNew && (
                    <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                      NEW
                    </span>
                  )}
                  {product.isOnSale && (
                    <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                      SALE
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      PRE-ORDER
                    </span>
                  )}
                </div>


                {/* Quick view button - appears on hover */}
                {hoveredProduct === product.id && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                      size="sm"
                      className="bg-white text-black hover:bg-gray-200 transform hover:scale-105 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('👁️ Quick view clicked for:', product.title);
                        handleProductClick(product.id);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Quick View
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-red-400 text-xs font-semibold uppercase tracking-wide">{product.category}</span>
                  {product.rating && (
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 transition-all duration-300 ${
                            i < product.rating 
                              ? 'text-yellow-400 fill-current group-hover:scale-125' 
                              : 'text-gray-600'
                          }`}
                          style={{ transitionDelay: `${i * 50}ms` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-lg truncate group-hover:text-red-300 transition-colors duration-300 flex-1 mr-2">{product.title}</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 transform hover:scale-110 w-8 h-8 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('💎 Added to wishlist:', product.title);
                    }}
                  >
                    <Diamond className="w-4 h-4 transition-transform duration-300 group-hover:animate-pulse" />
                  </Button>
                </div>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">{product.author}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold text-lg group-hover:text-red-300 transition-colors duration-300">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-gray-500 line-through text-sm">{product.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs">{product.coins}</span>
                </div>
                
                <div className="flex flex-col space-y-2 pt-2">
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                    onClick={(e) => handleAddToCart(e, product.id)}
                  >
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Add to Cart
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full bg-white border-gray-600 text-black hover:bg-gray-100 hover:text-black text-xs transform hover:scale-105 transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/checkout/${product.id}`);
                    }}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopGrid;
