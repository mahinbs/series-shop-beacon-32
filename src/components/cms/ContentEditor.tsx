import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCMS } from '@/hooks/useCMS';
import { useToast } from '@/hooks/use-toast';
import { Save, Edit3 } from 'lucide-react';

interface ContentEditorProps {
  pageName: string;
  sectionName: string;
  initialContent: any;
}

export const ContentEditor = ({ pageName, sectionName, initialContent }: ContentEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const { updateSectionContent } = useCMS();
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSectionContent(pageName, sectionName, content);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Content updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update content',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(initialContent);
    setIsEditing(false);
  };

  const updateField = (field: string, value: any) => {
    setContent((prev: any) => ({ ...prev, [field]: value }));
  };

  const renderContentFields = () => {
    if (!content || typeof content !== 'object') {
      return (
        <div className="space-y-4">
          <Label>Content (JSON)</Label>
          <Textarea
            value={typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setContent(parsed);
              } catch {
                setContent(e.target.value);
              }
            }}
            rows={10}
            disabled={!isEditing}
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {Object.entries(content).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <Label className="capitalize">{key.replace(/_/g, ' ')}</Label>
            {typeof value === 'string' ? (
              value.length > 100 ? (
                <Textarea
                  value={value}
                  onChange={(e) => updateField(key, e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                />
              ) : (
                <Input
                  value={value}
                  onChange={(e) => updateField(key, e.target.value)}
                  disabled={!isEditing}
                />
              )
            ) : Array.isArray(value) ? (
              <Textarea
                value={JSON.stringify(value, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateField(key, parsed);
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                disabled={!isEditing}
                rows={6}
              />
            ) : typeof value === 'object' ? (
              <Textarea
                value={JSON.stringify(value, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateField(key, parsed);
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                disabled={!isEditing}
                rows={8}
              />
            ) : (
              <Input
                value={String(value)}
                onChange={(e) => updateField(key, e.target.value)}
                disabled={!isEditing}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg capitalize">
          {sectionName.replace(/_/g, ' ')} Section
        </CardTitle>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {renderContentFields()}
      </CardContent>
    </Card>
  );
};