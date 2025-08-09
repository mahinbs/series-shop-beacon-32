
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProfileActivity from './ProfileActivity';
import ProfileLastViewed from './ProfileLastViewed';
import ProfileOrderHistory from './ProfileOrderHistory';
import ProfileWishlist from './ProfileWishlist';
import AccountSettingsModal from './AccountSettingsModal';

const ProfileTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'overview';

  const handleTabChange = (value: string) => {
    if (value === 'wishlist') {
      navigate('/wishlist');
      return;
    }
    
    if (value === 'overview') {
      searchParams.delete('tab');
    } else {
      searchParams.set('tab', value);
    }
    setSearchParams(searchParams);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-gray-800">
        <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-800">
          Overview
        </TabsTrigger>
        <TabsTrigger value="orders" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-800">
          Orders
        </TabsTrigger>
        <TabsTrigger value="wishlist" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-800">
          Wishlist
        </TabsTrigger>
        <TabsTrigger value="settings" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-800">
          Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ProfileActivity />
            <ProfileLastViewed />
          </div>
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <AccountSettingsModal />
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="orders" className="mt-8">
        <ProfileOrderHistory />
      </TabsContent>


      <TabsContent value="settings" className="mt-8">
        <div className="max-w-2xl">
          <AccountSettingsModal />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
