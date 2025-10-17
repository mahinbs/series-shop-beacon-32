import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { announcementSectionsService, type EventCalendarItem } from '@/services/announcementSectionsService';
import { useEffect } from 'react';

interface EventCalendarProps {
  limit?: number;
}

export const EventCalendar = ({ limit }: EventCalendarProps) => {
  const [events, setEvents] = useState<EventCalendarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventCalendarItem | null>(null);

  const loadEvents = async () => {
    try {
      const eventsData = await announcementSectionsService.getEvents();
      setEvents(limit ? eventsData.slice(0, limit) : eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
        <div className="text-gray-400">Loading events...</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No upcoming events scheduled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
      </div>
      {events.map((event) => (
        <Card key={event.id} className="bg-gray-800 border-gray-700 hover:border-red-500/50 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="flex items-center gap-1 bg-red-600/20 text-red-400 border-red-600">
                    <Calendar className="h-3 w-3" />
                    {new Date(event.event_date).toLocaleDateString()}
                  </Badge>
                  <span className="text-xs text-gray-400 uppercase tracking-wide">{event.event_type}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{event.title}</h3>
                {event.description && (
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{event.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(event.event_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-600 text-red-400 hover:bg-red-600/10"
                    onClick={() => setSelectedEvent(event)}
                  >
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-red-400" />
                      {selectedEvent?.title}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="outline" className="bg-red-600/20 text-red-400 border-red-600">
                        {selectedEvent?.event_type}
                      </Badge>
                      <span className="text-gray-400">
                        {selectedEvent && new Date(selectedEvent.event_date).toLocaleDateString()}
                      </span>
                    </div>
                    {selectedEvent?.description && (
                      <p className="text-gray-300">{selectedEvent.description}</p>
                    )}
                    {selectedEvent?.location && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedEvent.location}</span>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
