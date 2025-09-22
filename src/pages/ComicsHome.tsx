import React, { useState } from 'react';
import { Search, Filter, Grid, List, Star, Clock, Users, TrendingUp, Eye, Heart, Bookmark, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const ComicsHome = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Mock comic data with enhanced properties
  const comics = [
    {
      id: 1,
      title: "Shadow Hunter Chronicles",
      author: "Alex Chen",
      thumbnail: "/lovable-uploads/4e6b2521-dc40-43e9-aed0-53fef670570b.png",
      genre: ["Action", "Fantasy"],
      rating: 4.8,
      episodes: 45,
      status: "Ongoing",
      isNew: true,
      isTrending: false,
      lastUpdate: "2 hours ago",
      views: "1.2M",
      likes: "45K",
      description: "A thrilling adventure through mystical realms filled with ancient magic and deadly creatures.",
      color: "from-purple-600/20 to-blue-600/20"
    },
    {
      id: 2,
      title: "Romantic Coffee Shop",
      author: "Sarah Kim",
      thumbnail: "/lovable-uploads/6ce223e4-a7e8-4282-a3a6-0f55f5341a03.png",
      genre: ["Romance", "Slice of Life"],
      rating: 4.6,
      episodes: 28,
      status: "Ongoing",
      isNew: false,
      isTrending: true,
      lastUpdate: "1 day ago",
      views: "850K",
      likes: "32K",
      description: "Heartwarming stories of love and friendship in a cozy neighborhood café.",
      color: "from-pink-600/20 to-orange-600/20"
    },
    {
      id: 3,
      title: "Cyberpunk Dreams",
      author: "Mike Johnson",
      thumbnail: "/lovable-uploads/781ea40e-866e-4ee8-9bf7-862a42bb8716.png",
      genre: ["Sci-Fi", "Action"],
      rating: 4.9,
      episodes: 67,
      status: "Completed",
      isNew: false,
      isTrending: true,
      lastUpdate: "1 week ago",
      views: "2.1M",
      likes: "78K",
      description: "Neon-lit adventures in a dystopian future where technology and humanity collide.",
      color: "from-cyan-600/20 to-purple-600/20"
    },
    {
      id: 4,
      title: "Magic Academy Blues",
      author: "Luna Martinez",
      thumbnail: "/lovable-uploads/97f88fee-e070-4d97-a73a-c747112fa093.png",
      genre: ["Fantasy", "Comedy"],
      rating: 4.5,
      episodes: 34,
      status: "Ongoing",
      isNew: true,
      isTrending: false,
      lastUpdate: "3 days ago",
      views: "640K",
      likes: "28K",
      description: "Magical mishaps and hilarious adventures at the most chaotic wizarding school.",
      color: "from-green-600/20 to-blue-600/20"
    }
  ];

  const filters = [
    { id: 'all', label: 'All Comics', icon: Grid, count: comics.length },
    { id: 'new', label: 'New', icon: Clock, count: comics.filter(c => c.isNew).length },
    { id: 'trending', label: 'Trending', icon: TrendingUp, count: comics.filter(c => c.isTrending).length },
    { id: 'completed', label: 'Completed', icon: Users, count: comics.filter(c => c.status === 'Completed').length },
    { id: 'ongoing', label: 'Ongoing', icon: Eye, count: comics.filter(c => c.status === 'Ongoing').length }
  ];

  // Filter and search logic (same as before)
  const filteredComics = comics.filter(comic => {
    const matchesSearch = searchTerm === '' || 
      comic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comic.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comic.genre.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesFilter = true;
    switch (activeFilter) {
      case 'new': matchesFilter = comic.isNew; break;
      case 'trending': matchesFilter = comic.isTrending; break;
      case 'completed': matchesFilter = comic.status === 'Completed'; break;
      case 'ongoing': matchesFilter = comic.status === 'Ongoing'; break;
      default: matchesFilter = true;
    }
    
    return matchesSearch && matchesFilter;
  });

  const sortedComics = [...filteredComics].sort((a, b) => {
    // Default sorting by newest (highest ID first)
    return b.id - a.id;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-800/50 rounded-xl p-0 animate-pulse">
          <div className="h-48 bg-gray-700/50 rounded-t-xl mb-4"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700/30 rounded w-1/2"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-700/30 rounded w-16"></div>
              <div className="h-6 bg-gray-700/30 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const EnhancedComicCard = ({ comic, index }: { comic: any; index: number }) => (
    <div 
      className="group transform transition-all duration-500 hover:scale-105 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link to={`/comic/${comic.id}`}>
        <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50 hover:border-red-500/50 transition-all duration-300 overflow-hidden backdrop-blur-sm hover:shadow-2xl hover:shadow-red-500/20">
          <CardContent className="p-0">
            <div className="relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-t ${comic.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <img 
                src={comic.thumbnail} 
                alt={comic.title}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Status Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {comic.isNew && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-medium px-2 py-1 shadow-lg">
                    NEW
                  </Badge>
                )}
                {comic.isTrending && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-medium px-2 py-1 shadow-lg">
                    🔥 TRENDING
                  </Badge>
                )}
                {comic.status === 'Completed' && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium px-2 py-1 shadow-lg">
                    ✓ COMPLETE
                  </Badge>
                )}
              </div>
              
              {/* Rating */}
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-white text-xs font-medium">{comic.rating}</span>
              </div>
              
            </div>
            
            <div className="p-4">
              <h3 className="text-white font-bold text-lg mb-1 group-hover:text-red-400 transition-colors line-clamp-1">
                {comic.title}
              </h3>
              <p className="text-gray-400 text-sm mb-3">by {comic.author}</p>
              
              {/* Genre Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {comic.genre.map((g: string) => (
                  <Badge 
                    key={g} 
                    variant="outline" 
                    className="text-xs border-gray-600/50 text-gray-300 hover:border-red-500/50 hover:text-red-400 transition-colors"
                  >
                    {g}
                  </Badge>
                ))}
              </div>
              
              {/* Bottom Stats */}
              <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                <span>{comic.episodes} episodes</span>
                <span className="text-gray-500">{comic.lastUpdate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Header />
      
      
      <div className="container mx-auto px-4 py-8 pb-16">
        {/* Enhanced Search and Filters */}
        <div className="mb-12 space-y-6">
          {/* Search Bar with View Mode */}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Search comics, authors, or tags..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-12 pr-12 h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-lg text-base focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'grid' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`w-12 h-12 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`w-12 h-12 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-gray-900 border-gray-500 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {filters.map((filter, index) => {
                const Icon = filter.icon;
                return (
                  <Button
                    key={filter.id}
                    variant={activeFilter === filter.id ? 'default' : 'outline'}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`
                      transition-all duration-300 rounded-lg px-6 py-3 text-sm font-medium
                      ${activeFilter === filter.id 
                        ? 'bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-lg' 
                        : 'bg-gray-800/50 border-gray-600/50 text-gray-300 hover:border-gray-500 hover:text-white hover:bg-gray-700/50'
                      }
                    `}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {filter.label}
                    <Badge className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      activeFilter === filter.id 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-600/50 text-gray-300'
                    }`}>
                      {filter.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
            
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {searchTerm ? `Search Results for "${searchTerm}"` : filters.find(f => f.id === activeFilter)?.label || 'All Comics'}
            </h2>
            <p className="text-gray-400">
              {sortedComics.length} {sortedComics.length === 1 ? 'comic' : 'comics'} found
            </p>
          </div>
        </div>

        {/* Comics Grid */}
        <div>
          {isLoading ? (
            <LoadingSkeleton />
          ) : sortedComics.length > 0 ? (
            <div className={`grid gap-6 transition-all duration-500 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {sortedComics.map((comic, index) => (
                <EnhancedComicCard key={comic.id} comic={comic} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Comics Found</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm 
                    ? `No results found for "${searchTerm}". Try different keywords or browse our categories.` 
                    : 'No comics match your current filters. Try adjusting your selection.'
                  }
                </p>
                {searchTerm && (
                  <Button 
                    onClick={clearSearch}
                    variant="outline" 
                    className="border-gray-700/50 text-gray-300 hover:border-red-500/50 hover:text-red-400 rounded-xl"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Load More */}
        {sortedComics.length > 0 && (
          <div className="text-center mt-16">
            <Button 
              variant="outline" 
              size="lg"
              className="border-gray-700/50 text-gray-300 hover:border-red-500/50 hover:text-red-400 rounded-xl px-8 py-4 text-lg backdrop-blur-sm bg-gray-800/30 hover:shadow-lg transition-all duration-300"
            >
              Load More Comics
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ComicsHome;