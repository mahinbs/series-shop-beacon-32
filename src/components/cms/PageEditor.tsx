import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContentEditor } from './ContentEditor';
import { HeroBannerManager } from './HeroBannerManager';
import { BooksManager } from './BooksManager';
import { MerchandiseManager } from './MerchandiseManager';
import { ProductsManager } from './ProductsManager';
import { UserManagement } from './UserManagement';
import { OrderManagement } from './OrderManagement';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { SettingsPanel } from './SettingsPanel';
import { CoinsManagement } from './CoinsManagement';
import { ComicSeriesManager } from './ComicSeriesManager';
import { ComicEpisodesManager } from './ComicEpisodesManager';
import AnnouncementsManager from './AnnouncementsManager';
import { AdminPanelStatus } from './AdminPanelStatus';
import { DatabaseSetupHelper } from './DatabaseSetupHelper';
import { DigitalReaderManager } from './DigitalReaderManager';
import { ShopAllManager } from './ShopAllManager';
import { FeaturedSeriesManager } from './FeaturedSeriesManager';
import PrintBookManager from './PrintBookManager';
import { OurJourneyManager } from './OurJourneyManager';
import CreativeSnippetsManager from './CreativeSnippetsManager';
import { useCMS } from '@/hooks/useCMS';
import CirclesAdmin from './CirclesAdmin';
import { useToast } from '@/hooks/use-toast';
import { AdminPage } from './AdminSidebar';
import { Construction, Settings, Image, Plus } from 'lucide-react';

interface PageEditorProps {
  selectedPage: string;
}

export function PageEditor({ selectedPage }: PageEditorProps) {
  const { sections, updateSectionContent } = useCMS();
  const { toast } = useToast();

  const getPageSections = (pageId: string) => {
    // Map page IDs to actual page names in database
    const pageMapping: Record<string, string> = {
      'home-page': 'homepage',
      'our-series': 'our_series',
      'shop-all': 'shop_all',
      'about-us': 'about_us',
      'digital-reader': 'readers_mode',
      'announcement-page': 'announcements',
    };
    
    const actualPageName = pageMapping[pageId] || pageId;
    return sections.filter(section => section.page_name === actualPageName);
  };

  const renderHomePage = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Home Page</h2>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent>
          <HeroBannerManager />
        </CardContent>
      </Card>

      {/* Books Management Section */}
      <Card>
        <CardHeader>
          <CardTitle>Books Below Home Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <BooksManager />
        </CardContent>
      </Card>

      {/* Announcements Management Section */}
      <Card>
        <CardHeader>
          <CardTitle>Announcements Section</CardTitle>
        </CardHeader>
        <CardContent>
          <AnnouncementsManager />
        </CardContent>
      </Card>
    </div>
  );

  const renderBooksManagement = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Books Management</h2>
        <p className="text-muted-foreground mb-6">
          Manage books that appear in the sections below the hero banner (New Releases, Best Sellers, Leaving Soon)
        </p>
      </div>
      <BooksManager />
    </div>
  );

  const renderHeroBanners = () => <HeroBannerManager />;

  const renderGenericPage = (pageId: string, pageTitle: string) => {
    const pageSections = getPageSections(pageId);
    
    const handleAddSection = async () => {
      const sectionName = prompt('Enter section name (e.g., "hero", "features", "about"):');
      if (!sectionName) return;
      
      try {
        await updateSectionContent(
          pageId === 'digital-reader' ? 'readers_mode' : pageId,
          sectionName,
          {
            title: `${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Section`,
            content: 'Add your content here...',
            description: 'Section description'
          }
        );
        toast({
          title: 'Success',
          description: 'Content section created successfully',
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to create section',
          variant: 'destructive',
        });
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{pageTitle} Management</h2>
          <p className="text-muted-foreground">
            Manage content and settings for the {pageTitle.toLowerCase()} page.
          </p>
        </div>

        {pageSections.length > 0 ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{pageTitle} Content Sections</CardTitle>
              <Button onClick={handleAddSection} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {pageSections.map(section => (
                <ContentEditor
                  key={section.id}
                  pageName={section.page_name}
                  sectionName={section.section_name}
                  initialContent={section.content}
                />
              ))}</CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>No Content Found</CardTitle>
              <Button onClick={handleAddSection} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add First Section
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                No content sections found for this page. Click "Add First Section" to create your first content section.
              </p>
              <div className="text-sm text-muted-foreground">
                <p><strong>Common section names:</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>hero - Main banner/header section</li>
                  <li>features - Key features or benefits</li>
                  <li>about - About this page</li>
                  <li>content - Main content area</li>
                  <li>footer - Footer information</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Render content based on selected page
  switch (selectedPage) {
    case 'home-page':
      return renderHomePage();
    case 'books-management':
      return renderBooksManagement();
    case 'merchandise-management':
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Merchandise Management</h2>
            <p className="text-muted-foreground mb-6">
              Manage merchandise products including figures, posters, clothing, and accessories
            </p>
          </div>
          <MerchandiseManager />
        </div>
      );
    case 'products-management':
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Products Management</h2>
            <p className="text-muted-foreground mb-6">
              Manage all products including books, merchandise, digital items, and other products
            </p>
          </div>
          <ProductsManager />
        </div>
      );
    case 'hero-banners':
      return renderHeroBanners();
    case 'our-series':
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Featured Series Management</h2>
            <p className="text-muted-foreground mb-6">
              Manage featured series configuration, badges, and series selection
            </p>
          </div>
          <FeaturedSeriesManager />
        </div>
      );
    case 'shop-all':
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Shop All Management</h2>
            <p className="text-muted-foreground mb-6">
              Manage hero sections, filters, sorting, and product display for the Shop All page
            </p>
          </div>
          <ShopAllManager />
        </div>
      );
    case 'about-us':
      return renderGenericPage('about-us', 'About Us');
    case 'our-journey':
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Our Journey Management</h2>
            <p className="text-muted-foreground mb-6">
              Manage the timeline and journey content that appears in the "Our Journey" section
            </p>
          </div>
          <OurJourneyManager />
        </div>
      );
    case 'creative-snippets':
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Creative Snippets Management</h2>
            <p className="text-muted-foreground mb-6">
              Manage creative snippets and behind-the-scenes content that appears in the "Creative Snippets" section
            </p>
          </div>
          <CreativeSnippetsManager />
        </div>
      );
    case 'digital-reader':
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Digital Reader Management</h2>
            <p className="text-muted-foreground mb-6">
              Manage digital reader specifications and content
            </p>
          </div>
          <DigitalReaderManager />
        </div>
      );
    case 'circles-management':
      return (
        <div className="space-y-6">
          <CirclesAdmin />
        </div>
      );
    case 'announcement-page':
      return renderGenericPage('announcement-page', 'Announcement Page');
    case 'announcements-management':
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Announcements Management</h2>
            <p className="text-muted-foreground mb-6">
              Manage announcements that appear on the announcements section
            </p>
          </div>
          <AnnouncementsManager />
        </div>
      );
    case 'user-management':
      return <UserManagement />;
    case 'order-management':
      return <OrderManagement />;
    case 'analytics':
      return <AnalyticsDashboard />;
        case 'settings':
          return <SettingsPanel />;
        case 'coins-management':
          return <CoinsManagement />;
        case 'comic-series-management':
          return (
            <div className="h-full overflow-hidden">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Comic Series Management</h2>
                <p className="text-muted-foreground mb-6">
                  Manage comic series, creators, and content for the Digital Reader
                </p>
              </div>
              <div className="h-[calc(100vh-300px)] overflow-y-auto">
                <ComicSeriesManager />
              </div>
            </div>
          );
        case 'comic-episodes-management':
          return (
            <div className="h-full overflow-hidden">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Comic Episodes Management</h2>
                <p className="text-muted-foreground mb-6">
                  Manage episodes, pages, and uploads for comic series
                </p>
              </div>
              <div className="h-[calc(100vh-300px)] overflow-y-auto">
                <ComicEpisodesManager />
              </div>
            </div>
          );
        case 'admin-status':
          return <AdminPanelStatus />;
        case 'database-setup':
          return <DatabaseSetupHelper />;
        case 'print-books-management':
          return (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Print Books Management</h2>
                <p className="text-muted-foreground mb-6">
                  Manage print books and their pages for the print reader
                </p>
              </div>
              <PrintBookManager />
            </div>
          );
        default:
      return (
        <Card>
          <CardHeader>
            <CardTitle>Page Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The selected page could not be found. Please select a valid page from the sidebar.
            </p>
          </CardContent>
        </Card>
      );
  }
}
