import { supabase } from '@/integrations/supabase/client';
import { UserCoins, CoinTransaction, CoinPurchase, CoinPackage } from '@/types/coins';

export class CoinService {
  // Get user's coin balance
  static async getUserCoins(userId: string): Promise<UserCoins | null> {
    try {
      const { data, error } = await supabase
        .from('user_coins')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // If table doesn't exist (404), return null without logging error
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          console.log('⚠️ Coin system tables not found, using local storage fallback');
          return null;
        }
        console.error('Error fetching user coins:', error);
        return null;
      }

      return data;
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

      const { data, error } = await supabase
        .from('user_coins')
        .insert([initialCoins])
        .select()
        .single();

      if (error) {
        // If table doesn't exist (404), return null without logging error
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          console.log('⚠️ Coin system tables not found, using local storage fallback');
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
      const { error: updateError } = await supabase
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

      const { error: transactionError } = await supabase
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
      const { error: updateError } = await supabase
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

      const { error: transactionError } = await supabase
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
      const { data, error } = await supabase
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

      return data || [];
    } catch (error) {
      console.error('Error in getTransactionHistory:', error);
      return [];
    }
  }

  // Record a coin purchase
  static async recordPurchase(purchase: Partial<CoinPurchase>): Promise<boolean> {
    try {
      const { error } = await supabase
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
      const { data, error } = await supabase
        .from('coin_packages')
        .select('*')
        .order('price', { ascending: true });

      if (error) {
        // If table doesn't exist (404), return empty array without logging error
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          console.log('⚠️ Coin system tables not found, using local storage fallback');
          return [];
        }
        console.error('Error fetching coin packages:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCoinPackages:', error);
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
