import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Search, Trash2, ShoppingCart, Filter, Grid, List, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Wishlist = () => {
  const { toast } = useToast();
  
  // Mock wishlist data
  const wishlistItems = [
    {
      id: 1,
      title: "Demon Slayer: Complete Box Set",
      author: "Koyoharu Gotouge",
      price: 299.99,
      originalPrice: 349.99,
      image: "/lovable-uploads/26efc76c-fa83-4369-8d8d-354eab1433e6.png",
      category: "Manga",
      isOnSale: true,
      discount: 15,
      rating: 4.9,
      addedDate: "2025-01-15",
      availability: "In Stock"
    },
    {
      id: 2,
      title: "One Piece Volume 105",
      author: "Eiichiro Oda",
      price: 14.99,
      originalPrice: null,
      image: "/lovable-uploads/503cc23b-a28f-4564-86f9-53896fa75f10.png",
      category: "Manga",
      isOnSale: false,
      discount: 0,
      rating: 4.8,
      addedDate: "2025-01-10",
      availability: "Pre-order"
    },
    {
      id: 3,
      title: "Attack on Titan Figure",
      author: "Good Smile Company",
      price: 89.99,
      originalPrice: 99.99,
      image: "/lovable-uploads/781ea40e-866e-4ee8-9bf7-862a42bb8716.png",
      category: "Merchandise",
      isOnSale: true,
      discount: 10,
      rating: 4.7,
      addedDate: "2025-01-05",
      availability: "Limited Stock"
    },
    {
      id: 4,
      title: "Naruto Anniversary Edition",
      author: "Masashi Kishimoto",
      price: 199.99,
      originalPrice: null,
      image: "/lovable-uploads/7b8f7dcc-b06f-4c89-b5af-906cd241ae0c.png",
      category: "Manga",
      isOnSale: false,
      discount: 0,
      rating: 4.9,
      addedDate: "2025-01-03",
      availability: "In Stock"
    }
  ];

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState(wishlistItems);

  const handleRemoveFromWishlist = (itemId: number) => {
    const item = items.find(item => item.id === itemId);
    setItems(items.filter(item => item.id !== itemId));
    toast({
      title: "Removed from wishlist",
      description: `${item?.title} has been removed from your wishlist.`,
    });
  };

  const handleAddToCart = (itemId: number) => {
    const item = items.find(item => item.id === itemId);
    if (!item) return;

    // Simulate adding to cart with realistic behavior
    if (item.availability === 'Out of Stock') {
      toast({
        title: "Item unavailable",
        description: "This item is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    // Show success message
    toast({
      title: "Added to cart",
      description: `${item.title} has been added to your cart.`,
    });

    // Optionally remove from wishlist after adding to cart
    setTimeout(() => {
      setItems(prevItems => prevItems.filter(prevItem => prevItem.id !== itemId));
      toast({
        title: "Moved to cart",
        description: `${item.title} was removed from your wishlist since it's now in your cart.`,
      });
    }, 1000);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      case 'oldest':
        return new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                <Heart className="w-8 h-8 text-destructive" />
                My Wishlist
              </h1>
              <p className="text-muted-foreground">
                {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search your wishlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="manga">Manga</SelectItem>
              <SelectItem value="merchandise">Merchandise</SelectItem>
              <SelectItem value="light-novels">Light Novels</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest Added</SelectItem>
              <SelectItem value="oldest">Oldest Added</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Wishlist Items */}
        {sortedItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || filterCategory !== 'all' 
                ? 'No items match your current filters.'
                : 'Start adding items you love to keep track of them!'}
            </p>
            <Link to="/shop-all">
              <Button variant="destructive">
                Explore Our Collection
              </Button>
            </Link>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {sortedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {viewMode === 'grid' ? (
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    {item.isOnSale && (
                      <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                        -{item.discount}% OFF
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-background/80 hover:bg-background"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.author}</p>
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-muted-foreground">{item.rating}</span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">${item.price}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${item.originalPrice}
                            </span>
                          )}
                        </div>
                        <Badge variant={item.availability === 'In Stock' ? 'default' : 'secondary'}>
                          {item.availability}
                        </Badge>
                      </div>
                      <Button 
                        className="w-full" 
                        variant="destructive"
                        onClick={() => handleAddToCart(item.id)}
                        disabled={item.availability === 'Out of Stock'}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </div>
                ) : (
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-20 h-28 object-cover rounded"
                        />
                        {item.isOnSale && (
                          <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs">
                            -{item.discount}%
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.author}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFromWishlist(item.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-muted-foreground">{item.rating}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">${item.price}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${item.originalPrice}
                              </span>
                            )}
                            <Badge variant={item.availability === 'In Stock' ? 'default' : 'secondary'}>
                              {item.availability}
                            </Badge>
                          </div>
                          <Button 
                            variant="destructive"
                            size="sm"
                            onClick={() => handleAddToCart(item.id)}
                            disabled={item.availability === 'Out of Stock'}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Wishlist Actions */}
        {sortedItems.length > 0 && (
          <div className="mt-12 text-center">
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Wishlist;