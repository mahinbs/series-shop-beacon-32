
import { Heart, Diamond, Clover, Spade } from 'lucide-react';

interface AnnouncementFiltersProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const AnnouncementFilters = ({ activeFilter, setActiveFilter }: AnnouncementFiltersProps) => {
  const filters = [
    { id: 'all', label: 'All Announcements', icon: null },
    { id: 'licensing', label: 'New Series', icon: Heart, color: 'text-red-500' },
    { id: 'limited', label: 'Limited Editions', icon: Diamond, color: 'text-blue-500' },
    { id: 'volume', label: 'New Volumes', icon: Clover, color: 'text-green-500' },
    { id: 'events', label: 'Events', icon: Spade, color: 'text-purple-500' }
  ];

  return (
    <section className="bg-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeFilter === filter.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {Icon && <Icon className={`w-4 h-4 ${filter.color}`} />}
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementFilters;
