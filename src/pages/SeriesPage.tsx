import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ArrowLeft, Play, BookOpen, Download, Heart } from 'lucide-react';

const SeriesPage = () => {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const [selectedVolume, setSelectedVolume] = useState(0);

  useEffect(() => {
    console.log('📚 Series page loaded');
    console.log('📖 Series ID from URL:', seriesId);
  }, [seriesId]);

  const series = {
    id: parseInt(seriesId || '1'),
    title: "SKIP AND LOAFER",
    originalTitle: "SUKIPPU TU RŌFĀ",
    creator: "MISAKI TAKAMATSU",
    description: "Overall, Oshi no Ko is best described as a subversive, dramatic take on the idol industry in Japan, though it has some romantic plotlines as well. Protagonist Aqua Hoshino is more interested in pursuing his quest for vengeance in an exploitative industry, but he finds himself in the spotlight without even meaning to. Two girls around Aqua's age, Kana Arima and Akane Kurokawa, both mean a lot to Aqua, and they have a strong interest in him.",
    genres: ["HIGH SCHOOL", "ROMANCE", "DRAMA", "SLICE OF LIFE"],
    rating: 4.8,
    status: "Ongoing",
    heroImage: "/lovable-uploads/4e6b2521-dc40-43e9-aed0-53fef670570b.png",
    volumes: [
      {
        id: 1,
        title: "SKIP AND LOAFER, VOL.1",
        coverImage: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
        releaseDate: "February 11, 2025",
        price: 11.99,
        chapters: 8,
        isAvailable: true
      },
      {
        id: 2,
        title: "SKIP AND LOAFER, VOL.2",
        coverImage: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
        releaseDate: "April 15, 2025",
        price: 11.99,
        chapters: 8,
        isAvailable: false
      },
      {
        id: 3,
        title: "SKIP AND LOAFER, VOL.3",
        coverImage: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
        releaseDate: "June 20, 2025",
        price: 11.99,
        chapters: 8,
        isAvailable: false
      }
    ],
    characters: [
      {
        id: 1,
        name: "MITSUMI IWAKURA",
        image: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
        description: "A bright and optimistic student from the countryside who moves to Tokyo for high school."
      },
      {
        id: 2,
        name: "SOUSUKE SHIMA",
        image: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
        description: "A popular and kind student who becomes Mitsumi's friend and guide in Tokyo."
      },
      {
        id: 3,
        name: "MIKA EGASHIRA",
        image: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
        description: "A fashionable student who initially seems intimidating but has a caring heart."
      },
      {
        id: 4,
        name: "MAKOTO KURUME",
        image: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
        description: "A studious and serious student who becomes part of Mitsumi's friend group."
      }
    ]
  };

  const handleVolumeSelect = (volumeId: number) => {
    navigate(`/pre-order/${volumeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${series.heroImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-white hover:text-gray-300 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="max-w-2xl">
              <div className="flex flex-wrap gap-2 mb-4">
                {series.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded uppercase tracking-wide"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">{series.title}</h1>
              <p className="text-gray-300 text-lg mb-4">Original: {series.originalTitle}</p>
              <p className="text-gray-300 mb-4">by {series.creator}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${
                        i < Math.floor(series.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-white ml-2 font-semibold">{series.rating}</span>
                </div>
                <span className="text-green-400 font-semibold">{series.status}</span>
              </div>
              
              <div className="flex space-x-4">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Trailer
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Wishlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Series Description */}
        <div className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-4">About the Series</h2>
          <p className="text-gray-300 leading-relaxed max-w-4xl">
            {series.description}
          </p>
        </div>

        {/* Volumes Section */}
        <div className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-6">Available Volumes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.volumes.map((volume) => (
              <Card key={volume.id} className="bg-gray-800 border-gray-700 overflow-hidden hover:border-red-500 transition-colors">
                <div className="relative">
                  <img
                    src={volume.coverImage}
                    alt={volume.title}
                    className="w-full h-64 object-cover"
                  />
                  {!volume.isAvailable && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        PRE-ORDER
                      </span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-white font-bold mb-2">{volume.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">Release: {volume.releaseDate}</p>
                  <p className="text-gray-400 text-sm mb-3">{volume.chapters} Chapters</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-lg">${volume.price}</span>
                    <Button
                      onClick={() => handleVolumeSelect(volume.id)}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {volume.isAvailable ? 'Buy Now' : 'Pre-Order'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Characters Section */}
        <div className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-6">Main Characters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {series.characters.map((character) => (
              <Card key={character.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-700">
                    <img
                      src={character.image}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-2 uppercase tracking-wide">
                    {character.name}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {character.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Related Series */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-6">More Like This</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="bg-gray-800 rounded-lg overflow-hidden mb-2 group-hover:scale-105 transition-transform">
                  <img
                    src="/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png"
                    alt={`Related Series ${item}`}
                    className="w-full h-32 object-cover"
                  />
                </div>
                <p className="text-white text-sm font-semibold">Related Series {item}</p>
                <p className="text-gray-400 text-xs">Creator Name</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SeriesPage;