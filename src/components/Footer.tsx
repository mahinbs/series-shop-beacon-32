import { Facebook, Instagram, Twitter, Youtube, Settings, LogIn } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useCMS } from '@/hooks/useCMS';
import { useDummyAuth } from '@/hooks/useDummyAuth';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.2);
  const { getSectionContent } = useCMS();
  const { user } = useDummyAuth();

  // Get footer content from CMS or use defaults
  const footerContent = getSectionContent('footer', 'main_content');
  
  const defaultSections = [
    {
      title: "Crossed Hearts",
      links: [
        "A global publishing house specialising in the English localization of Japanese manga and Korean webcomics.",
        "Announcements",
        "Blogs",
        "Contact Us"
      ]
    },
    {
      title: "Help & Support",
      links: [
        "FAQ",
        "Shipping Info", 
        "Returns & Exchanges",
        "Customer Support"
      ]
    },
    {
      title: "Legal",
      links: [
        "Terms of Service",
        "Privacy Policy",
        "Copyright Notice",
        "Language Terms"
      ]
    },
    {
      title: "Our Imprints",
      links: []
    }
  ];

  const footerSections = footerContent?.sections || defaultSections;
  const copyrightText = footerContent?.copyright || "© 2025 Crossed Hearts. All rights reserved.";
  const companyDescription = footerContent?.description || "A global publishing house specialising in the English localization of Japanese manga and Korean webcomics.";

  return (
    <footer 
      ref={elementRef}
      className={`bg-black text-gray-400 py-8 sm:py-12 transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Logo */}
        <div className={`flex justify-center sm:justify-start mb-6 sm:mb-8 transition-all duration-700 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {/* Mobile logo */}
          <img 
            src="/lovable-uploads/fdd0cb0d-369d-4e2c-b325-fd7bac14abc3.png" 
            alt="Hearts"
            className="h-14 w-auto block sm:hidden"
          />
          {/* Desktop logo */}
          <img 
            src="/lovable-uploads/d2efe27c-7713-4015-9de8-ea1ddfbe2830.png" 
            alt="Crossed Hearts"
            className="h-16 w-auto sm:h-20 sm:w-auto hidden sm:block"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {footerSections.map((section, index) => (
            <div 
              key={index}
              className={`text-center sm:text-left transition-all duration-700 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <h3 className="text-red-500 font-semibold mb-3 sm:mb-4 text-base sm:text-lg">{section.title}</h3>
              {index === 3 ? (
                <div className="flex flex-col space-y-3 items-center sm:items-start">
                  <img 
                    src="/lovable-uploads/c63bffdb-4754-4d64-8063-6ac8bba72106.png" 
                    alt="GL Ami Pop" 
                    className="h-8 w-auto"
                  />
                  <img 
                    src="/lovable-uploads/298cc90c-2dff-4daf-b31b-2ebe77649735.png" 
                    alt="UE" 
                    className="h-8 w-auto"
                  />
                  <img 
                    src="/lovable-uploads/0eb9fe03-348b-4a44-a643-6c8dfbba66a9.png" 
                    alt="BL Club" 
                    className="h-8 w-auto"
                  />
                  <img 
                    src="/lovable-uploads/9c2bfe8c-6585-45b0-bc73-7b72048725ee.png" 
                    alt="Novel" 
                    className="h-8 w-auto"
                  />
                </div>
              ) : (
                <ul className="space-y-1.5 sm:space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {linkIndex === 0 && index === 0 ? (
                        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed px-2 sm:px-0">{companyDescription}</p>
                      ) : link === "Privacy Policy" ? (
                        <Link to="/privacy-policy" className="text-xs sm:text-sm hover:text-white transition-colors duration-200 transform hover:translate-x-1 block px-2 sm:px-0 py-1">
                          {link}
                        </Link>
                      ) : link === "Copyright Notice" ? (
                        <Link to="/copyright" className="text-xs sm:text-sm hover:text-white transition-colors duration-200 transform hover:translate-x-1 block px-2 sm:px-0 py-1">
                          {link}
                        </Link>
                      ) : link === "Shipping Info" ? (
                        <Link to="/order-shipping" className="text-xs sm:text-sm hover:text-white transition-colors duration-200 transform hover:translate-x-1 block px-2 sm:px-0 py-1">
                          {link}
                        </Link>
                      ) : link === "Returns & Exchanges" ? (
                        <Link to="/return-exchange" className="text-xs sm:text-sm hover:text-white transition-colors duration-200 transform hover:translate-x-1 block px-2 sm:px-0 py-1">
                          {link}
                        </Link>
                      ) : link === "Terms of Service" ? (
                        <Link to="/terms-conditions" className="text-xs sm:text-sm hover:text-white transition-colors duration-200 transform hover:translate-x-1 block px-2 sm:px-0 py-1">
                          {link}
                        </Link>
                      ) : link === "FAQ" ? (
                        <Link to="/faq" className="text-xs sm:text-sm hover:text-white transition-colors duration-200 transform hover:translate-x-1 block px-2 sm:px-0 py-1">
                          {link}
                        </Link>
                      ) : link === "Customer Support" ? (
                        <Link to="/customer-support" className="text-xs sm:text-sm hover:text-white transition-colors duration-200 transform hover:translate-x-1 block px-2 sm:px-0 py-1">
                          {link}
                        </Link>
                      ) : link === "Language Terms" ? (
                        <Link to="/language-terms" className="text-xs sm:text-sm hover:text-white transition-colors duration-200 transform hover:translate-x-1 block px-2 sm:px-0 py-1">
                          {link}
                        </Link>
                      ) : link === "Announcements" ? (
                        <Link to="/announcements" className="text-xs sm:text-sm hover:text-white transition-colors duration-200 transform hover:translate-x-1 block px-2 sm:px-0 py-1">
                          {link}
                        </Link>
                      ) : link === "Blogs" ? (
                        <Link to="/announcements" className="text-xs sm:text-sm hover:text-white transition-colors duration-200 transform hover:translate-x-1 block px-2 sm:px-0 py-1">
                          {link}
                        </Link>
                      ) : link === "Contact Us" ? (
                        <Link to="/contact-us" className="text-xs sm:text-sm hover:text-white transition-colors duration-200 transform hover:translate-x-1 block px-2 sm:px-0 py-1">
                          {link}
                        </Link>
                      ) : (
                        <a href="#" className="text-xs sm:text-sm hover:text-white transition-colors duration-200 transform hover:translate-x-1 block px-2 sm:px-0 py-1">
                          {link}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        
        <div className={`border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 transition-all duration-700 delay-800 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex justify-center items-center mb-4">
            <div className="flex space-x-6 items-center">
              <a href="https://x.com/crossedheartsus" className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/crossedheartsglobal?igsh=NWt4NGFiY214d3Np" className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/share/1Ao3eMJana/" className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/channel/UCml272d_SV3kHboiO_taiaQ" className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110">
                <Youtube className="w-5 h-5" />
              </a>
              {user && (
                <Link 
                  to="/admin" 
                  className="text-gray-400 hover:text-red-500 transition-all duration-200 transform hover:scale-110 flex items-center gap-1 text-xs"
                  title="CMS Admin Panel"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">CMS</span>
                </Link>
              )}
              {!user && (
                <Link
                  to="/auth"
                  className="text-gray-400 hover:text-red-500 transition-all duration-200 transform hover:scale-110 flex items-center gap-1 text-xs"
                  title="Admin Login"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin Login</span>
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <p className="text-xs sm:text-sm text-gray-500 text-center">
              {copyrightText}
            </p>
            <p className="text-xs text-gray-600 text-center">
              Designed and developed by <a href="https://satprimeai.com" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 transition-colors duration-200">SATPRIME.AI</a>
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
