import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Search, Filter, Star, Users, Calendar, Tag } from 'lucide-react';
import { ComicService, type ComicSeries } from '@/services/comicService';

const ComicSeries = () => {
  const navigate = useNavigate();
  const [series, setSeries] = useState<ComicSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    try {
      setIsLoading(true);
      const seriesData = await ComicService.getSeries();
      setSeries(seriesData);
    } catch (error) {
      console.error('Error loading series:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSeries = series.filter(seriesItem => {
    const matchesSearch = seriesItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seriesItem.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || seriesItem.status === statusFilter;
    const matchesGenre = genreFilter === 'all' || seriesItem.genre?.includes(genreFilter);
    
    return matchesSearch && matchesStatus && matchesGenre;
  });

  const sortedSeries = [...filteredSeries].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'episodes':
        return b.total_episodes - a.total_episodes;
      default:
        return 0;
    }
  });

  const allGenres = Array.from(new Set(series.flatMap(s => s.genre || [])));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading comic series...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Comic Series</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover amazing comic series, manga, and webtoons. Read the latest episodes and follow your favorite stories.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search series..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="hiatus">Hiatus</SelectItem>
                </SelectContent>
              </Select>

              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger className="w-40">
                  <Tag className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {allGenres.map(genre => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="episodes">Most Episodes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Series Grid */}
      <div className="container mx-auto px-4 py-8">
        {sortedSeries.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No series found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' || genreFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'No comic series are available yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedSeries.map((seriesItem) => (
              <Card 
                key={seriesItem.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => navigate(`/digital-reader/${seriesItem.slug}`)}
              >
                <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                  {seriesItem.cover_image_url ? (
                    <img
                      src={seriesItem.cover_image_url}
                      alt={seriesItem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Overlay badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {seriesItem.is_featured && (
                      <Badge variant="default" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge 
                      variant={seriesItem.status === 'ongoing' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {seriesItem.status}
                    </Badge>
                  </div>

                  <div className="absolute bottom-2 right-2">
                    <Badge variant="outline" className="text-xs bg-background/80">
                      {seriesItem.total_episodes} episodes
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {seriesItem.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {seriesItem.description}
                  </p>

                  {/* Creators */}
                  {seriesItem.creators && seriesItem.creators.length > 0 && (
                    <div className="flex items-center gap-1 mb-3">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {seriesItem.creators.map(c => c.creator?.name).filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {seriesItem.genre?.slice(0, 3).map(genre => (
                      <Badge key={genre} variant="outline" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                    {seriesItem.genre && seriesItem.genre.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{seriesItem.genre.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(seriesItem.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{seriesItem.total_pages} pages</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComicSeries;
