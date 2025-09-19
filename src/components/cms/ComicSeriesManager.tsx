import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Save, Edit, Upload, BookOpen, Users, Eye, EyeOff, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ComicService, type ComicSeries, type Creator } from '@/services/comicService';

const STATUS_OPTIONS = [
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'hiatus', label: 'Hiatus' },
  { value: 'cancelled', label: 'Cancelled' }
];

const AGE_RATING_OPTIONS = [
  { value: 'all', label: 'All Ages' },
  { value: 'teen', label: 'Teen' },
  { value: 'mature', label: 'Mature' }
];

const ROLE_OPTIONS = [
  { value: 'writer', label: 'Writer' },
  { value: 'artist', label: 'Artist' },
  { value: 'colorist', label: 'Colorist' },
  { value: 'letterer', label: 'Letterer' },
  { value: 'editor', label: 'Editor' },
  { value: 'publisher', label: 'Publisher' }
];

interface SeriesForm {
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
  banner_image_url: string;
  status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled';
  genre: string[];
  tags: string[];
  age_rating: 'all' | 'teen' | 'mature';
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

interface CreatorAssignment {
  creator_id: string;
  role: string;
  is_primary: boolean;
}

export const ComicSeriesManager = () => {
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
  const [series, setSeries] = useState<ComicSeries[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('series');
  const [formData, setFormData] = useState<SeriesForm>({
    title: '',
    slug: '',
    description: '',
    cover_image_url: '',
    banner_image_url: '',
    status: 'ongoing',
    genre: [],
    tags: [],
    age_rating: 'all',
    is_featured: false,
    is_active: true,
    display_order: 0
  });
  const [creatorAssignments, setCreatorAssignments] = useState<CreatorAssignment[]>([]);
  const [newGenre, setNewGenre] = useState('');
  const [newTag, setNewTag] = useState('');
  const [showCreatorForm, setShowCreatorForm] = useState(false);
  const [creatorForm, setCreatorForm] = useState({
    name: '',
    bio: '',
    avatar_url: '',
    website_url: '',
    specialties: [] as string[],
    social_links: {} as Record<string, string>
  });
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [showNewCreatorForm, setShowNewCreatorForm] = useState(false);
  const [newCreatorForm, setNewCreatorForm] = useState({
    name: '',
    bio: '',
    avatar_url: '',
    website_url: '',
    specialties: [] as string[],
    social_links: {} as Record<string, string>
  });
  const [newCreatorSpecialty, setNewCreatorSpecialty] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    console.log('🔄 Loading data in ComicSeriesManager...');
    setIsLoading(true);
    try {
      const [seriesData, creatorsData] = await Promise.all([
        ComicService.getSeries(),
        ComicService.getCreators()
      ]);
      console.log('📚 Series data loaded:', seriesData);
      console.log('👥 Creators data loaded:', creatorsData);
      setSeries(seriesData);
      setCreators(creatorsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load comic series data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      cover_image_url: '',
      banner_image_url: '',
      status: 'ongoing',
      genre: [],
      tags: [],
      age_rating: 'all',
      is_featured: false,
      is_active: true,
      display_order: 0
    });
    setCreatorAssignments([]);
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('💾 Submitting series form...');
    console.log('🆔 Editing ID:', editingId);
    console.log('📝 Form data:', formData);
    console.log('📝 Form data keys:', Object.keys(formData));
    console.log('📝 Form data values:', Object.values(formData));
    
    // Basic validation
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Series title is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.slug.trim()) {
      toast({
        title: "Error",
        description: "URL slug is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (editingId) {
        console.log('🔄 Updating existing series...');
        const updatedSeries = await ComicService.updateSeries(editingId, formData);
        console.log('✅ Series updated:', updatedSeries);
        toast({
          title: "Success",
          description: "Comic series updated successfully",
        });
      } else {
        console.log('➕ Creating new series...');
        const newSeries = await ComicService.createSeries(formData);
        console.log('✅ Series created:', newSeries);
        toast({
          title: "Success",
          description: "Comic series created successfully",
        });
      }
      resetForm();
      loadData();
    } catch (error) {
      console.error('❌ Error saving series:', error);
      toast({
        title: "Error",
        description: "Failed to save comic series",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (seriesItem: ComicSeries) => {
    console.log('✏️ Editing series:', seriesItem);
    console.log('🆔 Series ID:', seriesItem.id);
    
    // Show loading state
    toast({
      title: "Loading editor",
      description: `Preparing to edit "${seriesItem.title}"...`,
    });
    
    setFormData({
      title: seriesItem.title,
      slug: seriesItem.slug,
      description: seriesItem.description || '',
      cover_image_url: seriesItem.cover_image_url || '',
      banner_image_url: seriesItem.banner_image_url || '',
      status: seriesItem.status,
      genre: seriesItem.genre || [],
      tags: seriesItem.tags || [],
      age_rating: seriesItem.age_rating,
      is_featured: seriesItem.is_featured,
      is_active: seriesItem.is_active,
      display_order: seriesItem.display_order
    });
    setCreatorAssignments(
      seriesItem.creators?.map(c => ({
        creator_id: c.creator_id,
        role: c.role,
        is_primary: c.is_primary
      })) || []
    );
    setEditingId(seriesItem.id);
    setShowAddForm(true);
    
    // Auto-scroll to form and show success
    setTimeout(() => {
      formRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      toast({
        title: "Edit Mode Active",
        description: `Now editing: "${seriesItem.title}"`,
        variant: "default"
      });
    }, 100);
    
    console.log('✅ Form data set, editing ID:', seriesItem.id);
    console.log('📝 Form should be visible now');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comic series?')) return;
    
    try {
      await ComicService.deleteSeries(id);
      toast({
        title: "Success",
        description: "Comic series deleted successfully",
      });
      loadData();
    } catch (error) {
      console.error('Error deleting series:', error);
      toast({
        title: "Error",
        description: "Failed to delete comic series",
        variant: "destructive"
      });
    }
  };

  const addGenre = () => {
    if (newGenre.trim() && !formData.genre.includes(newGenre.trim())) {
      setFormData(prev => ({
        ...prev,
        genre: [...prev.genre, newGenre.trim()]
      }));
      setNewGenre('');
    }
  };

  const removeGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.filter(g => g !== genre)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addCreatorAssignment = () => {
    setCreatorAssignments(prev => [...prev, {
      creator_id: '',
      role: 'writer',
      is_primary: false
    }]);
  };

  const updateCreatorAssignment = (index: number, field: keyof CreatorAssignment, value: any) => {
    if (field === 'creator_id' && value === 'create-new') {
      // Show the new creator form
      setShowNewCreatorForm(true);
      return;
    }
    
    setCreatorAssignments(prev => prev.map((assignment, i) => 
      i === index ? { ...assignment, [field]: value } : assignment
    ));
  };

  const removeCreatorAssignment = (index: number) => {
    setCreatorAssignments(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await ComicService.updateCreator(editingId, creatorForm);
        toast({
          title: "Success",
          description: "Creator updated successfully",
        });
      } else {
        await ComicService.createCreator({...creatorForm, is_active: true});
        toast({
          title: "Success",
          description: "Creator created successfully",
        });
      }
      setCreatorForm({
        name: '',
        bio: '',
        avatar_url: '',
        website_url: '',
        specialties: [],
        social_links: {}
      });
      setEditingId(null);
      setShowCreatorForm(false);
      loadData();
    } catch (error) {
      console.error('Error saving creator:', error);
      toast({
        title: "Error",
        description: "Failed to save creator",
        variant: "destructive"
      });
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !creatorForm.specialties.includes(newSpecialty.trim())) {
      setCreatorForm(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setCreatorForm(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const addSocialLink = () => {
    if (newSocialPlatform.trim() && newSocialUrl.trim()) {
      setCreatorForm(prev => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [newSocialPlatform.trim()]: newSocialUrl.trim()
        }
      }));
      setNewSocialPlatform('');
      setNewSocialUrl('');
    }
  };

  const removeSocialLink = (platform: string) => {
    setCreatorForm(prev => {
      const newLinks = { ...prev.social_links };
      delete newLinks[platform];
      return { ...prev, social_links: newLinks };
    });
  };

  const handleCreateNewCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('👥 Creating new creator:', newCreatorForm);
      
      if (!newCreatorForm.name.trim()) {
        toast({
          title: "Error",
          description: "Creator name is required",
          variant: "destructive"
        });
        return;
      }
      
      const newCreator = await ComicService.createCreator({...newCreatorForm, is_active: true});
      console.log('✅ New creator created:', newCreator);
      
      // Reload creators list
      await loadData();
      
      // Reset form
      setNewCreatorForm({
        name: '',
        bio: '',
        avatar_url: '',
        website_url: '',
        specialties: [],
        social_links: {}
      });
      setShowNewCreatorForm(false);
      
      toast({
        title: "Success",
        description: "New creator created successfully",
      });
    } catch (error) {
      console.error('❌ Error creating creator:', error);
      toast({
        title: "Error",
        description: "Failed to create creator",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading comic series...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="series">Comic Series</TabsTrigger>
          <TabsTrigger value="creators">Creators</TabsTrigger>
        </TabsList>

        <TabsContent value="series" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Comic Series Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage comic series, episodes, and content
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  console.log('🔍 Debug - Current localStorage data:');
                  console.log('📚 Comic series:', localStorage.getItem('comic_series'));
                  console.log('👥 Creators:', localStorage.getItem('creators'));
                  console.log('🎯 Current state - series:', series);
                  console.log('🎯 Current state - creators:', creators);
                }}
                variant="outline" size="sm"
              >
                Debug
              </Button>
              <Button
                onClick={() => {
                  setFormData({
                    title: 'Test Series',
                    slug: 'test-series',
                    description: 'This is a test series description for testing purposes.',
                    cover_image_url: 'https://picsum.photos/300/400',
                    banner_image_url: 'https://picsum.photos/800/200',
                    status: 'ongoing',
                    genre: ['Action', 'Adventure'],
                    tags: ['Test', 'Demo'],
                    age_rating: 'all',
                    is_featured: false,
                    is_active: true,
                    display_order: 0
                  });
                  setShowAddForm(true);
                }}
                variant="outline" size="sm"
              >
                Test Data
              </Button>
              <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Series
              </Button>
            </div>
          </div>

          {showAddForm && (
            <Card ref={formRef} className={editingId ? 'border-primary bg-card shadow-lg' : ''}>
              <CardHeader className={editingId ? 'bg-muted/30' : ''}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {editingId ? (
                        <>
                          <Edit className="h-5 w-5 text-primary" />
                          Edit Comic Series
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5" />
                          Add New Comic Series
                        </>
                      )}
                    </CardTitle>
                    {editingId && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Editing: <span className="font-medium">{formData.title}</span>
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetForm}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Series Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter series title"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug">URL Slug</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="series-url-slug"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter series description"
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cover_image_url">Cover Image URL</Label>
                        <Input
                          id="cover_image_url"
                          value={formData.cover_image_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, cover_image_url: e.target.value }))}
                          placeholder="https://example.com/cover.jpg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="banner_image_url">Banner Image URL</Label>
                        <Input
                          id="banner_image_url"
                          value={formData.banner_image_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, banner_image_url: e.target.value }))}
                          placeholder="https://example.com/banner.jpg"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="age_rating">Age Rating</Label>
                          <Select value={formData.age_rating} onValueChange={(value: any) => setFormData(prev => ({ ...prev, age_rating: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {AGE_RATING_OPTIONS.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Genre Management */}
                  <div>
                    <Label>Genres</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newGenre}
                        onChange={(e) => setNewGenre(e.target.value)}
                        placeholder="Add genre"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre())}
                      />
                      <Button type="button" onClick={addGenre} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.genre.map(genre => (
                        <Badge key={genre} variant="secondary" className="flex items-center gap-1">
                          {genre}
                          <button
                            type="button"
                            onClick={() => removeGenre(genre)}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tags Management */}
                  <div>
                    <Label>Tags</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Creator Assignments */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <Label>Creators</Label>
                      <Button type="button" onClick={addCreatorAssignment} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Creator
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {creatorAssignments.map((assignment, index) => (
                        <div key={index} className="flex gap-3 items-center p-3 border rounded-lg">
                          <Select
                            value={assignment.creator_id}
                            onValueChange={(value) => updateCreatorAssignment(index, 'creator_id', value)}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select creator" />
                            </SelectTrigger>
                            <SelectContent>
                              {creators.map(creator => (
                                <SelectItem key={creator.id} value={creator.id}>
                                  {creator.name}
                                </SelectItem>
                              ))}
                              <SelectItem value="create-new" className="text-blue-600 font-semibold">
                                + Create New Creator
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={assignment.role}
                            onValueChange={(value) => updateCreatorAssignment(index, 'role', value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLE_OPTIONS.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`primary-${index}`} className="text-sm">Primary</Label>
                            <Switch
                              id={`primary-${index}`}
                              checked={assignment.is_primary}
                              onCheckedChange={(checked) => updateCreatorAssignment(index, 'is_primary', checked)}
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={() => removeCreatorAssignment(index)}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* New Creator Form */}
                  {showNewCreatorForm && (
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-semibold mb-4">Create New Creator</h4>
                      <form onSubmit={handleCreateNewCreator} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="new-creator-name">Creator Name *</Label>
                            <Input
                              id="new-creator-name"
                              value={newCreatorForm.name}
                              onChange={(e) => setNewCreatorForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Enter creator name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-creator-avatar">Avatar URL</Label>
                            <Input
                              id="new-creator-avatar"
                              value={newCreatorForm.avatar_url}
                              onChange={(e) => setNewCreatorForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                              placeholder="https://example.com/avatar.jpg"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="new-creator-bio">Bio</Label>
                          <Textarea
                            id="new-creator-bio"
                            value={newCreatorForm.bio}
                            onChange={(e) => setNewCreatorForm(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Enter creator biography"
                            rows={3}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="new-creator-website">Website URL</Label>
                          <Input
                            id="new-creator-website"
                            value={newCreatorForm.website_url}
                            onChange={(e) => setNewCreatorForm(prev => ({ ...prev, website_url: e.target.value }))}
                            placeholder="https://example.com"
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <Button type="submit" className="flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            Create Creator
                          </Button>
                          <Button 
                            type="button" 
                            onClick={() => setShowNewCreatorForm(false)} 
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Settings */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                      />
                      <Label htmlFor="is_featured" className="text-sm">Featured</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                      />
                      <Label htmlFor="is_active" className="text-sm">Active</Label>
                    </div>
                    <div>
                      <Label htmlFor="display_order">Display Order</Label>
                      <Input
                        id="display_order"
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {editingId ? 'Update Series' : 'Create Series'}
                    </Button>
                    <Button type="button" onClick={resetForm} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Series List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.map((seriesItem) => (
              <Card key={seriesItem.id} className="overflow-hidden">
                <div className="aspect-[3/4] bg-muted">
                  {seriesItem.cover_image_url ? (
                    <img
                      src={seriesItem.cover_image_url}
                      alt={seriesItem.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2">{seriesItem.title}</h3>
                    <div className="flex gap-1">
                      {seriesItem.is_featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                      {seriesItem.is_active ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {seriesItem.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="secondary">{seriesItem.status}</Badge>
                    <Badge variant="outline">{seriesItem.age_rating}</Badge>
                    {seriesItem.genre?.slice(0, 2).map(genre => (
                      <Badge key={genre} variant="outline" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    <p>Episodes: {seriesItem.total_episodes}</p>
                    <p>Pages: {seriesItem.total_pages}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(seriesItem)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(seriesItem.id)}
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="creators" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Creators Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage comic creators, writers, and artists
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={async () => {
                  // Generate 20 more creators
                  const newCreators = [];
                  for (let i = 1; i <= 20; i++) {
                    const creatorNames = [
                      'John Smith', 'Maria Garcia', 'James Wilson', 'Sarah Davis', 'Robert Brown',
                      'Jennifer Miller', 'William Jones', 'Linda Anderson', 'David Taylor', 'Patricia Thomas',
                      'Michael Jackson', 'Elizabeth White', 'Christopher Harris', 'Barbara Martin', 'Daniel Thompson',
                      'Susan Garcia', 'Matthew Martinez', 'Jessica Robinson', 'Anthony Clark', 'Nancy Rodriguez'
                    ];
                    const specialties = ['writer', 'artist', 'colorist', 'letterer', 'editor', 'publisher'];
                    const randomSpecialties = specialties.sort(() => 0.5 - Math.random()).slice(0, 2);
                    
                    newCreators.push({
                      name: creatorNames[i - 1] || `Creator ${i}`,
                      bio: `Professional comic creator with expertise in ${randomSpecialties.join(' and ')}.`,
                      avatar_url: `https://picsum.photos/${100 + i}/${100 + i}`,
                      website_url: `https://creator${i}.com`,
                      social_links: {
                        twitter: `@creator${i}`,
                        instagram: `@creator${i}_art`
                      },
                      specialties: randomSpecialties,
                      is_active: true
                    });
                  }
                  
                  // Create all new creators
                  for (const creatorData of newCreators) {
                    await ComicService.createCreator(creatorData);
                  }
                  
                  // Reload data
                  await loadData();
                  
                  toast({
                    title: "Success",
                    description: "Generated 20 new creators successfully",
                  });
                }}
                variant="outline" size="sm"
              >
                Generate 20 Creators
              </Button>
              <Button onClick={() => setShowCreatorForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Creator
              </Button>
            </div>
          </div>

          {showCreatorForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Creator' : 'Add New Creator'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatorSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="creator-name">Creator Name</Label>
                        <Input
                          id="creator-name"
                          value={creatorForm.name}
                          onChange={(e) => setCreatorForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter creator name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="creator-bio">Bio</Label>
                        <Textarea
                          id="creator-bio"
                          value={creatorForm.bio}
                          onChange={(e) => setCreatorForm(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Enter creator bio"
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="creator-avatar">Avatar URL</Label>
                        <Input
                          id="creator-avatar"
                          value={creatorForm.avatar_url}
                          onChange={(e) => setCreatorForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                          placeholder="https://example.com/avatar.jpg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="creator-website">Website URL</Label>
                        <Input
                          id="creator-website"
                          value={creatorForm.website_url}
                          onChange={(e) => setCreatorForm(prev => ({ ...prev, website_url: e.target.value }))}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Specialties */}
                      <div>
                        <Label>Specialties</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={newSpecialty}
                            onChange={(e) => setNewSpecialty(e.target.value)}
                            placeholder="Add specialty"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                          />
                          <Button type="button" onClick={addSpecialty} variant="outline">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {creatorForm.specialties.map(specialty => (
                            <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                              {specialty}
                              <button
                                type="button"
                                onClick={() => removeSpecialty(specialty)}
                                className="ml-1 hover:text-destructive"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Social Links */}
                      <div>
                        <Label>Social Links</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={newSocialPlatform}
                            onChange={(e) => setNewSocialPlatform(e.target.value)}
                            placeholder="Platform (e.g., Twitter)"
                            className="flex-1"
                          />
                          <Input
                            value={newSocialUrl}
                            onChange={(e) => setNewSocialUrl(e.target.value)}
                            placeholder="URL"
                            className="flex-1"
                          />
                          <Button type="button" onClick={addSocialLink} variant="outline">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(creatorForm.social_links).map(([platform, url]) => (
                            <Badge key={platform} variant="outline" className="flex items-center gap-1">
                              {platform}: {url}
                              <button
                                type="button"
                                onClick={() => removeSocialLink(platform)}
                                className="ml-1 hover:text-destructive"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {editingId ? 'Update Creator' : 'Create Creator'}
                    </Button>
                    <Button type="button" onClick={() => {
                      setShowCreatorForm(false);
                      setEditingId(null);
                      setCreatorForm({
                        name: '',
                        bio: '',
                        avatar_url: '',
                        website_url: '',
                        specialties: [],
                        social_links: {}
                      });
                    }} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((creator) => (
              <Card key={creator.id} className="overflow-hidden">
                <div className="aspect-square bg-muted">
                  {creator.avatar_url ? (
                    <img
                      src={creator.avatar_url}
                      alt={creator.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{creator.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {creator.bio}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {creator.specialties?.map(specialty => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setCreatorForm({
                          name: creator.name,
                          bio: creator.bio || '',
                          avatar_url: creator.avatar_url || '',
                          website_url: creator.website_url || '',
                          specialties: creator.specialties || [],
                          social_links: creator.social_links || {}
                        });
                        setEditingId(creator.id);
                        setShowCreatorForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this creator?')) {
                          ComicService.deleteCreator(creator.id).then(() => {
                            toast({
                              title: "Success",
                              description: "Creator deleted successfully",
                            });
                            loadData();
                          }).catch((error) => {
                            console.error('Error deleting creator:', error);
                            toast({
                              title: "Error",
                              description: "Failed to delete creator",
                              variant: "destructive"
                            });
                          });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
