import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  MoreHorizontal,
  BookOpen,
  Upload,
  X,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChapterService, BookChapter, ChapterPage } from '@/services/chapterService';
import { supabase } from '@/integrations/supabase/client';

interface ChapterManagerProps {
  bookId: string;
  bookTitle: string;
  onClose: () => void;
}

const ChapterManager = ({ bookId, bookTitle, onClose }: ChapterManagerProps) => {
  const [chapters, setChapters] = useState<BookChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<BookChapter | null>(null);
  const [showPagesManager, setShowPagesManager] = useState(false);
  
  const [chapterForm, setChapterForm] = useState({
    chapter_number: 1,
    chapter_title: '',
    chapter_description: '',
    is_preview: false,
    display_order: 0
  });

  const { toast } = useToast();

  useEffect(() => {
    loadChapters();
  }, [bookId]);

  const loadChapters = async () => {
    try {
      setIsLoading(true);
      const data = await ChapterService.getBookChapters(bookId);
      setChapters(data);
    } catch (error) {
      console.error('Error loading chapters:', error);
      toast({
        title: "Error",
        description: "Failed to load chapters.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddChapter = async () => {
    try {
      if (!chapterForm.chapter_title.trim()) {
        toast({
          title: "Error",
          description: "Chapter title is required.",
          variant: "destructive",
        });
        return;
      }

      const chapterData = {
        book_id: bookId,
        chapter_number: chapterForm.chapter_number,
        chapter_title: chapterForm.chapter_title,
        chapter_description: chapterForm.chapter_description,
        is_preview: chapterForm.is_preview,
        is_active: true,
        display_order: chapterForm.display_order
      };

      await ChapterService.createChapter(chapterData);
      
      toast({
        title: "Success",
        description: "Chapter added successfully.",
      });

      // Reset form
      setChapterForm({
        chapter_number: chapters.length + 1,
        chapter_title: '',
        chapter_description: '',
        is_preview: false,
        display_order: 0
      });
      setShowChapterForm(false);
      
      // Reload chapters
      loadChapters();
    } catch (error) {
      console.error('Error adding chapter:', error);
      toast({
        title: "Error",
        description: "Failed to add chapter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditChapter = (chapter: BookChapter) => {
    setEditingChapterId(chapter.id);
    setChapterForm({
      chapter_number: chapter.chapter_number,
      chapter_title: chapter.chapter_title,
      chapter_description: chapter.chapter_description || '',
      is_preview: chapter.is_preview,
      display_order: chapter.display_order
    });
    setShowChapterForm(true);
  };

  const handleUpdateChapter = async () => {
    try {
      if (!editingChapterId) return;

      const updates = {
        chapter_number: chapterForm.chapter_number,
        chapter_title: chapterForm.chapter_title,
        chapter_description: chapterForm.chapter_description,
        is_preview: chapterForm.is_preview,
        display_order: chapterForm.display_order
      };

      await ChapterService.updateChapter(editingChapterId, updates);
      
      toast({
        title: "Success",
        description: "Chapter updated successfully.",
      });

      setEditingChapterId(null);
      setShowChapterForm(false);
      loadChapters();
    } catch (error) {
      console.error('Error updating chapter:', error);
      toast({
        title: "Error",
        description: "Failed to update chapter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    try {
      await ChapterService.deleteChapter(chapterId);
      
      toast({
        title: "Success",
        description: "Chapter deleted successfully.",
      });

      loadChapters();
    } catch (error) {
      console.error('Error deleting chapter:', error);
      toast({
        title: "Error",
        description: "Failed to delete chapter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleManagePages = (chapter: BookChapter) => {
    setSelectedChapter(chapter);
    setShowPagesManager(true);
  };

  const resetForm = () => {
    setChapterForm({
      chapter_number: chapters.length + 1,
      chapter_title: '',
      chapter_description: '',
      is_preview: false,
      display_order: 0
    });
    setEditingChapterId(null);
    setShowChapterForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Chapter Management</h2>
          <p className="text-muted-foreground">Manage chapters for "{bookTitle}"</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowChapterForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Chapter
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Chapter Form */}
      {showChapterForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingChapterId ? 'Edit Chapter' : 'Add New Chapter'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chapter_number">Chapter Number</Label>
                <Input
                  id="chapter_number"
                  type="number"
                  value={chapterForm.chapter_number}
                  onChange={(e) =>
                    setChapterForm({ ...chapterForm, chapter_number: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={chapterForm.display_order}
                  onChange={(e) =>
                    setChapterForm({ ...chapterForm, display_order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="chapter_title">Chapter Title *</Label>
              <Input
                id="chapter_title"
                value={chapterForm.chapter_title}
                onChange={(e) =>
                  setChapterForm({ ...chapterForm, chapter_title: e.target.value })
                }
                placeholder="Enter chapter title"
              />
            </div>

            <div>
              <Label htmlFor="chapter_description">Chapter Description</Label>
              <Textarea
                id="chapter_description"
                value={chapterForm.chapter_description}
                onChange={(e) =>
                  setChapterForm({ ...chapterForm, chapter_description: e.target.value })
                }
                placeholder="Enter chapter description"
                rows={3}
              />
            </div>


            <div className="flex items-center space-x-2">
              <Switch
                id="is_preview"
                checked={chapterForm.is_preview}
                onCheckedChange={(checked) =>
                  setChapterForm({ ...chapterForm, is_preview: checked })
                }
              />
              <Label htmlFor="is_preview">Available for Preview</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={editingChapterId ? handleUpdateChapter : handleAddChapter}>
                {editingChapterId ? 'Update Chapter' : 'Add Chapter'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chapters List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading chapters...</div>
        ) : chapters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No chapters found. Add your first chapter to get started.
          </div>
        ) : (
          chapters.map((chapter) => (
            <Card key={chapter.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Chapter {chapter.chapter_number}</Badge>
                      {chapter.is_preview && (
                        <Badge variant="secondary">Preview</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{chapter.chapter_title}</h3>
                    {chapter.chapter_description && (
                      <p className="text-muted-foreground text-sm mt-1">
                        {chapter.chapter_description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleManagePages(chapter)}
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      Pages
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEditChapter(chapter)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteChapter(chapter.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Chapter Pages Manager Dialog */}
      {showPagesManager && selectedChapter && (
        <ChapterPagesManager
          chapterId={selectedChapter.id}
          chapterTitle={selectedChapter.chapter_title}
          onClose={() => {
            setShowPagesManager(false);
            setSelectedChapter(null);
          }}
        />
      )}
    </div>
  );
};

// Chapter Pages Manager Component (similar to VolumePagesManager)
interface ChapterPagesManagerProps {
  chapterId: string;
  chapterTitle: string;
  onClose: () => void;
}

const ChapterPagesManager = ({ chapterId, chapterTitle, onClose }: ChapterPagesManagerProps) => {
  const [pages, setPages] = useState<ChapterPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [pageForm, setPageForm] = useState({
    page_number: 1,
    image_url: '',
    page_title: '',
    page_description: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    loadPages();
  }, [chapterId]);

  const loadPages = async () => {
    try {
      setIsLoading(true);
      const data = await ChapterService.getChapterPages(chapterId);
      setPages(data);
    } catch (error) {
      console.error('Error loading chapter pages:', error);
      toast({
        title: "Error",
        description: "Failed to load chapter pages.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    try {
      setUploadingFile(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `chapter-pages/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('comic-pages')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('comic-pages')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAddPage = async () => {
    try {
      if (!pageForm.image_url && !selectedFile) {
        toast({
          title: "Error",
          description: "Please provide either an image URL or upload a file.",
          variant: "destructive",
        });
        return;
      }

      let imageUrl = pageForm.image_url;
      
      // If file is selected, upload it
      if (selectedFile) {
        imageUrl = await handleFileUpload(selectedFile);
      }

      const pageData = {
        chapter_id: chapterId,
        page_number: pageForm.page_number,
        page_url: imageUrl,
        page_title: pageForm.page_title,
        page_description: pageForm.page_description,
        is_active: true
      };

      await ChapterService.createChapterPage(pageData);
      
      toast({
        title: "Success",
        description: "Page added successfully.",
      });

      // Reset form
      setPageForm({
        page_number: pages.length + 1,
        image_url: '',
        page_title: '',
        page_description: ''
      });
      setSelectedFile(null);
      setShowAddForm(false);
      
      // Reload pages
      loadPages();
    } catch (error) {
      console.error('Error adding page:', error);
      toast({
        title: "Error",
        description: "Failed to add page. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditPage = (page: ChapterPage) => {
    setEditingPageId(page.id);
    setPageForm({
      page_number: page.page_number,
      image_url: page.page_url || '',
      page_title: page.page_title || '',
      page_description: page.page_description || ''
    });
    setShowAddForm(true);
  };

  const handleUpdatePage = async () => {
    try {
      if (!editingPageId) return;

      const updates = {
        page_number: pageForm.page_number,
        page_url: pageForm.image_url,
        page_title: pageForm.page_title,
        page_description: pageForm.page_description
      };

      await ChapterService.updateChapterPage(editingPageId, updates);
      
      toast({
        title: "Success",
        description: "Page updated successfully.",
      });

      setEditingPageId(null);
      setShowAddForm(false);
      loadPages();
    } catch (error) {
      console.error('Error updating page:', error);
      toast({
        title: "Error",
        description: "Failed to update page. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePage = async (pageId: string) => {
    try {
      await ChapterService.deleteChapterPage(pageId);
      
      toast({
        title: "Success",
        description: "Page deleted successfully.",
      });

      loadPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: "Error",
        description: "Failed to delete page. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setPageForm({
      page_number: pages.length + 1,
      image_url: '',
      page_title: '',
      page_description: ''
    });
    setSelectedFile(null);
    setEditingPageId(null);
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Chapter Pages Management</h2>
            <p className="text-gray-400">{chapterTitle}</p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Pages List */}
          <div className="w-2/3 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Pages ({pages.length})</h3>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Page
              </Button>
            </div>

          {/* Page Form */}
          {showAddForm && (
            <div className="w-1/3 border-l border-gray-700 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {editingPageId ? 'Edit Page' : 'Add New Page'}
                  </h3>
                  <Button
                    variant="ghost"
                    onClick={resetForm}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="page_number" className="text-white">Page Number</Label>
                    <Input
                      id="page_number"
                      type="number"
                      value={pageForm.page_number}
                      onChange={(e) => setPageForm({ ...pageForm, page_number: parseInt(e.target.value) || 1 })}
                      className="bg-gray-800 border-gray-600 text-white"
                      min="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image_url" className="text-white">Image URL</Label>
                    <Input
                      id="image_url"
                      value={pageForm.image_url}
                      onChange={(e) => setPageForm({ ...pageForm, image_url: e.target.value })}
                      placeholder="Enter image URL"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      Provide a URL for the page image
                    </p>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="text-center text-gray-400 text-sm mb-2">OR</div>
                    
                    <div>
                      <Label htmlFor="file_upload" className="text-white">Upload File</Label>
                      <div className="mt-2">
                        <input
                          id="file_upload"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('file_upload')?.click()}
                          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                        {selectedFile && (
                          <div className="mt-2 text-sm text-gray-400">
                            Selected: {selectedFile.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={editingPageId ? handleUpdatePage : handleAddPage}
                      disabled={uploadingFile}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      {uploadingFile ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {editingPageId ? 'Update Page' : 'Add Page'}
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-white">Loading pages...</div>
              </div>
            ) : pages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
                  <BookOpen className="w-12 h-12" />
                </div>
                <div className="text-white mb-2">No pages yet</div>
                <div className="text-gray-400">Add your first page to get started</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.map((page) => (
                  <Card key={page.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="aspect-[3/4] bg-gray-700 rounded-lg overflow-hidden mb-3">
                        <img
                          src={page.page_url}
                          alt={`Page ${page.page_number}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-red-600 text-white">
                            Page {page.page_number}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditPage(page)}
                              className="text-gray-400 hover:text-white p-1"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePage(page.id)}
                              className="text-gray-400 hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-white font-medium text-sm">
                          Page {page.page_number}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterManager;
