
import { Button } from '@/components/ui/button';
import { Heart, Diamond, Club, Spade, Calendar, ExternalLink } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnnouncementGridProps {
  activeFilter: string;
}

const AnnouncementGrid = ({ activeFilter }: AnnouncementGridProps) => {
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  const announcements = [
    {
      id: 1,
      type: 'licensing',
      title: "Jujutsu Kaisen: Shibuya Incident Arc",
      description: "We're excited to announce the licensing of the complete Shibuya Incident arc with exclusive artwork and bonus content from the author.",
      date: "Coming March 2024",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      icon: Heart,
      iconColor: 'text-heart',
      badgeColor: 'from-red-600 to-red-700'
    },
    {
      id: 2,
      type: 'volume',
      title: "Chainsaw Man Part 2: Volume 3",
      description: "The highly anticipated third volume of Chainsaw Man Part 2 is now available with exclusive cover variants and author commentary.",
      date: "Available Now",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      icon: Club,
      iconColor: 'text-club',
      badgeColor: 'from-green-600 to-green-700'
    },
    {
      id: 3,
      type: 'limited',
      title: "Attack on Titan: Final Exhibition Box Set",
      description: "Limited edition collector's box set featuring exclusive artwork from the final exhibition, including never-before-seen concept art and author sketches.",
      date: "Pre-Order Open",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      icon: Diamond,
      iconColor: 'text-diamond',
      badgeColor: 'from-blue-600 to-blue-700'
    },
    {
      id: 4,
      type: 'events',
      title: "Anime Convention 2024: Meet & Greet",
      description: "Join us at the biggest anime convention of the year! Meet your favorite creators, get exclusive signings, and be the first to see upcoming releases.",
      date: "April 15-17, 2024",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      icon: Spade,
      iconColor: 'text-spade',
      badgeColor: 'from-purple-600 to-purple-700'
    },
    {
      id: 5,
      type: 'licensing',
      title: "Tokyo Revengers: Tenjiku Arc License",
      description: "Officially licensed the complete Tenjiku Arc with same-day release schedule and premium paper quality printing.",
      date: "Coming Soon",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      icon: Heart,
      iconColor: 'text-heart',
      badgeColor: 'from-red-600 to-red-700'
    },
    {
      id: 6,
      type: 'volume',
      title: "Spy x Family: Volume 12 Release",
      description: "The latest volume in the beloved Spy x Family series arrives with bonus family photos and behind-the-scenes content.",
      date: "February 2024",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      icon: Club,
      iconColor: 'text-club',
      badgeColor: 'from-green-600 to-green-700'
    }
  ];

  const filteredAnnouncements = activeFilter === 'all' 
    ? announcements 
    : announcements.filter(announcement => announcement.type === activeFilter);

  return (
    <section 
      ref={elementRef}
      className={`bg-gray-900 py-16 transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAnnouncements.map((announcement, index) => {
            const Icon = announcement.icon;
            return (
              <div 
                key={announcement.id}
                className={`group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden hover:from-gray-750 hover:to-gray-850 transition-all duration-700 transform hover:scale-105 hover:-translate-y-4 hover:shadow-2xl hover:shadow-red-500/20 border border-gray-700/50 hover:border-red-500/30 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${400 + index * 200}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={announcement.imageUrl} 
                    alt={announcement.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Symbol Badge */}
                  <div className="absolute top-3 left-3">
                    <div className={`bg-gradient-to-r ${announcement.badgeColor} text-white p-2 rounded-full shadow-lg animate-pulse flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 ${announcement.iconColor}`} />
                    <h3 className="text-xl font-bold text-white group-hover:text-red-300 transition-colors duration-300 line-clamp-2">
                      {announcement.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300 line-clamp-3">
                    {announcement.description}
                  </p>
                  
                  <div className="flex items-center space-x-2 text-orange-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-semibold">{announcement.date}</span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Read More
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No announcements found for this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AnnouncementGrid;
