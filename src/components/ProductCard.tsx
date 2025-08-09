
import { Button } from '@/components/ui/button';
import { Unlock, ShoppingCart, Diamond } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  title: string;
  author: string;
  volume: string;
  price: string;
  originalPrice?: string;
  coins: string;
  imageUrl: string;
  hoverImageUrl?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  canUnlockWithCoins?: boolean;
  label?: string;
  tagIcon?: 'heart' | 'hot' | 'new' | 'limited' | 'bestseller';
  tagText?: string;
}

const ProductCard = ({ 
  title, 
  author, 
  volume, 
  price, 
  originalPrice, 
  coins, 
  imageUrl,
  hoverImageUrl,
  isNew, 
  isOnSale,
  canUnlockWithCoins = true,
  label,
  tagIcon,
  tagText
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    // Create a unique product ID from the title and author
    const productId = `${title.replace(/\s+/g, '-').toLowerCase()}-${author.replace(/\s+/g, '-').toLowerCase()}`;
    
    console.log('🛒 Add to Cart clicked!');
    console.log('📦 Product title:', title);
    console.log('👤 Author:', author);
    console.log('🆔 Generated productId:', productId);
    console.log('💰 Price:', price);
    
    // Create product object that matches what Checkout expects
    const productData = {
      title,
      author,
      volume,
      price: parseFloat(price.replace('$', '')),
      originalPrice: originalPrice ? parseFloat(originalPrice.replace('$', '')) : undefined,
      coins,
      imageUrl,
      hoverImageUrl,
      isNew,
      isOnSale,
      canUnlockWithCoins,
      label,
      tagIcon,
      tagText
    };
    
    console.log('📋 Product data being passed:', productData);
    
    const stateData = {
      product: productData,
      quantity: 1,
      totalPrice: parseFloat(price.replace('$', ''))
    };
    
    console.log('🚀 Navigation state:', stateData);
    console.log('🔗 Navigating to:', `/checkout/${productId}`);
    
    // Navigate to checkout page with product data in the format Checkout expects
    navigate(`/checkout/${productId}`, {
      state: stateData
    });
  };

  const handleBuyNow = () => {
    // Create a unique product ID from the title and author
    const productId = `${title.replace(/\s+/g, '-').toLowerCase()}-${author.replace(/\s+/g, '-').toLowerCase()}`;
    
    console.log('🚀 Buy Now clicked!');
    console.log('📦 Product title:', title);
    console.log('👤 Author:', author);
    console.log('🆔 Generated productId:', productId);
    
    // Create product object for direct checkout
    const productData = {
      title,
      author,
      volume,
      price: parseFloat(price.replace('$', '')),
      originalPrice: originalPrice ? parseFloat(originalPrice.replace('$', '')) : undefined,
      coins,
      imageUrl,
      hoverImageUrl,
      isNew,
      isOnSale,
      canUnlockWithCoins,
      label,
      tagIcon,
      tagText
    };
    
    // Navigate to direct checkout page
    navigate(`/direct-checkout/${productId}`, {
      state: {
        product: productData,
        quantity: 1,
        totalPrice: parseFloat(price.replace('$', ''))
      }
    });
  };

  const handleUnlockWithCoins = () => {
    console.log('🪙 UNLOCK WITH COINS CLICKED!');
    
    try {
      // Create a unique product ID from the title and author
      const productId = `${title.replace(/\s+/g, '-').toLowerCase()}-${author.replace(/\s+/g, '-').toLowerCase()}`;
      
      console.log('📦 Product title:', title);
      console.log('👤 Author:', author);
      console.log('🆔 Generated productId:', productId);
      console.log('🪙 Coins required:', coins);
      
      // Create product object for coin unlock
      const productData = {
        title,
        author,
        volume,
        price: parseFloat(price.replace('$', '')),
        originalPrice: originalPrice ? parseFloat(originalPrice.replace('$', '')) : undefined,
        coins,
        imageUrl,
        hoverImageUrl,
        isNew,
        isOnSale,
        canUnlockWithCoins,
        label,
        tagIcon,
        tagText
      };
      
      console.log('📋 Product data for coin unlock:', productData);
      
      const targetUrl = `/coin-unlock/${productId}`;
      console.log('🔗 Navigating to:', targetUrl);
      
      // Navigate to coin unlock page
      navigate(targetUrl, {
        state: {
          product: productData,
          quantity: 1,
          coinPrice: parseInt(coins.replace(' coins', ''))
        }
      });
      
      console.log('✅ Navigation successful to coin unlock page');
    } catch (error) {
      console.error('❌ Error in handleUnlockWithCoins:', error);
    }
  };

  // Function to get tag icon (will be customizable based on tagIcon prop)
  const getTagIcon = () => {
    if (!tagIcon) return null;
    
    // For now using Diamond as placeholder - will be replaced with client's icons
    return Diamond;
  };

  const TagIcon = getTagIcon();

  return (
    <div 
      className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden hover:from-gray-750 hover:to-gray-850 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 border border-gray-700/50 hover:border-red-500/30 min-h-[560px] max-w-[350px] w-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden flex-shrink-0">
        <img 
          src={isHovered && hoverImageUrl ? hoverImageUrl : imageUrl} 
          alt={title}
          className="w-full h-96 object-cover group-hover:scale-110 transition-all duration-700"
        />
        
        {/* Enhanced badges with longer labels */}
        <div className="absolute top-3 left-3 space-y-2">
          {isNew && (
            <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
              NEW
            </span>
          )}
          {isOnSale && (
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
              SALE
            </span>
          )}
        </div>

        {/* Enhanced label in top right */}
        {label && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg max-w-[120px] text-center">
            {label}
          </div>
        )}


        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg truncate group-hover:text-red-300 transition-colors duration-300 flex-1 mr-2">{title}</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 transform hover:scale-110 w-8 h-8 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                // Add to favorites functionality
              }}
            >
              <Diamond className="w-4 h-4 transition-transform duration-300 group-hover:animate-pulse" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300 flex-1">{author}</p>
            {tagIcon && tagText && TagIcon && (
              <div className="flex items-center space-x-1 bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-500/30 text-red-400 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                <TagIcon className="w-3 h-3" />
                <span>{tagText}</span>
              </div>
            )}
          </div>
          <p className="text-gray-500 text-xs uppercase tracking-wide">{volume}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold text-lg group-hover:text-red-300 transition-colors duration-300">{price}</span>
              {originalPrice && (
                <span className="text-gray-500 line-through text-sm">{originalPrice}</span>
              )}
            </div>
            {canUnlockWithCoins && (
              <span className="text-gray-400 text-xs">{coins}</span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 pt-2 mt-auto">
          <Button 
            size="sm" 
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Add to Cart
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="w-full bg-white border-gray-600 text-black hover:bg-gray-100 hover:text-black text-xs transform hover:scale-105 transition-all duration-300"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
          {canUnlockWithCoins && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="w-full text-gray-400 hover:text-white text-xs border border-gray-600 hover:border-gray-500"
              onClick={handleUnlockWithCoins}
            >
              <Unlock className="w-3 h-3 mr-1" />
              Unlock with {coins}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
