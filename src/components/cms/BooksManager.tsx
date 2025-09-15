import { useState, useRef } from 'react';
import { useBooks } from '@/hooks/useBooks';
import { BookCharacterService, BookCharacter } from '@/services/bookCharacterService';
import { testDatabaseConnection } from '@/services/database';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Save, Edit, Upload, BookOpen, Database, X, Users, User } from 'lucide-react';
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

interface CharacterForm {
  name: string;
  description: string;
  image_url: string;
  role: string;
  display_order: number;
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
  const [characters, setCharacters] = useState<BookCharacter[]>([]);
  const [originalCharacters, setOriginalCharacters] = useState<BookCharacter[]>([]);
  const [showCharacterForm, setShowCharacterForm] = useState(false);
  const [characterForm, setCharacterForm] = useState<CharacterForm>({
    name: '',
    description: '',
    image_url: '',
    role: 'main',
    display_order: 0,
  });
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
    setCharacters([]);
    setOriginalCharacters([]);
    setShowCharacterForm(false);
    setCharacterForm({
      name: '',
      description: '',
      image_url: '',
      role: 'main',
      display_order: 0,
    });
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

  const saveCharactersForBook = async (bookId: string) => {
    try {
      // Check authentication
      const { data: { session } } = await (supabase as any).auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save characters",
          variant: "destructive",
        });
        return false;
      }

      // Get current characters from database
      const currentDbCharacters = await BookCharacterService.getBookCharacters(bookId);
      
      // Find characters to create (temp IDs)
      const charactersToCreate = characters.filter(c => c.id.startsWith('temp_'));
      
      // Find characters to update (existing IDs that changed)
      const charactersToUpdate = characters.filter(c => 
        !c.id.startsWith('temp_') && 
        originalCharacters.some(orig => orig.id === c.id && JSON.stringify(orig) !== JSON.stringify(c))
      );
      
      // Find characters to delete (in original but not in current)
      const charactersToDelete = originalCharacters.filter(orig => 
        !characters.some(c => c.id === orig.id)
      );

      // Create new characters
      for (const character of charactersToCreate) {
        const { id, created_at, updated_at, ...characterData } = character;
        await BookCharacterService.createBookCharacter({
          ...characterData,
          book_id: bookId,
        });
      }

      // Update existing characters
      for (const character of charactersToUpdate) {
        const { created_at, updated_at, ...characterData } = character;
        await BookCharacterService.updateBookCharacter(character.id, characterData);
      }

      // Delete removed characters
      for (const character of charactersToDelete) {
        await BookCharacterService.deleteBookCharacter(character.id);
      }

      if (charactersToCreate.length > 0 || charactersToUpdate.length > 0 || charactersToDelete.length > 0) {
        toast({
          title: "Success",
          description: "Characters saved successfully",
        });
      }

      return true;
    } catch (error) {
      console.error('Error saving characters:', error);
      toast({
        title: "Error",
        description: "Failed to save characters",
        variant: "destructive",
      });
      return false;
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

      let bookId = editingId;
      
      if (editingId) {
        console.log('Updating book with ID:', editingId);
        await updateBook(editingId, formData);
        
        // Save characters for existing book
        const charactersSaved = await saveCharactersForBook(editingId);
        if (!charactersSaved) {
          return; // Don't reset form if characters failed to save
        }
        
        toast({
          title: "Success",
          description: "Book updated successfully",
        });
      } else {
        console.log('Creating new book');
        const createdBook = await createBook({
          ...formData,
          coins: formData.coins || '',
          label: formData.label || '',
          original_price: formData.original_price || null,
          description: '',
          dimensions: '',
          product_type: 'book',
          sku: null,
          stock_quantity: 0,
          weight: null,
          tags: [],
        });
        
        bookId = createdBook.id;
        
        // Save characters for new book
        if (characters.length > 0) {
          const charactersSaved = await saveCharactersForBook(bookId); 
          if (!charactersSaved) {
            return; // Don't reset form if characters failed to save
          }
        }
        
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

  const handleEdit = async (book: any) => {
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
    
    // Load existing characters for this book
    const bookCharacters = await BookCharacterService.getBookCharacters(book.id);
    setCharacters(bookCharacters);
    setOriginalCharacters([...bookCharacters]); // Deep copy for comparison
    
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

  const handleAddCharacter = async () => {
    if (!characterForm.name.trim()) {
      toast({
        title: "Error",
        description: "Character name is required",
        variant: "destructive",
      });
      return;
    }

    const newCharacter: BookCharacter = {
      id: `temp_${Date.now()}`, // Temporary ID with temp_ prefix
      book_id: editingId || '',
      name: characterForm.name,
      description: characterForm.description,
      image_url: characterForm.image_url,
      role: characterForm.role,
      display_order: characterForm.display_order,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // If editing an existing book, save immediately
    if (editingId) {
      try {
        const { data: { session } } = await (supabase as any).auth.getSession();
        if (!session) {
          toast({
            title: "Authentication Required",
            description: "Please sign in to save characters",
            variant: "destructive",
          });
          return;
        }

        const { id, created_at, updated_at, ...characterData } = newCharacter;
        const savedCharacter = await BookCharacterService.createBookCharacter({
          ...characterData,
          book_id: editingId,
        });

        if (savedCharacter) {
          setCharacters([...characters, savedCharacter]);
          toast({
            title: "Success",
            description: "Character added and saved",
          });
        }
      } catch (error) {
        console.error('Error saving character:', error);
        toast({
          title: "Error",
          description: "Failed to save character",
          variant: "destructive",
        });
        return;
      }
    } else {
      // For new books, just add to local state
      setCharacters([...characters, newCharacter]);
      toast({
        title: "Success",
        description: "Character added to book",
      });
    }

    setCharacterForm({
      name: '',
      description: '',
      image_url: '',
      role: 'main',
      display_order: characters.length,
    });
    setShowCharacterForm(false);
  };

  const handleRemoveCharacter = async (characterId: string) => {
    // If it's an existing character (has a real ID), delete from database
    if (!characterId.startsWith('temp_') && editingId) {
      try {
        const { data: { session } } = await (supabase as any).auth.getSession();
        if (!session) {
          toast({
            title: "Authentication Required",
            description: "Please sign in to delete characters",
            variant: "destructive",
          });
          return;
        }

        const success = await BookCharacterService.deleteBookCharacter(characterId);
        if (!success) {
          toast({
            title: "Error",
            description: "Failed to delete character",
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        console.error('Error deleting character:', error);
        toast({
          title: "Error",
          description: "Failed to delete character",
          variant: "destructive",
        });
        return;
      }
    }
    
    setCharacters(characters.filter(c => c.id !== characterId));
    toast({
      title: "Success",
      description: "Character removed from book",
    });
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
              onClick={() => {
                console.log('Add Book button clicked');
                setShowAddForm(true);
              }}
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
        <Card className="border-2 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-blue-600">{editingId ? 'Edit Book' : 'Add New Book'}</CardTitle>
              <p className="text-sm text-muted-foreground">Fill out the form below to add a new book</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetForm}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
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

              {/* Characters Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <Label className="text-lg font-semibold">Characters</Label>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCharacterForm(true)}
                    disabled={submitting}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Character
                  </Button>
                </div>

                {characters.length > 0 && (
                  <div className="grid gap-2">
                    {characters.map((character) => (
                      <div key={character.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {character.image_url ? (
                            <img src={character.image_url} alt={character.name} className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                              <User className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{character.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">{character.role}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveCharacter(character.id)}
                          disabled={submitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {showCharacterForm && (
                  <Card className="border-2 border-blue-200">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Add Character</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowCharacterForm(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="character_name">Name *</Label>
                          <Input
                            id="character_name"
                            value={characterForm.name}
                            onChange={(e) => setCharacterForm({ ...characterForm, name: e.target.value })}
                            disabled={submitting}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="character_role">Role</Label>
                          <Select
                            value={characterForm.role}
                            onValueChange={(value) => setCharacterForm({ ...characterForm, role: value })}
                            disabled={submitting}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="main">Main Character</SelectItem>
                              <SelectItem value="supporting">Supporting Character</SelectItem>
                              <SelectItem value="antagonist">Antagonist</SelectItem>
                              <SelectItem value="side">Side Character</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="character_description">Description</Label>
                        <Textarea
                          id="character_description"
                          value={characterForm.description}
                          onChange={(e) => setCharacterForm({ ...characterForm, description: e.target.value })}
                          disabled={submitting}
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="character_image">Character Image URL</Label>
                        <Input
                          id="character_image"
                          value={characterForm.image_url}
                          onChange={(e) => setCharacterForm({ ...characterForm, image_url: e.target.value })}
                          disabled={submitting}
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCharacterForm(false)}
                          disabled={submitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={handleAddCharacter}
                          disabled={submitting}
                        >
                          Add Character
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
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