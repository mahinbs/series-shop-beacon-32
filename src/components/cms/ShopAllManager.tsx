import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingBag, 
  Plus, 
  Save, 
  Edit, 
  Trash2, 
  Upload, 
  Eye,
  EyeOff,
  Star,
  Calendar,
  User,
  Palette,
  Tag,
  FileText,
  Settings,
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBooks } from '@/hooks/useBooks';
import { ShopAllService } from '@/services/shopAllService';

interface ShopAllHero {
  id: string;
  title: string;
  description: string;
  background_image_url: string;
  primary_button_text: string;
  primary_button_link: string;
  secondary_button_text: string;
  secondary_button_link: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface ShopAllFilter {
  id: string;
  name: string;
  type: 'category' | 'price' | 'status' | 'type';
  options: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface ShopAllSort {
  id: string;
  name: string;
  value: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const CATEGORY_OPTIONS = [
  'All', 'Action', 'Adventure', 'Romance', 'Fantasy', 'Sci-Fi', 
  'Horror', 'Comedy', 'Drama', 'More...'
];

const FILTER_TYPES = [
  { value: 'category', label: 'Category' },
  { value: 'price', label: 'Price' },
  { value: 'status', label: 'Status' },
  { value: 'type', label: 'Type' },
  { value: 'genre', label: 'Genre' },
  { value: 'age_rating', label: 'Age Rating' },
  { value: 'author', label: 'Author' },
  { value: 'publisher', label: 'Publisher' }
];

const FILTER_NAME_OPTIONS = {
  category: ['All', 'Action', 'Adventure', 'Romance', 'Fantasy', 'Sci-Fi', 'Horror', 'Comedy', 'Drama'],
  genre: ['Action', 'Adventure', 'Romance', 'Fantasy', 'Sci-Fi', 'Horror', 'Comedy', 'Drama', 'Thriller', 'Mystery'],
  price: ['Free', 'Under $10', '$10-$25', '$25-$50', '$50-$100', 'Over $100'],
  status: ['Ongoing', 'Completed', 'Hiatus', 'Cancelled'],
  type: ['Series', 'Volume', 'Chapter', 'One-shot'],
  age_rating: ['All Ages', 'Teen', 'Mature'],
  author: ['Popular Authors', 'New Authors', 'Featured Authors'],
  publisher: ['Major Publishers', 'Independent', 'Self-published']
};

const SORT_OPTIONS = [
  { value: 'newest-first', label: 'Newest First' },
  { value: 'oldest-first', label: 'Oldest First' },
  { value: 'a-z', label: 'A-Z' },
  { value: 'z-a', label: 'Z-A' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'most-popular', label: 'Most Popular' },
  { value: 'highest-rated', label: 'Highest Rated' }
];

export const ShopAllManager = () => {
  const { toast } = useToast();
  const { books } = useBooks();
  
  // Hero Section State
  const [heroSections, setHeroSections] = useState<ShopAllHero[]>([]);
  const [editingHeroId, setEditingHeroId] = useState<string | null>(null);
  const [heroFormData, setHeroFormData] = useState<Partial<ShopAllHero>>({
    title: '',
    description: '',
    background_image_url: '',
    primary_button_text: '',
    primary_button_link: '',
    secondary_button_text: '',
    secondary_button_link: '',
    is_active: true,
    display_order: 0
  });

  // Filters State
  const [filters, setFilters] = useState<ShopAllFilter[]>([]);
  const [editingFilterId, setEditingFilterId] = useState<string | null>(null);
  const [filterFormData, setFilterFormData] = useState<Partial<ShopAllFilter>>({
    name: '',
    type: 'category',
    options: [],
    is_active: true,
    display_order: 0
  });

  // Sort Options State
  const [sortOptions, setSortOptions] = useState<ShopAllSort[]>([]);
  const [editingSortId, setEditingSortId] = useState<string | null>(null);
  const [sortFormData, setSortFormData] = useState<Partial<ShopAllSort>>({
    name: '',
    value: '',
    is_active: true,
    display_order: 0
  });

  const [activeTab, setActiveTab] = useState('hero');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadShopAllData();
  }, []);

  const loadShopAllData = async () => {
    try {
      setIsLoading(true);
      console.log('🛍️ Loading Shop All data...');
      
      // Load hero sections
      const storedHeroes = localStorage.getItem('shop_all_heroes');
      if (storedHeroes) {
        const heroes = JSON.parse(storedHeroes);
        setHeroSections(heroes);
        console.log('🎯 Loaded hero sections:', heroes);
      } else {
        // Create default hero section
        const defaultHero: ShopAllHero = {
          id: 'hero-1',
          title: 'Explore Series',
          description: 'Discover new series through manga and anime stories. Read stories, discover new characters, and learn lore through the life cycle.',
          background_image_url: '/lovable-uploads/shop-hero-bg.jpg',
          primary_button_text: 'Popular Series',
          primary_button_link: '/our-series',
          secondary_button_text: 'Browse All',
          secondary_button_link: '/shop-all',
          is_active: true,
          display_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setHeroSections([defaultHero]);
        localStorage.setItem('shop_all_heroes', JSON.stringify([defaultHero]));
      }

      // Load filters
      const storedFilters = localStorage.getItem('shop_all_filters');
      if (storedFilters) {
        const filtersData = JSON.parse(storedFilters);
        setFilters(filtersData);
        console.log('🔍 Loaded filters:', filtersData);
      } else {
        // Create default filters
        const defaultFilters: ShopAllFilter[] = [
          {
            id: 'filter-1',
            name: 'Types',
            type: 'type',
            options: ['Manga', 'Webtoon', 'Light Novel', 'Anthology'],
            is_active: true,
            display_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'filter-2',
            name: 'Price',
            type: 'price',
            options: ['Free', 'Under $5', '$5-$10', '$10-$20', '$20+'],
            is_active: true,
            display_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'filter-3',
            name: 'Status',
            type: 'status',
            options: ['Ongoing', 'Completed', 'Upcoming', 'On Hold'],
            is_active: true,
            display_order: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setFilters(defaultFilters);
        localStorage.setItem('shop_all_filters', JSON.stringify(defaultFilters));
      }

      // Load sort options
      const storedSorts = localStorage.getItem('shop_all_sorts');
      if (storedSorts) {
        const sortsData = JSON.parse(storedSorts);
        setSortOptions(sortsData);
        console.log('📊 Loaded sort options:', sortsData);
      } else {
        // Create default sort options
        const defaultSorts: ShopAllSort[] = SORT_OPTIONS.map((option, index) => ({
          id: `sort-${index + 1}`,
          name: option.label,
          value: option.value,
          is_active: true,
          display_order: index + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        setSortOptions(defaultSorts);
        localStorage.setItem('shop_all_sorts', JSON.stringify(defaultSorts));
      }
    } catch (error) {
      console.error('❌ Error loading Shop All data:', error);
      toast({
        title: "Error",
        description: "Failed to load Shop All data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Hero Section Handlers
  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('🎯 Submitting hero section...');
      console.log('📊 Form data:', heroFormData);
      console.log('🆔 Editing ID:', editingHeroId);
      
      if (editingHeroId) {
        // Update existing hero
        console.log('🔄 Updating existing hero...');
        await ShopAllService.updateHeroSection(editingHeroId, heroFormData);
        toast({
          title: "Success",
          description: "Hero section updated successfully"
        });
      } else {
        // Create new hero
        console.log('➕ Creating new hero...');
        await ShopAllService.createHeroSection(heroFormData);
        toast({
          title: "Success",
          description: "Hero section created successfully"
        });
      }
      
      resetHeroForm();
      console.log('🔄 Reloading hero sections after save...');
      // Small delay to ensure localStorage is updated
      setTimeout(async () => {
        await loadShopAllData(); // Reload data to get updated content
      }, 100);
    } catch (error) {
      console.error('❌ Error saving hero section:', error);
      toast({
        title: "Error",
        description: "Failed to save hero section",
        variant: "destructive"
      });
    }
  };

  const handleHeroEdit = (hero: ShopAllHero) => {
    setHeroFormData(hero);
    setEditingHeroId(hero.id);
    setActiveTab('hero');
  };

  const handleHeroDelete = async (id: string) => {
    try {
      console.log('🗑️ Deleting hero section:', id);
      await ShopAllService.deleteHeroSection(id);
      toast({
        title: "Success",
        description: "Hero section deleted successfully"
      });
      // Reload data to reflect changes
      setTimeout(async () => {
        await loadShopAllData();
      }, 100);
    } catch (error) {
      console.error('❌ Error deleting hero section:', error);
      toast({
        title: "Error",
        description: "Failed to delete hero section",
        variant: "destructive"
      });
    }
  };

  const resetHeroForm = () => {
    setHeroFormData({
      title: '',
      description: '',
      background_image_url: '',
      primary_button_text: '',
      primary_button_link: '',
      secondary_button_text: '',
      secondary_button_link: '',
      is_active: true,
      display_order: 0
    });
    setEditingHeroId(null);
  };

  // Filter Handlers
  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('🔍 Submitting filter...');
      console.log('📊 Form data:', filterFormData);
      console.log('🆔 Editing ID:', editingFilterId);
      
      if (editingFilterId) {
        // Update existing filter
        console.log('🔄 Updating existing filter...');
        await ShopAllService.updateFilter(editingFilterId, filterFormData);
        toast({
          title: "Success",
          description: "Filter updated successfully"
        });
      } else {
        // Create new filter
        console.log('➕ Creating new filter...');
        await ShopAllService.createFilter(filterFormData);
        toast({
          title: "Success",
          description: "Filter created successfully"
        });
      }
      
      resetFilterForm();
      console.log('🔄 Reloading filters after save...');
      // Small delay to ensure localStorage is updated
      setTimeout(async () => {
        await loadShopAllData(); // Reload data to get updated content
      }, 100);
    } catch (error) {
      console.error('❌ Error saving filter:', error);
      toast({
        title: "Error",
        description: "Failed to save filter",
        variant: "destructive"
      });
    }
  };

  const handleFilterEdit = (filter: ShopAllFilter) => {
    setFilterFormData(filter);
    setEditingFilterId(filter.id);
    setActiveTab('filters');
  };

  const handleFilterDelete = async (id: string) => {
    try {
      console.log('🗑️ Deleting filter:', id);
      await ShopAllService.deleteFilter(id);
      toast({
        title: "Success",
        description: "Filter deleted successfully"
      });
      // Reload data to reflect changes
      setTimeout(async () => {
        await loadShopAllData();
      }, 100);
    } catch (error) {
      console.error('❌ Error deleting filter:', error);
      toast({
        title: "Error",
        description: "Failed to delete filter",
        variant: "destructive"
      });
    }
  };

  const resetFilterForm = () => {
    setFilterFormData({
      name: '',
      type: 'category',
      options: [],
      is_active: true,
      display_order: 0
    });
    setEditingFilterId(null);
  };

  // Sort Handlers
  const handleSortSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('📊 Submitting sort option...');
      console.log('📊 Form data:', sortFormData);
      console.log('🆔 Editing ID:', editingSortId);
      
      if (editingSortId) {
        // Update existing sort
        console.log('🔄 Updating existing sort...');
        await ShopAllService.updateSortOption(editingSortId, sortFormData);
        toast({
          title: "Success",
          description: "Sort option updated successfully"
        });
      } else {
        // Create new sort
        console.log('➕ Creating new sort...');
        await ShopAllService.createSortOption(sortFormData);
        toast({
          title: "Success",
          description: "Sort option created successfully"
        });
      }
      
      resetSortForm();
      console.log('🔄 Reloading sort options after save...');
      // Small delay to ensure localStorage is updated
      setTimeout(async () => {
        await loadShopAllData(); // Reload data to get updated content
      }, 100);
    } catch (error) {
      console.error('❌ Error saving sort option:', error);
      toast({
        title: "Error",
        description: "Failed to save sort option",
        variant: "destructive"
      });
    }
  };

  const handleSortEdit = (sort: ShopAllSort) => {
    setSortFormData(sort);
    setEditingSortId(sort.id);
    setActiveTab('sorting');
  };

  const handleSortDelete = async (id: string) => {
    try {
      console.log('🗑️ Deleting sort option:', id);
      await ShopAllService.deleteSortOption(id);
      toast({
        title: "Success",
        description: "Sort option deleted successfully"
      });
      // Reload data to reflect changes
      setTimeout(async () => {
        await loadShopAllData();
      }, 100);
    } catch (error) {
      console.error('❌ Error deleting sort option:', error);
      toast({
        title: "Error",
        description: "Failed to delete sort option",
        variant: "destructive"
      });
    }
  };

  const resetSortForm = () => {
    setSortFormData({
      name: '',
      value: '',
      is_active: true,
      display_order: 0
    });
    setEditingSortId(null);
  };

  const addFilterOption = () => {
    const option = prompt('Enter filter option:');
    if (option && filterFormData.options) {
      setFilterFormData({
        ...filterFormData,
        options: [...filterFormData.options, option]
      });
    }
  };

  const removeFilterOption = (index: number) => {
    if (filterFormData.options) {
      const updatedOptions = filterFormData.options.filter((_, i) => i !== index);
      setFilterFormData({
        ...filterFormData,
        options: updatedOptions
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Shop All data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Shop All Management</h2>
          <p className="text-muted-foreground">
            Manage hero sections, filters, sorting, and product display for the Shop All page
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            <Package className="h-3 w-3 mr-1" />
            {books?.length || 0} Products
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Hero Section
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </TabsTrigger>
          <TabsTrigger value="sorting" className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Sorting
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Hero Section Tab */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Hero Section</CardTitle>
              <Button onClick={() => {
                resetHeroForm();
                setActiveTab('hero');
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Hero Section
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleHeroSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hero-title">Title *</Label>
                    <Input
                      id="hero-title"
                      value={heroFormData.title || ''}
                      onChange={(e) => setHeroFormData({ ...heroFormData, title: e.target.value })}
                      placeholder="Enter hero title"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hero-bg-image">Background Image URL</Label>
                    <Input
                      id="hero-bg-image"
                      value={heroFormData.background_image_url || ''}
                      onChange={(e) => setHeroFormData({ ...heroFormData, background_image_url: e.target.value })}
                      placeholder="Enter background image URL"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-description">Description *</Label>
                  <Textarea
                    id="hero-description"
                    value={heroFormData.description || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, description: e.target.value })}
                    placeholder="Enter hero description"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-button-text">Primary Button Text</Label>
                    <Input
                      id="primary-button-text"
                      value={heroFormData.primary_button_text || ''}
                      onChange={(e) => setHeroFormData({ ...heroFormData, primary_button_text: e.target.value })}
                      placeholder="Enter primary button text"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primary-button-link">Primary Button Link</Label>
                    <Input
                      id="primary-button-link"
                      value={heroFormData.primary_button_link || ''}
                      onChange={(e) => setHeroFormData({ ...heroFormData, primary_button_link: e.target.value })}
                      placeholder="Enter primary button link"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="secondary-button-text">Secondary Button Text</Label>
                    <Input
                      id="secondary-button-text"
                      value={heroFormData.secondary_button_text || ''}
                      onChange={(e) => setHeroFormData({ ...heroFormData, secondary_button_text: e.target.value })}
                      placeholder="Enter secondary button text"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondary-button-link">Secondary Button Link</Label>
                    <Input
                      id="secondary-button-link"
                      value={heroFormData.secondary_button_link || ''}
                      onChange={(e) => setHeroFormData({ ...heroFormData, secondary_button_link: e.target.value })}
                      placeholder="Enter secondary button link"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hero-active"
                      checked={heroFormData.is_active || false}
                      onCheckedChange={(checked) => setHeroFormData({ ...heroFormData, is_active: checked })}
                    />
                    <Label htmlFor="hero-active">Active</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={resetHeroForm}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {editingHeroId ? 'Update' : 'Create'} Hero Section
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Hero Sections List */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Sections ({heroSections.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {heroSections.map((hero) => (
                  <div key={hero.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{hero.title}</h3>
                          <Badge variant={hero.is_active ? "default" : "secondary"}>
                            {hero.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{hero.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Primary: {hero.primary_button_text}</span>
                          <span>Secondary: {hero.secondary_button_text}</span>
                          <span>Order: {hero.display_order}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleHeroEdit(hero)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleHeroDelete(hero.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Filters Tab */}
        <TabsContent value="filters" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Filter Options</CardTitle>
              <Button onClick={() => {
                resetFilterForm();
                setActiveTab('filters');
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Filter
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFilterSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="filter-name">Filter Name *</Label>
                    <Select
                      value={filterFormData.name || ''}
                      onValueChange={(value) => setFilterFormData({ ...filterFormData, name: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select filter name" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterFormData.type && FILTER_NAME_OPTIONS[filterFormData.type as keyof typeof FILTER_NAME_OPTIONS]?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="filter-name-custom"
                      value={filterFormData.name || ''}
                      onChange={(e) => setFilterFormData({ ...filterFormData, name: e.target.value })}
                      placeholder="Or enter custom filter name"
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="filter-type">Filter Type *</Label>
                    <Select
                      value={filterFormData.type || 'category'}
                      onValueChange={(value: any) => setFilterFormData({ ...filterFormData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select filter type" />
                      </SelectTrigger>
                      <SelectContent>
                        {FILTER_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Filter Options</Label>
                  
                  {/* Predefined options based on filter type */}
                  {filterFormData.type && FILTER_NAME_OPTIONS[filterFormData.type as keyof typeof FILTER_NAME_OPTIONS] && (
                    <div className="mb-4">
                      <Label className="text-sm text-muted-foreground">Quick Add Options:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {FILTER_NAME_OPTIONS[filterFormData.type as keyof typeof FILTER_NAME_OPTIONS].map((option) => (
                          <Button
                            key={option}
                            type="button"
                            variant={filterFormData.options?.includes(option) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const currentOptions = filterFormData.options || [];
                              if (currentOptions.includes(option)) {
                                setFilterFormData({
                                  ...filterFormData,
                                  options: currentOptions.filter(opt => opt !== option)
                                });
                              } else {
                                setFilterFormData({
                                  ...filterFormData,
                                  options: [...currentOptions, option]
                                });
                              }
                            }}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Current options */}
                  <div className="space-y-2">
                    {filterFormData.options?.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={option} readOnly />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFilterOption(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addFilterOption}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Custom Option
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="filter-active"
                      checked={filterFormData.is_active || false}
                      onCheckedChange={(checked) => setFilterFormData({ ...filterFormData, is_active: checked })}
                    />
                    <Label htmlFor="filter-active">Active</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={resetFilterForm}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {editingFilterId ? 'Update' : 'Create'} Filter
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Filters List */}
          <Card>
            <CardHeader>
              <CardTitle>Filters ({filters.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filters.map((filter) => (
                  <div key={filter.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{filter.name}</h3>
                          <Badge variant={filter.is_active ? "default" : "secondary"}>
                            {filter.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">{filter.type}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {filter.options.map((option, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFilterEdit(filter)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFilterDelete(filter.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sorting Tab */}
        <TabsContent value="sorting" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sort Options</CardTitle>
              <Button onClick={() => {
                resetSortForm();
                setActiveTab('sorting');
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Sort Option
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSortSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sort-name">Sort Name *</Label>
                    <Input
                      id="sort-name"
                      value={sortFormData.name || ''}
                      onChange={(e) => setSortFormData({ ...sortFormData, name: e.target.value })}
                      placeholder="Enter sort name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sort-value">Sort Value *</Label>
                    <Input
                      id="sort-value"
                      value={sortFormData.value || ''}
                      onChange={(e) => setSortFormData({ ...sortFormData, value: e.target.value })}
                      placeholder="Enter sort value"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sort-active"
                      checked={sortFormData.is_active || false}
                      onCheckedChange={(checked) => setSortFormData({ ...sortFormData, is_active: checked })}
                    />
                    <Label htmlFor="sort-active">Active</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={resetSortForm}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {editingSortId ? 'Update' : 'Create'} Sort Option
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Sort Options List */}
          <Card>
            <CardHeader>
              <CardTitle>Sort Options ({sortOptions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortOptions.map((sort) => (
                  <div key={sort.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{sort.name}</h3>
                          <Badge variant={sort.is_active ? "default" : "secondary"}>
                            {sort.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">Value: {sort.value}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSortEdit(sort)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSortDelete(sort.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shop All Page Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <Button 
                    onClick={() => window.open('/shop-all', '_blank')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Shop All Page
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <h3 className="font-semibold">Hero Sections</h3>
                    <p className="text-sm text-muted-foreground">{heroSections.length} sections</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <Filter className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-semibold">Filters</h3>
                    <p className="text-sm text-muted-foreground">{filters.length} filters</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <ArrowUpDown className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h3 className="font-semibold">Sort Options</h3>
                    <p className="text-sm text-muted-foreground">{sortOptions.length} options</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
