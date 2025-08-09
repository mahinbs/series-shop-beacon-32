
import { ShoppingBag, Heart, Trophy, Target } from 'lucide-react';

const ProfileActivity = () => {
  const activities = [
    {
      icon: ShoppingBag,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-500/10',
      title: 'Purchased Jujutsu Kaisen Vol. 15',
      date: 'June 10, 2025',
      type: 'purchase'
    },
    {
      icon: Heart,
      iconColor: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      title: 'Added One Piece Box Set to Wishlist',
      date: 'May 28, 2025',
      type: 'wishlist'
    },
    {
      icon: Target,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      title: 'Reached Level 42',
      date: 'May 20, 2025',
      type: 'achievement'
    },
    {
      icon: Trophy,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      title: 'Earned Collector Badge',
      date: 'May 15, 2025',
      type: 'badge'
    }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
        <button className="text-red-400 hover:text-red-300 text-sm font-medium">
          View All Activity
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const IconComponent = activity.icon;
          return (
            <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors">
              <div className={`${activity.bgColor} ${activity.iconColor} p-2 rounded-full flex-shrink-0`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{activity.title}</p>
                <p className="text-gray-400 text-sm">{activity.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileActivity;
