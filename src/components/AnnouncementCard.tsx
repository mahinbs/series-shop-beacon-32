import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Diamond, Club, Spade, Calendar } from 'lucide-react';

interface AnnouncementCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  symbol?: 'heart' | 'diamond' | 'club' | 'spade';
  imageUrl?: string;
}

const SymbolIcon = ({ symbol }: { symbol: AnnouncementCardProps['symbol'] }) => {
  const iconProps = { className: "w-5 h-5" };
  
  switch (symbol) {
    case 'heart':
      return <Heart {...iconProps} className="w-5 h-5 text-red-500" />;
    case 'diamond':
      return <Diamond {...iconProps} className="w-5 h-5 text-blue-400" />;
    case 'club':
      return <Club {...iconProps} className="w-5 h-5 text-green-500" />;
    case 'spade':
      return <Spade {...iconProps} className="w-5 h-5 text-purple-500" />;
    default:
      return <Heart {...iconProps} className="w-5 h-5 text-red-500" />;
  }
};

export function AnnouncementCard({ 
  title, 
  excerpt, 
  date, 
  category, 
  symbol = 'heart',
  imageUrl 
}: AnnouncementCardProps) {
  return (
    <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 hover:scale-105 hover:shadow-lg">
      {imageUrl && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <SymbolIcon symbol={symbol} />
            <Badge 
              variant="secondary" 
              className={`text-xs ${
                symbol === 'heart' ? 'bg-red-900/30 text-red-300' :
                symbol === 'diamond' ? 'bg-blue-900/30 text-blue-300' :
                symbol === 'club' ? 'bg-green-900/30 text-green-300' :
                'bg-purple-900/30 text-purple-300'
              }`}
            >
              {category}
            </Badge>
          </div>
          
          <div className="flex items-center text-xs text-gray-400">
            <Calendar className="w-3 h-3 mr-1" />
            {date}
          </div>
        </div>
        
        <CardTitle className="text-white text-lg leading-tight line-clamp-2">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <SymbolIcon symbol={symbol} />
            <span className="text-xs text-gray-500">Cross Hearts</span>
          </div>
          
          <div className="flex space-x-1">
            <Heart className="w-3 h-3 text-red-500/30" />
            <Diamond className="w-3 h-3 text-blue-400/30" />
            <Club className="w-3 h-3 text-green-500/30" />
            <Spade className="w-3 h-3 text-purple-500/30" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}