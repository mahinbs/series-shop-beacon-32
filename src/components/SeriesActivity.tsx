
import { Heart, Clock, ShoppingCart } from 'lucide-react';

const SeriesActivity = () => {
  const recentActivity = [
    { 
      action: "Purchased", 
      item: "Jujutsu Kaisen Vol. 15", 
      date: "June 15, 2024",
      icon: ShoppingCart,
      color: "text-green-400"
    },
    { 
      action: "Reviewed", 
      item: "Chainsaw Man Vol. 11", 
      date: "June 2, 2024",
      icon: Heart,
      color: "text-red-400"
    },
    { 
      action: "Added", 
      item: "One Piece Box Set to Wishlist", 
      date: "May 28, 2024",
      icon: Heart,
      color: "text-purple-400"
    },
    { 
      action: "Received", 
      item: "Level 25", 
      date: "May 20, 2024",
      icon: Clock,
      color: "text-yellow-400"
    }
  ];

  const wishlist = [
    { title: "One Piece Box Set", price: "$299.99", image: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=80&h=120&fit=crop" },
    { title: "Naruto Complete Collection", price: "$199.99", image: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=80&h=120&fit=crop" },
    { title: "Attack on Titan Final Edition", price: "$49.99", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=80&h=120&fit=crop" }
  ];

  const recentOrders = [
    { order: "#ORD-7824", date: "June 15, 2024", items: "3 items • $119.97", status: "Delivered" },
    { order: "#ORD-7845", date: "May 29, 2024", items: "1 item • $19.99", status: "Delivered" }
  ];

  return (
    <section className="bg-gray-850 py-16">
      <div className="container mx-auto px-4">
        {/* Section content removed */}
      </div>
    </section>
  );
};

export default SeriesActivity;
