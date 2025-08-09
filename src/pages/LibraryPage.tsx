import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  BookOpen, 
  Search, 
  Star, 
  Grid,
  List
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LibraryPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock library data
  const libraryItems = [
    {
      id: 1,
      title: "Demon Slayer: Kimetsu no Yaiba",
      author: "Koyoharu Gotouge",
      image: "/lovable-uploads/26efc76c-fa83-4369-8d8d-354eab1433e6.png",
      type: "Manga",
      volumes: 23,
      ownedVolumes: 23,
      currentVolume: 15,
      currentChapter: 128,
      totalChapters: 205,
      readingProgress: 62,
      lastRead: "2 hours ago",
      rating: 5,
      status: "Reading",
      downloadStatus: "Downloaded",
      purchaseDate: "2024-12-15",
      totalReadTime: "48h 32m"
    },
    {
      id: 2,
      title: "One Piece",
      author: "Eiichiro Oda",
      image: "/lovable-uploads/503cc23b-a28f-4564-86f9-53896fa75f10.png",
      type: "Manga",
      volumes: 105,
      ownedVolumes: 78,
      currentVolume: 45,
      currentChapter: 890,
      totalChapters: 1100,
      readingProgress: 81,
      lastRead: "1 day ago",
      rating: 5,
      status: "Reading",
      downloadStatus: "Partial",
      purchaseDate: "2024-10-20",
      totalReadTime: "156h 45m"
    },
    {
      id: 3,
      title: "Attack on Titan",
      author: "Hajime Isayama",
      image: "/lovable-uploads/781ea40e-866e-4ee8-9bf7-862a42bb8716.png",
      type: "Manga",
      volumes: 34,
      ownedVolumes: 34,
      currentVolume: 34,
      currentChapter: 139,
      totalChapters: 139,
      readingProgress: 100,
      lastRead: "1 week ago",
      rating: 5,
      status: "Completed",
      downloadStatus: "Downloaded",
      purchaseDate: "2024-08-10",
      totalReadTime: "67h 20m"
    },
    {
      id: 4,
      title: "My Hero Academia",
      author: "Kohei Horikoshi",
      image: "/lovable-uploads/97f88fee-e070-4d97-a73a-c747112fa093.png",
      type: "Manga",
      volumes: 38,
      ownedVolumes: 25,
      currentVolume: 18,
      currentChapter: 156,
      totalChapters: 400,
      readingProgress: 39,
      lastRead: "3 days ago",
      rating: 4,
      status: "Reading",
      downloadStatus: "Not Downloaded",
      purchaseDate: "2024-11-05",
      totalReadTime: "32h 15m"
    }
  ];

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || 
                           (filterCategory === 'reading' && item.status === 'Reading') ||
                           (filterCategory === 'completed' && item.status === 'Completed') ||
                           (filterCategory === 'downloaded' && item.downloadStatus === 'Downloaded');
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
      case 'progress':
        return b.readingProgress - a.readingProgress;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-500" />
                My Library
              </h1>
              <p className="text-muted-foreground">
                Your personal collection of manga, progress tracking, and reading statistics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search your library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="reading">Currently Reading</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="downloaded">Downloaded</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="progress">Reading Progress</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Library Items */}
        <div className={
          viewMode === 'grid' 
            ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {sortedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {viewMode === 'grid' ? (
                <div>
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge
                      className={`absolute top-3 left-3 ${
                        item.status === 'Completed' ? 'bg-green-500' : 
                        item.status === 'Reading' ? 'bg-blue-500' : 'bg-orange-500'
                      }`}
                    >
                      {item.status}
                    </Badge>
                    <Badge 
                      variant="secondary"
                      className="absolute top-3 right-3"
                    >
                      {item.ownedVolumes}/{item.volumes}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{item.author}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{item.readingProgress}%</span>
                      </div>
                      <Progress value={item.readingProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Chapter {item.currentChapter} of {item.totalChapters}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div></div>
                      <Button size="sm" variant="destructive">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {item.status === 'Completed' ? 'Re-read' : 'Continue'}
                      </Button>
                    </div>
                  </CardContent>
                </div>
              ) : (
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.author}</p>
                        </div>
                        <Badge className={
                          item.status === 'Completed' ? 'bg-green-500' : 
                          item.status === 'Reading' ? 'bg-blue-500' : 'bg-orange-500'
                        }>
                          {item.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Progress:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={item.readingProgress} className="h-2 flex-1" />
                            <span>{item.readingProgress}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Read:</span>
                          <p>{item.lastRead}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Volumes:</span>
                          <p>{item.ownedVolumes}/{item.volumes}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Time:</span>
                          <p>{item.totalReadTime}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <div></div>
                        <Button size="sm" variant="destructive">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {item.status === 'Completed' ? 'Re-read' : 'Continue'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LibraryPage;