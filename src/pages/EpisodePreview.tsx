import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Coins, CreditCard, Star, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const EpisodePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [userCoins] = useState(5); // Mock user coins

  // Mock episode data
  const episode = {
    id: 3,
    title: "Shadow Realm",
    comicTitle: "Shadow Hunter Chronicles",
    comicId: 1,
    thumbnail: "/lovable-uploads/97f88fee-e070-4d97-a73a-c747112fa093.png",
    previewImage: "/lovable-uploads/781ea40e-866e-4ee8-9bf7-862a42bb8716.png",
    summary: "Kai enters the mysterious Shadow Realm for the first time, where he encounters ancient spirits and discovers the true extent of his shadow-hunting abilities. But lurking in the darkness is a powerful enemy that has been waiting for his arrival...",
    coinPrice: 3,
    releaseDate: "2024-01-29",
    views: "156K",
    likes: "12.3K",
    isLocked: true
  };

  const handleUnlockWithCoins = () => {
    if (userCoins >= episode.coinPrice) {
      // In real app, this would make an API call to deduct coins and unlock episode
      navigate(`/episode/${episode.id}/read`);
    }
  };

  const handleBuyCoins = () => {
    navigate('/buy-coins');
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Link to={`/comic/${episode.comicId}`}>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {episode.comicTitle}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Image */}
          <div className="relative">
            <img 
              src={episode.previewImage} 
              alt={episode.title}
              className="w-full rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 rounded-lg" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className="bg-yellow-600 text-white mb-2">
                <Lock className="w-3 h-3 mr-1" />
                Locked Episode
              </Badge>
              <p className="text-white text-sm opacity-90">
                This is just a preview. Unlock to read the full episode!
              </p>
            </div>
          </div>

          {/* Episode Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                Episode {episode.id}: {episode.title}
              </h1>
              <p className="text-xl text-gray-300 mb-4">{episode.comicTitle}</p>
              
              <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                <span>{episode.releaseDate}</span>
                <div className="flex items-center gap-1">
                  <span>{episode.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{episode.likes}</span>
                </div>
              </div>
            </div>

            {/* Episode Summary */}
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Episode Summary</h3>
                <p className="text-gray-300 leading-relaxed">{episode.summary}</p>
              </CardContent>
            </Card>

            {/* Unlock Options */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Coins className="w-8 h-8 text-yellow-400" />
                    <span className="text-3xl font-bold text-white">{episode.coinPrice}</span>
                    <span className="text-gray-400">coins to unlock</span>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-4">
                    Your balance: <span className="text-yellow-400 font-semibold">{userCoins} coins</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {userCoins >= episode.coinPrice ? (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleUnlockWithCoins}
                    >
                      <Coins className="w-4 h-4 mr-2" />
                      Unlock with {episode.coinPrice} Coins
                    </Button>
                  ) : (
                    <div>
                      <Button 
                        className="w-full bg-gray-600 cursor-not-allowed"
                        disabled
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Not Enough Coins ({userCoins}/{episode.coinPrice})
                      </Button>
                      <p className="text-center text-sm text-gray-400 mt-2">
                        You need {episode.coinPrice - userCoins} more coins
                      </p>
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    className="w-full border-yellow-600 text-yellow-400 hover:bg-yellow-600/10"
                    onClick={handleBuyCoins}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Buy More Coins
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">💡 Why Coins?</h4>
                  <p className="text-gray-300 text-sm">
                    Coins support our creators and help us bring you more amazing content. 
                    First episodes are always free!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">{episode.views}</div>
                  <div className="text-sm text-gray-400">Views</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">{episode.likes}</div>
                  <div className="text-sm text-gray-400">Likes</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">4.8</div>
                  <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    Rating
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EpisodePreview;