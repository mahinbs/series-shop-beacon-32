
import { Button } from '@/components/ui/button';
import { Diamond, ShoppingCart } from 'lucide-react';

const ProfileWishlist = () => {
  const wishlistItems = [
    {
      title: 'One Piece Box Set 4',
      price: '$139.99',
      imageUrl: '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png'
    },
    {
      title: 'Naruto Complete Collection',
      price: '$249.99',
      imageUrl: '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png'
    },
    {
      title: 'Attack on Titan Deluxe Edition',
      price: '$34.99',
      imageUrl: '/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png'
    }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Diamond className="w-5 h-5 text-red-400" />
          Wishlist
        </h3>
        <button className="text-red-400 hover:text-red-300 text-sm font-medium">
          View All Wishlist Items
        </button>
      </div>
      
      <div className="space-y-4">
        {wishlistItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-12 h-16 object-cover rounded-md"
            />
            <div className="flex-1">
              <h4 className="text-white font-medium text-sm">{item.title}</h4>
              <p className="text-red-400 font-semibold text-sm">{item.price}</p>
            </div>
            <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 p-2">
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileWishlist;
