import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { DigitalReaderService } from '@/services/digitalReaderService';

const DigitalReader = () => {
  const { seriesTitle } = useParams();
  const navigate = useNavigate();
  const [spec, setSpec] = useState<any | null>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load spec and episodes
  useEffect(() => {
    const load = async () => {
      if (!seriesTitle) {
        setError('No series specified');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const specData = await DigitalReaderService.getSpecBySlug(seriesTitle);
        setSpec(specData);
        const eps = await DigitalReaderService.getEpisodes(specData.id);
        setEpisodes(eps);
        const subs = await DigitalReaderService.getSubscriberCount(specData.id);
        setSubscriberCount(subs);
      } catch (e) {
        console.error(e);
        setError('Failed to load series data');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [seriesTitle]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  if (error || !spec) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Series not found</h1>
          <p className="text-muted-foreground mb-4">{error || 'The requested series could not be found.'}</p>
          <Button onClick={() => navigate('/our-series')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Series
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/our-series')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">{spec.title}</h1>
                <p className="text-sm text-muted-foreground">by {spec.creator}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{subscriberCount} subscribers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Series Info */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-6">
            {spec.cover_image_url && (
              <img
                src={spec.cover_image_url}
                alt={spec.title}
                className="w-16 h-20 object-cover rounded-md"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <Badge variant="outline">{spec.age_rating}</Badge>
                {Array.isArray(spec.genre) && spec.genre.map((g: string) => (
                  <Badge key={g} variant="outline" className="text-xs">{g}</Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{spec.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes List */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {episodes.map((ep) => {
            const isFree = ep.is_free || (ep.chapter_number <= (spec.free_chapters_count || 0));
            return (
              <div key={ep.id} className="flex items-center justify-between p-4 rounded-lg bg-card border">
                <div className="flex items-center gap-4">
                  <img src={ep.cover_image_url || spec.cover_image_url || '/placeholder.svg'} alt={ep.title} className="w-16 h-20 object-cover rounded" />
                  <div>
                    <div className="font-semibold">Episode {ep.chapter_number}: {ep.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(ep.updated_at).toLocaleDateString()}</span>
                      {!isFree && (
                        <span className="inline-flex items-center gap-1 text-amber-400">
                          <Lock className="w-3 h-3" /> {ep.coin_cost || spec.coin_per_locked} coins
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => navigate(`/episode/${ep.id}`)}>{isFree ? 'Read' : 'Unlock & Read'}</Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DigitalReader;