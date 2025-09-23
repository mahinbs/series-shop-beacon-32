import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Edit, Eye, Upload, BookOpen, FileText } from 'lucide-react';

interface PrintBook {
  id: string;
  title: string;
  author: string;
  description: string;
  image_url: string;
  price: number;
  product_type: string;
  created_at: string;
}

interface PrintPage {
  id: string;
  print_book_id: string;
  page_number: number;
  image_url: string;
  created_at: string;
}

const PrintBookManager = () => {
  const [books, setBooks] = useState<PrintBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<PrintBook | null>(null);
  const [pages, setPages] = useState<PrintPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [showAddPage, setShowAddPage] = useState(false);
  const [newPageNumber, setNewPageNumber] = useState<number>(1);
  const [newPageImageUrl, setNewPageImageUrl] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Load print books
  useEffect(() => {
    loadPrintBooks();
  }, []);

  // Load pages when book is selected
  useEffect(() => {
    if (selectedBook) {
      loadPages(selectedBook.id);
    }
  }, [selectedBook]);

  const loadPrintBooks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('product_type', 'print')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error loading print books:', error);
      toast({
        title: "Error",
        description: "Failed to load print books",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPages = async (bookId: string) => {
    try {
      setIsLoadingPages(true);
      const { data, error } = await supabase
        .from('print_pages')
        .select('*')
        .eq('print_book_id', bookId)
        .order('page_number', { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error loading pages:', error);
      toast({
        title: "Error",
        description: "Failed to load book pages",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPages(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploadingFile(true);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedBook?.id}_page_${newPageNumber}_${Date.now()}.${fileExt}`;
      const filePath = `print-pages/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('comic-pages')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('comic-pages')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAddPage = async () => {
    if (!selectedBook) {
      toast({
        title: "Error",
        description: "Please select a book first",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile && !newPageImageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please upload a file or provide an image URL",
        variant: "destructive",
      });
      return;
    }

    try {
      let imageUrl = newPageImageUrl.trim();

      // If file is selected, upload it first
      if (selectedFile) {
        imageUrl = await handleFileUpload(selectedFile);
      }

      const { error } = await supabase
        .from('print_pages')
        .insert({
          print_book_id: selectedBook.id,
          page_number: newPageNumber,
          image_url: imageUrl,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Page added successfully",
      });

      // Reset form
      setNewPageImageUrl('');
      setNewPageNumber(1);
      setSelectedFile(null);
      setShowAddPage(false);

      // Reload pages
      loadPages(selectedBook.id);
    } catch (error) {
      console.error('Error adding page:', error);
      toast({
        title: "Error",
        description: "Failed to add page",
        variant: "destructive",
      });
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const { error } = await supabase
        .from('print_pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Page deleted successfully",
      });

      // Reload pages
      if (selectedBook) {
        loadPages(selectedBook.id);
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive",
      });
    }
  };

  const handleViewBook = (book: PrintBook) => {
    window.open(`/print-reader/${book.id}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Print Book Manager</h2>
        <Button onClick={loadPrintBooks} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Print Books List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Print Books</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading print books...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No print books found</p>
              <p className="text-gray-500 text-sm">Add print books through the Books Manager</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedBook?.id === book.id
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-gray-700 bg-gray-700/50 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedBook(book)}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">{book.title}</h3>
                      <p className="text-gray-400 text-sm">{book.author}</p>
                      <p className="text-red-400 font-semibold">${book.price}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewBook(book);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pages Management */}
      {selectedBook && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">
                Pages for "{selectedBook.title}"
              </CardTitle>
              <Button
                onClick={() => setShowAddPage(!showAddPage)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Page
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add Page Form */}
            {showAddPage && (
              <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                <h3 className="text-white font-semibold mb-4">Add New Page</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pageNumber" className="text-white">Page Number</Label>
                    <Input
                      id="pageNumber"
                      type="number"
                      value={newPageNumber}
                      onChange={(e) => setNewPageNumber(parseInt(e.target.value) || 1)}
                      className="bg-gray-600 border-gray-500 text-white"
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fileUpload" className="text-white">Upload File</Label>
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
                </div>
                
                {/* OR Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-gray-600"></div>
                  <span className="px-3 text-gray-400 text-sm">OR</span>
                  <div className="flex-1 border-t border-gray-600"></div>
                </div>

                {/* URL Input */}
                <div>
                  <Label htmlFor="imageUrl" className="text-white">Page URL (PDF or JPG)</Label>
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

                <div className="flex space-x-2 mt-4">
                  <Button 
                    onClick={handleAddPage} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={uploadingFile}
                  >
                    {uploadingFile ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Page
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddPage(false);
                      setSelectedFile(null);
                      setNewPageImageUrl('');
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Pages List */}
            {isLoadingPages ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading pages...</p>
              </div>
            ) : pages.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No pages found</p>
                <p className="text-gray-500 text-sm">Add pages to make this book readable</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-white">
                        Page {page.page_number}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeletePage(page.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <img
                      src={page.image_url}
                      alt={`Page ${page.page_number}`}
                      className="w-full h-32 object-cover rounded mb-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <p className="text-gray-400 text-xs truncate">
                      {page.image_url}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrintBookManager;
