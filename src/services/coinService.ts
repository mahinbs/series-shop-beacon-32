import { supabase } from '@/integrations/supabase/client';
import { UserCoins, CoinTransaction, CoinPurchase, CoinPackage } from '@/types/coins';

export class CoinService {
  // Cache to prevent multiple API calls
  private static coinPackagesCache: CoinPackage[] | null = null;
  private static cacheTimestamp: number = 0;
  private static CACHE_DURATION = 30 * 1000; // 30 seconds (reduced for live data)

  // Clear cache to force fresh data
  static clearCache(): void {
    this.coinPackagesCache = null;
    this.cacheTimestamp = 0;
    console.log('🔄 Coin service cache cleared');
  }

  // Get user's coin balance
  static async getUserCoins(userId: string): Promise<UserCoins | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('user_coins')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // If table doesn't exist (404), return null without logging error
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table') || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          return null;
        }
        console.error('Error fetching user coins:', error);
        return null;
      }

      return data as UserCoins;
    } catch (error) {
      console.error('Error in getUserCoins:', error);
      return null;
    }
  }

  // Initialize user coins (first time setup)
  static async initializeUserCoins(userId: string): Promise<UserCoins | null> {
    try {
      const initialCoins: Partial<UserCoins> = {
        user_id: userId,
        balance: 50, // Welcome bonus
        total_earned: 50,
        total_spent: 0,
        last_updated: new Date().toISOString()
      };

      const { data, error } = await (supabase as any)
        .from('user_coins')
        .insert([initialCoins])
        .select()
        .single();

      if (error) {
        // If table doesn't exist (404), return null without logging error
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table') || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          return null;
        }
        console.error('Error initializing user coins:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in initializeUserCoins:', error);
      return null;
    }
  }

  // Add coins to user balance
  static async addCoins(userId: string, amount: number, type: 'purchase' | 'earn', description: string, reference?: string): Promise<boolean> {
    try {
      // Get current balance
      const currentCoins = await this.getUserCoins(userId);
      if (!currentCoins) {
        // Initialize if first time
        await this.initializeUserCoins(userId);
      }

      // Update balance
      const { error: updateError } = await (supabase as any)
        .from('user_coins')
        .update({
          balance: (currentCoins?.balance || 0) + amount,
          total_earned: type === 'earn' ? (currentCoins?.total_earned || 0) + amount : (currentCoins?.total_earned || 0),
          last_updated: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating coin balance:', updateError);
        return false;
      }

      // Record transaction
      const transaction: Partial<CoinTransaction> = {
        user_id: userId,
        type,
        amount,
        balance: (currentCoins?.balance || 0) + amount,
        description,
        reference,
        timestamp: new Date().toISOString()
      };

      const { error: transactionError } = await (supabase as any)
        .from('coin_transactions')
        .insert([transaction]);

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
        // Balance was updated, so we'll continue
      }

      return true;
    } catch (error) {
      console.error('Error in addCoins:', error);
      return false;
    }
  }

  // Spend coins from user balance
  static async spendCoins(userId: string, amount: number, description: string, reference?: string): Promise<boolean> {
    try {
      const currentCoins = await this.getUserCoins(userId);
      if (!currentCoins || currentCoins.balance < amount) {
        return false; // Insufficient coins
      }

      // Update balance
      const { error: updateError } = await (supabase as any)
        .from('user_coins')
        .update({
          balance: currentCoins.balance - amount,
          total_spent: currentCoins.total_spent + amount,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating coin balance:', updateError);
        return false;
      }

      // Record transaction
      const transaction: Partial<CoinTransaction> = {
        user_id: userId,
        type: 'spend',
        amount: -amount,
        balance: currentCoins.balance - amount,
        description,
        reference,
        timestamp: new Date().toISOString()
      };

      const { error: transactionError } = await (supabase as any)
        .from('coin_transactions')
        .insert([transaction]);

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
        // Balance was updated, so we'll continue
      }

      return true;
    } catch (error) {
      console.error('Error in spendCoins:', error);
      return false;
    }
  }

  // Get user's transaction history
  static async getTransactionHistory(userId: string, limit: number = 20): Promise<CoinTransaction[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('coin_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        // If table doesn't exist (404), return empty array without logging error
        if (error.code === 'PGRST116' || error.message?.includes('relation "coin_transactions" does not exist')) {
          console.warn('Coin system tables not found. Please run the database migration.');
          return [];
        }
        console.error('Error fetching transaction history:', error);
        return [];
      }

      return (data as CoinTransaction[]) || [];
    } catch (error) {
      console.error('Error in getTransactionHistory:', error);
      return [];
    }
  }

  // Get all transactions (for admin view)
  static async getAllTransactions(limit: number = 50): Promise<CoinTransaction[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('coin_transactions')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('relation "coin_transactions" does not exist')) {
          console.warn('Coin system tables not found. Please run the database migration.');
          return [];
        }
        console.error('Error fetching all transactions:', error);
        return [];
      }

      const result = (data as any)?.map((transaction: any) => ({
        ...transaction,
        user_name: `User ${transaction.user_id.slice(0, 8)}`, // Use partial UUID as name
        user_email: `${transaction.user_id.slice(0, 8)}@example.com` // Generate email from UUID
      })) || [];

      console.log('✅ Successfully loaded transactions from Supabase:', result.length, 'transactions');
      return result as CoinTransaction[];
    } catch (error) {
      console.error('Error in getAllTransactions:', error);
      return [];
    }
  }

  // Record a coin purchase
  static async recordPurchase(purchase: Partial<CoinPurchase>): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('coin_purchases')
        .insert([purchase]);

      if (error) {
        console.error('Error recording purchase:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in recordPurchase:', error);
      return false;
    }
  }

  // Get available coin packages
  static async getCoinPackages(): Promise<CoinPackage[]> {
    try {
      // Check cache first
      const now = Date.now();
      if (this.coinPackagesCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
        return this.coinPackagesCache;
      }

      const { data, error } = await (supabase as any)
        .from('coin_packages')
        .select('*')
        .order('price', { ascending: true });

      if (error) {
        // If table doesn't exist (404), return empty array without logging error
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table') || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('⚠️ Coin packages table not found. Please run the database migration.');
          return [];
        }
        console.error('Error fetching coin packages:', error);
        return [];
      }

      // Cache the result
      this.coinPackagesCache = data || [];
      this.cacheTimestamp = now;
      
      console.log('✅ Successfully loaded coin packages from Supabase:', this.coinPackagesCache.length, 'packages');
      return this.coinPackagesCache;
    } catch (error) {
      console.error('Error in getCoinPackages:', error);
      return [];
    }
  }

  // Get all users with coins
  static async getAllUsersWithCoins(): Promise<Array<{
    user_id: string;
    user_name: string;
    balance: number;
    total_earned: number;
    total_spent: number;
  }>> {
    try {
      const { data, error } = await (supabase as any)
        .from('user_coins')
        .select(`
          user_id,
          balance,
          total_earned,
          total_spent
        `);

      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          console.warn('⚠️ User coins table not found. Please run the database migration.');
          return [];
        }
        console.error('Error fetching all users with coins:', error);
        return [];
      }

      const result = data?.map(item => ({
        user_id: item.user_id,
        user_name: `User ${item.user_id.slice(0, 8)}`, // Use partial UUID as name
        balance: item.balance,
        total_earned: item.total_earned,
        total_spent: item.total_spent
      })) || [];

      console.log('✅ Successfully loaded users with coins from Supabase:', result.length, 'users');
      return result;
    } catch (error) {
      console.error('Error in getAllUsersWithCoins:', error);
      return [];
    }
  }

  // Check if user can afford content
  static async canAfford(userId: string, cost: number): Promise<boolean> {
    try {
      const userCoins = await this.getUserCoins(userId);
      return userCoins ? userCoins.balance >= cost : false;
    } catch (error) {
      console.error('Error in canAfford:', error);
      return false;
    }
  }

  // Get user's coin statistics
  static async getCoinStats(userId: string): Promise<{
    balance: number;
    totalEarned: number;
    totalSpent: number;
    availableForSpending: number;
  } | null> {
    try {
      const userCoins = await this.getUserCoins(userId);
      if (!userCoins) return null;

      return {
        balance: userCoins.balance,
        totalEarned: userCoins.total_earned,
        totalSpent: userCoins.total_spent,
        availableForSpending: userCoins.balance
      };
    } catch (error) {
      console.error('Error in getCoinStats:', error);
      return null;
    }
  }
}
