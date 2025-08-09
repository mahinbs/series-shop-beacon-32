import React, { useState } from 'react';
import { Search, Filter, Grid, List, Star, Clock, Users, TrendingUp } from 'lucide-react';
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
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock comic data
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
      lastUpdate: "2 hours ago"
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
      lastUpdate: "1 day ago"
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
      lastUpdate: "1 week ago"
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
      lastUpdate: "3 days ago"
    }
  ];

  const filters = [
    { id: 'all', label: 'All', count: comics.length },
    { id: 'new', label: 'New', count: comics.filter(c => c.isNew).length },
    { id: 'trending', label: 'Trending', count: comics.filter(c => c.isTrending).length },
    { id: 'completed', label: 'Completed', count: comics.filter(c => c.status === 'Completed').length },
    { id: 'ongoing', label: 'Ongoing', count: comics.filter(c => c.status === 'Ongoing').length }
  ];

  // Filter and search logic
  const filteredComics = comics.filter(comic => {
    // Apply search filter
    const matchesSearch = searchTerm === '' || 
      comic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comic.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comic.genre.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply category filter
    let matchesFilter = true;
    switch (activeFilter) {
      case 'new':
        matchesFilter = comic.isNew;
        break;
      case 'trending':
        matchesFilter = comic.isTrending;
        break;
      case 'completed':
        matchesFilter = comic.status === 'Completed';
        break;
      case 'ongoing':
        matchesFilter = comic.status === 'Ongoing';
        break;
      default:
        matchesFilter = true;
    }
    
    return matchesSearch && matchesFilter;
  });

  // Sort logic
  const sortedComics = [...filteredComics].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.id - a.id; // Assuming higher ID means newer
      case 'oldest':
        return a.id - b.id;
      case 'popular':
        return b.rating - a.rating;
      case 'updated':
        return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
      default:
        return 0;
    }
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const ComicCard = ({ comic }: { comic: any }) => (
    <Link to={`/comic/${comic.id}`}>
      <Card className="bg-gray-800 border-gray-700 hover:border-red-500/50 transition-all duration-300 group cursor-pointer">
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src={comic.thumbnail} 
              alt={comic.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute top-2 left-2 flex gap-1">
              {comic.isNew && <Badge className="bg-green-600 text-white">New</Badge>}
              {comic.isTrending && <Badge className="bg-orange-600 text-white">Trending</Badge>}
              {comic.status === 'Completed' && <Badge className="bg-blue-600 text-white">Completed</Badge>}
            </div>
            <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-white text-xs">{comic.rating}</span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-white font-semibold mb-1 group-hover:text-red-400 transition-colors">
              {comic.title}
            </h3>
            <p className="text-gray-400 text-sm mb-2">by {comic.author}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {comic.genre.map((g: string) => (
                <Badge key={g} variant="outline" className="text-xs border-gray-600 text-gray-300">
                  {g}
                </Badge>
              ))}
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{comic.episodes} episodes</span>
              <span>{comic.lastUpdate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Search comics, authors, or tags..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="border-gray-700"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="border-gray-700"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.map(filter => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? 'default' : 'outline'}
                onClick={() => setActiveFilter(filter.id)}
                className={`border-gray-700 ${activeFilter === filter.id ? 'bg-red-600 border-red-600' : 'text-gray-300'}`}
              >
                {filter.label}
                <Badge className="ml-2 bg-gray-600 text-white">{filter.count}</Badge>
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex gap-2">
            <span className="text-gray-400 text-sm self-center">Sort by:</span>
            {['newest', 'oldest', 'popular', 'updated'].map(sort => (
              <Button
                key={sort}
                variant={sortBy === sort ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSortBy(sort)}
                className={`text-sm ${sortBy === sort ? 'bg-red-600' : 'text-gray-400 hover:text-white'}`}
              >
                {sort.charAt(0).toUpperCase() + sort.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Comics Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {sortedComics.length > 0 ? (
            sortedComics.map(comic => (
              <ComicCard key={comic.id} comic={comic} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No comics found</div>
              <div className="text-gray-500 text-sm">
                {searchTerm ? `No results for "${searchTerm}"` : 'Try adjusting your filters'}
              </div>
              {searchTerm && (
                <Button 
                  onClick={clearSearch}
                  variant="outline" 
                  className="mt-4 border-gray-700 text-gray-300 hover:border-red-500"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:border-red-500">
            Load More Comics
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ComicsHome;