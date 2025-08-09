import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Share2, Bookmark, ArrowLeft, Heart, Diamond, Clover, Spade } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const AnnouncementDetail = () => {
  const { id } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Function to get symbol and color based on category
  const getCategorySymbol = (category: string) => {
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

  // Mock announcement data (in a real app, this would be fetched based on the ID)
  const announcement = {
    id: parseInt(id || '1'),
    title: "Summer Manga Festival 2025",
    description: "Join us for the biggest manga event of the summer! Over 100 new series, get exclusive merchandise and meet your favorite authors.",
    content: `
      <p>We are thrilled to announce the Summer Manga Festival 2025, the most anticipated manga event of the year! This extraordinary celebration will bring together manga enthusiasts, creators, and industry professionals from around the world.</p>
      
      <h3>What to Expect</h3>
      <ul>
        <li>Over 100 new manga series premieres</li>
        <li>Exclusive merchandise and limited edition releases</li>
        <li>Meet and greet sessions with your favorite authors</li>
        <li>Interactive workshops and drawing sessions</li>
        <li>Special panel discussions about the future of manga</li>
      </ul>
      
      <h3>Featured Authors</h3>
      <p>This year's festival will feature appearances from some of the most celebrated manga creators, including exclusive interviews and signing sessions. Don't miss the opportunity to learn about their creative process and get insights into upcoming projects.</p>
      
      <h3>Special Events</h3>
      <ul>
        <li>Opening ceremony with special guest performances</li>
        <li>Cosplay competition with amazing prizes</li>
        <li>Art exhibition showcasing original manga artwork</li>
        <li>Digital manga reading experience demos</li>
      </ul>
      
      <h3>How to Participate</h3>
      <p>Registration opens next week! Early bird tickets will be available at a special discounted price. Stay tuned to our social media channels and newsletter for the latest updates and exclusive offers.</p>
      
      <p>This is more than just an event - it's a celebration of the art form that has captured hearts worldwide. Whether you're a longtime fan or new to manga, there's something for everyone at the Summer Manga Festival 2025.</p>
    `,
    image: "/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png",
    date: "Jul 3, 2025",
    category: "Events",
    isHot: true,
    author: "Crossed Hearts Team",
    readTime: "5 min read"
  };

  const relatedAnnouncements = [
    {
      id: 2,
      title: "New Demon Slayer Volume Release",
      description: "The highly anticipated new volume of Demon Slayer is finally available for pre-order.",
      image: "/lovable-uploads/26efc76c-fa83-4369-8d8d-354eab1433e6.png",
      date: "Jul 5, 2025",
      category: "Licensing"
    },
    {
      id: 3,
      title: "Naruto Masterpiece Reprint",
      description: "Our one-of-a-kind signature series is back! Get limited 200 ANNIVERSARY Inking.",
      image: "/lovable-uploads/503cc23b-a28f-4564-86f9-53896fa75f10.png",
      date: "Jul 6, 2025",
      category: "Reprints"
    }
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: announcement.title,
        text: announcement.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

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
            <img 
              src={announcement.image} 
              alt={announcement.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
            {announcement.isHot && (
              <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                HOT
              </Badge>
            )}
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                {(() => {
                  const symbolData = getCategorySymbol(announcement.category);
                  const IconComponent = symbolData.icon;
                  return (
                    <div className={`w-8 h-8 ${symbolData.bgColor} rounded-full flex items-center justify-center`}>
                      <IconComponent className={`w-4 h-4 ${symbolData.color}`} />
                    </div>
                  );
                })()}
                <Badge variant="secondary">{getCategorySymbol(announcement.category).label}</Badge>
              </div>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {announcement.date}
              </span>
              <span className="text-sm text-muted-foreground">
                {announcement.readTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {announcement.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              {announcement.description}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="gap-2"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <Card className="mb-12">
            <CardContent className="p-6 md:p-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: announcement.content }}
              />
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
                      <img 
                        src={related.image} 
                        alt={related.title}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {(() => {
                          const symbolData = getCategorySymbol(related.category);
                          const IconComponent = symbolData.icon;
                          return (
                            <div className={`w-6 h-6 ${symbolData.bgColor} rounded-full flex items-center justify-center`}>
                              <IconComponent className={`w-3 h-3 ${symbolData.color}`} />
                            </div>
                          );
                        })()}
                        <Badge variant="secondary" className="text-xs">
                          {getCategorySymbol(related.category).label}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {related.description}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {related.date}
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