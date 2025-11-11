import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Calendar, Hash, X } from 'lucide-react';
import { announcementSectionsService, type ReleaseScheduleItem } from '@/services/announcementSectionsService';
import { useEffect } from 'react';

interface ReleaseScheduleProps {
  limit?: number;
}

export const ReleaseSchedule = ({ limit }: ReleaseScheduleProps) => {
  const [releases, setReleases] = useState<ReleaseScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRelease, setSelectedRelease] = useState<ReleaseScheduleItem | null>(null);

  useEffect(() => {
    const loadReleases = async () => {
      try {
        const releasesData = await announcementSectionsService.getReleases();
        setReleases(limit ? releasesData.slice(0, limit) : releasesData);
      } catch (error) {
        console.error('Error loading releases:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReleases();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
        <div className="text-gray-400">Loading releases...</div>
      </div>
    );
  }

  if (releases.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No upcoming releases scheduled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {releases.map((release) => (
        <Card key={release.id} className="bg-gray-800 border-gray-700 hover:border-red-500/50 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="flex items-center gap-1 bg-red-600/20 text-red-400 border-red-600">
                    <Calendar className="h-3 w-3" />
                    {new Date(release.release_date).toLocaleDateString()}
                  </Badge>
                  <span className="text-xs text-gray-400 uppercase tracking-wide">{release.release_type}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{release.title}</h3>
                {release.description && (
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{release.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  {release.series_name && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{release.series_name}</span>
                    </div>
                  )}
                  {release.volume_number && (
                    <div className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      <span>Vol. {release.volume_number}</span>
                    </div>
                  )}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-600 text-red-400 hover:bg-red-600/10"
                    onClick={() => setSelectedRelease(release)}
                  >
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-red-400" />
                      {selectedRelease?.title}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="outline" className="bg-red-600/20 text-red-400 border-red-600">
                        {selectedRelease?.release_type}
                      </Badge>
                      <span className="text-gray-400">
                        {selectedRelease && new Date(selectedRelease.release_date).toLocaleDateString()}
                      </span>
                    </div>
                    {selectedRelease?.description && (
                      <p className="text-gray-300">{selectedRelease.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      {selectedRelease?.series_name && (
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>{selectedRelease.series_name}</span>
                        </div>
                      )}
                      {selectedRelease?.volume_number && (
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          <span>Volume {selectedRelease.volume_number}</span>
                        </div>
                      )}
                    </div>
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
