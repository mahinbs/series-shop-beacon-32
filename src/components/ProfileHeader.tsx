
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit2, Share2, Trophy, Star, Users, BookOpen } from 'lucide-react';
import EditProfileModal from './EditProfileModal';

const ProfileHeader = () => {
  const [selectedAvatar, setSelectedAvatar] = useState('/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png');
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  const preApprovedAvatars = [
    '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png',
    '/lovable-uploads/26efc76c-fa83-4369-8d8d-354eab1433e6.png',
    '/lovable-uploads/503cc23b-a28f-4564-86f9-53896fa75f10.png',
    '/lovable-uploads/6fb6d014-0083-4f09-95a2-0416443da769.png',
    '/lovable-uploads/781ea40e-866e-4ee8-9bf7-862a42bb8716.png',
    '/lovable-uploads/7b8f7dcc-b06f-4c89-b5af-906cd241ae0c.png'
  ];

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    setIsAvatarDialogOpen(false);
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Profile Image */}
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-red-500">
            <AvatarImage src={selectedAvatar} alt="Alex Johnson" />
            <AvatarFallback className="text-2xl">AJ</AvatarFallback>
          </Avatar>
          
          <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
            <DialogTrigger asChild>
              <button className="absolute -bottom-2 -right-2 bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                <Edit2 className="w-4 h-4 text-white" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Choose Profile Picture</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-4 p-4">
                {preApprovedAvatars.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => handleAvatarSelect(avatar)}
                    className={`relative rounded-lg overflow-hidden hover:ring-2 hover:ring-red-500 transition-all ${
                      selectedAvatar === avatar ? 'ring-2 ring-red-500' : ''
                    }`}
                  >
                    <img 
                      src={avatar} 
                      alt={`Avatar option ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <div className="absolute -bottom-2 -left-2 bg-red-600 rounded-full w-8 h-8 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-white" />
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-white mb-2">Alex Johnson</h2>
          <p className="text-red-400 font-semibold mb-1">@alexi • Joined March 15, 2023</p>
          <p className="text-gray-400 mb-4">4250/5000 XP</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">2500</div>
              <div className="text-gray-400 text-sm">Coins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24</div>
              <div className="text-gray-400 text-sm">Wishlist</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">18</div>
              <div className="text-gray-400 text-sm">Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-gray-400 text-sm">Badges</div>
            </div>
          </div>
          
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <EditProfileModal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
