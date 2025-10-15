import { useState, useEffect } from 'react';
import { Search, X, Filter, Heart, ShoppingCart, BookOpen, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useBooks } from '@/hooks/useBooks';
import { fuzzySearchItems } from '@/utils/fuzzySearch';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  
  const { books } = useBooks();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [searchResults, setSearchResults] = useState<typeof books>([]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      let filtered = [...books];

      // Filter by search query with fuzzy matching
      if (searchQuery.trim()) {
        // Use fuzzy search with a threshold of 0.6 (60% similarity)
        // This allows for typos and misspellings
        filtered = fuzzySearchItems(
          filtered,
          searchQuery,
          ['title', 'author', 'category', 'description'],
          0.6 // 60% similarity threshold - adjust if needed
        );
        
        console.log(`🔍 Fuzzy search for "${searchQuery}" found ${filtered.length} results`);
      }

      // Filter by category
      if (category !== 'all') {
        filtered = filtered.filter(item => item.category?.toLowerCase() === category.toLowerCase());
      }

      // Filter by price range
      if (priceRange !== 'all') {
        switch (priceRange) {
          case 'under-25':
            filtered = filtered.filter(item => item.price < 25);
            break;
          case '25-100':
            filtered = filtered.filter(item => item.price >= 25 && item.price <= 100);
            break;
          case 'over-100':
            filtered = filtered.filter(item => item.price > 100);
            break;
        }
      }

      // Sort results
      switch (sortBy) {
        case 'relevance':
          // Fuzzy search already sorts by relevance
          break;
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
          break;
        case 'oldest':
          filtered.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
          break;
      }

      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, category, sortBy, priceRange, books]);

  const handleAddToCart = (item: typeof books[number]) => {
    addToCart(item);
  };

  const handleWishlistToggle = (item: typeof books[number]) => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist({
        product_id: item.id,
        title: item.title,
        author: item.author || 'Unknown Author',
        price: item.price,
        originalPrice: item.original_price,
        imageUrl: item.image_url,
        category: item.category,
        product_type: item.product_type || 'book',
        inStock: item.stock_quantity > 0,
        volume: item.volume_number
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-0 flex items-start justify-center pt-16 px-4">
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Search className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-semibold text-white">Search</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Input */}
          <div className="p-6 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search books, series, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-12 bg-gray-800 border-gray-600 text-white placeholder-gray-400 rounded-lg text-base focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                autoFocus
              />
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="manga">Manga</SelectItem>
                  <SelectItem value="manhwa">Manhwa</SelectItem>
                  <SelectItem value="novel">Novel</SelectItem>
                  <SelectItem value="merchandise">Merchandise</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-25">Under $25</SelectItem>
                  <SelectItem value="25-100">$25 - $100</SelectItem>
                  <SelectItem value="over-100">Over $100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          <div className="p-6 overflow-y-auto max-h-96">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                <span className="ml-3 text-gray-400">Searching...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((item) => (
                  <Card key={item.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-16 h-20 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image_url || '/placeholder.svg'}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-gray-400 text-xs mb-2">{item.author}</p>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-red-400">${item.price}</span>
                              {item.original_price && item.original_price > item.price && (
                                <span className="text-xs text-gray-500 line-through">
                                  ${item.original_price}
                                </span>
                              )}
                            </div>
                            <Badge variant={item.stock_quantity > 0 ? 'default' : 'secondary'} className="text-xs">
                              {item.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleAddToCart(item)}
                              disabled={item.stock_quantity === 0}
                              className="flex-1 text-xs"
                            >
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              Add to Cart
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWishlistToggle(item)}
                              className="px-2"
                            >
                              <Heart className={`w-3 h-3 ${isInWishlist(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
                <p className="text-gray-400">Try adjusting your search terms or filters</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Start searching</h3>
                <p className="text-gray-400">Enter a book title, author, or series name</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
