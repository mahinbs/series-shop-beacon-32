
import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Trophy, Target, Loader2, Activity } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const ProfileActivity = () => {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user || !isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Note: You'll need to create an activity tracking system in your database
        // For now, this shows an empty state
        setActivities([]);
        setError(null);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities. Please try again later.');
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user, isAuthenticated]);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <p className="text-blue-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Please sign in to view your activity.</p>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No recent activity.</p>
          <p className="text-gray-500 text-sm mt-2">Start shopping to see your activity here!</p>
        </div>
      </div>
    );
  }

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
