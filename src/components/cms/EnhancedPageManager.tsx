import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Edit3, 
  Trash2, 
  Move, 
  Eye, 
  Plus, 
  Save, 
  X, 
  Grid3x3, 
  List,
  ChevronUp,
  ChevronDown,
  FileImage,
  Loader2,
  Link,
  Trash
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ComicService, type ComicEpisode, type ComicPage } from '@/services/comicService';
import { StorageService } from '@/services/storageService';

interface EnhancedPageManagerProps {
  episodes: ComicEpisode[];
  selectedEpisodeId: string;
  onEpisodeChange: (episodeId: string) => void;
  onRefresh: () => void;
}

interface PageEditForm {
  id: string;
  page_number: number;
  image_url: string;
  alt_text: string;
}

interface BulkUploadFile {
  file: File;
  preview: string;
  page_number: number;
  alt_text: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface LinkRow {
  id: string;
  url: string;
  page_number: number;
  alt_text: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export const EnhancedPageManager = ({ 
  episodes, 
  selectedEpisodeId, 
  onEpisodeChange, 
  onRefresh 
}: EnhancedPageManagerProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pages, setPages] = useState<ComicPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPage, setEditingPage] = useState<PageEditForm | null>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<BulkUploadFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'files' | 'links'>('files');
  const [linkRows, setLinkRows] = useState<LinkRow[]>([]);

  const selectedEpisode = episodes.find(e => e.id === selectedEpisodeId);

  useEffect(() => {
    if (selectedEpisodeId) {
      loadPages();
    }
  }, [selectedEpisodeId]);

  const loadPages = async () => {
    if (!selectedEpisodeId) return;
    
    setIsLoading(true);
    try {
      const pagesData = await ComicService.getPagesByEpisode(selectedEpisodeId);
      setPages(pagesData.sort((a, b) => a.page_number - b.page_number));
    } catch (error) {
      console.error('Error loading pages:', error);
      toast({
        title: "Error",
        description: "Failed to load pages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (page: ComicPage) => {
    setEditingPage({
      id: page.id,
      page_number: page.page_number,
      image_url: page.image_url,
      alt_text: page.alt_text || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingPage) return;

    try {
      await ComicService.updatePageSmart(editingPage.id, {
        page_number: editingPage.page_number,
        image_url: editingPage.image_url,
        alt_text: editingPage.alt_text
      });
      
      toast({
        title: "Success",
        description: "Page updated successfully"
      });
      
      setEditingPage(null);
      loadPages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update page",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      await ComicService.deletePage(pageId);
      toast({
        title: "Success",
        description: "Page deleted successfully"
      });
      loadPages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive"
      });
    }
  };

  const handleMoveUp = async (page: ComicPage) => {
    const prevPage = pages.find(p => p.page_number === page.page_number - 1);
    if (!prevPage) return;

    try {
      await ComicService.movePage(page.episode_id, page.id, page.page_number - 1);
      loadPages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder pages",
        variant: "destructive"
      });
    }
  };

  const handleMoveDown = async (page: ComicPage) => {
    const nextPage = pages.find(p => p.page_number === page.page_number + 1);
    if (!nextPage) return;

    try {
      await ComicService.movePage(page.episode_id, page.id, page.page_number + 1);
      loadPages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder pages",
        variant: "destructive"
      });
    }
  };

  const handleBulkFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast({
        title: "Warning",
        description: `${files.length - imageFiles.length} non-image files were ignored`,
        variant: "destructive"
      });
    }

    const newBulkFiles: BulkUploadFile[] = imageFiles.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      page_number: (pages.length || 0) + index + 1,
      alt_text: `Page ${(pages.length || 0) + index + 1}`,
      status: 'pending'
    }));

    setBulkFiles(newBulkFiles);
    setShowBulkUpload(true);
  };

  const handleBulkUpload = async () => {
    if (!selectedEpisodeId || bulkFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get series information for storage folder structure
      const episode = episodes.find(e => e.id === selectedEpisodeId);
      if (!episode) {
        throw new Error('Episode not found');
      }

      // Get series slug from episode's series or use a fallback
      let seriesSlug = 'unknown-series';
      if (episode.series?.slug) {
        seriesSlug = episode.series.slug;
      } else if (episode.series_id) {
        // Try to get series by ID if slug not available
        const allSeries = await ComicService.getSeries();
        const series = allSeries.find(s => s.id === episode.series_id);
        seriesSlug = series?.slug || 'unknown-series';
      }

      for (let i = 0; i < bulkFiles.length; i++) {
        const bulkFile = bulkFiles[i];
        
        setBulkFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'uploading' } : f
        ));

        try {
          // Upload file to permanent storage
          const uploadResult = await StorageService.uploadComicPage(
            bulkFile.file,
            seriesSlug,
            episode.episode_number,
            bulkFile.page_number
          );

          if (uploadResult.error) {
            throw new Error(uploadResult.error);
          }

          // Create page record with permanent storage URL
          await ComicService.createPage({
            episode_id: selectedEpisodeId,
            page_number: bulkFile.page_number,
            image_url: uploadResult.url, // Now using permanent storage URL
            alt_text: bulkFile.alt_text,
            is_active: true
          });

          setBulkFiles(prev => prev.map((f, idx) => 
            idx === i ? { ...f, status: 'success' } : f
          ));
        } catch (error) {
          console.error('Error uploading page:', error);
          setBulkFiles(prev => prev.map((f, idx) => 
            idx === i ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' } : f
          ));
        }

        setUploadProgress(((i + 1) / bulkFiles.length) * 100);
      }

      const successCount = bulkFiles.filter(f => f.status === 'success').length;
      const errorCount = bulkFiles.filter(f => f.status === 'error').length;

      if (successCount > 0) {
        toast({
          title: "Upload Complete",
          description: `${successCount} pages uploaded successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`
        });
      }

      if (errorCount === 0) {
        setShowBulkUpload(false);
        setBulkFiles([]);
      }

      loadPages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload pages",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetBulkUpload = () => {
    // Clean up blob URLs to prevent memory leaks
    bulkFiles.forEach(f => {
      if (f.preview.startsWith('blob:')) {
        URL.revokeObjectURL(f.preview);
      }
    });
    setBulkFiles([]);
    setLinkRows([]);
    setShowBulkUpload(false);
    setUploadProgress(0);
    setUploadMode('files');
  };

  // Clean up blob URLs on component unmount
  useEffect(() => {
    return () => {
      bulkFiles.forEach(f => {
        if (f.preview.startsWith('blob:')) {
          URL.revokeObjectURL(f.preview);
        }
      });
    };
  }, []);

  const addLinkRow = () => {
    const newRow: LinkRow = {
      id: `link-${Date.now()}`,
      url: '',
      page_number: 0, // Will be assigned dynamically during upload
      alt_text: '',
      status: 'pending'
    };
    setLinkRows(prev => [...prev, newRow]);
  };

  const removeLinkRow = (id: string) => {
    setLinkRows(prev => prev.filter(row => row.id !== id));
  };

  const updateLinkRow = (id: string, field: keyof LinkRow, value: string | number) => {
    setLinkRows(prev => prev.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.match(/\.(jpg|jpeg|png|gif|webp)$/i) !== null;
    } catch {
      return false;
    }
  };

  const handleLinksUpload = async () => {
    if (!selectedEpisodeId || linkRows.length === 0) return;

    const validRows = linkRows.filter(row => row.url.trim() && validateUrl(row.url));
    if (validRows.length === 0) {
      toast({
        title: "Error",
        description: "Please add valid image URLs",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      console.log('🚀 Starting link upload for', validRows.length, 'links');

      for (let i = 0; i < validRows.length; i++) {
        const linkRow = validRows[i];
        
        setLinkRows(prev => prev.map(row => 
          row.id === linkRow.id ? { ...row, status: 'uploading' } : row
        ));

        try {
          console.log(`📄 Processing link ${i + 1}/${validRows.length}:`, linkRow.url);
          
          // Use the new retry method for automatic page number assignment
          const createdPage = await ComicService.createPageWithRetry({
            image_url: linkRow.url,
            alt_text: linkRow.alt_text || `Page from ${linkRow.url}`,
            is_active: true
          }, selectedEpisodeId);

          console.log('✅ Page created successfully:', createdPage);

          setLinkRows(prev => prev.map(row => 
            row.id === linkRow.id ? { ...row, status: 'success', page_number: createdPage.page_number } : row
          ));

        } catch (error) {
          console.error('❌ Error creating page from link:', error);
          setLinkRows(prev => prev.map(row => 
            row.id === linkRow.id ? { 
              ...row, 
              status: 'error', 
              error: error instanceof Error ? error.message : 'Failed to create page' 
            } : row
          ));
        }

        setUploadProgress(((i + 1) / validRows.length) * 100);
      }

      const successCount = linkRows.filter(row => row.status === 'success').length;
      const errorCount = linkRows.filter(row => row.status === 'error').length;

      if (successCount > 0) {
        toast({
          title: "Upload Complete",
          description: `${successCount} pages created successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`
        });
      }

      if (errorCount === 0) {
        setShowBulkUpload(false);
        setLinkRows([]);
      }

      loadPages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create pages from links",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!selectedEpisodeId) {
    return (
      <div className="text-center py-12">
        <FileImage className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Episode Selected</h3>
        <p className="text-muted-foreground mb-4">Select an episode to manage its pages</p>
        <Select value={selectedEpisodeId} onValueChange={onEpisodeChange}>
          <SelectTrigger className="w-64 mx-auto">
            <SelectValue placeholder="Choose an episode" />
          </SelectTrigger>
          <SelectContent>
            {episodes.map(episode => (
              <SelectItem key={episode.id} value={episode.id}>
                Episode {episode.episode_number}: {episode.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Page Management</h3>
          <p className="text-sm text-muted-foreground">
            Managing pages for: <span className="font-medium">{selectedEpisode?.title}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleBulkFileSelect}
            className="hidden"
          />
          <Button
            onClick={() => {
              setUploadMode('files');
              fileInputRef.current?.click();
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            From Files
          </Button>
          <Button
            onClick={() => {
              setUploadMode('links');
              setLinkRows([{ 
                id: `link-${Date.now()}`,
                url: '',
                page_number: 0, // Will be assigned dynamically during upload
                alt_text: '',
                status: 'pending'
              }]);
              setShowBulkUpload(true);
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Link className="h-4 w-4" />
            From Links
          </Button>
        </div>
      </div>

      {/* Episode Selector */}
      <div className="flex gap-4 items-center">
        <Label>Episode:</Label>
        <Select value={selectedEpisodeId} onValueChange={onEpisodeChange}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {episodes.map(episode => (
              <SelectItem key={episode.id} value={episode.id}>
                Episode {episode.episode_number}: {episode.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="secondary">
          {pages.length} page{pages.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading pages...</span>
        </div>
      )}

      {/* Pages Grid/List */}
      {!isLoading && (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
            : "space-y-2"
        }>
          {pages.map((page, index) => (
            <Card key={page.id} className={`overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}>
              {viewMode === 'grid' ? (
                <>
                  <div className="relative aspect-[3/4] bg-muted group">
                    <img
                      src={page.image_url}
                      alt={page.alt_text || `Page ${page.page_number}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(page)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDelete(page.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {page.page_number}
                    </div>
                  </div>
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Page {page.page_number}</p>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMoveUp(page)}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMoveDown(page)}
                          disabled={index === pages.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <>
                  <div className="w-20 h-28 bg-muted flex-shrink-0">
                    <img
                      src={page.image_url}
                      alt={page.alt_text || `Page ${page.page_number}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Page {page.page_number}</h4>
                      <p className="text-sm text-muted-foreground">{page.alt_text || 'No description'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(page)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(page.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMoveUp(page)}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMoveDown(page)}
                          disabled={index === pages.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && pages.length === 0 && (
        <div className="text-center py-12">
          <FileImage className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Pages Yet</h3>
          <p className="text-muted-foreground mb-4">Start by uploading some pages for this episode</p>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Pages
          </Button>
        </div>
      )}

      {/* Edit Page Dialog */}
      <Dialog open={!!editingPage} onOpenChange={(open) => !open && setEditingPage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
          </DialogHeader>
          {editingPage && (
            <div className="space-y-4">
              <div className="aspect-[3/4] w-32 mx-auto bg-muted rounded">
                <img
                  src={editingPage.image_url}
                  alt={`Page ${editingPage.page_number}`}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-page-number">Page Number</Label>
                  <Input
                    id="edit-page-number"
                    type="number"
                    value={editingPage.page_number}
                    onChange={(e) => setEditingPage(prev => prev && ({
                      ...prev,
                      page_number: parseInt(e.target.value) || 1
                    }))}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-image-url">Image URL</Label>
                  <Input
                    id="edit-image-url"
                    value={editingPage.image_url}
                    onChange={(e) => setEditingPage(prev => prev && ({
                      ...prev,
                      image_url: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-alt-text">Alt Text / Description</Label>
                  <Textarea
                    id="edit-alt-text"
                    value={editingPage.alt_text}
                    onChange={(e) => setEditingPage(prev => prev && ({
                      ...prev,
                      alt_text: e.target.value
                    }))}
                    placeholder="Describe what happens on this page"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingPage(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={showBulkUpload} onOpenChange={(open) => !open && resetBulkUpload()}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {uploadMode === 'files' ? 'Bulk Upload from Files' : 'Add Pages from URLs'}
            </DialogTitle>
          </DialogHeader>
          
          {/* File Upload Mode */}
          {uploadMode === 'files' && bulkFiles.length > 0 && (
            <div className="space-y-4">
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading pages...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bulkFiles.map((bulkFile, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative aspect-[3/4] bg-muted">
                      <img
                        src={bulkFile.preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        {bulkFile.status === 'pending' && (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                        {bulkFile.status === 'uploading' && (
                          <Badge variant="default">
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            Uploading
                          </Badge>
                        )}
                        {bulkFile.status === 'success' && (
                          <Badge variant="default" className="bg-green-600">Success</Badge>
                        )}
                        {bulkFile.status === 'error' && (
                          <Badge variant="destructive">Error</Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-2 space-y-2">
                      <Input
                        type="number"
                        value={bulkFile.page_number}
                        onChange={(e) => {
                          const newPageNumber = parseInt(e.target.value) || 1;
                          setBulkFiles(prev => prev.map((f, i) => 
                            i === index ? { ...f, page_number: newPageNumber } : f
                          ));
                        }}
                        min="1"
                        className="h-8"
                        placeholder="Page #"
                      />
                      <Input
                        value={bulkFile.alt_text}
                        onChange={(e) => {
                          setBulkFiles(prev => prev.map((f, i) => 
                            i === index ? { ...f, alt_text: e.target.value } : f
                          ));
                        }}
                        className="h-8"
                        placeholder="Description"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={resetBulkUpload} disabled={isUploading}>
                  Cancel
                </Button>
                <Button onClick={handleBulkUpload} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload {bulkFiles.length} Pages
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Links Upload Mode */}
          {uploadMode === 'links' && (
            <div className="space-y-4">
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Creating pages...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Add image URLs to create pages. Make sure URLs end with image extensions (.jpg, .png, .gif, .webp)
                  </p>
                  <Button onClick={addLinkRow} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Row
                  </Button>
                </div>

                {linkRows.map((row, index) => (
                  <Card key={row.id} className="p-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                       <div className="col-span-1">
                         <Label className="text-xs">Page #</Label>
                         <div className="h-8 flex items-center justify-center bg-muted rounded-md text-xs text-muted-foreground">
                           Auto
                         </div>
                       </div>
                      <div className="col-span-6">
                        <Label className="text-xs">Image URL</Label>
                        <Input
                          type="url"
                          value={row.url}
                          onChange={(e) => updateLinkRow(row.id, 'url', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className={`h-8 ${!validateUrl(row.url) && row.url ? 'border-red-500' : ''}`}
                        />
                        {!validateUrl(row.url) && row.url && (
                          <p className="text-xs text-red-500 mt-1">Invalid image URL</p>
                        )}
                      </div>
                      <div className="col-span-4">
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={row.alt_text}
                          onChange={(e) => updateLinkRow(row.id, 'alt_text', e.target.value)}
                          placeholder="Page description"
                          className="h-8"
                        />
                      </div>
                      <div className="col-span-1 flex justify-center items-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLinkRow(row.id)}
                          className="h-8 w-8 p-0"
                          disabled={linkRows.length === 1}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {row.status === 'uploading' && (
                      <div className="mt-2 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Creating page...</span>
                      </div>
                    )}
                    {row.status === 'success' && (
                      <div className="mt-2">
                        <Badge variant="default" className="bg-green-600">Success</Badge>
                      </div>
                    )}
                    {row.status === 'error' && (
                      <div className="mt-2">
                        <Badge variant="destructive">Error: {row.error}</Badge>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={resetBulkUpload} disabled={isUploading}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleLinksUpload} 
                  disabled={isUploading || linkRows.every(row => !row.url.trim() || !validateUrl(row.url))}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create {linkRows.filter(row => row.url.trim() && validateUrl(row.url)).length} Pages
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};