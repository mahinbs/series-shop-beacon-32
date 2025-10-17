import React from 'react';
import { 
  Home, 
  BookOpen, 
  ShoppingBag, 
  Info, 
  Settings as SettingsIcon, 
  Megaphone,
  Image,
  Settings,
  Package,
  Users,
  BarChart3,
  Cog,
  Coins,
  Database,
  Calendar,
  Sparkles
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export interface AdminPage {
  id: string;
  title: string;
  icon: any;
  description?: string;
}

const adminPages: AdminPage[] = [
  { 
    id: 'home-page', 
    title: 'Home Page', 
    icon: Home,
    description: 'Manage homepage content and layout'
  },
  { 
    id: 'our-series', 
    title: 'Featured Series', 
    icon: BookOpen,
    description: 'Manage featured series and collections'
  },
  { 
    id: 'shop-all', 
    title: 'Shop All', 
    icon: ShoppingBag,
    description: 'Manage shop content and products'
  },
  { 
    id: 'about-us', 
    title: 'About Us', 
    icon: Info,
    description: 'Manage about page content'
  },
  { 
    id: 'our-journey', 
    title: 'Our Journey', 
    icon: Calendar,
    description: 'Manage timeline and journey content'
  },
  { 
    id: 'creative-snippets', 
    title: 'Creative Snippets', 
    icon: Sparkles,
    description: 'Manage creative snippets and behind-the-scenes content'
  },
  { 
    id: 'digital-reader', 
    title: "Digital Reader", 
    icon: SettingsIcon,
    description: 'Manage reading experience settings'
  },
  { 
    id: 'circles-management', 
    title: 'Circles Management', 
    icon: Users,
    description: 'Manage circles, memberships, and community features'
  },
  { 
    id: 'comic-series-management', 
    title: 'All Series', 
    icon: BookOpen,
    description: 'Manage all comic series, creators, and content'
  },
  { 
    id: 'comic-episodes-management', 
    title: 'Comic Episodes', 
    icon: BookOpen,
    description: 'Manage episodes, pages, and uploads'
  },
  { 
    id: 'books-management', 
    title: 'Books Management', 
    icon: BookOpen,
    description: 'Manage book catalog and metadata'
  },
  { 
    id: 'print-books-management', 
    title: 'Print Books Management', 
    icon: BookOpen,
    description: 'Manage print books and their pages for the print reader'
  },
  { 
    id: 'merchandise-management', 
    title: 'Merchandise Management', 
    icon: ShoppingBag,
    description: 'Manage merchandise products including figures, posters, clothing, and accessories'
  },
  { 
    id: 'products-management', 
    title: 'Products Management', 
    icon: Package,
    description: 'Manage all products including books, merchandise, and digital items'
  },
  { 
    id: 'user-management', 
    title: 'User Management', 
    icon: Users,
    description: 'Manage users, roles, and permissions'
  },
  { 
    id: 'order-management', 
    title: 'Order Management', 
    icon: ShoppingBag,
    description: 'Manage orders, shipments, and payments'
  },
  { 
    id: 'analytics', 
    title: 'Analytics', 
    icon: BarChart3,
    description: 'View sales reports and business analytics'
  },
  { 
    id: 'settings', 
    title: 'Settings', 
    icon: Cog,
    description: 'Configure site settings and preferences'
  },
  { 
    id: 'coins-management', 
    title: 'Coins Management', 
    icon: Coins,
    description: 'Manage coin packages, transactions, and user balances'
  },
  { 
    id: 'admin-status', 
    title: 'System Status', 
    icon: Settings,
    description: 'Check admin panel system status and connectivity'
  },
  { 
    id: 'database-setup', 
    title: 'Database Setup', 
    icon: Database,
    description: 'Set up database tables and configure Supabase'
  },
];

interface AdminSidebarProps {
  selectedPage: string;
  onPageSelect: (pageId: string) => void;
}

export function AdminSidebar({ selectedPage, onPageSelect }: AdminSidebarProps) {
  const sidebar = useSidebar();
  const collapsed = sidebar.state === 'collapsed';

  const isActive = (pageId: string) => selectedPage === pageId;
  
  const getNavClass = (pageId: string) =>
    isActive(pageId) 
      ? "bg-primary/10 text-primary border-l-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar 
      className={`
        ${collapsed ? "w-16" : "w-64"} 
        border-r transition-all duration-300 ease-in-out
        flex-shrink-0
      `} 
      collapsible="icon"
    >
      <SidebarContent className="p-0 overflow-y-auto h-full">
        <div className="p-4 space-y-4 min-h-full">
          {/* Admin Pages Section */}
          <SidebarGroup>
            <SidebarGroupLabel className={`
              px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground
              ${collapsed ? "sr-only" : "block"}
            `}>
              Administration
            </SidebarGroupLabel>
            
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 mt-2">
                {adminPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <SidebarMenuItem key={page.id}>
                      <SidebarMenuButton
                        onClick={() => onPageSelect(page.id)}
                        className={`
                          w-full h-10 px-2 flex items-center gap-3 rounded-md
                          transition-colors duration-200
                          ${getNavClass(page.id)}
                          ${collapsed ? "justify-center" : "justify-start"}
                        `}
                        title={collapsed ? page.title : undefined}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && (
                          <span className="text-sm font-medium truncate min-w-0 flex-1">
                            {page.title}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Quick Actions Section - moved into main pages */}
          <SidebarGroup>
            <SidebarGroupLabel className={`
              px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground
              ${collapsed ? "sr-only" : "block"}
            `}>
              Quick Actions
            </SidebarGroupLabel>
            
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 mt-2">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => onPageSelect('hero-banners')}
                    className={`
                      w-full h-10 px-2 flex items-center gap-3 rounded-md
                      transition-colors duration-200
                      ${getNavClass('hero-banners')}
                      ${collapsed ? "justify-center" : "justify-start"}
                      overflow-hidden
                    `}
                    title={collapsed ? "Hero Banners" : undefined}
                  >
                    <Image className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && (
                      <span className="text-sm font-medium truncate min-w-0 flex-1">
                        Hero Banners
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => onPageSelect('announcements-management')}
                    className={`
                      w-full h-10 px-2 flex items-center gap-3 rounded-md
                      transition-colors duration-200
                      ${getNavClass('announcements-management')}
                      ${collapsed ? "justify-center" : "justify-start"}
                      overflow-hidden
                    `}
                    title={collapsed ? "Announcements" : undefined}
                  >
                    <Megaphone className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && (
                      <span className="text-sm font-medium truncate min-w-0 flex-1">
                        Announcements
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => onPageSelect('announcement-sections')}
                    className={`
                      w-full h-10 px-2 flex items-center gap-3 rounded-md
                      transition-colors duration-200
                      ${getNavClass('announcement-sections')}
                      ${collapsed ? "justify-center" : "justify-start"}
                      overflow-hidden
                    `}
                    title={collapsed ? "Announcement Sections" : undefined}
                  >
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && (
                      <span className="text-sm font-medium truncate min-w-0 flex-1">
                        Announcement Sections
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Brand/Logo Area */}
        {/* {!collapsed && (
          <div className="mt-auto p-4 border-t">
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-muted-foreground">CMS Dashboard</p>
              <p className="text-xs text-muted-foreground/70">v2.1.0</p>
            </div>
          </div>
        )} */}
      </SidebarContent>
    </Sidebar>
  );
}

export { adminPages };