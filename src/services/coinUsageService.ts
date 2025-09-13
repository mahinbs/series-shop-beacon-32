import { supabase } from '@/integrations/supabase/client';
import { CoinService } from './coinService';

export interface CoinUsageRequest {
  userId: string;
  contentId: string;
  contentType: 'episode' | 'book' | 'series' | 'premium_feature';
  coinCost: number;
  description: string;
  reference?: string;
}

export interface CoinUsageResult {
  success: boolean;
  newBalance?: number;
  error?: string;
  transactionId?: string;
}

export class CoinUsageService {
  // Check if user can afford content
  static async canUserAfford(userId: string, coinCost: number): Promise<boolean> {
    try {
      const userCoins = await CoinService.getUserCoins(userId);
      if (!userCoins) {
        return false;
      }
      return userCoins.balance >= coinCost;
    } catch (error) {
      console.error('Error checking user affordability:', error);
      return false;
    }
  }

  // Spend coins to unlock content
  static async spendCoinsForContent(usageRequest: CoinUsageRequest): Promise<CoinUsageResult> {
    try {
      // Check if user can afford
      const canAfford = await this.canUserAfford(usageRequest.userId, usageRequest.coinCost);
      if (!canAfford) {
        return {
          success: false,
          error: 'Insufficient coins'
        };
      }

      // Spend the coins
      const success = await CoinService.spendCoins(
        usageRequest.userId,
        usageRequest.coinCost,
        usageRequest.description,
        usageRequest.reference
      );

      if (success) {
        // Get updated balance
        const updatedCoins = await CoinService.getUserCoins(usageRequest.userId);
        
        return {
          success: true,
          newBalance: updatedCoins?.balance || 0,
          transactionId: `usage_${Date.now()}`
        };
      } else {
        return {
          success: false,
          error: 'Failed to process coin transaction'
        };
      }
    } catch (error) {
      console.error('Error spending coins for content:', error);
      return {
        success: false,
        error: 'Transaction failed'
      };
    }
  }

  // Unlock episode with coins
  static async unlockEpisode(userId: string, episodeId: string, coinCost: number): Promise<CoinUsageResult> {
    const usageRequest: CoinUsageRequest = {
      userId,
      contentId: episodeId,
      contentType: 'episode',
      coinCost,
      description: `Unlocked episode ${episodeId}`,
      reference: `EPISODE_${episodeId}`
    };

    return await this.spendCoinsForContent(usageRequest);
  }

  // Unlock book with coins
  static async unlockBook(userId: string, bookId: string, coinCost: number): Promise<CoinUsageResult> {
    const usageRequest: CoinUsageRequest = {
      userId,
      contentId: bookId,
      contentType: 'book',
      coinCost,
      description: `Unlocked book ${bookId}`,
      reference: `BOOK_${bookId}`
    };

    return await this.spendCoinsForContent(usageRequest);
  }

  // Unlock series with coins
  static async unlockSeries(userId: string, seriesId: string, coinCost: number): Promise<CoinUsageResult> {
    const usageRequest: CoinUsageRequest = {
      userId,
      contentId: seriesId,
      contentType: 'series',
      coinCost,
      description: `Unlocked series ${seriesId}`,
      reference: `SERIES_${seriesId}`
    };

    return await this.spendCoinsForContent(usageRequest);
  }

  // Unlock premium feature with coins
  static async unlockPremiumFeature(userId: string, featureId: string, coinCost: number): Promise<CoinUsageResult> {
    const usageRequest: CoinUsageRequest = {
      userId,
      contentId: featureId,
      contentType: 'premium_feature',
      coinCost,
      description: `Unlocked premium feature ${featureId}`,
      reference: `FEATURE_${featureId}`
    };

    return await this.spendCoinsForContent(usageRequest);
  }

  // Get content unlock status
  static async getContentUnlockStatus(userId: string, contentId: string, contentType: string): Promise<boolean> {
    try {
      // For local storage users, check localStorage
      if (userId.startsWith('local-')) {
        const unlockedContent = JSON.parse(localStorage.getItem('unlocked_content') || '[]');
        return unlockedContent.some((item: any) => 
          item.userId === userId && 
          item.contentId === contentId && 
          item.contentType === contentType
        );
      }

      // For Supabase users, check database
      const { data, error } = await supabase
        .from('unlocked_content')
        .select('*')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking unlock status:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in getContentUnlockStatus:', error);
      return false;
    }
  }

  // Record content unlock
  static async recordContentUnlock(userId: string, contentId: string, contentType: string): Promise<boolean> {
    try {
      // For local storage users, store in localStorage
      if (userId.startsWith('local-')) {
        const unlockedContent = JSON.parse(localStorage.getItem('unlocked_content') || '[]');
        unlockedContent.push({
          userId,
          contentId,
          contentType,
          unlockedAt: new Date().toISOString()
        });
        localStorage.setItem('unlocked_content', JSON.stringify(unlockedContent));
        return true;
      }

      // For Supabase users, store in database
      const { error } = await supabase
        .from('unlocked_content')
        .insert([{
          user_id: userId,
          content_id: contentId,
          content_type: contentType,
          unlocked_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error recording content unlock:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in recordContentUnlock:', error);
      return false;
    }
  }

  // Get user's unlocked content
  static async getUserUnlockedContent(userId: string): Promise<any[]> {
    try {
      // For local storage users
      if (userId.startsWith('local-')) {
        const unlockedContent = JSON.parse(localStorage.getItem('unlocked_content') || '[]');
        return unlockedContent.filter((item: any) => item.userId === userId);
      }

      // For Supabase users
      const { data, error } = await supabase
        .from('unlocked_content')
        .select('*')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error fetching unlocked content:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserUnlockedContent:', error);
      return [];
    }
  }

  // Calculate coin cost for content
  static calculateCoinCost(contentType: string, contentValue: number): number {
    const baseCosts = {
      'episode': 50,
      'book': 200,
      'series': 500,
      'premium_feature': 100
    };

    const baseCost = baseCosts[contentType as keyof typeof baseCosts] || 100;
    
    // Adjust cost based on content value (e.g., premium episodes cost more)
    if (contentValue > 0) {
      return Math.round(baseCost * (1 + contentValue / 100));
    }
    
    return baseCost;
  }

  // Get coin recommendations for user
  static async getCoinRecommendations(userId: string): Promise<{
    currentBalance: number;
    recommendedPackages: string[];
    upcomingCosts: number;
  }> {
    try {
      const userCoins = await CoinService.getUserCoins(userId);
      const currentBalance = userCoins?.balance || 0;
      
      // Simple recommendation logic
      let recommendedPackages: string[] = [];
      if (currentBalance < 100) {
        recommendedPackages = ['starter', 'popular'];
      } else if (currentBalance < 500) {
        recommendedPackages = ['popular', 'best_value'];
      } else {
        recommendedPackages = ['best_value', 'premium'];
      }

      // Estimate upcoming costs (simplified)
      const upcomingCosts = 200; // Assume user might want to unlock 4 episodes

      return {
        currentBalance,
        recommendedPackages,
        upcomingCosts
      };
    } catch (error) {
      console.error('Error getting coin recommendations:', error);
      return {
        currentBalance: 0,
        recommendedPackages: ['starter'],
        upcomingCosts: 0
      };
    }
  }
}
