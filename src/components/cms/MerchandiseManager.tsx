import { useState, useRef } from "react";
import { useMerchandiseOnly } from "@/hooks/useBooks";
import { testDatabaseConnection } from "@/services/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  Plus,
  Save,
  Edit,
  Upload,
  ShoppingBag,
  Database,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MerchandiseForm {
  title: string;
  category: string;
  price: number;
  original_price?: number;
  coins?: string;
  image_url: string;
  hover_image_url: string;
  description: string;
  can_unlock_with_coins: boolean;
  section_type:
    | "new-releases"
    | "best-sellers"
    | "leaving-soon"
    | "featured"
    | "trending";
  label?: string;
  is_new: boolean;
  is_on_sale: boolean;
  display_order: number;
  is_active: boolean;
  stock_quantity: number;
  sku: string;
  weight: number;
  dimensions: string;
  tags: string[];
}

const MERCHANDISE_CATEGORIES = [
  "Figure",
  "Poster",
  "T-Shirt",
  "Hoodie",
  "Accessory",
  "Collectible",
  "Plush",
  "Keychain",
  "Sticker",
  "Art Print",
  "Mug",
  "Bag",
  "Hat",
  "Socks",
  "Jewelry",
  "Other",
];

const SECTION_TYPES = [
  { value: "new-releases", label: "New Releases" },
  { value: "best-sellers", label: "Best Sellers" },
  { value: "leaving-soon", label: "Leaving Soon" },
  { value: "featured", label: "Featured" },
  { value: "trending", label: "Trending" },
];

export const MerchandiseManager = () => {
  const { books, isLoading, createBook, updateBook, deleteBook, loadBooks } =
    useMerchandiseOnly();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hoverFileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [formData, setFormData] = useState<MerchandiseForm>({
    title: "",
    category: "",
    price: 0,
    original_price: undefined,
    coins: "",
    image_url: "",
    hover_image_url: "",
    description: "",
    can_unlock_with_coins: false,
    section_type: "new-releases",
    label: "",
    is_new: false,
    is_on_sale: false,
    display_order: 0,
    is_active: true,
    stock_quantity: 0,
    sku: "",
    weight: 0,
    dimensions: "",
    tags: [],
  });

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      price: 0,
      original_price: undefined,
      coins: "",
      image_url: "",
      hover_image_url: "",
      description: "",
      can_unlock_with_coins: false,
      section_type: "new-releases",
      label: "",
      is_new: false,
      is_on_sale: false,
      display_order: 0,
      is_active: true,
      stock_quantity: 0,
      sku: "",
      weight: 0,
      dimensions: "",
      tags: [],
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
    console.log("Submitting merchandise data:", formData);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.category.trim()) {
        throw new Error("Category is required");
      }
      if (formData.price <= 0) {
        throw new Error("Price must be greater than 0");
      }
      if (!formData.image_url.trim()) {
        throw new Error("Image URL is required");
      }

      // Prepare merchandise data
      const merchandiseData = {
        ...formData,
        product_type: "merchandise" as const,
        author: "", // Merchandise doesn't have authors
      };

      if (editingId) {
        console.log("Updating merchandise with ID:", editingId);
        await updateBook(editingId, merchandiseData as any);
        toast({
          title: "Success",
          description: "Merchandise updated successfully",
        });
      } else {
        console.log("Creating new merchandise");
        await createBook(merchandiseData as any);
        toast({
          title: "Success",
          description: "Merchandise created successfully",
        });
      }
      resetForm();
      await loadBooks();
    } catch (error) {
      console.error("Error saving merchandise:", error);
      let errorMessage = "Failed to save merchandise";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
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

  const handleEdit = (merchandise: any) => {
    setFormData({
      title: merchandise.title || "",
      category: merchandise.category || "",
      price: merchandise.price || 0,
      original_price: merchandise.original_price,
      coins: merchandise.coins || "",
      image_url: merchandise.image_url || "",
      hover_image_url: merchandise.hover_image_url || "",
      description: merchandise.description || "",
      can_unlock_with_coins: merchandise.can_unlock_with_coins || false,
      section_type: merchandise.section_type || "new-releases",
      label: merchandise.label || "",
      is_new: merchandise.is_new || false,
      is_on_sale: merchandise.is_on_sale || false,
      display_order: merchandise.display_order || 0,
      is_active:
        merchandise.is_active !== undefined ? merchandise.is_active : true,
      stock_quantity: merchandise.stock_quantity || 0,
      sku: merchandise.sku || "",
      weight: merchandise.weight || 0,
      dimensions: merchandise.dimensions || "",
      tags: merchandise.tags || [],
    });
    setEditingId(merchandise.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this merchandise?")) {
      try {
        await deleteBook(id);
        toast({
          title: "Success",
          description: "Merchandise deleted successfully",
        });
        await loadBooks();
      } catch (error) {
        console.error("Error deleting merchandise:", error);
        let errorMessage = "Failed to delete merchandise";

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
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
        setFormData((prev) => ({ ...prev, hover_image_url: tempUrl }));
      } else {
        setFormData((prev) => ({ ...prev, image_url: tempUrl }));
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

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    isHoverImage = false
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
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
          <span className="ml-2">Loading merchandise...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={testDatabase}
              variant="outline"
              size="sm"
              disabled={testing}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              {testing ? "Testing..." : "Test DB"}
            </Button>
            <Button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2"
              disabled={submitting}
            >
              <Plus className="h-4 w-4" />
              Add Merchandise
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {books.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No merchandise created yet. Start by adding your first
                merchandise item to display in the product sections.
              </p>
              <p className="text-sm text-muted-foreground">
                Merchandise will be organized into sections: New Releases, Best
                Sellers, and Leaving Soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {books.map((merchandise) => (
                <Card key={merchandise.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {merchandise.image_url && (
                        <img
                          src={merchandise.image_url}
                          alt={merchandise.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{merchandise.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {merchandise.category} • ${merchandise.price}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Section: {merchandise.section_type} • Order:{" "}
                          {merchandise.display_order}
                        </p>
                        {merchandise.stock_quantity !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            Stock: {merchandise.stock_quantity} • SKU:{" "}
                            {merchandise.sku || "N/A"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(merchandise)}
                        disabled={submitting}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(merchandise.id)}
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
            <CardTitle>
              {editingId ? "Edit Merchandise" : "Add New Merchandise"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    placeholder="Enter merchandise title"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Rated as *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {MERCHANDISE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="original_price">Original Price</Label>
                  <Input
                    id="original_price"
                    type="number"
                    step="0.01"
                    value={formData.original_price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        original_price: parseFloat(e.target.value) || undefined,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="coins">Coins</Label>
                  <Input
                    id="coins"
                    value={formData.coins}
                    onChange={(e) =>
                      setFormData({ ...formData, coins: e.target.value })
                    }
                    placeholder="e.g., 1000 coins"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="section_type">Section *</Label>
                  <Select
                    value={formData.section_type}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, section_type: value })
                    }
                  >
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        display_order: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock_quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="Stock keeping unit"
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
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weight: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) =>
                      setFormData({ ...formData, dimensions: e.target.value })
                    }
                    placeholder="e.g., 10x5x2 cm"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter merchandise description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_url">Image URL *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      required
                      placeholder="Enter image URL"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, false)}
                    className="hidden"
                  />
                </div>

                <div>
                  <Label htmlFor="hover_image_url">Hover Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="hover_image_url"
                      value={formData.hover_image_url}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hover_image_url: e.target.value,
                        })
                      }
                      placeholder="Enter hover image URL"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => hoverFileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <input
                    ref={hoverFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, true)}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_new"
                    checked={formData.is_new}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_new: checked })
                    }
                  />
                  <Label htmlFor="is_new">New Item</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_on_sale"
                    checked={formData.is_on_sale}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_on_sale: checked })
                    }
                  />
                  <Label htmlFor="is_on_sale">On Sale</Label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="can_unlock_with_coins"
                  checked={formData.can_unlock_with_coins}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, can_unlock_with_coins: checked })
                  }
                />
                <Label htmlFor="can_unlock_with_coins">
                  Can Unlock with Coins
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {submitting
                    ? "Saving..."
                    : editingId
                    ? "Update Merchandise"
                    : "Add Merchandise"}
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
