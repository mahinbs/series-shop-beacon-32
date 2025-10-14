import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Star, Clock, Users, TrendingUp, Eye, Heart, Bookmark, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { DigitalReaderService } from '@/services/digitalReaderService';

const ComicsHome = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [comics, setComics] = useState<any[]>([]);

  // Load comics from admin panel
  useEffect(() => {
    const loadComics = async () => {
      try {
        setIsLoading(true);
        const specs = await DigitalReaderService.getSpecs();
        
        // Transform admin data to match UI expectations
        const transformedComics = await Promise.all(specs.map(async (spec: any) => {
          const [episodeCount, latestUpdate] = await Promise.all([
            DigitalReaderService.getEpisodesCount(spec.id),
            DigitalReaderService.getLatestEpisodeUpdate(spec.id)
          ]);
          
          // Normalize tags from DB: can be array, JSON string, or comma-separated
          let normalizedTags: string[] = [];
          if (Array.isArray(spec.genre)) {
            normalizedTags = spec.genre as string[];
          } else if (typeof spec.genre === 'string') {
            try {
              const parsed = JSON.parse(spec.genre);
              if (Array.isArray(parsed)) normalizedTags = parsed.filter(Boolean);
              else if (typeof parsed === 'string') normalizedTags = parsed.split(',').map((g: string) => g.trim()).filter(Boolean);
            } catch {
              normalizedTags = spec.genre.split(',').map((g: string) => g.trim()).filter(Boolean);
            }
          }

          return {
            id: spec.id,
            title: spec.title,
            author: spec.artist || spec.creator,
            thumbnail: spec.cover_image_url || '/placeholder.svg',
            genre: normalizedTags,
            episodes: episodeCount,
            status: spec.status || 'Ongoing',
            isNew: new Date(spec.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
            isTrending: false,
            lastUpdate: latestUpdate ? getRelativeTime(latestUpdate) : '—',
            views: '0',
            likes: '0',
            description: spec.description || 'No description available.',
            color: 'from-purple-600/20 to-blue-600/20'
          };
        }));
        
        setComics(transformedComics);
      } catch (error) {
        console.error('Failed to load comics:', error);
        setComics([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadComics();
  }, []);

  // Helper function for relative time
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 21) return '2 weeks ago';
    if (diffDays < 28) return '3 weeks ago';
    if (diffDays < 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const filters = [
    { id: 'all', label: 'All Comics', count: comics.length },
    { id: 'new', label: 'New', count: comics.filter(c => c.isNew).length },
    { id: 'trending', label: 'Trending', count: comics.filter(c => c.isTrending).length },
    { id: 'completed', label: 'Completed', count: comics.filter(c => c.status === 'Completed').length },
    { id: 'ongoing', label: 'Ongoing', count: comics.filter(c => c.status === 'Ongoing').length }
  ];

  const filteredComics = comics.filter(comic => {
    const matchesSearch = comic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comic.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' ||
                         (activeFilter === 'new' && comic.isNew) ||
                         (activeFilter === 'trending' && comic.isTrending) ||
                         (activeFilter === 'completed' && comic.status === 'Completed') ||
                         (activeFilter === 'ongoing' && comic.status === 'Ongoing');
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">All Comics</h1>
            <p className="text-gray-400">{comics.length} comics found</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search comics, authors, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            
            <div className="flex border border-gray-600 rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Filter by Category</h3>
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? 'default' : 'outline'}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`${
                    activeFilter === filter.id
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {filter.label}
                  <Badge variant="secondary" className="ml-2 bg-gray-600 text-white">
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading comics...</p>
          </div>
        )}

        {/* Comics Grid/List */}
        {!isLoading && (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredComics.map((comic) => (
              <Link key={comic.id} to={`/comic/${comic.id}`}>
                <Card className={`group cursor-pointer transition-all duration-300 hover:scale-105 bg-gradient-to-br ${comic.color} border-gray-700 hover:border-red-500/50 ${
                  viewMode === 'list' ? 'flex-row' : ''
                }`}>
                  <CardContent className={`p-0 ${viewMode === 'list' ? 'flex' : ''}`}>
                    <div className={`relative ${viewMode === 'list' ? 'w-32 flex-shrink-0' : 'aspect-square'}`}>
                      <img
                        src={comic.thumbnail}
                        alt={comic.title}
                        className="w-full h-full object-cover rounded-t-lg group-hover:brightness-110 transition-all duration-300"
                      />
                      
                      {/* Status Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {comic.isNew && (
                          <Badge className="bg-green-600 text-white text-xs">NEW</Badge>
                        )}
                        {comic.isTrending && (
                          <Badge className="bg-orange-600 text-white text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            TRENDING
                          </Badge>
                        )}
                        {comic.status === 'Completed' && (
                          <Badge className="bg-blue-600 text-white text-xs">
                            ✓ COMPLETE
                          </Badge>
                        )}
                      </div>


                      {/* Quick Actions */}
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
                        <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-white text-lg leading-tight group-hover:text-red-400 transition-colors line-clamp-2">
                          {comic.title}
                        </h3>
                        {viewMode === 'list' && (
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors flex-shrink-0 ml-2" />
                        )}
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">by {comic.author}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {comic.genre.slice(0, 2).map((g: string) => (
                          <Badge key={g} variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {g}
                          </Badge>
                        ))}
                        {comic.genre.length > 2 && (
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                            +{comic.genre.length - 2}
                          </Badge>
                        )}
                      </div>

                      {viewMode === 'list' && (
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{comic.description}</p>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{comic.episodes} eps</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{comic.views}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{comic.lastUpdate}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredComics.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-white mb-2">No comics found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? `No results for "${searchTerm}"` : 'No comics match your current filters'}
            </p>
            {searchTerm && (
              <Button onClick={() => setSearchTerm('')} variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ComicsHome;