import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AllSeries = () => {
  const navigate = useNavigate();
  
  const handleReadClick = (title: string) => {
    const seriesSlug = title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/digital-reader/${encodeURIComponent(seriesSlug)}`);
  };
  const allSeries = [
    { title: "Chainsaw Man", image: "/lovable-uploads/7b8f7dcc-b06f-4c89-b5af-906cd241ae0c.png", description: "A dark supernatural thriller about devils and chainsaw powers", genre: "Action", episodes: 24 },
    { title: "My Hero Academia", image: "/lovable-uploads/7b8f7dcc-b06f-4c89-b5af-906cd241ae0c.png", description: "Superheroes in training at an elite academy", genre: "Superhero", episodes: 156 },
    { title: "Attack on Titan", image: "/lovable-uploads/7b8f7dcc-b06f-4c89-b5af-906cd241ae0c.png", description: "Humanity's fight against giant humanoid Titans", genre: "Drama", episodes: 87 },
    { title: "Spy x Family", image: "/lovable-uploads/7b8f7dcc-b06f-4c89-b5af-906cd241ae0c.png", description: "A spy, assassin, and telepath form a fake family", genre: "Comedy", episodes: 25 },
    { title: "Tokyo Revengers", image: "/lovable-uploads/7b8f7dcc-b06f-4c89-b5af-906cd241ae0c.png", description: "Time travel gang warfare and redemption", genre: "Drama", episodes: 50 },
    { title: "Black Clover", image: "/lovable-uploads/7b8f7dcc-b06f-4c89-b5af-906cd241ae0c.png", description: "Magic knights in a world of spells and adventure", genre: "Fantasy", episodes: 170 },
    { title: "Bleach", image: "/lovable-uploads/7b8f7dcc-b06f-4c89-b5af-906cd241ae0c.png", description: "Soul Reapers and spiritual warfare", genre: "Supernatural", episodes: 366 },
    { title: "Naruto", image: "/lovable-uploads/7b8f7dcc-b06f-4c89-b5af-906cd241ae0c.png", description: "Young ninja's journey to become Hokage", genre: "Action", episodes: 720 },
    { title: "Dragon Ball Super", image: "/lovable-uploads/7b8f7dcc-b06f-4c89-b5af-906cd241ae0c.png", description: "Goku's adventures across multiple universes", genre: "Action", episodes: 131 },
    { title: "One Punch Man", image: "/lovable-uploads/7b8f7dcc-b06f-4c89-b5af-906cd241ae0c.png", description: "Superhero who defeats enemies with one punch", genre: "Comedy", episodes: 24 },
    { title: "Haikyuu!", image: "/lovable-uploads/7b8f7dcc-b06f-4c89-b5af-906cd241ae0c.png", description: "High school volleyball team's journey to nationals", genre: "Sports", episodes: 85 },
    { title: "Demon Slayer", image: "/lovable-uploads/7b8f7dcc-b06f-4c89-b5af-906cd241ae0c.png", description: "Tanjiro's quest to save his demon sister", genre: "Supernatural", episodes: 44 }
  ];

  return (
    <section id="all-series" className="bg-gray-850 py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">All Series</h2>
          <span className="text-gray-400">Showing 12 series</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {allSeries.map((series, index) => (
            <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img 
                    src={series.image} 
                    alt={series.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
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
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700 text-white text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReadClick(series.title);
                      }}
                    >
                      Read
                    </Button>
                  </div>
                </div>
              <h3 className="text-white font-medium text-sm group-hover:text-red-400 transition-colors duration-200 line-clamp-2">
                {series.title}
              </h3>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3">
            Load More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AllSeries;
