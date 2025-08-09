import { useState, useRef } from 'react';
import { useBooks } from '@/hooks/useBooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Save, Edit, Upload, Package, BookOpen, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductForm {
  title: string;
  author?: string;
  category: string;
  product_type: 'book' | 'merchandise' | 'digital' | 'other';
  price: number;
  original_price?: number;
  coins?: string;
  image_url: string;
  hover_image_url?: string;
  description?: string;
  can_unlock_with_coins: boolean;
  section_type: 'new-releases' | 'best-sellers' | 'leaving-soon' | 'featured' | 'trending';
  label?: string;
  is_new: boolean;
  is_on_sale: boolean;
  display_order: number;
  is_active: boolean;
  stock_quantity?: number;
  sku?: string;
  weight?: number;
  dimensions?: string;
  tags?: string[];
}

const PRODUCT_TYPES = [
  { value: 'book', label: 'Book', icon: BookOpen },
  { value: 'merchandise', label: 'Merchandise', icon: ShoppingBag },
  { value: 'digital', label: 'Digital', icon: Package },
  { value: 'other', label: 'Other', icon: Package },
];

const SECTION_TYPES = [
  { value: 'new-releases', label: 'New Releases' },
  { value: 'best-sellers', label: 'Best Sellers' },
  { value: 'leaving-soon', label: 'Leaving Soon' },
  { value: 'featured', label: 'Featured' },
  { value: 'trending', label: 'Trending' },
];

export const ProductsManager = () => {
  const { books, isLoading, createBook, updateBook, deleteBook, loadBooks } = useBooks();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hoverFileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [formData, setFormData] = useState<ProductForm>({
    title: '',
    author: '',
    category: '',
    product_type: 'book',
    price: 0,
    original_price: undefined,
    coins: '',
    image_url: '',
    hover_image_url: '',
    description: '',
    can_unlock_with_coins: false,
    section_type: 'new-releases',
    label: '',
    is_new: false,
    is_on_sale: false,
    display_order: 0,
    is_active: true,
    stock_quantity: 0,
    sku: '',
    weight: 0,
    dimensions: '',
    tags: [],
  });

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      category: '',
      product_type: 'book',
      price: 0,
      original_price: undefined,
      coins: '',
      image_url: '',
      hover_image_url: '',
      description: '',
      can_unlock_with_coins: false,
      section_type: 'new-releases',
      label: '',
      is_new: false,
      is_on_sale: false,
      display_order: 0,
      is_active: true,
      stock_quantity: 0,
      sku: '',
      weight: 0,
      dimensions: '',
      tags: [],
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting product data:', formData);
    try {
      if (editingId) {
        console.log('Updating product with ID:', editingId);
        await updateBook(editingId, formData as any);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        console.log('Creating new product');
        await createBook(formData as any);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }
      resetForm();
      await loadBooks();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      title: product.title,
      author: product.author || '',
      category: product.category,
      product_type: product.product_type || 'book',
      price: product.price,
      original_price: product.original_price,
      coins: product.coins || '',
      image_url: product.image_url,
      hover_image_url: product.hover_image_url || '',
      description: product.description || '',
      can_unlock_with_coins: product.can_unlock_with_coins,
      section_type: product.section_type || 'new-releases',
      label: product.label || '',
      is_new: product.is_new || false,
      is_on_sale: product.is_on_sale || false,
      display_order: product.display_order || 0,
      is_active: product.is_active !== undefined ? product.is_active : true,
      stock_quantity: product.stock_quantity || 0,
      sku: product.sku || '',
      weight: product.weight || 0,
      dimensions: product.dimensions || '',
      tags: product.tags || [],
    });
    setEditingId(product.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteBook(id);
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
        await loadBooks();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product",
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

  const getProductsByType = (type: string) => {
    if (type === 'all') return books;
    return books.filter(book => (book.product_type || 'book') === type);
  };

  const getProductTypeLabel = (type: string) => {
    const productType = PRODUCT_TYPES.find(pt => pt.value === type);
    return productType ? productType.label : type;
  };

  if (isLoading) {
    return <div className="p-4">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products Management
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage all products including books, merchandise, and digital items
            </p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="book">Books</TabsTrigger>
              <TabsTrigger value="merchandise">Merchandise</TabsTrigger>
              <TabsTrigger value="digital">Digital</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            {['all', 'book', 'merchandise', 'digital', 'other'].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-6">
                {getProductsByType(tab).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No {tab === 'all' ? 'products' : tab} created yet.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Start by adding your first {tab === 'all' ? 'product' : tab} to display in the product sections.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getProductsByType(tab).map((product) => (
                      <Card key={product.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                              <div className="flex gap-2">
                                <img 
                                  src={product.image_url} 
                                  alt={product.title}
                                  className="w-16 h-20 object-cover rounded border"
                                />
                                {product.hover_image_url && (
                                  <img 
                                    src={product.hover_image_url} 
                                    alt={`${product.title} hover`}
                                    className="w-16 h-20 object-cover rounded border opacity-70"
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold">{product.title}</h4>
                                  <Badge variant="secondary">
                                    {getProductTypeLabel(product.product_type || 'book')}
                                  </Badge>
                                </div>
                                {product.author && (
                                  <p className="text-sm text-muted-foreground">by {product.author}</p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                  {product.category} • ${product.price}
                                  {product.original_price && (
                                    <span className="line-through ml-2">${product.original_price}</span>
                                  )}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                  <span>Section: {product.section_type}</span>
                                  <span>Order: {product.display_order}</span>
                                  <span>Status: {product.is_active ? 'Active' : 'Inactive'}</span>
                                  {product.can_unlock_with_coins && <span>🪙 Unlockable</span>}
                                  {product.is_new && <span>🆕 New</span>}
                                  {product.is_on_sale && <span>🏷️ On Sale</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEdit(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDelete(product.id)}
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
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Product' : 'Add New Product'}</CardTitle>
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
                  <Label htmlFor="product_type">Product Type</Label>
                  <Select value={formData.product_type} onValueChange={(value: any) => setFormData({ ...formData, product_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.product_type === 'book' && (
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Enter author name"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Adventure, Action, Horror, Figure, Poster"
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
                      {SECTION_TYPES.map((section) => (
                        <SelectItem key={section.value} value={section.value}>
                          {section.label}
                        </SelectItem>
                      ))}
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
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="coins">Coins (Optional)</Label>
                <Input
                  id="coins"
                  value={formData.coins || ''}
                  onChange={(e) => setFormData({ ...formData, coins: e.target.value })}
                  placeholder="e.g., 1199 coins"
                />
              </div>

              <div>
                <Label htmlFor="label">Label (Optional)</Label>
                <Input
                  id="label"
                  value={formData.label || ''}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g., Vol 98 out now, Limited time offer"
                />
              </div>
              
              <div>
                <Label htmlFor="image_url">Product Image</Label>
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
                      alt="Product preview" 
                      className="w-24 h-32 object-cover rounded border"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="hover_image_url">Hover Image (Optional)</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="hover_image_url"
                      value={formData.hover_image_url || ''}
                      onChange={(e) => setFormData({ ...formData, hover_image_url: e.target.value })}
                      placeholder="Enter hover image URL or upload an image"
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
                  {editingId ? 'Update' : 'Create'} Product
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
