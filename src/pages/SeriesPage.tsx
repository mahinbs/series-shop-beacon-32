import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Play, BookOpen, Download, Heart, RefreshCw } from 'lucide-react';
import { ComicService, type ComicSeries, type ComicEpisode } from '@/services/comicService';

const SeriesPage = () => {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const [selectedVolume, setSelectedVolume] = useState(0);
  const [series, setSeries] = useState<ComicSeries | null>(null);
  const [episodes, setEpisodes] = useState<ComicEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('📚 Series page loaded');
    console.log('📖 Series ID from URL:', seriesId);
    if (seriesId) {
      loadSeries();
    }
  }, [seriesId]);

  const loadSeries = async () => {
    try {
      const seriesData = await ComicService.getSeries();
      const foundSeries = seriesData.find(s => s.id === seriesId);
      if (foundSeries) {
        setSeries(foundSeries);
        
        // Load episodes for this series
        console.log('📖 Loading episodes for series:', foundSeries.id);
        const episodesData = await ComicService.getEpisodes(foundSeries.id);
        console.log('📖 Loaded episodes:', episodesData);
        setEpisodes(episodesData);
      } else {
        // Fallback to dummy data if not found
        setSeries({
          id: seriesId || "1",
    title: "SKIP AND LOAFER",
          slug: "skip-and-loafer",
    description: "Overall, Oshi no Ko is best described as a subversive, dramatic take on the idol industry in Japan, though it has some romantic plotlines as well. Protagonist Aqua Hoshino is more interested in pursuing his quest for vengeance in an exploitative industry, but he finds himself in the spotlight without even meaning to. Two girls around Aqua's age, Kana Arima and Akane Kurokawa, both mean a lot to Aqua, and they have a strong interest in him.",
          cover_image_url: "/lovable-uploads/4e6b2521-dc40-43e9-aed0-53fef670570b.png",
          banner_image_url: "/lovable-uploads/4e6b2521-dc40-43e9-aed0-53fef670570b.png",
          status: "ongoing",
          genre: ["HIGH SCHOOL", "ROMANCE", "DRAMA", "SLICE OF LIFE"],
          tags: ["HIGH SCHOOL", "ROMANCE", "DRAMA", "SLICE OF LIFE"],
          age_rating: "all",
          total_episodes: 12,
          total_pages: 0,
          is_featured: false,
          is_active: true,
          display_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error loading series:', error);
      // Fallback to dummy data if database fails
      setSeries({
        id: seriesId || "1",
        title: "SKIP AND LOAFER",
        slug: "skip-and-loafer",
        description: "Overall, Oshi no Ko is best described as a subversive, dramatic take on the idol industry in Japan, though it has some romantic plotlines as well. Protagonist Aqua Hoshino is more interested in pursuing his quest for vengeance in an exploitative industry, but he finds himself in the spotlight without even meaning to. Two girls around Aqua's age, Kana Arima and Akane Kurokawa, both mean a lot to Aqua, and they have a strong interest in him.",
        cover_image_url: "/lovable-uploads/4e6b2521-dc40-43e9-aed0-53fef670570b.png",
        banner_image_url: "/lovable-uploads/4e6b2521-dc40-43e9-aed0-53fef670570b.png",
        status: "ongoing",
        genre: ["HIGH SCHOOL", "ROMANCE", "DRAMA", "SLICE OF LIFE"],
        tags: ["HIGH SCHOOL", "ROMANCE", "DRAMA", "SLICE OF LIFE"],
        age_rating: "all",
        total_episodes: 12,
        total_pages: 0,
        is_featured: false,
        is_active: true,
        display_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-700 rounded mb-6"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Series Not Found</h1>
            <p className="text-gray-400 mb-6">The series you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/our-series')} className="bg-red-600 hover:bg-red-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Series
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
      
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-purple-900 to-blue-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="flex items-center space-x-8">
            <img
              className="w-48 h-64 object-cover rounded-lg shadow-2xl"
              src={series.cover_image_url || "/placeholder.svg"}
              alt={series.title}
            />
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2">{series.title}</h1>
              <p className="text-gray-300 text-lg mb-4">{series.description}</p>
              <div className="flex items-center space-x-4 mb-6">
                <span className="bg-green-600 px-3 py-1 rounded-full text-sm">
                  {series.status}
                </span>
                <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                  {series.age_rating} Rating
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {series.genre?.map((genre, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3">
                <Play className="w-5 h-5 mr-2" />
                Start Reading
                </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">About This Series</h2>
              <p className="text-gray-300 leading-relaxed">
            {series.description}
          </p>
        </div>

            {/* Episodes */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Episodes</h2>
                    <Button
                  onClick={loadSeries}
                  variant="outline"
                      size="sm"
                  className="border-white/30 text-white hover:bg-white/10"
                    >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                    </Button>
              </div>
              
              {episodes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-lg">No episodes available</p>
                  <p className="text-gray-500 text-sm mt-2">Add episodes in the admin panel</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {episodes.map((episode) => (
                    <Card 
                      key={episode.id} 
                      className="bg-gray-700 border-gray-600 hover:bg-gray-600 transition-colors cursor-pointer"
                      onClick={() => navigate(`/episode/${episode.id}`)}
                    >
                      <CardContent className="p-4">
                        <img
                          className="w-full h-32 object-cover rounded mb-3"
                          src={episode.cover_image_url || series?.cover_image_url || "/placeholder.svg"}
                          alt={episode.title}
                        />
                        <h3 className="text-white font-semibold mb-2">{episode.title}</h3>
                        <p className="text-gray-400 text-sm">Episode {episode.episode_number}</p>
                        {episode.description && (
                          <p className="text-gray-500 text-xs mt-2 line-clamp-2">{episode.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-3">
                          {episode.is_free ? (
                            <span className="text-green-400 text-xs">Free</span>
                          ) : (
                            <span className="text-orange-400 text-xs">{episode.coin_price} coins</span>
                          )}
                          {episode.is_published ? (
                            <span className="text-green-400 text-xs">Published</span>
                          ) : (
                            <span className="text-yellow-400 text-xs">Draft</span>
                          )}
                  </div>
                </CardContent>
              </Card>
            ))}
                </div>
              )}
          </div>
        </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Series Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Series Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-white">{series.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Episodes:</span>
                  <span className="text-white">{episodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Age Rating:</span>
                  <span className="text-white">{series.age_rating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Genre:</span>
                  <span className="text-white">{series.genre?.[0] || 'Action'}</span>
                  </div>
          </div>
        </div>

            {/* Actions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read Now
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Favorites
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                </div>
              </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SeriesPage;