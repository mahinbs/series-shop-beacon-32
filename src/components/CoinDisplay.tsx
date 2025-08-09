import { useState } from 'react';
import { Coins, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function CoinDisplay() {
  const [coins, setCoins] = useState(1250); // Mock coin balance
  const navigate = useNavigate();

  const coinPackages = [
    { amount: 100, price: 0.99, bonus: 0 },
    { amount: 500, price: 4.99, bonus: 50 },
    { amount: 1000, price: 9.99, bonus: 150 },
    { amount: 2500, price: 19.99, bonus: 500 },
    { amount: 5000, price: 39.99, bonus: 1000 },
  ];

  const purchaseCoins = (packageItem: typeof coinPackages[0]) => {
    // Navigate to coin purchase page with package data
    navigate('/coin-purchase', { 
      state: { 
        package: packageItem 
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-gray-300 hover:text-white flex items-center space-x-2"
        >
          <Coins className="h-5 w-5 text-yellow-400" />
          <span className="text-sm font-medium">{coins.toLocaleString()}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Coins className="h-6 w-6 text-yellow-400" />
            <span>Purchase Coins</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Buy coins to unlock premium content and chapters
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {coinPackages.map((pkg, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-yellow-500/50 transition-colors"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <Coins className="h-4 w-4 text-yellow-400" />
                  <span className="font-semibold">{pkg.amount.toLocaleString()}</span>
                  {pkg.bonus > 0 && (
                    <span className="text-green-400 text-sm">+{pkg.bonus} bonus</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">${pkg.price}</p>
              </div>
              <Button
                onClick={() => purchaseCoins(pkg)}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
              >
                Buy
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Coins className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-300 font-semibold">Current Balance</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{coins.toLocaleString()} coins</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}