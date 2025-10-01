import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ArrowLeft, Heart, Diamond, Clover, Spade } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnnouncements } from '@/hooks/useAnnouncements';

const AnnouncementDetail = () => {
  const { id } = useParams();
  const { announcements, isLoading, error } = useAnnouncements();

  // Function to get symbol and color based on category
  const getCategorySymbol = (category: string | undefined | null) => {
    if (!category) {
      return { icon: Heart, color: 'text-red-500', bgColor: 'bg-red-100', label: 'General' };
    }
    
    switch (category.toLowerCase()) {
      case 'licensing':
        return { icon: Heart, color: 'text-red-500', bgColor: 'bg-red-100', label: 'New Series' };
      case 'reprints':
      case 'limited':
        return { icon: Diamond, color: 'text-blue-500', bgColor: 'bg-blue-100', label: 'Limited Edition' };
      case 'volume':
        return { icon: Clover, color: 'text-green-500', bgColor: 'bg-green-100', label: 'New Volume' };
      case 'events':
      case 'features':
        return { icon: Spade, color: 'text-purple-500', bgColor: 'bg-purple-100', label: 'Events' };
      default:
        return { icon: Heart, color: 'text-red-500', bgColor: 'bg-red-100', label: category };
    }
  };

  // Find the announcement by ID
  const announcement = announcements.find(ann => ann.id === id);

  // Get related announcements (other active announcements, excluding current one)
  const relatedAnnouncements = announcements
    .filter(ann => ann.id !== id && ann.is_active)
    .slice(0, 2);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-lg text-muted-foreground">Loading announcement...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-lg text-red-500">Error loading announcement: {error}</div>
            <Link to="/announcements">
              <Button variant="outline" className="mt-4">
                Back to Announcements
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!announcement) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-lg text-muted-foreground">Announcement not found</div>
            <Link to="/announcements">
              <Button variant="outline" className="mt-4">
                Back to Announcements
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link to="/announcements">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Announcements
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Hero Image */}
          <div className="relative mb-8">
            <div className="aspect-[16/9] overflow-hidden rounded-lg">
              <img 
                src={announcement.image_url} 
                alt={announcement.title}
                className="w-full h-full object-cover"
              />
            </div>
            {announcement.badge_type && (
              <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                {announcement.badge_type.toUpperCase()}
              </Badge>
            )}
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                {(() => {
                  const symbolData = getCategorySymbol(announcement.status);
                  const IconComponent = symbolData.icon;
                  return (
                    <div className={`w-8 h-8 ${symbolData.bgColor} rounded-full flex items-center justify-center`}>
                      <IconComponent className={`w-4 h-4 ${symbolData.color}`} />
                    </div>
                  );
                })()}
                <Badge variant="secondary">{getCategorySymbol(announcement.status).label}</Badge>
              </div>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {announcement.created_at ? new Date(announcement.created_at).toLocaleDateString() : 'No date'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {announcement.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              {announcement.description}
            </p>
          </div>

          {/* Article Content */}
          <Card className="mb-12">
            <CardContent className="p-6 md:p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {announcement.full_description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Related Announcements */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Announcements</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedAnnouncements.map((related) => (
                <Link key={related.id} to={`/announcement/${related.id}`}>
                  <Card className="overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={related.image_url} 
                          alt={related.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {(() => {
                          const symbolData = getCategorySymbol(related.status);
                          const IconComponent = symbolData.icon;
                          return (
                            <div className={`w-6 h-6 ${symbolData.bgColor} rounded-full flex items-center justify-center`}>
                              <IconComponent className={`w-3 h-3 ${symbolData.color}`} />
                            </div>
                          );
                        })()}
                        <Badge variant="secondary" className="text-xs">
                          {getCategorySymbol(related.status).label}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {related.description}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {related.created_at ? new Date(related.created_at).toLocaleDateString() : 'No date'}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AnnouncementDetail;