import { useState, useRef } from 'react';
import { useBooks } from '@/hooks/useBooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Save, Edit, Upload, BookOpen } from 'lucide-react';
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
  section_type: 'new-releases' | 'best-sellers' | 'leaving-soon';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting book data:', formData);
    try {
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
      toast({
        title: "Error",
        description: "Failed to save book",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (book: any) => {
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      price: book.price,
      original_price: book.original_price,
      coins: book.coins || '',
      image_url: book.image_url,
      hover_image_url: book.hover_image_url,
      can_unlock_with_coins: book.can_unlock_with_coins,
      section_type: book.section_type,
      label: book.label || '',
      is_new: book.is_new,
      is_on_sale: book.is_on_sale,
      display_order: book.display_order,
      is_active: book.is_active,
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
        toast({
          title: "Error",
          description: "Failed to delete book",
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
    return <div className="p-4">Loading books...</div>;
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
          <Button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Book
          </Button>
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
            <div className="space-y-4">
              {books.map((book) => (
                <Card key={book.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="flex gap-2">
                          <img 
                            src={book.image_url} 
                            alt={book.title}
                            className="w-16 h-20 object-cover rounded border"
                          />
                          <img 
                            src={book.hover_image_url} 
                            alt={`${book.title} hover`}
                            className="w-16 h-20 object-cover rounded border opacity-70"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{book.title}</h4>
                          <p className="text-sm text-muted-foreground">by {book.author}</p>
                          <p className="text-sm text-muted-foreground">{book.category} • ${book.price}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>Section: {book.section_type}</span>
                            <span>Order: {book.display_order}</span>
                            <span>Status: {book.is_active ? 'Active' : 'Inactive'}</span>
                            {book.can_unlock_with_coins && <span>🪙 Unlockable</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(book)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(book.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
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
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Adventure, Action, Horror"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="original_price">Original Price ($) (Optional)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    step="0.01"
                    value={formData.original_price || ''}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value ? parseFloat(e.target.value) : undefined })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="section_type">Section</Label>
                  <Select value={formData.section_type} onValueChange={(value: any) => setFormData({ ...formData, section_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-releases">New Releases</SelectItem>
                      <SelectItem value="best-sellers">Best Sellers</SelectItem>
                      <SelectItem value="leaving-soon">Leaving Soon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="coins">Coins (Optional)</Label>
                <Input
                  id="coins"
                  value={formData.coins}
                  onChange={(e) => setFormData({ ...formData, coins: e.target.value })}
                  placeholder="e.g., 1199 coins"
                />
              </div>

              <div>
                <Label htmlFor="label">Label (Optional)</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g., Vol 98 out now, Limited time offer"
                />
              </div>
              
              <div>
                <Label htmlFor="image_url">Book Image</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="Enter image URL or upload an image"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, false)}
                    className="hidden"
                  />
                  {formData.image_url && (
                    <img 
                      src={formData.image_url} 
                      alt="Book preview" 
                      className="w-24 h-32 object-cover rounded border"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="hover_image_url">Hover Image</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="hover_image_url"
                      value={formData.hover_image_url}
                      onChange={(e) => setFormData({ ...formData, hover_image_url: e.target.value })}
                      placeholder="Enter hover image URL or upload an image"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => hoverFileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                  <input
                    ref={hoverFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, true)}
                    className="hidden"
                  />
                  {formData.hover_image_url && (
                    <img 
                      src={formData.hover_image_url} 
                      alt="Hover preview" 
                      className="w-24 h-32 object-cover rounded border"
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="can_unlock_with_coins"
                    checked={formData.can_unlock_with_coins}
                    onCheckedChange={(checked) => setFormData({ ...formData, can_unlock_with_coins: checked })}
                  />
                  <Label htmlFor="can_unlock_with_coins">Can Unlock with Coins</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_new"
                    checked={formData.is_new}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
                  />
                  <Label htmlFor="is_new">Is New</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_on_sale"
                    checked={formData.is_on_sale}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_on_sale: checked })}
                  />
                  <Label htmlFor="is_on_sale">Is On Sale</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingId ? 'Update' : 'Create'} Book
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};