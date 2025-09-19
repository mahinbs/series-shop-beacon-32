import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Search, ArrowUpDown, X, RefreshCw } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { ShopAllService, type ShopAllFilter, type ShopAllSort } from '@/services/shopAllService';
import { useToast } from '@/hooks/use-toast';

interface ShopFiltersProps {
  viewMode: 'series' | 'volume';
  setViewMode: (mode: 'series' | 'volume') => void;
  onFiltersApply?: (filters: string[]) => void;
  onSortChange?: (sortOption: string) => void;
  onSearchChange?: (searchTerm: string) => void;
}

const ShopFilters = ({ viewMode, setViewMode, onFiltersApply, onSortChange, onSearchChange }: ShopFiltersProps) => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState('Newest First');
  const [searchTerm, setSearchTerm] = useState('');
  const [dynamicFilters, setDynamicFilters] = useState<ShopAllFilter[]>([]);
  const [dynamicSorts, setDynamicSorts] = useState<ShopAllSort[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const categories = [
    'All', 'Action', 'Adventure', 'Romance', 'Fantasy', 'Sci-Fi', 
    'Horror', 'Comedy', 'Drama', 'More...'
  ];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    console.log('🎯 Category selected:', category);
    
    // Clear search when category is selected
    if (searchTerm) {
      setSearchTerm('');
      onSearchChange?.('');
      console.log('🔍 Cleared search term for category filter');
    }
    
    // Apply category filter
    if (category === 'All') {
      onFiltersApply?.([]);
    } else {
      onFiltersApply?.([category]);
    }
  };

  useEffect(() => {
    loadShopAllData();
  }, []);

  const loadShopAllData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      console.log('🛍️ Loading Shop All filters and sorts...');
      
      const [filtersData, sortsData] = await Promise.all([
        ShopAllService.getFilters(),
        ShopAllService.getSortOptions()
      ]);
      
      setDynamicFilters(filtersData);
      setDynamicSorts(sortsData);
      console.log('✅ Loaded dynamic filters:', filtersData);
      console.log('✅ Loaded dynamic sorts:', sortsData);
      
      // Reset UI state on refresh
      if (isRefresh) {
        setActiveCategory('All');
        setSelectedFilters([]);
        setSearchTerm('');
        onSearchChange?.('');
        onFiltersApply?.([]);
        console.log('🔄 Reset UI state on refresh');
        
        toast({
          title: "Refreshed",
          description: "Shop filters and sorts have been refreshed successfully",
        });
      }
    } catch (error) {
      console.error('❌ Error loading Shop All data:', error);
      if (isRefresh) {
        toast({
          title: "Refresh Failed",
          description: "Failed to refresh shop data. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Convert dynamic filters to the format expected by the component
  const filterOptions = dynamicFilters.reduce((acc, filter) => {
    // Ensure options is always an array
    let options: string[] = [];
    
    if (Array.isArray(filter.options)) {
      options = filter.options;
    } else if (typeof filter.options === 'object' && filter.options !== null) {
      // If it's an object, convert it to an array of key-value pairs
      options = Object.entries(filter.options).map(([key, value]) => `${key}: ${value}`);
    } else if (typeof filter.options === 'string') {
      // If it's a string, try to parse it as JSON
      try {
        const parsed = JSON.parse(filter.options);
        if (Array.isArray(parsed)) {
          options = parsed;
        } else if (typeof parsed === 'object' && parsed !== null) {
          options = Object.entries(parsed).map(([key, value]) => `${key}: ${value}`);
        } else {
          options = [filter.options];
        }
      } catch {
        options = [filter.options];
      }
    } else {
      // Fallback to empty array
      options = [];
    }
    
    acc[filter.name] = options;
    return acc;
  }, {} as Record<string, string[]>);

  // Convert dynamic sorts to the format expected by the component
  const sortOptions = dynamicSorts.map(sort => sort.name);

  const handleSortChange = (sortOption: string) => {
    setSelectedSort(sortOption);
    // Immediately apply the sort change
    onSortChange?.(sortOption);
    console.log('🔄 Sort option changed and applied:', sortOption);
  };

  const applySortOption = () => {
    onSortChange?.(selectedSort);
    console.log('✅ Applied sort option:', selectedSort);
  };

  const handleFilterChange = (filter: string, checked: boolean) => {
    if (checked) {
      setSelectedFilters([...selectedFilters, filter]);
    } else {
      setSelectedFilters(selectedFilters.filter(f => f !== filter));
    }
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
  };

  const applyFilters = () => {
    onFiltersApply?.(selectedFilters);
    // You could also close the dropdown here if needed
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange?.(value);
    
    // Clear category filters when searching
    if (value && activeCategory !== 'All') {
      setActiveCategory('All');
      onFiltersApply?.([]);
      console.log('🎯 Cleared category filters for search');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearchChange?.('');
  };

  return (
    <div className="bg-gray-900 py-6 sticky top-16 z-40 shadow-lg border-b border-gray-800">
      <div className="container mx-auto px-4">
        {/* Search Bar and Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search series..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-10 py-3 bg-blue-900/30 border border-blue-800 text-white placeholder-gray-400 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Filter and Sort Buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => loadShopAllData(true)}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
              className="bg-blue-900/50 border-blue-700 text-white hover:bg-blue-800/60 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-blue-900/50 border-blue-700 text-white hover:bg-blue-800/60 px-6 py-2 rounded-lg relative"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {selectedFilters.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {selectedFilters.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-gray-800 border-gray-700">
                <div className="flex items-center justify-between p-2">
                  <DropdownMenuLabel className="text-white">Filter Options</DropdownMenuLabel>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={applyFilters}
                      className="bg-red-600 hover:bg-red-700 text-white h-auto px-3 py-1 text-xs"
                    >
                      Apply
                    </Button>
                    {selectedFilters.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-red-400 hover:text-red-300 h-auto p-1"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-gray-700" />
                {Object.entries(filterOptions).map(([category, options]) => (
                  <div key={category} className="p-2">
                    <div className="text-sm font-medium text-gray-300 mb-2">{category}</div>
                    <div className="space-y-2">
                      {options.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={option}
                            checked={selectedFilters.includes(option)}
                            onCheckedChange={(checked) => handleFilterChange(option, checked as boolean)}
                            className="border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                          />
                          <label 
                            htmlFor={option} 
                            className="text-sm text-gray-300 cursor-pointer hover:text-white"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                    {category !== 'Status' && <DropdownMenuSeparator className="bg-gray-700 my-2" />}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-blue-900/50 border-blue-700 text-white hover:bg-blue-800/60 px-6 py-2 rounded-lg"
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort By: {selectedSort}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 z-50">
                <div className="flex items-center justify-between p-2">
                  <DropdownMenuLabel className="text-white">Sort Options</DropdownMenuLabel>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={applySortOption}
                    className="bg-red-600 hover:bg-red-700 text-white h-auto px-3 py-1 text-xs"
                  >
                    Apply
                  </Button>
                </div>
                <DropdownMenuSeparator className="bg-gray-700" />
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={`cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white ${
                      selectedSort === option ? 'bg-red-600/20 text-red-400' : ''
                    }`}
                  >
                    {option}
                    {selectedSort === option && (
                      <span className="ml-auto text-red-500">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex bg-gray-800 rounded-lg p-1">
            <Button
              onClick={() => setViewMode('volume')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'volume'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-transparent text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              variant="ghost"
            >
              Books
            </Button>
            <Button
              onClick={() => setViewMode('series')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'series'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-transparent text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              variant="ghost"
            >
              Series
            </Button>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-red-600 text-white hover:bg-red-700 border-0'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
              }`}
              variant={activeCategory === category ? 'default' : 'outline'}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopFilters;