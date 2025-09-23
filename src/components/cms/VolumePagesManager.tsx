import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, Eye, Upload, BookOpen, FileText } from 'lucide-react';

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
}

export const VolumePagesManager: React.FC<VolumePagesManagerProps> = ({ volumeId, volumeTitle }) => {
  const [pages, setPages] = useState<VolumePage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newPageNumber, setNewPageNumber] = useState(1);
  const [newPageImageUrl, setNewPageImageUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (volumeId) {
      fetchVolumePages();
    }
  }, [volumeId]);

  const fetchVolumePages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('volume_pages')
        .select('*')
        .eq('volume_id', volumeId)
        .eq('is_active', true)
        .order('page_number', { ascending: true });

      if (error) {
        console.error('Error fetching volume pages:', error);
        toast({
          title: "Error",
          description: "Failed to load volume pages",
          variant: "destructive",
        });
        return;
      }

      setPages(data || []);
      setNewPageNumber((data?.length || 0) + 1);
    } catch (error) {
      console.error('Error fetching volume pages:', error);
      toast({
        title: "Error",
        description: "Failed to load volume pages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploadingFile(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${volumeId}_page_${newPageNumber}_${Date.now()}.${fileExt}`;
      const filePath = `volume-pages/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('comic-pages')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('comic-pages')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Volume page upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload volume page image",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAddPage = async () => {
    if (!newPageNumber || (!newPageImageUrl.trim() && !selectedFile)) {
      toast({
        title: "Error",
        description: "Please provide a page number and image",
        variant: "destructive",
      });
      return;
    }

    try {
      let imageUrl = newPageImageUrl.trim();
      
      if (selectedFile) {
        imageUrl = await handleFileUpload(selectedFile);
      }

      const { data, error } = await supabase
        .from('volume_pages')
        .insert({
          volume_id: volumeId,
          page_number: newPageNumber,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding volume page:', error);
        toast({
          title: "Error",
          description: "Failed to add volume page",
          variant: "destructive",
        });
        return;
      }

      setPages(prev => [...prev, data].sort((a, b) => a.page_number - b.page_number));
      setNewPageNumber(prev => prev + 1);
      setNewPageImageUrl('');
      setSelectedFile(null);

      toast({
        title: "Success",
        description: "Volume page added successfully",
      });
    } catch (error) {
      console.error('Error adding volume page:', error);
      toast({
        title: "Error",
        description: "Failed to add volume page",
        variant: "destructive",
      });
    }
  };

  const handleDeletePage = async (pageId: string) => {
    try {
      const { error } = await supabase
        .from('volume_pages')
        .delete()
        .eq('id', pageId);

      if (error) {
        console.error('Error deleting volume page:', error);
        toast({
          title: "Error",
          description: "Failed to delete volume page",
          variant: "destructive",
        });
        return;
      }

      setPages(prev => prev.filter(page => page.id !== pageId));
      toast({
        title: "Success",
        description: "Volume page deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting volume page:', error);
      toast({
        title: "Error",
        description: "Failed to delete volume page",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="text-center">Loading volume pages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Volume Pages Management</h3>
        <p className="text-sm text-gray-400 mb-4">
          Manage pages for: <strong>{volumeTitle}</strong>
        </p>
      </div>

      {/* Add New Page Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Page
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pageNumber">Page Number *</Label>
              <Input
                id="pageNumber"
                type="number"
                min="1"
                value={newPageNumber}
                onChange={(e) => setNewPageNumber(parseInt(e.target.value) || 1)}
                className="bg-gray-600 border-gray-500 text-white"
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="fileUpload">Upload Page Image</Label>
            <Input
              id="fileUpload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                  setNewPageImageUrl(''); // Clear URL when file is selected
                }
              }}
              className="bg-gray-600 border-gray-500 text-white file:bg-gray-500 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
            />
            <p className="text-gray-400 text-xs mt-1">
              Supports PDF, JPG, PNG, WebP files
            </p>
          </div>

          {/* OR Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* URL Input */}
          <div>
            <Label htmlFor="imageUrl">Page URL (PDF or JPG)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={newPageImageUrl}
              onChange={(e) => {
                setNewPageImageUrl(e.target.value);
                if (e.target.value) {
                  setSelectedFile(null); // Clear file when URL is entered
                }
              }}
              placeholder="https://example.com/page.pdf or https://example.com/page.jpg"
              className="bg-gray-600 border-gray-500 text-white"
            />
            <p className="text-gray-400 text-xs mt-1">
              Enter a direct URL to the page file
            </p>
          </div>

          {/* Selected File Display */}
          {selectedFile && (
            <div className="mt-3 p-3 bg-gray-600 rounded-lg">
              <p className="text-white text-sm">
                <strong>Selected File:</strong> {selectedFile.name}
              </p>
              <p className="text-gray-400 text-xs">
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          <Button
            onClick={handleAddPage}
            disabled={uploadingFile || !newPageNumber || (!newPageImageUrl.trim() && !selectedFile)}
            className="w-full"
          >
            {uploadingFile ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Page
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Pages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Volume Pages ({pages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pages.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No pages added yet. Add your first page above.
            </div>
          ) : (
            <div className="grid gap-4">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 bg-gray-700 rounded overflow-hidden">
                      <img
                        src={page.image_url}
                        alt={`Page ${page.page_number}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-white">Page {page.page_number}</p>
                      <p className="text-sm text-gray-400">
                        Added: {new Date(page.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(page.image_url, '_blank')}
                      className="text-gray-400 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePage(page.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default VolumePagesManager;
