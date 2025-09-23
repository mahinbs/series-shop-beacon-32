import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, FileText, Trash2, Edit, Save, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VolumePage {
  id: string;
  volume_id: string;
  page_number: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface VolumePagesManagerProps {
  volumeId: string;
  volumeTitle: string;
  onClose: () => void;
}

const VolumePagesManager = ({ volumeId, volumeTitle, onClose }: VolumePagesManagerProps) => {
  const [pages, setPages] = useState<VolumePage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [pageForm, setPageForm] = useState({
    page_number: 1,
    image_url: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    loadPages();
  }, [volumeId]);

  const loadPages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('volume_pages')
        .select('*')
        .eq('volume_id', volumeId)
        .order('page_number', { ascending: true });

      if (error) {
        console.error('Error loading volume pages:', error);
        toast({
          title: "Error",
          description: "Failed to load volume pages.",
          variant: "destructive",
        });
        setPages([]);
      } else {
        setPages(data || []);
      }
    } catch (error) {
      console.error('Error loading volume pages:', error);
      setPages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    try {
      setUploadingFile(true);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `volume-pages/${fileName}`;

      const { data, error } = await supabase.storage
        .from('comic-pages')
        .upload(filePath, file);

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('comic-pages')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('File upload error:', error);
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

      const { data, error } = await supabase
        .from('volume_pages')
        .insert({
          volume_id: volumeId,
          page_number: pageForm.page_number,
          image_url: imageUrl,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to add page: ${error.message}`);
      }

      toast({
        title: "Success",
        description: "Page added successfully.",
      });

      // Reset form
      setPageForm({
        page_number: pages.length + 1,
        image_url: ''
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

  const handleEditPage = (page: VolumePage) => {
    setEditingPageId(page.id);
    setPageForm({
      page_number: page.page_number,
      image_url: page.image_url
    });
    setShowAddForm(true);
  };

  const handleUpdatePage = async () => {
    if (!editingPageId) return;

    try {
      let imageUrl = pageForm.image_url;
      
      // If file is selected, upload it
      if (selectedFile) {
        imageUrl = await handleFileUpload(selectedFile);
      }

      const { error } = await supabase
        .from('volume_pages')
        .update({
          page_number: pageForm.page_number,
          image_url: imageUrl
        })
        .eq('id', editingPageId);

      if (error) {
        throw new Error(`Failed to update page: ${error.message}`);
      }

      toast({
        title: "Success",
        description: "Page updated successfully.",
      });

      // Reset form
      setPageForm({
        page_number: 1,
        image_url: ''
      });
      setSelectedFile(null);
      setEditingPageId(null);
      setShowAddForm(false);
      
      // Reload pages
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
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const { error } = await supabase
        .from('volume_pages')
        .delete()
        .eq('id', pageId);

      if (error) {
        throw new Error(`Failed to delete page: ${error.message}`);
      }

      toast({
        title: "Success",
        description: "Page deleted successfully.",
      });

      // Reload pages
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

  const handleCancel = () => {
    setPageForm({
      page_number: 1,
      image_url: ''
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
            <h2 className="text-2xl font-bold text-white">Volume Pages Management</h2>
            <p className="text-gray-400">{volumeTitle}</p>
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

            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-white">Loading pages...</div>
              </div>
            ) : pages.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
                          src={page.image_url}
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

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="w-1/3 border-l border-gray-700 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {editingPageId ? 'Edit Page' : 'Add New Page'}
                  </h3>
                  <Button
                    variant="ghost"
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircle className="w-4 h-4" />
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
                      onClick={handleCancel}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolumePagesManager;
