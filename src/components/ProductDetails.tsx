import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ShoppingCart, Download, BookOpen, Unlock, Star, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Chapter {
  id: number;
  title: string;
  isLocked: boolean;
  coinCost?: number;
  isRead: boolean;
}

interface ProductDetailsProps {
  product: {
    id: string;
    title: string;
    author: string;
    description: string;
    price: number;
    coinPrice: number;
    imageUrl: string;
    rating: number;
    totalChapters: number;
    unlockedChapters: number;
    formats: string[];
    genre: string[];
    chapters: Chapter[];
  };
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedFormat, setSelectedFormat] = useState(product.formats[0] || 'Digital');
  const [userCoins, setUserCoins] = useState(1250); // Mock user coins
  const navigate = useNavigate();

  const unlockChapter = (chapter: Chapter) => {
    if (chapter.coinCost && userCoins >= chapter.coinCost) {
      setUserCoins(prev => prev - chapter.coinCost!);
      // In real implementation, would update chapter unlock status
      console.log(`Unlocked chapter ${chapter.id} for ${chapter.coinCost} coins`);
    }
  };

  const purchaseProduct = () => {
    navigate(`/checkout/${product.id}`, {
      state: {
        product: {
          ...product,
          format: selectedFormat,
          type: selectedFormat.toLowerCase() === 'physical' ? 'physical' : 'digital'
        },
        quantity: 1,
        totalPrice: product.price
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-full max-w-md mx-auto rounded-lg shadow-lg"
          />
          
          {/* Format Selection */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Format Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {product.formats.map((format) => (
                  <Button
                    key={format}
                    variant={selectedFormat === format ? "default" : "outline"}
                    onClick={() => setSelectedFormat(format)}
                    className={selectedFormat === format 
                      ? "bg-red-600 hover:bg-red-700" 
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                    }
                  >
                    {format}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{product.title}</h1>
            <p className="text-xl text-gray-400 mb-4">by {product.author}</p>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                  />
                ))}
                <span className="text-gray-400 ml-2">({product.rating}/5)</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {product.genre.map((g) => (
                  <Badge key={g} variant="secondary" className="bg-gray-700 text-gray-300">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">{product.description}</p>
          </div>

          {/* Pricing and Purchase */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-white">${product.price}</p>
                  <p className="text-gray-400 flex items-center">
                    <Coins className="w-4 h-4 mr-1 text-yellow-400" />
                    {product.coinPrice} coins
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Progress</p>
                  <p className="text-lg font-semibold text-green-400">
                    {product.unlockedChapters}/{product.totalChapters} chapters
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={purchaseProduct}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy {selectedFormat}
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Chapter List with Unlocking */}
          <Tabs defaultValue="chapters" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="chapters" className="data-[state=active]:bg-red-600">Chapters</TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-red-600">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chapters" className="space-y-3">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-red-500" />
                    Chapters ({product.chapters.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {product.chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          chapter.isLocked 
                            ? 'bg-gray-900 border-gray-600' 
                            : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-400 text-sm w-8">#{chapter.id}</span>
                          <span className={`font-medium ${chapter.isLocked ? 'text-gray-500' : 'text-white'}`}>
                            {chapter.title}
                          </span>
                          {chapter.isRead && !chapter.isLocked && (
                            <Badge variant="secondary" className="bg-green-700 text-green-100">Read</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {chapter.isLocked ? (
                            <Button
                              size="sm"
                              onClick={() => unlockChapter(chapter)}
                              disabled={chapter.coinCost ? userCoins < chapter.coinCost : false}
                              className="bg-yellow-600 hover:bg-yellow-700 text-black text-xs"
                            >
                              <Unlock className="w-3 h-3 mr-1" />
                              {chapter.coinCost} coins
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                              <BookOpen className="w-3 h-3 mr-1" />
                              Read
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Author:</span>
                      <span className="text-white ml-2">{product.author}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Chapters:</span>
                      <span className="text-white ml-2">{product.totalChapters}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Available Formats:</span>
                      <span className="text-white ml-2">{product.formats.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Genres:</span>
                      <span className="text-white ml-2">{product.genre.join(', ')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}