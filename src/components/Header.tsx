
import { useState } from 'react';
import { Menu, X, Search, ShoppingCart, User, Heart, Building2, Settings, LogOut, LogIn, UserCircle, Clock, Coins, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { CoinDisplay } from '@/components/CoinDisplay';
import { useDummyAuth } from '@/hooks/useDummyAuth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout, isLoading } = useDummyAuth();

  const scrollToFeaturedSeries = () => {
    const element = document.getElementById('featured-series');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    // If we're already on the home page, scroll to featured series instead
    if (location.pathname === '/') {
      e.preventDefault();
      scrollToFeaturedSeries();
    }
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Our Series', href: '/our-series' },
    { name: 'Shop All', href: '/shop-all' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Contact Us', href: '/contact-us' },
    { name: 'Affiliation Programs', href: '/affiliation-programs' },
    { name: 'Readers Mode', href: '/comics' },
    { name: 'Announcements', href: '/announcements' }
  ];

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" onClick={handleHomeClick}>
              {/* Mobile logo */}
              <img 
                src="/lovable-uploads/fdd0cb0d-369d-4e2c-b325-fd7bac14abc3.png" 
                alt="Hearts"
                className="h-12 w-auto block sm:hidden"
              />
              {/* Desktop logo */}
              <img 
                src="/lovable-uploads/d2efe27c-7713-4015-9de8-ea1ddfbe2830.png" 
                alt="Crossed Hearts"
                className="h-16 w-auto hidden sm:block"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center justify-center flex-1 space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={item.name === 'Home' ? handleHomeClick : undefined}
                className={`transition-colors duration-200 text-sm font-medium whitespace-nowrap hover:text-red-400 ${
                  location.pathname === item.href 
                    ? 'text-red-500' 
                    : 'text-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/wishlist">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/library">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300"
              >
                <Building2 className="w-5 h-5" />
              </Button>
            </Link>
            <CoinDisplay />
            <Link to="/search">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            
            {/* Profile Dropdown */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background border border-border shadow-lg z-50">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile?tab=orders" className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Order History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile?tab=settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/buy-coins" className="flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      Coin Balance
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout} 
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <LogIn className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-md ${
                    location.pathname === item.href 
                      ? 'text-red-500 bg-gray-800' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    if (item.name === 'Home') {
                      handleHomeClick(e);
                    }
                  }}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-300 hover:text-white hover:bg-gray-800 text-sm font-medium px-3 py-2 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="text-gray-300 hover:text-white hover:bg-gray-800 text-sm font-medium px-3 py-2 rounded-md w-full justify-start"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 text-sm font-medium px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
              <div className="flex items-center justify-center space-x-4 px-3 pt-4 border-t border-gray-800">
                <CoinDisplay />
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
