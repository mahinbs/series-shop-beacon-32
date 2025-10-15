import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  BookOpen, 
  Search, 
  Star, 
  Grid,
  List,
  Trash2,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLibrary } from '@/hooks/useLibrary';
import { DigitalReaderService } from '@/services/digitalReaderService';
import { supabase } from '@/integrations/supabase/client';

interface LibraryComic {
  id: string;
  title: string;
  artist: string;
  cover_image_url: string;
  status: string;
  genre: string[];
  description: string;
  created_at: string;
  // last_read_at?: string;
  // current_episode?: number;
  total_episodes: number;
  // reading_progress: number;
}

const LibraryPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [libraryComics, setLibraryComics] = useState<LibraryComic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { items: libraryItems, unfollowSeries } = useLibrary();

  // Load library comics from digital_reader_specs
  useEffect(() => {
    const loadLibraryComics = async () => {
      if (libraryItems.length === 0) {
        setLibraryComics([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Get all digital reader specs that are in the user's library
        const specIds = libraryItems.map(item => item.series_id);
        const specs = await DigitalReaderService.getSpecs();
        
        const librarySpecs = specs.filter(spec => specIds.includes(spec.id));
        
        // Transform specs to library comics
        const comicsWithProgress = await Promise.all(
          librarySpecs.map(async (spec) => {
            const episodes = await DigitalReaderService.getEpisodes(spec.id);
            const totalEpisodes = episodes.length;
            
            return {
              id: spec.id,
              title: spec.title,
              artist: spec.artist || spec.creator || 'Unknown',
              cover_image_url: spec.cover_image_url || '/placeholder.svg',
              status: (spec as any).status || 'Ongoing',
              genre: (() => {
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
                return normalizedTags;
              })(),
              description: spec.description || 'No description available.',
              created_at: spec.created_at,
              // last_read_at: null, // Will be implemented later
              // current_episode: 1, // Default to episode 1
              total_episodes: totalEpisodes,
              // reading_progress: 0 // Default to 0% - will be implemented later
            };
          })
        );
        
        setLibraryComics(comicsWithProgress);
      } catch (error) {
        console.error('Failed to load library comics:', error);
        setLibraryComics([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLibraryComics();
  }, [libraryItems]);

  const filteredItems = libraryComics.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.artist.toLowerCase().includes(searchQuery.toLowerCase());
    // const matchesCategory = filterCategory === 'all' || 
    //                        (filterCategory === 'reading' && item.reading_progress < 100) ||
    //                        (filterCategory === 'completed' && item.reading_progress === 100);
    const matchesCategory = filterCategory === 'all'; // Simplified for now
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      // case 'progress':
      //   return b.reading_progress - a.reading_progress;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

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

  const handleRemoveFromLibrary = async (seriesId: string) => {
    await unfollowSeries(seriesId);
  };

  const handleContinueReading = (comic: LibraryComic) => {
    // Navigate to the comic detail page
    window.location.href = `/comic/${comic.id}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-500" />
                My Library
              </h1>
              <p className="text-muted-foreground">
                Your personal collection of manga, progress tracking, and reading statistics
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
              placeholder="Search your library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="reading">Currently Reading</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="downloaded">Downloaded</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Added</SelectItem>
              {/* <SelectItem value="progress">Reading Progress</SelectItem> */}
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Library Items */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading your library...</p>
            </div>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Your library is empty</h3>
            <p className="text-muted-foreground mb-6">
              {libraryItems.length === 0 
                ? "Add comics to your library to start tracking your reading progress."
                : "No comics match your current filters."
              }
            </p>
            {libraryItems.length === 0 && (
              <Button asChild>
                <Link to="/comics">Browse Comics</Link>
              </Button>
            )}
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
                  <div>
                    <div className="relative">
                      <img 
                        src={item.cover_image_url} 
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-blue-500">
                        In Library
                      </Badge>
                      <Badge 
                        variant="secondary"
                        className="absolute top-3 right-3"
                      >
                        {item.total_episodes} episodes
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">by {item.artist}</p>
                      
                      {/* Progress tracking commented out for now */}
                      {/* <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{item.reading_progress}%</span>
                        </div>
                        <Progress value={item.reading_progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Episode {item.current_episode || 0} of {item.total_episodes}
                        </p>
                      </div> */}

                      <div className="flex items-center justify-between">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleRemoveFromLibrary(item.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleContinueReading(item)}
                        >
                          <BookOpen className="w-4 h-4 mr-1" />
                          Read
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                ) : (
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img 
                        src={item.cover_image_url} 
                        alt={item.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">by {item.artist}</p>
                          </div>
                          <Badge className="bg-blue-500">
                            In Library
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {/* Progress tracking commented out for now */}
                          {/* <div>
                            <span className="text-muted-foreground">Progress:</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={item.reading_progress} className="h-2 flex-1" />
                              <span>{item.reading_progress}%</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Read:</span>
                            <p>{item.last_read_at ? getRelativeTime(item.last_read_at) : 'Never'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Episodes:</span>
                            <p>{item.current_episode || 0}/{item.total_episodes}</p>
                          </div> */}
                          <div>
                            <span className="text-muted-foreground">Total Episodes:</span>
                            <p>{item.total_episodes}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <p>{item.status}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleRemoveFromLibrary(item.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleContinueReading(item)}
                          >
                            <BookOpen className="w-4 h-4 mr-1" />
                            Read
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
      </div>
      
      <Footer />
    </div>
  );
};

export default LibraryPage;