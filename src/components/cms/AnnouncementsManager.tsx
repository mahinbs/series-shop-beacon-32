import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, X } from 'lucide-react';
import { useAnnouncements, type Announcement } from '@/hooks/useAnnouncements';
import { toast } from 'sonner';

interface AnnouncementForm {
  title: string;
  description: string;
  full_description: string;
  date_info: string;
  image_url: string;
  status: string;
  features: string[];
  badge_type?: 'hot' | 'new' | 'limited';
  display_order: number;
  is_active: boolean;
}

const AnnouncementsManager = () => {
  const { announcements, isLoading, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncements();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  
  const [formData, setFormData] = useState<AnnouncementForm>({
    title: '',
    description: '',
    full_description: '',
    date_info: '',
    image_url: '',
    status: '',
    features: [],
    badge_type: undefined,
    display_order: 0,
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      full_description: '',
      date_info: '',
      image_url: '',
      status: '',
      features: [],
      badge_type: undefined,
      display_order: 0,
      is_active: true
    });
    setEditingId(null);
    setShowAddForm(false);
    setNewFeature('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAnnouncement(editingId, formData);
        toast.success('Announcement updated successfully');
      } else {
        await createAnnouncement(formData);
        toast.success('Announcement created successfully');
      }
      resetForm();
    } catch (error) {
      toast.error('Failed to save announcement');
      console.error('Error saving announcement:', error);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      description: announcement.description,
      full_description: announcement.full_description,
      date_info: announcement.date_info,
      image_url: announcement.image_url,
      status: announcement.status,
      features: announcement.features,
      badge_type: announcement.badge_type,
      display_order: announcement.display_order,
      is_active: announcement.is_active
    });
    setEditingId(announcement.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteAnnouncement(id);
        toast.success('Announcement deleted successfully');
      } catch (error) {
        toast.error('Failed to delete announcement');
      }
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-48">Loading announcements...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Announcements</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Announcement
        </Button>
      </div>

      {/* Existing Announcements */}
      <div className="grid gap-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">{announcement.title}</CardTitle>
              <div className="flex items-center gap-2">
                {announcement.badge_type && (
                  <Badge variant={announcement.badge_type === 'hot' ? 'destructive' : 'default'}>
                    {announcement.badge_type.toUpperCase()}
                  </Badge>
                )}
                <Button variant="outline" size="sm" onClick={() => handleEdit(announcement)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(announcement.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Status:</strong> {announcement.status}
                </div>
                <div>
                  <strong>Date:</strong> {announcement.date_info}
                </div>
                <div>
                  <strong>Order:</strong> {announcement.display_order}
                </div>
                <div>
                  <strong>Active:</strong> {announcement.is_active ? 'Yes' : 'No'}
                </div>
              </div>
              <p className="mt-2 text-gray-600">{announcement.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>
              {editingId ? 'Edit Announcement' : 'Add New Announcement'}
              <Button variant="ghost" size="sm" className="ml-auto" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date_info">Date Info</Label>
                  <Input
                    id="date_info"
                    value={formData.date_info}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_info: e.target.value }))}
                    placeholder="e.g., Coming March 2024"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="full_description">Full Description</Label>
                <Textarea
                  id="full_description"
                  value={formData.full_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    placeholder="e.g., Pre-order starting soon"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="badge_type">Badge Type</Label>
                  <Select 
                    value={formData.badge_type || 'none'} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, badge_type: value === 'none' ? undefined : value as 'hot' | 'new' | 'limited' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select badge type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="hot">Hot</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              {/* Features */}
              <div>
                <Label>Features</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add feature"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeFeature(index)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Update' : 'Create'} Announcement
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

export default AnnouncementsManager;
