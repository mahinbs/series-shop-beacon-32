import { Button } from '@/components/ui/button';
import { Diamond, ShoppingCart, Sword, Sparkles, Zap, Ghost, Laugh, Crown, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRecommendations } from '@/hooks/useRecommendations';

const RecommendedSection = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.1);
  const navigate = useNavigate();
  const [showGenres, setShowGenres] = useState(false);
  const [activeSection, setActiveSection] = useState<'recommended' | 'genres'>('recommended');
  const [currentPage, setCurrentPage] = useState(0);
  const { recommendations, loading, isPersonalized } = useRecommendations();
  
  const itemsPerPage = 4;
  const totalPages = Math.ceil(recommendations.length / itemsPerPage);
  const currentItems = recommendations.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const genres = [
    { name: 'SLICE OF LIFE', imageUrl: '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png', filter: 'slice-of-life' },
    { name: 'DRAMA', imageUrl: '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png', filter: 'drama' },
    { name: 'HIGH SCHOOL ROMANCE', imageUrl: '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png', filter: 'romance' },
    { name: 'FANTASY', imageUrl: '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png', filter: 'fantasy' },
    { name: 'ACTION TALES', imageUrl: '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png', filter: 'action' }
  ];

  const handleGenreClick = (filter: string) => {
    navigate(`/shop-all?genre=${filter}`);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const viewAll = () => {
    navigate('/shop-all?recommended=true');
  };

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    console.log('🛒 Add to Cart clicked for product:', item.id);
    console.log('📍 Current location:', window.location.pathname);
    console.log('🚀 Navigating to pre-order page:', `/pre-order/${item.id}`);
    navigate(`/pre-order/${item.id}`);
  };

  const handleBuyNow = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    console.log('🚀 BUY NOW CLICKED!');
    console.log('📦 Item:', item);
    console.log('🆔 Item ID:', item.id);
    console.log('💰 Item price:', item.price);
    console.log('📍 Current location:', window.location.pathname);
    
    const productId = item.id;
    const targetUrl = `/direct-checkout/${productId}`;
    
    console.log('🔗 Target URL:', targetUrl);
    console.log('🚀 About to navigate...');
    
    try {
      navigate(targetUrl, {
        state: {
          product: item,
          quantity: 1,
          totalPrice: parseFloat(item.price.replace('$', ''))
        }
      });
      console.log('✅ Navigation successful');
    } catch (error) {
      console.error('❌ Navigation error:', error);
    }
  };

  return (
    <section 
      id="featured-series"
      ref={elementRef}
      className={`relative bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 py-12 overflow-hidden transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`flex items-center justify-between mb-8 transition-all duration-1000 delay-200 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <div className="flex items-center space-x-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  <span 
                    onClick={() => setActiveSection('recommended')}
                    className={`cursor-pointer hover:opacity-80 transition-all duration-300 relative ${
                      activeSection === 'recommended' 
                        ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-400 bg-clip-text text-transparent after:content-[""] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-red-600 after:via-red-500 after:to-red-400 after:rounded-full' 
                        : 'text-white'
                    }`}
                  >
                    {isPersonalized ? 'Recommended For You' : 'Popular Recommendations'}
                  </span>
                  <span className="text-white text-3xl font-bold ml-4">|</span>
                  <span 
                    onClick={() => setActiveSection('genres')}
                    className={`ml-4 cursor-pointer hover:opacity-80 transition-all duration-300 relative ${
                      activeSection === 'genres' 
                        ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-400 bg-clip-text text-transparent after:content-[""] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-red-600 after:via-red-500 after:to-red-400 after:rounded-full' 
                        : 'text-white'
                    }`}
                  >
                    Genres
                  </span>
                </h2>
                <div className="flex items-center space-x-4">
                  <p className="text-gray-400">
                    {activeSection === 'recommended' 
                      ? (isPersonalized ? 'Curated picks based on your interests' : 'Popular titles everyone loves')
                      : 'Discover your favorite genres'
                    }
                  </p>
                  {isPersonalized && (
                    <span className="bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                      PERSONALIZED
                    </span>
                  )}
                </div>
              </div>
          </div>
          <div className="flex space-x-4">
            <button className="group bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/25">
              <span className="relative z-10">Digital</span>
            </button>
            <button className="group bg-gray-700 text-gray-300 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-600 hover:text-white shadow-lg">
              Print
            </button>
            <button className="group bg-gray-700 text-gray-300 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-600 hover:text-white shadow-lg">
              Merchandise
            </button>
          </div>
        </div>

        {/* Conditional Content Based on Active Section */}
        {activeSection === 'genres' ? (
          <div className={`space-y-8 transition-all duration-500 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {genres.map((genre, genreIndex) => (
              <div key={genre.name} className="bg-black rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white tracking-wider">{genre.name}</h3>
            <Button 
              onClick={() => handleGenreClick(genre.filter)}
              className="bg-white text-black hover:bg-gray-100 hover:text-black transition-all duration-300"
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentItems.slice(0, 4).map((item, index) => (
              <div 
                key={item.id} 
                className="group bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl overflow-hidden hover:from-gray-850 hover:to-gray-900 transition-all duration-500 transform hover:scale-105 border border-gray-700/50 hover:border-purple-500/30"
              >
              <div className="relative overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute top-3 right-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                  {item.type}
                </span>
              </div>
              
              <div className="p-4 space-y-2">
                <h4 className="text-white font-semibold text-sm group-hover:text-purple-300 transition-colors duration-300">{item.title}</h4>
                <p className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors duration-300">{item.author}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm group-hover:text-purple-300 transition-colors duration-300">{item.price}</span>
                  <span className="text-gray-400 text-xs">{item.coins}</span>
                </div>
              </div>
            </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Navigation and View All */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevPage}
                      disabled={currentPage === 0}
                      className="text-gray-400 hover:text-white disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-gray-400 text-sm">
                      {currentPage + 1} of {totalPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextPage}
                      disabled={currentPage === totalPages - 1}
                      className="text-gray-400 hover:text-white disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              {recommendations.length > itemsPerPage && (
                <Button
                  onClick={viewAll}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                >
                  View All ({recommendations.length})
                </Button>
              )}
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {loading ? (
                [...Array(4)].map((_, index) => (
                  <div key={index} className="bg-gray-800 rounded-xl animate-pulse h-80"></div>
                ))
              ) : (
                currentItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`group bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl overflow-hidden hover:from-gray-850 hover:to-gray-900 transition-all duration-700 transform hover:scale-105 hover:-translate-y-4 hover:shadow-2xl hover:shadow-purple-500/20 border border-gray-700/50 hover:border-purple-500/30 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
                    style={{ transitionDelay: `${400 + index * 200}ms` }}
                  >
                    <div className="relative group/image overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm transition-all duration-300 group-hover:from-purple-600 group-hover:to-purple-700">
                        {item.type}
                      </span>
                      
                      {/* Hover overlay with gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold text-lg group-hover:text-purple-300 transition-colors duration-300 flex-1 mr-2">{item.title}</h3>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 transform hover:scale-110 w-8 h-8 flex-shrink-0"
                        >
                          <Diamond className="w-4 h-4 transition-transform duration-300 group-hover:animate-pulse" />
                        </Button>
                      </div>
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">{item.author}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors duration-300">{item.price}</span>
                        <span className="text-gray-400 text-xs">{item.coins}</span>
                      </div>
                      
                      <div className="flex flex-col space-y-2 pt-2">
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                          onClick={(e) => handleAddToCart(e, item)}
                        >
                          <ShoppingCart className="w-3 h-3 mr-2" />
                          Add to Cart
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full bg-white border-gray-600 text-black hover:bg-gray-100 hover:text-black text-xs transform hover:scale-105 transition-all duration-300"
                          onClick={(e) => handleBuyNow(e, item)}
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedSection;
