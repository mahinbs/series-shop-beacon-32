
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
  CheckCircle,
  X
} from 'lucide-react';

const AffiliationPrograms = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
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
      title: "COLLECTOR'S CIRCLE",
      icon: BookOpen,
      description: "Step into the Collector's Circle, an exclusive membership designed for readers and collectors who love being first in line for something truly special. Think of it as your all-access pass to the world of Crossed Hearts — where stories, surprises, and community meet.",
      features: [
        "Early Access & Exclusive Goodies – Enjoy a 48-hour head start on every new release",
        "Pre-Order with Confidence – Secure your editions without the fear of missing out",
        "Members-Only Collectibles – Unlock limited pre-order bonuses available only on our website",
        "Get sneak peeks of upcoming volumes in our private Discord",
        "Take part in virtual Q&As with authors and the Crossed Hearts team",
        "Beta-read upcoming chapters and help shape future stories and licenses",
        "Stay ahead with our members-only newsletter, featuring the latest licensing, pre-order, and release updates",
        "Receive chances to win limited signed copies of your favourite series",
        "Join in on exclusive giveaways and seasonal surprises",
        "20% off all pre-orders (discounts apply only during the pre-order period)",
        "Birthday month perks (up to 10% off on all orders) and priority customer support"
      ],
      requirements: "Join the Circle - and always be one step ahead in the story"
    },
    {
      title: "AMBASSADOR'S PROGRAM FOR CONTENT CREATORS",
      icon: Heart,
      description: "Share Your Love for Stories. Earn Rewards. At Crossed Hearts, we believe that every great story deserves to be shared - and we want to celebrate the creators who help us bring books closer to readers around the world.",
      features: [
        "Our Ambassador Program is open to book bloggers, reviewers, and content creators of all kinds",
        "As an ambassador, you'll earn commissions by promoting our titles to your audience",
        "Enjoy early access to new releases",
        "Exclusive PR kits",
        "Invitations to launch events",
        "Special opportunities to collaborate"
      ],
      requirements: "Interested? Reach out to us at hello@thecrossedhearts.com to learn more and join our circle of storytellers"
    },
    {
      title: "RETAILER PARTNERSHIPS",
      icon: Star,
      description: "Our Retailer Program is designed to give bookstores, comic shops, and retailers direct access to exclusive inventory and premium support from Crossed Hearts.",
      features: [
        "Direct Supply – Inventory shipped directly from us to your store",
        "Exclusive Editions & Pre-Order Bonuses – Early access to limited print editions, standees, promotional freebies, and special pre-order incentives",
        "Marketing Partnership – Co-branded campaigns, priority promotional materials, and support tailored to boost visibility and sales",
        "In-Store Experiences – Opportunities to host Crossed Hearts author signing events and other promotional activities at your premises"
      ],
      requirements: "Interested in partnering with us? Join the Crossed Hearts Retailer Program by contacting us at sales@thecrossedhearts.com"
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
                className={`bg-gray-800 border-gray-700 aspect-square flex flex-col transition-all duration-1000 delay-${index * 200} transform ${
                  programsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <CardHeader className="flex-shrink-0 pb-4">
                  <program.icon className="w-12 h-12 text-red-500 mb-4" />
                  <CardTitle className="text-white text-xl mb-2">{program.title}</CardTitle>
                  <CardDescription className="text-gray-300 text-sm line-clamp-3">
                    {program.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-6 pt-0">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {program.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start text-gray-300 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                      {program.features.length > 3 && (
                        <li className="text-gray-400 text-xs">
                          +{program.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-700">
                    <Button 
                      onClick={() => setSelectedProgram(program)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium h-10"
                    >
                      Read More
                    </Button>
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

      {/* Program Details Popup */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <selectedProgram.icon className="w-12 h-12 text-red-500" />
                  <h2 className="text-2xl font-bold text-white">{selectedProgram.title}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedProgram(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {selectedProgram.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-white text-xl font-semibold mb-4">Features:</h3>
                  <ul className="space-y-3">
                    {selectedProgram.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-6 border-t border-gray-700">
                  <div className="bg-red-600 text-white p-4 rounded-lg text-center">
                    <p className="font-medium">{selectedProgram.requirements}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliationPrograms;
