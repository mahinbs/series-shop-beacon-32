
import { Button } from '@/components/ui/button';
import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Facebook,
  MessageCircle,
  UserPlus
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const SocialsSection = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/crossedheartsglobal?igsh=NWt4NGFiY214d3Np', color: 'from-pink-500 to-purple-500' },
    { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/channel/UCml272d_SV3kHboiO_taiaQ', color: 'from-red-500 to-red-600' },
    { name: 'Twitter/X', icon: Twitter, url: 'https://x.com/crossedheartsus', color: 'from-gray-800 to-black' },
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/share/1Ao3eMJana/', color: 'from-blue-600 to-blue-700' }
  ];

  return (
    <section 
      ref={elementRef}
      className={`relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 overflow-hidden transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Social Media Section */}
        <div className={`text-center transition-all duration-1000 delay-200 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <h2 className="text-4xl font-bold text-white mb-4">
            <span className="text-red-500">
              Stay Connected
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">Follow us for the latest updates and announcements</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  className={`group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 hover:from-gray-750 hover:to-gray-850 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 hover:shadow-2xl border border-gray-700/50 hover:border-white/20 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className="text-center space-y-3">
                    <div className={`mx-auto w-12 h-12 rounded-full bg-gradient-to-r ${social.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-medium text-xs group-hover:text-gray-100 transition-colors duration-300">
                      {social.name}
                    </h3>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialsSection;
