
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import ContactModal from '@/components/ContactModal';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Star, 
  Gift, 
  Target,
  BookOpen,
  Heart,
  Award,
  CheckCircle
} from 'lucide-react';

const AffiliationPrograms = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation(0.1);
  const { elementRef: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation(0.1);
  const { elementRef: programsRef, isVisible: programsVisible } = useScrollAnimation(0.1);
  const { elementRef: howItWorksRef, isVisible: howItWorksVisible } = useScrollAnimation(0.1);
  const { elementRef: requirementsRef, isVisible: requirementsVisible } = useScrollAnimation(0.1);

  const benefits = [
    { icon: DollarSign, title: "Competitive Commissions", description: "Earn up to 15% commission on every sale you generate" },
    { icon: TrendingUp, title: "Performance Bonuses", description: "Monthly bonuses for top-performing affiliates" },
    { icon: Gift, title: "Exclusive Content", description: "Early access to new releases and exclusive merchandise" },
    { icon: Users, title: "Dedicated Support", description: "Personal affiliate manager and marketing support" },
    { icon: Target, title: "Real-time Analytics", description: "Track your performance with detailed analytics dashboard" },
    { icon: Award, title: "Recognition Program", description: "Featured affiliate spotlights and achievement badges" }
  ];

  const programTypes = [
    {
      title: "Content Creator Program",
      icon: BookOpen,
      description: "Perfect for YouTubers, streamers, bloggers, and social media influencers",
      features: [
        "10-15% commission on book sales",
        "5-8% commission on merchandise",
        "Custom discount codes for your audience",
        "Early access to new releases",
        "Promotional materials and assets"
      ],
      requirements: "1K+ followers/subscribers"
    },
    {
      title: "Retail Partner Program",
      icon: Heart,
      description: "Ideal for bookstores, comic shops, and online retailers",
      features: [
        "Wholesale pricing on popular titles",
        "Co-marketing opportunities",
        "Exclusive retailer-only releases",
        "Marketing support and POS materials",
        "Priority customer support"
      ],
      requirements: "Established retail business"
    },
    {
      title: "Community Ambassador",
      icon: Star,
      description: "For passionate fans who want to share their love for manga and novels",
      features: [
        "5-10% commission on referrals",
        "Free monthly book selection",
        "Community recognition",
        "Beta access to new features",
        "Ambassador-exclusive events"
      ],
      requirements: "Active community participation"
    }
  ];

  const howItWorksSteps = [
    { step: 1, title: "Apply", description: "Fill out our simple application form" },
    { step: 2, title: "Get Approved", description: "We'll review your application within 48 hours" },
    { step: 3, title: "Start Promoting", description: "Access your dashboard and promotional materials" },
    { step: 4, title: "Earn Commissions", description: "Get paid monthly for your successful referrals" }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      
      {/* Hero Section */}
      <section 
        ref={heroRef as any}
        className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black py-20 sm:py-32 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-16 left-1/4 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-16 right-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 transition-all duration-1000 transform ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <span className="text-red-500">Partnership</span> Programs
          </h1>
          <p className={`text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed transition-all duration-1000 delay-300 transform ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Join our affiliate network and earn while sharing amazing manga and novels with your audience
          </p>
          <div className={`transition-all duration-1000 delay-500 transform ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Button 
              onClick={() => setIsContactModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section 
        ref={benefitsRef as any}
        className="py-16 bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 transition-all duration-1000 transform ${
            benefitsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Why Partner With Us?</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Join thousands of successful affiliates earning substantial commissions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card 
                key={index}
                className={`bg-gray-800 border-gray-700 transition-all duration-1000 delay-${index * 100} transform ${
                  benefitsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <CardHeader>
                  <benefit.icon className="w-12 h-12 text-red-500 mb-4" />
                  <CardTitle className="text-white text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Program Types */}
      <section 
        ref={programsRef as any}
        className="py-16 bg-gray-950"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 transition-all duration-1000 transform ${
            programsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Choose Your Program</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              We offer different partnership programs tailored to your audience and goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {programTypes.map((program, index) => (
              <Card 
                key={index}
                className={`bg-gray-800 border-gray-700 h-full transition-all duration-1000 delay-${index * 200} transform ${
                  programsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <CardHeader>
                  <program.icon className="w-12 h-12 text-red-500 mb-4" />
                  <CardTitle className="text-white text-xl">{program.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {program.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Features:</h4>
                    <ul className="space-y-2">
                      {program.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-gray-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-gray-700">
                    <Badge variant="secondary" className="bg-red-600 text-white">
                      {program.requirements}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section 
        ref={howItWorksRef as any}
        className="py-16 bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 transition-all duration-1000 transform ${
            howItWorksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Getting started is simple and straightforward
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div 
                key={index}
                className={`text-center transition-all duration-1000 delay-${index * 150} transform ${
                  howItWorksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements & Application */}
      <section 
        ref={requirementsRef as any}
        className="py-16 bg-gray-950"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className={`bg-gray-800 border-gray-700 transition-all duration-1000 transform ${
              requirementsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <CardHeader className="text-center">
                <CardTitle className="text-white text-3xl mb-4">Ready to Get Started?</CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Join our growing network of successful affiliates today
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-white text-xl font-semibold mb-4">General Requirements:</h3>
                    <ul className="space-y-2">
                      {[
                        "Active online presence (social media, blog, website)",
                        "Authentic engagement with your audience",
                        "Alignment with our brand values",
                        "Commitment to quality content creation"
                      ].map((req, idx) => (
                        <li key={idx} className="flex items-start text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-semibold mb-4">What You'll Get:</h3>
                    <ul className="space-y-2">
                      {[
                        "Personalized affiliate dashboard",
                        "Marketing materials and assets",
                        "Monthly performance reports",
                        "Dedicated affiliate support team"
                      ].map((benefit, idx) => (
                        <li key={idx} className="flex items-start text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="text-center pt-8 border-t border-gray-700">
                  <Button 
                    onClick={() => setIsContactModalOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
                  >
                    Apply for Partnership
                  </Button>
                  <p className="text-gray-400 text-sm mt-4">
                    Applications are typically reviewed within 48 hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
      
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="Partnership Inquiry"
        subtitle="Tell us about your interest in joining our affiliate program"
      />
    </div>
  );
};

export default AffiliationPrograms;
