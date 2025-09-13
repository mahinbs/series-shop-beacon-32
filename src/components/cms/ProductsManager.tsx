import { useState, useRef, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Plus, Save, Edit, Upload, Package, BookOpen, ShoppingBag, Search, Filter, Grid, List, Copy, Download, BarChart3, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StorageService } from '@/services/storageService';

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

const CATEGORIES = [
  'Manga', 'Webtoon', 'Comic', 'Novel', 'Figure', 'Poster', 'T-Shirt', 'Hoodie', 'Accessory', 'Digital Download', 'E-Book', 'Audio Book'
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: string }>({});
  
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

  // Cleanup function for component unmount
  useEffect(() => {
    return () => {
      // Clean up any preview URLs when component unmounts
      if (formData.image_url && StorageService.isPreviewUrl(formData.image_url)) {
        StorageService.revokePreviewUrl(formData.image_url);
      }
      if (formData.hover_image_url && StorageService.isPreviewUrl(formData.hover_image_url)) {
        StorageService.revokePreviewUrl(formData.hover_image_url);
      }
    };
  }, [formData.image_url, formData.hover_image_url]);

  const resetForm = () => {
    // Clean up any preview URLs
    if (formData.image_url && StorageService.isPreviewUrl(formData.image_url)) {
      StorageService.revokePreviewUrl(formData.image_url);
    }
    if (formData.hover_image_url && StorageService.isPreviewUrl(formData.hover_image_url)) {
      StorageService.revokePreviewUrl(formData.hover_image_url);
    }

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
    setUploadedFiles({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Product title is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Product category is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.image_url.trim()) {
      toast({
        title: "Validation Error",
        description: "Product image is required",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Product price must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateBook(editingId, formData as any);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
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
    } finally {
      setSubmitting(false);
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
        // Find the product to get its image URLs
        const product = books.find(p => p.id === id);
        
        // Delete the product from database
        await deleteBook(id);
        
        // Clean up uploaded files from storage
        if (product) {
          const imagePath = StorageService.extractPathFromUrl(product.image_url);
          const hoverImagePath = product.hover_image_url ? StorageService.extractPathFromUrl(product.hover_image_url) : null;
          
          // Delete files from storage (don't wait for completion)
          if (imagePath) {
            StorageService.deleteFile(imagePath).catch(console.error);
          }
          if (hoverImagePath) {
            StorageService.deleteFile(hoverImagePath).catch(console.error);
          }
        }
        
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
      // Create temporary preview URL for immediate display
      const previewUrl = StorageService.createPreviewUrl(file);
      
      // Set preview URL immediately for user feedback
      if (isHoverImage) {
        setFormData(prev => ({ ...prev, hover_image_url: previewUrl }));
      } else {
        setFormData(prev => ({ ...prev, image_url: previewUrl }));
      }

      // Upload to Supabase Storage
      const folder = `products/${formData.product_type || 'book'}`;
      const result = await StorageService.uploadFile(file, folder);
      
      if (result.error) {
        // Check if it's a storage configuration issue
        if (result.error.includes('bucket') || result.error.includes('storage')) {
          throw new Error(`Storage not configured: ${result.error}. Please check Supabase Storage setup.`);
        }
        throw new Error(result.error);
      }

      // Update with permanent URL
      if (isHoverImage) {
        setFormData(prev => ({ ...prev, hover_image_url: result.url }));
        setUploadedFiles(prev => ({ ...prev, hover_image_url: result.path }));
      } else {
        setFormData(prev => ({ ...prev, image_url: result.url }));
        setUploadedFiles(prev => ({ ...prev, image_url: result.path }));
      }

      // Clean up preview URL
      StorageService.revokePreviewUrl(previewUrl);
      
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully to cloud storage",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      
      // Reset to empty on error
      if (isHoverImage) {
        setFormData(prev => ({ ...prev, hover_image_url: '' }));
      } else {
        setFormData(prev => ({ ...prev, image_url: '' }));
      }
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
    let filteredProducts = books;
    
    if (type !== 'all') {
      filteredProducts = filteredProducts.filter(book => (book.product_type || 'book') === type);
    }
    
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.author && product.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterCategory && filterCategory !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.category === filterCategory
      );
    }
    
    return filteredProducts;
  };

  const getProductTypeLabel = (type: string) => {
    const productType = PRODUCT_TYPES.find(pt => pt.value === type);
    return productType ? productType.label : type;
  };

  // Bulk operations
  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    const currentProducts = getProductsByType(activeTab);
    if (selectedProducts.length === currentProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(currentProducts.map(p => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    
    try {
      await Promise.all(selectedProducts.map(id => deleteBook(id)));
      toast({
        title: "Success",
        description: `${selectedProducts.length} products deleted successfully`,
      });
      setSelectedProducts([]);
      await loadBooks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some products",
        variant: "destructive",
      });
    }
  };

  const handleBulkStatusChange = async (isActive: boolean) => {
    if (selectedProducts.length === 0) return;
    
    try {
      await Promise.all(selectedProducts.map(id => updateBook(id, { is_active: isActive })));
      toast({
        title: "Success",
        description: `${selectedProducts.length} products ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
      setSelectedProducts([]);
      await loadBooks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update some products",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (product: any) => {
    try {
      const duplicateData = {
        ...product,
        title: `${product.title} (Copy)`,
        id: undefined,
        created_at: undefined,
        updated_at: undefined,
      };
      await createBook(duplicateData);
      toast({
        title: "Success",
        description: "Product duplicated successfully",
      });
      await loadBooks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate product",
        variant: "destructive",
      });
    }
  };

  // Statistics
  const getProductStats = () => {
    const total = books.length;
    const active = books.filter(p => p.is_active).length;
    const inactive = total - active;
    
    return { total, active, inactive };
  };

  const exportProducts = () => {
    const dataStr = JSON.stringify(books, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `products-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "Products exported successfully",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  const stats = getProductStats();

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Products</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inactive Products</p>
                <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
              </div>
              <Package className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Selected</p>
                <p className="text-2xl font-bold text-purple-600">{selectedProducts.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

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
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={exportProducts}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products by title, author, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkStatusChange(true)}
                    >
                      Activate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkStatusChange(false)}
                    >
                      Deactivate
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Products</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleBulkDelete}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProducts([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          )}

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
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">
                      No {tab === 'all' ? 'products' : tab} found.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm || filterCategory 
                        ? 'Try adjusting your search or filter criteria.'
                        : `Start by adding your first ${tab === 'all' ? 'product' : tab} to display in the product sections.`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Select All Checkbox */}
                    {getProductsByType(tab).length > 0 && (
                      <div className="flex items-center space-x-2 p-2 border rounded-lg">
                        <Checkbox
                          id="select-all"
                          checked={selectedProducts.length === getProductsByType(tab).length && getProductsByType(tab).length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                        <Label htmlFor="select-all" className="text-sm font-medium">
                          Select All ({getProductsByType(tab).length} products)
                        </Label>
                      </div>
                    )}
                    
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
                      {getProductsByType(tab).map((product) => (
                        <Card key={product.id} className={`border hover:shadow-md transition-shadow ${selectedProducts.includes(product.id) ? 'ring-2 ring-primary' : ''}`}>
                          <CardContent className="p-4">
                            {viewMode === 'grid' ? (
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <Checkbox
                                    checked={selectedProducts.includes(product.id)}
                                    onCheckedChange={() => handleSelectProduct(product.id)}
                                  />
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDuplicate(product)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEdit(product)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete "{product.title}"? This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDelete(product.id)}>
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                                
                                <div className="relative">
                                  <img 
                                    src={product.image_url} 
                                    alt={product.title}
                                    className="w-full h-48 object-cover rounded border"
                                  />
                                  {product.hover_image_url && (
                                    <img 
                                      src={product.hover_image_url} 
                                      alt={`${product.title} hover`}
                                      className="absolute inset-0 w-full h-full object-cover rounded border opacity-0 hover:opacity-100 transition-opacity"
                                    />
                                  )}
                                  <div className="absolute top-2 right-2 flex gap-1">
                                    {product.is_new && <Badge variant="secondary" className="text-xs">🆕 New</Badge>}
                                    {product.is_on_sale && <Badge variant="destructive" className="text-xs">🏷️ Sale</Badge>}
                                    {!product.is_active && <Badge variant="outline" className="text-xs">Inactive</Badge>}
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-sm line-clamp-1">{product.title}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {getProductTypeLabel(product.product_type || 'book')}
                                    </Badge>
                                  </div>
                                  {product.author && (
                                    <p className="text-xs text-muted-foreground">by {product.author}</p>
                                  )}
                                  <p className="text-sm font-medium">
                                    ${product.price}
                                    {product.original_price && (
                                      <span className="line-through text-muted-foreground ml-2">${product.original_price}</span>
                                    )}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{product.category}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={product.is_active ? 'default' : 'secondary'} className="text-xs">
                                      {product.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">Order: {product.display_order}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                  <Checkbox
                                    checked={selectedProducts.includes(product.id)}
                                    onCheckedChange={() => handleSelectProduct(product.id)}
                                  />
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
                                      {!product.is_active && <Badge variant="outline">Inactive</Badge>}
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
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDuplicate(product)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEdit(product)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button 
                                        variant="destructive" 
                                        size="sm"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete "{product.title}"? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(product.id)}>
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
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
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Enter product title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="product_type">Product Type *</Label>
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
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="original_price">Original Price ($)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    step="0.01"
                    value={formData.original_price || ''}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value ? parseFloat(e.target.value) : undefined })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="section_type">Section *</Label>
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
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="coins">Coins</Label>
                  <Input
                    id="coins"
                    value={formData.coins || ''}
                    onChange={(e) => setFormData({ ...formData, coins: e.target.value })}
                    placeholder="e.g., 1199 coins"
                  />
                </div>

                <div>
                  <Label htmlFor="label">Label</Label>
                  <Input
                    id="label"
                    value={formData.label || ''}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g., Vol 98 out now, Limited time offer"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="image_url">Product Image *</Label>
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
                      {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    💡 Upload images to cloud storage for better performance. 
                    <a href="/SUPABASE_STORAGE_SETUP.md" target="_blank" className="text-blue-500 hover:underline ml-1">
                      Setup guide
                    </a>
                  </p>
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
                      {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    💡 Optional image that appears on hover for enhanced user experience
                  </p>
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
                      alt="Hover image preview" 
                      className="w-24 h-32 object-cover rounded border"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Stock keeping unit"
                  />
                </div>

                <div>
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={formData.stock_quantity || 0}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight || 0}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions || ''}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="e.g., 10x15x2 cm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="can_unlock_with_coins"
                    checked={formData.can_unlock_with_coins}
                    onCheckedChange={(checked) => setFormData({ ...formData, can_unlock_with_coins: checked })}
                  />
                  <Label htmlFor="can_unlock_with_coins">Can unlock with coins</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_new"
                    checked={formData.is_new}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
                  />
                  <Label htmlFor="is_new">Mark as new</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_on_sale"
                    checked={formData.is_on_sale}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_on_sale: checked })}
                  />
                  <Label htmlFor="is_on_sale">Mark as on sale</Label>
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
                <Button 
                  type="submit" 
                  className="flex items-center gap-2"
                  disabled={submitting}
                >
                  <Save className="h-4 w-4" />
                  {submitting ? 'Saving...' : (editingId ? 'Update' : 'Create')} Product
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  disabled={submitting}
                >
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