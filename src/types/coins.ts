export interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  price: number;
  bonus?: number;
  popular?: boolean;
  bestValue?: boolean;
}

export interface UserCoins {
  id: string;
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
  last_updated: string;
}

export interface CoinTransaction {
  id: string;
  user_id: string;
  type: 'purchase' | 'spend' | 'earn' | 'refund';
  amount: number;
  balance: number;
  description: string;
  reference?: string;
  timestamp: string;
}

export interface CoinPurchase {
  id: string;
  user_id: string;
  package_id: string;
  coins: number;
  price: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  transaction_id?: string;
  timestamp: string;
}

export const COIN_PACKAGES: CoinPackage[] = [
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
];
