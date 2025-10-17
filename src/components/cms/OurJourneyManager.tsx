import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Calendar,
  Image,
  BookOpen,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useCMS } from '@/hooks/useCMS';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ourJourneyService, type OurJourneyTimelineItem, type OurJourneySection } from '@/services/ourJourneyService';

interface TimelineItem {
  year: number;
  header: string;
  description: string;
  leftImage: string;
  rightImage: string;
}

interface OurJourneyManagerProps {
  pageName?: string;
  sectionName?: string;
}

export const OurJourneyManager = ({ 
  pageName = 'about_us', 
  sectionName = 'yearly_timeline' 
}: OurJourneyManagerProps) => {
  const { getSectionContent, updateSectionContent } = useCMS();
  const { toast } = useToast();
  
  const [timeline, setTimeline] = useState<OurJourneyTimelineItem[]>([]);
  const [section, setSection] = useState<OurJourneySection | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<{left: boolean, right: boolean}>({left: false, right: false});
  
  const [formData, setFormData] = useState<TimelineItem>({
    year: new Date().getFullYear(),
    header: '',
    description: '',
    leftImage: '',
    rightImage: ''
  });

  // Load existing content from database
  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        
        // Load section settings
        const sectionData = await ourJourneyService.getSection();
        if (sectionData) {
          setSection(sectionData);
        }
        
        // Load timeline items
        const timelineData = await ourJourneyService.getTimelineItems();
        setTimeline(timelineData);
        
      } catch (error) {
        console.error('Error loading Our Journey content:', error);
        toast({
          title: "Error",
          description: "Failed to load Our Journey content",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [toast]);

  const resetForm = () => {
    setFormData({
      year: new Date().getFullYear(),
      header: '',
      description: '',
      leftImage: '',
      rightImage: ''
    });
    setEditingIndex(null);
    setShowAddForm(false);
  };

  const handleSaveSection = async () => {
    if (!section) return;
    
    setIsLoading(true);
    try {
      const updatedSection = await ourJourneyService.updateSection({
        title: section.title,
        subtitle: section.subtitle
      });
      
      if (updatedSection) {
        setSection(updatedSection);
        toast({
          title: "Success",
          description: "Section settings updated successfully",
        });
      } else {
        throw new Error("Failed to update section");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save section settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!formData.header.trim() || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const newItem = await ourJourneyService.createTimelineItem({
        year: formData.year,
        header: formData.header,
        description: formData.description,
        left_image_url: formData.leftImage || null,
        right_image_url: formData.rightImage || null,
        display_order: timeline.length
      });

      if (newItem) {
        setTimeline(prev => [...prev, newItem].sort((a, b) => a.year - b.year));
        resetForm();
        toast({
          title: "Success",
          description: "Timeline item added successfully",
        });
      } else {
        throw new Error("Failed to create timeline item");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add timeline item",
        variant: "destructive"
      });
    }
  };

  const handleEditItem = (index: number) => {
    const item = timeline[index];
    setFormData({
      year: item.year,
      header: item.header,
      description: item.description,
      leftImage: item.left_image_url || '',
      rightImage: item.right_image_url || ''
    });
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleUpdateItem = async () => {
    console.log('🔄 Starting update process...');
    console.log('📊 Current state:', { editingIndex, formData });
    
    if (editingIndex === null || !formData.header.trim() || !formData.description.trim()) {
      console.log('❌ Validation failed');
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const itemToUpdate = timeline[editingIndex];
      console.log('📝 Item to update:', itemToUpdate);
      
      const updateData = {
        year: formData.year,
        header: formData.header,
        description: formData.description,
        left_image_url: formData.leftImage || null,
        right_image_url: formData.rightImage || null
      };
      
      console.log('📤 Sending update data:', updateData);
      
      const updatedItem = await ourJourneyService.updateTimelineItem(itemToUpdate.id, updateData);
      console.log('📥 Update response:', updatedItem);

      if (updatedItem) {
        console.log('✅ Update successful, updating local state...');
        setTimeline(prev => {
          const updated = [...prev];
          updated[editingIndex] = updatedItem;
          const sorted = updated.sort((a, b) => a.year - b.year);
          console.log('📋 New timeline:', sorted);
          return sorted;
        });
        resetForm();
        toast({
          title: "Success",
          description: "Timeline item updated successfully",
        });
        console.log('🎉 Update complete!');
      } else {
        console.log('❌ Update failed - no item returned');
        throw new Error("Failed to update timeline item");
      }
    } catch (error: any) {
      console.error('💥 Update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update timeline item",
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = async (index: number) => {
    try {
      const itemToDelete = timeline[index];
      const success = await ourJourneyService.deleteTimelineItem(itemToDelete.id);
      
      if (success) {
        setTimeline(prev => prev.filter((_, i) => i !== index));
        toast({
          title: "Success",
          description: "Timeline item deleted successfully",
        });
      } else {
        throw new Error("Failed to delete timeline item");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete timeline item",
        variant: "destructive"
      });
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < timeline.length) {
      const updatedTimeline = [...timeline];
      [updatedTimeline[index], updatedTimeline[newIndex]] = [updatedTimeline[newIndex], updatedTimeline[index]];
      setTimeline(updatedTimeline);
    }
  };

  const handleImageUpload = async (file: File, type: 'left' | 'right') => {
    if (!file) return;

    try {
      setUploadingImages(prev => ({ ...prev, [type]: true }));
      
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `our-journey/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Update form data with the uploaded image URL
      setFormData(prev => ({
        ...prev,
        [type === 'left' ? 'leftImage' : 'rightImage']: data.publicUrl
      }));

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploadingImages(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Our Journey Timeline</h3>
          <p className="text-sm text-muted-foreground">
            Manage the timeline items that appear in the "Our Journey" section
          </p>
        </div>
        <Button onClick={handleSaveSection} disabled={isLoading} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Section Changes'}
        </Button>
      </div>

      {/* Title Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Section Title
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="section-title">Section Title</Label>
            <Input
              id="section-title"
              value={section?.title || ''}
              onChange={(e) => setSection(prev => prev ? { ...prev, title: e.target.value } : null)}
              placeholder="Enter section title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="section-subtitle">Section Subtitle</Label>
            <Textarea
              id="section-subtitle"
              value={section?.subtitle || ''}
              onChange={(e) => setSection(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
              placeholder="Enter section subtitle"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingIndex !== null ? 'Edit Timeline Item' : 'Add New Timeline Item'}</span>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                  placeholder="2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="header">Header Text</Label>
                <Input
                  id="header"
                  value={formData.header}
                  onChange={(e) => setFormData(prev => ({ ...prev, header: e.target.value }))}
                  placeholder="Enter header text (e.g., Growing Community)"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="left-image">Left Image</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="left-image-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'left');
                      }}
                      disabled={uploadingImages.left}
                      className="flex-1"
                    />
                    {uploadingImages.left && (
                      <div className="text-sm text-muted-foreground">Uploading...</div>
                    )}
                  </div>
                  <div className="text-center text-sm text-muted-foreground">OR</div>
                  <Input
                    id="left-image-url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.leftImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, leftImage: e.target.value }))}
                    className="w-full"
                  />
                </div>
                {formData.leftImage && (
                  <div className="space-y-2">
                    <div className="text-xs text-green-600">✓ Image set</div>
                    <img 
                      src={formData.leftImage} 
                      alt="Left preview" 
                      className="w-20 h-20 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="right-image">Right Image</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="right-image-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'right');
                      }}
                      disabled={uploadingImages.right}
                      className="flex-1"
                    />
                    {uploadingImages.right && (
                      <div className="text-sm text-muted-foreground">Uploading...</div>
                    )}
                  </div>
                  <div className="text-center text-sm text-muted-foreground">OR</div>
                  <Input
                    id="right-image-url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.rightImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, rightImage: e.target.value }))}
                    className="w-full"
                  />
                </div>
                {formData.rightImage && (
                  <div className="space-y-2">
                    <div className="text-xs text-green-600">✓ Image set</div>
                    <img 
                      src={formData.rightImage} 
                      alt="Right preview" 
                      className="w-20 h-20 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={editingIndex !== null ? handleUpdateItem : handleAddItem}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {editingIndex !== null ? 'Update Item' : 'Add Item'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline Items List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline Items ({timeline.length})
          </CardTitle>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          {timeline.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No timeline items yet. Click "Add Item" to create your first timeline entry.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.year}
                      </Badge>
                      <h4 className="font-medium">{item.header}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === timeline.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditItem(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  
                  <div className="flex gap-2">
                    {item.left_image_url && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Image className="h-3 w-3" />
                        Left Image
                      </div>
                    )}
                    {item.right_image_url && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Image className="h-3 w-3" />
                        Right Image
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OurJourneyManager;
