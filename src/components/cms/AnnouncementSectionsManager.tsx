import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Calendar,
  BookOpen,
  HelpCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  announcementSectionsService, 
  type EventCalendarItem, 
  type ReleaseScheduleItem, 
  type FAQItem,
  type CreateEventData,
  type CreateReleaseData,
  type CreateFAQData
} from '@/services/announcementSectionsService';

export const AnnouncementSectionsManager = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'releases' | 'faq'>('events');
  const [events, setEvents] = useState<EventCalendarItem[]>([]);
  const [releases, setReleases] = useState<ReleaseScheduleItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  // Form data for events
  const [eventFormData, setEventFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    event_date: '',
    location: '',
    event_type: 'event',
    display_order: 0
  });
  
  // Form data for releases
  const [releaseFormData, setReleaseFormData] = useState<CreateReleaseData>({
    title: '',
    description: '',
    release_date: '',
    series_name: '',
    volume_number: 0,
    release_type: 'volume',
    display_order: 0
  });
  
  // Form data for FAQs
  const [faqFormData, setFaqFormData] = useState<CreateFAQData>({
    question: '',
    answer: '',
    category: 'general',
    display_order: 0
  });

  const { toast } = useToast();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [eventsData, releasesData, faqsData] = await Promise.all([
        announcementSectionsService.getEvents(),
        announcementSectionsService.getReleases(),
        announcementSectionsService.getFAQs()
      ]);
      
      setEvents(eventsData);
      setReleases(releasesData);
      setFaqs(faqsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetEventForm = () => {
    setEventFormData({
      title: '',
      description: '',
      event_date: '',
      location: '',
      event_type: 'event',
      display_order: events.length
    });
    setEditingIndex(null);
    setShowAddForm(false);
  };

  const resetReleaseForm = () => {
    setReleaseFormData({
      title: '',
      description: '',
      release_date: '',
      series_name: '',
      volume_number: 0,
      release_type: 'volume',
      display_order: releases.length
    });
    setEditingIndex(null);
    setShowAddForm(false);
  };

  const resetFaqForm = () => {
    setFaqFormData({
      question: '',
      answer: '',
      category: 'general',
      display_order: faqs.length
    });
    setEditingIndex(null);
    setShowAddForm(false);
  };

  // Event handlers
  const handleAddEvent = async () => {
    if (!eventFormData.title.trim() || !eventFormData.event_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const newEvent = await announcementSectionsService.createEvent(eventFormData);
      if (newEvent) {
        setEvents(prev => [...prev, newEvent]);
        resetEventForm();
        toast({
          title: "Success",
          description: "Event added successfully",
        });
      } else {
        throw new Error("Failed to create event");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add event",
        variant: "destructive"
      });
    }
  };

  const handleEditEvent = (index: number) => {
    const event = events[index];
    setEventFormData({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date,
      location: event.location || '',
      event_type: event.event_type,
      display_order: event.display_order
    });
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleUpdateEvent = async () => {
    if (editingIndex === null || !eventFormData.title.trim() || !eventFormData.event_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const eventToUpdate = events[editingIndex];
      const updatedEvent = await announcementSectionsService.updateEvent(eventToUpdate.id, eventFormData);
      
      if (updatedEvent) {
        setEvents(prev => {
          const updated = [...prev];
          updated[editingIndex] = updatedEvent;
          return updated;
        });
        resetEventForm();
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
      } else {
        throw new Error("Failed to update event");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update event",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEvent = async (index: number) => {
    try {
      const eventToDelete = events[index];
      const success = await announcementSectionsService.deleteEvent(eventToDelete.id);
      
      if (success) {
        setEvents(prev => prev.filter((_, i) => i !== index));
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive"
      });
    }
  };

  // Similar handlers for releases and FAQs...
  const handleAddRelease = async () => {
    if (!releaseFormData.title.trim() || !releaseFormData.release_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const newRelease = await announcementSectionsService.createRelease(releaseFormData);
      if (newRelease) {
        setReleases(prev => [...prev, newRelease]);
        resetReleaseForm();
        toast({
          title: "Success",
          description: "Release added successfully",
        });
      } else {
        throw new Error("Failed to create release");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add release",
        variant: "destructive"
      });
    }
  };

  const handleEditRelease = (index: number) => {
    const release = releases[index];
    setReleaseFormData({
      title: release.title,
      description: release.description || '',
      release_date: release.release_date,
      series_name: release.series_name || '',
      volume_number: release.volume_number || 0,
      release_type: release.release_type,
      display_order: release.display_order
    });
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleUpdateRelease = async () => {
    if (editingIndex === null || !releaseFormData.title.trim() || !releaseFormData.release_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const releaseToUpdate = releases[editingIndex];
      const updatedRelease = await announcementSectionsService.updateRelease(releaseToUpdate.id, releaseFormData);
      
      if (updatedRelease) {
        setReleases(prev => {
          const updated = [...prev];
          updated[editingIndex] = updatedRelease;
          return updated;
        });
        resetReleaseForm();
        toast({
          title: "Success",
          description: "Release updated successfully",
        });
      } else {
        throw new Error("Failed to update release");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update release",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRelease = async (index: number) => {
    try {
      const releaseToDelete = releases[index];
      const success = await announcementSectionsService.deleteRelease(releaseToDelete.id);
      
      if (success) {
        setReleases(prev => prev.filter((_, i) => i !== index));
        toast({
          title: "Success",
          description: "Release deleted successfully",
        });
      } else {
        throw new Error("Failed to delete release");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete release",
        variant: "destructive"
      });
    }
  };

  const handleAddFAQ = async () => {
    if (!faqFormData.question.trim() || !faqFormData.answer.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const newFAQ = await announcementSectionsService.createFAQ(faqFormData);
      if (newFAQ) {
        setFaqs(prev => [...prev, newFAQ]);
        resetFaqForm();
        toast({
          title: "Success",
          description: "FAQ added successfully",
        });
      } else {
        throw new Error("Failed to create FAQ");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add FAQ",
        variant: "destructive"
      });
    }
  };

  const handleEditFAQ = (index: number) => {
    const faq = faqs[index];
    setFaqFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      display_order: faq.display_order
    });
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleUpdateFAQ = async () => {
    if (editingIndex === null || !faqFormData.question.trim() || !faqFormData.answer.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const faqToUpdate = faqs[editingIndex];
      const updatedFAQ = await announcementSectionsService.updateFAQ(faqToUpdate.id, faqFormData);
      
      if (updatedFAQ) {
        setFaqs(prev => {
          const updated = [...prev];
          updated[editingIndex] = updatedFAQ;
          return updated;
        });
        resetFaqForm();
        toast({
          title: "Success",
          description: "FAQ updated successfully",
        });
      } else {
        throw new Error("Failed to update FAQ");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update FAQ",
        variant: "destructive"
      });
    }
  };

  const handleDeleteFAQ = async (index: number) => {
    try {
      const faqToDelete = faqs[index];
      const success = await announcementSectionsService.deleteFAQ(faqToDelete.id);
      
      if (success) {
        setFaqs(prev => prev.filter((_, i) => i !== index));
        toast({
          title: "Success",
          description: "FAQ deleted successfully",
        });
      } else {
        throw new Error("Failed to delete FAQ");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete FAQ",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-muted-foreground">Loading announcement sections...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Announcement Page Sections</h3>
          <p className="text-sm text-muted-foreground">
            Manage Event Calendar, Release Schedule, and FAQ sections
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <Button
          variant={activeTab === 'events' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('events')}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Event Calendar
        </Button>
        <Button
          variant={activeTab === 'releases' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('releases')}
          className="flex items-center gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Release Schedule
        </Button>
        <Button
          variant={activeTab === 'faq' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('faq')}
          className="flex items-center gap-2"
        >
          <HelpCircle className="h-4 w-4" />
          FAQ
        </Button>
      </div>

      {/* Event Calendar Tab */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Event Calendar ({events.length})</h4>
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>

          {/* Add/Edit Event Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{editingIndex !== null ? 'Edit Event' : 'Add New Event'}</span>
                  <Button variant="ghost" size="sm" onClick={resetEventForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">Event Title *</Label>
                    <Input
                      id="event-title"
                      value={eventFormData.title}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Event Date *</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={eventFormData.event_date}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, event_date: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea
                    id="event-description"
                    value={eventFormData.description}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter event description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-location">Location</Label>
                    <Input
                      id="event-location"
                      value={eventFormData.location}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter event location"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-type">Event Type</Label>
                    <Input
                      id="event-type"
                      value={eventFormData.event_type}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, event_type: e.target.value }))}
                      placeholder="e.g., festival, meetup, awards"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={editingIndex !== null ? handleUpdateEvent : handleAddEvent}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {editingIndex !== null ? 'Update Event' : 'Add Event'}
                  </Button>
                  <Button variant="outline" onClick={resetEventForm}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Events List */}
          <div className="space-y-4">
            {events.map((event, index) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.event_date).toLocaleDateString()}
                        </Badge>
                        <h4 className="font-medium">{event.title}</h4>
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      )}
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        {event.location && <span>📍 {event.location}</span>}
                        <span>🏷️ {event.event_type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditEvent(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEvent(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Release Schedule Tab */}
      {activeTab === 'releases' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Release Schedule ({releases.length})</h4>
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Release
            </Button>
          </div>

          {/* Add/Edit Release Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{editingIndex !== null ? 'Edit Release' : 'Add New Release'}</span>
                  <Button variant="ghost" size="sm" onClick={resetReleaseForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="release-title">Release Title *</Label>
                    <Input
                      id="release-title"
                      value={releaseFormData.title}
                      onChange={(e) => setReleaseFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter release title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="release-date">Release Date *</Label>
                    <Input
                      id="release-date"
                      type="date"
                      value={releaseFormData.release_date}
                      onChange={(e) => setReleaseFormData(prev => ({ ...prev, release_date: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="release-description">Description</Label>
                  <Textarea
                    id="release-description"
                    value={releaseFormData.description}
                    onChange={(e) => setReleaseFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter release description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="series-name">Series Name</Label>
                    <Input
                      id="series-name"
                      value={releaseFormData.series_name}
                      onChange={(e) => setReleaseFormData(prev => ({ ...prev, series_name: e.target.value }))}
                      placeholder="Enter series name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volume-number">Volume Number</Label>
                    <Input
                      id="volume-number"
                      type="number"
                      value={releaseFormData.volume_number}
                      onChange={(e) => setReleaseFormData(prev => ({ ...prev, volume_number: parseInt(e.target.value) || 0 }))}
                      placeholder="Volume number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="release-type">Release Type</Label>
                    <Input
                      id="release-type"
                      value={releaseFormData.release_type}
                      onChange={(e) => setReleaseFormData(prev => ({ ...prev, release_type: e.target.value }))}
                      placeholder="e.g., volume, special, anniversary"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={editingIndex !== null ? handleUpdateRelease : handleAddRelease}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {editingIndex !== null ? 'Update Release' : 'Add Release'}
                  </Button>
                  <Button variant="outline" onClick={resetReleaseForm}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Releases List */}
          <div className="space-y-4">
            {releases.map((release, index) => (
              <Card key={release.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {new Date(release.release_date).toLocaleDateString()}
                        </Badge>
                        <h4 className="font-medium">{release.title}</h4>
                      </div>
                      {release.description && (
                        <p className="text-sm text-muted-foreground mb-2">{release.description}</p>
                      )}
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        {release.series_name && <span>📚 {release.series_name}</span>}
                        {release.volume_number && <span>Vol. {release.volume_number}</span>}
                        <span>🏷️ {release.release_type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRelease(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRelease(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">FAQ ({faqs.length})</h4>
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add FAQ
            </Button>
          </div>

          {/* Add/Edit FAQ Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{editingIndex !== null ? 'Edit FAQ' : 'Add New FAQ'}</span>
                  <Button variant="ghost" size="sm" onClick={resetFaqForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="faq-question">Question *</Label>
                  <Input
                    id="faq-question"
                    value={faqFormData.question}
                    onChange={(e) => setFaqFormData(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Enter FAQ question"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="faq-answer">Answer *</Label>
                  <Textarea
                    id="faq-answer"
                    value={faqFormData.answer}
                    onChange={(e) => setFaqFormData(prev => ({ ...prev, answer: e.target.value }))}
                    placeholder="Enter FAQ answer"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="faq-category">Category</Label>
                  <Input
                    id="faq-category"
                    value={faqFormData.category}
                    onChange={(e) => setFaqFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., general, support, orders, payment"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={editingIndex !== null ? handleUpdateFAQ : handleAddFAQ}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {editingIndex !== null ? 'Update FAQ' : 'Add FAQ'}
                  </Button>
                  <Button variant="outline" onClick={resetFaqForm}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* FAQs List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={faq.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <HelpCircle className="h-3 w-3" />
                          {faq.category}
                        </Badge>
                        <h4 className="font-medium">{faq.question}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditFAQ(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFAQ(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementSectionsManager;
