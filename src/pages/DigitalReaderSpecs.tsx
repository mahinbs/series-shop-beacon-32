import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  BookOpen, 
  User, 
  Palette, 
  Calendar, 
  Tag, 
  FileText,
  Star,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { DigitalReaderService, type DigitalReaderSpec } from '@/services/digitalReaderService';

const DigitalReaderSpecs = () => {
  const navigate = useNavigate();
  const [specs, setSpecs] = useState<DigitalReaderSpec[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSpecs();
  }, []);

  const loadSpecs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🌐 DigitalReaderSpecs: Loading specs...');
      const specsData = await DigitalReaderService.getSpecs();
      console.log('🌐 DigitalReaderSpecs: Loaded specs:', specsData);
      setSpecs(specsData);
    } catch (error) {
      console.error('❌ DigitalReaderSpecs: Error loading specs:', error);
      setError('Failed to load specifications');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGenreLabel = (value: string) => {
    const genreMap: Record<string, string> = {
      'action': 'Action',
      'adventure': 'Adventure',
      'comedy': 'Comedy',
      'drama': 'Drama',
      'fantasy': 'Fantasy',
      'horror': 'Horror',
      'mystery': 'Mystery',
      'romance': 'Romance',
      'sci-fi': 'Sci-Fi',
      'slice-of-life': 'Slice of Life',
      'sports': 'Sports',
      'supernatural': 'Supernatural',
      'thriller': 'Thriller',
      'shojo': 'Shojo',
      'shonen': 'Shonen',
      'seinen': 'Seinen',
      'josei': 'Josei'
    };
    return genreMap[value] || value;
  };

  const getCategoryLabel = (value: string) => {
    const categoryMap: Record<string, string> = {
      'manga': 'Manga',
      'manhwa': 'Manhwa',
      'manhua': 'Manhua',
      'comic': 'Comic',
      'novel': 'Novel',
      'light-novel': 'Light Novel'
    };
    return categoryMap[value] || value;
  };

  const getAgeRatingLabel = (value: string) => {
    const ageRatingMap: Record<string, string> = {
      'all': 'All Ages',
      'teen': 'Teen',
      'mature': 'Mature',
      'adult': 'Adult'
    };
    return ageRatingMap[value] || value;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <Button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-white">Digital Reader Specifications</h1>
          </div>
          <Button 
            onClick={loadSpecs}
            variant="outline" 
            className="border-gray-600 text-white hover:bg-gray-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {specs.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-white mb-2">No Specifications Found</h3>
              <p className="text-gray-400 mb-4">
                No digital reader specifications are currently available.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {specs.map((spec) => (
              <Card key={spec.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Cover Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={spec.cover_image_url || "/placeholder.svg"}
                        alt={spec.title}
                        className="w-32 h-48 object-cover rounded-lg"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-2">{spec.title}</h2>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={spec.is_active ? "default" : "secondary"}>
                              {spec.is_active ? "Active" : "Inactive"}
                            </Badge>
                            {spec.is_featured && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Specifications Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <User className="h-4 w-4" />
                            <span className="font-medium">CREATOR</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {spec.creator_image_url && (
                              <img
                                src={spec.creator_image_url}
                                alt={spec.creator}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                            <p className="text-white font-semibold">{spec.creator}</p>
                          </div>
                          {spec.creator_bio && (
                            <p className="text-gray-300 text-xs mt-1">{spec.creator_bio}</p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Palette className="h-4 w-4" />
                            <span className="font-medium">ARTIST</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {spec.artist_image_url && (
                              <img
                                src={spec.artist_image_url}
                                alt={spec.artist}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                            <p className="text-white font-semibold">{spec.artist}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">RELEASE</span>
                          </div>
                          <p className="text-white font-semibold">{formatDate(spec.release_date)}</p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Tag className="h-4 w-4" />
                            <span className="font-medium">CATEGORY</span>
                          </div>
                          <p className="text-white font-semibold">{getCategoryLabel(spec.category).toUpperCase()}</p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Eye className="h-4 w-4" />
                            <span className="font-medium">AGE RATING</span>
                          </div>
                          <p className="text-white font-semibold">{getAgeRatingLabel(spec.age_rating).toUpperCase()}</p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <BookOpen className="h-4 w-4" />
                            <span className="font-medium">GENRE</span>
                          </div>
                          <p className="text-white font-semibold">{getGenreLabel(spec.genre).toUpperCase()}</p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">LENGTH</span>
                          </div>
                          <p className="text-white font-semibold">{spec.length} PAGES</p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <span className="font-medium">DISPLAY ORDER</span>
                          </div>
                          <p className="text-white font-semibold">{spec.display_order}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <FileText className="h-4 w-4" />
                          <span className="font-medium">DESCRIPTION</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{spec.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DigitalReaderSpecs;
