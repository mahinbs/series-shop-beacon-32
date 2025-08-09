import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  ShoppingBag, 
  Info, 
  Settings as SettingsIcon, 
  Megaphone,
  Image,
  Settings,
  Package
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
  SidebarTrigger,
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
    title: 'Our Series', 
    icon: BookOpen,
    description: 'Manage series and collections'
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
    id: 'readers-mode', 
    title: "Reader's Mode", 
    icon: SettingsIcon,
    description: 'Manage reading experience settings'
  },
  { 
    id: 'books-management', 
    title: 'Books Management', 
    icon: BookOpen,
    description: 'Manage book catalog and metadata'
  },
  { 
    id: 'products-management', 
    title: 'Products Management', 
    icon: Package,
    description: 'Manage all products including books, merchandise, and digital items'
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
      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
      : "hover:bg-muted/80 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-72"} border-r bg-gradient-to-b from-background to-muted/20 transition-all duration-300`} collapsible="icon">
      <SidebarTrigger className="m-3 hover:bg-accent/50 transition-colors duration-200" />
      
      <SidebarContent className="px-2">
        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-4 mb-3 uppercase tracking-wide">
            {!collapsed && "Pages"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {adminPages.map((page) => (
                <SidebarMenuItem key={page.id}>
                  <SidebarMenuButton 
                    asChild 
                    className={`
                      ${getNavClass(page.id)} 
                      rounded px-3 py-2
                    `}
                  >
                    <button
                      onClick={() => onPageSelect(page.id)}
                      className="w-full text-left"
                    >
                      {page.title}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Enhanced Quick Actions Section */}
        <SidebarGroup className="py-4 border-t border-border/50">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-4 mb-3 uppercase tracking-wide">
            {!collapsed && "Quick Actions"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className={`
                    ${getNavClass('hero-banners')} 
                    transition-all duration-200 ease-in-out
                    hover:shadow-sm hover:bg-accent/80
                    ${isActive('hero-banners') ? 'shadow-md bg-primary text-primary-foreground hover:bg-primary/90' : ''}
                    rounded-lg mx-2 mb-1 border border-transparent
                    ${isActive('hero-banners') ? 'border-primary/20' : 'hover:border-accent'}
                  `}
                >
                  <button
                    onClick={() => onPageSelect('hero-banners')}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left group"
                  >
                    <Image className={`
                      h-5 w-5 flex-shrink-0 transition-transform duration-200
                      ${isActive('hero-banners') ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}
                      group-hover:scale-110
                    `} />
                    {!collapsed && (
                      <div className="flex-1 min-w-0">
                        <div className={`
                          font-medium text-sm truncate
                          ${isActive('hero-banners') ? 'text-primary-foreground' : 'text-foreground'}
                        `}>
                          Hero Banners
                        </div>
                        <div className={`
                          text-xs mt-0.5 truncate
                          ${isActive('hero-banners') ? 'text-primary-foreground/80' : 'text-muted-foreground'}
                        `}>
                          Manage carousel banners
                        </div>
                      </div>
                    )}
                    {!collapsed && isActive('hero-banners') && (
                      <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                    )}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className={`
                    ${getNavClass('books-management')} 
                    transition-all duration-200 ease-in-out
                    hover:shadow-sm hover:bg-accent/80
                    ${isActive('books-management') ? 'shadow-md bg-primary text-primary-foreground hover:bg-primary/90' : ''}
                    rounded-lg mx-2 mb-1 border border-transparent
                    ${isActive('books-management') ? 'border-primary/20' : 'hover:border-accent'}
                  `}
                >
                  <button
                    onClick={() => onPageSelect('books-management')}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left group"
                  >
                    <BookOpen className={`
                      h-5 w-5 flex-shrink-0 transition-transform duration-200
                      ${isActive('books-management') ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}
                      group-hover:scale-110
                    `} />
                    {!collapsed && (
                      <div className="flex-1 min-w-0">
                        <div className={`
                          font-medium text-sm truncate
                          ${isActive('books-management') ? 'text-primary-foreground' : 'text-foreground'}
                        `}>
                          Books Management
                        </div>
                        <div className={`
                          text-xs mt-0.5 truncate
                          ${isActive('books-management') ? 'text-primary-foreground/80' : 'text-muted-foreground'}
                        `}>
                          Add books below home banner
                        </div>
                      </div>
                    )}
                    {!collapsed && isActive('books-management') && (
                      <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                    )}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Brand/Logo Area */}
        {!collapsed && (
          <div className="mt-auto mb-4 px-4">
            <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-3 border border-primary/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">CMS Dashboard</div>
                  <div className="text-xs text-muted-foreground">v1.0</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

export { adminPages };