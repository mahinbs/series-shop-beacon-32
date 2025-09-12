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
  BookOpen, 
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
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DigitalReaderService, type DigitalReaderSpec } from '@/services/digitalReaderService';


const CATEGORY_OPTIONS = [
  { value: 'manga', label: 'Manga' },
  { value: 'manhwa', label: 'Manhwa' },
  { value: 'manhua', label: 'Manhua' },
  { value: 'comic', label: 'Comic' },
  { value: 'novel', label: 'Novel' },
  { value: 'light-novel', label: 'Light Novel' }
];

const AGE_RATING_OPTIONS = [
  { value: 'all', label: 'All Ages' },
  { value: 'teen', label: 'Teen' },
  { value: 'mature', label: 'Mature' },
  { value: 'adult', label: 'Adult' }
];

const GENRE_OPTIONS = [
  { value: 'action', label: 'Action' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'drama', label: 'Drama' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'horror', label: 'Horror' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'romance', label: 'Romance' },
  { value: 'sci-fi', label: 'Sci-Fi' },
  { value: 'slice-of-life', label: 'Slice of Life' },
  { value: 'sports', label: 'Sports' },
  { value: 'supernatural', label: 'Supernatural' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'shojo', label: 'Shojo' },
  { value: 'shonen', label: 'Shonen' },
  { value: 'seinen', label: 'Seinen' },
  { value: 'josei', label: 'Josei' }
];

interface DigitalReaderForm {
  title: string;
  creator: string;
  creator_image_url: string;
  creator_bio: string;
  artist: string;
  artist_image_url: string;
  release_date: string;
  category: string;
  age_rating: string;
  genre: string;
  length: number;
  description: string;
  cover_image_url: string;
  banner_image_url: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

export const DigitalReaderManager = () => {
  const { toast } = useToast();
  const [specs, setSpecs] = useState<DigitalReaderSpec[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('specs');
  const [formData, setFormData] = useState<DigitalReaderForm>({
    title: '',
    creator: '',
    creator_image_url: '',
    creator_bio: '',
    artist: '',
    artist_image_url: '',
    release_date: '',
    category: '',
    age_rating: '',
    genre: '',
    length: 0,
    description: '',
    cover_image_url: '',
    banner_image_url: '',
    is_featured: false,
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    loadSpecs();
  }, []);

  const loadSpecs = async () => {
    try {
      setIsLoading(true);
      console.log('📖 Loading digital reader specs...');
      
      const specsData = await DigitalReaderService.getSpecs();
      console.log('📚 Loaded specs:', specsData);
      console.log('📊 Number of specs:', specsData.length);
      setSpecs(specsData);
    } catch (error) {
      console.error('❌ Error loading specs:', error);
      toast({
        title: "Error",
        description: "Failed to load digital reader specifications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      creator: '',
      creator_image_url: '',
      creator_bio: '',
      artist: '',
      artist_image_url: '',
      release_date: '',
      category: '',
      age_rating: '',
      genre: '',
      length: 0,
      description: '',
      cover_image_url: '',
      banner_image_url: '',
      is_featured: false,
      is_active: true,
      display_order: 0
    });
    setEditingId(null);
  };

  const handleEdit = (spec: DigitalReaderSpec) => {
    console.log('Editing spec:', spec);
    setFormData({
      title: spec.title,
      creator: spec.creator,
      creator_image_url: spec.creator_image_url || '',
      creator_bio: spec.creator_bio || '',
      artist: spec.artist,
      artist_image_url: spec.artist_image_url || '',
      release_date: spec.release_date,
      category: spec.category,
      age_rating: spec.age_rating,
      genre: spec.genre,
      length: spec.length,
      description: spec.description,
      cover_image_url: spec.cover_image_url,
      banner_image_url: spec.banner_image_url,
      is_featured: spec.is_featured,
      is_active: spec.is_active,
      display_order: spec.display_order
    });
    setEditingId(spec.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Submitting digital reader spec...');
    console.log('📊 Form data:', formData);
    console.log('🆔 Editing ID:', editingId);
    
    try {
      if (editingId) {
        // Update existing spec
        console.log('🔄 Updating existing spec...');
        await DigitalReaderService.updateSpec(editingId, formData);
        toast({
          title: "Success",
          description: "Digital reader specification updated successfully"
        });
      } else {
        // Create new spec
        console.log('➕ Creating new spec...');
        const newSpec = await DigitalReaderService.createSpec(formData);
        console.log('✅ New spec created:', newSpec);
        toast({
          title: "Success",
          description: "Digital reader specification created successfully"
        });
      }
      resetForm();
      setActiveTab('specs'); // Switch back to specs tab
      console.log('🔄 Reloading specs after save...');
      // Small delay to ensure localStorage is updated
      setTimeout(async () => {
        await loadSpecs(); // Reload specs to get updated data
      }, 100);
    } catch (error) {
      console.error('❌ Error saving spec:', error);
      toast({
        title: "Error",
        description: "Failed to save digital reader specification",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await DigitalReaderService.deleteSpec(id);
      toast({
        title: "Success",
        description: "Digital reader specification deleted successfully"
      });
      loadSpecs(); // Reload specs to get updated data
    } catch (error) {
      console.error('Error deleting spec:', error);
      toast({
        title: "Error",
        description: "Failed to delete digital reader specification",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGenreLabel = (value: string) => {
    return GENRE_OPTIONS.find(option => option.value === value)?.label || value;
  };

  const getCategoryLabel = (value: string) => {
    return CATEGORY_OPTIONS.find(option => option.value === value)?.label || value;
  };

  const getAgeRatingLabel = (value: string) => {
    return AGE_RATING_OPTIONS.find(option => option.value === value)?.label || value;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Digital Reader Management</h2>
          <p className="text-muted-foreground">
            Manage digital reader specifications and content
          </p>
        </div>
        <Button onClick={() => {
          setActiveTab('form');
          resetForm();
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Specification
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="form">Add/Edit</TabsTrigger>
        </TabsList>

        <TabsContent value="specs" className="space-y-4">
          {specs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Specifications Found</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first digital reader specification to get started.
                </p>
                <Button onClick={() => {
                  setActiveTab('form');
                  resetForm();
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Specification
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {specs.map((spec) => (
                <Card key={spec.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-xl font-semibold">{spec.title}</h3>
                          <Badge variant={spec.is_active ? "default" : "secondary"}>
                            {spec.is_active ? "Active" : "Inactive"}
                          </Badge>
                          {spec.is_featured && (
                            <Badge variant="outline" className="text-yellow-600">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">CREATOR</Label>
                            <p className="font-semibold">{spec.creator}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">ARTIST</Label>
                            <p className="font-semibold">{spec.artist}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">RELEASE</Label>
                            <p className="font-semibold">{formatDate(spec.release_date)}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">CATEGORY</Label>
                            <p className="font-semibold">{getCategoryLabel(spec.category).toUpperCase()}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">AGE RATING</Label>
                            <p className="font-semibold">{getAgeRatingLabel(spec.age_rating).toUpperCase()}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">GENRE</Label>
                            <p className="font-semibold">{getGenreLabel(spec.genre).toUpperCase()}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">LENGTH</Label>
                            <p className="font-semibold">{spec.length} PAGES</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">DISPLAY ORDER</Label>
                            <p className="font-semibold">{spec.display_order}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <Label className="text-sm font-medium text-muted-foreground">DESCRIPTION</Label>
                          <p className="text-sm mt-1">{spec.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleEdit(spec);
                            setActiveTab('form');
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(spec.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? 'Edit Specification' : 'Add New Specification'}
              </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter title"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="creator">Creator *</Label>
                      <Input
                        id="creator"
                        value={formData.creator}
                        onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                        placeholder="Enter creator name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="creator_image_url">Creator Image URL</Label>
                      <Input
                        id="creator_image_url"
                        value={formData.creator_image_url}
                        onChange={(e) => setFormData({ ...formData, creator_image_url: e.target.value })}
                        placeholder="Enter creator image URL"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="creator_bio">Creator Bio</Label>
                      <Textarea
                        id="creator_bio"
                        value={formData.creator_bio}
                        onChange={(e) => setFormData({ ...formData, creator_bio: e.target.value })}
                        placeholder="Enter creator biography"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="artist">Artist *</Label>
                      <Input
                        id="artist"
                        value={formData.artist}
                        onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                        placeholder="Enter artist name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="artist_image_url">Artist Image URL</Label>
                      <Input
                        id="artist_image_url"
                        value={formData.artist_image_url}
                        onChange={(e) => setFormData({ ...formData, artist_image_url: e.target.value })}
                        placeholder="Enter artist image URL"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="release_date">Release Date *</Label>
                      <Input
                        id="release_date"
                        type="date"
                        value={formData.release_date}
                        onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="age_rating">Age Rating *</Label>
                      <Select
                        value={formData.age_rating}
                        onValueChange={(value) => setFormData({ ...formData, age_rating: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select age rating" />
                        </SelectTrigger>
                        <SelectContent>
                          {AGE_RATING_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="genre">Genre *</Label>
                      <Select
                        value={formData.genre}
                        onValueChange={(value) => setFormData({ ...formData, genre: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {GENRE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="length">Length (Pages) *</Label>
                      <Input
                        id="length"
                        type="number"
                        value={formData.length}
                        onChange={(e) => setFormData({ ...formData, length: parseInt(e.target.value) || 0 })}
                        placeholder="Enter number of pages"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="display_order">Display Order</Label>
                      <Input
                        id="display_order"
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                        placeholder="Enter display order"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter description"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cover_image_url">Cover Image URL</Label>
                      <Input
                        id="cover_image_url"
                        value={formData.cover_image_url}
                        onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                        placeholder="Enter cover image URL"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="banner_image_url">Banner Image URL</Label>
                      <Input
                        id="banner_image_url"
                        value={formData.banner_image_url}
                        onChange={(e) => setFormData({ ...formData, banner_image_url: e.target.value })}
                        placeholder="Enter banner image URL"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                      />
                      <Label htmlFor="is_featured">Featured</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                      <Label htmlFor="is_active">Active</Label>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {editingId ? 'Update' : 'Create'} Specification
                    </Button>
                    <Button type="button" variant="outline" onClick={() => {
                      resetForm();
                      setActiveTab('specs');
                    }}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
