import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X, Upload, Video, Image as ImageIcon } from 'lucide-react';
import { creativeSnippetsService, CreativeSnippetItem, CreativeSnippetsSection } from '@/services/creativeSnippetsService';

interface CreativeSnippetFormData {
  title: string;
  description: string;
  volume_chapter: string;
  background_image_url: string;
  video_url: string;
}

const CreativeSnippetsManager: React.FC = () => {
  const [section, setSection] = useState<CreativeSnippetsSection | null>(null);
  const [items, setItems] = useState<CreativeSnippetItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState<{ image: boolean; video: boolean }>({ image: false, video: false });
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreativeSnippetFormData>({
    title: '',
    description: '',
    volume_chapter: '',
    background_image_url: '',
    video_url: ''
  });

  const [sectionFormData, setSectionFormData] = useState({
    title: '',
    subtitle: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  // Force refresh on component mount and window focus
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refreshing Creative Snippets data...');
      loadData();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadData = async () => {
    try {
      console.log('Loading Creative Snippets data in admin panel...');
      
      const sectionData = await creativeSnippetsService.getSection();
      console.log('Section data in admin:', sectionData);
      if (sectionData) {
        setSection(sectionData);
        setSectionFormData({
          title: sectionData.title,
          subtitle: sectionData.subtitle
        });
      } else {
        console.log('No section data found, using defaults');
        setSectionFormData({
          title: 'Creative Snippets',
          subtitle: 'Discover the stories behind your favorite series'
        });
      }
      
      const itemsData = await creativeSnippetsService.getItems();
      console.log('Items data in admin:', itemsData);
      console.log('Items data type:', typeof itemsData);
      console.log('Items data length:', itemsData?.length);
      setItems(itemsData || []);
      
      console.log('Admin panel loaded items count:', itemsData?.length || 0);
      
      // Force re-render
      setTimeout(() => {
        console.log('Current items state after timeout:', items);
      }, 1000);
    } catch (error) {
      console.error('Error loading Creative Snippets data:', error);
      toast({
        title: "Error",
        description: "Failed to load Creative Snippets data",
        variant: "destructive"
      });
    }
  };

  const handleSaveSection = async () => {
    try {
      const updatedSection = await creativeSnippetsService.updateSection(sectionFormData);
      if (updatedSection) {
        setSection(updatedSection);
        setIsEditingSection(false);
        toast({ title: "Success", description: "Section updated successfully" });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update section",
        variant: "destructive"
      });
    }
  };

  const handleAddItem = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in title and description",
        variant: "destructive"
      });
      return;
    }

    try {
      const newItem = await creativeSnippetsService.createItem({
        title: formData.title,
        description: formData.description,
        volume_chapter: formData.volume_chapter || null,
        background_image_url: formData.background_image_url || null,
        video_url: formData.video_url || null,
        video_file_path: null,
        display_order: items.length
      });

      if (newItem) {
        setItems(prev => [...prev, newItem].sort((a, b) => a.display_order - b.display_order));
        resetForm();
        toast({ title: "Success", description: "Creative snippet added successfully" });
        // Trigger refresh on frontend
        window.dispatchEvent(new CustomEvent('creativeSnippetsUpdated'));
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add creative snippet",
        variant: "destructive"
      });
    }
  };

  const handleUpdateItem = async () => {
    if (editingIndex === null || !formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const itemToUpdate = items[editingIndex];
      const updatedItem = await creativeSnippetsService.updateItem(itemToUpdate.id, {
        title: formData.title,
        description: formData.description,
        volume_chapter: formData.volume_chapter || null,
        background_image_url: formData.background_image_url || null,
        video_url: formData.video_url || null
      });

      if (updatedItem) {
        setItems(prev => {
          const updated = [...prev];
          updated[editingIndex] = updatedItem;
          return updated.sort((a, b) => a.display_order - b.display_order);
        });
        resetForm();
        toast({ title: "Success", description: "Creative snippet updated successfully" });
        // Trigger refresh on frontend
        window.dispatchEvent(new CustomEvent('creativeSnippetsUpdated'));
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update creative snippet",
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = async (index: number) => {
    const item = items[index];
    if (!item) return;

    try {
      await creativeSnippetsService.deleteItem(item.id);
      setItems(prev => prev.filter((_, i) => i !== index));
      toast({ title: "Success", description: "Creative snippet deleted successfully" });
      // Trigger refresh on frontend
      window.dispatchEvent(new CustomEvent('creativeSnippetsUpdated'));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete creative snippet",
        variant: "destructive"
      });
    }
  };

  const handleEditItem = (index: number) => {
    const item = items[index];
    if (!item) return;

    setFormData({
      title: item.title,
      description: item.description,
      volume_chapter: item.volume_chapter || '',
      background_image_url: item.background_image_url || '',
      video_url: item.video_url || ''
    });
    setEditingIndex(index);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      volume_chapter: '',
      background_image_url: '',
      video_url: ''
    });
    setEditingIndex(null);
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    try {
      setUploadingMedia(prev => ({ ...prev, image: true }));
      const imageUrl = await creativeSnippetsService.uploadImage(file);
      setFormData(prev => ({ ...prev, background_image_url: imageUrl }));
      toast({ title: "Success", description: "Image uploaded successfully" });
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploadingMedia(prev => ({ ...prev, image: false }));
    }
  };

  const handleVideoUpload = async (file: File) => {
    if (!file) return;
    
    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Video file must be less than 50MB",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setUploadingMedia(prev => ({ ...prev, video: true }));
      const videoUrl = await creativeSnippetsService.uploadVideo(file);
      setFormData(prev => ({ ...prev, video_url: videoUrl }));
      toast({ title: "Success", description: "Video uploaded successfully" });
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload video",
        variant: "destructive"
      });
    } finally {
      setUploadingMedia(prev => ({ ...prev, video: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Creative Snippets Manager</h1>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline">
            Refresh Data
          </Button>
          <Button onClick={() => {
            console.log('Current items state:', items);
            console.log('Current section state:', section);
          }} variant="outline">
            Debug State
          </Button>
          <Button onClick={async () => {
            console.log('Testing database connection...');
            try {
              const testData = await creativeSnippetsService.getItems();
              console.log('Direct service call result:', testData);
              alert(`Found ${testData.length} items in database`);
            } catch (error) {
              console.error('Database test failed:', error);
              alert('Database connection failed: ' + error.message);
            }
          }} variant="outline">
            Test DB
          </Button>
          <Button onClick={async () => {
            console.log('Saving hardcoded website content to database...');
            try {
              // First, update the section title and subtitle
              await creativeSnippetsService.updateSection({
                title: 'Creative Snippets',
                subtitle: 'Discover the stories behind your favorite series'
              });

              // Insert the exact content that's currently hardcoded on the website
              const websiteContent = [
                {
                  title: 'AO HARU RIDE',
                  description: 'Io Sakisaka wanted to draw a story about growing up, and for Ao Haru Ride, she wanted to focus on the characters\' self-journey and discovering who they truly were. Futaba and Kou\'s accidental kiss was based on a real-life experience Sakisaka had in the past.',
                  volume_chapter: 'VOL 01 - CH 01',
                  background_image_url: '/lovable-uploads/a0c88e05-5aba-4550-8ee0-7644ad456776.png',
                  display_order: 1
                },
                {
                  title: 'COMICS COLLECTION',
                  description: 'A vibrant collection of vintage comic book covers featuring classic superheroes and adventure stories. This collage showcases the rich history of comic book art and storytelling.',
                  volume_chapter: 'CLASSIC COLLECTION',
                  background_image_url: '/lovable-uploads/26efc76c-fa83-4369-8d8d-354eab1433e6.png',
                  display_order: 2
                },
                {
                  title: 'SUPERMAN ADVENTURES',
                  description: 'The Man of Steel in his most iconic adventures. From his early days in Metropolis to his cosmic battles, Superman continues to inspire readers with his unwavering commitment to truth and justice.',
                  volume_chapter: 'VOL 01 - CH 01',
                  background_image_url: '/lovable-uploads/97f88fee-e070-4d97-a73a-c747112fa093.png',
                  display_order: 3
                },
                {
                  title: 'VINTAGE COMICS',
                  description: 'Classic comic book covers from the golden age of comics, featuring iconic superheroes and memorable storylines that defined the genre.',
                  volume_chapter: 'GOLDEN AGE',
                  background_image_url: '/lovable-uploads/dec36eb1-43e4-40dc-9068-88317b09eab2.png',
                  display_order: 4
                },
                {
                  title: 'HEROIC TALES',
                  description: 'Epic adventures of legendary heroes fighting for justice and protecting the innocent in thrilling comic book adventures.',
                  volume_chapter: 'EPIC SERIES',
                  background_image_url: '/lovable-uploads/c329fdd6-be7b-4f27-8670-008a030b5b9e.png',
                  display_order: 5
                },
                {
                  title: 'ADVENTURE STORIES',
                  description: 'Exciting tales of adventure and heroism that have captivated readers for generations with their timeless appeal.',
                  volume_chapter: 'TIMELESS TALES',
                  background_image_url: '/lovable-uploads/e5072af9-fcd6-47c6-868c-035382ab9e20.png',
                  display_order: 6
                }
              ];
              
              for (const item of websiteContent) {
                await creativeSnippetsService.createItem(item);
              }
              
              alert('Website content saved to database! Refreshing...');
              loadData();
            } catch (error) {
              console.error('Failed to save website content:', error);
              alert('Failed to save website content: ' + error.message);
            }
          }} variant="outline">
            Save Website Content to DB
          </Button>
        </div>
      </div>

      {/* Section Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Section Settings</CardTitle>
            <Button
              variant="outline"
              onClick={() => setIsEditingSection(!isEditingSection)}
            >
              {isEditingSection ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditingSection ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="section-title">Title</Label>
                <Input
                  id="section-title"
                  value={sectionFormData.title}
                  onChange={(e) => setSectionFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter section title"
                />
              </div>
              <div>
                <Label htmlFor="section-subtitle">Subtitle</Label>
                <Input
                  id="section-subtitle"
                  value={sectionFormData.subtitle}
                  onChange={(e) => setSectionFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Enter section subtitle"
                />
              </div>
              <Button onClick={handleSaveSection} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Section
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p><strong>Title:</strong> {section?.title}</p>
              <p><strong>Subtitle:</strong> {section?.subtitle}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingIndex !== null ? 'Edit Creative Snippet' : 'Add New Creative Snippet'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter title"
              />
            </div>
            <div>
              <Label htmlFor="volume-chapter">Volume/Chapter</Label>
              <Input
                id="volume-chapter"
                value={formData.volume_chapter}
                onChange={(e) => setFormData(prev => ({ ...prev, volume_chapter: e.target.value }))}
                placeholder="e.g., VOL 01 - CH 01"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              rows={4}
            />
          </div>

          {/* Background Image */}
          <div className="space-y-2">
            <Label>Background Image</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  disabled={uploadingMedia.image}
                  className="flex-1"
                />
                {uploadingMedia.image && (
                  <div className="text-sm text-muted-foreground">Uploading...</div>
                )}
              </div>
              <div className="text-center text-sm text-muted-foreground">OR</div>
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.background_image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, background_image_url: e.target.value }))}
                className="w-full"
              />
            </div>
            {formData.background_image_url && (
              <div className="space-y-2">
                <div className="text-xs text-green-600">✓ Image set</div>
                <img 
                  src={formData.background_image_url} 
                  alt="Background preview" 
                  className="w-32 h-20 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Video */}
          <div className="space-y-2">
            <Label>Video (Optional)</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleVideoUpload(file);
                  }}
                  disabled={uploadingMedia.video}
                  className="flex-1"
                />
                {uploadingMedia.video && (
                  <div className="text-sm text-muted-foreground">Uploading...</div>
                )}
              </div>
              <div className="text-center text-sm text-muted-foreground">OR</div>
              <Input
                type="url"
                placeholder="https://example.com/video.mp4"
                value={formData.video_url}
                onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                className="w-full"
              />
            </div>
            {formData.video_url && (
              <div className="space-y-2">
                <div className="text-xs text-green-600">✓ Video set</div>
                <video 
                  src={formData.video_url} 
                  className="w-32 h-20 object-cover rounded border"
                  controls
                  muted
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={editingIndex !== null ? handleUpdateItem : handleAddItem}
              className="flex items-center gap-2"
            >
              {editingIndex !== null ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingIndex !== null ? 'Update' : 'Add'} Creative Snippet
            </Button>
            {editingIndex !== null && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Items List - Display like website */}
      <Card>
        <CardHeader>
          <CardTitle>Creative Snippets ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No creative snippets found. Add your first one above.
            </p>
          ) : (
            <div className="space-y-8">
              {items.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-6 space-y-4">
                  {/* Main Content Layout - Same as website */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side - Large Image */}
                    <div className="relative">
                      <img 
                        src={item.background_image_url || "/lovable-uploads/a0c88e05-5aba-4550-8ee0-7644ad456776.png"}
                        alt={item.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      {item.video_url && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Right Side - Title and Description */}
                    <div className="flex flex-col justify-center">
                      <h3 className="text-2xl font-bold text-red-500 mb-4 tracking-wider">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>
                      {item.volume_chapter && (
                        <div className="text-sm">
                          <span className="text-gray-500">{item.volume_chapter.split(' - ')[0]} - </span>
                          <span className="text-red-500 font-bold">{item.volume_chapter.split(' - ')[1]}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {item.background_image_url && (
                        <span className="flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          Image
                        </span>
                      )}
                      {item.video_url && (
                        <span className="flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          Video
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditItem(index)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteItem(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
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

export default CreativeSnippetsManager;
