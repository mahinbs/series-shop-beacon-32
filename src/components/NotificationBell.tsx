import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { Link } from 'react-router-dom';
import { Calendar, X } from 'lucide-react';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { announcements, isLoading } = useAnnouncements();
  
  // Get recent announcements (last 5, created within last 7 days)
  const recentAnnouncements = announcements
    .filter(announcement => {
      const announcementDate = new Date(announcement.created_at);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return announcement.is_active && announcementDate >= sevenDaysAgo;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const notificationCount = recentAnnouncements.length;

  return (
    <TooltipProvider>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-white relative"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="w-80 p-0" align="end">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading notifications...
                </div>
              ) : recentAnnouncements.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No new notifications
                </div>
              ) : (
                <ScrollArea className="h-80">
                  <div className="space-y-2 p-2">
                    {recentAnnouncements.map((announcement) => (
                      <Link
                        key={announcement.id}
                        to={`/announcement/${announcement.id}`}
                        onClick={() => setIsOpen(false)}
                        className="block"
                      >
                        <div className="p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Bell className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                                {announcement.title}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {announcement.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(announcement.created_at).toLocaleDateString()}
                                </span>
                                {announcement.badge_type && (
                                  <Badge 
                                    variant={announcement.badge_type === 'hot' ? 'destructive' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {announcement.badge_type.toUpperCase()}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </ScrollArea>
              )}
              {recentAnnouncements.length > 0 && (
                <div className="p-3 border-t">
                  <Link
                    to="/announcements"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center text-sm text-primary hover:underline"
                  >
                    View all announcements
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default NotificationBell;
