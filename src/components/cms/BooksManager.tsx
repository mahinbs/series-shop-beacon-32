import { useState, useRef } from 'react';
import { useBooks } from '@/hooks/useBooks';
import { testDatabaseConnection } from '@/services/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Save, Edit, Upload, BookOpen, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookForm {
  title: string;
  author: string;
  category: string;
  price: number;
  original_price?: number;
  coins?: string;
  image_url: string;
  hover_image_url: string;
  can_unlock_with_coins: boolean;
  section_type: 'new-releases' | 'best-sellers' | 'leaving-soon' | 'featured' | 'trending';
  label?: string;
  is_new: boolean;
  is_on_sale: boolean;
  display_order: number;
  is_active: boolean;
}

export const BooksManager = () => {
  const { books, isLoading, createBook, updateBook, deleteBook, loadBooks } = useBooks();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hoverFileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [formData, setFormData] = useState<BookForm>({
    title: '',
    author: '',
    category: '',
    price: 0,
    original_price: undefined,
    coins: '',
    image_url: '',
    hover_image_url: '',
    can_unlock_with_coins: false,
    section_type: 'new-releases',
    label: '',
    is_new: false,
    is_on_sale: false,
    display_order: 0,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      category: '',
      price: 0,
      original_price: undefined,
      coins: '',
      image_url: '',
      hover_image_url: '',
      can_unlock_with_coins: false,
      section_type: 'new-releases',
      label: '',
      is_new: false,
      is_on_sale: false,
      display_order: 0,
      is_active: true,
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const testDatabase = async () => {
    setTesting(true);
    try {
      const result = await testDatabaseConnection();
      if (result.success) {
        toast({
          title: "Database Test Successful",
          description: "Database connection is working properly",
        });
      } else {
        toast({
          title: "Database Test Failed",
          description: `Error: ${result.error}. Please run the database setup script.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Database Test Failed",
        description: "Failed to test database connection",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    console.log('Submitting book data:', formData);
    
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.category.trim()) {
        throw new Error('Category is required');
      }
      if (formData.price <= 0) {
        throw new Error('Price must be greater than 0');
      }
      if (!formData.image_url.trim()) {
        throw new Error('Image URL is required');
      }

      if (editingId) {
        console.log('Updating book with ID:', editingId);
        await updateBook(editingId, formData);
        toast({
          title: "Success",
          description: "Book updated successfully",
        });
      } else {
        console.log('Creating new book');
        await createBook(formData);
        toast({
          title: "Success",
          description: "Book created successfully",
        });
      }
      resetForm();
      await loadBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      let errorMessage = 'Failed to save book';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (book: any) => {
    setFormData({
      title: book.title || '',
      author: book.author || '',
      category: book.category || '',
      price: book.price || 0,
      original_price: book.original_price,
      coins: book.coins || '',
      image_url: book.image_url || '',
      hover_image_url: book.hover_image_url || '',
      can_unlock_with_coins: book.can_unlock_with_coins || false,
      section_type: book.section_type || 'new-releases',
      label: book.label || '',
      is_new: book.is_new || false,
      is_on_sale: book.is_on_sale || false,
      display_order: book.display_order || 0,
      is_active: book.is_active !== undefined ? book.is_active : true,
    });
    setEditingId(book.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        toast({
          title: "Success",
          description: "Book deleted successfully",
        });
        await loadBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
        let errorMessage = 'Failed to delete book';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  const handleImageUpload = async (file: File, isHoverImage = false) => {
    setUploading(true);
    try {
      const tempUrl = URL.createObjectURL(file);
      if (isHoverImage) {
        setFormData(prev => ({ ...prev, hover_image_url: tempUrl }));
      } else {
        setFormData(prev => ({ ...prev, image_url: tempUrl }));
      }
      
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isHoverImage = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        handleImageUpload(file, isHoverImage);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading books...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Books Management
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage books that appear in the sections below the hero banner
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={testDatabase}
              variant="outline"
              size="sm"
              disabled={testing}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              {testing ? 'Testing...' : 'Test DB'}
            </Button>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2"
              disabled={submitting}
            >
              <Plus className="h-4 w-4" />
              Add Book
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {books.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No books created yet. Start by adding your first book to display in the product sections.
              </p>
              <p className="text-sm text-muted-foreground">
                Books will be organized into sections: New Releases, Best Sellers, and Leaving Soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {books.map((book) => (
                <Card key={book.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {book.image_url && (
                        <img
                          src={book.image_url}
                          alt={book.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {book.author} • {book.category} • ${book.price}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Section: {book.section_type} • Order: {book.display_order}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(book)}
                        disabled={submitting}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(book.id)}
                        disabled={submitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Book' : 'Add New Book'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    disabled={submitting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    disabled={submitting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="section_type">Section Type</Label>
                  <Select
                    value={formData.section_type}
                    onValueChange={(value: any) => setFormData({ ...formData, section_type: value })}
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-releases">New Releases</SelectItem>
                      <SelectItem value="best-sellers">Best Sellers</SelectItem>
                      <SelectItem value="leaving-soon">Leaving Soon</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_url">Image URL *</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    required
                    disabled={submitting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="hover_image_url">Hover Image URL</Label>
                  <Input
                    id="hover_image_url"
                    value={formData.hover_image_url}
                    onChange={(e) => setFormData({ ...formData, hover_image_url: e.target.value })}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_new"
                    checked={formData.is_new}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
                    disabled={submitting}
                  />
                  <Label htmlFor="is_new">New</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_on_sale"
                    checked={formData.is_on_sale}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_on_sale: checked })}
                    disabled={submitting}
                  />
                  <Label htmlFor="is_on_sale">On Sale</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    disabled={submitting}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {editingId ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {editingId ? 'Update Book' : 'Create Book'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};