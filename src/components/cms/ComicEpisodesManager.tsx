import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Save, Edit, Upload, BookOpen, Eye, EyeOff, Lock, Unlock, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ComicService, type ComicEpisode, type ComicSeries, type ComicPage } from '@/services/comicService';
import { EnhancedPageManager } from './EnhancedPageManager';

interface EpisodeForm {
  series_id: string;
  episode_number: number;
  title: string;
  description: string;
  cover_image_url: string;
  is_free: boolean;
  coin_price: number;
  is_published: boolean;
  is_active: boolean;
  display_order: number;
}

export const ComicEpisodesManager = () => {
  const { toast } = useToast();
  const [episodes, setEpisodes] = useState<ComicEpisode[]>([]);
  const [series, setSeries] = useState<ComicSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('episodes');
  const [selectedSeries, setSelectedSeries] = useState<string>('all');
  const [formData, setFormData] = useState<EpisodeForm>({
    series_id: '',
    episode_number: 1,
    title: '',
    description: '',
    cover_image_url: '',
    is_free: true,
    coin_price: 0,
    is_published: false,
    is_active: true,
    display_order: 0
  });
  const [showPageForm, setShowPageForm] = useState(false);
  const [selectedEpisodeForPages, setSelectedEpisodeForPages] = useState<string>('');
  const [pageForm, setPageForm] = useState({
    episode_id: '',
    page_number: 1,
    image_url: '',
    alt_text: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [episodesData, seriesData] = await Promise.all([
        ComicService.getEpisodes(),
        ComicService.getSeries()
      ]);
      setEpisodes(episodesData);
      setSeries(seriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load episodes data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      series_id: '',
      episode_number: 1,
      title: '',
      description: '',
      cover_image_url: '',
      is_free: true,
      coin_price: 0,
      is_published: false,
      is_active: true,
      display_order: 0
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('🎬 Submitting episode form:', formData);
      console.log('🆔 Editing ID:', editingId);
      
      // Basic validation
      if (!formData.series_id) {
        toast({
          title: "Error",
          description: "Please select a series",
          variant: "destructive"
        });
        return;
      }
      
      if (!formData.title.trim()) {
        toast({
          title: "Error",
          description: "Episode title is required",
          variant: "destructive"
        });
        return;
      }
      
      if (editingId) {
        console.log('🔄 Updating existing episode...');
        await ComicService.updateEpisode(editingId, formData);
        toast({
          title: "Success",
          description: "Episode updated successfully",
        });
      } else {
        console.log('➕ Creating new episode...');
        const newEpisode = await ComicService.createEpisode(formData);
        console.log('✅ Episode created:', newEpisode);
        toast({
          title: "Success",
          description: "Episode created successfully",
        });
      }
      resetForm();
      loadData();
    } catch (error) {
      console.error('❌ Error saving episode:', error);
      toast({
        title: "Error",
        description: "Failed to save episode",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (episode: ComicEpisode) => {
    setFormData({
      series_id: episode.series_id,
      episode_number: episode.episode_number,
      title: episode.title,
      description: episode.description || '',
      cover_image_url: episode.cover_image_url || '',
      is_free: episode.is_free,
      coin_price: episode.coin_price,
      is_published: episode.is_published,
      is_active: episode.is_active,
      display_order: episode.display_order
    });
    setEditingId(episode.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this episode?')) return;
    
    try {
      await ComicService.deleteEpisode(id);
      toast({
        title: "Success",
        description: "Episode deleted successfully",
      });
      loadData();
    } catch (error) {
      console.error('Error deleting episode:', error);
      toast({
        title: "Error",
        description: "Failed to delete episode",
        variant: "destructive"
      });
    }
  };

  const filteredEpisodes = selectedSeries === 'all' 
    ? episodes 
    : episodes.filter(episode => episode.series_id === selectedSeries);

  const handlePageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('📄 Submitting page form:', pageForm);
      
      // Basic validation
      if (!pageForm.episode_id) {
        toast({
          title: "Error",
          description: "Please select an episode",
          variant: "destructive"
        });
        return;
      }
      
      if (!pageForm.image_url.trim()) {
        toast({
          title: "Error",
          description: "Image URL is required",
          variant: "destructive"
        });
        return;
      }
      
      const newPage = await ComicService.createPage({...pageForm, is_active: true});
      console.log('✅ Page created:', newPage);
      toast({
        title: "Success",
        description: "Page created successfully",
      });
      setPageForm({
        episode_id: '',
        page_number: 1,
        image_url: '',
        alt_text: ''
      });
      setShowPageForm(false);
      loadData();
    } catch (error) {
      console.error('❌ Error creating page:', error);
      toast({
        title: "Error",
        description: "Failed to create page",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading episodes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="episodes">Episodes</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="episodes" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Episode Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage comic episodes and chapters
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  console.log('🔍 Debug - Current localStorage data:');
                  console.log('📚 Comic series:', localStorage.getItem('comic_series'));
                  console.log('🎬 Comic episodes:', localStorage.getItem('comic_episodes'));
                  console.log('📄 Comic pages:', localStorage.getItem('comic_pages'));
                  console.log('🎯 Current state - episodes:', episodes);
                  console.log('🎯 Current state - series:', series);
                }}
                variant="outline" size="sm"
              >
                Debug
              </Button>
              <Button
                onClick={() => {
                  setFormData({
                    series_id: series.length > 0 ? series[0].id : '',
                    episode_number: episodes.length + 1,
                    title: 'Test Episode',
                    description: 'This is a test episode description',
                    cover_image_url: 'https://picsum.photos/200/300',
                    is_free: true,
                    coin_price: 0,
                    is_published: true,
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
                Add Episode
              </Button>
            </div>
          </div>

          {/* Series Filter */}
          <div className="flex gap-4 items-center">
            <Label>Filter by Series:</Label>
            <Select value={selectedSeries} onValueChange={setSelectedSeries}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Series</SelectItem>
                {series.map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Episode' : 'Add New Episode'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="series_id">Series</Label>
                        <Select 
                          value={formData.series_id} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, series_id: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select series" />
                          </SelectTrigger>
                          <SelectContent>
                            {series.map(s => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="episode_number">Episode Number</Label>
                        <Input
                          id="episode_number"
                          type="number"
                          value={formData.episode_number}
                          onChange={(e) => setFormData(prev => ({ ...prev, episode_number: parseInt(e.target.value) || 1 }))}
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="title">Episode Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter episode title"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter episode description"
                          rows={3}
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
                        <Label htmlFor="display_order">Display Order</Label>
                        <Input
                          id="display_order"
                          type="number"
                          value={formData.display_order}
                          onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      
                      {/* Pricing Settings */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="is_free"
                            checked={formData.is_free}
                            onCheckedChange={(checked) => setFormData(prev => ({ 
                              ...prev, 
                              is_free: checked,
                              coin_price: checked ? 0 : prev.coin_price
                            }))}
                          />
                          <Label htmlFor="is_free">Free Episode</Label>
                        </div>
                        {!formData.is_free && (
                          <div>
                            <Label htmlFor="coin_price">Coin Price</Label>
                            <Input
                              id="coin_price"
                              type="number"
                              value={formData.coin_price}
                              onChange={(e) => setFormData(prev => ({ ...prev, coin_price: parseInt(e.target.value) || 0 }))}
                              min="0"
                              placeholder="Enter coin price"
                            />
                          </div>
                        )}
                      </div>

                      {/* Status Settings */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="is_published"
                            checked={formData.is_published}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                          />
                          <Label htmlFor="is_published">Published</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                          />
                          <Label htmlFor="is_active">Active</Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {editingId ? 'Update Episode' : 'Create Episode'}
                    </Button>
                    <Button type="button" onClick={resetForm} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Episodes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEpisodes.map((episode) => (
              <Card key={episode.id} className="overflow-hidden">
                <div className="aspect-[3/4] bg-muted">
                  {episode.cover_image_url ? (
                    <img
                      src={episode.cover_image_url}
                      alt={episode.title}
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
                    <h3 className="font-semibold text-lg line-clamp-2">{episode.title}</h3>
                    <div className="flex gap-1">
                      {episode.is_free ? (
                        <Unlock className="h-4 w-4 text-green-500" />
                      ) : (
                        <Lock className="h-4 w-4 text-orange-500" />
                      )}
                      {episode.is_published ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {episode.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="secondary">Episode {episode.episode_number}</Badge>
                    {episode.is_free ? (
                      <Badge variant="outline" className="text-green-600">Free</Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-600 flex items-center gap-1">
                        <Coins className="h-3 w-3" />
                        {episode.coin_price}
                      </Badge>
                    )}
                    <Badge variant={episode.is_published ? "default" : "secondary"}>
                      {episode.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    <p>Pages: {episode.total_pages}</p>
                    <p>Series: {episode.series?.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(episode)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(episode.id)}
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

        <TabsContent value="pages" className="space-y-6">
          <EnhancedPageManager 
            episodes={episodes}
            selectedEpisodeId={selectedEpisodeForPages}
            onEpisodeChange={setSelectedEpisodeForPages}
            onRefresh={loadData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
