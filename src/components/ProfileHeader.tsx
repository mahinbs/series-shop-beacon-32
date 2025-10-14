
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit2, Share2, Trophy, Star, Users, BookOpen, Upload } from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useWishlist } from '@/hooks/useWishlist';
import { useCoins } from '@/hooks/useCoins';
import { AuthService } from '@/services/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ProfileHeader = () => {
  const { user, profile, isAuthenticated } = useSupabaseAuth();
  const { wishlist } = useWishlist();
  const { balance } = useCoins();
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [userStats, setUserStats] = useState({
    orders: 0,
    joinDate: '',
    handle: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  // Generate unique handle based on name
  const generateHandle = (name: string) => {
    if (!name) return '@user';
    const baseHandle = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `@${baseHandle}`;
  };

  // Resolve display name from auth metadata or profile/email
  const getDisplayName = () => {
    const meta = (user as any)?.user_metadata || {};
    return (
      meta.full_name ||
      meta.name ||
      meta.display_name ||
      profile?.full_name ||
      (user?.email ? user.email.split('@')[0] : '') ||
      'User'
    );
  };

  // Keep selectedAvatar in sync with profile value (persists after refresh)
  useEffect(() => {
    if (profile?.avatar_url) {
      setSelectedAvatar(profile.avatar_url);
    } else {
      setSelectedAvatar('');
    }
  }, [profile?.avatar_url]);

  // On initial load (and after refresh), fetch avatar_url directly if missing
  useEffect(() => {
    const ensureAvatarLoaded = async () => {
      if (!user?.id) return;
      if (selectedAvatar) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('user_id', user.id)
          .single();
        if (!error && data?.avatar_url) {
          setSelectedAvatar(data.avatar_url);
        }
      } catch (_e) {
        // ignore
      }
    };
    ensureAvatarLoaded();
  }, [user?.id, selectedAvatar]);

  // Load user stats
  useEffect(() => {
    const loadUserStats = async () => {
      if (!user || !isAuthenticated) return;

      try {
        // Get orders count
        const orders = await AuthService.getOrders(user.id);
        
        // Get join date from user creation
        const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : '';

        // Generate handle from display name
        const handle = generateHandle(getDisplayName());

        setUserStats({
          orders: orders.length,
          joinDate,
          handle
        });

        // Set avatar from profile
        if (profile?.avatar_url) {
          setSelectedAvatar(profile.avatar_url);
        }
      } catch (error) {
        console.error('Error loading user stats:', error);
      }
    };

    loadUserStats();
  }, [user, profile, isAuthenticated]);

  // No preset avatar selection; users upload from their device only

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      // Upload to Supabase Storage with user-specific folder
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('profile-pics')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pics')
        .getPublicUrl(fileName);

      setSelectedAvatar(publicUrl);
      await updateProfileAvatar(publicUrl);
      
      // Force refresh the page to reload profile data
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const updateProfileAvatar = async (avatarUrl: string) => {
    if (!user) return;
    
    try {
      // ALWAYS use UPSERT to avoid duplicates - this will update if exists, create if not
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'  // Use user_id as the conflict resolution key
        });
        
      if (error) throw error;
      
      console.log('✅ Profile avatar upserted successfully');
    } catch (error) {
      console.error('Error upserting profile avatar:', error);
      throw error;
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Profile Image */}
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-red-500">
            {(selectedAvatar || profile?.avatar_url) && (
              <AvatarImage src={selectedAvatar || (profile?.avatar_url || '')} alt={profile?.full_name || 'User'} />
            )}
            <AvatarFallback className="text-2xl">
              {(profile?.full_name || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
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
              <div className="space-y-4">
                {/* File Upload Option */}
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-300 text-sm mb-2">Upload your own picture</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? 'Uploading...' : 'Choose File'}
                  </label>
                </div>
                
                {/* No preset avatars; user must upload their own image */}
              </div>
            </DialogContent>
          </Dialog>

          <div className="absolute -bottom-2 -left-2 bg-red-600 rounded-full w-8 h-8 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-white" />
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-white mb-2">
            {getDisplayName()}
          </h2>
          <p className="text-red-400 font-semibold mb-1">
            {userStats.handle} • Joined {userStats.joinDate}
          </p>
          {user?.email && (
            <p className="text-gray-400 text-sm mb-4">{user.email}</p>
          )}
          {/* XP hidden as requested */}
          {/* <p className="text-gray-400 mb-4">4250/5000 XP</p> */}
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{balance}</div>
              <div className="text-gray-400 text-sm">Coins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{wishlist.length}</div>
              <div className="text-gray-400 text-sm">Wishlist</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userStats.orders}</div>
              <div className="text-gray-400 text-sm">Orders</div>
            </div>
            {/* Badges commented out as requested */}
            {/* <div className="text-center">
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-gray-400 text-sm">Badges</div>
            </div> */}
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
