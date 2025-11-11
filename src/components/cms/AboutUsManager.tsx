import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Save, Edit, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StorageService } from '@/services/storageService';
import { AboutUsService, type AboutUsHero, type AboutUsSection } from '@/services/aboutUsService';

export const AboutUsManager = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  // State for hero content
  const [heroContent, setHeroContent] = useState<AboutUsHero | null>(null);
  
  // State for sections
  const [sections, setSections] = useState<{ [key: string]: AboutUsSection }>({});

  // Load data from Supabase on component mount
  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);
      const { hero, sections: sectionsData } = await AboutUsService.getAllContent();
      
      setHeroContent(hero);
      setSections(sectionsData);
      
      console.log('✅ Loaded About Us content from Supabase:', { hero, sections: sectionsData });
    } catch (error) {
      console.error('❌ Error loading About Us content:', error);
      toast({
        title: "Error",
        description: "Failed to load About Us content from database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'hero' | 'section', sectionKey?: string) => {
    setUploading(true);
    try {
      // Create a temporary preview URL for immediate display
      const tempUrl = StorageService.createPreviewUrl(file);
      
      if (type === 'hero' && heroContent) {
        setHeroContent(prev => prev ? { ...prev, background_image_url: tempUrl } : null);
      } else if (sectionKey && sections[sectionKey]) {
        setSections(prev => ({
          ...prev,
          [sectionKey]: { ...prev[sectionKey], image_url: tempUrl }
        }));
      }
      
      // Upload to Supabase Storage
      const uploadResult = await StorageService.uploadFile(
        file, 
        'about-us', // folder name
        undefined, // let it generate filename
        'comic-pages' // bucket name
      );
      
      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }
      
      // Update with the actual Supabase URL
      if (type === 'hero' && heroContent) {
        setHeroContent(prev => prev ? { ...prev, background_image_url: uploadResult.url } : null);
      } else if (sectionKey && sections[sectionKey]) {
        setSections(prev => ({
          ...prev,
          [sectionKey]: { ...prev[sectionKey], image_url: uploadResult.url }
        }));
      }
      
      // Clean up temporary URL
      StorageService.revokePreviewUrl(tempUrl);
      
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully to Supabase Storage",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'section', sectionKey?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        handleImageUpload(file, type, sectionKey);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
      }
    }
  };

  const saveHeroContent = async () => {
    if (!heroContent) return;
    
    setSaving(true);
    try {
      const updated = await AboutUsService.updateHeroContent({
        title: heroContent.title,
        subtitle: heroContent.subtitle,
        background_image_url: heroContent.background_image_url
      });
      
      if (updated) {
        setHeroContent(updated);
        toast({
          title: "Success",
          description: "Hero section updated successfully",
        });
      } else {
        throw new Error('Failed to update hero content');
      }
    } catch (error) {
      console.error('Error saving hero content:', error);
      toast({
        title: "Error",
        description: "Failed to save hero section",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveSection = async (sectionKey: string) => {
    const section = sections[sectionKey];
    if (!section) return;
    
    setSaving(true);
    try {
      const updated = await AboutUsService.updateSection(sectionKey, {
        title: section.title,
        heading: section.heading,
        main_text: section.main_text,
        subtext: section.subtext,
        highlights: section.highlights,
        additional_text: section.additional_text,
        closing_text: section.closing_text,
        image_url: section.image_url,
        display_order: section.display_order
      });
      
      if (updated) {
        setSections(prev => ({ ...prev, [sectionKey]: updated }));
        toast({
          title: "Success",
          description: `${section.title} section updated successfully`,
        });
      } else {
        throw new Error('Failed to update section');
      }
    } catch (error) {
      console.error('Error saving section:', error);
      toast({
        title: "Error",
        description: `Failed to save ${section.title} section`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addHighlight = (sectionKey: string) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        highlights: [...prev[sectionKey].highlights, 'New highlight point']
      }
    }));
  };

  const removeHighlight = (sectionKey: string, index: number) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        highlights: prev[sectionKey].highlights.filter((_, i) => i !== index)
      }
    }));
  };

  const updateHighlight = (sectionKey: string, index: number, value: string) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        highlights: prev[sectionKey].highlights.map((highlight, i) => i === index ? value : highlight)
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading About Us content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About Us Page Management</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage the hero section and content tabs for the About Us page
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="hero">Hero Section</TabsTrigger>
              <TabsTrigger value="about">About Us</TabsTrigger>
              <TabsTrigger value="mission">Our Mission</TabsTrigger>
              <TabsTrigger value="team">Our Team</TabsTrigger>
            </TabsList>

            {/* Hero Section Tab */}
            <TabsContent value="hero" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {heroContent && (
                    <>
                      <div>
                        <Label htmlFor="hero-title">Title</Label>
                        <Input
                          id="hero-title"
                          value={heroContent.title}
                          onChange={(e) => setHeroContent(prev => prev ? { ...prev, title: e.target.value } : null)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="hero-subtitle">Subtitle</Label>
                        <Textarea
                          id="hero-subtitle"
                          value={heroContent.subtitle}
                          onChange={(e) => setHeroContent(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="hero-bg">Background Image</Label>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              id="hero-bg"
                              value={heroContent.background_image_url}
                              onChange={(e) => setHeroContent(prev => prev ? { ...prev, background_image_url: e.target.value } : null)}
                              placeholder="Enter image URL or upload an image"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploading}
                              className="flex items-center gap-2"
                            >
                              <Upload className="h-4 w-4" />
                              {uploading ? 'Uploading...' : 'Upload'}
                            </Button>
                            {heroContent.background_image_url && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setHeroContent(prev => prev ? { ...prev, background_image_url: '' } : null)}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                                Remove
                              </Button>
                            )}
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e, 'hero')}
                            className="hidden"
                          />
                          {heroContent.background_image_url && (
                            <div className="mt-2">
                              <img 
                                src={heroContent.background_image_url} 
                                alt="Hero background preview" 
                                className="w-full h-32 object-cover rounded border"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        onClick={saveHeroContent} 
                        disabled={saving}
                        className="flex items-center gap-2"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Hero Section
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* About Sections Tabs */}
            {['about', 'mission', 'team'].map((sectionKey) => {
              const section = sections[sectionKey];
              if (!section) return null;

              return (
                <TabsContent key={sectionKey} value={sectionKey} className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{section.title} Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor={`${sectionKey}-heading`}>Heading</Label>
                        <Input
                          id={`${sectionKey}-heading`}
                          value={section.heading}
                          onChange={(e) => setSections(prev => ({
                            ...prev,
                            [sectionKey]: { ...prev[sectionKey], heading: e.target.value }
                          }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`${sectionKey}-text`}>Main Text</Label>
                        <Textarea
                          id={`${sectionKey}-text`}
                          value={section.main_text}
                          onChange={(e) => setSections(prev => ({
                            ...prev,
                            [sectionKey]: { ...prev[sectionKey], main_text: e.target.value }
                          }))}
                          rows={4}
                        />
                      </div>
                      
                      {section.subtext !== undefined && (
                        <div>
                          <Label htmlFor={`${sectionKey}-subtext`}>Subtext</Label>
                          <Textarea
                            id={`${sectionKey}-subtext`}
                            value={section.subtext || ''}
                            onChange={(e) => setSections(prev => ({
                              ...prev,
                              [sectionKey]: { ...prev[sectionKey], subtext: e.target.value }
                            }))}
                            rows={3}
                          />
                        </div>
                      )}
                      
                      {/* Highlights Section */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Highlight Points</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addHighlight(sectionKey)}
                            className="flex items-center gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Add Point
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {section.highlights.map((highlight, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={highlight}
                                onChange={(e) => updateHighlight(sectionKey, index, e.target.value)}
                                placeholder="Highlight point"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeHighlight(sectionKey, index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {section.additional_text !== undefined && (
                        <div>
                          <Label htmlFor={`${sectionKey}-additional`}>Additional Text</Label>
                          <Textarea
                            id={`${sectionKey}-additional`}
                            value={section.additional_text || ''}
                            onChange={(e) => setSections(prev => ({
                              ...prev,
                              [sectionKey]: { ...prev[sectionKey], additional_text: e.target.value }
                            }))}
                            rows={4}
                          />
                        </div>
                      )}
                      
                      {section.closing_text !== undefined && (
                        <div>
                          <Label htmlFor={`${sectionKey}-closing`}>Closing Text</Label>
                          <Input
                            id={`${sectionKey}-closing`}
                            value={section.closing_text || ''}
                            onChange={(e) => setSections(prev => ({
                              ...prev,
                              [sectionKey]: { ...prev[sectionKey], closing_text: e.target.value }
                            }))}
                          />
                        </div>
                      )}
                      
                      {/* Section Image */}
                      <div>
                        <Label htmlFor={`${sectionKey}-image`}>Section Image</Label>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              id={`${sectionKey}-image`}
                              value={section.image_url}
                              onChange={(e) => setSections(prev => ({
                                ...prev,
                                [sectionKey]: { ...prev[sectionKey], image_url: e.target.value }
                              }))}
                              placeholder="Enter image URL or upload an image"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => handleFileSelect(e as any, 'section', sectionKey);
                                input.click();
                              }}
                              disabled={uploading}
                              className="flex items-center gap-2"
                            >
                              <Upload className="h-4 w-4" />
                              {uploading ? 'Uploading...' : 'Upload'}
                            </Button>
                          </div>
                          {section.image_url && (
                            <div className="mt-2">
                              <img 
                                src={section.image_url} 
                                alt={`${section.title} preview`} 
                                className="w-full h-32 object-cover rounded border"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => saveSection(sectionKey)} 
                        disabled={saving}
                        className="flex items-center gap-2"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save {section.title}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};