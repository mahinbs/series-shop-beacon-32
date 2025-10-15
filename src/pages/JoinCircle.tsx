import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CircleService } from '@/services/circleService';
import { ArrowLeft, Users, Heart } from 'lucide-react';

export default function JoinCircle() {
  const [email, setEmail] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleJoinCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({ 
        title: 'Email Required', 
        description: 'Please enter your email address', 
        variant: 'destructive' 
      });
      return;
    }

    setIsJoining(true);
    try {
      // Create a global circle if it doesn't exist
      let globalCircle = await CircleService.getGlobalCircle();
      if (!globalCircle) {
        globalCircle = await CircleService.createGlobalCircle();
      }

      // Join the global circle - this saves to database, NOT email
      await CircleService.joinCircleWithEmail(globalCircle.id, email.trim());
      
      toast({ 
        title: 'Welcome to the Circle!', 
        description: 'You\'ve successfully joined our collector\'s circle.' 
      });
      
      // Redirect back to comics page
      navigate('/comics');
    } catch (error) {
      console.error('Failed to join circle:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to join circle. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/comics')}
                className="text-gray-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Comics
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white font-bold text-xl">CROSSED HEARTS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Heart className="w-8 h-8 text-red-500 absolute -top-2 -left-2" />
              <Heart className="w-8 h-8 text-black absolute -top-1 -left-1" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Join Our Collector's Circle
          </h1>
          <p className="text-red-400 text-lg max-w-2xl mx-auto">
            Crossed Hearts Collector's Circle provides you with latest updates on your favourite titles.
          </p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm max-w-md mx-auto">
          <CardContent className="p-8">
            <form onSubmit={handleJoinCircle} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isJoining}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
              >
                {isJoining ? (
                  <>
                    <Users className="w-4 h-4 mr-2 animate-spin" />
                    Joining Circle...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Join Circle
                  </>
                )}
              </Button>
            </form>

            <p className="text-gray-400 text-sm text-center mt-6">
              No spam, unsubscribe at any time. Your privacy is important to us.
            </p>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-red-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Exclusive Access</h3>
            <p className="text-gray-400 text-sm">
              Get early access to new episodes and special content
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-red-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Community</h3>
            <p className="text-gray-400 text-sm">
              Join a community of passionate collectors and readers
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-red-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Updates</h3>
            <p className="text-gray-400 text-sm">
              Stay informed about new releases and special offers
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black/50 backdrop-blur-sm border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <Heart className="w-6 h-6 text-red-500 absolute -top-1 -left-1" />
                <Heart className="w-6 h-6 text-black absolute -top-0.5 -left-0.5" />
              </div>
              <span className="text-white font-bold text-lg ml-2">CROSSED HEARTS</span>
            </div>
            <p className="text-gray-400 text-sm">
              A global publishing house specialising in the English localization of Japanese manga and Korean webcomics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

