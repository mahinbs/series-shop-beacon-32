import { useState, useEffect, useCallback } from 'react';
import { useSupabaseAuth } from './useSupabaseAuth';
import { CoinService } from '@/services/coinService';
import { UserCoins, CoinTransaction, CoinPackage } from '@/types/coins';
import { toast } from './use-toast';

export const useCoins = () => {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [userCoins, setUserCoins] = useState<UserCoins | null>(null);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user's coin data
  const loadUserCoins = useCallback(async () => {
    if (!user?.id) return;

    // For local storage auth users, skip Supabase loading
    if (user.id.startsWith('local-')) {
      setUserCoins({
        user_id: user.id,
        balance: 1000, // Default balance for local users
        total_earned: 1000,
        total_spent: 0,
        last_updated: new Date().toISOString()
      });
      setIsLoading(false);
      setIsInitialized(true);
      return;
    }

    setIsLoading(true);
    try {
      const coins = await CoinService.getUserCoins(user.id);
      if (coins) {
        setUserCoins(coins);
      } else {
        // Initialize if first time
        const newCoins = await CoinService.initializeUserCoins(user.id);
        if (newCoins) {
          setUserCoins(newCoins);
          toast({
            title: "Welcome to Crossed Hearts!",
            description: "You've received 50 welcome coins to get started!",
          });
        }
      }
    } catch (error) {
      console.error('Error loading user coins:', error);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [user?.id]);

  // Load transaction history
  const loadTransactions = useCallback(async () => {
    if (!user?.id) return;

    // For local storage auth users, skip Supabase loading
    if (user.id.startsWith('local-')) {
      setTransactions([]);
      return;
    }

    try {
      const history = await CoinService.getTransactionHistory(user.id, 50);
      setTransactions(history);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }, [user?.id]);

  // Load available coin packages
  const loadPackages = useCallback(async () => {
    // For local storage auth users, skip Supabase loading
    if (user?.id && user.id.startsWith('local-')) {
      setPackages([]);
      return;
    }

    try {
      const coinPackages = await CoinService.getCoinPackages();
      if (coinPackages.length > 0) {
        setPackages(coinPackages);
      } else {
        // Use default packages if none in database
        setPackages([
          {
            id: 'starter',
            name: 'Starter Pack',
            coins: 100,
            price: 0.99,
            bonus: 0
          },
          {
            id: 'popular',
            name: 'Popular Pack',
            coins: 500,
            price: 4.99,
            bonus: 50,
            popular: true
          },
          {
            id: 'best-value',
            name: 'Best Value',
            coins: 1200,
            price: 9.99,
            bonus: 200,
            bestValue: true
          },
          {
            id: 'premium',
            name: 'Premium Pack',
            coins: 2500,
            price: 19.99,
            bonus: 500
          },
          {
            id: 'ultimate',
            name: 'Ultimate Pack',
            coins: 6000,
            price: 49.99,
            bonus: 1500
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading packages:', error);
    }
  }, [user?.id]);

  // Add coins to user balance
  const addCoins = useCallback(async (amount: number, type: 'purchase' | 'earn', description: string, reference?: string) => {
    if (!user?.id) return false;

    try {
      const success = await CoinService.addCoins(user.id, amount, type, description, reference);
      if (success) {
        // Reload user coins
        await loadUserCoins();
        await loadTransactions();
        
        toast({
          title: "Coins Added!",
          description: `+${amount} coins added to your balance`,
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding coins:', error);
      toast({
        title: "Error",
        description: "Failed to add coins. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [user?.id, loadUserCoins, loadTransactions]);

  // Spend coins from user balance
  const spendCoins = useCallback(async (amount: number, description: string, reference?: string) => {
    if (!user?.id) return false;

    try {
      const success = await CoinService.spendCoins(user.id, amount, description, reference);
      if (success) {
        // Reload user coins
        await loadUserCoins();
        await loadTransactions();
        
        toast({
          title: "Coins Spent",
          description: `${amount} coins spent on ${description}`,
        });
        
        return true;
      } else {
        toast({
          title: "Insufficient Coins",
          description: "You don't have enough coins for this purchase.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error spending coins:', error);
      toast({
        title: "Error",
        description: "Failed to spend coins. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [user?.id, loadUserCoins, loadTransactions]);

  // Check if user can afford content
  const canAfford = useCallback(async (cost: number) => {
    if (!user?.id) return false;
    return await CoinService.canAfford(user.id, cost);
  }, [user?.id]);

  // Get coin statistics
  const getCoinStats = useCallback(async () => {
    if (!user?.id) return null;
    return await CoinService.getCoinStats(user.id);
  }, [user?.id]);

  // Purchase coins package
  const purchaseCoins = useCallback(async (packageId: string, paymentMethod: string) => {
    if (!user?.id) return false;

    const selectedPackage = packages.find(pkg => pkg.id === packageId);
    if (!selectedPackage) return false;

    try {
      // Record the purchase
      const purchase = {
        userId: user.id,
        packageId,
        coins: selectedPackage.coins + (selectedPackage.bonus || 0),
        price: selectedPackage.price,
        status: 'completed' as const,
        paymentMethod,
        timestamp: new Date().toISOString()
      };

      const success = await CoinService.recordPurchase(purchase);
      if (success) {
        // Add coins to user balance
        const totalCoins = selectedPackage.coins + (selectedPackage.bonus || 0);
        await addCoins(totalCoins, 'purchase', `Purchased ${selectedPackage.name}`, packageId);
        
        toast({
          title: "Purchase Successful!",
          description: `You've received ${totalCoins} coins!`,
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error purchasing coins:', error);
      toast({
        title: "Purchase Failed",
        description: "Failed to complete coin purchase. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [user?.id, packages, addCoins]);

  // Earn coins through activities
  const earnCoins = useCallback(async (amount: number, description: string, reference?: string) => {
    return await addCoins(amount, 'earn', description, reference);
  }, [addCoins]);

  // Refresh all coin data
  const refreshCoins = useCallback(async () => {
    await Promise.all([
      loadUserCoins(),
      loadTransactions(),
      loadPackages()
    ]);
  }, [loadUserCoins, loadTransactions, loadPackages]);

  // Initialize on mount
  useEffect(() => {
    if (isAuthenticated && user?.id && !isInitialized) {
      refreshCoins();
    }
  }, [isAuthenticated, user?.id, isInitialized, refreshCoins]);

  // Refresh when user changes
  useEffect(() => {
    if (user?.id) {
      refreshCoins();
    } else {
      setUserCoins(null);
      setTransactions([]);
      setIsInitialized(false);
    }
  }, [user?.id, refreshCoins]);

  return {
    // State
    userCoins,
    transactions,
    packages,
    isLoading,
    isInitialized,
    
    // Actions
    addCoins,
    spendCoins,
    earnCoins,
    canAfford,
    purchaseCoins,
    getCoinStats,
    refreshCoins,
    
    // Computed values
    balance: userCoins?.balance || 0,
    totalEarned: userCoins?.total_earned || 0,
    totalSpent: userCoins?.total_spent || 0,
  };
};
