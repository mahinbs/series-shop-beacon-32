import { useState } from 'react';
import { Coins, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCoins } from '@/hooks/useCoins';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CoinDisplay = () => {
  const { user, isAuthenticated } = useSupabaseAuth();
  const { balance, isLoading } = useCoins();
  const [showTooltip, setShowTooltip] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
        <TooltipTrigger asChild>
          <Link to="/coins">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 transition-all duration-300 px-3"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Coins className="w-4 h-4" />
              <span className="font-semibold">
                {isLoading ? '...' : balance.toLocaleString()}
              </span>
              <Plus className="w-3 h-3 text-green-400" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-yellow-900 border-yellow-600 text-yellow-100">
          <div className="text-center">
            <p className="font-semibold">Your Coin Balance</p>
            <p className="text-sm text-yellow-200">
              {balance.toLocaleString()} coins available
            </p>
            <p className="text-xs text-yellow-300 mt-1">
              Click to manage coins
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CoinDisplay;
