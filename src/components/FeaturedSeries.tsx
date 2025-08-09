import { Button } from '@/components/ui/button';
import { Star, BookOpen, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedSeries = () => {
  const navigate = useNavigate();
  
  const featuredSeries = [
    {
      title: "Demon Slayer",
      description: "Follow Tanjiro's quest to cure his sister and battle demons",
      rating: 4.9,
      status: "Ongoing",
      image: "/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png",
      tags: ["Action", "Supernatural", "Drama"],
      episodes: "44 Episodes"
    },
    {
      title: "Jujutsu Kaisen",
      description: "Enter a world where curses can be fought and exercised",
      rating: 4.8,
      status: "Ongoing", 
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop&crop=center",
      tags: ["Action", "Fantasy", "Horror"],
      episodes: "24 Episodes"
    },
    {
      title: "One Piece",
      description: "Join Luffy and his pirate crew on their grand adventure",
      rating: 4.9,
      status: "Ongoing",
      image: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop&crop=center",
      tags: ["Adventure", "Action", "Comedy"],
      episodes: "1000+ Episodes"
    }
  ];

  return (
    <section className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-12">Featured Series</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredSeries.map((series, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-red-500/50">
              <div className="relative">
                <img 
                  src={series.image} 
                  alt={series.title}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-white text-sm font-semibold">{series.rating}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Now
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{series.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{series.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {series.tags.map((tag) => (
                    <span key={tag} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{series.episodes}</span>
                  <span>{series.status}</span>
                </div>
                
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => navigate(`/readers/${series.title.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
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

export default FeaturedSeries;
