
import { Button } from '@/components/ui/button';
import { ShoppingCart, Diamond, Eye } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/use-toast';
import { removeVolumeFromTitle } from '@/lib/utils';

interface ProductCardProps {
  id?: string; // Make id optional to handle cases where it might be missing
  title: string;
  author: string;
  volume: string;
  price: string;
  originalPrice?: string;
  imageUrl: string;
  hoverImageUrl?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  label?: string;
  tagIcon?: 'heart' | 'hot' | 'new' | 'limited' | 'bestseller';
  tagText?: string;
  category?: string; // Added category prop
  description?: string; // Added description prop
}

const ProductCard = ({ 
  id, 
  title, 
  author, 
  volume, 
  price, 
  originalPrice, 
  imageUrl,
  hoverImageUrl,
  isNew, 
  isOnSale,
  label,
  tagIcon,
  tagText,
  category, // Destructure category
  description // Destructure description
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const handleAddToCart = () => {
    const cartItem = {
      id: id || `${title.replace(/\s+/g, '-').toLowerCase()}-${author.replace(/\s+/g, '-').toLowerCase()}`, // Use provided id or fall back to generated one
      title,
      author,
      price: parseFloat(price.replace('$', '')),
      originalPrice: originalPrice ? parseFloat(originalPrice.replace('$', '')) : undefined,
      imageUrl,
      category: 'General',
      product_type: 'book' as const,
      inStock: true
    };
    
    addToCart(cartItem);
  };

  const handleBuyNow = () => {
    // Navigate directly to direct checkout with product details
    const productId = id || `${title.replace(/\s+/g, '-').toLowerCase()}-${author.replace(/\s+/g, '-').toLowerCase()}`;
    navigate(`/direct-checkout/${productId}`, {
      state: {
        product: {
          id: productId,
          title,
          author,
          price: parseFloat(price.replace('$', '')),
          originalPrice: originalPrice ? parseFloat(originalPrice.replace('$', '')) : undefined,
          imageUrl,
          category: 'General',
          product_type: 'book' as const,
          inStock: true
        },
        quantity: 1,
        totalPrice: parseFloat(price.replace('$', ''))
      }
    });
  };

  const handleViewProduct = () => {
    const productId = id || `${title.replace(/\s+/g, '-').toLowerCase()}-${author.replace(/\s+/g, '-').toLowerCase()}`;
    console.log('🛍️ ProductCard: Navigating to product detail');
    console.log('📝 ProductCard: Title:', title);
    console.log('📝 ProductCard: Author:', author);
    console.log('🆔 ProductCard: Using ID:', productId);
    console.log('🆔 ProductCard: Provided ID:', id);
    navigate(`/product/${productId}`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const productId = id || `${title.replace(/\s+/g, '-').toLowerCase()}-${author.replace(/\s+/g, '-').toLowerCase()}`;
    
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      toast({
        title: "Removed from Wishlist",
        description: `${title} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        product_id: productId,
        title,
        author: author || "Unknown Author",
        price: parseFloat(price.replace('$', '')),
        originalPrice: originalPrice ? parseFloat(originalPrice.replace('$', '')) : undefined,
        imageUrl,
        category: category || 'General',
        product_type: 'book' as const,
        inStock: true,
        volume: volume,
      });
      toast({
        title: "Added to Wishlist",
        description: `${title} has been added to your wishlist.`,
      });
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
      className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden hover:from-gray-750 hover:to-gray-850 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 border border-gray-700/50 hover:border-red-500/30 min-h-[560px] max-w-[350px] w-full flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewProduct}
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

        {/* Subtle hover overlay to indicate clickability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Enhanced hover overlay with book details */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
          <div className="text-white space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="text-lg font-bold text-red-300">{removeVolumeFromTitle(title)}</h3>
            {author && (
              <p className="text-sm text-gray-300">by {author}</p>
            )}
            <p className="text-xs text-gray-400 uppercase tracking-wide">{category}</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-white">${price}</span>
              {originalPrice && (
                <span className="text-sm text-gray-400 line-through">${originalPrice}</span>
              )}
            </div>
            {description && (
              <p className="text-xs text-gray-300 line-clamp-2 mt-2">{description}</p>
            )}
            <div className="flex space-x-2 mt-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewProduct();
                }}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                title="Add to Cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg truncate group-hover:text-red-300 transition-colors duration-300 flex-1 mr-2">{removeVolumeFromTitle(title)}</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`transition-all duration-300 transform hover:scale-110 w-8 h-8 flex-shrink-0 ${
                isInWishlist(id || `${title.replace(/\s+/g, '-').toLowerCase()}-${author.replace(/\s+/g, '-').toLowerCase()}`)
                  ? "text-red-500 hover:text-red-400 hover:bg-red-500/20"
                  : "text-gray-400 hover:text-red-500 hover:bg-red-500/10"
              }`}
              onClick={handleWishlistToggle}
            >
              <Diamond className={`w-4 h-4 transition-transform duration-300 ${
                isInWishlist(id || `${title.replace(/\s+/g, '-').toLowerCase()}-${author.replace(/\s+/g, '-').toLowerCase()}`)
                  ? "fill-current animate-pulse"
                  : "group-hover:animate-pulse"
              }`} />
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
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 pt-2 mt-auto">
          <Button 
            size="sm" 
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
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
              handleBuyNow();
            }}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
