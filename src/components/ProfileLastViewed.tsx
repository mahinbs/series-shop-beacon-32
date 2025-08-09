
import { Button } from '@/components/ui/button';
import { Eye, Clock } from 'lucide-react';

const ProfileLastViewed = () => {
  const lastViewed = [
    {
      title: 'Attack on Titan Vol. 34',
      author: 'Hajime Isayama',
      imageUrl: '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png',
      viewedAt: '2 hours ago',
      progress: 75
    },
    {
      title: 'Demon Slayer Vol. 23',
      author: 'Koyoharu Gotouge',
      imageUrl: '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png',
      viewedAt: '1 day ago',
      progress: 45
    },
    {
      title: 'One Piece Vol. 105',
      author: 'Eiichiro Oda',
      imageUrl: '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png',
      viewedAt: '3 days ago',
      progress: 90
    }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-400" />
          Last Viewed
        </h3>
        <button className="text-red-400 hover:text-red-300 text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {lastViewed.map((item, index) => (
          <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-16 h-20 object-cover rounded-md"
            />
            <div className="flex-1">
              <h4 className="text-white font-medium">{item.title}</h4>
              <p className="text-gray-400 text-sm">{item.author}</p>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-gray-500 text-xs">{item.viewedAt}</span>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              Continue
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileLastViewed;
