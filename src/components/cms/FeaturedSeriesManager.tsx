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
  Star, 
  Plus, 
  Save, 
  Edit, 
  Trash2, 
  Upload, 
  Eye,
  EyeOff,
  BookOpen,
  Settings,
  ArrowUpDown,
  Image,
  Tag,
  Calendar,
  User,
  Palette,
  RefreshCw,
  FileText,
  Download,
  Upload as UploadIcon,
  History,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ComicService, type ComicSeries } from '@/services/comicService';
import { FeaturedSeriesService, type FeaturedSeriesConfig, type FeaturedSeriesBadge } from '@/services/featuredSeriesService';
import { FeaturedSeriesTemplateService, type FeaturedSeriesTemplate } from '@/services/featuredSeriesTemplateService';


const BADGE_COLORS = [
  { value: 'bg-red-600', label: 'Red', textColor: 'text-white' },
  { value: 'bg-blue-600', label: 'Blue', textColor: 'text-white' },
  { value: 'bg-green-600', label: 'Green', textColor: 'text-white' },
  { value: 'bg-yellow-600', label: 'Yellow', textColor: 'text-white' },
  { value: 'bg-purple-600', label: 'Purple', textColor: 'text-white' },
  { value: 'bg-pink-600', label: 'Pink', textColor: 'text-white' },
  { value: 'bg-orange-600', label: 'Orange', textColor: 'text-white' },
  { value: 'bg-gray-600', label: 'Gray', textColor: 'text-white' }
];

export const FeaturedSeriesManager = () => {
  const { toast } = useToast();
  
  // Featured Series Configuration State
  const [featuredConfigs, setFeaturedConfigs] = useState<FeaturedSeriesConfig[]>([]);
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);
  const [configFormData, setConfigFormData] = useState<Partial<FeaturedSeriesConfig>>({
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

  // Featured Series Badges State
  const [badges, setBadges] = useState<FeaturedSeriesBadge[]>([]);
  const [editingBadgeId, setEditingBadgeId] = useState<string | null>(null);
  const [badgeFormData, setBadgeFormData] = useState<Partial<FeaturedSeriesBadge>>({
    name: '',
    color: 'bg-red-600',
    text_color: 'text-white',
    is_active: true,
    display_order: 0
  });

  // Series Management State
  const [allSeries, setAllSeries] = useState<ComicSeries[]>([]);
  const [featuredSeries, setFeaturedSeries] = useState<ComicSeries[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('config');

  // Template Management State
  const [templates, setTemplates] = useState<FeaturedSeriesTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showApplyTemplateDialog, setShowApplyTemplateDialog] = useState(false);

  useEffect(() => {
    loadFeaturedSeriesData();
    loadTemplates();
  }, []);

  const loadFeaturedSeriesData = async () => {
    try {
      setIsLoading(true);
      console.log('⭐ Loading Featured Series data...');
      
      // Load all series
      const seriesData = await ComicService.getSeries();
      setAllSeries(seriesData);
      
      // Filter featured series
      const featured = seriesData.filter(s => s.is_featured && s.is_active);
      setFeaturedSeries(featured);
      console.log('⭐ Featured series loaded:', featured);

      // Load featured series configurations using service
      const configs = await FeaturedSeriesService.getConfigs();
      setFeaturedConfigs(configs);
      console.log('⭐ Loaded featured configs:', configs);

      // Load badges using service
      const badgesData = await FeaturedSeriesService.getBadges();
      setBadges(badgesData);
      console.log('⭐ Loaded badges:', badgesData);
    } catch (error) {
      console.error('❌ Error loading Featured Series data:', error);
      toast({
        title: "Error",
        description: "Failed to load Featured Series data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Configuration Handlers
  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('🎯 Submitting configuration...');
      console.log('📊 Form data:', configFormData);
      console.log('🆔 Editing ID:', editingConfigId);
      console.log('📝 Form data keys:', Object.keys(configFormData));
      console.log('📝 Form data values:', Object.values(configFormData));
      
      if (editingConfigId) {
        // Update existing config
        console.log('🔄 Updating existing configuration...');
        const updatedConfig = await FeaturedSeriesService.updateConfig(editingConfigId, configFormData);
        console.log('✅ Config updated successfully:', updatedConfig);
        toast({
          title: "Success",
          description: "Featured Series configuration updated successfully"
        });
      } else {
        // Create new config
        console.log('➕ Creating new configuration...');
        const newConfig = await FeaturedSeriesService.createConfig(configFormData);
        console.log('✅ Config created successfully:', newConfig);
        toast({
          title: "Success",
          description: "Featured Series configuration created successfully"
        });
      }
      
      resetConfigForm();
      console.log('🔄 Reloading configurations after save...');
      
      // Force reload data immediately (don't clear cache as it would remove the data we just saved)
      await loadFeaturedSeriesData();
      console.log('✅ Configuration saved and data reloaded');
    } catch (error) {
      console.error('❌ Error saving configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive"
      });
    }
  };

  const handleConfigEdit = (config: FeaturedSeriesConfig) => {
    setConfigFormData(config);
    setEditingConfigId(config.id);
    setActiveTab('config');
  };

  const handleConfigDelete = async (id: string) => {
    try {
      console.log('🗑️ Deleting configuration:', id);
      await FeaturedSeriesService.deleteConfig(id);
      toast({
        title: "Success",
        description: "Configuration deleted successfully"
      });
      console.log('🔄 Reloading configurations after delete...');
      setTimeout(async () => {
        await loadFeaturedSeriesData(); // Reload data to get updated content
      }, 100);
    } catch (error) {
      console.error('❌ Error deleting configuration:', error);
      toast({
        title: "Error",
        description: "Failed to delete configuration",
        variant: "destructive"
      });
    }
  };

  const resetConfigForm = () => {
    setConfigFormData({
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
    setEditingConfigId(null);
  };

  // Badge Handlers
  const handleBadgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('🏷️ Submitting badge...');
      console.log('📊 Badge form data:', badgeFormData);
      console.log('🆔 Editing badge ID:', editingBadgeId);
      
      if (editingBadgeId) {
        // Update existing badge
        console.log('🔄 Updating existing badge...');
        await FeaturedSeriesService.updateBadge(editingBadgeId, badgeFormData);
        toast({
          title: "Success",
          description: "Badge updated successfully"
        });
      } else {
        // Create new badge
        console.log('➕ Creating new badge...');
        await FeaturedSeriesService.createBadge(badgeFormData);
        toast({
          title: "Success",
          description: "Badge created successfully"
        });
      }
      
      resetBadgeForm();
      console.log('🔄 Reloading badges after save...');
      setTimeout(async () => {
        await loadFeaturedSeriesData(); // Reload data to get updated content
      }, 100);
    } catch (error) {
      console.error('❌ Error saving badge:', error);
      toast({
        title: "Error",
        description: "Failed to save badge",
        variant: "destructive"
      });
    }
  };

  const handleBadgeEdit = (badge: FeaturedSeriesBadge) => {
    setBadgeFormData(badge);
    setEditingBadgeId(badge.id);
    setActiveTab('badges');
  };

  const handleBadgeDelete = async (id: string) => {
    try {
      console.log('🗑️ Deleting badge:', id);
      await FeaturedSeriesService.deleteBadge(id);
      toast({
        title: "Success",
        description: "Badge deleted successfully"
      });
      console.log('🔄 Reloading badges after delete...');
      setTimeout(async () => {
        await loadFeaturedSeriesData(); // Reload data to get updated content
      }, 100);
    } catch (error) {
      console.error('❌ Error deleting badge:', error);
      toast({
        title: "Error",
        description: "Failed to delete badge",
        variant: "destructive"
      });
    }
  };

  const resetBadgeForm = () => {
    setBadgeFormData({
      name: '',
      color: 'bg-red-600',
      text_color: 'text-white',
      is_active: true,
      display_order: 0
    });
    setEditingBadgeId(null);
  };

  // Template Management Functions
  const loadTemplates = async () => {
    try {
      console.log('📋 Loading templates...');
      const templateData = await FeaturedSeriesTemplateService.getTemplates();
      setTemplates(templateData);
      console.log(`✅ Loaded ${templateData.length} templates`);
    } catch (error) {
      console.error('❌ Error loading templates:', error);
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive"
      });
    }
  };

  const handleSaveBeforeTemplate = async () => {
    try {
      console.log('💾 Saving current state as "Before Template"...');
      await FeaturedSeriesTemplateService.saveBeforeTemplate(featuredConfigs, badges);
      toast({
        title: "Success",
        description: "Current state saved as 'Before Template'"
      });
      await loadTemplates();
    } catch (error) {
      console.error('❌ Error saving before template:', error);
      toast({
        title: "Error",
        description: "Failed to save before template",
        variant: "destructive"
      });
    }
  };

  const handleSaveTemplate = async () => {
    try {
      if (!templateName.trim()) {
        toast({
          title: "Error",
          description: "Please enter a template name",
          variant: "destructive"
        });
        return;
      }

      console.log('💾 Saving template:', templateName);
      await FeaturedSeriesTemplateService.saveTemplate({
        name: templateName,
        description: templateDescription,
        template_type: 'combined',
        config_data: { configs: featuredConfigs },
        badge_data: { badges: badges },
        is_default: false,
        is_active: true,
        created_by: 'admin'
      });

      toast({
        title: "Success",
        description: `Template "${templateName}" saved successfully`
      });

      setTemplateName('');
      setTemplateDescription('');
      setShowTemplateDialog(false);
      await loadTemplates();
    } catch (error) {
      console.error('❌ Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive"
      });
    }
  };

  const handleApplyTemplate = async () => {
    try {
      if (!selectedTemplate) {
        toast({
          title: "Error",
          description: "Please select a template to apply",
          variant: "destructive"
        });
        return;
      }

      console.log('🔄 Applying template:', selectedTemplate);
      const result = await FeaturedSeriesTemplateService.applyTemplate(selectedTemplate);
      
      // Update the current state with template data
      setFeaturedConfigs(result.configs);
      setBadges(result.badges);

      toast({
        title: "Success",
        description: "Template applied successfully"
      });

      setSelectedTemplate('');
      setShowApplyTemplateDialog(false);
    } catch (error) {
      console.error('❌ Error applying template:', error);
      toast({
        title: "Error",
        description: "Failed to apply template",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string, templateName: string) => {
    try {
      console.log('🗑️ Deleting template:', templateId);
      await FeaturedSeriesTemplateService.deleteTemplate(templateId);
      toast({
        title: "Success",
        description: `Template "${templateName}" deleted successfully`
      });
      await loadTemplates();
    } catch (error) {
      console.error('❌ Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive"
      });
    }
  };

  // Series Management Handlers
  const toggleFeatured = async (seriesId: string, isFeatured: boolean) => {
    try {
      console.log('⭐ Toggling featured status for series:', seriesId, isFeatured);
      await ComicService.updateSeries(seriesId, { is_featured: isFeatured });
      
      // Reload data
      console.log('🔄 Reloading series data after toggle...');
      setTimeout(async () => {
        await loadFeaturedSeriesData();
      }, 100);
      
      toast({
        title: "Success",
        description: `Series ${isFeatured ? 'marked as featured' : 'removed from featured'}`
      });
    } catch (error) {
      console.error('❌ Error toggling featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update series",
        variant: "destructive"
      });
    }
  };

  const updateSeriesOrder = async (seriesId: string, newOrder: number) => {
    try {
      console.log('⭐ Updating series order:', seriesId, newOrder);
      await ComicService.updateSeries(seriesId, { display_order: newOrder });
      
      // Reload data
      console.log('🔄 Reloading series data after order update...');
      setTimeout(async () => {
        await loadFeaturedSeriesData();
      }, 100);
      
      toast({
        title: "Success",
        description: "Series order updated"
      });
    } catch (error) {
      console.error('❌ Error updating series order:', error);
      toast({
        title: "Error",
        description: "Failed to update series order",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Featured Series data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Featured Series Management</h2>
          <p className="text-muted-foreground">
            Manage featured series configuration, badges, and series selection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={async () => {
              console.log('🗑️ Force clearing all caches...');
              FeaturedSeriesService.clearCache();
              FeaturedSeriesTemplateService.clearCache();
              // Also clear any other related caches
              localStorage.removeItem('comic_series');
              await loadFeaturedSeriesData();
              await loadTemplates();
              toast({
                title: "Success",
                description: "All caches cleared and data refreshed"
              });
            }}
            variant="outline" 
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Force Refresh
          </Button>
          <Button 
            onClick={() => {
              const isLocalOnly = FeaturedSeriesService.isLocalStorageOnlyMode();
              FeaturedSeriesService.setLocalStorageOnlyMode(!isLocalOnly);
              toast({
                title: "Success",
                description: `Local storage only mode: ${!isLocalOnly ? 'ENABLED' : 'DISABLED'}`
              });
            }}
            variant="outline" 
            size="sm"
            className={FeaturedSeriesService.isLocalStorageOnlyMode() ? "bg-green-600 text-white" : ""}
          >
            {FeaturedSeriesService.isLocalStorageOnlyMode() ? "Local Only" : "Enable Local Only"}
          </Button>
          <Button onClick={loadFeaturedSeriesData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={() => {
              console.log('🔍 Debug - Current localStorage data:');
              console.log('📊 Featured configs:', localStorage.getItem('featured_series_configs'));
              console.log('🏷️ Featured badges:', localStorage.getItem('featured_series_badges'));
              console.log('📚 Comic series:', localStorage.getItem('comic_series'));
              console.log('🎯 Current state - featuredConfigs:', featuredConfigs);
              console.log('🎯 Current state - badges:', badges);
            }} 
            variant="outline" 
            size="sm"
          >
            Debug
          </Button>
          <Badge variant="outline" className="text-green-600">
            <Star className="h-3 w-3 mr-1" />
            {featuredSeries.length} Featured
          </Badge>
          <Badge variant="outline" className="text-blue-600">
            <BookOpen className="h-3 w-3 mr-1" />
            {allSeries.length} Total
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="series" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Series Management
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Featured Series Configuration</CardTitle>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    // Fill form with test data
                    setConfigFormData({
                      title: 'Test Featured Series',
                      description: 'This is a test configuration for featured series',
                      background_image_url: '/test-bg.jpg',
                      primary_button_text: 'View All',
                      primary_button_link: '/our-series',
                      secondary_button_text: 'Start Reading',
                      secondary_button_link: '/digital-reader',
                      is_active: true,
                      display_order: 1
                    });
                    setActiveTab('config');
                  }}
                  variant="outline"
                  size="sm"
                >
                  Test Data
                </Button>
                <Button onClick={() => {
                  resetConfigForm();
                  setActiveTab('config');
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Configuration
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConfigSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="config-title">Title *</Label>
                    <Input
                      id="config-title"
                      value={configFormData.title || ''}
                      onChange={(e) => setConfigFormData({ ...configFormData, title: e.target.value })}
                      placeholder="Enter section title"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="config-bg-image">Background Image URL</Label>
                    <Input
                      id="config-bg-image"
                      value={configFormData.background_image_url || ''}
                      onChange={(e) => setConfigFormData({ ...configFormData, background_image_url: e.target.value })}
                      placeholder="Enter background image URL"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="config-description">Description *</Label>
                  <Textarea
                    id="config-description"
                    value={configFormData.description || ''}
                    onChange={(e) => setConfigFormData({ ...configFormData, description: e.target.value })}
                    placeholder="Enter section description"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-button-text">Primary Button Text</Label>
                    <Input
                      id="primary-button-text"
                      value={configFormData.primary_button_text || ''}
                      onChange={(e) => setConfigFormData({ ...configFormData, primary_button_text: e.target.value })}
                      placeholder="Enter primary button text"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primary-button-link">Primary Button Link</Label>
                    <Input
                      id="primary-button-link"
                      value={configFormData.primary_button_link || ''}
                      onChange={(e) => setConfigFormData({ ...configFormData, primary_button_link: e.target.value })}
                      placeholder="Enter primary button link"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="secondary-button-text">Secondary Button Text</Label>
                    <Input
                      id="secondary-button-text"
                      value={configFormData.secondary_button_text || ''}
                      onChange={(e) => setConfigFormData({ ...configFormData, secondary_button_text: e.target.value })}
                      placeholder="Enter secondary button text"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondary-button-link">Secondary Button Link</Label>
                    <Input
                      id="secondary-button-link"
                      value={configFormData.secondary_button_link || ''}
                      onChange={(e) => setConfigFormData({ ...configFormData, secondary_button_link: e.target.value })}
                      placeholder="Enter secondary button link"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="config-active"
                      checked={configFormData.is_active || false}
                      onCheckedChange={(checked) => setConfigFormData({ ...configFormData, is_active: checked })}
                    />
                    <Label htmlFor="config-active">Active</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={resetConfigForm}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {editingConfigId ? 'Update' : 'Create'} Configuration
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Configurations List */}
          <Card>
            <CardHeader>
              <CardTitle>Configurations ({featuredConfigs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featuredConfigs.map((config) => (
                  <div key={config.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{config.title}</h3>
                          <Badge variant={config.is_active ? "default" : "secondary"}>
                            {config.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{config.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Primary: {config.primary_button_text}</span>
                          <span>Secondary: {config.secondary_button_text}</span>
                          <span>Order: {config.display_order}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConfigEdit(config)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConfigDelete(config.id)}
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

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Featured Series Badges</CardTitle>
              <Button onClick={() => {
                resetBadgeForm();
                setActiveTab('badges');
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Badge
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBadgeSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="badge-name">Badge Name *</Label>
                    <Input
                      id="badge-name"
                      value={badgeFormData.name || ''}
                      onChange={(e) => setBadgeFormData({ ...badgeFormData, name: e.target.value })}
                      placeholder="Enter badge name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="badge-color">Badge Color *</Label>
                    <Select
                      value={badgeFormData.color || 'bg-red-600'}
                      onValueChange={(value) => setBadgeFormData({ ...badgeFormData, color: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select badge color" />
                      </SelectTrigger>
                      <SelectContent>
                        {BADGE_COLORS.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded ${color.value}`}></div>
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="badge-active"
                      checked={badgeFormData.is_active || false}
                      onCheckedChange={(checked) => setBadgeFormData({ ...badgeFormData, is_active: checked })}
                    />
                    <Label htmlFor="badge-active">Active</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={resetBadgeForm}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {editingBadgeId ? 'Update' : 'Create'} Badge
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Badges List */}
          <Card>
            <CardHeader>
              <CardTitle>Badges ({badges.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {badges.map((badge) => (
                  <div key={badge.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{badge.name}</h3>
                          <Badge variant={badge.is_active ? "default" : "secondary"}>
                            {badge.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color} ${badge.text_color}`}>
                            {badge.name}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Color: {badge.color}</span>
                          <span>Order: {badge.display_order}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBadgeEdit(badge)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBadgeDelete(badge.id)}
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

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Template Management</CardTitle>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveBeforeTemplate}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Save Before Template
                </Button>
                <Button 
                  onClick={() => setShowTemplateDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Current as Template
                </Button>
                <Button 
                  onClick={() => setShowApplyTemplateDialog(true)}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Apply Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{template.name}</h3>
                            {template.is_default && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Type: {template.template_type}</span>
                            <span>Configs: {template.config_data?.configs?.length || 0}</span>
                            <span>Badges: {template.badge_data?.badges?.length || 0}</span>
                            <span>Created: {new Date(template.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTemplate(template.id);
                              setShowApplyTemplateDialog(true);
                            }}
                          >
                            <Download className="h-4 w-4" />
                            Apply
                          </Button>
                          {!template.is_default && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteTemplate(template.id, template.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                  {templates.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No templates found</p>
                      <p className="text-sm">Create your first template to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Series Management Tab */}
        <TabsContent value="series" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Series Management</CardTitle>
              <Button onClick={loadFeaturedSeriesData} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <h3 className="font-semibold">Featured Series</h3>
                    <p className="text-sm text-muted-foreground">{featuredSeries.length} series</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-semibold">Total Series</h3>
                    <p className="text-sm text-muted-foreground">{allSeries.length} series</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">All Series</h3>
                  <div className="space-y-2">
                    {allSeries.map((series) => (
                      <div key={series.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <img
                            src={series.cover_image_url || "/placeholder.svg"}
                            alt={series.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-semibold">{series.title}</h4>
                            <p className="text-sm text-muted-foreground">{series.genre?.[0] || 'Action'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={series.is_featured || false}
                            onCheckedChange={(checked) => toggleFeatured(series.id, checked)}
                          />
                          <span className="text-sm text-muted-foreground">
                            {series.is_featured ? 'Featured' : 'Not Featured'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Featured Series Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <Button 
                    onClick={() => window.open('/our-series', '_blank')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Our Series Page
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Settings className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-semibold">Configurations</h3>
                    <p className="text-sm text-muted-foreground">{featuredConfigs.length} configs</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <Tag className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h3 className="font-semibold">Badges</h3>
                    <p className="text-sm text-muted-foreground">{badges.length} badges</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <h3 className="font-semibold">Featured Series</h3>
                    <p className="text-sm text-muted-foreground">{featuredSeries.length} series</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Template Dialog */}
      {showTemplateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Save Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <Label htmlFor="template-description">Description (Optional)</Label>
                <Textarea
                  id="template-description"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Enter template description"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTemplateDialog(false);
                    setTemplateName('');
                    setTemplateDescription('');
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>
                  Save Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Apply Template Dialog */}
      {showApplyTemplateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Apply Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="template-select">Select Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template to apply" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          <span>{template.name}</span>
                          {template.is_default && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedTemplate && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    This will replace your current configurations and badges with the template data.
                    Make sure to save your current state as a template first if you want to keep it.
                  </p>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowApplyTemplateDialog(false);
                    setSelectedTemplate('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleApplyTemplate}
                  disabled={!selectedTemplate}
                >
                  Apply Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
