import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, BookOpen, Clock, User, Tag, Lock, Coins, Trash2, BookMarked } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useLibrary } from '@/hooks/useLibrary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DigitalReaderService } from '@/services/digitalReaderService';

const ComicDetail = () => {
  const { id } = useParams();
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [comic, setComic] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [originalEpisodes, setOriginalEpisodes] = useState<any[]>([]); // Store original episode data
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useSupabaseAuth();
  const { followSeries, unfollowSeries, isInLibrary: isSeriesInLibrary } = useLibrary();

  // Load comic data from admin panel
  useEffect(() => {
    const loadComic = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const spec = await DigitalReaderService.getSpecById(id);
        if (!spec) return;
        
        const [eps, subs] = await Promise.all([
          DigitalReaderService.getEpisodes(id),
          DigitalReaderService.getSubscriberCount(id)
        ]);
        
        setComic({
          id: spec.id,
          title: spec.title,
          author: spec.artist || spec.creator,
          coverImage: spec.cover_image_url || '/placeholder.svg',
          description: spec.description || 'No description available.',
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
          status: (spec as any).status || 'Ongoing',
          totalEpisodes: eps.length,
          lastUpdate: eps.length > 0 ? getRelativeTime(eps[eps.length - 1].updated_at) : '—',
          // views removed
          likes: '0',
          subscribers: subs.toString(),
          freeChaptersCount: (spec as any).free_chapters_count || 0
        });
        
        setEpisodes(eps.map((ep: any, index: number) => ({
          id: ep.id,
          title: `Episode ${ep.chapter_number || index + 1}: ${ep.title}`,
          thumbnail: ep.cover_image_url || spec.cover_image_url || '/placeholder.svg',
          isLocked: ep.coin_cost > 0 || (!ep.is_free && index >= ((spec as any).free_chapters_count || 0)),
          coins: ep.coin_cost || (spec as any).coin_per_locked || 0,
          releaseDate: new Date(ep.created_at).toLocaleDateString(),
          // views removed
        })));
        
        setOriginalEpisodes(eps); // Store original episode data for pricing calculation
        
        setSubscriberCount(subs);
      } catch (error) {
        console.error('Failed to load comic:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadComic();
  }, [id]);

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

  // Helper function to generate dynamic pricing message
  const getPricingMessage = (freeChaptersCount: number, episodes: any[]) => {
    // Count actual free episodes (considering both free_chapters_count and individual episode coin_cost)
    let freeEpisodes = 0;
    let paidEpisodes = 0;
    
    episodes.forEach((ep, index) => {
      const isFree = ep.is_free || (ep.coin_cost === 0 && index < freeChaptersCount);
      if (isFree) {
        freeEpisodes++;
      } else {
        paidEpisodes++;
      }
    });
    
    if (freeEpisodes === 0) {
      return 'All episodes require coins';
    } else if (paidEpisodes === 0) {
      return 'All episodes are free';
    } else if (freeEpisodes === 1) {
      return 'First episode free • Next episodes require coins';
    } else {
      return `First ${freeEpisodes} episodes free • Next episodes require coins`;
    }
  };

  const EpisodeCard = ({ episode }: { episode: any }) => (
    <Card className="bg-gray-800 border-gray-700 hover:border-red-500/50 transition-all duration-300 group">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative">
            <img 
              src={episode.thumbnail} 
              alt={episode.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            {episode.isLocked && (
              <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-gray-300" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-semibold group-hover:text-red-400 transition-colors">
                {episode.title}
              </h3>
              {episode.isLocked && (
                <div className="flex items-center gap-1 bg-yellow-600 px-2 py-1 rounded text-xs">
                  <Coins className="w-3 h-3" />
                  <span>{episode.coins}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
              <span>{episode.releaseDate}</span>
            </div>
            
            <div className="flex gap-2">
              {episode.isLocked ? (
                <Link to={`/episode/${episode.id}/read`}>
                  <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/10">
                    <Lock className="w-4 h-4 mr-2" />
                    Unlock ({episode.coins} coins)
                  </Button>
                </Link>
              ) : (
                <Link to={`/episode/${episode.id}/read`}>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading comic...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Comic not found</h1>
          <p className="text-gray-400">The requested comic could not be found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6">
          <Link to="/comics" className="hover:text-white">Comics</Link>
          <span className="mx-2">/</span>
          <span className="text-red-400">{comic.title}</span>
        </nav>

        {/* Comic Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <img 
              src={comic.coverImage} 
              alt={comic.title}
              className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
            />
          </div>
          
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2 mb-4">
              {comic.genre.map(g => (
                <Badge key={g} className="bg-red-600/20 text-red-400 border-red-600">
                  <Tag className="w-3 h-3 mr-1" />
                  {g}
                </Badge>
              ))}
              <Badge className={`${comic.status === 'Ongoing' ? 'bg-green-600' : 'bg-blue-600'} text-white`}>
                {comic.status}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-2">{comic.title}</h1>
            <p className="text-xl text-gray-300 mb-4">by {comic.author}</p>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-gray-400">
                <User className="w-4 h-4" />
                <span>{comic.subscribers} subscribers</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <BookOpen className="w-4 h-4" />
                <span>{comic.totalEpisodes} episodes</span>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              {isAuthenticated ? (
                isSeriesInLibrary(String(comic.id)) ? (
                  <Button onClick={() => unfollowSeries(String(comic.id))} variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/10">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove from Library
                  </Button>
                ) : (
                  <Button onClick={() => followSeries(String(comic.id))} className="bg-blue-600 hover:bg-blue-700">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Add to Library
                  </Button>
                )
              ) : (
                <Button 
                  onClick={() => window.location.href = '/auth'}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Sign in to add to Library
                </Button>
              )}
              <Button variant="outline" className="border-gray-700 text-gray-300">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <div className="text-gray-300 text-sm mb-4">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Last updated: {comic.lastUpdate}
                </span>
                <span>{comic.likes} likes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="episodes" className="w-full">
          <TabsList className="bg-gray-800 border-gray-700 mb-6">
            <TabsTrigger value="episodes" className="data-[state=active]:bg-red-600">Episodes</TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-red-600">About</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-red-600">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="episodes" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">All Episodes ({episodes.length})</h2>
              <div className="text-sm text-gray-400">
                {comic && originalEpisodes.length > 0 ? getPricingMessage(comic.freeChaptersCount, originalEpisodes) : 'Loading...'}
              </div>
            </div>
            
            {episodes.map(episode => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </TabsContent>
          
          <TabsContent value="about">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">About this Comic</h2>
                <p className="text-gray-300 leading-relaxed">{comic.description}</p>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-white mb-2">Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Author:</span>
                        <span className="text-white">{comic.author}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-white">{comic.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Episodes:</span>
                        <span className="text-white">{comic.totalEpisodes}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Stats</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Likes:</span>
                        <span className="text-white">{comic.likes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Subscribers:</span>
                        <span className="text-white">{comic.subscribers}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Reviews</h2>
                <p className="text-gray-400">Reviews will be displayed here once backend is integrated.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default ComicDetail;