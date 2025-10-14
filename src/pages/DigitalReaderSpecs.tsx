import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { DigitalReaderService, type DigitalReaderSpec } from '@/services/digitalReaderService';

const DigitalReaderSpecs = () => {
  const navigate = useNavigate();
  const [specs, setSpecs] = useState<DigitalReaderSpec[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, { episodes: number; latest: string | null }>>({});

  useEffect(() => { loadSpecs(); }, []);

  const loadSpecs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await DigitalReaderService.getSpecs();
      setSpecs(data as any);
      // parallel fetch counts/last-updated
      const entries: Record<string, { episodes: number; latest: string | null }> = {};
      await Promise.all(
        data.map(async (s: any) => {
          const [n, latest] = await Promise.all([
            DigitalReaderService.getEpisodesCount(s.id),
            DigitalReaderService.getLatestEpisodeUpdate(s.id)
          ]);
          entries[s.id] = { episodes: n, latest };
        })
      );
      setCounts(entries);
    } catch (e) {
      setError('Failed to load specifications');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/')} variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-white">Digital Reader</h1>
          </div>
          <Button onClick={loadSpecs} variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="text-center text-red-400 mb-6">{error}</div>
        )}

        {isLoading ? (
          <div className="text-center text-gray-400">Loading…</div>
        ) : (
          <div className="grid gap-6">
            {specs.map((spec: any) => (
              <Card key={spec.id} className="bg-gray-800 border-gray-700 cursor-pointer" onClick={() => navigate(`/digital-reader/${spec.id}`)}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <img src={spec.cover_image_url || '/placeholder.svg'} alt={spec.title} className="w-28 h-40 object-cover rounded" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-semibold text-white">{spec.title}</h3>
                          {spec.status && <Badge variant={spec.status === 'ongoing' ? 'default' : 'secondary'}>{spec.status}</Badge>}
                        </div>
                        <div className="text-sm text-gray-300 mb-2">by {spec.artist || spec.creator}</div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {Array.isArray(spec.genre) && spec.genre.map((g: string) => (
                            <Badge key={g} variant="outline" className="text-xs">{g}</Badge>
                          ))}
                        </div>
                        {spec.description && (
                          <p className="text-gray-300 text-sm line-clamp-3">{spec.description}</p>
                        )}
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Episodes</div>
                        <div className="text-white font-semibold">{counts[spec.id]?.episodes ?? 0}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Last Updated</div>
                        <div className="text-white font-semibold">{formatDate(counts[spec.id]?.latest)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DigitalReaderSpecs;
