import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useCMS } from '@/hooks/useCMS';
import { Link } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Footer = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.2);
  const { getSectionContent } = useCMS();

  // Get footer content from CMS or use defaults
  const footerContent = getSectionContent('footer', 'main_content');
  
  const defaultSections = [
    {
      title: "Crossed Hearts",
      links: [
        "A global publishing house specialising in the English localization of Japanese manga and Korean webcomics.",
        "Affiliation Programs",
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
      <div className="w-full px-4 sm:px-6 lg:px-8">
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
                <div className="flex flex-col space-y-5 items-center sm:items-start">
                  <Popover>
                    <PopoverTrigger asChild>
                      <img 
                        src="/assets/our-imprints/1.png" 
                        alt="GLAM POP!" 
                        className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
                      />
                    </PopoverTrigger>
                    <PopoverContent 
                      align="center" 
                      side="top"
                      sideOffset={10}
                      className="w-80 bg-gray-900 border border-gray-700 text-gray-300 shadow-xl"
                    >
                      <div className="space-y-2">
                        <h4 className="font-semibold text-red-500 text-sm">GLAM POP! (2027)</h4>
                        <p className="text-xs leading-relaxed">
                          Imprint for shoujo ai, yuri, and girl's love series that span multiple genres, all brought to life in English with care and authenticity. GLAM POP! showcases stories of love, friendship, and connection between women, ranging from sweet slice-of-life romances to epic, otherworldly adventures.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <img 
                        src="/assets/our-imprints/2.png" 
                        alt="ONE & DONE" 
                        className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
                      />
                    </PopoverTrigger>
                    <PopoverContent 
                      align="center" 
                      side="top"
                      sideOffset={10}
                      className="w-80 bg-gray-900 border border-gray-700 text-gray-300 shadow-xl"
                    >
                      <div className="space-y-2">
                        <h4 className="font-semibold text-red-500 text-sm">ONE & DONE (2026)</h4>
                        <p className="text-xs leading-relaxed">
                          Designed for readers who want the full experience in one sitting. Specializing in standalone manga volumes that can be read and loved from start to finish in a single go, ONE & DONE is for the binge-reader who can't wait months for the next volume.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <img 
                        src="/assets/our-imprints/3.png" 
                        alt="BLUSH CLUB" 
                        className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
                      />
                    </PopoverTrigger>
                    <PopoverContent 
                      align="center" 
                      side="top"
                      sideOffset={10}
                      className="w-80 bg-gray-900 border border-gray-700 text-gray-300 shadow-xl"
                    >
                      <div className="space-y-2">
                        <h4 className="font-semibold text-red-500 text-sm">BLUSH CLUB (2026)</h4>
                        <p className="text-xs leading-relaxed">
                          Dedicated imprint for shounen ai, yaoi, and boy's love stories from across Asia, carefully localized in English for a global readership. From tender first loves to high-stakes romances set against fantastical backdrops, BLUSH CLUB curates series that celebrate love between men in all its forms.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <img 
                        src="/assets/our-imprints/4.png" 
                        alt="E-NOVEL PRESS" 
                        className="h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
                      />
                    </PopoverTrigger>
                    <PopoverContent 
                      align="center" 
                      side="top"
                      sideOffset={10}
                      className="w-80 bg-gray-900 border border-gray-700 text-gray-300 shadow-xl"
                    >
                      <div className="space-y-2">
                        <h4 className="font-semibold text-red-500 text-sm">E-NOVEL PRESS (2026)</h4>
                        <p className="text-xs leading-relaxed">
                          Brings the best of Asian novels—from the original stories behind hit webcomics and manga to captivating new works—into the hands of English-speaking readers worldwide. Our catalogue spans romance, fantasy, action, mystery, horror, and sci-fi.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
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
                      ) : link === "Affiliation Programs" ? (
                        <Link to="/affiliation-programs" className="text-xs sm:text-sm hover:text-white transition-colors duration-200 transform hover:translate-x-1 block px-2 sm:px-0 py-1">
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
                        <span className="text-xs sm:text-sm text-gray-500 px-2 sm:px-0 py-1">
                          {link}
                        </span>
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
              <a href="https://www.instagram.com/thecrossedhearts?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/share/171zMQpoWZ/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://x.com/CrossedHearts_X" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/crossed-hearts" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110">
                <Linkedin className="w-5 h-5" />
              </a>
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
