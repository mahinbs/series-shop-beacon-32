import { Button } from '@/components/ui/button';
import { BookOpen, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedSeries = () => {
  const navigate = useNavigate();
  
  const featuredSeries = [
    {
      id: 1,
      title: "Demon Slayer",
      description: "Follow Tanjiro's quest to cure his sister and battle demons",
      status: "Ongoing",
      imageUrl: "/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png",
      tags: ["Action", "Supernatural", "Drama"],
      episodes: "44 Episodes",
      genre: "Action",
      rating: "9.5",
      badge: "New",
      badgeColor: "bg-blue-500"
    },
    {
      id: 2,
      title: "Jujutsu Kaisen",
      description: "Enter a world where curses can be fought and exercised",
      status: "Ongoing", 
      imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop&crop=center",
      tags: ["Action", "Fantasy", "Horror"],
      episodes: "24 Episodes",
      genre: "Fantasy",
      rating: "9.2",
      badge: "Popular",
      badgeColor: "bg-green-500"
    },
    {
      id: 3,
      title: "One Piece",
      description: "Join Luffy and his pirate crew on their grand adventure",
      status: "Ongoing",
      imageUrl: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop&crop=center",
      tags: ["Adventure", "Action", "Comedy"],
      episodes: "1000+ Episodes",
      genre: "Adventure",
      rating: "9.0",
      badge: "Top Rated",
      badgeColor: "bg-purple-500"
    }
  ];

  return (
    <section className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-12">Featured Series</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredSeries.map((series) => (
            <div
              key={series.id}
              className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-transform duration-300 group"
              onClick={() => navigate(`/readers/${series.title.toLowerCase().replace(/\s+/g, '-')}`)}
            >
              {/* Image with Badge */}
              <div className="relative">
                <img
                  src={series.imageUrl}
                  alt={series.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Enhanced hover overlay with series details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                  <div className="text-white space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-lg font-bold text-red-300">{series.title}</h3>
                    <p className="text-xs text-gray-300 line-clamp-2">{series.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 uppercase">{series.genre}</span>
                      <span className="text-xs text-gray-400">{series.episodes} episodes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 uppercase">{series.status}</span>
                      <span className="text-xs text-gray-400">{series.rating} rating</span>
                    </div>
                  </div>
                </div>
                
                <div className={`absolute top-3 right-3 ${series.badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                  {series.badge}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSeries;
