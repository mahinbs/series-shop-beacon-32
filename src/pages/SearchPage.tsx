import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Star, Heart, ShoppingCart, BookOpen, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  const handleAddToCart = (item: any) => {
    // Navigate to checkout page with item details
    navigate(`/checkout/${item.id}`, {
      state: {
        product: item,
        fromSearch: true
      }
    });
  };

  // Mock search results data
  const allResults = [
    {
      id: 1,
      title: "Demon Slayer: Kimetsu no Yaiba Volume 23",
      author: "Koyoharu Gotouge",
      price: 9.99,
      originalPrice: null,
      image: "/lovable-uploads/26efc76c-fa83-4369-8d8d-354eab1433e6.png",
      category: "Manga",
      type: "Physical",
      rating: 4.9,
      reviews: 1250,
      description: "The epic conclusion to the Demon Slayer manga series.",
      inStock: true,
      isNew: false,
      tags: ["Action", "Supernatural", "Shounen"]
    },
    {
      id: 2,
      title: "One Piece Box Set: East Blue and Baroque Works",
      author: "Eiichiro Oda",
      price: 299.99,
      originalPrice: 349.99,
      image: "/lovable-uploads/503cc23b-a28f-4564-86f9-53896fa75f10.png",
      category: "Manga",
      type: "Box Set",
      rating: 4.8,
      reviews: 890,
      description: "Complete collection of early One Piece adventures.",
      inStock: true,
      isNew: false,
      tags: ["Adventure", "Comedy", "Shounen"]
    },
    {
      id: 3,
      title: "Attack on Titan Figure - Eren Yeager",
      author: "Good Smile Company",
      price: 89.99,
      originalPrice: 99.99,
      image: "/lovable-uploads/781ea40e-866e-4ee8-9bf7-862a42bb8716.png",
      category: "Merchandise",
      type: "Figure",
      rating: 4.7,
      reviews: 456,
      description: "Highly detailed figure of the main protagonist.",
      inStock: true,
      isNew: true,
      tags: ["Collectible", "Figure", "Premium"]
    },
    {
      id: 4,
      title: "Naruto: The Complete Series Digital Collection",
      author: "Masashi Kishimoto",
      price: 199.99,
      originalPrice: null,
      image: "/lovable-uploads/7b8f7dcc-b06f-4c89-b5af-906cd241ae0c.png",
      category: "Digital",
      type: "Complete Series",
      rating: 4.9,
      reviews: 2100,
      description: "All 72 volumes in high-quality digital format.",
      inStock: true,
      isNew: false,
      tags: ["Action", "Adventure", "Complete"]
    },
    {
      id: 5,
      title: "My Hero Academia: Heroes Rising Blu-ray",
      author: "Studio Bones",
      price: 24.99,
      originalPrice: 29.99,
      image: "/lovable-uploads/97f88fee-e070-4d97-a73a-c747112fa093.png",
      category: "Media",
      type: "Blu-ray",
      rating: 4.6,
      reviews: 789,
      description: "The hit movie featuring Class 1-A heroes.",
      inStock: false,
      isNew: false,
      tags: ["Movie", "Action", "Superhero"]
    }
  ];

  const [searchResults, setSearchResults] = useState(allResults);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      let filtered = allResults;

      // Filter by search query
      if (searchQuery.trim()) {
        filtered = filtered.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      // Filter by category
      if (category !== 'all') {
        filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase());
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
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        default: // relevance
          break;
      }

      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, category, sortBy, priceRange]);

  const popularSearches = [
    "Demon Slayer", "One Piece", "Attack on Titan", "Naruto", "My Hero Academia",
    "Dragon Ball", "Jujutsu Kaisen", "Tokyo Ghoul", "Death Note", "Bleach"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Header */}
      <div className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Search className="w-8 h-8" />
            Search
          </h1>
          
          {/* Main Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search for manga, anime, merchandise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>

          {/* Popular Searches */}
          {!searchQuery && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <Badge 
                    key={term}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="manga">Manga</SelectItem>
              <SelectItem value="digital">Digital</SelectItem>
              <SelectItem value="merchandise">Merchandise</SelectItem>
              <SelectItem value="media">Media</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under-25">Under $25</SelectItem>
              <SelectItem value="25-100">$25 - $100</SelectItem>
              <SelectItem value="over-100">Over $100</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {isSearching ? (
              "Searching..."
            ) : (
              <>
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                {searchQuery && (
                  <span className="text-muted-foreground"> for "{searchQuery}"</span>
                )}
              </>
            )}
          </h2>
        </div>

        {/* Search Results */}
        {isSearching ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4 w-2/3"></div>
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or filters
            </p>
            <Button variant="destructive" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.isNew && (
                    <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                      NEW
                    </Badge>
                  )}
                  {item.originalPrice && (
                    <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
                      SALE
                    </Badge>
                  )}
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">{item.type}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-muted-foreground">
                        {item.rating} ({item.reviews})
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.author}</p>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-1 mb-3">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">${item.price}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${item.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        disabled={!item.inStock}
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        {item.inStock ? 'Add' : 'Sold Out'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchPage;