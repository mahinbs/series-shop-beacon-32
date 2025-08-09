import { useState, useEffect } from 'react';
import { useDummyAuth } from './useDummyAuth';

interface RecommendedProduct {
  id: string;
  title: string;
  author: string;
  price: string;
  coins: string;
  imageUrl: string;
  genre: string[];
  rating: number;
  type: string;
  isPersonalized?: boolean;
}

export const useRecommendations = () => {
  const { user } = useDummyAuth();
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Default recommendations for non-logged-in users
  const defaultRecommendations: RecommendedProduct[] = [
    {
      id: "1",
      title: "Tokyo Ghoul Vol. 14",
      author: "Sui Ishida",
      price: "$12.99",
      coins: "1299 coins",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      genre: ["horror", "action"],
      rating: 5,
      type: "Digital"
    },
    {
      id: "2",
      title: "Demon Slayer Tanjiro Figure",
      author: "Koyoharu Gotouge",
      price: "$49.99",
      coins: "4999 coins",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      genre: ["action", "supernatural"],
      rating: 5,
      type: "Merchandise"
    },
    {
      id: "3",
      title: "Naruto Vol. 72",
      author: "Masashi Kishimoto",
      price: "$9.99",
      coins: "999 coins",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      genre: ["action", "adventure"],
      rating: 4,
      type: "Digital"
    },
    {
      id: "4",
      title: "My Hero Academia Vol. 35",
      author: "Kohei Horikoshi",
      price: "$11.99",
      coins: "1199 coins",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      genre: ["action", "superhero"],
      rating: 5,
      type: "Digital"
    },
    {
      id: "5",
      title: "Attack on Titan Complete Set",
      author: "Hajime Isayama",
      price: "$199.99",
      coins: "19999 coins",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      genre: ["action", "drama"],
      rating: 5,
      type: "Bundle"
    },
    {
      id: "6",
      title: "One Piece Vol. 105",
      author: "Eiichiro Oda",
      price: "$13.99",
      coins: "1399 coins",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      genre: ["adventure", "comedy"],
      rating: 5,
      type: "Digital"
    },
    {
      id: "7",
      title: "Jujutsu Kaisen Vol. 20",
      author: "Gege Akutami",
      price: "$10.99",
      coins: "1099 coins",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      genre: ["supernatural", "action"],
      rating: 5,
      type: "Digital"
    },
    {
      id: "8",
      title: "Chainsaw Man Vol. 12",
      author: "Tatsuki Fujimoto",
      price: "$12.99",
      coins: "1299 coins",
      imageUrl: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png",
      genre: ["horror", "action"],
      rating: 4,
      type: "Digital"
    }
  ];

  // Generate personalized recommendations based on user data
  const generatePersonalizedRecommendations = (): RecommendedProduct[] => {
    if (!user) return defaultRecommendations;

    // For now, just return default recommendations with personalized flag
    // In a real app, this would use user data from Supabase to personalize
    return defaultRecommendations.map(item => ({
      ...item,
      isPersonalized: true
    }));
  };

  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      if (user) {
        setRecommendations(generatePersonalizedRecommendations());
      } else {
        setRecommendations(defaultRecommendations);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  return {
    recommendations,
    loading,
    isPersonalized: !!user
  };
};