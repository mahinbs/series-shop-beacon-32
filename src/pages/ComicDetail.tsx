import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, BookOpen, Star, Clock, User, Tag, Lock, Coins } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ComicDetail = () => {
  const { id } = useParams();
  const [isInLibrary, setIsInLibrary] = useState(false);

  // Mock comic data
  const comic = {
    id: 1,
    title: "Shadow Hunter Chronicles",
    author: "Alex Chen",
    coverImage: "/lovable-uploads/4e6b2521-dc40-43e9-aed0-53fef670570b.png",
    description: "In a world where shadows hold ancient secrets and supernatural beings lurk in every corner, young Kai discovers he has the rare ability to hunt and control shadow creatures. Join him on an epic journey as he uncovers the truth about his past and battles against the forces of darkness threatening to consume his world.",
    genre: ["Action", "Fantasy", "Supernatural"],
    rating: 4.8,
    totalRatings: 15420,
    status: "Ongoing",
    totalEpisodes: 45,
    lastUpdate: "2 hours ago",
    views: "2.3M",
    likes: "89.2K",
    subscribers: "156K"
  };

  // Mock episodes data
  const episodes = [
    { id: 1, title: "The Awakening", thumbnail: "/lovable-uploads/6ce223e4-a7e8-4282-a3a6-0f55f5341a03.png", isLocked: false, coins: 0, releaseDate: "2024-01-15", views: "234K" },
    { id: 2, title: "First Hunt", thumbnail: "/lovable-uploads/781ea40e-866e-4ee8-9bf7-862a42bb8716.png", isLocked: false, coins: 0, releaseDate: "2024-01-22", views: "198K" },
    { id: 3, title: "Shadow Realm", thumbnail: "/lovable-uploads/97f88fee-e070-4d97-a73a-c747112fa093.png", isLocked: true, coins: 3, releaseDate: "2024-01-29", views: "156K" },
    { id: 4, title: "The Master's Secret", thumbnail: "/lovable-uploads/9c2bfe8c-6585-45b0-bc73-7b72048725ee.png", isLocked: true, coins: 3, releaseDate: "2024-02-05", views: "134K" },
    { id: 5, title: "Dark Alliance", thumbnail: "/lovable-uploads/a0c88e05-5aba-4550-8ee0-7644ad456776.png", isLocked: true, coins: 3, releaseDate: "2024-02-12", views: "112K" }
  ];

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
                Episode {episode.id}: {episode.title}
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
              <span>{episode.views} views</span>
            </div>
            
            <div className="flex gap-2">
              {episode.isLocked ? (
                <Link to={`/episode/${episode.id}/preview`}>
                  <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/10">
                    <Lock className="w-4 h-4 mr-2" />
                    Unlock
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
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-white font-semibold">{comic.rating}</span>
                <span className="text-gray-400">({comic.totalRatings.toLocaleString()} ratings)</span>
              </div>
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
              <Button 
                onClick={() => setIsInLibrary(!isInLibrary)}
                className={`${isInLibrary ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isInLibrary ? 'fill-current' : ''}`} />
                {isInLibrary ? 'In Library' : 'Add to Library'}
              </Button>
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
                <span>{comic.views} total views</span>
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
                First 2 episodes free • Next episodes require coins
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
                        <span className="text-gray-400">Views:</span>
                        <span className="text-white">{comic.views}</span>
                      </div>
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