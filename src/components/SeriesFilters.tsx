
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, SortDesc, X } from 'lucide-react';

interface SeriesFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    genre: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }) => void;
}

const SeriesFilters = ({ onFiltersChange }: SeriesFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showSortOptions, setShowSortOptions] = useState(false);

  const genres = [
    'All', 'Action', 'Adventure', 'Romance', 'Fantasy', 'Sci-Fi', 'Horror', 'Comedy', 'Drama', 'Supernatural'
  ];

  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'episodes', label: 'Episodes' },
    { value: 'status', label: 'Status' },
    { value: 'created_at', label: 'Date Added' }
  ];

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateFilters({ search: value, genre: selectedGenre, sortBy, sortOrder });
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    updateFilters({ search: searchTerm, genre, sortBy, sortOrder });
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    updateFilters({ search: searchTerm, genre: selectedGenre, sortBy: newSortBy, sortOrder });
  };

  const handleSortOrderToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    updateFilters({ search: searchTerm, genre: selectedGenre, sortBy, sortOrder: newOrder });
  };

  const updateFilters = (filters: {
    search: string;
    genre: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }) => {
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('All');
    setSortBy('title');
    setSortOrder('asc');
    updateFilters({ search: '', genre: 'All', sortBy: 'title', sortOrder: 'asc' });
  };

  return (
    <section className="bg-gray-800/50 py-8 border-b border-gray-700">
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <div className="relative mb-6 max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            placeholder="Search manga and anime..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-12 text-lg"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
            {/* <Button 
              size="sm" 
              variant="ghost" 
              className="text-gray-400 hover:text-white"
              onClick={() => setShowSortOptions(!showSortOptions)}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button> */}
            <div className="relative">
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-gray-400 hover:text-white"
                onClick={handleSortOrderToggle}
              >
                <SortDesc className={`w-4 h-4 mr-1 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                Sort By
              </Button>
            </div>
            {(searchTerm || selectedGenre !== 'All' || sortBy !== 'title') && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-gray-400 hover:text-white"
                onClick={clearFilters}
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Sort Options Dropdown */}
        {showSortOptions && (
          <div className="absolute z-10 mt-2 w-48 bg-gray-700 rounded-md shadow-lg border border-gray-600">
            <div className="py-1 relative">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleSortChange(option.value);
                    setShowSortOptions(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-600 ${
                    sortBy === option.value ? 'text-red-400 bg-gray-600' : 'text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Genre Filters */}
        <div className="flex flex-wrap gap-3">
          {genres.map((genre) => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenreChange(genre)}
              className={
                selectedGenre === genre
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "bg-white border-gray-600 text-black hover:bg-gray-100 hover:text-black"
              }
            >
              {genre}
            </Button>
          ))}
        </div>

        {/* Active Filters Display */}
        {(searchTerm || selectedGenre !== 'All' || sortBy !== 'title') && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-400">Active filters:</span>
            {searchTerm && (
              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                Search: "{searchTerm}"
              </span>
            )}
            {selectedGenre !== 'All' && (
              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                Genre: {selectedGenre}
              </span>
            )}
            {sortBy !== 'title' && (
              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                Sort: {sortOptions.find(opt => opt.value === sortBy)?.label} ({sortOrder})
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SeriesFilters;
