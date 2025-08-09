
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BookOpen, Calendar, Share2, Bookmark, ChevronLeft, ChevronRight, Bell, Heart, Diamond, Clover, Spade } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Announcements = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [contentFilter, setContentFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

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

  const featuredAnnouncements = [
    {
      id: 1,
      title: "Summer Manga Festival 2025",
      description: "Join us for the biggest manga event of the summer! Over 100 new series, get exclusive merchandise and meet your favorite authors.",
      image: "/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png",
      date: "Jul 3, 2025",
      category: "Events",
      isHot: true
    },
    {
      id: 2,
      title: "New Demon Slayer Volume Release",
      description: "The highly anticipated new volume of Demon Slayer is finally available for pre-order along with exclusive character designs.",
      image: "/lovable-uploads/26efc76c-fa83-4369-8d8d-354eab1433e6.png",
      date: "Jul 5, 2025",
      category: "Licensing",
      isHot: true
    }
  ];

  const allAnnouncements = [
    {
      id: 1,
      title: "Summer Manga Festival 2025",
      description: "Join us for the biggest manga event of the summer! Over 100 new series, get exclusive merchandise and meet your favorite authors.",
      image: "/lovable-uploads/0e70be33-bdfc-41db-8ae1-5c0dcf1b885c.png",
      date: "Jul 3, 2025",
      category: "Events"
    },
    {
      id: 2,
      title: "New Demon Slayer Volume Release", 
      description: "The highly anticipated new volume of Demon Slayer is finally available for pre-order along with exclusive character designs.",
      image: "/lovable-uploads/26efc76c-fa83-4369-8d8d-354eab1433e6.png",
      date: "Jul 5, 2025",
      category: "Licensing"
    },
    {
      id: 3,
      title: "Naruto Masterpiece Reprint",
      description: "Our one-of-a-kind signature series is back! Get limited 200 ANNIVERSARY Inking featuring the best manga ever created!",
      image: "/lovable-uploads/503cc23b-a28f-4564-86f9-53896fa75f10.png",
      date: "Jul 6, 2025",
      category: "Reprints"
    },
    {
      id: 4,
      title: "New Digital Reading Features",
      description: "Introducing our brand new features for our digital manga reader, including improved zoom, auto-scrolling, and enhanced bookmarking.",
      image: "/lovable-uploads/6fb6d014-0083-4f09-95a2-0416443da769.png",
      date: "Jul 7, 2025", 
      category: "Features"
    },
    {
      id: 5,
      title: "Limited Edition Box Sets",
      description: "Exclusive box art and layout collection featuring 50 manga series. Each box includes exclusive artwork, character cards and special edition volumes.",
      image: "/lovable-uploads/781ea40e-866e-4ee8-9bf7-862a42bb8716.png",
      date: "Jul 8, 2025",
      category: "Licensing"
    },
    {
      id: 6,
      title: "Manga Creator Interview Series",
      description: "Starting next month, we'll be doing our very first interview series with top manga creators. Learn about their creative process, inspirations, and upcoming projects.",
      image: "/lovable-uploads/7b8f7dcc-b06f-4c89-b5af-906cd241ae0c.png",
      date: "Jul 9, 2025",
      category: "Features"
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "The Art of Manga Storytelling: A Deep Dive",
      description: "Explore the intricate techniques that make manga storytelling so compelling and unique in the world of visual narrative.",
      image: "/lovable-uploads/97f88fee-e070-4d97-a73a-c747112fa093.png",
      date: "Jul 10, 2025",
      category: "Educational",
      author: "Sarah Chen",
      readTime: "8 min read"
    },
    {
      id: 2,
      title: "Top 10 Must-Read Manga Series This Summer",
      description: "Our curated list of the hottest manga series that should be on every reader's list this summer season.",
      image: "/lovable-uploads/a0c88e05-5aba-4550-8ee0-7644ad456776.png", 
      date: "Jul 8, 2025",
      category: "Reviews",
      author: "Mike Rodriguez",
      readTime: "12 min read"
    },
    {
      id: 3,
      title: "Behind the Scenes: How Manga Gets Translated",
      description: "Take a look at the complex process of bringing Japanese manga to English-speaking audiences.",
      image: "/lovable-uploads/b228d232-065b-464f-9ed7-c6fc2545dc27.png",
      date: "Jul 5, 2025", 
      category: "Industry",
      author: "Emma Watson",
      readTime: "6 min read"
    }
  ];

  // Filter content based on secondary filter
  const getFilteredContent = (content: any[]) => {
    if (contentFilter === 'ALL') return content;
    
    return content.filter(item => {
      switch (contentFilter) {
        case 'NEWS':
          return item.category?.toLowerCase().includes('licensing') || 
                 item.category?.toLowerCase().includes('features') ||
                 item.category?.toLowerCase().includes('reprints');
        case 'ACTIVITIES':
          return item.category?.toLowerCase().includes('events') || 
                 item.category?.toLowerCase().includes('volume');
        default:
          return true;
      }
    });
  };

  // Search content based on query
  const getSearchedContent = (content: any[]) => {
    if (!searchQuery.trim()) return content;
    
    const query = searchQuery.toLowerCase();
    return content.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      (item.author && item.author.toLowerCase().includes(query))
    );
  };

  // Sort content by date
  const getSortedContent = (content: any[]) => {
    return [...content].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });
  };

  // Handle sort toggle
  const handleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const filteredFeaturedAnnouncements = getSortedContent(getSearchedContent(getFilteredContent(featuredAnnouncements)));
  const filteredAllAnnouncements = getSortedContent(getSearchedContent(getFilteredContent(allAnnouncements)));
  const filteredBlogPosts = getSortedContent(getSearchedContent(getFilteredContent(blogPosts)));

  // Enhanced share functionality with multiple options
  const handleShare = (item: any) => {
    const shareData = {
      title: item.title,
      text: item.description,
      url: `${window.location.origin}/announcement/${item.id}`,
    };

    // Check if device supports native sharing
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch((error) => {
        console.log('Error sharing:', error);
        showShareOptions(shareData);
      });
    } else {
      showShareOptions(shareData);
    }
  };

  const showShareOptions = (shareData: any) => {
    const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
    
    // Create social media share URLs
    const socialShares = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.title)}&url=${encodeURIComponent(shareData.url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
      reddit: `https://reddit.com/submit?title=${encodeURIComponent(shareData.title)}&url=${encodeURIComponent(shareData.url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title)}`
    };

    // Try to copy to clipboard first
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareData.url).then(() => {
        const userChoice = confirm(
          `Link copied to clipboard!\n\nWould you like to share on social media?\n\nClick OK to see sharing options, or Cancel to continue.`
        );
        if (userChoice) {
          openSocialShareMenu(socialShares);
        }
      }).catch(() => {
        fallbackShare(shareData, socialShares);
      });
    } else {
      fallbackShare(shareData, socialShares);
    }
  };

  const openSocialShareMenu = (socialShares: any) => {
    const shareOptions = [
      { name: 'Twitter', url: socialShares.twitter, emoji: '🐦' },
      { name: 'Facebook', url: socialShares.facebook, emoji: '📘' },
      { name: 'LinkedIn', url: socialShares.linkedin, emoji: '💼' },
      { name: 'WhatsApp', url: socialShares.whatsapp, emoji: '💬' },
      { name: 'Telegram', url: socialShares.telegram, emoji: '✈️' },
      { name: 'Reddit', url: socialShares.reddit, emoji: '🔗' }
    ];

    const choice = prompt(
      'Choose sharing platform:\n\n' + 
      shareOptions.map((option, index) => `${index + 1}. ${option.emoji} ${option.name}`).join('\n') +
      '\n\nEnter number (1-6) or press Cancel:'
    );

    const choiceIndex = parseInt(choice || '0') - 1;
    if (choiceIndex >= 0 && choiceIndex < shareOptions.length) {
      window.open(shareOptions[choiceIndex].url, '_blank', 'width=600,height=400');
    }
  };

  const fallbackShare = (shareData: any, socialShares?: any) => {
    const message = `Share: ${shareData.title}\n\nCopy this link:\n${shareData.url}`;
    
    if (socialShares) {
      const userChoice = confirm(message + '\n\nClick OK to see social media options, or Cancel to continue.');
      if (userChoice) {
        openSocialShareMenu(socialShares);
      }
    } else {
      prompt('Copy this link:', shareData.url);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {activeTab === 'announcements' ? 'Announcements' : 'Blogs'}
          </h1>
          <p className="text-muted-foreground">
            {activeTab === 'announcements' ? 'New Announcement' : 'Latest Articles & Insights'}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-0">
            <button
              onClick={() => setActiveTab('blogs')}
              className={`px-6 py-3 text-sm font-semibold border rounded-l-md transition-colors ${
                activeTab === 'blogs'
                  ? 'bg-destructive text-destructive-foreground border-destructive'
                  : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
              }`}
            >
              BLOGS
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-6 py-3 text-sm font-semibold border-l-0 border rounded-r-md transition-colors ${
                activeTab === 'announcements'
                  ? 'bg-destructive text-destructive-foreground border-destructive'
                  : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
              }`}
            >
              ANNOUNCEMENT
            </button>
            <div className="ml-auto flex items-center gap-4 text-sm">
              <button
                onClick={() => setContentFilter('ALL')}
                className={`transition-colors duration-200 ${
                  contentFilter === 'ALL' 
                    ? 'text-destructive font-semibold' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                ALL
              </button>
              <button
                onClick={() => setContentFilter('NEWS')}
                className={`transition-colors duration-200 ${
                  contentFilter === 'NEWS' 
                    ? 'text-destructive font-semibold' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                NEWS
              </button>
              <button
                onClick={() => setContentFilter('ACTIVITIES')}
                className={`transition-colors duration-200 ${
                  contentFilter === 'ACTIVITIES' 
                    ? 'text-destructive font-semibold' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                ACTIVITIES
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'announcements' ? (
          <>
            {/* Featured Updates */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Featured Updates</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredFeaturedAnnouncements.length > 0 ? (
                  filteredFeaturedAnnouncements.map((announcement) => (
                  <Card key={announcement.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={announcement.image} 
                        alt={announcement.title}
                        className="w-full h-48 object-cover"
                      />
                      {announcement.isHot && (
                        <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                          HOT
                        </Badge>
                      )}
                      <div className="absolute top-3 right-3 text-muted-foreground text-sm">
                        {announcement.date}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
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
                      <h3 className="text-xl font-bold text-foreground mb-3">{announcement.title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{announcement.description}</p>
                      <Link to={`/announcement/${announcement.id}`}>
                        <Button variant="destructive" size="sm">
                          Read More →
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-muted-foreground">No featured announcements found for "{contentFilter}"</p>
                    <button 
                      onClick={() => setContentFilter('ALL')}
                      className="text-destructive text-sm hover:underline mt-2"
                    >
                      Show all announcements
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* All Announcements */}
            <section className="mb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-foreground">All Announcements</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search announcements..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSort}>
                    Sort by Date {sortOrder === 'desc' ? '↓' : '↑'}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {filteredAllAnnouncements.length > 0 ? (
                  filteredAllAnnouncements.map((announcement) => (
                  <Card key={announcement.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 h-32 md:h-auto">
                          <img 
                            src={announcement.image} 
                            alt={announcement.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {announcement.title}
                            </h3>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleShare(announcement);
                                  }}
                                  className="hover:bg-muted transition-colors"
                                  title="Share this announcement"
                                >
                                  <Share2 className="w-4 h-4" />
                                </Button>
                              </div>
                          </div>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              {(() => {
                                const symbolData = getCategorySymbol(announcement.category);
                                const IconComponent = symbolData.icon;
                                return (
                                  <div className={`w-6 h-6 ${symbolData.bgColor} rounded-full flex items-center justify-center`}>
                                    <IconComponent className={`w-3 h-3 ${symbolData.color}`} />
                                  </div>
                                );
                              })()}
                              <Badge variant="secondary">{getCategorySymbol(announcement.category).label}</Badge>
                            </div>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {announcement.date}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-4 line-clamp-2">{announcement.description}</p>
                          <Link to={`/announcement/${announcement.id}`}>
                            <Button variant="destructive" size="sm">
                              Read More →
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">No blog posts found for "{contentFilter}"</p>
                    <button 
                      onClick={() => setContentFilter('ALL')}
                      className="text-destructive text-sm hover:underline mt-2"
                    >
                      Show all posts
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <span className="px-2 text-muted-foreground">...</span>
                <Button variant="outline" size="sm">15</Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Blog Posts Grid */}
            <section className="mb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-foreground">Latest Blog Posts</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search blog posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSort}>
                    Sort by Date {sortOrder === 'desc' ? '↓' : '↑'}
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogPosts.length > 0 ? (
                  filteredBlogPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-3 left-3" variant="secondary">
                        {post.category}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{post.description}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>By {post.author}</span>
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </span>
                        <Link to={`/announcement/${post.id}`}>
                          <Button variant="destructive" size="sm">
                            Read More →
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No announcements found for "{contentFilter}"</p>
                    <button 
                      onClick={() => setContentFilter('ALL')}
                      className="text-destructive text-sm hover:underline mt-2"
                    >
                      Show all announcements
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination for blogs */}
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <span className="px-2 text-muted-foreground">...</span>
                <Button variant="outline" size="sm">8</Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </section>
          </>
        )}

        {/* Stay Updated Newsletter */}
        <section className="bg-muted rounded-lg p-8 mb-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-8 h-8 text-destructive-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">
              Download some exclusive content and get new update straight from online!
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Your email address"
                className="flex-1"
              />
              <Button variant="destructive">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              By subscribing you agree to subscribe to our newsletter. Read our Privacy Policy for more info.
            </p>
          </div>
        </section>

        {/* Related Links */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Links</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-destructive-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">Event Calendar</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">View upcoming manga events</p>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Event Calendar
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Upcoming manga events and activities:</p>
                  <div className="space-y-3">
                    <div className="border-l-4 border-destructive pl-4">
                      <h4 className="font-semibold">Summer Manga Festival 2025</h4>
                      <p className="text-sm text-muted-foreground">July 3, 2025 - Tokyo Convention Center</p>
                    </div>
                    <div className="border-l-4 border-destructive pl-4">
                      <h4 className="font-semibold">Manga Creator Meetup</h4>
                      <p className="text-sm text-muted-foreground">July 15, 2025 - Virtual Event</p>
                    </div>
                    <div className="border-l-4 border-destructive pl-4">
                      <h4 className="font-semibold">Annual Manga Awards</h4>
                      <p className="text-sm text-muted-foreground">August 10, 2025 - Online Ceremony</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-destructive-foreground" />
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h3 className="font-semibold text-foreground cursor-help">Release Schedule</h3>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to see upcoming manga releases and schedules</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground">Check out our latest releases</p>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Release Schedule
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Upcoming manga releases:</p>
                  <div className="space-y-3">
                    <div className="border-l-4 border-destructive pl-4">
                      <h4 className="font-semibold">Demon Slayer Volume 25</h4>
                      <p className="text-sm text-muted-foreground">July 5, 2025</p>
                    </div>
                    <div className="border-l-4 border-destructive pl-4">
                      <h4 className="font-semibold">Naruto Anniversary Edition</h4>
                      <p className="text-sm text-muted-foreground">July 6, 2025</p>
                    </div>
                    <div className="border-l-4 border-destructive pl-4">
                      <h4 className="font-semibold">One Piece Volume 105</h4>
                      <p className="text-sm text-muted-foreground">July 12, 2025</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer hover:bg-muted/50">
                  <Link to="/faq" className="block">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
                        <Share2 className="w-4 h-4 text-destructive-foreground" />
                      </div>
                      <h3 className="font-semibold text-foreground">FAQ</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Frequently asked questions</p>
                  </Link>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Frequently Asked Questions
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">How do I read manga online?</h4>
                      <p className="text-sm text-muted-foreground">Simply create an account and browse our digital library. You can read on any device.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">When are new chapters released?</h4>
                      <p className="text-sm text-muted-foreground">New chapters are typically released weekly. Check our announcements for specific dates.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Can I download manga for offline reading?</h4>
                      <p className="text-sm text-muted-foreground">Yes, premium subscribers can download up to 10 chapters for offline reading.</p>
                    </div>
                  </div>
                  <Link to="/faq">
                    <Button variant="destructive" className="w-full">
                      View All FAQs
                    </Button>
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </div>
      
      <Footer />
      </div>
    </TooltipProvider>
  );
};

export default Announcements;
