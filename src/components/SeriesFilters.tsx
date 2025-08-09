
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, SortDesc } from 'lucide-react';

const SeriesFilters = () => {
  const genres = [
    'All', 'Action', 'Adventure', 'Romance', 'Fantasy', 'Sci-Fi', 'Horror', 'Comedy', 'Drama', 'More...'
  ];

  return (
    <section className="bg-gray-800/50 py-8 border-b border-gray-700">
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <div className="relative mb-6 max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            placeholder="Search manga and anime..."
            className="pl-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-12 text-lg"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <SortDesc className="w-4 h-4 mr-1" />
              Sort By
            </Button>
          </div>
        </div>

        {/* Genre Filters */}
        <div className="flex flex-wrap gap-3">
          {genres.map((genre, index) => (
            <Button
              key={genre}
              variant={index === 0 ? "default" : "outline"}
              size="sm"
              className={
                index === 0 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "bg-white border-gray-600 text-black hover:bg-gray-100 hover:text-black"
              }
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeriesFilters;
