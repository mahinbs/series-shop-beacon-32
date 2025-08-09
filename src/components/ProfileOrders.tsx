
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';

const ProfileOrders = () => {
  const recentOrders = [
    {
      id: '#ORD-7829',
      date: 'June 10, 2025',
      items: 3,
      total: '$45.97',
      status: 'Delivered'
    },
    {
      id: '#ORD-7645',
      date: 'May 22, 2025',
      items: 1,
      total: '$19.99',
      status: 'Delivered'
    }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-green-400" />
          Recent Orders
        </h3>
        <button className="text-red-400 hover:text-red-300 text-sm font-medium">
          View All Orders
        </button>
      </div>
      
      <div className="space-y-4">
        {recentOrders.map((order, index) => (
          <div key={index} className="p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{order.id}</span>
              <Badge className="bg-green-600 text-white">
                {order.status}
              </Badge>
            </div>
            <div className="text-gray-400 text-sm space-y-1">
              <p>{order.date}</p>
              <p>{order.items} items • {order.total}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileOrders;
