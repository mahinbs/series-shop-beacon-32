
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, BookOpen, Star, Share2 } from 'lucide-react';

const SeriesProfile = () => {
  return (
    <section className="bg-gray-900 py-16 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                alt="Alex Johnson"
                className="w-32 h-32 rounded-full border-4 border-red-500"
              />
              <div className="absolute -bottom-2 -right-2 bg-red-600 rounded-full w-8 h-8 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">Alex Johnson</h2>
              <p className="text-red-400 font-semibold mb-4">Manga Collector's Gold Member</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">2500</div>
                  <div className="text-gray-400 text-sm">Reading</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24</div>
                  <div className="text-gray-400 text-sm">Favorites</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">18</div>
                  <div className="text-gray-400 text-sm">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-gray-400 text-sm">Badges</div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                <Badge className="bg-yellow-600 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Top Reviewer
                </Badge>
                <Badge className="bg-blue-600 text-white">
                  <Users className="w-3 h-3 mr-1" />
                  Early Adopter
                </Badge>
                <Badge className="bg-purple-600 text-white">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Speed Reader
                </Badge>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View All Activity
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeriesProfile;
