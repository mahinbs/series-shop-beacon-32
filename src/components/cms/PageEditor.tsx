import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentEditor } from './ContentEditor';
import { HeroBannerManager } from './HeroBannerManager';
import { BooksManager } from './BooksManager';
import { ProductsManager } from './ProductsManager';
import AnnouncementsManager from './AnnouncementsManager';
import { useCMS } from '@/hooks/useCMS';
import { AdminPage } from './AdminSidebar';
import { Construction, Settings, Image } from 'lucide-react';

interface PageEditorProps {
  selectedPage: string;
}

export function PageEditor({ selectedPage }: PageEditorProps) {
  const { sections } = useCMS();

  const getPageSections = (pageId: string) => {
    // Map page IDs to actual page names in database
    const pageMapping: Record<string, string> = {
      'home-page': 'homepage',
      'our-series': 'our_series',
      'shop-all': 'shop_all',
      'about-us': 'about_us',
      'readers-mode': 'readers_mode',
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
            <CardHeader>
              <CardTitle>{pageTitle} Content Sections</CardTitle>
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
            <CardHeader>
              <CardTitle>No Content Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No content sections found for this page. Content sections will appear here once they are created.
              </p>
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
      return renderGenericPage('our-series', 'Our Series');
    case 'shop-all':
      return renderGenericPage('shop-all', 'Shop All');
    case 'about-us':
      return renderGenericPage('about-us', 'About Us');
    case 'readers-mode':
      return renderGenericPage('readers-mode', "Reader's Mode");
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
