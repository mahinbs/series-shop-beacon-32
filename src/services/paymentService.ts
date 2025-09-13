import { supabase } from '@/integrations/supabase/client';

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'stripe' | 'bank_transfer';
  name: string;
  isEnabled: boolean;
}

export interface PaymentRequest {
  packageId: string;
  userId: string;
  amount: number;
  coins: number;
  paymentMethod: string;
  currency?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  paymentUrl?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
}

export class PaymentService {
  // Get available payment methods
  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      // For now, return mock payment methods
      // In production, this would fetch from your payment configuration
      return [
        {
          id: 'stripe',
          type: 'stripe',
          name: 'Credit/Debit Card',
          isEnabled: true
        },
        {
          id: 'paypal',
          type: 'paypal',
          name: 'PayPal',
          isEnabled: true
        },
        {
          id: 'bank_transfer',
          type: 'bank_transfer',
          name: 'Bank Transfer',
          isEnabled: false // Disabled for demo
        }
      ];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }

  // Process coin purchase payment
  static async processCoinPurchase(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    try {
      // Simulate payment processing
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // For demo purposes, we'll simulate different payment methods
      switch (paymentRequest.paymentMethod) {
        case 'stripe':
          return await this.processStripePayment(paymentRequest, transactionId);
        case 'paypal':
          return await this.processPayPalPayment(paymentRequest, transactionId);
        case 'bank_transfer':
          return await this.processBankTransfer(paymentRequest, transactionId);
        default:
          return {
            success: false,
            error: 'Unsupported payment method',
            status: 'failed'
          };
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: 'Payment processing failed',
        status: 'failed'
      };
    }
  }

  // Process Stripe payment
  private static async processStripePayment(
    paymentRequest: PaymentRequest, 
    transactionId: string
  ): Promise<PaymentResult> {
    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo, we'll simulate a successful payment
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      if (success) {
        // Record the purchase in database
        await this.recordCoinPurchase({
          user_id: paymentRequest.userId,
          package_id: paymentRequest.packageId,
          coins: paymentRequest.coins,
          price: paymentRequest.amount,
          status: 'completed',
          payment_method: 'stripe',
          transaction_id: transactionId
        });

        return {
          success: true,
          transactionId,
          status: 'completed'
        };
      } else {
        return {
          success: false,
          error: 'Payment declined by bank',
          status: 'failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Stripe payment failed',
        status: 'failed'
      };
    }
  }

  // Process PayPal payment
  private static async processPayPalPayment(
    paymentRequest: PaymentRequest, 
    transactionId: string
  ): Promise<PaymentResult> {
    try {
      // Simulate PayPal payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo, simulate PayPal redirect flow
      const success = Math.random() > 0.05; // 95% success rate for demo
      
      if (success) {
        // Record the purchase in database
        await this.recordCoinPurchase({
          user_id: paymentRequest.userId,
          package_id: paymentRequest.packageId,
          coins: paymentRequest.coins,
          price: paymentRequest.amount,
          status: 'completed',
          payment_method: 'paypal',
          transaction_id: transactionId
        });

        return {
          success: true,
          transactionId,
          status: 'completed'
        };
      } else {
        return {
          success: false,
          error: 'PayPal payment cancelled',
          status: 'cancelled'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'PayPal payment failed',
        status: 'failed'
      };
    }
  }

  // Process Bank Transfer payment
  private static async processBankTransfer(
    paymentRequest: PaymentRequest, 
    transactionId: string
  ): Promise<PaymentResult> {
    try {
      // Bank transfers are typically manual and take time
      await this.recordCoinPurchase({
        user_id: paymentRequest.userId,
        package_id: paymentRequest.packageId,
        coins: paymentRequest.coins,
        price: paymentRequest.amount,
        status: 'pending',
        payment_method: 'bank_transfer',
        transaction_id: transactionId
      });

      return {
        success: true,
        transactionId,
        status: 'pending'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Bank transfer setup failed',
        status: 'failed'
      };
    }
  }

  // Record coin purchase in database
  private static async recordCoinPurchase(purchase: {
    user_id: string;
    package_id: string;
    coins: number;
    price: number;
    status: string;
    payment_method: string;
    transaction_id: string;
  }): Promise<boolean> {
    try {
      // For local storage users, store in localStorage
      if (purchase.user_id.startsWith('local-')) {
        const purchases = JSON.parse(localStorage.getItem('coin_purchases') || '[]');
        purchases.push({
          id: `purchase_${Date.now()}`,
          ...purchase,
          timestamp: new Date().toISOString(),
          created_at: new Date().toISOString()
        });
        localStorage.setItem('coin_purchases', JSON.stringify(purchases));
        return true;
      }

      // For Supabase users, store in database
      const { error } = await supabase
        .from('coin_purchases')
        .insert([{
          ...purchase,
          timestamp: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error recording coin purchase:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in recordCoinPurchase:', error);
      return false;
    }
  }

  // Get payment history for a user
  static async getPaymentHistory(userId: string): Promise<any[]> {
    try {
      // For local storage users
      if (userId.startsWith('local-')) {
        const purchases = JSON.parse(localStorage.getItem('coin_purchases') || '[]');
        return purchases.filter((p: any) => p.user_id === userId);
      }

      // For Supabase users
      const { data, error } = await supabase
        .from('coin_purchases')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching payment history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPaymentHistory:', error);
      return [];
    }
  }

  // Refund a payment
  static async refundPayment(transactionId: string, userId: string): Promise<boolean> {
    try {
      // For local storage users
      if (userId.startsWith('local-')) {
        const purchases = JSON.parse(localStorage.getItem('coin_purchases') || '[]');
        const purchaseIndex = purchases.findIndex((p: any) => p.transaction_id === transactionId);
        
        if (purchaseIndex !== -1) {
          purchases[purchaseIndex].status = 'refunded';
          purchases[purchaseIndex].refunded_at = new Date().toISOString();
          localStorage.setItem('coin_purchases', JSON.stringify(purchases));
          return true;
        }
        return false;
      }

      // For Supabase users
      const { error } = await supabase
        .from('coin_purchases')
        .update({ 
          status: 'refunded',
          refunded_at: new Date().toISOString()
        })
        .eq('transaction_id', transactionId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error refunding payment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in refundPayment:', error);
      return false;
    }
  }

  // Validate payment method
  static validatePaymentMethod(method: string): boolean {
    const validMethods = ['stripe', 'paypal', 'bank_transfer'];
    return validMethods.includes(method);
  }

  // Get payment status
  static async getPaymentStatus(transactionId: string): Promise<string> {
    try {
      // For demo purposes, return a random status
      const statuses = ['completed', 'pending', 'failed'];
      return statuses[Math.floor(Math.random() * statuses.length)];
    } catch (error) {
      console.error('Error getting payment status:', error);
      return 'unknown';
    }
  }
}
