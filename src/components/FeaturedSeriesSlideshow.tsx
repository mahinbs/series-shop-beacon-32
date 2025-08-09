import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeaturedSeriesSlideshow = () => {
  const navigate = useNavigate();

  const featuredSeries = [
    {
      id: 1,
      title: "Demon Slayer",
      description: "Follow Tanjiro's quest to cure his sister and battle demons in this epic tale of family, duty, and supernatural combat.",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      seriesUrl: "/series/demon-slayer",
      rating: 4.9,
      badge: "New Chapter",
      badgeColor: "bg-red-600",
      genres: ["Action", "Supernatural", "Drama"]
    },
    {
      id: 2,
      title: "Jujutsu Kaisen",
      description: "Enter a world where curses run rampant and sorcerers battle supernatural threats in modern-day Japan.",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      seriesUrl: "/series/jujutsu-kaisen",
      rating: 4.8,
      badge: "Trending",
      badgeColor: "bg-red-600",
      genres: ["Action", "Fantasy", "Horror"]
    },
    {
      id: 3,
      title: "One Piece",
      description: "Join Luffy and his pirate crew on their grand adventure to find the legendary One Piece treasure.",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      seriesUrl: "/series/one-piece",
      rating: 4.9,
      badge: "Updated",
      badgeColor: "bg-red-600",
      genres: ["Adventure", "Action", "Comedy"]
    }
  ];

  const handleSeriesClick = (seriesUrl: string) => {
    navigate('/our-series');
  };

  const handleReadClick = (title: string) => {
    const seriesSlug = title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/readers-mode/${encodeURIComponent(seriesSlug)}`);
  };

  return (
    <section id="featured-series" className="relative bg-gray-900 py-8 border-b border-gray-700/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-6">Featured Series</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSeries.map((series) => (
            <div
              key={series.id}
              className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-transform duration-300"
              onClick={() => handleSeriesClick(series.seriesUrl)}
            >
              {/* Image with Badge */}
              <div className="relative">
                <img
                  src={series.imageUrl}
                  alt={series.title}
                  className="w-full h-64 object-cover"
                />
                <div className={`absolute top-3 right-3 ${series.badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                  {series.badge}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Title and Rating */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{series.title}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{series.rating}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {series.description}
                </p>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {series.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Read Now Button */}
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReadClick(series.title);
                  }}
                >
                  Read Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSeriesSlideshow;