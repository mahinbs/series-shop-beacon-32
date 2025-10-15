
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { CircleService } from '@/services/circleService';

const Newsletter = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.3);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create a global circle if it doesn't exist
      let globalCircle = await CircleService.getGlobalCircle();
      if (!globalCircle) {
        globalCircle = await CircleService.createGlobalCircle();
      }

      // Join the global circle - this saves to database, NOT email
      await CircleService.joinCircleWithEmail(globalCircle.id, email.trim());
      
      // Show success message
      toast({
        title: "Welcome to the Circle!",
        description: "You've successfully joined our collector's circle.",
      });
      
      // Reset form
      setEmail('');
    } catch (error) {
      console.error('Failed to join circle:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      ref={elementRef}
      className={`relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-20 pt-16 pb-48 border-t border-gray-700/50 overflow-hidden transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Enhanced background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-red-500 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 1}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className={`transition-all duration-1000 delay-200 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 relative">
            <span className="bg-gradient-to-r from-white via-red-200 to-purple-200 bg-clip-text text-transparent">
              Join Our
            </span>
            <span className="text-white"> Collector's Circle</span>
            {/* Glow effect */}
            <div className="absolute inset-0 text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-500/20 via-purple-500/20 to-pink-500/20 bg-clip-text text-transparent blur-lg -z-10">
              Join Our Collector's Circle
            </div>
          </h2>
        </div>

        <div className={`transition-all duration-1000 delay-400 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            <span className="text-red-400 font-semibold">Crossed Hearts Collector's Circle</span> provides you with latest updates on your favourite titles
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className={`max-w-lg mx-auto transition-all duration-1000 delay-600 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 relative">
            <div className="flex-1 relative group">
              <Input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 h-14 px-6 text-lg rounded-xl backdrop-blur-sm transition-all duration-300 focus:scale-105 focus:border-red-500 focus:bg-gray-800 group-hover:border-gray-500"
                required
              />
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 h-14 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-white/20 to-red-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10">
                {isSubmitting ? 'Joining...' : 'Join Circle'}
              </span>
            </Button>
          </div>
          
          <p className="text-gray-500 text-sm mt-4">
            No spam, unsubscribe at any time. Your privacy is important to us.
          </p>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
