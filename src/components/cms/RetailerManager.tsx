import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Save,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RetailerService, Retailer } from "@/services/retailerService";

export const RetailerManager = () => {
  const { toast } = useToast();
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    website_url: '',
    logo_url: '',
    is_active: true,
    display_order: 0
  });

  // Load retailers
  const loadRetailers = async () => {
    try {
      const retailersData = await RetailerService.getRetailers();
      setRetailers(retailersData);
    } catch (error) {
      console.error('Error loading retailers:', error);
      toast({
        title: "Error",
        description: "Failed to load retailers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRetailers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Retailer name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingId) {
        // Update existing retailer
        await RetailerService.updateRetailer(editingId, formData);
        toast({
          title: "Success",
          description: "Retailer updated successfully",
        });
      } else {
        // Create new retailer
        await RetailerService.createRetailer(formData);
        toast({
          title: "Success",
          description: "Retailer created successfully",
        });
      }
      
      await loadRetailers();
      resetForm();
    } catch (error) {
      console.error('Error saving retailer:', error);
      toast({
        title: "Error",
        description: "Failed to save retailer",
        variant: "destructive",
      });
    }
  };

  // Handle edit
  const handleEdit = (retailer: Retailer) => {
    setFormData({
      name: retailer.name,
      website_url: retailer.website_url || '',
      logo_url: retailer.logo_url || '',
      is_active: retailer.is_active,
      display_order: retailer.display_order
    });
    setEditingId(retailer.id);
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this retailer?")) {
      try {
        await RetailerService.deleteRetailer(id);
        toast({
          title: "Success",
          description: "Retailer deleted successfully",
        });
        await loadRetailers();
      } catch (error) {
        console.error('Error deleting retailer:', error);
        toast({
          title: "Error",
          description: "Failed to delete retailer",
          variant: "destructive",
        });
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      website_url: '',
      logo_url: '',
      is_active: true,
      display_order: 0
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading retailers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Retailer Management</CardTitle>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Retailer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Display Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {retailers.map((retailer) => (
                <TableRow key={retailer.id}>
                  <TableCell className="font-medium">{retailer.name}</TableCell>
                  <TableCell>
                    {retailer.website_url ? (
                      <a
                        href={retailer.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        Visit <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-gray-400">No website</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={retailer.is_active ? "default" : "secondary"}>
                      {retailer.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{retailer.display_order}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(retailer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(retailer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Edit Retailer' : 'Add New Retailer'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Retailer Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter retailer name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Update' : 'Create'} Retailer
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
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
